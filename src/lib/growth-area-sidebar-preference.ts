const GROWTH_AREA_SIDEBAR_EXPANDED_KEY = "flowos-growth-areas-expanded";

let cachedExpanded: boolean | null = null;

export function getGrowthAreaSidebarExpanded(): boolean {
  if (cachedExpanded !== null) return cachedExpanded;
  if (typeof window === "undefined") return false;

  try {
    cachedExpanded =
      localStorage.getItem(GROWTH_AREA_SIDEBAR_EXPANDED_KEY) === "true";
  } catch {
    cachedExpanded = false;
  }

  return cachedExpanded;
}

export function setGrowthAreaSidebarExpanded(expanded: boolean): void {
  cachedExpanded = expanded;
  try {
    localStorage.setItem(GROWTH_AREA_SIDEBAR_EXPANDED_KEY, String(expanded));
  } catch {
    // ignore storage errors
  }
}
