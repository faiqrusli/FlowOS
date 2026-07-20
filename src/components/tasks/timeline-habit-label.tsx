import { Crosshair } from "lucide-react";
import { Badge } from "@/components/ui/badge";
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
  const focusBadge = trackWithFocus ? (
    <Badge variant="entity-focus" className="p-0" title="Track with Focus">
      <Crosshair className={cn(compact ? "size-2" : "size-2.5")} />
    </Badge>
  ) : null;

  return (
    <span
      className={cn(
        "inline-flex shrink-0 items-center",
        compact ? "gap-1" : "gap-0.5",
        className,
      )}
    >
      <Badge
        variant="entity-habit"
        className={cn(compact && "text-[7px]")}
      >
        Habit
      </Badge>
      {compact ? (
        <span
          className="inline-flex size-3.5 shrink-0 items-center justify-center"
          aria-hidden={!trackWithFocus}
        >
          {focusBadge}
        </span>
      ) : (
        focusBadge
      )}
    </span>
  );
}
