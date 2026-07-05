import type { NextAction } from "@/lib/dashboard-command";

export type WorkplaceDensity = "full" | "work" | "focus";

export type WorkplaceDensityModule =
  | "tasks"
  | "habits"
  | "quick-add"
  | "daily-note"
  | "focus";

const STORAGE_KEY = "flowos.workplace.density";
const DENSITY_EVENT = "flowos-workplace-density-change";

const DEFAULT_DENSITY: WorkplaceDensity = "work";

export function readWorkplaceDensity(): WorkplaceDensity {
  if (typeof window === "undefined") return DEFAULT_DENSITY;
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (raw === "full" || raw === "work" || raw === "focus") return raw;
    return DEFAULT_DENSITY;
  } catch {
    return DEFAULT_DENSITY;
  }
}

export function writeWorkplaceDensity(density: WorkplaceDensity): void {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(STORAGE_KEY, density);
    window.dispatchEvent(new Event(DENSITY_EVENT));
  } catch {
    // ignore storage errors
  }
}

export function subscribeWorkplaceDensity(
  listener: () => void
): () => void {
  if (typeof window === "undefined") return () => undefined;
  window.addEventListener(DENSITY_EVENT, listener);
  return () => window.removeEventListener(DENSITY_EVENT, listener);
}

export function isWorkplaceModuleShown(
  module: WorkplaceDensityModule,
  density: WorkplaceDensity
): boolean {
  if (density === "focus") {
    return module === "focus";
  }

  if (module === "daily-note") {
    return density === "full";
  }

  return true;
}

export function shouldShowTodayKpiStrip(density: WorkplaceDensity): boolean {
  return density === "full";
}

export function shouldShowTodayNextAction(
  density: WorkplaceDensity,
  action: Pick<NextAction, "type">,
  options?: { hasActiveFocus?: boolean }
): boolean {
  if (density === "focus") return false;
  if (options?.hasActiveFocus) return false;
  return (
    action.type === "task" ||
    action.type === "habit" ||
    action.type === "reflection" ||
    action.type === "focus" ||
    action.type === "empty"
  );
}
