"use client";

import {
  useEffect,
  useState,
  type DragEvent,
  type MouseEvent as ReactMouseEvent,
} from "react";
import {
  Check,
  ChevronDown,
  ChevronUp,
  ListOrdered,
  MoreHorizontal,
  Play,
} from "lucide-react";
import { NextUpQueueMenu } from "@/components/focus/next-up-queue-menu";
import { TaskGroupPill } from "@/components/tasks/task-group-pill";
import { TaskPriorityFlagIcon } from "@/components/tasks/task-priority-flag-icon";
import { TaskBoardInsertLine } from "@/components/tasks/task-board-insert-line";
import {
  acceptNextUpScheduleDrag,
  isNextUpReorderDrag,
  isScheduleKindDrag,
} from "@/lib/next-up-drag";
import { formatTaskFocusSchedule } from "@/lib/task-focus-display";
import { getTaskGroupAppearance } from "@/lib/task-group-appearance";
import { normalizeTaskPriority } from "@/lib/task-priority";
import { cn } from "@/lib/utils";
import type { Task, TaskGroupWithTasks } from "@/types/task";

/** Collapsed preview shows the immediate next item only. */
export const NEXT_UP_PREVIEW_CAP = 1;
/** Inline expand shows at most this many before sending users to the full panel. */
export const NEXT_UP_PREVIEW_EXPANDED_CAP = 3;

type NextUpPreviewProps = {
  tasks: Task[];
  groups: TaskGroupWithTasks[];
  /** Shrink empty drop zone while an active focus session owns attention. */
  demoted?: boolean;
  /** Queue item awaiting switch-focus confirmation. */
  pendingTaskId?: string | null;
  onViewAll?: () => void;
  onHeaderClick?: () => void;
  /** When true, the open-panel control shows a close affordance. */
  queueOpen?: boolean;
  onStartFocus?: (task: Task) => void;
  onToggleComplete?: (task: Task) => void;
  onOpenTask?: (task: Task) => void;
  onMoveToTop?: (task: Task) => void;
  onMoveToEnd?: (task: Task) => void;
  onRemove?: (task: Task) => void;
  dropActive?: boolean;
  dropBeforeTaskId?: string | null;
  onExternalDragOver?: (taskId: string | null) => void;
  onExternalDrop?: (
    event: DragEvent<HTMLDivElement>,
    taskId: string | null,
  ) => void;
};

/** Time only, duration only, or start–end when both. */
function formatNextUpPreviewMeta(task: Task): string | null {
  const label = formatTaskFocusSchedule(task);
  return label === "—" ? null : label;
}

