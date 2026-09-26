import { Search, SlidersHorizontal, X, ChevronDown } from "lucide-react";

const STATUS_OPTIONS = [
  "All",
  "Running",
  "Queued",
  "Completed",
  "Draft",
  "Failed",
];

const ExperimentsToolbar = ({
  search,
  onSearchChange,
  statusFilter,
  onStatusFilterChange,
}) => {
  return (
    <div className="flex flex-col gap-3 mt-6 lg:flex-row lg:items-center lg:justify-between">
      <div className="relative w-full lg:max-w-md">
        <Search className="absolute w-4 h-4 -translate-y-1/2 pointer-events-none left-3 top-1/2 text-muted-foreground" />

        <input
          type="text"
          value={search}
          onChange={(event) => onSearchChange(event.target.value)}
          placeholder="Search experiments..."
          className="w-full h-10 text-sm transition-colors border rounded-md outline-none border-input bg-background pl-9 pr-9 text-foreground placeholder:text-muted-foreground focus:border-ring focus:ring-2 focus:ring-ring/20"
        />

        {search && (
          <button
            type="button"
            onClick={() => onSearchChange("")}
            className="absolute flex items-center justify-center w-6 h-6 transition-colors -translate-y-1/2 rounded right-2 top-1/2 text-muted-foreground hover:bg-muted hover:text-foreground"
            aria-label="Clear search"
          >
            <X className="h-3.5 w-3.5" />
          </button>
        )}
      </div>

      <div className="flex flex-col w-full gap-2 sm:flex-row sm:items-center lg:w-auto">
        <div className="flex items-center h-10 gap-2 px-3 text-sm border rounded-md border-input bg-background text-muted-foreground">
          <SlidersHorizontal className="h-3.5 w-3.5" />
          <span className="hidden sm:inline">Status</span>
        </div>

        <div className="relative w-full sm:w-44">
          <select
            value={statusFilter}
            onChange={(event) =>
              onStatusFilterChange(event.target.value)
            }
            className="w-full h-10 px-3 text-sm transition-colors border rounded-md outline-none appearance-none border-input bg-background pr-9 text-foreground focus:border-ring focus:ring-2 focus:ring-ring/20"
          >
            {STATUS_OPTIONS.map((status) => (
              <option key={status} value={status}>
                {status}
              </option>
            ))}
          </select>

          <ChevronDown className="absolute w-4 h-4 -translate-y-1/2 pointer-events-none right-3 top-1/2 text-muted-foreground" />
        </div>
      </div>
    </div>
  );
};

export default ExperimentsToolbar;