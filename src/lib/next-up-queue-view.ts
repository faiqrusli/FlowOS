import type { NextUpListEntry } from "@/components/focus/next-up-queue-list";
import { taskQueueKey } from "@/lib/next-up-unified-order";

const REVEAL_CLASS = "workplace-next-up-reveal";
const REVEAL_MS = 1000;

/** Build taskId → 1-based position in the unified Next Up list. */
export function buildTaskQueuePositionMap(
  entries: NextUpListEntry[],
): Map<string, number> {
  const map = new Map<string, number>();
  entries.forEach((entry, index) => {
    if (entry.kind === "task") {
      map.set(entry.task.id, index + 1);
    }
  });
  return map;
}

export function nextUpRowSelectorForTask(taskId: string): string {
  return `[data-next-up-row="${taskQueueKey(taskId)}"]`;
}

/**
 * Smooth-scroll a Next Up queue row into view and flash a temporary highlight.
 * Does not permanently select the item.
 */
export function scrollAndHighlightNextUpTask(taskId: string): boolean {
  if (typeof document === "undefined") return false;

  const element = document.querySelector<HTMLElement>(
    nextUpRowSelectorForTask(taskId),
  );
  if (!element) return false;

  element.scrollIntoView({ behavior: "smooth", block: "center" });
  element.classList.remove(REVEAL_CLASS);
  // Restart CSS animation if re-triggered quickly.
  void element.offsetWidth;
  element.classList.add(REVEAL_CLASS);

  window.setTimeout(() => {
    element.classList.remove(REVEAL_CLASS);
  }, REVEAL_MS);

  return true;
}

/** Retry reveal after the drawer mounts (open animation / layout). */
export function revealNextUpTaskWhenReady(
  taskId: string,
  attempts = 8,
  delayMs = 50,
): void {
  if (typeof window === "undefined") return;

  const tryReveal = (remaining: number) => {
    if (scrollAndHighlightNextUpTask(taskId)) return;
    if (remaining <= 0) return;
    window.setTimeout(() => tryReveal(remaining - 1), delayMs);
  };

  requestAnimationFrame(() => {
    requestAnimationFrame(() => tryReveal(attempts));
  });
}
