import { Route } from "react-router-dom";

import { AppLayout } from "@/layout/layout.index";


const AppRoutes = (
  <Route element={<AppLayout />}>

    <Route
      path="/app"
      element={
        <div className="p-10">
          Protected App Route
        </div>
      }
    />

  </Route>
);


export default AppRoutes;