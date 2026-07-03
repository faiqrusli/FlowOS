const CANCEL_MS = 180;

let cancelGroupId: string | null = null;
let cancelSlideX = 0;
let clearTimer: ReturnType<typeof setTimeout> | null = null;
const listeners = new Set<() => void>();

function notify() {
  for (const listener of listeners) {
    listener();
  }
}

export function subscribeGroupDragCancel(listener: () => void): () => void {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

export function isGroupDragCanceling(groupId: string): boolean {
  return cancelGroupId === groupId;
}

export function getGroupDragCancelSlideX(groupId: string): number {
  return cancelGroupId === groupId ? cancelSlideX : 0;
}

export function beginGroupDragCancel(groupId: string, slideX: number): void {
  if (clearTimer !== null) {
    clearTimeout(clearTimer);
    clearTimer = null;
  }
  cancelGroupId = groupId;
  cancelSlideX = slideX;
  notify();
  clearTimer = setTimeout(() => {
    cancelGroupId = null;
    clearTimer = null;
    notify();
  }, CANCEL_MS);
}

export function clearGroupDragCancel(): void {
  if (clearTimer !== null) {
    clearTimeout(clearTimer);
    clearTimer = null;
  }
  if (cancelGroupId === null) return;
  cancelGroupId = null;
  notify();
}

export const GROUP_DRAG_CANCEL_MS = CANCEL_MS;
