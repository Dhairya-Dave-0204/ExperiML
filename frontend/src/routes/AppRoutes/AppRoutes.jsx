import { Route } from "react-router-dom";

import { AppLayout } from "@/layout/layout.index";
import { ROUTES } from "@/constants/routes";

const AppRoutes = (
  <Route element={<AppLayout />}>
    <Route path={ROUTES.APP} element={<div className="p-10">Dashboard</div>} />

    <Route
      path={ROUTES.PROJECTS}
      element={<div className="p-10">Projects</div>}
    />

    <Route
      path={ROUTES.SETTINGS}
      element={<div className="p-10">Settings</div>}
    />
  </Route>
);

export default AppRoutes;
