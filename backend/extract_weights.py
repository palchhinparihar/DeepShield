"""
Extract weights from the TimeDistributed model and save them separately.
Run this script ONCE to extract the weights, then the main app can use them.
"""
import tensorflow as tf
import numpy as np
import os

MODEL_PATH = "saved_models/xception_gru_model.keras"

print("=" * 60)
print("WEIGHT EXTRACTION SCRIPT")
print("=" * 60)

# Load the full model
print("\n[1] Loading original model...")
try:
    model = tf.keras.models.load_model(MODEL_PATH, compile=False)
    print("✅ Model loaded successfully")
    print(f"   Model type: {type(model)}")
except Exception as e:
    print(f"❌ Failed to load model: {e}")
    exit(1)

# Print model summary
print("\n[2] Model architecture:")
model.summary()

print("\n[3] Extracting weights...")
print("\nAvailable layers:")
for i, layer in enumerate(model.layers):
    print(f"  [{i}] {layer.name} ({layer.__class__.__name__})")
    if hasattr(layer, 'layer'):
        print(f"      └─ Wraps: {layer.layer.name} ({layer.layer.__class__.__name__})")

# Extract Xception weights (inside TimeDistributed)
xception_weights = None
for layer in model.layers:
    if 'time_distributed' in layer.name.lower() or layer.__class__.__name__ == 'TimeDistributed':
        print(f"\n✓ Found TimeDistributed wrapper: {layer.name}")
        wrapped_layer = layer.layer
        if hasattr(wrapped_layer, 'get_weights'):
            xception_weights = wrapped_layer.get_weights()
            print(f"  ✅ Extracted {len(xception_weights)} weight arrays from Xception")
            print(f"     Total parameters: {sum(w.size for w in xception_weights):,}")
        break

# Extract GRU weights
gru_weights = None
dense_weights = None
dropout_found = False

for layer in model.layers:
    if 'gru' in layer.name.lower() and layer.__class__.__name__ == 'GRU':
        gru_weights = layer.get_weights()
        print(f"\n✓ Found GRU layer: {layer.name}")
        print(f"  ✅ Extracted {len(gru_weights)} weight arrays")
        print(f"     Shapes: {[w.shape for w in gru_weights]}")
    
    if 'dense' in layer.name.lower() and layer.__class__.__name__ == 'Dense':
        dense_weights = layer.get_weights()
        print(f"\n✓ Found Dense layer: {layer.name}")
        print(f"  ✅ Extracted {len(dense_weights)} weight arrays")
        print(f"     Shapes: {[w.shape for w in dense_weights]}")
    
    if 'dropout' in layer.name.lower():
        dropout_found = True
        print(f"\n✓ Found Dropout layer: {layer.name} (no weights to extract)")

# Save weights
print("\n[4] Saving extracted weights...")
os.makedirs('saved_models', exist_ok=True)

if xception_weights:
    np.savez_compressed('saved_models/xception_weights.npz', *xception_weights)
    print("  ✅ Saved: saved_models/xception_weights.npz")
    print(f"     Size: {os.path.getsize('saved_models/xception_weights.npz') / 1024 / 1024:.2f} MB")
else:
    print("  ⚠️ No Xception weights found")

if gru_weights:
    np.savez_compressed('saved_models/gru_weights.npz', *gru_weights)
    print("  ✅ Saved: saved_models/gru_weights.npz")
    print(f"     Size: {os.path.getsize('saved_models/gru_weights.npz') / 1024:.2f} KB")
else:
    print("  ⚠️ No GRU weights found")

if dense_weights:
    np.savez_compressed('saved_models/dense_weights.npz', *dense_weights)
    print("  ✅ Saved: saved_models/dense_weights.npz")
    print(f"     Size: {os.path.getsize('saved_models/dense_weights.npz') / 1024:.2f} KB")
else:
    print("  ⚠️ No Dense weights found")

print("\n" + "=" * 60)
print("EXTRACTION COMPLETE!")
print("=" * 60)
print("\nExtracted files:")
print("  - saved_models/xception_weights.npz")
print("  - saved_models/gru_weights.npz")
print("  - saved_models/dense_weights.npz")
print("\nNext: Update model.py to load these .npz files")