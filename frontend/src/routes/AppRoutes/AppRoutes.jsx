import { Route } from "react-router-dom";

import { AppLayout } from "@/layout/layout.index";


function AppRoutes() {
  return (
    <Route element={<AppLayout />}>
      {/* Future authenticated routes */}

    </Route>
  );
}

export default AppRoutes;