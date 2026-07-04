function SkeletonBlock({ className }: { className?: string }) {
  return (
    <div className={`animate-pulse rounded-md bg-muted ${className ?? ""}`} />
  );
}

export default function MainLoading() {
  return (
    <div className="space-y-4" aria-busy="true" aria-label="Loading page">
      <SkeletonBlock className="h-8 w-40" />
      <SkeletonBlock className="h-20 w-full rounded-lg" />
      <SkeletonBlock className="h-11 w-full rounded-lg" />
      <div className="grid gap-3 lg:grid-cols-[1fr_280px]">
        <SkeletonBlock className="h-72 rounded-lg" />
        <SkeletonBlock className="hidden h-72 rounded-lg lg:block" />
      </div>
    </div>
  );
}
