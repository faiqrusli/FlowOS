import { getTaskRecordState } from "@/lib/task-core-loop";
import type { FocusSession } from "@/types/focus";
import type { Task } from "@/types/task";

/**
 * The source labels used by factual projections. These are ownership labels,
 * not UI categories: a projection may read a source, but it never becomes the
 * source's write owner.
 */
export type EvidenceSource =
  | "tasks"
  | "focus"
  | "focus_session_task_totals"
  | "habits"
  | "schedule"
  | "reflection"
  | "notes";

export type EvidenceOwner =
  | "tasks"
  | "focus"
  | "habits"
  | "reflection"
  | "notes"
  | "schedule";

export type EvidenceProvenance =
  | "direct"
  | "user-provided"
  | "source-provided"
  | "derived"
  | "planned"
  | "proposed"
  | "applied"
  | "unavailable";

export type EvidenceFreshness =
  | "current"
  | "historical"
  | "stale"
  | "pending"
  | "failed"
  | "local-draft"
  | "disconnected";

export type EvidenceScope = {
  kind: "user" | "date" | "record" | "session" | "task";
  dateKey?: string;
  parentRecordId?: string;
  userScoped: true;
};

export type EvidenceDerivation = {
  rule: string;
  inputs: string[];
  derivedAt: string;
};

export type EvidenceCorrectionRoute = {
  owner: EvidenceOwner;
  recordId: string | null;
  action: "open-owner";
};

export type FactualEvidenceEnvelope<T> = {
  source: EvidenceSource;
  owner: EvidenceOwner;
  recordId: string | null;
  provenance: EvidenceProvenance;
  scope: EvidenceScope;
  freshness: EvidenceFreshness;
  data: T | null;
  observedAt: string | null;
  effectiveAt: string | null;
  derivation: EvidenceDerivation | null;
  limitation: string | null;
  correction: EvidenceCorrectionRoute;
};

export type FocusAttributionFact = {
  sessionId: string;
  taskId: string;
  focusedSeconds: number;
};

export type FocusAttributionEvidenceOptions = {
  available: boolean;
  observedAt?: string | null;
  limitation?: string | null;
};

function scopeForRecord(
  kind: EvidenceScope["kind"],
  options: Pick<EvidenceScope, "dateKey" | "parentRecordId"> = {},
): EvidenceScope {
  return {
    kind,
    userScoped: true,
    ...options,
  };
}

function correction(owner: EvidenceOwner, recordId: string | null): EvidenceCorrectionRoute {
  return { owner, recordId, action: "open-owner" };
}

function observedAtFor(record: { updated_at?: string | null; created_at?: string | null }): string | null {
  return record.updated_at ?? record.created_at ?? null;
}

/** Adapt an owner-confirmed Task record without changing its meaning. */
export function adaptTaskEvidence(
  task: Task,
  options: { dateKey?: string; observedAt?: string | null } = {},
): FactualEvidenceEnvelope<Task> {
  const taskState = getTaskRecordState(task);
  const withdrawn = taskState === "withdrawn";

  return {
    source: "tasks",
    owner: "tasks",
    recordId: task.id,
    provenance: "direct",
    scope: scopeForRecord("task", { dateKey: options.dateKey }),
    freshness: withdrawn ? "historical" : "current",
    data: task,
    observedAt: options.observedAt ?? observedAtFor(task),
    effectiveAt: task.completed_at ?? task.updated_at ?? task.created_at,
    derivation: null,
    limitation: withdrawn
      ? "Task withdrawal is retained history, not completion or deletion."
      : null,
    correction: correction("tasks", task.id),
  };
}

