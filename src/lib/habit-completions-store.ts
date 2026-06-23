import { getTodayDateString } from "@/lib/date-utils";
import { supabase } from "@/lib/supabase";

const STORAGE_KEY = "flowos.habit.completions";

export type HabitCompletionStore = Record<string, string[]>;

function readLocalCompletions(): HabitCompletionStore {
  if (typeof window === "undefined") return {};

  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return {};

    const parsed = JSON.parse(raw) as HabitCompletionStore;
    return parsed && typeof parsed === "object" ? parsed : {};
  } catch {
    return {};
  }
}

function writeLocalCompletions(store: HabitCompletionStore): void {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(store));
}

function normalizeStore(store: HabitCompletionStore): HabitCompletionStore {
  const normalized: HabitCompletionStore = {};

  for (const [habitId, dates] of Object.entries(store)) {
    if (!Array.isArray(dates)) continue;
    normalized[habitId] = [...new Set(dates)].sort();
  }

  return normalized;
}

async function fetchRemoteCompletions(): Promise<HabitCompletionStore | null> {
  const { data, error } = await supabase
    .from("habit_completions")
    .select("habit_id, completion_date");

  if (error) {
    return null;
  }

  const store: HabitCompletionStore = {};

  for (const row of data ?? []) {
    const habitId = row.habit_id;
    const dateKey = row.completion_date;
    if (!store[habitId]) store[habitId] = [];
    store[habitId].push(dateKey);
  }

  return normalizeStore(store);
}

function mergeStores(
  local: HabitCompletionStore,
  remote: HabitCompletionStore
): HabitCompletionStore {
  const merged: HabitCompletionStore = { ...remote };

  for (const [habitId, dates] of Object.entries(local)) {
    merged[habitId] = [...new Set([...(merged[habitId] ?? []), ...dates])].sort();
  }

  return merged;
}

let cachedCompletions: HabitCompletionStore | null = null;

export function getCachedHabitCompletions(): HabitCompletionStore {
  if (!cachedCompletions) {
    cachedCompletions = normalizeStore(readLocalCompletions());
  }
  return cachedCompletions;
}

export async function loadHabitCompletions(): Promise<HabitCompletionStore> {
  const local = normalizeStore(readLocalCompletions());
  const remote = await fetchRemoteCompletions();
  const merged = remote ? mergeStores(local, remote) : local;

  cachedCompletions = merged;
  writeLocalCompletions(merged);
  return merged;
}

export function getHabitCompletionDates(habitId: string): string[] {
  return getCachedHabitCompletions()[habitId] ?? [];
}

async function persistRemoteCompletion(
  habitId: string,
  dateKey: string,
  action: "insert" | "delete"
): Promise<void> {
  if (action === "insert") {
    const { error } = await supabase.from("habit_completions").upsert(
      { habit_id: habitId, completion_date: dateKey },
      { onConflict: "habit_id,completion_date" }
    );

    if (error) {
      console.warn("[habits] remote completion insert failed", error.message);
    }

    return;
  }

  const { error } = await supabase
    .from("habit_completions")
    .delete()
    .eq("habit_id", habitId)
    .eq("completion_date", dateKey);

  if (error) {
    console.warn("[habits] remote completion delete failed", error.message);
  }
}

export async function recordHabitCompletion(
  habitId: string,
  dateKey = getTodayDateString()
): Promise<void> {
  const store = { ...getCachedHabitCompletions() };
  const dates = new Set(store[habitId] ?? []);
  dates.add(dateKey);
  store[habitId] = [...dates].sort();

  cachedCompletions = store;
  writeLocalCompletions(store);
  await persistRemoteCompletion(habitId, dateKey, "insert");
}

export async function removeHabitCompletion(
  habitId: string,
  dateKey = getTodayDateString()
): Promise<void> {
  const store = { ...getCachedHabitCompletions() };
  store[habitId] = (store[habitId] ?? []).filter((date) => date !== dateKey);

  cachedCompletions = store;
  writeLocalCompletions(store);
  await persistRemoteCompletion(habitId, dateKey, "delete");
}

export function removeAllHabitCompletions(habitId: string): void {
  const store = { ...getCachedHabitCompletions() };
  delete store[habitId];
  cachedCompletions = store;
  writeLocalCompletions(store);
}

export function syncTodayCompletionFromHabit(
  habitId: string,
  completed: boolean,
  dateKey = getTodayDateString()
): void {
  const store = { ...getCachedHabitCompletions() };
  const dates = new Set(store[habitId] ?? []);

  if (completed) {
    dates.add(dateKey);
  } else {
    dates.delete(dateKey);
  }

  store[habitId] = [...dates].sort();
  cachedCompletions = store;
  writeLocalCompletions(store);
}

export function reconcileCompletionsWithHabits(
  habits: { id: string; completed: boolean }[]
): void {
  const todayKey = getTodayDateString();
  const store = { ...getCachedHabitCompletions() };
  let changed = false;

  for (const habit of habits) {
    const dates = new Set(store[habit.id] ?? []);

    if (habit.completed && !dates.has(todayKey)) {
      dates.add(todayKey);
      store[habit.id] = [...dates].sort();
      changed = true;
    }

    if (!habit.completed && dates.has(todayKey)) {
      dates.delete(todayKey);
      store[habit.id] = [...dates].sort();
      changed = true;
    }
  }

  if (changed) {
    cachedCompletions = store;
    writeLocalCompletions(store);
  }
}
