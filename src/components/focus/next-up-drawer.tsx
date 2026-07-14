"use client";

import { ChevronLeft, ListOrdered, Plus, Repeat, X } from "lucide-react";
import type { DragEvent } from "react";
import { NextUpQueueList } from "@/components/focus/next-up-queue-list";
import {
  WORKPLACE_NEXT_UP_PANEL_WIDTH_CSS,
  WORKPLACE_NEXT_UP_RAIL_PX,
} from "@/lib/workplace-layout";
import { getHabitDurationMinutes } from "@/lib/schedule-durations";
import { cn } from "@/lib/utils";
import type { QueueItem } from "@/types/queue-item";
import type { Habit } from "@/types/habit";
import type { Task, TaskGroupWithTasks } from "@/types/task";

type NextUpDrawerProps = {
  tasks: Task[];
  groups: TaskGroupWithTasks[];
  habits?: Habit[];
  habitRefs?: QueueItem[];
  currentTask: Task | null;
  open: boolean;
  /** When true, open panel is a fixed overlay (narrow viewports). */
  overlayMode?: boolean;
  fetchError?: string | null;
  onOpen: () => void;
  onClose: () => void;
  onStartFocus: (task: Task) => void;
  onOpenDetail: (task: Task) => void;
  onRemove: (id: string) => void;
  onRemoveHabit?: (habitId: string) => void;
  onReorder: (fromIndex: number, toIndex: number) => void;
  onToggleComplete: (task: Task) => void;
  onClearAll?: () => void;
  listRef?: React.RefObject<HTMLDivElement | null>;
  onListScroll?: () => void;
  dropZoneActive?: boolean;
  dropInsertPosition?: number;
  onDropZoneDrop?: (event: DragEvent) => void;
  externalDropBeforeId?: string | null;
  onExternalDragOver?: (taskId: string | null) => void;
  onExternalDrop?: (event: DragEvent, taskId: string | null) => void;
  className?: string;
};

function totalDurationMinutes(tasks: Task[], habitRefs: QueueItem[]): number {
  const taskMinutes = tasks.reduce(
    (sum, task) => sum + (task.duration_minutes ?? 0),
    0
  );
  const habitMinutes = habitRefs.reduce(
    (sum, item) => sum + getHabitDurationMinutes(item.sourceId),
    0
  );
  return taskMinutes + habitMinutes;
}

