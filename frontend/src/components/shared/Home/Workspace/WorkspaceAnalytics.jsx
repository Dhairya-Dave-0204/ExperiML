import React from "react";
import { BarChart4, Settings2 } from "lucide-react";

import { FEATURE_IMPORTANCE, HYPERPARAMETERS } from "./workspaceData";

function WorkspaceAnalytics() {
  return (
    <div className="grid grid-cols-1 gap-6 xl:grid-cols-[1.5fr_1fr]">
      {/* Feature Importance */}
      <section className="p-6 border rounded-xl border-border bg-surface">
        <div className="flex items-center gap-3 mb-6">
          <BarChart4 size={18} className="text-text-secondary" />

          <h4 className="text-base font-bold font-heading text-text">
            Feature Importance (SHAP)
          </h4>
        </div>

        <div>
          {FEATURE_IMPORTANCE.map((feature) => (
            <div
              key={feature.id}
              className="flex items-center gap-3 mb-3 last:mb-0"
            >
              <div
                className="w-40 font-mono text-xs truncate shrink-0 text-text-secondary"
              >
                {feature.feature}
              </div>

              <div className="flex-1 h-2 overflow-hidden rounded-full bg-surface-soft">
                <div
                  className="h-full rounded-full bg-primary"
                  style={{
                    width: `${feature.value}%`,
                  }}
                />
              </div>

              <div
                className="w-8 font-mono text-xs text-right shrink-0 text-text-secondary"
              >
                {feature.value}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Hyperparameters */}
      <section className="flex flex-col p-6 border rounded-xl border-border bg-surface">
        <div className="flex items-center gap-3 mb-5">
          <Settings2 size={18} className="text-text-secondary" />

          <h4 className="text-base font-bold font-heading text-text">
            Hyperparameters
          </h4>
        </div>

        <div className="flex flex-col justify-center flex-1 gap-2">
          {HYPERPARAMETERS.map((parameter) => (
            <div
              key={parameter.id}
              className="
                flex
                items-center
                justify-between
                rounded-lg
                bg-surface-soft
                px-4
                py-2.5
              "
            >
              <span className="font-mono text-xs text-text-secondary">
                {parameter.key}
              </span>

              <span className="font-mono text-xs font-semibold text-text">
                {parameter.value}
              </span>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}

export default WorkspaceAnalytics;
