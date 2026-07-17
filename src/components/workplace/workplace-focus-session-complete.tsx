"use client";

import { Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { formatDurationCompact, getSessionFocusSeconds } from "@/lib/focus-utils";
import type { FocusSession } from "@/types/focus";

type WorkplaceFocusSessionCompleteProps = {
  session: FocusSession;
  /** Last focused task title, if the session had a task target. */
  lastFocusedTitle: string | null;
  /** When set, Mark Complete is available for that task. */
  canMarkComplete: boolean;
  onMarkComplete: () => void;
  onKeepIncomplete: () => void;
};

export function WorkplaceFocusSessionComplete({
  session,
  lastFocusedTitle,
  canMarkComplete,
  onMarkComplete,
  onKeepIncomplete,
}: WorkplaceFocusSessionCompleteProps) {
  const focusSeconds = getSessionFocusSeconds(session);

  return (
    <div className="mx-auto w-full max-w-md rounded-lg border border-border-subtle bg-card px-4 py-3 text-left">
      <p className="text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">
        Focus session saved
      </p>
      <p className="mt-1 text-[20px] font-semibold tabular-nums tracking-tight text-foreground">
        {formatDurationCompact(focusSeconds)}
      </p>

      {lastFocusedTitle ? (
        <div className="mt-3 border-t border-border-subtle pt-3">
          <p className="text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">
            {canMarkComplete ? "Last focused task" : "Last focused"}
          </p>
          <p className="mt-1 truncate text-[14px] font-medium text-foreground">
            {lastFocusedTitle}
          </p>
        </div>
      ) : null}

      <div className="mt-3 flex flex-wrap items-center gap-2">
        {canMarkComplete ? (
          <Button
            type="button"
            size="sm"
            className="h-8 rounded-full px-4"
            onClick={onMarkComplete}
          >
            <Check className="size-3.5" data-icon="inline-start" />
            Mark Complete
          </Button>
        ) : null}
        <Button
          type="button"
          size="sm"
          variant="outline"
          className="h-8 px-3.5"
          onClick={onKeepIncomplete}
        >
          {canMarkComplete ? "Keep Incomplete" : "Dismiss"}
        </Button>
      </div>
    </div>
  );
}
