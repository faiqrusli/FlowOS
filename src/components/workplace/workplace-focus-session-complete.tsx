"use client";

import { Button } from "@/components/ui/button";
import { formatDuration, getSessionFocusSeconds } from "@/lib/focus-utils";
import type { FocusSession } from "@/types/focus";

export type SessionCompleteQueueHead =
  | {
      kind: "task";
      id: string;
      title: string;
      durationMinutes: number | null;
    }
  | {
      kind: "habit";
      id: string;
      title: string;
      durationMinutes: number | null;
    };

type WorkplaceFocusSessionCompleteProps = {
  session: FocusSession;
  completedTitle: string;
  queueHead: SessionCompleteQueueHead;
  onStartNext: () => void;
  onChooseAnother: () => void;
};

export function WorkplaceFocusSessionComplete({
  session,
  completedTitle,
  queueHead,
  onStartNext,
  onChooseAnother,
}: WorkplaceFocusSessionCompleteProps) {
  const focusSeconds = getSessionFocusSeconds(session);
  const nextDuration =
    queueHead.durationMinutes != null && queueHead.durationMinutes > 0
      ? `${queueHead.durationMinutes} min`
      : null;

  return (
    <div className="mx-auto w-full max-w-md rounded-lg border border-border-subtle bg-card px-4 py-3 text-left">
      <p className="text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">
        Focus complete
      </p>
      <p className="mt-1 truncate text-[15px] font-semibold text-foreground">
        {completedTitle}
      </p>
      <p className="mt-0.5 text-[12px] tabular-nums text-muted-foreground">
        {formatDuration(focusSeconds)}
      </p>

      <div className="mt-3 border-t border-border-subtle pt-3">
        <p className="text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">
          Next Up
        </p>
        <p className="mt-1 truncate text-[14px] font-medium text-foreground">
          {queueHead.title}
        </p>
        {nextDuration ? (
          <p className="mt-0.5 text-[12px] tabular-nums text-muted-foreground">
            {nextDuration}
          </p>
        ) : null}
      </div>

      <div className="mt-3 flex flex-wrap items-center gap-2">
        <Button
          type="button"
          size="sm"
          className="h-8 rounded-full px-4"
          onClick={onStartNext}
        >
          Start Next
        </Button>
        <Button
          type="button"
          size="sm"
          variant="outline"
          className="h-8 px-3.5"
          onClick={onChooseAnother}
        >
          Choose Another
        </Button>
      </div>
    </div>
  );
}
