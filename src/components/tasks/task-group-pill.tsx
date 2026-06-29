"use client";

import { cn } from "@/lib/utils";
import type { TaskGroupAppearance } from "@/lib/task-group-appearance";

type TaskGroupPillProps = {
  icon: string;
  name: string;
  appearance: Pick<TaskGroupAppearance, "pillClassName">;
  count?: number;
  variant?: "filled" | "plain";
  className?: string;
};

export function TaskGroupPill({
  icon,
  name,
  appearance,
  count,
  variant = "filled",
  className,
}: TaskGroupPillProps) {
  const showCount = count !== undefined && count > 0;

  if (variant === "plain") {
    return (
      <span
        className={cn(
          "inline-flex min-w-0 items-center gap-1.5 text-sm font-medium text-foreground",
          className
        )}
      >
        <span className="text-base leading-none" aria-hidden>
          {icon}
        </span>
        <span className="truncate">{name}</span>
        {showCount ? (
          <span className="shrink-0 text-xs text-muted-foreground">{count}</span>
        ) : null}
      </span>
    );
  }

  return (
    <span
      className={cn(
        "inline-flex max-w-full min-w-0 items-center gap-1.5 rounded-full px-2 py-0.5 text-sm font-medium",
        appearance.pillClassName,
        className
      )}
    >
      <span className="text-sm leading-none" aria-hidden>
        {icon}
      </span>
      <span className="truncate leading-tight">{name}</span>
    </span>
  );
}
