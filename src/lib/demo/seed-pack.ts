import type { DemoDateBand } from "@/lib/demo/dates";
import type { ReflectionKanban } from "@/types/reflection";

export type SeedTaskGroup = {
  key: string;
  title: string;
  slug: string;
  sort_order: number;
  color?: string | null;
};

export type SeedTask = {
  key: string;
  groupKey: string;
  title: string;
  description?: string | null;
  sort_order: number;
  queue_order?: number | null;
  priority?: "low" | "medium" | "high" | null;
  duration_minutes?: number | null;
  planning_state?: "none" | "later";
  /** Relative day offset from anchor (D+offset). */
  dayOffset?: number | null;
  /** Fixed HH:mm:ss, or use fireOffsetMinutes from T0. */
  scheduled_time?: string | null;
  fireOffsetMinutes?: number | null;
  completed?: boolean;
  completedDayOffset?: number | null;
  notification_enabled?: boolean;
  notification_lead_minutes?: number | null;
};

export type SeedHabit = {
  key: string;
  name: string;
  scheduled_time?: string | null;
  fireOffsetMinutes?: number | null;
  days_of_week: string[];
  track_with_focus?: boolean;
  /** Day offsets (relative) that are completed. */
  completionOffsets: number[];
};

export type SeedFocusSession = {
  key: string;
  dayOffset: number;
  startMinutes: number;
  focus_duration: number;
  break_duration: number;
  session_status: "completed" | "stopped";
  taskKey?: string;
};

export type SeedGrowthArea = {
  key: string;
  name: string;
  emoji: string;
  description?: string | null;
  sort_order: number;
};

export type SeedNote = {
  key: string;
  areaKey: string;
  title: string;
  content: string;
  is_pinned?: boolean;
  is_menu_pinned?: boolean;
  dayOffset?: number | null;
};

export type SeedReflection = {
  key: string;
  dayOffset: number;
  went_well: string;
  went_wrong: string;
  custom_kanbans: ReflectionKanban[];
  entries: { title: string; content: string }[];
};

export type SeedKanban = {
  areaKey: string;
  title: string;
  columns: { key: string; title: string; color: string; sort_order: number }[];
  cards: {
    columnKey: string;
    title: string;
    description?: string;
    sort_order: number;
  }[];
};

export type DemoSeedTemplate = {
  groups: SeedTaskGroup[];
  tasks: SeedTask[];
  habits: SeedHabit[];
  focusSessions: SeedFocusSession[];
  growthAreas: SeedGrowthArea[];
  notes: SeedNote[];
  reflections: SeedReflection[];
  kanban: SeedKanban | null;
};

const ALL_DAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

