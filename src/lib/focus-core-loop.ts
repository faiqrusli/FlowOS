import type { StoredActiveFocusSession } from "@/lib/focus-active-session";
import type { FocusSession } from "@/types/focus";

export type FocusLifecycleState =
  | "idle"
  | "starting"
  | "active"
  | "paused"
  | "resuming"
  | "concluding"
  | "concluded"
  | "interrupted"
  | "failed"
  | "unavailable";

export type FocusOperation = "start" | "pause" | "resume" | "conclude" | "reconcile";

export type FocusOperationState = {
  state: FocusLifecycleState;
  operation: FocusOperation | null;
  requestId: number;
  confirmedSession: StoredActiveFocusSession | null;
  requestedSession: StoredActiveFocusSession | null;
  errorMessage: string | null;
};

export type FocusRecoveryChoice = "resume" | "reconcile" | "retry" | "leave";

export type FocusReflectionHandoff = {
  source: "focus";
  sessionId: string;
  sessionStatus: FocusSession["session_status"];
  startedAt: string;
  endedAt: string | null;
  focusSeconds: number;
  meaning: "factual";
  receivingOwner: "reflection";
  saveFailureDoesNotUndoFocus: true;
};

export function createIdleFocusOperationState(): FocusOperationState {
  return {
    state: "idle",
    operation: null,
    requestId: 0,
    confirmedSession: null,
    requestedSession: null,
    errorMessage: null,
  };
}

export function beginFocusOperation(
  previous: FocusOperationState,
  operation: FocusOperation,
  confirmedSession: StoredActiveFocusSession | null,
  requestedSession: StoredActiveFocusSession | null,
): FocusOperationState {
  const pendingState: FocusLifecycleState =
    operation === "start"
      ? "starting"
      : operation === "pause"
        ? "paused"
        : operation === "resume"
          ? "resuming"
          : operation === "conclude"
            ? "concluding"
            : "interrupted";

  return {
    state: pendingState,
    operation,
    requestId: previous.requestId + 1,
    confirmedSession,
    requestedSession,
    errorMessage: null,
  };
}

export function confirmFocusOperation(
  state: FocusOperationState,
  session: StoredActiveFocusSession | null,
): FocusOperationState {
  return {
    ...state,
    state: session ? (state.operation === "conclude" ? "concluded" : session.session_status === "paused" ? "paused" : "active") : "idle",
    confirmedSession: session,
    requestedSession: null,
    errorMessage: null,
  };
}

export function failFocusOperation(
  state: FocusOperationState,
  errorMessage: string,
): FocusOperationState {
  return {
    ...state,
    state: "failed",
    requestedSession: null,
    errorMessage,
  };
}

export function interruptFocusOperation(
  state: FocusOperationState,
  session: StoredActiveFocusSession | null,
): FocusOperationState {
  return {
    ...state,
    state: "interrupted",
    confirmedSession: session,
    requestedSession: null,
    errorMessage: null,
  };
}

export function getFocusRecoveryChoices(
  state: FocusOperationState,
): FocusRecoveryChoice[] {
  if (state.state === "failed" || state.state === "concluding") {
    return ["retry", "leave"];
  }
  if (state.state === "interrupted") {
    return state.confirmedSession
      ? ["resume", "reconcile", "leave"]
      : ["reconcile", "leave"];
  }
  return [];
}

export function getFocusTimingMeaning(): {
  meaning: "factual";
  scope: "session";
  provesOutcome: false;
} {
  return { meaning: "factual", scope: "session", provesOutcome: false };
}

export function buildFocusReflectionHandoff(
  session: FocusSession,
): FocusReflectionHandoff {
  return {
    source: "focus",
    sessionId: session.id,
    sessionStatus: session.session_status,
    startedAt: session.started_at,
    endedAt: session.ended_at,
    focusSeconds: Math.max(0, session.focus_duration),
    meaning: "factual",
    receivingOwner: "reflection",
    saveFailureDoesNotUndoFocus: true,
  };
}
