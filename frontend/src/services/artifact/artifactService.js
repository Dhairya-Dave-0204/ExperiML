import apiClient from "@/services/api/apiClient";
import API_ENDPOINTS from "@/services/api/endpoints";

const artifactService = {
  async downloadArtifact(projectId, experimentId, artifactId) {
    const response = await apiClient.get(
      API_ENDPOINTS.artifacts.download(projectId, experimentId, artifactId),
      {
        responseType: "blob",
      },
    );

    return response;
  },
};

export default artifactService;
