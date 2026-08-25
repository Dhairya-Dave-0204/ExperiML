import { Navigate, Outlet, useLocation } from "react-router-dom";

import { useAuth } from "@/context/AuthContext";
import { ROUTES } from "@/constants/routes";
import { AuthLoadingScreen } from "@/components/components.index";

function ProtectedRoute() {
  const { isAuthenticated, isLoading, isLoggingOut } = useAuth();

  const location = useLocation();

  if (isLoading || isLoggingOut) {
    return <AuthLoadingScreen />;
  }

  if (!isAuthenticated) {
    return (
      <Navigate
        to={ROUTES.SIGN_IN}
        replace
        state={{
          from: location,
        }}
      />
    );
  }

  return <Outlet />;
}

export default ProtectedRoute;
