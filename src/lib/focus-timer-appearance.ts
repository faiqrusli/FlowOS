/** Focus hero palette — ring accents; surfaces use design tokens. */
export const FOCUS_TIMER_COLORS = {
  ringTrack: "color-mix(in oklch, var(--border) 55%, var(--foreground) 12%)",
  ringProgress: "#4f6ef7",
  ringProgressDeep: "#3d5ad4",
  ringDot: "#6b8fff",
  labelFocus: "var(--accent-text)",
} as const;

export function getFocusRingTrackColor(lap: number): string {
  if (lap === 0) return FOCUS_TIMER_COLORS.ringTrack;
  const lift = Math.min(0.38, 0.12 + lap * 0.09);
  return `color-mix(in srgb, ${FOCUS_TIMER_COLORS.ringTrack} ${Math.round((1 - lift) * 100)}%, ${FOCUS_TIMER_COLORS.ringDot})`;
}

export function getFocusRingProgressColor(isDeepLap: boolean): string {
  return isDeepLap ? FOCUS_TIMER_COLORS.ringProgressDeep : FOCUS_TIMER_COLORS.ringProgress;
}
