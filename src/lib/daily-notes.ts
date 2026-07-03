import { requireUserId } from "@/lib/auth";
import { formatDailyNoteTitle } from "@/lib/date-utils";
import { fetchGrowthAreas, GrowthAreasError } from "@/lib/growth-areas";
import { createNote, NotesError, normalizeNoteForClient, updateNote } from "@/lib/notes";
import { supabase } from "@/lib/supabase";
import type { GrowthArea, GrowthAreaWithCounts, Note } from "@/types/notes";

export const DAILY_NOTES_GROWTH_AREA_NAME = "Daily Notes";

export class DailyNotesError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "DailyNotesError";
  }
}

export async function ensureDailyNotesGrowthArea(): Promise<GrowthArea> {
  const userId = await requireUserId();

  const { data: existing, error: lookupError } = await supabase
    .from("growth_areas")
    .select("*")
    .eq("user_id", userId)
    .eq("name", DAILY_NOTES_GROWTH_AREA_NAME)
    .maybeSingle();

  if (lookupError) throw new DailyNotesError(lookupError.message);
  if (existing) return existing;

  const { data, error } = await supabase
    .from("growth_areas")
    .insert({
      user_id: userId,
      name: DAILY_NOTES_GROWTH_AREA_NAME,
      emoji: "📅",
      description: "Daily journals and dated notes.",
      sort_order: -1,
    })
    .select()
    .single();

  if (error) throw new DailyNotesError(error.message);
  return data;
}

export async function getDailyNoteByDate(
  dateKey: string
): Promise<Note | null> {
  const userId = await requireUserId();

  const { data, error } = await supabase
    .from("notes")
    .select("*")
    .eq("user_id", userId)
    .eq("note_date", dateKey)
    .maybeSingle();

  if (error) throw new DailyNotesError(error.message);
  if (!data) return null;
  return normalizeNoteForClient(data);
}

export async function getOrCreateDailyNote(dateKey: string): Promise<Note> {
  const expectedTitle = formatDailyNoteTitle(dateKey);
  const existing = await getDailyNoteByDate(dateKey);
  if (existing) {
    if (existing.title !== expectedTitle) {
      return updateNote(existing.id, { title: expectedTitle });
    }
    return existing;
  }

  const area = await ensureDailyNotesGrowthArea();

  return createNote({
    growth_area_id: area.id,
    title: expectedTitle,
    content: "",
    note_date: dateKey,
  });
}

export async function createBlankNoteInDailyNotes(): Promise<Note> {
  const area = await ensureDailyNotesGrowthArea();

  return createNote({
    growth_area_id: area.id,
    title: "",
    content: "",
  });
}

export type SidebarNotesData = {
  areas: GrowthAreaWithCounts[];
  notes: Note[];
};

export async function fetchSidebarNotesData(): Promise<SidebarNotesData> {
  await ensureDailyNotesGrowthArea();

  let areas: GrowthAreaWithCounts[];
  try {
    areas = await fetchGrowthAreas();
  } catch (err) {
    throw new DailyNotesError(
      err instanceof GrowthAreasError ? err.message : "Failed to load areas."
    );
  }

  const userId = await requireUserId();
  const { data, error } = await supabase
    .from("notes")
    .select("*")
    .eq("user_id", userId)
    .order("is_menu_pinned", { ascending: false })
    .order("is_pinned", { ascending: false })
    .order("updated_at", { ascending: false });

  if (error) throw new DailyNotesError(error.message);

  return {
    areas,
    notes: (data ?? []).map(normalizeNoteForClient),
  };
}

export function groupNotesByArea(
  areas: GrowthAreaWithCounts[],
  notes: Note[]
): { area: GrowthAreaWithCounts; notes: Note[] }[] {
  const areaMap = new Map(areas.map((area) => [area.id, area]));
  const grouped = new Map<string, Note[]>();

  for (const note of notes) {
    const bucket = grouped.get(note.growth_area_id) ?? [];
    bucket.push(note);
    grouped.set(note.growth_area_id, bucket);
  }

  return areas
    .map((area) => ({
      area,
      notes: grouped.get(area.id) ?? [],
    }))
    .filter((group) => group.notes.length > 0);
}

export function searchSidebarNotes(
  notes: Note[],
  areas: GrowthAreaWithCounts[],
  query: string
): Note[] {
  const q = query.trim().toLowerCase();
  if (!q) return notes;

  const areaNames = new Map(areas.map((area) => [area.id, area.name.toLowerCase()]));

  return notes.filter((note) => {
    const areaName = areaNames.get(note.growth_area_id) ?? "";
    return (
      note.title.toLowerCase().includes(q) ||
      note.content.toLowerCase().includes(q) ||
      areaName.includes(q)
    );
  });
}
