export const DAYS_OF_WEEK = [
  "Mon",
  "Tue",
  "Wed",
  "Thu",
  "Fri",
  "Sat",
  "Sun",
] as const;

export type DayOfWeek = (typeof DAYS_OF_WEEK)[number];

export type Habit = {
  id: string;
  name: string;
  scheduled_time: string | null;
  days_of_week: string[] | null;
  completed: boolean;
  track_with_focus: boolean;
  user_id: string | null;
  created_at: string;
};

export type HabitInsert = {
  name: string;
  scheduled_time?: string | null;
  days_of_week?: string[] | null;
  completed?: boolean;
  track_with_focus?: boolean;
  user_id?: string | null;
};

export type HabitUpdate = Partial<HabitInsert>;

export type HabitStats = {
  streak: number;
  completionRate: number;
};
