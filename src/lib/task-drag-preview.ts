const SNAP_BACK_MS = 180;

export type TaskDragPreviewBadge = {
  label: string;
  emoji?: string;
};

export type TaskDragPreviewData = {
  title: string;
  completed: boolean;
  metaPrimary?: string | null;
  badges?: TaskDragPreviewBadge[];
};

type PreviewState = {
  shell: HTMLDivElement;
  width: number;
  offsetX: number;
  offsetY: number;
  taskId: string;
};

let state: PreviewState | null = null;
let rafId: number | null = null;
let pendingX = 0;
let pendingY = 0;

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function buildPreviewInnerHtml(data: TaskDragPreviewData): string {
  const title = escapeHtml(data.title || "Untitled");
  const meta = data.metaPrimary ? escapeHtml(data.metaPrimary) : "";
  const badges = (data.badges ?? [])
    .map(
      (badge) =>
        `<span class="inline-flex max-w-[5rem] shrink-0 items-center gap-0.5 truncate rounded-full border border-border/35 bg-muted/50 px-1.5 py-0 text-[9px] font-medium text-foreground/85"><span aria-hidden>${escapeHtml(badge.emoji ?? "")}</span><span class="truncate">${escapeHtml(badge.label)}</span></span>`
    )
    .join("");
  const titleClass = data.completed
    ? "text-[13px] leading-4 line-through"
    : "text-sm leading-[18px]";

  return `
    <div class="flex min-w-0 select-none items-center gap-0 rounded-md border border-border/40 bg-background py-1 pl-0.5 pr-0.5 shadow-lg ring-1 ring-border/25">
      <div class="flex size-5 shrink-0 items-center justify-center text-muted-foreground">
        ${
          data.completed
            ? `<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="size-3.5 text-emerald-600"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><path d="m9 11 3 3L22 4"/></svg>`
            : `<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="size-3.5"><circle cx="12" cy="12" r="10"/></svg>`
        }
      </div>
      <div class="ml-1 min-w-0 flex-1 px-1">
        <span class="block truncate font-[520] text-foreground ${titleClass}">${title}</span>
        ${
          badges
            ? `<span class="mt-0.5 flex flex-wrap items-center gap-1">${badges}</span>`
            : ""
        }
        ${
          meta
            ? `<span class="mt-px block truncate text-[10px] leading-[11px] text-muted-foreground/80">${meta}</span>`
            : ""
        }
      </div>
    </div>
  `;
}

function applyTransform(x: number, y: number) {
  if (!state) return;
  state.shell.style.transform = `translate3d(${x - state.offsetX}px, ${y - state.offsetY}px, 0)`;
}

function flushPointerUpdate() {
  rafId = null;
  applyTransform(pendingX, pendingY);
}

export function createTaskDragPreview(
  taskId: string,
  data: TaskDragPreviewData,
  sourceRect: DOMRect,
  pointerX: number,
  pointerY: number
): void {
  destroyTaskDragPreview();

  const shell = document.createElement("div");
  shell.setAttribute("data-task-drag-preview", taskId);
  shell.style.position = "fixed";
  shell.style.left = "0";
  shell.style.top = "0";
  shell.style.width = `${sourceRect.width}px`;
  shell.style.zIndex = "1000";
  shell.style.pointerEvents = "none";
  shell.style.willChange = "transform";
  shell.style.opacity = "0.5";
  shell.innerHTML = buildPreviewInnerHtml(data);

  document.body.appendChild(shell);

  state = {
    shell,
    width: sourceRect.width,
    offsetX: pointerX - sourceRect.left,
    offsetY: pointerY - sourceRect.top,
    taskId,
  };

  applyTransform(pointerX, pointerY);
}

export function updateTaskDragPreviewPointer(pointerX: number, pointerY: number): void {
  if (!state) return;
  pendingX = pointerX;
  pendingY = pointerY;
  if (rafId !== null) return;
  rafId = requestAnimationFrame(flushPointerUpdate);
}

export function destroyTaskDragPreview(): void {
  if (rafId !== null) {
    cancelAnimationFrame(rafId);
    rafId = null;
  }
  state?.shell.remove();
  state = null;
}

export function animateTaskDragPreviewCancel(
  taskId: string,
  onComplete: () => void,
  groupId?: string | null
): void {
  if (rafId !== null) {
    cancelAnimationFrame(rafId);
    rafId = null;
  }

  if (!state || state.taskId !== taskId) {
    destroyTaskDragPreview();
    onComplete();
    return;
  }

  const source = findTaskRowElement(taskId, groupId);
  if (!source) {
    destroyTaskDragPreview();
    onComplete();
    return;
  }

  const rect = source.getBoundingClientRect();
  const { shell } = state;

  shell.style.transition = `transform ${SNAP_BACK_MS}ms ease-out, opacity ${SNAP_BACK_MS}ms ease-out`;
  shell.style.opacity = "0.35";
  shell.style.transform = `translate3d(${rect.left}px, ${rect.top}px, 0)`;

  let finished = false;
  const finish = () => {
    if (finished) return;
    finished = true;
    destroyTaskDragPreview();
    onComplete();
  };

  shell.addEventListener("transitionend", finish, { once: true });
  window.setTimeout(finish, SNAP_BACK_MS + 40);
}

export function findTaskRowElement(
  taskId: string,
  groupId?: string | null
): HTMLElement | null {
  if (groupId) {
    return document.querySelector<HTMLElement>(
      `[data-task-row="${taskId}"][data-task-board-group="${groupId}"]`
    );
  }
  return document.querySelector<HTMLElement>(`[data-task-row="${taskId}"]`);
}
