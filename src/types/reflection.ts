export type CustomEntry = {
  id: string;
  title: string;
  content: string;
};

export type ReflectionKanbanCard = {
  id: string;
  content: string;
};

export type ReflectionKanban = {
  id: string;
  title: string;
  cards: ReflectionKanbanCard[];
  collapsed?: boolean;
};

export type WeeklyReflectionCardPlacement = {
  cardId: string;
  dayDateKey: string;
  columnKey: string;
  sortOrder: number;
};

export type WeeklyReflectionLayout = {
  weekStart: string;
  placements: WeeklyReflectionCardPlacement[];
  collapsedColumns: string[];
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
  custom_kanbans: ReflectionKanban[];
  user_id: string | null;
  created_at: string;
};

export type ReflectionDraft = {
  went_well: string;
  went_wrong: string;
  custom_entries: CustomEntry[];
  custom_kanbans: ReflectionKanban[];
};

export type ReflectionEntry = {
  id: string;
  reflection_id: string;
  title: string;
  content: string;
  user_id: string | null;
  created_at: string;
};
