# DeepShield — Frontend

A lightweight React + Vite frontend for the DeepShield deepfake detection project. This README contains quick setup and usage instructions so you can get the frontend running during the hackathon.

## What this is

- Single-page React app using Vite and Tailwind.
- Uses Auth0 for authentication and calls the backend `/predict` endpoint to analyze uploaded videos.

## Quick start (Windows / PowerShell)

1. Open a terminal and go to the frontend folder:

	cd frontend

2. Install dependencies:

	npm install

3. Run the dev server:

	npm run dev

4. Open the app in your browser at the URL printed by Vite (usually http://localhost:5173).

Available npm scripts (from package.json):

- `npm run dev` — start Vite dev server
- `npm run build` — build production bundle
- `npm run preview` — locally preview the production build
- `npm run lint` — run ESLint

## Environment variables

The project uses Vite. Create a file named `.env.local` (or set env vars in your shell) with these variables:

- `VITE_AUTH0_DOMAIN` — your Auth0 domain
- `VITE_AUTH0_CLIENT_ID` — your Auth0 client ID
- `VITE_API_URL` — URL of backend API (default: `http://localhost:8000`)

Example `.env.local`:

VITE_AUTH0_DOMAIN=your-auth0-domain
VITE_AUTH0_CLIENT_ID=your-client-id
VITE_API_URL=http://localhost:8000

After changing env vars restart the dev server.

## Important routes & behavior

- `/` — Home (landing page). From here users can login/start upload flow.
- `/upload` — Protected upload page (requires Auth0 login). The frontend protects this route with a `PrivateRoute` component.
- `/about`, `/faq`, `/privacy-policy` — public informational pages.

Auth flow:
- If a user is not authenticated and tries to access `/upload`, they are redirected to login.
- After successful login the app will continue to the protected route.

## How predictions work (frontend perspective)

- The frontend uploads a video file to the backend `/predict` endpoint (multipart form-data).
- The backend responds with `{ label: string, confidence: number }`.
- Show results in the UI accordingly (REAL / FAKE with confidence).

## Troubleshooting

- If uploads always return the same prediction:
  - Make sure the backend has the trained weights in `backend/saved_models/` (see backend README).
  - Check backend logs — missing weight files will cause the model to run with random initialization and unreliable predictions.

- If auth redirects unexpectedly:
  - Verify your Auth0 env variables and callback URLs are configured in the Auth0 dashboard.
  - Check `PrivateRoute.jsx` and `Navbar.jsx` for navigation behavior.