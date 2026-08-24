import apiClient from "@/services/api/apiClient";
import API_ENDPOINTS from "@/services/api/endpoints";

import tokenManager from "./tokenManager";

const authService = {
  async register(userData) {
    const nameParts = userData.fullName.trim().split(" ");

    const firstName = nameParts.shift();

    const lastName = nameParts.join(" ");

    const payload = {
      firstName,
      lastName,
      email: userData.email,
      password: userData.password,
      confirmPassword: userData.confirmPassword,
    };

    console.log("REGISTER PAYLOAD:", payload);

    const response = await apiClient.post(API_ENDPOINTS.auth.register, payload);

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
