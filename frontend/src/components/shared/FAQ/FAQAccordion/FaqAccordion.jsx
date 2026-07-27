import { useState } from "react";

import { FaqItem } from "@/components/components.index";

function FaqAccordion({ groups }) {
  const [openKey, setOpenKey] = useState(null);

  if (groups.length === 0) {
    return (
      <div className="px-8 py-16 text-center border rounded-3xl border-border bg-surface">
        <div className="max-w-md mx-auto">
          <h3 className="text-2xl font-bold font-heading text-text">
            No results found
          </h3>

          <p className="mt-3 text-[15px] leading-7 text-text-secondary">
            We couldn't find any questions matching your search.
            Try another keyword or browse one of the categories above.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-12">
      {groups.map((group) => (
        <section key={group.id}>
          {group.showLabel && (
            <header className="mb-6">
              <div className="flex flex-wrap items-center gap-3">
                <h2 className="text-3xl font-bold tracking-tight font-heading text-text">
                  {group.label}
                </h2>

                <span className="px-3 py-1 text-xs font-semibold rounded-full bg-primary-light text-primary">
                  {group.questions.length}{" "}
                  {group.questions.length === 1
                    ? "Question"
                    : "Questions"}
                </span>
              </div>

              <p className="mt-3 max-w-2xl text-[15px] leading-7 text-text-secondary">
                Browse the most frequently asked questions related to{" "}
                <span className="font-medium text-text">
                  {group.label}
                </span>
                .
              </p>
            </header>
          )}

          <div className="border rounded-3xl border-border bg-surface">
            {group.questions.map((item, index) => {
              const key = `${group.id}-${index}`;

              return (
                <FaqItem
                  key={key}
                  question={item.q}
                  answer={item.a}
                  isOpen={openKey === key}
                  onToggle={() =>
                    setOpenKey(
                      openKey === key ? null : key
                    )
                  }
                />
              );
            })}
          </div>
        </section>
      ))}
    </div>
  );
}

export default FaqAccordion;