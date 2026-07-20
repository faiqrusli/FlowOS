"use client";

import {
  useEffect,
  useLayoutEffect,
  useState,
  type DragEvent,
  type MouseEvent as ReactMouseEvent,
  type WheelEvent as ReactWheelEvent,
} from "react";
import { createPortal } from "react-dom";
import {
  Check,
  ListOrdered,
  MoreHorizontal,
  Plus,
  SkipForward,
  X,
} from "lucide-react";
import { CurrentTaskMenu } from "@/components/focus/focus-current-task-card";
import { NextUpContinueSection } from "@/components/focus/next-up-continue-section";
import {
  NextUpQueueList,
  buildNextUpListEntries,
  type NextUpListEntry,
} from "@/components/focus/next-up-queue-list";
import {
  acceptNextUpScheduleDrag,
  isNextUpReorderDrag,
  isScheduleKindDrag,
} from "@/lib/next-up-drag";
import type { UnifiedQueueKey } from "@/lib/next-up-unified-order";
import {
  WORKPLACE_DOCK_POPUP_GAP_PX,
  WORKPLACE_MODULE_OVERLAY_MIN_HEIGHT_PX,
  WORKPLACE_NEXT_UP_OVERLAY_TOP_INSET_PX,
  WORKPLACE_NEXT_UP_OVERLAY_WIDTH_CSS,
  type WorkplaceQueueLayoutMode,
} from "@/lib/workplace-layout";
import { getHabitDurationMinutes } from "@/lib/schedule-durations";
import { cn } from "@/lib/utils";
import type { Habit } from "@/types/habit";
import type { Task, TaskGroupWithTasks } from "@/types/task";

type NextUpDrawerProps = {
  entries: NextUpListEntry[];
  groups: TaskGroupWithTasks[];
  currentTask: Task | null;
  open: boolean;
  /** @deprecated Queue is always mid overlay — ignored. */
  layoutMode?: WorkplaceQueueLayoutMode;
  /** @deprecated Prefer layoutMode — ignored. */
  overlayMode?: boolean;
  fetchError?: string | null;
  hasQueueNext?: boolean;
  /** @deprecated Rail launcher removed — Next Up preview opens the queue. */
  onOpen?: () => void;
  onClose: () => void;
  onStartFocusTask: (task: Task) => void;
  onStartFocusHabit: (habit: Habit) => void;
  onOpenTask: (task: Task) => void;
  onOpenHabit: (habit: Habit) => void;
  onRemoveTask: (id: string) => void;
  onRemoveHabit: (habitId: string) => void;
  onReorder: (fromIndex: number, toIndex: number) => void;
  onToggleComplete: (task: Task) => void;
  onToggleHabitComplete?: (habit: Habit) => void;
  onClearAll?: () => void;
  onCompleteCurrentTask?: (task: Task) => void;
  onFocusNext?: () => void;
  onMoveCurrentToQueueEnd?: (task: Task) => void;
  onMoveCurrentToTomorrow?: (task: Task) => void;
  onPlanLaterCurrent?: (task: Task) => void;
  onDeleteCurrentTask?: (task: Task) => void;
  /** Auto Continue section — tasks focused today, unfinished, not Now / not queued. */
  continueTasks?: Task[];
  continueFocusSecondsByTaskId?: Record<string, number>;
  onAddContinueToQueue?: (task: Task) => void;
  /** Drop on NOW to start or switch focus (not queue insert). */
  onNowDrop?: (event: DragEvent) => void;
  listRef?: React.RefObject<HTMLDivElement | null>;
  onListScroll?: () => void;
  dropZoneActive?: boolean;
  dropInsertPosition?: number;
  onDropZoneDrop?: (event: DragEvent) => void;
  externalDropBeforeKey?: UnifiedQueueKey | null;
  onExternalDragOver?: (beforeKey: UnifiedQueueKey | null) => void;
  onExternalDrop?: (
    event: DragEvent,
    beforeKey: UnifiedQueueKey | null,
  ) => void;
  className?: string;
};

