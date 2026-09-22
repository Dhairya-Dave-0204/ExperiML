import { NavLink, useNavigate, useParams } from "react-router-dom";
import {
  Database,
  FlaskConical,
  Boxes,
  Target,
  ChevronRight,
  ArrowRight,
  Loader2,
  CheckCircle2,
  Circle,
  Plus,
} from "lucide-react";

import { ROUTES } from "@/constants/routes";

// -----------------------------------------------------------------------------
// Mock project data
// Replace with backend data later.
// -----------------------------------------------------------------------------

const PROJECT = {
  name: "Customer Churn Prediction",
  description:
    "Predict customer churn using historical customer behavior data.",
  created: "Aug 3, 2026",
  updated: "17 Sept 2026",
  problemType: "Classification",
};

// -----------------------------------------------------------------------------
// Mock current experiment
// Replace with backend data later.
// -----------------------------------------------------------------------------

const CURRENT_EXPERIMENT = {
  name: "Customer Churn — Random Forest Experiment",
  dataset: "customer_churn_v2",
  algorithm: "Random Forest",
  problemType: "Classification",
  status: "TRAINING",
  started: "12 minutes ago",
};

// -----------------------------------------------------------------------------
// Mock workflow state
// Replace with backend-driven state later.
// -----------------------------------------------------------------------------

const WORKFLOW = [
  {
    id: ROUTES.PROJECT_TABS.DATASETS,
    label: "Datasets",
    description: "Upload and analyze your data",
    completed: true,
    icon: Database,
  },
  {
    id: ROUTES.PROJECT_TABS.EXPERIMENTS,
    label: "Experiments",
    description: "Configure and run ML experiments",
    completed: true,
    icon: FlaskConical,
  },
  {
    id: ROUTES.PROJECT_TABS.MODELS,
    label: "Models",
    description: "Review trained models and results",
    completed: true,
    icon: Boxes,
  },
  {
    id: ROUTES.PROJECT_TABS.PREDICTIONS,
    label: "Predictions",
    description: "Generate predictions from trained models",
    completed: false,
    icon: Target,
  },
];

// -----------------------------------------------------------------------------
// Helpers
// -----------------------------------------------------------------------------

const getStatusStyles = (status) => {
  switch (status) {
    case "TRAINING":
      return {
        wrapper: "bg-primary-light text-primary",
        dot: "bg-primary",
      };

    case "COMPLETED":
      return {
        wrapper: "bg-success/10 text-success",
        dot: "bg-success",
      };

    case "FAILED":
      return {
        wrapper: "bg-danger/10 text-danger",
        dot: "bg-danger",
      };

    default:
      return {
        wrapper: "bg-surface-soft text-text-secondary",
        dot: "bg-text-secondary",
      };
  }
};

// -----------------------------------------------------------------------------
// Main component
// -----------------------------------------------------------------------------

