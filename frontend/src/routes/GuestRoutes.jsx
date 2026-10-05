import { Route } from "react-router-dom";

import PublicRoutes from "@/routes/PublicRoutes/PublicRoutes"
import AuthRoutes from "@/routes/AuthRoutes/AuthRoutes"
import GuestOnlyRoute from "@/routes/GuestOnlyRoute/GuestOnlyRoute"

const GuestRoutes = (
  <>
    {PublicRoutes}

    <Route element={<GuestOnlyRoute />}>
      {AuthRoutes}
    </Route>
  </>
);

export default GuestRoutes;
