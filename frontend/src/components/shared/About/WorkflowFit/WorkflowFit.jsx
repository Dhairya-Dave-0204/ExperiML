import React from "react";
import { ArrowRight } from "lucide-react";

import { STAGES } from "./workflowFitData"

function WorkflowFit() {
  return (
    <section
      id="workflow-fit"
      className="py-16 border-t border-border md:py-24"
    >
      <div className="container-custom">
        <div className="max-w-xl mb-10">
          <div className="inline-flex items-center gap-2 mb-4 text-xs font-semibold tracking-wider uppercase text-primary">
            <span className="h-1.5 w-1.5 rounded-full bg-primary" />
            How it fits your workflow
          </div>
          <h2 className="mb-3 text-2xl font-extrabold tracking-tight font-heading text-text md:text-3xl">
            One continuous path, from raw data to a finished report
          </h2>
          <p className="text-[15px] leading-relaxed text-text-secondary">
            ExperiML doesn't ask you to change how you work — it gives the
            stages you already move through a shared home.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3 p-5 border rounded-xl border-border bg-surface-soft md:p-6">
          {STAGES.map(({ icon: Icon, label, id }, i) => (
            <div key={id} className="flex items-center gap-3">
              <div className="flex items-center gap-2.5 rounded-lg border border-border bg-surface px-4 py-3 shadow-sm">
                <div className="flex items-center justify-center w-8 h-8 rounded-md shrink-0 bg-primary-light">
                  <Icon size={16} strokeWidth={1.75} className="text-primary" />
                </div>
                <span className="text-sm font-semibold text-text">{label}</span>
              </div>
              {i < STAGES.length - 1 && (
                <ArrowRight
                  size={16}
                  strokeWidth={2}
                  className="hidden shrink-0 text-text-secondary/50 sm:block"
                />
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default WorkflowFit;
