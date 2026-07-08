/** Focus hero palette — reference tokens for workplace focus timer. */
export const FOCUS_TIMER_COLORS = {
  /** Matches `--surface-app` / `--surface-page` in globals.css (.dark). */
  page: "#11141f",
  surface: "#1a2035",
  ringTrack: "#2a3050",
  ringProgress: "#4f6ef7",
  ringProgressDeep: "#3d5ad4",
  ringDot: "#6b8fff",
  labelFocus: "#4f6ef7",
} as const;

export function getFocusRingTrackColor(lap: number): string {
  if (lap === 0) return FOCUS_TIMER_COLORS.ringTrack;
  const lift = Math.min(0.38, 0.12 + lap * 0.09);
  return `color-mix(in srgb, ${FOCUS_TIMER_COLORS.ringTrack} ${Math.round((1 - lift) * 100)}%, ${FOCUS_TIMER_COLORS.ringDot})`;
}

export function getFocusRingProgressColor(isDeepLap: boolean): string {
  return isDeepLap ? FOCUS_TIMER_COLORS.ringProgressDeep : FOCUS_TIMER_COLORS.ringProgress;
}
