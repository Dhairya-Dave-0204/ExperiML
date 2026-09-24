import { useEffect, useState } from "react";
import { Outlet, useNavigate, useParams } from "react-router-dom";

import { ROUTES } from "@/constants/routes";
import projectService from "@/services/project/projectService";

import {
  ProjectHeader,
  ProjectNavigation,
} from "@/components/components.index";

const ProjectLayout = () => {
  const navigate = useNavigate();
  const { projectId } = useParams();

  const [project, setProject] = useState(null);
  const [problemType, setProblemType] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProject = async () => {
      if (!projectId) {
        setError("Project ID is missing.");
        setIsLoading(false);
        return;
      }

      try {
        setIsLoading(true);
        setError(null);

        const data = await projectService.getProjectOverview(projectId);

        setProject(data.project);
        setProblemType(data.currentExperiment?.problemType);
      } catch (error) {
        console.error("Failed to fetch project:", error);

        setError(error?.response?.data?.message || "Failed to load project.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchProject();
  }, [projectId]);

  const handleCreateExperiment = () => {
    navigate(ROUTES.PROJECT_TAB(projectId, ROUTES.PROJECT_TABS.EXPERIMENTS));
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-full bg-surface">
        <p className="text-sm text-text-secondary">Loading project...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-full bg-surface">
        <div className="text-center">
          <p className="text-sm font-medium text-danger">{error}</p>
        </div>
      </div>
    );
  }

  if (!project) {
    return (
      <div className="flex items-center justify-center min-h-full bg-surface">
        <p className="text-sm text-text-secondary">Project is unavailable.</p>
      </div>
    );
  }

  return (
    <div className="min-h-full bg-surface">
      <div className="px-6 py-8 mx-auto max-w-7xl lg:px-8">
        <div className="flex items-center gap-2 mb-6 text-sm">
          <button
            type="button"
            onClick={() => navigate(ROUTES.PROJECTS)}
            className="transition-colors text-text-secondary hover:text-text"
          >
            Projects
          </button>

          <span className="text-text-secondary">/</span>

          <span className="font-medium text-text">{project.name}</span>
        </div>

        <ProjectHeader
          project={project}
          problemType={problemType}
          onCreateExperiment={handleCreateExperiment}
        />

        <ProjectNavigation projectId={projectId} />

        <Outlet />
      </div>
    </div>
  );
};

export default ProjectLayout;
