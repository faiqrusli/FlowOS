import { getStorageItem, setStorageItem } from "@/lib/safe-storage";

export type WorkplaceModuleVisibility = "always" | "hover";

const STORAGE_PREFIX = "flowos-workplace-module-visibility:";

export function readModuleVisibility(
  moduleId: string,
  fallback: WorkplaceModuleVisibility = "always"
): WorkplaceModuleVisibility {
  const raw = getStorageItem(`${STORAGE_PREFIX}${moduleId}`);
  if (raw === null) return fallback;
  return raw === "hover" ? "hover" : "always";
}

export function writeModuleVisibility(
  moduleId: string,
  mode: WorkplaceModuleVisibility
): void {
  setStorageItem(`${STORAGE_PREFIX}${moduleId}`, mode);
}
