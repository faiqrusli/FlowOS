import { requireUserId } from "@/lib/auth";
import { createHabit } from "@/lib/habits";
import { supabase } from "@/lib/supabase";
import { createTask } from "@/lib/tasks";
import { getTodayDateString } from "@/lib/date-utils";
import { fetchTodayReflection, saveReflection } from "@/lib/reflection-storage";
import type {
  GrowthAreaStats,
  NoteSourceType,
  NoteTargetType,
} from "@/types/notes";

export class NoteConversionsError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "NoteConversionsError";
  }
}

export async function fetchGrowthAreaStats(
  growthAreaId: string
): Promise<GrowthAreaStats> {
  const userId = await requireUserId();

  const [goalsRes, conversionsRes, notesRes, boardsRes] = await Promise.all([
    supabase
      .from("growth_goals")
      .select("id", { count: "exact", head: true })
      .eq("user_id", userId)
      .eq("growth_area_id", growthAreaId),
    supabase
      .from("note_conversions")
      .select("target_type")
      .eq("user_id", userId)
      .eq("growth_area_id", growthAreaId),
    supabase
      .from("notes")
      .select("id", { count: "exact", head: true })
      .eq("user_id", userId)
      .eq("growth_area_id", growthAreaId),
    supabase
      .from("kanban_boards")
      .select("id", { count: "exact", head: true })
      .eq("user_id", userId)
      .eq("growth_area_id", growthAreaId),
  ]);

  const conversions = conversionsRes.data ?? [];
  const habits = conversions.filter((c) => c.target_type === "habit").length;
  const tasks = conversions.filter((c) => c.target_type === "task").length;
  const reflections = conversions.filter(
    (c) => c.target_type === "reflection"
  ).length;

  return {
    goals: goalsRes.count ?? 0,
    habits,
    tasks,
    reflections,
    notes: notesRes.count ?? 0,
    boards: boardsRes.count ?? 0,
  };
}

async function recordConversion(input: {
  growthAreaId: string;
  sourceType: NoteSourceType;
  sourceId: string;
  targetType: NoteTargetType;
  targetId: string;
}) {
  const userId = await requireUserId();

  const { error } = await supabase.from("note_conversions").insert({
    user_id: userId,
    growth_area_id: input.growthAreaId,
    source_type: input.sourceType,
    source_id: input.sourceId,
    target_type: input.targetType,
    target_id: input.targetId,
  });

  if (error) throw new NoteConversionsError(error.message);
}

export async function convertToTask(input: {
  growthAreaId: string;
  sourceType: NoteSourceType;
  sourceId: string;
  title: string;
  description?: string;
}) {
  const task = await createTask({
    title: input.title,
    description: input.description ?? null,
    scheduled_date: getTodayDateString(),
  });

  await recordConversion({
    growthAreaId: input.growthAreaId,
    sourceType: input.sourceType,
    sourceId: input.sourceId,
    targetType: "task",
    targetId: task.id,
  });

  return task;
}

export async function convertToHabit(input: {
  growthAreaId: string;
  sourceType: NoteSourceType;
  sourceId: string;
  title: string;
}) {
  const habit = await createHabit({
    name: input.title,
    days_of_week: null,
  });

  await recordConversion({
    growthAreaId: input.growthAreaId,
    sourceType: input.sourceType,
    sourceId: input.sourceId,
    targetType: "habit",
    targetId: habit.id,
  });

  return habit;
}

export async function convertToGoal(input: {
  growthAreaId: string;
  sourceType: NoteSourceType;
  sourceId: string;
  title: string;
  description?: string;
}) {
  const userId = await requireUserId();

  const { data, error } = await supabase
    .from("growth_goals")
    .insert({
      user_id: userId,
      growth_area_id: input.growthAreaId,
      title: input.title,
      description: input.description ?? null,
      source_type: input.sourceType,
      source_id: input.sourceId,
    })
    .select()
    .single();

  if (error) throw new NoteConversionsError(error.message);
  return data;
}

export async function convertToReflection(input: {
  growthAreaId: string;
  sourceType: NoteSourceType;
  sourceId: string;
  title: string;
  content?: string;
}) {
  const existing = await fetchTodayReflection();

  const entry = {
    id: crypto.randomUUID(),
    title: input.title,
    content: input.content ?? "",
  };

  const saved = await saveReflection({
    went_well: existing?.went_well ?? "",
    went_wrong: existing?.went_wrong ?? "",
    custom_entries: [...(existing?.custom_entries ?? []), entry],
  });

  const reflectionEntry = saved.custom_entries.find((e) => e.id === entry.id);
  if (!reflectionEntry) {
    throw new NoteConversionsError("Failed to create reflection entry.");
  }

  await recordConversion({
    growthAreaId: input.growthAreaId,
    sourceType: input.sourceType,
    sourceId: input.sourceId,
    targetType: "reflection",
    targetId: reflectionEntry.id,
  });

  return reflectionEntry;
}
