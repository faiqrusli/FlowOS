export const GLOBAL_RIGHT_SIDEBAR_COLLAPSED_WIDTH_PX = 52;
export const GLOBAL_RIGHT_SIDEBAR_DEFAULT_WIDTH_PX = 360;
export const GLOBAL_RIGHT_SIDEBAR_MIN_WIDTH_PX = 280;
export const GLOBAL_RIGHT_SIDEBAR_MAX_WIDTH_PX = 520;

const WIDTH_STORAGE_KEY = "flowos-global-right-sidebar-width";
const EXPANDED_STORAGE_KEY = "flowos-global-right-sidebar-expanded";
const PANEL_STORAGE_KEY = "flowos-global-right-sidebar-panel";

export type GlobalRightSidebarPanel = "details" | "notes" | "reflection";

export function readPersistedSidebarWidth(): number {
  if (typeof window === "undefined") {
    return GLOBAL_RIGHT_SIDEBAR_DEFAULT_WIDTH_PX;
  }

  const raw = window.localStorage.getItem(WIDTH_STORAGE_KEY);
  const parsed = raw ? Number.parseInt(raw, 10) : Number.NaN;
  if (!Number.isFinite(parsed)) return GLOBAL_RIGHT_SIDEBAR_DEFAULT_WIDTH_PX;

  return Math.min(
    GLOBAL_RIGHT_SIDEBAR_MAX_WIDTH_PX,
    Math.max(GLOBAL_RIGHT_SIDEBAR_MIN_WIDTH_PX, parsed)
  );
}

export function writePersistedSidebarWidth(width: number): void {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(WIDTH_STORAGE_KEY, String(width));
}

export function readPersistedSidebarExpanded(): boolean {
  if (typeof window === "undefined") return false;
  return window.localStorage.getItem(EXPANDED_STORAGE_KEY) === "true";
}

export function writePersistedSidebarExpanded(expanded: boolean): void {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(EXPANDED_STORAGE_KEY, String(expanded));
}

export function readPersistedSidebarPanel(): GlobalRightSidebarPanel {
  if (typeof window === "undefined") return "details";
  const value = window.localStorage.getItem(PANEL_STORAGE_KEY);
  if (value === "notes" || value === "reflection" || value === "details") {
    return value;
  }
  return "details";
}

export function writePersistedSidebarPanel(panel: GlobalRightSidebarPanel): void {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(PANEL_STORAGE_KEY, panel);
}
