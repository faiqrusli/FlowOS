/** Width of the draggable divider between task list and timeline (px). */
export const QUICK_SCHEDULE_DIVIDER_WIDTH_PX = 1;

/** Fixed outer Quick Schedule drawer width. */
export const QUICK_SCHEDULE_DRAWER_WIDTH_PX = 560;

/** Minimum width reserved for the timeline column (px). */
export const QUICK_SCHEDULE_TIMELINE_WIDTH_MIN = 220;

/** Unscheduled / Later panel — user-resizable via the middle divider. */
export const QUICK_SCHEDULE_TASK_LIST_WIDTH_MIN = 180;
export const QUICK_SCHEDULE_TASK_LIST_WIDTH_MAX = 320;
export const QUICK_SCHEDULE_TASK_LIST_WIDTH_DEFAULT = 240;

const STORAGE_KEY = "flowos-quick-schedule-task-list-width";

let cachedWidth: number | null = null;

export function getQuickScheduleTaskListEffectiveMax(
  drawerWidth = QUICK_SCHEDULE_DRAWER_WIDTH_PX
): number {
  return Math.min(
    QUICK_SCHEDULE_TASK_LIST_WIDTH_MAX,
    drawerWidth -
      QUICK_SCHEDULE_TIMELINE_WIDTH_MIN -
      QUICK_SCHEDULE_DIVIDER_WIDTH_PX
  );
}

export function clampQuickScheduleTaskListWidth(
  width: number,
  drawerWidth = QUICK_SCHEDULE_DRAWER_WIDTH_PX
): number {
  const effectiveMax = getQuickScheduleTaskListEffectiveMax(drawerWidth);
  return Math.min(
    effectiveMax,
    Math.max(QUICK_SCHEDULE_TASK_LIST_WIDTH_MIN, Math.round(width))
  );
}

export function getQuickScheduleTaskListWidth(): number {
  if (cachedWidth !== null) return cachedWidth;
  if (typeof window === "undefined") {
    return QUICK_SCHEDULE_TASK_LIST_WIDTH_DEFAULT;
  }

  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed = Number(raw);
      if (Number.isFinite(parsed)) {
        cachedWidth = clampQuickScheduleTaskListWidth(parsed);
        return cachedWidth;
      }
    }
  } catch {
    // ignore storage errors
  }

  cachedWidth = QUICK_SCHEDULE_TASK_LIST_WIDTH_DEFAULT;
  return cachedWidth;
}

export function setQuickScheduleTaskListWidth(width: number): void {
  cachedWidth = clampQuickScheduleTaskListWidth(width);
  try {
    window.localStorage.setItem(STORAGE_KEY, String(cachedWidth));
  } catch {
    // ignore storage errors
  }
}

/** Documented layout limits for Quick Schedule (drawer mode). */
export function getQuickScheduleLayoutDimensions(
  drawerWidth = QUICK_SCHEDULE_DRAWER_WIDTH_PX
) {
  const taskListMax = getQuickScheduleTaskListEffectiveMax(drawerWidth);
  return {
    fullDrawerWidthPx: drawerWidth,
    taskListPanel: {
      minPx: QUICK_SCHEDULE_TASK_LIST_WIDTH_MIN,
      maxPx: taskListMax,
      defaultPx: QUICK_SCHEDULE_TASK_LIST_WIDTH_DEFAULT,
    },
    timelinePanel: {
      minPx: QUICK_SCHEDULE_TIMELINE_WIDTH_MIN,
      maxPx:
        drawerWidth -
        QUICK_SCHEDULE_TASK_LIST_WIDTH_MIN -
        QUICK_SCHEDULE_DIVIDER_WIDTH_PX,
      defaultPx:
        drawerWidth -
        QUICK_SCHEDULE_TASK_LIST_WIDTH_DEFAULT -
        QUICK_SCHEDULE_DIVIDER_WIDTH_PX,
    },
    dividerWidthPx: QUICK_SCHEDULE_DIVIDER_WIDTH_PX,
  } as const;
}
