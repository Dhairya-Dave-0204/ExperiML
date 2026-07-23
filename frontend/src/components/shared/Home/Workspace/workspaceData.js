import { Activity, Database, Layers, Package, Settings2 } from "lucide-react";

export const WORKSPACE_CONTENT = {
  title: "Designed for Data Science",

  description:
    "Not just another generic SaaS grid. Get deep insights into epochs, validation loss, feature importance, and hyperparameter tuning all within your dashboard.",
};

export const SIDEBAR_ITEMS = [
  {
    id: 1,
    icon: Layers,
    label: "Projects",
  },
  {
    id: 2,
    icon: Database,
    label: "Datasets",
  },
  {
    id: 3,
    icon: Activity,
    label: "Experiments",
    active: true,
  },
  {
    id: 4,
    icon: Package,
    label: "Model Registry",
  },
  {
    id: 5,
    icon: Settings2,
    label: "Environment",
  },
];

export const EXPERIMENT = {
  name: "xgboost-revenue-v3",

  commit: {
    hash: "8f2b1a9",
    runId: "run_49201",
  },

  status: {
    label: "Training Complete",
  },
};

export const METRICS = [
  {
    id: 1,
    label: "VALIDATION LOSS",
    value: "0.0142",
  },
  {
    id: 2,
    label: "F1 SCORE",
    value: "0.9420",
    highlight: true,
  },
];

export const TRAINING_LOSS = {
  label: "TRAINING LOSS (EPOCHS)",

  status: "Live",

  areaPath:
    "M0,40 L0,30 L20,25 L40,15 L60,20 L80,10 L100,12 L120,5 L140,8 L160,2 L180,4 L200,0 L200,40 Z",

  linePath:
    "M0,30 L20,25 L40,15 L60,20 L80,10 L100,12 L120,5 L140,8 L160,2 L180,4 L200,0",
};

export const FEATURE_IMPORTANCE = [
  {
    id: 1,
    feature: "user_lifetime_value",
    value: 92,
  },
  {
    id: 2,
    feature: "recent_purchases_7d",
    value: 78,
  },
  {
    id: 3,
    feature: "session_duration_avg",
    value: 54,
  },
  {
    id: 4,
    feature: "cart_abandonment_rate",
    value: 32,
  },
  {
    id: 5,
    feature: "email_click_rate",
    value: 18,
  },
];

export const HYPERPARAMETERS = [
  {
    id: 1,
    key: "learning_rate",
    value: "0.01",
  },
  {
    id: 2,
    key: "max_depth",
    value: "6",
  },
  {
    id: 3,
    key: "subsample",
    value: "0.8",
  },
  {
    id: 4,
    key: "objective",
    value: '"binary:logistic"',
  },
];
