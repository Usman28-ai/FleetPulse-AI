"use client";

import { ArrowRight, BookOpen, Database, Sparkles, Upload } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { api, errorText, post, type Manifest } from "@/lib/api";
import { Busy, Notice, Panel } from "./ui";
import { useWorkspace } from "./workspace";

export function Welcome() {
  const { state, refresh } = useWorkspace();
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [created, setCreated] = useState<Manifest | null>(null);
  const existingDemo = state?.datasets.find(
    (d) => d.source === "synthetic_generator" && d.seed === 42 && d.rows === 10000,
  );
  return (
    <>
      <section className="hero">
        <div className="eyebrow">Fleet operations control room</div>
        <h1>Where should the next rupee of fleet budget go?</h1>
        <p>
          FleetPulse AI turns route history across City Van, Intercity Truck, Cold Chain, Last-Mile Bike and Warehouse
          Shuttle into weighted delivery KPIs, a measured Pandas vs MapReduce vs Spark comparison, a validated revenue
          model, and an exact PKR fuel/ops budget recommendation — with every assumption labelled.
        </p>
        <div className="btn-row" style={{ marginTop: 22 }}>
          <span className="badge">{state?.hosting_notice ? "Hosted single-owner workspace" : "Local single-user workspace"}</span>
          <span className="badge">No telematics or WMS accounts connected</span>
          <span className="badge">Advisory allocations only</span>
          {state && (
            <span className="badge teal">
              {state.dataset_count} saved dataset{state.dataset_count === 1 ? "" : "s"}
            </span>
          )}
        </div>
      </section>

      <div className="grid cols-3">
        <div className="panel path-card">
          <Sparkles size={22} color="var(--amber)" aria-hidden="true" />
          <h3>Explore synthetic demo</h3>
          <p>
            Generate the reproducible 10,000-row seed-42 fleet demo (Jan–Mar 2026, all five channels). Every result stays
            labelled synthetic.
          </p>
          {existingDemo ? (
            <Link className="btn primary" href="/overview">
              Open the saved demo <ArrowRight size={16} />
            </Link>
          ) : (
            <button
              className="btn primary"
              type="button"
              disabled={busy}
              onClick={async () => {
                setBusy(true);
                setError("");
                try {
                  const m = await api<Manifest>(
                    "/datasets/generate",
                    post({
                      name: "Pakistan fleet ops demo",
                      rows: 10000,
                      seed: 42,
                      start_date: "2026-01-01",
                      end_date: "2026-03-31",
                    }),
                  );
                  setCreated(m);
                  await refresh();
                } catch (e) {
                  setError(errorText(e));
                } finally {
                  setBusy(false);
                }
              }}
            >
              Generate demo data
            </button>
          )}
          {busy && <Busy text="Generating 10,000 synthetic route rows…" />}
          {created && (
            <Notice tone="ok">
              Saved “{created.name}”.{" "}
              <Link href="/overview" style={{ fontWeight: 700 }}>
                Open overview →
              </Link>
            </Notice>
          )}
          {error && <Notice tone="error">{error}</Notice>}
        </div>

        <div className="panel path-card">
          <Upload size={22} color="var(--teal)" aria-hidden="true" />
          <h3>Import your own CSV</h3>
          <p>
            Preview → map columns → validate → confirm. Bring route / trip exports and keep currency conversion explicit.
          </p>
          <Link className="btn" href="/data">
            Open data studio <Database size={16} />
          </Link>
        </div>

        <div className="panel path-card">
          <BookOpen size={22} color="var(--peri)" aria-hidden="true" />
          <h3>Read the methodology</h3>
          <p>
            Weighted KPI formulas, ML acceptance gates, exact-paisa budget allocation, and Big Data lab parity rules.
          </p>
          <Link className="btn" href="/methodology">
            Methodology <ArrowRight size={16} />
          </Link>
        </div>
      </div>

      <Panel title="Suggested path" description="A short sequence that exercises every core module without skipping gates.">
        <ol style={{ margin: 0, paddingLeft: 18, display: "grid", gap: 8 }}>
          <li>Generate or import a dataset in Data studio.</li>
          <li>Review Ops overview KPIs and Route explorer tables.</li>
          <li>Train / validate the XGBoost model in ML studio.</li>
          <li>Create an exact PKR allocation in Budget allocator.</li>
          <li>Optionally run Big Data lab, Warehouse reconciliation, or AI assistant.</li>
        </ol>
      </Panel>
    </>
  );
}
