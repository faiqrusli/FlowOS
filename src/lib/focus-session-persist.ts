import { buildFocusSessionInsert } from "@/lib/focus-sessions";
import { saveFocusSession } from "@/lib/focus-storage";
import type { FocusSession, FocusSessionSavePayload } from "@/types/focus";

function buildSaveKey(payload: FocusSessionSavePayload): string {
  return [
    payload.started_at,
    payload.focus_seconds,
    payload.break_seconds,
    payload.session_status,
  ].join("|");
}

let saveInFlight = false;
let lastSavedKey: string | null = null;

export async function persistFocusSessionEnd(
  payload: FocusSessionSavePayload & {
    focus_duration?: number;
    break_duration?: number;
  }
): Promise<FocusSession | null> {
  const saveKey = buildSaveKey(payload);

  if (saveInFlight) {
    console.warn("[focus] saveSession skipped — save already in flight", {
      saveKey,
    });
    return null;
  }

  if (lastSavedKey === saveKey) {
    console.warn("[focus] saveSession skipped — duplicate stop event", {
      saveKey,
    });
    return null;
  }

  saveInFlight = true;
  console.log("[focus] saveSession starting", { saveKey, payload });

  try {
    const saved = await saveFocusSession(
      buildFocusSessionInsert({
        ...payload,
        ended_at: new Date().toISOString(),
      })
    );

    lastSavedKey = saveKey;
    return saved;
  } catch (error) {
    console.error("[focus] saveSession failed", error);
    return null;
  } finally {
    saveInFlight = false;
  }
}
