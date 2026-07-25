import React from 'react'
import { MessageCircle } from "lucide-react";

function ContactHero() {
    return (
    <section className="py-16 mt-10 md:py-24">
      <div className="flex flex-col items-center text-center container-custom">
 
        <div className="inline-flex items-center gap-2 mb-4 text-xs font-semibold tracking-wider uppercase text-primary">
          <span className="h-1.5 w-1.5 rounded-full bg-primary" />
          Get in touch
        </div>
 
        <h1 className="mb-4 max-w-xl font-heading text-3xl font-extrabold leading-tight tracking-tight text-text sm:text-4xl lg:text-[42px]">
          Questions, feedback, or an idea worth discussing?
        </h1>
 
        <p className="max-w-lg text-base leading-relaxed text-text-secondary">
          Whether it's a technical question, a bug you've spotted, or a
          collaboration idea — reach out. Every message about ExperiML goes
          straight to the person building it.
        </p>
      </div>
    </section>
  );
}

export default ContactHero