import ValidationMessage from "./ValidationMessage";

function TextInput({
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
}) {
  const hasError = touched && Boolean(error);

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
          aria-invalid={hasError}
          aria-describedby={hasError ? `${id}-error` : undefined}
          className={`
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
      </div>

      {touched && (
        <ValidationMessage message={error} variant="error" className="mt-1" />
      )}
    </div>
  );
}

export default TextInput;
