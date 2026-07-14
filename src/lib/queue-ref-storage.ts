/**
 * Additive Next Up refs for non-task sources (habits).
 * Tasks remain on tasks.queue_order (Next Up V2).
 * See decision-log 2026-07-14.
 */

import type { QueueItem } from "@/types/queue-item";

const STORAGE_KEY = "flowos.next-up.habit-refs.v1";

function readRaw(): QueueItem[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as unknown;
    if (!Array.isArray(parsed)) return [];
    return parsed.filter(
      (item): item is QueueItem =>
        !!item &&
        typeof item === "object" &&
        (item as QueueItem).sourceType === "habit" &&
        typeof (item as QueueItem).sourceId === "string" &&
        typeof (item as QueueItem).id === "string" &&
        typeof (item as QueueItem).position === "number"
    );
  } catch {
    return [];
  }
}

function writeRaw(items: QueueItem[]) {
  if (typeof window === "undefined") return;
  const normalized = items.map((item, index) => ({ ...item, position: index }));
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(normalized));
  window.dispatchEvent(new CustomEvent("flowos:habit-queue-updated"));
}

export function fetchHabitQueueRefs(): QueueItem[] {
  return readRaw().sort((a, b) => a.position - b.position);
}

export function hasHabitQueueRef(habitId: string): boolean {
  return fetchHabitQueueRefs().some((item) => item.sourceId === habitId);
}

export function insertHabitQueueRef(habitId: string): QueueItem[] {
  const current = fetchHabitQueueRefs();
  if (current.some((item) => item.sourceId === habitId)) return current;

  const next: QueueItem[] = [
    ...current,
    {
      id: `habit:${habitId}`,
      sourceType: "habit",
      sourceId: habitId,
      position: current.length,
      addedAt: new Date().toISOString(),
    },
  ];
  writeRaw(next);
  return next;
}

export function removeHabitQueueRef(habitId: string): QueueItem[] {
  const next = fetchHabitQueueRefs().filter((item) => item.sourceId !== habitId);
  writeRaw(next);
  return next;
}

export function clearHabitQueueRefs(): void {
  writeRaw([]);
}

/** Drop refs whose habits no longer exist or are completed. */
export function pruneHabitQueueRefs(
  habits: Array<{ id: string; completed?: boolean }>
): QueueItem[] {
  const byId = new Map(habits.map((habit) => [habit.id, habit]));
  const next = fetchHabitQueueRefs().filter((item) => {
    const habit = byId.get(item.sourceId);
    return habit != null && !habit.completed;
  });
  writeRaw(next);
  return next;
}
