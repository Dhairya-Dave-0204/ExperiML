import "./App.css";

import { Routes, Route } from "react-router-dom";

import {
  AppRoutes,
  ProtectedRoute,
  GuestRoutes
} from "@/routes/routes.index";

import { ScrollToTop } from "@/components/components.index";

import { NotFound } from "@/pages/page.index";

import Test from "@/Test";

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
// TODO: Create the Documentation page
