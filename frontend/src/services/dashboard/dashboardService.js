import apiClient from "@/services/api/apiClient";
import API_ENDPOINTS from "@/services/api/endpoints";

const dashboardService = {
  async getDashboard() {
    const response = await apiClient.get(API_ENDPOINTS.dashboard.base);

    return response.data.data;
  },
};

export default dashboardService;
