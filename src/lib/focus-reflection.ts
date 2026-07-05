/** Custom reflection entry title used for workplace focus notes. */
export const FOCUS_REFLECTION_ENTRY_TITLE = "Focus";

/** Minimum focus seconds before showing the inline session-end prompt. */
export const MIN_FOCUS_REFLECTION_SECONDS = 60;

export function isFocusReflectionEntry(title: string): boolean {
  return title.trim().toLowerCase() === FOCUS_REFLECTION_ENTRY_TITLE.toLowerCase();
}

export function shouldPromptFocusReflection(focusSeconds: number): boolean {
  return focusSeconds >= MIN_FOCUS_REFLECTION_SECONDS;
}

export async function saveFocusReflectionEntry(content: string): Promise<void> {
  const { fetchTodayReflection, saveReflection } = await import(
    "@/lib/reflection-storage"
  );

  const reflection = await fetchTodayReflection();
  const entries = reflection?.custom_entries ?? [];
  const exists = entries.some(
    (entry) => entry.title === FOCUS_REFLECTION_ENTRY_TITLE
  );
  const nextEntries = exists
    ? entries.map((entry) =>
        entry.title === FOCUS_REFLECTION_ENTRY_TITLE
          ? { ...entry, content }
          : entry
      )
    : [
        ...entries,
        {
          id: crypto.randomUUID(),
          title: FOCUS_REFLECTION_ENTRY_TITLE,
          content,
        },
      ];

  await saveReflection({
    went_well: reflection?.went_well ?? "",
    went_wrong: reflection?.went_wrong ?? "",
    custom_entries: nextEntries,
    custom_kanbans: reflection?.custom_kanbans ?? [],
  });
}
