import { getTodayDateString, getYesterdayDateString } from "@/lib/date-utils";
import { fetchDashboardData } from "@/lib/dashboard";
import { formatDuration } from "@/lib/focus-utils";
import {
  buildReflectionPreview,
  fetchReflections,
  fetchTodayReflection as fetchTodayReflectionFromDb,
  saveReflection as saveReflectionToDb,
} from "@/lib/reflections-db";
import type {
  CustomEntry,
  DaySummary,
  Reflection,
  ReflectionDraft,
} from "@/types/reflection";

export {
  buildReflectionPreview,
  fetchReflections,
};

export async function fetchTodayReflection(): Promise<Reflection | null> {
  return fetchTodayReflectionFromDb(getTodayDateString());
}

export async function fetchTodaySummary(): Promise<DaySummary> {
  const dashboard = await fetchDashboardData();
  return dashboard.progress;
}

export async function saveReflection(draft: ReflectionDraft): Promise<Reflection> {
  return saveReflectionToDb(getTodayDateString(), draft);
}

export function createEmptyCustomEntry(): CustomEntry {
  return {
    id: crypto.randomUUID(),
    title: "",
    content: "",
  };
}

export function formatSummaryLine(summary: DaySummary): string {
  return `Tasks ${summary.tasksCompleted}/${summary.tasksTotal} · Habits ${summary.habitsCompleted}/${summary.habitsTotal} · Focus ${formatDuration(summary.focusSeconds)}`;
}

export function getReflectionDayLabel(date: string): string {
  const today = getTodayDateString();
  const yesterdayKey = getYesterdayDateString();

  if (date === today) return "Today";
  if (date === yesterdayKey) return "Yesterday";

  return new Date(date + "T12:00:00").toLocaleDateString(undefined, {
    weekday: "long",
    month: "short",
    day: "numeric",
  });
}

export function formatReflectionSavedAt(iso: string): string {
  return new Date(iso).toLocaleTimeString(undefined, {
    hour: "numeric",
    minute: "2-digit",
  });
}
