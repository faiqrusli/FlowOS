import {
  adaptationProposalSchema,
  parseReflectionDateKey,
  parseReflectionDraft,
} from "@/lib/validation";
import type { FocusReflectionHandoff } from "@/lib/focus-core-loop";
import type { Reflection, ReflectionDraft } from "@/types/reflection";

export type ReflectionRecordKind = "daily" | "custom" | "focus-session-end";

export type ReflectionRecordIdentity = {
  id: string;
  kind: ReflectionRecordKind;
  dateKey: string;
  owner: "reflection";
  source: "reflection" | "focus";
  focusSessionId: string | null;
  parentDailyRecordId: string | null;
};

export type ReflectionRecordState =
  | "empty"
  | "local-draft"
  | "saving"
  | "saved"
  | "failed"
  | "corrected"
  | "historical"
  | "skipped"
  | "withdrawn"
  | "unavailable"
  | "disconnected";

export type ReflectionOperation =
  | "save"
  | "retry"
  | "correct"
  | "withdraw"
  | "skip"
  | "leave";

export type ReflectionOperationState = {
  state: ReflectionRecordState;
  operation: ReflectionOperation | null;
  requestId: number;
  identity: ReflectionRecordIdentity | null;
  confirmedRecord: Reflection | null;
  confirmedDraft: ReflectionDraft | null;
  pendingDraft: ReflectionDraft | null;
  errorMessage: string | null;
};

export type ReflectionRecoveryChoice = "retry" | "discard-draft" | "leave";

export type ReflectionSourceContext = {
  source: "focus" | "tasks" | "habits" | "schedule" | "notes";
  recordId: string;
  provenance: "source-provided" | "direct" | "unavailable";
  limitation: string | null;
};

export type AdaptationReceivingOwner = "tasks" | "habits" | "schedule" | "notes";
export type AdaptationStatus = "proposed" | "applied" | "deferred" | "declined";

export type AdaptationProposal = {
  id: string;
  reflectionRecordId: string;
  receivingOwner: AdaptationReceivingOwner;
  title: string;
  detail: string;
  status: AdaptationStatus;
  provenance: "proposed" | "applied";
  proposedAt: string;
  appliedAt: string | null;
};

export type AdaptationHandoff = {
  proposal: AdaptationProposal;
  receivingOwner: AdaptationReceivingOwner;
  action: "open-owner";
  canApplyInReflection: false;
};

function requireDateKey(dateKey: string): string {
  return parseReflectionDateKey(dateKey);
}

export function createDailyReflectionIdentity(
  id: string,
  dateKey: string,
): ReflectionRecordIdentity {
  return {
    id,
    kind: "daily",
    dateKey: requireDateKey(dateKey),
    owner: "reflection",
    source: "reflection",
    focusSessionId: null,
    parentDailyRecordId: null,
  };
}

export function createCustomReflectionIdentity(
  id: string,
  dateKey: string,
): ReflectionRecordIdentity {
  return {
    id,
    kind: "custom",
    dateKey: requireDateKey(dateKey),
    owner: "reflection",
    source: "reflection",
    focusSessionId: null,
    parentDailyRecordId: null,
  };
}

export function createFocusSessionReflectionIdentity(options: {
  entryId: string;
  dateKey: string;
  sessionId: string;
  dailyReflectionId?: string | null;
}): ReflectionRecordIdentity {
  return {
    id: options.entryId,
    kind: "focus-session-end",
    dateKey: requireDateKey(options.dateKey),
    owner: "reflection",
    source: "focus",
    focusSessionId: options.sessionId,
    parentDailyRecordId: options.dailyReflectionId ?? null,
  };
}

export function createEmptyReflectionOperationState(): ReflectionOperationState {
  return {
    state: "empty",
    operation: null,
    requestId: 0,
    identity: null,
    confirmedRecord: null,
    confirmedDraft: null,
    pendingDraft: null,
    errorMessage: null,
  };
}

export function beginReflectionOperation(
  previous: ReflectionOperationState,
  operation: ReflectionOperation,
  identity: ReflectionRecordIdentity,
  draft: ReflectionDraft,
): ReflectionOperationState {
  const parsedDraft = parseReflectionDraft(draft);

  return {
    ...previous,
    state: "saving",
    operation,
    requestId: previous.requestId + 1,
    identity,
    pendingDraft: parsedDraft,
    errorMessage: null,
  };
}

export function markReflectionLocalDraft(
  previous: ReflectionOperationState,
  identity: ReflectionRecordIdentity,
  draft: ReflectionDraft,
): ReflectionOperationState {
  return {
    ...previous,
    state: "local-draft",
    identity,
    pendingDraft: parseReflectionDraft(draft),
    errorMessage: null,
  };
}

export function confirmReflectionOperation(
  state: ReflectionOperationState,
  record: Reflection,
  identity = state.identity,
): ReflectionOperationState {
  const confirmedDraft: ReflectionDraft = {
    went_well: record.went_well,
    went_wrong: record.went_wrong,
    custom_entries: record.custom_entries,
    custom_kanbans: record.custom_kanbans,
  };

  return {
    ...state,
    state: "saved",
    operation: null,
    identity,
    confirmedRecord: record,
    confirmedDraft,
    pendingDraft: null,
    errorMessage: null,
  };
}

