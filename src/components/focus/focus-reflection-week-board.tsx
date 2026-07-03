"use client";

import { useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getTodayDateString, shiftDateKey } from "@/lib/date-utils";
import { isFocusReflectionEntry } from "@/lib/focus-reflection";
import { getReflectionDayLabel } from "@/lib/reflection-storage";
import { cn } from "@/lib/utils";
import type { Reflection } from "@/types/reflection";

type FocusReflectionWeekBoardProps = {
  reflections: Reflection[];
  loading?: boolean;
};

type WeekDay = {
  date: string;
  label: string;
  hasFocusReflection: boolean;
  preview: string;
};

export function FocusReflectionWeekBoard({
  reflections,
  loading,
}: FocusReflectionWeekBoardProps) {
  const weekDays = useMemo(() => {
    const today = getTodayDateString();
    const days: WeekDay[] = [];

    for (let offset = 6; offset >= 0; offset -= 1) {
      const date = shiftDateKey(today, -offset);
      const reflection = reflections.find((item) => item.reflection_date === date);
      const focusEntry = reflection?.custom_entries.find((entry) =>
        isFocusReflectionEntry(entry.title)
      );

      days.push({
        date,
        label: getReflectionDayLabel(date),
        hasFocusReflection: Boolean(focusEntry?.content?.trim()),
        preview: focusEntry?.content?.trim() ?? "",
      });
    }

    return days;
  }, [reflections]);

  return (
    <Card className="border-border/40 bg-card/90">
      <CardHeader className="pb-3">
        <CardTitle className="text-base">Focus reflection history</CardTitle>
      </CardHeader>
      <CardContent>
        {loading ? (
          <p className="text-sm text-muted-foreground">Loading reflections…</p>
        ) : (
          <div className="grid grid-cols-2 gap-2 sm:grid-cols-4 lg:grid-cols-7">
            {weekDays.map((day) => (
              <div
                key={day.date}
                className={cn(
                  "flex min-h-[7rem] flex-col rounded-xl border p-2.5 text-xs",
                  day.hasFocusReflection
                    ? "border-selected-border bg-selected"
                    : "border-border/30 bg-muted/10"
                )}
              >
                <p className="font-semibold text-foreground">{day.label}</p>
                <p className="mt-0.5 text-[10px] text-muted-foreground">
                  {day.date}
                </p>
                {day.hasFocusReflection ? (
                  <p className="mt-2 line-clamp-4 flex-1 text-[11px] leading-relaxed text-foreground/85">
                    {day.preview}
                  </p>
                ) : (
                  <p className="mt-2 flex-1 text-[10px] text-muted-foreground/70">
                    No Focus reflection
                  </p>
                )}
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
