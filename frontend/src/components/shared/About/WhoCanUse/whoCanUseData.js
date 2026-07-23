import {
  GraduationCap,
  Cpu,
  LineChart,
  Microscope,
  Sparkles,
  Users,
} from "lucide-react";

export const AUDIENCES = [
  {
    id: 1,
    icon: GraduationCap,
    title: "Students",
    desc: "Learn good experiment hygiene early, on real coursework projects.",
  },
  {
    id: 2,
    icon: Cpu,
    title: "ML Engineers",
    desc: "Move from prototype to production without losing track of runs.",
  },
  {
    id: 3,
    icon: LineChart,
    title: "Data Scientists",
    desc: "Compare approaches quickly and keep analysis reproducible.",
  },
  {
    id: 4,
    icon: Microscope,
    title: "Researchers",
    desc: "Keep results defensible with a full record of how they were produced.",
  },
  {
    id: 5,
    icon: Sparkles,
    title: "AI Enthusiasts",
    desc: "Explore and learn ML with the same tooling professionals use.",
  },
  {
    id: 6,
    icon: Users,
    title: "Teams",
    desc: "Shared projects and visibility across collaborators.",
    planned: true,
  },
];
