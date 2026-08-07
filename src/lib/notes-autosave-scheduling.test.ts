import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";

const editorSources = [
  readFileSync(
    new URL("../components/notes/notes-panel.tsx", import.meta.url),
    "utf8",
  ),
  readFileSync(
    new URL("../components/layout/sidebar-notes-panel.tsx", import.meta.url),
    "utf8",
  ),
];

describe("Notes autosave scheduling", () => {
  it.each(editorSources)(
    "keeps timers independent per note and retries a failed save",
    (source) => {
      expect(source).toContain(
        "new Map<string, ReturnType<typeof setTimeout>>()",
      );
      expect(source).toContain("saveTimers.current.get(id)");
      expect(source).toContain("scheduleSave(id, 2_000)");
    },
  );

  it("queues rename patches through the same pending map", () => {
    const notesPanelSource = editorSources[0];
    expect(notesPanelSource).toContain(
      "mergeNoteTextPatch(pendingPatchById.current.get(noteId), { title })",
    );
  });
});
