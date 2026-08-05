import { supabase } from "@/lib/supabase";
import { requireUserId } from "@/lib/auth";
import type { CustomEntry, Reflection, ReflectionDraft, ReflectionKanban } from "@/types/reflection";
import { ReflectionsError } from "@/lib/reflections-errors";
import { parseReflectionDateKey, parseReflectionDraft } from "@/lib/validation";

type ReflectionRow = {
  id: string;
  reflection_date: string;
  went_well: string;
  went_wrong: string;
  custom_kanbans: ReflectionKanban[] | null;
  user_id: string | null;
  created_at: string;
};

type ReflectionEntryRow = {
  id: string;
  reflection_id: string;
  title: string;
  content: string;
  user_id: string | null;
  created_at: string;
};

type ReflectionRowWithEntries = ReflectionRow & {
  reflection_entries: ReflectionEntryRow[] | null;
};

const REFLECTION_SELECT = "*, reflection_entries(*)";

function entryRowToCustomEntry(row: ReflectionEntryRow): CustomEntry {
  return {
    id: row.id,
    title: row.title,
    content: row.content ?? "",
  };
}

function normalizeKanbans(value: unknown): ReflectionKanban[] {
  if (!Array.isArray(value)) return [];
  return value
    .filter((item): item is ReflectionKanban => {
      return (
        item !== null &&
        typeof item === "object" &&
        typeof (item as ReflectionKanban).id === "string" &&
        typeof (item as ReflectionKanban).title === "string" &&
        Array.isArray((item as ReflectionKanban).cards)
      );
    })
    .map((kanban) => ({
      id: kanban.id,
      title: kanban.title,
      collapsed: kanban.collapsed ?? false,
      cards: (kanban.cards ?? []).map((card) => ({
        id: card.id,
        content: card.content ?? "",
      })),
    }));
}

function rowToReflection(row: ReflectionRowWithEntries): Reflection {
  const entries = row.reflection_entries ?? [];

  return {
    id: row.id,
    reflection_date: row.reflection_date,
    went_well: row.went_well ?? "",
    went_wrong: row.went_wrong ?? "",
    custom_entries: entries.map(entryRowToCustomEntry),
    custom_kanbans: normalizeKanbans(row.custom_kanbans),
    user_id: row.user_id,
    created_at: row.created_at,
  };
}

async function saveReflectionEntries(
  reflectionId: string,
  userId: string,
  entries: CustomEntry[]
): Promise<CustomEntry[]> {
  const filtered = entries.filter((entry) => entry.title.trim());
  const nextRows = filtered.map((entry) => ({
    id: entry.id,
    reflection_id: reflectionId,
    user_id: userId,
    title: entry.title.trim(),
    content: entry.content,
  }));

  // Upsert before removing stale rows. A failed insert therefore leaves the
  // previously confirmed entries intact instead of turning a save failure into
  // an accidental empty reflection.
  if (nextRows.length > 0) {
    const { error } = await supabase
      .from("reflection_entries")
      .upsert(nextRows, { onConflict: "id" });

    if (error) {
      throw new ReflectionsError(error.message);
    }
  }

  const { data: existingRows, error: existingError } = await supabase
    .from("reflection_entries")
    .select("id")
    .eq("reflection_id", reflectionId)
    .eq("user_id", userId);

  if (existingError) throw new ReflectionsError(existingError.message);

  const nextIds = new Set(nextRows.map((entry) => entry.id));
  const staleIds = (existingRows ?? [])
    .map((row) => row.id)
    .filter((id) => !nextIds.has(id));

  if (staleIds.length > 0) {
    const { error } = await supabase
      .from("reflection_entries")
      .delete()
      .eq("reflection_id", reflectionId)
      .eq("user_id", userId)
      .in("id", staleIds);

    if (error) throw new ReflectionsError(error.message);
  }

  return filtered;
}

export async function fetchReflectionsFromSupabase(): Promise<Reflection[]> {
  const userId = await requireUserId();
  const { data, error } = await supabase
    .from("reflections")
    .select(REFLECTION_SELECT)
    .eq("user_id", userId)
    .order("reflection_date", { ascending: false });

  if (error) {
    throw new ReflectionsError(error.message);
  }

  return (data as unknown as ReflectionRowWithEntries[]).map(rowToReflection);
}

export async function fetchTodayReflectionFromSupabase(
  dateKey: string
): Promise<Reflection | null> {
  const userId = await requireUserId();
  const parsedDateKey = parseReflectionDateKey(dateKey);
  const { data, error } = await supabase
    .from("reflections")
    .select(REFLECTION_SELECT)
    .eq("user_id", userId)
    .eq("reflection_date", parsedDateKey)
    .maybeSingle();

  if (error) {
    throw new ReflectionsError(error.message);
  }

  return data
    ? rowToReflection(data as unknown as ReflectionRowWithEntries)
    : null;
}

export async function saveReflectionToSupabase(
  dateKey: string,
  draft: ReflectionDraft
): Promise<Reflection> {
  const userId = await requireUserId();
  const parsedDateKey = parseReflectionDateKey(dateKey);
  const parsedDraft = parseReflectionDraft(draft);
  const payload = {
    reflection_date: parsedDateKey,
    went_well: parsedDraft.went_well,
    went_wrong: parsedDraft.went_wrong,
    custom_kanbans: parsedDraft.custom_kanbans ?? [],
    user_id: userId,
  };

  const { data: existing } = await supabase
    .from("reflections")
    .select("id, created_at")
    .eq("user_id", userId)
    .eq("reflection_date", dateKey)
    .maybeSingle();

  let reflectionRow: ReflectionRow;

  if (existing) {
    const { data, error } = await supabase
      .from("reflections")
      .update({
        went_well: payload.went_well,
        went_wrong: payload.went_wrong,
        custom_kanbans: payload.custom_kanbans,
      })
      .eq("id", existing.id)
      .eq("user_id", userId)
      .select()
      .single();

    if (error) throw new ReflectionsError(error.message);
    reflectionRow = data as ReflectionRow;
  } else {
    const { data, error } = await supabase
      .from("reflections")
      .insert(payload)
      .select()
      .single();

    if (error) throw new ReflectionsError(error.message);
    reflectionRow = data as ReflectionRow;
  }

  const custom_entries = await saveReflectionEntries(
    reflectionRow.id,
    userId,
    parsedDraft.custom_entries
  );

  return {
    id: reflectionRow.id,
    reflection_date: reflectionRow.reflection_date,
    went_well: reflectionRow.went_well ?? "",
    went_wrong: reflectionRow.went_wrong ?? "",
    custom_entries,
    custom_kanbans: normalizeKanbans(reflectionRow.custom_kanbans),
    user_id: reflectionRow.user_id,
    created_at: reflectionRow.created_at,
  };
}
