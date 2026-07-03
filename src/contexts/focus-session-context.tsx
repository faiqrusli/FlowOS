"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";
import {
  buildCompletedPayload,
  buildStopPayload,
  clearActiveSession,
  computeQuickFocusSeconds,
  createPomodoroSession,
  createQuickFocusSession,
  derivePomodoroPhase,
  deriveQuickPhase,
  formatPomodoroClock,
  formatQuickClock,
  getActiveSessionStatusLabel,
  getDashboardRemainingSeconds,
  getPomodoroPhaseTotalSeconds,
  getPomodoroRemainingSeconds,
  getSegmentElapsedSeconds,
  pauseSession,
  pomodoroCompleteFocusPhase,
  quickResumeFocus,
  quickStartBreak,
  readActiveSession,
  resumeSession,
  writeActiveSession,
  type StoredActiveFocusSession,
} from "@/lib/focus-active-session";
import { persistFocusSessionEnd } from "@/lib/focus-session-persist";
import {
  playAlertSound,
  showBrowserNotification,
} from "@/lib/focus-utils";
import type { FocusSession, FocusTargetType, PomodoroPhase, QuickFocusPhase } from "@/types/focus";

type DashboardActiveFocus = {
  isActive: boolean;
  label: string;
  statusLabel: string;
  remainingSeconds: number;
  mode: "focus" | "break";
  isPaused: boolean;
};

type FocusSessionContextValue = {
  tick: number;
  activeSession: StoredActiveFocusSession | null;
  lastSavedSession: FocusSession | null;
  notification: string | null;
  clearNotification: () => void;
  dashboardActive: DashboardActiveFocus;
  prepareFocusTarget: (
    target: { type: FocusTargetType; id: string; label?: string } | null
  ) => void;
  quick: {
    phase: QuickFocusPhase;
    clock: string;
    elapsed: number;
    currentFocusSeconds: number;
    currentBreakSeconds: number;
    statusLabel: string;
    isActive: boolean;
    isIdle: boolean;
    isOnBreak: boolean;
    isPaused: boolean;
    isFocusing: boolean;
    startFocus: () => void;
    pause: () => void;
    resume: () => void;
    startBreak: () => void;
    resumeFocus: () => void;
    stopSession: () => void;
  };
  pomodoro: {
    phase: PomodoroPhase;
    mode: "focus" | "break";
    focusMinutes: number;
    breakMinutes: number;
    setFocusMinutes: (minutes: number) => void;
    setBreakMinutes: (minutes: number) => void;
    clock: string;
    progress: number;
    isIdle: boolean;
    isRunning: boolean;
    isPaused: boolean;
    startPomodoro: () => void;
    pause: () => void;
    resume: () => void;
    stop: () => void;
  };
};

const FocusSessionContext = createContext<FocusSessionContextValue | null>(null);

function notifyUser(message: string, title: string) {
  playAlertSound();
  void showBrowserNotification(title, message);
}

