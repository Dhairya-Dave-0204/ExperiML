import {
  ChevronRight,
} from "lucide-react";

import { useAuth } from "@/context/AuthContext";
import { DashboardHeader, ContinueWorkingPanel } from "@/components/components.index"

/* ------------------------------------------------------------------ */
/* Mock dashboard data                                                */
/* ------------------------------------------------------------------ */

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

function getFirstName(user) {
  return user?.firstName || "there";
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
