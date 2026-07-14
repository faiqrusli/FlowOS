export const SIDEBAR_LAYOUT_MS = 180;
export const SIDEBAR_LAYOUT_EASE = "cubic-bezier(0.22, 1, 0.36, 1)";

export function sidebarWidthTransitionStyle(): string {
  return `width ${SIDEBAR_LAYOUT_MS}ms ${SIDEBAR_LAYOUT_EASE}`;
}

export function sidebarNavGeometryTransitionClass(): string {
  return `transition-[height,width,margin,padding] duration-[180ms] ease-[cubic-bezier(0.22,1,0.36,1)]`;
}
