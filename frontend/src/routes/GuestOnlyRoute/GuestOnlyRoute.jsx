import { Navigate, Outlet } from "react-router-dom";

import { useAuth } from "@/context/AuthContext";
import { ROUTES } from "@/constants/routes";
import { AuthLoadingScreen } from "@/components/components.index";


function GuestOnlyRoute() {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return <AuthLoadingScreen />;
  }

  if (isAuthenticated) {
    return <Navigate to={ROUTES.APP} replace />;
  }

  return <Outlet />;
}

export default GuestOnlyRoute;
