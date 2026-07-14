"use client";

import { ChevronLeft, ListOrdered, Plus, X } from "lucide-react";
import type { DragEvent } from "react";
import { NextUpQueueList } from "@/components/focus/next-up-queue-list";
import {
  WORKPLACE_NEXT_UP_PANEL_WIDTH_CSS,
  WORKPLACE_NEXT_UP_RAIL_PX,
} from "@/lib/workplace-layout";
import { cn } from "@/lib/utils";
import type { Task, TaskGroupWithTasks } from "@/types/task";

type NextUpDrawerProps = {
  tasks: Task[];
  groups: TaskGroupWithTasks[];
  currentTask: Task | null;
  open: boolean;
  onOpen: () => void;
  onClose: () => void;
  onStartFocus: (task: Task) => void;
  onOpenDetail: (task: Task) => void;
  onRemove: (id: string) => void;
  onReorder: (fromIndex: number, toIndex: number) => void;
  onToggleComplete: (task: Task) => void;
  onClearAll?: () => void;
  listRef?: React.RefObject<HTMLDivElement | null>;
  onListScroll?: () => void;
  dropZoneActive?: boolean;
  onDropZoneDrop?: (event: DragEvent<HTMLDivElement>) => void;
  externalDropBeforeId?: string | null;
  onExternalDragOver?: (taskId: string | null) => void;
  onExternalDrop?: (event: DragEvent<HTMLDivElement>, taskId: string | null) => void;
  className?: string;
};

function totalDurationMinutes(tasks: Task[]): number {
  return tasks.reduce((sum, task) => sum + (task.duration_minutes ?? 0), 0);
}

export function NextUpDrawer({
  tasks,
  groups,
  currentTask,
  open,
  onOpen,
  onClose,
  onStartFocus,
  onOpenDetail,
  onRemove,
  onReorder,
  onToggleComplete,
  onClearAll,
  listRef,
  onListScroll,
  dropZoneActive = false,
  onDropZoneDrop,
  externalDropBeforeId,
  onExternalDragOver,
  onExternalDrop,
  className,
}: NextUpDrawerProps) {
  const totalMinutes = totalDurationMinutes(tasks);

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
          aria-label={`Open Next Up queue, ${tasks.length} items`}
          className="relative mt-2 flex size-8 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-surface-hover hover:text-foreground"
        >
          <ListOrdered className="size-4" />
          {tasks.length > 0 ? (
            <span className="absolute -right-0.5 -top-0.5 flex size-4 items-center justify-center rounded-full bg-primary text-[9px] font-semibold text-primary-foreground">
              {tasks.length > 9 ? "9+" : tasks.length}
            </span>
          ) : null}
        </button>
      </aside>
    );
  }

  return (
    <aside
      role="complementary"
      aria-label="Next Up queue"
      className={cn(
        "flex h-full min-w-[300px] max-w-[360px] shrink-0 flex-col overflow-hidden border-l border-border-subtle bg-surface-base text-foreground",
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
          }}
          onDrop={onDropZoneDrop}
        >
          <Plus
            className={cn(
              "size-4",
              dropZoneActive ? "text-primary" : "text-muted-foreground/70"
            )}
          />
          <span className="text-[11px] leading-snug">
            {dropZoneActive ? "Release to add to queue" : "Drop here to add to queue"}
          </span>
        </div>

        <div className="mt-2 flex shrink-0 items-center justify-between gap-2 border-t border-border-subtle pt-2 text-[11px]">
          <span className="tabular-nums text-muted-foreground">
            {tasks.length} item{tasks.length === 1 ? "" : "s"}
            {totalMinutes > 0 ? ` · ~${totalMinutes} min` : ""}
          </span>
          {tasks.length > 0 && onClearAll ? (
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
  );
}
