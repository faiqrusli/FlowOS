import { ReflectionDayReviewSections } from "@/components/reflection/reflection-day-review-sections";
import { type as typography } from "@/lib/typography";
import type { ReflectionDayReview } from "@/lib/reflection-day-review";

type TodaySummaryCardProps = {
  review: ReflectionDayReview | null;
  loading?: boolean;
};

export function TodaySummaryCard({ review, loading }: TodaySummaryCardProps) {
  return (
    <section className="rounded-xl bg-surface-section px-4 py-5 sm:px-5">
      <h2 className={typography.sectionTitle}>Daily review</h2>
      <div className="mt-4">
        <ReflectionDayReviewSections
          review={review}
          loading={loading}
          dayLabel="Today"
          compactSummary
        />
      </div>
    </section>
  );
}
