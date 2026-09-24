// TODO: Make the 3 dot button working and add edit and delete options

import {
  ArrowRight,
  Boxes,
  CalendarDays,
  Database,
  FlaskConical,
  MoreVertical,
} from "lucide-react";

const formatProjectDate = (date) => {
  return new Intl.DateTimeFormat("en-GB", {
    day: "2-digit",
    month: "2-digit",
    year: "2-digit",
  }).format(new Date(date));
};

const ProjectCard = ({ project, onOpen }) => {
  return (
    <article className="flex min-h-87.5 flex-col rounded-2xl border border-border bg-white p-6 transition-shadow hover:shadow-sm">
      <div className="flex items-start justify-between">
        <div className="flex items-center justify-center h-11 w-11 rounded-xl bg-primary-light text-primary">
          <Boxes className="w-5 h-5" />
        </div>

        <button
          type="button"
          aria-label={`More actions for ${project.name}`}
          className="inline-flex items-center justify-center w-8 h-8 transition-colors rounded-lg text-text-secondary hover:bg-surface-soft hover:text-text"
        >
          <MoreVertical className="w-4 h-4" />
        </button>
      </div>

      <div className="flex-1 mt-6">
        <h3 className="text-base font-semibold tracking-tight font-heading text-text">
          {project.name}
        </h3>

        <p className="mt-2.5 line-clamp-3 text-sm leading-6 text-text-secondary">
          {project.description}
        </p>

        <div className="flex items-center justify-between pt-5 border-t mt-7 border-border">
          <div className="flex items-center gap-2 text-text-secondary">
            <Database className="h-3.5 w-3.5 text-primary" />
            <span className="text-xs">{project.datasets} datasets</span>
          </div>

          <div className="flex items-center gap-2 text-text-secondary">
            <FlaskConical className="h-3.5 w-3.5 text-primary" />
            <span className="text-xs">{project.experiments} experiments</span>
          </div>

          <div className="flex items-center gap-2 text-text-secondary">
            <Boxes className="h-3.5 w-3.5 text-primary" />
            <span className="text-xs">{project.models} models</span>
          </div>
        </div>
      </div>

      <div className="flex items-end justify-between gap-4 pt-5 mt-6 border-t border-border">
        <div className="space-y-1.5 text-xs text-text-secondary">
          <div className="flex items-center gap-1.5">
            <CalendarDays className="h-3.5 w-3.5 shrink-0" />
            <span>Created: {formatProjectDate(project.createdAt)}</span>
          </div>

          <div className="flex items-center gap-1.5">
            <CalendarDays className="h-3.5 w-3.5 shrink-0" />
            <span>Updated: {formatProjectDate(project.updatedAt)}</span>
          </div>
        </div>

        <button
          type="button"
          onClick={() => onOpen(project.id)}
          className="inline-flex shrink-0 items-center gap-1.5 rounded-lg bg-primary-light px-3.5 py-2 text-sm font-medium text-primary transition-colors hover:bg-primary/10"
        >
          Open Project
          <ArrowRight className="h-3.5 w-3.5" />
        </button>
      </div>
    </article>
  );
};

export default ProjectCard;
