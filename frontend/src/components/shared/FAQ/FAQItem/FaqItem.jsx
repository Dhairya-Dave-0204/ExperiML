import { ChevronDown } from "lucide-react";

function FaqItem({ question, answer, isOpen, onToggle }) {
  return (
    <article className="border-b border-border/60 last:border-b-0">
      <button
        type="button"
        onClick={onToggle}
        aria-expanded={isOpen}
        className="flex items-start justify-between w-full gap-5 px-6 text-left transition-colors duration-200 group py-7 hover:bg-surface-soft/50 md:px-8"
      >
        <div className="flex-1 pr-2">
          <h3
            className={`
              text-[16px]
              font-semibold
              leading-7
              transition-colors
              duration-200
              ${isOpen ? "text-primary" : "text-text group-hover:text-primary"}
            `}
          >
            {question}
          </h3>
        </div>

        <div
          className={`
            mt-0.5
            flex
            h-8
            w-8
            shrink-0
            items-center
            justify-center
            rounded-full
            transition-all
            duration-300
            ${
              isOpen
                ? "rotate-180 bg-primary-light text-primary"
                : "bg-surface-soft text-text-secondary group-hover:bg-primary-light group-hover:text-primary"
            }
          `}
        >
          <ChevronDown size={16} strokeWidth={2} />
        </div>
      </button>

      <div
        className={`
          overflow-hidden
          transition-all
          duration-300
          ease-in-out
          ${isOpen ? "max-h-150 opacity-100" : "max-h-0 opacity-0"}
        `}
      >
        <div className="px-6 pb-7 md:px-8">
          <div className="max-w-3xl">
            <p className="text-[15px] leading-8 text-text-secondary">
              {answer}
            </p>
          </div>
        </div>
      </div>
    </article>
  );
}

export default FaqItem;
