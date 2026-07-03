"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatDuration } from "@/lib/focus-utils";
import type { FocusTodaySummary } from "@/lib/focus-analytics";

type FocusTodaySummaryCardProps = {
  summary: FocusTodaySummary;
  loading?: boolean;
};

export function FocusTodaySummaryCard({
  summary,
  loading,
}: FocusTodaySummaryCardProps) {
  return (
    <Card className="border-border/40 bg-card/90">
      <CardHeader className="pb-3">
        <CardTitle className="text-base">Today&apos;s focus</CardTitle>
      </CardHeader>
      <CardContent className="grid grid-cols-2 gap-3 text-sm">
        <div>
          <p className="text-xs text-muted-foreground">Focused</p>
          <p className="mt-0.5 font-semibold tabular-nums">
            {loading ? "—" : formatDuration(summary.totalFocusSeconds)}
          </p>
        </div>
        <div>
          <p className="text-xs text-muted-foreground">Sessions</p>
          <p className="mt-0.5 font-semibold tabular-nums">
            {loading ? "—" : summary.sessionCount}
          </p>
        </div>
        <div>
          <p className="text-xs text-muted-foreground">Breaks</p>
          <p className="mt-0.5 font-semibold tabular-nums">
            {loading ? "—" : summary.breakCount}
          </p>
        </div>
        <div>
          <p className="text-xs text-muted-foreground">Longest</p>
          <p className="mt-0.5 font-semibold tabular-nums">
            {loading ? "—" : formatDuration(summary.longestSessionSeconds)}
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
