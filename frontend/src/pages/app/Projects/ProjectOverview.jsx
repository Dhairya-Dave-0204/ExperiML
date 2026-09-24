import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

import projectService from "@/services/project/projectService";

import {
  ProjectSummary,
  CurrentExperiment,
  ProjectWorkflow,
  ProjectInformation,
} from "@/components/components.index";

const ProjectOverview = () => {
  const { projectId } = useParams();

  const [overviewData, setOverviewData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProjectOverview = async () => {
      if (!projectId) {
        setError("Project ID is missing.");
        setIsLoading(false);
        return;
      }

      try {
        setIsLoading(true);
        setError(null);

        const data = await projectService.getProjectOverview(projectId);

        setOverviewData(data);
      } catch (error) {
        console.error("Failed to fetch project overview:", error);

        setError(
          error?.response?.data?.message || "Failed to load project overview.",
        );
      } finally {
        setIsLoading(false);
      }
    };

    fetchProjectOverview();
  }, [projectId]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-full bg-surface">
        <p className="text-sm text-text-secondary">
          Loading project overview...
        </p>
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

  if (!overviewData) {
    return (
      <div className="flex items-center justify-center min-h-full bg-surface">
        <p className="text-sm text-text-secondary">
          Project overview is unavailable.
        </p>
      </div>
    );
  }

  return (
    <div className="mt-8">
      <ProjectSummary summary={overviewData.summary} />

      <CurrentExperiment
        projectId={projectId}
        experiment={overviewData.currentExperiment}
      />

      <ProjectWorkflow
        projectId={projectId}
        workflow={overviewData.workflow}
      />

      <ProjectInformation
        project={overviewData.project}
        problemType={overviewData.currentExperiment?.problemType}
        projectId={projectId}
      />
    </div>
  );
};

export default ProjectOverview;