"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { GrowthAreaDialog } from "@/components/notes/growth-area-dialog";
import { GrowthAreaHeader } from "@/components/notes/growth-area-header";
import { GrowthAreaSidebar } from "@/components/notes/growth-area-sidebar";
import { KanbanPanel } from "@/components/notes/kanban-panel";
import { NotesPanel } from "@/components/notes/notes-panel";
import { NotesTabTransition } from "@/components/notes/notes-tab-transition";
import { ErrorBanner } from "@/components/shared/error-banner";
import {
  createGrowthArea,
  deleteGrowthArea,
  fetchGrowthAreas,
  GrowthAreasError,
  updateGrowthArea,
} from "@/lib/growth-areas";
import {
  fetchBoardsByArea,
  fetchBoardWithColumns,
  KanbanError,
} from "@/lib/kanban";
import { fetchNotesByArea, NotesError } from "@/lib/notes";
import {
  formatLastUpdatedLabel,
  getLatestTimestamp,
} from "@/lib/notes-utils";
import { type } from "@/lib/typography";
import type {
  GrowthArea,
  GrowthAreaWithCounts,
  KanbanBoard,
  KanbanBoardWithColumns,
  Note,
} from "@/types/notes";

type ContentTab = "notes" | "kanban";

export function NotesPageContent() {
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

  const areaLastUpdatedLabel = useMemo(() => {
    const timestamps = [
      ...notes.map((note) => note.updated_at),
      ...boards.map((board) => board.updated_at),
    ];

    if (activeBoard) {
      for (const column of activeBoard.columns) {
        for (const card of column.cards) {
          timestamps.push(card.updated_at);
        }
      }
    }

    const latest = getLatestTimestamp(timestamps);
    return latest ? formatLastUpdatedLabel(latest) : null;
  }, [notes, boards, activeBoard]);

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

  return (
    <div className="space-y-5">
      <div className="space-y-1">
        <h1 className={type.pageTitle}>Notes</h1>
      </div>

      {error && <ErrorBanner message={error} />}

      <div className="flex flex-col gap-4 lg:flex-row lg:items-start">
        {loading ? (
          <aside
            style={{ width: 56 }}
            className="hidden shrink-0 animate-pulse rounded-2xl bg-muted/30 lg:block"
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
          />
        )}

        <div className="min-w-0 flex-1">
          {loading ? (
            <div className="h-[520px] animate-pulse rounded-2xl bg-muted/30" />
          ) : (
            selectedArea && (
              <div className="overflow-hidden rounded-2xl border border-border/40 bg-card shadow-sm">
                <GrowthAreaHeader
                  area={selectedArea}
                  tab={tab}
                  noteCount={notes.length}
                  boardCount={boards.length}
                  lastUpdatedLabel={areaLastUpdatedLabel}
                  onTabChange={handleTabChange}
                />

                <NotesTabTransition
                  tab={tab}
                  slideFrom={tabSlideFrom}
                  animKey={tabAnimKey}
                  notes={
                    <NotesPanel
                      embedded
                      growthAreaId={selectedArea.id}
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
