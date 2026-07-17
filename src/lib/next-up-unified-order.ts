/**
 * Client overlay for a single Next Up execution sequence (tasks + habits).
 * Task membership/order still syncs to tasks.queue_order; habits stay in
 * habit-ref storage. This file owns interleaved display order only.
 */

const STORAGE_KEY = "flowos.next-up.unified-order.v1";

export type UnifiedQueueKey = `task:${string}` | `habit:${string}`;

export function taskQueueKey(taskId: string): UnifiedQueueKey {
  return `task:${taskId}`;
}

export function habitQueueKey(habitId: string): UnifiedQueueKey {
  return `habit:${habitId}`;
}

export function parseUnifiedQueueKey(
  key: string
): { sourceType: "task" | "habit"; sourceId: string } | null {
  if (key.startsWith("task:")) {
    return { sourceType: "task", sourceId: key.slice(5) };
  }
  if (key.startsWith("habit:")) {
    return { sourceType: "habit", sourceId: key.slice(6) };
  }
  return null;
}

function readRaw(): UnifiedQueueKey[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as unknown;
    if (!Array.isArray(parsed)) return [];
    return parsed.filter(
      (item): item is UnifiedQueueKey =>
        typeof item === "string" &&
        (item.startsWith("task:") || item.startsWith("habit:"))
    );
  } catch {
    return [];
  }
}

export function fetchUnifiedQueueOrder(): UnifiedQueueKey[] {
  return readRaw();
}

export function persistUnifiedQueueOrder(keys: UnifiedQueueKey[]): void {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(keys));
}

/** Keep stored order for live members; append any new tasks then habits. */
export function mergeUnifiedQueueOrder(
  stored: UnifiedQueueKey[],
  taskIds: string[],
  habitIds: string[]
): UnifiedQueueKey[] {
  const wanted = new Set<UnifiedQueueKey>([
    ...taskIds.map(taskQueueKey),
    ...habitIds.map(habitQueueKey),
  ]);
  const next = stored.filter((key) => wanted.has(key));
  const seen = new Set(next);
  for (const id of taskIds) {
    const key = taskQueueKey(id);
    if (!seen.has(key)) {
      next.push(key);
      seen.add(key);
    }
  }
  for (const id of habitIds) {
    const key = habitQueueKey(id);
    if (!seen.has(key)) {
      next.push(key);
      seen.add(key);
    }
  }
  return next;
}

export function insertUnifiedQueueKey(
  order: UnifiedQueueKey[],
  key: UnifiedQueueKey,
  beforeKey: UnifiedQueueKey | null
): UnifiedQueueKey[] {
  const without = order.filter((item) => item !== key);
  if (beforeKey == null) return [...without, key];
  const index = without.indexOf(beforeKey);
  if (index < 0) return [...without, key];
  const next = [...without];
  next.splice(index, 0, key);
  return next;
}

export function removeUnifiedQueueKey(
  order: UnifiedQueueKey[],
  key: UnifiedQueueKey
): UnifiedQueueKey[] {
  return order.filter((item) => item !== key);
}

export function reorderUnifiedQueueKeys(
  order: UnifiedQueueKey[],
  fromIndex: number,
  toIndex: number
): UnifiedQueueKey[] {
  if (
    fromIndex < 0 ||
    toIndex < 0 ||
    fromIndex >= order.length ||
    toIndex >= order.length ||
    fromIndex === toIndex
  ) {
    return order;
  }
  const next = [...order];
  const [item] = next.splice(fromIndex, 1);
  next.splice(toIndex, 0, item);
  return next;
}
