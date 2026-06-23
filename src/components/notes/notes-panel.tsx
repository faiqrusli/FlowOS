"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Plus, Search, Trash2 } from "lucide-react";
import { ConvertActions } from "@/components/notes/convert-actions";
import { MarkdownEditor } from "@/components/notes/markdown-editor";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  createNote,
  deleteNote,
  NotesError,
  updateNote,
} from "@/lib/notes";
import { formatRelativeTime } from "@/lib/notes-utils";
import { cn } from "@/lib/utils";
import type { Note } from "@/types/notes";

type NotesPanelProps = {
  growthAreaId: string;
  notes: Note[];
  onNotesChange: (notes: Note[]) => void;
  onAreasRefresh: () => void;
  embedded?: boolean;
};

export function NotesPanel({
  growthAreaId,
  notes,
  onNotesChange,
  onAreasRefresh,
  embedded = false,
}: NotesPanelProps) {
  const [selectedId, setSelectedId] = useState<string | null>(
    notes[0]?.id ?? null
  );
  const [search, setSearch] = useState("");
  const [preview, setPreview] = useState(false);
  const [saveState, setSaveState] = useState<"idle" | "saving" | "saved">(
    "idle"
  );
  const saveTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const selected = notes.find((n) => n.id === selectedId) ?? null;

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return notes;
    return notes.filter(
      (n) =>
        n.title.toLowerCase().includes(q) ||
        n.content.toLowerCase().includes(q)
    );
  }, [notes, search]);

  useEffect(() => {
    if (!selectedId && notes[0]) setSelectedId(notes[0].id);
    if (selectedId && !notes.find((n) => n.id === selectedId) && notes[0]) {
      setSelectedId(notes[0].id);
    }
  }, [notes, selectedId]);

  const persistNote = useCallback(
    async (id: string, patch: { title?: string; content?: string }) => {
      setSaveState("saving");
      try {
        const updated = await updateNote(id, patch);
        onNotesChange(
          notes.map((n) => (n.id === updated.id ? updated : n))
        );
        setSaveState("saved");
        setTimeout(() => setSaveState("idle"), 1500);
      } catch {
        setSaveState("idle");
      }
    },
    [notes, onNotesChange]
  );

  function scheduleSave(id: string, patch: { title?: string; content?: string }) {
    if (saveTimer.current) clearTimeout(saveTimer.current);
    saveTimer.current = setTimeout(() => {
      void persistNote(id, patch);
    }, 800);
  }

  async function handleCreate() {
    try {
      const created = await createNote({ growth_area_id: growthAreaId });
      onNotesChange([created, ...notes]);
      setSelectedId(created.id);
      onAreasRefresh();
    } catch {
      // parent shows errors
    }
  }

  async function handleDelete(id: string) {
    try {
      await deleteNote(id);
      const next = notes.filter((n) => n.id !== id);
      onNotesChange(next);
      setSelectedId(next[0]?.id ?? null);
      onAreasRefresh();
    } catch (err) {
      throw err instanceof NotesError ? err : new NotesError("Delete failed.");
    }
  }

  function updateLocal(id: string, patch: Partial<Note>) {
    onNotesChange(notes.map((n) => (n.id === id ? { ...n, ...patch } : n)));
    scheduleSave(id, {
      title: patch.title,
      content: patch.content,
    });
  }

  return (
    <div
      className={cn(
        "flex min-h-[520px] flex-col overflow-hidden lg:flex-row",
        embedded
          ? "border-t border-border/30"
          : "rounded-2xl border border-border/40 bg-card shadow-sm"
      )}
    >
      <div className="flex w-full shrink-0 flex-col border-b border-border/30 lg:w-56 lg:border-r lg:border-b-0 xl:w-64">
        <div className="space-y-2 border-b border-border/30 p-3">
          <div className="relative">
            <Search className="pointer-events-none absolute top-1/2 left-2.5 size-3.5 -translate-y-1/2 text-muted-foreground" />
            <Input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search notes..."
              className="h-8 pl-8 text-sm"
            />
          </div>
          <Button
            size="sm"
            className="h-8 w-full gap-1.5 rounded-lg"
            onClick={handleCreate}
          >
            <Plus className="size-3.5" /> New note
          </Button>
        </div>

        <ul className="min-h-0 flex-1 space-y-0.5 overflow-y-auto p-2">
          {filtered.length === 0 && (
            <li className="px-2 py-6 text-center text-sm text-muted-foreground">
              No notes yet
            </li>
          )}
          {filtered.map((note) => (
            <li key={note.id}>
              <button
                type="button"
                onClick={() => setSelectedId(note.id)}
                className={cn(
                  "w-full rounded-xl px-3 py-2.5 text-left transition-colors",
                  selectedId === note.id
                    ? "bg-muted"
                    : "hover:bg-muted/50"
                )}
              >
                <p className="truncate text-sm font-medium">{note.title}</p>
                <p className="mt-0.5 text-[11px] text-muted-foreground">
                  {formatRelativeTime(note.updated_at)}
                </p>
              </button>
            </li>
          ))}
        </ul>
      </div>

      {selected ? (
        <div className="flex min-h-0 min-w-0 flex-1 flex-col">
          <div className="flex items-center gap-3 border-b border-border/30 px-4 py-3">
            <input
              value={selected.title}
              onChange={(e) =>
                updateLocal(selected.id, { title: e.target.value })
              }
              className="min-w-0 flex-1 bg-transparent text-lg font-semibold outline-none placeholder:text-muted-foreground"
              placeholder="Note title"
            />
            <span className="hidden shrink-0 text-[11px] text-muted-foreground sm:inline">
              {saveState === "saving"
                ? "Saving..."
                : saveState === "saved"
                  ? "Saved"
                  : `Edited ${formatRelativeTime(selected.updated_at)}`}
            </span>
            <button
              type="button"
              onClick={() => void handleDelete(selected.id)}
              className="flex size-8 items-center justify-center rounded-lg text-muted-foreground hover:bg-destructive/10 hover:text-destructive"
              aria-label="Delete note"
            >
              <Trash2 className="size-4" />
            </button>
          </div>

          <MarkdownEditor
            value={selected.content}
            onChange={(content) => updateLocal(selected.id, { content })}
            preview={preview}
            onPreviewChange={setPreview}
            className="min-h-[360px] flex-1"
          />

          <div className="border-t border-border/30 px-4 py-3">
            <ConvertActions
              growthAreaId={growthAreaId}
              sourceType="note"
              sourceId={selected.id}
              title={selected.title}
              description={selected.content}
              onConverted={onAreasRefresh}
            />
          </div>
        </div>
      ) : (
        <div className="flex flex-1 items-center justify-center p-8 text-center text-sm text-muted-foreground">
          Select a note or create one to start writing.
        </div>
      )}
    </div>
  );
}
