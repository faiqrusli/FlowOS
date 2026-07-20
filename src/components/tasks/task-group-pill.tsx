"use client";

import { Badge } from "@/components/ui/badge";
import { TaskGroupIdentityMark } from "@/components/tasks/task-group-identity-mark";
import type { TaskGroupAppearance } from "@/lib/task-group-appearance";
import { cn } from "@/lib/utils";

type TaskGroupPillProps = {
  icon: string;
  name: string;
  appearance: Pick<TaskGroupAppearance, "colorKey">;
  count?: number;
  variant?: "filled" | "plain";
  /** Identity mark before the label — off for quiet row chrome. */
  showDot?: boolean;
  className?: string;
};

export function TaskGroupPill({
  icon,
  name,
  appearance,
  count,
  variant = "filled",
  showDot = true,
  className,
}: TaskGroupPillProps) {
  const showCount = count !== undefined && count > 0;
  const mark = showDot ? (
    <TaskGroupIdentityMark icon={icon} colorKey={appearance.colorKey} />
  ) : null;

  if (variant === "plain") {
    return (
      <span
        className={cn(
          "inline-flex min-w-0 items-center gap-1.5 text-sm font-medium text-foreground",
          className,
        )}
      >
        {mark}
        <span className="truncate">{name}</span>
        {showCount ? (
          <span className="shrink-0 text-xs text-muted-foreground">{count}</span>
        ) : null}
      </span>
    );
  }

  return (
    <Badge
      variant="entity-dot"
      className={cn("max-w-full min-w-0", className)}
    >
      {mark}
      <span className="truncate">{name}</span>
      {showCount ? (
        <span className="shrink-0 text-xs text-muted-foreground">{count}</span>
      ) : null}
    </Badge>
  );
}
