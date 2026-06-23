import {
  CalendarDays,
  CheckSquare,
  LayoutDashboard,
  NotebookPen,
  Repeat,
  StickyNote,
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

/** Shown in the sidebar for demo / portfolio builds. */
export const sidebarSections: SidebarNavSection[] = [
  {
    label: "Overview",
    items: [{ label: "Dashboard", href: "/", icon: LayoutDashboard }],
  },
  {
    label: "Productivity",
    items: [
      { label: "Schedule", href: "/schedule", icon: CalendarDays },
      { label: "Tasks", href: "/tasks", icon: CheckSquare },
      { label: "Habits", href: "/habits", icon: Repeat },
      { label: "Focus", href: "/focus", icon: Timer },
      { label: "Reflection", href: "/reflection", icon: NotebookPen },
      { label: "Notes", href: "/notes", icon: StickyNote },
    ],
  },
];
