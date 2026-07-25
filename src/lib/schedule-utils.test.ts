import { describe, expect, it } from "vitest";
import type { StoredActiveFocusSession } from "@/lib/focus-active-session";
import {
  buildFocusScheduleItem,
  buildTimelineEntries,
  computeScheduleSummary,
  findCurrentItemIndex,
  formatScheduleTimeRange,
  getItemTimelineStatus,
  mergeFocusIntoScheduleItems,
} from "@/lib/schedule-utils";
import type { ScheduleItem } from "@/types/schedule";

/** 2026-07-08T12:00:00Z is 20:00 in Asia/Singapore (the app timezone). */
const SESSION_START = "2026-07-08T12:00:00.000Z";
const SESSION_START_MINUTES = 20 * 60;

function makeItem(overrides: Partial<ScheduleItem> = {}): ScheduleItem {
  return {
    id: "item-1",
    entityId: "task-1",
    title: "Draft spec",
    type: "task",
    time: "9:00 am",
    timeSort: 9 * 60,
    completed: false,
    href: "/tasks",
    ...overrides,
  };
}

function makeSession(
  overrides: Partial<StoredActiveFocusSession> = {}
): StoredActiveFocusSession {
  return {
    timer_type: "quick",
    session_status: "in_progress",
    started_at: SESSION_START,
    focus_duration: 0,
    break_duration: 0,
    mode: "focus",
    phase_started_at: SESSION_START,
    phase_end_at_ms: null,
    paused_segment_seconds: 0,
    accumulated_focus_seconds: 0,
    accumulated_break_seconds: 0,
    label: "Quick Focus",
    ...overrides,
  };
}

describe("buildFocusScheduleItem", () => {
  it("builds a quick-focus item anchored at the session start", () => {
    const item = buildFocusScheduleItem(makeSession());

    expect(item).toMatchObject({
      id: "focus-active",
      entityId: "focus-active",
      title: "Focus Session",
      subtitle: "Quick Focus",
      type: "focus",
      timeSort: SESSION_START_MINUTES,
      timeEnd: null,
      timeEndSort: undefined,
      completed: false,
      href: "/focus",
      isActiveFocus: true,
    });
    expect(item.time).toMatch(/8:00/);
  });

  it("labels break mode", () => {
    expect(buildFocusScheduleItem(makeSession({ mode: "break" })).subtitle).toBe(
      "Quick Focus · Break"
    );
    expect(
      buildFocusScheduleItem(makeSession({ timer_type: "pomodoro", mode: "break" })).subtitle
    ).toBe("Pomodoro · Break");
    expect(buildFocusScheduleItem(makeSession({ timer_type: "pomodoro" })).subtitle).toBe(
      "Pomodoro"
    );
  });

  it("adds an end time for pomodoro sessions with a phase end", () => {
    const item = buildFocusScheduleItem(
      makeSession({
        timer_type: "pomodoro",
        phase_end_at_ms: new Date(SESSION_START).getTime() + 25 * 60 * 1000,
      })
    );

    expect(item.timeEndSort).toBe(SESSION_START_MINUTES + 25);
    expect(item.timeEnd).toMatch(/8:25/);
  });
});

describe("mergeFocusIntoScheduleItems", () => {
  const morning = makeItem({ id: "morning", timeSort: 9 * 60 });
  const night = makeItem({ id: "night", timeSort: 22 * 60 });

  it("returns the same items when no session is active", () => {
    const items = [morning, night];
    expect(mergeFocusIntoScheduleItems(items, null)).toBe(items);
  });

  it("inserts the focus item in time order", () => {
    const merged = mergeFocusIntoScheduleItems([morning, night], makeSession());
    expect(merged.map((item) => item.id)).toEqual(["morning", "focus-active", "night"]);
  });
});

describe("buildTimelineEntries", () => {
  it("returns only the now marker for an empty schedule", () => {
    expect(buildTimelineEntries([], 600)).toEqual([{ kind: "now" }]);
  });

  it("inserts the now marker before the first future item", () => {
    const past = makeItem({ id: "past", timeSort: 8 * 60 });
    const future = makeItem({ id: "future", timeSort: 18 * 60 });

    expect(buildTimelineEntries([past, future], 12 * 60)).toEqual([
      { kind: "item", item: past, itemIndex: 0 },
      { kind: "now" },
      { kind: "item", item: future, itemIndex: 1 },
    ]);
  });

  it("appends the now marker when every item is in the past", () => {
    const past = makeItem({ id: "past", timeSort: 8 * 60 });
    expect(buildTimelineEntries([past], 12 * 60).at(-1)).toEqual({ kind: "now" });
  });

  it("puts the now marker first when every item is in the future", () => {
    const future = makeItem({ id: "future", timeSort: 18 * 60 });
    expect(buildTimelineEntries([future], 12 * 60)[0]).toEqual({ kind: "now" });
  });
});

