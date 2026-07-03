const FLIP_MS = 220;

const activeElements = new Set<HTMLElement>();

function clearElementAnimation(el: HTMLElement) {
  el.style.transform = "";
  el.style.transition = "";
  el.style.willChange = "";
}

export function clearTaskDropLayoutAnimation(): void {
  for (const el of activeElements) {
    clearElementAnimation(el);
  }
  activeElements.clear();
}

export function captureTaskSlotLayout(groupIds: Array<string | null>): Map<string, DOMRect> {
  const snapshot = new Map<string, DOMRect>();

  for (const groupId of new Set(groupIds.filter(Boolean) as string[])) {
    const column = document.querySelector(
      `[data-task-group-column="${groupId}"]`
    );
    if (!column) continue;

    column.querySelectorAll<HTMLElement>("[data-task-board-slot]").forEach((el) => {
      const taskId = el.getAttribute("data-task-board-slot");
      if (!taskId) return;
      snapshot.set(taskId, el.getBoundingClientRect());
    });
  }

  return snapshot;
}

export function animateTaskDropLayout(
  before: Map<string, DOMRect>,
  options: { droppedTaskId: string }
): void {
  clearTaskDropLayoutAnimation();

  requestAnimationFrame(() => {
    requestAnimationFrame(() => {
      for (const [taskId, oldRect] of before) {
        if (taskId === options.droppedTaskId) continue;

        const el = document.querySelector<HTMLElement>(
          `[data-task-board-slot="${taskId}"]`
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
          el.style.transition = `transform ${FLIP_MS}ms cubic-bezier(0.22, 1, 0.36, 1)`;
          el.style.transform = "";

          const cleanup = () => {
            el.removeEventListener("transitionend", cleanup);
            clearElementAnimation(el);
            activeElements.delete(el);
          };

          el.addEventListener("transitionend", cleanup);
          window.setTimeout(cleanup, FLIP_MS + 40);
        });
      }
    });
  });
}
