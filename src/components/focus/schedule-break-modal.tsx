"use client";

import { InfoIcon } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { NumberStepper } from "@/components/ui/stepper";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { useFocusSessionContext } from "@/contexts/focus-session-context";
import { formatTimerClock } from "@/lib/focus-utils";
import {
  BREAK_AT_STEP_MINUTES,
  BREAK_LENGTH_STEP_MINUTES,
  DEFAULT_BREAK_LENGTH_MINUTES,
  MIN_BREAK_LENGTH_MINUTES,
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
  const [breakLengthMinutes, setBreakLengthMinutes] = useState(
    DEFAULT_BREAK_LENGTH_MINUTES
  );

  useEffect(() => {
    if (!open) return;
    void tick;
    setBreakAtMinutes(
      quick.breakAtMinutes ?? getDefaultBreakAtMinutes(currentFocusMinutes)
    );
    setBreakLengthMinutes(quick.breakLengthMinutes ?? DEFAULT_BREAK_LENGTH_MINUTES);
    // Only re-seed the draft when the modal transitions open — not on every tick.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  const minBreakAt = useMemo(
    () => getMinBreakAtMinutes(currentFocusMinutes),
    [currentFocusMinutes]
  );

  const remainingSeconds = Math.max(0, breakAtMinutes * 60 - quick.currentFocusSeconds);

  const handleSave = () => {
    quick.scheduleBreak(breakAtMinutes, breakLengthMinutes);
    onOpenChange(false);
  };

  return (
    <Dialog
      open={open}
      onOpenChange={onOpenChange}
    >
      <DialogContent
        onKeyDown={(event) => {
          if (event.key === "Enter") {
            event.preventDefault();
            handleSave();
          }
        }}
      >
        <DialogHeader>
          <DialogTitle>Schedule Break</DialogTitle>
        </DialogHeader>

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
            <NumberStepper
              value={breakAtMinutes}
              step={BREAK_AT_STEP_MINUTES}
              min={minBreakAt}
              onChange={setBreakAtMinutes}
              formatValue={(value) => `${value} min`}
              decrementLabel="Decrease break at by 5 minutes"
              incrementLabel="Increase break at by 5 minutes"
            />
            <p className="text-xs text-muted-foreground">
              {formatBreakCountdownLabel(remainingSeconds)}
            </p>
          </div>

          <div className="space-y-1.5">
            <div className="flex items-center gap-1.5">
              <p className="text-sm font-medium text-foreground">Break length</p>
              <InfoTooltip text="How long your break lasts.\nYou'll be notified when it ends, but focus won't resume automatically." />
            </div>
            <NumberStepper
              value={breakLengthMinutes}
              step={BREAK_LENGTH_STEP_MINUTES}
              min={MIN_BREAK_LENGTH_MINUTES}
              onChange={setBreakLengthMinutes}
              formatValue={(value) => `${value} min`}
              decrementLabel="Decrease break length by 5 minutes"
              incrementLabel="Increase break length by 5 minutes"
            />
          </div>
        </div>

        <DialogFooter>
          <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button type="button" onClick={handleSave}>
            Save Break
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
