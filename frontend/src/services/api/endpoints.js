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

  // Project-related endpoints
  projects: {
    base: "/projects",
    overview: (projectId) => `/projects/${projectId}/overview`,
  },

  // Dataset-related endpoints
  datasets: {
    base: "/datasets",
    project: (projectId) => `/projects/${projectId}/datasets`,
    detail: (projectId, datasetId) =>
      `/projects/${projectId}/datasets/${datasetId}`,
  },

  // Experiment-related endpoints
  experiments: {
    base: "/experiments",
    project: (projectId) => `/projects/${projectId}/experiments`,
    detail: (projectId, experimentId) =>
      `/projects/${projectId}/experiments/${experimentId}`,
  },

  // Model-related endpoints
  models: {
    base: "/models",
    project: (projectId) => `/projects/${projectId}/models`,
  },

  // Prediction-related endpoints
  predictions: {
    base: "/predictions",
  },

  // Artifact-related endpoints
  artifacts: {
    base: "/artifacts",
    download: (projectId, experimentId, artifactId) =>
      `/projects/${projectId}/experiments/${experimentId}/artifacts/${artifactId}/download`,
  },
};

export default API_ENDPOINTS;
