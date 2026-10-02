import { lazy } from "react";
import { Route } from "react-router-dom";

import { AuthLayout } from "@/layout/layout.index";
import { ROUTES } from "@/constants/routes";

const SignIn = lazy(() => import("@/pages/auth/SignIn/SignIn"));

const SignUp = lazy(() => import("@/pages/auth/SignUp/SignUp"));

const ForgotPassword = lazy(
  () => import("@/pages/auth/ForgotPassword/ForgotPassword"),
);

const ResetPassword = lazy(
  () => import("@/pages/auth/ResetPassword/ResetPassword"),
);

const AuthRoutes = (
  <Route element={<AuthLayout />}>
    <Route path={ROUTES.SIGN_IN} element={<SignIn />} />

    <Route path={ROUTES.SIGN_UP} element={<SignUp />} />

    <Route path={ROUTES.FORGOT_PASS} element={<ForgotPassword />} />

    <Route path={ROUTES.RESET_PASS} element={<ResetPassword />} />
  </Route>
);

export default AuthRoutes;
