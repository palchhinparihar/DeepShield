import tensorflow as tf
import numpy as np
import cv2
import os

#  Load weights from .npz files (generated from Colab)
XCEPTION_WEIGHTS_PATH = "saved_models/xception_weights.npz"
GRU_WEIGHTS_PATH = "saved_models/gru_weights.npz"
DENSE_WEIGHTS_PATH = "saved_models/dense_weights.npz"

_base_cnn = None
_gru_model = None

# ============================================================
#  Load Xception CNN for feature extraction
# ============================================================
def get_base_cnn():
    """
    Load or create Xception base model for frame feature extraction.
    Loads custom trained weights from .npz file if available.
    """
    global _base_cnn
    if _base_cnn is None:
        from tensorflow.keras.applications import Xception
        
        print("📦 Creating Xception base model...")
        _base_cnn = Xception(
            include_top=False,
            weights='imagenet',  # Use pretrained weights as fallback
            input_shape=(299, 299, 3),
            pooling='avg'
        )
        print("✅ Xception base model created")
        
        # Try to load custom trained weights from .npz file
        if os.path.exists(XCEPTION_WEIGHTS_PATH):
            try:
                print(f"🔄 Loading custom Xception weights from {XCEPTION_WEIGHTS_PATH}...")
                weights_data = np.load(XCEPTION_WEIGHTS_PATH)
                weights = [weights_data[f'arr_{i}'] for i in range(len(weights_data.files))]
                _base_cnn.set_weights(weights)
                print(f"  ✅ Loaded {len(weights)} weight arrays from trained model!")
            except Exception as e:
                print(f"⚠️ Could not load custom Xception weights: {e}")
                print("   Using ImageNet pretrained weights instead")
        else:
            print(f"⚠️ Custom weights file not found: {XCEPTION_WEIGHTS_PATH}")
            print("   Using ImageNet pretrained weights instead")
            print("   Run COLAB_SAVE_WEIGHTS.py in your Colab to generate weight files")
    
    return _base_cnn


def build_gru_classifier(input_shape=(10, 2048)):
    """
    Build the GRU + Dropout + Dense classifier part.
    This matches the Colab architecture exactly:
    - GRU(128, return_sequences=False)
    - Dropout(0.5)
    - Dense(1, activation='sigmoid')
    
    Takes frame features as input, outputs FAKE/REAL prediction.
    """
    from tensorflow.keras import layers, Model
    
    feature_input = layers.Input(shape=input_shape, name='feature_input')
    
    # GRU layer - MUST be 128 units to match your trained model!
    x = layers.GRU(128, return_sequences=False, name='gru')(feature_input)
    
    # Dropout and output - match the Colab architecture exactly
    x = layers.Dropout(0.5, name='dropout')(x)
    output = layers.Dense(1, activation='sigmoid', name='dense')(x)
    
    model = Model(inputs=feature_input, outputs=output, name='gru_classifier')
    return model


def get_gru_model():
    """
    Load or create the GRU classifier model and load trained weights from .npz files.
    """
    global _gru_model
    if _gru_model is None:
        print("📦 Building GRU classifier...")
        _gru_model = build_gru_classifier()
        
        # Load GRU weights from .npz file
        if os.path.exists(GRU_WEIGHTS_PATH):
            try:
                print(f"🔄 Loading GRU weights from {GRU_WEIGHTS_PATH}...")
                weights_data = np.load(GRU_WEIGHTS_PATH)
                gru_weights = [weights_data[f'arr_{i}'] for i in range(len(weights_data.files))]
                gru_layer = _gru_model.get_layer('gru')
                gru_layer.set_weights(gru_weights)
                print(f"  ✅ Loaded GRU weights: {len(gru_weights)} arrays")
            except Exception as e:
                print(f"  ⚠️ Could not load GRU weights: {e}")
        else:
            print(f"⚠️ GRU weights file not found: {GRU_WEIGHTS_PATH}")
            print("   Run COLAB_SAVE_WEIGHTS.py in your Colab to generate weight files")
        
        # Load Dense layer weights from .npz file
        if os.path.exists(DENSE_WEIGHTS_PATH):
            try:
                print(f"🔄 Loading Dense weights from {DENSE_WEIGHTS_PATH}...")
                weights_data = np.load(DENSE_WEIGHTS_PATH)
                dense_weights = [weights_data[f'arr_{i}'] for i in range(len(weights_data.files))]
                dense_layer = _gru_model.get_layer('dense')
                dense_layer.set_weights(dense_weights)
                print(f"  ✅ Loaded Dense weights: {len(dense_weights)} arrays")
            except Exception as e:
                print(f"  ⚠️ Could not load Dense weights: {e}")
        else:
            print(f"⚠️ Dense weights file not found: {DENSE_WEIGHTS_PATH}")
            print("   Run COLAB_SAVE_WEIGHTS.py in your Colab to generate weight files")
        
        # Check if weights were loaded successfully
        if not os.path.exists(GRU_WEIGHTS_PATH) or not os.path.exists(DENSE_WEIGHTS_PATH):
            print("\n" + "="*60)
            print("⚠️ WARNING: Using random initialization - predictions unreliable!")
            print("="*60)
            print("To fix: Run COLAB_SAVE_WEIGHTS.py in your Colab notebook")
            print("Then download and place the .npz files in saved_models/")
            print("="*60 + "\n")
    
    return _gru_model


