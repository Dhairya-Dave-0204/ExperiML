import { X, Check } from "lucide-react";

import { PAIRS } from "./whyExperimlExists";

function WhyExperimlExists() {
  return (
    <section
      id="why-it-exists"
      className="py-16 border-t border-border bg-surface-soft md:py-24"
    >
      <div className="container-custom">
        <div className="max-w-xl mb-10">
          <div className="inline-flex items-center gap-2 mb-4 text-xs font-semibold tracking-wider uppercase text-primary">
            <span className="h-1.5 w-1.5 rounded-full bg-primary" />
            Why ExperiML exists
          </div>
          <h2 className="mb-3 text-2xl font-extrabold tracking-tight font-heading text-text md:text-3xl">
            Machine learning work breaks down in familiar ways
          </h2>
          <p className="text-[15px] leading-relaxed text-text-secondary">
            None of these problems are exotic. They're the everyday reality of
            running experiments without dedicated tooling — and each one is a
            reason ExperiML exists.
          </p>
        </div>

        <div className="overflow-hidden border shadow-sm rounded-xl border-border bg-surface">
          <div className="grid grid-cols-1 divide-y divide-border sm:grid-cols-2 sm:divide-y-0 sm:divide-x">
            <div className="px-5 py-3 text-xs font-bold tracking-wider uppercase text-danger sm:px-6">
              Without ExperiML
            </div>
            <div className="px-5 py-3 text-xs font-bold tracking-wider uppercase text-success sm:px-6">
              With ExperiML
            </div>
          </div>
          {PAIRS.map((pair) => (
            <div
              key={pair.id}
              className="grid grid-cols-1 border-t divide-y divide-border border-border sm:grid-cols-2 sm:divide-y-0 sm:divide-x"
            >
              <div className="flex items-start gap-3 px-5 py-4 sm:px-6">
                <X
                  size={16}
                  strokeWidth={2.25}
                  className="mt-0.5 shrink-0 text-danger"
                />
                <span className="text-sm leading-relaxed text-text-secondary">
                  {pair.problem}
                </span>
              </div>
              <div className="flex items-start gap-3 px-5 py-4 sm:px-6">
                <Check
                  size={16}
                  strokeWidth={2.25}
                  className="mt-0.5 shrink-0 text-success"
                />
                <span className="text-sm leading-relaxed text-text">
                  {pair.solution}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default WhyExperimlExists;
