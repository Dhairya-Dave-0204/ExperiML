import React from "react";
import { HIGHLIGHTS } from "./authHeroData"

import { FlaskConical, Activity } from "lucide-react"

function AuthHero() {
  return (
    <div className="relative hidden overflow-hidden bg-surface-soft lg:flex lg:flex-col lg:justify-between lg:p-12 xl:p-16">
      {/* Decorative background — restrained, blurred, low opacity */}
      <div
        aria-hidden="true"
        className="absolute rounded-full pointer-events-none -top-24 -left-24 h-80 w-80 bg-gradient-two-tone-2 opacity-20 blur-3xl"
      />
      <div
        aria-hidden="true"
        className="absolute rounded-full pointer-events-none -bottom-32 -right-16 h-96 w-96 bg-gradient-two-tone-1 opacity-15 blur-3xl"
      />

      <a
        href="/"
        className="relative inline-flex items-center gap-2 text-lg font-extrabold text-text"
      >
        <FlaskConical size={22} strokeWidth={2} className="text-primary" />
        ExperiML
      </a>

      <div className="relative max-w-md mt-12">
        <h1 className="mb-4 font-heading text-4xl font-extrabold leading-tight tracking-tight text-text xl:text-[44px]">
          Welcome back.
        </h1>
        <p className="mb-8 text-[15px] leading-relaxed text-text-secondary">
          Continue building better ML workflows. Pick up right where you left
          off — your datasets, experiments, and models are exactly as you left
          them.
        </p>

        <ul className="grid grid-cols-2 gap-3">
          {HIGHLIGHTS.map(({ icon: Icon, label }) => (
            <li
              key={label}
              className="flex items-center gap-2.5 rounded-lg border border-border bg-surface px-3.5 py-3 shadow-sm"
            >
              <div className="flex items-center justify-center rounded-md h-7 w-7 shrink-0 bg-primary-light">
                <Icon size={14} strokeWidth={1.75} className="text-primary" />
              </div>
              <span className="text-sm font-medium text-text">{label}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* Floating preview card — echoes the run-comparison widget used on the landing page */}
      <div className="relative max-w-sm p-5 mt-12 border shadow-lg rounded-2xl border-border bg-surface">
        <div className="flex items-center justify-between mb-3">
          <div>
            <div className="text-xs font-bold font-heading text-text">
              digit-classifier
            </div>
            <div className="text-[11px] text-text-secondary">
              3 active experiments
            </div>
          </div>
          <Activity
            size={14}
            strokeWidth={1.75}
            className="text-text-secondary"
          />
        </div>
        <div className="flex items-center justify-between rounded-lg bg-primary-light px-3 py-2.5">
          <div>
            <div className="text-xs font-semibold text-text">
              resnet18-aug-v3
            </div>
            <div className="text-[11px] text-text-secondary">epoch 42/50</div>
          </div>
          <span className="font-mono text-xs font-bold text-primary">
            97.8%
          </span>
        </div>
      </div>
    </div>
  );
}

export default AuthHero;
