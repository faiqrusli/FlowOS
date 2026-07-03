const REVEAL_MS = 220;

let revealGroupId: string | null = null;
let revealSlideX = -14;
let clearTimer: ReturnType<typeof setTimeout> | null = null;
const listeners = new Set<() => void>();

function notify() {
  for (const listener of listeners) {
    listener();
  }
}

export function subscribeGroupDropReveal(listener: () => void): () => void {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

export function isGroupDropRevealing(groupId: string): boolean {
  return revealGroupId === groupId;
}

export function getGroupDropRevealSlideX(groupId: string): number {
  return revealGroupId === groupId ? revealSlideX : 0;
}

/** Slide in — dropped column lands from the direction it was dragged. */
export function beginGroupDropReveal(groupId: string, slideX: number): void {
  if (clearTimer !== null) {
    clearTimeout(clearTimer);
    clearTimer = null;
  }
  revealGroupId = groupId;
  revealSlideX = slideX;
  notify();
  clearTimer = setTimeout(() => {
    revealGroupId = null;
    clearTimer = null;
    notify();
  }, REVEAL_MS);
}

export function clearGroupDropReveal(): void {
  if (clearTimer !== null) {
    clearTimeout(clearTimer);
    clearTimer = null;
  }
  if (revealGroupId === null) return;
  revealGroupId = null;
  notify();
}
