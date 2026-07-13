import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ReflectionDayReviewSections } from "@/components/reflection/reflection-day-review-sections";
import type { ReflectionDayReview } from "@/lib/reflection-day-review";

type TodaySummaryCardProps = {
  review: ReflectionDayReview | null;
  loading?: boolean;
};

export function TodaySummaryCard({ review, loading }: TodaySummaryCardProps) {
  return (
    <Card className="border-border-subtle shadow-none">
      <CardHeader>
        <CardTitle>Daily review</CardTitle>
      </CardHeader>
      <CardContent>
        <ReflectionDayReviewSections
          review={review}
          loading={loading}
          dayLabel="Today"
          compactSummary
        />
      </CardContent>
    </Card>
  );
}
