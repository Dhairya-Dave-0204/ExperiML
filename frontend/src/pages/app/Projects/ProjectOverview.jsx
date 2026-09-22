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

import {
  PROJECT_TABS,
  projectWorkspacePath,
  projectsListPath,
} from "@/constants/routes";

/* ================================================================
   UI MOCK DATA
   ---------------------------------------------------------------
   Temporary data for UI prototyping.

   This will be replaced with projectService data during the
   backend-integration phase.
   ================================================================ */

const PROJECT = {
  name: "Customer Churn Prediction",
  description:
    "Predict customer churn using historical customer behavior data.",
  created: "Aug 3, 2026",
  updated: "17 Sept 2026",
  problemType: "Classification",
};

const SUMMARY = [
  {
    label: "Datasets",
    value: 4,
    icon: Database,
  },
  {
    label: "Experiments",
    value: 12,
    icon: FlaskConical,
  },
  {
    label: "Models",
    value: 7,
    icon: Boxes,
  },
  {
    label: "Predictions",
    value: 23,
    icon: Target,
  },
];

const CURRENT_EXPERIMENT = {
  name: "Customer Churn — Random Forest Experiment",
  dataset: "customer_churn_v2",
  algorithm: "Random Forest",
  problemType: "Classification",
  status: "TRAINING",
  started: "12 minutes ago",
};

const NAV_TABS = [
  {
    key: PROJECT_TABS.OVERVIEW,
    label: "Overview",
  },
  {
    key: PROJECT_TABS.DATASETS,
    label: "Datasets",
  },
  {
    key: PROJECT_TABS.EXPERIMENTS,
    label: "Experiments",
  },
  {
    key: PROJECT_TABS.MODELS,
    label: "Models",
  },
  {
    key: PROJECT_TABS.PREDICTIONS,
    label: "Predictions",
  },
];

const WORKFLOW = [
  {
    label: "Datasets",
    description: "Upload and analyze your project data.",
    completed: true,
    icon: Database,
    tab: PROJECT_TABS.DATASETS,
  },
  {
    label: "Experiments",
    description: "Configure and train machine learning models.",
    completed: true,
    icon: FlaskConical,
    tab: PROJECT_TABS.EXPERIMENTS,
  },
  {
    label: "Models",
    description: "Review trained models and evaluation results.",
    completed: true,
    icon: Boxes,
    tab: PROJECT_TABS.MODELS,
  },
  {
    label: "Predictions",
    description: "Generate predictions using trained models.",
    completed: false,
    icon: Target,
    tab: PROJECT_TABS.PREDICTIONS,
  },
];

/* ================================================================
   STATUS
   ================================================================ */

const STATUS_STYLES = {
  COMPLETED: "bg-success/10 text-success",
  READY: "bg-success/10 text-success",
  TRAINING: "bg-warning/10 text-warning",
  PROCESSING: "bg-warning/10 text-warning",
  QUEUED: "border border-border bg-surface-soft text-text-secondary",
  FAILED: "bg-danger/10 text-danger",
  CANCELLED: "border border-border bg-surface-soft text-text-secondary",
};

