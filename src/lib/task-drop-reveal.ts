const REVEAL_MS = 200;

let revealTaskId: string | null = null;
let clearTimer: ReturnType<typeof setTimeout> | null = null;
const listeners = new Set<() => void>();

function notify() {
  for (const listener of listeners) {
    listener();
  }
}

export function subscribeTaskDropReveal(listener: () => void): () => void {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

export function isTaskDropRevealing(taskId: string): boolean {
  return revealTaskId === taskId;
}

export function beginTaskDropReveal(taskId: string): void {
  if (clearTimer !== null) {
    clearTimeout(clearTimer);
    clearTimer = null;
  }
  revealTaskId = taskId;
  notify();
  clearTimer = setTimeout(() => {
    revealTaskId = null;
    clearTimer = null;
    notify();
  }, REVEAL_MS);
}

export function clearTaskDropReveal(): void {
  if (clearTimer !== null) {
    clearTimeout(clearTimer);
    clearTimer = null;
  }
  if (revealTaskId === null) return;
  revealTaskId = null;
  notify();
}