describe("findCurrentItemIndex", () => {
  it("returns null for an empty schedule", () => {
    expect(findCurrentItemIndex([], 12 * 60)).toBeNull();
  });

  it("prefers an active focus item", () => {
    const items = [
      makeItem({ id: "past", timeSort: 8 * 60 }),
      makeItem({ id: "focus", type: "focus", isActiveFocus: true, timeSort: 23 * 60 }),
    ];
    expect(findCurrentItemIndex(items, 12 * 60)).toBe(1);
  });

  it("returns the latest incomplete past item", () => {
    const items = [
      makeItem({ id: "early", timeSort: 8 * 60 }),
      makeItem({ id: "later", timeSort: 10 * 60 }),
      makeItem({ id: "future", timeSort: 18 * 60 }),
    ];
    expect(findCurrentItemIndex(items, 12 * 60)).toBe(1);
  });

  it("skips completed past items", () => {
    const items = [
      makeItem({ id: "early", timeSort: 8 * 60 }),
      makeItem({ id: "later", timeSort: 10 * 60, completed: true }),
    ];
    expect(findCurrentItemIndex(items, 12 * 60)).toBe(0);
  });

  it("falls back to the next incomplete future item", () => {
    const items = [
      makeItem({ id: "done", timeSort: 8 * 60, completed: true }),
      makeItem({ id: "future", timeSort: 18 * 60 }),
    ];
    expect(findCurrentItemIndex(items, 12 * 60)).toBe(1);
  });

  it("returns null when everything is complete", () => {
    const items = [
      makeItem({ id: "done", timeSort: 8 * 60, completed: true }),
      makeItem({ id: "also-done", timeSort: 18 * 60, completed: true }),
    ];
    expect(findCurrentItemIndex(items, 12 * 60)).toBeNull();
  });
});

describe("getItemTimelineStatus", () => {
  it("marks an active focus item current regardless of index", () => {
    const focus = makeItem({ type: "focus", isActiveFocus: true, timeSort: 8 * 60 });
    expect(getItemTimelineStatus(focus, 3, 0, 12 * 60)).toBe("current");
  });

  it("marks the current index current", () => {
    expect(getItemTimelineStatus(makeItem({ timeSort: 8 * 60 }), 1, 1, 12 * 60)).toBe(
      "current"
    );
  });

  it("splits the rest into past and future", () => {
    expect(getItemTimelineStatus(makeItem({ timeSort: 8 * 60 }), 0, 1, 12 * 60)).toBe("past");
    expect(getItemTimelineStatus(makeItem({ timeSort: 18 * 60 }), 2, 1, 12 * 60)).toBe(
      "future"
    );
    expect(getItemTimelineStatus(makeItem({ timeSort: 12 * 60 }), 2, 1, 12 * 60)).toBe("past");
  });
});

describe("computeScheduleSummary", () => {
  it("counts completable items and ignores focus items", () => {
    const summary = computeScheduleSummary(
      [
        makeItem({ id: "done", timeSort: 8 * 60, completed: true }),
        makeItem({ id: "next", timeSort: 18 * 60 }),
        makeItem({ id: "focus", type: "focus", isActiveFocus: true, timeSort: 12 * 60 }),
      ],
      12 * 60
    );

    expect(summary).toMatchObject({ completed: 1, total: 2, remaining: 1 });
    expect(summary.nextItem?.id).toBe("next");
  });

  it("falls back to the first incomplete item when none remain today", () => {
    const summary = computeScheduleSummary(
      [
        makeItem({ id: "missed", timeSort: 8 * 60 }),
        makeItem({ id: "done", timeSort: 9 * 60, completed: true }),
      ],
      12 * 60
    );

    expect(summary.nextItem?.id).toBe("missed");
  });

  it("returns no next item when everything is complete", () => {
    const summary = computeScheduleSummary(
      [makeItem({ id: "done", timeSort: 8 * 60, completed: true })],
      12 * 60
    );

    expect(summary).toEqual({ completed: 1, total: 1, remaining: 0, nextItem: null });
  });
});

describe("formatScheduleTimeRange", () => {
  it("joins start and end times", () => {
    expect(formatScheduleTimeRange(makeItem({ time: "9:00 am", timeEnd: "10:00 am" }))).toBe(
      "9:00 am – 10:00 am"
    );
  });

  it("returns the start time alone when there is no end", () => {
    expect(formatScheduleTimeRange(makeItem({ time: "9:00 am", timeEnd: null }))).toBe(
      "9:00 am"
    );
    expect(formatScheduleTimeRange(makeItem({ time: null }))).toBeNull();
  });
});
