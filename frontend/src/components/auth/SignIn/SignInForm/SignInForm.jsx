import { ArrowRight, Mail } from "lucide-react";
import { Link } from "react-router-dom";

import FormDivider from "../FormDivider/FormDivider";
import FormField from "./components/FormField";
import PasswordField from "./components/PasswordField";

import useSignInForm from "./hooks/useSignInForm";

function SignInForm() {
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
  } = useSignInForm();

  return (
    <div className="w-full p-8 mt-20 border shadow-sm rounded-3xl border-border bg-surface lg:p-10">
      {/* Header */}
      <h1 className="mb-1.5 font-heading text-3xl font-extrabold tracking-tight text-text">
        Sign In
      </h1>

      <p className="mb-8 text-sm leading-relaxed text-text-secondary">
        Welcome back. Sign in to continue managing your machine learning
        experiments and projects.
      </p>

      {/* Form */}

      <form
        noValidate
        onSubmit={handleSubmit}
        className="space-y-5"
      >
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
          <div className="mb-1.5 flex items-center justify-between">
            <label
              htmlFor="password"
              className="text-sm font-semibold text-text"
            >
              Password
            </label>

            <Link
              to="/forgot-password"
              className="text-xs font-medium transition-colors duration-150 text-primary hover:text-primary-dark hover:underline"
            >
              Forgot password?
            </Link>
          </div>

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

          <span className="text-sm text-text-secondary">
            Remember me
          </span>
        </label>

        {/* Submit */}

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
            transition-all
            duration-200
            hover:bg-primary-dark
            disabled:cursor-not-allowed
            disabled:opacity-50
            disabled:hover:bg-primary
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

      <p className="mb-3 text-sm text-center text-text-secondary">
        Don't have an account?
      </p>

      <Link
        to="/signup"
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