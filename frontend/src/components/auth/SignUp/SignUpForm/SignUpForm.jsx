import { Mail, User } from "lucide-react";
import { Link } from "react-router-dom";

import { ROUTES } from "@/constants/routes";

import PasswordInput from "../PasswordInput/PasswordInput";
import FormDivider from "../FormDivider/FormDivider";
import { TextInput } from "./components/signup.index";
import useSignUpForm from "./hooks/useSignUpForm";

function SignUpForm() {
  const {
    values,
    errors,
    touched,
    agreed,
    isSubmitting,
    isFormValid,
    handleChange,
    handleBlur,
    handleSubmit,
    toggleAgreement,
  } = useSignUpForm();

  return (
    <form onSubmit={handleSubmit} className="space-y-5" noValidate>
      {/* Full Name */}
      <TextInput
        id="fullName"
        name="fullName"
        label="Full Name"
        type="text"
        value={values.fullName}
        placeholder="John Doe"
        autoComplete="name"
        icon={User}
        error={errors.fullName}
        touched={touched.fullName}
        onChange={handleChange}
        onBlur={handleBlur}
      />

      {/* Email */}
      <TextInput
        id="email"
        name="email"
        label="Email Address"
        type="email"
        value={values.email}
        placeholder="john@example.com"
        autoComplete="email"
        icon={Mail}
        error={errors.email}
        touched={touched.email}
        onChange={handleChange}
        onBlur={handleBlur}
      />

      {/* Password */}
      <PasswordInput
        id="password"
        name="password"
        label="Password"
        value={values.password}
        placeholder="Create a strong password"
        autoComplete="new-password"
        error={errors.password}
        touched={touched.password}
        onChange={handleChange}
        onBlur={handleBlur}
      />

      {/* Confirm Password */}
      <PasswordInput
        id="confirmPassword"
        name="confirmPassword"
        label="Confirm Password"
        value={values.confirmPassword}
        placeholder="Re-enter your password"
        autoComplete="new-password"
        error={errors.confirmPassword}
        touched={touched.confirmPassword}
        onChange={handleChange}
        onBlur={handleBlur}
      />

      {/* Terms & Privacy */}
      <div className="flex items-start gap-3">
        <input
          id="agreed"
          name="agreed"
          type="checkbox"
          checked={agreed}
          onChange={toggleAgreement}
          className="w-4 h-4 mt-1 rounded border-border text-primary focus:ring-primary"
        />

        <label
          htmlFor="agreed"
          className="text-sm leading-6 text-text-secondary"
        >
          I agree to the{" "}
          <Link
            to={ROUTES.TERMS}
            className="font-medium text-primary hover:underline"
          >
            Terms of Service
          </Link>{" "}
          and{" "}
          <Link
            to={ROUTES.PRIVACY}
            className="font-medium text-primary hover:underline"
          >
            Privacy Policy
          </Link>
          .
        </label>
      </div>

      {touched.agreed && errors.agreed && (
        <p className="text-xs text-danger">{errors.agreed}</p>
      )}

      {/* Submit */}
      <button
        type="submit"
        disabled={!isFormValid || !agreed || isSubmitting}
        className="w-full px-4 py-3 text-sm font-semibold text-white transition-all duration-200 rounded-lg bg-primary hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
      >
        {isSubmitting ? "Creating Account..." : "Create Account"}
      </button>

      <FormDivider />

      <div className="text-sm text-center text-text-secondary">
        Already have an account?{" "}
        <Link
          to={ROUTES.SIGN_IN}
          className="font-semibold text-primary hover:underline"
        >
          Sign In
        </Link>
      </div>
    </form>
  );
}

export default SignUpForm;
