import { AlertCircle, CheckCircle2, Info } from "lucide-react";

function ValidationMessage({ message, variant = "error", className = "" }) {
  if (!message) return null;

  const variants = {
    error: {
      icon: AlertCircle,
      textColor: "text-danger",
    },
    success: {
      icon: CheckCircle2,
      textColor: "text-success",
    },
    info: {
      icon: Info,
      textColor: "text-primary",
    },
  };

  const { icon: Icon, textColor } = variants[variant];

  return (
    <div
      role="alert"
      aria-live="polite"
      className={`mt-1.5 flex items-start gap-1.5 text-xs ${textColor} ${className}`}
    >
      <Icon size={14} strokeWidth={2} className="mt-[1px] shrink-0" />

      <span>{message}</span>
    </div>
  );
}

export default ValidationMessage;
