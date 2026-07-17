"use client";

import { Button } from "@/components/ui/button";
import type { BreakPrompt } from "@/contexts/focus-session-context";
import { formatBreakAtMinutes } from "@/lib/focus-scheduled-break";
import { cn } from "@/lib/utils";

type FocusBreakNotificationProps = {
  kind: Exclude<BreakPrompt, null>;
  breakAtMinutes: number | null;
  onPrimaryAction: () => void;
  onSnooze: () => void;
  className?: string;
};

/**
 * Break threshold / break-finished reminder — compact strip under the timer
 * (same footprint family as FocusNextBreakStrip). Never auto-dismisses.
 */
export function FocusBreakNotification({
  kind,
  breakAtMinutes,
  onPrimaryAction,
  onSnooze,
  className,
}: FocusBreakNotificationProps) {
  const isReady = kind === "ready";

  return (
    <div
      role="alert"
      className={cn(
        "inline-flex max-w-full flex-wrap items-center justify-center gap-x-2 gap-y-1.5 rounded-lg border border-primary/15 bg-surface-raised px-3 py-1.5 text-xs",
        className,
      )}
    >
      <span className="font-semibold text-foreground">
        {isReady ? "Time for a break" : "Break finished"}
      </span>
      <span aria-hidden className="text-muted-foreground/45">
        ·
      </span>
      <span className="text-muted-foreground/75">
        {isReady
          ? `Reached ${formatBreakAtMinutes(breakAtMinutes ?? 0)}`
          : "Ready to focus again?"}
      </span>
      <div className="flex shrink-0 items-center gap-1.5">
        <Button
          type="button"
          size="sm"
          className="h-6 rounded-full px-2.5 text-[11px]"
          onClick={onPrimaryAction}
        >
          {isReady ? "Start Break" : "Resume Focus"}
        </Button>
        <Button
          type="button"
          size="sm"
          variant="outline"
          className="h-6 rounded-full px-2.5 text-[11px]"
          onClick={onSnooze}
        >
          Snooze 5 min
        </Button>
      </div>
    </div>
  );
}
