import { useNavigate } from "react-router-dom";
import { ChevronRight, Plus } from "lucide-react";

import { ROUTES } from "@/constants/routes";

const ProjectHeader = ({ project, onCreateExperiment }) => {
  const navigate = useNavigate();

  return (
    <>
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 mb-6 text-sm text-text-secondary">
        <button
          type="button"
          onClick={() => navigate(ROUTES.PROJECTS)}
          className="transition-colors hover:text-text"
        >
          Projects
        </button>

        <ChevronRight className="w-4 h-4" />

        <span className="text-text">{project.name}</span>
      </div>

      {/* Header */}
      <div className="flex flex-col gap-5 mb-8 sm:flex-row sm:items-start sm:justify-between">
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-3 mb-2">
            <h1 className="text-2xl font-semibold tracking-tight font-heading text-text">
              {project.name}
            </h1>

            <span className="rounded-full bg-primary-light px-2.5 py-1 text-xs font-medium text-primary">
              {project.problemType}
            </span>
          </div>

          <p className="max-w-2xl text-sm leading-6 text-text-secondary">
            {project.description}
          </p>
        </div>

        <button
          type="button"
          onClick={onCreateExperiment}
          className="inline-flex shrink-0 items-center justify-center gap-2 rounded-lg bg-primary px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-primary-dark"
        >
          <Plus className="w-4 h-4" />
          Create Experiment
        </button>
      </div>
    </>
  );
};

export default ProjectHeader;
