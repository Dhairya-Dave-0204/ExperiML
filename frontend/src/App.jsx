import "./App.css";

import { lazy, Suspense } from "react";

import { Routes, Route } from "react-router-dom";

import { AppRoutes, ProtectedRoute, GuestRoutes } from "@/routes/routes.index";

import { ScrollToTop } from "@/components/common/ScrollToTop/ScrollToTop";

const NotFound = lazy(() => import("@/pages/public/NotFound/NotFound"));

const PageLoadingFallback = () => {
  return (
    <div className="flex items-center justify-center min-h-screen bg-background">
      <div className="flex flex-col items-center">
        <div className="relative flex items-center justify-center w-14 h-14">
          <div className="absolute inset-0 rounded-2xl bg-primary/10 animate-pulse" />

          <div className="absolute w-10 h-10 border-2 rounded-full border-primary/20" />

          <div className="absolute w-10 h-10 border-2 border-transparent rounded-full border-t-primary border-r-primary animate-spin" />

          <div className="relative flex items-center justify-center rounded-lg w-7 h-7 bg-primary/10">
            <span className="w-2.5 h-2.5 rounded-full bg-primary animate-pulse" />
          </div>
        </div>

        <p className="mt-4 text-sm font-medium text-foreground">
          Loading workspace
        </p>

        <p className="mt-1 text-xs text-muted-foreground">
          Preparing your ExperiML environment
        </p>
      </div>
    </div>
  );
};

function App() {
  return (
    <>
      <ScrollToTop />

      <Suspense fallback={<PageLoadingFallback />}>
        <Routes>
          {GuestRoutes}

          <Route element={<ProtectedRoute />}>{AppRoutes}</Route>

          <Route path="*" element={<NotFound />} />
        </Routes>
      </Suspense>
    </>
  );
}

export default App;
