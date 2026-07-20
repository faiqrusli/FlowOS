# FlowOS Design System — Borderless Workspace

| | |
|---|---|
| **Document type** | Visual hierarchy & border policy |
| **Status** | Historical — policy absorbed into [Design System v3 Workspace](./DESIGN_SYSTEM_V3_WORKSPACE.md) |
| **Version** | 1.0 |
| **Date** | July 19, 2026 |
| **Related** | [Design System v3](./DESIGN_SYSTEM_V3.md) · [V3 Workspace](./DESIGN_SYSTEM_V3_WORKSPACE.md) · [Tokyo Night Warm](./DESIGN_SYSTEM_TOKYO_NIGHT_WARM.md) · [Code standards](./governance/CODE_STANDARDS.md) |

> **Authority note:** For new implementation, follow the **Design System v3** family. This file remains as the Borderless Workspace v1.0 snapshot; elevation numbers and page maps are superseded by Surface 0–10 in V3.

---

## Philosophy

FlowOS should feel like a **workspace**, not a collection of cards.

The interface relies on **spacing, alignment, hierarchy, and surface contrast** instead of borders everywhere. Borders are structural tools, not decoration.

### Hierarchy

```
Workspace
  → Major Panels
    → Sections
      → Rows / Items
        → Interactive Controls
```

Not:

```
Card → Card → Card → Card
```

---

## Surface hierarchy

### Level 0 — Workspace

Entire page background. No border.

### Level 1 — Major workspace panels

Large permanent containers: Focus, Timeline, Notes editor, Reflection, Analytics, Habits, Task columns, Schedule planner.

| Rule | Value |
|---|---|
| Border | None |
| Radius | Large |
| Definition | Background contrast only |
| Shadow | None |

These read as continuous workspace surfaces.

### Level 2 — Sections

Logical groups inside a panel: Current Focus, Next Up, Analytics, Daily Review, Reflection blocks, etc.

| Rule | Value |
|---|---|
| Border | No visible border |
| Separation | Spacing |
| Optional | Quiet divider between unrelated sections |

Never draw a box only because something is a section.

### Level 3 — Rows & items

Task rows, habit rows, queue items, reflection entries, focus history, pool rows, note list items, kanban cards.

**Default:** no border. Use background, padding, and hover only.

These feel like objects on the workspace, not framed boxes.

---

## Border usage rules

Borders exist only for structural separation.

### Keep borders on

- Page boundaries
- Sidebar divider
- Right utility rail divider
- Top navigation divider (if needed)
- **Floating components** (Next Up overlay, Tasks/Habits overlay, menus, dialogs, modals) — 1px subtle border **+** shadow
- **Inputs** (text, search, textarea, select, date/time) — clear affordance
- **Empty drag targets** — 1px dashed, only while empty

### Remove borders from

| Area | Remove |
|---|---|
| Today Focus | Current focus card, Next Up list/rows, Tasks/Habits launcher chrome |
| Docked Next Up | Outer card border; section dividers between NOW / NEXT UP / CONTINUE (keep header + footer only) |
| Next Up overlay | Queue **item** borders (keep panel border + shadow) |
| Tasks overlay | Task row / section borders (keep floating panel border + shadow) |
| Tasks page | Internal card borders on rows; completed section boxes |
| Habits | Individual habit row borders; statistics boxes |
| Schedule | Task Pool / Plan Pool / timeline card borders |
| Focus page | Analytics internal borders; history rows; heatmap container |
| Notes | List row borders; unnecessary editor framing |
| Kanban | Card borders (board background stays; hover may lift) |
| Reflection | Section / entry / accordion / summary borders (textareas keep borders) |

---

## Hover & selection

With borders gone, hover carries affordance.

| State | Treatment |
|---|---|
| Default | Background only |
| Hover | Slightly lighter surface (or soft raise) |
| Selected | Primary-tinted background — **no border** |
| Dragging | Shadow, scale ~1.01, higher elevation |

---

## Visual rules

1. **Spacing before borders.** Too close → increase gap, not stroke weight.
2. **Backgrounds define hierarchy:** Canvas → Panel → Surface → Hover — not stacked borders.
3. **Every border must answer:** “What structure does this communicate?” If the answer is only “makes the card visible,” remove it.

---

## Exceptions (summary)

Keep borders on floating overlays, menus, dialogs, dropdowns, popovers, inputs, search, textareas, selects, date/time pickers, dashed empty drop targets, and sidebar/utility rail separators.

Everything else: spacing, surface contrast, typography.

---

## Final principle

**FlowOS is a workspace, not a dashboard.**

Content lives on a calm continuous canvas. Borders define structure and elevation only. Tasks, notes, habits, queue items, and analytics are lightweight objects — quieter for long sessions, closer to Linear / Arc / premium desktop tools.
