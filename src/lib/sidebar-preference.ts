import { getStorageItem, setStorageItem } from "@/lib/safe-storage";

const SIDEBAR_COLLAPSED_KEY = "flowos-sidebar-collapsed";

/** `undefined` = not read yet; `null` = no stored preference. */
let cachedPreference: boolean | null | undefined = undefined;

/** Stored preference, or `null` when the user has never toggled. */
export function getSidebarCollapsedPreference(): boolean | null {
  if (cachedPreference !== undefined) return cachedPreference;
  if (typeof window === "undefined") return null;

  const raw = getStorageItem(SIDEBAR_COLLAPSED_KEY);
  cachedPreference = raw === null ? null : raw === "true";
  return cachedPreference;
}

export function getSidebarCollapsed(): boolean {
  return getSidebarCollapsedPreference() === true;
}

export function setSidebarCollapsed(collapsed: boolean): void {
  cachedPreference = collapsed;
  setStorageItem(SIDEBAR_COLLAPSED_KEY, String(collapsed));
}
