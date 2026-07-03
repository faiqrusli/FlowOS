import { resolveEventTargetElement } from "@/lib/task-detail-menu-coordinator";
import type { TaskAlertBeforeValue } from "@/lib/task-alert-before-options";
import {
  applyClearAlert,
  applyPresetAlert,
  applySilentAlert,
} from "@/lib/task-alert-before-options";
import type { PlanningState } from "@/types/task";

export type TaskDetailMenuActionHandlers = {
  onDuplicate: () => void;
  onDelete: () => void;
  onMoveToGroup: (groupId: string) => void;
  onAddToToday?: () => void;
  onSetPlanningState?: (planningState: PlanningState) => void;
  onSetAlertBefore: (updates: TaskAlertBeforeValue) => void;
  onRequestCreateGroup?: () => void;
  onOpenPlanningSubmenu: () => void;
  onOpenMoveSubmenu: () => void;
  onOpenAlertSubmenu: () => void;
};

export function dispatchTaskMenuAction(
  action: string,
  handlers: TaskDetailMenuActionHandlers
): void {
  if (action === "submenu-planning") {
    handlers.onOpenPlanningSubmenu();
    return;
  }

  if (action === "submenu-move") {
    handlers.onOpenMoveSubmenu();
    return;
  }

  if (action === "submenu-alert") {
    handlers.onOpenAlertSubmenu();
    return;
  }

  if (action === "duplicate") {
    handlers.onDuplicate();
    return;
  }

  if (action === "delete") {
    handlers.onDelete();
    return;
  }

  if (action === "add-to-today") {
    handlers.onAddToToday?.();
    return;
  }

  if (action === "create-group") {
    handlers.onRequestCreateGroup?.();
    return;
  }

  if (action === "alert:silent") {
    handlers.onSetAlertBefore(applySilentAlert());
    return;
  }

  if (action === "alert:clear") {
    handlers.onSetAlertBefore(applyClearAlert());
    return;
  }

  if (action.startsWith("alert:")) {
    const minutes = Number(action.slice("alert:".length));
    if (!Number.isNaN(minutes) && minutes > 0) {
      handlers.onSetAlertBefore(applyPresetAlert(minutes));
    }
    return;
  }

  if (action.startsWith("planning:")) {
    handlers.onSetPlanningState?.(
      action.slice("planning:".length) as PlanningState
    );
    return;
  }

  if (action.startsWith("move:")) {
    handlers.onMoveToGroup(action.slice("move:".length));
  }
}

export function bindTaskDetailMenuActions(
  menu: HTMLElement,
  getHandlers: () => TaskDetailMenuActionHandlers
): () => void {
  function handlePointerDown(event: PointerEvent) {
    const element = resolveEventTargetElement(event.target);
    if (!element || !menu.contains(element)) return;

    const button = element.closest("[data-task-menu-action]");
    if (!(button instanceof HTMLButtonElement) || !menu.contains(button)) {
      return;
    }

    event.preventDefault();
    event.stopPropagation();

    const action = button.dataset.taskMenuAction;
    if (!action) return;

    dispatchTaskMenuAction(action, getHandlers());
  }

  menu.addEventListener("pointerdown", handlePointerDown, true);
  return () => menu.removeEventListener("pointerdown", handlePointerDown, true);
}
