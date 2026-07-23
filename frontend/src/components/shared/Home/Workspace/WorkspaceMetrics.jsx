import React from "react";
import { CheckCircle2, GitCommit } from "lucide-react";

import { EXPERIMENT, METRICS, TRAINING_LOSS } from "./workspaceData";

function WorkspaceMetrics() {
  return (
    <>
      {/* Experiment Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
        <div>
          <h3 className="text-2xl font-bold font-heading text-text">
            {EXPERIMENT.name}
          </h3>

          <div className="flex items-center gap-2 mt-1 font-mono text-xs text-text-secondary">
            <GitCommit size={12} />

            <span>
              {EXPERIMENT.commit.hash} • {EXPERIMENT.commit.runId}
            </span>
          </div>
        </div>

        <div className="inline-flex items-center gap-2 px-3 py-1 font-mono text-xs font-semibold rounded-full bg-success-soft text-success">
          <CheckCircle2 size={14} />

          <span>{EXPERIMENT.status.label}</span>
        </div>
      </div>

      {/* Metrics */}
      <div className="grid grid-cols-1 gap-4 mb-8 md:grid-cols-2 xl:grid-cols-4">
        {METRICS.map((metric) => (
          <div
            key={metric.id}
            className="p-4 border rounded-xl border-border bg-surface"
          >
            <p className="mb-2 font-mono text-xs tracking-wide uppercase text-text-secondary">
              {metric.label}
            </p>

            <p
              className={`font-heading text-3xl font-bold ${
                metric.highlight ? "text-primary" : "text-text"
              }`}
            >
              {metric.value}
            </p>
          </div>
        ))}

        {/* Training Loss */}
        <div className="p-4 border rounded-xl border-border bg-surface md:col-span-2">
          <div className="flex items-center justify-between mb-3">
            <span className="font-mono text-xs tracking-wide uppercase text-text-secondary">
              {TRAINING_LOSS.label}
            </span>

            <span className="font-mono text-xs font-medium text-primary">
              {TRAINING_LOSS.status}
            </span>
          </div>

          <svg
            viewBox="0 0 200 40"
            className="w-full h-10 overflow-visible fill-primary-light"
            role="img"
            aria-label="Training Loss Chart"
          >
            <path className="fill-primary-soft" d={TRAINING_LOSS.areaPath} />

            <path
              className="stroke-2 stroke-primary fill-primary-light"
              strokeLinecap="round"
              strokeLinejoin="round"
              d={TRAINING_LOSS.linePath}
            />
          </svg>
        </div>
      </div>
    </>
  );
}

export default WorkspaceMetrics;
