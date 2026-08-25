import { ArrowRight, Clock, Database } from "lucide-react";

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
          className="inline-flex items-center gap-2 px-4 py-2 text-sm font-semibold text-white transition-colors duration-150 rounded-lg  bg-primary hover:bg-primary-dark"
        >
          Open Project
          <ArrowRight size={15} />
        </button>

        <button
          type="button"
          className="inline-flex items-center gap-2 px-4 py-2 text-sm font-semibold transition-colors duration-150 border rounded-lg  border-border text-text hover:border-border-hover hover:bg-surface-soft"
        >
          View Experiment
        </button>
      </div>
    </div>
  );
}

export default ContinueWorkingPanel;
