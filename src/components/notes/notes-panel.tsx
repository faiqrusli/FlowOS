"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  ExternalLink,
  FolderInput,
  MoreHorizontal,
  Pencil,
  Pin,
  Plus,
  Search,
  Trash2,
} from "lucide-react";
import { MarkdownEditor } from "@/components/notes/markdown-editor";
import { NoteMoveDialog } from "@/components/notes/note-move-dialog";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { useGlobalRightSidebar } from "@/contexts/global-right-sidebar-context";
import {
  createNote,
  deleteNote,
  moveNote,
  NotesError,
  setNotePinned,
  updateNote,
} from "@/lib/notes";
import {
  formatNoteListTime,
  formatRelativeTime,
  insertNewNoteInList,
  resolveNewNoteTitle,
  sortNotesForList,
} from "@/lib/notes-utils";
import { cn } from "@/lib/utils";
import type { GrowthAreaWithCounts, Note } from "@/types/notes";

type NotesPanelProps = {
  growthAreaId: string;
  growthAreaName: string;
  areas: GrowthAreaWithCounts[];
  notes: Note[];
  onNotesChange: (notes: Note[]) => void;
  onAreasRefresh: () => void;
  embedded?: boolean;
};

export function NotesPanel({
  growthAreaId,
  growthAreaName,
  areas,
  notes,
  onNotesChange,
  onAreasRefresh,
  embedded = false,
}: NotesPanelProps) {
  const { openFloatingNote, closeFloatingNote } = useGlobalRightSidebar();
  const [selectedId, setSelectedId] = useState<string | null>(
    notes[0]?.id ?? null,
  );
  const [search, setSearch] = useState("");
  const [preview, setPreview] = useState(false);
  const [saveState, setSaveState] = useState<"idle" | "saving" | "saved">(
    "idle",
  );
  const [renamingId, setRenamingId] = useState<string | null>(null);
  const [renameDraft, setRenameDraft] = useState("");
  const [moveNoteId, setMoveNoteId] = useState<string | null>(null);
  const [openMenuNoteId, setOpenMenuNoteId] = useState<string | null>(null);
  const [focusTitleNoteId, setFocusTitleNoteId] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);
  const saveTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const noticeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const titleInputRef = useRef<HTMLInputElement>(null);

  const sortedNotes = useMemo(() => sortNotesForList(notes), [notes]);
  const selected = notes.find((note) => note.id === selectedId) ?? null;

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return sortedNotes;
    return sortedNotes.filter(
      (note) =>
        note.title.toLowerCase().includes(q) ||
        note.content.toLowerCase().includes(q),
    );
  }, [sortedNotes, search]);

  useEffect(() => {
    if (!selectedId && sortedNotes[0]) setSelectedId(sortedNotes[0].id);
    if (
      selectedId &&
      !notes.find((note) => note.id === selectedId) &&
      sortedNotes[0]
    ) {
      setSelectedId(sortedNotes[0].id);
    }
  }, [notes, selectedId, sortedNotes]);

  useEffect(() => {
    if (!focusTitleNoteId || selectedId !== focusTitleNoteId) return;

    requestAnimationFrame(() => {
      const input = titleInputRef.current;
      if (!input) return;
      input.focus();
      input.select();
      setFocusTitleNoteId(null);
    });
  }, [focusTitleNoteId, selectedId]);

  useEffect(() => {
    return () => {
      if (noticeTimer.current) clearTimeout(noticeTimer.current);
    };
  }, []);

  const persistNote = useCallback(
    async (
      id: string,
      patch: { title?: string; content?: string; is_pinned?: boolean },
    ) => {
      setSaveState("saving");
      try {
        const updated = await updateNote(id, patch);
        const next = sortNotesForList(
          notes.map((note) =>
            note.id === updated.id
              ? { ...updated, is_pinned: updated.is_pinned ?? false }
              : note,
          ),
        );
        onNotesChange(next);
        setSaveState("saved");
        setTimeout(() => setSaveState("idle"), 1500);
      } catch {
        setSaveState("idle");
      }
    },
    [notes, onNotesChange],
  );

  function scheduleSave(
    id: string,
    patch: { title?: string; content?: string },
  ) {
    if (saveTimer.current) clearTimeout(saveTimer.current);
    saveTimer.current = setTimeout(() => {
      void persistNote(id, patch);
    }, 800);
  }

  function showNotice(message: string) {
    setNotice(message);
    if (noticeTimer.current) clearTimeout(noticeTimer.current);
    noticeTimer.current = setTimeout(() => setNotice(null), 3200);
  }

  async function handleCreate() {
    try {
      const title = resolveNewNoteTitle(
        notes.map((note) => note.title),
        growthAreaName,
      );
      const created = await createNote({
        growth_area_id: growthAreaId,
        title,
      });
      const normalized = { ...created, is_pinned: created.is_pinned ?? false };
      onNotesChange(insertNewNoteInList(notes, normalized));
      setSelectedId(normalized.id);
      setFocusTitleNoteId(normalized.id);
      onAreasRefresh();
    } catch {
      // parent shows errors
    }
  }

  async function handleDelete(note: Note) {
    const deletedTitle = note.title.trim() || "Untitled";

    try {
      await deleteNote(note.id);
      const next = notes.filter((item) => item.id !== note.id);
      onNotesChange(next);
      setSelectedId((current) =>
        current === note.id ? (next[0]?.id ?? null) : current,
      );
      closeFloatingNote(note.id);
      showNotice(`"${deletedTitle}" deleted`);
      onAreasRefresh();
    } catch (err) {
      throw err instanceof NotesError ? err : new NotesError("Delete failed.");
    }
  }

  async function handleTogglePin(note: Note) {
    const updated = await setNotePinned(note.id, !note.is_pinned);
    onNotesChange(
      sortNotesForList(
        notes.map((item) =>
          item.id === updated.id
            ? { ...updated, is_pinned: updated.is_pinned ?? false }
            : item,
        ),
      ),
    );
  }

  function startRename(note: Note) {
    setRenamingId(note.id);
    setRenameDraft(note.title);
  }

  async function saveRename(noteId: string) {
    const title = renameDraft.trim() || "Untitled";
    setRenamingId(null);
    onNotesChange(
      notes.map((note) => (note.id === noteId ? { ...note, title } : note)),
    );
    await persistNote(noteId, { title });
  }

  async function handleMove(noteId: string, targetAreaId: string) {
    await moveNote(noteId, targetAreaId);
    const next = notes.filter((note) => note.id !== noteId);
    onNotesChange(next);
    setSelectedId((current) =>
      current === noteId ? (next[0]?.id ?? null) : current,
    );
    onAreasRefresh();
  }

  function openFloatingCard(note: Note) {
    openFloatingNote(note);
  }

  function updateLocal(id: string, patch: Partial<Note>) {
    onNotesChange(
      notes.map((note) => (note.id === id ? { ...note, ...patch } : note)),
    );
    scheduleSave(id, {
      title: patch.title,
      content: patch.content,
    });
  }

  return (
    <>
      <div
        className={cn(
          "flex h-full min-h-0 flex-row overflow-hidden",
          embedded
            ? ""
            : "rounded-xl border border-border-subtle bg-surface-base shadow-none",
        )}
      >
        <div className="flex h-full min-h-0 w-[min(200px,34vw)] shrink-0 flex-col border-r border-border-subtle bg-surface-base xl:w-[216px]">
          <div className="shrink-0 border-b border-border/30 p-2.5">
            <div className="flex items-center gap-2">
              <Button
                size="sm"
                className="size-8 shrink-0 rounded-lg px-0"
                onClick={handleCreate}
                aria-label="Add a new note"
                title="Add a new note"
              >
                <Plus className="size-3.5" />
              </Button>
              <div className="relative min-w-0 flex-1">
                <Search className="pointer-events-none absolute top-1/2 left-2.5 size-3.5 -translate-y-1/2 text-muted-foreground" />
                <Input
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search notes..."
                  className="h-8 pl-8 text-sm"
                />
              </div>
            </div>
          </div>

          <ul className="min-h-0 flex-1 space-y-0.5 overflow-y-auto p-2">
            {filtered.length === 0 && (
              <li className="px-2 py-6 text-center text-sm text-muted-foreground">
                No notes yet
              </li>
            )}
            {filtered.map((note) => (
              <li key={note.id}>
                <div
                  className={cn(
                    "group relative flex items-center rounded-xl transition-[background-color,box-shadow]",
                    selectedId === note.id
                      ? "flow-selected"
                      : "hover:bg-surface-hover/70",
                  )}
                  onContextMenu={(event) => {
                    if (renamingId === note.id) return;
                    event.preventDefault();
                    setOpenMenuNoteId(note.id);
                  }}
                >
                  {renamingId === note.id ? (
                    <div className="min-w-0 flex-1 px-2 py-2">
                      <input
                        value={renameDraft}
                        onChange={(e) => setRenameDraft(e.target.value)}
                        onBlur={() => void saveRename(note.id)}
                        onKeyDown={(e) => {
                          if (e.key === "Enter") void saveRename(note.id);
                          if (e.key === "Escape") setRenamingId(null);
                        }}
                        className="w-full rounded-md border border-border/50 bg-background px-2 py-1 text-sm outline-none"
                        autoFocus
                      />
                    </div>
                  ) : (
                    <button
                      type="button"
                      onClick={() => setSelectedId(note.id)}
                      className="min-w-0 flex-1 px-2.5 py-2 pr-8 text-left"
                    >
                      <div className="flex min-w-0 items-center gap-1.5">
                        {note.is_pinned && (
                          <Pin className="size-3 shrink-0 text-muted-foreground" />
                        )}
                        <p className="truncate text-sm font-medium leading-snug">
                          {note.title}
                        </p>
                      </div>
                      <p className="mt-0.5 text-[10px] leading-none text-muted-foreground/65">
                        {formatNoteListTime(note.updated_at)}
                      </p>
                    </button>
                  )}

                  {renamingId !== note.id && (
                    <DropdownMenu
                      open={openMenuNoteId === note.id}
                      onOpenChange={(open) =>
                        setOpenMenuNoteId(open ? note.id : null)
                      }
                    >
                      <DropdownMenuTrigger
                        className={cn(
                          "absolute top-1/2 right-1.5 flex size-7 -translate-y-1/2 items-center justify-center rounded-md text-muted-foreground opacity-0 transition-opacity group-hover:opacity-100 hover:bg-surface-hover",
                          (selectedId === note.id ||
                            openMenuNoteId === note.id) &&
                            "opacity-100",
                        )}
                        aria-label={`${note.title} options`}
                        onClick={(event) => event.stopPropagation()}
                      >
                        <MoreHorizontal className="size-4" />
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="start" className="rounded-xl">
                        <DropdownMenuItem
                          onClick={() => void handleTogglePin(note)}
                        >
                          <Pin className="size-3.5" />
                          {note.is_pinned ? "Unpin" : "Pin"}
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => startRename(note)}>
                          <Pencil className="size-3.5" />
                          Rename
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => setMoveNoteId(note.id)}
                        >
                          <FolderInput className="size-3.5" />
                          Move to
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => openFloatingCard(note)}
                        >
                          <ExternalLink className="size-3.5" />
                          Open on small card
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem
                          className="text-destructive"
                          onClick={() => void handleDelete(note)}
                        >
                          <Trash2 className="size-3.5" />
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  )}
                </div>
              </li>
            ))}
          </ul>
        </div>

        {selected ? (
          <div className="flex min-h-0 flex-1 flex-col overflow-hidden">
            <div className="flex shrink-0 items-center gap-3 border-b border-border/30 px-4 py-2.5">
              <input
                ref={titleInputRef}
                value={selected.title}
                onChange={(e) =>
                  updateLocal(selected.id, { title: e.target.value })
                }
                className="min-w-0 flex-1 bg-transparent text-lg font-semibold outline-none placeholder:text-muted-foreground"
                placeholder="Note title"
              />
              <span className="shrink-0 text-xs text-muted-foreground">
                {saveState === "saving"
                  ? "Saving..."
                  : saveState === "saved"
                    ? "Saved"
                    : `Last edited ${formatRelativeTime(selected.updated_at).toLowerCase()}`}
              </span>
            </div>

            <MarkdownEditor
              value={selected.content}
              onChange={(content) => updateLocal(selected.id, { content })}
              preview={preview}
              onPreviewChange={setPreview}
              className="min-h-0 flex-1"
            />
          </div>
        ) : (
          <div className="flex min-h-0 flex-1 items-center justify-center p-8 text-center text-sm text-muted-foreground">
            Select a note or create one to start writing.
          </div>
        )}
      </div>

      {notice && (
        <div
          role="status"
          className="fixed bottom-6 left-1/2 z-50 -translate-x-1/2 rounded-lg border border-border/50 bg-popover px-4 py-2 text-sm text-popover-foreground shadow-lg"
        >
          {notice}
        </div>
      )}

      <NoteMoveDialog
        open={moveNoteId !== null}
        onOpenChange={(open) => {
          if (!open) setMoveNoteId(null);
        }}
        areas={areas}
        currentAreaId={growthAreaId}
        onMove={(areaId) => {
          if (moveNoteId) void handleMove(moveNoteId, areaId);
        }}
      />
    </>
  );
}
