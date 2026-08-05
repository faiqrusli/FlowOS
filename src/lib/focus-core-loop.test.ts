import { describe, expect, it } from "vitest";
import {
  beginFocusOperation,
  buildFocusReflectionHandoff,
  confirmFocusOperation,
  createIdleFocusOperationState,
  failFocusOperation,
  getFocusRecoveryChoices,
  getFocusTimingMeaning,
  interruptFocusOperation,
} from "@/lib/focus-core-loop";
import { createQuickFocusSession } from "@/lib/focus-active-session";

describe("focus core-loop operation state", () => {
  it("preserves the last confirmed session while a conclusion is pending or failed", () => {
    const session = createQuickFocusSession({
      target_type: "task",
      target_id: "task-1",
    });
    const pending = beginFocusOperation(
      createIdleFocusOperationState(),
      "conclude",
      session,
      null,
    );
    const failed = failFocusOperation(pending, "Conclusion was not confirmed.");

    expect(pending.state).toBe("concluding");
    expect(pending.confirmedSession).toBe(session);
    expect(failed.state).toBe("failed");
    expect(failed.confirmedSession).toBe(session);
    expect(getFocusRecoveryChoices(failed)).toEqual(["retry", "leave"]);
  });

  it("offers explicit choices for an interrupted session", () => {
    const session = createQuickFocusSession();
    const interrupted = interruptFocusOperation(
      createIdleFocusOperationState(),
      session,
    );

    expect(interrupted.state).toBe("interrupted");
    expect(getFocusRecoveryChoices(interrupted)).toEqual([
      "resume",
      "reconcile",
      "leave",
    ]);
  });

  it("confirms pause/active state only from the confirmed session", () => {
    const session = createQuickFocusSession();
    const pending = beginFocusOperation(
      createIdleFocusOperationState(),
      "start",
      null,
      session,
    );
    const confirmed = confirmFocusOperation(pending, session);

    expect(confirmed.state).toBe("active");
    expect(confirmed.requestedSession).toBeNull();
  });

  it("scopes timing as factual session context, never outcome", () => {
    expect(getFocusTimingMeaning()).toEqual({
      meaning: "factual",
      scope: "session",
      provesOutcome: false,
    });
  });

  it("hands a confirmed session to Reflection without transferring ownership", () => {
    const handoff = buildFocusReflectionHandoff({
      id: "session-1",
      focus_duration: 600,
      break_duration: 0,
      started_at: "2026-08-05T01:00:00.000Z",
      ended_at: "2026-08-05T01:10:00.000Z",
      session_status: "stopped",
      target_type: "task",
      target_id: "task-1",
      user_id: "user-1",
    });

    expect(handoff).toMatchObject({
      source: "focus",
      sessionId: "session-1",
      receivingOwner: "reflection",
      meaning: "factual",
      saveFailureDoesNotUndoFocus: true,
    });
  });
});
