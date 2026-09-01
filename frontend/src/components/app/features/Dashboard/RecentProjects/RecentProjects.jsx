import { ChevronRight } from "lucide-react";

function RecentProjects({ data = [] }) {
  return (
    <div className="border rounded-xl border-border bg-surface">
      <div className="flex items-center justify-between px-5 py-4 border-b border-border">
        <h3 className="text-sm font-bold font-heading text-text">Projects</h3>

        <button
          type="button"
          className="inline-flex items-center gap-1 text-xs font-semibold text-primary hover:text-primary-dark"
        >
          View all
          <ChevronRight size={13} strokeWidth={2.5} />
        </button>
      </div>

      {data.length > 0 ? (
        <ul>
          {data.map((project) => (
            <li
              key={project.id}
              className="
                flex
                items-center
                justify-between
                gap-3
                border-b
                border-border
                px-5
                py-3.5
                transition-colors
                duration-150
                last:border-b-0
                hover:bg-surface-soft
              "
            >
              <span className="text-sm font-semibold truncate text-text">
                {project.name}
              </span>

              <span className="text-xs shrink-0 text-text-secondary">
                {project.experiments} experiments · {project.datasets} datasets
              </span>
            </li>
          ))}
        </ul>
      ) : (
        <div className="px-5 py-8 text-sm text-center text-text-secondary">
          No projects yet.
        </div>
      )}
    </div>
  );
}

export default RecentProjects;
