import { formatDuration } from "@/lib/focus-utils";
import type { TodayFocusStats } from "@/types/focus";

type FocusTodayBarProps = {
  stats: TodayFocusStats;
  loading?: boolean;
};

export function FocusTodayBar({ stats, loading }: FocusTodayBarProps) {
  return (
    <div className="rounded-xl border border-neutral-200 bg-neutral-50/80 px-5 py-4">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div className="flex flex-wrap gap-8">
          <div>
            <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
              Today&apos;s focus
            </p>
            <p className="mt-0.5 text-2xl font-semibold text-neutral-900">
              {loading ? "—" : formatDuration(stats.totalFocusSeconds)}
            </p>
          </div>
          <div>
            <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
              Today&apos;s break
            </p>
            <p className="mt-0.5 text-2xl font-semibold text-neutral-900">
              {loading ? "—" : formatDuration(stats.totalBreakSeconds)}
            </p>
          </div>
        </div>
        <p className="text-sm text-muted-foreground">
          Sessions:{" "}
          <span className="font-medium text-neutral-900">
            {loading ? "—" : stats.sessionCount}
          </span>
        </p>
      </div>
    </div>
  );
}
