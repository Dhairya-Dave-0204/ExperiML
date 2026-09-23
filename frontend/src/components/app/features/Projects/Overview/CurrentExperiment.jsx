import { useNavigate } from "react-router-dom";
import { ArrowRight, Loader2 } from "lucide-react";

import { ROUTES } from "@/constants/routes";

const CurrentExperiment = ({ projectId, experiment }) => {
  const navigate = useNavigate();

  if (!experiment) {
    return (
      <section className="mb-8">
        <SectionHeading
          title="Current experiment"
          description="The latest experiment currently associated with this project."
        />

        <div className="p-6 bg-white border rounded-xl border-border">
          <p className="text-sm text-text-secondary">
            No experiments have been created for this project yet.
          </p>
        </div>
      </section>
    );
  }

  return (
    <section className="mb-8">
      <SectionHeading
        title="Current experiment"
        description="The latest experiment currently associated with this project."
      />

      <div className="p-6 bg-white border rounded-xl border-border">
        <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-3 mb-2">
              <h3 className="text-base font-semibold font-heading text-text">
                {experiment.name}
              </h3>

              <StatusBadge status={experiment.experimentStatus} />
            </div>

            <div className="grid grid-cols-1 text-sm gap-x-8 gap-y-2 text-text-secondary sm:grid-cols-2 lg:grid-cols-4">
              <MetadataItem
                label="Dataset"
                value={experiment.dataset?.name || "—"}
              />

              <MetadataItem
                label="Algorithm"
                value={formatLabel(experiment.algorithmName)}
              />

              <MetadataItem
                label="Problem type"
                value={formatLabel(experiment.problemType)}
              />

              <MetadataItem
                label="Started"
                value={formatDate(experiment.startedAt)}
              />
            </div>
          </div>

          <button
            type="button"
            onClick={() =>
              navigate(
                ROUTES.PROJECT_TAB(projectId, ROUTES.PROJECT_TABS.EXPERIMENTS),
              )
            }
            className="inline-flex items-center gap-2 text-sm font-medium transition-colors shrink-0 text-primary hover:text-primary-dark"
          >
            View experiments
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </section>
  );
};

const SectionHeading = ({ title, description }) => {
  return (
    <div className="mb-4">
      <h2 className="text-base font-semibold font-heading text-text">
        {title}
      </h2>

      <p className="mt-1 text-sm text-text-secondary">{description}</p>
    </div>
  );
};

const StatusBadge = ({ status }) => {
  const statusStyles = {
    QUEUED: "bg-surface-soft text-text-secondary",
    TRAINING: "bg-primary-light text-primary",
    COMPLETED: "bg-success/10 text-success",
    FAILED: "bg-danger/10 text-danger",
    CANCELLED: "bg-surface-soft text-text-secondary",
  };

  const className =
    statusStyles[status] || "bg-surface-soft text-text-secondary";

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium ${className}`}
    >
      {status === "TRAINING" ? (
        <Loader2 className="w-3 h-3 animate-spin" />
      ) : (
        <span className="h-1.5 w-1.5 rounded-full bg-current" />
      )}

      {formatLabel(status)}
    </span>
  );
};

const MetadataItem = ({ label, value }) => {
  return (
    <div>
      <p className="mb-0.5 text-xs text-text-secondary">{label}</p>

      <p className="text-sm font-medium truncate text-text">{value}</p>
    </div>
  );
};

const formatLabel = (value) => {
  if (!value) {
    return "—";
  }

  return value
    .toLowerCase()
    .replace(/_/g, " ")
    .replace(/\b\w/g, (char) => char.toUpperCase());
};

const formatDate = (date) => {
  if (!date) {
    return "—";
  }

  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(new Date(date));
};

export default CurrentExperiment;
