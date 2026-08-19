import { useState } from "react";
import {
  FlaskConical,
  LayoutDashboard,
  FolderKanban,
  Database,
  Boxes,
  Target,
  FileText,
  Settings,
  BookOpen,
  Search,
  ChevronDown,
  Menu,
  X,
  ArrowRight,
  ChevronRight,
  Clock,
} from "lucide-react";

/* ------------------------------------------------------------------ */
/*  Mock data                                                          */
/* ------------------------------------------------------------------ */

const PRIMARY_NAV = [
  { label: "Overview", icon: LayoutDashboard, active: true },
  { label: "Projects", icon: FolderKanban },
  { label: "Datasets", icon: Database },
  { label: "Experiments", icon: FlaskConical },
  { label: "Models", icon: Boxes },
  { label: "Predictions", icon: Target },
  { label: "Reports", icon: FileText },
];

const UTILITY_NAV = [
  { label: "Settings", icon: Settings },
  { label: "Documentation", icon: BookOpen },
];

const CONTINUE_WORK = {
  project: "Customer Churn Prediction",
  experiment: "Random Forest Classification",
  runId: "EXP-042",
  dataset: "customer_churn_v3.csv",
  status: "Completed",
  metricLabel: "F1 Score",
  metricValue: "0.914",
  updated: "12 minutes ago",
};

// Experiment name doubles as the model description, per the refined
// hierarchy — one metric, one status, no metadata wall.
const RECENT_EXPERIMENTS = [
  {
    name: "Random Forest Classification",
    project: "Customer Churn Prediction",
    status: "Completed",
    metric: "F1 Score 0.914",
    updated: "12 min ago",
  },
  {
    name: "XGBoost Classification",
    project: "Customer Churn Prediction",
    status: "Completed",
    metric: "F1 Score 0.907",
    updated: "Yesterday",
  },
  {
    name: "Linear Regression",
    project: "House Price Prediction",
    status: "Completed",
    metric: "R² 0.903",
    updated: "3 days ago",
  },
  {
    name: "Support Vector Machine",
    project: "Loan Approval Classification",
    status: "Completed",
    metric: "Accuracy 0.891",
    updated: "4 days ago",
  },
];

const RECENT_PROJECTS = [
  { name: "Customer Churn Prediction", experiments: 12, datasets: 3 },
  { name: "House Price Prediction", experiments: 8, datasets: 2 },
  { name: "Loan Approval Classification", experiments: 15, datasets: 4 },
];

const WORKSPACE_SUMMARY = [
  { label: "Projects", value: 12 },
  { label: "Experiments", value: 48 },
  { label: "Datasets", value: 23 },
  { label: "Models", value: 17 },
];

/* ------------------------------------------------------------------ */
/*  Small helpers                                                       */
/* ------------------------------------------------------------------ */