/** Adapt an owner-confirmed Focus session as session-scoped factual context. */
export function adaptFocusEvidence(
  session: FocusSession,
  options: {
    dateKey?: string;
    observedAt?: string | null;
    attributionAvailable?: boolean;
    attributionLimitation?: string | null;
  } = {},
): FactualEvidenceEnvelope<FocusSession> {
  const attributionUnavailable =
    session.target_type === "task" &&
    Boolean(session.target_id) &&
    options.attributionAvailable === false;

  return {
    source: "focus",
    owner: "focus",
    recordId: session.id,
    provenance: "direct",
    scope: scopeForRecord("session", { dateKey: options.dateKey }),
    freshness: session.ended_at ? "historical" : "current",
    data: session,
    observedAt: options.observedAt ?? session.created_at ?? session.ended_at,
    effectiveAt: session.started_at,
    derivation: null,
    limitation: attributionUnavailable
      ? options.attributionLimitation ??
        "Task attribution is unavailable; this is session evidence only."
      : "Elapsed Focus time is session evidence, not an outcome or quality claim.",
    correction: correction("focus", session.id),
  };
}

/**
 * Keep task attribution unavailable unless its owner path has been verified.
 * Selection, proximity, and elapsed time are intentionally not accepted as
 * fallback inputs.
 */
export function adaptFocusAttributionEvidence(
  session: FocusSession,
  facts: FocusAttributionFact[] = [],
  options: FocusAttributionEvidenceOptions,
): FactualEvidenceEnvelope<FocusAttributionFact[]> {
  const limitation =
    options.limitation ??
    "Task attribution is unavailable until its source is applied and verified.";

  if (!options.available) {
    return {
      source: "focus_session_task_totals",
      owner: "focus",
      recordId: session.id,
      provenance: "unavailable",
      scope: scopeForRecord("session", { parentRecordId: session.id }),
      freshness: "stale",
      data: null,
      observedAt: options.observedAt ?? null,
      effectiveAt: session.started_at,
      derivation: null,
      limitation,
      correction: correction("focus", session.id),
    };
  }

  return {
    source: "focus_session_task_totals",
    owner: "focus",
    recordId: session.id,
    provenance: "source-provided",
    scope: scopeForRecord("session", { parentRecordId: session.id }),
    freshness: "current",
    data: facts,
    observedAt: options.observedAt ?? new Date().toISOString(),
    effectiveAt: session.started_at,
    derivation: {
      rule: "Use owner-confirmed focus_session_task_totals rows for this session.",
      inputs: facts.map((fact) => fact.taskId),
      derivedAt: options.observedAt ?? new Date().toISOString(),
    },
    limitation: null,
    correction: correction("focus", session.id),
  };
}

/** Build an explicit unavailable envelope when an optional source cannot be read. */
export function buildUnavailableEvidence<T>(options: {
  source: EvidenceSource;
  owner: EvidenceOwner;
  recordId?: string | null;
  scope?: EvidenceScope;
  limitation: string;
  freshness?: EvidenceFreshness;
}): FactualEvidenceEnvelope<T> {
  return {
    source: options.source,
    owner: options.owner,
    recordId: options.recordId ?? null,
    provenance: "unavailable",
    scope: options.scope ?? scopeForRecord("user"),
    freshness: options.freshness ?? "stale",
    data: null,
    observedAt: null,
    effectiveAt: null,
    derivation: null,
    limitation: options.limitation,
    correction: correction(options.owner, options.recordId ?? null),
  };
}

/** Derived summaries name their inputs and rule instead of posing as direct facts. */
export function buildDerivedEvidence<T>(options: {
  source: EvidenceSource;
  owner: EvidenceOwner;
  recordId?: string | null;
  scope: EvidenceScope;
  data: T;
  inputs: string[];
  rule: string;
  derivedAt?: string;
  effectiveAt?: string | null;
  limitation?: string | null;
}): FactualEvidenceEnvelope<T> {
  const derivedAt = options.derivedAt ?? new Date().toISOString();

  return {
    source: options.source,
    owner: options.owner,
    recordId: options.recordId ?? null,
    provenance: "derived",
    scope: options.scope,
    freshness: "current",
    data: options.data,
    observedAt: derivedAt,
    effectiveAt: options.effectiveAt ?? null,
    derivation: { rule: options.rule, inputs: options.inputs, derivedAt },
    limitation: options.limitation ?? null,
    correction: correction(options.owner, options.recordId ?? null),
  };
}
