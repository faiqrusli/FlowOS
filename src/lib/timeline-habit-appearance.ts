import { cn } from "@/lib/utils";

/** Habit identity — amber edge on timeline *events* only. */
export const TIMELINE_HABIT_ACCENT_CLASS = "border-l-[3px] border-l-warning/70";

/**
 * Scheduled habit block — same Raised event chrome as tasks.
 * Amber stays on the left edge / HABIT label, not a second fill system.
 */
export const TIMELINE_HABIT_BLOCK_SURFACE_CLASS =
  "border-border-subtle bg-surface-raised";

/**
 * Pool habit chip — flat like task pool rows (`TIMELINE_POOL_ROW_SURFACE`).
 * Amber only on HABIT label / checkbox (not a permanent card fill).
 */
export const TIMELINE_HABIT_CHIP_SURFACE_CLASS =
  "border-transparent bg-transparent hover:bg-surface-hover";

export function timelineHabitBlockClassNames(extra?: string): string {
  return cn(
    TIMELINE_HABIT_ACCENT_CLASS,
    TIMELINE_HABIT_BLOCK_SURFACE_CLASS,
    extra,
  );
}

export function timelineHabitChipClassNames(extra?: string): string {
  return cn(TIMELINE_HABIT_CHIP_SURFACE_CLASS, extra);
}
