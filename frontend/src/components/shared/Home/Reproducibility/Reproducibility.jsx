import React from "react";
import { CheckCircle2 } from "lucide-react";

import { REPRODUCIBILITY } from "./reproducibilityData";
import ReproDiffViewer from "./ReproDiffViewer";

function Reproducibility() {
  return (
    <section className="section-padding bg-border/40">
      <div className="grid items-center grid-cols-1 gap-16 container-custom xl:grid-cols-2">
        {/* Left Content */}

        <div>
          <div
            className="mb-5
              inline-flex
              items-center
              rounded-full
              bg-surface
              px-4
              py-1.5
              font-mono
              text-xs
              font-semibold
              text-primary"
          >
            {REPRODUCIBILITY.badge}
          </div>

          <h2 className="mb-6 text-4xl font-extrabold leading-tight font-heading text-text lg:text-5xl">
            {REPRODUCIBILITY.title}
          </h2>

          <p className="max-w-xl mb-8 leading-8 text-md text-text-secondary">
            {REPRODUCIBILITY.description}
          </p>

          <ul className="flex flex-col gap-4">
            {REPRODUCIBILITY.features.map((feature) => (
              <li
                key={feature.id}
                className="flex items-center gap-3 text-[15px] text-text"
              >
                <CheckCircle2 size={20} className="shrink-0 text-success" />

                <span>{feature.text}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Diff Viewer */}

        <ReproDiffViewer />
      </div>
    </section>
  );
}

export default Reproducibility;
