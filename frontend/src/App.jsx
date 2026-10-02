import "./App.css";

import { lazy } from "react";
import { Routes, Route } from "react-router-dom";

import { AppRoutes, ProtectedRoute, GuestRoutes } from "@/routes/routes.index";

import { ScrollToTop } from "@/components/components.index";

import Test from "@/Test";

const NotFound = lazy(() => import("@/pages/public/NotFound/NotFound"));

function App() {
  return (
    <>
      <ScrollToTop />

      <Routes>
        {GuestRoutes}

        <Route element={<ProtectedRoute />}>{AppRoutes}</Route>

        <Route path="/test" element={<Test />} />

        <Route path="*" element={<NotFound />} />
      </Routes>
    </>
  );
}

export default App;
