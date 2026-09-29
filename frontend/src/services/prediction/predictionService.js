import apiClient from "@/services/api/apiClient";
import API_ENDPOINTS from "@/services/api/endpoints";

const predictionService = {
  async getPredictions(projectId, experimentId) {
    const response = await apiClient.get(
      API_ENDPOINTS.predictions.experiment(projectId, experimentId),
    );

    return response.data.data;
  },

  async getPredictionDetails(projectId, experimentId, predictionId) {
    const response = await apiClient.get(
      API_ENDPOINTS.predictions.detail(projectId, experimentId, predictionId),
    );

    return response.data.data;
  },

  async createPrediction(projectId, experimentId, predictionData) {
    const formData = new FormData();

    formData.append("name", predictionData.name);
    formData.append("predictionType", predictionData.predictionType);
    formData.append("file", predictionData.file);

    const response = await apiClient.post(
      API_ENDPOINTS.predictions.experiment(projectId, experimentId),
      formData,
      {
        headers: {
          "Content-Type": undefined,
        },
      },
    );

    return response.data.data;
  },

  async deletePrediction(projectId, experimentId, predictionId) {
    const response = await apiClient.delete(
      API_ENDPOINTS.predictions.detail(projectId, experimentId, predictionId),
    );

    return response.data.data;
  },
};

export default predictionService;
