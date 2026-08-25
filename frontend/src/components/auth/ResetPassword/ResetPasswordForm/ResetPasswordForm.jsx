import { Link } from "react-router-dom";
import { ArrowRight, CheckCircle2 } from "lucide-react";

import {
  AuthHeader,
  FormDivider,
  PasswordInput,
  ValidationMessage,
} from "@/components/components.index";

import { ROUTES } from "@/constants/routes";

import useResetPasswordForm from "../hooks/useResetPasswordForm";

function ResetPasswordForm() {
  const {
    values,
    errors,
    touched,

    submitted,
    isSubmitting,
    isFormValid,

    handleChange,
    handleBlur,
    handleSubmit,
  } = useResetPasswordForm();

  if (submitted) {
    return (
      <>
        <div className="flex items-center justify-center mb-6 rounded-full h-11 w-11 bg-success/10">
          <CheckCircle2 size={22} strokeWidth={1.75} className="text-success" />
        </div>

        <AuthHeader
          title="Password Reset"
          subtitle="Your password has been updated. You can now sign in with your new password."
        />

        <Link
          to={ROUTES.SIGN_IN}
          className="
            inline-flex
            w-full
            items-center
            justify-center
            gap-2
            rounded-lg
            bg-primary
            px-5
            py-2.5
            text-sm
            font-semibold
            text-white
            transition-colors
            duration-150
            hover:bg-primary-dark
          "
        >
          Continue to Sign In <ArrowRight size={16} />
        </Link>
      </>
    );
  }

  return (
    <>
      <AuthHeader
        title="Reset Password"
        subtitle="Choose a new password for your account. Make it something you haven't used before."
      />

      <form onSubmit={handleSubmit} noValidate className="space-y-5">
        <div>
          <PasswordInput
            id="password"
            name="password"
            label="New Password"
            placeholder="Create a new password"
            autoComplete="new-password"
            value={values.password}
            onChange={handleChange}
            onBlur={handleBlur}
            error={Boolean(touched.password && errors.password)}
            aria-required="true"
            aria-invalid={Boolean(touched.password && errors.password)}
            aria-describedby={
              touched.password && errors.password ? "password-error" : undefined
            }
          />

          <ValidationMessage
            id="password-error"
            error={errors.password}
            touched={touched.password}
          />
        </div>

        <div>
          <PasswordInput
            id="confirmPassword"
            name="confirmPassword"
            label="Confirm Password"
            placeholder="Re-enter your new password"
            autoComplete="new-password"
            value={values.confirmPassword}
            onChange={handleChange}
            onBlur={handleBlur}
            error={Boolean(touched.confirmPassword && errors.confirmPassword)}
            aria-required="true"
            aria-invalid={Boolean(
              touched.confirmPassword && errors.confirmPassword,
            )}
            aria-describedby={
              touched.confirmPassword && errors.confirmPassword
                ? "confirmPassword-error"
                : undefined
            }
          />

          <ValidationMessage
            id="confirmPassword-error"
            error={errors.confirmPassword}
            touched={touched.confirmPassword}
          />
        </div>

        <button
          type="submit"
          disabled={!isFormValid || isSubmitting}
          className="
            inline-flex
            w-full
            items-center
            justify-center
            gap-2
            rounded-lg
            bg-primary
            px-5
            py-2.5
            text-sm
            font-semibold
            text-white
            transition-colors
            duration-150
            hover:bg-primary-dark
            disabled:cursor-not-allowed
            disabled:opacity-50
          "
        >
          {isSubmitting ? "Resetting Password..." : "Reset Password"}

          {isSubmitting ? (
            <div className="w-4 h-4 border-2 rounded-full animate-spin border-white/30 border-t-white" />
          ) : (
            <ArrowRight size={16} />
          )}
        </button>
      </form>

      <div className="my-6">
        <FormDivider label="remember your password" />
      </div>

      <Link
        to={ROUTES.SIGN_IN}
        className="
          inline-flex
          w-full
          items-center
          justify-center
          gap-2
          rounded-lg
          border
          border-border
          px-5
          py-2.5
          text-sm
          font-semibold
          text-text
          transition-colors
          duration-150
          hover:border-border-hover
          hover:bg-surface-soft
        "
      >
        Back to Sign In
      </Link>
    </>
  );
}

export default ResetPasswordForm;
