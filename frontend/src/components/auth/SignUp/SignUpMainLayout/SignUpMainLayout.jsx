import React from "react";

import {
  AuthLayout,
  AuthCard,
  SignUpForm,
  AuthFooterUp,
  AuthHeader
} from "@/components/components.index";

function SignUpMainLayout() {
  return (
    <AuthLayout>
      <AuthCard>
        <AuthHeader
          title="Create Account"
          subtitle="Create your ExperiML account to manage datasets, experiments, and machine learning workflows."
        />
        <SignUpForm />
      </AuthCard>
      <AuthFooterUp actionLabel="creating an account" />
    </AuthLayout>
  );
}

export default SignUpMainLayout;
