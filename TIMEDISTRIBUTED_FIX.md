# TimeDistributed Fix - DeepShield Backend

## 🔧 Problem
The `TimeDistributed` layer in your saved Keras model was causing errors:
```
ValueError: Cannot convert '10' to a shape
```

This happens because of version incompatibilities between the Keras version used to train the model and the version used for inference.

## ✅ Solution Implemented

### What Changed
I replaced the model loading approach in `backend/model.py` with a **manual frame processing workaround** that completely avoids `TimeDistributed`:

### Old Approach (BROKEN)
```python
# Direct model load - fails due to TimeDistributed
model = tf.keras.models.load_model("xception_gru_model.keras")
preds = model.predict(video_frames)  # ❌ Crashes here
```

### New Approach (FIXED)
```python
# 1. Load Xception separately (for frame feature extraction)
base_cnn = get_base_cnn()  # Xception with GlobalAveragePooling

# 2. Process each frame manually in Python (not TensorFlow layers)
for frame in frames:
    features = base_cnn.predict(frame)  # Extract features per frame

# 3. Feed extracted features to GRU classifier
gru_model = get_gru_model()  # GRU(128) + Dropout + Dense(1)
prediction = gru_model.predict(features)
```

### Architecture Match (from your Colab)
Your model in Colab:
```python
model.add(TimeDistributed(Xception, input_shape=(10, 299, 299, 3)))
model.add(TimeDistributed(GlobalAveragePooling2D()))
model.add(GRU(128, return_sequences=False))
model.add(Dropout(0.5))
model.add(Dense(1, activation='sigmoid'))
```

Fixed backend replicates this as:
1. **Frame Extraction** → `preprocess_video()` extracts 10 frames
2. **Xception per Frame** → `extract_frame_features()` applies Xception to each of the 10 frames
3. **GRU Classifier** → `build_gru_classifier()` with **GRU(128)** + Dropout(0.5) + Dense(1, sigmoid)

## 🚀 How to Test

### Option 1: Quick Test (if your uvicorn server is running)
Your server should now work! Just upload a video through the frontend.

### Option 2: Test from Terminal
```powershell
# Navigate to backend directory
cd backend

# Test the model loader
python -c "from model import predict_video; import os; videos = os.listdir('uploads'); print(predict_video(f'uploads/{videos[0]}') if videos else 'No videos found')"
```

### Option 3: Test with a Sample Video
```powershell
# Make sure you have a test video in backend/uploads/
# Then run:
cd backend
python -c "from model import predict_video; result = predict_video('uploads/test_video.mp4'); print(f'Result: {result}')"
```

## 📝 What the Code Does Now

### 1. `get_base_cnn()`
- Creates or loads Xception model with GlobalAveragePooling
- Tries to load custom weights from your saved model
- Falls back to ImageNet weights if custom weights fail

### 2. `build_gru_classifier()` 
- Builds GRU(128) + Dropout + Dense classifier
- **CRITICAL**: Uses 128 units (not 256) to match your Colab model

### 3. `get_gru_model()`
- Builds the GRU classifier
- Tries to load GRU/Dropout/Dense weights from saved model

### 4. `extract_frame_features()`
- Processes frames one-by-one through Xception
- Returns shape (10, 2048) features

### 5. `predict_video()`
- Extracts 10 frames from video
- Gets features for each frame (using Xception)
- Feeds features to GRU classifier
- Returns FAKE/REAL label + confidence

## ⚠️ Important Notes

1. **Weight Loading**: The code tries to load your trained weights from the saved model. If this fails (due to TimeDistributed), it will use ImageNet weights for Xception and random weights for GRU. In that case, predictions will be unreliable.

2. **To Get Best Results**: You have 3 options:
   - **Option A** (Easiest): Re-save your model in Colab using the same TensorFlow/Keras versions as your backend
   - **Option B**: Save only the weights (`model.save_weights()`) and load them separately
   - **Option C**: Rebuild and retrain with the new architecture (no TimeDistributed)

3. **Current Status**: The model should load without errors now. Check the console output when the server starts to see if weights loaded successfully.

## 🐛 Troubleshooting

### If you see "Using ImageNet pretrained weights instead"
This means the custom Xception weights couldn't be loaded. The model will still work but with lower accuracy.

**Fix**: Re-save your model in Colab matching your backend's TensorFlow version.

### If predictions seem random/wrong
This means GRU weights couldn't be loaded (they're random).

**Fix**: Use one of the options in "Important Notes" above.

### If you get import errors
Make sure TensorFlow is installed:
```powershell
pip install tensorflow keras opencv-python-headless numpy
```

## 📊 Expected Console Output (Success)

When your server starts, you should see:
```
📦 Creating Xception base model...
✅ Xception base model ready
🔄 Found TimeDistributed layer: time_distributed
  Transferring Xception weights from saved model...
  ✅ Custom Xception weights loaded!
📦 Building GRU classifier...
🔄 Transferring GRU and Dense weights...
  ✓ Loaded weights for: gru
  ✓ Loaded weights for: dropout
  ✓ Loaded weights for: dense
✅ GRU classifier weights loaded!
```

## 📁 Files Changed
- `backend/model.py` - Complete rewrite with TimeDistributed workaround
- `backend/model_backup.py` - Your original file (backup)
- `backend/model_fixed.py` - The new implementation (same as model.py now)

---

**Bottom Line**: Your model will now load and run without TimeDistributed errors. Weight loading success depends on Keras version compatibility.
