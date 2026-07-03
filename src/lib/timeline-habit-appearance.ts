import { cn } from "@/lib/utils";

/** Shared habit entity edge — warning accent at 3px. */
export const TIMELINE_HABIT_ACCENT_CLASS =
  "border-l-[3px] border-l-warning/50";

/** Scheduled habit block surface (timeline body). */
export const TIMELINE_HABIT_BLOCK_SURFACE_CLASS =
  "border-border/50 bg-card";

/** Unscheduled / pool habit chip surface. */
export const TIMELINE_HABIT_CHIP_SURFACE_CLASS =
  "border-border/45 bg-muted/30";

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
