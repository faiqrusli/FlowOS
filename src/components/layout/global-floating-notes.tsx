"use client";

import { NoteFloatingCard } from "@/components/notes/note-floating-card";
import { useGlobalRightSidebar } from "@/contexts/global-right-sidebar-context";

export function GlobalFloatingNotes() {
  const { floatingNotes, closeFloatingNote, openNoteInSidebar } =
    useGlobalRightSidebar();

  return (
    <>
      {floatingNotes.map((note, index) => (
        <NoteFloatingCard
          key={note.id}
          note={note}
          offsetIndex={index}
          onClose={() => closeFloatingNote(note.id)}
          onOpenInSidebar={() => openNoteInSidebar(note.id)}
        />
      ))}
    </>
  );
}
