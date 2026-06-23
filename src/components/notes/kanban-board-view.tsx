"use client";

import {
  forwardRef,
  memo,
  useCallback,
  useEffect,
  useRef,
  useState,
  type DragEvent,
} from "react";
import {
  ChevronDown,
  ChevronRight,
  GripVertical,
  MoreHorizontal,
  Plus,
  Trash2,
} from "lucide-react";
import { ConvertActions } from "@/components/notes/convert-actions";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  cardText,
  moveCardInBoard,
  moveColumnInBoard,
  splitCardText,
  type CardDragTarget,
} from "@/lib/kanban-drag-utils";
import {
  createKanbanCard,
  createKanbanColumn,
  deleteKanbanCard,
  deleteKanbanColumn,
  persistKanbanLayout,
  reorderKanbanColumns,
  updateKanbanCard,
  updateKanbanColumn,
} from "@/lib/kanban";
import { cn } from "@/lib/utils";
import type {
  KanbanBoardWithColumns,
  KanbanCard,
  KanbanColumn,
} from "@/types/notes";

type KanbanBoardViewProps = {
  board: KanbanBoardWithColumns;
  growthAreaId: string;
  onBoardChange: (board: KanbanBoardWithColumns) => void;
  onAreasRefresh: () => void;
  focusColumnId?: string | null;
  onFocusColumnHandled?: () => void;
};

type DragKind = "card" | "column" | null;

function targetsEqual(
  a: CardDragTarget | null,
  b: CardDragTarget | null
): boolean {
  return a?.columnId === b?.columnId && a?.index === b?.index;
}

function resolveCardDropIndex(
  columnEl: HTMLElement,
  clientY: number,
  excludeCardId?: string
): number {
  const cardEls = Array.from(
    columnEl.querySelectorAll<HTMLElement>("[data-kanban-card]")
  ).filter((el) => el.dataset.kanbanCard !== excludeCardId);

  for (let i = 0; i < cardEls.length; i++) {
    const rect = cardEls[i].getBoundingClientRect();
    if (clientY < rect.top + rect.height / 2) return i;
  }

  return cardEls.length;
}

function resolveColumnDropIndex(
  boardEl: HTMLElement,
  clientX: number,
  dragColumnId?: string
): number {
  const columnEls = Array.from(
    boardEl.querySelectorAll<HTMLElement>("[data-kanban-column]")
  );

  let insertBefore = columnEls.length;
  for (let i = 0; i < columnEls.length; i++) {
    const rect = columnEls[i].getBoundingClientRect();
    if (clientX < rect.left + rect.width / 2) {
      insertBefore = i;
      break;
    }
  }

  const sourceIndex = dragColumnId
    ? columnEls.findIndex((el) => el.dataset.kanbanColumn === dragColumnId)
    : -1;

  if (sourceIndex !== -1 && insertBefore > sourceIndex) {
    insertBefore -= 1;
  }

  return insertBefore;
}

