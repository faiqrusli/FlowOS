import type { NextAction } from "@/lib/dashboard-command";

const STORAGE_KEY = "flowos.today.next-action.dismissed";

export function dismissKey(
  action: Pick<NextAction, "type" | "entityId">
): string {
  return `${action.type}:${action.entityId ?? "none"}`;
}

export function readDismissedKey(): string | null {
  if (typeof window === "undefined") return null;
  try {
    return window.sessionStorage.getItem(STORAGE_KEY);
  } catch {
    return null;
  }
}

export function writeDismissedKey(key: string): void {
  if (typeof window === "undefined") return;
  try {
    window.sessionStorage.setItem(STORAGE_KEY, key);
  } catch {
    // ignore storage errors
  }
}

export function clearDismissedKey(): void {
  if (typeof window === "undefined") return;
  try {
    window.sessionStorage.removeItem(STORAGE_KEY);
  } catch {
    // ignore storage errors
  }
}
