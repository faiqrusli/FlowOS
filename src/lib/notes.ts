import { requireUserId } from "@/lib/auth";
import { supabase } from "@/lib/supabase";
import type { Note, NoteInsert, NoteUpdate } from "@/types/notes";

export class NotesError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "NotesError";
  }
}

function normalizeNote(note: Note): Note {
  return { ...note, is_pinned: note.is_pinned ?? false };
}

export async function fetchNotesByArea(growthAreaId: string): Promise<Note[]> {
  const userId = await requireUserId();

  const { data, error } = await supabase
    .from("notes")
    .select("*")
    .eq("user_id", userId)
    .eq("growth_area_id", growthAreaId)
    .order("is_pinned", { ascending: false })
    .order("updated_at", { ascending: false });

  if (error) throw new NotesError(error.message);
  return (data ?? []).map(normalizeNote);
}

export async function createNote(input: NoteInsert): Promise<Note> {
  const userId = await requireUserId();

  const { data, error } = await supabase
    .from("notes")
    .insert({
      growth_area_id: input.growth_area_id,
      title: input.title ?? "Untitled",
      content: input.content ?? "",
      is_pinned: input.is_pinned ?? false,
      user_id: userId,
    })
    .select()
    .single();

  if (error) throw new NotesError(error.message);
  return normalizeNote(data);
}

export async function updateNote(id: string, input: NoteUpdate): Promise<Note> {
  const userId = await requireUserId();

  const { data, error } = await supabase
    .from("notes")
    .update(input)
    .eq("id", id)
    .eq("user_id", userId)
    .select()
    .single();

  if (error) throw new NotesError(error.message);
  return normalizeNote(data);
}
export async function deleteNote(id: string): Promise<void> {
  const userId = await requireUserId();

  const { error } = await supabase
    .from("notes")
    .delete()
    .eq("id", id)
    .eq("user_id", userId);

  if (error) throw new NotesError(error.message);
}

export async function moveNote(
  noteId: string,
  growthAreaId: string
): Promise<Note> {
  return updateNote(noteId, { growth_area_id: growthAreaId, is_pinned: false });
}

export async function setNotePinned(
  noteId: string,
  isPinned: boolean
): Promise<Note> {
  return updateNote(noteId, { is_pinned: isPinned });
}

export async function getNote(id: string): Promise<Note | null> {
  const userId = await requireUserId();

  const { data, error } = await supabase
    .from("notes")
    .select("*")
    .eq("id", id)
    .eq("user_id", userId)
    .maybeSingle();

  if (error) throw new NotesError(error.message);
  if (!data) return null;
  return normalizeNote(data);
}
