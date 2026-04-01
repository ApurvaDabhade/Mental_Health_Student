# Phenotyping UI (source layout)

This folder is the **original** Vite + React layout for the behavioral phenotyping dashboard.

## Manas Veda (canonical app)

The dashboard is **integrated into the main Manas Veda site**:

- **Source copy:** `../../Frontend/src/studentlife/` (import alias `@sl` in Vite)
- **Routes:** `http://localhost:5173/phenotyping` (primary) and `http://localhost:5173/studentlife` (alias)
- Run the full stack from the repo root: `npm run dev:full`

Edits to UI components should be made under **`Frontend/src/studentlife/`**, then optionally synced back here if you still use `vite build` to deploy static files next to FastAPI (`../src/api/frontend`).

## Standalone dev (optional)

Only if you need this tree in isolation:

```bash
cd StudentLife-Phenotyping/frontend && bun install && bunx vite
```

API proxy targets `http://127.0.0.1:8000` per `vite.config.ts`.
