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
let quickScheduleOpen = false;

export function setQuickScheduleOpen(open: boolean) {
  quickScheduleOpen = open;
}

export function isQuickScheduleOpen(): boolean {
  return quickScheduleOpen;
}

export function setActiveTaskDragId(taskId: string | null) {
  activeTaskDragId = taskId;
}

export function getActiveTaskDragId(): string | null {
  return activeTaskDragId;
}

export const TIMELINE_SCHEDULER_ATTR = "data-timeline-scheduler";

export function isPointerOverTimelineScheduler(
  clientX: number,
  clientY: number
): boolean {
  if (!quickScheduleOpen) return false;

  const scheduler = document.querySelector(`[${TIMELINE_SCHEDULER_ATTR}]`);
  if (!scheduler) return false;

  const rect = scheduler.getBoundingClientRect();
  return (
    clientX >= rect.left &&
    clientX <= rect.right &&
    clientY >= rect.top &&
    clientY <= rect.bottom
  );
}