export function NextUpDrawer({
  tasks,
  groups,
  habits = [],
  habitRefs = [],
  currentTask,
  open,
  overlayMode = false,
  fetchError = null,
  onOpen,
  onClose,
  onStartFocus,
  onOpenDetail,
  onRemove,
  onRemoveHabit,
  onReorder,
  onToggleComplete,
  onClearAll,
  listRef,
  onListScroll,
  dropZoneActive = false,
  dropInsertPosition,
  onDropZoneDrop,
  externalDropBeforeId,
  onExternalDragOver,
  onExternalDrop,
  className,
}: NextUpDrawerProps) {
  const totalMinutes = totalDurationMinutes(tasks, habitRefs);
  const totalCount = tasks.length + habitRefs.length;
  const insertPosition =
    dropInsertPosition ?? totalCount + 1;
  const habitById = new Map(habits.map((habit) => [habit.id, habit]));
  const isEmpty = totalCount === 0;

  if (!open) {
    return (
      <aside
        className={cn(
          "group/queue-rail flex h-full shrink-0 flex-col items-center border-l border-border-subtle/70 bg-transparent py-2",
          "opacity-70 transition-[opacity,background-color] duration-150",
          "hover:bg-surface-base/35 hover:opacity-100 focus-within:bg-surface-base/35 focus-within:opacity-100",
          dropZoneActive && "bg-primary/10 opacity-100",
          className
        )}
        style={{ width: WORKPLACE_NEXT_UP_RAIL_PX }}
        aria-label="Next Up queue collapsed"
        onDragOver={(event) => {
          event.preventDefault();
          event.stopPropagation();
          onExternalDragOver?.(null);
        }}
        onDrop={(event) => onDropZoneDrop?.(event)}
      >
        <button
          type="button"
          onClick={onOpen}
          aria-label="Expand Next Up queue"
          title="Next Up queue"
          className="flex size-7 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-surface-hover hover:text-foreground"
        >
          <ChevronLeft className="size-3.5" />
        </button>
        <button
          type="button"
          onClick={onOpen}
          aria-label={`Open Next Up queue, ${totalCount} items`}
          className="relative mt-2 flex size-8 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-surface-hover hover:text-foreground"
        >
          <ListOrdered className="size-4" />
          {totalCount > 0 ? (
            <span className="absolute -right-0.5 -top-0.5 flex size-4 items-center justify-center rounded-full bg-primary text-[9px] font-semibold text-primary-foreground">
              {totalCount > 9 ? "9+" : totalCount}
            </span>
          ) : null}
        </button>
      </aside>
    );
  }

  return (
    <>
      {overlayMode ? (
        <button
          type="button"
          aria-label="Dismiss Next Up queue"
          className="fixed inset-0 z-40 cursor-default bg-black/30 animate-in fade-in-0 duration-150"
          onClick={onClose}
        />
      ) : null}
      <aside
        role="complementary"
        aria-label="Next Up queue"
        className={cn(
          "flex min-w-[300px] max-w-[360px] flex-col overflow-hidden border-l border-border-subtle bg-surface-base text-foreground transition-[transform,opacity] duration-200",
          overlayMode
            ? "fixed inset-y-0 right-0 z-50 h-full shadow-[0_0_40px_rgba(0,0,0,0.45)] animate-in slide-in-from-right-4 duration-200"
            : "h-full shrink-0",
          className
        )}
        style={{ width: WORKPLACE_NEXT_UP_PANEL_WIDTH_CSS }}
      >
      <div className="flex shrink-0 items-start justify-between gap-1.5 border-b border-border-subtle px-3 py-2.5">
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
          <p className="mt-1 text-[11px] leading-snug text-muted-foreground">
            Your upcoming focus sequence.
            <br />
            Drag to reorder.
          </p>
          {fetchError ? (
            <p className="mt-1 text-[11px] text-destructive">{fetchError}</p>
          ) : null}
        </div>
        <button
          type="button"
          onClick={onClose}
          aria-label="Collapse Next Up queue"
          className="flex size-7 shrink-0 items-center justify-center rounded-md text-muted-foreground hover:bg-surface-hover hover:text-foreground"
        >
          <X className="size-3.5" />
        </button>
      </div>

      {currentTask ? (
        <div className="shrink-0 border-b border-border-subtle/80 px-3 py-1.5">
          <p className="text-[10px] font-semibold uppercase tracking-wide text-muted-foreground">
            Current
          </p>
          <p className="mt-0.5 truncate text-[12px] font-medium text-foreground">
            {currentTask.title}
          </p>
        </div>
      ) : null}

      <div className="flex min-h-0 flex-1 flex-col px-2.5 pb-2.5 pt-2">
        {isEmpty && !dropZoneActive ? (
          <p className="mb-2 px-1 text-center text-[12px] text-muted-foreground">
            Queue is empty. Drag a task or habit here to commit what’s next.
          </p>
        ) : null}

        <NextUpQueueList
          tasks={tasks}
          groups={groups}
          onStartFocus={onStartFocus}
          onOpenDetail={onOpenDetail}
          onRemove={onRemove}
          onReorder={onReorder}
          onToggleComplete={onToggleComplete}
          listRef={listRef}
          onScroll={onListScroll}
          externalDropActive={dropZoneActive}
          externalDropBeforeId={externalDropBeforeId}
          onExternalDragOver={onExternalDragOver}
          onExternalDrop={onExternalDrop}
        />

        {habitRefs.length > 0 ? (
          <div className="mt-2 space-y-1">
            <p className="px-1 text-[10px] font-semibold uppercase tracking-wide text-muted-foreground">
              Habits
            </p>
            {habitRefs.map((item) => {
              const habit = habitById.get(item.sourceId);
              const duration = getHabitDurationMinutes(item.sourceId);
              return (
                <div
                  key={item.id}
                  className="flex items-center gap-2 rounded-md border border-border-subtle bg-card px-2 py-1.5"
                >
                  <Repeat className="size-3.5 shrink-0 text-success" aria-hidden />
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-[12px] font-medium text-foreground">
                      {habit?.name ?? "Habit"}
                    </p>
                    <p className="text-[10px] text-muted-foreground">
                      Habit
                      {duration > 0 ? ` · ${duration} min` : ""}
                    </p>
                  </div>
                  {onRemoveHabit ? (
                    <button
                      type="button"
                      onClick={() => onRemoveHabit(item.sourceId)}
                      className="flex size-6 items-center justify-center rounded-md text-muted-foreground hover:bg-surface-hover hover:text-foreground"
                      aria-label="Remove from queue"
                    >
                      <X className="size-3.5" />
                    </button>
                  ) : null}
                </div>
              );
            })}
          </div>
        ) : null}

        <div
          className={cn(
            "mt-2 flex shrink-0 flex-col items-center justify-center gap-1 rounded-lg border border-dashed px-2 py-4 text-center transition-colors",
            dropZoneActive
              ? "border-primary bg-primary/10 text-foreground"
              : "border-border-subtle bg-surface-canvas/30 text-muted-foreground"
          )}
          onDragOver={(event) => {
            event.preventDefault();
            event.stopPropagation();
            onExternalDragOver?.(null);
          }}
          onDrop={onDropZoneDrop}
        >
          <Plus
            className={cn(
              "size-4",
              dropZoneActive ? "text-primary" : "text-muted-foreground/70"
            )}
          />
          <span className="text-[11px] font-medium leading-snug">
            {dropZoneActive
              ? `RELEASE TO ADD · Position ${Math.max(1, insertPosition)}`
              : "Drop here to add to queue"}
          </span>
        </div>

        <div className="mt-2 flex shrink-0 items-center justify-between gap-2 border-t border-border-subtle pt-2 text-[11px]">
          <span className="tabular-nums text-muted-foreground">
            {totalCount} item{totalCount === 1 ? "" : "s"}
            {totalMinutes > 0 ? ` · ~${totalMinutes} min` : ""}
          </span>
          {totalCount > 0 && onClearAll ? (
            <button
              type="button"
              onClick={onClearAll}
              className="font-medium text-destructive/90 hover:text-destructive"
            >
              Clear All
            </button>
          ) : null}
        </div>
      </div>
    </aside>
    </>
  );
}
