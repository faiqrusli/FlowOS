"use client";

import { X } from "lucide-react";
import type { DragEvent } from "react";
import { NextUpDropZone } from "@/components/focus/next-up-drop-zone";
import { NextUpQueueList } from "@/components/focus/next-up-queue-list";
import type { Task, TaskGroupWithTasks } from "@/types/task";
import { cn } from "@/lib/utils";

type NextUpDrawerProps = {
  tasks: Task[];
  groups: TaskGroupWithTasks[];
  currentTask: Task | null;
  onClose: () => void;
  onStartFocus: (task: Task) => void;
  onOpenDetail: (task: Task) => void;
  onRemove: (id: string) => void;
  onReorder: (fromIndex: number, toIndex: number) => void;
  onToggleComplete: (task: Task) => void;
  listRef?: React.RefObject<HTMLDivElement | null>;
  onListScroll?: () => void;
  dropZoneActive?: boolean;
  onDropZoneDrop?: (event: DragEvent<HTMLDivElement>) => void;
  externalDropBeforeId?: string | null;
  onExternalDragOver?: (taskId: string | null) => void;
  onExternalDrop?: (event: DragEvent<HTMLDivElement>, taskId: string | null) => void;
  className?: string;
};

export function NextUpDrawer({
  tasks,
  groups,
  currentTask,
  onClose,
  onStartFocus,
  onOpenDetail,
  onRemove,
  onReorder,
  onToggleComplete,
  listRef,
  onListScroll,
  dropZoneActive = false,
  onDropZoneDrop,
  externalDropBeforeId,
  onExternalDragOver,
  onExternalDrop,
  className,
}: NextUpDrawerProps) {
  return (
    <div
      role="dialog"
      aria-label="Next Up queue"
      aria-modal="false"
      className={cn(
        "fixed inset-0 z-30 flex h-full w-full flex-col overflow-hidden bg-card text-card-foreground sm:absolute sm:inset-y-0 sm:right-0 sm:left-auto sm:h-full sm:w-[38%] sm:min-w-80 sm:rounded-none sm:border-y-0 sm:border-r-0 sm:border-l sm:border-border/60",
        className
      )}
    >
      <div className="flex shrink-0 items-center justify-between gap-2 border-b border-border/50 px-3 py-2">
        <h3 className="truncate text-[13px] font-semibold text-foreground/90">
          Next Up ({tasks.length})
        </h3>
        <button
          type="button"
          onClick={onClose}
          aria-label="Close Next Up"
          className="flex size-7 shrink-0 items-center justify-center rounded-md text-muted-foreground hover:bg-muted/50 hover:text-foreground"
        >
          <X className="size-4" />
        </button>
      </div>

      <div className="flex min-h-0 flex-1 flex-col px-3 pb-2.5 pt-2">
        <div className="mb-2 shrink-0 border-b border-border/45 pb-2">
          <p className="text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">
            Current Focus
          </p>
          <p className="mt-0.5 truncate text-[13px] font-medium text-foreground">
            {currentTask?.title ?? "No task in focus"}
          </p>
        </div>
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

        <NextUpDropZone
          className="mt-2"
          active={dropZoneActive}
          onDrop={(event) => onDropZoneDrop?.(event)}
        />
      </div>
    </div>
  );
}
