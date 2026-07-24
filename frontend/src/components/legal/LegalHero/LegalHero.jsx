import React from "react";

function LegalHero({ badge, title, description, lastUpdated }) {
  return (
    <section className="border-b border-border bg-background">
      <div className="py-16 container-custom md:py-24">
        <div className="max-w-3xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1 mb-5 font-mono text-xs font-semibold tracking-wider uppercase rounded-full bg-primary-soft text-primary">
            <span className="h-1.5 w-1.5 rounded-full bg-primary" />
            {badge}
          </div>

          <h1 className="text-4xl font-extrabold tracking-tight font-heading text-text sm:text-5xl lg:text-6xl">
            {title}
          </h1>

          <p className="max-w-2xl mx-auto mt-6 text-base leading-8 text-text-secondary lg:text-lg">
            {description}
          </p>

          {lastUpdated && (
            <div className="inline-flex items-center px-4 py-2 mt-8 text-sm border rounded-lg border-border bg-surface text-text-secondary">
              <span className="font-semibold text-text">Last Updated:</span>

              <span className="ml-2">{lastUpdated}</span>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

export default LegalHero;
