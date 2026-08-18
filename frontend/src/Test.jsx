import { useState } from "react";
import { motion } from "framer-motion";
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
  Bell,
  ChevronDown,
  Menu,
  X,
  ArrowRight,
  ArrowUpRight,
  TrendingUp,
  Plus,
  ChevronRight,
  Clock,
  CheckCircle2,
  Loader2,
} from "lucide-react";

/* ------------------------------------------------------------------ */
/*  Mock data — realistic, internally consistent ML workspace content  */
/*  First visual iteration: static/mock data only, no API integration. */
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

const WORKSPACE_STATS = [
  { label: "Active Projects", value: 12 },
  { label: "Experiments", value: 48 },
  { label: "Datasets", value: 23 },
  { label: "Models", value: 17 },
];

const RECENT_EXPERIMENTS = [
  {
    id: "EXP-043",
    project: "Customer Churn Prediction",
    model: "XGBoost",
    dataset: "customer_churn_v3",
    metricLabel: "F1",
    metricValue: "—",
    status: "Running",
    updated: "Just now",
  },
  {
    id: "EXP-042",
    project: "Customer Churn Prediction",
    model: "Random Forest",
    dataset: "customer_churn_v3",
    metricLabel: "F1",
    metricValue: "0.914",
    status: "Completed",
    updated: "12 min ago",
  },
  {
    id: "EXP-041",
    project: "Customer Churn Prediction",
    model: "XGBoost",
    dataset: "customer_churn_v3",
    metricLabel: "F1",
    metricValue: "0.907",
    status: "Completed",
    updated: "1 hour ago",
  },
  {
    id: "EXP-038",
    project: "House Price Prediction",
    model: "Linear Regression",
    dataset: "housing_v2",
    metricLabel: "R²",
    metricValue: "0.903",
    status: "Completed",
    updated: "Yesterday",
  },
  {
    id: "EXP-036",
    project: "Loan Approval Classification",
    model: "SVM",
    dataset: "loan_v4",
    metricLabel: "Accuracy",
    metricValue: "0.891",
    status: "Completed",
    updated: "2 days ago",
  },
  {
    id: "EXP-034",
    project: "Employee Attrition",
    model: "Logistic Regression",
    dataset: "attrition_v1",
    metricLabel: "Accuracy",
    metricValue: "0.876",
    status: "Completed",
    updated: "3 days ago",
  },
];

const RECENT_PROJECTS = [
  {
    name: "Customer Churn Prediction",
    experiments: 12,
    datasets: 3,
    updated: "12 min ago",
    active: true,
  },
  {
    name: "House Price Prediction",
    experiments: 8,
    datasets: 2,
    updated: "Yesterday",
  },
  {
    name: "Loan Approval Classification",
    experiments: 15,
    datasets: 4,
    updated: "3 days ago",
  },
  {
    name: "Employee Attrition",
    experiments: 6,
    datasets: 2,
    updated: "3 days ago",
  },
];

// Validation F1 across the active project's last 6 runs — feeds the trend sparkline.
const TREND_VALUES = [0.861, 0.878, 0.889, 0.895, 0.907, 0.914];

/* ------------------------------------------------------------------ */
/*  Small presentational helpers                                       */
/* ------------------------------------------------------------------ */

