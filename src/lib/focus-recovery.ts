import type { FocusSessionSavePayload } from "@/types/focus";
import {
  readStorageJson,
  removeStorageItem,
  writeStorageJson,
} from "@/lib/safe-storage";
import type { StoredActiveFocusSession } from "@/lib/focus-active-session";

export const FOCUS_PENDING_CONCLUSION_KEY = "flowos.focus.pending-conclusion";

export type PendingFocusConclusion = {
  payload: FocusSessionSavePayload & {
    focus_duration?: number;
    break_duration?: number;
  };
  session: StoredActiveFocusSession;
  requested_at: string;
};

export function readPendingFocusConclusion(): PendingFocusConclusion | null {
  const pending = readStorageJson<PendingFocusConclusion | null>(
    FOCUS_PENDING_CONCLUSION_KEY,
    null,
  );
  if (!pending?.payload?.started_at || !pending.session?.started_at) return null;
  return pending;
}

export function writePendingFocusConclusion(
  pending: PendingFocusConclusion,
): void {
  writeStorageJson(FOCUS_PENDING_CONCLUSION_KEY, pending);
}

export function clearPendingFocusConclusion(): void {
  removeStorageItem(FOCUS_PENDING_CONCLUSION_KEY);
}

