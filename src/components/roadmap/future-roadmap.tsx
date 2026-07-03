import { Badge } from "@/components/ui/badge";
import {
  futureRoadmapItems,
  ROADMAP_STATUS_LABELS,
  type FutureRoadmapItem,
  type RoadmapStatus,
} from "@/lib/future-roadmap";
import { cn } from "@/lib/utils";

type FutureRoadmapProps = {
  items?: FutureRoadmapItem[];
  compact?: boolean;
  className?: string;
};

function statusBadgeClass(status: RoadmapStatus): string {
  switch (status) {
    case "in-development":
      return "border-violet-200 bg-violet-50 text-violet-800 dark:border-violet-400/30 dark:bg-violet-500/12 dark:text-violet-200";
    case "researching":
      return "border-sky-200 bg-sky-50 text-sky-800 dark:border-sky-400/30 dark:bg-sky-500/12 dark:text-sky-200";
    default:
      return "border-border/50 bg-muted/35 text-foreground/85";
  }
}

function RoadmapRow({ item, compact }: { item: FutureRoadmapItem; compact?: boolean }) {
  const Icon = item.icon;

  return (
    <li
      className={cn(
        "flex gap-3",
        compact ? "py-2.5" : "rounded-lg border border-border/60 bg-muted/20 px-3 py-3"
      )}
    >
      <div className="flex size-8 shrink-0 items-center justify-center rounded-md bg-background ring-1 ring-border/60">
        <Icon className="size-4 text-muted-foreground stroke-[1.5]" />
      </div>
      <div className="min-w-0 flex-1">
        <div className="flex flex-wrap items-center gap-2">
          <p className="text-sm font-medium text-foreground">{item.title}</p>
          <Badge
            variant="outline"
            className={cn("text-[10px]", statusBadgeClass(item.status))}
          >
            {ROADMAP_STATUS_LABELS[item.status]}
          </Badge>
        </div>
        <p className="mt-0.5 text-xs leading-relaxed text-muted-foreground">
          {item.description}
        </p>
      </div>
    </li>
  );
}

export function FutureRoadmap({
  items = futureRoadmapItems,
  compact = false,
  className,
}: FutureRoadmapProps) {
  return (
    <ul className={cn(compact ? "divide-y divide-border/60" : "space-y-2", className)}>
      {items.map((item) => (
        <RoadmapRow key={item.id} item={item} compact={compact} />
      ))}
    </ul>
  );
}
