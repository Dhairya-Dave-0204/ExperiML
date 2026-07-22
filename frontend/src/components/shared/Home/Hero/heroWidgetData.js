// heroWidgetData.js

export const HERO_WORKSPACE = {
  projectName: "customer-churn-prediction",
  datasetVersion: "v4.2.1",
  activeExperiments: 3,
};

export const ACTIVE_EXPERIMENT = {
  id: 1,
  name: "xgboost-revenue-v3",

  parameters: {
    eta: "0.01",
    maxDepth: 6,
  },

  training: {
    startEpoch: 42,
    maxEpoch: 50,
    startLoss: 0.0145,
    minLoss: 0.009,
    gpuMin: 78,
    gpuMax: 95,
  },
};

export const COMPLETED_EXPERIMENT = {
  id: 2,
  name: "rf-baseline-v1",

  parameters: {
    nEstimators: 100,
  },

  metrics: {
    f1Score: "0.8912",
    duration: "4m 12s",
  },
};
