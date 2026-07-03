import type { ScheduleSummary } from "@/types/schedule";

type ScheduleSummaryProps = {
  summary: ScheduleSummary;
};

export function ScheduleSummaryCard({ summary }: ScheduleSummaryProps) {
  return (
    <section className="space-y-4 rounded-xl border border-border/50 bg-card px-5 py-4">
      <div className="space-y-1">
        <h2 className="text-base font-semibold text-foreground">
          Today&apos;s Timeline
        </h2>
        <p className="text-sm text-muted-foreground">
          {summary.completed} / {summary.total} completed
        </p>
      </div>

      <div className="grid gap-3 sm:grid-cols-2">
        <div className="rounded-lg bg-muted/35 px-3 py-2.5">
          <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
            Next
          </p>
          {summary.nextItem ? (
            <p className="mt-1 text-sm font-medium text-foreground">
              <span className="tabular-nums text-muted-foreground">
                {summary.nextItem.time ?? "—"}
              </span>{" "}
              {summary.nextItem.title}
            </p>
          ) : (
            <p className="mt-1 text-sm text-muted-foreground">
              Nothing left on the timeline.
            </p>
          )}
        </div>

        <div className="rounded-lg bg-muted/35 px-3 py-2.5">
          <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
            Remaining
          </p>
          <p className="mt-1 text-sm font-medium text-foreground">
            {summary.remaining} {summary.remaining === 1 ? "item" : "items"}
          </p>
        </div>
      </div>
    </section>
  );
}
