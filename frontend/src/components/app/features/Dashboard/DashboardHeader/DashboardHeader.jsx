import { Search } from "lucide-react";

function DashboardHeader() {
  return (
    <header className="flex items-center justify-between gap-4 px-4 py-3 border-b border-border bg-surface sm:px-6">
      <h1 className="font-heading text-[15px] font-bold text-text">Overview</h1>

      <div className="hidden sm:block">
        <div className="relative">
          <Search
            size={15}
            strokeWidth={1.85}
            className="absolute -translate-y-1/2 pointer-events-none  left-3 top-1/2 text-text-secondary"
          />

          <input
            type="text"
            placeholder="Search projects, experiments..."
            className="
              w-80
              rounded-lg
              border
              border-border
              bg-surface-soft
              py-1.5
              pl-9
              pr-14
              text-sm
              text-text
              placeholder:text-text-secondary/70
              transition-colors
              duration-150
              focus:border-primary
              focus:outline-none
              focus:ring-2
              focus:ring-primary-light
            "
          />

          <kbd
            className="
              absolute
              right-2.5
              top-1/2
              -translate-y-1/2
              rounded
              border
              border-border
              bg-surface
              px-1.5
              py-0.5
              font-mono
              text-[10px]
              text-text-secondary
            "
          >
            ⌘K
          </kbd>
        </div>
      </div>
    </header>
  );
}

export default DashboardHeader;
