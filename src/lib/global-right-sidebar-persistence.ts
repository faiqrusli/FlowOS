import {
  SHELL_UTILITY_RAIL_WIDTH_PX,
  SHELL_UTILITY_SIDEBAR_EXPANDED_WIDTH_PX,
} from "@/lib/shell-dimensions";

export const GLOBAL_RIGHT_SIDEBAR_COLLAPSED_WIDTH_PX = SHELL_UTILITY_RAIL_WIDTH_PX;
export const GLOBAL_RIGHT_SIDEBAR_DEFAULT_WIDTH_PX =
  SHELL_UTILITY_SIDEBAR_EXPANDED_WIDTH_PX;
/** Total expanded width floor (content + rail). */
export const GLOBAL_RIGHT_SIDEBAR_MIN_WIDTH_PX = 420;
export const GLOBAL_RIGHT_SIDEBAR_MAX_WIDTH_PX = 640;

const WIDTH_STORAGE_KEY = "flowos-global-right-sidebar-width";
/** Session-scoped — do not reopen panel on cold visit. */
const EXPANDED_SESSION_KEY = "flowos-global-right-sidebar-expanded-session";
const PANEL_STORAGE_KEY = "flowos-global-right-sidebar-panel";

export type GlobalRightSidebarPanel = "details" | "notes" | "reflection";

export function clampSidebarWidth(width: number): number {
  return Math.min(
    GLOBAL_RIGHT_SIDEBAR_MAX_WIDTH_PX,
    Math.max(GLOBAL_RIGHT_SIDEBAR_MIN_WIDTH_PX, width)
  );
}

export function readPersistedSidebarWidth(): number {
  if (typeof window === "undefined") {
    return GLOBAL_RIGHT_SIDEBAR_DEFAULT_WIDTH_PX;
  }

  const raw = window.localStorage.getItem(WIDTH_STORAGE_KEY);
  const parsed = raw ? Number.parseInt(raw, 10) : Number.NaN;
  if (!Number.isFinite(parsed)) return GLOBAL_RIGHT_SIDEBAR_DEFAULT_WIDTH_PX;

  return clampSidebarWidth(parsed);
}

export function writePersistedSidebarWidth(width: number): void {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(WIDTH_STORAGE_KEY, String(clampSidebarWidth(width)));
}

export function readPersistedSidebarExpanded(): boolean {
  if (typeof window === "undefined") return false;
  return window.sessionStorage.getItem(EXPANDED_SESSION_KEY) === "true";
}

export function writePersistedSidebarExpanded(expanded: boolean): void {
  if (typeof window === "undefined") return;
  window.sessionStorage.setItem(EXPANDED_SESSION_KEY, String(expanded));
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
