/**
 * Global app shortcuts — keep in sync with `use-global-shortcuts.ts`.
 * Shown on About and Settings → About. Chord shortcuts are Ctrl-based (not Cmd/meta).
 */
export const GLOBAL_SHORTCUTS = [
  {
    keys: "T",
    action: "Go to Today",
  },
  {
    keys: "Ctrl+Shift+A",
    action: "Open quick capture (full task form)",
  },
  {
    keys: "Ctrl+Shift+D",
    action: "Open today's daily note",
  },
  {
    keys: "Ctrl+Shift+R",
    action: "Open reflection in the sidebar",
  },
  {
    keys: "Ctrl+Alt+N",
    action: "Create a new note",
  },
] as const;
