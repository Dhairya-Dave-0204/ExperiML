import {
  AuthLayout,
  AuthCard,
  AuthFooter,
  ResetPasswordForm,
} from "@/components/components.index";

function ResetPasswordMainLayout() {
  return (
    <AuthLayout>
      <AuthCard>
        <ResetPasswordForm />
      </AuthCard>

      <AuthFooter actionLabel="resetting your password" />
    </AuthLayout>
  );
}

export default ResetPasswordMainLayout;
