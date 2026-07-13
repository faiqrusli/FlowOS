"use client";

import { useCallback, useEffect, useRef, useState, type DragEvent } from "react";
import {
  NextUpQueueItem,
} from "@/components/focus/next-up-queue-item";
import { TaskBoardInsertLine } from "@/components/tasks/task-board-insert-line";
import type { Task, TaskGroupWithTasks } from "@/types/task";
import {
  acceptNextUpScheduleDrag,
  isNextUpReorderDrag,
  isScheduleKindDrag,
  parseNextUpReorderDrop,
  setNextUpReorderDrag,
} from "@/lib/next-up-drag";
import {
  initialDropBeforeId,
  reorderByDropBeforeId,
  resolveDropBeforeId,
  setDragImageFromElement,
  type DropBeforeId,
} from "@/lib/list-drag-utils";
import { cn } from "@/lib/utils";

const NEXT_UP_ROW_ATTR = "data-next-up-row";

type NextUpQueueListProps = {
  tasks: Task[];
  groups: TaskGroupWithTasks[];
  onStartFocus: (task: Task) => void;
  onOpenDetail: (task: Task) => void;
  onRemove: (id: string) => void;
  onReorder: (fromIndex: number, toIndex: number) => void;
  onToggleComplete: (task: Task) => void;
  listRef?: React.RefObject<HTMLDivElement | null>;
  onScroll?: () => void;
  externalDropActive?: boolean;
  externalDropBeforeId?: string | null;
  onExternalDragOver?: (taskId: string | null) => void;
  onExternalDrop?: (event: DragEvent<HTMLDivElement>, taskId: string | null) => void;
  className?: string;
};

