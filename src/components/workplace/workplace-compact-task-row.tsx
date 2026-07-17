"use client";

import {
  memo,
  useCallback,
  useRef,
  useState,
  type CSSProperties,
  type DragEvent,
  type MouseEvent,
} from "react";
import { Check, MoreHorizontal } from "lucide-react";
import { TaskDurationPicker } from "@/components/tasks/task-duration-picker";
import { TaskGroupPill } from "@/components/tasks/task-group-pill";
import { TaskPriorityFlagIcon } from "@/components/tasks/task-priority-flag-icon";
import { formatTaskFocusSchedule } from "@/lib/task-focus-display";
import { getTaskGroupAppearance } from "@/lib/task-group-appearance";
import { getWorkplaceGroupAccentClass, getWorkplaceGroupAccentColorVar } from "@/lib/workplace-group-accent";
import { normalizeTaskPriority } from "@/lib/task-priority";
import { setActiveTaskDragId, setBoardTaskDragData } from "@/lib/timeline-drag";
import { setCompactQueueDragImage } from "@/lib/list-drag-utils";
import { cn } from "@/lib/utils";
import { todayTaskAnchorId } from "@/lib/today-in-place";
import type { Task, TaskGroupWithTasks } from "@/types/task";

type WorkplaceCompactTaskRowProps = {
  task: Task;
  groups: TaskGroupWithTasks[];
  selected?: boolean;
  /** Active focus session is targeting this task. */
  inFocus?: boolean;
  /** Live MM:SS elapsed for the focused task. */
  focusClock?: string | null;
  onSelect?: () => void;
  onOpenDetail: () => void;
  onToggleComplete: () => void;
  onUpdateDuration?: (minutes: number | null) => void;
  onContextMenu?: (event: MouseEvent<HTMLDivElement>) => void;
  onOpenMenu?: (anchorRect: DOMRect) => void;
};

function resolveTaskGroup(task: Task, groups: TaskGroupWithTasks[]) {
  if (!task.group_id) return null;
  return groups.find((group) => group.id === task.group_id) ?? null;
}

function isNoDragTarget(target: EventTarget | null): boolean {
  return Boolean(target instanceof Element && target.closest("[data-no-dnd]"));
}

