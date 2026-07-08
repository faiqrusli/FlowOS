"use client";

import { Button } from "@/components/ui/button";
import type { BreakPrompt } from "@/contexts/focus-session-context";

type FocusBreakNotificationProps = {
  kind: Exclude<BreakPrompt, null>;
  breakAtMinutes: number | null;
  onPrimaryAction: () => void;
  onSnooze: () => void;
};

/**
 * Break threshold / break-finished reminder card.
 * Purely presentational — which card (if any) to show is decided by the caller
 * from `quick.breakPrompt`. Never auto-dismisses; every action is user-initiated.
 */
export function FocusBreakNotification({
  kind,
  breakAtMinutes,
  onPrimaryAction,
  onSnooze,
}: FocusBreakNotificationProps) {
  const isReady = kind === "ready";

  return (
    <div
      role="alert"
      className="mx-auto w-full max-w-sm rounded-lg border border-primary/30 bg-primary/[0.06] px-3.5 py-3 text-center"
    >
      <p className="text-sm font-semibold text-foreground">
        {isReady ? "Time for a break" : "Break finished"}
      </p>
      <p className="mt-1 text-[13px] text-muted-foreground">
        {isReady
          ? `You've reached ${breakAtMinutes ?? 0} minutes of focus.`
          : "Ready to focus again?"}
      </p>
      <div className="mt-3 flex items-center justify-center gap-2">
        <Button type="button" size="sm" className="h-8 px-4" onClick={onPrimaryAction}>
          {isReady ? "Start Break" : "Resume Focus"}
        </Button>
        <Button
          type="button"
          size="sm"
          variant="outline"
          className="h-8 px-3.5"
          onClick={onSnooze}
        >
          Snooze 5 min
        </Button>
      </div>
    </div>
  );
}
