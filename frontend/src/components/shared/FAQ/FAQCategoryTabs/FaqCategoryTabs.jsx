function FaqCategoryTabs({ categories, activeId, onSelect }) {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {categories.map(({ id, label, icon: Icon, questions }) => {
        const isActive = id === activeId;

        return (
          <button
            key={id}
            type="button"
            onClick={() => onSelect(id)}
            className={`
              group
              relative
              flex
              min-h-[148px]
              flex-col
              rounded-2xl
              border
              p-6
              text-left
              transition-all
              duration-200
              ${
                isActive
                  ? "border-primary bg-primary/5 shadow-sm"
                  : "border-border bg-background hover:border-primary/40 hover:bg-surface"
              }
            `}
          >
            {/* Left Accent */}

            <span
              className={`
                absolute
                left-0
                top-6
                bottom-6
                w-1
                rounded-r-full
                transition-colors
                duration-200
                ${
                  isActive
                    ? "bg-primary"
                    : "bg-transparent group-hover:bg-primary/30"
                }
              `}
            />

            {/* Icon */}

            <div
              className={`
                flex
                h-10
                w-10
                items-center
                justify-center
                rounded-xl
                transition-colors
                duration-200
                ${
                  isActive
                    ? "bg-primary-light text-primary"
                    : "bg-surface-soft text-text-secondary group-hover:text-primary"
                }
              `}
            >
              <Icon size={18} strokeWidth={1.8} />
            </div>

            {/* Content */}

            <div className="flex flex-col justify-end flex-1 mt-5">
              <div className="flex items-center justify-between gap-3">
                <h3
                  className={`
                    text-base
                    font-semibold
                    leading-6
                    transition-colors
                    duration-200
                    ${isActive ? "text-primary" : "text-text"}
                  `}
                >
                  {label}
                </h3>

                <span
                  className={`
                    shrink-0
                    rounded-full
                    px-2.5
                    py-1
                    text-xs
                    font-semibold
                    ${
                      isActive
                        ? "bg-primary-light text-primary"
                        : "bg-surface-soft text-text-secondary"
                    }
                  `}
                >
                  {questions.length}
                </span>
              </div>

              <p className="mt-2 text-sm leading-6 text-text-secondary">
                {questions.length}{" "}
                {questions.length === 1 ? "question" : "questions"}
              </p>
            </div>
          </button>
        );
      })}
    </div>
  );
}

export default FaqCategoryTabs;
