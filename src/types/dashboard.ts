import type { Reflection } from "@/types/reflection";
import type { Task } from "@/types/task";
import type { Habit } from "@/types/habit";

export type TodayProgress = {
  tasksCompleted: number;
  tasksTotal: number;
  habitsCompleted: number;
  habitsTotal: number;
  focusSeconds: number;
  breakSeconds: number;
};

export type DashboardFocusStats = {
  totalFocusSeconds: number;
  totalBreakSeconds: number;
  sessionCount: number;
};

import type { ScheduleItem } from "@/types/schedule";

export type { ScheduleItem as TimelineItem };

export type DashboardData = {
  progress: TodayProgress;
  tasks: Task[];
  habits: Habit[];
  focus: DashboardFocusStats;
  reflection: Reflection | null;
  timeline: ScheduleItem[];
};
