import { Route } from "react-router-dom";

import { AuthLayout } from "@/layout/layout.index";

import { SignIn, SignUp, ForgotPassword, ResetPassword } from "@/pages/page.index";

import { ROUTES } from "@/constants/routes" 

const AuthRoutes = (
  <Route element={<AuthLayout />}>
    <Route path={ROUTES.SIGN_IN} element={<SignIn />} />

    <Route path={ROUTES.SIGN_UP} element={<SignUp />} />

    <Route path={ROUTES.FORGOT_PASS} element={<ForgotPassword />} />
    
    <Route path={ROUTES.RESET_PASS} element={<ResetPassword />} />
  </Route>
);

export default AuthRoutes;
