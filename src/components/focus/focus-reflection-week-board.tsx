"use client";

import { useMemo } from "react";
import { getTodayDateString, shiftDateKey } from "@/lib/date-utils";
import {
  FOCUS_REFLECTION_KANBAN_TITLE,
  isFocusReflectionEntry,
} from "@/lib/focus-reflection";
import { getReflectionDayLabel } from "@/lib/reflection-storage";
import { type as typography } from "@/lib/typography";
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
      const reflection = reflections.find(
        (item) => item.reflection_date === date,
      );
      const focusEntry = reflection?.custom_entries.find((entry) =>
        isFocusReflectionEntry(entry.title),
      );
      const focusBoard = reflection?.custom_kanbans.find(
        (board) =>
          board.title.trim().toLowerCase() ===
          FOCUS_REFLECTION_KANBAN_TITLE.toLowerCase(),
      );
      const latestCard = focusBoard?.cards[focusBoard.cards.length - 1];
      const preview = latestCard?.content?.trim() ?? focusEntry?.content?.trim() ?? "";

      days.push({
        date,
        label: getReflectionDayLabel(date),
        hasFocusReflection: Boolean(preview),
        preview,
      });
    }

    return days;
  }, [reflections]);

  return (
    <section className="rounded-xl bg-surface-section px-4 py-5 sm:px-5">
      <h2 className={typography.sectionTitle}>Focus reflection history</h2>
      <div className="mt-4">
        {loading ? (
          <p className={typography.bodyMuted}>Loading reflections…</p>
        ) : (
          <div className="grid grid-cols-2 gap-2 sm:grid-cols-4 lg:grid-cols-7">
            {weekDays.map((day) => (
              <div
                key={day.date}
                className={cn(
                  "flex min-h-[7rem] flex-col rounded-lg p-2.5 text-xs",
                  day.hasFocusReflection
                    ? "bg-surface-selected"
                    : "bg-surface-base",
                )}
              >
                <p className="font-semibold text-foreground">{day.label}</p>
                <p className="mt-0.5 text-[10px] text-foreground-secondary">
                  {day.date}
                </p>
                {day.hasFocusReflection ? (
                  <p className="mt-2 line-clamp-4 flex-1 text-[11px] leading-relaxed text-foreground-secondary">
                    {day.preview}
                  </p>
                ) : (
                  <p className="mt-2 flex-1 text-[10px] text-inactive">
                    No Focus reflection
                  </p>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