/** Generic growth-focused seed — no personal / academic / career-application story. */
export const DEMO_SEED_TEMPLATE: DemoSeedTemplate = {
  groups: [
    { key: "inbox", title: "Inbox", slug: "inbox", sort_order: 0, color: null },
    {
      key: "deep",
      title: "Deep Work",
      slug: "deep-work",
      sort_order: 1,
      color: "#7aa2f7",
    },
    {
      key: "quick",
      title: "Quick Tasks",
      slug: "quick",
      sort_order: 2,
      color: "#9ece6a",
    },
    {
      key: "growth",
      title: "Growth",
      slug: "growth",
      sort_order: 3,
      color: "#bb9af7",
    },
  ],
  tasks: [
    {
      key: "demo-build",
      groupKey: "deep",
      title: "Deep work: skill practice block",
      description: "Uninterrupted practice on a hard skill.",
      sort_order: 1,
      queue_order: 1,
      priority: "high",
      duration_minutes: 90,
      dayOffset: 0,
      scheduled_time: "09:00:00",
      notification_enabled: true,
      notification_lead_minutes: 10,
    },
    // Sole near-T0 timed block for reminder live-fire (short so evening demos don't pile up).
    {
      key: "live-reminder",
      groupKey: "deep",
      title: "Write weekly growth review",
      sort_order: 2,
      queue_order: 2,
      priority: "high",
      duration_minutes: 15,
      dayOffset: 0,
      fireOffsetMinutes: 4,
      notification_enabled: true,
      notification_lead_minutes: 5,
    },
    {
      key: "live-start",
      groupKey: "growth",
      title: "Outline next learning milestone",
      sort_order: 3,
      queue_order: 3,
      priority: "high",
      duration_minutes: 45,
      dayOffset: 0,
      scheduled_time: "11:00:00",
      notification_enabled: true,
      notification_lead_minutes: null,
    },
    {
      key: "research",
      groupKey: "deep",
      title: "Read one chapter of a growth book",
      sort_order: 4,
      queue_order: 4,
      priority: "medium",
      duration_minutes: 50,
      dayOffset: 0,
      scheduled_time: "14:00:00",
      notification_enabled: true,
      notification_lead_minutes: 10,
    },
    {
      key: "schema",
      groupKey: "deep",
      title: "Practice problem set",
      sort_order: 5,
      queue_order: 5,
      priority: "medium",
      duration_minutes: 40,
      dayOffset: 0,
      scheduled_time: "16:00:00",
    },
    {
      key: "messages",
      groupKey: "quick",
      title: "Clear inbox messages",
      sort_order: 1,
      priority: "low",
      duration_minutes: 15,
      dayOffset: 0,
      scheduled_time: "11:30:00",
      completed: true,
      completedDayOffset: 0,
    },
    {
      key: "clean",
      groupKey: "quick",
      title: "Tidy desk",
      sort_order: 2,
      planning_state: "later",
      priority: "low",
      duration_minutes: 20,
    },
    {
      key: "protein",
      groupKey: "inbox",
      title: "Buy groceries",
      sort_order: 1,
      planning_state: "none",
      priority: "low",
    },
    {
      key: "dentist",
      groupKey: "inbox",
      title: "Schedule haircut",
      sort_order: 2,
      planning_state: "none",
    },
    {
      key: "walk",
      groupKey: "quick",
      title: "Evening walk",
      sort_order: 3,
      dayOffset: 0,
      scheduled_time: "19:00:00",
      priority: "medium",
      duration_minutes: 20,
      notification_enabled: true,
      notification_lead_minutes: 15,
    },
    {
      key: "overdue-assign",
      groupKey: "growth",
      title: "Finish habit tracker notes",
      sort_order: 4,
      dayOffset: -1,
      scheduled_time: "17:00:00",
      priority: "high",
      duration_minutes: 30,
    },
    {
      key: "past-done",
      groupKey: "deep",
      title: "Fix broken workflow step",
      sort_order: 6,
      dayOffset: -1,
      scheduled_time: "10:00:00",
      completed: true,
      completedDayOffset: -1,
      priority: "high",
      duration_minutes: 55,
    },
    {
      key: "sat-plan",
      groupKey: "growth",
      title: "Weekly planning",
      sort_order: 5,
      dayOffset: -2,
      scheduled_time: "09:30:00",
      completed: true,
      completedDayOffset: -2,
    },
    {
      key: "tue-landing",
      groupKey: "deep",
      title: "Build side-project page",
      sort_order: 7,
      queue_order: 6,
      dayOffset: 1,
      scheduled_time: "10:00:00",
      priority: "medium",
      duration_minutes: 90,
      notification_enabled: true,
      notification_lead_minutes: 10,
    },
    {
      key: "wed-dist",
      groupKey: "deep",
      title: "Study system design basics",
      sort_order: 8,
      queue_order: 7,
      dayOffset: 2,
      scheduled_time: "13:00:00",
      priority: "medium",
      duration_minutes: 75,
    },
    {
      key: "thu-paper",
      groupKey: "growth",
      title: "Watch a skill tutorial",
      sort_order: 6,
      dayOffset: 3,
      scheduled_time: "15:00:00",
      duration_minutes: 45,
    },
    {
      key: "fri-reflect",
      groupKey: "quick",
      title: "Review daily reflection",
      sort_order: 4,
      dayOffset: 4,
      scheduled_time: "18:00:00",
      duration_minutes: 25,
    },
    {
      key: "inbox-email",
      groupKey: "inbox",
      title: "Reply to open messages",
      sort_order: 3,
      planning_state: "none",
    },
  ],
  habits: [
    {
      key: "morning",
      name: "Morning Planning",
      scheduled_time: "07:30:00",
      days_of_week: ALL_DAYS,
      completionOffsets: [-7, -6, -5, -4, -3, -2, -1, 0],
    },
    {
      key: "water",
      name: "Drink Water",
      scheduled_time: "10:00:00",
      days_of_week: ALL_DAYS,
      completionOffsets: [-5, -4, -3, -2, -1, 0],
    },
    {
      key: "exercise",
      name: "Exercise",
      scheduled_time: "17:30:00",
      days_of_week: ["Mon", "Wed", "Fri", "Sat"],
      track_with_focus: true,
      completionOffsets: [-6, -4, -2],
    },
    {
      key: "read",
      name: "Read Book",
      scheduled_time: "21:00:00",
      days_of_week: ALL_DAYS,
      completionOffsets: [-3, -2, -1],
    },
    {
      key: "stretch",
      name: "Morning Stretch",
      scheduled_time: "06:45:00",
      days_of_week: ALL_DAYS,
      completionOffsets: [-7, -6, -5, -4, -3, -2, -1, 0],
    },
    {
      key: "journal",
      name: "Journal",
      days_of_week: ALL_DAYS,
      completionOffsets: [-2, -1],
    },
    {
      key: "sleep",
      name: "Sleep Before 11PM",
      days_of_week: ALL_DAYS,
      completionOffsets: [-4, -3, -1],
    },
    {
      key: "live-habit",
      name: "Review Goals",
      // Fixed morning slot — not T0-relative (avoids evening timeline pile-up).
      scheduled_time: "08:00:00",
      days_of_week: ALL_DAYS,
      completionOffsets: [-5, -3, -1],
    },
  ],
  focusSessions: [
    {
      key: "fs1",
      dayOffset: 0,
      startMinutes: 9 * 60,
      focus_duration: 52 * 60,
      break_duration: 8 * 60,
      session_status: "completed",
      taskKey: "demo-build",
    },
    {
      key: "fs2",
      dayOffset: 0,
      startMinutes: 11 * 60,
      focus_duration: 45 * 60,
      break_duration: 5 * 60,
      session_status: "completed",
      taskKey: "research",
    },
    {
      key: "fs3",
      dayOffset: -1,
      startMinutes: 10 * 60,
      focus_duration: 90 * 60,
      break_duration: 10 * 60,
      session_status: "completed",
      taskKey: "past-done",
    },
    {
      key: "fs4",
      dayOffset: -1,
      startMinutes: 14 * 60,
      focus_duration: 40 * 60,
      break_duration: 5 * 60,
      session_status: "completed",
    },
    {
      key: "fs5",
      dayOffset: -2,
      startMinutes: 9 * 60 + 30,
      focus_duration: 70 * 60,
      break_duration: 10 * 60,
      session_status: "completed",
      taskKey: "sat-plan",
    },
    {
      key: "fs6",
      dayOffset: -3,
      startMinutes: 15 * 60,
      focus_duration: 55 * 60,
      break_duration: 5 * 60,
      session_status: "completed",
    },
    {
      key: "fs7",
      dayOffset: -4,
      startMinutes: 10 * 60,
      focus_duration: 105 * 60,
      break_duration: 15 * 60,
      session_status: "completed",
      taskKey: "demo-build",
    },
    {
      key: "fs8",
      dayOffset: -5,
      startMinutes: 13 * 60,
      focus_duration: 35 * 60,
      break_duration: 5 * 60,
      session_status: "stopped",
    },
  ],
  growthAreas: [
    {
      key: "mindset",
      name: "Mindset",
      emoji: "🧠",
      description: "Principles and reminders",
      sort_order: 0,
    },
    {
      key: "daily",
      name: "Daily Notes",
      emoji: "📝",
      description: "Day-to-day captures",
      sort_order: 1,
    },
    {
      key: "projects",
      name: "Projects",
      emoji: "🚀",
      description: "Side projects and experiments",
      sort_order: 2,
    },
    {
      key: "health",
      name: "Health",
      emoji: "💪",
      description: "Fitness and energy",
      sort_order: 3,
    },
    {
      key: "learning",
      name: "Learning",
      emoji: "📚",
      description: "Skills and reading",
      sort_order: 4,
    },
  ],
  notes: [
    {
      key: "n-daily",
      areaKey: "daily",
      title: "Today's priorities",
      content:
        "Protect one deep-work block.\n\nWorkout after lunch.\n\nKeep evening screens low.\n\nClose the day with a short reflection.",
      is_pinned: true,
      dayOffset: 0,
    },
    {
      key: "n-mindset",
      areaKey: "mindset",
      title: "Mindset",
      content:
        "Consistency beats motivation.\n\nBuild systems.\n\nProtect focus.",
      is_pinned: true,
      is_menu_pinned: true,
    },
    {
      key: "n-roadmap",
      areaKey: "projects",
      title: "Side project ideas",
      content:
        "- Habit streak visualizer\n- Reading log\n- Simple budget tracker",
    },
    {
      key: "n-launch",
      areaKey: "projects",
      title: "This week checklist",
      content:
        "- Two deep-work sessions\n- Three workouts\n- Finish one book chapter\n- Weekly review on Sunday",
    },
    {
      key: "n-health",
      areaKey: "health",
      title: "Training notes",
      content: "Push / pull / legs. Sleep 7+ hours. Walk after meals.",
    },
    {
      key: "n-learn",
      areaKey: "learning",
      title: "Learning notes",
      content: "Spaced repetition. Teach what you learn. One concept a day.",
    },
  ],
  reflections: [
    {
      key: "r0",
      dayOffset: 0,
      went_well:
        "Protected a long focus block.\nFinished the morning planning habit.\nWorkout felt solid.\nInbox stayed under control.",
      went_wrong:
        "Scrolled longer than planned.\nSkipped evening reading.\nStarted too many small tasks at once.",
      custom_kanbans: [
        {
          id: "k-learn",
          title: "Learning",
          cards: [
            { id: "c1", content: "Finish one tutorial module" },
            { id: "c2", content: "Summarize today's reading" },
          ],
        },
        {
          id: "k-ideas",
          title: "Ideas",
          cards: [
            { id: "c3", content: "Habit heatmap experiment" },
            { id: "c4", content: "Weekly energy journal" },
          ],
        },
        {
          id: "k-life",
          title: "Life",
          cards: [{ id: "c5", content: "Cook dinner twice this week" }],
        },
        {
          id: "k-growth",
          title: "Growth",
          cards: [{ id: "c6", content: "Define one 30-day skill goal" }],
        },
      ],
      entries: [
        { title: "Mood", content: "Focused" },
        { title: "Energy", content: "8 / 10" },
        { title: "Sleep", content: "7h 15m" },
        { title: "Weight", content: "72.4 kg" },
      ],
    },
    {
      key: "r-1",
      dayOffset: -1,
      went_well: "Fixed a broken workflow step.\nStrong morning deep work.",
      went_wrong: "Missed evening reading.\nAte late.",
      custom_kanbans: [],
      entries: [
        { title: "Mood", content: "Steady" },
        { title: "Energy", content: "7 / 10" },
      ],
    },
    {
      key: "r-2",
      dayOffset: -2,
      went_well: "Weekly planning done early.\nCleared a few lingering tasks.",
      went_wrong: "Too many open tabs.",
      custom_kanbans: [],
      entries: [{ title: "Mood", content: "Calm" }],
    },
  ],
  kanban: {
    areaKey: "learning",
    title: "Learning Board",
    columns: [
      { key: "todo", title: "Todo", color: "#7aa2f7", sort_order: 0 },
      { key: "doing", title: "Doing", color: "#e0af68", sort_order: 1 },
      { key: "done", title: "Done", color: "#9ece6a", sort_order: 2 },
    ],
    cards: [
      {
        columnKey: "todo",
        title: "Practice spaced repetition",
        sort_order: 0,
      },
      {
        columnKey: "doing",
        title: "Read Atomic Habits notes",
        sort_order: 0,
      },
      {
        columnKey: "done",
        title: "Finish intro tutorial",
        sort_order: 0,
      },
    ],
  },
};

export function resolveScheduledTime(
  band: DemoDateBand,
  task: Pick<SeedTask, "scheduled_time" | "fireOffsetMinutes">,
): string | null {
  if (task.fireOffsetMinutes != null) {
    return band.fireTime(task.fireOffsetMinutes);
  }
  return task.scheduled_time ?? null;
}

export function resolveHabitScheduledTime(
  band: DemoDateBand,
  habit: Pick<SeedHabit, "scheduled_time" | "fireOffsetMinutes">,
): string | null {
  if (habit.fireOffsetMinutes != null) {
    return band.fireTime(habit.fireOffsetMinutes);
  }
  return habit.scheduled_time ?? null;
}
