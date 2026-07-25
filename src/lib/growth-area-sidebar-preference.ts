import { getStorageItem, setStorageItem } from "@/lib/safe-storage";

const GROWTH_AREA_SIDEBAR_EXPANDED_KEY = "flowos-growth-areas-expanded";

let cachedExpanded: boolean | null = null;

export function getGrowthAreaSidebarExpanded(): boolean {
  if (cachedExpanded !== null) return cachedExpanded;
  if (typeof window === "undefined") return false;

  cachedExpanded =
    getStorageItem(GROWTH_AREA_SIDEBAR_EXPANDED_KEY) === "true";
  return cachedExpanded;
}

export function setGrowthAreaSidebarExpanded(expanded: boolean): void {
  cachedExpanded = expanded;
  setStorageItem(GROWTH_AREA_SIDEBAR_EXPANDED_KEY, String(expanded));
}
