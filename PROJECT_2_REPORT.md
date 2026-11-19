# FleetPulse AI — Project 2 Report

| Field | Value |
|-------|-------|
| **Project Title** | FleetPulse AI — Logistics & Fleet Operations Budget Optimization Studio |
| **Course / Track** | Project 2 · Big Data Analytics |
| **GitHub Repository** | `[PASTE_GITHUB_REPO_LINK]` |
| **Related Project 1** | House Price Predictor — `[PASTE_PROJECT_1_GITHUB_LINK]` (local sibling: `../hosue-price-predictor`) |
| **Document** | 2-page academic / portfolio summary |

---

## 1. Project Title & Overview

**FleetPulse AI** answers a practical logistics question: *Where should a fleet allocate the next operational and fuel budget across City Van, Intercity Truck, Cold Chain, Last-Mile Bike, and Warehouse Shuttle?*

The studio turns route and trip history into weighted delivery KPIs, trains an **XGBoost** revenue model with a chronological train/validation/holdout split, benchmarks **Pandas vs MapReduce vs Apache Spark** from 10K to 10M rows, and splits a user-entered PKR budget **exactly to the last paisa** under optional channel caps. The core objective is decision support—transparent, reproducible allocation recommendations grounded in measured history—not live telematics or payment integrations.

---

## 2. System Architecture & Data Flow

FleetPulse uses a **decoupled** client–server design:

```
Browser → Next.js 16 Ops Control Room (UI) → FastAPI (numeric truth) → SQLite catalog + Parquet
```

| Layer | Responsibility |
|-------|----------------|
| **Next.js frontend** | Screens, filters, charts, formatting (paisa → PKR); never recomputes KPIs, predictions, or allocations |
| **FastAPI backend** | Single source of numeric truth for analytics, ML, optimization, benchmarks, and commerce |
| **Storage** | SQLite workspace catalog; Parquet datasets under the data directory |

Long jobs (model training, big-data benchmarks) run as server-side workers that the UI polls. Analytics are paged server-side so the browser never receives multi-million-row payloads.

---

## 3. Tech Stack Used

| Layer | Technologies |
|-------|----------------|
| **Frontend** | Next.js 16, React 19, TypeScript, Tailwind CSS 4, Recharts |
| **Backend API** | FastAPI, Python 3.11+, Pydantic v2 |
| **Data** | SQLite catalog, Parquet / PyArrow, Pandas |
| **ML** | XGBoost, scikit-learn baselines, chronological split + acceptance gate |
| **Big Data lab** | Pandas · MapReduce · optional PySpark (JVM) |
| **Optimization** | Exact-paisa allocator (integer money + optional SciPy LP for response curves) |
| **Optional AI** | NVIDIA-backed assistant with an approval boundary |

---

## 4. Key Modules & Features Built

Ten Ops Control Room screens map to backend services:

| # | Screen / Module | What it delivers |
|---|-----------------|------------------|
| 1 | **Welcome / Suite** | Portfolio navigation (links Project 1 House Price Predictor; Project 2 active) |
| 2 | **Data Studio & Synthetic Generator** | Schema mapping, CSV import, provenance, synthetic fleet datasets |
| 3 | **Analytics Overview** | Weighted KPIs (CTR-style delivery rates, CPC/CPA analogs, ROAS, revenue) |
| 4 | **Route / Trip Explorer** | Campaign-style explorer for routes/trips with filters and charts |
| 5 | **XGBoost ML Pipeline** | Chronological split, baseline gate, train → accept/reject → re-evaluate |
| 6 | **Exact-Paisa Budget Allocator** | User budget + method + channel limits → plan summing exactly to 1 paisa |
| 7 | **Big Data Benchmark Lab** | 10K / 100K / 1M / 10M scales; Pandas vs MapReduce vs Spark parity |
| 8 | **Warehouse Commerce Reconciliation** | Order/cost CSV import, match outcomes, profit gates |
| 9 | **Optional AI Assistant** | Approved natural-language explanations of KPIs / plans |
| 10 | **Methodology** | Formulas, limitations, and trust/evidence panels |

---

## 5. Results & Outcomes

- **ML quality:** On the seed 10K workflow, the accepted XGBoost model beat the baseline (holdout RMSE ≈ **7,195** vs baseline ≈ **10,416**), with identical re-evaluation after reload.
- **Budget integrity:** A PKR **1,000,000** plan totals **exactly Rs 1,000,000.00** in integer paisa; channel caps (e.g. Google ≤ 20%) are enforced while preserving the exact sum.
- **Scale evidence:** All three engines were run across four scales with repeat parity; 10M-row generation and benchmarks completed on a single machine.
- **Commerce:** Demo and UI CSV flows reconcile net sales and matched costs with zero reference drift on the pilot fixtures.
- **Verification:** Backend pytest, TypeScript/ESLint, browser QA, and E2E journeys (budget, ML, commerce) support the portfolio claim that numbers shown in the UI match the API.

**Bottom line:** FleetPulse AI demonstrates an end-to-end big-data analytics studio—data → KPIs → model → exact budget split—where FastAPI owns every numeric result and Next.js presents an Ops Control Room ready for academic demo and GitHub submission.

---

*Print tip: open `PROJECT_2_REPORT.html` and use the browser Print → Save as PDF (A4, margins ~12–14 mm) for a clean 2-page export. Replace the `[PASTE_*]` placeholders with your live GitHub URLs before submission.*
