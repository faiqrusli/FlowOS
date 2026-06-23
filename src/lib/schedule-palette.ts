import type { TaskPriority } from "@/lib/task-priority";
import type { ScheduleItemType } from "@/types/schedule";

export type ChannelStyle = {
  accent: string;
  bg: string;
  border: string;
  text: string;
  hover: string;
  projection: string;
};

export const PRIORITY_CHANNEL: Record<TaskPriority, ChannelStyle> = {
  high: {
    accent: "bg-rose-500",
    bg: "bg-rose-50/90 dark:bg-rose-950/40",
    border: "border-rose-200/80 dark:border-rose-800/50",
    text: "text-rose-800 dark:text-rose-300",
    hover: "hover:bg-rose-50 dark:hover:bg-rose-950/60",
    projection: "border-rose-300/50 bg-rose-50/40",
  },
  medium: {
    accent: "bg-amber-400",
    bg: "bg-amber-50/90 dark:bg-amber-950/40",
    border: "border-amber-200/80 dark:border-amber-800/50",
    text: "text-amber-900 dark:text-amber-300",
    hover: "hover:bg-amber-50 dark:hover:bg-amber-950/60",
    projection: "border-amber-300/50 bg-amber-50/40",
  },
  low: {
    accent: "bg-sky-400",
    bg: "bg-sky-50/90 dark:bg-sky-950/40",
    border: "border-sky-200/80 dark:border-sky-800/50",
    text: "text-sky-900 dark:text-sky-300",
    hover: "hover:bg-sky-50 dark:hover:bg-sky-950/60",
    projection: "border-sky-300/50 bg-sky-50/40",
  },
};

export const TYPE_CHANNEL: Record<Exclude<ScheduleItemType, "task">, ChannelStyle> =
  {
    habit: {
      accent: "bg-emerald-400",
      bg: "bg-emerald-50/80 dark:bg-emerald-950/30",
      border: "border-emerald-200/70 dark:border-emerald-800/40",
      text: "text-emerald-800 dark:text-emerald-300",
      hover: "hover:bg-emerald-50 dark:hover:bg-emerald-950/50",
      projection: "border-emerald-300/40 bg-emerald-50/30",
    },
    focus: {
      accent: "bg-violet-500",
      bg: "bg-violet-50/90 dark:bg-violet-950/40",
      border: "border-violet-200/80 dark:border-violet-800/50",
      text: "text-violet-800 dark:text-violet-300",
      hover: "hover:bg-violet-50 dark:hover:bg-violet-950/60",
      projection: "border-violet-300/50 bg-violet-50/40",
    },
  };

export function getChannelStyle(
  type: ScheduleItemType,
  priority?: TaskPriority | null
): ChannelStyle {
  if (type === "task") {
    return PRIORITY_CHANNEL[priority ?? "medium"];
  }
  return TYPE_CHANNEL[type];
}
