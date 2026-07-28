import { Link } from "react-router-dom";

import { ROUTES } from "@/constants/routes"

import { PrimaryButton, SecondaryButton } from "@/components/components.index"

function FaqCta() {
  return (
    <section className="py-16 border-t border-border md:py-24 bg-surface-soft">
      <div className="container-custom">
        <div
          className="relative px-8 overflow-hidden border rounded-3xl border-border bg-surface py-14 md:px-16 md:py-16"
        >
          {/* Ambient Background */}

          <div className="absolute inset-0 pointer-events-none">
            <div className="absolute w-56 h-56 rounded-full -top-24 left-16 bg-primary/5 blur-3xl" />

            <div className="absolute w-56 h-56 rounded-full -bottom-24 right-10 bg-secondary/5 blur-3xl" />
          </div>

          <div className="relative flex flex-col items-center max-w-4xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 px-3 py-1 mb-5 font-mono text-xs font-semibold tracking-wider uppercase rounded-full bg-primary-soft text-primary">
              <span className="h-1.5 w-1.5 rounded-full bg-primary" />
              Need Support?
            </div>

            <h2 className="text-3xl font-bold tracking-tight font-heading text-text md:text-4xl">
              Need a more specific answer?
            </h2>

            <p className="mt-5 max-w-2xl text-[15px] leading-8 text-text-secondary">
              If you couldn't find what you were looking for, feel free to get
              in touch. Whether it's a feature question, technical issue, or
              product feedback, every message is reviewed personally.
            </p>

            <div className="flex flex-col gap-4 mt-10 sm:flex-row">
              <PrimaryButton Element={Link} text={"Contact Me"} to={ROUTES.CONTACT} />

              <SecondaryButton Element={Link} text={"Browse Documentation"} to={ROUTES.DOCS} />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default FaqCta;
