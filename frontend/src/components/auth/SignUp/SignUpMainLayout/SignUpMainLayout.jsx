import React from "react";

import {
  AuthLayout,
  AuthCard,
  SignUpForm,
  AuthFooterUp,
} from "@/components/components.index";

function SignUpMainLayout() {
  return (
    <AuthLayout>
      <AuthCard>
        <SignUpForm />
      </AuthCard>
      <AuthFooterUp actionLabel="creating an account" />
    </AuthLayout>
  );
}

export default SignUpMainLayout;
