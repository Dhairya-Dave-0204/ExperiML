function FaqCategoryTabs({ categories, activeId, onSelect }) {
  return (
    <nav aria-label="FAQ categories">
      <div className="flex gap-2 pb-1 overflow-x-auto lg:flex-col lg:overflow-visible lg:pb-0">
        {categories.map(({ id, label, icon: Icon, questions }) => {
          const isActive = id === activeId;

          return (
            <button
              key={id}
              type="button"
              onClick={() => onSelect(id)}
              aria-current={isActive ? "true" : undefined}
              className={`
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
              <span className="flex min-w-0 items-center gap-2.5">
                <Icon size={16} strokeWidth={1.75} className="shrink-0" />
                <span className="truncate">{label}</span>
              </span>

              <span
                className={`
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
            </button>
          );
        })}
      </div>
    </nav>
  );
}

export default FaqCategoryTabs;
