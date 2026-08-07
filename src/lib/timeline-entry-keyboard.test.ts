import { describe, expect, it, vi } from "vitest";
import { activateTimelineEntryFromKeyboard } from "@/lib/timeline-entry-keyboard";

describe("timeline entry keyboard activation", () => {
  it.each(["Enter", " "])("activates the root for %j", (key) => {
    const onSelect = vi.fn();
    const preventDefault = vi.fn();
    const root = {} as EventTarget;

    expect(
      activateTimelineEntryFromKeyboard(
        { key, target: root, currentTarget: root, preventDefault },
        onSelect,
      ),
    ).toBe(true);
    expect(onSelect).toHaveBeenCalledOnce();
    expect(preventDefault).toHaveBeenCalledOnce();
  });

  it.each(["Tab", "Escape", "ArrowDown"])("ignores %j", (key) => {
    const onSelect = vi.fn();
    const preventDefault = vi.fn();
    const root = {} as EventTarget;

    expect(
      activateTimelineEntryFromKeyboard(
        { key, target: root, currentTarget: root, preventDefault },
        onSelect,
      ),
    ).toBe(false);
    expect(onSelect).not.toHaveBeenCalled();
    expect(preventDefault).not.toHaveBeenCalled();
  });

  it("does not activate for a nested control", () => {
    const onSelect = vi.fn();
    const preventDefault = vi.fn();
    const nested = {} as EventTarget;
    const root = {} as EventTarget;

    expect(
      activateTimelineEntryFromKeyboard(
        {
          key: "Enter",
          target: nested,
          currentTarget: root,
          preventDefault,
        },
        onSelect,
      ),
    ).toBe(false);
    expect(onSelect).not.toHaveBeenCalled();
  });
});
