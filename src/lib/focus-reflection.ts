/** Custom reflection entry title used for workplace focus notes. */
export const FOCUS_REFLECTION_ENTRY_TITLE = "Focus";

export function isFocusReflectionEntry(title: string): boolean {
  return title.trim().toLowerCase() === FOCUS_REFLECTION_ENTRY_TITLE.toLowerCase();
}
