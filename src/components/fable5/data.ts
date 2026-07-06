// Fable5 Today prototype — self-contained mock data + domain types.
// No Supabase, no app contexts: this route renders standalone so the
// design can be evaluated without wiring the whole data layer.

export type Priority = "none" | "low" | "medium" | "high";

export type PlanTask = {
  id: string;
  title: string;
  note?: string;
  group: { name: string; color: string };
  priority: Priority;
  /** planned minutes of focus */
  estimateMin: number;
  /** seconds actually focused (tracked by the focus engine) */
  focusedSec: number;
  scheduled?: string; // e.g. "09:30"
  completed: boolean;
  kind: "task";
};

export type PlanHabit = {
  id: string;
  name: string;
  cadence: string; // "Daily", "Mon–Fri"
  scheduled?: string;
  streak: number;
  trackWithFocus: boolean;
  completed: boolean;
  kind: "habit";
};

export type PlanItem = PlanTask | PlanHabit;

export type TimelineBlock = {
  id: string;
  refId: string; // task/habit id
  kind: "task" | "habit" | "meeting";
  label: string;
  start: number; // minutes from midnight
  end: number;
  color: string;
};

export const GROUPS = {
  deep: { name: "Deep Work", color: "oklch(0.62 0.17 272)" },
  design: { name: "Design", color: "oklch(0.66 0.15 200)" },
  admin: { name: "Admin", color: "oklch(0.7 0.12 75)" },
  growth: { name: "Growth", color: "oklch(0.62 0.15 158)" },
};

export const INITIAL_TASKS: PlanTask[] = [
  {
    id: "t1",
    title: "Ship the Today greenfield spec",
    note: "Resolve focus states + queue behaviour, then write EXPERIMENT.md.",
    group: GROUPS.deep,
    priority: "high",
    estimateMin: 90,
    focusedSec: 0,
    scheduled: "09:30",
    completed: false,
    kind: "task",
  },
  {
    id: "t2",
    title: "Redesign the focus card timer controls",
    note: "Pause / Break / Stop should reveal on hover so the clock stays readable.",
    group: GROUPS.design,
    priority: "high",
    estimateMin: 45,
    focusedSec: 0,
    scheduled: "11:30",
    completed: false,
    kind: "task",
  },
  {
    id: "t3",
    title: "Review pull requests from the team",
    group: GROUPS.admin,
    priority: "medium",
    estimateMin: 30,
    focusedSec: 0,
    completed: false,
    kind: "task",
  },
  {
    id: "t4",
    title: "Draft the ranked future-features appendix",
    group: GROUPS.deep,
    priority: "low",
    estimateMin: 40,
    focusedSec: 0,
    completed: false,
    kind: "task",
  },
];

export const INITIAL_HABITS: PlanHabit[] = [
  {
    id: "h1",
    name: "Morning planning ritual",
    cadence: "Daily",
    scheduled: "09:00",
    streak: 12,
    trackWithFocus: true,
    completed: true,
    kind: "habit",
  },
  {
    id: "h2",
    name: "Deep work — no notifications",
    cadence: "Mon–Fri",
    scheduled: "10:00",
    streak: 6,
    trackWithFocus: true,
    completed: false,
    kind: "habit",
  },
  {
    id: "h3",
    name: "Read for 20 minutes",
    cadence: "Daily",
    streak: 21,
    trackWithFocus: false,
    completed: false,
    kind: "habit",
  },
];

export const INITIAL_TIMELINE: TimelineBlock[] = [
  {
    id: "b1",
    refId: "h1",
    kind: "habit",
    label: "Morning planning",
    start: 9 * 60,
    end: 9 * 60 + 20,
    color: GROUPS.growth.color,
  },
  {
    id: "b2",
    refId: "t1",
    kind: "task",
    label: "Today greenfield spec",
    start: 9 * 60 + 30,
    end: 11 * 60,
    color: GROUPS.deep.color,
  },
  {
    id: "b3",
    refId: "m1",
    kind: "meeting",
    label: "Design sync",
    start: 11 * 60,
    end: 11 * 60 + 30,
    color: "oklch(0.6 0.02 265)",
  },
  {
    id: "b4",
    refId: "t2",
    kind: "task",
    label: "Focus timer redesign",
    start: 11 * 60 + 30,
    end: 12 * 60 + 15,
    color: GROUPS.design.color,
  },
];

export const PRIORITY_META: Record<
  Priority,
  { label: string; color: string }
> = {
  high: { label: "High", color: "var(--destructive)" },
  medium: { label: "Medium", color: "var(--warning)" },
  low: { label: "Low", color: "var(--accent-text)" },
  none: { label: "None", color: "var(--muted-foreground)" },
};

export function minutesToLabel(min: number): string {
  const h = Math.floor(min / 60);
  const m = min % 60;
  const period = h >= 12 ? "PM" : "AM";
  const hour = h % 12 === 0 ? 12 : h % 12;
  return `${hour}:${m.toString().padStart(2, "0")} ${period}`;
}

export function formatClock(totalSec: number): string {
  const h = Math.floor(totalSec / 3600);
  const m = Math.floor((totalSec % 3600) / 60);
  const s = totalSec % 60;
  if (h > 0) {
    return `${h}:${m.toString().padStart(2, "0")}:${s
      .toString()
      .padStart(2, "0")}`;
  }
  return `${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
}

export function formatDurationShort(totalSec: number): string {
  const h = Math.floor(totalSec / 3600);
  const m = Math.floor((totalSec % 3600) / 60);
  if (h > 0) return `${h}h ${m}m`;
  if (m > 0) return `${m}m`;
  return `${totalSec}s`;
}
