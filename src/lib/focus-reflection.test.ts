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
    await saveFocusReflectionEntry("Second reflection", {
      source: "focus-session",
      sessionId: "session-2",
      startedAt: "2026-08-06T10:00:00.000Z",
      endedAt: "2026-08-06T10:30:00.000Z",
      focusSeconds: 1800,
    });

    expect(mockSaveReflection.mock.calls[0][0].custom_kanbans[0].cards).toHaveLength(1);
    expect(mockSaveReflection.mock.calls[1][0].custom_kanbans[0].cards).toHaveLength(2);
    expect(mockSaveReflection.mock.calls[1][0].custom_kanbans[0].cards[1]).toMatchObject({
      content: "Second reflection",
      provenance: { sessionId: "session-2", focusSeconds: 1800 },
    });
  });
});