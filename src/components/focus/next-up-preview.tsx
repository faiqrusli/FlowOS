"use client";

import type { DragEvent } from "react";
import { ChevronDown, Clock } from "lucide-react";
import { TaskGroupPill } from "@/components/tasks/task-group-pill";
import { TaskPriorityFlagIcon } from "@/components/tasks/task-priority-flag-icon";
import { TaskBoardInsertLine } from "@/components/tasks/task-board-insert-line";
import { formatTaskFocusSchedule } from "@/lib/task-focus-display";
import { getTaskGroupAppearance } from "@/lib/task-group-appearance";
import { normalizeTaskPriority } from "@/lib/task-priority";
import { cn } from "@/lib/utils";
import type { Task, TaskGroupWithTasks } from "@/types/task";

/** Hierarchy refinement: preview shows the immediate next item only. */
export const NEXT_UP_PREVIEW_CAP = 1;

type NextUpPreviewProps = {
  tasks: Task[];
  groups: TaskGroupWithTasks[];
  /** Shrink empty drop zone while an active focus session owns attention. */
  demoted?: boolean;
  onViewAll?: () => void;
  onHeaderClick?: () => void;
  dropActive?: boolean;
  dropBeforeTaskId?: string | null;
  onExternalDragOver?: (taskId: string | null) => void;
  onExternalDrop?: (event: DragEvent<HTMLDivElement>, taskId: string | null) => void;
};

function NextUpPreviewRow({
  task,
  groups,
  onClick,
  dropBefore,
  onExternalDragOver,
  onExternalDrop,
}: {
  task: Task;
  groups: TaskGroupWithTasks[];
  onClick?: () => void;
  dropBefore: boolean;
  onExternalDragOver?: () => void;
  onExternalDrop?: (event: DragEvent<HTMLDivElement>) => void;
}) {
  const group = groups.find((item) => item.id === task.group_id) ?? null;
  const appearance = group ? getTaskGroupAppearance(group) : null;
  const schedule = formatTaskFocusSchedule(task);
  const durationLabel =
    task.duration_minutes != null && task.duration_minutes > 0
      ? `${task.duration_minutes} min`
      : schedule !== "—"
        ? schedule
        : null;

  return (
    <div
      onDragOver={(event) => {
        event.preventDefault();
        event.stopPropagation();
        onExternalDragOver?.();
      }}
      onDrop={onExternalDrop}
    >
      {dropBefore ? <TaskBoardInsertLine className="mb-1" /> : null}
      <button
        type="button"
        onClick={onClick}
        className="flex w-full min-w-0 items-center gap-2 rounded-md bg-surface-base/50 px-1.5 py-1.5 text-left transition-colors hover:bg-surface-hover"
      >
        <span
          aria-hidden
          className="w-3 shrink-0 text-center text-[11px] leading-none text-primary"
        >
          ○
        </span>
        {task.priority ? (
          <TaskPriorityFlagIcon
            priority={normalizeTaskPriority(task.priority)}
            className="size-3.5"
          />
        ) : null}
        <span className="min-w-0 flex-1 truncate text-[13px] font-medium leading-snug text-foreground">
          {task.title}
        </span>
        {group && appearance ? (
          <TaskGroupPill
            icon={appearance.icon}
            name={group.title}
            appearance={appearance}
            className="max-w-24 shrink text-[11px]"
          />
        ) : null}
        {durationLabel ? (
          <span className="shrink-0 text-[11px] tabular-nums text-muted-foreground">
            {durationLabel}
          </span>
        ) : null}
      </button>
    </div>
  );
}

export function NextUpPreview({
  tasks,
  groups,
  demoted = false,
  onViewAll,
  onHeaderClick,
  dropActive = false,
  dropBeforeTaskId = null,
  onExternalDragOver,
  onExternalDrop,
}: NextUpPreviewProps) {
  const nextTask = tasks[0] ?? null;
  const overflowCount = Math.max(0, tasks.length - NEXT_UP_PREVIEW_CAP);
  const isEmpty = tasks.length === 0;
  const openQueue = onViewAll ?? onHeaderClick;

  return (
    <div className="mt-1 shrink-0 overflow-hidden rounded-lg border border-border-subtle bg-card/80 pt-0">
      <div className="flex items-center gap-2 border-b border-border-subtle/70 px-2.5 py-1.5">
        <Clock className="size-3.5 shrink-0 text-muted-foreground" aria-hidden />
        <button
          type="button"
          onClick={onHeaderClick}
          disabled={!onHeaderClick}
          className={cn(
            "text-[12px] font-semibold uppercase tracking-wide text-foreground/90",
            onHeaderClick && "hover:text-foreground"
          )}
        >
          Next Up
          {tasks.length > 0 ? (
            <span className="ml-1 font-medium normal-case tracking-normal text-muted-foreground">
              ({tasks.length})
            </span>
          ) : null}
        </button>
      </div>

      <div className="px-1.5 py-1">
        {isEmpty ? (
          <div
            className={cn(
              "flex items-center justify-center rounded-md border border-dashed px-3 text-center text-[12px] transition-colors",
              demoted ? "min-h-9 py-1.5" : "min-h-14",
              dropActive
                ? "border-primary/60 bg-primary/10 text-foreground"
                : demoted
                  ? "border-border-subtle/70 bg-transparent text-muted-foreground/60"
                  : "border-border-subtle bg-surface-canvas/30 text-muted-foreground/85"
            )}
            onDragOver={(event) => {
              event.preventDefault();
              event.stopPropagation();
              onExternalDragOver?.(null);
            }}
            onDrop={(event) => onExternalDrop?.(event, null)}
          >
            {dropActive
              ? "Release to add to Next Up"
              : demoted
                ? "Drop a task for what’s next"
                : "Drag a task here to decide what’s next."}
          </div>
        ) : nextTask ? (
          <div className="space-y-0.5">
            <NextUpPreviewRow
              task={nextTask}
              groups={groups}
              onClick={openQueue}
              dropBefore={dropActive && dropBeforeTaskId === nextTask.id}
              onExternalDragOver={() => onExternalDragOver?.(nextTask.id)}
              onExternalDrop={(event) => onExternalDrop?.(event, nextTask.id)}
            />
            {dropActive && dropBeforeTaskId === null ? (
              <TaskBoardInsertLine className="mt-1" />
            ) : null}
          </div>
        ) : null}
      </div>

      {overflowCount > 0 ? (
        <button
          type="button"
          onClick={openQueue}
          disabled={!openQueue}
          className={cn(
            "flex w-full items-center gap-1 border-t border-border-subtle/70 px-2.5 py-1.5 text-left text-[12px] text-muted-foreground",
            openQueue ? "hover:bg-surface-hover hover:text-foreground" : "cursor-default opacity-80"
          )}
        >
          <span>
            {overflowCount} more
          </span>
          <ChevronDown className="size-3.5" aria-hidden />
        </button>
      ) : null}
    </div>
  );
}
