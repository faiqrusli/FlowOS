/** Workplace Timeline preferred width (spec: 300–360px). */
export const WORKPLACE_TIMELINE_WIDTH_PX = 320;

/** Gap between the workplace timeline and the global right sidebar (px). */
export const WORKPLACE_TIMELINE_RIGHT_GAP_PX = 0;

/** @deprecated Use WORKPLACE_TIMELINE_WIDTH_PX */
export const WORKPLACE_TIMELINE_WIDTH_EXTRA_PX = 0;

/** Collapsed Next Up queue rail width (36–44px). */
export const WORKPLACE_NEXT_UP_RAIL_PX = 40;

/**
 * Expanded Next Up queue panel — prefer CSS clamp in the drawer;
 * this constant is the preferred midpoint for layout math.
 */
export const WORKPLACE_NEXT_UP_PANEL_PX = 320;

/** CSS width for the open Queue panel (spec §9). */
export const WORKPLACE_NEXT_UP_PANEL_WIDTH_CSS = "clamp(300px, 22vw, 360px)";

/**
 * @deprecated Today uses a focus-first flex column + Next Up side panel.
 * Kept for any residual references.
 */
export const WORKPLACE_DASHBOARD_GRID_CLASS =
  "grid min-h-0 min-w-0 flex-1 grid-cols-[minmax(0,0.32fr)_minmax(0,0.68fr)] grid-rows-[auto_minmax(0,1fr)_minmax(0,0.56fr)] gap-2";

/** @deprecated Replaced by WORKPLACE_DASHBOARD_GRID_CLASS */
export const WORKPLACE_LEFT_COLUMN_CLASS = "w-[min(300px,26vw)]";

/** @deprecated Replaced by grid cell sizing */
export const WORKPLACE_FOCUS_COLUMN_CLASS = "min-h-0 flex flex-col";
