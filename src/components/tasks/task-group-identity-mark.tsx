"use client";

import {
  getGroupDotClass,
  hasTaskGroupIcon,
  TASK_GROUP_SWATCH_CLASS,
  type TaskGroupColorKey,
} from "@/lib/task-group-appearance";
import { cn } from "@/lib/utils";

type TaskGroupIdentityMarkProps = {
  icon?: string | null;
  colorKey: TaskGroupColorKey;
  className?: string;
};

/**
 * Color-first group mark: plain dot when no icon; small colored badge + icon when set.
 */
export function TaskGroupIdentityMark({
  icon,
  colorKey,
  className,
}: TaskGroupIdentityMarkProps) {
  if (hasTaskGroupIcon(icon)) {
    return (
      <span
        className={cn(
          "inline-flex size-4 shrink-0 items-center justify-center rounded-full text-[10px] leading-none shadow-none",
          TASK_GROUP_SWATCH_CLASS[colorKey],
          className,
        )}
        aria-hidden
      >
        <span className="select-none">{icon?.trim()}</span>
      </span>
    );
  }

  return (
    <span
      className={cn(getGroupDotClass(colorKey), className)}
      aria-hidden
    />
  );
}
