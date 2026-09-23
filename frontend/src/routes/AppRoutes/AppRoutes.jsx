import { Route } from "react-router-dom";

import { AppLayout } from "@/layout/layout.index";
import { ROUTES } from "@/constants/routes";
import {
  Dashboard,
  Projects,
  Settings,
  ProjectOverview,
} from "@/pages/page.index";

const AppRoutes = (
  <Route element={<AppLayout />}>
    <Route path={ROUTES.APP} element={<Dashboard />} />

    <Route path={ROUTES.PROJECTS} element={<Projects />} />

    <Route path={ROUTES.SETTINGS} element={<Settings />} />

    <Route path={ROUTES.PROJECT_OVERVIEW} element={<ProjectOverview />} />
  </Route>
);

export default AppRoutes;
