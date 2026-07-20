import { createClient } from "@/lib/supabase/client";

/**
 * Delete all demo workspace rows for the current user (child → parent).
 * Does not touch demo_feedback.
 */
export async function purgeDemoUserData(userId: string): Promise<void> {
  const supabase = createClient();

  // Fetch ids needed for tables without user_id on completions
  const { data: habits } = await supabase
    .from("habits")
    .select("id")
    .eq("user_id", userId);
  const habitIds = (habits ?? []).map((h) => h.id);

  if (habitIds.length > 0) {
    await supabase.from("habit_completions").delete().in("habit_id", habitIds);
  }

  const { data: sessions } = await supabase
    .from("focus_sessions")
    .select("id")
    .eq("user_id", userId);
  const sessionIds = (sessions ?? []).map((s) => s.id);
  if (sessionIds.length > 0) {
    await supabase
      .from("focus_session_task_totals")
      .delete()
      .in("focus_session_id", sessionIds);
  }

  const { data: reflections } = await supabase
    .from("reflections")
    .select("id")
    .eq("user_id", userId);
  const reflectionIds = (reflections ?? []).map((r) => r.id);
  if (reflectionIds.length > 0) {
    await supabase
      .from("reflection_entries")
      .delete()
      .in("reflection_id", reflectionIds);
  }

  const { data: boards } = await supabase
    .from("kanban_boards")
    .select("id")
    .eq("user_id", userId);
  const boardIds = (boards ?? []).map((b) => b.id);
  if (boardIds.length > 0) {
    await supabase.from("kanban_cards").delete().in("board_id", boardIds);
    await supabase.from("kanban_columns").delete().in("board_id", boardIds);
    await supabase.from("kanban_boards").delete().eq("user_id", userId);
  }

  await supabase.from("focus_sessions").delete().eq("user_id", userId);
  await supabase.from("habits").delete().eq("user_id", userId);
  await supabase.from("tasks").delete().eq("user_id", userId);
  await supabase.from("task_groups").delete().eq("user_id", userId);
  await supabase.from("reflections").delete().eq("user_id", userId);
  await supabase.from("notes").delete().eq("user_id", userId);
  await supabase.from("growth_goals").delete().eq("user_id", userId);
  await supabase.from("growth_areas").delete().eq("user_id", userId);
  await supabase.from("note_conversions").delete().eq("user_id", userId);
  await supabase.from("weekly_reflection_layouts").delete().eq("user_id", userId);
}
