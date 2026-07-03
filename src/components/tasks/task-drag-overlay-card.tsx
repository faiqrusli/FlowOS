"use client";

import { memo } from "react";
import { CheckCircle2, Circle } from "lucide-react";
import { formatDurationMinutes } from "@/lib/task-duration-options";
import { formatTaskScheduleCompact } from "@/lib/tasks";
import { cn } from "@/lib/utils";
import type { TaskDragOverlaySnapshot } from "@/lib/dnd/overlay-snapshot";

/** Lightweight drag ghost — no hooks, no sortable, frozen at drag start. */
export const TaskDragOverlayCard = memo(function TaskDragOverlayCard({
  task,
}: Pick<TaskDragOverlaySnapshot, "task">) {
  const isCompleted = task.completed;
  const metaPrimary = formatTaskScheduleCompact(task);
  const durationLabel = task.duration_minutes
    ? formatDurationMinutes(task.duration_minutes)
    : null;

  return (
    <div
      className={cn(
        "pointer-events-none flex min-w-0 select-none items-center gap-0 rounded-md border border-border/40 bg-background/60 py-1 pl-0.5 pr-0.5 opacity-60 shadow-lg ring-1 ring-border/25 backdrop-blur-[1px]"
      )}
    >
      <div className="flex size-5 shrink-0 items-center justify-center text-muted-foreground">
        {isCompleted ? (
          <CheckCircle2 className="size-3.5 fill-emerald-500/12 text-emerald-600" />
        ) : (
          <Circle className="size-3.5" />
        )}
      </div>
      <div className="ml-1 min-w-0 flex-1 px-1">
        <span
          className={cn(
            "block truncate font-[520] text-foreground",
            isCompleted ? "text-[13px] leading-4 line-through" : "text-sm leading-[18px]"
          )}
        >
          {task.title || "Untitled"}
        </span>
        {metaPrimary ? (
          <span className="mt-px block truncate text-[10px] leading-[11px] text-muted-foreground/80">
            {metaPrimary}
            {durationLabel ? ` · ${durationLabel}` : ""}
          </span>
        ) : null}
      </div>
    </div>
  );
});
