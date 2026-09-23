import apiClient from "@/services/api/apiClient";
import API_ENDPOINTS from "@/services/api/endpoints";

const projectService = {
  async getProjectOverview(projectId) {
    const response = await apiClient.get(
      API_ENDPOINTS.projects.overview(projectId),
    );

    return response.data.data;
  },
};

export default projectService;
