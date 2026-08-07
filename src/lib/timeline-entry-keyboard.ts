export type TimelineEntryKeyboardEvent = {
  key: string;
  target: EventTarget | null;
  currentTarget: EventTarget | null;
  preventDefault: () => void;
};

export function activateTimelineEntryFromKeyboard(
  event: TimelineEntryKeyboardEvent,
  onSelect: () => void,
): boolean {
  if (event.target !== event.currentTarget) return false;
  if (event.key !== "Enter" && event.key !== " ") return false;
  event.preventDefault();
  onSelect();
  return true;
}
