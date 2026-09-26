import {
  Clock3,
  Cpu,
  Database,
  Ellipsis,
} from "lucide-react";

import ExperimentStatusPill from "./ExperimentStatusPill";

const ExperimentListItem = ({ experiment, onClick }) => {
  return (
    <>
      {/* Desktop / Tablet */}
      <tr className="transition-colors group hover:bg-muted/30">
        <td className="px-4 py-3.5">
          <button
            type="button"
            onClick={onClick}
            className="text-left"
          >
            <p className="max-w-[230px] truncate text-sm font-medium text-foreground transition-colors group-hover:text-primary">
              {experiment.name}
            </p>

            <p className="mt-0.5 max-w-[280px] truncate text-xs text-muted-foreground">
              {experiment.description}
            </p>
          </button>
        </td>

        <td className="px-4 py-3.5">
          <ExperimentStatusPill status={experiment.status} />
        </td>

        <td className="px-4 py-3.5">
          <div className="flex items-center min-w-0 gap-2">
            <Database className="h-3.5 w-3.5 shrink-0 text-muted-foreground" />

            <span className="max-w-[150px] truncate text-sm text-foreground">
              {experiment.dataset}
            </span>
          </div>
        </td>

        <td className="px-4 py-3.5">
          <div className="flex items-center min-w-0 gap-2">
            <Cpu className="h-3.5 w-3.5 shrink-0 text-muted-foreground" />

            <span className="max-w-[130px] truncate text-sm text-foreground">
              {experiment.algorithm}
            </span>
          </div>
        </td>

        <td className="px-4 py-3.5">
          <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
            <Clock3 className="h-3.5 w-3.5" />
            {experiment.updatedAt}
          </div>
        </td>

        <td className="px-3 py-3.5">
          <button
            type="button"
            className="flex items-center justify-center w-8 h-8 transition-all rounded-md opacity-0 text-muted-foreground hover:bg-muted hover:text-foreground group-hover:opacity-100 focus:opacity-100"
            aria-label={`More actions for ${experiment.name}`}
            onClick={(event) => event.stopPropagation()}
          >
            <Ellipsis className="w-4 h-4" />
          </button>
        </td>
      </tr>

      {/* Mobile */}
      <div className="w-full p-4 text-left transition-colors border rounded-lg group border-border bg-card hover:bg-muted/30">
        <button
          type="button"
          onClick={onClick}
          className="w-full text-left focus:outline-none"
        >
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0">
              <p className="text-sm font-medium truncate text-foreground group-hover:text-primary">
                {experiment.name}
              </p>

              <p className="mt-1 text-xs leading-5 line-clamp-2 text-muted-foreground">
                {experiment.description}
              </p>
            </div>

            <ExperimentStatusPill status={experiment.status} />
          </div>

          <div className="mt-4 grid grid-cols-1 gap-2.5 border-t border-border pt-3">
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <Database className="h-3.5 w-3.5 shrink-0" />

              <span className="truncate">
                {experiment.dataset}
              </span>
            </div>

            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <Cpu className="h-3.5 w-3.5 shrink-0" />

              <span className="truncate">
                {experiment.algorithm}
              </span>
            </div>

            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <Clock3 className="h-3.5 w-3.5 shrink-0" />

              <span>
                Updated {experiment.updatedAt}
              </span>
            </div>
          </div>
        </button>
      </div>
    </>
  );
};

export default ExperimentListItem;