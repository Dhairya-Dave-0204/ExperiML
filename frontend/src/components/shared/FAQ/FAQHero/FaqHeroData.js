import { BookOpen, ListChecks, LayoutGrid } from "lucide-react";

export const stats = [
  {
    id: 1,
    icon: ListChecks,
    label: "Common questions",
    value: `${questionCount}+`,
  },
  {
    id: 2,
    icon: LayoutGrid,
    label: "Categories covered",
    value: categoryCount,
  },
  {
    id: 3,
    icon: BookOpen,
    label: "Platform information",
    value: "In depth",
  },
];
