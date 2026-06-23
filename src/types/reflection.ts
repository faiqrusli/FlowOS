export type CustomEntry = {
  id: string;
  title: string;
  content: string;
};

export type DaySummary = {
  tasksCompleted: number;
  tasksTotal: number;
  habitsCompleted: number;
  habitsTotal: number;
  focusSeconds: number;
};

export type Reflection = {
  id: string;
  reflection_date: string;
  went_well: string;
  went_wrong: string;
  custom_entries: CustomEntry[];
  user_id: string | null;
  created_at: string;
};

export type ReflectionDraft = {
  went_well: string;
  went_wrong: string;
  custom_entries: CustomEntry[];
};

export type ReflectionEntry = {
  id: string;
  reflection_id: string;
  title: string;
  content: string;
  user_id: string | null;
  created_at: string;
};
