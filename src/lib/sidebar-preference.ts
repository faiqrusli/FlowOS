import { getStorageItem, setStorageItem } from "@/lib/safe-storage";

const SIDEBAR_COLLAPSED_KEY = "flowos-sidebar-collapsed";

let cachedCollapsed: boolean | null = null;

export function getSidebarCollapsed(): boolean {
  if (cachedCollapsed !== null) return cachedCollapsed;
  if (typeof window === "undefined") return false;

  cachedCollapsed = getStorageItem(SIDEBAR_COLLAPSED_KEY) === "true";
  return cachedCollapsed;
}

export function setSidebarCollapsed(collapsed: boolean): void {
  cachedCollapsed = collapsed;
  setStorageItem(SIDEBAR_COLLAPSED_KEY, String(collapsed));
}
