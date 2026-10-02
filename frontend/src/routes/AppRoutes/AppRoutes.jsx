import { lazy } from "react";
import { Route } from "react-router-dom";

import { AppLayout } from "@/layout/layout.index";
import { ROUTES } from "@/constants/routes";

import ProjectLayout from "@/components/app/features/Projects/ProjectLayout";

const Dashboard = lazy(() => import("@/pages/app/Dashboard/Dashboard"));

const Projects = lazy(() => import("@/pages/app/Projects/Projects"));

const Settings = lazy(() => import("@/pages/app/Settings/Settings"));

const ProjectOverview = lazy(
  () => import("@/pages/app/Projects/ProjectOverview"),
);

const ProjectDatasets = lazy(
  () => import("@/pages/app/Projects/ProjectDatasets"),
);

const DatasetAnalysis = lazy(
  () => import("@/components/app/features/Projects/Datasets/DatasetAnalysis"),
);

const ProjectExperiments = lazy(
  () => import("@/pages/app/Projects/ProjectExperiments"),
);

const ExperimentDetails = lazy(
  () => import("@/pages/app/Projects/ExperimentDetails"),
);

const ProjectModels = lazy(() => import("@/pages/app/Projects/ProjectModels"));

const ModelDetails = lazy(() => import("@/pages/app/Projects/ModelDetails"));

const ProjectPredictions = lazy(
  () => import("@/pages/app/Projects/ProjectPredictions"),
);

const PredictionDetails = lazy(
  () => import("@/pages/app/Projects/PredictionDetails"),
);

const AppRoutes = (
  <Route element={<AppLayout />}>
    <Route path={ROUTES.APP} element={<Dashboard />} />

    <Route path={ROUTES.PROJECTS} element={<Projects />} />

    <Route path={ROUTES.SETTINGS} element={<Settings />} />

    <Route path="/app/projects/:projectId" element={<ProjectLayout />}>
      <Route path="overview" element={<ProjectOverview />} />

      <Route path="datasets" element={<ProjectDatasets />} />

      <Route path="datasets/:datasetId" element={<DatasetAnalysis />} />

      <Route path="experiments" element={<ProjectExperiments />} />

      <Route path="experiments/:experimentId" element={<ExperimentDetails />} />

      <Route path="models" element={<ProjectModels />} />

      <Route path="models/:modelId" element={<ModelDetails />} />

      <Route
        path="experiments/:experimentId/predictions"
        element={<ProjectPredictions />}
      />

      <Route
        path="experiments/:experimentId/predictions/:predictionId"
        element={<PredictionDetails />}
      />
    </Route>
  </Route>
);

export default AppRoutes;
