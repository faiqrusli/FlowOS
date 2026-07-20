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
  onToggleHabitComplete?: (habit: Habit) => void;
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
  onToggleHabitComplete,
  onMove,
  onMoveToTop,
  onMoveToBottom,
}: NextUpQueueItemProps) {
  const rowRef = useRef<HTMLDivElement>(null);
  const suppressDragRef = useRef(false);
  const [menuPoint, setMenuPoint] = useState<{ x: number; y: number } | null>(
    null,
  );
  const [rowActive, setRowActive] = useState(false);

  const completed =
    kind === "task"
      ? Boolean(task?.completed)
      : Boolean(habit?.completed);
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

  const showActions = Boolean(menuPoint) || rowActive;

  return (
    <>
      <div
        ref={rowRef}
        draggable={!completed}
        onMouseDown={handleRowMouseDown}
        onMouseUp={restoreDraggable}
        onDragStart={completed ? undefined : handleDragStart}
        onDragEnd={handleDragEnd}
        onPointerEnter={() => setRowActive(true)}
        onPointerLeave={() => {
          if (!menuPoint) setRowActive(false);
        }}
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
          "group/queue-item flow-interactive flex min-w-0 items-center gap-2 rounded-lg border-0 bg-transparent px-1 py-1.5 shadow-none",
          !completed &&
            "cursor-grab active:cursor-grabbing hover:bg-surface-hover",
          completed && "cursor-default opacity-70",
        )}
      >
        <span className="flow-queue-index" aria-hidden>
          {position}
        </span>

        {kind === "habit" ? (
          <span
            className="flex size-6 shrink-0 items-center justify-center text-success"
            aria-hidden
          >
            <Repeat className="size-3.5" />
          </span>
        ) : null}

        <div className="flex min-w-0 flex-1 items-center gap-1.5">
          <button
            type="button"
            data-no-dnd
            onClick={() => onOpen()}
            className={cn(
              "flow-type-title min-w-0 truncate text-left text-[13px] leading-snug hover:underline",
              completed && "line-through opacity-60",
            )}
          >
            {title}
          </button>
          {kind === "task" && task?.priority && priority !== "low" ? (
            <TaskPriorityFlagIcon
              priority={priority}
              className="size-3 shrink-0"
            />
          ) : null}
        </div>

        <div className="flex h-6 shrink-0 items-center justify-end gap-0.5">
          {showActions ? (
            <div className="flex items-center gap-0.5">
              {(kind === "task" && task && onToggleComplete) ||
              (kind === "habit" && habit && onToggleHabitComplete) ? (
                <button
                  type="button"
                  data-no-dnd
                  onClick={(event) => {
                    event.stopPropagation();
                    if (kind === "task" && task) onToggleComplete?.(task);
                    else if (kind === "habit" && habit)
                      onToggleHabitComplete?.(habit);
                  }}
                  className={cn(
                    "flex size-6 items-center justify-center rounded-md transition-colors hover:bg-surface-hover",
                    completed
                      ? "text-foreground"
                      : "text-muted-foreground hover:text-foreground",
                  )}
                  aria-label={
                    completed
                      ? `Mark "${title}" incomplete`
                      : `Mark "${title}" complete`
                  }
                  title={kind === "habit" ? "Complete habit" : "Complete task"}
                >
                  <Check className="size-3.5" strokeWidth={2.25} aria-hidden />
                </button>
              ) : null}
              <button
                type="button"
                data-no-dnd
                onClick={() => onStartFocus()}
                data-pending-focus-anchor=""
                className="flex size-6 items-center justify-center rounded-md text-muted-foreground hover:bg-surface-hover hover:text-foreground"
                aria-label={`Start focus on ${title}`}
                title="Start focus"
              >
                <Play className="size-3.5" aria-hidden />
              </button>
              <button
                type="button"
                data-no-dnd
                onClick={(event) => {
                  const rect = event.currentTarget.getBoundingClientRect();
                  openMenuAt(rect.left, rect.bottom + 4);
                }}
                className="flex size-6 items-center justify-center rounded-md text-muted-foreground hover:bg-surface-hover hover:text-foreground"
                aria-label={`More actions for ${title}`}
                title="More"
              >
                <MoreHorizontal className="size-3.5" aria-hidden />
              </button>
            </div>
          ) : hasMeta ? (
            <div className="flow-meta-row">
              {kind === "habit" ? (
                <span className="flow-type-meta flow-meta-group shrink-0 text-[11px]">
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
                      className="flow-meta-group max-w-28 shrink-0 text-[11px]"
                    />
                  ) : null}
                  {scheduleLabel && scheduleLabel !== "—" ? (
                    <span className="flow-type-meta flow-meta-group shrink-0 text-[11px] tabular-nums">
                      {scheduleLabel}
                    </span>
                  ) : null}
                </>
              )}
            </div>
          ) : null}
        </div>
      </div>

      {menuPoint ? (
        <NextUpQueueMenu
          x={menuPoint.x}
          y={menuPoint.y}
          kind={kind}
          onClose={() => {
            setMenuPoint(null);
            setRowActive(false);
          }}
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
