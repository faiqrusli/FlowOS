"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  ChevronDown,
  ExternalLink,
  FolderInput,
  Pin,
  PinOff,
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
  fetchSidebarNotesData,
  getDailyNoteByDate,
  groupNotesByArea,
  searchSidebarNotes,
} from "@/lib/daily-notes";
import { formatSidebarDateHeading, getTodayDateString } from "@/lib/date-utils";
import { formatRelativeTime } from "@/lib/notes-utils";
import {
  deleteNote,
  moveNote,
  setNoteMenuPinned,
  updateNote,
} from "@/lib/notes";
import {
  mergeNotePreserveLocalText,
  mergeNoteTextPatch,
  noteTextPatchStillDirty,
  type NoteTextPatch,
} from "@/lib/note-autosave";
import {
  getSidebarNotesCache,
  removeSidebarNoteFromCache,
  setSidebarNotesCache,
  upsertSidebarNoteInCache,
} from "@/lib/sidebar-notes-cache";
import { drawerWritingFieldClass } from "@/lib/theme/surface-classes";
import { cn } from "@/lib/utils";
import type { GrowthAreaWithCounts, Note } from "@/types/notes";

export function SidebarNotesPanel() {
  const {
    selectedNoteId,
    selectNote,
    focusTitleNoteId,
    clearFocusTitleNoteId,
    notesRefreshKey,
    openDailyNote,
    createNewNote,
    openFloatingNote,
    updateFloatingNote,
    floatingNotes,
    currentUserId,
    authReady,
  } = useGlobalRightSidebar();

  const cached = authReady ? getSidebarNotesCache(currentUserId) : null;
  const [areas, setAreas] = useState<GrowthAreaWithCounts[]>(
    cached?.areas ?? [],
  );
  const [notes, setNotes] = useState<Note[]>(cached?.notes ?? []);
  const [refreshing, setRefreshing] = useState(true);
  const [search, setSearch] = useState("");
  const [preview, setPreview] = useState(false);
  const [saveError, setSaveError] = useState(false);
  const [todayDailyNoteId, setTodayDailyNoteId] = useState<string | null>(null);
  const [collapsedAreas, setCollapsedAreas] = useState<Set<string>>(new Set());
  const [openMenuNoteId, setOpenMenuNoteId] = useState<string | null>(null);
  const [moveNoteId, setMoveNoteId] = useState<string | null>(null);
  const saveTimers = useRef(new Map<string, ReturnType<typeof setTimeout>>());
  const retryCounts = useRef(new Map<string, number>());
  const titleInputRef = useRef<HTMLInputElement>(null);
  const pendingPatchById = useRef(new Map<string, NoteTextPatch>());
  const savingIds = useRef(new Set<string>());
  const loadGenerationRef = useRef(0);
  const notesRef = useRef(notes);
  notesRef.current = notes;
  const todayKey = getTodayDateString();

  useEffect(() => {
    const timers = saveTimers.current;
    const pendingPatches = pendingPatchById.current;
    const saving = savingIds.current;
    return () => {
      for (const timer of timers.values()) clearTimeout(timer);
      timers.clear();
      pendingPatches.clear();
      saving.clear();
    };
  }, []);

  const loadNotes = useCallback(
    async (background = false) => {
      if (!authReady || !currentUserId) return;
      const owner = currentUserId;
      const generation = ++loadGenerationRef.current;
      if (!background) setRefreshing(true);
      try {
        const [data, todayNote] = await Promise.all([
          fetchSidebarNotesData(),
          getDailyNoteByDate(todayKey),
        ]);
        if (generation !== loadGenerationRef.current) return;
        setAreas(data.areas);
        setNotes((current) => {
          if (pendingPatchById.current.size === 0) {
            setSidebarNotesCache(owner, data.areas, data.notes);
            return data.notes;
          }
          // Keep in-progress text when a background refresh arrives mid-edit.
          const localById = new Map(current.map((note) => [note.id, note]));
          const merged = data.notes.map((remote) => {
            const local = localById.get(remote.id);
            if (local && pendingPatchById.current.has(remote.id)) {
              return mergeNotePreserveLocalText(local, remote);
            }
            return remote;
          });
          setSidebarNotesCache(owner, data.areas, merged);
          return merged;
        });
        setTodayDailyNoteId(todayNote?.id ?? null);
      } finally {
        setRefreshing(false);
      }
    },
    [authReady, currentUserId, todayKey],
  );

  useEffect(() => {
    loadGenerationRef.current += 1;
    for (const timer of saveTimers.current.values()) clearTimeout(timer);
    saveTimers.current.clear();
    savingIds.current.clear();
    retryCounts.current.clear();
    setAreas([]);
    setNotes([]);
    setSaveError(false);
    pendingPatchById.current.clear();
    if (!authReady || !currentUserId) return;
    const snapshot = getSidebarNotesCache(currentUserId);
    void loadNotes(Boolean(snapshot));
  }, [authReady, currentUserId, loadNotes, notesRefreshKey]);

  const selected = useMemo(
    () => notes.find((note) => note.id === selectedNoteId) ?? null,
    [notes, selectedNoteId],
  );

  useEffect(() => {
    if (!focusTitleNoteId || selectedNoteId !== focusTitleNoteId) return;
    requestAnimationFrame(() => {
      const input = titleInputRef.current;
      if (!input) return;
      input.focus();
      input.select();
      clearFocusTitleNoteId();
    });
  }, [focusTitleNoteId, selectedNoteId, clearFocusTitleNoteId]);

  const filteredNotes = useMemo(
    () => searchSidebarNotes(notes, areas, search),
    [notes, areas, search],
  );

  const menuPinnedNotes = useMemo(
    () =>
      filteredNotes
        .filter((note) => note.is_menu_pinned)
        .sort(
          (a, b) =>
            new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime(),
        ),
    [filteredNotes],
  );

  const grouped = useMemo(() => {
    const unpinned = filteredNotes.filter((note) => !note.is_menu_pinned);
    return groupNotesByArea(areas, unpinned);
  }, [areas, filteredNotes]);

  const floatingNoteIds = useMemo(
    () => new Set(floatingNotes.map((note) => note.id)),
    [floatingNotes],
  );

  useEffect(() => {
    for (const note of notes) {
      if (floatingNoteIds.has(note.id)) {
        updateFloatingNote(note);
      }
    }
  }, [notes, floatingNoteIds, updateFloatingNote]);

  const persistNote = useCallback(
    async (id: string, patch: { title?: string; content?: string }) => {
      const owner = currentUserId;
      if (!authReady || !owner) return;
      setSaveError(false);
      savingIds.current.add(id);
      const sentText: NoteTextPatch = {
        title: patch.title,
        content: patch.content,
      };
      try {
        const updated = await updateNote(id, patch);
        setNotes((current) => {
          const next = current.map((note) =>
            note.id === updated.id
              ? mergeNotePreserveLocalText(note, updated)
              : note,
          );
          setSidebarNotesCache(owner, areas, next);
          notesRef.current = next;
          return next;
        });
        const local = notesRef.current.find((note) => note.id === id);
        if (local) updateFloatingNote(local);

        if (noteTextPatchStillDirty(pendingPatchById.current.get(id), sentText)) {
          scheduleSave(id);
        } else {
          pendingPatchById.current.delete(id);
          retryCounts.current.delete(id);
        }
      } catch (err) {
        console.error("[notes] autosave failed", err);
        setSaveError(true);
        const retries = retryCounts.current.get(id) ?? 0;
        if (retries < 1) {
          retryCounts.current.set(id, retries + 1);
          scheduleSave(id, 2_000);
        }
      } finally {
        savingIds.current.delete(id);
      }
    },
    [areas, authReady, currentUserId, scheduleSave, updateFloatingNote],
  );

  function scheduleSave(id: string, delay = 800) {
    const existing = saveTimers.current.get(id);
    if (existing) clearTimeout(existing);
    saveTimers.current.set(id, setTimeout(() => {
      saveTimers.current.delete(id);
      const pending = pendingPatchById.current.get(id);
      if (!pending) return;
      if (savingIds.current.has(id)) {
        scheduleSave(id);
        return;
      }
      void persistNote(id, { ...pending });
    }, delay));
  }

  function updateLocal(id: string, patch: Partial<Note>) {
    if (!authReady || !currentUserId) return;
    setSaveError(false);
    setNotes((current) => {
      const next = current.map((note) =>
        note.id === id ? { ...note, ...patch } : note,
      );
      setSidebarNotesCache(currentUserId, areas, next);
      notesRef.current = next;
      return next;
    });
    const textPatch: NoteTextPatch = {};
    if (patch.title !== undefined) textPatch.title = patch.title;
    if (patch.content !== undefined) textPatch.content = patch.content;
    if (textPatch.title !== undefined || textPatch.content !== undefined) {
      pendingPatchById.current.set(
        id,
        mergeNoteTextPatch(pendingPatchById.current.get(id), textPatch),
      );
      scheduleSave(id);
    }
  }

  async function handleToggleMenuPin(note: Note) {
    if (!authReady || !currentUserId) return;
    const updated = await setNoteMenuPinned(note.id, !note.is_menu_pinned);
    if (currentUserId) upsertSidebarNoteInCache(currentUserId, updated);
    setNotes((current) =>
      current.map((item) => (item.id === updated.id ? updated : item)),
    );
    updateFloatingNote(updated);
  }

  async function handleDelete(note: Note) {
    if (!authReady || !currentUserId) return;
    await deleteNote(note.id);
    if (currentUserId) removeSidebarNoteFromCache(currentUserId, note.id);
    setNotes((current) => current.filter((item) => item.id !== note.id));
    if (selectedNoteId === note.id) selectNote(null);
  }

  async function handleMove(noteId: string, targetAreaId: string) {
    if (!authReady || !currentUserId) return;
    const updated = await moveNote(noteId, targetAreaId);
    if (currentUserId) upsertSidebarNoteInCache(currentUserId, updated);
    setNotes((current) =>
      current.map((note) => (note.id === updated.id ? updated : note)),
    );
    setMoveNoteId(null);
  }

  function toggleAreaCollapsed(areaId: string) {
    setCollapsedAreas((current) => {
      const next = new Set(current);
      if (next.has(areaId)) next.delete(areaId);
      else next.add(areaId);
      return next;
    });
  }

  async function handleOpenToday() {
    const noteId = await openDailyNote(todayKey);
    if (noteId) setTodayDailyNoteId(noteId);
  }

  async function handleCreateNote() {
    await createNewNote();
    void loadNotes(true);
  }

  function renderNoteItem(note: Note) {
    return (
      <li key={note.id}>
        <div
          className={cn(
            "group relative rounded-lg border-0 transition-colors duration-150",
            selectedNoteId === note.id
              ? "flow-selected"
              : openMenuNoteId === note.id
                ? "bg-surface-hover"
                : "hover:bg-surface-hover",
          )}
          onContextMenu={(event) => {
            event.preventDefault();
            setOpenMenuNoteId(note.id);
          }}
        >
          <button
            type="button"
            onClick={() => selectNote(note.id)}
            className="w-full px-2 py-1.5 pr-8 text-left"
          >
            <p className="truncate text-sm font-medium leading-snug text-foreground">
              {note.title.trim() || "Untitled"}
            </p>
          </button>

          <DropdownMenu
            open={openMenuNoteId === note.id}
            onOpenChange={(open) => setOpenMenuNoteId(open ? note.id : null)}
          >
            <DropdownMenuTrigger className="sr-only">
              Note menu
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start" className="rounded-xl">
              <DropdownMenuItem onClick={() => void handleToggleMenuPin(note)}>
                {note.is_menu_pinned ? (
                  <PinOff className="size-3.5" />
                ) : (
                  <Pin className="size-3.5" />
                )}
                {note.is_menu_pinned ? "Unpin" : "Pin here"}
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setMoveNoteId(note.id)}>
                <FolderInput className="size-3.5" />
                Move to
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => openFloatingNote(note)}>
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
        </div>
      </li>
    );
  }

  if (!cached && refreshing && notes.length === 0) {
    return (
      <div className="p-4 text-sm text-muted-foreground">Loading notes…</div>
    );
  }

  if (selected) {
    return (
      <div className="flex h-full min-h-0 flex-col gap-3 px-5 py-4">
        <div className="flex shrink-0 items-center">
          <Button
            type="button"
            variant="outline"
            size="sm"
            className="shrink-0"
            onClick={() => selectNote(null)}
          >
            Back
          </Button>
        </div>

        {/* Document canvas — Surface 4 on drawer chrome (same as Notes page). */}
        <div className="flex min-h-0 min-w-0 flex-1 flex-col overflow-hidden rounded-xl border-0 bg-surface-base text-card-foreground shadow-none">
          <div className="flex shrink-0 items-center gap-2 px-4 py-3">
            <input
              ref={titleInputRef}
              value={selected.title}
              onChange={(event) =>
                updateLocal(selected.id, { title: event.target.value })
              }
              onKeyDown={(event) => {
                if (event.key === "Enter") {
                  event.preventDefault();
                  titleInputRef.current?.blur();
                }
              }}
              onBlur={() => {
                if (!selected.title.trim()) {
                  updateLocal(selected.id, { title: "Untitled" });
                }
              }}
              className="min-w-0 flex-1 bg-transparent text-lg font-semibold outline-none placeholder:text-muted-foreground"
              placeholder="Note title"
            />
            <button
              type="button"
              onClick={() => void handleToggleMenuPin(selected)}
              className={cn(
                "flex size-8 shrink-0 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-surface-hover hover:text-foreground",
                selected.is_menu_pinned && "text-foreground",
              )}
              aria-label={
                selected.is_menu_pinned ? "Unpin from menu" : "Pin to menu"
              }
              title={
                selected.is_menu_pinned ? "Unpin from menu" : "Pin to menu"
              }
            >
              {selected.is_menu_pinned ? (
                <PinOff className="size-4" />
              ) : (
                <Pin className="size-4" />
              )}
            </button>
            <span
              className={cn(
                "shrink-0 text-xs",
                saveError
                  ? "text-destructive"
                  : "text-foreground-secondary",
              )}
              role={saveError ? "alert" : undefined}
            >
              {saveError
                ? "Not saved — changes are only on this device"
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

        <NoteMoveDialog
          open={moveNoteId !== null}
          onOpenChange={(open) => !open && setMoveNoteId(null)}
          areas={areas}
          currentAreaId={selected.growth_area_id}
          onMove={(areaId) => {
            if (moveNoteId) void handleMove(moveNoteId, areaId);
          }}
        />
      </div>
    );
  }

  return (
    <>
      <div className="flex h-full min-h-0 flex-col">
        {/* Search / Today header region — separated from the folder list. */}
        <div className="shrink-0 space-y-2.5 px-5 pt-4 pb-4">
          <div className="flex items-center gap-2">
            <Button
              type="button"
              size="sm"
              className="size-8 shrink-0 rounded-lg px-0"
              onClick={() => void handleCreateNote()}
              aria-label="Add a new note"
              title="Add a new note"
            >
              <Plus className="size-3.5" />
            </Button>
            <div className="relative min-w-0 flex-1">
              <Search className="pointer-events-none absolute top-1/2 left-2.5 size-3.5 -translate-y-1/2 text-muted-foreground" />
              <Input
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Search notes..."
                className={cn("h-8 pl-8 text-sm", drawerWritingFieldClass)}
              />
            </div>
          </div>

          <button
            type="button"
            onClick={() => void handleOpenToday()}
            className={cn(
              "flex w-full items-center gap-2 rounded-xl border-0 px-2.5 py-1.5 text-left transition-colors duration-150",
              todayDailyNoteId && selectedNoteId === todayDailyNoteId
                ? "bg-primary-soft hover:bg-primary-soft"
                : "bg-surface-5 hover:bg-surface-hover",
            )}
          >
            <span className="flex size-7 shrink-0 items-center justify-center rounded-lg bg-surface-board-header text-sm leading-none">
              📅
            </span>
            <span className="min-w-0 flex-1">
              <span className="block text-sm font-semibold text-foreground">
                Today
              </span>
              <span className="block truncate text-xs text-muted-foreground">
                {formatSidebarDateHeading(todayKey)}
              </span>
            </span>
          </button>
        </div>

        <div className="min-h-0 flex-1 overflow-y-auto px-2.5 py-2">
          {menuPinnedNotes.length === 0 && grouped.length === 0 ? (
            <p className="px-2 py-6 text-center text-sm text-muted-foreground">
              {search.trim() ? "No matching notes" : "No notes yet"}
            </p>
          ) : (
            <div className="space-y-2">
              {menuPinnedNotes.length > 0 && (
                <section>
                  <div className="flex w-full items-center gap-1.5 rounded-md px-2 py-1.5">
                    <Pin className="size-3.5 shrink-0 text-muted-foreground" />
                    <h3 className="min-w-0 flex-1 truncate text-sm font-medium text-foreground/85">
                      Pinned
                    </h3>
                    <span className="shrink-0 text-xs tabular-nums text-muted-foreground">
                      ({menuPinnedNotes.length})
                    </span>
                  </div>
                  <ul className="space-y-0 pl-3">
                    {menuPinnedNotes.map(renderNoteItem)}
                  </ul>
                </section>
              )}

              {grouped.map(({ area, notes: areaNotes }) => {
                const isCollapsed = collapsedAreas.has(area.id);
                return (
                  <section key={area.id}>
                    <button
                      type="button"
                      onClick={() => toggleAreaCollapsed(area.id)}
                      className="flex w-full items-center gap-1.5 rounded-md px-2 py-1.5 text-left transition-colors hover:bg-surface-hover"
                    >
                      <ChevronDown
                        className={cn(
                          "size-3.5 shrink-0 text-muted-foreground transition-transform",
                          isCollapsed && "-rotate-90",
                        )}
                        aria-hidden
                      />
                      <span className="shrink-0 text-sm leading-none">
                        {area.emoji}
                      </span>
                      <h3 className="min-w-0 flex-1 truncate text-sm font-medium text-foreground/85">
                        {area.name}
                      </h3>
                      <span className="shrink-0 text-xs tabular-nums text-muted-foreground">
                        ({areaNotes.length})
                      </span>
                    </button>
                    {!isCollapsed && (
                      <ul className="space-y-0 pl-3">
                        {areaNotes.map(renderNoteItem)}
                      </ul>
                    )}
                  </section>
                );
              })}
            </div>
          )}
        </div>
      </div>

      <NoteMoveDialog
        open={moveNoteId !== null}
        onOpenChange={(open) => !open && setMoveNoteId(null)}
        areas={areas}
        currentAreaId={
          notes.find((note) => note.id === moveNoteId)?.growth_area_id ?? ""
        }
        onMove={(areaId) => {
          if (moveNoteId) void handleMove(moveNoteId, areaId);
        }}
      />
    </>
  );
}
