/** One full ring lap = 60 minutes of accumulated focus time. */
export const FOCUS_RING_LAP_SECONDS = 60 * 60;

const BASE_TRACK_OPACITY = 0.24;
const TRACK_OPACITY_LAP_STEP = 0.09;

export type FocusRingVisualState = {
  lap: number;
  /** 0–1 progress within the current 60-minute lap. */
  progress: number;
  trackOpacity: number;
  isDeepLap: boolean;
};

export function getFocusRingVisualState(focusSeconds: number): FocusRingVisualState {
  const safe = Math.max(0, Math.floor(focusSeconds));
  const lap = Math.floor(safe / FOCUS_RING_LAP_SECONDS);
  const progress = (safe % FOCUS_RING_LAP_SECONDS) / FOCUS_RING_LAP_SECONDS;

  return {
    lap,
    progress,
    trackOpacity: BASE_TRACK_OPACITY + lap * TRACK_OPACITY_LAP_STEP,
    isDeepLap: lap > 0,
  };
}

/** Dot / arc endpoint on a circle starting from 12 o'clock, clockwise. */
export function getFocusRingPoint(
  center: number,
  radius: number,
  progress: number
): { x: number; y: number } {
  const angle = progress * Math.PI * 2 - Math.PI / 2;
  return {
    x: center + radius * Math.cos(angle),
    y: center + radius * Math.sin(angle),
  };
}
