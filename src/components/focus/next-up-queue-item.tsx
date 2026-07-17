"use client";

import {
  useRef,
  useState,
  type DragEvent,
  type MouseEvent as ReactMouseEvent,
} from "react";
import { Check, MoreHorizontal, Play, Repeat } from "lucide-react";
import { NextUpQueueMenu } from "@/components/focus/next-up-queue-menu";
import { TaskGroupPill } from "@/components/tasks/task-group-pill";
import { TaskPriorityFlagIcon } from "@/components/tasks/task-priority-flag-icon";
import { formatTaskFocusSchedule } from "@/lib/task-focus-display";
import { getTaskGroupAppearance } from "@/lib/task-group-appearance";
import { normalizeTaskPriority } from "@/lib/task-priority";
import { cn } from "@/lib/utils";
import type { Habit } from "@/types/habit";
import type { Task, TaskGroupWithTasks } from "@/types/task";

type NextUpQueueItemProps = {
  kind: "task" | "habit";
  task?: Task;
  habit?: Habit;
  habitDurationMinutes?: number;
  groups: TaskGroupWithTasks[];
  position: number;
  onStartFocus: () => void;
  onOpen: () => void;
  onRemove: () => void;
  onDragStart: (event: DragEvent<HTMLDivElement>) => void;
  onDragEnd: () => void;
  onToggleComplete?: (task: Task) => void;
  onMove: (delta: -1 | 1) => void;
  onMoveToTop: () => void;
  onMoveToBottom: () => void;
};

function isNoDragTarget(target: EventTarget | null): boolean {
  return Boolean(target instanceof Element && target.closest("[data-no-dnd]"));
}

