import { AuthError } from "@/lib/auth";
import { getTodayDateString, isSameDay } from "@/lib/date-utils";
import {
  adaptFocusAttributionEvidence,
  adaptFocusEvidence,
  adaptTaskEvidence,
  type FactualEvidenceEnvelope,
} from "@/lib/factual-evidence";
import {
  getSessionBreakSeconds,
  getSessionFocusSeconds,
} from "@/lib/focus-utils";
import { buildScheduleItems } from "@/lib/schedule-items";
import type { Reflection } from "@/types/reflection";
import type { FocusSession } from "@/types/focus";
import type { Habit } from "@/types/habit";
import type { ScheduleItem } from "@/types/schedule";
import type { Task } from "@/types/task";

export const TODAY_READ_SOURCES = [
  "tasks",
  "focus",
  "reflection",
  "habits",
] as const;

export type TodayReadSource = (typeof TODAY_READ_SOURCES)[number];
export type TodaySourceKey = TodayReadSource | "schedule" | "notes";

export type TodaySourceState =
  | "loading"
  | "ready"
  | "empty"
  | "partial"
  | "stale"
  | "unavailable"
  | "disconnected"
  | "error";

export type TodayRecoveryAction =
  | "retry"
  | "open-owner"
  | "reauthenticate"
  | "leave";

export type TodaySourceOwner =
  | "tasks"
  | "focus"
  | "reflection"
  | "habits"
  | "schedule"
  | "notes";

export type TodaySourceProvenance =
  | "direct"
  | "user-provided"
  | "source-provided"
  | "derived"
  | "planned"
  | "unavailable";

export type TodaySourceEnvelope<T> = {
  source: TodaySourceKey;
  owner: TodaySourceOwner;
  provenance: TodaySourceProvenance;
  state: TodaySourceState;
  data: T | null;
  freshness: "current" | "last-confirmed" | null;
  limitation: string | null;
  recovery: TodayRecoveryAction;
};

export type TodayTasksProjection = {
  tasks: Task[];
  evidence: FactualEvidenceEnvelope<Task>[];
  nextUp: {
    state: "unavailable";
    limitation: string;
  };
};

export type TodayFocusProjection = {
  sessions: FocusSession[];
  evidence: FactualEvidenceEnvelope<FocusSession>[];
  stats: {
    totalFocusSeconds: number;
    totalBreakSeconds: number;
    sessionCount: number;
  };
  attribution: {
    state: "unavailable";
    limitation: string;
    evidence: FactualEvidenceEnvelope<unknown>[];
  };
};

export type TodayCompositionState =
  | "ready"
  | "partial"
  | "stale"
  | "unavailable"
  | "error";

export type TodayComposition = {
  dateKey: string;
  state: TodayCompositionState;
  tasks: TodaySourceEnvelope<TodayTasksProjection>;
  focus: TodaySourceEnvelope<TodayFocusProjection>;
  reflection: TodaySourceEnvelope<Reflection>;
  habits: TodaySourceEnvelope<Habit[]>;
  schedule: TodaySourceEnvelope<ScheduleItem[]>;
  notes: TodaySourceEnvelope<null>;
};

export type TodayCompositionReaders = {
  tasks: (dateKey: string) => Promise<Task[]>;
  focus: (dateKey: string) => Promise<FocusSession[]>;
  reflection: (dateKey: string) => Promise<Reflection | null>;
  habits: (dateKey: string) => Promise<Habit[]>;
};

export type LoadTodayCompositionOptions = {
  dateKey?: string;
  previous?: TodayComposition | null;
  sources?: readonly TodayReadSource[];
  readers?: Partial<TodayCompositionReaders>;
};

const NEXT_UP_UNAVAILABLE =
  "Next Up persistence is unavailable until its migration is applied and verified.";
const FOCUS_ATTRIBUTION_UNAVAILABLE =
  "Focus-to-task attribution is unavailable until its migration is applied and verified.";

