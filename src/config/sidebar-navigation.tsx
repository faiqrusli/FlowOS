import {
  CheckSquare,
  LayoutTemplate,
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

/** Primary app navigation — five items per M2 IA. */
export const sidebarSections: SidebarNavSection[] = [
  {
    label: "Productivity",
    items: [
      { label: "Today", href: "/", icon: LayoutTemplate },
      { label: "Tasks", href: "/tasks", icon: CheckSquare },
      { label: "Habits", href: "/habits", icon: Repeat },
      { label: "Focus", href: "/focus", icon: Timer },
      { label: "Reflection", href: "/reflection", icon: NotebookPen },
    ],
  },
];
