import { useState } from "react";
import { SearchX } from "lucide-react";

import { FaqItem } from "@/components/components.index";

function FaqAccordion({ groups, isSearching, searchQuery }) {
  const [openKey, setOpenKey] = useState(null);

  if (groups.length === 0) {
    return (
      <div className="flex flex-col items-center px-8 py-20 text-center border border-dashed rounded-2xl border-border">
        <div className="flex items-center justify-center w-12 h-12 mb-4 rounded-full bg-surface-soft">
          <SearchX
            size={20}
            strokeWidth={1.75}
            className="text-text-secondary"
          />
        </div>

        <h3 className="text-lg font-bold font-heading text-text">
          No results found
        </h3>

        <p className="max-w-sm mt-2 text-sm leading-relaxed text-text-secondary">
          {isSearching
            ? `Nothing matched "${searchQuery}". Try a different term, or pick a category from the list.`
            : "This category doesn't have any questions yet."}
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-10">
      {groups.map((group) => (
        <section key={group.id}>
          {group.showLabel && (
            <header className="flex items-center justify-between gap-4 pb-4 mb-4 border-b border-border">
              <div className="flex items-center min-w-0 gap-4">
                {group.icon && (
                  <div className="flex items-center justify-center rounded-lg h-9 w-9 shrink-0 bg-primary-light text-primary">
                    <group.icon size={17} strokeWidth={1.75} />
                  </div>
                )}
                <h2 className="text-xl font-bold tracking-tight truncate font-heading text-text sm:text-2xl">
                  {group.label}
                </h2>
              </div>

              <span className="text-xs font-semibold shrink-0 text-text-secondary">
                {group.questions.length}{" "}
                {group.questions.length === 1 ? "question" : "questions"}
              </span>
            </header>
          )}

          <div className="border rounded-2xl border-border bg-surface">
            {group.questions.map((item, index) => {
              const key = `${group.id}-${index}`;

              return (
                <FaqItem
                  key={key}
                  question={item.q}
                  answer={item.a}
                  isOpen={openKey === key}
                  onToggle={() => setOpenKey(openKey === key ? null : key)}
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
