"use client";

import { Pencil, X } from "lucide-react";
import {
  formatBreakCountdownLabel,
  formatCompactBreakCountdownLabel,
} from "@/lib/focus-scheduled-break";
import { cn } from "@/lib/utils";

type FocusNextBreakStripProps = {
  breakAtMinutes: number | null;
  breakLengthMinutes: number | null;
  remainingToBreakSeconds: number;
  onEdit: () => void;
  onCancel: () => void;
  /** When true (e.g. user is on break), schedule is shown read-only without Edit/Cancel. */
  readOnly?: boolean;
  className?: string;
};

/** "Next Break" hover strip — Edit/Cancel stay in the DOM for keyboard access,
 * only their visibility toggles on hover/focus (same pattern as TimerHoverControls). */
export function FocusNextBreakStrip({
  breakAtMinutes,
  breakLengthMinutes,
  remainingToBreakSeconds,
  onEdit,
  onCancel,
  readOnly = false,
  className,
}: FocusNextBreakStripProps) {
  if (!breakAtMinutes) return null;

  const breakLengthLabel =
    breakLengthMinutes != null ? `${breakLengthMinutes} min break` : "length not set";
  const countdownLabel = formatBreakCountdownLabel(remainingToBreakSeconds);
  const compactCountdownLabel = formatCompactBreakCountdownLabel(remainingToBreakSeconds);

  return (
    <div
      className={cn(
        "group/next-break relative inline-flex h-10 max-h-11 min-h-9 max-w-full items-center gap-2",
        "rounded-lg border border-border-subtle bg-surface-base/50 px-3 text-[11px]",
        className
      )}
    >
      {/* Compact: narrow viewports — label + countdown only */}
      <div
        className={cn(
          "flex min-w-0 items-center gap-2 text-muted-foreground sm:hidden",
          readOnly && "justify-center"
        )}
      >
        <span className="font-medium text-muted-foreground">Next Break</span>
        {readOnly ? (
          <span className="text-muted-foreground">after this break</span>
        ) : (
          <span
            aria-live="polite"
            aria-atomic="true"
            className="tabular-nums text-primary"
          >
            {compactCountdownLabel}
          </span>
        )}
      </div>

      {/* Full: sm+ — target, length, live countdown */}
      <div className="hidden min-w-0 flex-wrap items-center justify-center gap-x-2 gap-y-0.5 text-muted-foreground sm:flex">
        <span className="font-medium text-muted-foreground">Next Break</span>
        <span className="tabular-nums">{breakAtMinutes} min</span>
        <span aria-hidden>·</span>
        <span className="tabular-nums">{breakLengthLabel}</span>
        {readOnly ? (
          <>
            <span aria-hidden>·</span>
            <span className="text-muted-foreground">after this break</span>
          </>
        ) : (
          <>
            <span aria-hidden>·</span>
            <span
              aria-live="polite"
              aria-atomic="true"
              className="tabular-nums text-primary"
            >
              {countdownLabel}
            </span>
          </>
        )}
      </div>

      {!readOnly ? (
        <div
          className={cn(
            "flex shrink-0 items-center gap-1 opacity-0 transition-opacity duration-150",
            "group-hover/next-break:opacity-100 group-focus-within/next-break:opacity-100"
          )}
        >
          <button
            type="button"
            onClick={onEdit}
            aria-label="Edit scheduled break"
            className="flex size-5 items-center justify-center rounded-md text-muted-foreground hover:bg-surface-hover hover:text-foreground"
          >
            <Pencil className="size-3" />
          </button>
          <button
            type="button"
            onClick={onCancel}
            aria-label="Cancel scheduled break"
            className="flex size-5 items-center justify-center rounded-md text-muted-foreground hover:bg-surface-hover hover:text-foreground"
          >
            <X className="size-3" />
          </button>
        </div>
      ) : null}
    </div>
  );
}