export function NextUpQueueList({
  tasks,
  groups,
  onStartFocus,
  onOpenDetail,
  onRemove,
  onReorder,
  onToggleComplete,
  listRef,
  onScroll,
  externalDropActive = false,
  externalDropBeforeId = null,
  onExternalDragOver,
  onExternalDrop,
  className,
}: NextUpQueueListProps) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const tasksRef = useRef(tasks);
  useEffect(() => {
    tasksRef.current = tasks;
  }, [tasks]);

  const dragIdRef = useRef<string | null>(null);
  const dropBeforeIdRef = useRef<DropBeforeId>(null);
  const [dragId, setDragId] = useState<string | null>(null);
  const [dropBeforeId, setDropBeforeId] = useState<DropBeforeId>(null);

  const setListRef = useCallback(
    (node: HTMLDivElement | null) => {
      containerRef.current = node;
      if (!listRef) return;
      if ("current" in listRef) {
        listRef.current = node;
      }
    },
    [listRef]
  );

  const resetDrag = useCallback(() => {
    dragIdRef.current = null;
    dropBeforeIdRef.current = null;
    setDragId(null);
    setDropBeforeId(null);
  }, []);

  const setDropBeforeIfChanged = useCallback((next: DropBeforeId) => {
    if (dropBeforeIdRef.current === next) return;
    dropBeforeIdRef.current = next;
    setDropBeforeId(next);
  }, []);

  const commitReorder = useCallback(() => {
    const activeId = dragIdRef.current;
    const beforeId = dropBeforeIdRef.current;
    const current = tasksRef.current;

    if (!activeId) {
      resetDrag();
      return;
    }

    const fromIndex = current.findIndex((task) => task.id === activeId);
    if (fromIndex < 0) {
      resetDrag();
      return;
    }

    const reordered = reorderByDropBeforeId(current, activeId, beforeId);
    const toIndex = reordered.findIndex((task) => task.id === activeId);
    if (toIndex >= 0 && toIndex !== fromIndex) {
      onReorder(fromIndex, toIndex);
    }

    resetDrag();
  }, [onReorder, resetDrag]);

  const handleItemDragStart = useCallback(
    (itemId: string, event: DragEvent<HTMLDivElement>) => {
      setNextUpReorderDrag(event, itemId);
      setDragImageFromElement(event, event.currentTarget, 12, 12);

      dragIdRef.current = itemId;
      setDragId(itemId);

      const orderedIds = tasksRef.current.map((task) => task.id);
      const initial = initialDropBeforeId(orderedIds, itemId);
      dropBeforeIdRef.current = initial;
      setDropBeforeId(initial);
    },
    []
  );

  const handleListDragOver = useCallback(
    (event: DragEvent<HTMLDivElement>) => {
      if (!isNextUpReorderDrag(event) || !containerRef.current) return;
      if (!dragIdRef.current) return;

      event.preventDefault();
      event.stopPropagation();
      event.dataTransfer.dropEffect = "move";

      const orderedIds = tasksRef.current.map((task) => task.id);
      const beforeId = resolveDropBeforeId(
        orderedIds,
        containerRef.current,
        NEXT_UP_ROW_ATTR,
        event.clientY,
        "y",
        dragIdRef.current
      );
      setDropBeforeIfChanged(beforeId);
    },
    [setDropBeforeIfChanged]
  );

  const handleListDrop = useCallback(
    (event: DragEvent<HTMLDivElement>) => {
      if (!isNextUpReorderDrag(event)) return;
      event.preventDefault();
      event.stopPropagation();

      // Prefer mime id if present; fall back to in-flight drag ref.
      const fromId = parseNextUpReorderDrop(event) ?? dragIdRef.current;
      if (fromId && !dragIdRef.current) {
        dragIdRef.current = fromId;
      }
      commitReorder();
    },
    [commitReorder]
  );

  const handleExternalDragOver = useCallback(
    (event: DragEvent<HTMLDivElement>) => {
      if (isNextUpReorderDrag(event) || !isScheduleKindDrag(event)) return;
      event.preventDefault();
      event.stopPropagation();
      acceptNextUpScheduleDrag(event);
      onExternalDragOver?.(null);
    },
    [onExternalDragOver]
  );

  const handleExternalDrop = useCallback(
    (event: DragEvent<HTMLDivElement>) => {
      if (isNextUpReorderDrag(event) || !isScheduleKindDrag(event)) return;
      event.preventDefault();
      event.stopPropagation();
      onExternalDrop?.(event, null);
    },
    [onExternalDrop]
  );

  const handleItemDragEnd = useCallback(() => {
    // Native dragend fires after drop; only commit if still dragging
    // (drop path already reset).
    if (dragIdRef.current) {
      commitReorder();
    }
  }, [commitReorder]);

  return (
    <div
      ref={setListRef}
      onScroll={onScroll}
      onDragOver={(event) => {
        handleListDragOver(event);
        handleExternalDragOver(event);
      }}
      onDrop={(event) => {
        handleListDrop(event);
        handleExternalDrop(event);
      }}
      className={cn(
        "min-h-0 flex-1 space-y-1 overflow-y-auto overscroll-contain pr-0.5",
        className
      )}
    >
      {tasks.length === 0 ? (
        <p className="px-1 py-2 text-[13px] text-muted-foreground/85">
          Add a Today or unscheduled task to choose what&apos;s next.
        </p>
      ) : (
        <>
          {tasks.map((task, index) => (
            <div key={task.id}>
              {dragId !== null && dropBeforeId === task.id ? (
                <TaskBoardInsertLine className="mb-1" />
              ) : null}
              <div
                data-next-up-row={task.id}
                className={cn(dragId === task.id && "opacity-0")}
                onDragOver={(event) => {
                  if (isNextUpReorderDrag(event) || !isScheduleKindDrag(event)) return;
                  event.preventDefault();
                  event.stopPropagation();
                  acceptNextUpScheduleDrag(event);
                  onExternalDragOver?.(task.id);
                }}
                onDrop={(event) => {
                  if (isNextUpReorderDrag(event) || !isScheduleKindDrag(event)) return;
                  event.preventDefault();
                  event.stopPropagation();
                  onExternalDrop?.(event, task.id);
                }}
              >
                {externalDropActive && externalDropBeforeId === task.id ? (
                  <TaskBoardInsertLine className="mb-1" />
                ) : null}
                <NextUpQueueItem
                  task={task}
                  groups={groups}
                  onStartFocus={onStartFocus}
                  onOpenDetail={onOpenDetail}
                  onRemove={onRemove}
                  onDragStart={(event) => handleItemDragStart(task.id, event)}
                  onDragEnd={handleItemDragEnd}
                  onToggleComplete={onToggleComplete}
                  onMove={(delta) => onReorder(index, index + delta)}
                />
              </div>
            </div>
          ))}
          {dragId !== null && dropBeforeId === null ? (
            <TaskBoardInsertLine className="mt-1" />
          ) : null}
          {externalDropActive && externalDropBeforeId === null ? (
            <TaskBoardInsertLine className="mt-1" />
          ) : null}
        </>
      )}
    </div>
  );
}
