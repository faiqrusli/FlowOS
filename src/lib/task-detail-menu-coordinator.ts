export type TaskDetailMenuAnchor = {
  taskId: string;
  groupId: string;
  zone: "active" | "completed";
};

type TaskDetailMenuListener = (activeAnchor: TaskDetailMenuAnchor | null) => void;

let activeAnchor: TaskDetailMenuAnchor | null = null;
const listeners = new Set<TaskDetailMenuListener>();
const contextMenuClosers = new Set<() => void>();
let documentListenersAttached = false;
let globalContextMenuListenerAttached = false;

function anchorKey(anchor: TaskDetailMenuAnchor): string {
  return `${anchor.taskId}:${anchor.groupId}:${anchor.zone}`;
}

function anchorsEqual(
  a: TaskDetailMenuAnchor | null,
  b: TaskDetailMenuAnchor | null
): boolean {
  if (a === b) return true;
  if (!a || !b) return false;
  return anchorKey(a) === anchorKey(b);
}

function emit() {
  for (const listener of listeners) {
    listener(activeAnchor);
  }
}

export function resolveEventTargetElement(
  target: EventTarget | null
): Element | null {
  if (target instanceof Element) return target;
  if (target instanceof Text) return target.parentElement;
  return null;
}

export function isEventTargetInside(
  target: EventTarget | null,
  selectors: string[]
): boolean {
  const element = resolveEventTargetElement(target);
  if (!element) return false;
  return selectors.some((selector) => element.closest(selector));
}

export function isTaskDetailMenuTarget(target: EventTarget | null): boolean {
  return isEventTargetInside(target, [
    "[data-task-detail-menu]",
    "[data-task-detail-submenu]",
  ]);
}

function closeRegisteredContextMenus() {
  for (const closer of contextMenuClosers) {
    closer();
  }
}

export function closeAllContextMenus() {
  closeRegisteredContextMenus();
  if (activeAnchor) {
    activeAnchor = null;
    emit();
    syncDocumentListeners();
  }
}

function handleGlobalContextMenu() {
  closeAllContextMenus();
}

function ensureGlobalContextMenuListener() {
  if (globalContextMenuListenerAttached) return;
  document.addEventListener("contextmenu", handleGlobalContextMenu, true);
  globalContextMenuListenerAttached = true;
}

function handleDocumentContextMenu(event: Event) {
  if (!activeAnchor) return;
  const target = event.target;
  if (isTaskDetailMenuTarget(target)) return;
  if (target instanceof Element && target.closest("[data-task-row]")) return;
  setActiveTaskDetailMenuAnchor(null);
}

function handlePointerDownOutside(event: Event) {
  if (!activeAnchor) return;
  if (isTaskDetailMenuTarget(event.target)) return;
  setActiveTaskDetailMenuAnchor(null);
}

function syncDocumentListeners() {
  if (activeAnchor && !documentListenersAttached) {
    document.addEventListener("contextmenu", handleDocumentContextMenu, true);
    document.addEventListener("pointerdown", handlePointerDownOutside, true);
    documentListenersAttached = true;
    return;
  }

  if (!activeAnchor && documentListenersAttached) {
    document.removeEventListener("contextmenu", handleDocumentContextMenu, true);
    document.removeEventListener("pointerdown", handlePointerDownOutside, true);
    documentListenersAttached = false;
  }
}

export function getActiveTaskDetailMenuAnchor() {
  return activeAnchor;
}

export function isActiveTaskDetailMenuAnchor(anchor: TaskDetailMenuAnchor): boolean {
  return anchorsEqual(activeAnchor, anchor);
}

export function subscribeTaskDetailMenu(
  listener: TaskDetailMenuListener
): () => void {
  listeners.add(listener);
  listener(activeAnchor);
  return () => {
    listeners.delete(listener);
  };
}

export function setActiveTaskDetailMenuAnchor(
  anchor: TaskDetailMenuAnchor | null
) {
  if (anchorsEqual(activeAnchor, anchor)) return;
  if (anchor !== null) {
    closeRegisteredContextMenus();
  }
  activeAnchor = anchor;
  emit();
  syncDocumentListeners();
}

export function closeTaskDetailMenus() {
  setActiveTaskDetailMenuAnchor(null);
}

export function registerContextMenuCloser(closer: () => void): () => void {
  ensureGlobalContextMenuListener();
  contextMenuClosers.add(closer);
  return () => {
    contextMenuClosers.delete(closer);
  };
}

export function registerTimelineContextMenuCloser(closer: () => void): () => void {
  return registerContextMenuCloser(closer);
}
