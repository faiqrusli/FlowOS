import { getStorageItem, setStorageItem } from "@/lib/safe-storage";

export const GLOBAL_RIGHT_SIDEBAR_COLLAPSED_WIDTH_PX = 52;
/** Flush to the viewport edge — no outer inset. */
export const GLOBAL_RIGHT_RAIL_OUTER_GUTTER_PX = 0;
/** Layout reserve for the collapsed rail + outer gutter. */
export const GLOBAL_RIGHT_SIDEBAR_LAYOUT_RESERVE_PX =
  GLOBAL_RIGHT_SIDEBAR_COLLAPSED_WIDTH_PX + GLOBAL_RIGHT_RAIL_OUTER_GUTTER_PX;
export const GLOBAL_RIGHT_SIDEBAR_DEFAULT_WIDTH_PX = 360;
export const GLOBAL_RIGHT_SIDEBAR_MIN_WIDTH_PX = 280;
export const GLOBAL_RIGHT_SIDEBAR_MAX_WIDTH_PX = 520;

/** Single persisted width shared by Details, Notes, and Reflection. */
const WIDTH_STORAGE_KEY = "flowos-global-right-sidebar-width";
const EXPANDED_STORAGE_KEY = "flowos-global-right-sidebar-expanded";
const PANEL_STORAGE_KEY = "flowos-global-right-sidebar-panel";

export type GlobalRightSidebarPanel = "details" | "notes" | "reflection";

export function readPersistedSidebarWidth(): number {
  const raw = getStorageItem(WIDTH_STORAGE_KEY);
  const parsed = raw ? Number.parseInt(raw, 10) : Number.NaN;
  if (!Number.isFinite(parsed)) return GLOBAL_RIGHT_SIDEBAR_DEFAULT_WIDTH_PX;

  return Math.min(
    GLOBAL_RIGHT_SIDEBAR_MAX_WIDTH_PX,
    Math.max(GLOBAL_RIGHT_SIDEBAR_MIN_WIDTH_PX, parsed)
  );
}

export function writePersistedSidebarWidth(width: number): void {
  setStorageItem(WIDTH_STORAGE_KEY, String(width));
}

export function readPersistedSidebarExpanded(): boolean {
  return getStorageItem(EXPANDED_STORAGE_KEY) === "true";
}

export function writePersistedSidebarExpanded(expanded: boolean): void {
  setStorageItem(EXPANDED_STORAGE_KEY, String(expanded));
}

export function readPersistedSidebarPanel(): GlobalRightSidebarPanel {
  const value = getStorageItem(PANEL_STORAGE_KEY);
  if (value === "notes" || value === "reflection" || value === "details") {
    return value;
  }
  return "details";
}

export function writePersistedSidebarPanel(panel: GlobalRightSidebarPanel): void {
  setStorageItem(PANEL_STORAGE_KEY, panel);
}
