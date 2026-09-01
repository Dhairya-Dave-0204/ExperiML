import { ArrowRight, Clock, Database } from "lucide-react";

function StatusPill({ status }) {
  const styles = {
    COMPLETED: "bg-success/10 text-success",
    RUNNING: "bg-primary-light text-primary",
    FAILED: "bg-danger/10 text-danger",
    CREATED: "bg-surface-soft text-text-secondary",
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

function formatUpdatedAt(updatedAt) {
  if (!updatedAt) {
    return "Unknown";
  }

  const date = new Date(updatedAt);

  if (Number.isNaN(date.getTime())) {
    return "Unknown";
  }

  return new Intl.DateTimeFormat("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  }).format(date);
}

function ContinueWorkingPanel({ data }) {
  if (!data) {
    return null;
  }

  const { project, experiment, dataset, updatedAt } = data;

  return (
    <div className="p-6 border shadow-sm rounded-xl border-border bg-surface sm:p-8">
      <div className="mb-5 text-xs font-semibold tracking-wider uppercase text-text-secondary">
        Continue Working
      </div>

      <h2 className="mb-5 font-heading text-2xl font-extrabold tracking-tight text-text sm:text-[28px]">
        {project?.name ?? "Untitled Project"}
      </h2>

      <div className="grid grid-cols-1 mb-6 gap-x-8 gap-y-4 sm:grid-cols-2">
        {/* Latest Experiment */}
        <div>
          <div className="text-xs text-text-secondary">Latest Experiment</div>

          <div className="mt-1 text-sm font-semibold text-text">
            {experiment?.name ?? "No experiment"}
          </div>

          {experiment?.id && (
            <div className="mt-0.5 font-mono text-xs text-text-secondary">
              {experiment.id}
            </div>
          )}
        </div>

        {/* Dataset */}
        <div>
          <div className="text-xs text-text-secondary">Dataset</div>

          <div className="mt-1 flex items-center gap-1.5 text-sm text-text">
            <Database
              size={13}
              strokeWidth={1.85}
              className="text-text-secondary"
            />

            <span>
              {dataset?.name ?? "No dataset"}
              {dataset?.version != null && ` · v${dataset.version}`}
            </span>
          </div>
        </div>

        {/* Status */}
        <div>
          <div className="text-xs text-text-secondary">Status</div>

          <div className="mt-1.5">
            <StatusPill status={experiment?.status} />
          </div>
        </div>

        {/* Last Activity */}
        <div>
          <div className="text-xs text-text-secondary">Last Activity</div>

          <div className="mt-1 flex items-center gap-1.5 text-sm text-text">
            <Clock
              size={13}
              strokeWidth={1.85}
              className="text-text-secondary"
            />

            {formatUpdatedAt(updatedAt)}
          </div>
        </div>
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

export default ContinueWorkingPanel;
