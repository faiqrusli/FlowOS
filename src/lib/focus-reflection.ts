import { getDateKeyInTimezone } from "@/lib/date-utils";
import {
  appendFocusSessionEndEntry,
  type ReflectionRecordIdentity,
} from "@/lib/reflection-core-loop";
import type { FocusSession } from "@/types/focus";

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

export type FocusReflectionSaveOptions = {
  session?: Pick<FocusSession, "id" | "started_at">;
};

export async function saveFocusReflectionEntry(
  content: string,
  options: FocusReflectionSaveOptions = {},
): Promise<ReflectionRecordIdentity | null> {
  const { fetchTodayReflection, saveReflection } = await import(
    "@/lib/reflection-storage"
  );

  const reflection = await fetchTodayReflection();
  const nextContent = content.trim();
  if (!nextContent) return null;

  if (options.session) {
    const entryId = crypto.randomUUID();
    const appended = appendFocusSessionEndEntry(
      {
        went_well: reflection?.went_well ?? "",
        went_wrong: reflection?.went_wrong ?? "",
        custom_entries: reflection?.custom_entries ?? [],
        custom_kanbans: reflection?.custom_kanbans ?? [],
      },
      {
        entryId,
        dateKey: getDateKeyInTimezone(options.session.started_at),
        sessionId: options.session.id,
        dailyReflectionId: reflection?.id ?? null,
        title: FOCUS_REFLECTION_ENTRY_TITLE,
        content: nextContent,
      },
    );

    await saveReflection(appended.draft);
    return appended.identity;
  }

  const boards = reflection?.custom_kanbans ?? [];
  const focusBoard = boards.find(
    (board) => board.title.trim().toLowerCase() === FOCUS_REFLECTION_KANBAN_TITLE.toLowerCase(),
  );
  const nextFocusBoard = focusBoard
    ? {
        ...focusBoard,
        cards: [
          ...focusBoard.cards,
          { id: crypto.randomUUID(), content: nextContent },
        ],
      }
    : {
        id: crypto.randomUUID(),
        title: FOCUS_REFLECTION_KANBAN_TITLE,
        cards: [{ id: crypto.randomUUID(), content: nextContent }],
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

  return null;
}
