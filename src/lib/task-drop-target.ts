import type { DropBeforeId } from "@/lib/list-drag-utils";
import {
  getActiveBodyMetrics,
  isPointerInsideColumnRect,
  resolveActiveDropBeforeIdFromMetrics,
  type CachedColumnRect,
} from "@/lib/dnd/board-drag-measurements";
import { getCachedActiveTaskIds } from "@/lib/board-displayed-tasks-cache";
import {
  applyManualOrderUpdates,
  computeManualReorderUpdates,
  MANUAL_ORDER_STEP,
  type ManualOrderUpdate,
} from "@/lib/manual-order";
import { partitionGroupTasks, type TaskDragTarget } from "@/lib/task-drag-utils";
import {
  filterTasksForGroup,
  isTodayGroup,
  sortActiveAndCompleted,
} from "@/lib/task-groups";
import {
  getSortContextForGroup,
  getTaskGroupSortMode,
  isManualTaskSortMode,
  sortActiveAndCompletedForContext,
} from "@/lib/task-sort";
import type { Task, TaskGroup, TaskGroupWithTasks } from "@/types/task";
import {
  logAfterApplyManualInsert,
  logAfterComputeManualReorderUpdates,
  logBeforeComputeManualReorderUpdates,
} from "@/lib/task-drag-pipeline-debug";

/** Active tasks in the same order as rendered in the column. */
export function getDisplayedActiveTasks(
  group: TaskGroup | TaskGroupWithTasks,
  tasks: Task[],
  todayViewDate: string
): Task[] {
  const visible = filterTasksForGroup(
    group as TaskGroupWithTasks,
    tasks,
    todayViewDate
  );
  return sortActiveAndCompleted(visible, group).active;
}

/** Completed tasks in the same order as rendered in the column. */
export function getDisplayedCompletedTasks(
  group: TaskGroup | TaskGroupWithTasks,
  tasks: Task[],
  todayViewDate: string
): Task[] {
  const visible = filterTasksForGroup(
    group as TaskGroupWithTasks,
    tasks,
    todayViewDate
  );
  return sortActiveAndCompleted(visible, group).completed;
}

export function isManualActiveDropGroup(group: TaskGroup): boolean {
  if (isTodayGroup(group)) return false;
  return isManualTaskSortMode(getTaskGroupSortMode(group));
}

/**
 * Resolve where an insertion line belongs between rendered active tasks.
 * Shared by preview rendering and manual-order insertion.
 */
export function resolveActiveDropBeforeId(
  orderedActiveIds: string[],
  container: HTMLElement,
  clientY: number,
  draggingTaskId: string
): DropBeforeId {
  const visibleIds = draggingTaskId
    ? orderedActiveIds.filter((id) => id !== draggingTaskId)
    : orderedActiveIds;

  const containerRect = container.getBoundingClientRect();
  if (clientY < containerRect.top - 8 || clientY > containerRect.bottom + 8) {
    return null;
  }

  if (visibleIds.length === 0) {
    return null;
  }

  for (const id of visibleIds) {
    const el = container.querySelector<HTMLElement>(`[data-task-row="${id}"]`);
    if (!el) continue;

    const rect = el.getBoundingClientRect();
    const midpoint = rect.top + rect.height / 2;
    if (clientY < midpoint) return id;
  }

  return null;
}

export function buildActiveTaskDropTarget(
  group: TaskGroupWithTasks,
  tasks: Task[],
  todayViewDate: string,
  container: HTMLElement,
  clientY: number,
  draggingTaskId: string
): TaskDragTarget {
  const manual = isManualActiveDropGroup(group);
  const activeIds = getDisplayedActiveTasks(group, tasks, todayViewDate).map(
    (task) => task.id
  );

  if (manual) {
    if (activeIds.length === 0) {
      return {
        groupId: group.id,
        beforeTaskId: null,
        zone: "active",
        showInsertionLine: true,
      };
    }

    return {
      groupId: group.id,
      beforeTaskId: resolveActiveDropBeforeId(
        activeIds,
        container,
        clientY,
        draggingTaskId
      ),
      zone: "active",
      showInsertionLine: true,
    };
  }

  return {
    groupId: group.id,
    beforeTaskId: null,
    zone: "active",
    showInsertionLine: false,
  };
}

