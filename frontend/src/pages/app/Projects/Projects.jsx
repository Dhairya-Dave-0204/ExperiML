import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";

import { ROUTES } from "@/constants/routes";
import projectService from "@/services/project/projectService";

import {
  CreateProjectModal,
  ProjectCard,
  ProjectsGlobalHeader,
  ProjectsListHeader,
} from "@/components/components.index";

const Projects = () => {
  const navigate = useNavigate();

  const [projects, setProjects] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  const [projectForm, setProjectForm] = useState({
    name: "",
    description: "",
  });

  const [isCreatingProject, setIsCreatingProject] = useState(false);
  const [createProjectError, setCreateProjectError] = useState(null);

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

  const handleProjectFormChange = (event) => {
    const { name, value } = event.target;

    setProjectForm((currentForm) => ({
      ...currentForm,
      [name]: value,
    }));

    setCreateProjectError(null);
  };

  const handleCreateProject = () => {
    setProjectForm({
      name: "",
      description: "",
    });

    setCreateProjectError(null);
    setIsCreateModalOpen(true);
  };

  const handleCreateProjectSubmit = async (event) => {
    event.preventDefault();

    const name = projectForm.name.trim();
    const description = projectForm.description.trim();

    if (!name) {
      setCreateProjectError("Project name is required.");
      return;
    }

    try {
      setIsCreatingProject(true);
      setCreateProjectError(null);

      const createdProject = await projectService.createProject({
        name,
        description,
      });

      setProjects((currentProjects) => [createdProject, ...currentProjects]);

      setIsCreateModalOpen(false);

      toast.success("Project created successfully.");

      navigate(
        ROUTES.PROJECT_TAB(createdProject.id, ROUTES.PROJECT_TABS.OVERVIEW),
      );
    } catch (error) {
      console.error("Failed to create project:", error);

      const message =
        error?.response?.data?.message || "Failed to create project.";

      setCreateProjectError(message);
      toast.error(message);
    } finally {
      setIsCreatingProject(false);
    }
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

      <CreateProjectModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onSubmit={handleCreateProjectSubmit}
        formData={projectForm}
        onChange={handleProjectFormChange}
        isSubmitting={isCreatingProject}
        error={createProjectError}
      />
    </div>
  );
};

export default Projects;