function queueDurationLabel(entries: NextUpListEntry[]): string | null {
  let known = 0;
  let unknown = 0;
  for (const entry of entries) {
    if (entry.kind === "task") {
      const minutes = entry.task.duration_minutes;
      if (minutes != null && minutes > 0) known += minutes;
      else unknown += 1;
    } else {
      const minutes = getHabitDurationMinutes(entry.habit.id);
      if (minutes > 0) known += minutes;
      else unknown += 1;
    }
  }
  if (known <= 0) return null;
  const formatted =
    known < 60
      ? `${known}m`
      : known % 60 === 0
        ? `${known / 60}h`
        : `${Math.floor(known / 60)}h ${known % 60}m`;
  if (unknown > 0) return `${formatted}+ planned`;
  return `${formatted} planned`;
}

export function NextUpDrawer({
  entries,
  groups,
  currentTask,
  open,
  fetchError = null,
  hasQueueNext = false,
  onClose,
  onStartFocusTask,
  onStartFocusHabit,
  onOpenTask,
  onOpenHabit,
  onRemoveTask,
  onRemoveHabit,
  onReorder,
  onToggleComplete,
  onToggleHabitComplete,
  onClearAll,
  onCompleteCurrentTask,
  onFocusNext,
  onMoveCurrentToQueueEnd,
  onMoveCurrentToTomorrow,
  onPlanLaterCurrent,
  onDeleteCurrentTask,
  continueTasks = [],
  continueFocusSecondsByTaskId = {},
  onAddContinueToQueue,
  onNowDrop,
  listRef,
  onListScroll,
  dropZoneActive = false,
  dropInsertPosition,
  onDropZoneDrop,
  externalDropBeforeKey = null,
  onExternalDragOver,
  onExternalDrop,
  className,
}: NextUpDrawerProps) {
  const [nowMenuPoint, setNowMenuPoint] = useState<{
    x: number;
    y: number;
  } | null>(null);
  const [nowDropHover, setNowDropHover] = useState(false);
  /** True only while pointer is over the Next Up list/footer — not NOW / outside. */
  const [queueDropHover, setQueueDropHover] = useState(false);
  /** Same dock float root as Tasks/Habits — guarantees one shared bottom edge. */
  const [dockFloatRoot, setDockFloatRoot] = useState<HTMLElement | null>(null);
  /** Stretch from Focus canvas top down to the shared dock gap. */
  const [overlayHeightPx, setOverlayHeightPx] = useState(
    WORKPLACE_MODULE_OVERLAY_MIN_HEIGHT_PX,
  );

  useLayoutEffect(() => {
    if (!open) {
      setDockFloatRoot(null);
      return;
    }
    setDockFloatRoot(
      document.querySelector<HTMLElement>("[data-workplace-dock-float-root]"),
    );
  }, [open]);

  useLayoutEffect(() => {
    if (!open || !dockFloatRoot) return;

    const measure = () => {
      const shell = document.querySelector<HTMLElement>("[data-focus-shell]");
      if (!shell) return;
      const shellTop = shell.getBoundingClientRect().top;
      const panelBottom =
        dockFloatRoot.getBoundingClientRect().top - WORKPLACE_DOCK_POPUP_GAP_PX;
      const next = Math.floor(
        panelBottom - shellTop - WORKPLACE_NEXT_UP_OVERLAY_TOP_INSET_PX,
      );
      setOverlayHeightPx(Math.max(WORKPLACE_MODULE_OVERLAY_MIN_HEIGHT_PX, next));
    };

    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(dockFloatRoot);
    const shell = document.querySelector("[data-focus-shell]");
    if (shell) observer.observe(shell);
    window.addEventListener("resize", measure);
    return () => {
      observer.disconnect();
      window.removeEventListener("resize", measure);
    };
  }, [open, dockFloatRoot]);

  useEffect(() => {
    if (!dropZoneActive) {
      setNowDropHover(false);
      setQueueDropHover(false);
    }
  }, [dropZoneActive]);

  // Queue is always a mid overlay over Focus (no rail / inline column).
  const floats = open;

  // Click Focus chrome (not Timeline / dock) closes overlay Queue — no full-screen
  // scrim, so mouse/trackpad can still pan the Today canvas horizontally.
  useEffect(() => {
    if (!floats) return;
    const onPointerDown = (event: PointerEvent) => {
      const target = event.target;
      if (!(target instanceof Element)) return;
      if (target.closest("[data-next-up-panel]")) return;
      if (target.closest("[data-timeline-shell]")) return;
      if (target.closest(".workplace-dock-launcher")) return;
      if (target.closest(".workplace-dock-popup")) return;
      if (!target.closest("[data-focus-shell]")) return;
      onClose();
    };
    document.addEventListener("pointerdown", onPointerDown, true);
    return () =>
      document.removeEventListener("pointerdown", onPointerDown, true);
  }, [floats, onClose]);

  const forwardHorizontalWheelToCanvas = (
    event: ReactWheelEvent<HTMLElement>,
  ) => {
    const dx =
      event.deltaX !== 0 ? event.deltaX : event.shiftKey ? event.deltaY : 0;
    if (dx === 0) return;
    const canvas = document.querySelector<HTMLElement>(
      "[data-workplace-canvas-scroll]",
    );
    if (!canvas || canvas.scrollWidth <= canvas.clientWidth + 1) return;
    event.preventDefault();
    canvas.scrollLeft += dx;
  };

  const showQueueInsertPreview = dropZoneActive && queueDropHover && !nowDropHover;

  const markQueueDropHover = (event: DragEvent) => {
    if (!isScheduleKindDrag(event) && !isNextUpReorderDrag(event)) return;
    event.preventDefault();
    setQueueDropHover(true);
  };

  const clearQueueDropHoverIfLeft = (
    event: DragEvent<HTMLDivElement>,
  ) => {
    const next = event.relatedTarget;
    if (next instanceof Node && event.currentTarget.contains(next)) return;
    setQueueDropHover(false);
  };

  const totalCount = entries.length;
  const durationLabel = queueDurationLabel(entries);
  const insertPosition = dropInsertPosition ?? totalCount + 1;

  if (!open) return null;

  const panel = (
    <aside
      data-next-up-panel
      role="complementary"
      aria-label="Next Up queue"
      onWheel={forwardHorizontalWheelToCanvas}
      className={cn(
        "flex min-h-0 flex-col overflow-hidden text-foreground",
        /* Same anchor as Tasks/Habits: bottom-full of dock float root + gap. */
        "flow-floating-overlay workplace-next-up-overlay absolute bottom-full right-0 z-40 min-w-[356px] max-w-[412px]",
        className,
      )}
      style={{
        width: WORKPLACE_NEXT_UP_OVERLAY_WIDTH_CSS,
        marginBottom: WORKPLACE_DOCK_POPUP_GAP_PX,
        height: overlayHeightPx,
      }}
    >
      <div className="flex shrink-0 items-center justify-between gap-1.5 px-3 py-2">
        <div className="min-w-0">
          <div className="flex items-center gap-1.5">
            <ListOrdered
              className="size-3.5 shrink-0 text-muted-foreground"
              aria-hidden
            />
            <h3 className="truncate text-[11px] font-semibold uppercase tracking-wide text-foreground/90">
              Next Up Queue
            </h3>
          </div>
          {fetchError ? (
            <p className="mt-1 text-[11px] text-destructive">{fetchError}</p>
          ) : null}
        </div>
        <button
          type="button"
          onClick={onClose}
          aria-label="Close Next Up queue"
          title="Close Next Up queue"
          className="flex size-7 shrink-0 items-center justify-center rounded-md text-muted-foreground hover:bg-surface-hover hover:text-foreground"
        >
          <X className="size-3.5" aria-hidden />
        </button>
      </div>

      {currentTask || (dropZoneActive && onNowDrop) ? (
        <div className="shrink-0 px-2.5 py-2">
          {dropZoneActive && onNowDrop ? (
            <div
              className={cn(
                "flex flex-col items-center justify-center gap-1 rounded-lg border border-dashed px-2 py-3 text-center transition-colors",
                nowDropHover
                  ? "cursor-copy border-primary bg-primary/10 text-foreground"
                  : "cursor-copy border-border-subtle/60 bg-surface-canvas/20 text-muted-foreground",
              )}
              title={
                currentTask
                  ? `Replaces “${currentTask.title}”`
                  : "Begin focusing this task now"
              }
              onContextMenu={
                currentTask
                  ? (event: ReactMouseEvent<HTMLDivElement>) => {
                      event.preventDefault();
                      setNowMenuPoint({ x: event.clientX, y: event.clientY });
                    }
                  : undefined
              }
              onDragEnter={(event) => {
                if (!isScheduleKindDrag(event) || isNextUpReorderDrag(event))
                  return;
                event.preventDefault();
                event.stopPropagation();
                setQueueDropHover(false);
                setNowDropHover(true);
              }}
              onDragOver={(event) => {
                if (!isScheduleKindDrag(event) || isNextUpReorderDrag(event))
                  return;
                event.preventDefault();
                event.stopPropagation();
                acceptNextUpScheduleDrag(event);
                setQueueDropHover(false);
                setNowDropHover(true);
              }}
              onDragLeave={(event) => {
                const next = event.relatedTarget;
                if (next instanceof Node && event.currentTarget.contains(next)) {
                  return;
                }
                setNowDropHover(false);
              }}
              onDrop={(event) => {
                if (isNextUpReorderDrag(event)) return;
                event.preventDefault();
                event.stopPropagation();
                setNowDropHover(false);
                setQueueDropHover(false);
                onNowDrop(event);
              }}
            >
              <Plus
                className={cn(
                  "size-3.5",
                  nowDropHover ? "text-primary" : "text-muted-foreground/70",
                )}
                aria-hidden
              />
              <span className="text-[11px] font-medium leading-snug">
                {currentTask
                  ? "Drop to switch focus"
                  : "Drop to start focus"}
              </span>
            </div>
          ) : currentTask ? (
            <div
              className="group/now-card flex items-center gap-2 rounded-lg border-0 bg-surface-7 px-2 py-1.5 shadow-none transition-[background-color] duration-[180ms] ease-out hover:bg-surface-8"
              onContextMenu={(event: ReactMouseEvent<HTMLDivElement>) => {
                event.preventDefault();
                setNowMenuPoint({ x: event.clientX, y: event.clientY });
              }}
            >
              <div className="min-w-0 flex-1">
                <p className="text-[10px] font-semibold uppercase tracking-wide text-muted-foreground/75">
                  Now
                </p>
                <button
                  type="button"
                  onClick={() => onOpenTask(currentTask)}
                  className="flow-type-title min-w-0 max-w-full truncate text-left text-[13px] font-medium leading-snug text-foreground hover:underline"
                >
                  {currentTask.title}
                </button>
              </div>
              <div
                className={cn(
                  "flex shrink-0 items-center gap-0.5 transition-opacity duration-[180ms] ease-out",
                  nowMenuPoint
                    ? "opacity-100"
                    : "opacity-0 group-hover/now-card:opacity-100 focus-within:opacity-100",
                )}
              >
                {onCompleteCurrentTask ? (
                  <button
                    type="button"
                    onClick={() => onCompleteCurrentTask(currentTask)}
                    className="flex size-6 items-center justify-center rounded-md text-muted-foreground hover:bg-surface-hover hover:text-foreground"
                    aria-label={`Complete ${currentTask.title}`}
                    title="Complete task"
                  >
                    <Check className="size-3.5" aria-hidden />
                  </button>
                ) : null}
                {onFocusNext && hasQueueNext ? (
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
                  onClick={(event) => {
                    const rect = event.currentTarget.getBoundingClientRect();
                    setNowMenuPoint({ x: rect.left, y: rect.bottom + 4 });
                  }}
                  className="flex size-6 items-center justify-center rounded-md text-muted-foreground hover:bg-surface-hover hover:text-foreground"
                  aria-label={`More actions for ${currentTask.title}`}
                  title="More"
                >
                  <MoreHorizontal className="size-3.5" aria-hidden />
                </button>
              </div>
            </div>
          ) : null}
        </div>
      ) : null}

      <div
        className="flex min-h-0 flex-1 flex-col px-2.5 pb-2.5 pt-2"
        onDragOver={markQueueDropHover}
        onDragLeave={clearQueueDropHoverIfLeft}
      >
        <p className="mb-1 px-1 text-[10px] font-semibold uppercase tracking-wide text-muted-foreground">
          Next Up
          {totalCount > 0 ? (
            <span className="normal-case tracking-normal text-muted-foreground/80">
              {" "}
              ({totalCount})
            </span>
          ) : null}
        </p>

        <NextUpQueueList
          entries={entries}
          groups={groups}
          onStartFocusTask={onStartFocusTask}
          onStartFocusHabit={onStartFocusHabit}
          onOpenTask={onOpenTask}
          onOpenHabit={onOpenHabit}
          onRemoveTask={onRemoveTask}
          onRemoveHabit={onRemoveHabit}
          onReorder={onReorder}
          onToggleComplete={onToggleComplete}
          onToggleHabitComplete={onToggleHabitComplete}
          listRef={listRef}
          onScroll={onListScroll}
          externalDropActive={showQueueInsertPreview}
          externalDropBeforeKey={externalDropBeforeKey}
          onExternalDragOver={(beforeKey) => {
            setQueueDropHover(true);
            onExternalDragOver?.(beforeKey);
          }}
          onExternalDrop={onExternalDrop}
        />

        {dropZoneActive ? (
          <div
            className={cn(
              "mt-2 flex shrink-0 flex-col items-center justify-center gap-1 rounded-lg border border-dashed px-2 py-3 text-center transition-colors",
              showQueueInsertPreview
                ? "border-primary bg-primary/10 text-foreground"
                : "border-border-subtle/60 bg-surface-canvas/20 text-muted-foreground",
            )}
            onDragOver={(event) => {
              if (!isScheduleKindDrag(event) && !isNextUpReorderDrag(event))
                return;
              event.preventDefault();
              event.stopPropagation();
              acceptNextUpScheduleDrag(event);
              setQueueDropHover(true);
              onExternalDragOver?.(null);
            }}
            onDrop={(event) => {
              if (isNextUpReorderDrag(event)) return;
              event.preventDefault();
              event.stopPropagation();
              setQueueDropHover(false);
              onDropZoneDrop?.(event);
            }}
          >
            <Plus
              className={cn(
                "size-3.5",
                showQueueInsertPreview
                  ? "text-primary"
                  : "text-muted-foreground/70",
              )}
              aria-hidden
            />
            <span className="text-[11px] font-medium leading-snug">
              {showQueueInsertPreview
                ? `RELEASE TO ADD · Position ${Math.max(1, insertPosition)}`
                : "Drop here to add to queue"}
            </span>
          </div>
        ) : null}

        {continueTasks.length > 0 ? (
          <NextUpContinueSection
            tasks={continueTasks}
            groups={groups}
            focusMetaByTaskId={Object.fromEntries(
              continueTasks.map((task) => [
                task.id,
                {
                  focusedSeconds: continueFocusSecondsByTaskId[task.id] ?? 0,
                },
              ]),
            )}
            onStartFocus={onStartFocusTask}
            onOpenTask={onOpenTask}
            onToggleComplete={onToggleComplete}
            onAddToQueue={(task) => onAddContinueToQueue?.(task)}
          />
        ) : null}
      </div>

      <div className="mt-auto flex shrink-0 items-center justify-between gap-2 px-4 py-2.5 text-[11px]">
        <span className="tabular-nums text-muted-foreground">
          {totalCount} item{totalCount === 1 ? "" : "s"}
          {durationLabel ? ` · ${durationLabel}` : ""}
        </span>
        {totalCount > 0 && onClearAll ? (
          <button
            type="button"
            onClick={onClearAll}
            className="font-medium text-muted-foreground transition-colors hover:text-destructive"
          >
            Clear All
          </button>
        ) : null}
      </div>
    </aside>
  );

  if (!dockFloatRoot) return null;

  return (
    <>
      {createPortal(panel, dockFloatRoot)}
      {nowMenuPoint && currentTask ? (
        <CurrentTaskMenu
          x={nowMenuPoint.x}
          y={nowMenuPoint.y}
          hasQueueNext={hasQueueNext}
          onClose={() => setNowMenuPoint(null)}
          onCompleteTask={() => onCompleteCurrentTask?.(currentTask)}
          onFocusNext={() => onFocusNext?.()}
          onMoveToQueueEnd={() => onMoveCurrentToQueueEnd?.(currentTask)}
          onOpenDetails={() => onOpenTask(currentTask)}
          onMoveToTomorrow={() => onMoveCurrentToTomorrow?.(currentTask)}
          onPlanLater={() => onPlanLaterCurrent?.(currentTask)}
          onDelete={() => onDeleteCurrentTask?.(currentTask)}
        />
      ) : null}
    </>
  );
}

export { buildNextUpListEntries };
export type { NextUpListEntry };