export function KanbanBoardView({
  board,
  growthAreaId,
  onBoardChange,
  onAreasRefresh,
  focusColumnId,
  onFocusColumnHandled,
}: KanbanBoardViewProps) {
  const boardRef = useRef<HTMLDivElement>(null);
  const [dragKind, setDragKind] = useState<DragKind>(null);
  const [dragId, setDragId] = useState<string | null>(null);
  const [cardDropTarget, setCardDropTarget] = useState<CardDragTarget | null>(
    null
  );
  const [columnDropIndex, setColumnDropIndex] = useState<number | null>(null);
  const cardDropTargetRef = useRef<CardDragTarget | null>(null);
  const columnDropIndexRef = useRef<number | null>(null);

  const [collapsed, setCollapsed] = useState<Set<string>>(new Set());
  const [editingColumnId, setEditingColumnId] = useState<string | null>(null);
  const [columnTitleDraft, setColumnTitleDraft] = useState("");
  const [composingColumnId, setComposingColumnId] = useState<string | null>(
    null
  );
  const [composeText, setComposeText] = useState("");
  const [editingCardId, setEditingCardId] = useState<string | null>(null);
  const [cardDraft, setCardDraft] = useState("");
  const composeRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (composingColumnId && composeRef.current) {
      composeRef.current.focus();
    }
  }, [composingColumnId]);

  useEffect(() => {
    if (!focusColumnId) return;

    const column = board.columns.find((item) => item.id === focusColumnId);
    if (!column) return;

    setEditingColumnId(focusColumnId);
    setColumnTitleDraft(column.title);
    onFocusColumnHandled?.();
  }, [focusColumnId, board.columns, onFocusColumnHandled]);

  const commitBoard = useCallback(
    async (next: KanbanBoardWithColumns) => {
      onBoardChange(next);
      await persistKanbanLayout(next);
    },
    [onBoardChange]
  );

  function resetDrag() {
    setDragKind(null);
    setDragId(null);
    setCardDropTarget(null);
    setColumnDropIndex(null);
    cardDropTargetRef.current = null;
    columnDropIndexRef.current = null;
  }

  function setCardDropIfChanged(target: CardDragTarget | null) {
    if (targetsEqual(cardDropTargetRef.current, target)) return;
    cardDropTargetRef.current = target;
    setCardDropTarget(target);
  }

  function setColumnDropIfChanged(index: number | null) {
    if (columnDropIndexRef.current === index) return;
    columnDropIndexRef.current = index;
    setColumnDropIndex(index);
  }

  function handleCardDragStart(cardId: string, e: DragEvent<HTMLElement>) {
    setDragKind("card");
    setDragId(cardId);
    setCardDropTarget(null);
    cardDropTargetRef.current = null;

    const el = e.currentTarget;
    e.dataTransfer.effectAllowed = "move";
    e.dataTransfer.setData("text/plain", cardId);

    const ghost = el.cloneNode(true) as HTMLElement;
    ghost.style.width = `${el.offsetWidth}px`;
    ghost.style.opacity = "1";
    ghost.style.background = "var(--card)";
    ghost.style.border = "1px solid var(--border)";
    ghost.style.borderRadius = "0.5rem";
    ghost.style.boxShadow = "0 4px 12px rgb(0 0 0 / 0.08)";
    document.body.appendChild(ghost);
    ghost.style.position = "absolute";
    ghost.style.top = "-1000px";
    e.dataTransfer.setDragImage(ghost, 16, 16);
    requestAnimationFrame(() => ghost.remove());
  }

  function handleColumnBodyDragOver(
    e: DragEvent<HTMLElement>,
    columnId: string
  ) {
    e.preventDefault();
    if (dragKind !== "card" || !dragId) return;

    const index = resolveCardDropIndex(e.currentTarget, e.clientY, dragId);
    setCardDropIfChanged({ columnId, index });
  }

  async function handleCardDragEnd() {
    if (dragKind === "card" && dragId && cardDropTargetRef.current) {
      await commitBoard(
        moveCardInBoard(board, dragId, cardDropTargetRef.current)
      );
    }
    resetDrag();
  }

  function handleColumnDragStart(columnId: string, e: DragEvent<HTMLElement>) {
    setDragKind("column");
    setDragId(columnId);
    setColumnDropIndex(null);
    columnDropIndexRef.current = null;

    e.dataTransfer.effectAllowed = "move";
    e.dataTransfer.setData("text/plain", columnId);

    const columnEl = e.currentTarget.closest(
      "[data-kanban-column]"
    ) as HTMLElement | null;
    if (columnEl) {
      const ghost = columnEl.cloneNode(true) as HTMLElement;
      ghost.style.width = `${columnEl.offsetWidth}px`;
      ghost.style.opacity = "1";
      document.body.appendChild(ghost);
      ghost.style.position = "absolute";
      ghost.style.top = "-1000px";
      e.dataTransfer.setDragImage(ghost, 24, 24);
      requestAnimationFrame(() => ghost.remove());
    }
  }

  function handleBoardDragOver(e: DragEvent<HTMLDivElement>) {
    e.preventDefault();
    if (dragKind !== "column" || !dragId || !boardRef.current) return;

    const index = resolveColumnDropIndex(boardRef.current, e.clientX, dragId);
    setColumnDropIfChanged(index);
  }

  async function handleColumnDragEnd() {
    if (
      dragKind === "column" &&
      dragId &&
      columnDropIndexRef.current !== null
    ) {
      await commitBoard(
        moveColumnInBoard(board, dragId, columnDropIndexRef.current)
      );
    }
    resetDrag();
  }

  function toggleCollapsed(columnId: string) {
    setCollapsed((prev) => {
      const next = new Set(prev);
      if (next.has(columnId)) next.delete(columnId);
      else next.add(columnId);
      return next;
    });
  }

  function startEditColumn(column: KanbanColumn) {
    setEditingColumnId(column.id);
    setColumnTitleDraft(column.title);
  }

  async function saveColumnTitle(columnId: string) {
    const title = columnTitleDraft.trim() || "Untitled";
    setEditingColumnId(null);
    const updated = await updateKanbanColumn(columnId, { title });
    onBoardChange({
      ...board,
      columns: board.columns.map((c) =>
        c.id === columnId ? { ...c, title: updated.title } : c
      ),
    });
  }

  async function handleInsertColumn(
    referenceColumnId: string,
    position: "before" | "after"
  ) {
    const refIndex = board.columns.findIndex((c) => c.id === referenceColumnId);
    if (refIndex === -1) return;

    const insertIndex = position === "before" ? refIndex : refIndex + 1;
    const previousOrder = board.columns.map((c) => c.id);
    const snapshot = board;
    const optimisticId = `pending-${crypto.randomUUID()}`;

    const placeholder: KanbanColumn & { cards: KanbanCard[] } = {
      id: optimisticId,
      user_id: board.user_id,
      board_id: board.id,
      title: "New list",
      color: "slate",
      sort_order: insertIndex,
      created_at: new Date().toISOString(),
      cards: [],
    };

    const nextColumns = [...board.columns];
    nextColumns.splice(insertIndex, 0, placeholder);
    onBoardChange({ ...board, columns: nextColumns });

    try {
      const column = await createKanbanColumn(board.id, "New list", insertIndex);
      const persistedColumns = nextColumns.map((c) =>
        c.id === optimisticId ? { ...column, cards: [] } : c
      );
      onBoardChange({ ...board, columns: persistedColumns });
      await reorderKanbanColumns(
        board.id,
        persistedColumns.map((c) => c.id),
        previousOrder
      );
      setEditingColumnId(column.id);
      setColumnTitleDraft(column.title);
    } catch {
      onBoardChange(snapshot);
    }
  }

  async function handleDeleteColumn(columnId: string) {
    if (!confirm("Delete this list and all its cards?")) return;
    await deleteKanbanColumn(columnId);
    onBoardChange({
      ...board,
      columns: board.columns.filter((c) => c.id !== columnId),
    });
    onAreasRefresh();
  }

  async function handleCreateCard(columnId: string, text: string) {
    const { title, description } = splitCardText(text);
    const column = board.columns.find((c) => c.id === columnId);
    if (!column) return;

    const card = await createKanbanCard({
      boardId: board.id,
      columnId,
      title,
      description,
      sortOrder: column.cards.length,
    });

    onBoardChange({
      ...board,
      columns: board.columns.map((c) =>
        c.id === columnId ? { ...c, cards: [...c.cards, card] } : c
      ),
    });
    onAreasRefresh();
    setComposeText("");
    setComposingColumnId(columnId);
  }

  async function handleSaveCard(card: KanbanCard, text: string) {
    const { title, description } = splitCardText(text);
    const updated = await updateKanbanCard(card.id, { title, description });
    onBoardChange({
      ...board,
      columns: board.columns.map((col) => ({
        ...col,
        cards: col.cards.map((c) => (c.id === card.id ? updated : c)),
      })),
    });
    setEditingCardId(null);
    onAreasRefresh();
  }

  async function handleDeleteCard(cardId: string) {
    await deleteKanbanCard(cardId);
    onBoardChange({
      ...board,
      columns: board.columns.map((col) => ({
        ...col,
        cards: col.cards.filter((c) => c.id !== cardId),
      })),
    });
    onAreasRefresh();
  }

  function openCompose(columnId: string) {
    setComposingColumnId(columnId);
    setComposeText("");
  }

  const isDraggingCard = dragKind === "card";
  const isDraggingColumn = dragKind === "column";

  return (
    <div
      ref={boardRef}
      className="kanban-board-scroll flex gap-3 overflow-x-auto overscroll-x-contain pb-3"
      onDragOver={handleBoardDragOver}
      onDragEnd={() => {
        if (dragKind === "card") void handleCardDragEnd();
        if (dragKind === "column") void handleColumnDragEnd();
      }}
    >
      {board.columns.map((column, columnIndex) => {
        const isCollapsed = collapsed.has(column.id);
        const isEmpty = column.cards.length === 0;
        const isComposing = composingColumnId === column.id;
        const isSourceColumn = isDraggingColumn && dragId === column.id;
        const showColumnMarker =
          isDraggingColumn &&
          columnDropIndex === columnIndex &&
          !isSourceColumn;

        if (isCollapsed) {
          return (
            <div key={column.id} className="flex shrink-0 items-stretch gap-0">
              {showColumnMarker && <ColumnDropMarker />}
              <div
                data-kanban-column={column.id}
                className={cn(
                  "flex w-11 shrink-0 flex-col items-center rounded-xl border border-border/40 bg-muted/30 py-2",
                  isSourceColumn && "opacity-40"
                )}
              >
                <button
                  type="button"
                  draggable
                  onDragStart={(e) => handleColumnDragStart(column.id, e)}
                  className="mb-1 flex size-7 cursor-grab items-center justify-center rounded-md text-muted-foreground hover:bg-muted active:cursor-grabbing"
                  aria-label={`Move ${column.title}`}
                >
                  <GripVertical className="size-3.5" />
                </button>
                <button
                  type="button"
                  onClick={() => toggleCollapsed(column.id)}
                  className="mb-2 flex size-7 items-center justify-center rounded-md text-muted-foreground hover:bg-muted"
                  aria-label={`Expand ${column.title}`}
                >
                  <ChevronRight className="size-3.5" />
                </button>
                <span className="max-h-48 text-xs font-medium text-foreground/80 [writing-mode:vertical-rl] rotate-180">
                  {column.title}
                </span>
              </div>
            </div>
          );
        }

        const visibleCards =
          isDraggingCard && dragId
            ? column.cards.filter((c) => c.id !== dragId)
            : column.cards;

        return (
          <div key={column.id} className="flex shrink-0 items-stretch">
            {showColumnMarker && <ColumnDropMarker />}
            <div
              data-kanban-column={column.id}
              className={cn(
                "flex w-[min(100%,380px)] min-w-[320px] max-w-[380px] shrink-0 flex-col rounded-xl border border-border/40 bg-muted/15",
                isSourceColumn && "opacity-40"
              )}
            >
              <div className="flex items-center gap-1 border-b border-border/30 px-2 py-2">
                <button
                  type="button"
                  draggable
                  onDragStart={(e) => handleColumnDragStart(column.id, e)}
                  className="flex size-7 shrink-0 cursor-grab items-center justify-center rounded-md text-muted-foreground hover:bg-muted active:cursor-grabbing"
                  aria-label={`Move ${column.title}`}
                >
                  <GripVertical className="size-3.5" />
                </button>
                <button
                  type="button"
                  onClick={() => toggleCollapsed(column.id)}
                  className="flex size-7 shrink-0 items-center justify-center rounded-md text-muted-foreground hover:bg-muted"
                  aria-label={`Collapse ${column.title}`}
                >
                  <ChevronDown className="size-3.5" />
                </button>

                {editingColumnId === column.id ? (
                  <input
                    value={columnTitleDraft}
                    onChange={(e) => setColumnTitleDraft(e.target.value)}
                    onBlur={() => void saveColumnTitle(column.id)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") void saveColumnTitle(column.id);
                      if (e.key === "Escape") setEditingColumnId(null);
                    }}
                    className="min-w-0 flex-1 rounded-md border border-border/50 bg-background px-2 py-1 text-sm font-medium outline-none"
                    autoFocus
                  />
                ) : (
                  <button
                    type="button"
                    onDoubleClick={() => startEditColumn(column)}
                    className="min-w-0 flex-1 truncate px-1 text-left text-sm font-semibold text-foreground"
                  >
                    {column.title}
                  </button>
                )}

                <DropdownMenu>
                  <DropdownMenuTrigger
                    className="flex size-7 shrink-0 items-center justify-center rounded-md text-muted-foreground hover:bg-muted"
                    aria-label={`${column.title} options`}
                  >
                    <MoreHorizontal className="size-4" />
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="rounded-xl">
                    <DropdownMenuItem onClick={() => startEditColumn(column)}>
                      Rename list
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() =>
                        void handleInsertColumn(column.id, "before")
                      }
                    >
                      Insert list before
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() =>
                        void handleInsertColumn(column.id, "after")
                      }
                    >
                      Insert list after
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem
                      className="text-destructive"
                      onClick={() => void handleDeleteColumn(column.id)}
                    >
                      <Trash2 className="size-3.5" />
                      Delete list
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>

              <div
                className="flex flex-col gap-1 p-2"
                onDragOver={(e) => handleColumnBodyDragOver(e, column.id)}
                onDrop={(e) => e.preventDefault()}
              >
                {(isEmpty || isComposing) && (
                  <div className={cn(isEmpty ? "pb-1" : "")}>
                    {isComposing ? (
                      <CardComposeInput
                        ref={composeRef}
                        value={composeText}
                        onChange={setComposeText}
                        onCancel={() => {
                          setComposingColumnId(null);
                          setComposeText("");
                        }}
                        onSubmit={() => {
                          if (!composeText.trim()) {
                            setComposingColumnId(null);
                            return;
                          }
                          void handleCreateCard(column.id, composeText);
                        }}
                      />
                    ) : (
                      <AddCardButton onClick={() => openCompose(column.id)} />
                    )}
                  </div>
                )}

                {visibleCards.map((card, cardIndex) => (
                  <div key={card.id}>
                    {cardDropTarget?.columnId === column.id &&
                      cardDropTarget.index === cardIndex && (
                        <CardDropMarker />
                      )}
                    <KanbanCardRow
                      card={card}
                      growthAreaId={growthAreaId}
                      isEditing={editingCardId === card.id}
                      draft={
                        editingCardId === card.id ? cardDraft : cardText(card)
                      }
                      onDraftChange={setCardDraft}
                      onStartEdit={() => {
                        setEditingCardId(card.id);
                        setCardDraft(cardText(card));
                      }}
                      onSaveEdit={() => void handleSaveCard(card, cardDraft)}
                      onCancelEdit={() => setEditingCardId(null)}
                      onDelete={() => void handleDeleteCard(card.id)}
                      onDragStart={(e) => handleCardDragStart(card.id, e)}
                      onConverted={onAreasRefresh}
                    />
                  </div>
                ))}

                {cardDropTarget?.columnId === column.id &&
                  cardDropTarget.index === visibleCards.length && (
                    <CardDropMarker />
                  )}

                {column.cards.length > 0 && (
                  <>
                    {!isComposing ? (
                      <AddCardButton onClick={() => openCompose(column.id)} />
                    ) : (
                      !isEmpty && (
                        <CardComposeInput
                          ref={composeRef}
                          value={composeText}
                          onChange={setComposeText}
                          onCancel={() => {
                            setComposingColumnId(null);
                            setComposeText("");
                          }}
                          onSubmit={() => {
                            if (!composeText.trim()) {
                              setComposingColumnId(null);
                              return;
                            }
                            void handleCreateCard(column.id, composeText);
                          }}
                        />
                      )
                    )}
                  </>
                )}
              </div>
            </div>
          </div>
        );
      })}

      {isDraggingColumn && columnDropIndex === board.columns.length && (
        <ColumnDropMarker />
      )}
    </div>
  );
}

