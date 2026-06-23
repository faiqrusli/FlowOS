import type { KanbanBoardWithColumns, KanbanCard } from "@/types/notes";

export type CardDragTarget = {
  columnId: string;
  index: number;
};

export type ColumnDragTarget = {
  index: number;
};

export function moveCardInBoard(
  board: KanbanBoardWithColumns,
  cardId: string,
  target: CardDragTarget
): KanbanBoardWithColumns {
  let movingCard: KanbanCard | null = null;

  const stripped = board.columns.map((column) => {
    const cards = column.cards.filter((card) => {
      if (card.id === cardId) {
        movingCard = card;
        return false;
      }
      return true;
    });
    return { ...column, cards };
  });

  if (!movingCard) return board;

  return {
    ...board,
    columns: stripped.map((column) => {
      if (column.id !== target.columnId) return column;
      const cards = [...column.cards];
      cards.splice(target.index, 0, {
        ...movingCard!,
        column_id: target.columnId,
      });
      return { ...column, cards };
    }),
  };
}

export function moveColumnInBoard(
  board: KanbanBoardWithColumns,
  columnId: string,
  targetIndex: number
): KanbanBoardWithColumns {
  const columns = [...board.columns];
  const sourceIndex = columns.findIndex((column) => column.id === columnId);
  if (sourceIndex === -1 || sourceIndex === targetIndex) return board;

  const [column] = columns.splice(sourceIndex, 1);
  columns.splice(targetIndex, 0, column);

  return { ...board, columns };
}

export function cardText(card: KanbanCard): string {
  if (card.description.trim()) return card.description;
  return card.title === "New insight" || card.title === "Untitled"
    ? ""
    : card.title;
}

export function splitCardText(text: string): { title: string; description: string } {
  const trimmed = text.trim();
  if (!trimmed) return { title: "Untitled", description: "" };
  const [first, ...rest] = trimmed.split("\n");
  const description = rest.join("\n").trim();
  if (!description) return { title: first.trim() || "Untitled", description: "" };
  return { title: first.trim() || "Untitled", description: trimmed };
}
