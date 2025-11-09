# DeepShield — Backend

Concise, hackathon-ready instructions to run the backend API that serves the Xception-GRU deepfake detector.

## What this service does

- Hosts a FastAPI server with a single prediction endpoint: `POST /predict`.
- Accepts a video upload and returns a JSON response: `{ label: "REAL"|"FAKE", confidence: float }`.

## Requirements

- Python 3.8+ (recommended)
- System/virtualenv dependencies listed in `requirements.txt` (FastAPI, uvicorn, TensorFlow, OpenCV, etc.)

The project `requirements.txt` includes:

```
fastapi
uvicorn[standard]
tensorflow
keras
opencv-python-headless
python-multipart
numpy
```

On Windows, installing TensorFlow via pip can require a compatible Python version and matching CPU/GPU drivers. If you run into issues, consider using a Conda env or the official TF install docs.

## Database (new)

This project now includes an optional MongoDB persistence layer under `backend/database/` using `motor` (async MongoDB client).

- Add a file `backend/database/.env` with the following variables:

```
MONGO_URL=mongodb://localhost:27017
DB_NAME=deepfake_db
```

- `backend/database/config.py` will read `MONGO_URL` and `DB_NAME` from that `.env`. If `MONGO_URL` is missing the app will raise an error on startup — add the env file before running the server.

- The repository also includes a Pydantic schema for predictions: `backend/database/schemas.py` (`Prediction` model contains `filename`, `label`, `confidence`, `timestamp`). If you prefer not to persist predictions, either leave `MONGO_URL` unset or update `config.py`/the code paths that write to the DB.

The `requirements.txt` now also includes the DB dependencies:

```
motor==3.7.1
pymongo==4.15.3
python-dotenv==1.0.1
```

## Quick start (Windows PowerShell)

1. Create and activate a virtual environment:

```powershell
python -m venv .venv; .\.venv\Scripts\Activate.ps1
```

2. Install dependencies:

```powershell
pip install --upgrade pip; pip install -r requirements.txt
```

3. Place trained model files in `saved_models/` (see next section).
3a. (If using DB) create `backend/database/.env` as shown above before starting the server.
4. Run the API server (development mode):

```powershell
uvicorn app:app --reload --host 0.0.0.0 --port 8000
```

The API will be available at http://127.0.0.1:8000/. Open http://127.0.0.1:8000/docs for the interactive Swagger UI.

## Required model weight files

For reliable predictions you must add the trained weights to `backend/saved_models/` (the code will fall back to ImageNet weights or random init if missing — this leads to unreliable outputs).

- `saved_models/xception_weights.npz` (optional — if missing, Xception falls back to ImageNet)
- `saved_models/gru_weights.npz` (required for trained GRU weights)
- `saved_models/dense_weights.npz` (required for trained classifier weights)

If you have a Colab notebook or a exported artifact, place these `.npz` files inside `backend/saved_models/`. The repository includes `COLAB_SAVE_WEIGHTS.py` as a reference to how weights were saved from training.

## API: /predict

POST /predict

- Content type: multipart/form-data
- Form fields:
	- `file` (required): the uploaded video file (e.g., `.mp4`). The backend verifies the uploaded content-type starts with `video/`.
	- `duration` (optional): float; if provided and > 30 seconds the server will reject the request.

Response example (200):

```json
{
	"label": "REAL",
	"confidence": 0.72
}
```

Example curl (multipart upload):

```powershell
curl -X POST "http://127.0.0.1:8000/predict" -F "file=@C:\path\to\video.mp4"
```

Example JS fetch (browser):

```javascript
const fd = new FormData();
fd.append('file', fileInput.files[0]);
const res = await fetch(`${API_URL}/predict`, { method: 'POST', body: fd });
const json = await res.json();
console.log(json); // { label, confidence }
```

## Troubleshooting

- "Using random initialization - predictions unreliable!" — means the trained GRU/Dense weights were not found in `saved_models/`. Add the `.npz` files from training and restart the server.
- Editor/linter messages like "Import 'tensorflow' could not be resolved" are common if your local editor environment doesn't have packages installed — they are static diagnostics and don't necessarily mean runtime failures. Ensure your venv is activated and packages installed.
- TensorFlow install issues on Windows: consider using Conda or follow the TensorFlow Windows install guide. For a lightweight environment, `opencv-python-headless` is used to avoid GUI deps.