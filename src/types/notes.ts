export type GrowthArea = {
  id: string;
  user_id: string;
  name: string;
  emoji: string;
  description: string | null;
  sort_order: number;
  created_at: string;
  updated_at: string;
};

export type GrowthAreaInsert = {
  name: string;
  emoji?: string;
  description?: string | null;
  sort_order?: number;
};

export type GrowthAreaUpdate = Partial<GrowthAreaInsert>;

export type Note = {
  id: string;
  user_id: string;
  growth_area_id: string;
  title: string;
  content: string;
  is_pinned: boolean;
  is_menu_pinned: boolean;
  note_date: string | null;
  created_at: string;
  updated_at: string;
};

export type NoteInsert = {
  growth_area_id: string;
  title?: string;
  content?: string;
  is_pinned?: boolean;
  is_menu_pinned?: boolean;
  note_date?: string | null;
};

export type NoteUpdate = Partial<NoteInsert>;

export type KanbanBoard = {
  id: string;
  user_id: string;
  growth_area_id: string;
  title: string;
  sort_order: number;
  created_at: string;
  updated_at: string;
};

export type KanbanColumn = {
  id: string;
  user_id: string;
  board_id: string;
  title: string;
  color: string;
  sort_order: number;
  created_at: string;
};

export type KanbanCard = {
  id: string;
  user_id: string;
  board_id: string;
  column_id: string;
  title: string;
  description: string;
  color_label: string;
  sort_order: number;
  is_archived: boolean;
  created_at: string;
  updated_at: string;
};

export type GrowthGoal = {
  id: string;
  user_id: string;
  growth_area_id: string | null;
  title: string;
  description: string | null;
  source_type: "note" | "kanban_card" | null;
  source_id: string | null;
  created_at: string;
};

export type NoteSourceType = "note" | "kanban_card";
export type NoteTargetType = "task" | "habit" | "reflection";

export type NoteConversion = {
  id: string;
  user_id: string;
  growth_area_id: string | null;
  source_type: NoteSourceType;
  source_id: string;
  target_type: NoteTargetType;
  target_id: string;
  created_at: string;
};

export type GrowthAreaStats = {
  goals: number;
  habits: number;
  tasks: number;
  reflections: number;
  notes: number;
  boards: number;
};

export type KanbanBoardWithColumns = KanbanBoard & {
  columns: (KanbanColumn & { cards: KanbanCard[] })[];
};

export type GrowthAreaWithCounts = GrowthArea & {
  note_count: number;
};
