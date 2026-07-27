import { useState } from "react";
import { FaqItem } from "@/components/components.index";

function FaqAccordion({ groups }) {
  const [openKey, setOpenKey] = useState(null);

  if (groups.length === 0) {
    return (
      <div className="p-10 text-center border shadow-sm rounded-xl border-border bg-surface">
        <p className="text-sm text-text-secondary">
          No questions match your search. Try a different term, or browse a
          category above.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {groups.map((group) => (
        <div key={group.id}>
          {group.showLabel && (
            <div className="flex items-center gap-2 mb-3 text-xs font-semibold tracking-wider uppercase text-primary">
              <span className="h-1.5 w-1.5 rounded-full bg-primary" />
              {group.label}
            </div>
          )}
          <div className="px-5 border shadow-sm rounded-xl border-border bg-surface sm:px-6">
            {group.questions.map((item, i) => {
              const key = `${group.id}-${i}`;
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
        </div>
      ))}
    </div>
  );
}

export default FaqAccordion;
