import { ChevronDown } from "lucide-react";

function FaqItem({ question, answer, isOpen, onToggle }) {
  return (
    <article className="p-5 border-b border-border/60 last:border-b-0">
      <h3>
        <button
          type="button"
          onClick={onToggle}
          aria-expanded={isOpen}
          className="flex items-start justify-between w-full gap-4 px-5 py-5 text-left transition-colors duration-200 group hover:bg-surface-soft/60 sm:px-6"
        >
          <span
            className={`
              flex-1 min-w-0 text-[15px] font-semibold leading-6 transition-colors duration-200
              ${isOpen ? "text-primary" : "text-text group-hover:text-primary"}
            `}
          >
            {question}
          </span>

          <span
            className={`
              mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full
              transition-all duration-300
              ${
                isOpen
                  ? "rotate-180 bg-primary-light text-primary"
                  : "bg-surface-soft text-text-secondary group-hover:bg-primary-light group-hover:text-primary"
              }
            `}
          >
            <ChevronDown size={15} strokeWidth={2} />
          </span>
        </button>
      </h3>

      {/*
        Expand/collapse via grid-template-rows (0fr -> 1fr) rather than a
        fixed max-height, so the answer is never clipped regardless of how
        long it is or how narrow the content pane gets.
      */}
      <div
        className={`
          grid overflow-hidden transition-[grid-template-rows] duration-300 ease-in-out
          ${isOpen ? "grid-rows-[1fr]" : "grid-rows-[0fr]"}
        `}
      >
        <div
          className={`
            min-h-0 overflow-hidden transition-opacity duration-200
            ${isOpen ? "opacity-100 delay-100" : "opacity-0"}
          `}
        >
          <div className="px-5 pb-5 sm:px-6">
            <p className="max-w-2xl text-sm leading-7 text-text-secondary">
              {answer}
            </p>
          </div>
        </div>
      </div>
    </article>
  );
}

export default FaqItem;
