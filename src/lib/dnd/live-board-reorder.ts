import {
  taskDragTargetsEqual,
  type MoveTaskInBoardOptions,
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
  _board: TaskGroupWithTasks[],
  _target: TaskDragTarget,
  _taskId: string
): boolean {
  return false;
}

export function applyLiveBoardReorderIfChanged(
  _board: TaskGroupWithTasks[],
  target: TaskDragTarget,
  _taskId: string,
  _sourceGroupId: string | null,
  lastAppliedTarget: TaskDragTarget | null,
  _options: MoveTaskInBoardOptions
): LiveBoardReorderResult | null {
  if (taskDragTargetsEqual(target, lastAppliedTarget)) return null;
  if (!shouldApplyLiveBoardReorder(_board, target, _taskId)) return null;
  return null;
}
