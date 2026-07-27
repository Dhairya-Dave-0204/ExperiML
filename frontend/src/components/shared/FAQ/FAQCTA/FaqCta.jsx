import React from 'react'
import { ArrowRight, MessageCircle } from "lucide-react";

function FaqCta() {
  return (
    <section className="py-16 border-t border-border md:py-24">
      <div className="container-custom">
        <div className="px-6 py-12 text-center text-white rounded-2xl bg-gradient-two-tone-2 md:px-10 md:py-14">
          <div className="flex items-center justify-center mx-auto mb-4 h-11 w-11 rounded-xl bg-white/15">
            <MessageCircle size={20} strokeWidth={1.75} className="text-white" />
          </div>
          <h2 className="mb-3 font-heading text-2xl font-extrabold tracking-tight md:text-[28px]">
            Still have questions?
          </h2>
          <p className="mx-auto mb-7 max-w-md text-[15px] leading-relaxed text-white/90">
            If you couldn't find what you were looking for here, reach out
            directly — every message goes straight to the person building
            ExperiML.
          </p>
          <a
            href="/contact"
            className="inline-flex items-center gap-2 rounded-lg bg-white px-5 py-2.5 text-sm font-semibold text-primary transition-colors duration-150 hover:bg-surface-soft"
          >
            Contact us <ArrowRight size={16} />
          </a>
        </div>
      </div>
    </section>
  );
}

export default FaqCta