import type {
  FocusSession,
  FocusSessionInsert,
  FocusSessionTaskTotal,
  FocusSessionTaskTotalInsert,
} from "@/types/focus";
import type { ReflectionEntry, ReflectionKanban } from "@/types/reflection";
import type { Habit, HabitInsert, HabitUpdate } from "@/types/habit";
import type { Task, TaskGroup, TaskGroupInsert, TaskInsert } from "@/types/task";
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
  custom_kanbans: ReflectionKanban[];
  user_id: string | null;
  created_at: string;
};

type WeeklyReflectionLayoutRow = {
  id: string;
  user_id: string;
  week_start: string;
  layout: Record<string, unknown>;
  created_at: string;
  updated_at: string;
};

type ClickTrackingEventType = "demo_button_click" | "sign_up_button_click";

export type Database = {
  public: {
    Tables: {
      tasks: {
        Row: Task;
        Insert: TaskInsert;
        Update: Partial<TaskInsert> & {
          completed?: boolean;
          completed_at?: string | null;
        };
        Relationships: [];
      };
      task_groups: {
        Row: TaskGroup;
        Insert: TaskGroupInsert & { user_id: string };
        Update: Partial<TaskGroupInsert>;
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
      focus_session_task_totals: {
        Row: FocusSessionTaskTotal;
        Insert: FocusSessionTaskTotalInsert;
        Update: Partial<FocusSessionTaskTotalInsert>;
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
          custom_kanbans?: ReflectionKanban[];
        };
        Relationships: [];
      };
      weekly_reflection_layouts: {
        Row: WeeklyReflectionLayoutRow;
        Insert: {
          user_id: string;
          week_start: string;
          layout?: Record<string, unknown>;
          id?: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          layout?: Record<string, unknown>;
          updated_at?: string;
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
      demo_feedback: {
        Row: {
          id: string;
          created_at: string;
          kind: "comment" | "rating" | "bug";
          display_name: string | null;
          body: string;
          rating: number | null;
          severity: "low" | "medium" | "high" | null;
          page_path: string | null;
          user_agent: string | null;
          demo_session_id: string | null;
          is_public: boolean;
          is_hidden: boolean;
        };
        Insert: {
          id?: string;
          created_at?: string;
          kind: "comment" | "rating" | "bug";
          display_name?: string | null;
          body: string;
          rating?: number | null;
          severity?: "low" | "medium" | "high" | null;
          page_path?: string | null;
          user_agent?: string | null;
          demo_session_id?: string | null;
          is_public?: boolean;
          is_hidden?: boolean;
        };
        Update: {
          is_public?: boolean;
          is_hidden?: boolean;
          body?: string;
        };
        Relationships: [];
      };
      feature_usage: {
        Row: {
          id: string;
          created_at: string;
          user_id: string;
          feature: string;
          action: string;
          metadata: Record<string, unknown>;
        };
        Insert: {
          user_id: string;
          feature: string;
          action: string;
          metadata?: Record<string, unknown>;
          id?: string;
          created_at?: string;
        };
        Update: {
          metadata?: Record<string, unknown>;
        };
        Relationships: [];
      };
      click_tracking: {
        Row: {
          id: string;
          created_at: string;
          event_type: ClickTrackingEventType;
          page_path: string;
          user_agent: string;
          referrer: string;
        };
        Insert: {
          id?: string;
          created_at?: string;
          event_type: ClickTrackingEventType;
          page_path: string;
          user_agent: string;
          referrer: string;
        };
        Update: {
          event_type?: ClickTrackingEventType;
          page_path?: string;
          user_agent?: string;
          referrer?: string;
        };
        Relationships: [];
      };
    };
    Views: Record<string, never>;
    Functions: {
      batch_update_task_manual_orders: {
        Args: { p_updates: { id: string; sort_order: number }[] };
        Returns: undefined;
      };
      batch_update_task_queue_orders: {
        Args: { p_updates: { id: string; queue_order: number | null }[] };
        Returns: undefined;
      };
      delete_task_group_with_tasks_to_inbox: {
        Args: { p_group_id: string };
        Returns: undefined;
      };
    };
    Enums: Record<string, never>;
    CompositeTypes: Record<string, never>;
  };
};
