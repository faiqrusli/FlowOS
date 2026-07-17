export const PANEL_LAYOUT_MS = 220;
export const PANEL_LAYOUT_EASE = "cubic-bezier(0.22, 1, 0.36, 1)";

export function panelWidthTransitionStyle(): string {
  return `width ${PANEL_LAYOUT_MS}ms ${PANEL_LAYOUT_EASE}`;
}

export function panelSlideTransitionStyle(): string {
  return `transform ${PANEL_LAYOUT_MS}ms ${PANEL_LAYOUT_EASE}, opacity ${PANEL_LAYOUT_MS}ms ${PANEL_LAYOUT_EASE}`;
}
