import React from "react";

import {
  AuthLayout,
  AuthCard,
  SignUpForm,
  AuthCard,
  AuthFooter,
} from "@/components/components.index";

function SignUpMainLayout() {
  return (
    <AuthLayout>
      <AuthCard>
        <SignUpForm />
      </AuthCard>
      <AuthFooter actionLabel="creating an account" />
    </AuthLayout>
  );
}

export default SignUpMainLayout;
