import { Route } from "react-router-dom";

import { AppLayout } from "@/layout/layout.index";
import { ROUTES } from "@/constants/routes";

import { ProjectLayout, DatasetAnalysis } from "@/components/components.index";

import {
  Dashboard,
  Projects,
  Settings,
  ProjectOverview,
  ProjectDatasets,
  ProjectExperiments,
} from "@/pages/page.index";

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
    </Route>
  </Route>
);

export default AppRoutes;
