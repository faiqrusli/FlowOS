"use client";

import { InfoIcon } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { ScheduleBreakStepperField } from "@/components/focus/schedule-break-stepper-field";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { useFocusSessionContext } from "@/contexts/focus-session-context";
import { formatTimerClock } from "@/lib/focus-utils";
import {
  DEFAULT_BREAK_LENGTH_MINUTES,
  formatBreakCountdownLabel,
  getDefaultBreakAtMinutes,
  getMinBreakAtMinutes,
} from "@/lib/focus-scheduled-break";

type ScheduleBreakModalProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

function InfoTooltip({ text }: { text: string }) {
  return (
    <Tooltip>
      <TooltipTrigger
        className="inline-flex items-center text-muted-foreground outline-none hover:text-foreground"
        aria-label="More info"
      >
        <InfoIcon className="size-3.5" />
      </TooltipTrigger>
      <TooltipContent>
        <p className="whitespace-pre-line">{text}</p>
      </TooltipContent>
    </Tooltip>
  );
}

export function ScheduleBreakModal({ open, onOpenChange }: ScheduleBreakModalProps) {
  const { tick, quick } = useFocusSessionContext();
  const currentFocusMinutes = Math.floor(quick.currentFocusSeconds / 60);

  const [breakAtMinutes, setBreakAtMinutes] = useState(() =>
    getDefaultBreakAtMinutes(currentFocusMinutes)
  );
  const [breakLengthMinutes, setBreakLengthMinutes] = useState<number | null>(
    DEFAULT_BREAK_LENGTH_MINUTES
  );

  useEffect(() => {
    if (!open) return;
    void tick;
    setBreakAtMinutes(
      quick.breakAtMinutes ?? getDefaultBreakAtMinutes(currentFocusMinutes)
    );
    setBreakLengthMinutes(quick.breakLengthMinutes ?? DEFAULT_BREAK_LENGTH_MINUTES);
    // Only re-seed draft when the modal opens.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  const minBreakAt = useMemo(
    () => getMinBreakAtMinutes(currentFocusMinutes),
    [currentFocusMinutes]
  );

  const remainingSeconds = Math.max(0, (breakAtMinutes ?? 0) * 60 - quick.currentFocusSeconds);

  const handleSave = () => {
    if (breakAtMinutes == null || breakAtMinutes < minBreakAt) return;
    const length = breakLengthMinutes ?? DEFAULT_BREAK_LENGTH_MINUTES;
    quick.scheduleBreak(breakAtMinutes, length);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Schedule Break</DialogTitle>
        </DialogHeader>

        <form
          onSubmit={(event) => {
            event.preventDefault();
            handleSave();
          }}
        >
          <div className="space-y-5">
            <div className="flex items-center justify-between">
              <p className="text-sm font-medium text-muted-foreground">Current Focus</p>
              <p className="font-mono text-sm font-semibold tabular-nums text-foreground">
                {formatTimerClock(quick.currentFocusSeconds)}
              </p>
            </div>

            <div className="space-y-1.5">
              <div className="flex items-center gap-1.5">
                <p className="text-sm font-medium text-foreground">Break at</p>
                <InfoTooltip text="You'll be reminded when your focus reaches this duration.\nFocus won't stop automatically." />
              </div>
              <ScheduleBreakStepperField
                kind="break-at"
                value={breakAtMinutes}
                min={minBreakAt}
                currentFocusMinutes={currentFocusMinutes}
                onChange={setBreakAtMinutes}
              />
              <p aria-live="polite" aria-atomic="true" className="text-xs text-primary/90">
                {formatBreakCountdownLabel(remainingSeconds)}
              </p>
            </div>

            <div className="space-y-1.5">
              <div className="flex items-center gap-1.5">
                <p className="text-sm font-medium text-foreground">Break length</p>
                <InfoTooltip text="How long your break lasts.\nYou'll be notified when it ends, but focus won't resume automatically." />
              </div>
              <ScheduleBreakStepperField
                kind="break-length"
                value={breakLengthMinutes}
                onChange={setBreakLengthMinutes}
              />
            </div>
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit">Save Break</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
