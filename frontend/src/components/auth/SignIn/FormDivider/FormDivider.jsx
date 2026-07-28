import React from "react";

function FormDivider({ label = "or" }) {
  return (
    <div className="flex items-center gap-3">
      <span className="flex-1 h-px bg-border" aria-hidden="true" />
      <span className="text-xs font-medium tracking-wider uppercase text-text-secondary">
        {label}
      </span>
      <span className="flex-1 h-px bg-border" aria-hidden="true" />
    </div>
  );
}

export default FormDivider;
