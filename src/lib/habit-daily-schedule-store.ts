import { useSyncExternalStore } from "react";
import { readStorageJson, writeStorageJson } from "@/lib/safe-storage";
import type { Habit } from "@/types/habit";

const STORAGE_KEY = "flowos.habit.daily-schedule";

/** habitId -> dateKey -> scheduled_time (null = explicitly unscheduled that day) */
export type HabitDailyScheduleStore = Record<string, Record<string, string | null>>;

let cachedStore: HabitDailyScheduleStore | null = null;
let revision = 0;
const listeners = new Set<() => void>();

function notifyListeners() {
  revision += 1;
  listeners.forEach((listener) => listener());
}

function readLocalStore(): HabitDailyScheduleStore {
  const parsed = readStorageJson<HabitDailyScheduleStore | null>(
    STORAGE_KEY,
    null
  );
  return parsed && typeof parsed === "object" ? parsed : {};
}

function writeLocalStore(store: HabitDailyScheduleStore): boolean {
  return writeStorageJson(STORAGE_KEY, store);
}

export function getCachedHabitDailySchedules(): HabitDailyScheduleStore {
  if (!cachedStore) {
    cachedStore = readLocalStore();
  }
  return cachedStore;
}

export function useHabitDailyScheduleStore(): number {
  return useSyncExternalStore(
    (listener) => {
      listeners.add(listener);
      return () => listeners.delete(listener);
    },
    () => revision,
    () => revision
  );
}

export function getEffectiveHabitScheduledTime(
  habitId: string,
  defaultTime: string | null,
  dateKey: string
): string | null {
  const dayOverrides = getCachedHabitDailySchedules()[habitId];
  if (!dayOverrides || !(dateKey in dayOverrides)) {
    return defaultTime;
  }
  return dayOverrides[dateKey];
}

export function setHabitDailyScheduleOverride(
  habitId: string,
  dateKey: string,
  scheduledTime: string | null
): boolean {
  const previousStore = getCachedHabitDailySchedules();
  const store = { ...previousStore };
  const dayOverrides = { ...(store[habitId] ?? {}) };
  dayOverrides[dateKey] = scheduledTime;
  store[habitId] = dayOverrides;
  if (!writeLocalStore(store)) {
    cachedStore = previousStore;
    return false;
  }
  cachedStore = store;
  notifyListeners();
  return true;
}

export function clearHabitDailyScheduleOverride(
  habitId: string,
  dateKey: string
): boolean {
  const previousStore = getCachedHabitDailySchedules();
  const store = { ...previousStore };
  const dayOverrides = { ...(store[habitId] ?? {}) };
  delete dayOverrides[dateKey];

  if (Object.keys(dayOverrides).length === 0) {
    delete store[habitId];
  } else {
    store[habitId] = dayOverrides;
  }

  if (!writeLocalStore(store)) {
    cachedStore = previousStore;
    return false;
  }
  cachedStore = store;
  notifyListeners();
  return true;
}

export function withHabitScheduleForDate(
  habits: Habit[],
  dateKey: string
): Habit[] {
  return habits.map((habit) => ({
    ...habit,
    scheduled_time: getEffectiveHabitScheduledTime(
      habit.id,
      habit.scheduled_time,
      dateKey
    ),
  }));
}
