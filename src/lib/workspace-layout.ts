/** Horizontal inset for main workspace surfaces — 40px standard. */
export const WORKSPACE_GUTTER_X_PX = 40;

export const WORKSPACE_GUTTER_CLASS = "px-10";

export const WORKSPACE_GUTTER_LEFT_CLASS = "pl-10";

export const WORKSPACE_GUTTER_RIGHT_CLASS = "pr-10";

/** Narrower gutters inside Quick Schedule drawer. */
export const WORKSPACE_GUTTER_COMPACT_CLASS = "px-3";

export const TIMELINE_TIME_COLUMN_CLASS = "w-[3.25rem]";

/** Drawer keeps a compact inset; workplace uses a slightly roomier gutter. */
export function timelineGridGutterClass(
  drawerMode: boolean,
  options?: { flushRight?: boolean }
): string {
  if (!drawerMode) return "px-0";
  // Workplace: even inset so lines/cards/zoom clear the scrollbar slightly.
  if (options?.flushRight) return "px-0.5";
  return "px-2";
}
