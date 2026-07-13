/** Focus hero palette — ring accents from v3 primary tokens; no hardcoded hex. */
export const FOCUS_TIMER_COLORS = {
  ringTrack: "color-mix(in oklab, var(--border-subtle) 55%, var(--text-primary) 12%)",
  ringProgress: "var(--primary)",
  ringProgressDeep: "color-mix(in oklab, var(--primary) 78%, black 22%)",
  ringDot: "color-mix(in oklab, var(--primary) 70%, white 30%)",
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
