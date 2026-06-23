import { supabase } from "@/lib/supabase";
import { requireUserId } from "@/lib/auth";
import type { CustomEntry, Reflection, ReflectionDraft } from "@/types/reflection";
import { ReflectionsError } from "@/lib/reflections-errors";

type ReflectionRow = {
  id: string;
  reflection_date: string;
  went_well: string;
  went_wrong: string;
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

function rowToReflection(row: ReflectionRowWithEntries): Reflection {
  const entries = row.reflection_entries ?? [];

  return {
    id: row.id,
    reflection_date: row.reflection_date,
    went_well: row.went_well ?? "",
    went_wrong: row.went_wrong ?? "",
    custom_entries: entries.map(entryRowToCustomEntry),
    user_id: row.user_id,
    created_at: row.created_at,
  };
}

async function saveReflectionEntries(
  reflectionId: string,
  userId: string,
  entries: CustomEntry[]
): Promise<CustomEntry[]> {
  const { error: deleteError } = await supabase
    .from("reflection_entries")
    .delete()
    .eq("reflection_id", reflectionId)
    .eq("user_id", userId);

  if (deleteError) {
    throw new ReflectionsError(deleteError.message);
  }

  const filtered = entries.filter((entry) => entry.title.trim());
  if (filtered.length === 0) {
    return [];
  }

  const { data, error } = await supabase
    .from("reflection_entries")
    .insert(
      filtered.map((entry) => ({
        id: entry.id,
        reflection_id: reflectionId,
        user_id: userId,
        title: entry.title.trim(),
        content: entry.content,
      }))
    )
    .select();

  if (error) {
    throw new ReflectionsError(error.message);
  }

  return (data as ReflectionEntryRow[]).map(entryRowToCustomEntry);
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

  return (data as ReflectionRowWithEntries[]).map(rowToReflection);
}

export async function fetchTodayReflectionFromSupabase(
  dateKey: string
): Promise<Reflection | null> {
  const userId = await requireUserId();
  const { data, error } = await supabase
    .from("reflections")
    .select(REFLECTION_SELECT)
    .eq("user_id", userId)
    .eq("reflection_date", dateKey)
    .maybeSingle();

  if (error) {
    throw new ReflectionsError(error.message);
  }

  return data ? rowToReflection(data as ReflectionRowWithEntries) : null;
}

export async function saveReflectionToSupabase(
  dateKey: string,
  draft: ReflectionDraft
): Promise<Reflection> {
  const userId = await requireUserId();
  const payload = {
    reflection_date: dateKey,
    went_well: draft.went_well,
    went_wrong: draft.went_wrong,
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
    draft.custom_entries
  );

  return {
    id: reflectionRow.id,
    reflection_date: reflectionRow.reflection_date,
    went_well: reflectionRow.went_well ?? "",
    went_wrong: reflectionRow.went_wrong ?? "",
    custom_entries,
    user_id: reflectionRow.user_id,
    created_at: reflectionRow.created_at,
  };
}
