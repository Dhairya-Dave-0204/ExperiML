import React from "react";

import ContactCard from "./ContactCard";

import { CONTACT_ITEMS } from "./contactInfoData";

function ContactInfo() {
  return (
    <section className="py-16 border-t border-border md:py-24">
      <div className="container-custom">
        <div className="max-w-xl mb-10">
          <div className="inline-flex items-center gap-2 mb-4 text-xs font-semibold tracking-wider uppercase text-primary">
            <span className="h-1.5 w-1.5 rounded-full bg-primary" />
            Contact information
          </div>
          <h2 className="mb-3 text-2xl font-extrabold tracking-tight font-heading text-text md:text-3xl">
            A few ways to reach out
          </h2>
          <p className="text-[15px] leading-relaxed text-text-secondary">
            Pick whichever feels right — every channel reaches the same place.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {CONTACT_ITEMS.map((item) => (
            <ContactCard key={item.id} {...item} />
          ))}
        </div>
      </div>
    </section>
  );
}

export default ContactInfo;
