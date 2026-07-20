"use client";

import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type CSSProperties,
  type MouseEvent as ReactMouseEvent,
} from "react";
import { createPortal } from "react-dom";
import {
  ArrowUpDown,
  CalendarClock,
  CalendarDays,
  Check,
  ExternalLink,
  MoreHorizontal,
  Pencil,
  SkipForward,
  Trash2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { TaskGroupPill } from "@/components/tasks/task-group-pill";
import { TaskPriorityFlagIcon } from "@/components/tasks/task-priority-flag-icon";
import { formatDurationCompact } from "@/lib/focus-utils";
import {
  getGroupEdgeColorVar,
  getTaskGroupAppearance,
} from "@/lib/task-group-appearance";
import { normalizeTaskPriority } from "@/lib/task-priority";
import { drawerWritingFieldClass } from "@/lib/theme/surface-classes";
import { cn } from "@/lib/utils";
import type { Task, TaskGroupWithTasks } from "@/types/task";

type CurrentTaskMenuProps = {
  x: number;
  y: number;
  hasQueueNext: boolean;
  onClose: () => void;
  onCompleteTask: () => void;
  onFocusNext: () => void;
  onMoveToQueueEnd: () => void;
  onOpenDetails: () => void;
  onMoveToTomorrow: () => void;
  onPlanLater: () => void;
  onDelete: () => void;
};

const MENU_ITEM_CLASS =
  "flex h-9 w-full items-center gap-2 whitespace-nowrap rounded-md px-2.5 text-left text-[13px] hover:bg-surface-hover";

export function CurrentTaskMenu({
  x,
  y,
  hasQueueNext,
  onClose,
  onCompleteTask,
  onFocusNext,
  onMoveToQueueEnd,
  onOpenDetails,
  onMoveToTomorrow,
  onPlanLater,
  onDelete,
}: CurrentTaskMenuProps) {
  if (typeof document === "undefined") return null;

  const run = (action: () => void) => {
    action();
    onClose();
  };

  const menuWidth = 220;
  // Approx height for clamp — rows + separators (Focus next optional).
  const menuHeight = hasQueueNext ? 320 : 284;

  return createPortal(
    <>
      <button
        type="button"
        className="fixed inset-0 z-[99] cursor-default bg-transparent"
        aria-label="Close Current Focus menu"
        onClick={onClose}
      />
      <div
        className="flow-surface-elevated fixed z-[100] w-[13.75rem] overflow-hidden rounded-lg p-0.5"
        style={{
          left: Math.min(x, window.innerWidth - menuWidth - 8),
          top: Math.min(y, window.innerHeight - menuHeight - 8),
        }}
        onClick={(event) => event.stopPropagation()}
      >
        <button
          type="button"
          className={MENU_ITEM_CLASS}
          onClick={() => run(onCompleteTask)}
        >
          <Check className="size-3.5 shrink-0 text-muted-foreground" />
          Complete task
        </button>
        {hasQueueNext ? (
          <button
            type="button"
            className={MENU_ITEM_CLASS}
            onClick={() => run(onFocusNext)}
          >
            <SkipForward className="size-3.5 shrink-0 text-muted-foreground" />
            Focus next item
          </button>
        ) : null}
        <div className="my-0.5 border-t border-border-subtle/70" />
        <button
          type="button"
          className={MENU_ITEM_CLASS}
          onClick={() => run(onMoveToQueueEnd)}
        >
          <ArrowUpDown className="size-3.5 shrink-0 text-muted-foreground" />
          Move to queue
        </button>
        <button
          type="button"
          className={MENU_ITEM_CLASS}
          onClick={() => run(onOpenDetails)}
        >
          <ExternalLink className="size-3.5 shrink-0 text-muted-foreground" />
          Open details
        </button>
        <div className="my-0.5 border-t border-border-subtle/70" />
        <button
          type="button"
          className={MENU_ITEM_CLASS}
          onClick={() => run(onMoveToTomorrow)}
        >
          <CalendarDays className="size-3.5 shrink-0 text-muted-foreground" />
          Move to tomorrow
        </button>
        <button
          type="button"
          className={MENU_ITEM_CLASS}
          onClick={() => run(onPlanLater)}
        >
          <CalendarClock className="size-3.5 shrink-0 text-muted-foreground" />
          Plan later
        </button>
        <div className="my-0.5 border-t border-border-subtle/70" />
        <button
          type="button"
          className={cn(MENU_ITEM_CLASS, "text-destructive hover:bg-destructive/10")}
          onClick={() => run(onDelete)}
        >
          <Trash2 className="size-3.5 shrink-0" />
          Delete
        </button>
      </div>
    </>,
    document.body,
  );
}

type FocusCurrentTaskCardProps = {
  task: Task | null;
  groups: TaskGroupWithTasks[];
  focusedSeconds: number;
  /** True while focus phase is running or paused (not idle / not break). */
  activeFocus?: boolean;
  /** Pause or break — quieter cue, no motion. */
  focusSoftened?: boolean;
  hasQueueNext?: boolean;
  onOpenTask: (task: Task) => void;
  onCompleteTask: (task: Task) => void;
  onFocusNext: () => void;
  onMoveToQueueEnd: (task: Task) => void;
  onMoveToTomorrow: (task: Task) => void;
  onPlanLater: (task: Task) => void;
  onDeleteTask: (task: Task) => void;
  onChooseFromQueue: () => void;
  onUpdateDescription?: (taskId: string, description: string | null) => void;
};

const currentFocusPrimaryClassName = cn(
  "flow-focus-current mt-4 mx-0 flex shrink-0 flex-col",
);

/** Collapsed preview ≈ 6 lines; expanded viewport ≈ 10 lines (then scroll). */
const descriptionPreviewMaxClassName = "max-h-[calc(13px*1.375*6)]";
const descriptionExpandedMaxClassName = "max-h-[calc(13px*1.375*10)]";

export function FocusCurrentTaskCard({
  task,
  groups,
  focusedSeconds,
  activeFocus = false,
  focusSoftened = false,
  hasQueueNext = false,
  onOpenTask,
  onCompleteTask,
  onFocusNext,
  onMoveToQueueEnd,
  onMoveToTomorrow,
  onPlanLater,
  onDeleteTask,
  onChooseFromQueue,
  onUpdateDescription,
}: FocusCurrentTaskCardProps) {
  const [menuPoint, setMenuPoint] = useState<{ x: number; y: number } | null>(
    null,
  );
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState("");
  const [descExpanded, setDescExpanded] = useState(false);
  const [descNeedsExpand, setDescNeedsExpand] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const descriptionRef = useRef<HTMLParagraphElement>(null);
  const editingTaskIdRef = useRef<string | null>(null);
  const savedDescription = task?.description?.trim() ?? "";
  const dirty = editing && draft !== savedDescription;

  const beginEdit = useCallback(() => {
    if (!task || !onUpdateDescription) return;
    editingTaskIdRef.current = task.id;
    setDraft(task.description ?? "");
    setEditing(true);
  }, [onUpdateDescription, task]);

  const cancelEdit = useCallback(() => {
    setEditing(false);
    setDraft("");
    editingTaskIdRef.current = null;
  }, []);

  const saveEdit = useCallback(() => {
    if (!task || !onUpdateDescription) return;
    const next = draft.trim() || null;
    const current = task.description?.trim() || null;
    if (next !== current) {
      onUpdateDescription(task.id, next);
    }
    setEditing(false);
    setDraft("");
    editingTaskIdRef.current = null;
  }, [draft, onUpdateDescription, task]);

  useEffect(() => {
    if (!editing) return;
    textareaRef.current?.focus();
    const el = textareaRef.current;
    if (el) {
      el.setSelectionRange(el.value.length, el.value.length);
    }
  }, [editing]);

  useEffect(() => {
    if (!dirty) return;
    const onBeforeUnload = (event: BeforeUnloadEvent) => {
      event.preventDefault();
      event.returnValue = "";
    };
    window.addEventListener("beforeunload", onBeforeUnload);
    return () => window.removeEventListener("beforeunload", onBeforeUnload);
  }, [dirty]);

  useEffect(() => {
    if (!task) {
      if (editing) cancelEdit();
      return;
    }
    if (!editing) return;
    if (editingTaskIdRef.current === task.id) return;

    const previousTaskId = editingTaskIdRef.current;
    if (dirty && previousTaskId && onUpdateDescription) {
      const shouldSave = window.confirm(
        "You have unsaved description changes. Save them before switching?",
      );
      if (shouldSave) {
        onUpdateDescription(previousTaskId, draft.trim() || null);
      }
    }
    cancelEdit();
  }, [cancelEdit, dirty, draft, editing, onUpdateDescription, task]);

  useEffect(() => {
    setDescExpanded(false);
  }, [task?.id]);

  useEffect(() => {
    const hasDesc = savedDescription.length > 0;
    if (!hasDesc || editing || descExpanded) {
      setDescNeedsExpand(false);
      return;
    }
    const el = descriptionRef.current;
    if (!el) return;
    const measure = () => {
      setDescNeedsExpand(el.scrollHeight > el.clientHeight + 1);
    };
    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(el);
    return () => observer.disconnect();
  }, [descExpanded, editing, savedDescription]);

  if (!task) {
    return (
      <section
        className={cn(currentFocusPrimaryClassName, "px-3 py-2.5 text-left")}
        data-active-focus="false"
      >
        <div className="flex flex-wrap items-center justify-between gap-2">
          <p className="flow-type-meta text-[13px]">
            Select a task to track focused time.
          </p>
          <Button
            type="button"
            variant="outline"
            size="sm"
            className="h-7 px-2.5 text-[12px]"
            onClick={onChooseFromQueue}
          >
            Choose from Next Up
          </Button>
        </div>
      </section>
    );
  }

  const group = groups.find((item) => item.id === task.group_id) ?? null;
  const appearance = group ? getTaskGroupAppearance(group) : null;
  const priority = normalizeTaskPriority(task.priority);
  const focusEdgeColor = appearance
    ? getGroupEdgeColorVar(appearance.colorKey)
    : "var(--chart-1)";
  const targetDurationSeconds =
    task.duration_minutes === null ? null : task.duration_minutes * 60;
  const description = savedDescription;
  const hasDescription = description.length > 0;
  const canEdit = Boolean(onUpdateDescription);

  const handleContextMenu = (event: ReactMouseEvent<HTMLElement>) => {
    event.preventDefault();
    setMenuPoint({ x: event.clientX, y: event.clientY });
  };

  return (
    <>
      <section
        className={cn(
          currentFocusPrimaryClassName,
          "group/focus-card",
          activeFocus && "timeline-task-in-focus",
          (hasDescription || editing) &&
            cn(
              "overflow-hidden",
              editing
                ? "max-h-[318px]"
                : descExpanded
                  ? "max-h-[300px]"
                  : "max-h-[190px]",
            ),
        )}
        data-active-focus={activeFocus ? "true" : "false"}
        data-focus-softened={focusSoftened ? "true" : undefined}
        data-focus-compact={
          !hasDescription && !editing ? "true" : undefined
        }
        style={
          activeFocus
            ? ({ "--focus-edge-color": focusEdgeColor } as CSSProperties)
            : undefined
        }
        onContextMenu={handleContextMenu}
      >
        <div
          className={cn(
            "relative shrink-0 px-3",
            hasDescription || editing ? "pb-1.5 pt-2.5" : "pt-2.5 pb-4",
          )}
        >
          <div className="flex min-w-0 flex-col gap-2">
            <div className="flex min-w-0 items-center gap-2">
              <div className="flex min-w-0 flex-1 items-center gap-1.5">
                <p className="flow-focus-current-title min-w-0 truncate text-[15px] leading-none">
                  {task.title}
                </p>
                {!activeFocus && task.priority && priority !== "low" ? (
                  <TaskPriorityFlagIcon
                    priority={priority}
                    className="size-3.5 shrink-0"
                  />
                ) : null}
                {group && appearance ? (
                  <TaskGroupPill
                    icon={appearance.icon}
                    name={group.title}
                    appearance={appearance}
                    showDot={false}
                    className="max-w-32 shrink-0 text-[11px]"
                  />
                ) : null}
              </div>
              <div
                className={cn(
                  "flex shrink-0 items-center gap-0.5 transition-opacity duration-[180ms] ease-out",
                  !hasDescription && !editing &&
                    "absolute top-1/2 right-3 -translate-y-1/2",
                  menuPoint
                    ? "opacity-100"
                    : "opacity-0 group-hover/focus-card:opacity-100 focus-within:opacity-100",
                )}
              >
                <button
                  type="button"
                  onClick={() => onCompleteTask(task)}
                  className="flex size-6 items-center justify-center rounded-md text-muted-foreground hover:bg-surface-hover hover:text-foreground"
                  aria-label={`Complete ${task.title}`}
                  title="Complete task"
                >
                  <Check className="size-3.5" aria-hidden />
                </button>
                {hasQueueNext ? (
                  <button
                    type="button"
                    onClick={() => onFocusNext()}
                    className="flex size-6 items-center justify-center rounded-md text-muted-foreground hover:bg-surface-hover hover:text-foreground"
                    aria-label="Focus next item"
                    title="Focus next item"
                  >
                    <SkipForward className="size-3.5" aria-hidden />
                  </button>
                ) : null}
                <button
                  type="button"
                  onClick={() => onOpenTask(task)}
                  className="flex size-6 items-center justify-center rounded-md text-muted-foreground hover:bg-surface-hover hover:text-foreground"
                  aria-label={`Open details for ${task.title}`}
                  title="Task details"
                >
                  <ExternalLink className="size-3.5" aria-hidden />
                </button>
                <button
                  type="button"
                  onClick={(event) => {
                    const rect = event.currentTarget.getBoundingClientRect();
                    setMenuPoint({ x: rect.left, y: rect.bottom + 4 });
                  }}
                  className="flex size-6 items-center justify-center rounded-md text-muted-foreground hover:bg-surface-hover hover:text-foreground"
                  aria-label={`More actions for ${task.title}`}
                  title="More"
                >
                  <MoreHorizontal className="size-3.5" aria-hidden />
                </button>
              </div>
            </div>

            <div className="flow-focus-current-meta text-[11px] leading-none">
              <span>
                Focused{" "}
                <span className="tabular-nums">
                  {formatDurationCompact(focusedSeconds)}
                </span>
              </span>
              <span className="mx-1 text-current/45" aria-hidden>
                ·
              </span>
              <span className="flow-focus-current-goal">
                Goal{" "}
                <span className="tabular-nums">
                  {targetDurationSeconds === null
                    ? "—"
                    : formatDurationCompact(targetDurationSeconds)}
                </span>
              </span>
            </div>
          </div>
        </div>

        {editing ? (
          <div className="group/desc flex min-h-0 flex-1 flex-col overflow-hidden border-t border-border-subtle/50 px-3 pb-1.5 pt-1">
            <div className="flex shrink-0 items-center justify-between gap-2">
              <p className="flow-type-label text-[11px]">Description</p>
              <div className="flex items-center gap-1">
                <Button
                  type="button"
                  size="sm"
                  variant="ghost"
                  className="h-6 px-2 text-[11px]"
                  onClick={cancelEdit}
                >
                  Cancel
                </Button>
                <Button
                  type="button"
                  size="sm"
                  className="h-6 px-2 text-[11px]"
                  onClick={saveEdit}
                >
                  Save
                </Button>
              </div>
            </div>
            <Textarea
              ref={textareaRef}
              value={draft}
              onChange={(event) => setDraft(event.target.value)}
              onKeyDown={(event) => {
                if (event.key === "Escape") {
                  event.preventDefault();
                  cancelEdit();
                  return;
                }
                if (event.key === "Enter" && (event.metaKey || event.ctrlKey)) {
                  event.preventDefault();
                  saveEdit();
                }
              }}
              rows={3}
              placeholder="Add notes for this focus…"
              className={cn(
                "mt-1 min-h-0 flex-1 resize-none overflow-y-auto field-sizing-fixed scrollbar-subtle",
                drawerWritingFieldClass,
              )}
            />
          </div>
        ) : hasDescription ? (
          <div className="group/desc flex min-h-0 flex-1 flex-col overflow-hidden border-t border-border-subtle/50 px-3 pb-2 pt-1.5">
            <div className="flex shrink-0 items-center justify-between gap-2">
              <p className="flow-type-label text-[11px]">
                Description
              </p>
              {canEdit ? (
                <button
                  type="button"
                  onClick={beginEdit}
                  className="inline-flex items-center gap-1 rounded-md px-1.5 py-0.5 text-[11px] font-medium text-muted-foreground opacity-0 transition-opacity hover:bg-surface-hover hover:text-foreground group-hover/desc:opacity-100 focus-visible:opacity-100"
                  aria-label="Edit description"
                >
                  <Pencil className="size-3" aria-hidden />
                  Edit
                </button>
              ) : null}
            </div>
            <p
              ref={descriptionRef}
              className={cn(
                "mt-0.5 min-h-0 overflow-y-auto overscroll-contain whitespace-pre-wrap text-[13px] leading-snug text-foreground/85 scrollbar-subtle",
                descExpanded
                  ? descriptionExpandedMaxClassName
                  : descriptionPreviewMaxClassName,
              )}
            >
              {description}
            </p>
            {descNeedsExpand || descExpanded ? (
              <button
                type="button"
                onClick={() => setDescExpanded((current) => !current)}
                className="mt-0.5 shrink-0 self-start text-[12px] font-medium text-muted-foreground transition-colors hover:text-foreground"
              >
                {descExpanded ? "Show less" : "Show more"}
              </button>
            ) : null}
          </div>
        ) : null}
      </section>

      {menuPoint ? (
        <CurrentTaskMenu
          x={menuPoint.x}
          y={menuPoint.y}
          hasQueueNext={hasQueueNext}
          onClose={() => setMenuPoint(null)}
          onCompleteTask={() => onCompleteTask(task)}
          onFocusNext={onFocusNext}
          onMoveToQueueEnd={() => onMoveToQueueEnd(task)}
          onOpenDetails={() => onOpenTask(task)}
          onMoveToTomorrow={() => onMoveToTomorrow(task)}
          onPlanLater={() => onPlanLater(task)}
          onDelete={() => onDeleteTask(task)}
        />
      ) : null}
    </>
  );
}