function computeFocusStatsForDate(
  sessions: FocusSession[],
  dateKey: string,
): TodayFocusProjection["stats"] {
  return sessions
    .filter((session) => isSameDay(session.started_at, dateKey))
    .reduce(
      (acc, session) => ({
        totalFocusSeconds:
          acc.totalFocusSeconds + getSessionFocusSeconds(session),
        totalBreakSeconds:
          acc.totalBreakSeconds + getSessionBreakSeconds(session),
        sessionCount: acc.sessionCount + 1,
      }),
      { totalFocusSeconds: 0, totalBreakSeconds: 0, sessionCount: 0 },
    );
}

function getDefaultReader(source: "tasks"): TodayCompositionReaders["tasks"];
function getDefaultReader(source: "focus"): TodayCompositionReaders["focus"];
function getDefaultReader(source: "reflection"): TodayCompositionReaders["reflection"];
function getDefaultReader(source: "habits"): TodayCompositionReaders["habits"];
function getDefaultReader(
  source: TodayReadSource,
): (dateKey: string) => Promise<unknown> {
  switch (source) {
    case "tasks":
      return async (dateKey: string) => {
        const { fetchTodayTasks } = await import("@/lib/tasks");
        return fetchTodayTasks(dateKey);
      };
    case "focus":
      return async () => {
        const { fetchFocusSessions } = await import("@/lib/focus-sessions");
        return fetchFocusSessions();
      };
    case "reflection":
      return async (dateKey: string) => {
        const { fetchTodayReflection } = await import("@/lib/reflections-db");
        return fetchTodayReflection(dateKey);
      };
    case "habits":
      return async () => {
        const { fetchTodayHabitsReadOnly } = await import("@/lib/habits");
        return fetchTodayHabitsReadOnly();
      };
  }
}

function envelope<T>(
  source: TodaySourceKey,
  state: TodaySourceState,
  data: T | null,
  options: Pick<TodaySourceEnvelope<T>, "limitation" | "recovery"> &
    Partial<Pick<TodaySourceEnvelope<T>, "freshness">>,
): TodaySourceEnvelope<T> {
  const owner: TodaySourceOwner = source;
  const provenance: TodaySourceProvenance =
    source === "schedule"
      ? "planned"
      : source === "reflection"
        ? "user-provided"
        : state === "unavailable" || state === "error"
          ? "unavailable"
          : source === "tasks" || source === "focus"
            ? "direct"
            : "source-provided";

  return {
    source,
    owner,
    provenance,
    state,
    data,
    freshness: options.freshness ??
      (state === "ready" || state === "empty" || state === "partial"
        ? "current"
        : null),
    limitation: options.limitation,
    recovery: options.recovery,
  };
}

function buildTasksEnvelope(
  tasks: Task[],
): TodaySourceEnvelope<TodayTasksProjection> {
  const data: TodayTasksProjection = {
    tasks,
    evidence: tasks.map((task) => adaptTaskEvidence(task)),
    nextUp: { state: "unavailable", limitation: NEXT_UP_UNAVAILABLE },
  };

  return envelope("tasks", tasks.length === 0 ? "empty" : "partial", data, {
    limitation: NEXT_UP_UNAVAILABLE,
    recovery: "open-owner",
  });
}

function buildFocusEnvelope(
  sessions: FocusSession[],
  dateKey: string,
): TodaySourceEnvelope<TodayFocusProjection> {
  const data: TodayFocusProjection = {
    sessions,
    evidence: sessions.map((session) =>
      adaptFocusEvidence(session, {
        dateKey,
        attributionAvailable: false,
        attributionLimitation: FOCUS_ATTRIBUTION_UNAVAILABLE,
      }),
    ),
    stats: computeFocusStatsForDate(sessions, dateKey),
    attribution: {
      state: "unavailable",
      limitation: FOCUS_ATTRIBUTION_UNAVAILABLE,
      evidence: sessions.map((session) =>
        adaptFocusAttributionEvidence(session, [], {
          available: false,
          limitation: FOCUS_ATTRIBUTION_UNAVAILABLE,
        }),
      ),
    },
  };

  return envelope("focus", sessions.length === 0 ? "empty" : "partial", data, {
    limitation: sessions.length === 0 ? null : FOCUS_ATTRIBUTION_UNAVAILABLE,
    recovery: "open-owner",
  });
}

