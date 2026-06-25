import type { FocusSession, FocusSessionInsert } from "@/types/focus";
import type { ReflectionEntry } from "@/types/reflection";
import type { Habit, HabitInsert, HabitUpdate } from "@/types/habit";
import type { Task, TaskInsert } from "@/types/task";
import type {
  GrowthArea,
  GrowthAreaInsert,
  GrowthGoal,
  KanbanBoard,
  KanbanCard,
  KanbanColumn,
  Note,
  NoteConversion,
  NoteInsert,
} from "@/types/notes";

type HabitCompletionRow = {
  id: string;
  habit_id: string;
  completion_date: string;
  created_at: string;
};

type ReflectionRow = {
  id: string;
  reflection_date: string;
  went_well: string;
  went_wrong: string;
  user_id: string | null;
  created_at: string;
};

export type Database = {
  public: {
    Tables: {
      tasks: {
        Row: Task;
        Insert: TaskInsert;
        Update: Partial<TaskInsert> & { completed?: boolean };
        Relationships: [];
      };
      habits: {
        Row: Habit;
        Insert: HabitInsert;
        Update: HabitUpdate;
        Relationships: [];
      };
      habit_completions: {
        Row: HabitCompletionRow;
        Insert: {
          habit_id: string;
          completion_date: string;
          id?: string;
          created_at?: string;
        };
        Update: {
          habit_id?: string;
          completion_date?: string;
        };
        Relationships: [];
      };
      focus_sessions: {
        Row: FocusSession;
        Insert: FocusSessionInsert;
        Update: Partial<FocusSessionInsert>;
        Relationships: [];
      };
      reflections: {
        Row: ReflectionRow;
        Insert: Omit<ReflectionRow, "id" | "created_at"> & {
          id?: string;
          created_at?: string;
        };
        Update: {
          reflection_date?: string;
          went_well?: string;
          went_wrong?: string;
        };
        Relationships: [];
      };
      reflection_entries: {
        Row: ReflectionEntry;
        Insert: Omit<ReflectionEntry, "id" | "created_at"> & {
          id?: string;
          created_at?: string;
        };
        Update: {
          reflection_id?: string;
          title?: string;
          content?: string;
        };
        Relationships: [];
      };
      growth_areas: {
        Row: GrowthArea;
        Insert: GrowthAreaInsert & { user_id: string };
        Update: Partial<GrowthAreaInsert>;
        Relationships: [];
      };
      notes: {
        Row: Note;
        Insert: NoteInsert & { user_id: string };
        Update: Partial<NoteInsert>;
        Relationships: [];
      };
      kanban_boards: {
        Row: KanbanBoard;
        Insert: {
          growth_area_id: string;
          title: string;
          user_id: string;
          sort_order?: number;
        };
        Update: { title?: string; sort_order?: number };
        Relationships: [];
      };
      kanban_columns: {
        Row: KanbanColumn;
        Insert: Omit<KanbanColumn, "id" | "created_at"> & {
          id?: string;
          created_at?: string;
        };
        Update: Partial<
          Pick<KanbanColumn, "title" | "color" | "sort_order">
        >;
        Relationships: [];
      };
      kanban_cards: {
        Row: KanbanCard;
        Insert: Omit<KanbanCard, "id" | "created_at" | "updated_at"> & {
          id?: string;
          created_at?: string;
          updated_at?: string;
          is_archived?: boolean;
        };
        Update: Partial<
          Pick<
            KanbanCard,
            | "title"
            | "description"
            | "color_label"
            | "column_id"
            | "sort_order"
            | "is_archived"
          >
        >;
        Relationships: [];
      };
      growth_goals: {
        Row: GrowthGoal;
        Insert: Omit<GrowthGoal, "id" | "created_at"> & {
          id?: string;
          created_at?: string;
        };
        Update: Partial<Pick<GrowthGoal, "title" | "description">>;
        Relationships: [];
      };
      note_conversions: {
        Row: NoteConversion;
        Insert: Omit<NoteConversion, "id" | "created_at"> & {
          id?: string;
          created_at?: string;
        };
        Update: never;
        Relationships: [];
      };
    };
    Views: Record<string, never>;
    Functions: Record<string, never>;
    Enums: Record<string, never>;
    CompositeTypes: Record<string, never>;
  };
};
