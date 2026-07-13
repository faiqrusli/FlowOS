"use client";

import {
  useRef,
  type DragEvent,
  type MouseEvent,
} from "react";
import { Check, Play, X } from "lucide-react";
import { TaskGroupPill } from "@/components/tasks/task-group-pill";
import { TaskPriorityFlagIcon } from "@/components/tasks/task-priority-flag-icon";
import { formatTaskFocusSchedule } from "@/lib/task-focus-display";
import { getTaskGroupAppearance } from "@/lib/task-group-appearance";
import { normalizeTaskPriority } from "@/lib/task-priority";
import { cn } from "@/lib/utils";
import type { Task, TaskGroupWithTasks } from "@/types/task";

type NextUpQueueItemProps = {
  task: Task;
  groups: TaskGroupWithTasks[];
  onStartFocus: (task: Task) => void;
  onOpenDetail: (task: Task) => void;
  onRemove: (id: string) => void;
  onDragStart: (event: DragEvent<HTMLDivElement>) => void;
  onDragEnd: () => void;
  onToggleComplete: (task: Task) => void;
  onMove: (delta: -1 | 1) => void;
};

function isNoDragTarget(target: EventTarget | null): boolean {
  return Boolean(
    target instanceof Element && target.closest("[data-no-dnd]")
  );
}

export function NextUpQueueItem({
  task,
  groups,
  onStartFocus,
  onOpenDetail,
  onRemove,
  onDragStart,
  onDragEnd,
  onToggleComplete,
  onMove,
}: NextUpQueueItemProps) {
  const rowRef = useRef<HTMLDivElement>(null);
  const suppressDragRef = useRef(false);

  const completed = task.completed;
  const group = groups.find((item) => item.id === task.group_id) ?? null;
  const appearance = group ? getTaskGroupAppearance(group) : null;

  const handleRowMouseDown = (event: MouseEvent<HTMLDivElement>) => {
    const blockDrag = isNoDragTarget(event.target);
    suppressDragRef.current = blockDrag;
    if (rowRef.current) {
      rowRef.current.draggable = !completed && !blockDrag;
    }
  };

  const restoreDraggable = () => {
    suppressDragRef.current = false;
    if (rowRef.current) {
      rowRef.current.draggable = !completed;
    }
  };

  const handleDragStart = (event: DragEvent<HTMLDivElement>) => {
    if (suppressDragRef.current || isNoDragTarget(event.target)) {
      event.preventDefault();
      restoreDraggable();
      return;
    }
    onDragStart(event);
  };

  const handleDragEnd = () => {
    restoreDraggable();
    onDragEnd();
  };

  return (
    <div
        ref={rowRef}
        draggable={!completed}
        onMouseDown={handleRowMouseDown}
        onMouseUp={restoreDraggable}
        onDragStart={completed ? undefined : handleDragStart}
        onDragEnd={handleDragEnd}
        onKeyDown={(event) => {
          if (!event.altKey || completed) return;
          if (event.key === "ArrowUp") {
            event.preventDefault();
            onMove(-1);
          }
          if (event.key === "ArrowDown") {
            event.preventDefault();
            onMove(1);
          }
        }}
        tabIndex={0}
        aria-keyshortcuts="Alt+ArrowUp Alt+ArrowDown"
        className={cn(
          "flex items-center gap-1.5 rounded-md border border-border-subtle bg-surface-base px-1.5 py-1.5 transition-[background-color,border-color] duration-150",
          !completed &&
            "cursor-grab active:cursor-grabbing hover:border-border-strong hover:bg-surface-hover",
          completed && "cursor-default opacity-70"
        )}
      >
        <button
          type="button"
          data-no-dnd
          onClick={(event) => {
            event.stopPropagation();
            onToggleComplete(task);
          }}
          className={cn(
            "flex size-4 shrink-0 cursor-pointer items-center justify-center rounded-full border transition-colors",
            completed
              ? "border-foreground bg-foreground text-background"
              : "border-muted-foreground/35 hover:border-foreground/55"
          )}
          aria-label={
            completed
              ? `Mark "${task.title}" incomplete`
              : `Mark "${task.title}" complete`
          }
        >
          {completed ? <Check className="size-2.5" strokeWidth={3} /> : null}
        </button>

        <button
          type="button"
          data-no-dnd
          onClick={() => onOpenDetail(task)}
          className={cn(
            "min-w-0 flex-1 truncate text-left text-[14px] font-medium leading-none text-foreground hover:underline",
            completed && "line-through opacity-60"
          )}
        >
          {task.title}
        </button>

        {group && appearance ? (
          <TaskGroupPill
            icon={appearance.icon}
            name={group.title}
            appearance={appearance}
            className="max-w-20 shrink text-[11px]"
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

        <button
          type="button"
          data-no-dnd
          onClick={() => onStartFocus(task)}
          className="flex size-6 shrink-0 items-center justify-center rounded-md text-muted-foreground hover:bg-surface-hover hover:text-foreground"
          aria-label={`Start focus on ${task.title}`}
          title="Start focus"
        >
          <Play className="size-3.5" />
        </button>
        <button
          type="button"
          data-no-dnd
          onClick={() => onRemove(task.id)}
          className="flex size-6 shrink-0 items-center justify-center rounded-md text-muted-foreground hover:bg-surface-hover hover:text-foreground"
          aria-label={`Remove ${task.title} from Next Up`}
          title="Remove from Next Up"
        >
          <X className="size-3.5" />
        </button>
      </div>
  );
}
