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
  /** Optional global shortcut hint shown on hover / collapsed tooltip. */
  shortcut?: string;
};

/** Primary home destination — sits alone above the nav divider. */
export const sidebarPrimaryItem: SidebarNavItem = {
  label: "Today",
  href: "/",
  icon: LayoutDashboard,
  shortcut: "T",
};

/**
 * Workspace workflow — Capture → Plan → Execute → Reflect.
 * Rendered as one group below the divider after Today.
 */
export const sidebarWorkspaceItems: SidebarNavItem[] = [
  { label: "Tasks", href: "/tasks", icon: CheckSquare },
  { label: "Habits", href: "/habits", icon: Repeat },
  { label: "Schedule", href: "/schedule", icon: CalendarDays },
  { label: "Focus", href: "/focus", icon: Timer },
  { label: "Notes", href: "/notes", icon: BookOpen },
  { label: "Reflection", href: "/reflection", icon: NotebookPen },
];

/** Flat list for consumers that need every nav item without hierarchy. */
export const sidebarNavItems: SidebarNavItem[] = [
  sidebarPrimaryItem,
  ...sidebarWorkspaceItems,
];
