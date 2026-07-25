import { AlertCircle } from "lucide-react";

function ContactField({
  label,
  name,
  required = false,
  error,
  touched = false,
  children,
}) {
  return (
    <div>
      <label
        htmlFor={name}
        className="mb-1.5 block text-sm font-semibold text-text"
      >
        {label}

        {required && <span className="ml-0.5 text-danger">*</span>}
      </label>

      {children}

      {touched && error && (
        <p className="mt-1.5 flex items-center gap-1.5 text-xs text-danger">
          <AlertCircle size={13} strokeWidth={2} />

          {error}
        </p>
      )}
    </div>
  );
}

export default ContactField;
