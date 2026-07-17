"use client";

import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  type DragEvent,
} from "react";
import { NextUpQueueItem } from "@/components/focus/next-up-queue-item";
import { TaskBoardInsertLine } from "@/components/tasks/task-board-insert-line";
import {
  acceptNextUpScheduleDrag,
  clearNextUpQueueDrag,
  isNextUpReorderDrag,
  isScheduleKindDrag,
  parseNextUpReorderDrop,
  setNextUpQueueDrag,
} from "@/lib/next-up-drag";
import { consumeTimelineDropConsumed } from "@/lib/timeline-drag";
import {
  parseUnifiedQueueKey,
  type UnifiedQueueKey,
} from "@/lib/next-up-unified-order";
import { getHabitDurationMinutes } from "@/lib/schedule-durations";
import {
  initialDropBeforeId,
  reorderByDropBeforeId,
  resolveDropBeforeId,
  setDragImageFromElement,
  type DropBeforeId,
} from "@/lib/list-drag-utils";
import { cn } from "@/lib/utils";
import type { Habit } from "@/types/habit";
import type { QueueItem } from "@/types/queue-item";
import type { Task, TaskGroupWithTasks } from "@/types/task";

const NEXT_UP_ROW_ATTR = "data-next-up-row";

export type NextUpListEntry =
  | { key: UnifiedQueueKey; kind: "task"; task: Task }
  | { key: UnifiedQueueKey; kind: "habit"; habit: Habit; ref: QueueItem };

type NextUpQueueListProps = {
  entries: NextUpListEntry[];
  groups: TaskGroupWithTasks[];
  onStartFocusTask: (task: Task) => void;
  onStartFocusHabit: (habit: Habit) => void;
  onOpenTask: (task: Task) => void;
  onOpenHabit: (habit: Habit) => void;
  onRemoveTask: (taskId: string) => void;
  onRemoveHabit: (habitId: string) => void;
  onReorder: (fromIndex: number, toIndex: number) => void;
  onToggleComplete: (task: Task) => void;
  listRef?: React.RefObject<HTMLDivElement | null>;
  onScroll?: () => void;
  externalDropActive?: boolean;
  /** Unified key to insert before, or null for end. */
  externalDropBeforeKey?: UnifiedQueueKey | null;
  onExternalDragOver?: (beforeKey: UnifiedQueueKey | null) => void;
  onExternalDrop?: (
    event: DragEvent<HTMLDivElement>,
    beforeKey: UnifiedQueueKey | null,
  ) => void;
  className?: string;
};

export function buildNextUpListEntries(
  order: UnifiedQueueKey[],
  tasks: Task[],
  habitRefs: QueueItem[],
  habits: Habit[],
): NextUpListEntry[] {
  const taskById = new Map(tasks.map((task) => [task.id, task]));
  const habitById = new Map(habits.map((habit) => [habit.id, habit]));
  const habitRefById = new Map(habitRefs.map((ref) => [ref.sourceId, ref]));
  const entries: NextUpListEntry[] = [];

  for (const key of order) {
    const parsed = parseUnifiedQueueKey(key);
    if (!parsed) continue;
    if (parsed.sourceType === "task") {
      const task = taskById.get(parsed.sourceId);
      if (task) entries.push({ key, kind: "task", task });
      continue;
    }
    const habit = habitById.get(parsed.sourceId);
    const ref = habitRefById.get(parsed.sourceId);
    if (habit && ref) entries.push({ key, kind: "habit", habit, ref });
  }

  return entries;
}