/** Sorted destinations re-place by sort — only highlight the column. */
export function buildCompletedTaskDropTarget(groupId: string): TaskDragTarget {
  return {
    groupId,
    beforeTaskId: null,
    zone: "completed",
    showInsertionLine: false,
  };
}

export type ResolvedTaskDropTarget =
  | { kind: "target"; target: TaskDragTarget }
  | { kind: "none" };

/** Cached pointer resolution — one column-rect pass + one active-body pass per frame. */
export function resolveTaskDropTargetForPointerCached(
  board: HTMLElement,
  column: CachedColumnRect,
  group: TaskGroupWithTasks,
  todayViewDate: string,
  clientX: number,
  clientY: number,
  draggingTaskId: string
): ResolvedTaskDropTarget {
  if (!isPointerInsideColumnRect(column, clientX, clientY)) {
    return { kind: "none" };
  }

  const activeIds = getCachedActiveTaskIds(group, todayViewDate);
  const metrics = getActiveBodyMetrics(
    board,
    group.id,
    activeIds,
    draggingTaskId
  );

  if (!metrics) {
    return { kind: "none" };
  }

  if (metrics.completedTop !== null && clientY >= metrics.completedTop - 8) {
    return {
      kind: "target",
      target: buildCompletedTaskDropTarget(group.id),
    };
  }

  const manual = isManualActiveDropGroup(group);
  if (!manual) {
    return {
      kind: "target",
      target: {
        groupId: group.id,
        beforeTaskId: null,
        zone: "active",
        showInsertionLine: false,
      },
    };
  }

  if (activeIds.length === 0) {
    return {
      kind: "target",
      target: {
        groupId: group.id,
        beforeTaskId: null,
        zone: "active",
        showInsertionLine: true,
      },
    };
  }

  return {
    kind: "target",
    target: {
      groupId: group.id,
      beforeTaskId: resolveActiveDropBeforeIdFromMetrics(metrics, clientY),
      zone: "active",
      showInsertionLine: true,
    },
  };
}

/** Resolve drop target from column + pointer — independent of event.target. */
export function resolveTaskDropTargetForPointer(
  column: HTMLElement,
  group: TaskGroupWithTasks,
  todayViewDate: string,
  clientX: number,
  clientY: number,
  draggingTaskId: string
): ResolvedTaskDropTarget {
  const columnRect = column.getBoundingClientRect();
  const insideColumn =
    clientX >= columnRect.left &&
    clientX <= columnRect.right &&
    clientY >= columnRect.top &&
    clientY <= columnRect.bottom;

  if (!insideColumn) {
    return { kind: "none" };
  }

  const completedBody = column.querySelector<HTMLElement>(
    "[data-task-completed-body]"
  );
  if (completedBody && completedBody.offsetHeight > 0) {
    const completedRect = completedBody.getBoundingClientRect();
    if (clientY >= completedRect.top - 8) {
      return {
        kind: "target",
        target: buildCompletedTaskDropTarget(group.id),
      };
    }
  }

  const activeBody = column.querySelector<HTMLElement>("[data-task-active-body]");
  if (!activeBody) {
    return { kind: "none" };
  }

  return {
    kind: "target",
    target: buildActiveTaskDropTarget(
      group,
      group.tasks,
      todayViewDate,
      activeBody,
      clientY,
      draggingTaskId
    ),
  };
}

/** Insert a task into the displayed active list at the frozen preview position. */
export function buildManualActiveListForInsert(
  displayed: Task[],
  movingTask: Task,
  beforeTaskId: DropBeforeId
): Task[] {
  const without = displayed.filter((task) => task.id !== movingTask.id);
  const insertIndex =
    beforeTaskId === null
      ? without.length
      : without.findIndex((task) => task.id === beforeTaskId);

  const inserted: Task = { ...movingTask, completed: false };
  if (insertIndex === -1) {
    return [...without, inserted];
  }

  const next = [...without];
  next.splice(insertIndex, 0, inserted);
  return next;
}

