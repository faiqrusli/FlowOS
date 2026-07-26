/**
 * Typewriter bottom pad + edge-gap caret settle for notes / kanban typing.
 */

import { useLayoutEffect, type RefObject } from "react";

/** Only nudge scroll when caret is this close to the top or bottom edge. */
const CARET_EDGE_GAP_PX = 128;

const MIRROR_STYLE_KEYS = [
  "boxSizing",
  "width",
  "paddingTop",
  "paddingRight",
  "paddingBottom",
  "paddingLeft",
  "borderTopWidth",
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

function applyTypewriterBottomPad(el: HTMLElement): () => void {
  const sync = () => {
    el.style.paddingBottom = `${Math.max(0, Math.round(el.clientHeight / 2))}px`;
  };
  sync();
  const ro = new ResizeObserver(sync);
  ro.observe(el);
  return () => {
    ro.disconnect();
    el.style.paddingBottom = "";
  };
}

/** Half-height bottom pad on a scrollport (notes letter). */
export function useTypewriterBottomPad(
  ref: RefObject<HTMLElement | null>,
  enabled: boolean,
) {
  useLayoutEffect(() => {
    if (!enabled) return;
    const el = ref.current;
    if (!el) return;
    return applyTypewriterBottomPad(el);
  }, [enabled, ref]);
}

/** Half-height bottom pad while a kanban column is being edited. */
export function syncTypewriterBottomPad(
  el: HTMLElement,
  enabled: boolean,
): () => void {
  if (!enabled) {
    el.style.paddingBottom = "";
    return () => {};
  }
  return applyTypewriterBottomPad(el);
}

function estimateTextareaCaretY(el: HTMLTextAreaElement): number {
  const style = getComputedStyle(el);
  const mirror = document.createElement("div");

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
  mirror.style.overflowWrap = "break-word";
  mirror.style.width = `${el.clientWidth}px`;

  const marker = document.createElement("span");
  marker.textContent = "\u200b";
  mirror.textContent = el.value.slice(0, el.selectionStart);
  mirror.appendChild(marker);
  document.body.appendChild(mirror);

  const caretY = marker.offsetTop + (parseFloat(style.borderTopWidth) || 0);
  mirror.remove();
  return caretY;
}

function findVerticalScrollParent(el: HTMLElement): HTMLElement | null {
  let node: HTMLElement | null = el.parentElement;
  while (node && node !== document.body) {
    const style = getComputedStyle(node);
    const oy = style.overflowY;
    if (
      (oy === "auto" || oy === "scroll" || oy === "overlay") &&
      node.scrollHeight > node.clientHeight + 1
    ) {
      return node;
    }
    node = node.parentElement;
  }
  return null;
}

/**
 * Keep caret out of the bottom edge while typing, and out of the top edge
 * while backspacing. Notes textarea scrolls itself; kanban scrolls its column.
 */
export function settleTextareaCaret(
  el: HTMLTextAreaElement,
  key: string | null,
) {
  const caretY = estimateTextareaCaretY(el);
  const scroller =
    el.scrollHeight > el.clientHeight + 1
      ? el
      : findVerticalScrollParent(el);
  if (!scroller) return;

  const caretInView =
    scroller === el
      ? caretY - el.scrollTop
      : el.getBoundingClientRect().top +
        caretY -
        scroller.getBoundingClientRect().top;

  const viewH = scroller.clientHeight;
  const maxScroll = Math.max(0, scroller.scrollHeight - viewH);
  const isDelete = key === "Backspace" || key === "Delete";

  if (isDelete) {
    if (caretInView < CARET_EDGE_GAP_PX && scroller.scrollTop > 0) {
      scroller.scrollTop = Math.max(
        0,
        scroller.scrollTop + (caretInView - CARET_EDGE_GAP_PX),
      );
    }
    return;
  }

  if (scroller.scrollTop > maxScroll) {
    scroller.scrollTop = maxScroll;
  }

  if (caretInView > viewH - CARET_EDGE_GAP_PX) {
    scroller.scrollTop = Math.max(
      0,
      Math.min(
        maxScroll,
        scroller.scrollTop + (caretInView - (viewH - CARET_EDGE_GAP_PX)),
      ),
    );
  }
}
