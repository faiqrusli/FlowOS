export const TIMELINE_DRAG_ID_MIME = "application/x-flowos-schedule-id";
export const TIMELINE_DRAG_KIND_MIME = "application/x-flowos-schedule-kind";

export { QUICK_SCHEDULE_DRAWER_WIDTH_PX as TIMELINE_DRAWER_WIDTH_PX } from "./quick-schedule-task-list-width";

let timelineDropConsumed = false;

export function markTimelineDropConsumed() {
  timelineDropConsumed = true;
}

export function consumeTimelineDropConsumed(): boolean {
  const consumed = timelineDropConsumed;
  timelineDropConsumed = false;
  return consumed;
}

export function setBoardTaskDragData(
  event: { dataTransfer: DataTransfer },
  taskId: string
) {
  event.dataTransfer.setData(TIMELINE_DRAG_KIND_MIME, "task");
  event.dataTransfer.setData(TIMELINE_DRAG_ID_MIME, taskId);
  event.dataTransfer.setData("text/plain", taskId);
  setActiveTaskDragId(taskId);
}

let activeTaskDragId: string | null = null;
let activeTimelineDrag: { kind: "task" | "habit"; id: string } | null = null;
let quickScheduleOpen = false;

export function setActiveTimelineDrag(
  drag: { kind: "task" | "habit"; id: string } | null
) {
  activeTimelineDrag = drag;
}

export function getActiveTimelineDrag(): {
  kind: "task" | "habit";
  id: string;
} | null {
  return activeTimelineDrag;
}

export function setQuickScheduleOpen(open: boolean) {
  quickScheduleOpen = open;
}

export function isQuickScheduleOpen(): boolean {
  return quickScheduleOpen;
}

export function setActiveTaskDragId(taskId: string | null) {
  activeTaskDragId = taskId;
  if (!taskId && activeTimelineDrag?.kind === "task") {
    activeTimelineDrag = null;
  }
}

export function getActiveTaskDragId(): string | null {
  return activeTaskDragId;
}

export const TIMELINE_SCHEDULER_ATTR = "data-timeline-scheduler";
export const QUICK_SCHEDULE_INBOX_ATTR = "data-quick-schedule-inbox";
export const QUICK_SCHEDULE_INBOX_TAB_ATTR = "data-quick-schedule-inbox-tab";
export const QUICK_SCHEDULE_TIMELINE_BODY_ATTR = "data-quick-schedule-timeline-body";

export type QuickScheduleInboxDropZone = "unscheduled" | "later";

function resolveEventTargetElement(target: EventTarget | null): Element | null {
  if (target instanceof Element) return target;
  if (target instanceof Text) return target.parentElement;
  return null;
}

function isPointInsideRect(
  clientX: number,
  clientY: number,
  rect: DOMRect
): boolean {
  return (
    clientX >= rect.left &&
    clientX <= rect.right &&
    clientY >= rect.top &&
    clientY <= rect.bottom
  );
}

export function isPointerOverTimelineScheduler(
  clientX: number,
  clientY: number
): boolean {
  if (!quickScheduleOpen) return false;

  const scheduler = document.querySelector(`[${TIMELINE_SCHEDULER_ATTR}]`);
  if (!scheduler) return false;

  return isPointInsideRect(
    clientX,
    clientY,
    scheduler.getBoundingClientRect()
  );
}

export function isPointerOverQuickScheduleTimelineBody(
  clientX: number,
  clientY: number
): boolean {
  const timelineBody = document.querySelector(
    `[${QUICK_SCHEDULE_TIMELINE_BODY_ATTR}]`
  );
  if (!timelineBody) return false;

  return isPointInsideRect(
    clientX,
    clientY,
    timelineBody.getBoundingClientRect()
  );
}

export function isPointerOverQuickScheduleInbox(
  clientX: number,
  clientY: number
): boolean {
  const inbox = document.querySelector(`[${QUICK_SCHEDULE_INBOX_ATTR}]`);
  if (!inbox) return false;

  return isPointInsideRect(clientX, clientY, inbox.getBoundingClientRect());
}

export function resolveQuickScheduleInboxDropZoneFromTarget(
  target: EventTarget | null,
  fallback: QuickScheduleInboxDropZone = "unscheduled"
): QuickScheduleInboxDropZone | null {
  const element = resolveEventTargetElement(target);
  if (!element) return null;

  const tab = element.closest(`[${QUICK_SCHEDULE_INBOX_TAB_ATTR}]`);
  if (tab) {
    const value = tab.getAttribute(QUICK_SCHEDULE_INBOX_TAB_ATTR);
    if (value === "unscheduled" || value === "later") {
      return value;
    }
  }

  if (element.closest(`[${QUICK_SCHEDULE_INBOX_ATTR}]`)) {
    return fallback;
  }

  return null;
}

export function resolveQuickScheduleInboxDropZoneAtPoint(
  clientX: number,
  clientY: number,
  fallback: QuickScheduleInboxDropZone = "unscheduled"
): QuickScheduleInboxDropZone | null {
  if (!isPointerOverQuickScheduleInbox(clientX, clientY)) return null;

  const target = document.elementFromPoint(clientX, clientY);
  return resolveQuickScheduleInboxDropZoneFromTarget(target, fallback);
}
