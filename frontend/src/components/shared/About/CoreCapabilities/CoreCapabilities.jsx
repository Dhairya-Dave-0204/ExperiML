import React from "react";

import { CAPABILITIES } from "./coreCapabilitiesData";

function CoreCapabilities() {
  return (
    <section
      id="capabilities"
      className="py-16 border-t border-border bg-surface-soft md:py-24"
    >
      <div className="container-custom">
        <div className="max-w-xl mb-10">
          <div className="inline-flex items-center gap-2 mb-4 text-xs font-semibold tracking-wider uppercase text-primary">
            <span className="h-1.5 w-1.5 rounded-full bg-primary" />
            Core capabilities
          </div>
          <h2 className="mb-3 text-2xl font-extrabold tracking-tight font-heading text-text md:text-3xl">
            Everything an experiment needs, in one place
          </h2>
          <p className="text-[15px] leading-relaxed text-text-secondary">
            Each capability covers a real part of the ML lifecycle — nothing
            here exists just to fill a grid.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {CAPABILITIES.map(({ icon: Icon, title, desc, planned, id }) => (
            <div
              key={id}
              className="p-5 transition-colors duration-150 border shadow-sm rounded-xl border-border bg-surface hover:border-primary-light"
            >
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-primary-light">
                  <Icon size={20} strokeWidth={1.75} className="text-primary" />
                </div>
                {planned && (
                  <span className="rounded-full bg-warning/10 px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wide text-warning">
                    Planned
                  </span>
                )}
              </div>
              <h3 className="mb-1.5 font-heading text-[15px] font-bold text-text">
                {title}
              </h3>
              <p className="text-sm leading-relaxed text-text-secondary">
                {desc}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default CoreCapabilities;
