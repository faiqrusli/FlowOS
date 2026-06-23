"use client";

import { Label } from "@/components/ui/label";
import { ReflectionCollapsibleSection } from "@/components/reflection/reflection-collapsible-section";
import { ReflectionDayReviewSections } from "@/components/reflection/reflection-day-review-sections";
import {
  formatReflectionSavedAt,
  getReflectionDayLabel,
} from "@/lib/reflection-storage";
import type { ReflectionDayReview } from "@/lib/reflection-day-review";
import type { Reflection } from "@/types/reflection";

type ReflectionDetailContentProps = {
  reflection: Reflection;
  review: ReflectionDayReview | null;
  reviewLoading?: boolean;
};

export function ReflectionDetailContent({
  reflection,
  review,
  reviewLoading,
}: ReflectionDetailContentProps) {
  const customCount = reflection.custom_entries.length;

  return (
    <div className="space-y-5 text-sm">
      <div className="space-y-1">
        <p className="text-base font-semibold text-neutral-900">
          {getReflectionDayLabel(reflection.reflection_date)}
        </p>
        <p className="text-xs text-muted-foreground">
          Saved at {formatReflectionSavedAt(reflection.created_at)}
        </p>
      </div>

      <ReflectionDayReviewSections
        review={review}
        loading={reviewLoading}
        compactSummary
      />

      <div className="space-y-2">
        <Label>What went well</Label>
        <p className="whitespace-pre-wrap rounded-lg bg-neutral-50 p-3 text-neutral-800">
          {reflection.went_well.trim() || "—"}
        </p>
      </div>

      <div className="space-y-2">
        <Label>What went wrong</Label>
        <p className="whitespace-pre-wrap rounded-lg bg-neutral-50 p-3 text-neutral-800">
          {reflection.went_wrong.trim() || "—"}
        </p>
      </div>

      <ReflectionCollapsibleSection
        title="Custom entries"
        count={customCount}
        defaultOpen={customCount > 0 && customCount <= 3}
      >
        {customCount === 0 ? (
          <p className="text-sm text-muted-foreground">No custom entries.</p>
        ) : (
          <ul className="space-y-2">
            {reflection.custom_entries.map((entry) => (
              <li
                key={entry.id}
                className="rounded-lg border border-neutral-100 bg-neutral-50 px-3 py-2"
              >
                <p className="font-medium text-neutral-900">{entry.title}</p>
                <p className="text-muted-foreground">{entry.content || "—"}</p>
              </li>
            ))}
          </ul>
        )}
      </ReflectionCollapsibleSection>
    </div>
  );
}
