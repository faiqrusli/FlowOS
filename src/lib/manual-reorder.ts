import type { DropBeforeId } from "@/lib/list-drag-utils";
import { applyManualActiveInsertToBoard } from "@/lib/task-drop-target";
import type { ManualOrderUpdate } from "@/lib/manual-order";
import type { Task, TaskGroupWithTasks } from "@/types/task";

export type ManualReorderResult = {
  board: TaskGroupWithTasks[];
  updates: ManualOrderUpdate[];
};

/**
 * Same-column active-zone manual reorder.
 * Uses the same displayed order + beforeTaskId logic as the drop preview.
 */
export function applyManualActiveReorder(
  board: TaskGroupWithTasks[],
  groupId: string,
  taskId: string,
  beforeTaskId: DropBeforeId,
  todayViewDate: string
): ManualReorderResult {
  const group = board.find((item) => item.id === groupId);
  if (!group) return { board, updates: [] };

  const movingTask = group.tasks.find((task) => task.id === taskId);
  if (!movingTask) return { board, updates: [] };

  const { board: nextBoard, updates } = applyManualActiveInsertToBoard(
    board,
    groupId,
    movingTask,
    beforeTaskId,
    todayViewDate
  );

  return { board: nextBoard, updates };
}
