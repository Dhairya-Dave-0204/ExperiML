import React from "react";

import { Search, X } from "lucide-react";

function FaqSearch({ value, onChange }) {
  return (
    <div className="relative max-w-xl mx-auto">
      <Search
        size={18}
        strokeWidth={1.75}
        className="absolute -translate-y-1/2 pointer-events-none left-4 top-1/2 text-text-secondary"
      />
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Search questions — e.g. dataset versioning, predictions, privacy..."
        aria-label="Search frequently asked questions"
        className="w-full py-3 text-sm transition-colors duration-150 border shadow-sm rounded-xl border-border bg-surface pl-11 pr-11 text-text placeholder:text-text-secondary/70 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary-light"
      />
      {value && (
        <button
          type="button"
          onClick={() => onChange("")}
          aria-label="Clear search"
          className="absolute right-3.5 top-1/2 -translate-y-1/2 text-text-secondary transition-colors duration-150 hover:text-text"
        >
          <X size={16} strokeWidth={1.75} />
        </button>
      )}
    </div>
  );
}

export default FaqSearch;
