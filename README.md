# FitTrack Pro

A fitness-tracking web application with a React frontend and an Express API. The project is organized as two separate applications: `frontend/` and `backend/`.

## Current architecture

| Area | Implementation |
|---|---|
| Frontend | React (Create React App), React Router, Recharts, Axios |
| Backend | Node.js, Express |
| Database | MongoDB via Mongoose |
| Authentication | JWT-based API routes |
| UI | React components, Framer Motion, Lucide icons |

## Repository structure

```text
fittrack-pro/
├── frontend/   # React application
│   ├── public/
│   ├── src/
│   └── package.json
└── backend/    # Express API
    ├── middleware/
    ├── models/
    ├── routes/
    ├── server.js
    └── package.json
```

## Run locally

### 1. Start the backend

```bash
cd backend
npm install
```

Create a local `.env` file in `backend/` with:

```env
MONGO_URI=mongodb://127.0.0.1:27017/fittrack
PORT=5000
```

Then start the API:

```bash
npm run dev
```

The API uses MongoDB. Make sure a local MongoDB service is running, or use a MongoDB connection string you control.

### 2. Start the frontend

In a second terminal:

```bash
cd frontend
npm install
npm start
```

Create React App serves the frontend at `http://localhost:3000` by default.

## API areas

The backend mounts route groups under:

- `/api/auth`
- `/api/workouts`
- `/api/progress`

The API root responds at `/` with a simple running-status message.

## Important notes

- The frontend and backend have separate package manifests; there is no root-level `npm install` workflow.
- Configure secrets and database URLs locally. Never commit `.env` files or real credentials.
- The backend package currently has no automated test script configured.
- Feature descriptions should be checked against the current implementation before treating this project as production-ready.

## Author

Asjad Pathan · [GitHub](https://github.com/Asjadpathan31) · [Portfolio](https://asjadpathan31.github.io/portfolio/)
