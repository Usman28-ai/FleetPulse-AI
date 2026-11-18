# FleetPulse AI

**Fleet Operations Intelligence Studio.** Where should a logistics company allocate the next fuel & ops budget across City Van, Intercity Truck, Cold Chain, Last-Mile Bike and Warehouse Shuttle?

FleetPulse AI turns route history into weighted delivery KPIs, measures **Pandas vs MapReduce vs Apache Spark** on 10K → 10M rows, trains and validates an **XGBoost** revenue model, and splits a user-entered PKR budget **exactly to the last paisa** within the limits you set.

## MLOps suite navigation

The top **Suite Header** links three projects so demos feel like one portfolio:

| Slot | Project | Default link | How to configure |
|------|---------|--------------|------------------|
| Project 1 | House Price Predictor | `http://localhost:8501` | `NEXT_PUBLIC_PROJECT1_URL` |
| Project 2 | **FleetPulse AI** (this app) | Active page (no external jump) | — |
| Project 3 | Future project slot | Hidden until set | `NEXT_PUBLIC_PROJECT3_URL` |

Local sibling folder for Project 1: `../hosue-price-predictor` (Streamlit / FastAPI).  
When Project 3 exists, set its URL in `.env` / hosting env and the Suite Header shows a live link automatically.

```env
NEXT_PUBLIC_PROJECT1_URL=http://localhost:8501
# NEXT_PUBLIC_PROJECT3_URL=http://localhost:XXXX
```

---

## Tech stack

| Layer | Stack |
|-------|-------|
| Frontend | Next.js 16, React 19, TypeScript, Tailwind 4, Recharts |
| Backend | FastAPI, Pydantic v2, Python 3.11+ |
| Data | pandas, PyArrow/Parquet, SQLite catalog |
| ML | XGBoost + chronological train/val/holdout + baseline gate |
| Big Data lab | Pandas · MapReduce · PySpark (optional Java) |
| Optional AI | NVIDIA explain (approval gate) |

## Screens

| Route | Screen |
|-------|--------|
| `/` | Welcome |
| `/overview` | Ops overview |
| `/campaigns` | Route explorer |
| `/data` | Data studio |
| `/budget` | Budget allocator |
| `/models` | ML studio |
| `/lab` | Big Data lab |
| `/commerce` | Warehouse & orders |
| `/assistant` | AI insight assistant |
| `/methodology` | Methodology |

## Run locally

Requirements: Node ≥ 20.9, Python 3.11–3.12.

**Windows (PowerShell)**
```powershell
py -3.11 -m venv .venv
.\.venv\Scripts\python -m pip install -e ".[dev]"
# On Python 3.11, if lock install fails on numpy pins, use:
# .\.venv\Scripts\python -m pip install "fastapi>=0.115,<1" "uvicorn>=0.34,<1" "pydantic>=2.10,<3" "numpy>=2,<2.5" "pandas>=2.2,<3" "pyarrow>=19,<30" "psutil>=7,<8" "xgboost>=3,<4" "scikit-learn>=1.7,<2" "scipy>=1.15,<2" "httpx>=0.28,<1"
.\.venv\Scripts\python -m pip install --no-deps -e .
npm --prefix frontend ci
npm run dev
```

Open http://127.0.0.1:3000 (API docs: http://127.0.0.1:8000/docs).

## Architecture principle

The **backend is the single source of numeric truth**. The frontend formats and displays; it never recomputes KPIs, predictions, or allocations.

## Project structure

```
backend/src/fleetpulse/   FastAPI services
backend/tests/            pytest suite
frontend/app/             Next.js routes
frontend/components/      screens + UI
frontend/lib/             typed API adapter
scripts/dev.mjs           starts backend + frontend
```

## License / notes

Standalone academic/portfolio project. No live telematics, WMS, or payment connections.
