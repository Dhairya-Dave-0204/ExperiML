import React from "react";
import { Plus } from "lucide-react";

function ProjectsGlobalHeader() {
  return (
    <div className="flex flex-col gap-6 sm:flex-row sm:items-start sm:justify-between">
      <div>
        <h1 className="text-3xl font-semibold tracking-tight font-heading text-text">
          Projects
        </h1>

        <p className="mt-2 text-sm leading-6 text-text-secondary sm:text-base">
          Manage and explore your machine learning projects.
        </p>
      </div>

      <button
        type="button"
        onClick={onCreateProject}
        className="inline-flex shrink-0 items-center justify-center gap-2 rounded-lg bg-primary px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-primary-dark"
      >
        <Plus className="w-4 h-4" />
        Create Project
      </button>
    </div>
  );
}

export default ProjectsGlobalHeader;
