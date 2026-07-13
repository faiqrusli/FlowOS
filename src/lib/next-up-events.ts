import type { Task } from "@/types/task";

export const NEXT_UP_UPDATED_EVENT = "flowos:next-up-updated";

export type NextUpUpdateDetail =
  | { kind: "added"; task: Task }
  | { kind: "changed" };

export function notifyNextUpUpdated(detail: NextUpUpdateDetail): void {
  if (typeof window === "undefined") return;
  window.dispatchEvent(new CustomEvent<NextUpUpdateDetail>(NEXT_UP_UPDATED_EVENT, { detail }));
}
