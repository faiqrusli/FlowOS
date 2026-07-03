export type WorkplaceModuleVisibility = "always" | "hover";

const STORAGE_PREFIX = "flowos-workplace-module-visibility:";

export function readModuleVisibility(
  moduleId: string,
  fallback: WorkplaceModuleVisibility = "always"
): WorkplaceModuleVisibility {
  if (typeof window === "undefined") return fallback;
  try {
    const raw = window.localStorage.getItem(`${STORAGE_PREFIX}${moduleId}`);
    return raw === "hover" ? "hover" : "always";
  } catch {
    return fallback;
  }
}

export function writeModuleVisibility(
  moduleId: string,
  mode: WorkplaceModuleVisibility
): void {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(`${STORAGE_PREFIX}${moduleId}`, mode);
  } catch {
    // ignore storage errors
  }
}