function CardDropMarker() {
  return (
    <div className="my-1 h-0.5 rounded-full bg-foreground/30" aria-hidden />
  );
}

function ColumnDropMarker() {
  return (
    <div
      className="mx-0.5 w-0.5 shrink-0 self-stretch rounded-full bg-foreground/30"
      aria-hidden
    />
  );
}

function AddCardButton({ onClick }: { onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="flex w-full items-center justify-center gap-1 rounded-lg py-2 text-xs font-medium text-muted-foreground transition-colors hover:bg-muted/50 hover:text-foreground"
    >
      <Plus className="size-3" />
      Add a card
    </button>
  );
}

const CardComposeInput = forwardRef<
  HTMLTextAreaElement,
  {
    value: string;
    onChange: (value: string) => void;
    onSubmit: () => void;
    onCancel: () => void;
  }
>(function CardComposeInput(
  { value, onChange, onSubmit, onCancel },
  ref
) {
  return (
    <textarea
      ref={ref}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder="Card title..."
      rows={2}
      className="w-full resize-none rounded-lg border border-border/50 bg-background px-3 py-2 text-sm outline-none placeholder:text-muted-foreground focus:border-border"
      onKeyDown={(e) => {
        if (e.key === "Enter" && !e.shiftKey) {
          e.preventDefault();
          onSubmit();
        }
        if (e.key === "Escape") onCancel();
      }}
    />
  );
});

