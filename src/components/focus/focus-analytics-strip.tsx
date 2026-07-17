"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  formatFocusHourLabel,
  type FocusAnalytics,
} from "@/lib/focus-analytics";
import { formatDuration } from "@/lib/focus-utils";

type FocusAnalyticsStripProps = {
  analytics: FocusAnalytics;
  loading?: boolean;
};

const METRICS: {
  key: keyof FocusAnalytics;
  label: string;
  format: (value: FocusAnalytics[keyof FocusAnalytics]) => string;
}[] = [
  {
    key: "weeklyFocusSeconds",
    label: "Weekly trend",
    format: (value) => formatDuration(value as number),
  },
  {
    key: "monthlyFocusSeconds",
    label: "Monthly trend",
    format: (value) => formatDuration(value as number),
  },
  {
    key: "bestFocusHour",
    label: "Best focus hour",
    format: (value) => formatFocusHourLabel(value as number | null),
  },
  {
    key: "longestSessionSeconds",
    label: "Longest session",
    format: (value) => formatDuration(value as number),
  },
  {
    key: "averageFocusSeconds",
    label: "Avg focus",
    format: (value) => formatDuration(value as number),
  },
  {
    key: "averageBreakSeconds",
    label: "Avg break",
    format: (value) => formatDuration(value as number),
  },
  {
    key: "focusStreakDays",
    label: "Focus streak",
    format: (value) => `${value}d`,
  },
  {
    key: "productivityScore",
    label: "Productivity score",
    format: (value) => (value === null ? "Coming soon" : String(value)),
  },
];

export function FocusAnalyticsStrip({
  analytics,
  loading,
}: FocusAnalyticsStripProps) {
  return (
    <Card className="border-border-subtle bg-surface-base shadow-none">
      <CardHeader className="pb-3">
        <CardTitle className="text-base">Analytics</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {METRICS.map((metric) => (
            <div
              key={metric.key}
              className="rounded-lg border border-border/30 bg-surface-raised px-3 py-2.5"
            >
              <p className="text-[11px] text-muted-foreground">{metric.label}</p>
              <p className="mt-0.5 text-sm font-semibold tabular-nums text-foreground">
                {loading ? "—" : metric.format(analytics[metric.key])}
              </p>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
