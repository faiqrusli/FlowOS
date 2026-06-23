const SIDEBAR_COLLAPSED_KEY = "flowos-sidebar-collapsed";

let cachedCollapsed: boolean | null = null;

export function getSidebarCollapsed(): boolean {
  if (cachedCollapsed !== null) return cachedCollapsed;
  if (typeof window === "undefined") return false;

  try {
    cachedCollapsed = localStorage.getItem(SIDEBAR_COLLAPSED_KEY) === "true";
  } catch {
    cachedCollapsed = false;
  }

  return cachedCollapsed;
}

export function setSidebarCollapsed(collapsed: boolean): void {
  cachedCollapsed = collapsed;
  try {
    localStorage.setItem(SIDEBAR_COLLAPSED_KEY, String(collapsed));
  } catch {
    // ignore storage errors
  }
}
