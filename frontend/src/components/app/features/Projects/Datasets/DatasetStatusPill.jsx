import { AlertCircle, CheckCircle2, Loader2 } from "lucide-react";

const STATUS_STYLES = {
  READY: "bg-success/10 text-success",
  PROCESSING: "bg-warning/10 text-warning",
  FAILED: "bg-danger/10 text-danger",
};

const DatasetStatusPill = ({ status }) => {
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px] font-bold tracking-wide ${STATUS_STYLES[status]}`}
    >
      {status === "PROCESSING" && (
        <Loader2 size={11} className="animate-spin" strokeWidth={2.5} />
      )}

      {status === "READY" && <CheckCircle2 size={11} strokeWidth={2.5} />}

      {status === "FAILED" && <AlertCircle size={11} strokeWidth={2.5} />}

      {status}
    </span>
  );
};

export default DatasetStatusPill;
