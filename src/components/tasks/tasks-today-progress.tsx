type TasksTodayProgressProps = {
  completed: number;
  total: number;
  variant?: "standalone" | "embedded";
};

export function TasksTodayProgress({
  completed,
  total,
  variant = "standalone",
}: TasksTodayProgressProps) {
  const percent = total === 0 ? 0 : Math.round((completed / total) * 100);

  return (
    <section
      className={
        variant === "standalone"
          ? "space-y-3 rounded-xl border-0 bg-surface-section px-5 py-4"
          : "space-y-2"
      }
    >
      <p
        className={
          variant === "standalone"
            ? "text-sm font-semibold text-foreground"
            : "text-xs font-medium uppercase tracking-wide text-muted-foreground"
        }
      >
        Today&apos;s Progress
      </p>
      <div
        className="h-2.5 w-full overflow-hidden rounded-full bg-muted"
        role="progressbar"
        aria-valuenow={percent}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-label={`${percent}% of today's tasks completed`}
      >
        <div
          className="h-full rounded-full bg-primary transition-all duration-300"
          style={{ width: `${percent}%` }}
        />
      </div>
      <p className="text-sm text-muted-foreground">
        <span className="font-medium text-foreground">
          {completed} / {total} Completed
        </span>
        {" · "}
        {percent}%
      </p>
    </section>
  );
}
