import { requireUserId } from "@/lib/auth";
import { supabase } from "@/lib/supabase";
import type {
  KanbanBoard,
  KanbanBoardWithColumns,
  KanbanCard,
  KanbanColumn,
} from "@/types/notes";

export class KanbanError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "KanbanError";
  }
}

export const DEFAULT_KANBAN_COLUMNS = [
  { title: "Need Attention", color: "slate" },
  { title: "Working On", color: "slate" },
  { title: "Consistent", color: "slate" },
  { title: "Mastered", color: "slate" },
] as const;

export const CARD_COLOR_LABELS = [
  "rose",
  "amber",
  "emerald",
  "sky",
  "violet",
  "slate",
] as const;

export type CardColorLabel = (typeof CARD_COLOR_LABELS)[number];

export async function fetchBoardsByArea(
  growthAreaId: string
): Promise<KanbanBoard[]> {
  const userId = await requireUserId();

  const { data, error } = await supabase
    .from("kanban_boards")
    .select("*")
    .eq("user_id", userId)
    .eq("growth_area_id", growthAreaId)
    .order("sort_order", { ascending: true });

  if (error) throw new KanbanError(error.message);
  return data ?? [];
}

export async function fetchBoardWithColumns(
  boardId: string
): Promise<KanbanBoardWithColumns | null> {
  const userId = await requireUserId();

  const { data: board, error: boardError } = await supabase
    .from("kanban_boards")
    .select("*")
    .eq("id", boardId)
    .eq("user_id", userId)
    .maybeSingle();

  if (boardError) throw new KanbanError(boardError.message);
  if (!board) return null;

  const { data: columns, error: colError } = await supabase
    .from("kanban_columns")
    .select("*")
    .eq("board_id", boardId)
    .eq("user_id", userId)
    .order("sort_order", { ascending: true });

  if (colError) throw new KanbanError(colError.message);

  const { data: cards, error: cardError } = await supabase
    .from("kanban_cards")
    .select("*")
    .eq("board_id", boardId)
    .eq("user_id", userId)
    .order("sort_order", { ascending: true });

  if (cardError) throw new KanbanError(cardError.message);

  const cardsByColumn = new Map<string, KanbanCard[]>();
  for (const card of cards ?? []) {
    const list = cardsByColumn.get(card.column_id) ?? [];
    list.push(card);
    cardsByColumn.set(card.column_id, list);
  }

  return {
    ...board,
    columns: (columns ?? []).map((col) => ({
      ...col,
      cards: cardsByColumn.get(col.id) ?? [],
    })),
  };
}

export async function createKanbanBoard(
  growthAreaId: string,
  title: string
): Promise<KanbanBoardWithColumns> {
  const userId = await requireUserId();

  const { data: lastBoard, error: orderError } = await supabase
    .from("kanban_boards")
    .select("sort_order")
    .eq("user_id", userId)
    .eq("growth_area_id", growthAreaId)
    .order("sort_order", { ascending: false })
    .limit(1)
    .maybeSingle();

  if (orderError) throw new KanbanError(orderError.message);

  const sort_order = lastBoard ? lastBoard.sort_order + 1 : 0;

  const { data: board, error: boardError } = await supabase
    .from("kanban_boards")
    .insert({
      growth_area_id: growthAreaId,
      title,
      user_id: userId,
      sort_order,
    })
    .select()
    .single();

  if (boardError) throw new KanbanError(boardError.message);

  const { data: columns, error: colError } = await supabase
    .from("kanban_columns")
    .insert(
      DEFAULT_KANBAN_COLUMNS.map((col, index) => ({
        board_id: board.id,
        user_id: userId,
        title: col.title,
        color: col.color,
        sort_order: index,
      }))
    )
    .select();

  if (colError) throw new KanbanError(colError.message);

  return {
    ...board,
    columns: (columns ?? []).map((col) => ({ ...col, cards: [] })),
  };
}

export async function deleteKanbanBoard(boardId: string): Promise<void> {
  const userId = await requireUserId();

  const { error } = await supabase
    .from("kanban_boards")
    .delete()
    .eq("id", boardId)
    .eq("user_id", userId);

  if (error) throw new KanbanError(error.message);
}

export async function updateKanbanBoard(
  boardId: string,
  input: Partial<{ title: string; sort_order: number }>
): Promise<KanbanBoard> {
  const userId = await requireUserId();

  const { data, error } = await supabase
    .from("kanban_boards")
    .update(input)
    .eq("id", boardId)
    .eq("user_id", userId)
    .select()
    .single();

  if (error) throw new KanbanError(error.message);
  return data;
}

export async function reorderKanbanBoards(
  growthAreaId: string,
  orderedBoardIds: string[]
): Promise<void> {
  const userId = await requireUserId();

  await Promise.all(
    orderedBoardIds.map((id, index) =>
      supabase
        .from("kanban_boards")
        .update({ sort_order: index })
        .eq("id", id)
        .eq("growth_area_id", growthAreaId)
        .eq("user_id", userId)
    )
  );
}

