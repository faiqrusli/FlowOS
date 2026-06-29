import type { Task } from "@/types/task";

/** Gap between manual order values — avoids renumbering on most moves. */
export const MANUAL_ORDER_STEP = 1000;

export const MANUAL_ORDER_INITIAL = MANUAL_ORDER_STEP;

type ManualOrderTask = Pick<Task, "id" | "sort_order" | "created_at">;

/** manualOrder (sort_order) must be a positive finite integer. */
export function isValidManualOrder(value: unknown): value is number {
  return (
    typeof value === "number" &&
    Number.isFinite(value) &&
    Number.isInteger(value) &&
    value > 0
  );
}

/** Coerce to a valid manualOrder — never returns null/undefined/NaN. */
export function coerceManualOrder(value: unknown, fallback: number): number {
  if (isValidManualOrder(value)) return value;
  return isValidManualOrder(fallback) ? fallback : MANUAL_ORDER_INITIAL;
}

export function normalizeTaskManualOrder<T extends Task>(task: T): T {
  return {
    ...task,
    sort_order: coerceManualOrder(task.sort_order, MANUAL_ORDER_INITIAL),
  };
}

/**
 * Assign manualOrder to tasks missing a valid value within each group.
 * Preserves valid orders; appends repaired tasks at the end of each group.
 */
export function computeManualOrderRepairs(tasks: Task[]): ManualOrderUpdate[] {
  const byGroup = new Map<string, Task[]>();

  for (const task of tasks) {
    const key = task.group_id ?? "__ungrouped__";
    const list = byGroup.get(key) ?? [];
    list.push(task);
    byGroup.set(key, list);
  }

  const updates: ManualOrderUpdate[] = [];

  for (const groupTasks of byGroup.values()) {
    const invalid = groupTasks.filter((task) => !isValidManualOrder(task.sort_order));
    if (invalid.length === 0) continue;

    const validOrders = groupTasks
      .filter((task) => isValidManualOrder(task.sort_order))
      .map((task) => task.sort_order);

    let nextOrder =
      validOrders.length > 0
        ? Math.max(...validOrders) + MANUAL_ORDER_STEP
        : MANUAL_ORDER_INITIAL;

    const sortedInvalid = [...invalid].sort((a, b) =>
      a.created_at.localeCompare(b.created_at)
    );

    for (const task of sortedInvalid) {
      updates.push({ id: task.id, sort_order: nextOrder });
      nextOrder += MANUAL_ORDER_STEP;
    }
  }

  return updates;
}

/** Resolve manualOrder when creating a task — never omits or returns invalid values. */
export function resolveManualOrderForCreate(
  sortOrder: number | undefined | null,
  fallback: number = MANUAL_ORDER_INITIAL
): number {
  return coerceManualOrder(sortOrder, fallback);
}

/**
 * Manual sort: sort_order ASC, then created_at ASC for stability.
 * No other fields participate.
 */
export function compareManualOrder(
  a: ManualOrderTask,
  b: ManualOrderTask
): number {
  if (a.sort_order !== b.sort_order) return a.sort_order - b.sort_order;
  return a.created_at.localeCompare(b.created_at);
}

export function sortByManualOrder<T extends ManualOrderTask>(tasks: T[]): T[] {
  return [...tasks].sort(compareManualOrder);
}

export type ManualOrderUpdate = { id: string; sort_order: number };

/**
 * Compute new manualOrder values after dropping `movingTaskId` before `beforeTaskId`.
 * Returns only tasks whose sort_order changed.
 */
export function computeManualReorderUpdates(
  sortedActive: ManualOrderTask[],
  movingTaskId: string,
  beforeTaskId: string | null
): ManualOrderUpdate[] {
  const moving = sortedActive.find((task) => task.id === movingTaskId);
  if (!moving) return [];

  const without = sortedActive.filter((task) => task.id !== movingTaskId);
  const insertIndex =
    beforeTaskId === null
      ? without.length
      : without.findIndex((task) => task.id === beforeTaskId);

  if (insertIndex === -1) return [];

  const prev = insertIndex > 0 ? without[insertIndex - 1] : null;
  const next = insertIndex < without.length ? without[insertIndex] : null;

  if (!prev && !next) {
    return [{ id: movingTaskId, sort_order: MANUAL_ORDER_INITIAL }];
  }

  if (!prev && next) {
    const order = next.sort_order - MANUAL_ORDER_STEP;
    if (order > 0) {
      return [{ id: movingTaskId, sort_order: order }];
    }
  } else if (prev && !next) {
    return [{ id: movingTaskId, sort_order: prev.sort_order + MANUAL_ORDER_STEP }];
  } else if (prev && next) {
    const gap = next.sort_order - prev.sort_order;
    if (gap > 1) {
      return [
        {
          id: movingTaskId,
          sort_order: Math.floor((prev.sort_order + next.sort_order) / 2),
        },
      ];
    }
  }

  const reordered = [...without];
  reordered.splice(insertIndex, 0, moving);
  return reordered.map((task, index) => ({
    id: task.id,
    sort_order: (index + 1) * MANUAL_ORDER_STEP,
  }));
}

/** Place a new task at the top of a manually sorted active list. */
export function manualOrderForNewTaskAtTop(
  sortedActive: ManualOrderTask[]
): number {
  if (sortedActive.length === 0) return MANUAL_ORDER_INITIAL;
  const minOrder = sortedActive[0]!.sort_order;
  const candidate = minOrder - MANUAL_ORDER_STEP;
  return candidate > 0 ? candidate : MANUAL_ORDER_INITIAL;
}

/** Place a new task at the end of a group's active list. */
export function manualOrderForNewTaskAtEnd(
  sortedActive: ManualOrderTask[]
): number {
  if (sortedActive.length === 0) return MANUAL_ORDER_INITIAL;
  const maxOrder = sortedActive[sortedActive.length - 1]!.sort_order;
  return maxOrder + MANUAL_ORDER_STEP;
}

export function applyManualOrderUpdates<T extends Task>(
  tasks: T[],
  updates: ManualOrderUpdate[]
): T[] {
  if (updates.length === 0) return tasks;
  const byId = new Map(updates.map((item) => [item.id, item.sort_order]));
  return tasks.map((task) => {
    const nextOrder = byId.get(task.id);
    return nextOrder !== undefined ? { ...task, sort_order: nextOrder } : task;
  });
}
