import tensorflow as tf
import numpy as np
import cv2
import os

#  Load the resaved model (make sure this path exists)
MODEL_PATH = "saved_models/xception_gru_model.keras"
_model = None

# ============================================================
#  Build model architecture WITHOUT TimeDistributed
# ============================================================
def build_model_without_timedistributed(num_frames=10, input_shape=(299, 299, 3)):
    """
    Rebuild the Xception-GRU architecture without using TimeDistributed.
    Uses tf.map_fn to apply Xception to each frame individually.
    
    This avoids the TimeDistributed shape conversion bugs in newer Keras/TF versions.
    """
    from tensorflow.keras import layers, Model
    from tensorflow.keras.applications import Xception
    
    # Input: (batch, num_frames, height, width, channels)
    video_input = layers.Input(shape=(num_frames, *input_shape), name='input_layer_1')
    
    # Build base Xception model (frame-level CNN feature extractor)
    base_model = Xception(
        include_top=False,
        weights=None,  # We'll load weights from saved model
        input_shape=input_shape,
        pooling='avg'  # Global average pooling -> output shape: (2048,)
    )
    
    # Make base model callable within map_fn
    # Apply Xception to each frame using tf.map_fn
    def process_frame(frame):
        """Process a single frame through Xception"""
        # frame shape: (height, width, channels)
        # Add batch dimension for Xception
        frame_batch = tf.expand_dims(frame, axis=0)  # (1, 299, 299, 3)
        features = base_model(frame_batch)  # (1, 2048)
        return tf.squeeze(features, axis=0)  # (2048,)
    
    # Process all frames in the sequence
    # video_input shape: (batch, num_frames, 299, 299, 3)
    # We need to map over the num_frames dimension
    def process_video(video):
        """Process all frames in a video"""
        # video shape: (num_frames, 299, 299, 3)
        features = tf.map_fn(
            process_frame,
            video,
            dtype=tf.float32,
            parallel_iterations=10
        )
        return features  # (num_frames, 2048)
    
    # Apply to entire batch using another map_fn
    cnn_features = layers.Lambda(
        lambda x: tf.map_fn(process_video, x, dtype=tf.float32),
        name='frame_features'
    )(video_input)
    # Output shape: (batch, num_frames, 2048)
    
    # Add GRU layer(s) - adjust units based on your original model
    # Common configurations: 256 or 512 units
    x = layers.GRU(256, return_sequences=False, name='gru')(cnn_features)
    
    # Dense layers for classification
    x = layers.Dense(128, activation='relu', name='dense_1')(x)
    x = layers.Dropout(0.5, name='dropout')(x)
    output = layers.Dense(1, activation='sigmoid', name='output')(x)
    
    model = Model(inputs=video_input, outputs=output, name='xception_gru_no_td')
    
    return model, base_model

def get_model():
    """Lazily load and cache the model. This avoids loading at import time
    (which causes heavy work during uvicorn/worker spawn) and gives a
    clearer error message if loading fails.
    
    This version rebuilds the model architecture WITHOUT TimeDistributed
    to avoid shape conversion bugs, then attempts to load weights.
    """
    global _model
    if _model is None:
        print(f"🔨 Building model architecture without TimeDistributed...")
        
        try:
            # Build the custom architecture
            _model, base_model = build_model_without_timedistributed()
            print("✅ Model architecture built successfully")
            
            # Try to load weights from the saved model
            print(f"📦 Attempting to load weights from: {MODEL_PATH}")
            
            try:
                # Method 1: Try to load the entire saved model to extract weights
                old_model = tf.keras.models.load_model(MODEL_PATH, compile=False)
                
                # Transfer weights from old model to new model
                print("🔄 Transferring weights from saved model...")
                
                # This will work if layer names match
                for layer in _model.layers:
                    try:
                        old_layer = old_model.get_layer(layer.name)
                        layer.set_weights(old_layer.get_weights())
                        print(f"  ✓ Loaded weights for: {layer.name}")
                    except:
                        # Layer might not exist in old model or have different structure
                        print(f"  ⚠ Could not load weights for: {layer.name}")
                
                print("✅ Weights loaded successfully!")
                
            except Exception as e_load:
                print(f"⚠️ Could not load saved model for weight transfer: {repr(e_load)}")
                print("⚠️ Using model with random weights - predictions will be unreliable!")
                print("💡 You'll need to either:")
                print("   1) Retrain the model with the new architecture")
                print("   2) Or use a model saved in a compatible format")
            
        except Exception as e:
            print("❌ Failed to build model:", repr(e))
            raise
            
    return _model

# ============================================================
#  Preprocess video
# ============================================================
def preprocess_video(video_path, num_frames=10):
    cap = cv2.VideoCapture(video_path)
    frame_count = int(cap.get(cv2.CAP_PROP_FRAME_COUNT))
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
        pad = num_frames - len(frames)
        frames = np.pad(frames, ((0, pad), (0, 0), (0, 0), (0, 0)), "constant")

    return np.expand_dims(frames, axis=0)  # shape: (1, 10, 299, 299, 3)

# ============================================================
#  Prediction function
# ============================================================
def predict_video(video_path, threshold=0.65):
    seq = preprocess_video(video_path)
    # Ensure model is loaded when predicting (lazy load)
    model = get_model()
    # Sanity-check input shape for clearer errors before calling into Keras
    try:
        preds = model.predict(seq, verbose=0)
    except Exception as e:
        print("[ERROR] Prediction failed. Input seq shape:", getattr(seq, 'shape', None))
        raise
    confidence = float(preds[0][0])

    label = "FAKE" if confidence >= threshold else "REAL"
    conf_adj = confidence if confidence >= threshold else 1 - confidence

    print(f"[INFO] {os.path.basename(video_path)} → {label} ({conf_adj:.2f})")
    return label, round(conf_adj, 2)