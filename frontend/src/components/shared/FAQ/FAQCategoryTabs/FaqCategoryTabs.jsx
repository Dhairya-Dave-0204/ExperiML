import { motion } from "framer-motion";

import {
  staggerFast,
  listItemReveal,
  defaultViewport,
} from "@/animations/animations.index";

function FaqCategoryTabs({ categories, activeId, onSelect }) {
  return (
    <nav aria-label="FAQ categories">
      <motion.div
        variants={staggerFast}
        initial="hidden"
        whileInView="visible"
        viewport={defaultViewport}
        className="flex gap-2 pb-1 overflow-x-auto lg:flex-col lg:overflow-visible lg:pb-0"
      >
        {categories.map(({ id, label, icon: Icon, questions }) => {
          const isActive = id === activeId;

          return (
            <motion.button
              key={id}
              variants={listItemReveal}
              type="button"
              onClick={() => onSelect(id)}
              aria-current={isActive ? "true" : undefined}
              className={`
                relative
                group flex shrink-0 items-center gap-2 whitespace-nowrap rounded-full
                border px-3.5 py-2 text-sm font-medium transition-colors duration-150

                lg:w-full lg:shrink lg:justify-between lg:whitespace-normal
                lg:rounded-lg lg:border-0 lg:px-3 lg:py-2.5

                ${
                  isActive
                    ? "border-primary bg-primary-light text-primary lg:bg-primary-light"
                    : "border-border bg-surface text-text-secondary hover:border-border-hover hover:text-text lg:border-transparent lg:bg-transparent lg:hover:bg-surface-soft lg:hover:text-text"
                }
              `}
            >
              {isActive && (
                <motion.span
                  layoutId="faq-active-category"
                  className="absolute inset-0 rounded-[inherit] bg-primary-light z-0"
                  transition={{
                    type: "spring",
                    stiffness: 420,
                    damping: 32,
                  }}
                />
              )}

              <span className="relative z-10 flex min-w-0 items-center gap-2.5">
                <Icon size={16} strokeWidth={1.75} className="shrink-0" />

                <span className="truncate">{label}</span>
              </span>

              <span
                className={`
                  relative z-10
                  shrink-0 rounded-full px-2.5 py-1 text-[11px] font-semibold leading-none

                  ${
                    isActive
                      ? "bg-primary/15 text-primary"
                      : "bg-surface-soft text-text-secondary lg:bg-border/50"
                  }
                `}
              >
                {questions.length}
              </span>
            </motion.button>
          );
        })}
      </motion.div>
    </nav>
  );
}

export default FaqCategoryTabs;
