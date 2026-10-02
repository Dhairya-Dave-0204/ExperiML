import "./App.css";

import { lazy, Suspense } from "react";

import { Loader2 } from "lucide-react";

import { Routes, Route } from "react-router-dom";

import { AppRoutes, ProtectedRoute, GuestRoutes } from "@/routes/routes.index";

import { ScrollToTop } from "@/components/components.index";

import Test from "@/Test";

const NotFound = lazy(() => import("@/pages/public/NotFound/NotFound"));

const PageLoadingFallback = () => {
  return (
    <div className="flex items-center justify-center min-h-screen bg-background">
      <Loader2 className="w-5 h-5 animate-spin text-muted-foreground" />
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

          <Route path="/test" element={<Test />} />

          <Route path="*" element={<NotFound />} />
        </Routes>
      </Suspense>
    </>
  );
}

export default App;
