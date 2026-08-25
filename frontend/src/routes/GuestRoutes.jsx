import { Route } from "react-router-dom";

import { PublicRoutes, AuthRoutes, GuestOnlyRoute } from "./routes.index";

const GuestRoutes = (
  <>
    {PublicRoutes}

    <Route element={<GuestOnlyRoute />}>
      {AuthRoutes}
    </Route>
  </>
);

export default GuestRoutes;
