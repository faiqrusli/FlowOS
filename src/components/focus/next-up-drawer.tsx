"use client";

import {
  useEffect,
  useState,
  type DragEvent,
  type MouseEvent as ReactMouseEvent,
  type WheelEvent as ReactWheelEvent,
} from "react";
import {
  ListOrdered,
  MoreHorizontal,
  PanelRightClose,
  PanelRightOpen,
  Plus,
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
  WORKPLACE_NEXT_UP_PANEL_WIDTH_CSS,
  WORKPLACE_NEXT_UP_RAIL_PX,
  WORKPLACE_QUEUE_CARD_INSET_CLASS,
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
  /** When not inline, open Queue floats instead of sharing the Focus row. */
  layoutMode?: WorkplaceQueueLayoutMode;
  /** @deprecated Prefer layoutMode — true means non-inline overlay while open. */
  overlayMode?: boolean;
  fetchError?: string | null;
  hasQueueNext?: boolean;
  onOpen: () => void;
  onClose: () => void;
  onStartFocusTask: (task: Task) => void;
  onStartFocusHabit: (habit: Habit) => void;
  onOpenTask: (task: Task) => void;
  onOpenHabit: (habit: Habit) => void;
  onRemoveTask: (id: string) => void;
  onRemoveHabit: (habitId: string) => void;
  onReorder: (fromIndex: number, toIndex: number) => void;
  onToggleComplete: (task: Task) => void;
  onClearAll?: () => void;
  onCompleteCurrentTask?: (task: Task) => void;
  onFocusNext?: () => void;
  onMoveCurrentToQueueEnd?: (task: Task) => void;
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
  layoutMode = "inline",
  overlayMode = false,
  fetchError = null,
  hasQueueNext = false,
  onOpen,
  onClose,
  onStartFocusTask,
  onStartFocusHabit,
  onOpenTask,
  onOpenHabit,
  onRemoveTask,
  onRemoveHabit,
  onReorder,
  onToggleComplete,
  onClearAll,
  onCompleteCurrentTask,
  onFocusNext,
  onMoveCurrentToQueueEnd,
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

  useEffect(() => {
    if (!dropZoneActive) {
      setNowDropHover(false);
      setQueueDropHover(false);
    }
  }, [dropZoneActive]);

  const resolvedMode: WorkplaceQueueLayoutMode =
    layoutMode !== "inline" ? layoutMode : overlayMode ? "drawer" : "inline";
  const floats = open && resolvedMode !== "inline";
  const isDrawer = floats && resolvedMode === "drawer";
  const isMidOverlay = floats && resolvedMode === "mid";

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
  const isEmpty = totalCount === 0;

  if (!open) {
    return (
      <div
        className={cn(
          "relative z-20 flex h-full shrink-0 self-stretch",
          WORKPLACE_QUEUE_CARD_INSET_CLASS,
        )}
      >
        <aside
          className={cn(
            "group/queue-rail flex h-full w-full flex-col items-center rounded-xl border border-border-subtle/70 bg-surface-base py-2",
            "transition-[opacity,background-color] duration-150",
            "hover:opacity-100 focus-within:opacity-100",
            dropZoneActive && "bg-primary/10",
            className,
          )}
          style={{ width: WORKPLACE_NEXT_UP_RAIL_PX }}
          aria-label="Next Up queue collapsed"
          onDragOver={(event) => {
            if (!isScheduleKindDrag(event) && !isNextUpReorderDrag(event))
              return;
            event.preventDefault();
            event.stopPropagation();
            acceptNextUpScheduleDrag(event);
            onExternalDragOver?.(null);
          }}
          onDrop={(event) => {
            if (isNextUpReorderDrag(event)) return;
            event.preventDefault();
            event.stopPropagation();
            onDropZoneDrop?.(event);
          }}
        >
          <button
            type="button"
            onClick={onOpen}
            aria-label="Expand Next Up queue"
            title="Open Next Up queue"
            className="flex size-7 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-surface-hover hover:text-foreground"
          >
            <PanelRightOpen className="size-3.5" aria-hidden />
          </button>
          <button
            type="button"
            onClick={onOpen}
            aria-label={`Open Next Up queue, ${totalCount} items`}
            className="relative mt-2 flex size-8 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-surface-hover hover:text-foreground"
          >
            <ListOrdered className="size-4" aria-hidden />
            {totalCount > 0 ? (
              <span className="absolute -right-0.5 -top-0.5 flex size-4 items-center justify-center rounded-full bg-primary text-[9px] font-semibold text-primary-foreground">
                {totalCount > 9 ? "9+" : totalCount}
              </span>
            ) : null}
          </button>
        </aside>
      </div>
    );
  }

  const panel = (
    <aside
      data-next-up-panel
      role="complementary"
      aria-label="Next Up queue"
      onWheel={forwardHorizontalWheelToCanvas}
      className={cn(
        "flex min-h-0 flex-col overflow-hidden rounded-xl border border-border-subtle bg-surface-base text-foreground shadow-[0_4px_18px_rgba(0,0,0,0.22)] transition-[transform,opacity] duration-200",
        floats && "min-w-[380px] max-w-[440px]",
        isDrawer &&
          "fixed inset-y-3 right-3 z-30 animate-in slide-in-from-right-4 duration-200",
        isMidOverlay &&
          "absolute inset-y-3 right-3 z-30 animate-in slide-in-from-right-3 duration-200 shadow-[0_12px_40px_rgba(0,0,0,0.35)]",
        !floats && "h-full w-full",
        className,
      )}
      style={floats ? { width: WORKPLACE_NEXT_UP_PANEL_WIDTH_CSS } : undefined}
    >
      <div className="flex shrink-0 items-center justify-between gap-1.5 border-b border-border-subtle px-3 py-2">
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
          aria-label="Collapse Next Up queue"
          title="Collapse Next Up queue"
          className="flex size-7 shrink-0 items-center justify-center rounded-md text-muted-foreground hover:bg-surface-hover hover:text-foreground"
        >
          <PanelRightClose className="size-3.5" aria-hidden />
        </button>
      </div>

      {currentTask || (dropZoneActive && onNowDrop) ? (
        <div className="shrink-0 border-b border-border-subtle/60 px-2.5 py-2">
          {dropZoneActive && onNowDrop ? (
            <div
              className={cn(
                "flex flex-col items-center justify-center gap-1 rounded-lg border border-dashed px-2 py-3 text-center transition-colors",
                nowDropHover
                  ? "cursor-copy border-primary bg-primary/10 text-foreground"
                  : "cursor-copy border-border-subtle/60 bg-surface-canvas/20 text-muted-foreground",
              )}
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
              <span
                className={cn(
                  "max-w-full truncate px-1 text-[11px]",
                  nowDropHover
                    ? "text-muted-foreground"
                    : "text-muted-foreground/80",
                )}
              >
                {currentTask
                  ? `Replaces “${currentTask.title}”`
                  : "Begin focusing this task now"}
              </span>
            </div>
          ) : currentTask ? (
            <div
              className="flex items-center gap-2 px-0.5"
              onContextMenu={(event: ReactMouseEvent<HTMLDivElement>) => {
                event.preventDefault();
                setNowMenuPoint({ x: event.clientX, y: event.clientY });
              }}
            >
              <div className="min-w-0 flex-1">
                <p className="text-[10px] font-semibold uppercase tracking-wide text-muted-foreground/75">
                  Now
                </p>
                <p className="truncate text-[12px] font-medium text-foreground">
                  {currentTask.title}
                </p>
              </div>
              <button
                type="button"
                onClick={(event) => {
                  const rect = event.currentTarget.getBoundingClientRect();
                  setNowMenuPoint({ x: rect.left, y: rect.bottom + 4 });
                }}
                className="flex size-7 shrink-0 items-center justify-center rounded-md text-muted-foreground hover:bg-surface-hover hover:text-foreground"
                aria-label={`More actions for ${currentTask.title}`}
              >
                <MoreHorizontal className="size-3.5" aria-hidden />
              </button>
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
        </p>

        {isEmpty && !showQueueInsertPreview ? (
          <p className="mb-2 px-1 text-center text-[12px] text-muted-foreground">
            Queue is empty. Drag a task or habit here to commit what&apos;s
            next.
          </p>
        ) : null}

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

      <div className="mt-auto flex shrink-0 items-center justify-between gap-2 border-t border-border-subtle/80 px-4 py-2.5 text-[11px]">
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

  return (
    <>
      {floats ? (
        <>
          {panel}
          {/* Keep rail width so Focus doesn’t jump when Queue overlays. */}
          <div
            className={cn(
              "pointer-events-none invisible shrink-0 self-stretch",
              WORKPLACE_QUEUE_CARD_INSET_CLASS,
            )}
            style={{ width: WORKPLACE_NEXT_UP_RAIL_PX }}
            aria-hidden
          />
        </>
      ) : (
        <div
          className={cn(
            "relative z-50 flex h-full min-h-0 shrink-0 self-stretch",
            WORKPLACE_QUEUE_CARD_INSET_CLASS,
          )}
          onWheel={forwardHorizontalWheelToCanvas}
        >
          <div
            className="flex h-full min-h-0 w-full min-w-[380px] max-w-[440px] flex-col"
            style={{ width: WORKPLACE_NEXT_UP_PANEL_WIDTH_CSS }}
          >
            {panel}
          </div>
        </div>
      )}
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
        />
      ) : null}
    </>
  );
}

export { buildNextUpListEntries };
export type { NextUpListEntry };
