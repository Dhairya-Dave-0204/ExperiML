import React from "react";

function TechStack() {
  return (
    <section id="tech-stack" className="py-16 border-t border-border md:py-24">
      <div className="container-custom">
        <div className="max-w-xl mb-10">
          <div className="inline-flex items-center gap-2 mb-4 text-xs font-semibold tracking-wider uppercase text-primary">
            <span className="h-1.5 w-1.5 rounded-full bg-primary" />
            Under the hood
          </div>
          <h2 className="mb-3 text-2xl font-extrabold tracking-tight font-heading text-text md:text-3xl">
            Built on a straightforward, dependable stack
          </h2>
          <p className="text-[15px] leading-relaxed text-text-secondary">
            Nothing exotic — just tools chosen for reliability at each layer.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {STACK.map(({ group, items }) => (
            <div
              key={group}
              className="p-5 border shadow-sm rounded-xl border-border bg-surface"
            >
              <div className="mb-3 text-xs font-bold tracking-wider uppercase text-text-secondary">
                {group}
              </div>
              <div className="flex flex-wrap gap-2">
                {items.map((item) => (
                  <span
                    key={item}
                    className="px-3 py-1 font-mono text-xs font-medium border rounded-full border-border bg-surface-soft text-text"
                  >
                    {item}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default TechStack;
