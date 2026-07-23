import { Link } from "react-router-dom";
import { ROUTES } from "@/constants/routes";

import { ArrowRight } from "lucide-react";

import { STEPS } from "./aboutHeroData";
import { PrimaryButton, SecondaryButton } from "@/components/components.index";

function AboutHero() {
  return (
    <section className="py-16 mt-10 md:py-24">
      <div className="container-custom grid grid-cols-1 items-center gap-10 lg:grid-cols-[1.1fr_0.9fr] lg:gap-8">
        <div>
          <div className="inline-flex items-center gap-2 mb-4 text-xs font-semibold tracking-wider uppercase text-primary">
            <span className="h-1.5 w-1.5 rounded-full bg-primary" />
            About ExperiML
          </div>

          <h1 className="mb-4 font-heading text-3xl font-extrabold leading-tight tracking-tight text-text sm:text-4xl lg:text-[44px]">
            A home for every experiment <br /> you run.
          </h1>

          <p className="max-w-lg mb-6 text-base leading-relaxed text-text-secondary">
            ExperiML is a machine learning experiment management platform built
            for students, developers, researchers, and ML engineers — a single
            place to organize datasets, track experiments, compare models, and
            keep every result reproducible.
          </p>

          <div className="flex flex-wrap gap-3">
            <PrimaryButton
              text={"Explore the platform"}
              Element={Link}
              to={ROUTES.SIGN_IN}
            />

            <SecondaryButton text={"View documentation"}
              Element={Link}
              to={ROUTES.DOCS}/>
          </div>
        </div>

        {/* Visual: the shape of the platform, at a glance */}
        <div className="p-5 border shadow-md rounded-xl border-border bg-surface">
          <div className="flex items-center justify-between mb-4">
            <div>
              <div className="text-sm font-bold font-heading text-text">
                One workspace
              </div>
              <div className="text-xs text-text-secondary">
                from raw data to trusted results
              </div>
            </div>
          </div>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            {STEPS.map(({ icon: Icon, label }) => (
              <div
                key={label}
                className="flex items-center gap-2.5 rounded-lg border border-border bg-surface-soft px-3 py-3 transition-all duration-300 hover:scale-105 hover:bg-surface cursor-pointer hover:border-primary/30"
              >
                <div className="flex items-center justify-center w-8 h-8 rounded-md shrink-0 bg-primary-light">
                  <Icon size={16} strokeWidth={1.75} className="text-primary" />
                </div>
                <span className="text-sm font-semibold text-text">{label}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

export default AboutHero;
