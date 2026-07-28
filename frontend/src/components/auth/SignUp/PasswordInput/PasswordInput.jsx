import { useState } from "react";
import { Eye, EyeOff, Lock } from "lucide-react";

import { ValidationMessage } from "../SignUpForm/components/signup.index";

function PasswordInput({
  id,
  name,
  label,
  value,
  placeholder,
  autoComplete,
  error,
  touched,
  onChange,
  onBlur,
}) {
  const [showPassword, setShowPassword] = useState(false);

  const hasError = touched && Boolean(error);

  function togglePasswordVisibility() {
    setShowPassword((prev) => !prev);
  }

  return (
    <div>
      <label
        htmlFor={id}
        className="mb-1.5 block text-sm font-semibold text-text"
      >
        {label}
      </label>

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
          onChange={onChange}
          onBlur={onBlur}
          aria-invalid={hasError}
          aria-describedby={hasError ? `${id}-error` : undefined}
          className={`
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
            transition-colors
            duration-150
            focus:outline-none
            focus:ring-2
            ${
              hasError
                ? "border-danger focus:border-danger focus:ring-danger/20"
                : "border-border focus:border-primary focus:ring-primary-light"
            }
          `}
        />

        <button
          type="button"
          onClick={togglePasswordVisibility}
          aria-label={showPassword ? "Hide password" : "Show password"}
          className="absolute transition-colors -translate-y-1/2 right-3 top-1/2 text-text-secondary hover:text-text focus:outline-none"
        >
          {showPassword ? (
            <EyeOff size={18} strokeWidth={1.8} />
          ) : (
            <Eye size={18} strokeWidth={1.8} />
          )}
        </button>
      </div>

      {touched && (
        <ValidationMessage message={error} variant="error" className="mt-1" />
      )}
    </div>
  );
}

export default PasswordInput;