function NextUpPreviewRow({
  task,
  groups,
  position,
  selected = false,
  onOpenQueue,
  onStartFocus,
  onToggleComplete,
  onOpenTask,
  onMoveToTop,
  onMoveToEnd,
  onRemove,
  dropBefore,
  onExternalDragOver,
  onExternalDrop,
}: {
  task: Task;
  groups: TaskGroupWithTasks[];
  position: number;
  selected?: boolean;
  onOpenQueue?: () => void;
  onStartFocus?: (task: Task) => void;
  onToggleComplete?: (task: Task) => void;
  onOpenTask?: (task: Task) => void;
  onMoveToTop?: (task: Task) => void;
  onMoveToEnd?: (task: Task) => void;
  onRemove?: (task: Task) => void;
  dropBefore: boolean;
  onExternalDragOver?: () => void;
  onExternalDrop?: (event: DragEvent<HTMLDivElement>) => void;
}) {
  const [menuPoint, setMenuPoint] = useState<{ x: number; y: number } | null>(
    null,
  );
  const [rowActive, setRowActive] = useState(false);
  const group = groups.find((item) => item.id === task.group_id) ?? null;
  const appearance = group ? getTaskGroupAppearance(group) : null;
  const meta = formatNextUpPreviewMeta(task);
  const hasActions = Boolean(
    onStartFocus ||
      onToggleComplete ||
      onOpenTask ||
      onMoveToTop ||
      onMoveToEnd ||
      onRemove,
  );
  const showActions =
    hasActions && (selected || rowActive || menuPoint != null);

  const openMenu = (event: ReactMouseEvent<HTMLElement>) => {
    event.preventDefault();
    event.stopPropagation();
    const rect = event.currentTarget.getBoundingClientRect();
    setMenuPoint({ x: rect.left, y: rect.bottom + 4 });
  };

  const openContextMenu = (event: ReactMouseEvent<HTMLElement>) => {
    if (
      !onOpenTask &&
      !onMoveToTop &&
      !onMoveToEnd &&
      !onRemove &&
      !onStartFocus
    )
      return;
    event.preventDefault();
    event.stopPropagation();
    setMenuPoint({ x: event.clientX, y: event.clientY });
  };

  return (
    <div
      className="group/preview-row"
      onContextMenu={openContextMenu}
      onPointerEnter={() => setRowActive(true)}
      onPointerLeave={() => {
        if (!menuPoint) setRowActive(false);
      }}
      onDragOver={(event) => {
        event.preventDefault();
        event.stopPropagation();
        onExternalDragOver?.();
      }}
      onDrop={onExternalDrop}
    >
      {dropBefore ? <TaskBoardInsertLine className="mb-1" /> : null}
      <div
        role={onOpenQueue ? "button" : undefined}
        tabIndex={onOpenQueue ? 0 : undefined}
        onClick={onOpenQueue}
        onKeyDown={
          onOpenQueue
            ? (event) => {
                if (event.key === "Enter" || event.key === " ") {
                  event.preventDefault();
                  onOpenQueue();
                }
              }
            : undefined
        }
        className={cn(
          "flex w-full min-w-0 items-center gap-2 rounded-lg px-1 py-1.5 text-left transition-[background-color] duration-[180ms] ease-out",
          selected
            ? "bg-selected text-foreground"
            : "bg-transparent",
          onOpenQueue &&
            !selected &&
            "cursor-pointer hover:bg-surface-hover",
          onOpenQueue && selected && "cursor-pointer",
        )}
      >
        <span className="flow-queue-index" aria-hidden>
          {position}
        </span>
        <div className="flex min-w-0 flex-1 items-center gap-1.5">
          <span className="flow-type-title min-w-0 truncate text-[13px] leading-snug">
            {task.title}
          </span>
          {task.priority && normalizeTaskPriority(task.priority) !== "low" ? (
            <TaskPriorityFlagIcon
              priority={normalizeTaskPriority(task.priority)}
              className="size-3.5 shrink-0"
            />
          ) : null}
        </div>
        <div className="flex h-6 shrink-0 items-center justify-end gap-0.5">
          {showActions ? (
            <div
              className="flex items-center gap-0.5"
              data-no-row-click
              onClick={(event) => event.stopPropagation()}
            >
              {onToggleComplete ? (
                <button
                  type="button"
                  onClick={(event) => {
                    event.stopPropagation();
                    onToggleComplete(task);
                  }}
                  className="flex size-6 items-center justify-center rounded-md text-muted-foreground hover:bg-surface-hover hover:text-foreground"
                  aria-label={`Mark "${task.title}" complete`}
                  title="Complete task"
                >
                  <Check className="size-3.5" strokeWidth={2.25} aria-hidden />
                </button>
              ) : null}
              {onStartFocus ? (
                <button
                  type="button"
                  data-pending-focus-anchor=""
                  onClick={() => onStartFocus(task)}
                  className="flex size-6 items-center justify-center rounded-md text-muted-foreground hover:bg-surface-hover hover:text-foreground"
                  aria-label={`Start focus on ${task.title}`}
                  title="Start focus"
                >
                  <Play className="size-3.5" aria-hidden />
                </button>
              ) : null}
              {onOpenTask || onMoveToTop || onMoveToEnd || onRemove ? (
                <button
                  type="button"
                  onClick={openMenu}
                  className="flex size-6 items-center justify-center rounded-md text-muted-foreground hover:bg-surface-hover hover:text-foreground"
                  aria-label={`More actions for ${task.title}`}
                  title="More"
                >
                  <MoreHorizontal className="size-3.5" aria-hidden />
                </button>
              ) : null}
            </div>
          ) : (
            <div className="flow-meta-row">
              {group && appearance ? (
                <TaskGroupPill
                  icon={appearance.icon}
                  name={group.title}
                  appearance={appearance}
                  className="flow-meta-group max-w-24 shrink text-[11px]"
                />
              ) : null}
              {meta ? (
                <span className="flow-type-meta flow-meta-group shrink-0 text-[11px] tabular-nums">
                  {meta}
                </span>
              ) : null}
            </div>
          )}
        </div>
      </div>

      {menuPoint ? (
        <NextUpQueueMenu
          x={menuPoint.x}
          y={menuPoint.y}
          kind="task"
          onClose={() => {
            setMenuPoint(null);
            setRowActive(false);
          }}
          onStartFocus={() => onStartFocus?.(task)}
          onOpen={() => onOpenTask?.(task)}
          onMoveToTop={() => onMoveToTop?.(task)}
          onMoveToBottom={() => onMoveToEnd?.(task)}
          onRemove={() => onRemove?.(task)}
        />
      ) : null}
    </div>
  );
}

