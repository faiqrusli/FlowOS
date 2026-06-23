import type { ScheduleKpis } from "@/lib/schedule-layout";
import { type } from "@/lib/typography";
import { cn } from "@/lib/utils";

type ScheduleKpiRowProps = {
  kpis: ScheduleKpis;
};

function InlineStat({ value, label }: { value: string; label: string }) {
  return (
    <div className="flex items-baseline gap-1.5">
      <span className={cn(type.kpiValue, "text-base sm:text-lg")}>{value}</span>
      <span className={type.meta}>{label}</span>
    </div>
  );
}

export function ScheduleKpiRow({ kpis }: ScheduleKpiRowProps) {
  return (
    <div className="flex flex-wrap items-center gap-x-4 gap-y-2 rounded-lg border border-border/60 bg-card px-3 py-2 sm:gap-x-6 sm:px-4">
      <InlineStat value={String(kpis.scheduledToday)} label="Scheduled" />
      <div className="hidden h-4 w-px bg-border/60 sm:block" aria-hidden />
      <InlineStat value={String(kpis.unscheduled)} label="Unscheduled" />
      <div className="hidden h-4 w-px bg-border/60 sm:block" aria-hidden />
      <InlineStat value={kpis.tasksDone} label="Tasks done" />

      <div className="ml-auto flex min-w-[8rem] items-center gap-2">
        <span className={cn(type.meta, "shrink-0 tabular-nums")}>
          {kpis.onTrackPercent}% on track
        </span>
        <div className="h-1 min-w-[4rem] flex-1 overflow-hidden rounded-full bg-muted">
          <div
            className="h-full rounded-full bg-emerald-500 transition-all"
            style={{ width: `${kpis.onTrackPercent}%` }}
          />
        </div>
      </div>
    </div>
  );
}
