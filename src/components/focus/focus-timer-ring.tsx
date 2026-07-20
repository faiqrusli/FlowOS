"use client";

import {
  getFocusRingPoint,
  getFocusRingVisualState,
} from "@/lib/focus-timer-ring";
import {
  FOCUS_TIMER_COLORS,
  getFocusRingProgressColor,
  getFocusRingTrackColor,
} from "@/lib/focus-timer-appearance";
import { cn } from "@/lib/utils";

export const FOCUS_TIMER_RING_SIZE = 188;
/** Compact ring for the workplace dashboard focus card. */
export const WORKPLACE_FOCUS_TIMER_RING_SIZE = 148;

function getRingMetrics(size: number) {
  const scale = size / FOCUS_TIMER_RING_SIZE;
  const trackStroke = 3.5 * scale;
  const progressStroke = 5.5 * scale;
  const progressDotRadius = 4 * scale;
  const radius = (size - progressStroke) / 2;
  const center = size / 2;
  const circumference = 2 * Math.PI * radius;
  return {
    trackStrokeWidth: trackStroke,
    progressStrokeWidth: progressStroke,
    progressDotRadius,
    radius,
    center,
    circumference,
  };
}

type FocusTimerRingProps = {
  clock: string;
  focusSeconds: number;
  isActive: boolean;
  statusLabel: string;
  statusTone?: "focus" | "break" | "muted";
  size?: number;
  className?: string;
  children?: React.ReactNode;
};

export function FocusTimerRing({
  clock,
  focusSeconds,
  isActive,
  statusLabel,
  statusTone = "focus",
  size = FOCUS_TIMER_RING_SIZE,
  className,
  children,
}: FocusTimerRingProps) {
  const {
    trackStrokeWidth,
    progressStrokeWidth,
    progressDotRadius,
    radius,
    center,
    circumference,
  } = getRingMetrics(size);
  const compact = size < FOCUS_TIMER_RING_SIZE;
  const ring = getFocusRingVisualState(focusSeconds);
  const dashOffset = circumference * (1 - ring.progress);
  const dot = getFocusRingPoint(center, radius, ring.progress);
  const trackColor = getFocusRingTrackColor(ring.lap);
  const progressColor = getFocusRingProgressColor(ring.isDeepLap);

  return (
    <div
      className={cn(
        "relative inline-flex items-center justify-center",
        className,
      )}
      style={{ width: size, height: size }}
    >
      <svg
        width={size}
        height={size}
        viewBox={`0 0 ${size} ${size}`}
        className="absolute inset-0"
        aria-hidden
      >
        <circle
          cx={center}
          cy={center}
          r={radius}
          fill="none"
          stroke={trackColor}
          strokeWidth={trackStrokeWidth}
        />
        {isActive && ring.progress > 0 ? (
          <circle
            cx={center}
            cy={center}
            r={radius}
            fill="none"
            stroke={progressColor}
            strokeWidth={progressStrokeWidth}
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={dashOffset}
            transform={`rotate(-90 ${center} ${center})`}
            className="transition-[stroke-dashoffset] duration-1000 ease-linear"
          />
        ) : null}
        {isActive ? (
          <circle
            cx={dot.x}
            cy={dot.y}
            r={progressDotRadius}
            fill={FOCUS_TIMER_COLORS.ringDot}
            className="transition-[cx,cy] duration-1000 ease-linear"
          />
        ) : null}
      </svg>

      <div
        className={cn(
          "relative z-[1] flex flex-col items-center justify-center text-center transition-opacity duration-200",
          compact ? "px-2" : "px-4",
          "group-hover/timer:pointer-events-none group-hover/timer:opacity-0",
        )}
      >
        <p
          className={cn(
            "font-mono font-semibold leading-none tabular-nums tracking-tight",
            compact ? "text-[2rem]" : "text-[2.65rem]",
            isActive ? "text-white" : "text-white/35",
          )}
        >
          {clock}
        </p>
        {statusLabel ? (
          <p
            className={cn(
              "font-semibold uppercase tracking-[0.22em]",
              compact ? "mt-1 text-[10px]" : "mt-2 text-[11px]",
              statusTone === "break" && "text-warning",
              statusTone === "muted" && "text-muted-foreground",
            )}
            style={
              statusTone === "focus"
                ? { color: FOCUS_TIMER_COLORS.labelFocus }
                : undefined
            }
          >
            {statusLabel}
          </p>
        ) : null}
        {children ? (
          <div className={compact ? "mt-2" : "mt-3"}>{children}</div>
        ) : null}
      </div>
    </div>
  );
}
