import { describe, expect, it } from "vitest";
import {
  mergeNotePreserveLocalText,
  mergeNoteTextPatch,
  noteTextPatchStillDirty,
} from "@/lib/note-autosave";
import type { Note } from "@/types/notes";

function note(partial: Partial<Note> & Pick<Note, "id" | "title" | "content">): Note {
  return {
    user_id: "user",
    growth_area_id: "area",
    note_date: null,
    created_at: "2026-07-26T00:00:00.000Z",
    updated_at: "2026-07-26T00:00:00.000Z",
    is_pinned: false,
    is_menu_pinned: false,
    ...partial,
  };
}

describe("note-autosave", () => {
  it("preserves local title and content after save", () => {
    const local = note({
      id: "1",
      title: "Local title",
      content: "typed further",
      updated_at: "2026-07-26T01:00:00.000Z",
    });
    const saved = note({
      id: "1",
      title: "Older title",
      content: "older body",
      updated_at: "2026-07-26T01:00:01.000Z",
    });

    expect(mergeNotePreserveLocalText(local, saved)).toEqual({
      ...saved,
      title: "Local title",
      content: "typed further",
    });
  });

  it("detects dirty pending patches after a save", () => {
    const sent = mergeNoteTextPatch(undefined, { content: "ab" });
    const pending = mergeNoteTextPatch(sent, { content: "abc" });
    expect(noteTextPatchStillDirty(pending, sent)).toBe(true);
    expect(noteTextPatchStillDirty(sent, sent)).toBe(false);
  });
});
