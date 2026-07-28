import ValidationMessage from "./ValidationMessage";

function FormField({
  id,
  name,
  label,
  type = "text",
  value,
  placeholder,
  autoComplete,
  icon: Icon,
  error,
  touched,
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
    pr-4
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
      <label
        htmlFor={id}
        className="mb-1.5 block text-sm font-semibold text-text"
      >
        {label}
      </label>

      <div className="relative">
        {Icon && (
          <Icon
            size={16}
            strokeWidth={1.75}
            className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-text-secondary"
          />
        )}

        <input
          id={id}
          name={name}
          type={type}
          value={value}
          placeholder={placeholder}
          autoComplete={autoComplete}
          onChange={onChange}
          onBlur={onBlur}
          disabled={disabled}
          aria-invalid={hasError}
          aria-describedby={hasError ? `${id}-error` : undefined}
          className={inputClasses}
        />
      </div>

      <ValidationMessage message={hasError ? error : ""} />
    </div>
  );
}

export default FormField;
