import React from "react";

import { AUDIENCES } from "./whoCanUseData";

function WhoCanUse() {
  return (
    <section id="who-can-use" className="py-16 border-t border-border md:py-24">
      <div className="container-custom">
        <div className="max-w-2xl mb-10">
          <div className="inline-flex items-center gap-2 mb-4 text-xs font-semibold tracking-wider uppercase text-primary">
            <span className="h-1.5 w-1.5 rounded-full bg-primary" />
            Who it's for
          </div>
          <h2 className="mb-3 text-3xl font-extrabold tracking-tight font-heading text-text md:text-4xl">
            Built for anyone who runs experiments
          </h2>
          <p className="text-[15px] leading-relaxed text-text-secondary">
            Different roles, same underlying need: knowing exactly what produced
            a result.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {AUDIENCES.map(({ icon: Icon, title, desc, planned, id }) => (
            <div
              key={id}
              className="flex gap-4 p-5 transition-all duration-300 border shadow-sm rounded-xl border-border bg-surface hover:border-primary-light hover:scale-105"
            >
              <div className="flex items-center justify-center w-10 h-10 rounded-lg shrink-0 bg-primary-light">
                <Icon size={20} strokeWidth={1.75} className="text-primary" />
              </div>
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <h3 className="font-heading text-[15px] font-bold text-text">
                    {title}
                  </h3>
                  {planned && (
                    <span className="rounded-full bg-warning/10 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-warning">
                      Soon
                    </span>
                  )}
                </div>
                <p className="text-sm leading-relaxed text-text-secondary">
                  {desc}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default WhoCanUse;
