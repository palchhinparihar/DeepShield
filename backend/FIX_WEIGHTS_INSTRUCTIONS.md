# FIXING THE MODEL WEIGHTS ISSUE

## Problem
The `.keras` model file cannot be loaded properly due to TimeDistributed layer incompatibility.
The backend is currently using **random weights**, which is why predictions are incorrect.

## Solution
Save the model weights separately in your Colab notebook and download them.

---

## Steps to Fix

### 1. In Your Colab Notebook

After training your model, add and run this code:

```python
import numpy as np

# Save weights separately for each component
print("Extracting and saving weights separately...")

# 1. Extract Xception weights from TimeDistributed layer
xception_layer = None
for layer in model.layers:
    if 'time_distributed' in layer.name.lower():
        xception_layer = layer.layer  # Get the wrapped Xception model
        break

if xception_layer:
    xception_weights = xception_layer.get_weights()
    np.savez_compressed('xception_weights.npz', *xception_weights)
    print(f"✅ Saved Xception weights: {len(xception_weights)} arrays")

# 2. Extract GRU weights
gru_layer = model.get_layer('gru')
gru_weights = gru_layer.get_weights()
np.savez_compressed('gru_weights.npz', *gru_weights)
print(f"✅ Saved GRU weights")

# 3. Extract Dense layer weights
dense_layer = model.get_layer('dense')
dense_weights = dense_layer.get_weights()
np.savez_compressed('dense_weights.npz', *dense_weights)
print(f"✅ Saved Dense weights")

# Download the files
from google.colab import files
files.download('xception_weights.npz')
files.download('gru_weights.npz')
files.download('dense_weights.npz')
```

### 2. Download the 3 Files

Your browser will download:
- `xception_weights.npz` (largest file, ~80MB)
- `gru_weights.npz` (small, ~2MB)
- `dense_weights.npz` (tiny, ~1KB)

### 3. Place Files in Backend

Move the downloaded files to:
```
backend/saved_models/xception_weights.npz
backend/saved_models/gru_weights.npz
backend/saved_models/dense_weights.npz
```

### 4. Restart Backend Server

Stop and restart your uvicorn server:
```powershell
# Stop: Press Ctrl+C in the terminal running uvicorn
# Start:
cd backend
uvicorn app:app --reload
```

### 5. Verify Weights Loaded

When the server starts, you should see:
```
📦 Creating Xception base model...
✅ Xception base model created
🔄 Loading custom Xception weights from saved_models/xception_weights.npz...
  ✅ Loaded 106 weight arrays from trained model!
📦 Building GRU classifier...
🔄 Loading GRU weights from saved_models/gru_weights.npz...
  ✅ Loaded GRU weights: 3 arrays
🔄 Loading Dense weights from saved_models/dense_weights.npz...
  ✅ Loaded Dense weights: 2 arrays
```

## Testing

After loading the weights:
1. Upload a fake video - should predict **FAKE**
2. Upload a real video - should predict **REAL**
3. Check the raw sigmoid output in terminal logs

---

## Current Status

✅ Backend code updated to load from .npz files
✅ Proper weight loading logic implemented
⚠️ Waiting for weight files from Colab
⚠️ Currently using random weights (predictions unreliable)

## Files

- `COLAB_SAVE_WEIGHTS.py` - Full script to run in Colab
- `model.py` - Updated to load from .npz files
- `extract_weights.py` - Local extraction script (won't work with current .keras file)