export function computeManualActiveInsertUpdates(
  group: TaskGroupWithTasks,
  movingTaskId: string,
  beforeTaskId: DropBeforeId,
  todayViewDate: string,
  movingTask?: Task
): ManualOrderUpdate[] {
  const displayed = getDisplayedActiveTasks(group, group.tasks, todayViewDate);
  const moving =
    movingTask ??
    displayed.find((task) => task.id === movingTaskId) ??
    group.tasks.find((task) => task.id === movingTaskId);

  if (!moving) return [];

  const listForInsert = buildManualActiveListForInsert(
    displayed,
    moving,
    beforeTaskId
  );

  logBeforeComputeManualReorderUpdates({
    inputArray: listForInsert,
    beforeTaskId,
    movingTaskId,
  });

  const updates = computeManualReorderUpdates(
    listForInsert,
    movingTaskId,
    beforeTaskId
  );

  logAfterComputeManualReorderUpdates({
    inputArray: listForInsert,
    updates,
    movingTaskId,
  });

  return updates;
}

export function applyManualActiveInsertToGroup(
  group: TaskGroupWithTasks,
  movingTask: Task,
  beforeTaskId: DropBeforeId,
  todayViewDate: string
): { group: TaskGroupWithTasks; updates: ManualOrderUpdate[] } {
  const insertedTask: Task = {
    ...movingTask,
    completed: false,
    group_id: group.id,
  };

  const isNewToGroup = !group.tasks.some((task) => task.id === movingTask.id);
  const destinationDisplayed = getDisplayedActiveTasks(
    group,
    group.tasks,
    todayViewDate
  );
  const expectedDisplayOrder = buildManualActiveListForInsert(
    destinationDisplayed,
    insertedTask,
    beforeTaskId
  );

  let updates = computeManualActiveInsertUpdates(
    group,
    movingTask.id,
    beforeTaskId,
    todayViewDate,
    insertedTask
  );

  if (updates.length === 0) {
    updates = expectedDisplayOrder.map((task, index) => ({
      id: task.id,
      sort_order: (index + 1) * MANUAL_ORDER_STEP,
    }));
  }

  if (updates.length === 0) {
    if (process.env.NODE_ENV !== "production") {
      console.warn("[cross-group-manual] applyManualActiveInsertToGroup — no updates", {
        beforeTaskId,
        isNewToGroup,
        destinationDisplayed: destinationDisplayed.map((task) => task.id),
        expectedDisplayOrder: expectedDisplayOrder.map((task) => task.id),
      });
    }
    return { group, updates: [] };
  }

  const tasksWithMoving = [
    ...group.tasks.filter((task) => task.id !== movingTask.id),
    insertedTask,
  ];

  const withOrders = applyManualOrderUpdates(tasksWithMoving, updates);
  const { active, completed } = sortActiveAndCompletedForContext(
    withOrders,
    getSortContextForGroup(group)
  );
  const finalDisplayed = active.map((task) => task.id);

  logAfterApplyManualInsert({
    finalDisplayedIds: finalDisplayed,
    movingTaskId: movingTask.id,
  });

  return {
    group: { ...group, tasks: [...active, ...completed] },
    updates,
  };
}

export function applyManualActiveInsertToBoard(
  board: TaskGroupWithTasks[],
  groupId: string,
  movingTask: Task,
  beforeTaskId: DropBeforeId,
  todayViewDate: string
): { board: TaskGroupWithTasks[]; updates: ManualOrderUpdate[] } {
  const group = board.find((item) => item.id === groupId);
  if (!group) return { board, updates: [] };

  const { group: nextGroup, updates } = applyManualActiveInsertToGroup(
    group,
    movingTask,
    beforeTaskId,
    todayViewDate
  );

  if (updates.length === 0) return { board, updates: [] };

  return {
    board: board.map((item) => (item.id === groupId ? nextGroup : item)),
    updates,
  };
}
