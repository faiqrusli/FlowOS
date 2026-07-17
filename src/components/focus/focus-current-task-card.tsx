"use client";

import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type MouseEvent as ReactMouseEvent,
} from "react";
import { createPortal } from "react-dom";
import {
  ArrowDownToLine,
  Check,
  ExternalLink,
  MoreHorizontal,
  Pencil,
  SkipForward,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { TaskGroupPill } from "@/components/tasks/task-group-pill";
import { TaskPriorityFlagIcon } from "@/components/tasks/task-priority-flag-icon";
import { formatDurationCompact } from "@/lib/focus-utils";
import { getTaskGroupAppearance } from "@/lib/task-group-appearance";
import { normalizeTaskPriority } from "@/lib/task-priority";
import { drawerWritingFieldClass } from "@/lib/theme/surface-classes";
import { cn } from "@/lib/utils";
import type { Task, TaskGroupWithTasks } from "@/types/task";

type CurrentTaskMenuProps = {
  x: number;
  y: number;
  hasQueueNext: boolean;
  hasDescription?: boolean;
  onClose: () => void;
  onCompleteTask: () => void;
  onFocusNext: () => void;
  onMoveToQueueEnd: () => void;
  onOpenDetails: () => void;
  onEditDescription?: () => void;
};

export function CurrentTaskMenu({
  x,
  y,
  hasQueueNext,
  hasDescription = false,
  onClose,
  onCompleteTask,
  onFocusNext,
  onMoveToQueueEnd,
  onOpenDetails,
  onEditDescription,
}: CurrentTaskMenuProps) {
  if (typeof document === "undefined") return null;

  const run = (action: () => void) => {
    action();
    onClose();
  };

  const menuWidth = 240;
  const menuHeight = onEditDescription ? 208 : 168;

  return createPortal(
    <>
      <button
        type="button"
        className="fixed inset-0 z-[99] cursor-default bg-transparent"
        aria-label="Close Current Focus menu"
        onClick={onClose}
      />
      <div
        className="flow-surface-elevated fixed z-[100] w-[240px] overflow-hidden rounded-lg p-0.5"
        style={{
          left: Math.min(x, window.innerWidth - menuWidth - 8),
          top: Math.min(y, window.innerHeight - menuHeight - 8),
        }}
        onClick={(event) => event.stopPropagation()}
      >
        <button
          type="button"
          className="flex h-9 w-full items-center gap-2 rounded-md px-2.5 text-left text-[13px] hover:bg-surface-hover"
          onClick={() => run(onCompleteTask)}
        >
          <Check className="size-3.5 shrink-0 text-muted-foreground" />
          Complete task
        </button>
        {hasQueueNext ? (
          <button
            type="button"
            className="flex h-9 w-full items-center gap-2 rounded-md px-2.5 text-left text-[13px] hover:bg-surface-hover"
            onClick={() => run(onFocusNext)}
          >
            <SkipForward className="size-3.5 shrink-0 text-muted-foreground" />
            Focus next item
          </button>
        ) : null}
        <div className="my-0.5 border-t border-border-subtle/70" />
        <button
          type="button"
          className="flex h-9 w-full items-center gap-2 rounded-md px-2.5 text-left text-[13px] hover:bg-surface-hover"
          onClick={() => run(onMoveToQueueEnd)}
        >
          <ArrowDownToLine className="size-3.5 shrink-0 text-muted-foreground" />
          Move to queue
        </button>
        {onEditDescription ? (
          <button
            type="button"
            className="flex h-9 w-full items-center gap-2 rounded-md px-2.5 text-left text-[13px] hover:bg-surface-hover"
            onClick={() => run(onEditDescription)}
          >
            <Pencil className="size-3.5 shrink-0 text-muted-foreground" />
            {hasDescription ? "Edit description" : "Add description"}
          </button>
        ) : null}
        <button
          type="button"
          className="flex h-9 w-full items-center gap-2 rounded-md px-2.5 text-left text-[13px] hover:bg-surface-hover"
          onClick={() => run(onOpenDetails)}
        >
          <ExternalLink className="size-3.5 shrink-0 text-muted-foreground" />
          Open task details
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
  hasQueueNext?: boolean;
  onOpenTask: (task: Task) => void;
  onCompleteTask: (task: Task) => void;
  onFocusNext: () => void;
  onMoveToQueueEnd: (task: Task) => void;
  onChooseFromQueue: () => void;
  onUpdateDescription?: (taskId: string, description: string | null) => void;
};

const currentFocusCardShellClassName = cn(
  "mt-4 flex shrink-0 flex-col overflow-hidden rounded-lg",
  "border border-border-subtle/55 bg-surface-raised",
);

/** Collapsed preview ≈ 6 lines; expanded viewport ≈ 10 lines (then scroll). */
const descriptionPreviewMaxClassName = "max-h-[calc(13px*1.375*6)]";
const descriptionExpandedMaxClassName = "max-h-[calc(13px*1.375*10)]";
/** Weaker than outer card border — only between identity and content. */
const descriptionSectionDividerClassName = "border-t border-border-subtle/35";

export function FocusCurrentTaskCard({
  task,
  groups,
  focusedSeconds,
  hasQueueNext = false,
  onOpenTask,
  onCompleteTask,
  onFocusNext,
  onMoveToQueueEnd,
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
  }, [task?.id, savedDescription]);

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
      <section className="mt-4 shrink-0 rounded-lg border border-border-subtle/55 bg-surface-raised px-3 py-2.5 text-left">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <p className="text-[13px] text-muted-foreground">
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
          currentFocusCardShellClassName,
          (hasDescription || editing) &&
            (descExpanded ? "max-h-[320px]" : "max-h-[210px]"),
        )}
        onContextMenu={handleContextMenu}
      >
        <div
          className={cn(
            "shrink-0 px-3 pt-2.5",
            hasDescription || editing ? "pb-2" : "pb-5",
          )}
        >
          <div className="flex min-w-0 items-center gap-2">
            <div className="flex min-w-0 flex-1 items-center gap-1.5">
              <p className="truncate text-[18px] font-semibold leading-snug text-foreground">
                {task.title}
              </p>
              {task.priority && priority !== "low" ? (
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
                  className="max-w-32 shrink-0 text-[11px]"
                />
              ) : null}
            </div>
            <div className="flex shrink-0 items-center gap-0.5">
              <button
                type="button"
                onClick={() => onOpenTask(task)}
                className="flex size-7 items-center justify-center rounded-md text-muted-foreground hover:bg-surface-hover hover:text-foreground"
                aria-label={`Open details for ${task.title}`}
                title="Task details"
              >
                <ExternalLink className="size-3.5" />
              </button>
              <button
                type="button"
                onClick={(event) => {
                  const rect = event.currentTarget.getBoundingClientRect();
                  setMenuPoint({ x: rect.left, y: rect.bottom + 4 });
                }}
                className="flex size-7 items-center justify-center rounded-md text-muted-foreground hover:bg-surface-hover hover:text-foreground"
                aria-label={`More actions for ${task.title}`}
              >
                <MoreHorizontal className="size-4" />
              </button>
            </div>
          </div>

          <div className="mt-1 flex flex-wrap items-center gap-x-2 gap-y-1 text-[12px] text-muted-foreground">
            <span>
              Focused{" "}
              <span className="tabular-nums">
                {formatDurationCompact(focusedSeconds)}
              </span>
            </span>
            <span aria-hidden>·</span>
            <span>
              Goal{" "}
              <span className="tabular-nums">
                {targetDurationSeconds === null
                  ? "—"
                  : formatDurationCompact(targetDurationSeconds)}
              </span>
            </span>
          </div>
        </div>

        {editing ? (
          <div
            className={cn(
              "group/desc flex min-h-0 flex-1 flex-col overflow-hidden px-3 py-2",
              descriptionSectionDividerClassName,
            )}
          >
            <p className="shrink-0 text-[11px] font-medium text-muted-foreground">
              Description
            </p>
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
              rows={6}
              placeholder="Add notes for this focus…"
              className={cn(
                "mt-1.5 resize-none overflow-y-auto scrollbar-subtle",
                descriptionPreviewMaxClassName,
                drawerWritingFieldClass,
              )}
            />
            <div className="mt-2 flex shrink-0 justify-end gap-1.5">
              <Button
                type="button"
                size="sm"
                variant="ghost"
                className="h-7 px-2.5 text-[12px]"
                onClick={cancelEdit}
              >
                Cancel
              </Button>
              <Button
                type="button"
                size="sm"
                className="h-7 px-2.5 text-[12px]"
                onClick={saveEdit}
              >
                Save
              </Button>
            </div>
          </div>
        ) : hasDescription ? (
          <div
            className={cn(
              "group/desc flex min-h-0 flex-1 flex-col overflow-hidden px-3 py-2",
              descriptionSectionDividerClassName,
            )}
          >
            <div className="flex shrink-0 items-center justify-between gap-2">
              <p className="text-[11px] font-medium text-muted-foreground">
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
                className="mt-1 shrink-0 self-start text-[12px] font-medium text-muted-foreground transition-colors hover:text-foreground"
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
          hasDescription={hasDescription}
          onClose={() => setMenuPoint(null)}
          onCompleteTask={() => onCompleteTask(task)}
          onFocusNext={onFocusNext}
          onMoveToQueueEnd={() => onMoveToQueueEnd(task)}
          onOpenDetails={() => onOpenTask(task)}
          onEditDescription={canEdit ? beginEdit : undefined}
        />
      ) : null}
    </>
  );
}
