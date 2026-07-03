import { requireUserId } from "@/lib/auth";
import { supabase } from "@/lib/supabase";
import type { WeeklyReflectionLayout } from "@/types/reflection";

const EMPTY_LAYOUT = (weekStart: string): WeeklyReflectionLayout => ({
  weekStart,
  placements: [],
  collapsedColumns: [],
});

function normalizeLayout(
  weekStart: string,
  value: unknown
): WeeklyReflectionLayout {
  if (!value || typeof value !== "object") return EMPTY_LAYOUT(weekStart);
  const raw = value as WeeklyReflectionLayout;
  return {
    weekStart,
    placements: Array.isArray(raw.placements) ? raw.placements : [],
    collapsedColumns: Array.isArray(raw.collapsedColumns)
      ? raw.collapsedColumns
      : [],
  };
}

export async function fetchWeeklyReflectionLayout(
  weekStart: string
): Promise<WeeklyReflectionLayout> {
  const userId = await requireUserId();
  const { data, error } = await supabase
    .from("weekly_reflection_layouts")
    .select("layout")
    .eq("user_id", userId)
    .eq("week_start", weekStart)
    .maybeSingle();

  if (error || !data) return EMPTY_LAYOUT(weekStart);
  return normalizeLayout(weekStart, data.layout);
}

export async function saveWeeklyReflectionLayout(
  layout: WeeklyReflectionLayout
): Promise<void> {
  const userId = await requireUserId();
  const { data: existing } = await supabase
    .from("weekly_reflection_layouts")
    .select("id")
    .eq("user_id", userId)
    .eq("week_start", layout.weekStart)
    .maybeSingle();

  if (existing) {
    const { error } = await supabase
      .from("weekly_reflection_layouts")
      .update({ layout })
      .eq("id", existing.id)
      .eq("user_id", userId);
    if (error) console.warn("[weekly-reflection] save failed", error.message);
    return;
  }

  const { error } = await supabase.from("weekly_reflection_layouts").insert({
    user_id: userId,
    week_start: layout.weekStart,
    layout,
  });
  if (error) console.warn("[weekly-reflection] insert failed", error.message);
}