export function failReflectionOperation(
  state: ReflectionOperationState,
  errorMessage: string,
): ReflectionOperationState {
  return {
    ...state,
    state: "failed",
    operation: state.operation === "save" ? "retry" : state.operation,
    pendingDraft: state.pendingDraft,
    errorMessage,
  };
}

export function markReflectionUnavailable(
  state: ReflectionOperationState,
  errorMessage: string,
): ReflectionOperationState {
  return {
    ...state,
    state: "unavailable",
    operation: null,
    errorMessage,
  };
}

export function markReflectionCorrected(
  state: ReflectionOperationState,
  record: Reflection,
  identity = state.identity,
): ReflectionOperationState {
  return {
    ...confirmReflectionOperation(state, record, identity),
    state: "corrected",
  };
}

export function markReflectionHistorical(
  state: ReflectionOperationState,
): ReflectionOperationState {
  return {
    ...state,
    state: "historical",
    operation: null,
    pendingDraft: null,
  };
}

export function markReflectionSkipped(
  state: ReflectionOperationState,
): ReflectionOperationState {
  return {
    ...state,
    state: "skipped",
    operation: null,
    pendingDraft: null,
    errorMessage: null,
  };
}

export function markReflectionWithdrawn(
  state: ReflectionOperationState,
): ReflectionOperationState {
  return {
    ...state,
    state: "withdrawn",
    operation: null,
    pendingDraft: null,
    errorMessage: null,
  };
}

export function markReflectionDisconnected(
  state: ReflectionOperationState,
  errorMessage: string,
): ReflectionOperationState {
  return {
    ...state,
    state: "disconnected",
    operation: null,
    errorMessage,
  };
}

export function getReflectionRecoveryChoices(
  state: ReflectionOperationState,
): ReflectionRecoveryChoice[] {
  if (state.state === "failed" || state.state === "local-draft") {
    return ["retry", "discard-draft", "leave"];
  }
  if (state.state === "saving") return ["leave"];
  return [];
}

export function buildFocusReflectionSourceContext(
  handoff: FocusReflectionHandoff,
): ReflectionSourceContext {
  return {
    source: "focus",
    recordId: handoff.sessionId,
    provenance: "direct",
    limitation:
      "Focus timing is linked context; Reflection remains user-provided interpretation.",
  };
}

export function appendFocusSessionEndEntry(
  draft: ReflectionDraft,
  options: {
    entryId: string;
    dateKey: string;
    sessionId: string;
    dailyReflectionId?: string | null;
    title?: string;
    content: string;
  },
): { draft: ReflectionDraft; identity: ReflectionRecordIdentity } {
  const parsedDraft = parseReflectionDraft(draft);
  const entry = {
    id: options.entryId,
    title: options.title?.trim() || "Focus session reflection",
    content: options.content.trim(),
  };

  const nextDraft = parseReflectionDraft({
    ...parsedDraft,
    custom_entries: [...parsedDraft.custom_entries, entry],
  });

  return {
    draft: nextDraft,
    identity: createFocusSessionReflectionIdentity({
      entryId: options.entryId,
      dateKey: options.dateKey,
      sessionId: options.sessionId,
      dailyReflectionId: options.dailyReflectionId,
    }),
  };
}

export function createAdaptationProposal(input: {
  id: string;
  reflectionRecordId: string;
  receivingOwner: AdaptationReceivingOwner;
  title: string;
  detail: string;
  proposedAt?: string;
}): AdaptationProposal {
  const parsed = adaptationProposalSchema.parse({
    ...input,
    proposedAt: input.proposedAt,
  });
  const proposedAt = parsed.proposedAt ?? new Date().toISOString();
  return {
    id: parsed.id,
    reflectionRecordId: parsed.reflectionRecordId,
    receivingOwner: parsed.receivingOwner,
    title: parsed.title,
    detail: parsed.detail,
    status: "proposed",
    provenance: "proposed",
    proposedAt,
    appliedAt: null,
  };
}

export function buildAdaptationHandoff(
  proposal: AdaptationProposal,
): AdaptationHandoff {
  return {
    proposal,
    receivingOwner: proposal.receivingOwner,
    action: "open-owner",
    canApplyInReflection: false,
  };
}

export function resolveAdaptationProposal(
  proposal: AdaptationProposal,
  action: "apply" | "defer" | "decline",
  options: { receivingOwnerConfirmed?: boolean; appliedAt?: string } = {},
): AdaptationProposal {
  if (action === "apply" && !options.receivingOwnerConfirmed) {
    return proposal;
  }

  if (action === "apply") {
    return {
      ...proposal,
      status: "applied",
      provenance: "applied",
      appliedAt: options.appliedAt ?? new Date().toISOString(),
    };
  }

  return { ...proposal, status: action === "defer" ? "deferred" : "declined" };
}
