import { useNavigate } from "react-router-dom";
import { ArrowRight, Loader2 } from "lucide-react";

import { ROUTES } from "@/constants/routes";

const CurrentExperiment = ({ projectId, experiment }) => {
  const navigate = useNavigate();

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

              <StatusBadge status={experiment.status} />
            </div>

            <div className="grid grid-cols-1 text-sm gap-x-8 gap-y-2 text-text-secondary sm:grid-cols-2 lg:grid-cols-4">
              <MetadataItem label="Dataset" value={experiment.dataset} />

              <MetadataItem label="Algorithm" value={experiment.algorithm} />

              <MetadataItem
                label="Problem type"
                value={experiment.problemType}
              />

              <MetadataItem label="Started" value={experiment.started} />
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
    TRAINING: "bg-primary-light text-primary",
    COMPLETED: "bg-success/10 text-success",
    FAILED: "bg-danger/10 text-danger",
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

      {status}
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

export default CurrentExperiment;
