"use client";

import { useMemo, useState } from "react";
import { WorkplaceCompactHabitRow } from "@/components/workplace/workplace-compact-habit-row";
import { WorkplaceModuleCard } from "@/components/workplace/workplace-module-card";
import { computeHabitStatsMap, getCachedHabitCompletions } from "@/lib/habits";
import {
  partitionWorkplaceHabits,
  type WorkplaceHabitTab,
} from "@/lib/workplace-habits";
import { cn } from "@/lib/utils";
import type { Habit } from "@/types/habit";

const TABS: { id: WorkplaceHabitTab; label: string }[] = [
  { id: "incomplete", label: "Incomplete" },
  { id: "missed", label: "Missed" },
  { id: "completed", label: "Completed" },
];

type WorkplaceHabitsCardProps = {
  habits: Habit[];
  todayViewDate: string;
  onToggleComplete: (habit: Habit) => void;
  onStartFocus?: (habit: Habit) => void;
};

export function WorkplaceHabitsCard({
  habits,
  todayViewDate,
  onToggleComplete,
  onStartFocus,
}: WorkplaceHabitsCardProps) {
  const [tab, setTab] = useState<WorkplaceHabitTab>("incomplete");
  const sections = useMemo(
    () => partitionWorkplaceHabits(habits, todayViewDate),
    [habits, todayViewDate]
  );
  const statsMap = useMemo(
    () => computeHabitStatsMap(habits, getCachedHabitCompletions()),
    [habits]
  );

  const counts: Record<WorkplaceHabitTab, number> = {
    incomplete: sections.incomplete.length,
    missed: sections.missed.length,
    completed: sections.completed.length,
  };

  const list = sections[tab];
  const completedCount = habits.filter((habit) => habit.completed).length;
  const titleMeta = `${completedCount}/${habits.length}`;

  return (
    <WorkplaceModuleCard
      moduleId="habits"
      title="Today's Habits"
      titleMeta={titleMeta}
      className="min-h-0 overflow-hidden"
      bodyClassName="flex min-h-0 flex-1 flex-col overflow-hidden"
    >
      <div className="flex h-full min-h-0 flex-col">
        <div className="flex shrink-0 flex-wrap gap-1 border-b border-divider px-2 py-1.5">
          {TABS.map((item) => (
            <button
              key={item.id}
              type="button"
              onClick={() => setTab(item.id)}
              className={cn(
                "rounded-md px-2 py-0.5 text-[13px] font-medium transition-[background-color,color,box-shadow] duration-150",
                tab === item.id
                  ? "bg-selected text-foreground shadow-[inset_0_0_0_1px_var(--selected-border)]"
                  : "text-muted-foreground hover:bg-muted/60 hover:text-foreground"
              )}
            >
              {item.label} ({counts[item.id]})
            </button>
          ))}
        </div>
        <div className="min-h-0 flex-1 space-y-1 overflow-y-auto p-1.5">
          {list.length === 0 ? (
            <p className="flow-empty mx-1 my-1.5 px-2 py-4 text-center text-[13px] text-muted-foreground/70">
              No habits here
            </p>
          ) : (
            list.map((habit) => (
              <WorkplaceCompactHabitRow
                key={habit.id}
                habit={habit}
                streak={statsMap[habit.id]?.streak ?? 0}
                onToggleComplete={() => onToggleComplete(habit)}
                onStartFocus={
                  onStartFocus ? () => onStartFocus(habit) : undefined
                }
              />
            ))
          )}
        </div>
      </div>
    </WorkplaceModuleCard>
  );
}
