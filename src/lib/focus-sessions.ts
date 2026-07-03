import { supabase } from "@/lib/supabase";
import { requireUserId } from "@/lib/auth";
import { isSameDay, parseTimestamp } from "@/lib/date-utils";
import {
  getSessionBreakSeconds,
  getSessionFocusSeconds,
} from "@/lib/focus-utils";
import type { FocusSession, FocusSessionInsert } from "@/types/focus";

export class FocusSessionsError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "FocusSessionsError";
  }
}

function sessionFingerprint(session: FocusSession): string {
  return [
    session.started_at,
    session.ended_at ?? "",
    session.focus_duration,
    session.break_duration,
    session.session_status,
  ].join("|");
}

/** Collapse duplicate rows (same timestamps/durations) keeping the newest created_at. */
export function dedupeFocusSessions(sessions: FocusSession[]): FocusSession[] {
  const byFingerprint = new Map<string, FocusSession>();

  for (const session of sessions) {
    const fingerprint = sessionFingerprint(session);
    const existing = byFingerprint.get(fingerprint);

    if (!existing) {
      byFingerprint.set(fingerprint, session);
      continue;
    }

    const existingCreated = existing.created_at
      ? parseTimestamp(existing.created_at).getTime()
      : 0;
    const sessionCreated = session.created_at
      ? parseTimestamp(session.created_at).getTime()
      : 0;

    if (sessionCreated >= existingCreated) {
      byFingerprint.set(fingerprint, session);
    }
  }

  return Array.from(byFingerprint.values());
}

export function mergeFocusSessions(
  existing: FocusSession[],
  incoming: FocusSession[]
): FocusSession[] {
  const byId = new Map<string, FocusSession>();

  for (const session of [...incoming, ...existing]) {
    byId.set(session.id, session);
  }

  return dedupeFocusSessions(Array.from(byId.values())).sort(
    (a, b) =>
      parseTimestamp(b.started_at).getTime() -
      parseTimestamp(a.started_at).getTime()
  );
}

export async function fetchFocusSessions(): Promise<FocusSession[]> {
  const userId = await requireUserId();
  const { data, error } = await supabase
    .from("focus_sessions")
    .select("*")
    .eq("user_id", userId)
    .order("started_at", { ascending: false });

  if (error) {
    throw new FocusSessionsError(error.message);
  }

  const rows = data ?? [];
  const deduped = dedupeFocusSessions(rows).map((session) => ({
    ...session,
    target_type: session.target_type ?? null,
    target_id: session.target_id ?? null,
  }));

  if (typeof window !== "undefined") {
    console.log("[focus] fetchFocusSessions", {
      rawCount: rows.length,
      uniqueIdCount: new Set(rows.map((row) => row.id)).size,
      dedupedCount: deduped.length,
    });

    if (deduped.length !== rows.length) {
      console.warn("[focus] removed duplicate focus session rows", {
        removed: rows.length - deduped.length,
      });
    }
  }

  return deduped;
}

let insertCounter = 0;

export async function saveFocusSession(
  session: FocusSessionInsert
): Promise<FocusSession> {
  const userId = await requireUserId();
  insertCounter += 1;
  const attempt = insertCounter;

  if (typeof window !== "undefined") {
    console.log("[focus] saveFocusSession insert attempt", {
      attempt,
      started_at: session.started_at,
      focus_duration: session.focus_duration,
      break_duration: session.break_duration,
      session_status: session.session_status,
    });
  }

  const { data, error } = await supabase
    .from("focus_sessions")
    .insert({ ...session, user_id: userId })
    .select()
    .single();

  if (error) {
    console.error("[focus] saveFocusSession insert failed", { attempt, error });
    throw new FocusSessionsError(error.message);
  }

  if (typeof window !== "undefined") {
    console.log("[focus] saveFocusSession insert success", {
      attempt,
      insertCount: 1,
      id: data.id,
    });
  }

  return data;
}

export function buildFocusSessionInsert(payload: {
  focus_seconds: number;
  break_seconds: number;
  started_at: string;
  ended_at: string;
  session_status: FocusSessionInsert["session_status"];
  target_type?: FocusSessionInsert["target_type"];
  target_id?: FocusSessionInsert["target_id"];
}): FocusSessionInsert {
  return {
    focus_duration: Math.max(0, Math.round(payload.focus_seconds)),
    break_duration: Math.max(0, Math.round(payload.break_seconds)),
    started_at: payload.started_at,
    ended_at: payload.ended_at,
    session_status: payload.session_status,
    target_type: payload.target_type ?? null,
    target_id: payload.target_id ?? null,
  };
}

export function computeFocusStatsForDate(
  sessions: FocusSession[],
  dateKey: string
) {
  const daySessions = sessions.filter((s) => isSameDay(s.started_at, dateKey));

  return daySessions.reduce(
    (acc, session) => ({
      totalFocusSeconds: acc.totalFocusSeconds + getSessionFocusSeconds(session),
      totalBreakSeconds: acc.totalBreakSeconds + getSessionBreakSeconds(session),
      sessionCount: acc.sessionCount + 1,
    }),
    { totalFocusSeconds: 0, totalBreakSeconds: 0, sessionCount: 0 }
  );
}
