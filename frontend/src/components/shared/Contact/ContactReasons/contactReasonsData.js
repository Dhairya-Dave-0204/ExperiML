import {
  Handshake,
  MessagesSquare,
  MessageCircle,
  Bug,
  Lightbulb,
  GraduationCap,
} from "lucide-react";

export const REASONS = [
  {
    id: 1,
    icon: Handshake,
    title: "Project collaboration",
    desc: "Interested in building or contributing something together.",
  },
  {
    id: 2,
    icon: MessagesSquare,
    title: "Technical discussions",
    desc: "Want to talk through an ML or engineering decision.",
  },
  {
    id: 3,
    icon: MessageCircle,
    title: "Feedback",
    desc: "Have thoughts on what's working well or what isn't.",
  },
  {
    id: 4,
    icon: Bug,
    title: "Bug reports",
    desc: "Found something broken or behaving unexpectedly.",
  },
  {
    id: 5,
    icon: Lightbulb,
    title: "Feature suggestions",
    desc: "Have an idea that would make ExperiML more useful.",
  },
  {
    id: 6,
    icon: GraduationCap,
    title: "Internships & learning",
    desc: "Want to talk about learning opportunities or mentorship.",
  },
];
