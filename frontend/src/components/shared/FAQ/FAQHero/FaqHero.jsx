import React from "react";

import { stats } from "./FaqHeroData";

function FaqHero({ questionCount, categoryCount }) {
  return (
    <section className="py-16 md:py-24">
      <div className="flex flex-col items-center text-center container-custom">
        <div className="inline-flex items-center gap-2 mb-4 text-xs font-semibold tracking-wider uppercase text-primary">
          <span className="h-1.5 w-1.5 rounded-full bg-primary" />
          Knowledge Center
        </div>

        <h1 className="mb-4 max-w-xl font-heading text-3xl font-extrabold leading-tight tracking-tight text-text sm:text-4xl lg:text-[42px]">
          Everything you need to know about ExperiML
        </h1>

        <p className="max-w-lg mb-10 text-base leading-relaxed text-text-secondary">
          What it is, how it works, what it does and doesn't do — organized so
          you can find an answer in seconds instead of searching through docs.
        </p>

        <div className="grid w-full max-w-2xl grid-cols-1 gap-3 sm:grid-cols-3">
          {stats.map(({ icon: Icon, label, value }) => (
            <div
              key={label}
              className="flex items-center gap-3 rounded-xl border border-border bg-surface px-4 py-3.5 shadow-sm"
            >
              <div className="flex items-center justify-center rounded-lg h-9 w-9 shrink-0 bg-primary-light">
                <Icon size={17} strokeWidth={1.75} className="text-primary" />
              </div>
              <div className="text-left">
                <div className="text-sm font-bold font-heading text-text">
                  {value}
                </div>
                <div className="text-xs text-text-secondary">{label}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default FaqHero;
