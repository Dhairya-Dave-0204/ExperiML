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

const STAGES = [
  { icon: Database, label: "Dataset" },
  { icon: SlidersHorizontal, label: "Preprocessing" },
  { icon: FlaskConical, label: "Experiment" },
  { icon: Cpu, label: "Training" },
  { icon: CheckCircle2, label: "Evaluation" },
  { icon: Package, label: "Artifacts" },
  { icon: Boxes, label: "Saved Models" },
  { icon: Target, label: "Predictions" },
  { icon: FileText, label: "Reports" },
];
