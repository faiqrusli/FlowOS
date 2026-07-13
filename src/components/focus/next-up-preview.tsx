"use client";

import type { DragEvent } from "react";
import { TaskGroupPill } from "@/components/tasks/task-group-pill";
import { TaskPriorityFlagIcon } from "@/components/tasks/task-priority-flag-icon";
import { TaskBoardInsertLine } from "@/components/tasks/task-board-insert-line";
import { formatTaskFocusSchedule } from "@/lib/task-focus-display";
import { getTaskGroupAppearance } from "@/lib/task-group-appearance";
import { normalizeTaskPriority } from "@/lib/task-priority";
import { cn } from "@/lib/utils";
import type { Task, TaskGroupWithTasks } from "@/types/task";

export const NEXT_UP_PREVIEW_CAP = 3;

type NextUpPreviewProps = {
  tasks: Task[];
  groups: TaskGroupWithTasks[];
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
  isNext,
  dropBefore,
  onExternalDragOver,
  onExternalDrop,
}: {
  task: Task;
  groups: TaskGroupWithTasks[];
  onClick?: () => void;
  isNext: boolean;
  dropBefore: boolean;
  onExternalDragOver?: () => void;
  onExternalDrop?: (event: DragEvent<HTMLDivElement>) => void;
}) {
  const group = groups.find((item) => item.id === task.group_id) ?? null;
  const appearance = group ? getTaskGroupAppearance(group) : null;

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
        className="flex w-full min-w-0 items-center gap-2 rounded-md py-1 text-left hover:bg-muted/35"
      >
        <span aria-hidden className="w-3 shrink-0 text-center text-[13px] leading-none text-muted-foreground/80">
          {isNext ? "●" : "○"}
        </span>
        <span className="min-w-0 flex-1 truncate text-[14px] font-medium leading-snug text-foreground">
          {task.title}
        </span>
        {isNext ? (
          <span className="shrink-0 rounded-full bg-primary/10 px-1.5 py-0.5 text-[10px] font-semibold text-primary">
            Next
          </span>
        ) : null}
        {group && appearance ? (
          <TaskGroupPill
            icon={appearance.icon}
            name={group.title}
            appearance={appearance}
            className="max-w-24 shrink text-[11px]"
          />
        ) : null}
        {formatTaskFocusSchedule(task) !== "—" ? (
          <span className="shrink-0 text-[12px] tabular-nums text-muted-foreground">
            {formatTaskFocusSchedule(task)}
          </span>
        ) : null}
        {task.priority ? (
          <TaskPriorityFlagIcon
            priority={normalizeTaskPriority(task.priority)}
            className="size-3.5"
          />
        ) : null}
      </button>
    </div>
  );
}

export function NextUpPreview({
  tasks,
  groups,
  onViewAll,
  onHeaderClick,
  dropActive = false,
  dropBeforeTaskId = null,
  onExternalDragOver,
  onExternalDrop,
}: NextUpPreviewProps) {
  const previewTasks = tasks.slice(0, NEXT_UP_PREVIEW_CAP);
  const overflowCount = Math.max(0, tasks.length - NEXT_UP_PREVIEW_CAP);
  const isEmpty = tasks.length === 0;

  return (
    <div className="mt-1 shrink-0 overflow-hidden pt-2">
      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={onHeaderClick}
          disabled={!onHeaderClick}
          className={cn(
            "text-[13px] font-semibold text-foreground/90",
            onHeaderClick && "hover:text-foreground"
          )}
        >
          Next Up{tasks.length > 0 ? ` (${tasks.length})` : ""}
        </button>
      </div>

      <div className="mt-1.5">
        {isEmpty ? (
          <div
            className={cn(
              "flex min-h-20 items-center justify-center rounded-md border border-dashed px-3 text-center text-[13px] transition-colors",
              dropActive
                ? "border-primary/60 bg-primary/10 text-foreground"
                : "border-border/60 bg-muted/20 text-muted-foreground/85"
            )}
            onDragOver={(event) => {
              event.preventDefault();
              event.stopPropagation();
              onExternalDragOver?.(null);
            }}
            onDrop={(event) => onExternalDrop?.(event, null)}
          >
            {dropActive ? "Release to add to Next Up" : "Drag a task here to decide what’s next."}
          </div>
        ) : (
          <div className="space-y-0.5">
            {previewTasks.map((task, index) => (
              <NextUpPreviewRow
                key={task.id}
                task={task}
                groups={groups}
                onClick={onViewAll}
                isNext={index === 0}
                dropBefore={dropActive && dropBeforeTaskId === task.id}
                onExternalDragOver={() => onExternalDragOver?.(task.id)}
                onExternalDrop={(event) => onExternalDrop?.(event, task.id)}
              />
            ))}
            {dropActive && dropBeforeTaskId === null ? (
              <TaskBoardInsertLine className="mt-1" />
            ) : null}
          </div>
        )}
      </div>

      {overflowCount > 0 ? (
        <button
          type="button"
          onClick={onViewAll}
          disabled={!onViewAll}
          className={cn(
            "mt-1.5 text-[13px] text-primary/90",
            onViewAll ? "hover:text-primary" : "cursor-default opacity-80"
          )}
        >
          ({overflowCount} more →)
        </button>
      ) : null}
    </div>
  );
}
