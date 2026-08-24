import { ArrowRight, Mail } from "lucide-react";
import { Link } from "react-router-dom";

import { ROUTES } from "@/constants/routes";

import FormDivider from "../FormDivider/FormDivider";
import FormField from "./components/FormField";
import PasswordField from "./components/PasswordField";

import useSignInForm from "./hooks/useSignInForm";

function SignInForm({ onSubmit }) {
  const {
    values,
    errors,
    touched,
    rememberMe,
    showPassword,
    isSubmitting,
    isFormValid,

    handleChange,
    handleBlur,
    handleSubmit,

    toggleRememberMe,
    togglePasswordVisibility,

    setSubmitting,
  } = useSignInForm();

  async function submitHandler(event) {
    const credentials = handleSubmit(event);

    if (!credentials) {
      return;
    }

    setSubmitting(true);

    try {
      await onSubmit(credentials);
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="w-full p-8 border shadow-sm rounded-3xl border-border bg-surface">
      {/* Header */}

      <h1 className="mb-1.5 font-heading text-3xl font-extrabold tracking-tight text-text">
        Sign In
      </h1>

      <p className="mb-8 text-sm leading-relaxed text-text-secondary">
        Welcome back. Sign in to continue managing your machine learning
        experiments and projects.
      </p>

      {/* Form */}

      <form noValidate onSubmit={submitHandler} className="space-y-5">
        {/* Email */}

        <FormField
          id="email"
          name="email"
          label="Email Address"
          type="email"
          value={values.email}
          placeholder="you@example.com"
          autoComplete="email"
          icon={Mail}
          error={errors.email}
          touched={touched.email}
          onChange={handleChange}
          onBlur={handleBlur}
        />

        {/* Password */}

        <div>
          <PasswordField
            value={values.password}
            error={errors.password}
            touched={touched.password}
            showPassword={showPassword}
            onToggleVisibility={togglePasswordVisibility}
            onChange={handleChange}
            onBlur={handleBlur}
          />
        </div>

        {/* Remember Me */}

        <label className="flex cursor-pointer items-center gap-2.5 select-none">
          <input
            type="checkbox"
            checked={rememberMe}
            onChange={toggleRememberMe}
            className="w-4 h-4 rounded border-border text-primary accent-primary focus:ring-2 focus:ring-primary-light"
          />

          <span className="text-sm text-text-secondary">Remember me</span>
        </label>

        {/* Submit */}

        <button
          type="submit"
          disabled={!isFormValid || isSubmitting}
          className="
            inline-flex
            items-center
            justify-center
            w-full
            gap-2
            px-5
            h-10
            py-2.5
            text-sm
            font-semibold
            text-white
            transition-all
            duration-300
            rounded-lg
            bg-primary
            hover:bg-primary-dark
            disabled:cursor-not-allowed
            disabled:opacity-50
          "
        >
          {isSubmitting ? (
            "Signing In..."
          ) : (
            <>
              Sign In
              <ArrowRight size={16} strokeWidth={2} />
            </>
          )}
        </button>
      </form>

      {/* Divider */}

      <div className="my-7">
        <FormDivider label="new here" />
      </div>

      {/* Footer */}

      <Link
        to={ROUTES.SIGN_UP}
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
          duration-200
          hover:border-border-hover
          hover:bg-surface-soft
        "
      >
        Create an Account
      </Link>
    </div>
  );
}

export default SignInForm;
