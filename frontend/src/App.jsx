import "./App.css";

import { PublicRoutes, AuthRoutes, AppRoutes } from "@/routes/routes.index";

import { ScrollToTop } from "@/components/components.index";

function App() {
  return (
    <>
      <ScrollToTop />

      <PublicRoutes />

      <AuthRoutes />

      <AppRoutes />
    </>
  );
}

export default App;
// TODO: Add the reset password page