export function NextUpPreview({
  tasks,
  groups,
  demoted = false,
  pendingTaskId = null,
  onViewAll,
  onHeaderClick,
  queueOpen = false,
  onStartFocus,
  onToggleComplete,
  onOpenTask,
  onMoveToTop,
  onMoveToEnd,
  onRemove,
  dropActive = false,
  dropBeforeTaskId = null,
  onExternalDragOver,
  onExternalDrop,
}: NextUpPreviewProps) {
  const [expanded, setExpanded] = useState(false);
  const openQueue = onViewAll ?? onHeaderClick;
  const toggleQueue = onHeaderClick ?? onViewAll;
  const isEmpty = tasks.length === 0;
  const canTogglePreview = tasks.length > NEXT_UP_PREVIEW_CAP;

  useEffect(() => {
    if (tasks.length <= NEXT_UP_PREVIEW_CAP) setExpanded(false);
  }, [tasks.length]);

  const visibleCap = expanded
    ? NEXT_UP_PREVIEW_EXPANDED_CAP
    : NEXT_UP_PREVIEW_CAP;
  const visibleTasks = tasks.slice(0, visibleCap);
  const overflowCount = Math.max(0, tasks.length - visibleTasks.length);

  const handleOverflowClick = () => {
    if (!expanded && canTogglePreview) {
      setExpanded(true);
      return;
    }
    openQueue?.();
  };

  return (
    <div className="flex shrink-0 flex-col gap-2 pb-2 pt-5">
      <div className="flex items-center gap-2">
        <div className="min-w-0 flex-1">
          <button
            type="button"
            onClick={onHeaderClick}
            disabled={!onHeaderClick}
            className={cn(
              "flex min-w-0 items-baseline gap-2 text-left",
              onHeaderClick &&
                "hover:[&_.flow-section-label]:text-foreground",
            )}
          >
            <span className="flow-section-label truncate text-[11px] uppercase">
              Next Up
              {tasks.length > 0 ? (
                <span className="flow-section-count normal-case tracking-normal">
                  {" "}
                  ({tasks.length})
                </span>
              ) : null}
            </span>
          </button>
        </div>
        <div className="flex shrink-0 items-center gap-1 pr-0.5">
          {toggleQueue ? (
            <button
              type="button"
              onClick={toggleQueue}
              aria-expanded={queueOpen}
              aria-label={
                queueOpen
                  ? "Close Next Up queue"
                  : `Open Next Up queue${
                      tasks.length > 0 ? `, ${tasks.length} items` : ""
                    }`
              }
              title={queueOpen ? "Close queue" : "Open queue"}
              className="relative mr-1 flex size-6 items-center justify-center rounded-md text-foreground/80 transition-colors hover:bg-surface-hover hover:text-foreground"
            >
              <ListOrdered className="size-3.5" aria-hidden />
              {tasks.length > 0 ? (
                <span className="absolute -right-px -top-px flex h-3 min-w-3 items-center justify-center rounded-full bg-primary px-0.5 text-[8px] font-semibold leading-none tabular-nums text-primary-foreground">
                  {tasks.length > 9 ? "9+" : tasks.length}
                </span>
              ) : null}
            </button>
          ) : null}
          {canTogglePreview ? (
            <button
              type="button"
              onClick={() => setExpanded((current) => !current)}
              aria-expanded={expanded}
              aria-label={
                expanded
                  ? "Show one Next Up task"
                  : "Show up to three Next Up tasks"
              }
              className="flow-icon-quiet flex size-6 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-surface-hover hover:text-foreground"
            >
              {expanded ? (
                <ChevronUp className="size-3.5" aria-hidden />
              ) : (
                <ChevronDown className="size-3.5" aria-hidden />
              )}
            </button>
          ) : null}
        </div>
      </div>

      <div className="flex flex-col gap-1">
        {isEmpty ? (
          <div
            className={cn(
              "flex items-center justify-center rounded-md border border-dashed px-3 text-center text-[12px] transition-colors",
              demoted ? "min-h-9 py-1.5" : "min-h-10 py-2",
              dropActive
                ? "border-primary/60 bg-primary/10 text-foreground"
                : demoted
                  ? "border-border-subtle/70 bg-transparent text-muted-foreground/60"
                  : "border-border-subtle bg-transparent text-muted-foreground/85",
            )}
            onDragOver={(event) => {
              if (
                !isScheduleKindDrag(event) &&
                !isNextUpReorderDrag(event)
              ) {
                return;
              }
              event.preventDefault();
              event.stopPropagation();
              acceptNextUpScheduleDrag(event);
              onExternalDragOver?.(null);
            }}
            onDrop={(event) => {
              if (isNextUpReorderDrag(event)) return;
              event.preventDefault();
              event.stopPropagation();
              onExternalDrop?.(event, null);
            }}
          >
            {dropActive
              ? "Release to add to Next Up"
              : "Drop here for what’s next"}
          </div>
        ) : (
          <div className="space-y-0.5">
            {visibleTasks.map((task, index) => (
              <NextUpPreviewRow
                key={task.id}
                task={task}
                groups={groups}
                position={index + 1}
                selected={pendingTaskId === task.id}
                onOpenQueue={openQueue}
                onStartFocus={onStartFocus}
                onToggleComplete={onToggleComplete}
                onOpenTask={onOpenTask}
                onMoveToTop={onMoveToTop}
                onMoveToEnd={onMoveToEnd}
                onRemove={onRemove}
                dropBefore={
                  dropActive && !queueOpen && dropBeforeTaskId === task.id
                }
                onExternalDragOver={() => onExternalDragOver?.(task.id)}
                onExternalDrop={(event) => onExternalDrop?.(event, task.id)}
              />
            ))}
            {dropActive && !queueOpen && dropBeforeTaskId === null ? (
              <TaskBoardInsertLine className="mt-1" />
            ) : null}
          </div>
        )}

        {overflowCount > 0 ? (
          <button
            type="button"
            onClick={handleOverflowClick}
            className="flex w-full items-center gap-1 text-left text-[12px] text-muted-foreground/80 transition-colors hover:text-foreground"
          >
            <span>
              {expanded
                ? `View ${overflowCount} more in queue`
                : `View ${overflowCount} more`}
            </span>
            <ChevronDown className="size-3.5 opacity-70" aria-hidden />
          </button>
        ) : null}
      </div>
    </div>
  );
}
