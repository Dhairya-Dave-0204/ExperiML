import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import { ROUTES } from "@/constants/routes";
import projectService from "@/services/project/projectService";

import {
  ProjectCard,
  ProjectsGlobalHeader,
  ProjectsListHeader,
} from "@/components/components.index";

const Projects = () => {
  const navigate = useNavigate();

  const [projects, setProjects] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        setIsLoading(true);
        setError(null);

        const data = await projectService.getProjects();

        setProjects(data);
      } catch (error) {
        console.error("Failed to fetch projects:", error);

        setError(error?.response?.data?.message || "Failed to load projects.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchProjects();
  }, []);

  const handleOpenProject = (projectId) => {
    navigate(ROUTES.PROJECT_TAB(projectId, ROUTES.PROJECT_TABS.OVERVIEW));
  };

  const handleCreateProject = () => {
    // Project creation flow will be implemented later.
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-full bg-surface">
        <p className="text-sm text-text-secondary">Loading projects...</p>
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

  return (
    <div className="min-h-full bg-surface">
      <div className="px-6 py-10 mx-auto max-w-7xl lg:px-8 lg:py-12">
        <ProjectsGlobalHeader onCreateProject={handleCreateProject} />

        <section className="mt-12">
          <ProjectsListHeader count={projects.length} />

          {projects.length === 0 ? (
            <div className="p-10 text-center bg-white border mt-7 rounded-2xl border-border">
              <p className="text-sm text-text-secondary">No projects found.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-6 mt-7 md:grid-cols-2 xl:grid-cols-3">
              {projects.map((project) => (
                <ProjectCard
                  key={project.id}
                  project={project}
                  onOpen={handleOpenProject}
                />
              ))}
            </div>
          )}
        </section>
      </div>
    </div>
  );
};

export default Projects;
