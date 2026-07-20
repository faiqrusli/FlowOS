/**
 * Shell spacing — two systems (do not merge):
 *
 * 1. Gutter — gap between left/right rails and the workspace canvas.
 * 2. Page inset — where titles, toolbars, and cards begin inside the workspace.
 *
 * Rhythm: gutter 8 → page inset 16 → section 24 → content
 * (32px inset stacked on gutter read as one oversized void.)
 */

/** Rail ↔ workspace attachment gap. */
export const WORKSPACE_GUTTER_X_PX = 8;

export const WORKSPACE_GUTTER_CLASS = "px-2";
export const WORKSPACE_GUTTER_LEFT_CLASS = "pl-2";
export const WORKSPACE_GUTTER_RIGHT_CLASS = "pr-2";

/** Internal workspace content origin — titles / toolbars / primary cards. */
export const WORKSPACE_PAGE_INSET_X_PX = 16;
export const WORKSPACE_PAGE_INSET_Y_PX = 24;

export const WORKSPACE_PAGE_INSET_X_CLASS = "px-4";
export const WORKSPACE_PAGE_INSET_LEFT_CLASS = "pl-4";
export const WORKSPACE_PAGE_INSET_RIGHT_CLASS = "pr-4";
export const WORKSPACE_PAGE_INSET_Y_CLASS = "py-6";

/** Title → toolbar → primary content chapter gap. */
export const WORKSPACE_SECTION_GAP_PX = 24;
export const WORKSPACE_SECTION_GAP_CLASS = "space-y-6";

/** Narrower gutters inside Quick Schedule drawer. */
export const WORKSPACE_GUTTER_COMPACT_CLASS = "px-3";

export const TIMELINE_TIME_COLUMN_CLASS = "w-[3.25rem]";

/** Drawer keeps a compact inset; workplace uses a slightly roomier gutter. */
export function timelineGridGutterClass(
  drawerMode: boolean,
  options?: { flushRight?: boolean },
): string {
  if (!drawerMode) return "px-0";
  // Workplace: even inset so lines/cards/zoom clear the scrollbar slightly.
  if (options?.flushRight) return "px-0.5";
  return "px-2";
}
