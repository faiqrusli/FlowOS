"use client";

import { Badge } from "@/components/ui/badge";
import {
  getGroupDotClass,
  TASK_GROUP_SWATCH_CLASS,
  type TaskGroupAppearance,
} from "@/lib/task-group-appearance";
import { cn } from "@/lib/utils";

type TaskGroupPillProps = {
  icon: string;
  name: string;
  appearance: Pick<TaskGroupAppearance, "colorKey">;
  count?: number;
  variant?: "filled" | "plain";
  className?: string;
};

export function TaskGroupPill({
  name,
  appearance,
  count,
  variant = "filled",
  className,
}: TaskGroupPillProps) {
  const showCount = count !== undefined && count > 0;
  const dotClassName = TASK_GROUP_SWATCH_CLASS[appearance.colorKey];

  if (variant === "plain") {
    return (
      <span
        className={cn(
          "inline-flex min-w-0 items-center gap-1.5 text-sm font-medium text-foreground",
          className
        )}
      >
        <span
          className={getGroupDotClass(appearance.colorKey)}
          aria-hidden
        />
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
      dotClassName={dotClassName}
      className={cn("max-w-full min-w-0", className)}
    >
      <span className="truncate">{name}</span>
    </Badge>
  );
}
