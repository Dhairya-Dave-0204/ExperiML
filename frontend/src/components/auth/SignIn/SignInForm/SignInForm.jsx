import { Mail } from "lucide-react";

import useSignInForm from "./hooks/useSignInForm";

import FormField from "./components/FormField";
import PasswordField from "./components/PasswordField";
import FormDivider from "../FormDivider/FormDivider";

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
    <form noValidate onSubmit={submitHandler} className="space-y-5">
      <FormField
        label="Email address"
        name="email"
        type="email"
        value={values.email}
        onChange={handleChange}
        onBlur={handleBlur}
        error={touched.email && errors.email}
        placeholder="Enter your email"
      >
        <div className="relative">
          <Mail
            size={17}
            strokeWidth={1.75}
            className="absolute -translate-y-1/2 left-3 top-1/2 text-text-secondary"
          />

          <input
            id="email"
            name="email"
            type="email"
            value={values.email}
            onChange={handleChange}
            onBlur={handleBlur}
            placeholder="Enter your email"
            className="w-full rounded-lg border border-border bg-surface px-4 py-2.5 pl-10 text-sm text-text placeholder:text-text-secondary/70 transition-colors duration-150 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary-light"
          />
        </div>
      </FormField>

      <PasswordField
        value={values.password}
        onChange={handleChange}
        onBlur={handleBlur}
        error={touched.password && errors.password}
        showPassword={showPassword}
        togglePasswordVisibility={togglePasswordVisibility}
      />

      <div className="flex items-center justify-between">
        <label className="flex items-center gap-2 text-sm text-text-secondary">
          <input
            type="checkbox"
            checked={rememberMe}
            onChange={toggleRememberMe}
            className="rounded border-border text-primary focus:ring-primary-light"
          />
          Remember me
        </label>

        <button
          type="button"
          className="text-sm font-medium text-primary hover:underline"
        >
          Forgot password?
        </button>
      </div>

      <button
        type="submit"
        disabled={!isFormValid || isSubmitting}
        className="
          flex
          w-full
          items-center
          justify-center
          rounded-lg
          bg-primary
          px-5
          py-2.5
          text-sm
          font-semibold
          text-white
          transition-colors
          duration-200
          hover:bg-primary-dark
          disabled:cursor-not-allowed
          disabled:opacity-50
        "
      >
        {isSubmitting ? "Signing in..." : "Sign in"}
      </button>

      <FormDivider />
    </form>
  );
}

export default SignInForm;
