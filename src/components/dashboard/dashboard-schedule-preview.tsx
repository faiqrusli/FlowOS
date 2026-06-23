import {
  DashboardEmptyLine,
  DashboardPanel,
} from "@/components/dashboard/dashboard-card-shell";
import { getUpcomingSchedulePreview } from "@/lib/dashboard-command";
import { type } from "@/lib/typography";
import { cn } from "@/lib/utils";
import type { ScheduleItem } from "@/types/schedule";

const PREVIEW_LIMIT = 3;

type DashboardSchedulePreviewProps = {
  items: ScheduleItem[];
};

export function DashboardSchedulePreview({
  items,
}: DashboardSchedulePreviewProps) {
  const upcoming = getUpcomingSchedulePreview(items, PREVIEW_LIMIT);

  return (
    <DashboardPanel title="Upcoming" href="/schedule" actionLabel="Schedule">
      {upcoming.length === 0 ? (
        <DashboardEmptyLine message="Nothing scheduled ahead." />
      ) : (
        <ul className="space-y-2">
          {upcoming.map((item) => (
            <li key={item.id} className="flex items-center gap-2.5">
              <span className={cn("w-11 shrink-0 tabular-nums", type.meta)}>
                {item.time ?? "—"}
              </span>
              <span className={cn("min-w-0 flex-1 truncate", type.contentPrimary)}>
                {item.title}
              </span>
              <span
                className={cn(
                  type.meta,
                  "shrink-0 uppercase tracking-wide",
                  item.type === "habit" ? "text-orange-700/80" : "text-muted-foreground"
                )}
              >
                {item.type === "habit" ? "Habit" : "Task"}
              </span>
            </li>
          ))}
        </ul>
      )}
    </DashboardPanel>
  );
}
