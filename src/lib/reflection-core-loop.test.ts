import { describe, expect, it } from "vitest";
import {
  appendFocusSessionEndEntry,
  beginReflectionOperation,
  buildAdaptationHandoff,
  buildFocusReflectionSourceContext,
  confirmReflectionOperation,
  createAdaptationProposal,
  createCustomReflectionIdentity,
  createDailyReflectionIdentity,
  createEmptyReflectionOperationState,
  createFocusSessionReflectionIdentity,
  failReflectionOperation,
  getReflectionRecoveryChoices,
  markReflectionCorrected,
  markReflectionLocalDraft,
  markReflectionSkipped,
  markReflectionWithdrawn,
  resolveAdaptationProposal,
} from "@/lib/reflection-core-loop";
import type { Reflection, ReflectionDraft } from "@/types/reflection";

const draft: ReflectionDraft = {
  went_well: "A clear decision.",
  went_wrong: "",
  custom_entries: [],
  custom_kanbans: [],
};

const record: Reflection = {
  id: "reflection-1",
  reflection_date: "2026-08-05",
  went_well: draft.went_well,
  went_wrong: draft.went_wrong,
  custom_entries: [],
  custom_kanbans: [],
  user_id: "user-1",
  created_at: "2026-08-05T03:00:00.000Z",
};

describe("reflection core-loop state", () => {
  it("keeps daily, custom, and Focus session-end identities distinct", () => {
    expect(createDailyReflectionIdentity("daily-1", "2026-08-05").kind).toBe("daily");
    expect(createCustomReflectionIdentity("custom-1", "2026-08-05").kind).toBe("custom");
    expect(
      createFocusSessionReflectionIdentity({
        entryId: "entry-1",
        dateKey: "2026-08-05",
        sessionId: "session-1",
        dailyReflectionId: "daily-1",
      }),
    ).toMatchObject({
      kind: "focus-session-end",
      source: "focus",
      focusSessionId: "session-1",
      parentDailyRecordId: "daily-1",
    });
  });

  it("preserves the last confirmed reflection when save is pending or failed", () => {
    const identity = createDailyReflectionIdentity("daily-1", "2026-08-05");
    const pending = beginReflectionOperation(
      createEmptyReflectionOperationState(),
      "save",
      identity,
      draft,
    );
    const failed = failReflectionOperation(pending, "Save was not confirmed.");

    expect(pending.state).toBe("saving");
    expect(pending.pendingDraft).toEqual(draft);
    expect(failed.state).toBe("failed");
    expect(failed.confirmedRecord).toBeNull();
    expect(getReflectionRecoveryChoices(failed)).toEqual([
      "retry",
      "discard-draft",
      "leave",
    ]);

    const confirmed = confirmReflectionOperation(failed, record);
    expect(confirmed.state).toBe("saved");
    expect(confirmed.pendingDraft).toBeNull();
    expect(confirmed.confirmedRecord).toEqual(record);
  });

  it("labels local continuity as a draft rather than a saved record", () => {
    const state = markReflectionLocalDraft(
      createEmptyReflectionOperationState(),
      createDailyReflectionIdentity("daily-1", "2026-08-05"),
      draft,
    );

    expect(state.state).toBe("local-draft");
    expect(state.confirmedRecord).toBeNull();
    expect(getReflectionRecoveryChoices(state)).toContain("retry");
  });

  it("keeps correction, skip, and withdrawal as explicit Reflection states", () => {
    const identity = createDailyReflectionIdentity("daily-1", "2026-08-05");
    const state = beginReflectionOperation(
      createEmptyReflectionOperationState(),
      "correct",
      identity,
      draft,
    );

    expect(markReflectionCorrected(state, record).state).toBe("corrected");
    expect(markReflectionSkipped(state).state).toBe("skipped");
    expect(markReflectionWithdrawn(state).state).toBe("withdrawn");
  });

  it("keeps Focus context linked while interpretation remains Reflection-owned", () => {
    const context = buildFocusReflectionSourceContext({
      source: "focus",
      sessionId: "session-1",
      sessionStatus: "stopped",
      startedAt: "2026-08-05T01:00:00.000Z",
      endedAt: "2026-08-05T01:10:00.000Z",
      focusSeconds: 600,
      meaning: "factual",
      receivingOwner: "reflection",
      saveFailureDoesNotUndoFocus: true,
    });

    expect(context).toMatchObject({
      source: "focus",
      recordId: "session-1",
      provenance: "direct",
    });
    expect(context.limitation).toContain("user-provided interpretation");
  });

  it("makes Focus session-end entries additive instead of replacing the daily record", () => {
    const result = appendFocusSessionEndEntry(draft, {
      entryId: "entry-1",
      dateKey: "2026-08-05",
      sessionId: "session-1",
      content: "I noticed the decision became clearer.",
    });

    expect(result.identity.kind).toBe("focus-session-end");
    expect(result.identity.focusSessionId).toBe("session-1");
    expect(result.draft.went_well).toBe(draft.went_well);
    expect(result.draft.custom_entries).toHaveLength(1);
  });

  it("requires receiving-owner confirmation before adaptation is applied", () => {
    const proposal = createAdaptationProposal({
      id: "proposal-1",
      reflectionRecordId: "reflection-1",
      receivingOwner: "tasks",
      title: "Move the review to tomorrow",
      detail: "The current commitment needs a new date.",
      proposedAt: "2026-08-05T03:00:00.000Z",
    });

    expect(buildAdaptationHandoff(proposal)).toMatchObject({
      receivingOwner: "tasks",
      action: "open-owner",
      canApplyInReflection: false,
    });
    expect(resolveAdaptationProposal(proposal, "apply").status).toBe("proposed");
    expect(
      resolveAdaptationProposal(proposal, "apply", {
        receivingOwnerConfirmed: true,
        appliedAt: "2026-08-05T04:00:00.000Z",
      }),
    ).toMatchObject({ status: "applied", provenance: "applied" });
    expect(resolveAdaptationProposal(proposal, "defer").status).toBe("deferred");
    expect(resolveAdaptationProposal(proposal, "decline").status).toBe("declined");
  });
});
