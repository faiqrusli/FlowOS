/**
 * Next Up Queue reference model (hierarchy refinement).
 * Display fields resolve from live Task / Habit / Schedule sources — do not
 * persist duplicated titles or payloads here.
 *
 * Persistence (2026-07-14 decision-log):
 * - task → tasks.queue_order (Next Up V2)
 * - habit | schedule → additive storage in Session 6+ (not yet written)
 */

export type QueueSourceType = "task" | "habit" | "schedule";

export type QueueItem = {
  id: string;
  sourceType: QueueSourceType;
  sourceId: string;
  position: number;
  addedAt: string;
};

/** Map a Next Up task (queue_order-backed) into a QueueItem reference. */
export function queueItemFromTask(
  task: { id: string; queue_order: number | null; updated_at?: string | null; created_at?: string | null },
  position: number
): QueueItem {
  return {
    id: `task:${task.id}`,
    sourceType: "task",
    sourceId: task.id,
    position,
    addedAt: task.updated_at ?? task.created_at ?? new Date().toISOString(),
  };
}

export function queueItemsFromTasks(
  tasks: Array<{
    id: string;
    queue_order: number | null;
    updated_at?: string | null;
    created_at?: string | null;
  }>
): QueueItem[] {
  return tasks.map((task, index) => queueItemFromTask(task, index));
}
