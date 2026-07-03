import { useSyncExternalStore } from "react";
import { taskDragTargetsEqual, type TaskDragTarget } from "@/lib/task-drag-utils";

type DropTargetListener = () => void;

let activeTaskId: string | null = null;
let dropTarget: TaskDragTarget | null = null;

const activeListeners = new Set<DropTargetListener>();
const dropTargetListeners = new Set<DropTargetListener>();
const columnDropTargetListeners = new Map<string, Set<DropTargetListener>>();

function subscribeActive(listener: DropTargetListener) {
  activeListeners.add(listener);
  return () => activeListeners.delete(listener);
}

function subscribeDropTarget(listener: DropTargetListener) {
  dropTargetListeners.add(listener);
  return () => dropTargetListeners.delete(listener);
}

function subscribeColumnDropTarget(
  groupId: string,
  listener: DropTargetListener
) {
  let listeners = columnDropTargetListeners.get(groupId);
  if (!listeners) {
    listeners = new Set();
    columnDropTargetListeners.set(groupId, listeners);
  }
  listeners.add(listener);
  return () => {
    listeners!.delete(listener);
    if (listeners!.size === 0) columnDropTargetListeners.delete(groupId);
  };
}

function notifyActiveListeners() {
  activeListeners.forEach((listener) => listener());
}

function notifyDropTargetListeners(affectedGroupIds: string[]) {
  dropTargetListeners.forEach((listener) => listener());
  for (const groupId of affectedGroupIds) {
    columnDropTargetListeners.get(groupId)?.forEach((listener) => listener());
  }
}

export function getDragPreviewActiveTaskId(): string | null {
  return activeTaskId;
}

export function getDragPreviewDropTarget(): TaskDragTarget | null {
  return dropTarget;
}

export function getColumnDragPreviewDropTarget(
  groupId: string
): TaskDragTarget | null {
  const target = dropTarget;
  if (!target || target.groupId !== groupId) return null;
  return target;
}

export function setDragPreviewActiveTaskId(taskId: string | null) {
  if (activeTaskId === taskId) return;
  activeTaskId = taskId;
  notifyActiveListeners();
}

export function setDragPreviewDropTarget(next: TaskDragTarget | null) {
  if (taskDragTargetsEqual(dropTarget, next)) return;
  const affected = new Set<string>();
  if (dropTarget?.groupId) affected.add(dropTarget.groupId);
  if (next?.groupId) affected.add(next.groupId);
  dropTarget = next;
  notifyDropTargetListeners([...affected]);
}

export function clearDragPreview() {
  const affected = new Set<string>();
  if (dropTarget?.groupId) affected.add(dropTarget.groupId);
  activeTaskId = null;
  dropTarget = null;
  notifyActiveListeners();
  notifyDropTargetListeners([...affected]);
}

export function useDragPreviewActiveTaskId(): string | null {
  return useSyncExternalStore(
    subscribeActive,
    getDragPreviewActiveTaskId,
    getDragPreviewActiveTaskId
  );
}

export function useDragPreviewDropTarget(): TaskDragTarget | null {
  return useSyncExternalStore(
    subscribeDropTarget,
    getDragPreviewDropTarget,
    getDragPreviewDropTarget
  );
}

/** Re-renders only when this column's drop target slice changes. */
export function useColumnDragPreviewDropTarget(
  groupId: string
): TaskDragTarget | null {
  return useSyncExternalStore(
    (listener) => subscribeColumnDropTarget(groupId, listener),
    () => getColumnDragPreviewDropTarget(groupId),
    () => getColumnDragPreviewDropTarget(groupId)
  );
}

export function shouldPublishDropTargetPreview(
  prev: TaskDragTarget | null,
  next: TaskDragTarget | null,
  sourceGroupId: string | null
): boolean {
  if (!next) return prev !== null;
  if (!prev) return true;
  if (prev.groupId !== next.groupId || prev.zone !== next.zone) return true;

  // Insert line position is painted imperatively — skip React for slot-only changes.
  return false;
}
