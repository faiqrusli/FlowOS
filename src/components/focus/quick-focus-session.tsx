"use client";

import { Coffee, Pause, Play, Square } from "lucide-react";
import { Button } from "@/components/ui/button";
import { formatDuration } from "@/lib/focus-utils";
import { cn } from "@/lib/utils";

type QuickFocusSessionProps = {
  clock: string;
  statusLabel: string;
  isIdle: boolean;
  isOnBreak: boolean;
  isPaused: boolean;
  isFocusing: boolean;
  currentFocusSeconds: number;
  currentBreakSeconds: number;
  onStartFocus: () => void;
  onPause: () => void;
  onResume: () => void;
  onBreak: () => void;
  onResumeFocus: () => void;
  onStop: () => void;
  startDisabled?: boolean;
};

export function QuickFocusSession({
  clock,
  statusLabel,
  isIdle,
  isOnBreak,
  isPaused,
  isFocusing,
  currentFocusSeconds,
  currentBreakSeconds,
  onStartFocus,
  onPause,
  onResume,
  onBreak,
  onResumeFocus,
  onStop,
  startDisabled = false,
}: QuickFocusSessionProps) {
  return (
    <section className="flex flex-col items-center rounded-2xl border border-border/50 bg-card px-6 py-12 shadow-sm sm:py-16">
      {!isIdle && (
        <p className="mb-2 text-sm font-medium text-muted-foreground">
          {statusLabel}
        </p>
      )}

      {isIdle ? (
        <div className="flex w-full max-w-md flex-col items-center gap-8 py-8">
          <p className="text-center text-sm text-muted-foreground">
            {startDisabled
              ? "Finish or stop the Pomodoro session below first."
              : "One tap. No setup. Just work."}
          </p>
          <Button
            onClick={onStartFocus}
            disabled={startDisabled}
            size="lg"
            className="h-16 w-full max-w-xs rounded-full text-lg"
          >
            <Play className="size-6" data-icon="inline-start" />
            Start Focus
          </Button>
        </div>
      ) : (
        <>
          <p
            className={cn(
              "font-mono text-7xl font-bold tabular-nums tracking-tight sm:text-8xl",
              isOnBreak ? "text-amber-600" : "text-foreground"
            )}
          >
            {clock}
          </p>

          {(currentFocusSeconds > 0 || currentBreakSeconds > 0) && (
            <div className="mt-4 flex flex-wrap justify-center gap-4 text-xs text-muted-foreground">
              {currentFocusSeconds > 0 && (
                <span>Focus recorded: {formatDuration(currentFocusSeconds)}</span>
              )}
              {currentBreakSeconds > 0 && (
                <span>Break: {formatDuration(currentBreakSeconds)}</span>
              )}
            </div>
          )}

          <div className="mt-10 flex flex-wrap justify-center gap-2">
            {isFocusing && (
              <>
                {isPaused ? (
                  <Button
                    onClick={onResume}
                    className="rounded-full px-6"
                  >
                    <Play className="size-4" data-icon="inline-start" />
                    Resume
                  </Button>
                ) : (
                  <Button variant="outline" onClick={onPause} className="px-6">
                    <Pause className="size-4" data-icon="inline-start" />
                    Pause
                  </Button>
                )}
                <Button
                  variant="outline"
                  onClick={onBreak}
                  className="gap-1 px-6"
                >
                  <Coffee className="size-4" />
                  Break
                </Button>
                <Button variant="outline" onClick={onStop} className="px-6">
                  <Square className="size-4" data-icon="inline-start" />
                  Stop
                </Button>
              </>
            )}

            {isOnBreak && (
              <>
                {isPaused ? (
                  <Button
                    variant="outline"
                    onClick={onResume}
                    className="px-6"
                  >
                    Resume break
                  </Button>
                ) : null}
                <Button
                  onClick={onResumeFocus}
                  className="rounded-full px-6"
                >
                  <Play className="size-4" data-icon="inline-start" />
                  Resume Focus
                </Button>
                <Button variant="outline" onClick={onStop} className="px-6">
                  <Square className="size-4" data-icon="inline-start" />
                  Stop session
                </Button>
              </>
            )}
          </div>
        </>
      )}
    </section>
  );
}
