import { Route } from "react-router-dom";

import { AuthLayout } from "@/layout/layout.index";

import { SignIn, SignUp, ForgotPassword } from "@/pages/page.index";

function AuthRoutes() {
  return (
    <Route element={<AuthLayout />}>
      <Route path="/sign-in" element={<SignIn />} />

      <Route path="/sign-up" element={<SignUp />} />

      <Route path="/forgot-password" element={<ForgotPassword />} />
    </Route>
  );
}

export default AuthRoutes;
