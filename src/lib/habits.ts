import { supabase } from "@/lib/supabase";
import { requireUserId } from "@/lib/auth";
import { getTodayDateString, getTodayDayAbbrev, formatTimeShort } from "@/lib/date-utils";
import {
  getHabitCompletionDates,
  loadHabitCompletions,
  recordHabitCompletion,
  reconcileCompletionsWithHabits,
  removeAllHabitCompletions,
  removeHabitCompletion,
} from "@/lib/habit-completions-store";
import { DAYS_OF_WEEK, type Habit, type HabitInsert, type HabitUpdate } from "@/types/habit";

export class HabitsError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "HabitsError";
  }
}

export { isHabitScheduledOnDate } from "@/lib/habit-stats";
export {
  computeHabitStats,
  computeHabitStatsMap,
} from "@/lib/habit-stats";
export {
  loadHabitCompletions,
  getCachedHabitCompletions,
  reconcileCompletionsWithHabits,
} from "@/lib/habit-completions-store";

export async function fetchHabits(): Promise<Habit[]> {
  const userId = await requireUserId();
  const { data, error } = await supabase
    .from("habits")
    .select("*")
    .eq("user_id", userId)
    .order("created_at", { ascending: false });

  if (error) {
    throw new HabitsError(error.message);
  }

  return (data ?? []).map((habit) => ({
    ...habit,
    track_with_focus: habit.track_with_focus ?? false,
  }));
}

export function isHabitScheduledToday(habit: Habit, dayAbbrev = getTodayDayAbbrev()): boolean {
  if (!habit.days_of_week?.length) return true;
  return habit.days_of_week.includes(dayAbbrev);
}

function isHabitCompletedToday(habit: Habit): boolean {
  const today = getTodayDateString();
  return isHabitCompletedOnDate(habit, today);
}

export function isHabitCompletedOnDate(habit: Habit, dateKey: string): boolean {
  if (getHabitCompletionDates(habit.id).includes(dateKey)) {
    return true;
  }

  return dateKey === getTodayDateString() && habit.completed;
}

export async function fetchHabitsWithCompletions(): Promise<Habit[]> {
  const habits = await fetchHabits();
  await loadHabitCompletions();
  reconcileCompletionsWithHabits(habits);
  return resetStaleHabitCompletedFlags(habits);
}

async function resetStaleHabitCompletedFlags(habits: Habit[]): Promise<Habit[]> {
  const today = getTodayDateString();
  const stale = habits.filter(
    (habit) =>
      habit.completed && !getHabitCompletionDates(habit.id).includes(today)
  );

  if (stale.length === 0) return habits;

  const resetIds = new Set(
    (
      await Promise.all(
        stale.map((habit) => updateHabit(habit.id, { completed: false }))
      )
    ).map((habit) => habit.id)
  );

  return habits.map((habit) =>
    resetIds.has(habit.id) ? { ...habit, completed: false } : habit
  );
}

export async function fetchTodayHabits(): Promise<Habit[]> {
  const habits = await fetchHabitsWithCompletions();
  return habits
    .filter((habit) => isHabitScheduledToday(habit))
    .sort((a, b) => {
      const aMin = a.scheduled_time ?? "99:99";
      const bMin = b.scheduled_time ?? "99:99";
      return aMin.localeCompare(bMin);
    });
}

export async function createHabit(input: HabitInsert): Promise<Habit> {
  const userId = await requireUserId();
  const { data, error } = await supabase
    .from("habits")
    .insert({ ...input, user_id: userId })
    .select()
    .single();

  if (error) {
    throw new HabitsError(error.message);
  }

  return data;
}

export async function updateHabit(id: string, input: HabitUpdate): Promise<Habit> {
  const userId = await requireUserId();
  const { data, error } = await supabase
    .from("habits")
    .update(input)
    .eq("id", id)
    .eq("user_id", userId)
    .select()
    .single();

  if (error) {
    throw new HabitsError(error.message);
  }

  return data;
}

export async function toggleHabitComplete(habit: Habit): Promise<Habit> {
  const today = getTodayDateString();
  const isComplete = isHabitCompletedToday(habit);

  if (isComplete) {
    await removeHabitCompletion(habit.id, today);
    return updateHabit(habit.id, { completed: false });
  }

  await recordHabitCompletion(habit.id, today);
  return updateHabit(habit.id, { completed: true });
}

export async function deleteHabit(id: string): Promise<void> {
  const userId = await requireUserId();
  const { error } = await supabase
    .from("habits")
    .delete()
    .eq("id", id)
    .eq("user_id", userId);

  if (error) {
    throw new HabitsError(error.message);
  }

  removeAllHabitCompletions(id);
}

export function formatHabitTime(scheduledTime: string | null): string | null {
  return formatTimeShort(scheduledTime);
}

export function formatDaysOfWeek(days: string[] | null): string {
  if (!days?.length) return "No days set";

  const ordered = DAYS_OF_WEEK.filter((day) => days.includes(day));

  if (ordered.length === DAYS_OF_WEEK.length) return "Every day";

  return ordered.join(", ");
}
