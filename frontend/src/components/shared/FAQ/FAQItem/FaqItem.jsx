import React from "react";
import { ChevronDown } from "lucide-react";

function FaqItem({ question, answer, isOpen, onToggle }) {
  return (
    <div className="border-b border-border last:border-b-0">
      <h3>
        <button
          type="button"
          onClick={onToggle}
          aria-expanded={isOpen}
          className="flex items-center justify-between w-full gap-4 py-4 text-left transition-colors duration-150 hover:text-primary"
        >
          <span className="text-[15px] font-semibold text-text">
            {question}
          </span>
          <ChevronDown
            size={18}
            strokeWidth={2}
            className={`shrink-0 text-text-secondary transition-transform duration-200 ${
              isOpen ? "rotate-180 text-primary" : ""
            }`}
          />
        </button>
      </h3>

      <div
        className={`grid overflow-hidden transition-[grid-template-rows] duration-200 ease-out ${
          isOpen ? "grid-rows-[1fr]" : "grid-rows-[0fr]"
        }`}
      >
        <div className="min-h-0 overflow-hidden">
          <p className="max-w-2xl pb-4 text-sm leading-relaxed text-text-secondary">
            {answer}
          </p>
        </div>
      </div>
    </div>
  );
}

export default FaqItem;
