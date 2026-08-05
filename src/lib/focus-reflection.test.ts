import { describe, expect, it, vi } from "vitest";

const { mockFetchTodayReflection, mockSaveReflection } = vi.hoisted(() => ({
  mockFetchTodayReflection: vi.fn(),
  mockSaveReflection: vi.fn(),
}));

vi.mock("@/lib/reflection-storage", () => ({
  fetchTodayReflection: mockFetchTodayReflection,
  saveReflection: mockSaveReflection,
}));

import { saveFocusReflectionEntry } from "@/lib/focus-reflection";

describe("focus reflection kanban", () => {
  it("creates a Focus board and appends later reflections", async () => {
    mockSaveReflection.mockResolvedValue(undefined);
    mockFetchTodayReflection
      .mockResolvedValueOnce(null)
      .mockResolvedValueOnce({
        went_well: "",
        went_wrong: "",
        custom_entries: [],
        custom_kanbans: [
          {
            id: "focus-board",
            title: "Focus",
            cards: [{ id: "first", content: "First reflection" }],
          },
        ],
      });

    await saveFocusReflectionEntry("First reflection");
    await saveFocusReflectionEntry("Second reflection");

    expect(mockSaveReflection.mock.calls[0][0].custom_kanbans[0].cards).toHaveLength(1);
    expect(mockSaveReflection.mock.calls[1][0].custom_kanbans[0].cards).toHaveLength(2);
    expect(mockSaveReflection.mock.calls[1][0].custom_kanbans[0].cards[1]).toMatchObject({
      content: "Second reflection",
    });
  });

  it("appends a session-end entry with a separate Focus identity", async () => {
    mockFetchTodayReflection.mockResolvedValueOnce({
      id: "daily-1",
      reflection_date: "2026-08-05",
      went_well: "",
      went_wrong: "",
      custom_entries: [],
      custom_kanbans: [],
      user_id: "user-1",
      created_at: "2026-08-05T02:00:00.000Z",
    });
    mockSaveReflection.mockResolvedValue(undefined);

    const identity = await saveFocusReflectionEntry("Session insight", {
      session: {
        id: "session-1",
        started_at: "2026-08-05T01:00:00.000Z",
      },
    });

    expect(identity).toMatchObject({
      kind: "focus-session-end",
      source: "focus",
      focusSessionId: "session-1",
      parentDailyRecordId: "daily-1",
    });
    expect(mockSaveReflection.mock.calls.at(-1)?.[0].custom_entries).toEqual([
      expect.objectContaining({ title: "Focus", content: "Session insight" }),
    ]);
  });
});