export function NextUpQueueItem({
  kind,
  task,
  habit,
  habitDurationMinutes = 0,
  groups,
  position,
  onStartFocus,
  onOpen,
  onRemove,
  onDragStart,
  onDragEnd,
  onToggleComplete,
  onMove,
  onMoveToTop,
  onMoveToBottom,
}: NextUpQueueItemProps) {
  const rowRef = useRef<HTMLDivElement>(null);
  const suppressDragRef = useRef(false);
  const [menuPoint, setMenuPoint] = useState<{ x: number; y: number } | null>(
    null,
  );

  const completed = kind === "task" ? Boolean(task?.completed) : false;
  const title =
    kind === "task" ? (task?.title ?? "Task") : (habit?.name ?? "Habit");
  const group =
    kind === "task"
      ? (groups.find((item) => item.id === task?.group_id) ?? null)
      : null;
  const appearance = group ? getTaskGroupAppearance(group) : null;
  const scheduleLabel =
    kind === "task" && task
      ? formatTaskFocusSchedule(task)
      : habitDurationMinutes > 0
        ? `${habitDurationMinutes} min`
        : null;
  const priority =
    kind === "task" && task ? normalizeTaskPriority(task.priority) : "low";
  const hasMeta =
    kind === "habit" ||
    Boolean(group && appearance) ||
    (scheduleLabel != null && scheduleLabel !== "—");

  const handleRowMouseDown = (event: ReactMouseEvent<HTMLDivElement>) => {
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

  const openMenuAt = (x: number, y: number) => {
    setMenuPoint({ x, y });
  };

  return (
    <>
      <div
        ref={rowRef}
        draggable={!completed}
        onMouseDown={handleRowMouseDown}
        onMouseUp={restoreDraggable}
        onDragStart={completed ? undefined : handleDragStart}
        onDragEnd={handleDragEnd}
        onContextMenu={(event) => {
          event.preventDefault();
          event.stopPropagation();
          openMenuAt(event.clientX, event.clientY);
        }}
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
          "group/queue-item flex flex-col gap-0.5 rounded-md border border-border-subtle/40 bg-surface-canvas/30 px-2 py-1 transition-[background-color,border-color] duration-150",
          !completed &&
            "cursor-grab active:cursor-grabbing hover:border-border-subtle/70 hover:bg-surface-hover",
          completed && "cursor-default opacity-70",
        )}
      >
        <div className="flex min-w-0 items-center gap-1.5">
          <span
            className="w-3.5 shrink-0 text-center text-[10px] tabular-nums text-muted-foreground/45"
            aria-hidden
          >
            {position}
          </span>

          {kind === "task" && task && onToggleComplete ? (
            <button
              type="button"
              data-no-dnd
              onClick={(event) => {
                event.stopPropagation();
                onToggleComplete(task);
              }}
              className={cn(
                "flex size-3.5 shrink-0 cursor-pointer items-center justify-center rounded-full border transition-colors",
                completed
                  ? "border-foreground bg-foreground text-background"
                  : "border-muted-foreground/35 hover:border-foreground/55",
              )}
              aria-label={
                completed
                  ? `Mark "${title}" incomplete`
                  : `Mark "${title}" complete`
              }
            >
              {completed ? <Check className="size-2" strokeWidth={3} /> : null}
            </button>
          ) : (
            <span
              className="flex size-3.5 shrink-0 items-center justify-center text-success"
              aria-hidden
            >
              <Repeat className="size-3" />
            </span>
          )}

          {kind === "task" && task?.priority && priority !== "low" ? (
            <TaskPriorityFlagIcon
              priority={priority}
              className="size-3 shrink-0"
            />
          ) : null}

          <button
            type="button"
            data-no-dnd
            onClick={() => onOpen()}
            className={cn(
              "min-w-0 flex-1 truncate text-left text-[13px] font-medium leading-tight text-foreground hover:underline",
              completed && "line-through opacity-60",
            )}
          >
            {title}
          </button>

          <button
            type="button"
            data-no-dnd
            onClick={() => onStartFocus()}
            data-pending-focus-anchor=""
            className="flex size-6 shrink-0 items-center justify-center rounded-md text-muted-foreground opacity-0 transition-opacity hover:bg-surface-hover hover:text-foreground group-hover/queue-item:opacity-100 focus-visible:opacity-100"
            aria-label={`Start focus on ${title}`}
            title="Start focus"
          >
            <Play className="size-3.5" />
          </button>
          <button
            type="button"
            data-no-dnd
            onClick={(event) => {
              const rect = event.currentTarget.getBoundingClientRect();
              openMenuAt(rect.left, rect.bottom + 4);
            }}
            className="flex size-6 shrink-0 items-center justify-center rounded-md text-muted-foreground hover:bg-surface-hover hover:text-foreground"
            aria-label={`More actions for ${title}`}
          >
            <MoreHorizontal className="size-3.5" />
          </button>
        </div>

        {hasMeta ? (
          <div className="flex min-w-0 flex-wrap items-center gap-x-1.5 gap-y-0.5 pl-[30px]">
            {kind === "habit" ? (
              <span className="shrink-0 text-[11px] text-muted-foreground">
                Habit
                {scheduleLabel ? ` · ${scheduleLabel}` : ""}
              </span>
            ) : (
              <>
                {group && appearance ? (
                  <TaskGroupPill
                    icon={appearance.icon}
                    name={group.title}
                    appearance={appearance}
                    className="max-w-28 shrink-0 text-[10px]"
                  />
                ) : null}
                {scheduleLabel && scheduleLabel !== "—" ? (
                  <span className="shrink-0 text-[11px] tabular-nums text-muted-foreground">
                    {scheduleLabel}
                  </span>
                ) : null}
              </>
            )}
          </div>
        ) : null}
      </div>

      {menuPoint ? (
        <NextUpQueueMenu
          x={menuPoint.x}
          y={menuPoint.y}
          kind={kind}
          onClose={() => setMenuPoint(null)}
          onStartFocus={onStartFocus}
          onOpen={onOpen}
          onMoveToTop={onMoveToTop}
          onMoveToBottom={onMoveToBottom}
          onRemove={onRemove}
        />
      ) : null}
    </>
  );
}
