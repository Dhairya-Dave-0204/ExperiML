import { useNavigate, useParams } from "react-router-dom";

import { ROUTES } from "@/constants/routes";

import {
  ProjectHeader,
  ProjectNavigation,
  ProjectSummary,
  CurrentExperiment,
  ProjectWorkflow,
  ProjectInformation,
} from "@/components/components.index";

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
  },
  {
    id: ROUTES.PROJECT_TABS.EXPERIMENTS,
    label: "Experiments",
    description: "Configure and run ML experiments",
    completed: true,
  },
  {
    id: ROUTES.PROJECT_TABS.MODELS,
    label: "Models",
    description: "Review trained models and results",
    completed: true,
  },
  {
    id: ROUTES.PROJECT_TABS.PREDICTIONS,
    label: "Predictions",
    description: "Generate predictions from trained models",
    completed: false,
  },
];

const ProjectOverview = () => {
  const navigate = useNavigate();
  const { projectId } = useParams();

  const handleCreateExperiment = () => {
    navigate(ROUTES.PROJECT_TAB(projectId, ROUTES.PROJECT_TABS.EXPERIMENTS));
  };

  return (
    <div className="min-h-full bg-surface">
      <div className="px-6 py-8 mx-auto max-w-7xl lg:px-8">
        <ProjectHeader
          project={PROJECT}
          onCreateExperiment={handleCreateExperiment}
        />

        <ProjectNavigation projectId={projectId} />

        <ProjectSummary />

        <CurrentExperiment
          projectId={projectId}
          experiment={CURRENT_EXPERIMENT}
        />

        <ProjectWorkflow projectId={projectId} workflow={WORKFLOW} />

        <ProjectInformation project={PROJECT} projectId={projectId} />
      </div>
    </div>
  );
};

export default ProjectOverview;
