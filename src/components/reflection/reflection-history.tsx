"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { CalendarRange, Eye } from "lucide-react";
import { ReflectionDetailContent } from "@/components/reflection/reflection-detail-content";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
      <Card>
        <CardHeader>
          <CardTitle>Reflection history</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {loading ? (
            <p className="text-sm text-muted-foreground">Loading history…</p>
          ) : (
            <>
              <section className="space-y-3">
                <h3 className="text-sm font-medium text-muted-foreground">
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
                  <p className="rounded-lg border border-dashed border-border/50 bg-card px-4 py-6 text-center text-sm text-muted-foreground">
                    No reflection saved for today yet. Fill in your notes above
                    and click Save reflection.
                  </p>
                )}
              </section>

              {pastReflections.length > 0 && (
                <section className="space-y-3">
                  <h3 className="text-sm font-medium text-muted-foreground">
                    Previous
                  </h3>
                  <ul className="divide-y divide-border/40">
                    {pastReflections.map((reflection) => (
                      <li
                        key={reflection.id}
                        className="py-4 first:pt-0 last:pb-0"
                      >
                        <ReflectionHistoryItem
                          reflection={reflection}
                          todayDate={todayDate}
                          onView={() => setViewing(reflection)}
                        />
                      </li>
                    ))}
                  </ul>
                </section>
              )}
            </>
          )}
        </CardContent>
        <div className="border-t border-border/40 px-6 pb-6 pt-4">
          <Link
            href="/reflection/WeeklyReflection"
            className="inline-flex h-9 w-full items-center justify-center gap-2 rounded-md border border-input bg-background px-4 text-sm font-medium shadow-xs transition-colors hover:bg-accent hover:text-accent-foreground"
          >
            <CalendarRange className="size-4" />
            Weekly reflection
          </Link>
        </div>
      </Card>

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
    <div className="flex flex-col gap-3 rounded-lg border border-border/40 bg-card px-4 py-3 sm:flex-row sm:items-center sm:justify-between">
      <div className="min-w-0 flex-1 space-y-1">
        <div className="flex flex-wrap items-center gap-2">
          <p className="font-medium text-foreground">
            {getReflectionDayLabel(reflection.reflection_date)}
          </p>
          {isToday && (
            <Badge
              variant="outline"
              className="border-green-600 text-green-700"
            >
              Saved
            </Badge>
          )}
        </div>
        {summaryLine && (
          <p className="text-xs text-muted-foreground">
            {summaryLine}
            <> · {formatReflectionSavedAt(reflection.created_at)}</>
          </p>
        )}
        <p className="line-clamp-2 text-sm text-muted-foreground">
          {buildReflectionPreview(reflection)}
        </p>
      </div>
      <Button
        type="button"
        variant="outline"
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
