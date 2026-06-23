export function ScheduleSkeleton() {
  return (
    <div className="animate-pulse space-y-5">
      <div className="h-20 rounded-2xl border border-border/40 bg-muted/30" />
      <div className="h-14 rounded-2xl border border-border/40 bg-muted/30" />
      <div className="flex flex-col gap-4 xl:flex-row">
        <div className="h-[600px] min-w-0 flex-1 rounded-2xl border border-border/40 bg-muted/20 xl:basis-[76%]" />
        <div className="h-[600px] w-full rounded-2xl border border-border/40 bg-muted/20 xl:basis-[24%] xl:max-w-[300px]" />
      </div>
    </div>
  );
}