function StatusPill({ status }) {
  const styles = {
    Completed: "bg-success/10 text-success",
    Running: "bg-primary-light text-primary",
    Failed: "bg-danger/10 text-danger",
  };
  return (
    <span
      className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-semibold ${
        styles[status] ?? "bg-surface-soft text-text-secondary"
      }`}
    >
      {status}
    </span>
  );
}

function NavItem({ icon: Icon, label, active }) {
  return (
    <button
      type="button"
      className={`flex w-full items-center gap-2.5 rounded-lg px-3 py-2 text-sm font-medium transition-colors duration-150 ${
        active
          ? "bg-primary-light text-primary"
          : "text-text-secondary hover:bg-surface-soft hover:text-text"
      }`}
    >
      <Icon size={16} strokeWidth={1.85} />
      {label}
    </button>
  );
}

/* ------------------------------------------------------------------ */
/*  Sidebar — unchanged from v1                                        */
/* ------------------------------------------------------------------ */

function Sidebar({ mobileOpen, onClose }) {
  const content = (
    <div className="flex flex-col h-full">
      <div className="flex items-center justify-between px-4 pt-5 pb-4">
        <a
          href="/"
          className="flex items-center gap-2 text-[15px] font-extrabold text-text"
        >
          <FlaskConical size={19} strokeWidth={2} className="text-primary" />
          ExperiML
        </a>
        <button
          type="button"
          onClick={onClose}
          className="p-1 rounded-md text-text-secondary hover:bg-surface-soft lg:hidden"
          aria-label="Close navigation"
        >
          <X size={18} />
        </button>
      </div>

      <nav className="flex-1 space-y-0.5 px-3">
        {PRIMARY_NAV.map((item) => (
          <NavItem key={item.label} {...item} />
        ))}
      </nav>

      <div className="mt-4 space-y-0.5 border-t border-border px-3 pt-4">
        {UTILITY_NAV.map((item) => (
          <NavItem key={item.label} {...item} />
        ))}
      </div>

      <div className="p-3 mt-4 border-t border-border">
        <button
          type="button"
          className="flex w-full items-center gap-2.5 rounded-lg px-2 py-2 text-left transition-colors duration-150 hover:bg-surface-soft"
        >
          <div className="flex items-center justify-center w-8 h-8 text-xs font-bold text-white rounded-full shrink-0 bg-gradient-two-tone-2">
            DP
          </div>
          <div className="flex-1 min-w-0">
            <div className="text-sm font-semibold truncate text-text">
              Dhairya Prajapati
            </div>
            <div className="text-xs truncate text-text-secondary">
              dhairya@experiml.dev
            </div>
          </div>
          <ChevronDown
            size={14}
            strokeWidth={2}
            className="shrink-0 text-text-secondary"
          />
        </button>
      </div>
    </div>
  );

  return (
    <>
      <aside className="hidden border-r w-60 shrink-0 border-border bg-surface lg:block">
        {content}
      </aside>

      {mobileOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div
            className="absolute inset-0 bg-text/30"
            onClick={onClose}
            aria-hidden="true"
          />
          <aside className="absolute top-0 left-0 h-full border-r w-60 border-border bg-surface">
            {content}
          </aside>
        </div>
      )}
    </>
  );
}

/* ------------------------------------------------------------------ */
/*  Top bar — unchanged from v1                                        */
/* ------------------------------------------------------------------ */

function TopBar({ onOpenMobileNav }) {
  return (
    <header className="flex items-center justify-between gap-4 px-4 py-3 border-b border-border bg-surface sm:px-6">
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={onOpenMobileNav}
          className="rounded-md p-1.5 text-text-secondary hover:bg-surface-soft lg:hidden"
          aria-label="Open navigation"
        >
          <Menu size={19} />
        </button>
        <h1 className="font-heading text-[15px] font-bold text-text">
          Overview
        </h1>
      </div>

      <div className="flex items-center gap-2 sm:gap-3">
        <div className="relative hidden sm:block">
          <Search
            size={15}
            strokeWidth={1.85}
            className="absolute -translate-y-1/2 pointer-events-none left-3 top-1/2 text-text-secondary"
          />
          <input
            type="text"
            placeholder="Search projects, experiments..."
            className="w-64 rounded-lg border border-border bg-surface-soft py-1.5 pl-9 pr-14 text-sm text-text placeholder:text-text-secondary/70 transition-colors duration-150 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary-light"
          />
          <kbd className="absolute right-2.5 top-1/2 -translate-y-1/2 rounded border border-border bg-surface px-1.5 py-0.5 font-mono text-[10px] text-text-secondary">
            ⌘K
          </kbd>
        </div>
      </div>
    </header>
  );
}

/* ------------------------------------------------------------------ */
/*  Continue Working — the dominant, only-what's-needed panel          */
/* ------------------------------------------------------------------ */

function ContinueWorkingPanel() {
  const w = CONTINUE_WORK;
  return (
    <div className="p-6 border shadow-sm rounded-xl border-border bg-surface sm:p-8">
      <div className="mb-5 text-xs font-semibold tracking-wider uppercase text-text-secondary">
        Continue Working
      </div>

      <h2 className="mb-5 font-heading text-2xl font-extrabold tracking-tight text-text sm:text-[28px]">
        {w.project}
      </h2>

      <div className="grid grid-cols-1 mb-6 gap-x-8 gap-y-4 sm:grid-cols-2">
        <div>
          <div className="text-xs text-text-secondary">Latest Experiment</div>
          <div className="mt-1 text-sm font-semibold text-text">
            {w.experiment}
          </div>
          <div className="mt-0.5 font-mono text-xs text-text-secondary">
            {w.runId}
          </div>
        </div>
        <div>
          <div className="text-xs text-text-secondary">Dataset</div>
          <div className="mt-1 flex items-center gap-1.5 font-mono text-sm text-text">
            <Database
              size={13}
              strokeWidth={1.85}
              className="text-text-secondary"
            />
            {w.dataset}
          </div>
        </div>
        <div>
          <div className="text-xs text-text-secondary">Status</div>
          <div className="mt-1.5">
            <StatusPill status={w.status} />
          </div>
        </div>
        <div>
          <div className="text-xs text-text-secondary">Last Activity</div>
          <div className="mt-1 flex items-center gap-1.5 text-sm text-text">
            <Clock
              size={13}
              strokeWidth={1.85}
              className="text-text-secondary"
            />
            {w.updated}
          </div>
        </div>
      </div>

      <div className="mb-6 inline-flex items-center gap-2 rounded-lg border border-border bg-surface-soft px-3.5 py-2">
        <span className="text-xs text-text-secondary">{w.metricLabel}</span>
        <span className="font-mono text-sm font-bold text-text">
          {w.metricValue}
        </span>
      </div>

      <div className="flex flex-wrap gap-2.5">
        <button
          type="button"
          className="inline-flex items-center gap-2 px-4 py-2 text-sm font-semibold text-white transition-colors duration-150 rounded-lg bg-primary hover:bg-primary-dark"
        >
          Open Project <ArrowRight size={15} />
        </button>
        <button
          type="button"
          className="inline-flex items-center gap-2 px-4 py-2 text-sm font-semibold transition-colors duration-150 border rounded-lg border-border text-text hover:border-border-hover hover:bg-surface-soft"
        >
          View Experiment
        </button>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Recent Experiments — compact list, one metric each                 */
/* ------------------------------------------------------------------ */

function RecentExperiments() {
  return (
    <div className="border rounded-xl border-border bg-surface">
      <div className="flex items-center justify-between px-5 py-4 border-b border-border">
        <h3 className="text-sm font-bold font-heading text-text">
          Recent Experiments
        </h3>
        <button
          type="button"
          className="inline-flex items-center gap-1 text-xs font-semibold text-primary hover:text-primary-dark"
        >
          View all <ChevronRight size={13} strokeWidth={2.5} />
        </button>
      </div>

      <ul>
        {RECENT_EXPERIMENTS.map((exp) => (
          <li
            key={exp.name + exp.updated}
            className="flex items-center justify-between gap-4 border-b border-border px-5 py-3.5 last:border-b-0 transition-colors duration-150 hover:bg-surface-soft"
          >
            <div className="min-w-0">
              <div className="text-sm font-semibold truncate text-text">
                {exp.name}
              </div>
              <div className="text-xs truncate text-text-secondary">
                {exp.project}
              </div>
            </div>
            <div className="flex items-center gap-4 shrink-0">
              <span className="hidden font-mono text-xs text-text-secondary sm:inline">
                {exp.metric}
              </span>
              <StatusPill status={exp.status} />
              <span className="hidden w-16 text-xs text-right text-text-secondary md:inline">
                {exp.updated}
              </span>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Recent Projects — compact list                                     */
/* ------------------------------------------------------------------ */

function RecentProjects() {
  return (
    <div className="border rounded-xl border-border bg-surface">
      <div className="flex items-center justify-between px-5 py-4 border-b border-border">
        <h3 className="text-sm font-bold font-heading text-text">Projects</h3>
        <button
          type="button"
          className="inline-flex items-center gap-1 text-xs font-semibold text-primary hover:text-primary-dark"
        >
          View all <ChevronRight size={13} strokeWidth={2.5} />
        </button>
      </div>

      <ul>
        {RECENT_PROJECTS.map((project) => (
          <li
            key={project.name}
            className="flex items-center justify-between gap-3 border-b border-border px-5 py-3.5 last:border-b-0 transition-colors duration-150 hover:bg-surface-soft"
          >
            <span className="text-sm font-semibold truncate text-text">
              {project.name}
            </span>
            <span className="text-xs shrink-0 text-text-secondary">
              {project.experiments} experiments · {project.datasets} datasets
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Workspace summary — one quiet row, not a KPI grid                  */
/* ------------------------------------------------------------------ */

function WorkspaceSummary() {
  return (
    <div className="flex flex-wrap items-center px-1 pt-5 text-sm border-t gap-x-6 gap-y-2 border-border">
      <span className="text-xs font-semibold tracking-wider uppercase text-text-secondary">
        Workspace
      </span>
      {WORKSPACE_SUMMARY.map((stat) => (
        <span key={stat.label} className="text-text-secondary">
          {stat.label}{" "}
          <span className="font-mono font-semibold text-text">
            {stat.value}
          </span>
        </span>
      ))}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Page                                                                */
/* ------------------------------------------------------------------ */

export default function DashboardOverview() {
  const [mobileNavOpen, setMobileNavOpen] = useState(false);

  return (
    <div className="flex min-h-screen bg-background">
      <Sidebar
        mobileOpen={mobileNavOpen}
        onClose={() => setMobileNavOpen(false)}
      />

      <div className="flex flex-col flex-1 min-w-0">
        <TopBar onOpenMobileNav={() => setMobileNavOpen(true)} />

        <main className="flex-1 px-4 py-6 sm:px-6 lg:px-8">
          <div className="max-w-5xl mx-auto space-y-6">
            {/* Compact contextual greeting — not a hero */}
            <div>
              <h2 className="text-lg font-bold font-heading text-text">
                Good morning, Dhairya.
              </h2>
              <p className="text-sm text-text-secondary">
                Continue your machine learning workflow.
              </p>
            </div>

            {/* The dominant object on the page */}
            <ContinueWorkingPanel />

            <RecentExperiments />
            <RecentProjects />
            <WorkspaceSummary />
          </div>
        </main>
      </div>
    </div>
  );
}
