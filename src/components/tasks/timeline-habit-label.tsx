import { Crosshair } from "lucide-react";
import { cn } from "@/lib/utils";

type TimelineHabitLabelProps = {
  className?: string;
  compact?: boolean;
  trackWithFocus?: boolean;
};

export function TimelineHabitLabel({
  className,
  compact,
  trackWithFocus,
}: TimelineHabitLabelProps) {
  return (
    <span className={cn("inline-flex shrink-0 items-center gap-0.5", className)}>
      <span
        className={cn(
          "rounded font-semibold uppercase tracking-wide text-orange-700/90 bg-orange-100/75 dark:bg-orange-500/15 dark:text-orange-300",
          compact ? "px-1 py-px text-[7px]" : "px-1 py-0.5 text-[8px]"
        )}
      >
        Habit
      </span>
      {trackWithFocus ? (
        <span
          className={cn(
            "inline-flex items-center gap-px rounded bg-violet-100/90 font-semibold uppercase tracking-wide text-violet-700 dark:bg-violet-500/20 dark:text-violet-300",
            compact ? "px-0.5 py-px text-[6px]" : "px-1 py-px text-[7px]"
          )}
          title="Track with Focus"
        >
          <Crosshair className={compact ? "size-2" : "size-2.5"} />
          Focus
        </span>
      ) : null}
    </span>
  );
}
