"use client";

import {
  forwardRef,
  useEffect,
  useImperativeHandle,
  useMemo,
  useRef,
  useState,
} from "react";
import { Repeat } from "lucide-react";
import { WorkplaceCompactHabitRow } from "@/components/workplace/workplace-compact-habit-row";
import { WorkplaceModuleCard } from "@/components/workplace/workplace-module-card";
import { computeHabitStatsMap, getCachedHabitCompletions } from "@/lib/habits";
import {
  partitionWorkplaceHabits,
  resolveWorkplaceHabitTab,
  type WorkplaceHabitTab,
} from "@/lib/workplace-habits";
import {
  scrollToTodayTarget,
  scrollToTodayTargetDeferred,
  TODAY_HABITS_SECTION_ID,
  todayHabitAnchorId,
} from "@/lib/today-in-place";
import { cn } from "@/lib/utils";
import type { Habit } from "@/types/habit";

const TABS: { id: WorkplaceHabitTab; label: string }[] = [
  { id: "incomplete", label: "Incomplete" },
  { id: "missed", label: "Missed" },
  { id: "completed", label: "Completed" },
];

export type WorkplaceHabitsCardHandle = {
  ensureHabitVisible: (habitId: string) => boolean;
};

type WorkplaceHabitsCardProps = {
  habits: Habit[];
  todayViewDate: string;
  overlay?: boolean;
  onClose?: () => void;
  onToggleComplete: (habit: Habit) => void;
  onStartFocus?: (habit: Habit) => void;
};

export const WorkplaceHabitsCard = forwardRef<
  WorkplaceHabitsCardHandle,
  WorkplaceHabitsCardProps
>(function WorkplaceHabitsCard(
  { habits, todayViewDate, overlay = false, onClose, onToggleComplete, onStartFocus },
  ref
) {
  const [tab, setTab] = useState<WorkplaceHabitTab>("incomplete");
  const pendingScrollIdRef = useRef<string | null>(null);
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

  useImperativeHandle(
    ref,
    () => ({
      ensureHabitVisible(habitId: string) {
        const habit = habits.find((item) => item.id === habitId);
        if (!habit) return false;

        const targetTab = resolveWorkplaceHabitTab(habit, habits, todayViewDate);
        const anchorId = todayHabitAnchorId(habitId);

        if (!targetTab) {
          scrollToTodayTarget(TODAY_HABITS_SECTION_ID);
          return false;
        }

        if (tab === targetTab) {
          return scrollToTodayTarget(anchorId);
        }

        pendingScrollIdRef.current = anchorId;
        setTab(targetTab);
        return true;
      },
    }),
    [habits, tab, todayViewDate]
  );

  useEffect(() => {
    const anchorId = pendingScrollIdRef.current;
    if (!anchorId) return;

    pendingScrollIdRef.current = null;
    scrollToTodayTargetDeferred(anchorId);
  }, [tab]);

  return (
    <WorkplaceModuleCard
      moduleId="habits"
      anchorId={TODAY_HABITS_SECTION_ID}
      title="Today's Habits"
      titleIcon={Repeat}
      titleMeta={titleMeta}
      overlay={overlay}
      onClose={onClose}
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
                  ? "flow-selected text-foreground"
                  : "text-muted-foreground hover:bg-surface-hover hover:text-foreground"
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
});
