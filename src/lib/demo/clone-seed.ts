import { createClient } from "@/lib/supabase/client";
import { createDemoDateBand, dateKeyAtMinutesIso } from "@/lib/demo/dates";
import {
  DEMO_SEED_TEMPLATE,
  resolveHabitScheduledTime,
  resolveScheduledTime,
} from "@/lib/demo/seed-pack";
import { DEMO_SEED_VERSION } from "@/lib/demo/constants";

function id(): string {
  return crypto.randomUUID();
}

function assertOk(
  label: string,
  error: { message: string } | null,
): asserts error is null {
  if (error) {
    throw new Error(`Demo seed failed (${label}): ${error.message}`);
  }
}

/**
 * Clone the immutable seed pack into the given authenticated demo user.
 * Uses the browser client + RLS (user inserts own rows).
 */
export async function cloneDemoSeed(userId: string): Promise<{
  anchorDate: string;
  seedVersion: string;
}> {
  const supabase = createClient();
  const band = createDemoDateBand();
  const groupIds = new Map<string, string>();
  const taskIds = new Map<string, string>();
  const habitIds = new Map<string, string>();
  const focusIds = new Map<string, string>();
  const areaIds = new Map<string, string>();

  const groupRows = DEMO_SEED_TEMPLATE.groups.map((g) => {
    const rowId = id();
    groupIds.set(g.key, rowId);
    return {
      id: rowId,
      user_id: userId,
      title: g.title,
      slug: g.slug,
      sort_order: g.sort_order,
      color: g.color ?? null,
      icon: null,
    };
  });
  {
    const { error } = await supabase.from("task_groups").insert(groupRows as never);
    assertOk("task_groups", error);
  }

  const taskRows = DEMO_SEED_TEMPLATE.tasks.map((t) => {
    const rowId = id();
    taskIds.set(t.key, rowId);
    const scheduledDate = t.dayOffset == null ? null : band.d(t.dayOffset);
    const scheduledTime = resolveScheduledTime(band, t);
    const completedAt =
      t.completed && t.completedDayOffset != null
        ? dateKeyAtMinutesIso(band.d(t.completedDayOffset), 18 * 60)
        : t.completed
          ? dateKeyAtMinutesIso(band.anchorDate, 18 * 60)
          : null;

    return {
      id: rowId,
      user_id: userId,
      group_id: groupIds.get(t.groupKey) ?? null,
      title: t.title,
      description: t.description ?? null,
      sort_order: t.sort_order,
      queue_order: t.queue_order ?? null,
      priority: t.priority ?? "medium",
      duration_minutes: t.duration_minutes ?? null,
      planning_state: t.planning_state ?? "none",
      scheduled_date: scheduledDate,
      scheduled_time: scheduledTime,
      completed: Boolean(t.completed),
      completed_at: completedAt,
      notification_enabled: t.notification_enabled ?? false,
      notification_lead_minutes: t.notification_lead_minutes ?? null,
    };
  });
  {
    const { error } = await supabase.from("tasks").insert(taskRows as never);
    assertOk("tasks", error);
  }

  const habitRows = DEMO_SEED_TEMPLATE.habits.map((h) => {
    const rowId = id();
    habitIds.set(h.key, rowId);
    return {
      id: rowId,
      user_id: userId,
      name: h.name,
      scheduled_time: resolveHabitScheduledTime(band, h),
      days_of_week: h.days_of_week,
      completed: false,
      track_with_focus: Boolean(h.track_with_focus),
    };
  });
  {
    const { error } = await supabase.from("habits").insert(habitRows as never);
    assertOk("habits", error);
  }

  const completionRows: {
    id: string;
    habit_id: string;
    completion_date: string;
  }[] = [];
  for (const h of DEMO_SEED_TEMPLATE.habits) {
    const habitId = habitIds.get(h.key);
    if (!habitId) continue;
    for (const offset of h.completionOffsets) {
      completionRows.push({
        id: id(),
        habit_id: habitId,
        completion_date: band.d(offset),
      });
    }
  }
  if (completionRows.length > 0) {
    const { error } = await supabase
      .from("habit_completions")
      .insert(completionRows as never);
    assertOk("habit_completions", error);
  }

  const focusRows = DEMO_SEED_TEMPLATE.focusSessions.map((s) => {
    const rowId = id();
    focusIds.set(s.key, rowId);
    const started = dateKeyAtMinutesIso(band.d(s.dayOffset), s.startMinutes);
    const endMinutes =
      s.startMinutes + Math.floor(s.focus_duration / 60) + 5;
    const ended = dateKeyAtMinutesIso(band.d(s.dayOffset), endMinutes);
    const taskId = s.taskKey ? taskIds.get(s.taskKey) : null;
    return {
      id: rowId,
      user_id: userId,
      focus_duration: s.focus_duration,
      break_duration: s.break_duration,
      started_at: started,
      ended_at: ended,
      session_status: s.session_status,
      target_type: taskId ? ("task" as const) : null,
      target_id: taskId ?? null,
    };
  });
  {
    const { error } = await supabase.from("focus_sessions").insert(focusRows as never);
    assertOk("focus_sessions", error);
  }

  const totalRows: {
    id: string;
    user_id: string;
    focus_session_id: string;
    task_id: string;
    focused_seconds: number;
  }[] = [];
  for (const s of DEMO_SEED_TEMPLATE.focusSessions) {
    if (!s.taskKey) continue;
    const sessionId = focusIds.get(s.key);
    const taskId = taskIds.get(s.taskKey);
    if (!sessionId || !taskId) continue;
    totalRows.push({
      id: id(),
      user_id: userId,
      focus_session_id: sessionId,
      task_id: taskId,
      focused_seconds: s.focus_duration,
    });
  }
  if (totalRows.length > 0) {
    const { error } = await supabase
      .from("focus_session_task_totals")
      .insert(totalRows as never);
    assertOk("focus_session_task_totals", error);
  }

  for (const r of DEMO_SEED_TEMPLATE.reflections) {
    const reflectionId = id();
    const { error } = await supabase.from("reflections").insert({
      id: reflectionId,
      user_id: userId,
      reflection_date: band.d(r.dayOffset),
      went_well: r.went_well,
      went_wrong: r.went_wrong,
      custom_kanbans: r.custom_kanbans,
    } as never);
    assertOk(`reflections:${r.key}`, error);

    if (r.entries.length > 0) {
      const entryRows = r.entries.map((e) => ({
        id: id(),
        reflection_id: reflectionId,
        user_id: userId,
        title: e.title,
        content: e.content,
      }));
      const { error: entryError } = await supabase
        .from("reflection_entries")
        .insert(entryRows as never);
      assertOk(`reflection_entries:${r.key}`, entryError);
    }
  }

  const areaRows = DEMO_SEED_TEMPLATE.growthAreas.map((a) => {
    const rowId = id();
    areaIds.set(a.key, rowId);
    return {
      id: rowId,
      user_id: userId,
      name: a.name,
      emoji: a.emoji,
      description: a.description ?? null,
      sort_order: a.sort_order,
    };
  });
  {
    const { error } = await supabase.from("growth_areas").insert(areaRows as never);
    assertOk("growth_areas", error);
  }

  const noteRows = DEMO_SEED_TEMPLATE.notes.map((n) => {
    const areaId = areaIds.get(n.areaKey);
    if (!areaId) {
      throw new Error(`Demo seed missing growth area ${n.areaKey}`);
    }
    return {
      id: id(),
      user_id: userId,
      growth_area_id: areaId,
      title: n.title,
      content: n.content,
      is_pinned: Boolean(n.is_pinned),
      is_menu_pinned: Boolean(n.is_menu_pinned),
      note_date: n.dayOffset == null ? null : band.d(n.dayOffset),
    };
  });
  {
    const { error } = await supabase.from("notes").insert(noteRows as never);
    assertOk("notes", error);
  }

  const kanban = DEMO_SEED_TEMPLATE.kanban;
  if (kanban) {
    const areaId = areaIds.get(kanban.areaKey);
    if (areaId) {
      const boardId = id();
      const { error: boardError } = await supabase.from("kanban_boards").insert({
        id: boardId,
        user_id: userId,
        growth_area_id: areaId,
        title: kanban.title,
        sort_order: 0,
      } as never);
      assertOk("kanban_boards", boardError);

      const columnIds = new Map<string, string>();
      const columnRows = kanban.columns.map((c) => {
        const colId = id();
        columnIds.set(c.key, colId);
        return {
          id: colId,
          user_id: userId,
          board_id: boardId,
          title: c.title,
          color: c.color,
          sort_order: c.sort_order,
        };
      });
      {
        const { error } = await supabase
          .from("kanban_columns")
          .insert(columnRows as never);
        assertOk("kanban_columns", error);
      }

      const cardRows = kanban.cards.map((card) => {
        const columnId = columnIds.get(card.columnKey);
        if (!columnId) {
          throw new Error(`Demo seed missing column ${card.columnKey}`);
        }
        return {
          id: id(),
          user_id: userId,
          board_id: boardId,
          column_id: columnId,
          title: card.title,
          description: card.description ?? "",
          color_label: "",
          sort_order: card.sort_order,
          is_archived: false,
        };
      });
      {
        const { error } = await supabase.from("kanban_cards").insert(cardRows as never);
        assertOk("kanban_cards", error);
      }
    }
  }

  return {
    anchorDate: band.anchorDate,
    seedVersion: DEMO_SEED_VERSION,
  };
}
