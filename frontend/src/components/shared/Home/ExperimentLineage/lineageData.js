// lineageData.js

import {
  Activity,
  Cpu,
  Database,
  FileCode2,
  Package,
  Server,
  Target,
  Timer,
} from "lucide-react";

export const LINEAGE = {
  level1: [
    {
      id: 1,
      icon: Server,
      title: "Raw Data Ingestion",
      meta: "s3://datalake/logs.csv",
    },
    {
      id: 2,
      icon: FileCode2,
      title: "Feature Engineering",
      meta: "script: clean_v2.py",
    },
  ],

  level2: [
    {
      id: 3,
      icon: Database,
      title: "Training Dataset",
      meta: "v4.2.1 · 2.4GB · Locked",
    },
  ],

  level3: [
    {
      id: 4,
      icon: Cpu,
      title: "rf-baseline",
      meta: "Completed · F1: 0.89",
    },
    {
      id: 5,
      icon: Activity,
      title: "xgboost-v2",
      meta: "Failed · OOM Error",
    },
    {
      id: 6,
      icon: Timer,
      title: "xgboost-v3",
      meta: "Active (E42) · F1: 0.94",
      active: true,
    },
  ],

  level4: [
    {
      id: 7,
      icon: Target,
      title: "Model Evaluation",
      meta: "Winner: xgboost-v3 (Promoted)",
      success: true,
    },
  ],

  level5: [
    {
      id: 8,
      icon: Package,
      title: "Model Registry",
      meta: "Tag: Production · v3.0.0",
    },
  ],
};

export const LINEAGE_CONTENT = {
  title: "Complete Experiment Lineage",

  description:
    "Understand exactly how a model was built. ExperiML maps the entire lifecycle from raw data ingestion to artifact generation—visually and programmatically.",
};