export function FocusSessionProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<StoredActiveFocusSession | null>(null);
  const [tick, setTick] = useState(0);
  const [focusMinutes, setFocusMinutes] = useState(25);
  const [breakMinutes, setBreakMinutes] = useState(5);
  const [lastSavedSession, setLastSavedSession] = useState<FocusSession | null>(
    null
  );
  const [notification, setNotification] = useState<string | null>(null);

  const sessionRef = useRef<StoredActiveFocusSession | null>(null);
  const completionHandledRef = useRef(false);
  const pendingFocusTargetRef = useRef<{
    target_type: FocusTargetType;
    target_id: string;
    label?: string;
  } | null>(null);
  const focusMinutesRef = useRef(focusMinutes);
  const breakMinutesRef = useRef(breakMinutes);

  useEffect(() => {
    sessionRef.current = session;
    focusMinutesRef.current = focusMinutes;
    breakMinutesRef.current = breakMinutes;
  }, [session, focusMinutes, breakMinutes]);

  const updateSession = useCallback(
    (next: StoredActiveFocusSession | null) => {
      const prev = sessionRef.current;

      if (next && prev) {
        if (JSON.stringify(prev) === JSON.stringify(next)) {
          return;
        }
      } else if (!next && !prev) {
        return;
      }

      sessionRef.current = next;
      setSession(next);

      if (next) {
        writeActiveSession(next);
      } else {
        clearActiveSession();
      }
    },
    []
  );

  const endSession = useCallback(
    async (
      payload: Parameters<typeof persistFocusSessionEnd>[0]
    ): Promise<void> => {
      completionHandledRef.current = true;
      updateSession(null);

      const saved = await persistFocusSessionEnd(payload);
      if (saved) {
        setLastSavedSession(saved);
      }
    },
    [updateSession]
  );

  const handlePomodoroPhaseExpiry = useCallback(async () => {
    const current = sessionRef.current;
    if (!current || current.timer_type !== "pomodoro") return;
    if (current.session_status === "paused") return;
    if (completionHandledRef.current) return;

    const remaining = getPomodoroRemainingSeconds(current);
    if (remaining > 0) return;

    if (current.mode === "focus") {
      const next = pomodoroCompleteFocusPhase(current);
      updateSession(next);
      setNotification("Focus block complete. Break started.");
      notifyUser("Focus block complete. Break started.", "FlowOS — Pomodoro");
      return;
    }

    const payload = buildCompletedPayload(current);
    setNotification("Break complete.");
    notifyUser("Break complete.", "FlowOS — Pomodoro");
    await endSession(payload);
  }, [endSession, updateSession]);

  useEffect(() => {
    const stored = readActiveSession();
    if (stored) {
      sessionRef.current = stored;
      setSession(stored);

      if (stored.timer_type === "pomodoro") {
        setFocusMinutes(stored.focus_duration);
        setBreakMinutes(stored.break_duration);
      }
    }

    const onStorage = (event: StorageEvent) => {
      if (event.key !== "flowos.focus.active") return;
      const next = readActiveSession();
      sessionRef.current = next;
      setSession(next);
    };

    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, []);

  useEffect(() => {
    const runTick = () => {
      setTick((prev) => prev + 1);
      void handlePomodoroPhaseExpiry();
    };

    runTick();
    const interval = window.setInterval(runTick, 1000);

    return () => window.clearInterval(interval);
  }, [handlePomodoroPhaseExpiry]);

  const prepareFocusTarget = useCallback(
    (target: { type: FocusTargetType; id: string; label?: string } | null) => {
      pendingFocusTargetRef.current = target
        ? {
            target_type: target.type,
            target_id: target.id,
            label: target.label,
          }
        : null;
    },
    []
  );

  const quickStartFocus = useCallback(() => {
    if (sessionRef.current) return;
    completionHandledRef.current = false;
    const pending = pendingFocusTargetRef.current;
    pendingFocusTargetRef.current = null;
    const next = createQuickFocusSession({
      target_type: pending?.target_type ?? null,
      target_id: pending?.target_id ?? null,
      label: pending?.label,
    });
    updateSession(next);
  }, [updateSession]);

  const quickPause = useCallback(() => {
    const current = sessionRef.current;
    if (!current || current.timer_type !== "quick") return;
    if (current.session_status === "paused") return;
    updateSession(pauseSession(current));
  }, [updateSession]);

  const quickResume = useCallback(() => {
    const current = sessionRef.current;
    if (!current || current.timer_type !== "quick") return;
    if (current.session_status !== "paused") return;
    updateSession(resumeSession(current));
  }, [updateSession]);

  const quickStartBreakAction = useCallback(() => {
    const current = sessionRef.current;
    if (!current || current.timer_type !== "quick") return;
    if (current.mode !== "focus") return;
    updateSession(quickStartBreak(current));
  }, [updateSession]);

  const quickResumeFocusAction = useCallback(() => {
    const current = sessionRef.current;
    if (!current || current.timer_type !== "quick") return;
    if (current.mode !== "break") return;
    updateSession(quickResumeFocus(current));
  }, [updateSession]);

  const quickStop = useCallback(async () => {
    const current = sessionRef.current;
    if (!current || current.timer_type !== "quick") return;
    await endSession(buildStopPayload(current));
  }, [endSession]);

  const pomodoroStart = useCallback(() => {
    if (sessionRef.current) return;
    completionHandledRef.current = false;
    const next = createPomodoroSession(
      focusMinutesRef.current,
      breakMinutesRef.current
    );
    updateSession(next);
  }, [updateSession]);

  const pomodoroPause = useCallback(() => {
    const current = sessionRef.current;
    if (!current || current.timer_type !== "pomodoro") return;
    if (current.session_status === "paused") return;
    updateSession(pauseSession(current));
  }, [updateSession]);

  const pomodoroResume = useCallback(() => {
    const current = sessionRef.current;
    if (!current || current.timer_type !== "pomodoro") return;
    if (current.session_status !== "paused") return;
    updateSession(resumeSession(current));
  }, [updateSession]);

  const pomodoroStop = useCallback(async () => {
    const current = sessionRef.current;
    if (!current || current.timer_type !== "pomodoro") return;
    await endSession(buildStopPayload(current));
  }, [endSession]);

  const quickSession =
    session?.timer_type === "quick" ? session : null;
  const pomodoroSession =
    session?.timer_type === "pomodoro" ? session : null;

  const quickPhase: QuickFocusPhase = quickSession
    ? deriveQuickPhase(quickSession)
    : "idle";

  const quickElapsed = quickSession ? getSegmentElapsedSeconds(quickSession) : 0;
  const quickTotals = quickSession
    ? computeQuickFocusSeconds(quickSession)
    : { focus: 0, break: 0 };

  const pomodoroPhase: PomodoroPhase = pomodoroSession
    ? derivePomodoroPhase(pomodoroSession)
    : "idle";

  const pomodoroRemaining = pomodoroSession
    ? getPomodoroRemainingSeconds(pomodoroSession)
    : 0;

  const pomodoroTotal = pomodoroSession
    ? getPomodoroPhaseTotalSeconds(pomodoroSession)
    : 0;

  const pomodoroProgress =
    pomodoroTotal > 0
      ? Math.round(
          ((pomodoroTotal - pomodoroRemaining) / pomodoroTotal) * 100
        )
      : 0;

  const dashboardActive = useMemo((): DashboardActiveFocus => {
    if (!session) {
      return {
        isActive: false,
        label: "",
        statusLabel: "",
        remainingSeconds: 0,
        mode: "focus",
        isPaused: false,
      };
    }

    return {
      isActive: true,
      label: session.label,
      statusLabel: getActiveSessionStatusLabel(session),
      remainingSeconds: getDashboardRemainingSeconds(session),
      mode: session.mode,
      isPaused: session.session_status === "paused",
    };
  }, [session, tick]);

  const value = useMemo((): FocusSessionContextValue => {
    void tick;

    return {
      tick,
      activeSession: session,
      lastSavedSession,
      notification,
      clearNotification: () => setNotification(null),
      dashboardActive,
      prepareFocusTarget,
      quick: {
        phase: quickPhase,
        clock: quickSession ? formatQuickClock(quickSession) : "00:00",
        elapsed: quickElapsed,
        currentFocusSeconds: quickTotals.focus,
        currentBreakSeconds: quickTotals.break,
        statusLabel:
          quickPhase === "idle"
            ? "Ready"
            : quickPhase === "focus"
              ? "Focus started"
              : quickPhase === "focus_paused"
                ? "Focus paused"
                : quickPhase === "break"
                  ? "On break"
                  : "Break paused",
        isActive: quickPhase !== "idle",
        isIdle: quickPhase === "idle",
        isOnBreak: quickPhase === "break" || quickPhase === "break_paused",
        isPaused:
          quickPhase === "focus_paused" || quickPhase === "break_paused",
        isFocusing: quickPhase === "focus" || quickPhase === "focus_paused",
        startFocus: quickStartFocus,
        pause: quickPause,
        resume: quickResume,
        startBreak: quickStartBreakAction,
        resumeFocus: quickResumeFocusAction,
        stopSession: () => {
          void quickStop();
        },
      },
      pomodoro: {
        phase: pomodoroPhase,
        mode: pomodoroSession?.mode ?? "focus",
        focusMinutes,
        breakMinutes,
        setFocusMinutes,
        setBreakMinutes,
        clock: pomodoroSession ? formatPomodoroClock(pomodoroSession) : "00:00",
        progress: pomodoroProgress,
        isIdle: pomodoroPhase === "idle",
        isRunning: pomodoroPhase === "focus" || pomodoroPhase === "break",
        isPaused: pomodoroPhase === "paused",
        startPomodoro: pomodoroStart,
        pause: pomodoroPause,
        resume: pomodoroResume,
        stop: () => {
          void pomodoroStop();
        },
      },
    };
  }, [
    tick,
    session,
    lastSavedSession,
    notification,
    dashboardActive,
    prepareFocusTarget,
    quickPhase,
    quickSession,
    quickElapsed,
    quickTotals,
    pomodoroPhase,
    pomodoroSession,
    pomodoroProgress,
    focusMinutes,
    breakMinutes,
    quickStartFocus,
    quickPause,
    quickResume,
    quickStartBreakAction,
    quickResumeFocusAction,
    quickStop,
    pomodoroStart,
    pomodoroPause,
    pomodoroResume,
    pomodoroStop,
  ]);

  return (
    <FocusSessionContext.Provider value={value}>
      {children}
    </FocusSessionContext.Provider>
  );
}

export function useFocusSessionContext(): FocusSessionContextValue {
  const ctx = useContext(FocusSessionContext);
  if (!ctx) {
    throw new Error(
      "useFocusSessionContext must be used within FocusSessionProvider"
    );
  }
  return ctx;
}
