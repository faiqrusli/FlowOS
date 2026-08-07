import {
  readStorageJson,
  removeStorageItem,
  writeStorageJson,
} from "@/lib/safe-storage";
import type { StoredActiveFocusSession } from "@/lib/focus-active-session";
import type { FocusSessionSavePayload } from "@/types/focus";

export type PendingFocusConclusion = {
  payload: FocusSessionSavePayload & {
    focus_duration?: number;
    break_duration?: number;
  };
  session: StoredActiveFocusSession;
  requested_at: string;
  persisted_session_id?: string;
};

const PENDING_FOCUS_CONCLUSION_KEY = "flowos.focus.pending-conclusion";

function pendingFocusConclusionKey(userId: string): string {
  return `${PENDING_FOCUS_CONCLUSION_KEY}:${userId}`;
}

export function readPendingFocusConclusion(userId: string | null): PendingFocusConclusion | null {
  if (!userId) return null;
  return readStorageJson<PendingFocusConclusion | null>(
    pendingFocusConclusionKey(userId),
    null,
  );
}

export function writePendingFocusConclusion(
  userId: string | null,
  pending: PendingFocusConclusion,
): void {
  if (!userId) return;
  writeStorageJson(pendingFocusConclusionKey(userId), pending);
}

export function clearPendingFocusConclusion(userId: string | null): void {
  if (!userId) return;
  removeStorageItem(pendingFocusConclusionKey(userId));
}
