import React from "react";
import { ArrowRight } from "lucide-react";

import { STAGES } from "./workflowFitData";

function WorkflowFit() {
  return (
    <section
      id="workflow-fit"
      className="py-16 border-t border-border md:py-24 bg-primary-light/30"
    >
      <div className="container-custom">
        {/* Section Header */}
        <div className="max-w-3xl mx-auto mb-16 text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1 mb-5 font-mono text-xs font-semibold tracking-wider uppercase rounded-full bg-primary-soft text-primary">
            <span className="h-1.5 w-1.5 rounded-full bg-primary" />
            How It Fits Your Workflow
          </div>

          <h2 className="text-3xl font-extrabold tracking-tight font-heading text-text sm:text-4xl lg:text-5xl">
            One continuous path, from raw data to a finished report
          </h2>

          <p className="max-w-2xl mx-auto mt-6 text-base leading-8 text-text-secondary lg:text-lg">
            ExperiML doesn't ask you to change how you work—it gives the stages
            you already move through a shared home, making every experiment
            organized, reproducible, and easy to revisit.
          </p>
        </div>

        {/* Workflow */}
        <div className="overflow-hidden border shadow-md rounded-2xl border-border bg-surface">
          <div className="flex flex-wrap items-center justify-center gap-4 p-6 lg:p-8">
            {STAGES.map(({ icon: Icon, label, id }, index) => (
              <React.Fragment key={id} >
                <div className="flex items-center gap-3 px-5 py-4 transition-all duration-300 border shadow-sm cursor-pointer group rounded-xl border-border bg-surface hover:-translate-y-1 hover:border-primary hover:shadow-md hover:bg-primary-light/30">
                  <div className="flex items-center justify-center w-10 h-10 rounded-lg shrink-0 bg-primary-soft text-primary">
                    <Icon size={18} strokeWidth={1.8} />
                  </div>

                  <span className="text-sm font-semibold text-text md:text-base">
                    {label}
                  </span>
                </div>

                {index < STAGES.length - 1 && (
                  <ArrowRight
                    size={18}
                    strokeWidth={2}
                    className="hidden text-text-secondary/40 lg:block"
                  />
                )}
              </React.Fragment>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

export default WorkflowFit;
