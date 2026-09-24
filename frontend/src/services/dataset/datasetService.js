import apiClient from "@/services/api/apiClient";
import API_ENDPOINTS from "@/services/api/endpoints";

const datasetService = {
  async getProjectDatasets(projectId) {
    const response = await apiClient.get(
      API_ENDPOINTS.datasets.project(projectId),
    );

    return response.data.data;
  },

  async createDataset(projectId, formData) {
    const response = await apiClient.post(
      API_ENDPOINTS.datasets.project(projectId),
      formData,
    );

    return response.data.data;
  },
};

export default datasetService;
