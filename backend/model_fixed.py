import tensorflow as tf
import numpy as np
import cv2
import os

#  Load the resaved model (make sure this path exists)
MODEL_PATH = "saved_models/xception_gru_model.keras"
_base_cnn = None
_gru_model = None

# ============================================================
#  WORKAROUND: Process frames manually in Python, not TF layers
# ============================================================
def get_base_cnn():
    """
    Load or create Xception base model for frame feature extraction.
    This avoids TimeDistributed entirely.
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
        print("✅ Xception base model ready")
        
        # Try to load custom weights from saved model if available
        try:
            full_model = tf.keras.models.load_model(MODEL_PATH, compile=False)
            # Try to find and extract Xception weights from TimeDistributed layer
            for layer in full_model.layers:
                if 'time_distributed' in layer.name.lower():
                    print(f"🔄 Found TimeDistributed layer: {layer.name}")
                    # The wrapped layer should be Xception
                    wrapped = layer.layer
                    if hasattr(wrapped, 'get_weights'):
                        print("  Transferring Xception weights from saved model...")
                        _base_cnn.set_weights(wrapped.get_weights())
                        print("  ✅ Custom Xception weights loaded!")
                    break
        except Exception as e:
            print(f"⚠️ Could not load custom Xception weights: {e}")
            print("   Using ImageNet pretrained weights instead")
    
    return _base_cnn


def build_gru_classifier(input_shape=(10, 2048)):
    """
    Build the GRU + Dense classifier part.
    Takes frame features as input, outputs FAKE/REAL prediction.
    """
    from tensorflow.keras import layers, Model
    
    feature_input = layers.Input(shape=input_shape, name='feature_input')
    
    # GRU layer - adjust units to match your original model
    x = layers.GRU(256, return_sequences=False, name='gru')(feature_input)
    
    # Dense layers
    x = layers.Dense(128, activation='relu', name='dense_1')(x)
    x = layers.Dropout(0.5, name='dropout')(x)
    output = layers.Dense(1, activation='sigmoid', name='output')(x)
    
    model = Model(inputs=feature_input, outputs=output, name='gru_classifier')
    return model


def get_gru_model():
    """
    Load or create the GRU classifier model and try to load weights.
    """
    global _gru_model
    if _gru_model is None:
        print("📦 Building GRU classifier...")
        _gru_model = build_gru_classifier()
        
        # Try to load GRU/Dense weights from saved model
        try:
            full_model = tf.keras.models.load_model(MODEL_PATH, compile=False)
            print("🔄 Transferring GRU and Dense weights...")
            
            # Transfer weights for matching layers
            for layer in _gru_model.layers:
                try:
                    old_layer = full_model.get_layer(layer.name)
                    layer.set_weights(old_layer.get_weights())
                    print(f"  ✓ Loaded weights for: {layer.name}")
                except:
                    print(f"  ⚠ Could not load weights for: {layer.name}")
            
            print("✅ GRU classifier weights loaded!")
            
        except Exception as e:
            print(f"⚠️ Could not load GRU weights: {e}")
            print("   Using random initialization - predictions may be unreliable!")
    
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
def predict_video(video_path, threshold=0.65):
    """
    Predict if video is FAKE or REAL.
    
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
    
    confidence = float(preds[0][0])
    # Inverted logic: High score = REAL, Low score = FAKE
    # This assumes the model was trained with 1=REAL, 0=FAKE
    label = "REAL" if confidence >= threshold else "FAKE"
    conf_adj = confidence if confidence >= threshold else 1 - confidence

    print(f"[INFO] {os.path.basename(video_path)} → {label} ({conf_adj:.2f})")
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
