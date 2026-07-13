"use client";

import { Button } from "@/components/ui/button";
import type { BreakPrompt } from "@/contexts/focus-session-context";
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
        "inline-flex max-w-full flex-wrap items-center justify-center gap-x-2 gap-y-1.5 rounded-full border border-primary/35 bg-primary/[0.06] px-4 py-1.5 text-xs",
        className
      )}
    >
      <span className="font-medium text-foreground/90">
        {isReady ? "Time for a break" : "Break finished"}
      </span>
      <span aria-hidden className="text-muted-foreground/50">
        ·
      </span>
      <span className="text-muted-foreground">
        {isReady
          ? `Reached ${breakAtMinutes ?? 0} min`
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
