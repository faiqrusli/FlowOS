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
          className="h-28 animate-pulse bg-neutral-100 ring-neutral-200/80"
        />
      ))}
    </div>
  );
}
