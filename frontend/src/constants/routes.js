export const ROUTES = {
  // Public routes
  HOME: "/",
  ABOUT: "/about",
  CONTACT: "/contact",
  DOCS: "/docs",
  FAQ: "/faq",
  DATA_POLICY: "/data-policy",
  PRIVACY_POLICY: "/privacy-policy",
  COOKIE_POLICY: "/cookie-policy",
  TERM_SERVICE: "/terms-of-service",

  // Authentication routes
  SIGN_IN: "/signin",
  SIGN_UP: "/signup",
  FORGOT_PASS: "/forgot-password",
  RESET_PASS: "/reset-password",

  // Application routes
  APP: "/app",
  PROJECTS: "/app/projects",
  SETTINGS: "/app/settings",

  // Project routes
  PROJECT_TABS: {
    OVERVIEW: "overview",
    DATASETS: "datasets",
    EXPERIMENTS: "experiments",
    MODELS: "models",
    PREDICTIONS: "predictions",
  },

  PROJECT_OVERVIEW: "/app/projects/:projectId/overview",

  PROJECT_TAB: (projectId, tab) => `/app/projects/${projectId}/${tab}`,

  PROJECT_DATASET: (projectId, datasetId) =>
    `/app/projects/${projectId}/datasets/${datasetId}`,
};
