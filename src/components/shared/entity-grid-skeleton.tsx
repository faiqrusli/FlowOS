import { Card } from "@/components/ui/card";

type EntityGridSkeletonProps = {
  count?: number;
};

export function EntityGridSkeleton({ count = 4 }: EntityGridSkeletonProps) {
  return (
    <div className="grid gap-3 sm:grid-cols-2">
      {Array.from({ length: count }).map((_, i) => (
        <Card
          key={i}
          className="h-28 animate-pulse bg-muted/50 ring-border/40"
        />
      ))}
    </div>
  );
}
