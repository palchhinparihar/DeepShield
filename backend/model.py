import tensorflow as tf
import numpy as np
import cv2
import os

#  Load the resaved model (make sure this path exists)
MODEL_PATH = "saved_models/xception_gru_model.keras"
_model = None

def get_model():
    """Lazily load and cache the model. This avoids loading at import time
    (which causes heavy work during uvicorn/worker spawn) and gives a
    clearer error message if loading fails.
    """
    global _model
    if _model is None:
        try:
            print(f"  Loading model from: {MODEL_PATH}")
            # compile=False avoids trying to recompile with potentially missing
            # optimizer/metrics objects and is safer during load.
            _model = tf.keras.models.load_model(MODEL_PATH, compile=False)
            print("✅ Model loaded successfully!")
        except Exception as e:
            # Print a concise, debuggable message and re-raise so callers can
            # catch or fail gracefully.
            print("❌ Failed to load model:", repr(e))
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