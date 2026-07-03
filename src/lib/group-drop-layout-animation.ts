import { beginGroupDragCancel, clearGroupDragCancel } from "@/lib/group-drag-cancel";
import { beginGroupDropReveal, clearGroupDropReveal } from "@/lib/group-drop-reveal";
import type { DropBeforeId } from "@/lib/list-drag-utils";

const PUSH_MS = 220;
const CANCEL_PUSH_MS = 180;
const SLIDE_OFFSET_PX = 14;

const activeElements = new Set<HTMLElement>();

function clearElementAnimation(el: HTMLElement) {
  el.style.transform = "";
  el.style.transition = "";
  el.style.willChange = "";
}

export function clearGroupDropLayoutAnimation(): void {
  for (const el of activeElements) {
    clearElementAnimation(el);
  }
  activeElements.clear();
  clearGroupDropReveal();
  clearGroupDragCancel();
}

function resolveGroupInsertIndex(
  groupIds: string[],
  draggingId: string,
  beforeId: DropBeforeId
): number {
  const without = groupIds.filter((id) => id !== draggingId);
  if (beforeId === null) return without.length;
  const index = without.indexOf(beforeId);
  return index === -1 ? without.length : index;
}

export function resolveGroupCancelSlideX(
  groupIds: string[],
  groupId: string,
  initialBeforeId: DropBeforeId,
  currentBeforeId: DropBeforeId
): number {
  const fromIndex = resolveGroupInsertIndex(groupIds, groupId, initialBeforeId);
  const toIndex = resolveGroupInsertIndex(groupIds, groupId, currentBeforeId);
  if (toIndex > fromIndex) return SLIDE_OFFSET_PX;
  if (toIndex < fromIndex) return -SLIDE_OFFSET_PX;
  return 0;
}

export function captureGroupColumnLayout(): Map<string, DOMRect> {
  const snapshot = new Map<string, DOMRect>();

  document
    .querySelectorAll<HTMLElement>("[data-task-group-board-slot]")
    .forEach((el) => {
      const groupId = el.getAttribute("data-task-group-board-slot");
      if (!groupId) return;
      snapshot.set(groupId, el.getBoundingClientRect());
    });

  return snapshot;
}

/** Push — neighbors slide horizontally into their new slots (FLIP). */
function flipGroupColumns(
  before: Map<string, DOMRect>,
  options?: { skipGroupId?: string; durationMs?: number }
): void {
  const durationMs = options?.durationMs ?? PUSH_MS;
  const skipGroupId = options?.skipGroupId;

  for (const [groupId, oldRect] of before) {
    if (skipGroupId && groupId === skipGroupId) continue;

    const el = document.querySelector<HTMLElement>(
      `[data-task-group-board-slot="${groupId}"]`
    );
    if (!el) continue;

    const newRect = el.getBoundingClientRect();
    const dx = oldRect.left - newRect.left;
    const dy = oldRect.top - newRect.top;

    if (Math.abs(dx) < 0.5 && Math.abs(dy) < 0.5) continue;

    el.style.transform = `translate3d(${dx}px, ${dy}px, 0)`;
    el.style.transition = "none";
    el.style.willChange = "transform";
    activeElements.add(el);

    requestAnimationFrame(() => {
      el.style.transition = `transform ${durationMs}ms cubic-bezier(0.22, 1, 0.36, 1)`;
      el.style.transform = "";

      const cleanup = () => {
        el.removeEventListener("transitionend", cleanup);
        clearElementAnimation(el);
        activeElements.delete(el);
      };

      el.addEventListener("transitionend", cleanup);
      window.setTimeout(cleanup, durationMs + 40);
    });
  }
}

function resolveRevealSlideX(
  before: Map<string, DOMRect>,
  revealedGroupId: string
): number {
  const oldRect = before.get(revealedGroupId);
  const el = document.querySelector<HTMLElement>(
    `[data-task-group-board-slot="${revealedGroupId}"]`
  );

  if (!el) return SLIDE_OFFSET_PX;

  if (!oldRect) {
    return SLIDE_OFFSET_PX;
  }

  const newRect = el.getBoundingClientRect();
  return oldRect.left < newRect.left ? -SLIDE_OFFSET_PX : SLIDE_OFFSET_PX;
}

/** Push all columns that shifted (e.g. Quick Schedule drawer resize). */
export function animateGroupColumnLayoutPush(before: Map<string, DOMRect>): void {
  clearGroupDropLayoutAnimation();

  requestAnimationFrame(() => {
    requestAnimationFrame(() => {
      flipGroupColumns(before);
    });
  });
}

/** Push neighbors + slide in the revealed column (drop, reorder, or new group). */
export function animateGroupDropLayout(
  before: Map<string, DOMRect>,
  options: { droppedGroupId: string }
): void {
  clearGroupDropLayoutAnimation();

  requestAnimationFrame(() => {
    requestAnimationFrame(() => {
      const slideX = resolveRevealSlideX(before, options.droppedGroupId);
      flipGroupColumns(before, { skipGroupId: options.droppedGroupId });
      beginGroupDropReveal(options.droppedGroupId, slideX);
    });
  });
}

/** Esc cancel — columns push back and the source column settles into place. */
export function animateGroupDragCancel(
  before: Map<string, DOMRect>,
  options: { groupId: string; slideX: number }
): void {
  clearGroupDropLayoutAnimation();

  requestAnimationFrame(() => {
    requestAnimationFrame(() => {
      flipGroupColumns(before, { durationMs: CANCEL_PUSH_MS });
      beginGroupDragCancel(options.groupId, options.slideX);
    });
  });
}
