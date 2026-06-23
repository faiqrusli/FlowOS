import {
  fetchReflectionsFromSupabase,
  fetchTodayReflectionFromSupabase,
  saveReflectionToSupabase,
} from "@/lib/reflections-db.supabase";
import { ReflectionsError } from "@/lib/reflections-errors";
import type { Reflection, ReflectionDraft } from "@/types/reflection";

export { ReflectionsError };

export async function fetchReflections(): Promise<Reflection[]> {
  return fetchReflectionsFromSupabase();
}

export async function fetchTodayReflection(
  dateKey: string
): Promise<Reflection | null> {
  return fetchTodayReflectionFromSupabase(dateKey);
}

export async function saveReflection(
  dateKey: string,
  draft: ReflectionDraft
): Promise<Reflection> {
  return saveReflectionToSupabase(dateKey, draft);
}

export function buildReflectionPreview(reflection: Reflection): string {
  if (reflection.went_well.trim()) {
    const text = reflection.went_well.trim();
    return text.length > 80 ? `${text.slice(0, 80)}…` : text;
  }
  if (reflection.went_wrong.trim()) {
    const text = reflection.went_wrong.trim();
    return text.length > 80 ? `${text.slice(0, 80)}…` : text;
  }
  if (reflection.custom_entries.length > 0) {
    const entry = reflection.custom_entries[0];
    const text = `${entry.title}: ${entry.content}`;
    return text.length > 80 ? `${text.slice(0, 80)}…` : text;
  }
  return "Reflection saved.";
}
