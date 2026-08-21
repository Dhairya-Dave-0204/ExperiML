import { Route } from "react-router-dom";

import { AuthLayout } from "@/layout/layout.index";

import { SignIn, SignUp, ForgotPassword } from "@/pages/page.index";

const AuthRoutes = (
  <Route element={<AuthLayout />}>
    <Route path="/signin" element={<SignIn />} />

    <Route path="/signup" element={<SignUp />} />

    <Route path="/forgot-password" element={<ForgotPassword />} />
  </Route>
);

export default AuthRoutes;
