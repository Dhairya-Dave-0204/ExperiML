import { BookOpen, ListChecks, LayoutGrid } from "lucide-react";

export function getFaqHeroStats(questionCount, categoryCount) {
  return [
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
}
