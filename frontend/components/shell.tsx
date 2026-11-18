"use client";

import {
  BarChart3,
  BookOpen,
  BrainCircuit,
  Compass,
  Cpu,
  Database,
  ExternalLink,
  LayoutDashboard,
  Menu,
  Moon,
  Package,
  Sparkles,
  Sun,
  Table2,
  Target,
  Truck,
  X,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState, type ReactNode } from "react";
import { errorText } from "@/lib/api";
import { Notice, SourceBadge } from "./ui";
import { useWorkspace, WorkspaceProvider } from "./workspace";

const PROJECT1_URL =
  process.env.NEXT_PUBLIC_PROJECT1_URL || "http://localhost:8501";
const PROJECT3_URL = process.env.NEXT_PUBLIC_PROJECT3_URL || "";

export const NAV = [
  {
    label: "Start",
    items: [{ href: "/", label: "Welcome", icon: Compass }],
  },
  {
    label: "Analyse",
    items: [
      { href: "/overview", label: "Ops overview", icon: LayoutDashboard },
      { href: "/campaigns", label: "Route explorer", icon: Table2 },
      { href: "/data", label: "Data studio", icon: Database },
    ],
  },
  {
    label: "Decide",
    items: [
      { href: "/budget", label: "Budget allocator", icon: Target },
      { href: "/models", label: "ML studio", icon: BrainCircuit },
      { href: "/lab", label: "Big Data lab", icon: Cpu },
    ],
  },
  {
    label: "Extend",
    items: [
      { href: "/commerce", label: "Warehouse & orders", icon: Package },
      { href: "/assistant", label: "AI assistant", icon: Sparkles },
      { href: "/methodology", label: "Methodology", icon: BookOpen },
    ],
  },
];

const ALL = NAV.flatMap((g) => g.items);

function ThemeToggle() {
  const [theme, setTheme] = useState<"dark" | "light" | null>(null);
  useEffect(() => {
    setTheme((document.documentElement.dataset.theme as "dark" | "light") || "light");
  }, []);
  const next = theme === "light" ? "dark" : "light";
  return (
    <button
      type="button"
      className="btn ghost sm"
      aria-label={`Switch to ${next} theme`}
      onClick={() => {
        document.documentElement.dataset.theme = next;
        try {
          localStorage.setItem("fleetpulse.theme", next);
        } catch {
          /* preference not persisted */
        }
        setTheme(next);
      }}
    >
      {theme === "light" ? <Moon size={16} /> : <Sun size={16} />}
      <span className="sr-only">Theme</span>
    </button>
  );
}

function SourcePicker() {
  const { state, select, refresh } = useWorkspace();
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  if (!state) return null;
  if (!state.datasets.length)
    return (
      <Link href="/data" className="btn sm">
        <Database size={15} /> Add data
      </Link>
    );
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 8, minWidth: 0 }}>
      {state.selected_dataset && <SourceBadge dataset={state.selected_dataset} />}
      <label className="sr-only" htmlFor="source-picker">
        Selected fleet data source
      </label>
      <select
        id="source-picker"
        className="select"
        style={{ minHeight: 34, maxWidth: 260, fontSize: 13 }}
        value={state.selected_dataset_id ?? ""}
        disabled={busy}
        onChange={async (e) => {
          setBusy(true);
          setError("");
          try {
            await select(e.target.value || null);
          } catch (err) {
            setError(errorText(err));
            await refresh();
          } finally {
            setBusy(false);
          }
        }}
      >
        <option value="">No source selected</option>
        {state.datasets.map((d) => (
          <option key={d.id} value={d.id}>
            {d.name} · {d.rows.toLocaleString("en-PK")} rows
          </option>
        ))}
      </select>
      {error && (
        <span role="alert" className="badge critical" title={error}>
          Selection failed
        </span>
      )}
    </div>
  );
}

function SuiteBar() {
  return (
    <div className="suite-bar" aria-label="Project suite">
      <div className="suite-inner">
        <span className="suite-label">MLOps Suite</span>
        <a className="suite-link" href={PROJECT1_URL} target="_blank" rel="noreferrer">
          <BarChart3 size={14} aria-hidden="true" />
          Project 1 · House Price Predictor
          <ExternalLink size={12} aria-hidden="true" />
        </a>
        <span className="suite-link active" aria-current="page">
          <Truck size={14} aria-hidden="true" />
          Project 2 · FleetPulse AI
        </span>
        {PROJECT3_URL ? (
          <a className="suite-link" href={PROJECT3_URL} target="_blank" rel="noreferrer">
            Project 3 · Coming soon
            <ExternalLink size={12} aria-hidden="true" />
          </a>
        ) : (
          <span className="suite-link muted" title="Wire NEXT_PUBLIC_PROJECT3_URL when ready">
            Project 3 · Slot ready
          </span>
        )}
      </div>
    </div>
  );
}

function Frame({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const { state, error, loading, refresh } = useWorkspace();
  const current = ALL.find((i) => (i.href === "/" ? pathname === "/" : pathname.startsWith(i.href)));
  useEffect(() => {
    setOpen(false);
  }, [pathname]);
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  return (
    <div className="shell shell-top">
      <SuiteBar />
      <header className="app-header">
        <div className="app-header-row">
          <Link href="/" className="brand">
            <span className="brand-mark" aria-hidden="true">
              <Truck size={18} />
            </span>
            <span className="brand-name">
              FleetPulse AI
              <small>Fleet operations intelligence</small>
            </span>
          </Link>
          <button
            className="btn ghost sm menu-toggle"
            type="button"
            aria-label="Open navigation"
            aria-expanded={open}
            onClick={() => setOpen(true)}
          >
            <Menu size={18} />
          </button>
          <nav className="tab-nav" aria-label="Primary">
            {ALL.map(({ href, label, icon: Icon }) => (
              <Link
                key={href}
                href={href}
                className="tab-link"
                aria-current={current?.href === href ? "page" : undefined}
              >
                <Icon size={15} aria-hidden="true" />
                {label}
              </Link>
            ))}
          </nav>
          <div className="topbar-right">
            <SourcePicker />
            <ThemeToggle />
          </div>
        </div>
      </header>

      <nav className="rail drawer" data-open={open} aria-label="Mobile navigation">
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <span className="brand-name" style={{ color: "#fff" }}>
            FleetPulse
          </span>
          <button className="btn ghost sm" type="button" aria-label="Close navigation" onClick={() => setOpen(false)} style={{ color: "#fff" }}>
            <X size={18} />
          </button>
        </div>
        {NAV.map((group) => (
          <div className="nav-group" key={group.label}>
            <div className="nav-label">{group.label}</div>
            {group.items.map(({ href, label, icon: Icon }) => (
              <Link key={href} href={href} className="nav-link" aria-current={current?.href === href ? "page" : undefined}>
                <Icon size={17} aria-hidden="true" />
                {label}
              </Link>
            ))}
          </div>
        ))}
      </nav>

      <div className="main">
        <main className="content" id="main">
          {state?.hosting_notice && <Notice tone="info">{state.hosting_notice}</Notice>}
          {error && !loading && (
            <Notice tone="error" title="Backend unavailable">
              {error}{" "}
              <button className="btn sm" type="button" onClick={() => void refresh()} style={{ marginTop: 8 }}>
                Retry connection
              </button>
            </Notice>
          )}
          {children}
        </main>
      </div>
    </div>
  );
}

export function Shell({ children }: { children: ReactNode }) {
  return (
    <WorkspaceProvider>
      <Frame>{children}</Frame>
    </WorkspaceProvider>
  );
}
