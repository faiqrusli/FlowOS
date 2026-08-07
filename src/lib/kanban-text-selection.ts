const MIRROR_STYLE_KEYS = [
  "boxSizing",
  "width",
  "paddingTop",
  "paddingRight",
  "paddingBottom",
  "paddingLeft",
  "borderTopWidth",
  "borderLeftWidth",
  "fontStyle",
  "fontVariant",
  "fontWeight",
  "fontStretch",
  "fontSize",
  "lineHeight",
  "fontFamily",
  "letterSpacing",
  "wordSpacing",
  "tabSize",
  "whiteSpace",
  "wordBreak",
  "overflowWrap",
] as const;

function copyFieldMirrorStyles(
  field: HTMLInputElement | HTMLTextAreaElement,
  mirror: HTMLDivElement,
) {
  const style = window.getComputedStyle(field);
  for (const key of MIRROR_STYLE_KEYS) {
    mirror.style[key] = style[key];
  }
  mirror.style.position = "absolute";
  mirror.style.visibility = "hidden";
  mirror.style.pointerEvents = "none";
  mirror.style.left = "-9999px";
  mirror.style.top = "0";
  mirror.style.height = "auto";
  mirror.style.overflow = "hidden";
  mirror.style.whiteSpace = "pre-wrap";
  mirror.style.wordBreak = "break-word";
  mirror.style.overflowWrap = "break-word";
  mirror.style.width = `${field.clientWidth}px`;
}

export function focusInputAtEnd(input: HTMLInputElement) {
  input.focus();
  const end = input.value.length;
  input.setSelectionRange(end, end);
}

export function focusTextareaAtEnd(textarea: HTMLTextAreaElement) {
  textarea.focus();
  const end = textarea.value.length;
  textarea.setSelectionRange(end, end);
}

export function getInputCaretIndexFromPoint(
  input: HTMLInputElement,
  clientX: number
): number {
  const text = input.value;
  if (!text.length) return 0;

  const rect = input.getBoundingClientRect();
  const style = window.getComputedStyle(input);
  const paddingLeft = parseFloat(style.paddingLeft) || 0;
  const borderLeft = parseFloat(style.borderLeftWidth) || 0;
  const targetX = clientX - rect.left - paddingLeft - borderLeft;

  const canvas = document.createElement("canvas");
  const ctx = canvas.getContext("2d");
  if (!ctx) return text.length;

  ctx.font = [
    style.fontStyle,
    style.fontVariant,
    style.fontWeight,
    style.fontStretch,
    `${style.fontSize}/${style.lineHeight}`,
    style.fontFamily,
  ]
    .filter(Boolean)
    .join(" ");

  let index = 0;
  for (let i = 1; i <= text.length; i += 1) {
    if (ctx.measureText(text.slice(0, i)).width > targetX) break;
    index = i;
  }
  return index;
}

export function focusInputAtPoint(
  input: HTMLInputElement,
  clientX: number,
) {
  input.focus();
  const index = getInputCaretIndexFromPoint(input, clientX);
  input.setSelectionRange(index, index);
}

function measureTextareaCaretPosition(
  mirror: HTMLDivElement,
  text: string,
  index: number,
): { top: number; left: number } {
  mirror.textContent = text.slice(0, index);
  const marker = document.createElement("span");
  marker.textContent = text[index] || ".";
  mirror.appendChild(marker);
  const pos = {
    top: marker.offsetTop,
    left: marker.offsetLeft + marker.offsetWidth / 2,
  };
  marker.remove();
  return pos;
}

export function getTextareaCaretIndexFromPoint(
  textarea: HTMLTextAreaElement,
  clientX: number,
  clientY: number,
): number {
  const text = textarea.value;
  if (!text.length) return 0;

  const rect = textarea.getBoundingClientRect();
  const style = window.getComputedStyle(textarea);
  const borderTop = parseFloat(style.borderTopWidth) || 0;
  const borderLeft = parseFloat(style.borderLeftWidth) || 0;
  const paddingTop = parseFloat(style.paddingTop) || 0;
  const paddingLeft = parseFloat(style.paddingLeft) || 0;
  const targetX = clientX - rect.left - borderLeft - paddingLeft;
  const targetY =
    clientY - rect.top - borderTop - paddingTop + textarea.scrollTop;

  const mirror = document.createElement("div");
  copyFieldMirrorStyles(textarea, mirror);
  document.body.appendChild(mirror);

  let bestIndex = text.length;
  let bestDistance = Infinity;

  for (let index = 0; index <= text.length; index += 1) {
    const pos = measureTextareaCaretPosition(mirror, text, index);
    const distance =
      (pos.top - targetY) * (pos.top - targetY) +
      (pos.left - targetX) * (pos.left - targetX);
    if (distance < bestDistance) {
      bestDistance = distance;
      bestIndex = index;
    }
  }

  mirror.remove();
  return bestIndex;
}

export function focusTextareaAtPoint(
  textarea: HTMLTextAreaElement,
  clientX: number,
  clientY: number,
) {
  textarea.focus();
  const index = getTextareaCaretIndexFromPoint(textarea, clientX, clientY);
  textarea.setSelectionRange(index, index);
}

/** @deprecated Use focusTextareaAtPoint — caret at point, not word selection. */
export function focusTextareaWithWordAtPoint(
  textarea: HTMLTextAreaElement,
  clientX: number,
  clientY: number,
) {
  focusTextareaAtPoint(textarea, clientX, clientY);
}