export function NextUpQueueList({
  entries,
  groups,
  onStartFocusTask,
  onStartFocusHabit,
  onOpenTask,
  onOpenHabit,
  onRemoveTask,
  onRemoveHabit,
  onReorder,
  onToggleComplete,
  listRef,
  onScroll,
  externalDropActive = false,
  externalDropBeforeKey = null,
  onExternalDragOver,
  onExternalDrop,
  className,
}: NextUpQueueListProps) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const entriesRef = useRef(entries);
  useEffect(() => {
    entriesRef.current = entries;
  }, [entries]);

  const orderedKeys = useMemo(
    () => entries.map((entry) => entry.key),
    [entries],
  );

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
    [listRef],
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
    const current = entriesRef.current;

    if (!activeId) {
      resetDrag();
      return;
    }

    const fromIndex = current.findIndex((entry) => entry.key === activeId);
    if (fromIndex < 0) {
      resetDrag();
      return;
    }

    const reorderedKeys = reorderByDropBeforeId(
      current.map((entry) => ({ id: entry.key })),
      activeId,
      beforeId,
    ).map((item) => item.id as UnifiedQueueKey);
    const toIndex = reorderedKeys.indexOf(activeId as UnifiedQueueKey);
    if (toIndex >= 0 && toIndex !== fromIndex) {
      onReorder(fromIndex, toIndex);
    }

    resetDrag();
  }, [onReorder, resetDrag]);

  const handleItemDragStart = useCallback(
    (itemKey: string, event: DragEvent<HTMLDivElement>) => {
      const parsed = parseUnifiedQueueKey(itemKey);
      if (parsed) {
        setNextUpQueueDrag(event, parsed.sourceType, parsed.sourceId, itemKey);
      } else {
        event.dataTransfer.effectAllowed = "move";
      }
      setDragImageFromElement(event, event.currentTarget, 12, 12);

      dragIdRef.current = itemKey;
      setDragId(itemKey);

      const initial = initialDropBeforeId(orderedKeys, itemKey);
      dropBeforeIdRef.current = initial;
      setDropBeforeId(initial);
    },
    [orderedKeys],
  );

  const handleListDragOver = useCallback(
    (event: DragEvent<HTMLDivElement>) => {
      if (!isNextUpReorderDrag(event) || !containerRef.current) return;
      if (!dragIdRef.current) return;

      event.preventDefault();
      event.stopPropagation();
      event.dataTransfer.dropEffect = "move";

      const beforeId = resolveDropBeforeId(
        orderedKeys,
        containerRef.current,
        NEXT_UP_ROW_ATTR,
        event.clientY,
        "y",
        dragIdRef.current,
      );
      setDropBeforeIfChanged(beforeId);
    },
    [orderedKeys, setDropBeforeIfChanged],
  );

  const handleListDrop = useCallback(
    (event: DragEvent<HTMLDivElement>) => {
      if (!isNextUpReorderDrag(event)) return;
      event.preventDefault();
      event.stopPropagation();

      const fromId = parseNextUpReorderDrop(event) ?? dragIdRef.current;
      if (fromId && !dragIdRef.current) {
        dragIdRef.current = fromId;
      }
      commitReorder();
    },
    [commitReorder],
  );

  const handleExternalDragOver = useCallback(
    (event: DragEvent<HTMLDivElement>) => {
      if (isNextUpReorderDrag(event) || !isScheduleKindDrag(event)) return;
      event.preventDefault();
      event.stopPropagation();
      acceptNextUpScheduleDrag(event);
      onExternalDragOver?.(null);
    },
    [onExternalDragOver],
  );

  const handleExternalDrop = useCallback(
    (event: DragEvent<HTMLDivElement>) => {
      if (isNextUpReorderDrag(event) || !isScheduleKindDrag(event)) return;
      event.preventDefault();
      event.stopPropagation();
      onExternalDrop?.(event, null);
    },
    [onExternalDrop],
  );

  const handleItemDragEnd = useCallback(() => {
    const droppedOnTimeline = consumeTimelineDropConsumed();
    clearNextUpQueueDrag();
    if (droppedOnTimeline) {
      dragIdRef.current = null;
      dropBeforeIdRef.current = null;
      setDragId(null);
      setDropBeforeId(null);
      return;
    }
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
        "min-h-0 flex-1 space-y-1 overflow-y-auto overscroll-contain pr-0.5 scrollbar-subtle",
        className,
      )}
    >
      {entries.length === 0 ? (
        externalDropActive ? (
          <div className="flex min-h-10 flex-col justify-center py-1">
            <TaskBoardInsertLine />
          </div>
        ) : (
          <p className="px-1 py-2 text-[13px] text-muted-foreground/85">
            Add a task or habit to choose what&apos;s next.
          </p>
        )
      ) : (
        <>
          {entries.map((entry, index) => (
            <div key={entry.key}>
              {dragId !== null && dropBeforeId === entry.key ? (
                <TaskBoardInsertLine className="mb-1" />
              ) : null}
              <div
                data-next-up-row={entry.key}
                className={cn(dragId === entry.key && "opacity-0")}
                onDragOver={(event) => {
                  if (isNextUpReorderDrag(event) || !isScheduleKindDrag(event))
                    return;
                  event.preventDefault();
                  event.stopPropagation();
                  acceptNextUpScheduleDrag(event);
                  onExternalDragOver?.(entry.key);
                }}
                onDrop={(event) => {
                  if (isNextUpReorderDrag(event) || !isScheduleKindDrag(event))
                    return;
                  event.preventDefault();
                  event.stopPropagation();
                  onExternalDrop?.(event, entry.key);
                }}
              >
                {externalDropActive && externalDropBeforeKey === entry.key ? (
                  <TaskBoardInsertLine className="mb-1" />
                ) : null}
                {entry.kind === "task" ? (
                  <NextUpQueueItem
                    kind="task"
                    task={entry.task}
                    groups={groups}
                    position={index + 1}
                    onStartFocus={() => onStartFocusTask(entry.task)}
                    onOpen={() => onOpenTask(entry.task)}
                    onRemove={() => onRemoveTask(entry.task.id)}
                    onDragStart={(event) =>
                      handleItemDragStart(entry.key, event)
                    }
                    onDragEnd={handleItemDragEnd}
                    onToggleComplete={onToggleComplete}
                    onMove={(delta) => onReorder(index, index + delta)}
                    onMoveToTop={() => onReorder(index, 0)}
                    onMoveToBottom={() => onReorder(index, entries.length - 1)}
                  />
                ) : (
                  <NextUpQueueItem
                    kind="habit"
                    habit={entry.habit}
                    habitDurationMinutes={getHabitDurationMinutes(
                      entry.habit.id,
                    )}
                    groups={groups}
                    position={index + 1}
                    onStartFocus={() => onStartFocusHabit(entry.habit)}
                    onOpen={() => onOpenHabit(entry.habit)}
                    onRemove={() => onRemoveHabit(entry.habit.id)}
                    onDragStart={(event) =>
                      handleItemDragStart(entry.key, event)
                    }
                    onDragEnd={handleItemDragEnd}
                    onMove={(delta) => onReorder(index, index + delta)}
                    onMoveToTop={() => onReorder(index, 0)}
                    onMoveToBottom={() => onReorder(index, entries.length - 1)}
                  />
                )}
              </div>
            </div>
          ))}
          {dragId !== null && dropBeforeId === null ? (
            <TaskBoardInsertLine className="mt-1" />
          ) : null}
          {externalDropActive && externalDropBeforeKey === null ? (
            <TaskBoardInsertLine className="mt-1" />
          ) : null}
        </>
      )}
    </div>
  );
}