export async function createKanbanCard(input: {
  boardId: string;
  columnId: string;
  title: string;
  description?: string;
  colorLabel?: string;
  sortOrder?: number;
}): Promise<KanbanCard> {
  const userId = await requireUserId();

  const { data, error } = await supabase
    .from("kanban_cards")
    .insert({
      board_id: input.boardId,
      column_id: input.columnId,
      title: input.title,
      description: input.description ?? "",
      color_label: input.colorLabel ?? "slate",
      sort_order: input.sortOrder ?? 0,
      is_archived: false,
      user_id: userId,
    })
    .select()
    .single();

  if (error) throw new KanbanError(error.message);
  return data;
}

export async function updateKanbanCard(
  cardId: string,
  input: Partial<{
    title: string;
    description: string;
    color_label: string;
    column_id: string;
    sort_order: number;
    is_archived: boolean;
  }>
): Promise<KanbanCard> {
  const userId = await requireUserId();

  const { data, error } = await supabase
    .from("kanban_cards")
    .update(input)
    .eq("id", cardId)
    .eq("user_id", userId)
    .select()
    .single();

  if (error) throw new KanbanError(error.message);
  return data;
}

export async function deleteKanbanCard(cardId: string): Promise<void> {
  const userId = await requireUserId();

  const { error } = await supabase
    .from("kanban_cards")
    .delete()
    .eq("id", cardId)
    .eq("user_id", userId);

  if (error) throw new KanbanError(error.message);
}

export async function moveKanbanCard(
  cardId: string,
  columnId: string,
  sortOrder: number
): Promise<KanbanCard> {
  return updateKanbanCard(cardId, {
    column_id: columnId,
    sort_order: sortOrder,
  });
}

export async function updateKanbanColumn(
  columnId: string,
  input: Partial<{ title: string; sort_order: number }>
): Promise<KanbanColumn> {
  const userId = await requireUserId();

  const { data, error } = await supabase
    .from("kanban_columns")
    .update(input)
    .eq("id", columnId)
    .eq("user_id", userId)
    .select()
    .single();

  if (error) throw new KanbanError(error.message);
  return data;
}

export async function deleteKanbanColumn(columnId: string): Promise<void> {
  const userId = await requireUserId();

  const { error } = await supabase
    .from("kanban_columns")
    .delete()
    .eq("id", columnId)
    .eq("user_id", userId);

  if (error) throw new KanbanError(error.message);
}

export async function createKanbanColumn(
  boardId: string,
  title: string,
  sortOrder: number
): Promise<KanbanColumn> {
  const userId = await requireUserId();

  const { data, error } = await supabase
    .from("kanban_columns")
    .insert({
      board_id: boardId,
      user_id: userId,
      title,
      color: "slate",
      sort_order: sortOrder,
    })
    .select()
    .single();

  if (error) throw new KanbanError(error.message);
  return data;
}

export async function reorderKanbanColumns(
  boardId: string,
  orderedColumnIds: string[],
  previousOrder?: string[]
): Promise<void> {
  const userId = await requireUserId();

  const updates: { id: string; sort_order: number }[] = [];

  if (previousOrder) {
    const previousIndex = new Map(
      previousOrder.map((id, index) => [id, index])
    );

    for (let index = 0; index < orderedColumnIds.length; index++) {
      const id = orderedColumnIds[index];
      const oldIndex = previousIndex.get(id);
      if (oldIndex === undefined || oldIndex !== index) {
        updates.push({ id, sort_order: index });
      }
    }
  } else {
    orderedColumnIds.forEach((id, index) => {
      updates.push({ id, sort_order: index });
    });
  }

  if (updates.length === 0) return;

  await Promise.all(
    updates.map(({ id, sort_order }) =>
      supabase
        .from("kanban_columns")
        .update({ sort_order })
        .eq("id", id)
        .eq("board_id", boardId)
        .eq("user_id", userId)
    )
  );
}

export async function insertKanbanColumn(
  boardId: string,
  referenceColumnId: string,
  position: "before" | "after",
  title = "New list",
  currentColumnIds?: string[]
): Promise<KanbanColumn> {
  let orderedIds = currentColumnIds;

  if (!orderedIds) {
    const board = await fetchBoardWithColumns(boardId);
    if (!board) throw new KanbanError("Board not found.");
    orderedIds = board.columns.map((column) => column.id);
  }

  const refIndex = orderedIds.findIndex((id) => id === referenceColumnId);
  if (refIndex === -1) throw new KanbanError("Column not found.");

  const insertIndex = position === "before" ? refIndex : refIndex + 1;
  const column = await createKanbanColumn(boardId, title, insertIndex);

  const nextIds = [...orderedIds];
  nextIds.splice(insertIndex, 0, column.id);
  await reorderKanbanColumns(boardId, nextIds, orderedIds);

  return column;
}

export async function persistKanbanLayout(
  board: KanbanBoardWithColumns
): Promise<void> {
  const userId = await requireUserId();

  await reorderKanbanColumns(
    board.id,
    board.columns.map((c) => c.id)
  );

  const updates: {
    id: string;
    column_id: string;
    sort_order: number;
    is_archived: boolean;
  }[] = [];

  for (const column of board.columns) {
    column.cards.forEach((card, index) => {
      updates.push({
        id: card.id,
        column_id: column.id,
        sort_order: index,
        is_archived: card.is_archived,
      });
    });
  }

  await Promise.all(
    updates.map((item) =>
      supabase
        .from("kanban_cards")
        .update({
          column_id: item.column_id,
          sort_order: item.sort_order,
          is_archived: item.is_archived,
        })
        .eq("id", item.id)
        .eq("user_id", userId)
    )
  );
}
