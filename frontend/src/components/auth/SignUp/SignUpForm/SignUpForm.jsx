import { useState } from "react";
import { User, Mail, ArrowRight } from "lucide-react";

import {
  AuthHeader,
  PasswordInput,
  FormDividerUp,
} from "@/components/components.index";

function SignUpForm() {
  const [agreed, setAgreed] = useState(false);

  const inputClasses =
    "w-full rounded-lg border border-border bg-surface py-2.5 pl-10 pr-4 text-sm text-text placeholder:text-text-secondary/70 transition-colors duration-150 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary-light";

  // UI only — no submission logic. Backend/auth to be wired up separately.
  function handleSubmit(e) {
    e.preventDefault();
  }

  return (
    <>
      <AuthHeader
        title="Create your account"
        subtitle="Start organizing your datasets, experiments, and models in one workspace."
      />

      <form onSubmit={handleSubmit} noValidate className="space-y-5">
        <div>
          <label
            htmlFor="fullName"
            className="mb-1.5 block text-sm font-semibold text-text"
          >
            Full Name
          </label>
          <div className="relative">
            <User
              size={16}
              strokeWidth={1.75}
              className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-text-secondary"
            />
            <input
              id="fullName"
              name="fullName"
              type="text"
              autoComplete="name"
              placeholder="Jane Doe"
              className={inputClasses}
            />
          </div>
        </div>

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
              className={inputClasses}
            />
          </div>
        </div>

        <PasswordInput
          id="password"
          name="password"
          label="Password"
          placeholder="Create a password"
          autoComplete="new-password"
        />

        <PasswordInput
          id="confirmPassword"
          name="confirmPassword"
          label="Confirm Password"
          placeholder="Re-enter your password"
          autoComplete="new-password"
        />

        <label className="flex cursor-pointer items-start gap-2.5 select-none">
          <input
            type="checkbox"
            checked={agreed}
            onChange={() => setAgreed((prev) => !prev)}
            className="mt-0.5 h-4 w-4 shrink-0 rounded border-border text-primary accent-primary focus:ring-2 focus:ring-primary-light"
          />
          <span className="text-sm text-text-secondary">
            I agree to the{" "}
            <a
              href="/terms"
              className="font-medium text-text hover:text-primary hover:underline"
            >
              Terms of Service
            </a>{" "}
            and{" "}
            <a
              href="/privacy"
              className="font-medium text-text hover:text-primary hover:underline"
            >
              Privacy Policy
            </a>
          </span>
        </label>

        <button
          type="submit"
          className="inline-flex w-full items-center justify-center gap-2 rounded-lg bg-primary px-5 py-2.5 text-sm font-semibold text-white transition-colors duration-150 hover:bg-primary-dark"
        >
          Create Account <ArrowRight size={16} />
        </button>
      </form>

      <div className="my-6">
        <FormDividerUp label="already have an account" />
      </div>

      <a
        href="/signin"
        className="inline-flex w-full items-center justify-center gap-2 rounded-lg border border-border px-5 py-2.5 text-sm font-semibold text-text transition-colors duration-150 hover:border-border-hover hover:bg-surface-soft"
      >
        Sign In
      </a>
    </>
  );
}

export default SignUpForm;
