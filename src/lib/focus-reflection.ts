import type { ReflectionKanbanCard } from "@/types/reflection";

/** Custom reflection entry title used for workplace focus notes. */
export const FOCUS_REFLECTION_ENTRY_TITLE = "Focus";
export const FOCUS_REFLECTION_KANBAN_TITLE = "Focus";

/** Minimum focus seconds before showing the inline session-end prompt. */
export const MIN_FOCUS_REFLECTION_SECONDS = 60;

export function isFocusReflectionEntry(title: string): boolean {
  return title.trim().toLowerCase() === FOCUS_REFLECTION_ENTRY_TITLE.toLowerCase();
}

export function shouldPromptFocusReflection(focusSeconds: number): boolean {
  return focusSeconds >= MIN_FOCUS_REFLECTION_SECONDS;
}

export async function saveFocusReflectionEntry(
  content: string,
  provenance?: ReflectionKanbanCard["provenance"],
): Promise<void> {
  const { fetchTodayReflection, saveReflection } = await import(
    "@/lib/reflection-storage"
  );

  const reflection = await fetchTodayReflection();
  const nextContent = content.trim();
  if (!nextContent) return;
  const boards = reflection?.custom_kanbans ?? [];
  const focusBoard = boards.find(
    (board) => board.title.trim().toLowerCase() === FOCUS_REFLECTION_KANBAN_TITLE.toLowerCase(),
  );
  const nextFocusBoard = focusBoard
    ? {
        ...focusBoard,
        cards: [
          ...focusBoard.cards,
          { id: crypto.randomUUID(), content: nextContent, provenance },
        ],
      }
    : {
        id: crypto.randomUUID(),
        title: FOCUS_REFLECTION_KANBAN_TITLE,
        cards: [{ id: crypto.randomUUID(), content: nextContent, provenance }],
      };
  const nextKanbans = focusBoard
    ? boards.map((board) =>
        board.id === focusBoard.id ? nextFocusBoard : board,
      )
    : [...boards, nextFocusBoard];

  await saveReflection({
    went_well: reflection?.went_well ?? "",
    went_wrong: reflection?.went_wrong ?? "",
    custom_entries: reflection?.custom_entries ?? [],
    custom_kanbans: nextKanbans,
  });
}
