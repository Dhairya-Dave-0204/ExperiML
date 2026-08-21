import apiClient from "@/services/api/apiClient";
import API_ENDPOINTS from "@/services/api/endpoints";

import tokenManager from "./tokenManager";

const authService = {
  async register(userData) {
    const response = await apiClient.post(
      API_ENDPOINTS.auth.register,
      userData,
    );

    return response.data;
  },

  async login(credentials) {
    const response = await apiClient.post(
      API_ENDPOINTS.auth.login,
      credentials,
    );

    const { accessToken, user } = response.data.data;

    tokenManager.setAccessToken(accessToken);

    return user;
  },

  async logout() {
    try {
      await apiClient.post(API_ENDPOINTS.auth.logout);
    } finally {
      tokenManager.clearAccessToken();
    }
  },

  async refresh() {
    const response = await apiClient.post(API_ENDPOINTS.auth.refresh);

    const { accessToken, user } = response.data.data;

    tokenManager.setAccessToken(accessToken);

    return user;
  },

  async getCurrentUser() {
    const response = await apiClient.get(API_ENDPOINTS.auth.currentUser);

    return response.data.data.user;
  },
};

export default authService;
