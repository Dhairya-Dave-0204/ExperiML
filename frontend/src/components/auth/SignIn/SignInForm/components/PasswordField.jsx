import { Eye, EyeOff, Lock } from "lucide-react";

import { Link } from "react-router-dom";

import { ROUTES } from "@/constants/routes"

import ValidationMessage from "../ValidationMessage";

function PasswordField({
  id = "password",
  name = "password",
  label = "Password",
  value,
  placeholder = "Enter your password",
  autoComplete = "current-password",
  error,
  touched,
  showPassword,
  onToggleVisibility,
  onChange,
  onBlur,
  disabled = false,
}) {
  const hasError = touched && Boolean(error);

  const inputClasses = `
    w-full
    rounded-lg
    border
    bg-surface
    py-2.5
    pl-10
    pr-11
    text-sm
    text-text
    placeholder:text-text-secondary/70
    transition-all
    duration-200
    focus:outline-none
    focus:ring-2
    ${
      hasError
        ? "border-red-500 focus:border-red-500 focus:ring-red-100"
        : "border-border focus:border-primary focus:ring-primary-light"
    }
    ${disabled ? "cursor-not-allowed opacity-60" : ""}
  `;

  return (
    <div>
      <div className="mb-1.5 flex items-center justify-between">
        <label htmlFor={id} className="block text-sm font-semibold text-text">
          {label}
        </label>

        <Link
          to={ROUTES.FORGOT_PASS}
          className="text-xs font-medium transition-colors duration-150 text-primary hover:text-primary-dark hover:underline"
        >
          Forgot password?
        </Link>
      </div>

      <div className="relative">
        <Lock
          size={16}
          strokeWidth={1.75}
          className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-text-secondary"
        />

        <input
          id={id}
          name={name}
          type={showPassword ? "text" : "password"}
          value={value}
          placeholder={placeholder}
          autoComplete={autoComplete}
          disabled={disabled}
          onChange={onChange}
          onBlur={onBlur}
          aria-invalid={hasError}
          aria-describedby={hasError ? `${id}-error` : undefined}
          className={inputClasses}
        />

        <button
          type="button"
          onClick={onToggleVisibility}
          disabled={disabled}
          aria-label={showPassword ? "Hide password" : "Show password"}
          className="absolute p-1 transition-colors duration-200 -translate-y-1/2 rounded-md right-3 top-1/2 text-text-secondary hover:text-text focus:outline-none focus:ring-2 focus:ring-primary-light disabled:pointer-events-none disabled:opacity-50"
        >
          {showPassword ? (
            <EyeOff size={20} strokeWidth={1.75} />
          ) : (
            <Eye size={20} strokeWidth={1.75} />
          )}
        </button>
      </div>

      <ValidationMessage message={hasError ? error : ""} />
    </div>
  );
}

export default PasswordField;
