import {
  FolderKanban,
  Database,
  Activity,
  GitCompare,
  Package,
  Boxes,
  Target,
  FileText,
  Repeat,
} from "lucide-react";

export const CAPABILITIES = [
  {
    id: 1,
    icon: FolderKanban,
    title: "Project Management",
    desc: "Group datasets, experiments, and models under one project.",
  },
  {
    id: 2,
    icon: Database,
    title: "Dataset Versioning",
    desc: "Upload and version datasets tied to the results they produced.",
  },
  {
    id: 3,
    icon: Activity,
    title: "Experiment Tracking",
    desc: "Log parameters, metrics, and artifacts as runs execute.",
  },
  {
    id: 4,
    icon: GitCompare,
    title: "Metrics Comparison",
    desc: "Compare runs side by side to see what actually changed.",
  },
  {
    id: 5,
    icon: Package,
    title: "Artifact Management",
    desc: "Store weights and logs, versioned and traced to their run.",
  },
  {
    id: 6,
    icon: Boxes,
    title: "Model Registry",
    desc: "Keep trained models organized and easy to retrieve.",
  },
  {
    id: 7,
    icon: Target,
    title: "Prediction History",
    desc: "Review every prediction a model has generated over time.",
  },
  {
    id: 8,
    icon: FileText,
    title: "Report Generation",
    desc: "Turn experiment results into a shareable summary.",
  },
  {
    id: 9,
    icon: Repeat,
    title: "Reproducibility",
    desc: "Trace any result back to the exact data and parameters.",
  }
];
