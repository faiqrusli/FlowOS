import { getTodayDateString } from "@/lib/date-utils";
import type { Reflection } from "@/types/reflection";

function offsetDateString(daysAgo: number): string {
  const d = new Date();
  d.setDate(d.getDate() - daysAgo);
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

function eveningTimestamp(dateKey: string, hour = 21, minute = 15): string {
  return new Date(`${dateKey}T${String(hour).padStart(2, "0")}:${String(minute).padStart(2, "0")}:00`).toISOString();
}

/** Five seeded reflections for the past week (excludes today). */
export function createSeedReflections(): Reflection[] {
  const yesterday = offsetDateString(1);

  return [
    {
      id: "mock-reflection-001",
      reflection_date: yesterday,
      went_well:
        "Completed all scheduled tasks and had a solid 45-minute focus block before lunch. Felt clear-headed for the rest of the afternoon.",
      went_wrong:
        "Skipped my evening walk because I stayed late answering work emails. Should set a hard cutoff at 6pm.",
      custom_entries: [
        { id: "mock-entry-001a", title: "Weight", content: "72.1kg" },
        { id: "mock-entry-001b", title: "Mood", content: "Good — calm and productive" },
        {
          id: "mock-entry-001c",
          title: "Daily Insight",
          content: "Batching similar tasks in the morning saves more time than I expected.",
        },
      ],
      custom_kanbans: [],
      created_at: eveningTimestamp(yesterday, 21, 10),
      user_id: null,
    },
    {
      id: "mock-reflection-002",
      reflection_date: offsetDateString(2),
      went_well:
        "Slept eight hours and finished one chapter of my book. Took a long walk without checking my phone.",
      went_wrong:
        "Procrastinated on meal prep and ordered takeout twice. Groceries from Sunday are still mostly untouched.",
      custom_entries: [
        { id: "mock-entry-002a", title: "Weight", content: "72.3kg" },
        { id: "mock-entry-002b", title: "Mood", content: "Relaxed" },
      ],
      custom_kanbans: [],
      created_at: eveningTimestamp(offsetDateString(2), 20, 45),
      user_id: null,
    },
    {
      id: "mock-reflection-003",
      reflection_date: offsetDateString(3),
      went_well:
        "Kept every habit except one and cleared my inbox to zero before dinner. Team standup was short and useful.",
      went_wrong:
        "Context-switched too much between projects. Lost nearly an hour in the afternoon jumping between tabs.",
      custom_entries: [
        { id: "mock-entry-003a", title: "Weight", content: "72.5kg" },
        {
          id: "mock-entry-003b",
          title: "Daily Insight",
          content: "Turn off Slack notifications during deep-work blocks.",
        },
      ],
      custom_kanbans: [],
      created_at: eveningTimestamp(offsetDateString(3), 21, 30),
      user_id: null,
    },
    {
      id: "mock-reflection-004",
      reflection_date: offsetDateString(4),
      went_well:
        "Morning workout and an early start gave me energy all day. Wrapped up a report I'd been putting off.",
      went_wrong:
        "Didn't sit down to reflect until midnight — too tired to write anything thoughtful. Need to protect evening time.",
      custom_entries: [
        { id: "mock-entry-004a", title: "Weight", content: "72.4kg" },
        { id: "mock-entry-004b", title: "Mood", content: "Tired but satisfied" },
      ],
      custom_kanbans: [],
      created_at: eveningTimestamp(offsetDateString(4), 23, 55),
      user_id: null,
    },
    {
      id: "mock-reflection-005",
      reflection_date: offsetDateString(5),
      went_well:
        "Hit a personal best on focus time and shipped a feature I'd been avoiding for two weeks. Felt genuinely proud.",
      went_wrong:
        "Forgot to drink enough water and got a headache by 4pm. Breaks need to include hydration, not just scrolling.",
      custom_entries: [
        { id: "mock-entry-005a", title: "Weight", content: "72.6kg" },
        { id: "mock-entry-005b", title: "Mood", content: "Energized" },
        {
          id: "mock-entry-005c",
          title: "Daily Insight",
          content: "Starting with the hardest task first sets the tone for the whole day.",
        },
      ],
      custom_kanbans: [],
      created_at: eveningTimestamp(offsetDateString(5), 21, 0),
      user_id: null,
    },
  ];
}

/** Today is intentionally left empty so the user can save a new reflection. */
export function isTodayReflectionDate(dateKey: string): boolean {
  return dateKey === getTodayDateString();
}