const ProjectOverview = () => {
  const navigate = useNavigate();
  const { projectId } = useParams();

  const projectTabs = [
    {
      label: "Overview",
      value: ROUTES.PROJECT_TABS.OVERVIEW,
    },
    {
      label: "Datasets",
      value: ROUTES.PROJECT_TABS.DATASETS,
    },
    {
      label: "Experiments",
      value: ROUTES.PROJECT_TABS.EXPERIMENTS,
    },
    {
      label: "Models",
      value: ROUTES.PROJECT_TABS.MODELS,
    },
    {
      label: "Predictions",
      value: ROUTES.PROJECT_TABS.PREDICTIONS,
    },
  ];

  const handleCreateExperiment = () => {
    navigate(ROUTES.PROJECT_TAB(projectId, ROUTES.PROJECT_TABS.EXPERIMENTS));
  };

  return (
    <div className="min-h-full bg-surface">
      <div className="px-6 py-8 mx-auto max-w-7xl lg:px-8">
        {/* ---------------------------------------------------------------- */}
        {/* Breadcrumb                                                       */}
        {/* ---------------------------------------------------------------- */}

        <div className="flex items-center gap-2 mb-6 text-sm text-text-secondary">
          <button
            type="button"
            onClick={() => navigate(ROUTES.PROJECTS)}
            className="transition-colors hover:text-text"
          >
            Projects
          </button>

          <ChevronRight className="w-4 h-4" />

          <span className="text-text">{PROJECT.name}</span>
        </div>

        {/* ---------------------------------------------------------------- */}
        {/* Project Header                                                   */}
        {/* ---------------------------------------------------------------- */}

        <div className="flex flex-col gap-5 mb-8 sm:flex-row sm:items-start sm:justify-between">
          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-3 mb-2">
              <h1 className="text-2xl font-semibold tracking-tight font-heading text-text">
                {PROJECT.name}
              </h1>

              <span className="rounded-full bg-primary-light px-2.5 py-1 text-xs font-medium text-primary">
                {PROJECT.problemType}
              </span>
            </div>

            <p className="max-w-2xl text-sm leading-6 text-text-secondary">
              {PROJECT.description}
            </p>
          </div>

          <button
            type="button"
            onClick={handleCreateExperiment}
            className="inline-flex shrink-0 items-center justify-center gap-2 rounded-lg bg-primary px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-primary-dark"
          >
            <Plus className="w-4 h-4" />
            Create Experiment
          </button>
        </div>

        {/* ---------------------------------------------------------------- */}
        {/* Project Navigation                                               */}
        {/* ---------------------------------------------------------------- */}

        <nav className="mb-8 border-b border-border">
          <div className="flex gap-6 overflow-x-auto">
            {projectTabs.map((tab) => (
              <NavLink
                key={tab.value}
                to={ROUTES.PROJECT_TAB(projectId, tab.value)}
                className={({ isActive }) =>
                  [
                    "relative whitespace-nowrap pb-3 text-sm font-medium transition-colors",
                    isActive
                      ? "text-primary"
                      : "text-text-secondary hover:text-text",
                  ].join(" ")
                }
              >
                {({ isActive }) => (
                  <>
                    {tab.label}

                    {isActive && (
                      <span className="absolute inset-x-0 bottom-0 h-0.5 rounded-full bg-primary" />
                    )}
                  </>
                )}
              </NavLink>
            ))}
          </div>
        </nav>

        {/* ---------------------------------------------------------------- */}
        {/* Project Summary                                                  */}
        {/* ---------------------------------------------------------------- */}

        <section className="mb-8">
          <SectionHeading
            title="Project Summary"
            description="A high-level view of the work in this project."
          />

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
            <SummaryCard icon={Database} label="Datasets" value="4" />

            <SummaryCard icon={FlaskConical} label="Experiments" value="12" />

            <SummaryCard icon={Boxes} label="Models" value="7" />

            <SummaryCard icon={Target} label="Predictions" value="23" />
          </div>
        </section>

        {/* ---------------------------------------------------------------- */}
        {/* Current Experiment                                               */}
        {/* ---------------------------------------------------------------- */}

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
                    {CURRENT_EXPERIMENT.name}
                  </h3>

                  <StatusBadge status={CURRENT_EXPERIMENT.status} />
                </div>

                <div className="grid grid-cols-1 text-sm gap-x-8 gap-y-2 text-text-secondary sm:grid-cols-2 lg:grid-cols-4">
                  <MetadataItem
                    label="Dataset"
                    value={CURRENT_EXPERIMENT.dataset}
                  />

                  <MetadataItem
                    label="Algorithm"
                    value={CURRENT_EXPERIMENT.algorithm}
                  />

                  <MetadataItem
                    label="Problem type"
                    value={CURRENT_EXPERIMENT.problemType}
                  />

                  <MetadataItem
                    label="Started"
                    value={CURRENT_EXPERIMENT.started}
                  />
                </div>
              </div>

              <button
                type="button"
                onClick={() =>
                  navigate(
                    ROUTES.PROJECT_TAB(
                      projectId,
                      ROUTES.PROJECT_TABS.EXPERIMENTS,
                    ),
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

        {/* ---------------------------------------------------------------- */}
        {/* Project Workflow                                                 */}
        {/* ---------------------------------------------------------------- */}

        <section className="mb-8">
          <SectionHeading
            title="Project workflow"
            description="The typical flow for building and using an ML solution."
          />

          <div className="p-6 bg-white border rounded-xl border-border">
            <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
              {WORKFLOW.map((step, index) => {
                const Icon = step.icon;

                return (
                  <div key={step.id} className="relative">
                    <button
                      type="button"
                      onClick={() =>
                        navigate(ROUTES.PROJECT_TAB(projectId, step.id))
                      }
                      className="w-full text-left group"
                    >
                      <div className="flex items-center justify-between mb-4">
                        <div
                          className={[
                            "flex h-10 w-10 items-center justify-center rounded-lg",
                            step.completed
                              ? "bg-success/10 text-success"
                              : "bg-surface-soft text-text-secondary",
                          ].join(" ")}
                        >
                          <Icon className="w-5 h-5" />
                        </div>

                        {step.completed ? (
                          <CheckCircle2 className="w-5 h-5 text-success" />
                        ) : (
                          <Circle className="w-5 h-5 text-border" />
                        )}
                      </div>

                      <h3 className="mb-1 text-sm font-semibold text-text group-hover:text-primary">
                        {step.label}
                      </h3>

                      <p className="text-sm leading-5 text-text-secondary">
                        {step.description}
                      </p>
                    </button>

                    {index < WORKFLOW.length - 1 && (
                      <div className="absolute -right-4.5 top-5 hidden md:block">
                        <ChevronRight className="w-4 h-4 text-border" />
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* ---------------------------------------------------------------- */}
        {/* Project Information                                              */}
        {/* ---------------------------------------------------------------- */}

        <section>
          <SectionHeading
            title="Project Information"
            description="Basic information about this project."
          />

          <div className="bg-white border rounded-xl border-border">
            <div className="grid grid-cols-1 divide-y divide-border sm:grid-cols-2 sm:divide-x sm:divide-y-0">
              <InfoItem label="Problem type" value={PROJECT.problemType} />

              <InfoItem label="Created" value={PROJECT.created} />

              <InfoItem label="Last updated" value={PROJECT.updated} />

              <InfoItem label="Project ID" value={projectId || "—"} mono />
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

// -----------------------------------------------------------------------------
// Section Heading
// -----------------------------------------------------------------------------

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

// -----------------------------------------------------------------------------
// Summary Card
// -----------------------------------------------------------------------------

const SummaryCard = ({ icon: Icon, label, value }) => {
  return (
    <div className="p-5 bg-white border rounded-xl border-border">
      <div className="flex items-center justify-center mb-4 rounded-lg h-9 w-9 bg-primary-light text-primary">
        <Icon className="h-4.5 w-4.5" />
      </div>

      <p className="text-sm text-text-secondary">{label}</p>

      <p className="mt-1 text-2xl font-semibold tracking-tight font-heading text-text">
        {value}
      </p>
    </div>
  );
};

// -----------------------------------------------------------------------------
// Status Badge
// -----------------------------------------------------------------------------

const StatusBadge = ({ status }) => {
  const styles = getStatusStyles(status);

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium ${styles.wrapper}`}
    >
      {status === "TRAINING" ? (
        <Loader2 className="w-3 h-3 animate-spin" />
      ) : (
        <span className={`h-1.5 w-1.5 rounded-full ${styles.dot}`} />
      )}

      {status}
    </span>
  );
};

// -----------------------------------------------------------------------------
// Metadata Item
// -----------------------------------------------------------------------------

const MetadataItem = ({ label, value }) => {
  return (
    <div>
      <p className="mb-0.5 text-xs text-text-secondary">{label}</p>
      <p className="text-sm font-medium truncate text-text">{value}</p>
    </div>
  );
};

// -----------------------------------------------------------------------------
// Information Item
// -----------------------------------------------------------------------------

const InfoItem = ({ label, value, mono = false }) => {
  return (
    <div className="p-5">
      <p className="mb-1 text-xs font-medium tracking-wide uppercase text-text-secondary">
        {label}
      </p>

      <p
        className={[
          "text-sm font-medium text-text",
          mono ? "font-mono text-xs" : "",
        ].join(" ")}
      >
        {value}
      </p>
    </div>
  );
};

export default ProjectOverview;
