import { requireUserId } from "@/lib/auth";
import { supabase } from "@/lib/supabase";
import type {
  GrowthArea,
  GrowthAreaInsert,
  GrowthAreaUpdate,
  GrowthAreaWithCounts,
} from "@/types/notes";

export class GrowthAreasError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "GrowthAreasError";
  }
}

export const DEFAULT_GROWTH_AREAS: GrowthAreaInsert[] = [
  {
    emoji: "🧠",
    name: "Mindset",
    description: "Beliefs, mental models, and inner dialogue.",
    sort_order: 0,
  },
  {
    emoji: "🎯",
    name: "Discipline",
    description: "Habits of focus, consistency, and follow-through.",
    sort_order: 1,
  },
  {
    emoji: "📘",
    name: "Learning",
    description: "Skills, books, courses, and curiosity.",
    sort_order: 2,
  },
  {
    emoji: "💪",
    name: "Fitness",
    description: "Movement, nutrition, and physical wellbeing.",
    sort_order: 3,
  },
  {
    emoji: "💼",
    name: "Career",
    description: "Work, ambition, and professional growth.",
    sort_order: 4,
  },
  {
    emoji: "🕊",
    name: "Mindfulness",
    description: "Presence, calm, and awareness in daily life.",
    sort_order: 5,
  },
  {
    emoji: "💰",
    name: "Finance",
    description: "Money mindset, savings, and financial habits.",
    sort_order: 6,
  },
];

export async function fetchGrowthAreas(): Promise<GrowthAreaWithCounts[]> {
  const userId = await requireUserId();

  const { data: areas, error } = await supabase
    .from("growth_areas")
    .select("*")
    .eq("user_id", userId)
    .order("sort_order", { ascending: true });

  if (error) throw new GrowthAreasError(error.message);

  if (!areas?.length) {
    await seedDefaultGrowthAreas(userId);
    return fetchGrowthAreas();
  }

  const { data: noteCounts, error: countError } = await supabase
    .from("notes")
    .select("growth_area_id")
    .eq("user_id", userId);

  if (countError) throw new GrowthAreasError(countError.message);

  const countMap = new Map<string, number>();
  for (const row of noteCounts ?? []) {
    countMap.set(row.growth_area_id, (countMap.get(row.growth_area_id) ?? 0) + 1);
  }

  return areas.map((area) => ({
    ...area,
    note_count: countMap.get(area.id) ?? 0,
  }));
}

async function seedDefaultGrowthAreas(userId: string) {
  const { error } = await supabase.from("growth_areas").insert(
    DEFAULT_GROWTH_AREAS.map((area) => ({
      ...area,
      user_id: userId,
    }))
  );

  if (error) throw new GrowthAreasError(error.message);
}

export async function createGrowthArea(
  input: GrowthAreaInsert
): Promise<GrowthArea> {
  const userId = await requireUserId();

  const { data, error } = await supabase
    .from("growth_areas")
    .insert({ ...input, user_id: userId })
    .select()
    .single();

  if (error) throw new GrowthAreasError(error.message);
  return data;
}

export async function updateGrowthArea(
  id: string,
  input: GrowthAreaUpdate
): Promise<GrowthArea> {
  const userId = await requireUserId();

  const { data, error } = await supabase
    .from("growth_areas")
    .update(input)
    .eq("id", id)
    .eq("user_id", userId)
    .select()
    .single();

  if (error) throw new GrowthAreasError(error.message);
  return data;
}

export async function deleteGrowthArea(id: string): Promise<void> {
  const userId = await requireUserId();

  const { error } = await supabase
    .from("growth_areas")
    .delete()
    .eq("id", id)
    .eq("user_id", userId);

  if (error) throw new GrowthAreasError(error.message);
}
