"use client";

import type { ReactNode } from "react";
import { ReflectionCollapsibleSection } from "@/components/reflection/reflection-collapsible-section";
import { formatTimeShort } from "@/lib/date-utils";
import { formatSummaryLine } from "@/lib/reflection-storage";
import type { ReflectionDayReview } from "@/lib/reflection-day-review";
import type { Habit } from "@/types/habit";
import type { Task } from "@/types/task";

type ReflectionDayReviewSectionsProps = {
  review: ReflectionDayReview | null;
  loading?: boolean;
  dayLabel?: string;
  compactSummary?: boolean;
};

function ReviewList({
  items,
  emptyMessage,
  renderItem,
}: {
  items: { id: string }[];
  emptyMessage: string;
  renderItem: (item: { id: string }) => ReactNode;
}) {
  if (items.length === 0) {
    return <p className="text-sm text-muted-foreground">{emptyMessage}</p>;
  }

  return (
    <ul className="space-y-1.5">
      {items.map((item) => (
        <li key={item.id}>{renderItem(item)}</li>
      ))}
    </ul>
  );
}

function TaskReviewLine({ task }: { task: Task }) {
  const time = formatTimeShort(task.scheduled_time);

  return (
    <span className="text-sm text-foreground">
      {task.title}
      {time ? (
        <span className="text-foreground-secondary"> · {time}</span>
      ) : null}
    </span>
  );
}

function HabitReviewLine({ habit }: { habit: Habit }) {
  const time = formatTimeShort(habit.scheduled_time);

  return (
    <span className="text-sm text-foreground">
      {habit.name}
      {time ? (
        <span className="text-foreground-secondary"> · {time}</span>
      ) : null}
    </span>
  );
}

export function ReflectionDayReviewSections({
  review,
  loading,
  dayLabel,
  compactSummary = false,
}: ReflectionDayReviewSectionsProps) {
  if (loading) {
    return (
      <p className="text-sm text-muted-foreground">Loading daily review…</p>
    );
  }

  if (!review) {
    return null;
  }

  const { summary } = review;

  return (
    <div className="space-y-3">
      {(dayLabel || compactSummary) && (
        <div className="space-y-1">
          {dayLabel && (
            <p className="text-sm font-semibold text-foreground">{dayLabel}</p>
          )}
          <p className="text-sm text-foreground-secondary">
            {formatSummaryLine(summary)}
          </p>
        </div>
      )}

      <div className="space-y-2">
        <ReflectionCollapsibleSection
          title="Completed Tasks"
          count={review.completedTasks.length}
        >
          <ReviewList
            items={review.completedTasks}
            emptyMessage="No tasks completed on this day."
            renderItem={(item) => (
              <TaskReviewLine task={item as Task} />
            )}
          />
        </ReflectionCollapsibleSection>

        <ReflectionCollapsibleSection
          title="Remaining Tasks"
          count={review.remainingTasks.length}
        >
          <ReviewList
            items={review.remainingTasks}
            emptyMessage="All scheduled tasks were completed."
            renderItem={(item) => (
              <TaskReviewLine task={item as Task} />
            )}
          />
        </ReflectionCollapsibleSection>

        <ReflectionCollapsibleSection
          title="Completed Habits"
          count={review.completedHabits.length}
        >
          <ReviewList
            items={review.completedHabits}
            emptyMessage="No habits completed on this day."
            renderItem={(item) => (
              <HabitReviewLine habit={item as Habit} />
            )}
          />
        </ReflectionCollapsibleSection>

        <ReflectionCollapsibleSection
          title="Missed Habits"
          count={review.missedHabits.length}
        >
          <ReviewList
            items={review.missedHabits}
            emptyMessage="No missed habits — great consistency."
            renderItem={(item) => (
              <HabitReviewLine habit={item as Habit} />
            )}
          />
        </ReflectionCollapsibleSection>
      </div>
    </div>
  );
}
