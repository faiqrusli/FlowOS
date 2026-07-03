"use client";

import {
  forwardRef,
  memo,
  useCallback,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
  type DragEvent,
  type KeyboardEvent,
} from "react";
import {
  Archive,
  ChevronDown,
  ChevronRight,
  MoreHorizontal,
  Pencil,
  Plus,
  Trash2,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  cardBodyDraft,
  cardDragTargetsEqual,
  cardText,
  moveCardInBoard,
  moveColumnInBoard,
  normalizeCardInput,
  partitionColumnCards,
  splitCardText,
  type CardDragTarget,
  type CardDragZone,
} from "@/lib/kanban-drag-utils";
import {
  initialDropBeforeId,
  resolveDropBeforeId,
  setDragImageFromElement,
  type DropBeforeId,
} from "@/lib/list-drag-utils";
import { useKanbanCardPointerGesture } from "@/lib/kanban-card-pointer-gesture";
import {
  focusTextareaAtEnd,
  focusTextareaWithWordAtPoint,
} from "@/lib/kanban-text-selection";
import {
  createTaskDragPreview,
  destroyTaskDragPreview,
  updateTaskDragPreviewPointer,
} from "@/lib/task-drag-preview";
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
  onBoardChange: (board: KanbanBoardWithColumns) => void;
  onAreasRefresh: () => void;
  focusColumnId?: string | null;
  onFocusColumnHandled?: () => void;
};

type DragKind = "card" | "column" | null;

type CardEditFocus = { mode: "end" } | { mode: "word"; x: number; y: number };

function resolveCardDropBeforeId(
  columnBody: HTMLElement,
  orderedCardIds: string[],
  clientY: number,
  excludeCardId?: string
): DropBeforeId {
  return resolveDropBeforeId(
    orderedCardIds,
    columnBody,
    "data-kanban-card",
    clientY,
    "y",
    excludeCardId
  );
}

const BOARD_EDGE_SCROLL_ZONE = 72;
const BOARD_EDGE_SCROLL_SPEED = 7;

