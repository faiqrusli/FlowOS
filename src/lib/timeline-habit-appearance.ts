import { cn } from "@/lib/utils";

/** Shared habit accent — thin orange left border at moderate opacity. */
export const TIMELINE_HABIT_ACCENT_CLASS = "border-l-[3px] border-l-orange-400/65";

/** Scheduled habit block surface (timeline body). */
export const TIMELINE_HABIT_BLOCK_SURFACE_CLASS =
  "border-orange-300/50 bg-orange-50/40 dark:border-orange-400/40 dark:bg-orange-400/12";

/** Unscheduled / pool habit chip surface. */
export const TIMELINE_HABIT_CHIP_SURFACE_CLASS =
  "border-orange-300/45 bg-orange-50/30 dark:border-orange-400/35 dark:bg-orange-400/10";

export function timelineHabitBlockClassNames(extra?: string): string {
  return cn(
    TIMELINE_HABIT_ACCENT_CLASS,
    TIMELINE_HABIT_BLOCK_SURFACE_CLASS,
    extra
  );
}

export function timelineHabitChipClassNames(extra?: string): string {
  return cn(
    TIMELINE_HABIT_ACCENT_CLASS,
    TIMELINE_HABIT_CHIP_SURFACE_CLASS,
    extra
  );
}
