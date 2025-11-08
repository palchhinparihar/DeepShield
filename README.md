# DeepShield

DeepShield is a small full-stack project that detects safety risks in user-uploaded video content using a backend ML model and a lightweight React frontend. This README is written for both hackathon judges and other devs who want to run, extend, or contribute to the project.

---

## Quick pitch

DeepShield helps platforms automatically flag potentially harmful or policy-violating video uploads before they go live. It pairs a Python ML backend (model inference + simple API) with a fast React frontend for uploading and reviewing predictions. The project is designed to be easy to run locally and extendable for new models and datasets.

Highlights:
- Fast prototype: ready-to-run backend and frontend.
- Clear extension points: add new models or preprocessing in `backend/`.
- Lightweight UI for demoing uploads and showing model results.

---

## Repo structure

- `backend/` — FastAPI app, model code and `requirements.txt`.
	- `app.py` — REST API server for inference.
	- `model.py` — model loading and inference utilities.
	- `saved_models/` — place trained model files here (already committed models if any).
- `frontend/` — React app (Vite) for demo UI.
	- `src/` — React source files and components.
	- `package.json` — frontend dependencies and scripts.
- `README.md` — this file (project overview, setup, how to demo).

---

## Quick start (dev machine)

Minimum prerequisites:
- Python 3.8+ (for backend)
- Node.js 16+ / npm or yarn (for frontend)

1) Backend

Open a terminal, go to the `backend/` folder and create a virtual environment (recommended):

```powershell
cd backend
python -m venv .venv; .\.venv\Scripts\Activate.ps1
pip install --upgrade pip
pip install -r requirements.txt
```

Run the FastAPI app with Uvicorn (development mode):

```powershell
# while in backend/ and virtualenv activated
# assuming your FastAPI instance is named `app` in `app.py`
uvicorn app:app --reload --host 0.0.0.0 --port 8000
```

The backend will start and listen on the port configured above (commonly 8000). Check console logs for the exact URL.

2) Frontend

Open a second terminal and run the frontend:

```powershell
cd frontend
npm install
npm run dev
```

Vite will host a development server (commonly at `http://localhost:5173`). The frontend communicates with the backend API to upload videos and show predictions.

3) Demo flow

- Use the frontend UI to upload a short video (or sample file). The app sends the file to the backend, which runs the model and returns a prediction. The UI displays the resulting labels/scores.

---

## Backend API (overview)

The backend is intentionally small and centered around a few endpoints. Check `backend/app.py` for full details (the FastAPI app and route definitions).

Typical endpoints:
- `POST /predict` — Accepts multipart/form-data with a video file; returns model predictions (JSON).
- `GET /health` — Health check that returns 200 if server and model are loaded.

Example request/response (JSON):

Request (multipart): `file` = video file

Response:
```json
{
	"success": true,
	"predictions": [
		{"label": "safe", "score": 0.86},
		{"label": "unsafe", "score": 0.14}
	]
}
```

Note: Exact input keys and response shapes are implemented in `backend/app.py` and `backend/model.py` — adapt both when adding new features.

---

## Model and saved artifacts

- Put any model files in `backend/saved_models/` and ensure `model.py` loads them by path.
- `model.py` contains the lightweight wrapper for loading the model and running inference. If you train a new model, make sure to:
	- Save compatible weights to `saved_models/`.
	- Update any preprocessing code in `model.py`.

If you want to retrain, we recommend adding a new script (e.g., `train.py`) and documenting training data format.

---

## Development notes & extension points

- Add new endpoints in `backend/app.py` (FastAPI) and mirror any client changes in the frontend.
- To swap or upgrade the ML model, modify `backend/model.py`. Keep the public inference API stable to avoid breaking the frontend.
- Frontend components are under `frontend/src/components/` — follow the existing structure for additional pages or controls.

Edge cases to consider:
- Large file uploads: implement chunking or increase server limits for production.
- Asynchronous processing: for long-running inference, consider a background job queue + polling or webhooks.
- Security: validate file types and scan for malicious uploads.

---

## Hackathon judging checklist

Include these items in your demo to make it clear and reproducible:
1. Show the local environment with both servers running (backend + frontend).
2. Upload a sample video and show the model prediction on the UI.
3. Briefly explain how the model is loaded from `backend/saved_models/` and how to swap models.
4. Mention limitations (dataset, inference speed) and immediate next steps (e.g., add CI, tests, or batching).

---

## Contributing

1. Fork the repo and create a branch: `feature/your-change`
2. Make small, focused commits.
3. Open a pull request describing the change, why it helps, and any manual test steps.

Please add tests when you modify core inference logic or API request/response shapes.

---

## Troubleshooting

- If the backend fails to start, make sure your Python venv is activated and dependencies from `backend/requirements.txt` are installed.
-- If the frontend can't reach the backend, check CORS settings in `app.py` (FastAPI CORS middleware) and the backend host/port used by the frontend. For dev purposes, configure the frontend proxy or use `fetch` with the backend's full URL.

---

## Next steps & roadmap

- Add unit tests for the backend inference wrapper and endpoint.
- Add sample test videos and a small dataset split for quick local testing.
- Add CI to run linting and a small smoke test on the API.

---

## License & credits

This repository does not include an explicit license file; add `LICENSE` with your preferred license (MIT, Apache-2.0) before publishing. Credit the authors and any datasets or external models used.