"use client";

import { useEffect, useRef, useState, type DragEvent } from "react";
import { GripVertical, MoreHorizontal, Pencil, Plus, Trash2 } from "lucide-react";
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
  reorderKanbanBoards,
  reorderKanbanColumns,
  updateKanbanBoard,
} from "@/lib/kanban";
import {
  initialDropBeforeId,
  reorderByDropBeforeId,
  resolveDropBeforeId,
  type DropBeforeId,
} from "@/lib/list-drag-utils";
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
  const tabListRef = useRef<HTMLDivElement>(null);
  const [dragBoardId, setDragBoardId] = useState<string | null>(null);
  const [dropBeforeId, setDropBeforeId] = useState<DropBeforeId>(null);
  const dragBoardIdRef = useRef<string | null>(null);
  const dropBeforeIdRef = useRef<DropBeforeId>(null);
  const boardsRef = useRef(boards);

  useEffect(() => {
    boardsRef.current = boards;
  }, [boards]);

  function resetBoardDrag() {
    dragBoardIdRef.current = null;
    dropBeforeIdRef.current = null;
    setDragBoardId(null);
    setDropBeforeId(null);
  }

  function setDropBeforeIfChanged(next: DropBeforeId) {
    if (dropBeforeIdRef.current === next) return;
    dropBeforeIdRef.current = next;
    setDropBeforeId(next);
  }

  function handleBoardDragStart(boardId: string, event: DragEvent<HTMLButtonElement>) {
    event.stopPropagation();
    dragBoardIdRef.current = boardId;
    setDragBoardId(boardId);

    event.dataTransfer.effectAllowed = "move";
    event.dataTransfer.setData("text/plain", boardId);

    const orderedIds = boardsRef.current.map((board) => board.id);
    const initial = initialDropBeforeId(orderedIds, boardId);
    dropBeforeIdRef.current = initial;
    setDropBeforeId(initial);
  }

  function handleTabListDragOver(event: DragEvent<HTMLDivElement>) {
    if (!dragBoardIdRef.current || !tabListRef.current) return;

    event.preventDefault();
    event.dataTransfer.dropEffect = "move";

    const orderedIds = boardsRef.current.map((board) => board.id);
    const beforeId = resolveDropBeforeId(
      orderedIds,
      tabListRef.current,
      "data-board-id",
      event.clientX,
      "x",
      dragBoardIdRef.current
    );
    setDropBeforeIfChanged(beforeId);
  }

  async function handleBoardDragEnd() {
    const activeId = dragBoardIdRef.current;
    const beforeId = dropBeforeIdRef.current;

    if (activeId !== null) {
      const reordered = reorderByDropBeforeId(
        boardsRef.current,
        activeId,
        beforeId
      );
      if (reordered !== boardsRef.current) {
        const next = reordered.map((board, index) => ({
          ...board,
          sort_order: index,
        }));
        const previous = boardsRef.current;
        onBoardsChange(next);
        try {
          await reorderKanbanBoards(
            growthAreaId,
            next.map((board) => board.id)
          );
        } catch {
          onBoardsChange(previous);
        }
      }
    }

    resetBoardDrag();
  }

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
    <div
      className={cn(
        "flex h-full min-h-0 flex-col overflow-hidden",
        embedded ? "p-4" : ""
      )}
    >
      <div className="flex shrink-0 items-center gap-2">
        <div
          ref={tabListRef}
          onDragOver={handleTabListDragOver}
          className="flex min-w-0 flex-1 items-center gap-2 overflow-x-auto pb-0.5 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
        >
          {boards.map((board) => {
            const isActive = activeBoard?.id === board.id;
            const isDragging = dragBoardId === board.id;
            return (
              <div key={board.id} className="flex shrink-0 items-center">
                {dropBeforeId === board.id && <BoardDropLine />}
                <div
                  data-board-id={board.id}
                  className={cn(
                    "group/tab flex shrink-0 items-center",
                    isDragging && "opacity-40"
                  )}
                >
                  <button
                    type="button"
                    draggable
                    onDragStart={(event) => handleBoardDragStart(board.id, event)}
                    onDragEnd={() => void handleBoardDragEnd()}
                    onMouseDown={(event) => event.stopPropagation()}
                    className={cn(
                      "flex size-6 shrink-0 cursor-grab items-center justify-center rounded-md text-muted-foreground opacity-0 transition-opacity hover:bg-muted active:cursor-grabbing group-hover/tab:opacity-100",
                      isDragging && "opacity-100"
                    )}
                    aria-label={`Reorder ${board.title}`}
                  >
                    <GripVertical className="size-3.5" />
                  </button>
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
              </div>
            );
          })}
          {dragBoardId !== null && dropBeforeId === null && <BoardDropLine />}
        </div>

        <div className="flex shrink-0 items-center gap-2">
          <Button
            type="button"
            size="sm"
            variant="outline"
            className="h-8 shrink-0 gap-1.5 rounded-lg px-3 text-sm"
            disabled={!activeBoard}
            onClick={() => void handleAddList()}
          >
            <Plus className="size-3.5" />
            New list
          </Button>
          <Button
            type="button"
            size="sm"
            className="h-8 shrink-0 gap-1.5 rounded-lg px-3 text-sm"
            onClick={() => setBoardDialogOpen(true)}
          >
            <Plus className="size-3.5" />
            New board
          </Button>
        </div>
      </div>

      <div className="min-h-0 flex-1 overflow-hidden pt-3">
      {!activeBoard ? (
        <div className="flex h-full items-center justify-center rounded-xl border border-dashed border-border/50 bg-muted/10 p-8 text-center text-sm text-muted-foreground">
          {boards.length === 0
            ? "Create a board to track your growth journey."
            : "Select a board to view your journey."}
        </div>
      ) : (
        <KanbanBoardView
          board={activeBoard}
          onBoardChange={onActiveBoardChange}
          onAreasRefresh={onAreasRefresh}
          focusColumnId={focusColumnId}
          onFocusColumnHandled={() => setFocusColumnId(null)}
        />
      )}
      </div>

      <KanbanBoardDialog
        open={boardDialogOpen}
        onOpenChange={setBoardDialogOpen}
        onCreate={handleCreateBoard}
      />
    </div>
  );
}

function BoardDropLine() {
  return (
    <div
      className="mx-0.5 h-6 w-0.5 shrink-0 rounded-full bg-foreground/75"
      aria-hidden
    />
  );
}
