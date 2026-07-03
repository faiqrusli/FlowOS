import { useSyncExternalStore } from "react";
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
  if (typeof window === "undefined") return {};

  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return {};

    const parsed = JSON.parse(raw) as HabitDailyScheduleStore;
    return parsed && typeof parsed === "object" ? parsed : {};
  } catch {
    return {};
  }
}

function writeLocalStore(store: HabitDailyScheduleStore): void {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(store));
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
): void {
  const store = { ...getCachedHabitDailySchedules() };
  const dayOverrides = { ...(store[habitId] ?? {}) };
  dayOverrides[dateKey] = scheduledTime;
  store[habitId] = dayOverrides;
  cachedStore = store;
  writeLocalStore(store);
  notifyListeners();
}

export function clearHabitDailyScheduleOverride(
  habitId: string,
  dateKey: string
): void {
  const store = { ...getCachedHabitDailySchedules() };
  const dayOverrides = { ...(store[habitId] ?? {}) };
  delete dayOverrides[dateKey];

  if (Object.keys(dayOverrides).length === 0) {
    delete store[habitId];
  } else {
    store[habitId] = dayOverrides;
  }

  cachedStore = store;
  writeLocalStore(store);
  notifyListeners();
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
