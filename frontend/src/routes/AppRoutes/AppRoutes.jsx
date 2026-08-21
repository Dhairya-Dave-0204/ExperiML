import React from "react";
import { Routes, Route } from "react-router-dom";

import { AppLayout } from "@/layout/layout.index";

function AppRoutes() {
  return (
    <Routes>
      <Route element={<AppLayout />}>
        {/* Authenticated routes will be added here */}
      </Route>
    </Routes>
  );
}

export default AppRoutes;
