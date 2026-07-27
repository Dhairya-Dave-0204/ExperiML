import React from "react";

function FaqCategoryTabs({ categories, activeId, onSelect }) {
  return (
    <div
      role="tablist"
      aria-label="FAQ categories"
      className="flex flex-wrap gap-2"
    >
      {categories.map(({ id, label, icon: Icon }) => {
        const isActive = id === activeId;
        return (
          <button
            key={id}
            type="button"
            role="tab"
            aria-selected={isActive}
            onClick={() => onSelect(id)}
            className={`inline-flex items-center gap-2 rounded-full border px-4 py-2 text-sm font-medium transition-colors duration-150 ${
              isActive
                ? "border-primary bg-primary-light text-primary"
                : "border-border bg-surface text-text-secondary hover:border-border-hover hover:text-text"
            }`}
          >
            <Icon size={15} strokeWidth={1.75} />
            {label}
          </button>
        );
      })}
    </div>
  );
}

export default FaqCategoryTabs;