function buildReflectionEnvelope(
  reflection: Reflection | null,
): TodaySourceEnvelope<Reflection> {
  return envelope("reflection", reflection ? "ready" : "empty", reflection, {
    limitation: null,
    recovery: "open-owner",
  });
}

function buildHabitsEnvelope(
  habits: Habit[],
): TodaySourceEnvelope<Habit[]> {
  return envelope("habits", habits.length === 0 ? "empty" : "ready", habits, {
    limitation: null,
    recovery: "open-owner",
  });
}

function buildNotesEnvelope(): TodaySourceEnvelope<null> {
  return envelope("notes", "unavailable", null, {
    limitation: "Notes is not part of the approved Today P1 read integration.",
    recovery: "open-owner",
  });
}

function sourceHasConfirmedData<T>(
  source: TodaySourceEnvelope<T> | undefined,
): source is TodaySourceEnvelope<T> {
  return Boolean(
    source &&
      source.data !== null &&
      ["ready", "empty", "partial", "stale"].includes(source.state),
  );
}

function sourceWasConfirmed<T>(
  source: TodaySourceEnvelope<T> | undefined,
): source is TodaySourceEnvelope<T> {
  return Boolean(
    source && ["ready", "empty", "partial", "stale"].includes(source.state),
  );
}

function buildReadError<T>(
  source: TodayReadSource,
  reason: unknown,
  previous: TodaySourceEnvelope<T> | undefined,
): TodaySourceEnvelope<T> {
  const sourceLabel = source[0].toUpperCase() + source.slice(1);

  if (sourceWasConfirmed(previous)) {
    return {
      ...previous,
      state: "stale",
      freshness: "last-confirmed",
      limitation: `${sourceLabel} could not be refreshed. Showing the last confirmed context.`,
      recovery: "retry",
    };
  }

  const isAuthFailure = reason instanceof AuthError;
  return envelope<T>(
    source,
    isAuthFailure ? "unavailable" : "error",
    null,
    {
      limitation: isAuthFailure
        ? `${sourceLabel} is unavailable because access must be reauthenticated.`
        : `${sourceLabel} could not be confirmed. Retry or open ${sourceLabel}.`,
      recovery: isAuthFailure ? "reauthenticate" : "retry",
    },
  );
}

function buildScheduleEnvelope(
  tasks: TodaySourceEnvelope<TodayTasksProjection>,
  habits: TodaySourceEnvelope<Habit[]>,
  previous: TodaySourceEnvelope<ScheduleItem[]> | undefined,
): TodaySourceEnvelope<ScheduleItem[]> {
  const taskData = tasks.data;
  const habitData = habits.data;
  const canCompose =
    taskData !== null &&
    habitData !== null &&
    !["error", "unavailable"].includes(tasks.state) &&
    !["error", "unavailable"].includes(habits.state);

  if (canCompose) {
    const items = buildScheduleItems(taskData.tasks, habitData, "module");
    const stale = tasks.state === "stale" || habits.state === "stale";
    return envelope<ScheduleItem[]>("schedule", items.length === 0 ? "empty" : stale ? "stale" : "ready", items, {
      freshness: stale ? "last-confirmed" : "current",
      limitation: stale
        ? "Schedule is based on last-confirmed task or habit context."
        : "Planned context only; schedule is not action evidence.",
      recovery: stale ? "retry" : "open-owner",
    });
  }

  if (sourceHasConfirmedData(previous)) {
    return {
      ...previous,
      state: "stale",
      freshness: "last-confirmed",
      limitation: "Schedule could not be refreshed. Showing the last confirmed plan.",
      recovery: "retry",
    };
  }

  return envelope<ScheduleItem[]>("schedule", "unavailable", null, {
    limitation: "Schedule is unavailable because its task or habit source is not confirmed.",
    recovery: "retry",
  });
}

