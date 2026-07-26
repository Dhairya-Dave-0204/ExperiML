import React from "react";
import { TRAITS } from "./developerSectionData"

function DeveloperSection() {
  return (
    <section className="py-16 border-t border-border bg-surface-soft md:py-24">
      <div className="container-custom grid grid-cols-1 gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:gap-16">
        <div>
          <div className="inline-flex items-center gap-2 mb-4 text-xs font-semibold tracking-wider uppercase text-primary">
            <span className="h-1.5 w-1.5 rounded-full bg-primary" />
            The person behind ExperiML
          </div>
          <h2 className="mb-4 text-2xl font-extrabold tracking-tight font-heading text-text md:text-3xl">
            Hi — thanks for stopping by
          </h2>
          <p className="max-w-md text-[15px] leading-relaxed text-text-secondary">
            ExperiML is built by one person who cares more about getting the
            fundamentals right than shipping something flashy. If you're curious
            about the platform, want to talk shop about ML tooling, or just want
            to say hi — that's exactly what this page is for.
          </p>
        </div>

        <div className="p-6 border shadow-sm rounded-xl border-border bg-surface md:p-8">
          <ul className="divide-y divide-border">
            {TRAITS.map(({ id, icon: Icon, text }) => (
              <li
                key={id}
                className="flex items-start gap-3 py-3.5 first:pt-0 last:pb-0"
              >
                <div className="flex items-center justify-center w-8 h-8 rounded-md shrink-0 bg-primary-light">
                  <Icon size={15} strokeWidth={1.75} className="text-primary" />
                </div>
                <span className="pt-1 text-sm leading-relaxed text-text">
                  {text}
                </span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}

export default DeveloperSection;
