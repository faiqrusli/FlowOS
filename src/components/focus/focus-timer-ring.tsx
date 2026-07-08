"use client";

import { getFocusRingPoint, getFocusRingVisualState } from "@/lib/focus-timer-ring";
import {
  FOCUS_TIMER_COLORS,
  getFocusRingProgressColor,
  getFocusRingTrackColor,
} from "@/lib/focus-timer-appearance";
import { cn } from "@/lib/utils";

export const FOCUS_TIMER_RING_SIZE = 188;
const RING_SIZE = FOCUS_TIMER_RING_SIZE;
const TRACK_STROKE = 3.5;
const PROGRESS_STROKE = 5.5;
const PROGRESS_DOT_RADIUS = 4;
const RADIUS = (RING_SIZE - PROGRESS_STROKE) / 2;
const CENTER = RING_SIZE / 2;
const CIRCUMFERENCE = 2 * Math.PI * RADIUS;

type FocusTimerRingProps = {
  clock: string;
  focusSeconds: number;
  isActive: boolean;
  statusLabel: string;
  statusTone?: "focus" | "break" | "muted";
  className?: string;
  children?: React.ReactNode;
};

export function FocusTimerRing({
  clock,
  focusSeconds,
  isActive,
  statusLabel,
  statusTone = "focus",
  className,
  children,
}: FocusTimerRingProps) {
  const ring = getFocusRingVisualState(focusSeconds);
  const dashOffset = CIRCUMFERENCE * (1 - ring.progress);
  const dot = getFocusRingPoint(CENTER, RADIUS, ring.progress);
  const trackStroke = getFocusRingTrackColor(ring.lap);
  const progressStroke = getFocusRingProgressColor(ring.isDeepLap);

  return (
    <div
      className={cn("relative inline-flex items-center justify-center", className)}
      style={{ width: RING_SIZE, height: RING_SIZE }}
    >
      <svg
        width={RING_SIZE}
        height={RING_SIZE}
        viewBox={`0 0 ${RING_SIZE} ${RING_SIZE}`}
        className="absolute inset-0"
        aria-hidden
      >
        <circle
          cx={CENTER}
          cy={CENTER}
          r={RADIUS}
          fill="none"
          stroke={trackStroke}
          strokeWidth={TRACK_STROKE}
        />
        {isActive && ring.progress > 0 ? (
          <circle
            cx={CENTER}
            cy={CENTER}
            r={RADIUS}
            fill="none"
            stroke={progressStroke}
            strokeWidth={PROGRESS_STROKE}
            strokeLinecap="round"
            strokeDasharray={CIRCUMFERENCE}
            strokeDashoffset={dashOffset}
            transform={`rotate(-90 ${CENTER} ${CENTER})`}
            className="transition-[stroke-dashoffset] duration-1000 ease-linear"
          />
        ) : null}
        {isActive ? (
          <circle
            cx={dot.x}
            cy={dot.y}
            r={PROGRESS_DOT_RADIUS}
            fill={FOCUS_TIMER_COLORS.ringDot}
            className="transition-[cx,cy] duration-1000 ease-linear"
          />
        ) : null}
      </svg>

      <div
        className={cn(
          "relative z-[1] flex flex-col items-center justify-center px-4 text-center transition-opacity duration-200",
          "group-hover/timer:pointer-events-none group-hover/timer:opacity-0",
          "group-focus-within/timer:pointer-events-none group-focus-within/timer:opacity-0"
        )}
      >
        <p
          className={cn(
            "font-mono text-[2.65rem] font-semibold leading-none tabular-nums tracking-tight text-white",
            !isActive && "text-white/35"
          )}
        >
          {clock}
        </p>
        {statusLabel ? (
          <p
            className={cn(
              "mt-2 text-[11px] font-semibold uppercase tracking-[0.22em]",
              statusTone === "break" && "text-warning",
              statusTone === "muted" && "text-muted-foreground"
            )}
            style={
              statusTone === "focus" ? { color: FOCUS_TIMER_COLORS.labelFocus } : undefined
            }
          >
            {statusLabel}
          </p>
        ) : null}
        {children ? <div className="mt-3">{children}</div> : null}
      </div>
    </div>
  );
}
