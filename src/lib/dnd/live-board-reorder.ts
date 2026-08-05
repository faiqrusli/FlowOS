import {
  moveTaskInBoard,
  taskDragTargetsEqual,
  type MoveTaskInBoardOptions,
  type TaskDragTarget,
} from "@/lib/task-drag-utils";
import type { TaskGroupWithTasks } from "@/types/task";

export type LiveBoardReorderResult = {
  board: TaskGroupWithTasks[];
  sourceGroupId: string;
};

export function shouldApplyLiveBoardReorder(
  board: TaskGroupWithTasks[],
  target: TaskDragTarget,
  taskId: string
): boolean {
  const hasTask = board.some((group) =>
    group.tasks.some((task) => task.id === taskId)
  );
  const destination = board.find((group) => group.id === target.groupId);

  if (!hasTask || !destination) return false;

  if (target.beforeTaskId === null) return true;

  return destination.tasks.some((task) => task.id === target.beforeTaskId);
}

export function applyLiveBoardReorderIfChanged(
  board: TaskGroupWithTasks[],
  target: TaskDragTarget,
  taskId: string,
  sourceGroupId: string | null,
  lastAppliedTarget: TaskDragTarget | null,
  options: MoveTaskInBoardOptions
): LiveBoardReorderResult | null {
  if (taskDragTargetsEqual(target, lastAppliedTarget)) return null;
  if (!shouldApplyLiveBoardReorder(board, target, taskId)) return null;

  const resolvedSourceGroupId =
    sourceGroupId ??
    board.find((group) => group.tasks.some((task) => task.id === taskId))?.id;
  if (!resolvedSourceGroupId) return null;

  const nextBoard = moveTaskInBoard(board, taskId, target, {
    ...options,
    sourceGroupId: resolvedSourceGroupId,
  });

  const changed = board.some((group, groupIndex) => {
    const nextGroup = nextBoard[groupIndex];
    return (
      group.id !== nextGroup?.id ||
      group.tasks.length !== nextGroup.tasks.length ||
      group.tasks.some(
        (task, taskIndex) =>
          task.id !== nextGroup.tasks[taskIndex]?.id ||
          task.completed !== nextGroup.tasks[taskIndex]?.completed ||
          task.group_id !== nextGroup.tasks[taskIndex]?.group_id
      )
    );
  });

  return changed
    ? { board: nextBoard, sourceGroupId: resolvedSourceGroupId }
    : null;
}
