import { expandToWordBoundaries } from "@/lib/kanban-card-pointer-gesture";

export function focusTextareaAtEnd(textarea: HTMLTextAreaElement) {
  textarea.focus();
  const end = textarea.value.length;
  textarea.setSelectionRange(end, end);
}

export function focusTextareaWithWordAtPoint(
  textarea: HTMLTextAreaElement,
  clientX: number,
  clientY: number
) {
  textarea.focus();

  const doc = document as Document & {
    caretRangeFromPoint?: (x: number, y: number) => Range | null;
    caretPositionFromPoint?: (
      x: number,
      y: number
    ) => { offsetNode: Node; offset: number } | null;
  };

  let index = textarea.value.length;

  const range = doc.caretRangeFromPoint?.(clientX, clientY);
  if (range?.startContainer === textarea.firstChild) {
    index = range.startOffset;
  } else if (range?.startContainer === textarea) {
    index = range.startOffset;
  } else {
    const caret = doc.caretPositionFromPoint?.(clientX, clientY);
    if (caret?.offsetNode === textarea.firstChild) {
      index = caret.offset;
    } else if (caret?.offsetNode === textarea) {
      index = caret.offset;
    }
  }

  const [start, end] = expandToWordBoundaries(textarea.value, index);
  textarea.setSelectionRange(start, end);
}
