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
  },

  // Future dataset-related endpoints
  datasets: {
    base: "/datasets",
  },

  // Future experiment-related endpoints
  experiments: {
    base: "/experiments",
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
