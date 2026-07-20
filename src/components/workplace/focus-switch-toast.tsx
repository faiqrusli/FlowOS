"use client";

import { forwardRef, useEffect } from "react";
import { Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const floatingToastClassName = cn(
  "flow-surface-elevated pointer-events-auto w-[min(24rem,calc(100vw-2rem))] rounded-xl px-4 py-3",
  "animate-in slide-in-from-bottom-2 fade-in duration-200",
);

export type FocusSwitchConfirmToastProps = {
  taskTitle: string;
  onKeepCurrent: () => void;
  onSwitch: () => void;
};

/** Confirm before switching focus target — floating, not inline in the card. */
export const FocusSwitchConfirmToast = forwardRef<
  HTMLDivElement,
  FocusSwitchConfirmToastProps
>(function FocusSwitchConfirmToast(
  { taskTitle, onKeepCurrent, onSwitch },
  ref,
) {
  return (
    <div
      ref={ref}
      role="alertdialog"
      aria-labelledby="pending-focus-title"
      className={floatingToastClassName}
    >
      <p
        id="pending-focus-title"
        className="text-[13px] leading-snug text-foreground"
      >
        Switch focus to &ldquo;{taskTitle}&rdquo;?
      </p>
      <div className="mt-2.5 flex flex-wrap gap-1.5">
        <Button
          type="button"
          size="sm"
          variant="ghost"
          className="h-7 px-2.5 text-[12px]"
          onClick={onKeepCurrent}
        >
          Keep current
        </Button>
        <Button
          type="button"
          size="sm"
          className="h-7 px-2.5 text-[12px]"
          onClick={onSwitch}
        >
          Switch focus
        </Button>
      </div>
    </div>
  );
});

export type FocusSwitchToastProps = {
  newTaskTitle: string;
  previousTaskTitle: string;
  onComplete: () => void;
  onUndo: () => void;
  onDismiss: () => void;
  /** Auto-dismiss after this many ms. Default 7s. */
  durationMs?: number;
};

export function FocusSwitchToast({
  newTaskTitle,
  previousTaskTitle,
  onComplete,
  onUndo,
  onDismiss,
  durationMs = 7000,
}: FocusSwitchToastProps) {
  useEffect(() => {
    const timer = window.setTimeout(onDismiss, durationMs);
    return () => window.clearTimeout(timer);
  }, [durationMs, onDismiss]);

  return (
    <div
      className={floatingToastClassName}
      role="status"
      aria-live="polite"
    >
      <p className="text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">
        Now focusing
      </p>
      <p className="mt-0.5 truncate text-[14px] font-semibold text-foreground">
        {newTaskTitle}
      </p>
      <p className="mt-1 text-[12px] text-muted-foreground">
        Previous task paused
        {previousTaskTitle ? (
          <>
            {" "}
            · <span className="text-foreground/75">{previousTaskTitle}</span>
          </>
        ) : null}
        .
      </p>
      <div className="mt-2.5 flex flex-wrap gap-1.5">
        <Button
          type="button"
          size="sm"
          className="h-7 gap-1 px-2.5 text-[12px]"
          onClick={onComplete}
        >
          <Check className="size-3.5" strokeWidth={2.5} aria-hidden />
          Complete
        </Button>
        <Button
          type="button"
          size="sm"
          variant="outline"
          className="h-7 px-2.5 text-[12px]"
          onClick={onUndo}
        >
          Undo
        </Button>
      </div>
    </div>
  );
}
