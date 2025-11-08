from fastapi import FastAPI, File, UploadFile
from fastapi.middleware.cors import CORSMiddleware
from model import predict_video
import shutil
import uuid
import os

# ============================================================
#  FastAPI Setup
# ============================================================
app = FastAPI(
    title="DeepFake Detection API",
    description="Upload a video (.mp4) to detect whether it is REAL or FAKE using the Xception-GRU model.",
    version="1.0"
)

# Enable CORS for frontend connection
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allow all origins (or restrict to your frontend URL)
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ============================================================
#  Prediction Endpoint
# ============================================================
@app.post("/predict")
async def predict(file: UploadFile = File(...)):
    # Ensure uploads directory exists
    os.makedirs("uploads", exist_ok=True)

    # Generate a unique filename to avoid collisions
    filename = f"uploads/temp_{uuid.uuid4()}.mp4"
    
    # Save the uploaded file temporarily
    with open(filename, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)

    try:
        # Run model inference
        label, confidence = predict_video(filename)

        # Clean up temporary file
        os.remove(filename)

        print(f"[INFO] Prediction complete: {file.filename} → {label} ({confidence})")
        return {"label": label, "confidence": confidence}

    except Exception as e:
        print(f"[ERROR] {e}")
        return {"error": str(e)}

# ============================================================
#  Root route
# ============================================================
@app.get("/")
def home():
    return {"message": "DeepFake Detection API is running 🚀", "status": "OK"}

# ============================================================
#  Run this app using:
# uvicorn app:app --reload
# ============================================================