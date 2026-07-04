"use client";

import { useCallback, useEffect, useState } from "react";
import { GrowthAreaDialog } from "@/components/notes/growth-area-dialog";
import { GrowthAreaHeader } from "@/components/notes/growth-area-header";
import { GrowthAreaSidebar } from "@/components/notes/growth-area-sidebar";
import { KanbanPanel } from "@/components/notes/kanban-panel";
import { NotesPanel } from "@/components/notes/notes-panel";
import { NotesTabTransition } from "@/components/notes/notes-tab-transition";
import { ErrorBanner } from "@/components/shared/error-banner";
import { BackToTodayLink } from "@/components/shared/back-to-today-link";
import { useGlobalRightSidebar } from "@/contexts/global-right-sidebar-context";
import {
  createGrowthArea,
  deleteGrowthArea,
  fetchGrowthAreas,
  GrowthAreasError,
  reorderGrowthAreas,
  updateGrowthArea,
} from "@/lib/growth-areas";
import {
  fetchBoardsByArea,
  fetchBoardWithColumns,
  KanbanError,
} from "@/lib/kanban";
import { fetchNotesByArea, NotesError } from "@/lib/notes";
import type {
  GrowthArea,
  GrowthAreaWithCounts,
  KanbanBoard,
  KanbanBoardWithColumns,
  Note,
} from "@/types/notes";

type ContentTab = "notes" | "kanban";

