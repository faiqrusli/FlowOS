"use client";

import { Pencil, X } from "lucide-react";
import { cn } from "@/lib/utils";

type FocusNextBreakStripProps = {
  breakAtMinutes: number | null;
  breakLengthMinutes: number | null;
  onEdit: () => void;
  onCancel: () => void;
  className?: string;
};

/** "Next Break" hover strip — Edit/Cancel stay in the DOM for keyboard access,
 * only their visibility toggles on hover/focus (same pattern as TimerHoverControls). */
export function FocusNextBreakStrip({
  breakAtMinutes,
  breakLengthMinutes,
  onEdit,
  onCancel,
  className,
}: FocusNextBreakStripProps) {
  if (!breakAtMinutes || !breakLengthMinutes) return null;

  return (
    <div
      className={cn(
        "group/next-break relative inline-flex items-center gap-3 rounded-full border border-border/50 bg-muted/30 px-3 py-1.5 text-xs",
        className
      )}
    >
      <div className="flex items-center gap-2 text-muted-foreground">
        <span className="font-medium text-foreground/80">Next Break</span>
        <span className="tabular-nums">{breakAtMinutes} min</span>
        <span aria-hidden>·</span>
        <span className="tabular-nums">{breakLengthMinutes} min break</span>
      </div>
      <div
        className={cn(
          "flex items-center gap-1 opacity-0 transition-opacity duration-150",
          "group-hover/next-break:opacity-100 group-focus-within/next-break:opacity-100"
        )}
      >
        <button
          type="button"
          onClick={onEdit}
          aria-label="Edit scheduled break"
          className="flex size-5 items-center justify-center rounded-full text-muted-foreground hover:bg-muted/70 hover:text-foreground"
        >
          <Pencil className="size-3" />
        </button>
        <button
          type="button"
          onClick={onCancel}
          aria-label="Cancel scheduled break"
          className="flex size-5 items-center justify-center rounded-full text-muted-foreground hover:bg-muted/70 hover:text-foreground"
        >
          <X className="size-3" />
        </button>
      </div>
    </div>
  );
}