# ============================================================
#  Preprocess video
# ============================================================
def preprocess_video(video_path, num_frames=10):
    """Extract and preprocess frames from video."""
    cap = cv2.VideoCapture(video_path)
    frame_count = int(cap.get(cv2.CAP_PROP_FRAME_COUNT))
    
    if frame_count == 0:
        raise ValueError(f"Could not read frames from {video_path}")
    
    frame_indices = np.linspace(0, frame_count - 1, num_frames).astype(int)
    frames = []

    for idx in frame_indices:
        cap.set(cv2.CAP_PROP_POS_FRAMES, idx)
        ret, frame = cap.read()
        if not ret:
            continue
        frame = cv2.cvtColor(frame, cv2.COLOR_BGR2RGB)
        frame = cv2.resize(frame, (299, 299))
        frame = frame / 255.0
        frames.append(frame)
    cap.release()

    frames = np.array(frames)
    if len(frames) < num_frames:
        # Pad with zeros if needed
        pad = num_frames - len(frames)
        frames = np.pad(frames, ((0, pad), (0, 0), (0, 0), (0, 0)), "constant")

    return frames  # shape: (10, 299, 299, 3)


def extract_frame_features(frames):
    """
    Extract features from frames using Xception CNN.
    This replaces TimeDistributed - we process frames in Python loop instead.
    
    Args:
        frames: numpy array of shape (num_frames, 299, 299, 3)
    
    Returns:
        features: numpy array of shape (num_frames, 2048)
    """
    base_cnn = get_base_cnn()
    
    # Process each frame through Xception
    features = []
    for frame in frames:
        # Add batch dimension: (299, 299, 3) -> (1, 299, 299, 3)
        frame_batch = np.expand_dims(frame, axis=0)
        # Extract features
        frame_features = base_cnn.predict(frame_batch, verbose=0)
        # Remove batch dimension: (1, 2048) -> (2048,)
        features.append(frame_features[0])
    
    # Stack into array: (num_frames, 2048)
    features = np.array(features)
    return features


# ============================================================
#  Prediction function
# ============================================================
def predict_video(video_path, threshold=0.55):
    """
    Predict if video is FAKE or REAL.
    
    Threshold of 0.55 matches Colab performance.
    Sigmoid output >= 0.55 = FAKE, < 0.55 = REAL
    
    This version bypasses TimeDistributed by:
    1. Extracting frames in Python (not TF)
    2. Processing each frame through Xception in Python loop
    3. Feeding extracted features to GRU model
    """
    print(f"[INFO] Processing video: {os.path.basename(video_path)}")
    
    # Step 1: Extract and preprocess frames
    frames = preprocess_video(video_path)
    print(f"  ✓ Extracted {len(frames)} frames")
    
    # Step 2: Extract features from each frame using Xception
    print("  🔄 Extracting frame features...")
    features = extract_frame_features(frames)
    print(f"  ✓ Features extracted, shape: {features.shape}")
    
    # Step 3: Feed features to GRU classifier
    print("  🔄 Running GRU classifier...")
    gru_model = get_gru_model()
    features_batch = np.expand_dims(features, axis=0)  # Add batch dim: (1, 10, 2048)
    preds = gru_model.predict(features_batch, verbose=0)
    
    raw_score = float(preds[0][0])
    print(f"  📊 Raw model output (sigmoid): {raw_score:.4f}")
    
    # Inverted logic: High score = REAL, Low score = FAKE
    # This assumes the model was trained with 1=REAL, 0=FAKE
    confidence = raw_score
    label = "REAL" if confidence >= threshold else "FAKE"
    conf_adj = confidence if confidence >= threshold else 1 - confidence

    print(f"[INFO] {os.path.basename(video_path)} → {label} ({conf_adj:.2f}) [threshold={threshold}]")
    return label, round(conf_adj, 2)


# For backward compatibility - keep the same function name
def get_model():
    """
    Compatibility function. 
    The new approach doesn't use a single model - it uses separate components.
    """
    print("⚠️ This version uses separate CNN and GRU models, not a single model")
    get_base_cnn()
    get_gru_model()
    return None
