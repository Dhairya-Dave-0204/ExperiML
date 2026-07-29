import { useState } from "react";
import { Link } from "react-router-dom";
import { Mail, ArrowRight, AlertCircle } from "lucide-react";

import { AuthHeader, FormDivider } from "@/components/components.index";

// ASSUMPTION: adjust this import path/key to match your project's real
// centralized route constants (mentioned in the brief but not provided).
import { ROUTES } from "@/constants/routes";

function validateEmail(value) {
  const trimmed = value.trim();
  if (!trimmed) return "Email address is required.";
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmed)) {
    return "Enter a valid email address.";
  }
  return "";
}

function ForgotPasswordForm() {
  const [email, setEmail] = useState("");
  const [touched, setTouched] = useState(false);

  const error = validateEmail(email);
  const isValid = error === "";
  const showError = touched && !isValid;

  function handleChange(e) {
    setEmail(e.target.value);
  }

  function handleBlur() {
    setTouched(true);
  }

  // UI only — no submission logic. Backend/auth to be wired up separately.
  function handleSubmit(e) {
    e.preventDefault();
    setTouched(true);
    if (!isValid) return;
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
              value={email}
              onChange={handleChange}
              onBlur={handleBlur}
              aria-invalid={showError}
              aria-describedby={showError ? "email-error" : undefined}
              className={`w-full rounded-lg border bg-surface py-2.5 pl-10 pr-4 text-sm text-text placeholder:text-text-secondary/70 transition-colors duration-150 focus:outline-none focus:ring-2 focus:ring-primary-light ${
                showError
                  ? "border-danger focus:border-danger"
                  : "border-border focus:border-primary"
              }`}
            />
          </div>
          {showError && (
            <p
              id="email-error"
              className="mt-1.5 flex items-center gap-1.5 text-xs text-danger"
            >
              <AlertCircle size={13} strokeWidth={2} />
              {error}
            </p>
          )}
        </div>

        <button
          type="submit"
          disabled={!isValid}
          className="inline-flex w-full items-center justify-center gap-2 rounded-lg bg-primary px-5 py-2.5 text-sm font-semibold text-white transition-colors duration-150 hover:bg-primary-dark disabled:cursor-not-allowed disabled:bg-border disabled:text-text-secondary"
        >
          Send Reset Link <ArrowRight size={16} />
        </button>
      </form>

      <div className="my-6">
        <FormDivider label="remember your password" />
      </div>

      <Link
        to={ROUTES.SIGN_IN}
        className="inline-flex w-full items-center justify-center gap-2 rounded-lg border border-border px-5 py-2.5 text-sm font-semibold text-text transition-colors duration-150 hover:border-border-hover hover:bg-surface-soft"
      >
        Back to Sign In
      </Link>
    </>
  );
}

export default ForgotPasswordForm;
