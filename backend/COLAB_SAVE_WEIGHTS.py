"""
ADD THIS TO YOUR COLAB NOTEBOOK AFTER TRAINING

This will save the model weights in a format compatible with the backend.
Run this in your Colab after training is complete.
"""

# After your model is trained, run this:
import numpy as np

# Save the full model (you probably already did this)
model.save('xception_gru_model.keras')

# ADDITIONALLY, save weights separately for each component
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
else:
    print("⚠️ Could not find TimeDistributed Xception layer")

# 2. Extract GRU weights
gru_layer = model.get_layer('gru')
gru_weights = gru_layer.get_weights()
np.savez_compressed('gru_weights.npz', *gru_weights)
print(f"✅ Saved GRU weights: {len(gru_weights)} arrays, shapes: {[w.shape for w in gru_weights]}")

# 3. Extract Dense layer weights
dense_layer = model.get_layer('dense')
dense_weights = dense_layer.get_weights()
np.savez_compressed('dense_weights.npz', *dense_weights)
print(f"✅ Saved Dense weights: {len(dense_weights)} arrays, shapes: {[w.shape for w in dense_weights]}")

print("\n✅ All weights saved! Download these 3 files:")
print("  - xception_weights.npz")
print("  - gru_weights.npz")
print("  - dense_weights.npz")
print("\nPlace them in backend/saved_models/ directory")

# Download the files in Colab
from google.colab import files
files.download('xception_weights.npz')
files.download('gru_weights.npz')
files.download('dense_weights.npz')
