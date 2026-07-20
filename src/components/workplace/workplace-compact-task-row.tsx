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
import { TaskGroupPill } from "@/components/tasks/task-group-pill";
import { TaskPriorityFlagIcon } from "@/components/tasks/task-priority-flag-icon";
import { formatTaskFocusSchedule } from "@/lib/task-focus-display";
import { getTaskGroupAppearance } from "@/lib/task-group-appearance";
import {
  getWorkplaceGroupAccentClass,
  getWorkplaceGroupAccentColorVar,
} from "@/lib/workplace-group-accent";
import { normalizeTaskPriority } from "@/lib/task-priority";
import { setActiveTaskDragId, setBoardTaskDragData } from "@/lib/timeline-drag";
import { setCompactQueueDragImage } from "@/lib/list-drag-utils";
import { useNextUpQueueView } from "@/contexts/next-up-queue-view-context";
import { cn } from "@/lib/utils";
import { todayTaskAnchorId } from "@/lib/today-in-place";
import type { Task, TaskGroupWithTasks } from "@/types/task";

type WorkplaceCompactTaskRowProps = {
  task: Task;
  groups: TaskGroupWithTasks[];
  selected?: boolean;
  /** Active focus session is targeting this task. */
  inFocus?: boolean;
  /** Pause — quieter in-focus edge, no breathe animation. */
  focusSoftened?: boolean;
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
  focusSoftened = false,
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
  const nextUpQueueView = useNextUpQueueView();
  const queuePosition =
    nextUpQueueView?.getTaskQueuePosition(task.id) ?? null;
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
    <div
      className={cn(
        "flex h-4 min-w-0 shrink-0 items-center gap-1 transition-opacity duration-150",
        onOpenMenu &&
          "group-hover/row:pointer-events-none group-hover/row:opacity-0 group-focus-within/row:pointer-events-none group-focus-within/row:opacity-0",
      )}
    >
      {group && appearance ? (
        <TaskGroupPill
          icon={appearance.icon}
          name={group.title}
          appearance={appearance}
          variant="plain"
          className="h-4 max-w-[4.5rem] shrink-0 gap-1 text-[10px] leading-none text-muted-foreground"
        />
      ) : null}
      {queuePosition != null ? (
        <button
          type="button"
          data-no-dnd
          title={`Queued • Position ${queuePosition}`}
          aria-label={`Queued, position ${queuePosition}. Open in Next Up queue.`}
          onClick={(event) => {
            event.stopPropagation();
            nextUpQueueView?.revealQueuedTask(task.id);
          }}
          className="shrink-0 text-[11px] font-medium tabular-nums leading-none text-muted-foreground/70 transition-colors hover:text-muted-foreground"
        >
          #{queuePosition}
        </button>
      ) : null}
      {inFocus && focusClock ? (
        <span
          className="shrink-0 text-[12px] font-semibold tabular-nums leading-none tracking-tight text-foreground"
          aria-label={`Focused ${focusClock}`}
          title="Focus elapsed"
        >
          {focusClock}
        </span>
      ) : scheduleLabel || durationLabel ? (
        <span className="shrink-0 text-[12px] tabular-nums leading-none text-muted-foreground/80">
          {scheduleLabel ?? durationLabel}
        </span>
      ) : null}
    </div>
  );

  void onUpdateDuration;

  return (
    <div
      ref={rowRef}
      id={todayTaskAnchorId(task.id)}
      draggable={canDrag}
      data-task-in-focus={inFocus ? "true" : undefined}
      data-focus-softened={focusSoftened ? "true" : undefined}
      onMouseDown={handleRowMouseDown}
      onMouseUp={restoreDraggable}
      onDragStart={canDrag ? handleDragStart : undefined}
      onDragEnd={handleDragEnd}
      onContextMenu={onContextMenu}
      onClick={() => onSelect?.()}
      className={cn(
        "group/row relative flex h-8 items-center gap-1.5 rounded-md border border-transparent px-2 transition-[background-color,border-color,box-shadow] duration-150 hover:bg-surface-hover",
        canDrag && "cursor-grab active:cursor-grabbing",
        onSelect && !canDrag && !task.completed && "cursor-pointer",
        task.completed && "cursor-default opacity-70 hover:bg-transparent",
        dragging && "opacity-40",
        selected && "bg-surface-8 ring-1 ring-primary/35",
        accentClass && !inFocus ? cn("border-l-2", accentClass) : null,
        inFocus && "timeline-task-in-focus",
      )}
      data-selected={selected ? "true" : undefined}
      data-completed={task.completed ? "true" : undefined}
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

      {showPriorityFlag ? (
        <TaskPriorityFlagIcon
          priority={priority}
          className="size-3 shrink-0"
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
          "min-w-0 flex-1 truncate text-left text-[13px] font-medium leading-none text-foreground",
          onSelect ? "hover:text-foreground" : "hover:underline",
          task.completed && "line-through opacity-60",
        )}
      >
        {task.title}
      </span>

      <div className="relative flex h-full shrink-0 items-center justify-end">
        {trailingMeta}
        {onOpenMenu ? (
          <button
            type="button"
            data-no-dnd
            onClick={(event) => {
              event.stopPropagation();
              onOpenMenu(event.currentTarget.getBoundingClientRect());
            }}
            className="absolute right-0 top-1/2 z-10 flex size-5 -translate-y-1/2 items-center justify-center rounded-md text-muted-foreground opacity-0 transition-opacity hover:bg-surface-hover hover:text-foreground group-hover/row:opacity-100 focus-visible:opacity-100"
            aria-label={`More actions for ${task.title}`}
            title="More actions"
          >
            <MoreHorizontal className="size-3.5" />
          </button>
        ) : null}
      </div>
    </div>
  );
});
