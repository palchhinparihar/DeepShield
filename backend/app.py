from fastapi import FastAPI, File, UploadFile, HTTPException, Form
from fastapi.middleware.cors import CORSMiddleware
from model import predict_video
import shutil
import uuid
import os
from database.config import db
from database.schemas import Prediction

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
async def predict(
    file: UploadFile = File(...), 
    duration: float = Form(None),
    user_email: str = Form(None),
    user_name: str = Form(None),
    user_profile: str = Form(None)
):
    # Accept any video/* content-type. Some clients may send variations like
    # 'video/mp4; codecs="avc1.42E01E"' or similar, so use startswith.
    print(file)
    if not file or not (file.content_type and file.content_type.startswith("video/")):
        raise HTTPException(status_code=400, detail="Invalid file type. Please upload a video file (e.g. .mp4).")

    if duration is not None and duration > 30:
        raise HTTPException(status_code=400, detail="Video duration exceeds 30 seconds limit.")
    
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
        
        # Save to MongoDB
        prediction = Prediction(
            filename=file.filename,
            label=label,
            confidence=float(confidence),
            duration=float(duration) if duration is not None else None,
            user_email=user_email,
            user_name=user_name,
            user_profile=user_profile
        )
        await db.predictions.insert_one(prediction.dict())
        
        # Log and return
        print(f"[INFO] Prediction complete: {file.filename} → {label} ({confidence})")
        return {"label": label, "confidence": confidence}

    except Exception as e:
        print(f"[ERROR] {e}")
        # Return a proper 500 to the client with a concise message
        raise HTTPException(status_code=500, detail=str(e))
    
    
# ============================================================
#  Get All Predictions
# ============================================================
@app.get("/predictions")
async def get_predictions():
    results = []
    async for doc in db.predictions.find().sort("timestamp", -1):
        doc["_id"] = str(doc["_id"])  # Convert ObjectId to string
        results.append(doc)
    return results

    
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