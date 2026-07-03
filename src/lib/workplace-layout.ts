/** Fixed workplace timeline width — does not change when the global sidebar expands. */
export const WORKPLACE_TIMELINE_WIDTH_PX = 368;

/** Gap between the workplace timeline and the global right sidebar (px). */
export const WORKPLACE_TIMELINE_RIGHT_GAP_PX = 8;

/** @deprecated Use WORKPLACE_TIMELINE_WIDTH_PX */
export const WORKPLACE_TIMELINE_WIDTH_EXTRA_PX = 0;

/** Main dashboard grid: left narrower, focus wider. */
export const WORKPLACE_DASHBOARD_GRID_CLASS =
  "grid min-h-0 min-w-0 flex-1 grid-cols-[minmax(0,0.32fr)_minmax(0,0.68fr)] grid-rows-[auto_minmax(0,1fr)_minmax(0,0.56fr)] gap-2";

/** @deprecated Replaced by WORKPLACE_DASHBOARD_GRID_CLASS */
export const WORKPLACE_LEFT_COLUMN_CLASS = "w-[min(300px,26vw)]";

/** @deprecated Replaced by grid cell sizing */
export const WORKPLACE_FOCUS_COLUMN_CLASS = "min-h-0 flex flex-col";
