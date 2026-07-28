import { useState } from "react";
import { Lock, Eye, EyeOff } from "lucide-react";

function PasswordInput({
  id,
  name,
  label,
  placeholder,
  autoComplete,
  rightSlot,
}) {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div>
      <div className="mb-1.5 flex items-center justify-between">
        <label htmlFor={id} className="block text-sm font-semibold text-text">
          {label}
        </label>
        {rightSlot}
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
          autoComplete={autoComplete}
          placeholder={placeholder}
          className="w-full rounded-lg border border-border bg-surface py-2.5 pl-10 pr-11 text-sm text-text placeholder:text-text-secondary/70 transition-colors duration-150 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary-light"
        />
        <button
          type="button"
          onClick={() => setShowPassword((prev) => !prev)}
          aria-label={showPassword ? "Hide password" : "Show password"}
          className="absolute transition-colors duration-150 -translate-y-1/2 right-3 top-1/2 text-text-secondary hover:text-text"
        >
          {showPassword ? (
            <EyeOff size={16} strokeWidth={1.75} />
          ) : (
            <Eye size={16} strokeWidth={1.75} />
          )}
        </button>
      </div>
    </div>
  );
}

export default PasswordInput;
