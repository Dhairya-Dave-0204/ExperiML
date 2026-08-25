import { Link } from "react-router-dom";
import { Mail, ArrowRight } from "lucide-react";

import { AuthHeader, FormDivider, ValidationMessage } from "@/components/components.index";

import { ROUTES } from "@/constants/routes";

import useForgotPasswordForm from "./hooks/useForgotPasswordForm";

function ForgotPasswordForm() {
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
    resetForm,
  } = useForgotPasswordForm();

  if (submitted) {
    return (
      <>
        <AuthHeader
          title="Check Your Email"
          subtitle={`If an account exists for "${values.email}", we've sent a password reset link. Please check your inbox and follow the instructions.`}
        />

        <button
          type="button"
          onClick={resetForm}
          className="
            inline-flex
            w-full
            items-center
            justify-center
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
          Send Another Link
        </button>

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

  return (
    <>
      <AuthHeader
        title="Forgot Password?"
        subtitle="Enter the email address associated with your account and we'll send you a password reset link."
      />

      <form onSubmit={handleSubmit} noValidate className="space-y-5">
        <div>
          <label
            htmlFor="email"
            className="mb-1.5 block text-sm font-semibold text-text"
          >
            Email Address
          </label>

          <div className="relative">
            <Mail
              size={16}
              strokeWidth={1.75}
              className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-text-secondary"
            />

            <input
              id="email"
              name="email"
              type="email"
              autoComplete="email"
              placeholder="you@example.com"
              value={values.email}
              onChange={handleChange}
              onBlur={handleBlur}
              aria-required="true"
              aria-invalid={Boolean(touched.email && errors.email)}
              aria-describedby={
                touched.email && errors.email ? "email-error" : undefined
              }
              className={`
                w-full
                rounded-lg
                border
                bg-surface
                py-2.5
                pl-10
                pr-4
                text-sm
                text-text
                placeholder:text-text-secondary/70
                transition-colors
                duration-150
                focus:outline-none
                focus:ring-2
                focus:ring-primary-light
                ${
                  touched.email && errors.email
                    ? "border-danger focus:border-danger"
                    : "border-border focus:border-primary"
                }
              `}
            />
          </div>

          <ValidationMessage
            id="email-error"
            error={errors.email}
            touched={touched.email}
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
          {isSubmitting ? "Sending..." : "Send Reset Link"}

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

export default ForgotPasswordForm;
