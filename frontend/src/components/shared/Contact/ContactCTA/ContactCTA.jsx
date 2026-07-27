import React from "react";
import { ArrowRight } from "lucide-react"

import { ROUTES } from "@/constants/routes"

import { CTAButton } from "@/components/components.index"

function ContactCTA() {
  return (
    <section className="py-16 border-t border-border md:py-24">
      <div className="container-custom">
        <div className="px-6 py-12 text-center text-white rounded-2xl bg-gradient-two-tone-2 md:px-10 md:py-14">
          <h2 className="mb-3 font-heading text-2xl font-extrabold tracking-tight md:text-[28px]">
            Still deciding what to say?
          </h2>
          <p className="mx-auto mb-7 max-w-md text-[15px] leading-relaxed text-white/90">
            Take a look at ExperiML first — it might answer your question before
            you even need to ask it.
          </p>
          <CTAButton to={ROUTES.SIGN_IN} icon={ArrowRight} children={"Explore the platform"} />
        </div>
      </div>
    </section>
  );
}

export default ContactCTA;
