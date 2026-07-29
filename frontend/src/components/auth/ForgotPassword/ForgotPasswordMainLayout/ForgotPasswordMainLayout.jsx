import {
  AuthLayout,
  AuthCard,
  AuthFooter,
} from "@/components/components.index";

import ForgotPasswordForm from "./ForgotPasswordForm";

function ForgotPasswordMainLayout() {
  return (
    <AuthLayout>
      <AuthCard>
        <ForgotPasswordForm />
      </AuthCard>

      <AuthFooter actionLabel="requesting a password reset" />
    </AuthLayout>
  );
}

export default ForgotPasswordMainLayout;