export function NotesPageContent() {
  const { openDailyNote } = useGlobalRightSidebar();
  const [areas, setAreas] = useState<GrowthAreaWithCounts[]>([]);
  const [selectedAreaId, setSelectedAreaId] = useState<string | null>(null);
  const [notes, setNotes] = useState<Note[]>([]);
  const [boards, setBoards] = useState<KanbanBoard[]>([]);
  const [activeBoard, setActiveBoard] = useState<KanbanBoardWithColumns | null>(
    null
  );
  const [tab, setTab] = useState<ContentTab>("notes");
  const [tabAnimKey, setTabAnimKey] = useState(0);
  const [tabSlideFrom, setTabSlideFrom] = useState<"left" | "right">("right");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [areaDialogOpen, setAreaDialogOpen] = useState(false);
  const [areaDialogMode, setAreaDialogMode] = useState<"create" | "edit">(
    "create"
  );
  const [editingArea, setEditingArea] = useState<GrowthArea | null>(null);

  const selectedArea = areas.find((a) => a.id === selectedAreaId) ?? null;

  function handleTabChange(next: ContentTab) {
    if (next === tab) return;
    setTabSlideFrom(next === "kanban" ? "right" : "left");
    setTabAnimKey((key) => key + 1);
    setTab(next);
  }

  const loadAreas = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await fetchGrowthAreas();
      setAreas(data);
      setSelectedAreaId((prev) => prev ?? data[0]?.id ?? null);
    } catch (err) {
      setError(
        err instanceof GrowthAreasError
          ? err.message
          : "Failed to load growth areas."
      );
    } finally {
      setLoading(false);
    }
  }, []);

  const loadAreaContent = useCallback(async (areaId: string) => {
    try {
      const [notesData, boardsData] = await Promise.all([
        fetchNotesByArea(areaId),
        fetchBoardsByArea(areaId),
      ]);
      setNotes(notesData);
      setBoards(boardsData);
      setActiveBoard(null);
    } catch (err) {
      setError(
        err instanceof NotesError || err instanceof KanbanError
          ? err.message
          : "Failed to load folder content."
      );
    }
  }, []);

  useEffect(() => {
    void loadAreas();
  }, [loadAreas]);

  useEffect(() => {
    if (selectedAreaId) void loadAreaContent(selectedAreaId);
  }, [selectedAreaId, loadAreaContent]);

  async function refreshAreas() {
    const areasData = await fetchGrowthAreas();
    setAreas(areasData);
  }

  async function handleSelectBoard(boardId: string) {
    try {
      const board = await fetchBoardWithColumns(boardId);
      setActiveBoard(board);
    } catch {
      setError("Failed to load board.");
    }
  }

  async function handleSaveArea(input: {
    name: string;
    emoji: string;
    description: string;
  }) {
    if (areaDialogMode === "create") {
      const created = await createGrowthArea(input);
      const areasData = await fetchGrowthAreas();
      setAreas(areasData);
      setSelectedAreaId(created.id);
      return;
    }
    if (editingArea) {
      await updateGrowthArea(editingArea.id, input);
      const areasData = await fetchGrowthAreas();
      setAreas(areasData);
    }
  }

  async function handleDeleteArea(area: GrowthAreaWithCounts) {
    if (!confirm(`Delete "${area.name}" and all its notes and boards?`)) return;
    await deleteGrowthArea(area.id);
    const areasData = await fetchGrowthAreas();
    setAreas(areasData);
    setSelectedAreaId(areasData[0]?.id ?? null);
  }

  async function handleReorderAreas(next: GrowthAreaWithCounts[]) {
    const previous = areas;
    setAreas(next);
    try {
      await reorderGrowthAreas(next.map((area) => area.id));
    } catch {
      setAreas(previous);
      setError("Failed to reorder growth areas.");
    }
  }

  return (
    <div className="flex h-full min-h-0 flex-col overflow-hidden">
      <div className="flex shrink-0 items-center gap-3 border-b border-border/30 px-3 py-2 sm:px-4">
        <BackToTodayLink />
        <div className="min-w-0">
          <h1 className="text-base font-semibold leading-tight text-foreground">
            Notes
          </h1>
          <p className="text-xs text-muted-foreground">
            Growth areas, notes, and kanban boards
          </p>
        </div>
      </div>

      {error && <ErrorBanner message={error} />}

      <div className="relative flex min-h-0 flex-1 flex-row gap-2 overflow-hidden sm:gap-3">
        {loading ? (
          <aside
            style={{ width: 56 }}
            className="shrink-0 self-start animate-pulse rounded-2xl bg-muted/30"
            aria-hidden
          />
        ) : (
          <GrowthAreaSidebar
            areas={areas}
            selectedId={selectedAreaId}
            onSelect={setSelectedAreaId}
            onCreate={() => {
              setAreaDialogMode("create");
              setEditingArea(null);
              setAreaDialogOpen(true);
            }}
            onEdit={(area) => {
              setAreaDialogMode("edit");
              setEditingArea(area);
              setAreaDialogOpen(true);
            }}
            onDelete={handleDeleteArea}
            onReorder={(next) => void handleReorderAreas(next)}
          />
        )}

        <div className="flex h-full min-h-0 min-w-0 flex-1 flex-col self-stretch overflow-hidden">
          {loading ? (
            <div className="h-full min-h-0 animate-pulse rounded-2xl bg-muted/30" />
          ) : (
            selectedArea && (
              <div className="flex h-full min-h-0 flex-col overflow-hidden rounded-2xl border border-border/40 bg-card shadow-sm">
                <GrowthAreaHeader
                  area={selectedArea}
                  tab={tab}
                  onTabChange={handleTabChange}
                  onOpenTodaysNote={() => void openDailyNote()}
                />

                <NotesTabTransition
                  tab={tab}
                  slideFrom={tabSlideFrom}
                  animKey={tabAnimKey}
                  notes={
                    <NotesPanel
                      embedded
                      growthAreaId={selectedArea.id}
                      growthAreaName={selectedArea.name}
                      areas={areas}
                      notes={notes}
                      onNotesChange={setNotes}
                      onAreasRefresh={() => void refreshAreas()}
                    />
                  }
                  kanban={
                    <KanbanPanel
                      embedded
                      growthAreaId={selectedArea.id}
                      boards={boards}
                      activeBoard={activeBoard}
                      onBoardsChange={setBoards}
                      onSelectBoard={(id) => void handleSelectBoard(id)}
                      onActiveBoardChange={setActiveBoard}
                      onAreasRefresh={() => void refreshAreas()}
                    />
                  }
                />
              </div>
            )
          )}
        </div>
      </div>

      <GrowthAreaDialog
        open={areaDialogOpen}
        onOpenChange={setAreaDialogOpen}
        mode={areaDialogMode}
        area={editingArea}
        onSave={handleSaveArea}
      />
    </div>
  );
}
