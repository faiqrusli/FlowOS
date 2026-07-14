/** Utility panel open/close — quiet productivity motion. */
export const PANEL_LAYOUT_MS = 220;
export const PANEL_LAYOUT_EASE = "ease-out";

export function panelWidthTransitionStyle(): string {
  return `width ${PANEL_LAYOUT_MS}ms ${PANEL_LAYOUT_EASE}`;
}

export function panelSlideTransitionStyle(): string {
  return `width ${PANEL_LAYOUT_MS}ms ${PANEL_LAYOUT_EASE}, opacity ${Math.round(PANEL_LAYOUT_MS * 0.85)}ms ${PANEL_LAYOUT_EASE}`;
}

/** Layout spacer + drawer shell — keep workspace push in sync with panel width. */
export function panelShellTransitionStyle(): string {
  return `width ${PANEL_LAYOUT_MS}ms ${PANEL_LAYOUT_EASE}`;
}

/** Right drawer chrome — width, shadow, and border fade together. */
export function panelDrawerChromeTransitionStyle(): string {
  return `width ${PANEL_LAYOUT_MS}ms ${PANEL_LAYOUT_EASE}, box-shadow ${PANEL_LAYOUT_MS}ms ${PANEL_LAYOUT_EASE}, border-color ${PANEL_LAYOUT_MS}ms ${PANEL_LAYOUT_EASE}`;
}
