# Manas Veda

**Manas Veda** is a student-focused mental health and wellbeing web platform. It combines onboarding, validated-style questionnaires, a stress report, psychoeducational resources, meditation audio, counsellor booking, peer support, and an AI chat companion (Sahaay) with graceful behaviour when the backend or database is unavailable.

---

## Table of contents

- [Overview](#overview)
- [Features](#features)
- [Architecture](#architecture)
- [Repository layout](#repository-layout)
- [Prerequisites](#prerequisites)
- [Quick start](#quick-start)
- [Environment variables](#environment-variables)
- [User roles & routes](#user-roles--routes)
- [API overview](#api-overview)
- [AI chat (Sahaay)](#ai-chat-sahaay)
- [Machine learning scripts (optional)](#machine-learning-scripts-optional)
- [Troubleshooting](#troubleshooting)
- [Development notes](#development-notes)

---

## Overview

The application is full-stack:

| Layer | Stack |
|--------|--------|
| **Frontend** | React 18, Vite, React Router, Tailwind-style utility classes, Lucide icons |
| **Backend** | Node.js, Express, Mongoose (MongoDB) |
| **Optional** | FastAPI phenotyping service under `StudentLife-Phenotyping/` (used by some stress-report flows when running) |

Development auth can be relaxed (`AUTH_DISABLED` in `Frontend/src/context/AuthContext.jsx`) so you can sign in with any email/password for local testing. Production deployments should use real authentication and secure environment configuration.

---

## Features

- **Onboarding** — Multi-step wellness profile (personal, lifestyle, mental health, behaviour).
- **Assessments** — Modular flows (e.g. PHQ-9, GAD-7, PSS, burnout, sleep, social, academic, lifestyle).
- **Stress report** — Dashboard with scores, recommendations, and optional ML/phenotyping integration when services are up.
- **Daily check-in** — Local persistence (`localStorage`) for mood, sleep, stress, etc.; dashboard highlights when scores suggest extra support.
- **Main dashboard** — Quick actions, wellness metric cards (from saved profile), articles, resources, links to AI chat and assessment.
- **Psychoeducational hub** — Searchable resources and filters.
- **Meditation** — Ambient playlists (cosy instrumental + nature tracks).
- **AI support chat** — Sahaay session (`/api/sahaay`) with online responses and **offline / local fallback** when the API is slow or down.
- **Book counsellor** — Listings and appointments (API + local fallbacks).
- **Peer support** — Community-style posts (backend routes when enabled).
- **MHFA training lab** — Educational content module.
- **Counsellor dashboard** — Profile and **student appointments** (including `localStorage`-backed appointments in dev).
- **Institute dashboard** — Branch-level wellbeing overview (sample aggregates; replace with real analytics API when available).

---

## Architecture

```
Browser (Vite dev server :5173)
       │  proxy /api → Backend (:5000)
       └→ Optional: phenotyping API (:8000)
```

- In development, `Frontend/vite.config.js` proxies `/api` to the backend (default `http://127.0.0.1:5000`).
- MongoDB is required for **full** Sahaay session persistence and chat history on the server. Without `MONGO_URI`, the frontend still works using **local session mode** and rule-based replies.

---

## Repository layout

| Path | Purpose |
|------|---------|
| `Frontend/` | React SPA (Vite). Entry: `Frontend/src/main.jsx`, routes in `Frontend/src/App.jsx`. |
| `Backend/` | Express app (`server.js`), routes under `Backend/Routes/`, models under `Backend/Models/`. |
| `StudentLife-Phenotyping/` | Optional Python FastAPI service for phenotyping / features. |
| `dataset.csv` | Sample dataset for ML experiments (optional). |
| `high_accuracy_model.py`, `predict_dataset.py` | Optional Python scripts for training / inference (see [ML section](#machine-learning-scripts-optional)). |

---

## Prerequisites

- **Node.js** ≥ 16 (recommended 18+)
- **npm**
- **MongoDB** (Atlas or local) for full backend persistence — optional for UI-only testing
- **Python 3.10+** with `uv` or similar — only if you run `StudentLife-Phenotyping` or the ML scripts

---

## Quick start

### 1. Install dependencies

From the **repository root**:

```bash
npm install
cd Frontend && npm install && cd ..
cd Backend && npm install && cd ..
```

### 2. Configure environment

Create `Backend/.env` (see [Environment variables](#environment-variables)).  
Optionally create `Frontend/.env` for Firebase if you use real auth.

### 3. Run everything (frontend + backend + phenotyping)

```bash
npm run dev:full
```

This starts:

- **Frontend** — `http://localhost:5173`
- **Phenotyping API** — `http://127.0.0.1:8000` (if dependencies resolve)
- **Backend** — `http://localhost:5000`

### Run services separately

```bash
# Terminal 1 — Backend
cd Backend && npm run dev

# Terminal 2 — Frontend
cd Frontend && npm run dev
```

Optional phenotyping API:

```bash
npm run dev:api
```

---

## Environment variables

### Backend — `Backend/.env`

| Variable | Description |
|----------|-------------|
| `PORT` | HTTP port (default often `5000`; see [Troubleshooting](#troubleshooting) on macOS). |
| `MONGO_URI` | MongoDB connection string. Required for Sahaay sessions and other persisted data. |

Example:

```env
PORT=5000
MONGO_URI=mongodb+srv://user:pass@cluster.mongodb.net/dbname
```

### Frontend — `Frontend/.env`

| Variable | Description |
|----------|-------------|
| `VITE_FIREBASE_*` | Firebase web app config (if using Firebase auth). |
| `VITE_API_BASE_URL` | Optional. If unset, the app uses same-origin `/api` (Vite proxy in dev). |

---

## User roles & routes

| Role | How to select | Typical landing route |
|------|----------------|------------------------|
| **Student** | Login → Student | `/mainpage`, `/onboarding`, `/assessment`, `/checkin`, `/chatbot`, … |
| **Counsellor** | Login → Counsellor | `/counsellor`, `/counsellor-onboarding` |
| **Institute** | Login → Institute | `/institute` |

`ProtectedRoute` enforces `userType` from `localStorage` against the route’s `requiredUserType`.

---

## API overview

Base URL: `/api` (proxied to backend in dev).

| Area | Example paths |
|------|----------------|
| Health | `GET /api/health` |
| Sahaay chat | `POST /api/sahaay/start_session`, `POST /api/sahaay/chat`, `POST /api/sahaay/end_session` |
| Wellness | `POST/GET ...` under `/api/wellness` (see `Backend/routes` / `server.js` mounts) |
| Appointments | `/api/appointments` |
| Counsellors | `/api/counsellors` |
| Peer support | `/api/peer-support/...` |

Inspect `Backend/server.js` for the exact `app.use` mount list.

---

## AI chat (Sahaay)

- **Frontend hook:** `Frontend/src/hooks/useSahaayChat.js` — calls `/api/sahaay`, with **timeout** and **local session** (`local_*` IDs) when the server cannot start a session.
- **Offline replies:** `Frontend/src/utils/chatUtils.js` — `getLocalSupportReply()` for keyword-based supportive messages (not a replacement for professional care).
- **Backend:** `Backend/Routes/sahaayRoutes.js` + `Backend/services/sahaayService.js` — tone analysis, distress, rule-based / template responses stored in MongoDB sessions.

---

## Machine learning scripts (optional)

Files at the repo root are **not** required to run the web app.

| File | Purpose |
|------|---------|
| `dataset.csv` | Tabular data for experiments / model training. |
| `high_accuracy_model.py` | Training script (see file for usage, dependencies). |
| `predict_dataset.py` | Batch prediction helper (see file for inputs/output). |

Run them in a Python environment with the dependencies those scripts expect (e.g. pandas, scikit-learn, torch — as per your local setup).

---

## Troubleshooting

### Port 5000 on macOS

AirPlay Receiver may bind to port **5000**, causing confusing responses or connection failures. **Free the port** or set `PORT` in `Backend/.env` to another value (e.g. `5001`) and update `Frontend/vite.config.js` `proxy` target to match.

### MongoDB connection errors

Without a valid `MONGO_URI`, Mongoose session creation can hang or fail. The app still works in **local chat mode**; for full server-side chat history, configure MongoDB.

### `EMFILE` / too many open files

If `node --watch` causes issues, use `npm start` in the backend or raise your OS file descriptor limit.

### Frontend build

```bash
cd Frontend && npm run build
```

Output is written to `Frontend/dist/`.

---

## Development notes

- **Auth:** `AUTH_DISABLED` in `AuthContext` enables dev login without Firebase; adjust before production.
- **Sensitive data:** Never commit `MONGO_URI`, API keys, or Firebase secrets. Use `.env` files and `.gitignore`.
- **Package lockfiles:** Commit `package-lock.json` updates when dependencies change for reproducible installs.

---

## License

Add a `LICENSE` file if you distribute this project. Until then, usage terms follow your organisation or repository owner’s policy.

---

## Acknowledgements

Built for student mental wellbeing — combine this tool with professional support, crisis lines, and campus resources where appropriate.
