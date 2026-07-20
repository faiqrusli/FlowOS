"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { CalendarRange, Eye } from "lucide-react";
import { ReflectionDetailContent } from "@/components/reflection/reflection-detail-content";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { fetchReflectionDayReview } from "@/lib/reflection-day-review";
import type { ReflectionDayReview } from "@/lib/reflection-day-review";
import {
  buildReflectionPreview,
  formatReflectionSavedAt,
  formatSummaryLine,
  getReflectionDayLabel,
} from "@/lib/reflection-storage";
import { type as typography } from "@/lib/typography";
import { cn } from "@/lib/utils";
import type { Reflection } from "@/types/reflection";

type ReflectionHistoryProps = {
  reflections: Reflection[];
  loading?: boolean;
  todayDate: string;
  todayReview?: ReflectionDayReview | null;
};

export function ReflectionHistory({
  reflections,
  loading,
  todayDate,
  todayReview,
}: ReflectionHistoryProps) {
  const [viewing, setViewing] = useState<Reflection | null>(null);
  const [viewingReview, setViewingReview] = useState<ReflectionDayReview | null>(
    null
  );
  const [reviewLoading, setReviewLoading] = useState(false);

  const todayReflection = reflections.find(
    (r) => r.reflection_date === todayDate
  );
  const pastReflections = reflections.filter(
    (r) => r.reflection_date !== todayDate
  );

  useEffect(() => {
    if (!viewing) return;

    let cancelled = false;

    async function loadReview() {
      if (viewing!.reflection_date === todayDate && todayReview) {
        setViewingReview(todayReview);
        setReviewLoading(false);
        return;
      }

      setReviewLoading(true);
      setViewingReview(null);

      try {
        const review = await fetchReflectionDayReview(viewing!.reflection_date);
        if (!cancelled) setViewingReview(review);
      } catch {
        if (!cancelled) setViewingReview(null);
      } finally {
        if (!cancelled) setReviewLoading(false);
      }
    }

    void loadReview();

    return () => {
      cancelled = true;
    };
  }, [viewing, todayDate, todayReview]);

  return (
    <>
      <section className="rounded-xl bg-surface-section px-4 py-5 sm:px-5">
        <h2 className={typography.sectionTitle}>Reflection history</h2>
        <div className="mt-4 space-y-6">
          {loading ? (
            <p className={typography.bodyMuted}>Loading history…</p>
          ) : (
            <>
              <div className="space-y-3">
                <h3 className="text-sm font-medium text-foreground-secondary">
                  Today
                </h3>
                {todayReflection ? (
                  <ReflectionHistoryItem
                    reflection={todayReflection}
                    todayDate={todayDate}
                    summaryLine={
                      todayReview
                        ? formatSummaryLine(todayReview.summary)
                        : undefined
                    }
                    onView={() => setViewing(todayReflection)}
                  />
                ) : (
                  <p
                    className={cn(
                      typography.bodyMuted,
                      "rounded-lg bg-surface-base px-4 py-6 text-center",
                    )}
                  >
                    No reflection saved for today yet. Fill in your notes above
                    and click Save reflection.
                  </p>
                )}
              </div>

              {pastReflections.length > 0 && (
                <div className="space-y-3">
                  <h3 className="text-sm font-medium text-foreground-secondary">
                    Previous
                  </h3>
                  <ul className="space-y-2">
                    {pastReflections.map((reflection) => (
                      <li key={reflection.id}>
                        <ReflectionHistoryItem
                          reflection={reflection}
                          todayDate={todayDate}
                          onView={() => setViewing(reflection)}
                        />
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </>
          )}
        </div>

        <div className="mt-5">
          <Link
            href="/reflection/WeeklyReflection"
            className="inline-flex h-9 w-full items-center justify-center gap-2 rounded-md bg-surface-base px-4 text-sm font-medium transition-colors hover:bg-surface-hover"
          >
            <CalendarRange className="size-4" />
            Weekly reflection
          </Link>
        </div>
      </section>

      <Dialog
        open={Boolean(viewing)}
        onOpenChange={(open) => !open && setViewing(null)}
      >
        <DialogContent className="max-h-[85vh] overflow-y-auto sm:max-w-xl">
          {viewing && (
            <>
              <DialogHeader>
                <DialogTitle>Reflection review</DialogTitle>
              </DialogHeader>
              <ReflectionDetailContent
                reflection={viewing}
                review={viewingReview}
                reviewLoading={reviewLoading}
              />
            </>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}

function ReflectionHistoryItem({
  reflection,
  todayDate,
  summaryLine,
  onView,
}: {
  reflection: Reflection;
  todayDate: string;
  summaryLine?: string;
  onView: () => void;
}) {
  const isToday = reflection.reflection_date === todayDate;

  return (
    <div className="flex flex-col gap-3 rounded-lg border-0 bg-surface-base px-4 py-3 transition-colors hover:bg-surface-hover sm:flex-row sm:items-center sm:justify-between">
      <div className="min-w-0 flex-1 space-y-1">
        <div className="flex flex-wrap items-center gap-2">
          <p className="font-medium text-foreground">
            {getReflectionDayLabel(reflection.reflection_date)}
          </p>
          {isToday && (
            <Badge variant="status-success">Saved</Badge>
          )}
        </div>
        {summaryLine && (
          <p className="text-xs text-foreground-secondary">
            {summaryLine}
            <> · {formatReflectionSavedAt(reflection.created_at)}</>
          </p>
        )}
        <p className="line-clamp-2 text-sm text-foreground-secondary">
          {buildReflectionPreview(reflection)}
        </p>
      </div>
      <Button
        type="button"
        variant="secondary"
        size="sm"
        className="shrink-0 gap-1"
        onClick={onView}
      >
        <Eye className="size-4" />
        View details
      </Button>
    </div>
  );
}
