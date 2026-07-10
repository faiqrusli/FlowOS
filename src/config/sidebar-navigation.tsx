import {
  BookOpen,
  CalendarDays,
  CheckSquare,
  LayoutDashboard,
  NotebookPen,
  Repeat,
  Timer,
  type LucideIcon,
} from "lucide-react";

export type SidebarNavItem = {
  label: string;
  href: string;
  icon: LucideIcon;
};

export type SidebarNavSection = {
  label: string;
  items: SidebarNavItem[];
};

/**
 * Primary app navigation — Home + Workspace workflow.
 * Capture → Plan → Execute → Reflect; every workspace one click from anywhere.
 * Ordered array of sections so future groups (Goals, AI, …) append without redesign.
 */
export const sidebarSections: SidebarNavSection[] = [
  {
    label: "Home",
    items: [{ label: "Today", href: "/", icon: LayoutDashboard }],
  },
  {
    label: "Workspace",
    items: [
      { label: "Tasks", href: "/tasks", icon: CheckSquare },
      { label: "Habits", href: "/habits", icon: Repeat },
      { label: "Schedule", href: "/schedule", icon: CalendarDays },
      { label: "Focus", href: "/focus", icon: Timer },
      { label: "Notes", href: "/notes", icon: BookOpen },
      { label: "Reflection", href: "/reflection", icon: NotebookPen },
    ],
  },
];
