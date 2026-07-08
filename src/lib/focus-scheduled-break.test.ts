import { describe, expect, it, vi, beforeEach, afterEach } from "vitest";
import type { StoredActiveFocusSession } from "@/lib/focus-active-session";
import {
  clampBreakLengthMinutes,
  formatCompactBreakCountdownLabel,
  getDefaultBreakAtMinutes,
  getMinBreakAtMinutes,
  getRemainingToBreakSeconds,
  isBreakFinished,
  isBreakReady,
  MAX_BREAK_LENGTH_MINUTES,
  snoozeBreak,
  snoozeBreakFinished,
} from "@/lib/focus-scheduled-break";

const BASE_TIME = new Date("2026-07-08T12:00:00.000Z");

function makeQuickSession(
  overrides: Partial<StoredActiveFocusSession> = {}
): StoredActiveFocusSession {
  return {
    timer_type: "quick",
    session_status: "in_progress",
    started_at: BASE_TIME.toISOString(),
    focus_duration: 0,
    break_duration: 0,
    mode: "focus",
    phase_started_at: BASE_TIME.toISOString(),
    phase_end_at_ms: null,
    paused_segment_seconds: 0,
    accumulated_focus_seconds: 0,
    accumulated_break_seconds: 0,
    label: "Quick Focus",
    ...overrides,
  };
}

function sessionWithFocusMinutes(minutes: number): StoredActiveFocusSession {
  const phaseStart = new Date(BASE_TIME.getTime() - minutes * 60 * 1000);
  return makeQuickSession({
    phase_started_at: phaseStart.toISOString(),
  });
}

describe("getDefaultBreakAtMinutes", () => {
  it.each([
    [0, 25],
    [18, 25],
    [29, 45],
    [46, 60],
    [73, 90],
    [101, 120],
    [125, 150],
  ])("current focus %i min → default %i min", (current, expected) => {
    expect(getDefaultBreakAtMinutes(current)).toBe(expected);
  });
});

describe("getMinBreakAtMinutes", () => {
  it("returns next 5-min step above current focus", () => {
    expect(getMinBreakAtMinutes(18)).toBe(25);
    expect(getMinBreakAtMinutes(22)).toBe(30);
  });
});

describe("getRemainingToBreakSeconds", () => {
  beforeEach(() => {
    vi.useFakeTimers();
    vi.setSystemTime(BASE_TIME);
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it("returns 0 when no schedule", () => {
    expect(getRemainingToBreakSeconds(makeQuickSession())).toBe(0);
  });

  it("never returns negative once past threshold", () => {
    const session = {
      ...sessionWithFocusMinutes(30),
      breakAtMinutes: 25,
    };
    expect(getRemainingToBreakSeconds(session)).toBe(0);
  });

  it("counts down remaining focus seconds to threshold", () => {
    const session = {
      ...sessionWithFocusMinutes(18),
      breakAtMinutes: 25,
    };
    expect(getRemainingToBreakSeconds(session)).toBe(7 * 60);
  });
});

describe("isBreakReady", () => {
  beforeEach(() => {
    vi.useFakeTimers();
    vi.setSystemTime(BASE_TIME);
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it("is false without breakAtMinutes", () => {
    expect(isBreakReady(sessionWithFocusMinutes(30))).toBe(false);
  });

  it("is true when focus reaches threshold", () => {
    const session = {
      ...sessionWithFocusMinutes(25),
      breakAtMinutes: 25,
    };
    expect(isBreakReady(session)).toBe(true);
  });
});

describe("isBreakFinished", () => {
  beforeEach(() => {
    vi.useFakeTimers();
    vi.setSystemTime(BASE_TIME);
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it("is false while focusing even if break length is set", () => {
    const session = {
      ...sessionWithFocusMinutes(15),
      breakLengthMinutes: 10,
    };
    expect(isBreakFinished(session)).toBe(false);
  });

  it("is true on break once elapsed break reaches length", () => {
    const phaseStart = new Date(BASE_TIME.getTime() - 10 * 60 * 1000);
    const session = makeQuickSession({
      mode: "break",
      breakLengthMinutes: 10,
      phase_started_at: phaseStart.toISOString(),
    });
    expect(isBreakFinished(session)).toBe(true);
  });
});

describe("snoozeBreak", () => {
  beforeEach(() => {
    vi.useFakeTimers();
    vi.setSystemTime(BASE_TIME);
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it("returns a new session object", () => {
    const session = {
      ...sessionWithFocusMinutes(20),
      breakAtMinutes: 25,
    };
    const next = snoozeBreak(session, 5);
    expect(next).not.toBe(session);
    expect(next.breakAtMinutes).toBe(30);
  });

  it("clamps to minimum break-at above current focus", () => {
    const session = {
      ...sessionWithFocusMinutes(28),
      breakAtMinutes: 25,
    };
    const next = snoozeBreak(session, 5);
    expect(next.breakAtMinutes).toBe(getMinBreakAtMinutes(28));
  });
});

describe("snoozeBreakFinished", () => {
  it("increments breakLengthMinutes immutably when not on break", () => {
    const session = makeQuickSession({
      mode: "focus",
      breakLengthMinutes: 10,
    });
    const next = snoozeBreakFinished(session, 5);
    expect(next).not.toBe(session);
    expect(next.breakLengthMinutes).toBe(15);
  });

  it("restarts break countdown from now when on break (wall-clock snooze)", () => {
    vi.useFakeTimers();
    vi.setSystemTime(BASE_TIME);
    const phaseStart = new Date(BASE_TIME.getTime() - 12 * 60 * 1000);
    const session = makeQuickSession({
      mode: "break",
      breakLengthMinutes: 10,
      accumulated_break_seconds: 0,
      phase_started_at: phaseStart.toISOString(),
    });
    const next = snoozeBreakFinished(session, 5);
    expect(next.breakLengthMinutes).toBe(5);
    expect(next.accumulated_break_seconds).toBe(12 * 60);
    expect(next.phase_started_at).toBe(BASE_TIME.toISOString());
    expect(isBreakFinished(next)).toBe(false);
    vi.useRealTimers();
  });
});

describe("clampBreakLengthMinutes", () => {
  it("floors at 5 and caps at 180", () => {
    expect(clampBreakLengthMinutes(3)).toBe(5);
    expect(clampBreakLengthMinutes(500)).toBe(MAX_BREAK_LENGTH_MINUTES);
  });
});

describe("formatCompactBreakCountdownLabel", () => {
  it("omits seconds in compact label", () => {
    expect(formatCompactBreakCountdownLabel(2500)).toBe("Break in 42 min");
    expect(formatCompactBreakCountdownLabel(0)).toBe("Break ready");
  });
});
