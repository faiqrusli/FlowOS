"use client";

import { useDroppable } from "@dnd-kit/core";
import {
  Check,
  Coffee,
  Pause,
  Play,
  SkipForward,
  Square,
  Timer,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import {
  formatClock,
  formatDurationShort,
  type PlanTask,
} from "@/components/fable5/data";
import type { FocusEngine } from "@/components/fable5/use-focus-engine";

type DragState = "idle" | "valid" | "invalid";

type FableFocusCardProps = {
  engine: FocusEngine;
  nowTask: PlanTask | null;
  nextTask: PlanTask | null;
  clock: string;
  dragState: DragState;
  completingId: string | null;
  onStart: () => void;
  onDone: (task: PlanTask) => void;
  onSkip: () => void;
  compact?: boolean;
};

/** The ring shows progress of the CURRENT target against its estimate. */
function ProgressRing({ pct, mode }: { pct: number; mode: FocusEngine["mode"] }) {
  const r = 52;
  const c = 2 * Math.PI * r;
  const dash = Math.min(1, pct) * c;
  const stroke =
    mode === "break"
      ? "var(--warning)"
      : mode === "paused"
        ? "var(--muted-foreground)"
        : "var(--primary)";
  return (
    <svg
      viewBox="0 0 120 120"
      className="pointer-events-none absolute inset-0 h-full w-full -rotate-90"
      aria-hidden
    >
      <circle
        cx="60"
        cy="60"
        r={r}
        fill="none"
        stroke="var(--border)"
        strokeWidth="4"
      />
      <circle
        cx="60"
        cy="60"
        r={r}
        fill="none"
        stroke={stroke}
        strokeWidth="4"
        strokeLinecap="round"
        strokeDasharray={`${dash} ${c}`}
        style={{ transition: "stroke-dasharray 0.6s var(--ease-premium)" }}
      />
    </svg>
  );
}

export function FableFocusCard({
  engine,
  nowTask,
  nextTask,
  clock,
  dragState,
  completingId,
  onStart,
  onDone,
  onSkip,
  compact = false,
}: FableFocusCardProps) {
  const { setNodeRef } = useDroppable({ id: "focus-dropzone" });
  const running = engine.mode === "running";
  const paused = engine.mode === "paused";
  const onBreak = engine.mode === "break";
  const active = running || paused || onBreak;

  const estimateSec = (nowTask?.estimateMin ?? 25) * 60;
  const bankedSec = nowTask?.focusedSec ?? 0;
  const liveSec = engine.activeId === nowTask?.id ? engine.sessionFocusSec : 0;
  const trackedSec = bankedSec + liveSec;
  const pct = estimateSec > 0 ? trackedSec / estimateSec : 0;

  const bigClock = onBreak
    ? formatClock(engine.sessionBreakSec)
    : formatClock(engine.sessionFocusSec);

  return (
    <section
      ref={setNodeRef}
      className={cn(
        "flow-surface-raised relative flex min-h-0 flex-1 flex-col overflow-hidden transition-[border-color,background-color,box-shadow] duration-200",
        dragState === "valid" &&
          "border-primary/50 shadow-[0_0_0_3px_var(--selected)]",
        dragState === "invalid" && "border-warning/50 bg-warning-muted/40",
      )}
    >
      {/* header: focus/pomodoro + today stats + clock */}
      <div className="flex shrink-0 items-center justify-between gap-2 px-5 pt-4">
        <div className="flex items-center gap-2 text-muted-foreground">
          <Timer className="size-4" aria-hidden />
          <span className="text-[13px] font-medium uppercase tracking-wider">
            Focus
          </span>
        </div>
        <div className="flex items-center gap-5 text-[13px]">
          <div className="text-right">
            <p className="text-muted-foreground">Focused today</p>
            <p className="font-semibold tabular-nums text-foreground">
              {formatDurationShort(engine.todayFocusSec)}
            </p>
          </div>
          <div className="text-right">
            <p className="text-muted-foreground">Break</p>
            <p className="font-semibold tabular-nums text-foreground">
              {formatDurationShort(engine.todayBreakSec)}
            </p>
          </div>
        </div>
      </div>

      {/* hero timer */}
      <div className="flex min-h-0 flex-1 flex-col items-center justify-center gap-4 px-5 py-4">
        {dragState === "valid" ? (
          <p className="animate-task-drop-reveal text-[13px] font-medium text-primary">
            Drop to focus on this now
          </p>
        ) : null}

        <div
          className={cn(
            "group/timer relative grid place-items-center",
            compact ? "size-40" : "size-52",
          )}
        >
          <ProgressRing pct={pct} mode={engine.mode} />

          {/* time + label */}
          <div className="flex flex-col items-center gap-1 text-center transition-opacity duration-200 group-hover/timer:opacity-0">
            <span
              className={cn(
                "font-mono font-semibold tabular-nums tracking-tight text-foreground",
                compact ? "text-4xl" : "text-5xl",
              )}
            >
              {active ? bigClock : clock}
            </span>
            <span
              className={cn(
                "text-[12px] font-medium uppercase tracking-wider",
                onBreak
                  ? "text-warning"
                  : paused
                    ? "text-muted-foreground"
                    : running
                      ? "text-primary"
                      : "text-muted-foreground",
              )}
            >
              {onBreak
                ? "On break"
                : paused
                  ? "Paused"
                  : running
                    ? "In focus"
                    : "Ready"}
            </span>
          </div>

          {/* hover controls — kept OFF the clock so time stays readable */}
          <div
            className={cn(
              "absolute inset-0 grid place-items-center rounded-full bg-surface-dialog/85 opacity-0 backdrop-blur-sm transition-opacity duration-200",
              "pointer-events-none group-hover/timer:pointer-events-auto group-hover/timer:opacity-100",
              !active && "hidden",
            )}
          >
            <div className="flex items-center gap-2">
              {running ? (
                <Button size="icon-sm" variant="secondary" onClick={engine.pause} aria-label="Pause">
                  <Pause />
                </Button>
              ) : paused ? (
                <Button size="icon-sm" variant="default" onClick={engine.resume} aria-label="Resume">
                  <Play />
                </Button>
              ) : null}
              {onBreak ? (
                <Button size="icon-sm" variant="default" onClick={engine.endBreak} aria-label="End break">
                  <Play />
                </Button>
              ) : (
                <Button
                  size="icon-sm"
                  variant="secondary"
                  onClick={engine.takeBreak}
                  aria-label="Take a break"
                >
                  <Coffee />
                </Button>
              )}
              <Button
                size="icon-sm"
                variant="destructive"
                onClick={engine.stop}
                aria-label="Stop session"
              >
                <Square />
              </Button>
            </div>
          </div>
        </div>

        {/* NOW target */}
        {nowTask ? (
          <div
            className={cn(
              "w-full max-w-md rounded-xl border border-border bg-card/60 px-3.5 py-2.5 transition-all duration-500",
              completingId === nowTask.id &&
                "translate-y-1 scale-[0.98] opacity-0",
            )}
          >
            <div className="flex items-center gap-2">
              <span
                className="size-2 shrink-0 rounded-full"
                style={{ background: nowTask.group.color }}
                aria-hidden
              />
              <span className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
                Now
              </span>
              <span className="ml-auto text-[12px] tabular-nums text-muted-foreground">
                {formatDurationShort(trackedSec)} / {nowTask.estimateMin}m
              </span>
            </div>
            <p className="mt-1 truncate text-[15px] font-semibold text-foreground">
              {nowTask.title}
            </p>
          </div>
        ) : (
          <p className="max-w-xs text-center text-[13px] leading-relaxed text-muted-foreground">
            Drag a task or habit here, or press{" "}
            <span className="font-semibold text-foreground">Start</span> to
            focus on your top item.
          </p>
        )}

        {/* primary action row */}
        <div className="flex w-full max-w-md items-center gap-2">
          {!active ? (
            <Button size="lg" className="h-11 flex-1 text-[15px]" onClick={onStart}>
              <Play className="size-4" />
              Start focus
            </Button>
          ) : (
            <>
              <Button
                size="lg"
                variant="default"
                className="h-11 flex-1 text-[15px]"
                disabled={!nowTask}
                onClick={() => nowTask && onDone(nowTask)}
              >
                <Check className="size-4" />
                Done
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="h-11"
                onClick={onSkip}
                aria-label="Skip to next"
              >
                <SkipForward className="size-4" />
                Skip
              </Button>
            </>
          )}
        </div>

        {/* NEXT preview */}
        {nextTask ? (
          <div className="flex w-full max-w-md items-center gap-2 rounded-lg px-1 text-[13px] text-muted-foreground">
            <SkipForward className="size-3.5 shrink-0" aria-hidden />
            <span className="shrink-0 font-medium uppercase tracking-wider text-[11px]">
              Next
            </span>
            <span className="truncate text-foreground/80">{nextTask.title}</span>
            <span className="ml-auto shrink-0 tabular-nums">
              {nextTask.estimateMin}m
            </span>
          </div>
        ) : null}
      </div>
    </section>
  );
}
