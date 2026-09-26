import apiClient from "@/services/api/apiClient";
import API_ENDPOINTS from "@/services/api/endpoints";

const experimentService = {
  async getProjectExperiments(projectId) {
    const response = await apiClient.get(
      API_ENDPOINTS.experiments.project(projectId),
    );

    return response.data.data;
  },

  async getExperimentById(projectId, experimentId) {
    const response = await apiClient.get(
      API_ENDPOINTS.experiments.detail(projectId, experimentId),
    );

    return response.data.data;
  },

  async createExperiment(projectId, experimentData) {
    const response = await apiClient.post(
      API_ENDPOINTS.experiments.project(projectId),
      experimentData,
    );

    return response.data.data;
  },

  async updateExperiment(projectId, experimentId, experimentData) {
    const response = await apiClient.patch(
      API_ENDPOINTS.experiments.detail(projectId, experimentId),
      experimentData,
    );

    return response.data.data;
  },

  async deleteExperiment(projectId, experimentId) {
    const response = await apiClient.delete(
      API_ENDPOINTS.experiments.detail(projectId, experimentId),
    );

    return response.data.data;
  },
};

export default experimentService;