export const WorkplaceCompactTaskRow = memo(function WorkplaceCompactTaskRow({
  task,
  groups,
  selected = false,
  inFocus = false,
  focusClock = null,
  onSelect,
  onOpenDetail,
  onToggleComplete,
  onUpdateDuration,
  onContextMenu,
  onOpenMenu,
}: WorkplaceCompactTaskRowProps) {
  const rowRef = useRef<HTMLDivElement>(null);
  const suppressDragRef = useRef(false);
  const group = resolveTaskGroup(task, groups);
  const appearance = group ? getTaskGroupAppearance(group) : null;
  const priority = normalizeTaskPriority(task.priority);
  const showPriorityFlag = Boolean(task.priority) && priority !== "low";
  const accentClass = appearance
    ? getWorkplaceGroupAccentClass(appearance.colorKey)
    : null;
  const focusEdgeColor = appearance
    ? getWorkplaceGroupAccentColorVar(appearance.colorKey)
    : "var(--chart-1)";
  const scheduleLabel = formatTaskFocusSchedule(task);
  const [dragging, setDragging] = useState(false);
  const canDrag = !task.completed;

  const durationLabel =
    task.duration_minutes != null && task.duration_minutes > 0
      ? `${task.duration_minutes} min`
      : null;

  const restoreDraggable = useCallback(() => {
    suppressDragRef.current = false;
    if (rowRef.current) {
      rowRef.current.draggable = canDrag;
    }
  }, [canDrag]);

  const handleRowMouseDown = (event: MouseEvent<HTMLDivElement>) => {
    const blockDrag = isNoDragTarget(event.target);
    suppressDragRef.current = blockDrag;
    if (rowRef.current) {
      rowRef.current.draggable = canDrag && !blockDrag;
    }
  };

  const handleDragStart = useCallback(
    (event: DragEvent<HTMLDivElement>) => {
      if (suppressDragRef.current || isNoDragTarget(event.target)) {
        event.preventDefault();
        restoreDraggable();
        return;
      }
      setBoardTaskDragData(event, task.id);
      event.dataTransfer.effectAllowed = "move";
      setCompactQueueDragImage(event, task.title, durationLabel);
      setDragging(true);
    },
    [durationLabel, restoreDraggable, task.id, task.title],
  );

  const handleDragEnd = useCallback(() => {
    setActiveTaskDragId(null);
    setDragging(false);
    restoreDraggable();
  }, [restoreDraggable]);

  const trailingMeta = (
    <div className="flex shrink-0 items-center gap-1.5">
      {group && appearance ? (
        <TaskGroupPill
          icon={appearance.icon}
          name={group.title}
          appearance={appearance}
          className="max-w-[5rem] shrink-0 text-[11px]"
        />
      ) : null}
      {inFocus && focusClock ? (
        <span
          className="shrink-0 text-[12px] font-semibold tabular-nums leading-none tracking-tight text-foreground"
          aria-label={`Focused ${focusClock}`}
          title="Focus elapsed"
        >
          {focusClock}
        </span>
      ) : onUpdateDuration && !task.scheduled_time ? (
        <div data-no-dnd>
          <TaskDurationPicker
            variant="timeline"
            compact
            durationMinutes={task.duration_minutes}
            onChange={onUpdateDuration}
          />
        </div>
      ) : (
        <span className="shrink-0 text-[13px] tabular-nums text-muted-foreground/80">
          {scheduleLabel}
        </span>
      )}
    </div>
  );

  return (
    <div
      ref={rowRef}
      id={todayTaskAnchorId(task.id)}
      draggable={canDrag}
      data-task-in-focus={inFocus ? "true" : undefined}
      onMouseDown={handleRowMouseDown}
      onMouseUp={restoreDraggable}
      onDragStart={canDrag ? handleDragStart : undefined}
      onDragEnd={handleDragEnd}
      onContextMenu={onContextMenu}
      onClick={() => onSelect?.()}
      className={cn(
        "group/row relative flex items-center gap-1.5 rounded-md border border-transparent px-1.5 py-1 transition-[background-color,border-color,opacity,box-shadow] duration-150 hover:bg-surface-hover",
        canDrag && "cursor-grab active:cursor-grabbing",
        onSelect && !canDrag && !task.completed && "cursor-pointer",
        task.completed && "cursor-default opacity-70 hover:bg-transparent",
        dragging && "opacity-40",
        selected && "bg-primary/8 ring-1 ring-primary/35",
        accentClass && !inFocus ? cn("border-l-2", accentClass) : null,
        inFocus && "timeline-task-in-focus",
      )}
      style={
        inFocus
          ? ({
              "--focus-edge-color": focusEdgeColor,
            } as CSSProperties)
          : undefined
      }
    >
      <button
        type="button"
        data-no-dnd
        onClick={(event) => {
          event.stopPropagation();
          onToggleComplete();
        }}
        className={cn(
          "flex size-4 shrink-0 items-center justify-center rounded-full border transition-colors",
          task.completed
            ? "border-foreground bg-foreground text-background"
            : "border-muted-foreground/35 hover:border-foreground/55",
        )}
        aria-label={`Mark "${task.title}" complete`}
      >
        {task.completed ? <Check className="size-2.5" strokeWidth={3} /> : null}
      </button>

      {inFocus ? (
        <span
          className="flex size-3.5 shrink-0 items-center justify-center"
          aria-label="Currently in focus"
          title="In focus"
        >
          <span className="timeline-focus-indicator size-1.5 rounded-full bg-primary" />
        </span>
      ) : showPriorityFlag ? (
        <TaskPriorityFlagIcon
          priority={priority}
          className="size-3.5 shrink-0"
        />
      ) : null}

      <span
        role="button"
        tabIndex={0}
        onClick={(event) => {
          event.stopPropagation();
          if (onSelect) onSelect();
          else onOpenDetail();
        }}
        onDoubleClick={(event) => {
          event.stopPropagation();
          onOpenDetail();
        }}
        onKeyDown={(event) => {
          if (event.key === "Enter" || event.key === " ") {
            event.preventDefault();
            event.stopPropagation();
            if (onSelect) onSelect();
            else onOpenDetail();
          }
        }}
        className={cn(
          "min-w-0 flex-1 truncate text-left text-[14px] font-medium leading-none text-foreground",
          onSelect ? "hover:text-foreground" : "hover:underline",
          task.completed && "line-through opacity-60",
        )}
      >
        {task.title}
      </span>

      {trailingMeta}

      {onOpenMenu ? (
        <button
          type="button"
          data-no-dnd
          onClick={(event) => {
            event.stopPropagation();
            onOpenMenu(event.currentTarget.getBoundingClientRect());
          }}
          className="flex size-6 shrink-0 items-center justify-center rounded-md text-muted-foreground opacity-0 transition-opacity hover:bg-surface-hover hover:text-foreground group-hover/row:opacity-100 focus-visible:opacity-100"
          aria-label={`More actions for ${task.title}`}
          title="More actions"
        >
          <MoreHorizontal className="size-3.5" />
        </button>
      ) : null}
    </div>
  );
});
