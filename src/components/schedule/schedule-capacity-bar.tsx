import type { ScheduleCapacity } from "@/lib/schedule-capacity";
import { cn } from "@/lib/utils";

type ScheduleCapacityBarProps = {
  capacity: ScheduleCapacity;
  showProjections?: boolean;
  onToggleProjections?: () => void;
};

export function ScheduleCapacityBar({
  capacity,
  showProjections = true,
  onToggleProjections,
}: ScheduleCapacityBarProps) {
  const barPercent = Math.min(100, capacity.loadPercent);

  return (
    <div className="flex flex-col gap-2 rounded-2xl border border-border/50 bg-gradient-to-r from-card via-card to-muted/20 px-4 py-3 shadow-sm sm:flex-row sm:items-center sm:gap-6">
      <div className="min-w-0 flex-1">
        <div className="flex items-baseline justify-between gap-3">
          <p className="text-sm font-medium text-foreground">
            <span className="tabular-nums">{capacity.plannedLabel}</span>
            <span className="text-muted-foreground"> planned</span>
            <span className="mx-1.5 text-muted-foreground/50">·</span>
            <span className="text-muted-foreground tabular-nums">
              {capacity.capacityLabel} capacity
            </span>
          </p>
          <span
            className={cn(
              "shrink-0 text-xs font-semibold tabular-nums",
              capacity.isOverloaded ? "text-rose-600" : "text-emerald-600"
            )}
          >
            {capacity.isOverloaded ? "Over capacity" : `${capacity.loadPercent}%`}
          </span>
        </div>

        <div className="mt-2 h-2 overflow-hidden rounded-full bg-muted/80">
          <div
            className={cn(
              "h-full rounded-full transition-all duration-500",
              capacity.isOverloaded
                ? "bg-gradient-to-r from-amber-400 to-rose-500"
                : "bg-gradient-to-r from-emerald-400 to-teal-500"
            )}
            style={{ width: `${barPercent}%` }}
          />
        </div>
      </div>

      <div className="flex shrink-0 items-center gap-4 text-xs text-muted-foreground">
        <span>
          <span className="font-semibold text-foreground tabular-nums">
            {capacity.scheduledCount}
          </span>{" "}
          scheduled
        </span>
        <span>
          <span className="font-semibold text-foreground tabular-nums">
            {capacity.completedCount}
          </span>{" "}
          done
        </span>
        {onToggleProjections && (
          <button
            type="button"
            onClick={onToggleProjections}
            className={cn(
              "rounded-full px-2.5 py-1 font-medium transition-colors",
              showProjections
                ? "bg-foreground/8 text-foreground"
                : "hover:bg-muted text-muted-foreground"
            )}
          >
            {showProjections ? "Projections on" : "Projections off"}
          </button>
        )}
      </div>
    </div>
  );
}
