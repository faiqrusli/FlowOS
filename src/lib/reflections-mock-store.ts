import { createSeedReflections } from "@/lib/reflections-mock-data";
import type { Reflection, ReflectionDraft } from "@/types/reflection";

const STORAGE_KEY = "flowos.reflections.mock";

function createId(): string {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
    return crypto.randomUUID();
  }
  return `reflection-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
}

function sortByDateDesc(items: Reflection[]): Reflection[] {
  return [...items].sort(
    (a, b) =>
      new Date(b.reflection_date).getTime() -
      new Date(a.reflection_date).getTime()
  );
}

function readStoredReflections(): Reflection[] {
  if (typeof window === "undefined") {
    return createSeedReflections();
  }

  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw) as Reflection[];
      if (Array.isArray(parsed) && parsed.length > 0) {
        return sortByDateDesc(parsed);
      }
    }
  } catch {
    // Fall through to seed data if storage is unavailable or corrupt.
  }

  const seed = createSeedReflections();
  writeStoredReflections(seed);
  return seed;
}

function writeStoredReflections(reflections: Reflection[]): void {
  if (typeof window === "undefined") {
    return;
  }

  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(reflections));
}

export function listMockReflections(): Reflection[] {
  return readStoredReflections();
}

export function getMockReflectionByDate(dateKey: string): Reflection | null {
  return readStoredReflections().find((r) => r.reflection_date === dateKey) ?? null;
}

export function saveMockReflection(
  dateKey: string,
  draft: ReflectionDraft
): Reflection {
  const reflections = readStoredReflections();
  const custom_entries = draft.custom_entries
    .filter((entry) => entry.title.trim())
    .map((entry) => ({
      id: entry.id || createId(),
      title: entry.title.trim(),
      content: entry.content,
    }));

  const existingIndex = reflections.findIndex(
    (r) => r.reflection_date === dateKey
  );

  let saved: Reflection;

  if (existingIndex >= 0) {
    const existing = reflections[existingIndex];
    saved = {
      ...existing,
      went_well: draft.went_well,
      went_wrong: draft.went_wrong,
      custom_entries,
    };
    reflections[existingIndex] = saved;
  } else {
    saved = {
      id: createId(),
      reflection_date: dateKey,
      went_well: draft.went_well,
      went_wrong: draft.went_wrong,
      custom_entries,
      created_at: new Date().toISOString(),
      user_id: null,
    };
    reflections.push(saved);
  }

  writeStoredReflections(sortByDateDesc(reflections));
  return saved;
}

/** Reset store to seed data (useful for dev/testing). */
export function resetMockReflections(): void {
  writeStoredReflections(createSeedReflections());
}