function deriveCompositionState(
  sources: TodaySourceEnvelope<unknown>[],
): TodayCompositionState {
  const hasConfirmed = sources.some((source) =>
    ["ready", "empty", "partial", "stale"].includes(source.state),
  );
  const states = new Set(sources.map((source) => source.state));

  if (states.has("error")) return hasConfirmed ? "partial" : "error";
  if (states.has("stale")) return hasConfirmed ? "stale" : "unavailable";
  if (states.has("unavailable")) return hasConfirmed ? "partial" : "unavailable";
  if (states.has("partial")) return "partial";
  return "ready";
}

function createInitialComposition(dateKey: string): TodayComposition {
  const unavailable = <T,>(source: TodayReadSource) =>
    envelope<T>(source, "error", null, {
      limitation: `${source[0].toUpperCase() + source.slice(1)} has not been confirmed yet.`,
      recovery: "retry",
    });

  const tasks = unavailable<TodayTasksProjection>("tasks");
  const focus = unavailable<TodayFocusProjection>("focus");
  const reflection = unavailable<Reflection>("reflection");
  const habits = unavailable<Habit[]>("habits");
  const schedule = buildScheduleEnvelope(tasks, habits, undefined);
  const notes = buildNotesEnvelope();

  return {
    dateKey,
    state: "error",
    tasks,
    focus,
    reflection,
    habits,
    schedule,
    notes,
  };
}

/**
 * Read and compose Today sources independently. A rejected source is mapped
 * to a source-local state so unrelated confirmed context remains usable.
 */
export async function loadTodayComposition(
  options: LoadTodayCompositionOptions = {},
): Promise<TodayComposition> {
  const dateKey = options.dateKey ?? getTodayDateString();
  const previous =
    options.previous?.dateKey === dateKey ? options.previous : null;
  const readers: TodayCompositionReaders = {
    tasks: options.readers?.tasks ?? getDefaultReader("tasks"),
    focus: options.readers?.focus ?? getDefaultReader("focus"),
    reflection:
      options.readers?.reflection ?? getDefaultReader("reflection"),
    habits: options.readers?.habits ?? getDefaultReader("habits"),
  };
  const sources = options.sources ?? TODAY_READ_SOURCES;
  const base = previous ?? createInitialComposition(dateKey);

  const settled = await Promise.allSettled(
    sources.map((source) => readers[source](dateKey)),
  );

  let tasks = base.tasks;
  let focus = base.focus;
  let reflection = base.reflection;
  let habits = base.habits;

  settled.forEach((result, index) => {
    const source = sources[index];
    if (!source) return;

    if (result.status === "fulfilled") {
      switch (source) {
        case "tasks":
          tasks = buildTasksEnvelope(result.value as Task[]);
          break;
        case "focus":
          focus = buildFocusEnvelope(result.value as FocusSession[], dateKey);
          break;
        case "reflection":
          reflection = buildReflectionEnvelope(result.value as Reflection | null);
          break;
        case "habits":
          habits = buildHabitsEnvelope(result.value as Habit[]);
          break;
      }
      return;
    }

    switch (source) {
      case "tasks":
        tasks = buildReadError(source, result.reason, previous?.tasks);
        break;
      case "focus":
        focus = buildReadError(source, result.reason, previous?.focus);
        break;
      case "reflection":
        reflection = buildReadError(source, result.reason, previous?.reflection);
        break;
      case "habits":
        habits = buildReadError(source, result.reason, previous?.habits);
        break;
    }
  });

  const schedule = buildScheduleEnvelope(
    tasks,
    habits,
    previous?.schedule,
  );
  const notes = previous?.notes ?? buildNotesEnvelope();

  return {
    dateKey,
    state: deriveCompositionState([
      tasks,
      focus,
      reflection,
      habits,
      schedule,
    ]),
    tasks,
    focus,
    reflection,
    habits,
    schedule,
    notes,
  };
}
