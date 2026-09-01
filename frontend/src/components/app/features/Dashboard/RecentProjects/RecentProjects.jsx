import { ChevronRight, FolderKanban } from "lucide-react";

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
        <div className="flex flex-col items-center px-5 py-8 text-center">
          <div className="flex items-center justify-center w-10 h-10 mb-3 rounded-lg bg-primary/10 text-primary">
            <FolderKanban size={19} strokeWidth={2} />
          </div>

          <h4 className="text-sm font-semibold text-text">No projects yet</h4>

          <p className="max-w-sm mt-1 text-xs leading-relaxed text-text-secondary">
            Create a project to organize your datasets and experiments.
          </p>

          <button
            type="button"
            className="inline-flex items-center gap-2 px-3.5 py-2 mt-4 text-xs font-semibold text-white transition-colors duration-150 rounded-lg bg-primary hover:bg-primary-dark"
          >
            Create Project
            <ChevronRight size={13} strokeWidth={2.5} />
          </button>
        </div>
      )}
    </div>
  );
}

export default RecentProjects;
