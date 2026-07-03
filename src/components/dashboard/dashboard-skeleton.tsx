function SkeletonBlock({ className }: { className?: string }) {
  return (
    <div className={`animate-pulse rounded-md bg-muted ${className ?? ""}`} />
  );
}

export function DashboardCommandSkeleton() {
  return (
    <div className="space-y-3">
      <SkeletonBlock className="h-14 w-full rounded-lg" />
      <SkeletonBlock className="h-11 w-full rounded-lg" />
      <div className="grid gap-3 sm:grid-cols-2">
        <SkeletonBlock className="h-20 rounded-lg" />
        <SkeletonBlock className="h-20 rounded-lg" />
      </div>
      <div className="grid gap-3 sm:grid-cols-3">
        <SkeletonBlock className="h-16 rounded-lg" />
        <SkeletonBlock className="h-16 rounded-lg" />
        <SkeletonBlock className="h-16 rounded-lg" />
      </div>
    </div>
  );
}
