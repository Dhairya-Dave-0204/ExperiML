import React from "react";

function LegalSection({ id, title, children }) {
  return (
    <section id={id} className="py-10 border-t border-border first:border-t-0 md:py-12">
      <div className="max-w-4xl">
        <h2 className="mb-5 text-2xl font-bold tracking-tight font-heading text-text md:text-3xl">
          {title}
        </h2>

        <div className="space-y-5 text-base leading-8 text-text-secondary">
          {children}
        </div>
      </div>
    </section>
  );
}

export default LegalSection;
