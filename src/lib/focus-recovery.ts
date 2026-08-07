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

export function readPendingFocusConclusion(): PendingFocusConclusion | null {
  return readStorageJson<PendingFocusConclusion | null>(
    PENDING_FOCUS_CONCLUSION_KEY,
    null,
  );
}

export function writePendingFocusConclusion(
  pending: PendingFocusConclusion,
): void {
  writeStorageJson(PENDING_FOCUS_CONCLUSION_KEY, pending);
}

export function clearPendingFocusConclusion(): void {
  removeStorageItem(PENDING_FOCUS_CONCLUSION_KEY);
}
