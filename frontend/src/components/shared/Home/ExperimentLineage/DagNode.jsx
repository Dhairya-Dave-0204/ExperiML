import React from "react";

function DagNode({ icon: Icon, title, meta, active = false, success = false }) {
  return (
    <div
      className={`
        flex min-w-55 items-start gap-3 rounded-xl border p-4 shadow-sm
        transition-all duration-300 hover:-translate-y-0.5 hover:border-primary hover:shadow-md
        ${
          active
            ? "border-accent bg-cyan-50"
            : success
              ? "border-success bg-success-soft"
              : "border-border bg-surface"
        }
      `}
    >
      {/* Icon */}
      <div
        className={`
          flex h-9 w-9 shrink-0 items-center justify-center rounded-lg
          ${
            active
              ? "bg-cyan-100 text-accent"
              : success
                ? "bg-surface text-success"
                : "bg-surface-soft text-text-secondary"
          }
        `}
      >
        <Icon size={18} />
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0">
        <h3 className="text-sm font-semibold font-heading text-text">
          {title}
        </h3>

        <p className="mt-1 font-mono text-xs text-text-secondary">{meta}</p>
      </div>
    </div>
  );
}

export default DagNode;
