import type { ScheduleSummary } from "@/types/schedule";

type ScheduleSummaryProps = {
  summary: ScheduleSummary;
};

export function ScheduleSummaryCard({ summary }: ScheduleSummaryProps) {
  return (
    <section className="space-y-4 rounded-xl border border-neutral-200 bg-white px-5 py-4">
      <div className="space-y-1">
        <h2 className="text-base font-semibold text-neutral-900">
          Today&apos;s Timeline
        </h2>
        <p className="text-sm text-muted-foreground">
          {summary.completed} / {summary.total} completed
        </p>
      </div>

      <div className="grid gap-3 sm:grid-cols-2">
        <div className="rounded-lg bg-neutral-50 px-3 py-2.5">
          <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
            Next
          </p>
          {summary.nextItem ? (
            <p className="mt-1 text-sm font-medium text-neutral-900">
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

        <div className="rounded-lg bg-neutral-50 px-3 py-2.5">
          <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
            Remaining
          </p>
          <p className="mt-1 text-sm font-medium text-neutral-900">
            {summary.remaining} {summary.remaining === 1 ? "item" : "items"}
          </p>
        </div>
      </div>
    </section>
  );
}