function StatusPill({ status }) {
  const styles = {
    Completed: "bg-success/10 text-success",
    Running: "bg-primary-light text-primary",
    Failed: "bg-danger/10 text-danger",
  };
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold ${
        styles[status] ?? "bg-surface-soft text-text-secondary"
      }`}
    >
      {status === "Running" && (
        <Loader2 size={11} className="animate-spin" strokeWidth={2.5} />
      )}
      {status === "Completed" && <CheckCircle2 size={11} strokeWidth={2.5} />}
      {status}
    </span>
  );
}

function TrendChart({ values }) {
  const w = 240;
  const h = 56;
  const min = Math.min(...values);
  const max = Math.max(...values);
  const pad = 6;

  const points = values.map((v, i) => {
    const x = (i / (values.length - 1)) * (w - pad * 2) + pad;
    const y = h - pad - ((v - min) / (max - min || 1)) * (h - pad * 2);
    return [x, y];
  });

  const linePath = points
    .map(([x, y], i) => `${i === 0 ? "M" : "L"}${x},${y}`)
    .join(" ");
  const areaPath = `${linePath} L${points[points.length - 1][0]},${h} L${points[0][0]},${h} Z`;

  return (
    <svg
      viewBox={`0 0 ${w} ${h}`}
      className="w-full h-14"
      preserveAspectRatio="none"
    >
      <path
        d={areaPath}
        fill="var(--color-primary-light)"
        opacity="0.5"
        stroke="none"
      />
      <path
        d={linePath}
        fill="none"
        stroke="var(--color-primary)"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <circle
        cx={points[points.length - 1][0]}
        cy={points[points.length - 1][1]}
        r="3"
        fill="var(--color-primary)"
      />
    </svg>
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
/*  Sidebar                                                             */
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
      {/* Desktop sidebar */}
      <aside className="hidden border-r w-60 shrink-0 border-border bg-surface lg:block">
        {content}
      </aside>

      {/* Mobile sidebar */}
      {mobileOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div
            className="absolute inset-0 bg-text/30"
            onClick={onClose}
            aria-hidden="true"
          />
          <motion.aside
            initial={{ x: -260 }}
            animate={{ x: 0 }}
            exit={{ x: -260 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            className="absolute top-0 left-0 h-full border-r w-60 border-border bg-surface"
          >
            {content}
          </motion.aside>
        </div>
      )}
    </>
  );
}

/* ------------------------------------------------------------------ */
/*  Top bar                                                             */
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

        <button
          type="button"
          aria-label="Notifications"
          className="relative p-2 transition-colors duration-150 rounded-lg text-text-secondary hover:bg-surface-soft hover:text-text"
        >
          <Bell size={17} strokeWidth={1.85} />
          <span className="absolute right-1.5 top-1.5 h-1.5 w-1.5 rounded-full bg-danger" />
        </button>
      </div>
    </header>
  );
}

/* ------------------------------------------------------------------ */
/*  Primary panel — the dominant workspace object                      */
/*  Merges "continue where you left off" with "what's running now"     */
/*  into one panel, since for the user these are the same object.      */
/* ------------------------------------------------------------------ */

function PrimaryWorkspacePanel() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, ease: "easeOut" }}
      className="grid grid-cols-1 divide-y divide-border rounded-xl border border-border bg-surface shadow-sm md:grid-cols-[1.3fr_1fr] md:divide-x md:divide-y-0"
    >
      {/* Left: project context */}
      <div className="p-5 sm:p-6">
        <div className="flex items-center gap-2 mb-4">
          <span className="relative flex w-2 h-2">
            <span className="absolute inline-flex w-full h-full rounded-full animate-ping bg-success opacity-60" />
            <span className="relative inline-flex w-2 h-2 rounded-full bg-success" />
          </span>
          <span className="text-xs font-semibold tracking-wider uppercase text-success">
            Active
          </span>
          <span className="text-xs text-text-secondary">
            · Continue where you left off
          </span>
        </div>

        <h2 className="mb-1 text-xl font-extrabold tracking-tight font-heading text-text sm:text-2xl">
          Customer Churn Prediction
        </h2>
        <p className="mb-5 flex items-center gap-1.5 font-mono text-xs text-text-secondary">
          <Database size={13} strokeWidth={1.85} />
          customer_churn_v3.csv
        </p>

        <div className="grid grid-cols-2 gap-4 mb-5 sm:grid-cols-3">
          <div>
            <div className="text-xs text-text-secondary">Latest experiment</div>
            <div className="mt-0.5 text-sm font-semibold text-text">
              Random Forest
            </div>
            <div className="font-mono text-xs text-text-secondary">
              Run EXP-042
            </div>
          </div>
          <div>
            <div className="text-xs text-text-secondary">Latest result</div>
            <div className="mt-0.5 font-mono text-sm font-bold text-primary">
              F1 0.914
            </div>
          </div>
          <div>
            <div className="text-xs text-text-secondary">Last updated</div>
            <div className="mt-0.5 flex items-center gap-1 text-sm text-text">
              <Clock
                size={12}
                strokeWidth={1.85}
                className="text-text-secondary"
              />
              12 min ago
            </div>
          </div>
        </div>

        <div className="flex flex-wrap gap-2.5">
          <button
            type="button"
            className="inline-flex items-center gap-2 px-4 py-2 text-sm font-semibold text-white transition-colors duration-150 rounded-lg bg-primary hover:bg-primary-dark"
          >
            Continue Experiment <ArrowRight size={15} />
          </button>
          <button
            type="button"
            className="inline-flex items-center gap-2 px-4 py-2 text-sm font-semibold transition-colors duration-150 border rounded-lg border-border text-text hover:border-border-hover hover:bg-surface-soft"
          >
            Open Project
          </button>
        </div>
      </div>

      {/* Right: what's running right now */}
      <div className="p-5 bg-surface-soft/60 sm:p-6">
        <div className="flex items-center gap-2 mb-4">
          <Loader2
            size={13}
            className="animate-spin text-primary"
            strokeWidth={2.5}
          />
          <span className="text-xs font-semibold tracking-wider uppercase text-primary">
            Training in progress
          </span>
        </div>

        <h3 className="mb-1 text-[15px] font-bold text-text">
          XGBoost — Customer Churn
        </h3>
        <p className="mb-4 font-mono text-xs text-text-secondary">
          Run EXP-043 · dataset customer_churn_v3
        </p>

        <div className="mb-1.5 flex items-center justify-between text-xs">
          <span className="text-text-secondary">Boosting round 340 / 500</span>
          <span className="font-mono font-semibold text-text">68%</span>
        </div>
        <div className="mb-5 h-1.5 w-full overflow-hidden rounded-full bg-border">
          <div className="h-full w-[68%] rounded-full bg-primary" />
        </div>

        <div className="px-4 py-3 border rounded-lg border-border bg-surface">
          <div className="flex items-center justify-between mb-1">
            <span className="text-xs text-text-secondary">
              Validation F1 (current)
            </span>
            <span className="inline-flex items-center gap-1 text-xs font-semibold text-success">
              <ArrowUpRight size={12} strokeWidth={2.5} />
              improving
            </span>
          </div>
          <div className="font-mono text-lg font-bold text-text">0.9142</div>
        </div>
      </div>
    </motion.div>
  );
}

/* ------------------------------------------------------------------ */
/*  Compact, restrained stats strip — deliberately secondary            */
/* ------------------------------------------------------------------ */

function StatsStrip() {
  return (
    <div className="grid grid-cols-2 border divide-y rounded-lg divide-border border-border bg-surface sm:grid-cols-4 sm:divide-y-0 sm:divide-x">
      {WORKSPACE_STATS.map((stat) => (
        <div key={stat.label} className="px-5 py-3.5">
          <div className="font-mono text-lg font-bold text-text">
            {stat.value}
          </div>
          <div className="text-xs text-text-secondary">{stat.label}</div>
        </div>
      ))}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Recent experiments table                                           */
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

      <div className="overflow-x-auto">
        <table className="w-full min-w-[640px] text-left text-sm">
          <thead>
            <tr className="text-xs border-b border-border text-text-secondary">
              <th className="px-5 py-2.5 font-medium">Experiment</th>
              <th className="px-5 py-2.5 font-medium">Project</th>
              <th className="px-5 py-2.5 font-medium">Model</th>
              <th className="px-5 py-2.5 font-medium">Metric</th>
              <th className="px-5 py-2.5 font-medium">Status</th>
              <th className="px-5 py-2.5 font-medium">Updated</th>
            </tr>
          </thead>
          <tbody>
            {RECENT_EXPERIMENTS.map((exp) => (
              <tr
                key={exp.id}
                className="transition-colors duration-150 border-b border-border last:border-b-0 hover:bg-surface-soft"
              >
                <td className="px-5 py-3 font-mono text-xs font-semibold text-text">
                  {exp.id}
                </td>
                <td className="max-w-[180px] truncate px-5 py-3 text-text-secondary">
                  {exp.project}
                </td>
                <td className="px-5 py-3 text-text-secondary">{exp.model}</td>
                <td className="px-5 py-3 font-mono text-xs font-semibold text-text">
                  {exp.metricLabel} {exp.metricValue}
                </td>
                <td className="px-5 py-3">
                  <StatusPill status={exp.status} />
                </td>
                <td className="px-5 py-3 text-xs whitespace-nowrap text-text-secondary">
                  {exp.updated}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Recent projects — a list, not another card grid                    */
/* ------------------------------------------------------------------ */

function RecentProjects() {
  return (
    <div className="border rounded-xl border-border bg-surface">
      <div className="flex items-center justify-between px-5 py-4 border-b border-border">
        <h3 className="text-sm font-bold font-heading text-text">
          Recent Projects
        </h3>
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
            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <span className="text-sm font-semibold truncate text-text">
                  {project.name}
                </span>
                {project.active && (
                  <span
                    className="h-1.5 w-1.5 shrink-0 rounded-full bg-success"
                    aria-label="Active"
                  />
                )}
              </div>
              <div className="mt-0.5 text-xs text-text-secondary">
                {project.experiments} experiments · {project.datasets} datasets
              </div>
            </div>
            <span className="text-xs shrink-0 text-text-secondary">
              {project.updated}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Metric trend — the one chart that answers a real question          */
/* ------------------------------------------------------------------ */

function MetricTrend() {
  return (
    <div className="p-5 border rounded-xl border-border bg-surface">
      <div className="mb-1 flex items-center gap-1.5 text-xs font-semibold text-text-secondary">
        <TrendingUp size={13} strokeWidth={2} className="text-success" />
        Are recent experiments improving?
      </div>
      <p className="mb-3 text-xs text-text-secondary">
        Validation F1 · Customer Churn Prediction · last 6 runs
      </p>
      <TrendChart values={TREND_VALUES} />
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Page                                                                */
/* ------------------------------------------------------------------ */

function Test() {
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
          <div className="max-w-6xl mx-auto space-y-6">
            {/* Workspace context — small, not a marketing hero */}
            <motion.div
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className="flex flex-wrap items-center justify-between gap-3"
            >
              <div>
                <h2 className="text-lg font-bold font-heading text-text sm:text-xl">
                  Good afternoon, Dhairya.
                </h2>
                <p className="text-sm text-text-secondary">
                  Here's what's happening across your ML workspace.
                </p>
              </div>
              <button
                type="button"
                className="inline-flex items-center gap-2 px-4 py-2 text-sm font-semibold text-white transition-colors duration-150 rounded-lg bg-primary hover:bg-primary-dark"
              >
                <Plus size={16} strokeWidth={2.25} />
                New Project
              </button>
            </motion.div>

            {/* Primary workspace object */}
            <PrimaryWorkspacePanel />

            {/* Supporting, restrained stats */}
            <StatsStrip />

            {/* Recent work */}
            <div className="grid grid-cols-1 gap-6 lg:grid-cols-[1.6fr_1fr]">
              <RecentExperiments />
              <div className="space-y-6">
                <RecentProjects />
                <MetricTrend />
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}

export default Test