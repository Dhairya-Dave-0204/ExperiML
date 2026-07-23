import {
  Database,
  SlidersHorizontal,
  FlaskConical,
  Cpu,
  CheckCircle2,
  Package,
  Boxes,
  Target,
  FileText,
  ArrowRight,
} from "lucide-react";

export const STAGES = [
  { id: 1, icon: Database, label: "Dataset" },
  { id: 2, icon: SlidersHorizontal, label: "Preprocessing" },
  { id: 3, icon: FlaskConical, label: "Experiment" },
  { id: 4, icon: Cpu, label: "Training" },
  { id: 5, icon: CheckCircle2, label: "Evaluation" },
  { id: 6, icon: Package, label: "Artifacts" },
  { id: 7, icon: Boxes, label: "Saved Models" },
  { id: 8, icon: Target, label: "Predictions" },
  { id: 9, icon: FileText, label: "Reports" },
];
