import { formatDuration } from "@/lib/focus-utils";
import { formatSummaryLine } from "@/lib/reflection-storage";
import type { ReflectionDayReview } from "@/lib/reflection-day-review";
import type { Reflection } from "@/types/reflection";

export type WeeklyReflectionBoardCard = {
  id: string;
  title: string;
  content: string;
  dayDateKey: string;
  defaultColumnKey: string;
};

export type WeeklyReflectionBoardColumn = {
  key: string;
  title: string;
  dayDateKey: string;
};

export type WeeklyReflectionDayBundle = {
  dateKey: string;
  reflection: Reflection | null;
  review: ReflectionDayReview | null;
  columns: WeeklyReflectionBoardColumn[];
  cards: WeeklyReflectionBoardCard[];
};

function textToCards(
  dayDateKey: string,
  columnKey: string,
  title: string,
  text: string,
  idPrefix: string
): WeeklyReflectionBoardCard[] {
  const trimmed = text.trim();
  if (!trimmed) return [];
  return [
    {
      id: `${dayDateKey}:${idPrefix}`,
      title,
      content: trimmed,
      dayDateKey,
      defaultColumnKey: columnKey,
    },
  ];
}

export function buildWeeklyReflectionDayBundle(
  dateKey: string,
  reflection: Reflection | null,
  review: ReflectionDayReview | null
): WeeklyReflectionDayBundle {
  const columns: WeeklyReflectionBoardColumn[] = [
    { key: "daily-review", title: "Daily Review", dayDateKey: dateKey },
    { key: "went-well", title: "What went well", dayDateKey: dateKey },
    { key: "went-wrong", title: "What went wrong", dayDateKey: dateKey },
  ];

  const cards: WeeklyReflectionBoardCard[] = [];

  if (review) {
    cards.push({
      id: `${dateKey}:daily-review:stats`,
      title: "Daily stats",
      content: formatSummaryLine(review.summary),
      dayDateKey: dateKey,
      defaultColumnKey: "daily-review",
    });
    cards.push({
      id: `${dateKey}:daily-review:missed-tasks`,
      title: "Missed tasks",
      content:
        review.remainingTasks.length > 0
          ? review.remainingTasks.map((task) => `- ${task.title}`).join("\n")
          : "All scheduled tasks completed.",
      dayDateKey: dateKey,
      defaultColumnKey: "daily-review",
    });
    cards.push({
      id: `${dateKey}:daily-review:missed-habits`,
      title: "Missed habits",
      content:
        review.missedHabits.length > 0
          ? review.missedHabits.map((habit) => `- ${habit.name}`).join("\n")
          : "All habits completed.",
      dayDateKey: dateKey,
      defaultColumnKey: "daily-review",
    });
  }

  if (reflection) {
    cards.push(
      ...textToCards(
        dateKey,
        "went-well",
        "What went well",
        reflection.went_well,
        "went-well"
      )
    );
    cards.push(
      ...textToCards(
        dateKey,
        "went-wrong",
        "What went wrong",
        reflection.went_wrong,
        "went-wrong"
      )
    );

    for (const entry of reflection.custom_entries) {
      const columnKey = `entry:${entry.id}`;
      columns.push({
        key: columnKey,
        title: entry.title,
        dayDateKey: dateKey,
      });
      cards.push({
        id: `${dateKey}:entry:${entry.id}`,
        title: entry.title,
        content: entry.content || "—",
        dayDateKey: dateKey,
        defaultColumnKey: columnKey,
      });
    }

    for (const kanban of reflection.custom_kanbans ?? []) {
      const columnKey = `kanban:${kanban.id}`;
      columns.push({
        key: columnKey,
        title: kanban.title,
        dayDateKey: dateKey,
      });
      for (const card of kanban.cards) {
        cards.push({
          id: `${dateKey}:kanban:${kanban.id}:${card.id}`,
          title: kanban.title,
          content: card.content,
          dayDateKey: dateKey,
          defaultColumnKey: columnKey,
        });
      }
    }
  }

  return {
    dateKey,
    reflection,
    review,
    columns,
    cards,
  };
}

export function formatWeeklyDayHeading(dateKey: string): string {
  const date = new Date(dateKey + "T12:00:00");
  return date.toLocaleDateString(undefined, {
    weekday: "long",
    month: "short",
    day: "numeric",
  });
}

export function formatFocusDuration(seconds: number): string {
  return formatDuration(seconds);
}
