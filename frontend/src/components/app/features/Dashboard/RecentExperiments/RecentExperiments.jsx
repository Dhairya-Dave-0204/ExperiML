import { ChevronRight, FlaskConical } from "lucide-react";

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

function RecentExperiments({ data = [] }) {
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

      {data.length > 0 ? (
        <ul>
          {data.map((experiment) => (
            <li
              key={experiment.id}
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
                  {experiment.project?.name ?? "Unknown project"}
                </div>
              </div>

              <div className="flex items-center gap-4 shrink-0">
                <StatusPill status={experiment.status} />

                <span className="hidden w-24 text-xs text-right text-text-secondary md:inline">
                  {formatUpdatedAt(experiment.updatedAt)}
                </span>
              </div>
            </li>
          ))}
        </ul>
      ) : (
        <div className="flex flex-col items-center px-5 py-8 text-center">
          <div className="flex items-center justify-center w-10 h-10 mb-3 rounded-lg bg-primary/10 text-primary">
            <FlaskConical size={19} strokeWidth={2} />
          </div>

          <h4 className="text-sm font-semibold text-text">
            No experiments yet
          </h4>

          <p className="max-w-sm mt-1 text-xs leading-relaxed text-text-secondary">
            Create your first experiment to start testing models and tracking
            your results.
          </p>

          <button
            type="button"
            className="inline-flex items-center gap-2 px-3.5 py-2 mt-4 text-xs font-semibold text-white transition-colors duration-150 rounded-lg bg-primary hover:bg-primary-dark"
          >
            Create Experiment
            <ChevronRight size={13} strokeWidth={2.5} />
          </button>
        </div>
      )}
    </div>
  );
}

export default RecentExperiments;
