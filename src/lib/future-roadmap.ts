import type { LucideIcon } from "lucide-react";
import {
  CalendarRange,
  Sparkles,
  StickyNote,
  Target,
} from "lucide-react";

export type RoadmapStatus = "planned" | "researching" | "in-development";

export type FutureRoadmapItem = {
  id: string;
  title: string;
  description: string;
  status: RoadmapStatus;
  icon: LucideIcon;
};

export const ROADMAP_STATUS_LABELS: Record<RoadmapStatus, string> = {
  planned: "Planned",
  researching: "Researching",
  "in-development": "In Development",
};

export const futureRoadmapItems: FutureRoadmapItem[] = [
  {
    id: "goals",
    title: "Goals",
    description:
      "Connect daily tasks and habits to long-term outcomes with milestones and progress tracking.",
    status: "planned",
    icon: Target,
  },
  {
    id: "notes",
    title: "Notes",
    description:
      "Capture ideas and reference material alongside your productivity workflow.",
    status: "researching",
    icon: StickyNote,
  },
  {
    id: "weekly-review",
    title: "Weekly Review",
    description:
      "Structured weekly summaries across schedule, habits, focus, and reflections.",
    status: "planned",
    icon: CalendarRange,
  },
  {
    id: "ai-coach",
    title: "AI Coach",
    description:
      "Personalized coaching based on your tasks, habits, focus patterns, and reflections.",
    status: "in-development",
    icon: Sparkles,
  },
];
