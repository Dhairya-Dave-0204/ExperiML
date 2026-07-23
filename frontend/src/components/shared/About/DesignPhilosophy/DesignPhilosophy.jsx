import React from "react";

import { PRINCIPLES } from "./designPhilosophyData";

function DesignPhilosophy() {
  return (
    <section
      id="philosophy"
      className="py-16 border-t border-border bg-surface-soft md:py-24"
    >
      <div className="container-custom grid grid-cols-1 gap-10 lg:grid-cols-[0.8fr_1.2fr] lg:gap-16">
        <div>
          <div className="inline-flex items-center gap-2 mb-4 text-xs font-semibold tracking-wider uppercase text-primary">
            <span className="h-1.5 w-1.5 rounded-full bg-primary" />
            Design philosophy
          </div>
          <h2 className="mb-3 text-2xl font-extrabold tracking-tight font-heading text-text md:text-3xl">
            The principles behind every decision
          </h2>
          <p className="text-[15px] leading-relaxed text-text-secondary">
            These aren't aspirational — they're the filter every feature has to
            pass through before it ships.
          </p>
        </div>

        <div className="border-t divide-y divide-border border-border">
          {PRINCIPLES.map((p, i) => (
            <div key={p.id} className="grid grid-cols-[28px_1fr] gap-4 py-4">
              <span className="pt-0.5 font-mono text-xs font-semibold text-accent">
                {String(i + 1).padStart(2, "0")}
              </span>
              <div>
                <div className="mb-1 text-sm font-bold text-text">
                  {p.title}
                </div>
                <div className="text-sm leading-relaxed text-text-secondary">
                  {p.desc}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default DesignPhilosophy;
