import type { Note } from "@/types/notes";

/** Keep local title/content after autosave so mid-type server replies cannot rewind the editor. */
export function mergeNotePreserveLocalText(local: Note, saved: Note): Note {
  return {
    ...saved,
    title: local.title,
    content: local.content,
  };
}

export type NoteTextPatch = {
  title?: string;
  content?: string;
};

/** Merge successive keystroke patches for the same note. */
export function mergeNoteTextPatch(
  previous: NoteTextPatch | undefined,
  next: NoteTextPatch,
): NoteTextPatch {
  return {
    ...previous,
    ...next,
  };
}

/** True when pending text still differs from the patch that was just sent. */
export function noteTextPatchStillDirty(
  pending: NoteTextPatch | undefined,
  sent: NoteTextPatch,
): boolean {
  if (!pending) return false;
  if (pending.title !== undefined && pending.title !== sent.title) return true;
  if (pending.content !== undefined && pending.content !== sent.content) {
    return true;
  }
  return false;
}