export function KanbanBoardView({
  board,
  onBoardChange,
  onAreasRefresh,
  focusColumnId,
  onFocusColumnHandled,
}: KanbanBoardViewProps) {
  const boardRef = useRef<HTMLDivElement>(null);
  const boardStateRef = useRef(board);
  const dragKindRef = useRef<DragKind>(null);
  const dragIdRef = useRef<string | null>(null);
  const [dragKind, setDragKind] = useState<DragKind>(null);
  const [dragId, setDragId] = useState<string | null>(null);
  const [cardDropTarget, setCardDropTarget] = useState<CardDragTarget | null>(
    null
  );
  const [dropBeforeColumnId, setDropBeforeColumnId] =
    useState<DropBeforeId>(null);
  const cardDropTargetRef = useRef<CardDragTarget | null>(null);
  const dropBeforeColumnIdRef = useRef<DropBeforeId>(null);
  const dragEndedRef = useRef(false);
  const pointerXRef = useRef(0);
  const pointerYRef = useRef(0);
  const dragSnapshotRef = useRef<KanbanBoardWithColumns | null>(null);
  const cardPointerCleanupRef = useRef<(() => void) | null>(null);
  const autoScrollRafRef = useRef<number | null>(null);
  const documentDragOverRef = useRef<((event: globalThis.DragEvent) => void) | null>(
    null
  );

  const [collapsed, setCollapsed] = useState<Set<string>>(new Set());
  const [archivedExpanded, setArchivedExpanded] = useState<Set<string>>(
    new Set()
  );
  const [editingColumnId, setEditingColumnId] = useState<string | null>(null);
  const [columnTitleDraft, setColumnTitleDraft] = useState("");
  const [composingColumnId, setComposingColumnId] = useState<string | null>(
    null
  );
  const [composeText, setComposeText] = useState("");
  const [editingCardId, setEditingCardId] = useState<string | null>(null);
  const [cardEditFocus, setCardEditFocus] = useState<CardEditFocus | null>(null);
  const [cardDraft, setCardDraft] = useState("");
  const [cardContextMenu, setCardContextMenu] = useState<{
    cardId: string;
    x: number;
    y: number;
  } | null>(null);
  const composeRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (composingColumnId && composeRef.current) {
      composeRef.current.focus();
    }
  }, [composingColumnId]);

  useEffect(() => {
    boardStateRef.current = board;
  }, [board]);

  useEffect(() => {
    if (!focusColumnId) return;

    const column = board.columns.find((item) => item.id === focusColumnId);
    if (!column) return;

    setEditingColumnId(focusColumnId);
    setColumnTitleDraft(column.title);
    onFocusColumnHandled?.();
  }, [focusColumnId, board.columns, onFocusColumnHandled]);

  useEffect(() => {
    return () => {
      stopBoardAutoScroll();
      removeDocumentDragOverListener();
      detachCardPointerListeners();
      destroyTaskDragPreview();
    };
  }, []);

  function removeDocumentDragOverListener() {
    if (!documentDragOverRef.current) return;
    document.removeEventListener("dragover", documentDragOverRef.current);
    documentDragOverRef.current = null;
  }

  function stopBoardAutoScroll() {
    if (autoScrollRafRef.current !== null) {
      cancelAnimationFrame(autoScrollRafRef.current);
      autoScrollRafRef.current = null;
    }
  }

  function tickBoardAutoScroll() {
    const boardEl = boardRef.current;
    if (!boardEl || dragKindRef.current !== "column") {
      stopBoardAutoScroll();
      return;
    }

    const rect = boardEl.getBoundingClientRect();
    const x = pointerXRef.current;
    let delta = 0;

    if (x < rect.left + BOARD_EDGE_SCROLL_ZONE) {
      const depth =
        (rect.left + BOARD_EDGE_SCROLL_ZONE - x) / BOARD_EDGE_SCROLL_ZONE;
      delta = -BOARD_EDGE_SCROLL_SPEED * Math.min(1, depth);
    } else if (x > rect.right - BOARD_EDGE_SCROLL_ZONE) {
      const depth =
        (x - (rect.right - BOARD_EDGE_SCROLL_ZONE)) / BOARD_EDGE_SCROLL_ZONE;
      delta = BOARD_EDGE_SCROLL_SPEED * Math.min(1, depth);
    }

    if (delta !== 0) {
      boardEl.scrollLeft += delta;
    }

    autoScrollRafRef.current = requestAnimationFrame(tickBoardAutoScroll);
  }

  function startBoardAutoScroll() {
    stopBoardAutoScroll();
    autoScrollRafRef.current = requestAnimationFrame(tickBoardAutoScroll);
  }

  function trackColumnDragPointer(clientX: number) {
    pointerXRef.current = clientX;

    if (!boardRef.current || dragKindRef.current !== "column" || !dragIdRef.current) {
      return;
    }

    const orderedColumnIds = boardStateRef.current.columns.map(
      (column) => column.id
    );
    const beforeId = resolveDropBeforeId(
      orderedColumnIds,
      boardRef.current,
      "data-kanban-column",
      clientX,
      "x",
      dragIdRef.current
    );
    setColumnDropIfChanged(beforeId);
  }

  function attachColumnDragTracking() {
    removeDocumentDragOverListener();

    const onDocumentDragOver = (event: globalThis.DragEvent) => {
      event.preventDefault();
      trackColumnDragPointer(event.clientX);
    };

    documentDragOverRef.current = onDocumentDragOver;
    document.addEventListener("dragover", onDocumentDragOver);
    startBoardAutoScroll();
  }

  function persistBoardLayoutInBackground(
    next: KanbanBoardWithColumns,
    previous: KanbanBoardWithColumns
  ) {
    void persistKanbanLayout(next, previous).catch(() => {
      boardStateRef.current = previous;
      onBoardChange(previous);
    });
  }

  function resetDrag() {
    dragKindRef.current = null;
    dragIdRef.current = null;
    setDragKind(null);
    setDragId(null);
    setCardDropTarget(null);
    setDropBeforeColumnId(null);
    cardDropTargetRef.current = null;
    dropBeforeColumnIdRef.current = null;
  }

  function beginDrag(kind: DragKind, id: string) {
    dragEndedRef.current = false;
    dragKindRef.current = kind;
    dragIdRef.current = id;
    setDragKind(kind);
    setDragId(id);
  }

  function detachCardPointerListeners() {
    cardPointerCleanupRef.current?.();
    cardPointerCleanupRef.current = null;
  }

  function applyOptimisticCardMove(target: CardDragTarget) {
    const activeDragId = dragIdRef.current;
    if (!activeDragId || dragKindRef.current !== "card") return;

    const next = moveCardInBoard(boardStateRef.current, activeDragId, target);
    boardStateRef.current = next;
    onBoardChange(next);
  }

  function setCardDropIfChanged(target: CardDragTarget | null) {
    if (cardDragTargetsEqual(cardDropTargetRef.current, target)) return;
    cardDropTargetRef.current = target;
    setCardDropTarget(target);
    if (target && dragKindRef.current === "card") {
      applyOptimisticCardMove(target);
    }
  }

  function syncCardDropFromPointer(clientX: number, clientY: number) {
    const cardId = dragIdRef.current;
    if (dragKindRef.current !== "card" || !cardId) return;

    const element = document.elementFromPoint(clientX, clientY);
    if (!element) return;

    const archivedBody = element.closest<HTMLElement>("[data-kanban-archived-body]");
    if (archivedBody) {
      const columnId = archivedBody
        .closest<HTMLElement>("[data-kanban-column]")
        ?.getAttribute("data-kanban-column");
      if (!columnId) return;

      const column = boardStateRef.current.columns.find(
        (item) => item.id === columnId
      );
      if (!column) return;

      setArchivedExpanded((prev) => {
        if (prev.has(columnId)) return prev;
        const next = new Set(prev);
        next.add(columnId);
        return next;
      });

      const { archived } = partitionColumnCards(column.cards);
      const beforeCardId = resolveCardDropBeforeId(
        archivedBody,
        archived.map((card) => card.id),
        clientY,
        cardId
      );
      setCardDropIfChanged({ columnId, beforeCardId, zone: "archived" });
      return;
    }

    const columnBody = element.closest<HTMLElement>("[data-kanban-column-body]");
    if (!columnBody) return;

    const columnId = columnBody
      .closest<HTMLElement>("[data-kanban-column]")
      ?.getAttribute("data-kanban-column");
    if (!columnId) return;

    const column = boardStateRef.current.columns.find(
      (item) => item.id === columnId
    );
    if (!column) return;

    const { active } = partitionColumnCards(column.cards);
    const beforeCardId = resolveCardDropBeforeId(
      columnBody,
      active.map((card) => card.id),
      clientY,
      cardId
    );
    setCardDropIfChanged({ columnId, beforeCardId, zone: "active" });
  }

  function attachCardPointerListeners() {
    detachCardPointerListeners();

    const preventSelect = (event: Event) => {
      event.preventDefault();
    };

    const onPointerMove = (event: globalThis.PointerEvent) => {
      if (dragKindRef.current !== "card") return;
      event.preventDefault();
      pointerXRef.current = event.clientX;
      pointerYRef.current = event.clientY;
      updateTaskDragPreviewPointer(event.clientX, event.clientY);
      syncCardDropFromPointer(event.clientX, event.clientY);
    };

    const onPointerEnd = () => {
      window.getSelection()?.removeAllRanges();
      handleCardDragEnd();
    };

    const onKeyDown = (event: globalThis.KeyboardEvent) => {
      if (event.key !== "Escape" || dragKindRef.current !== "card") return;
      event.preventDefault();
      if (dragEndedRef.current) return;
      dragEndedRef.current = true;
      if (dragSnapshotRef.current) {
        boardStateRef.current = dragSnapshotRef.current;
        onBoardChange(dragSnapshotRef.current);
      }
      destroyTaskDragPreview();
      resetDrag();
    };

    document.addEventListener("selectstart", preventSelect);
    document.addEventListener("pointermove", onPointerMove, { passive: false });
    document.addEventListener("pointerup", onPointerEnd);
    document.addEventListener("pointercancel", onPointerEnd);
    document.addEventListener("keydown", onKeyDown);

    cardPointerCleanupRef.current = () => {
      document.removeEventListener("selectstart", preventSelect);
      document.removeEventListener("pointermove", onPointerMove);
      document.removeEventListener("pointerup", onPointerEnd);
      document.removeEventListener("pointercancel", onPointerEnd);
      document.removeEventListener("keydown", onKeyDown);
    };
  }

  function handleCardPointerDragStart(
    cardId: string,
    coords: { clientX: number; clientY: number }
  ) {
    dragSnapshotRef.current = boardStateRef.current;
    beginDrag("card", cardId);
    pointerXRef.current = coords.clientX;
    pointerYRef.current = coords.clientY;

    const card = boardStateRef.current.columns
      .flatMap((column) => column.cards)
      .find((item) => item.id === cardId);
    const rowEl = document.querySelector<HTMLElement>(
      `[data-kanban-card="${cardId}"]`
    );

    if (card && rowEl) {
      createTaskDragPreview(
        cardId,
        { title: cardText(card), completed: false },
        rowEl.getBoundingClientRect(),
        coords.clientX,
        coords.clientY
      );
    }

    const sourceColumn = boardStateRef.current.columns.find((column) =>
      column.cards.some((item) => item.id === cardId)
    );
    if (sourceColumn) {
      const movingCard = sourceColumn.cards.find((item) => item.id === cardId);
      const { active, archived } = partitionColumnCards(
        sourceColumn.cards.filter((item) => item.id !== cardId)
      );
      const zone: CardDragZone = movingCard?.is_archived ? "archived" : "active";
      const pool = zone === "archived" ? archived : active;

      setCardDropIfChanged({
        columnId: sourceColumn.id,
        beforeCardId: initialDropBeforeId(
          pool.map((item) => item.id),
          cardId
        ),
        zone,
      });
    }

    attachCardPointerListeners();
  }

  function setColumnDropIfChanged(beforeId: DropBeforeId) {
    if (dropBeforeColumnIdRef.current === beforeId) return;
    dropBeforeColumnIdRef.current = beforeId;
    setDropBeforeColumnId(beforeId);

    const columnId = dragIdRef.current;
    if (dragKindRef.current === "column" && columnId) {
      const next = moveColumnInBoard(boardStateRef.current, columnId, beforeId);
      boardStateRef.current = next;
      onBoardChange(next);
    }
  }

  function handleCardDragEnd() {
    if (dragEndedRef.current) return;
    dragEndedRef.current = true;
    detachCardPointerListeners();

    const activeDragId = dragIdRef.current;
    const wasCardDrag = dragKindRef.current === "card";
    const snapshot = dragSnapshotRef.current;

    if (wasCardDrag && activeDragId) {
      syncCardDropFromPointer(pointerXRef.current, pointerYRef.current);
    }

    const boardToPersist = boardStateRef.current;

    dragSnapshotRef.current = null;
    destroyTaskDragPreview();
    resetDrag();

    if (wasCardDrag && activeDragId && snapshot) {
      persistBoardLayoutInBackground(boardToPersist, snapshot);
    }
  }

  function handleColumnBodyDragOver(
    e: DragEvent<HTMLElement>,
    columnId: string
  ) {
    if (dragKindRef.current !== "card" || !dragIdRef.current) return;

    e.preventDefault();
    e.stopPropagation();
    e.dataTransfer.dropEffect = "move";

    const columnBody =
      e.currentTarget.closest<HTMLElement>("[data-kanban-column-body]") ??
      (e.currentTarget.matches("[data-kanban-column-body]")
        ? e.currentTarget
        : null);

    if (!columnBody) return;

    const column = boardStateRef.current.columns.find(
      (item) => item.id === columnId
    );
    if (!column) return;

    const { active } = partitionColumnCards(column.cards);
    const beforeCardId = resolveCardDropBeforeId(
      columnBody,
      active.map((card) => card.id),
      e.clientY,
      dragIdRef.current
    );
    setCardDropIfChanged({ columnId, beforeCardId, zone: "active" });
  }

  function handleArchivedBodyDragOver(
    e: DragEvent<HTMLElement>,
    columnId: string
  ) {
    if (dragKindRef.current !== "card" || !dragIdRef.current) return;

    e.preventDefault();
    e.stopPropagation();
    e.dataTransfer.dropEffect = "move";

    setArchivedExpanded((prev) => {
      if (prev.has(columnId)) return prev;
      const next = new Set(prev);
      next.add(columnId);
      return next;
    });

    const archivedBody =
      e.currentTarget.closest<HTMLElement>("[data-kanban-archived-body]") ??
      (e.currentTarget.matches("[data-kanban-archived-body]")
        ? e.currentTarget
        : null);

    if (!archivedBody) return;

    const column = boardStateRef.current.columns.find(
      (item) => item.id === columnId
    );
    if (!column) return;

    const { archived } = partitionColumnCards(column.cards);
    const beforeCardId = resolveCardDropBeforeId(
      archivedBody,
      archived.map((card) => card.id),
      e.clientY,
      dragIdRef.current
    );
    setCardDropIfChanged({ columnId, beforeCardId, zone: "archived" });
  }

  function handleColumnDragStart(
    columnId: string,
    e: DragEvent<HTMLElement>
  ) {
    e.stopPropagation();
    dragSnapshotRef.current = boardStateRef.current;
    beginDrag("column", columnId);
    pointerXRef.current = e.clientX;

    e.dataTransfer.effectAllowed = "move";
    e.dataTransfer.setData("text/plain", columnId);

    const columnEl = e.currentTarget.closest(
      "[data-kanban-column]"
    ) as HTMLElement | null;
    if (columnEl) {
      setDragImageFromElement(e, columnEl, 24, 24);
    }

    const orderedColumnIds = boardStateRef.current.columns.map(
      (column) => column.id
    );
    setColumnDropIfChanged(initialDropBeforeId(orderedColumnIds, columnId));
    attachColumnDragTracking();
  }

  function handleBoardDragOver(e: DragEvent<HTMLDivElement>) {
    if (dragKindRef.current === "column" && dragIdRef.current && boardRef.current) {
      e.preventDefault();
      e.dataTransfer.dropEffect = "move";
      trackColumnDragPointer(e.clientX);
      return;
    }

    if (dragKindRef.current === "card" && dragIdRef.current) {
      e.preventDefault();
      e.dataTransfer.dropEffect = "move";
    }
  }

  function handleColumnDragEnd() {
    stopBoardAutoScroll();
    removeDocumentDragOverListener();

    const activeDragId = dragIdRef.current;
    const beforeColumnId = dropBeforeColumnIdRef.current;
    const wasColumnDrag = dragKindRef.current === "column";
    const snapshot = dragSnapshotRef.current;

    let boardToPersist = boardStateRef.current;
    if (wasColumnDrag && activeDragId) {
      const nextBoard = moveColumnInBoard(
        boardStateRef.current,
        activeDragId,
        beforeColumnId
      );
      boardStateRef.current = nextBoard;
      onBoardChange(nextBoard);
      boardToPersist = nextBoard;
    }

    dragSnapshotRef.current = null;
    resetDrag();

    if (wasColumnDrag && activeDragId && snapshot) {
      persistBoardLayoutInBackground(boardToPersist, snapshot);
    }
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

  function toggleArchivedSection(columnId: string) {
    setArchivedExpanded((prev) => {
      const next = new Set(prev);
      if (next.has(columnId)) next.delete(columnId);
      else next.add(columnId);
      return next;
    });
  }

  async function handleArchiveCard(cardId: string) {
    const card = board.columns
      .flatMap((column) => column.cards)
      .find((item) => item.id === cardId);
    if (!card) return;

    const snapshot = board;
    const nextBoard = moveCardInBoard(board, cardId, {
      columnId: card.column_id,
      beforeCardId: null,
      zone: "archived",
    });
    boardStateRef.current = nextBoard;
    onBoardChange(nextBoard);
    persistBoardLayoutInBackground(nextBoard, snapshot);
    onAreasRefresh();
  }

  async function handleMoveCardToList(cardId: string, targetColumnId: string) {
    const snapshot = board;
    const nextBoard = moveCardInBoard(board, cardId, {
      columnId: targetColumnId,
      beforeCardId: null,
      zone: "active",
    });
    boardStateRef.current = nextBoard;
    onBoardChange(nextBoard);
    persistBoardLayoutInBackground(nextBoard, snapshot);
    onAreasRefresh();
  }

  async function handleCreateCard(columnId: string, text: string) {
    const normalized = normalizeCardInput(text);
    const { title, description } = splitCardText(normalized);
    const column = board.columns.find((c) => c.id === columnId);
    if (!column) return;

    const { active } = partitionColumnCards(column.cards);

    const card = await createKanbanCard({
      boardId: board.id,
      columnId,
      title,
      description,
      sortOrder: active.length,
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
    const normalized = normalizeCardInput(text);
    const { title, description } = splitCardText(normalized);
    const updated = await updateKanbanCard(card.id, { title, description });
    onBoardChange({
      ...board,
      columns: board.columns.map((col) => ({
        ...col,
        cards: col.cards.map((c) => (c.id === card.id ? updated : c)),
      })),
    });
    setEditingCardId(null);
    setCardEditFocus(null);
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

  function startEditCard(card: KanbanCard, focus: CardEditFocus) {
    setEditingCardId(card.id);
    setCardEditFocus(focus);
    setCardDraft(cardText(card));
  }

  const isDraggingCard = dragKind === "card";
  const isDraggingColumn = dragKind === "column";

  return (
    <div
      ref={boardRef}
      className="kanban-board-scroll flex h-full min-h-0 gap-3 overflow-x-auto overscroll-x-contain pb-1"
      onDragOver={handleBoardDragOver}
    >
      {board.columns.map((column) => {
        const isCollapsed = collapsed.has(column.id);
        const isComposing = composingColumnId === column.id;
        const isSourceColumn = isDraggingColumn && dragId === column.id;
        const { active: activeCards, archived: archivedCards } =
          partitionColumnCards(column.cards);
        const isArchivedOpen = archivedExpanded.has(column.id);
        const showColumnMarker =
          isDraggingColumn &&
          dropBeforeColumnId === column.id &&
          !isSourceColumn;

        if (isCollapsed) {
          return (
            <div key={column.id} className="flex shrink-0 items-stretch gap-0">
              {showColumnMarker && <ColumnDropMarker />}
              <div
                data-kanban-column={column.id}
                draggable
                onDragStart={(e) => handleColumnDragStart(column.id, e)}
                onDragEnd={handleColumnDragEnd}
                className={cn(
                  "flex w-11 shrink-0 cursor-grab flex-col items-center rounded-xl border border-border/40 bg-muted/30 py-2 active:cursor-grabbing",
                  isSourceColumn && "opacity-40"
                )}
              >
                <button
                  type="button"
                  onClick={() => toggleCollapsed(column.id)}
                  className="mb-2 flex size-7 items-center justify-center rounded-md text-muted-foreground hover:bg-muted"
                  aria-label={`Expand ${column.title}`}
                  onMouseDown={(event) => event.stopPropagation()}
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

        return (
          <div key={column.id} className="flex shrink-0 items-stretch">
            {showColumnMarker && <ColumnDropMarker />}
            <div
              data-kanban-column={column.id}
              className={cn(
                "flex h-full max-h-full w-[min(100%,280px)] min-w-[260px] max-w-[280px] shrink-0 flex-col rounded-xl border border-border/40 bg-muted/15",
                isSourceColumn && "opacity-40"
              )}
              onDragOver={(e) => handleColumnBodyDragOver(e, column.id)}
            >
              <div
                className="flex shrink-0 items-center gap-1 border-b border-border/30 px-2 py-2"
                draggable={editingColumnId !== column.id}
                onDragStart={(event) => {
                  const target = event.target as HTMLElement;
                  if (
                    target.closest(
                      "button, input, textarea, [data-radix-collection-item]"
                    )
                  ) {
                    event.preventDefault();
                    return;
                  }
                  handleColumnDragStart(column.id, event);
                }}
                onDragEnd={handleColumnDragEnd}
              >
                <button
                  type="button"
                  onClick={() => toggleCollapsed(column.id)}
                  className="flex size-7 shrink-0 items-center justify-center rounded-md text-muted-foreground hover:bg-muted"
                  aria-label={`Collapse ${column.title}`}
                  onMouseDown={(event) => event.stopPropagation()}
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
                className="min-h-0 flex-1 overflow-y-auto"
                onDragOver={(e) => handleColumnBodyDragOver(e, column.id)}
              >
              <div
                data-kanban-column-body
                className="flex flex-col gap-1 p-2"
                onDragOver={(e) => handleColumnBodyDragOver(e, column.id)}
                onDrop={(e) => {
                  e.preventDefault();
                  handleCardDragEnd();
                }}
              >
                {activeCards.map((card) => (
                  <div key={card.id}>
                    {cardDropTarget?.columnId === column.id &&
                      cardDropTarget.zone === "active" &&
                      cardDropTarget.beforeCardId === card.id && <CardDropLine />}
                    <KanbanCardRow
                      card={card}
                      columns={board.columns}
                      isEditing={editingCardId === card.id}
                      isDragging={isDraggingCard && dragId === card.id}
                      editFocus={
                        editingCardId === card.id ? cardEditFocus : null
                      }
                      draft={
                        editingCardId === card.id ? cardDraft : cardText(card)
                      }
                      onDraftChange={setCardDraft}
                      onStartEditAtEnd={() =>
                        startEditCard(card, { mode: "end" })
                      }
                      onStartEditWord={(coords) =>
                        startEditCard(card, {
                          mode: "word",
                          x: coords.clientX,
                          y: coords.clientY,
                        })
                      }
                      onSaveEdit={() => void handleSaveCard(card, cardDraft)}
                      onCancelEdit={() => {
                        setEditingCardId(null);
                        setCardEditFocus(null);
                      }}
                      onArchive={() => void handleArchiveCard(card.id)}
                      onMoveToList={(targetColumnId) =>
                        void handleMoveCardToList(card.id, targetColumnId)
                      }
                      onDelete={() => void handleDeleteCard(card.id)}
                      onPointerDragStart={(coords) =>
                        handleCardPointerDragStart(card.id, coords)
                      }
                      onPointerDragEnd={handleCardDragEnd}
                      onOpenContextMenu={(x, y) =>
                        setCardContextMenu({ cardId: card.id, x, y })
                      }
                    />
                  </div>
                ))}

                {cardDropTarget?.columnId === column.id &&
                  cardDropTarget.zone === "active" &&
                  cardDropTarget.beforeCardId === null && <CardDropLine />}

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

                {archivedCards.length > 0 && (
                  <div className="mt-1 border-t border-border/30 pt-1">
                    <button
                      type="button"
                      onClick={() => toggleArchivedSection(column.id)}
                      onDragOver={(event) => {
                        if (dragKindRef.current !== "card" || !dragIdRef.current) {
                          return;
                        }
                        event.preventDefault();
                        event.dataTransfer.dropEffect = "move";
                        setArchivedExpanded((prev) => {
                          if (prev.has(column.id)) return prev;
                          const next = new Set(prev);
                          next.add(column.id);
                          return next;
                        });
                        setCardDropIfChanged({
                          columnId: column.id,
                          beforeCardId: null,
                          zone: "archived",
                        });
                      }}
                      className="flex w-full items-center gap-1 rounded-md px-1 py-1.5 text-xs font-medium text-muted-foreground transition-colors hover:bg-muted/50 hover:text-foreground"
                    >
                      {isArchivedOpen ? (
                        <ChevronDown className="size-3.5 shrink-0" />
                      ) : (
                        <ChevronRight className="size-3.5 shrink-0" />
                      )}
                      Archived ({archivedCards.length})
                    </button>

                    {isArchivedOpen && (
                      <div
                        data-kanban-archived-body
                        className="mt-1 flex flex-col gap-1"
                        onDragOver={(event) =>
                          handleArchivedBodyDragOver(event, column.id)
                        }
                      >
                        {archivedCards.map((card) => (
                          <div key={card.id}>
                            {cardDropTarget?.columnId === column.id &&
                              cardDropTarget.zone === "archived" &&
                              cardDropTarget.beforeCardId === card.id && (
                                <CardDropLine />
                              )}
                            <KanbanCardRow
                              card={card}
                              columns={board.columns}
                              isEditing={editingCardId === card.id}
                              isDragging={isDraggingCard && dragId === card.id}
                              editFocus={
                                editingCardId === card.id ? cardEditFocus : null
                              }
                              draft={
                                editingCardId === card.id
                                  ? cardDraft
                                  : cardText(card)
                              }
                              onDraftChange={setCardDraft}
                              onStartEditAtEnd={() =>
                                startEditCard(card, { mode: "end" })
                              }
                              onStartEditWord={(coords) =>
                                startEditCard(card, {
                                  mode: "word",
                                  x: coords.clientX,
                                  y: coords.clientY,
                                })
                              }
                              onSaveEdit={() =>
                                void handleSaveCard(card, cardDraft)
                              }
                              onCancelEdit={() => {
                                setEditingCardId(null);
                                setCardEditFocus(null);
                              }}
                              onArchive={() => void handleArchiveCard(card.id)}
                              onMoveToList={(targetColumnId) =>
                                void handleMoveCardToList(card.id, targetColumnId)
                              }
                              onDelete={() => void handleDeleteCard(card.id)}
                              onPointerDragStart={(coords) =>
                                handleCardPointerDragStart(card.id, coords)
                              }
                              onPointerDragEnd={handleCardDragEnd}
                              onOpenContextMenu={(x, y) =>
                                setCardContextMenu({ cardId: card.id, x, y })
                              }
                            />
                          </div>
                        ))}
                        {cardDropTarget?.columnId === column.id &&
                          cardDropTarget.zone === "archived" &&
                          cardDropTarget.beforeCardId === null && <CardDropLine />}
                      </div>
                    )}
                  </div>
                )}
              </div>
              </div>
            </div>
          </div>
        );
      })}

      {isDraggingColumn && dropBeforeColumnId === null && <ColumnDropMarker />}

      {cardContextMenu ? (
        <KanbanCardContextMenu
          cardId={cardContextMenu.cardId}
          x={cardContextMenu.x}
          y={cardContextMenu.y}
          board={board}
          onClose={() => setCardContextMenu(null)}
          onEdit={(cardId) => {
            const card = board.columns
              .flatMap((column) => column.cards)
              .find((item) => item.id === cardId);
            if (card) startEditCard(card, { mode: "end" });
            setCardContextMenu(null);
          }}
          onArchive={(cardId) => {
            void handleArchiveCard(cardId);
            setCardContextMenu(null);
          }}
          onMoveToList={(cardId, columnId) => {
            void handleMoveCardToList(cardId, columnId);
            setCardContextMenu(null);
          }}
          onDelete={(cardId) => {
            void handleDeleteCard(cardId);
            setCardContextMenu(null);
          }}
        />
      ) : null}
    </div>
  );
}

function CardDropLine() {
  return (
    <div
      className="my-1 h-0.5 rounded-full bg-sky-500/85"
      aria-hidden
    />
  );
}

function ColumnDropMarker() {
  return (
    <div
      className="mx-0.5 w-0.5 shrink-0 self-stretch rounded-full bg-sky-500/70"
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

type AutoGrowTextareaProps = {
  value: string;
  onChange: (value: string) => void;
  className?: string;
  placeholder?: string;
  editFocus?: CardEditFocus | null;
  onKeyDown?: (event: KeyboardEvent<HTMLTextAreaElement>) => void;
  onBlur?: () => void;
};

const AutoGrowTextarea = forwardRef<HTMLTextAreaElement, AutoGrowTextareaProps>(
  function AutoGrowTextarea(
    {
      value,
      onChange,
      className,
      placeholder,
      editFocus = null,
      onKeyDown,
      onBlur,
    },
    ref
  ) {
    const innerRef = useRef<HTMLTextAreaElement>(null);

    useImperativeHandle(ref, () => innerRef.current as HTMLTextAreaElement);

    const resize = useCallback(() => {
      const el = innerRef.current;
      if (!el) return;
      el.style.height = "0px";
      el.style.height = `${el.scrollHeight}px`;
    }, []);

    useEffect(() => {
      resize();
      const el = innerRef.current;
      if (!el) return;
      if (editFocus?.mode === "word") {
        focusTextareaWithWordAtPoint(el, editFocus.x, editFocus.y);
      } else {
        focusTextareaAtEnd(el);
      }
    }, [editFocus, resize]);

    useEffect(() => {
      resize();
    }, [value, resize]);

    return (
      <textarea
        ref={innerRef}
        value={value}
        onChange={(event) => {
          onChange(event.target.value);
          requestAnimationFrame(resize);
        }}
        placeholder={placeholder}
        rows={1}
        className={cn(
          "w-full resize-none overflow-hidden text-sm leading-relaxed outline-none",
          className
        )}
        style={{ minHeight: "2.25rem" }}
        onKeyDown={onKeyDown}
        onBlur={onBlur}
      />
    );
  }
);

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
    <AutoGrowTextarea
      ref={ref}
      value={value}
      onChange={onChange}
      placeholder="Write here... use - for bullets"
      className="rounded-lg border border-border/50 bg-background px-3 py-2 placeholder:text-muted-foreground focus:border-border"
      onKeyDown={(event) => {
        if (event.key === "Enter" && !event.shiftKey) {
          event.preventDefault();
          onSubmit();
        }
        if (event.key === "Escape") onCancel();
      }}
      onBlur={() => {
        if (!value.trim()) {
          onCancel();
          return;
        }
        onSubmit();
      }}
    />
  );
});

const KanbanCardRow = memo(function KanbanCardRow({
  card,
  columns,
  isEditing,
  isDragging,
  editFocus,
  draft,
  onDraftChange,
  onStartEditAtEnd,
  onStartEditWord,
  onSaveEdit,
  onCancelEdit,
  onArchive,
  onMoveToList,
  onDelete,
  onPointerDragStart,
  onPointerDragEnd,
  onOpenContextMenu,
}: {
  card: KanbanCard;
  columns: (KanbanColumn & { cards: KanbanCard[] })[];
  isEditing: boolean;
  isDragging: boolean;
  editFocus: CardEditFocus | null;
  draft: string;
  onDraftChange: (value: string) => void;
  onStartEditAtEnd: () => void;
  onStartEditWord: (coords: { clientX: number; clientY: number }) => void;
  onSaveEdit: () => void;
  onCancelEdit: () => void;
  onArchive: () => void;
  onMoveToList: (targetColumnId: string) => void;
  onDelete: () => void;
  onPointerDragStart: (coords: { clientX: number; clientY: number }) => void;
  onPointerDragEnd: () => void;
  onOpenContextMenu: (x: number, y: number) => void;
}) {
  const body = cardBodyDraft(card);
  const moveTargets = columns.filter((column) => column.id !== card.column_id);

  const isInteractiveTarget = useCallback((target: EventTarget | null) => {
    if (!(target instanceof Element)) return false;
    return Boolean(
      target.closest(
        "button, textarea, input, [role='menu'], [data-radix-popper-content-wrapper]"
      )
    );
  }, []);

  const pointerGesture = useKanbanCardPointerGesture({
    enabled: !isEditing,
    isInteractiveTarget,
    onSingleClickEdit: onStartEditAtEnd,
    onDoubleClickWord: onStartEditWord,
    onPointerDragStart,
    onPointerDragEnd,
  });

  function saveDraft() {
    onDraftChange(normalizeCardInput(draft));
    onSaveEdit();
  }

  return (
    <div
      data-kanban-card={card.id}
      className={cn(
        "group relative min-w-0 touch-none overflow-hidden rounded-lg border border-border/45 bg-card shadow-sm",
        card.is_archived && "border-border/30 bg-muted/20 opacity-90",
        !isEditing && "cursor-grab active:cursor-grabbing",
        isDragging && "pointer-events-none opacity-0"
      )}
      onPointerDown={isEditing ? undefined : pointerGesture.onPointerDown}
      onPointerMove={isEditing ? undefined : pointerGesture.onPointerMove}
      onPointerUp={isEditing ? undefined : pointerGesture.onPointerUp}
      onPointerCancel={isEditing ? undefined : pointerGesture.onPointerCancel}
      onContextMenu={(event) => {
        if (isEditing) return;
        event.preventDefault();
        onOpenContextMenu(event.clientX, event.clientY);
      }}
    >
      {!isEditing && (
        <DropdownMenu>
          <DropdownMenuTrigger
            className="absolute top-1.5 right-1.5 z-10 flex size-6 shrink-0 items-center justify-center rounded-md text-muted-foreground opacity-0 transition-opacity group-hover:opacity-100 hover:bg-muted"
            aria-label="Card options"
            onPointerDown={(event) => event.stopPropagation()}
          >
            <MoreHorizontal className="size-3.5" />
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="rounded-xl">
            <DropdownMenuItem onClick={onStartEditAtEnd}>
              <Pencil className="size-3.5" />
              Edit card
            </DropdownMenuItem>
            {!card.is_archived && (
              <DropdownMenuItem onClick={onArchive}>
                <Archive className="size-3.5" />
                Archive card
              </DropdownMenuItem>
            )}
            {moveTargets.length > 0 && (
              <>
                <DropdownMenuSeparator />
                <p className="px-2 py-1 text-[11px] font-medium text-muted-foreground">
                  Move to list
                </p>
                {moveTargets.map((column) => (
                  <DropdownMenuItem
                    key={column.id}
                    onClick={() => onMoveToList(column.id)}
                  >
                    {column.title}
                  </DropdownMenuItem>
                ))}
              </>
            )}
            <DropdownMenuSeparator />
            <DropdownMenuItem className="text-destructive" onClick={onDelete}>
              <Trash2 className="size-3.5" />
              Delete card
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      )}

      {isEditing ? (
        <AutoGrowTextarea
          value={draft}
          onChange={onDraftChange}
          editFocus={editFocus}
          placeholder="Write here... use - for bullets"
          className="bg-transparent px-3 py-2.5 text-foreground"
          onKeyDown={(event) => {
            if (event.key === "Enter" && !event.shiftKey) {
              event.preventDefault();
              saveDraft();
            }
            if (event.key === "Escape") onCancelEdit();
          }}
          onBlur={saveDraft}
        />
      ) : (
        <div className="w-full min-w-0 overflow-hidden px-3 py-2.5 pr-9 text-left select-text">
          <CardBodyDisplay text={body} />
        </div>
      )}
    </div>
  );
});

function KanbanCardContextMenu({
  cardId,
  x,
  y,
  board,
  onClose,
  onEdit,
  onArchive,
  onMoveToList,
  onDelete,
}: {
  cardId: string;
  x: number;
  y: number;
  board: KanbanBoardWithColumns;
  onClose: () => void;
  onEdit: (cardId: string) => void;
  onArchive: (cardId: string) => void;
  onMoveToList: (cardId: string, columnId: string) => void;
  onDelete: (cardId: string) => void;
}) {
  const card = board.columns
    .flatMap((column) => column.cards)
    .find((item) => item.id === cardId);
  const moveTargets = board.columns.filter(
    (column) => column.id !== card?.column_id
  );

  if (!card) return null;

  return (
    <>
      <button
        type="button"
        className="fixed inset-0 z-[99] cursor-default bg-transparent"
        aria-label="Close menu"
        onClick={onClose}
      />
      <div
        className="flow-surface-elevated fixed z-[100] min-w-[11rem] p-1"
        style={{ left: x, top: y }}
        onClick={(event) => event.stopPropagation()}
      >
        <button
          type="button"
          className="flex w-full items-center gap-2 rounded-md px-2 py-1.5 text-left text-xs hover:bg-muted"
          onClick={() => onEdit(cardId)}
        >
          <Pencil className="size-3.5 shrink-0" />
          Edit card
        </button>
        {!card.is_archived ? (
          <button
            type="button"
            className="flex w-full items-center gap-2 rounded-md px-2 py-1.5 text-left text-xs hover:bg-muted"
            onClick={() => onArchive(cardId)}
          >
            <Archive className="size-3.5 shrink-0" />
            Archive card
          </button>
        ) : null}
        {moveTargets.map((column) => (
          <button
            key={column.id}
            type="button"
            className="flex w-full items-center gap-2 rounded-md px-2 py-1.5 text-left text-xs hover:bg-muted"
            onClick={() => onMoveToList(cardId, column.id)}
          >
            {column.title}
          </button>
        ))}
        <button
          type="button"
          className="flex w-full items-center gap-2 rounded-md px-2 py-1.5 text-left text-xs text-destructive hover:bg-muted"
          onClick={() => onDelete(cardId)}
        >
          <Trash2 className="size-3.5 shrink-0" />
          Delete card
        </button>
      </div>
    </>
  );
}

function CardBodyDisplay({ text }: { text: string }) {
  if (!text.trim()) {
    return (
      <p className="text-sm text-muted-foreground">Click to write</p>
    );
  }

  return (
    <div className="min-w-0 space-y-1 text-sm leading-relaxed text-foreground [overflow-wrap:anywhere]">
      {text.split("\n").map((line, index) => {
        const bulletMatch = line.match(/^[•\-*]\s?(.*)$/);
        if (bulletMatch) {
          return (
            <div key={`${index}-${line}`} className="flex min-w-0 items-start gap-2">
              <span className="mt-0.5 shrink-0 text-muted-foreground">•</span>
              <span className="min-w-0 flex-1 [overflow-wrap:anywhere]">
                {bulletMatch[1]}
              </span>
            </div>
          );
        }

        return (
          <p
            key={`${index}-${line}`}
            className="min-w-0 whitespace-pre-wrap [overflow-wrap:anywhere]"
          >
            {line}
          </p>
        );
      })}
    </div>
  );
}
