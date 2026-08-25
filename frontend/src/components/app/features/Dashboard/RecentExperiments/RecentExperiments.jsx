import { ChevronRight } from "lucide-react";

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

function RecentExperiments() {
  return (
    <div className="border rounded-xl border-border bg-surface">
      <div className="flex items-center justify-between px-5 py-4 border-b border-border">
        <h3 className="text-sm font-bold font-heading text-text">
          Recent Experiments
        </h3>

        <button
          type="button"
          className="inline-flex items-center gap-1 text-xs font-semibold  text-primary hover:text-primary-dark"
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

export default RecentExperiments;
