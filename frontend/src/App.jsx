import "./App.css";

import { Routes, Route } from "react-router-dom";

import {
  PublicRoutes,
  AuthRoutes,
  AppRoutes,
  ProtectedRoute,
} from "@/routes/routes.index";

import { ScrollToTop } from "@/components/components.index";

import { NotFound } from "@/pages/page.index";

import Test from "@/Test";

function App() {
  return (
    <>
      <ScrollToTop />

      <Routes>
        {PublicRoutes}

        {AuthRoutes}

        <Route element={<ProtectedRoute />}>
          {AppRoutes}
        </Route>

        <Route path="/test" element={<Test />} />

        <Route path="*" element={<NotFound />} />
      </Routes>
    </>
  );
}

export default App;
// TODO: Create the Documentation and reset pass page
