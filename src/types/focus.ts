export type SessionStatus = "in_progress" | "completed" | "stopped";

export type QuickFocusPhase =
  | "idle"
  | "focus"
  | "focus_paused"
  | "break"
  | "break_paused";

export type PomodoroPhase = "idle" | "focus" | "break" | "paused";

export type FocusTargetType = "task" | "habit";

export type FocusSession = {
  id: string;
  focus_duration: number;
  break_duration: number;
  started_at: string;
  ended_at: string | null;
  session_status: SessionStatus;
  target_type: FocusTargetType | null;
  target_id: string | null;
  user_id: string | null;
  created_at?: string;
};

export type FocusSessionInsert = Omit<
  FocusSession,
  "id" | "created_at" | "user_id"
> & {
  user_id?: string | null;
};

export type FocusSessionTaskTotal = {
  id: string;
  user_id: string;
  focus_session_id: string;
  task_id: string;
  focused_seconds: number;
  created_at: string;
  updated_at: string;
};

export type FocusSessionTaskTotalInsert = Omit<
  FocusSessionTaskTotal,
  "id" | "created_at" | "updated_at"
> & {
  id?: string;
  created_at?: string;
  updated_at?: string;
};

export type TodayFocusStats = {
  totalFocusSeconds: number;
  totalBreakSeconds: number;
  sessionCount: number;
};

export type DailyFocusHistory = {
  label: string;
  date: string;
  focusSeconds: number;
  breakSeconds: number;
  sessions: FocusSession[];
};

export type FocusSessionSavePayload = {
  focus_seconds: number;
  break_seconds: number;
  started_at: string;
  session_status: "completed" | "stopped";
  target_type?: FocusTargetType | null;
  target_id?: string | null;
};
