import {
  ArrowRight,
  ChevronRight,
  Clock,
  Database,
  Search,
} from "lucide-react";

import { useAuth } from "@/context/AuthContext";
import { DashboardHeader } from "@/components/components.index"

/* ------------------------------------------------------------------ */
/* Mock dashboard data                                                */
/* ------------------------------------------------------------------ */

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
  {
    name: "Customer Churn Prediction",
    experiments: 12,
    datasets: 3,
  },
  {
    name: "House Price Prediction",
    experiments: 8,
    datasets: 2,
  },
  {
    name: "Loan Approval Classification",
    experiments: 15,
    datasets: 4,
  },
];

const WORKSPACE_SUMMARY = [
  {
    label: "Projects",
    value: 12,
  },
  {
    label: "Experiments",
    value: 48,
  },
  {
    label: "Datasets",
    value: 23,
  },
  {
    label: "Models",
    value: 17,
  },
];

/* ------------------------------------------------------------------ */
/* Helpers                                                            */
/* ------------------------------------------------------------------ */

function StatusPill({ status }) {
  const styles = {
    Completed: "bg-success/10 text-success",
    Running: "bg-primary-light text-primary",
    Failed: "bg-danger/10 text-danger",
  };

  return (
    <span
      className={`
        inline-flex
        items-center
        rounded-full
        px-2.5
        py-1
        text-xs
        font-semibold
        ${styles[status] ?? "bg-surface-soft text-text-secondary"}
      `}
    >
      {status}
    </span>
  );
}

function getFirstName(user) {
  return user?.firstName || "there";
}

/* ------------------------------------------------------------------ */
/* Continue Working                                                   */
/* ------------------------------------------------------------------ */

function ContinueWorkingPanel() {
  const work = CONTINUE_WORK;

  return (
    <div className="p-6 border shadow-sm rounded-xl border-border bg-surface sm:p-8">
      <div className="mb-5 text-xs font-semibold tracking-wider uppercase text-text-secondary">
        Continue Working
      </div>

      <h2 className="mb-5 font-heading text-2xl font-extrabold tracking-tight text-text sm:text-[28px]">
        {work.project}
      </h2>

      <div className="grid grid-cols-1 mb-6 gap-x-8 gap-y-4 sm:grid-cols-2">
        <div>
          <div className="text-xs text-text-secondary">Latest Experiment</div>

          <div className="mt-1 text-sm font-semibold text-text">
            {work.experiment}
          </div>

          <div className="mt-0.5 font-mono text-xs text-text-secondary">
            {work.runId}
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

            {work.dataset}
          </div>
        </div>

        <div>
          <div className="text-xs text-text-secondary">Status</div>

          <div className="mt-1.5">
            <StatusPill status={work.status} />
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

            {work.updated}
          </div>
        </div>
      </div>

      <div className="mb-6 inline-flex items-center gap-2 rounded-lg border border-border bg-surface-soft px-3.5 py-2">
        <span className="text-xs text-text-secondary">{work.metricLabel}</span>

        <span className="font-mono text-sm font-bold text-text">
          {work.metricValue}
        </span>
      </div>

      <div className="flex flex-wrap gap-2.5">
        <button
          type="button"
          className="inline-flex items-center gap-2 px-4 py-2 text-sm font-semibold text-white transition-colors duration-150 rounded-lg bg-primary hover:bg-primary-dark"
        >
          Open Project
          <ArrowRight size={15} />
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
/* Recent Experiments                                                 */
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
          View all
          <ChevronRight size={13} strokeWidth={2.5} />
        </button>
      </div>

      <ul>
        {RECENT_EXPERIMENTS.map((experiment) => (
          <li
            key={`${experiment.name}-${experiment.updated}`}
            className="
              flex
              items-center
              justify-between
              gap-4
              border-b
              border-border
              px-5
              py-3.5
              transition-colors
              duration-150
              last:border-b-0
              hover:bg-surface-soft
            "
          >
            <div className="min-w-0">
              <div className="text-sm font-semibold truncate text-text">
                {experiment.name}
              </div>

              <div className="text-xs truncate text-text-secondary">
                {experiment.project}
              </div>
            </div>

            <div className="flex items-center gap-4 shrink-0">
              <span className="hidden font-mono text-xs text-text-secondary sm:inline">
                {experiment.metric}
              </span>

              <StatusPill status={experiment.status} />

              <span className="hidden w-16 text-xs text-right text-text-secondary md:inline">
                {experiment.updated}
              </span>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Recent Projects                                                    */
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
          View all
          <ChevronRight size={13} strokeWidth={2.5} />
        </button>
      </div>

      <ul>
        {RECENT_PROJECTS.map((project) => (
          <li
            key={project.name}
            className="
              flex
              items-center
              justify-between
              gap-3
              border-b
              border-border
              px-5
              py-3.5
              transition-colors
              duration-150
              last:border-b-0
              hover:bg-surface-soft
            "
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
/* Workspace Summary                                                  */
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
/* Dashboard                                                           */
/* ------------------------------------------------------------------ */

function Dashboard() {
  const { user } = useAuth();

  const firstName = getFirstName(user);

  return (
    <div className="flex flex-col min-h-full">
      <DashboardHeader />

      <main className="flex-1 px-4 py-6 sm:px-6 lg:px-8">
        <div className="max-w-5xl mx-auto space-y-6">
          {/* Contextual greeting */}
          <div>
            <h2 className="text-lg font-bold font-heading text-text">
              Good morning, {firstName}.
            </h2>

            <p className="text-sm text-text-secondary">
              Continue your machine learning workflow.
            </p>
          </div>

          <ContinueWorkingPanel />

          <RecentExperiments />

          <RecentProjects />

          <WorkspaceSummary />
        </div>
      </main>
    </div>
  );
}

export default Dashboard;
