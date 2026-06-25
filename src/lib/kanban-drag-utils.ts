import type { KanbanBoardWithColumns, KanbanCard } from "@/types/notes";
import type { DropBeforeId } from "@/lib/list-drag-utils";

export type CardDragZone = "active" | "archived";

export type CardDragTarget = {
  columnId: string;
  beforeCardId: DropBeforeId;
  zone: CardDragZone;
};

export function partitionColumnCards(cards: KanbanCard[]) {
  const active = cards.filter((card) => !card.is_archived);
  const archived = cards.filter((card) => card.is_archived);
  return { active, archived };
}

export function combineColumnCards(
  active: KanbanCard[],
  archived: KanbanCard[]
): KanbanCard[] {
  return [
    ...active.map((card, index) => ({
      ...card,
      is_archived: false,
      sort_order: index,
    })),
    ...archived.map((card, index) => ({
      ...card,
      is_archived: true,
      sort_order: active.length + index,
    })),
  ];
}

export function cardDragTargetsEqual(
  a: CardDragTarget | null,
  b: CardDragTarget | null
): boolean {
  return (
    a?.columnId === b?.columnId &&
    a?.beforeCardId === b?.beforeCardId &&
    a?.zone === b?.zone
  );
}

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

      const { active, archived } = partitionColumnCards(column.cards);
      const targetPool = target.zone === "archived" ? archived : active;
      const list = [...targetPool];

      const insertIndex =
        target.beforeCardId === null
          ? list.length
          : list.findIndex((card) => card.id === target.beforeCardId);

      if (insertIndex === -1) return column;

      list.splice(insertIndex, 0, {
        ...movingCard!,
        column_id: target.columnId,
        is_archived: target.zone === "archived",
      });

      const nextActive = target.zone === "archived" ? active : list;
      const nextArchived = target.zone === "archived" ? list : archived;

      return {
        ...column,
        cards: combineColumnCards(nextActive, nextArchived),
      };
    }),
  };
}

export function moveColumnInBoard(
  board: KanbanBoardWithColumns,
  columnId: string,
  beforeColumnId: DropBeforeId
): KanbanBoardWithColumns {
  const columns = [...board.columns];
  const sourceIndex = columns.findIndex((column) => column.id === columnId);
  if (sourceIndex === -1) return board;

  const [column] = columns.splice(sourceIndex, 1);

  if (beforeColumnId === null) {
    columns.push(column);
    return { ...board, columns };
  }

  const insertIndex = columns.findIndex((item) => item.id === beforeColumnId);
  if (insertIndex === -1) return board;

  columns.splice(insertIndex, 0, column);
  return { ...board, columns };
}

export function cardDisplayTitle(card: KanbanCard): string {
  const title = card.title.trim();
  if (title && title !== "Untitled" && title !== "New insight") return title;
  return "Untitled";
}

export function normalizeCardInput(text: string): string {
  return text
    .split("\n")
    .map((line) => line.replace(/^-\s/, "• "))
    .join("\n");
}

export function cardBodyDraft(card: KanbanCard): string {
  const title = card.title.trim();
  const description = card.description.trim();
  const hasGenericTitle =
    !title || title === "Untitled" || title === "New insight";

  if (!description) {
    return hasGenericTitle ? "" : title;
  }

  if (hasGenericTitle) return description;
  return `${title}\n${description}`;
}

export function cardBulletLines(card: KanbanCard): string[] {
  const source = card.description.trim();
  if (!source) return [];

  return source
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean)
    .map((line) => line.replace(/^[-*•]\s*/, ""));
}

export function cardText(card: KanbanCard): string {
  return cardBodyDraft(card);
}

export function splitCardText(text: string): { title: string; description: string } {
  const normalized = normalizeCardInput(text);
  const trimmed = normalized.trim();
  if (!trimmed) return { title: "Untitled", description: "" };

  const lines = trimmed.split("\n");
  const [first, ...rest] = lines;
  const description = rest.join("\n").trim();

  if (!description) {
    return { title: first.trim() || "Untitled", description: "" };
  }

  return { title: first.trim() || "Untitled", description };
}
