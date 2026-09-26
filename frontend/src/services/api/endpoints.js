const API_ENDPOINTS = {
  auth: {
    register: "/auth/register",
    login: "/auth/login",
    logout: "/auth/logout",
    refresh: "/auth/refresh",
    currentUser: "/auth/me",
    changePassword: "/auth/change-password",
    deleteAccount: "/auth/delete-me",
  },

  // Dashboard-related endpoints
  dashboard: {
    base: "/dashboard",
  },

  // Future project-related endpoints
  projects: {
    base: "/projects",
    overview: (projectId) => `/projects/${projectId}/overview`,
  },

  // Future dataset-related endpoints
  datasets: {
    base: "/datasets",
    project: (projectId) => `/projects/${projectId}/datasets`,
    detail: (projectId, datasetId) =>
      `/projects/${projectId}/datasets/${datasetId}`,
  },

  // Future experiment-related endpoints
  experiments: {
    base: "/experiments",
    project: (projectId) => `/projects/${projectId}/experiments`,
    detail: (projectId, experimentId) =>
      `/projects/${projectId}/experiments/${experimentId}`,
  },

  // Future model-related endpoints
  models: {
    base: "/models",
  },

  // Future prediction-related endpoints
  predictions: {
    base: "/predictions",
  },

  // Future artifact-related endpoints
  artifacts: {
    base: "/artifacts",
  },
};

export default API_ENDPOINTS;
