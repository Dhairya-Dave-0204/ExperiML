import { Route } from "react-router-dom";

import { AppLayout } from "@/layout/layout.index";
import { ROUTES } from "@/constants/routes";
import { Dashboard, Settings } from "@/pages/page.index";

const AppRoutes = (
  <Route element={<AppLayout />}>
    <Route path={ROUTES.APP} element={<Dashboard />} />

    <Route
      path={ROUTES.PROJECTS}
      element={<div className="p-10">Projects</div>}
    />

    <Route path={ROUTES.SETTINGS} element={<Settings />} />
  </Route>
);

export default AppRoutes;
