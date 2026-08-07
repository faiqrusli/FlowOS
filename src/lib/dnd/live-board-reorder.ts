import {
  taskDragTargetsEqual,
  type TaskDragTarget,
} from "@/lib/task-drag-utils";
import type { TaskGroupWithTasks } from "@/types/task";

export type LiveBoardReorderResult = {
  board: TaskGroupWithTasks[];
  sourceGroupId: string;
};

/**
 * Board list order is committed on drop only — same as Quick Schedule.
 * During drag, preview is DragOverlay + dnd-kit sortable transforms (same column).
 * Live onGroupsChange during drag fights transforms and causes flicker/jumps.
 */
export function shouldApplyLiveBoardReorder(
): boolean {
  return false;
}

export function applyLiveBoardReorderIfChanged(
  target: TaskDragTarget,
  lastAppliedTarget: TaskDragTarget | null
): LiveBoardReorderResult | null {
  if (taskDragTargetsEqual(target, lastAppliedTarget)) return null;
  if (!shouldApplyLiveBoardReorder()) return null;
  return null;
}
