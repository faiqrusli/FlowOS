import { taskDragTargetsEqual, type TaskDragTarget } from "@/lib/task-drag-utils";

export type TaskDragSessionSnapshot = {
  draggingTaskId: string | null;
  sourceGroupId: string | null;
  dropTarget: TaskDragTarget | null;
  lastValidDropTarget: TaskDragTarget | null;
  hoveredColumnId: string | null;
  commitDropTarget: TaskDragTarget | null;
};

const EMPTY: TaskDragSessionSnapshot = {
  draggingTaskId: null,
  sourceGroupId: null,
  dropTarget: null,
  lastValidDropTarget: null,
  hoveredColumnId: null,
  commitDropTarget: null,
};

let snapshot: TaskDragSessionSnapshot = { ...EMPTY };
const listeners = new Set<() => void>();

function notify() {
  for (const listener of listeners) {
    listener();
  }
}

export function getTaskDragSessionSnapshot(): TaskDragSessionSnapshot {
  return snapshot;
}

export function subscribeTaskDragSession(listener: () => void): () => void {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

export function beginTaskDragSession(
  taskId: string,
  sourceGroupId: string | null,
  initialDropTarget: TaskDragTarget | null
): void {
  snapshot = {
    draggingTaskId: taskId,
    sourceGroupId,
    dropTarget: initialDropTarget,
    lastValidDropTarget: initialDropTarget,
    hoveredColumnId: initialDropTarget?.groupId ?? null,
    commitDropTarget: null,
  };
  notify();
}

export function setTaskDragDropTarget(target: TaskDragTarget | null): void {
  if (taskDragTargetsEqual(snapshot.dropTarget, target)) return;
  snapshot = {
    ...snapshot,
    dropTarget: target,
    lastValidDropTarget: target ?? snapshot.lastValidDropTarget,
    hoveredColumnId: target?.groupId ?? snapshot.hoveredColumnId,
  };
  notify();
}

export function setTaskDragStickyTarget(
  columnId: string,
  target: TaskDragTarget
): void {
  if (
    taskDragTargetsEqual(snapshot.dropTarget, target) &&
    snapshot.hoveredColumnId === columnId
  ) {
    return;
  }
  snapshot = {
    ...snapshot,
    dropTarget: target,
    lastValidDropTarget: target,
    hoveredColumnId: columnId,
  };
  notify();
}

export function getTaskDragLastValidDropTarget(): TaskDragTarget | null {
  return snapshot.lastValidDropTarget;
}

export function freezeTaskDragCommitTarget(): TaskDragTarget | null {
  const frozen = snapshot.dropTarget ?? snapshot.lastValidDropTarget;
  snapshot = { ...snapshot, commitDropTarget: frozen };
  notify();
  return frozen;
}

export function getTaskDragCommitTarget(): TaskDragTarget | null {
  return (
    snapshot.commitDropTarget ??
    snapshot.dropTarget ??
    snapshot.lastValidDropTarget
  );
}

export function endTaskDragSession(): void {
  if (
    snapshot.draggingTaskId === null &&
    snapshot.sourceGroupId === null &&
    snapshot.dropTarget === null &&
    snapshot.lastValidDropTarget === null &&
    snapshot.hoveredColumnId === null &&
    snapshot.commitDropTarget === null
  ) {
    return;
  }
  snapshot = { ...EMPTY };
  notify();
}

export function isTaskDragging(taskId: string, groupId?: string): boolean {
  if (snapshot.draggingTaskId !== taskId) return false;
  if (groupId === undefined) return true;
  return snapshot.sourceGroupId === groupId;
}

export function isTaskDragSource(taskId: string, groupId: string): boolean {
  return snapshot.draggingTaskId === taskId && snapshot.sourceGroupId === groupId;
}

export function shouldShowActiveDropLine(
  groupId: string,
  beforeTaskId: string | null
): boolean {
  const target = snapshot.dropTarget;
  if (!target || target.showInsertionLine === false) return false;
  return (
    target.groupId === groupId &&
    target.zone === "active" &&
    target.beforeTaskId === beforeTaskId
  );
}

export function shouldShowCompletedDropLine(
  groupId: string,
  beforeTaskId: string | null
): boolean {
  const target = snapshot.dropTarget;
  if (!target || target.showInsertionLine === false) return false;
  return (
    target.groupId === groupId &&
    target.zone === "completed" &&
    target.beforeTaskId === beforeTaskId
  );
}

export function isSortedColumnDropHighlight(
  groupId: string,
  zone: "active" | "completed" = "active"
): boolean {
  const target = snapshot.dropTarget;
  return (
    target?.groupId === groupId &&
    target.zone === zone &&
    target.showInsertionLine === false
  );
}

export function isExternalTaskDragActive(): boolean {
  return snapshot.draggingTaskId !== null;
}
