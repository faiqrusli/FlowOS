"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { ExternalLink, Eye, EyeOff, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  readModuleVisibility,
  writeModuleVisibility,
  type WorkplaceModuleVisibility,
} from "@/lib/workplace-module-visibility";
import { useGlobalRightSidebar } from "@/contexts/global-right-sidebar-context";
import { getDailyNoteByDate, getOrCreateDailyNote } from "@/lib/daily-notes";
import {
  formatDailyNoteHeaderDate,
  getTodayDateString,
} from "@/lib/date-utils";
import { updateNote } from "@/lib/notes";
import { cn } from "@/lib/utils";
import type { Note } from "@/types/notes";

export function WorkplaceDailyNoteCard() {
  const { openNoteInSidebar, openPanel } = useGlobalRightSidebar();
  const todayKey = getTodayDateString();
  const [dailyNote, setDailyNote] = useState<Note | null>(null);
  const [draft, setDraft] = useState("");
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);
  const [saving, setSaving] = useState(false);
  const [visibility, setVisibility] = useState<WorkplaceModuleVisibility>("always");
  const [hovered, setHovered] = useState(false);
  const saveTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    setVisibility(readModuleVisibility("daily-note"));
  }, []);

  useEffect(() => {
    return () => {
      if (saveTimerRef.current) clearTimeout(saveTimerRef.current);
    };
  }, []);

  const loadDailyNote = useCallback(async () => {
    setLoading(true);
    try {
      const note = await getDailyNoteByDate(todayKey);
      setDailyNote(note);
      setDraft(note?.content ?? "");
    } finally {
      setLoading(false);
    }
  }, [todayKey]);

  useEffect(() => {
    void loadDailyNote();
  }, [loadDailyNote]);

  const hoverReveal = visibility === "hover";
  const contentVisible = !hoverReveal || hovered;
  const cardVisible = !hoverReveal || hovered;

  const scheduleSave = useCallback((noteId: string, content: string) => {
    if (saveTimerRef.current) clearTimeout(saveTimerRef.current);
    saveTimerRef.current = setTimeout(async () => {
      setSaving(true);
      try {
        const updated = await updateNote(noteId, { content });
        setDailyNote(updated);
      } finally {
        setSaving(false);
      }
    }, 400);
  }, []);

  function handleDraftChange(next: string) {
    setDraft(next);
    if (dailyNote) {
      scheduleSave(dailyNote.id, next);
    }
  }

  async function handleCreateDailyNote() {
    setCreating(true);
    try {
      const note = await getOrCreateDailyNote(todayKey);
      setDailyNote(note);
      setDraft(note.content ?? "");
    } finally {
      setCreating(false);
    }
  }

  function handleOpenInSidebar() {
    if (dailyNote) {
      openNoteInSidebar(dailyNote.id);
      return;
    }
    openPanel("notes");
  }

  function toggleVisibility() {
    setVisibility((current) => {
      const next = current === "always" ? "hover" : "always";
      writeModuleVisibility("daily-note", next);
      return next;
    });
  }

  return (
    <section
      className={cn(
        "flow-surface-card group/module flex min-h-0 flex-col overflow-hidden transition-[background-color,border-color,box-shadow,transform] duration-200 hover:border-[color-mix(in_oklch,var(--border),var(--foreground)_12%)] hover:shadow-sm",
        !cardVisible && "border-transparent bg-transparent shadow-none"
      )}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <header
        className={cn(
          "flex shrink-0 items-center justify-between gap-2 border-b border-divider px-2.5 py-2 transition-opacity duration-150",
          !cardVisible && "pointer-events-none opacity-0"
        )}
      >
        <div className="min-w-0">
          <h3 className="text-[14px] font-semibold tracking-tight text-foreground">
            Daily Note
          </h3>
          <p className="mt-0.5 text-[13px] text-muted-foreground">
            {formatDailyNoteHeaderDate(todayKey)}
            {saving ? " · Saving…" : null}
          </p>
        </div>
        <div className="flex shrink-0 items-center gap-1">
          <button
            type="button"
            onClick={handleOpenInSidebar}
            className="flex size-6 items-center justify-center rounded-md text-muted-foreground/55 transition-colors hover:bg-muted/50 hover:text-muted-foreground"
            aria-label="Open daily note in sidebar"
            title="Open in notes menu"
          >
            <ExternalLink className="size-4" />
          </button>
          <button
            type="button"
            onClick={toggleVisibility}
            className="flex size-6 items-center justify-center rounded-md text-muted-foreground/55 transition-colors hover:bg-muted/50 hover:text-muted-foreground"
            aria-label={
              hoverReveal
                ? "Show on hover — click for always visible"
                : "Always visible — click for show on hover"
            }
            title={hoverReveal ? "Show on hover" : "Always visible"}
          >
            {hoverReveal ? (
              <EyeOff className="size-4" />
            ) : (
              <Eye className="size-4" />
            )}
          </button>
        </div>
      </header>

      <div
        className={cn(
          "min-h-0 flex-1 overflow-hidden transition-opacity duration-150",
          !contentVisible && "pointer-events-none opacity-0"
        )}
      >
        {loading ? (
          <div className="flex min-h-[8rem] items-center justify-center p-3">
            <p className="text-[14px] text-muted-foreground">Loading…</p>
          </div>
        ) : dailyNote ? (
          <textarea
            value={draft}
            onChange={(event) => handleDraftChange(event.target.value)}
            placeholder="Write today's note…"
            className="h-full min-h-[8rem] w-full resize-none overflow-y-auto bg-transparent px-2.5 py-2 text-[14px] leading-relaxed text-foreground outline-none placeholder:text-muted-foreground/60"
          />
        ) : (
          <div className="flex min-h-[8rem] flex-col items-center justify-center gap-3 px-4 py-5 text-center">
            <div className="space-y-1">
              <p className="text-[14px] font-medium text-foreground">
                No daily note yet.
              </p>
              <p className="text-[14px] text-muted-foreground">
                Capture today&apos;s ideas, thoughts, and progress.
              </p>
            </div>
            <Button
              type="button"
              size="sm"
              className="h-8 gap-1.5 rounded-full px-4 text-[13px]"
              disabled={creating}
              onClick={() => void handleCreateDailyNote()}
            >
              <Plus className="size-3.5" />
              Create Daily Note
            </Button>
          </div>
        )}
      </div>
    </section>
  );
}
