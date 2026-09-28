import apiClient from "@/services/api/apiClient";
import API_ENDPOINTS from "@/services/api/endpoints";

const modelService = {
  async getProjectModels(projectId) {
    const response = await apiClient.get(
      API_ENDPOINTS.models.project(projectId),
    );

    return response.data.data;
  },
};

export default modelService;
