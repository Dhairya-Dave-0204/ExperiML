import React from "react";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";

import { ROUTES } from "@/constants/routes";
import { CTAButton, SecondaryButton } from "@/components/components.index";

function ClosingCta() {
  return (
    <section className="py-16 border-t border-border md:py-24">
      <div className="container-custom">
        <div className="relative px-6 overflow-hidden border shadow-md rounded-3xl border-border bg-surface py-14 md:px-10 md:py-18">
          {/* Background */}

          <div className="absolute inset-0">
            {/* soft radial accent */}
            <div className="absolute top-0 w-64 h-64 rounded-full -left-20 bg-primary/8 blur-3xl" />

            <div className="absolute bottom-0 rounded-full -right-20 h-72 w-72 bg-primary/10 blur-3xl" />

            {/* engineering grid */}
            <div
              className="
                absolute
                inset-0
                opacity-[0.04]
                bg-[radial-gradient(circle,#2563eb_1px,transparent_1px)]
                bg-size-[22px_22px]
              "
            />
          </div>

          {/* Content */}
          <div className="relative max-w-3xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 px-3 py-1 mb-5 font-mono text-xs font-semibold tracking-wider uppercase rounded-full bg-primary-soft text-primary">
              <span className="h-1.5 w-1.5 rounded-full bg-primary" />
              Ready to Start
            </div>

            <h2 className="text-3xl font-extrabold tracking-tight font-heading text-text sm:text-4xl lg:text-5xl">
              See it for yourself
            </h2>

            <p className="max-w-2xl mx-auto mt-6 text-base leading-8 text-text-secondary lg:text-lg">
              The best way to understand ExperiML is to bring in a dataset,
              train a model, and experience how every stage stays organized from
              start to finish.
            </p>

            <div className="flex flex-col justify-center gap-4 mt-10 sm:flex-row">
              <CTAButton
                to={ROUTES.SIGN_IN}
                icon={ArrowRight}
                className="min-w-55 px-6 py-3.5"
              >
                Create Free Account
              </CTAButton>

              <SecondaryButton
                Element={Link}
                to={ROUTES.DOCS}
                text="Read the Documentation"
                className="
                  min-w-55
                  px-6
                  py-3.5
                "
              />
            </div>

            <p className="mt-6 text-sm text-text-secondary">
              No setup complexity. No unnecessary configuration. Just upload
              your data and begin experimenting.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

export default ClosingCta;
