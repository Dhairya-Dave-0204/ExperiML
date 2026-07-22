// capabilitiesData.js

import { Activity, FolderKanban, HardDrive, Box, Target } from "lucide-react";

export const CAPABILITIES = [
  {
    id: 1,
    title: "Automated Experiment Tracking",
    description:
      "Log parameters, metrics, and artifacts automatically as runs execute. Compare results side by side and see exactly what changed between them.",

    icon: Activity,

    wide: true,

    ui: {
      type: "experiment",
      run: "xgboost-v3",
      score: "F1: 0.942",
      artifacts: "model.pkl (42MB), logs.json",
      params: "{eta: 0.01, depth: 6, subsample: 0.8}",
    },
  },

  {
    id: 2,
    title: "Project Management",
    description:
      "Group datasets, experiments, and models neatly under unified project workspaces.",

    icon: FolderKanban,

    wide: false,

    ui: {
      type: "project",

      project: "ecommerce-recsys",

      items: ["datasets (3)", "experiments (142)", "registry (2 deployed)"],
    },
  },

  {
    id: 3,
    title: "Dataset Versioning",
    description:
      "Upload and lock dataset versions tied directly to the inference results they produced.",

    icon: HardDrive,

    wide: false,

    ui: {
      type: "dataset",

      file: "users_cleaned.csv",
      version: "v2.1.4",
      hash: "8f4e2a...9b1c",
      size: "1.4GB",
      linkedRuns: 42,
    },
  },

  {
    id: 4,
    title: "Model Registry",
    description:
      "Store weights and architecture logs securely, perfectly versioned and traced to their original run.",

    icon: Box,

    wide: false,

    ui: {
      type: "registry",

      model: "resnet-50-final",
      status: "Production",
      stage: "Serving (API-East)",
      lineage: "run_8f2b1",
    },
  },

  {
    id: 5,
    title: "Batch Predictions",
    description:
      "Generate and evaluate predictions from any historically trained model directly in the platform.",

    icon: Target,

    wide: false,

    ui: {
      type: "prediction",

      status: "Completed",
      rowsProcessed: "10,000",
      confidence: "0.982",
      output: "s3://bucket/preds.csv",
    },
  },
];