function StatusPill({ status }) {
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px] font-bold tracking-wide ${
        STATUS_STYLES[status] ??
        "bg-surface-soft text-text-secondary"
      }`}
    >
      {status === "TRAINING" || status === "PROCESSING" ? (
        <Loader2
          size={11}
          strokeWidth={2.5}
          className="animate-spin"
        />
      ) : null}

      {status}
    </span>
  );
}

/* ================================================================
   SECTION CARD
   ================================================================ */

function SectionCard({
  title,
  description,
  action,
  children,
}) {
  return (
    <section className="border rounded-2xl border-border bg-surface">
      <div className="flex flex-wrap items-start justify-between gap-3 px-5 py-4 border-b border-border sm:px-6">
        <div>
          <h2 className="font-heading text-[15px] font-bold text-text">
            {title}
          </h2>

          {description && (
            <p className="mt-0.5 text-xs text-text-secondary">
              {description}
            </p>
          )}
        </div>

        {action}
      </div>

      {children}
    </section>
  );
}

/* ================================================================
   PROJECT SUMMARY
   ================================================================ */

function ProjectSummary() {
  return (
    <div className="grid grid-cols-2 overflow-hidden border rounded-2xl border-border bg-surface sm:grid-cols-4">
      {SUMMARY.map(({ label, value, icon: Icon }, index) => (
        <div
          key={label}
          className={`flex items-center gap-3 px-5 py-5 ${
            index > 0
              ? "border-l-0 border-border sm:border-l"
              : ""
          } ${
            index >= 2
              ? "border-t border-border sm:border-t-0"
              : ""
          }`}
        >
          <div className="flex items-center justify-center rounded-lg h-9 w-9 shrink-0 bg-surface-soft">
            <Icon
              size={16}
              strokeWidth={1.8}
              className="text-text-secondary"
            />
          </div>

          <div className="min-w-0">
            <div className="font-mono text-lg font-bold leading-none text-text">
              {value}
            </div>

            <div className="mt-1 text-xs text-text-secondary">
              {label}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

/* ================================================================
   CURRENT EXPERIMENT
   ================================================================ */

function CurrentExperiment({ onView }) {
  return (
    <SectionCard
      title="Current experiment"
      description="The latest active ML execution in this project."
    >
      <div className="p-5 sm:p-6">
        <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-2 mb-2">
              <StatusPill
                status={CURRENT_EXPERIMENT.status}
              />

              <span className="text-xs text-text-secondary">
                Started {CURRENT_EXPERIMENT.started}
              </span>
            </div>

            <h3 className="text-base font-bold break-words font-heading text-text sm:text-lg">
              {CURRENT_EXPERIMENT.name}
            </h3>

            <div className="flex flex-wrap mt-3 text-xs gap-x-5 gap-y-2 text-text-secondary">
              <span>
                Dataset:{" "}
                <span className="font-mono text-text">
                  {CURRENT_EXPERIMENT.dataset}
                </span>
              </span>

              <span>
                Algorithm:{" "}
                <span className="text-text">
                  {CURRENT_EXPERIMENT.algorithm}
                </span>
              </span>

              <span>
                Problem:{" "}
                <span className="text-text">
                  {CURRENT_EXPERIMENT.problemType}
                </span>
              </span>
            </div>
          </div>

          <button
            type="button"
            onClick={onView}
            className="inline-flex w-fit shrink-0 items-center gap-2 rounded-lg border border-border bg-surface px-3.5 py-2 text-sm font-semibold text-text transition-colors hover:bg-surface-soft"
          >
            View experiment
            <ArrowRight size={14} />
          </button>
        </div>
      </div>
    </SectionCard>
  );
}

/* ================================================================
   PROJECT WORKFLOW
   ================================================================ */

function ProjectWorkflow({ onNavigate }) {
  return (
    <SectionCard
      title="Project workflow"
      description="The main stages of your machine learning project."
    >
      <div className="divide-y divide-border">
        {WORKFLOW.map(
          ({
            label,
            description,
            completed,
            icon: Icon,
            tab,
          }) => (
            <button
              key={label}
              type="button"
              onClick={() => onNavigate(tab)}
              className="flex items-center w-full gap-4 px-5 py-4 text-left transition-colors group hover:bg-surface-soft sm:px-6"
            >
              <div className="flex items-center justify-center rounded-lg h-9 w-9 shrink-0 bg-surface-soft">
                <Icon
                  size={16}
                  strokeWidth={1.8}
                  className="text-text-secondary"
                />
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-semibold text-text">
                    {label}
                  </span>

                  {completed ? (
                    <CheckCircle2
                      size={14}
                      strokeWidth={2}
                      className="text-success"
                    />
                  ) : (
                    <Circle
                      size={14}
                      strokeWidth={1.8}
                      className="text-text-secondary"
                    />
                  )}
                </div>

                <p className="mt-0.5 text-xs text-text-secondary">
                  {description}
                </p>
              </div>

              <ChevronRight
                size={15}
                strokeWidth={1.8}
                className="shrink-0 text-text-secondary transition-transform group-hover:translate-x-0.5"
              />
            </button>
          )
        )}
      </div>
    </SectionCard>
  );
}

/* ================================================================
   PROJECT INFORMATION
   ================================================================ */

function ProjectInformation() {
  return (
    <SectionCard
      title="Project information"
      description="Basic information about this project."
    >
      <div className="grid grid-cols-1 divide-y divide-border sm:grid-cols-3 sm:divide-x sm:divide-y-0">
        <div className="px-5 py-4 sm:px-6">
          <div className="text-xs text-text-secondary">
            Problem type
          </div>

          <div className="mt-1 text-sm font-semibold text-text">
            {PROJECT.problemType}
          </div>
        </div>

        <div className="px-5 py-4 sm:px-6">
          <div className="text-xs text-text-secondary">
            Created
          </div>

          <div className="mt-1 text-sm font-semibold text-text">
            {PROJECT.created}
          </div>
        </div>

        <div className="px-5 py-4 sm:px-6">
          <div className="text-xs text-text-secondary">
            Last updated
          </div>

          <div className="mt-1 text-sm font-semibold text-text">
            {PROJECT.updated}
          </div>
        </div>
      </div>
    </SectionCard>
  );
}

/* ================================================================
   PROJECT OVERVIEW
   ================================================================ */

function ProjectOverview() {
  const { projectId } = useParams();
  const navigate = useNavigate();

  function navigateToProjectTab(tab) {
    navigate(
      projectWorkspacePath(projectId, tab)
    );
  }

  function handleCreateExperiment() {
    navigateToProjectTab(
      PROJECT_TABS.EXPERIMENTS
    );
  }

  function handleViewExperiment() {
    navigateToProjectTab(
      PROJECT_TABS.EXPERIMENTS
    );
  }

  return (
    <div className="flex-1 min-h-full">
      {/* ============================================================
          PROJECT HEADER
          ============================================================ */}

      <header className="px-4 py-5 border-b border-border sm:px-6 lg:px-8">
        <div className="max-w-5xl mx-auto">
          <nav
            aria-label="Breadcrumb"
            className="flex items-center gap-1.5 text-xs text-text-secondary"
          >
            <NavLink
              to={projectsListPath()}
              className="transition-colors hover:text-text"
            >
              Projects
            </NavLink>

            <ChevronRight
              size={13}
              strokeWidth={2}
            />

            <span className="truncate text-text">
              {PROJECT.name}
            </span>
          </nav>

          <div className="flex flex-col gap-4 mt-5 sm:flex-row sm:items-end sm:justify-between">
            <div className="min-w-0">
              <div className="flex flex-wrap items-center gap-2 mb-2">
                <span className="rounded-md bg-surface-soft px-2 py-1 font-mono text-[11px] font-medium text-text-secondary">
                  PROJECT
                </span>

                <span className="text-xs text-text-secondary">
                  {PROJECT.problemType}
                </span>
              </div>

              <h1 className="text-2xl font-extrabold tracking-tight break-words font-heading text-text sm:text-3xl">
                {PROJECT.name}
              </h1>

              <p className="max-w-2xl mt-2 text-sm leading-relaxed text-text-secondary">
                {PROJECT.description}
              </p>
            </div>

            <button
              type="button"
              onClick={handleCreateExperiment}
              className="inline-flex items-center gap-2 px-4 py-2 text-sm font-semibold text-white transition-colors duration-150 rounded-lg w-fit shrink-0 bg-primary hover:bg-primary-dark"
            >
              <Plus
                size={16}
                strokeWidth={2.25}
              />

              Create Experiment
            </button>
          </div>
        </div>
      </header>

      {/* ============================================================
          PROJECT NAVIGATION
          ============================================================ */}

      <div className="px-4 border-b border-border sm:px-6 lg:px-8">
        <div className="max-w-5xl mx-auto">
          <nav
            aria-label="Project navigation"
            className="flex gap-1 py-2 overflow-x-auto"
          >
            {NAV_TABS.map((tab) => (
              <NavLink
                key={tab.key}
                to={projectWorkspacePath(
                  projectId,
                  tab.key
                )}
                end={
                  tab.key ===
                  PROJECT_TABS.OVERVIEW
                }
                className={({ isActive }) =>
                  `shrink-0 whitespace-nowrap rounded-lg px-3 py-1.5 text-sm font-medium transition-colors duration-150 ${
                    isActive
                      ? "bg-primary-light text-primary"
                      : "text-text-secondary hover:bg-surface-soft hover:text-text"
                  }`
                }
              >
                {tab.label}
              </NavLink>
            ))}
          </nav>
        </div>
      </div>

      {/* ============================================================
          OVERVIEW CONTENT
          ============================================================ */}

      <main className="px-4 py-6 sm:px-6 lg:px-8">
        <div className="max-w-5xl mx-auto space-y-6">
          <ProjectSummary />

          <CurrentExperiment
            onView={handleViewExperiment}
          />

          <ProjectWorkflow
            onNavigate={navigateToProjectTab}
          />

          <ProjectInformation />
        </div>
      </main>
    </div>
  );
}

export default ProjectOverview;