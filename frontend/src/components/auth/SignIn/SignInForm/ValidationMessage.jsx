import { AlertCircle, CheckCircle2, Info } from "lucide-react";

const VARIANT_STYLES = {
  error: {
    icon: AlertCircle,
    className: "text-red-600",
  },

  success: {
    icon: CheckCircle2,
    className: "text-green-600",
  },

  info: {
    icon: Info,
    className: "text-primary",
  },
};

function ValidationMessage({
  message = "",
  variant = "error",
}) {
  if (!message) {
    return null;
  }

  const { icon: Icon, className } =
    VARIANT_STYLES[variant] || VARIANT_STYLES.error;

  return (
    <div
      className={`mt-2 flex items-start gap-2 text-sm ${className}`}
      role={variant === "error" ? "alert" : "status"}
      aria-live="polite"
    >
      <Icon
        size={16}
        strokeWidth={2}
        className="mt-0.5 shrink-0"
      />

      <span className="leading-6">
        {message}
      </span>
    </div>
  );
}

export default ValidationMessage;