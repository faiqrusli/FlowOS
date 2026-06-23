"use client";

import { useState } from "react";
import { MoreHorizontal, Pencil, Plus, Trash2 } from "lucide-react";
import { KanbanBoardDialog } from "@/components/notes/kanban-board-dialog";
import { KanbanBoardView } from "@/components/notes/kanban-board-view";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  createKanbanBoard,
  createKanbanColumn,
  deleteKanbanBoard,
  reorderKanbanColumns,
  updateKanbanBoard,
} from "@/lib/kanban";
import { cn } from "@/lib/utils";
import type {
  KanbanBoard,
  KanbanBoardWithColumns,
  KanbanCard,
  KanbanColumn,
} from "@/types/notes";

type KanbanPanelProps = {
  growthAreaId: string;
  boards: KanbanBoard[];
  activeBoard: KanbanBoardWithColumns | null;
  onBoardsChange: (boards: KanbanBoard[]) => void;
  onSelectBoard: (boardId: string) => void;
  onActiveBoardChange: (board: KanbanBoardWithColumns | null) => void;
  onAreasRefresh: () => void;
  embedded?: boolean;
};

export function KanbanPanel({
  growthAreaId,
  boards,
  activeBoard,
  onBoardsChange,
  onSelectBoard,
  onActiveBoardChange,
  onAreasRefresh,
  embedded = false,
}: KanbanPanelProps) {
  const [boardDialogOpen, setBoardDialogOpen] = useState(false);
  const [editingBoardId, setEditingBoardId] = useState<string | null>(null);
  const [boardTitleDraft, setBoardTitleDraft] = useState("");
  const [focusColumnId, setFocusColumnId] = useState<string | null>(null);

  async function handleCreateBoard(title: string) {
    const board = await createKanbanBoard(growthAreaId, title);
    onBoardsChange([...boards, board]);
    onSelectBoard(board.id);
    onAreasRefresh();
  }

  function startRenameBoard(board: KanbanBoard) {
    setEditingBoardId(board.id);
    setBoardTitleDraft(board.title);
  }

  async function saveBoardTitle(boardId: string) {
    const title = boardTitleDraft.trim() || "Untitled";
    setEditingBoardId(null);

    const previousBoards = boards;
    const previousActive = activeBoard;

    onBoardsChange(
      boards.map((board) =>
        board.id === boardId ? { ...board, title } : board
      )
    );
    if (activeBoard?.id === boardId) {
      onActiveBoardChange({ ...activeBoard, title });
    }

    try {
      await updateKanbanBoard(boardId, { title });
    } catch {
      onBoardsChange(previousBoards);
      if (previousActive?.id === boardId) {
        onActiveBoardChange(previousActive);
      }
    }
  }

  async function handleAddList() {
    if (!activeBoard) return;

    const insertIndex = activeBoard.columns.length;
    const previousOrder = activeBoard.columns.map((column) => column.id);
    const snapshot = activeBoard;
    const optimisticId = `pending-${crypto.randomUUID()}`;

    const placeholder: KanbanColumn & { cards: KanbanCard[] } = {
      id: optimisticId,
      user_id: activeBoard.user_id,
      board_id: activeBoard.id,
      title: "New list",
      color: "slate",
      sort_order: insertIndex,
      created_at: new Date().toISOString(),
      cards: [],
    };

    const nextColumns = [...activeBoard.columns, placeholder];
    onActiveBoardChange({ ...activeBoard, columns: nextColumns });

    try {
      const column = await createKanbanColumn(
        activeBoard.id,
        "New list",
        insertIndex
      );
      const persistedColumns = nextColumns.map((c) =>
        c.id === optimisticId ? { ...column, cards: [] } : c
      );
      onActiveBoardChange({ ...activeBoard, columns: persistedColumns });
      setFocusColumnId(column.id);
      await reorderKanbanColumns(
        activeBoard.id,
        persistedColumns.map((c) => c.id),
        previousOrder
      );
    } catch {
      onActiveBoardChange(snapshot);
    }
  }

  async function handleDeleteBoard(boardId: string) {
    if (!confirm("Delete this board and all its cards?")) return;
    await deleteKanbanBoard(boardId);
    const next = boards.filter((b) => b.id !== boardId);
    onBoardsChange(next);
    if (activeBoard?.id === boardId) {
      onActiveBoardChange(null);
    }
    onAreasRefresh();
  }

  return (
    <div className={cn("space-y-3", embedded ? "border-t border-border/30 p-4" : "")}>
      <div className="flex items-center gap-2">
        <div className="flex min-w-0 flex-1 items-center gap-2 overflow-x-auto pb-0.5 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          {boards.map((board) => {
            const isActive = activeBoard?.id === board.id;
            return (
              <div key={board.id} className="flex shrink-0 items-center">
                {editingBoardId === board.id ? (
                  <input
                    value={boardTitleDraft}
                    onChange={(e) => setBoardTitleDraft(e.target.value)}
                    onBlur={() => void saveBoardTitle(board.id)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") void saveBoardTitle(board.id);
                      if (e.key === "Escape") setEditingBoardId(null);
                    }}
                    className="h-8 w-36 rounded-lg border border-border/50 bg-background px-3 text-sm font-medium outline-none"
                    autoFocus
                  />
                ) : (
                  <button
                    type="button"
                    onClick={() => onSelectBoard(board.id)}
                    className={cn(
                      "whitespace-nowrap rounded-lg px-3 py-1.5 text-sm font-medium transition-colors",
                      isActive
                        ? "bg-foreground text-background"
                        : "bg-muted/50 text-foreground/70 hover:bg-muted hover:text-foreground"
                    )}
                  >
                    {board.title}
                  </button>
                )}
                {isActive && editingBoardId !== board.id && (
                  <DropdownMenu>
                    <DropdownMenuTrigger
                      className="ml-1 flex size-7 shrink-0 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
                      aria-label={`${board.title} options`}
                    >
                      <MoreHorizontal className="size-4" />
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="start" className="rounded-xl">
                      <DropdownMenuItem onClick={() => startRenameBoard(board)}>
                        <Pencil className="size-3.5" />
                        Rename
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => void handleAddList()}>
                        <Plus className="size-3.5" />
                        Add a list
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem
                        className="text-destructive"
                        onClick={() => void handleDeleteBoard(board.id)}
                      >
                        <Trash2 className="size-3.5" />
                        Delete board
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                )}
              </div>
            );
          })}
        </div>

        <Button
          type="button"
          variant="outline"
          size="sm"
          className="h-8 shrink-0 gap-1.5 rounded-lg border-border/50 px-3 text-sm"
          onClick={() => setBoardDialogOpen(true)}
        >
          <Plus className="size-3.5" />
          New board
        </Button>
      </div>

      {!activeBoard ? (
        <div className="flex min-h-[360px] items-center justify-center rounded-xl border border-dashed border-border/50 bg-muted/10 p-8 text-center text-sm text-muted-foreground">
          {boards.length === 0
            ? "Create a board to track your growth journey."
            : "Select a board to view your journey."}
        </div>
      ) : (
        <KanbanBoardView
          board={activeBoard}
          growthAreaId={growthAreaId}
          onBoardChange={onActiveBoardChange}
          onAreasRefresh={onAreasRefresh}
          focusColumnId={focusColumnId}
          onFocusColumnHandled={() => setFocusColumnId(null)}
        />
      )}

      <KanbanBoardDialog
        open={boardDialogOpen}
        onOpenChange={setBoardDialogOpen}
        onCreate={handleCreateBoard}
      />
    </div>
  );
}
