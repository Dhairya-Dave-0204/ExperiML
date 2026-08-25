import { Route } from "react-router-dom";

import { GuestOnlyRoute, PublicRoutes, AuthRoutes } from "./routes.index";

const GuestRoutes = (
  <Route element={<GuestOnlyRoute />}>
    {PublicRoutes}

    {AuthRoutes}
  </Route>
);

export default GuestRoutes;