const KanbanCardRow = memo(function KanbanCardRow({
  card,
  growthAreaId,
  isEditing,
  draft,
  onDraftChange,
  onStartEdit,
  onSaveEdit,
  onCancelEdit,
  onDelete,
  onDragStart,
  onConverted,
}: {
  card: KanbanCard;
  growthAreaId: string;
  isEditing: boolean;
  draft: string;
  onDraftChange: (value: string) => void;
  onStartEdit: () => void;
  onSaveEdit: () => void;
  onCancelEdit: () => void;
  onDelete: () => void;
  onDragStart: (e: DragEvent<HTMLElement>) => void;
  onConverted: () => void;
}) {
  const text = cardText(card);

  return (
    <div
      data-kanban-card={card.id}
      draggable={!isEditing}
      onDragStart={onDragStart}
      className={cn(
        "group rounded-lg border border-border/45 bg-card",
        !isEditing && "cursor-grab active:cursor-grabbing"
      )}
    >
      <div className="flex items-start gap-1 p-2">
        <div className="min-w-0 flex-1">
          {isEditing ? (
            <textarea
              value={draft}
              onChange={(e) => onDraftChange(e.target.value)}
              rows={Math.max(2, draft.split("\n").length)}
              className="w-full resize-none bg-transparent text-sm leading-relaxed text-foreground outline-none"
              autoFocus
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  onSaveEdit();
                }
                if (e.key === "Escape") onCancelEdit();
              }}
              onBlur={onSaveEdit}
            />
          ) : (
            <button
              type="button"
              onClick={onStartEdit}
              className="w-full whitespace-pre-wrap text-left text-sm leading-relaxed text-foreground"
            >
              {text || (
                <span className="text-muted-foreground">Empty card</span>
              )}
            </button>
          )}
        </div>
        {!isEditing && (
          <DropdownMenu>
            <DropdownMenuTrigger
              className="flex size-6 shrink-0 items-center justify-center rounded-md text-muted-foreground opacity-0 transition-opacity group-hover:opacity-100 hover:bg-muted"
              aria-label="Card options"
            >
              <MoreHorizontal className="size-3.5" />
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="rounded-xl">
              <div className="px-2 py-1.5">
                <ConvertActions
                  growthAreaId={growthAreaId}
                  sourceType="kanban_card"
                  sourceId={card.id}
                  title={card.title}
                  description={card.description}
                  onConverted={onConverted}
                  compact
                />
              </div>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="text-destructive" onClick={onDelete}>
                <Trash2 className="size-3.5" />
                Delete card
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        )}
      </div>
    </div>
  );
});
