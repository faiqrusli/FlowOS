import type { DropBeforeId } from "@/lib/list-drag-utils";

export type GroupDragSessionSnapshot = {
  draggingGroupId: string | null;
  dropBeforeGroupId: DropBeforeId;
  reorderBlocked: boolean;
  reorderBlockedTargetId: string | null;
  blockedTooltip: { x: number; y: number } | null;
};

const EMPTY: GroupDragSessionSnapshot = {
  draggingGroupId: null,
  dropBeforeGroupId: null,
  reorderBlocked: false,
  reorderBlockedTargetId: null,
  blockedTooltip: null,
};

let snapshot: GroupDragSessionSnapshot = { ...EMPTY };
const listeners = new Set<() => void>();

function notify() {
  for (const listener of listeners) {
    listener();
  }
}

export function subscribeGroupDragSession(listener: () => void): () => void {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

export function getGroupDragSessionSnapshot(): GroupDragSessionSnapshot {
  return snapshot;
}

export function beginGroupDragSession(
  groupId: string,
  dropBeforeGroupId: DropBeforeId
): void {
  snapshot = {
    draggingGroupId: groupId,
    dropBeforeGroupId,
    reorderBlocked: false,
    reorderBlockedTargetId: null,
    blockedTooltip: null,
  };
  notify();
}

export function setGroupDragFeedback(input: {
  dropBeforeGroupId: DropBeforeId;
  reorderBlocked: boolean;
  reorderBlockedTargetId: string | null;
  blockedTooltip: { x: number; y: number } | null;
}): void {
  if (
    snapshot.dropBeforeGroupId === input.dropBeforeGroupId &&
    snapshot.reorderBlocked === input.reorderBlocked &&
    snapshot.reorderBlockedTargetId === input.reorderBlockedTargetId &&
    snapshot.blockedTooltip?.x === input.blockedTooltip?.x &&
    snapshot.blockedTooltip?.y === input.blockedTooltip?.y
  ) {
    return;
  }

  snapshot = {
    ...snapshot,
    dropBeforeGroupId: input.dropBeforeGroupId,
    reorderBlocked: input.reorderBlocked,
    reorderBlockedTargetId: input.reorderBlockedTargetId,
    blockedTooltip: input.blockedTooltip,
  };
  notify();
}

export function endGroupDragSession(): void {
  if (snapshot.draggingGroupId === null) return;
  snapshot = { ...EMPTY };
  notify();
}

export function isGroupDragSource(groupId: string): boolean {
  return snapshot.draggingGroupId === groupId;
}

export function isGroupDragActive(): boolean {
  return snapshot.draggingGroupId !== null;
}

export function shouldShowGroupDropMarker(groupId: string): boolean {
  if (!snapshot.draggingGroupId || snapshot.reorderBlocked) return false;
  if (snapshot.draggingGroupId === groupId) return false;
  return snapshot.dropBeforeGroupId === groupId;
}

export function shouldShowGroupDropMarkerAtEnd(): boolean {
  if (!snapshot.draggingGroupId || snapshot.reorderBlocked) return false;
  return snapshot.dropBeforeGroupId === null;
}

export function isGroupReorderBlockTarget(groupId: string): boolean {
  return (
    snapshot.reorderBlocked && snapshot.reorderBlockedTargetId === groupId
  );
}

export function getGroupDragBlockedTooltip(): {
  x: number;
  y: number;
} | null {
  return snapshot.blockedTooltip;
}

export function isGroupDragReorderBlocked(): boolean {
  return snapshot.reorderBlocked;
}
