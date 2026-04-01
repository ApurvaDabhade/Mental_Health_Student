# Manas Veda

AI-assisted digital mental health and wellness platform for students.

## Overview

Manas Veda combines structured self-assessments, onboarding-based wellness profiling, stress reporting, psychoeducational resources, and AI chat support in a single web application.

The project is built as a full-stack system:

- Frontend: React + Vite + Tailwind
- Backend: Node.js + Express + MongoDB
- Optional phenotyping API support (FastAPI)

## Key Features

- Multi-step onboarding profile (personal, lifestyle, mental wellness, behavior)
- Assessment modules: PHQ-9, GAD-7, PSS, Burnout, Sleep, Social, Academic, Lifestyle
- Dynamic stress and wellness report cards with recommendations
- Sahaay AI support chat (`/api/sahaay`) with online and offline fallback behavior
- Psychoeducational Resource Hub with search and filters
- Booking, peer support, meditation, exercise, and MHFA training sections

## Project Structure

- `Frontend/` - main React app
- `Backend/` - Express API and MongoDB models/routes
- `StudentLife-Phenotyping/` - optional phenotyping service and assets

## Environment Variables

### Backend (`Backend/.env`)

```env
PORT=5000
MONGO_URI=your_mongodb_connection_string
```

### Frontend (`Frontend/.env`)

```env
VITE_FIREBASE_API_KEY=your_key
VITE_FIREBASE_AUTH_DOMAIN=your_domain
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_bucket
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
VITE_FIREBASE_APP_ID=your_app_id
# Optional (defaults to /api in dev/proxy mode)
VITE_API_BASE_URL=
```

## Run Locally

From repo root:

```bash
npm install
npm run dev:full
```

This starts:

- Frontend (Vite) on `http://localhost:5173`
- Backend (Express) on `http://localhost:5000`
- Phenotyping API (if configured) on `http://127.0.0.1:8000`

You can also run services separately:

```bash
# Terminal 1
cd Backend && npm install && npm run dev

# Terminal 2
cd Frontend && npm install && npm run dev
```

## Notes

- Frontend uses Vite proxy for `/api` in development.
- If backend or MongoDB is offline, some pages use local fallback data.
- The app currently supports a development-friendly auth mode in parts of the flow.








