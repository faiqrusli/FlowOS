"use client";

import { useCallback, useEffect, useRef, useState } from "react";

// Focus engine — the design decision for how focus actually behaves.
//
// States:
//   idle     — no session, timer at 0
//   running  — counting focus seconds against the active target
//   paused   — session held; elapsed preserved, nothing accrues
//   break    — counting break seconds; focus is paused
//
// Rules resolved from the brief:
//   - Only ONE target can be in focus at a time.
//   - Focus seconds accrue to whatever target is "Now" while running.
//   - Dragging a task to Focus ARMS it as Now; it does not auto-start
//     (except when a session is already running — then it swaps live).
//   - "Done" finishes the current target, banks its time, and (by our
//     decision) auto-promotes the next queue item into Now but leaves
//     the timer running so momentum is never lost. The user can disable
//     auto-advance; then it waits on Start.

export type FocusMode = "idle" | "running" | "paused" | "break";

export type FocusEngine = {
  mode: FocusMode;
  /** seconds focused in the CURRENT session (resets on stop) */
  sessionFocusSec: number;
  /** seconds on break in the current session */
  sessionBreakSec: number;
  /** cumulative focus seconds today across sessions */
  todayFocusSec: number;
  todayBreakSec: number;
  /** the id of the target currently accruing time */
  activeId: string | null;
  autoAdvance: boolean;
  setAutoAdvance: (v: boolean) => void;
  start: (targetId: string | null) => void;
  pause: () => void;
  resume: () => void;
  takeBreak: () => void;
  endBreak: () => void;
  stop: () => void;
  /** swap the live target without interrupting the timer */
  setActive: (targetId: string | null) => void;
  /** called every tick with the id + seconds to bank onto that target */
  onTick?: (targetId: string, deltaSec: number) => void;
};

export function useFocusEngine(
  onTick?: (targetId: string, deltaSec: number) => void,
): FocusEngine {
  const [mode, setMode] = useState<FocusMode>("idle");
  const [sessionFocusSec, setSessionFocusSec] = useState(0);
  const [sessionBreakSec, setSessionBreakSec] = useState(0);
  const [todayFocusSec, setTodayFocusSec] = useState(2 * 3600 + 15 * 60);
  const [todayBreakSec, setTodayBreakSec] = useState(22 * 60);
  const [activeId, setActiveId] = useState<string | null>(null);
  const [autoAdvance, setAutoAdvance] = useState(true);

  const activeRef = useRef(activeId);
  const onTickRef = useRef(onTick);
  useEffect(() => {
    activeRef.current = activeId;
    onTickRef.current = onTick;
  }, [activeId, onTick]);

  useEffect(() => {
    if (mode !== "running" && mode !== "break") return;
    const timer = window.setInterval(() => {
      if (mode === "running") {
        setSessionFocusSec((s) => s + 1);
        setTodayFocusSec((s) => s + 1);
        if (activeRef.current) onTickRef.current?.(activeRef.current, 1);
      } else {
        setSessionBreakSec((s) => s + 1);
        setTodayBreakSec((s) => s + 1);
      }
    }, 1000);
    return () => window.clearInterval(timer);
  }, [mode]);

  const start = useCallback((targetId: string | null) => {
    setActiveId(targetId);
    setSessionFocusSec(0);
    setSessionBreakSec(0);
    setMode("running");
  }, []);

  const pause = useCallback(() => setMode("paused"), []);
  const resume = useCallback(() => setMode("running"), []);
  const takeBreak = useCallback(() => setMode("break"), []);
  const endBreak = useCallback(() => setMode("running"), []);
  const stop = useCallback(() => {
    setMode("idle");
    setSessionFocusSec(0);
    setSessionBreakSec(0);
  }, []);
  const setActive = useCallback((targetId: string | null) => {
    setActiveId(targetId);
  }, []);

  return {
    mode,
    sessionFocusSec,
    sessionBreakSec,
    todayFocusSec,
    todayBreakSec,
    activeId,
    autoAdvance,
    setAutoAdvance,
    start,
    pause,
    resume,
    takeBreak,
    endBreak,
    stop,
    setActive,
  };
}
