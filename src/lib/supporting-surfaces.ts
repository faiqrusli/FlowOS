import type { Note } from "@/types/notes";
import type { ScheduleItem } from "@/types/schedule";
import type { Habit } from "@/types/habit";

export type SupportingSource = "habits" | "schedule" | "notes";
export type SupportingOwner = "habits" | "tasks" | "schedule" | "notes";

export type SupportingState =
  | "loading"
  | "ready"
  | "empty"
  | "partial"
  | "stale"
  | "unavailable"
  | "disconnected"
  | "error";

export type SupportingFreshness = "current" | "last-confirmed" | null;
export type SupportingRecoveryAction =
  | "retry"
  | "open-owner"
  | "reauthenticate"
  | "leave";

export type SupportingEnvelope<T> = {
  source: SupportingSource;
  owner: SupportingOwner;
  state: SupportingState;
  data: T | null;
  provenance: "source-provided" | "derived" | "planned" | "unavailable";
  freshness: SupportingFreshness;
  limitation: string | null;
  recovery: SupportingRecoveryAction;
  correction: {
    owner: SupportingOwner;
    action: "open-owner";
  };
};

export type HabitCompletionIntent = {
  source: "habits";
  owner: "habits";
  habitId: string;
  dateKey: string;
  action: "complete" | "uncomplete";
  meaning: "user-provided";
  changesOnlyHabitCompletion: true;
};

export type ScheduleOwnerRoute = {
  source: "schedule";
  owner: "tasks" | "habits";
  recordId: string;
  action: "open-owner";
  meaning: "planned";
};

export type SupportingRecoveryChoice =
  | "retry"
  | "open-owner"
  | "reauthenticate"
  | "leave";

function confirmedState(state: SupportingState): boolean {
  return ["ready", "empty", "partial", "stale"].includes(state);
}

function sourceOwner(source: SupportingSource): SupportingOwner {
  if (source === "schedule") return "schedule";
  return source;
}

function createEnvelope<T>(options: {
  source: SupportingSource;
  owner?: SupportingOwner;
  state: SupportingState;
  data: T | null;
  provenance: SupportingEnvelope<T>["provenance"];
  limitation?: string | null;
  recovery: SupportingRecoveryAction;
  freshness?: SupportingFreshness;
}): SupportingEnvelope<T> {
  const owner = options.owner ?? sourceOwner(options.source);
  return {
    source: options.source,
    owner,
    state: options.state,
    data: options.data,
    provenance: options.provenance,
    freshness:
      options.freshness ??
      (confirmedState(options.state) ? "current" : null),
    limitation: options.limitation ?? null,
    recovery: options.recovery,
    correction: { owner, action: "open-owner" },
  };
}

export function buildHabitsSupport(
  habits: Habit[],
  options: { stale?: boolean; limitation?: string | null } = {},
): SupportingEnvelope<Habit[]> {
  const state: SupportingState = habits.length === 0
    ? "empty"
    : options.stale
      ? "stale"
      : "ready";

  return createEnvelope({
    source: "habits",
    state,
    data: habits,
    provenance: "source-provided",
    limitation:
      options.limitation ??
      "Habit completion is explicit user-provided evidence for the habit occurrence; this surface does not calculate progress or streaks.",
    recovery: options.stale ? "retry" : "open-owner",
    freshness: options.stale ? "last-confirmed" : "current",
  });
}

export function buildScheduleSupport(
  items: ScheduleItem[],
  options: { stale?: boolean; limitation?: string | null } = {},
): SupportingEnvelope<ScheduleItem[]> {
  const state: SupportingState = items.length === 0
    ? "empty"
    : options.stale
      ? "stale"
      : "ready";

  return createEnvelope({
    source: "schedule",
    state,
    data: items,
    provenance: "planned",
    limitation:
      options.limitation ??
      "Schedule is planning context only; task and habit owners remain authoritative for state and completion.",
    recovery: options.stale ? "retry" : "open-owner",
    freshness: options.stale ? "last-confirmed" : "current",
  });
}

export function buildNotesSupport(
  notes: Note[],
  options: {
    stale?: boolean;
    disconnected?: boolean;
    limitation?: string | null;
  } = {},
): SupportingEnvelope<Note[]> {
  const state: SupportingState = options.disconnected
    ? "disconnected"
    : notes.length === 0
      ? "empty"
      : options.stale
        ? "stale"
        : "ready";

  return createEnvelope({
    source: "notes",
    state,
    data: notes,
    provenance: "source-provided",
    limitation:
      options.limitation ??
      (options.disconnected
        ? "The linked Notes context is disconnected; prior context is not treated as absent."
        : "Notes provide optional user-owned context and do not become evidence or an adaptation automatically."),
    recovery: options.stale || options.disconnected ? "retry" : "open-owner",
    freshness: options.stale || options.disconnected ? "last-confirmed" : "current",
  });
}

export function buildUnavailableSupporting<T>(options: {
  source: SupportingSource;
  limitation: string;
  reauthenticate?: boolean;
  previous?: SupportingEnvelope<T> | null;
}): SupportingEnvelope<T> {
  if (options.previous && confirmedState(options.previous.state)) {
    return {
      ...options.previous,
      state: "stale",
      freshness: "last-confirmed",
      limitation: options.limitation,
      recovery: "retry",
    };
  }

  return createEnvelope<T>({
    source: options.source,
    state: "unavailable",
    data: null,
    provenance: "unavailable",
    limitation: options.limitation,
    recovery: options.reauthenticate ? "reauthenticate" : "retry",
    freshness: null,
  });
}

export function buildSupportingReadError<T>(
  source: SupportingSource,
  previous?: SupportingEnvelope<T> | null,
): SupportingEnvelope<T> {
  return buildUnavailableSupporting({
    source,
    previous,
    limitation: `${source[0].toUpperCase()}${source.slice(1)} could not be confirmed. Retry or open the ${source} owner.`,
  });
}

export function getSupportingRecoveryChoices<T>(
  envelope: SupportingEnvelope<T>,
): SupportingRecoveryChoice[] {
  if (envelope.state === "error" || envelope.state === "unavailable") {
    return envelope.recovery === "reauthenticate"
      ? ["reauthenticate", "leave"]
      : ["retry", "open-owner", "leave"];
  }
  if (envelope.state === "stale" || envelope.state === "disconnected") {
    return ["retry", "open-owner", "leave"];
  }
  return envelope.recovery === "open-owner" ? ["open-owner", "leave"] : [];
}

/** Build an explicit owner action; this helper performs no mutation. */
export function buildHabitCompletionIntent(
  habit: Pick<Habit, "id" | "completed">,
  dateKey: string,
): HabitCompletionIntent {
  return {
    source: "habits",
    owner: "habits",
    habitId: habit.id,
    dateKey,
    action: habit.completed ? "uncomplete" : "complete",
    meaning: "user-provided",
    changesOnlyHabitCompletion: true,
  };
}

/** Schedule routes a change to the Task/Habit owner and never writes itself. */
export function buildScheduleOwnerRoute(
  item: Pick<ScheduleItem, "type" | "entityId">,
): ScheduleOwnerRoute {
  return {
    source: "schedule",
    owner: item.type === "habit" ? "habits" : "tasks",
    recordId: item.entityId,
    action: "open-owner",
    meaning: "planned",
  };
}
