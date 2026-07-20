"use client";

import Link from "next/link";
import { useState } from "react";
import { ArrowRight } from "lucide-react";
import { FocusBreakNotification } from "@/components/focus/focus-break-notification";
import { FocusNextBreakStrip } from "@/components/focus/focus-next-break-strip";
import { ScheduleBreakModal } from "@/components/focus/schedule-break-modal";
import { useFocusSessionContext } from "@/contexts/focus-session-context";
import {
  derivePomodoroPhase,
  getPomodoroRemainingSeconds,
} from "@/lib/focus-active-session";
import {
  formatDuration,
  formatTimerClock,
} from "@/lib/focus-utils";
import { type as typography } from "@/lib/typography";

function resolveSessionStateLabel(
  isActive: boolean,
  isPaused: boolean,
  mode: "focus" | "break"
): string {
  if (!isActive) return "Idle";
  if (isPaused) return "Paused";
  return mode === "focus" ? "In Focus" : "Break";
}

export function FocusCurrentSessionCard() {
  const { activeSession, dashboardActive, quick, pomodoro } =
    useFocusSessionContext();
  const [scheduleBreakOpen, setScheduleBreakOpen] = useState(false);

  const isActive = dashboardActive.isActive;
  const stateLabel = resolveSessionStateLabel(
    isActive,
    dashboardActive.isPaused,
    dashboardActive.mode
  );

  const elapsedDisplay =
    activeSession?.timer_type === "quick"
      ? quick.clock
      : activeSession?.timer_type === "pomodoro"
        ? pomodoro.clock
        : "00:00";

  const remainingSeconds =
    activeSession?.timer_type === "pomodoro" && isActive
      ? getPomodoroRemainingSeconds(activeSession)
      : null;

  const showPomodoroRemaining =
    activeSession?.timer_type === "pomodoro" &&
    derivePomodoroPhase(activeSession) !== "idle";

  const showQuickScheduleBreak =
    activeSession?.timer_type === "quick" && quick.isActive;

  return (
    <>
      <section className="rounded-xl bg-surface-base px-4 py-5 sm:px-5">
        <h2 className={typography.sectionTitle}>Current focus</h2>
        <div className="mt-4 space-y-4">
          {isActive ? (
            <>
              <div className="space-y-1">
                <p className="text-lg font-semibold tracking-tight text-foreground">
                  {dashboardActive.label || "Active session"}
                </p>
                <p className="text-sm text-foreground-secondary">{stateLabel}</p>
              </div>

              <div className="space-y-2.5">
                <div
                  className={
                    showPomodoroRemaining
                      ? "grid gap-2.5 sm:grid-cols-2"
                      : "grid gap-2.5"
                  }
                >
                  <div className="rounded-lg bg-surface-inset px-3 py-2.5">
                    <p className={typography.meta}>Elapsed</p>
                    <p className="mt-0.5 font-mono text-base font-semibold tabular-nums text-foreground">
                      {elapsedDisplay}
                    </p>
                  </div>
                  {showPomodoroRemaining ? (
                    <div className="rounded-lg bg-surface-inset px-3 py-2.5">
                      <p className={typography.meta}>Remaining</p>
                      <p className="mt-0.5 font-mono text-base font-semibold tabular-nums text-foreground">
                        {formatTimerClock(remainingSeconds ?? 0)}
                      </p>
                    </div>
                  ) : null}
                </div>
                {activeSession?.timer_type === "quick" && quick.isActive ? (
                  <div className="rounded-lg bg-surface-inset px-3 py-2.5">
                    <p className={typography.meta}>This session</p>
                    <p className="mt-0.5 text-sm font-medium tabular-nums text-foreground">
                      Focus {formatDuration(quick.currentFocusSeconds)}
                      {quick.currentBreakSeconds > 0
                        ? ` · Break ${formatDuration(quick.currentBreakSeconds)}`
                        : ""}
                    </p>
                  </div>
                ) : null}
              </div>

              {showQuickScheduleBreak && quick.breakPrompt ? (
                <div className="flex justify-center">
                  <FocusBreakNotification
                    kind={quick.breakPrompt}
                    breakAtMinutes={quick.breakAtMinutes}
                    onPrimaryAction={
                      quick.breakPrompt === "ready"
                        ? quick.startBreak
                        : quick.resumeFocus
                    }
                    onSnooze={() =>
                      quick.breakPrompt === "ready"
                        ? quick.snoozeBreakReady()
                        : quick.snoozeBreakFinished()
                    }
                  />
                </div>
              ) : null}

              {showQuickScheduleBreak &&
              quick.hasScheduledBreak &&
              !quick.breakPrompt ? (
                <FocusNextBreakStrip
                  breakAtMinutes={quick.breakAtMinutes}
                  breakLengthMinutes={quick.breakLengthMinutes}
                  remainingToBreakSeconds={quick.remainingToBreakSeconds}
                  readOnly={quick.isOnBreak}
                  onEdit={() => setScheduleBreakOpen(true)}
                  onCancel={quick.cancelScheduledBreak}
                />
              ) : null}
            </>
          ) : (
            <p className={typography.bodyMuted}>No active focus session.</p>
          )}

          <Link
            href="/"
            className="inline-flex h-9 items-center justify-center gap-2 rounded-md bg-primary px-4 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
          >
            Go to Today
            <ArrowRight className="size-4" />
          </Link>
        </div>
      </section>

      {showQuickScheduleBreak ? (
        <ScheduleBreakModal
          open={scheduleBreakOpen}
          onOpenChange={setScheduleBreakOpen}
        />
      ) : null}
    </>
  );
}
