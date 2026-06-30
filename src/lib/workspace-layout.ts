/** Horizontal inset for main workspace surfaces (Sunsama-style balanced gutters). */
export const WORKSPACE_GUTTER_X_PX = 20;

export const WORKSPACE_GUTTER_CLASS = "px-5 sm:px-6";

export const WORKSPACE_GUTTER_LEFT_CLASS = "pl-5 sm:pl-6";

export const WORKSPACE_GUTTER_RIGHT_CLASS = "pr-5 sm:pr-6";

/** Narrower gutters inside Quick Schedule drawer. */
export const WORKSPACE_GUTTER_COMPACT_CLASS = "px-3";

export const TIMELINE_TIME_COLUMN_CLASS = "w-[3.25rem]";

export function timelineGridGutterClass(drawerMode: boolean): string {
  return drawerMode ? "px-2" : "px-0";
}
