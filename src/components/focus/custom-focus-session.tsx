"use client";

import { useState } from "react";
import { ChevronDown, Pause, Play, Square } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";

type CustomFocusSessionProps = {
  clock: string;
  progress: number;
  mode: "focus" | "break";
  focusMinutes: number;
  breakMinutes: number;
  onFocusMinutesChange: (v: number) => void;
  onBreakMinutesChange: (v: number) => void;
  isIdle: boolean;
  isRunning: boolean;
  isPaused: boolean;
  disabled?: boolean;
  onStart: () => void;
  onPause: () => void;
  onResume: () => void;
  onStop: () => void;
};

export function CustomFocusSession({
  clock,
  progress,
  mode,
  focusMinutes,
  breakMinutes,
  onFocusMinutesChange,
  onBreakMinutesChange,
  isIdle,
  isRunning,
  isPaused,
  disabled,
  onStart,
  onPause,
  onResume,
  onStop,
}: CustomFocusSessionProps) {
  const [open, setOpen] = useState(false);

  return (
    <div className="rounded-xl border border-neutral-200 bg-neutral-50/50">
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="flex w-full items-center justify-between px-5 py-4 text-left"
      >
        <span className="text-sm font-medium text-neutral-900">
          Custom focus session
        </span>
        <ChevronDown
          className={cn(
            "size-4 text-muted-foreground transition-transform",
            open && "rotate-180"
          )}
        />
      </button>

      {open && (
        <div className="space-y-4 border-t border-neutral-200 px-5 pb-5 pt-4">
          <p className="text-xs text-muted-foreground">
            Pomodoro-style countdown. Optional — quick focus above is the default.
          </p>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="pomodoro-focus">Focus duration (min)</Label>
              <Input
                id="pomodoro-focus"
                type="number"
                min={1}
                max={180}
                value={focusMinutes}
                disabled={disabled || !isIdle}
                onChange={(e) =>
                  onFocusMinutesChange(Math.max(1, Number(e.target.value) || 1))
                }
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="pomodoro-break">Break duration (min)</Label>
              <Input
                id="pomodoro-break"
                type="number"
                min={1}
                max={60}
                value={breakMinutes}
                disabled={disabled || !isIdle}
                onChange={(e) =>
                  onBreakMinutesChange(Math.max(1, Number(e.target.value) || 1))
                }
              />
            </div>
          </div>

          {!isIdle && (
            <div className="space-y-2">
              <p className="text-center font-mono text-3xl font-semibold tabular-nums">
                {clock}
              </p>
              <div className="[&_[data-slot=progress-track]]:h-1.5">
                <Progress
                  value={progress}
                  className={cn(
                    "w-full",
                    mode === "break" &&
                      "[&_[data-slot=progress-indicator]]:bg-amber-500"
                  )}
                />
              </div>
            </div>
          )}

          <div className="flex flex-wrap gap-2">
            {isIdle && (
              <Button
                onClick={onStart}
                disabled={disabled}
                className="rounded-full bg-neutral-800 text-white hover:bg-neutral-700"
              >
                <Play className="size-4" data-icon="inline-start" />
                Start Pomodoro
              </Button>
            )}
            {isRunning && (
              <Button variant="outline" onClick={onPause}>
                <Pause className="size-4" data-icon="inline-start" />
                Pause
              </Button>
            )}
            {isPaused && (
              <Button
                onClick={onResume}
                className="rounded-full bg-neutral-800 text-white hover:bg-neutral-700"
              >
                <Play className="size-4" data-icon="inline-start" />
                Resume
              </Button>
            )}
            {!isIdle && (
              <Button variant="outline" onClick={onStop}>
                <Square className="size-4" data-icon="inline-start" />
                Stop
              </Button>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
