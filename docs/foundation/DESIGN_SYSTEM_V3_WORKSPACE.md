# FlowOS Design System v3 — Workspace & Layout

| | |
|---|---|
| **Document type** | Supporter for [Design System v3](./DESIGN_SYSTEM_V3.md) |
| **Status** | Active implementation authority |
| **Version** | 3.0 |
| **Date** | July 19, 2026 |
| **Parent** | [DESIGN_SYSTEM_V3.md](./DESIGN_SYSTEM_V3.md) |
| **Sibling** | [DESIGN_SYSTEM_V3_INTERACTION.md](./DESIGN_SYSTEM_V3_INTERACTION.md) |
| **Absorbs** | [Borderless Workspace v1.0](./DESIGN_SYSTEM_BORDERLESS_WORKSPACE.md) (policy retained; elevation numbers use Surface 0–10) |

---

## What this document talks about

This supporter defines **how FlowOS is spatially composed** so every page feels like one desk under the same lighting:

1. Borderless workspace hierarchy (workspace → canvas → sections → rows → controls).
2. Application shell (left nav, main canvas, right utility, status chrome).
3. Docked vs floating elevation (when borders/shadows are allowed).
4. **Per-module surface maps** (Today, Tasks, Habits, Focus, Notes, Reflection, Schedule).
5. Consistency rules so new panels never invent a one-off layout language.

**Use with:** Surface tokens from [DESIGN_SYSTEM_V3.md](./DESIGN_SYSTEM_V3.md). Type/spacing/hover recipes from [DESIGN_SYSTEM_V3_INTERACTION.md](./DESIGN_SYSTEM_V3_INTERACTION.md).

**Does not define:** New hex colors, typography scales, or motion curves — those live elsewhere in the V3 family.

---

## Workspace philosophy

FlowOS should feel like a **workspace**, not a dashboard of cards.

```
Workspace (Surface 1)
  → Context regions (Surface 2)
    → Major canvases (Surface 3)
      → Sections (spacing, not boxes)
        → Rows / items (Surface 4)
          → Interactive controls (Surface 5+)
```

Not:

```
Card → Card → Card → Card
```

### Structural vs decorative

| Tool | Role |
|---|---|
| Luminance (Surface 0–10) | Hierarchy |
| Spacing | Grouping |
| Typography | Meaning |
| Soft Indigo | Attention only |
| Borders | Structure / affordance / a11y — never “make the card visible” |
| Shadows | Floating layers only |

---

## Shell architecture

FlowOS authenticated shell is three vertical bands plus optional overlays.

```
┌──────────┬─────────────────────────────┬──────────┐
│ Surface 0│        Surface 1            │ Surface 2│
│ Left nav │     Main workspace          │ Right    │
│ (chrome) │     (page content)          │ utility  │
└──────────┴─────────────────────────────┴──────────┘
```

| Band | Surface | Role |
|---|---|---|
| Left navigation | **0** | Permanent app anchor. Darkest. Never shares paint with workspace. |
| Main page | **1** | Foundation. Every module page starts here. |
| Right utility rail + drawer | **2** (content shell) | Another work area — lighter than app bg, darker than canvases. Attached, not floating. **Never Surface 0.** |

Luminance order (shell → content): **0 → 1 → 2 → 3 → 4 → 5** (Left → App → Right utility → Canvas → Cards → Inputs).

### Shell rules

1. Left rail stays flush / structural; do not recolor it to match page canvas.
2. Right utility sits between app background and canvas — one tiny step is enough; do not brighten it toward card paint.
3. Top status / header band aligns to shared shell height; no decorative bottom stroke required if spacing + surface already separate.
4. Expanding utility panels **overlay or slide** without inventing a fourth background family.
5. Critical shell controls stay **visible without hover** ([PRINCIPLES #10](./governance/PRINCIPLES.md)).

### Geometry (implementation targets)

Frozen targets may live in `shell-dimensions.ts` / `workspace-layout.ts`; visual authority is this doc. Prefer:

- Left collapsed rail: tight icon column (existing ~56–88px contract — do not widen for decoration).
- Right utility rail: slim icon strip flush to viewport edge when collapsed.
- Shared header band: single height across brand, status, utility headers (currently 43px in shell polish).

**Two spacing systems (do not merge):**

| System | Role | Target |
|---|---|---|
| Rail gutter | Attach workspace to left/right chrome | **8px** |
| Page inset | Content origin inside workspace (titles, toolbars, cards) | **16px** (not 32 — stacked with gutter felt detached) |
| Section gap | Title → toolbar → primary content | **24px** |

Rhythm: `Rail → gutter 8 → Workspace → page inset 16 → Title → section gap 24 → content`.  
Total rail→title ≈ **24px**. Do not stack extra horizontal pads. Separation is spacing + alignment — **no shell divider strokes.**

---

## Borderless policy

### Level meanings (composition)

| Level | What | Border | Defined by |
|---|---|---|---|
| Workspace | Page | None | Surface 1 |
| Major canvas | Focus, Notes, Reflection, Schedule, docked Queue | None | Surface 3 vs parent |
| Section | NOW / NEXT UP, analytics block, reflection block | None (optional quiet divider) | Spacing |
| Row / item | Task, habit, queue item, note row, kanban card | None by default | Surface 4 + hover |
| Control | Input, select, textarea | Allowed | Surface 5 + control border |

### Keep borders on

- Inputs, search, textareas, selects, date/time pickers
- Keyboard focus rings (primary)
- Empty / active drag targets (dashed primary while relevant)
- **Floating** overlays: Next Up overlay mode, Tasks/Habits floating panels, menus, dialogs, popovers — subtle border **+** soft shadow
- Structural page edges only when luminance alone fails (rare)

### Remove borders from

| Area | Remove |
|---|---|
| Today Focus / Current Focus | Outer framing strokes |
| Docked Next Up | Outer card stroke; section boxes between NOW / NEXT UP / CONTINUE |
| Queue items (docked or overlay list) | Per-item strokes |
| Tasks / Habits overlays | Internal row “card” strokes (keep floating panel chrome) |
| Tasks board / list | Decorative row boxes |
| Habits | Row / stats boxing for decoration |
| Schedule pools / timeline cards | Decorative strokes |
| Focus analytics / history | Nested box strokes |
| Notes list rows | Decorative strokes |
| Reflection sections / entries | Decorative strokes (inputs keep borders) |
| Kanban cards | Default strokes; hover lifts via Surface 6 |

### Divider rule

Prefer **spacing** over hairlines. When a divider is needed (unrelated section groups only), use ~`rgba(255,255,255,0.05)` — quieter than content. Never divider-between-every-row.

---

## Docked vs floating

| Mode | Surface | Border | Shadow | Feels like |
|---|---|---|---|---|
| Docked panel (Focus, docked Queue, Timeline) | 2–3 | None | None | Built into the desk |
| Floating overlay (Queue mid/drawer, Tasks/Habits float) | 8-family chrome on workspace | Subtle | Soft floating | Temporary tool |
| Dialog / Quick Capture | 9 | Elevated border OK | Dialog shadow | Modal work |
| Menu / tooltip | 8 | Elevated border OK | Light floating | Ephemeral |

**Never** give docked panels floating shadows “to make them clearer.” Raise luminance one step instead, or darken the parent workspace (Surface 1).

---

## Per-module surface maps

All maps use [Surface 0–10](./DESIGN_SYSTEM_V3.md). Implementers must not invent parallel backgrounds.

### Today

| Region | Surface | Notes |
|---|---|---|
| Page workspace | 1 | Foundation |
| Left nav | 0 | Shell |
| Right utility | 2 | Attached work |
| Focus / timer canvas | 3 | Equal peer to Queue |
| Docked Next Up canvas | 3 | Same elevation as Focus |
| Timeline background | 1 | Matches workspace |
| Timeline events | 4 | Content |
| Selected event | 7 | + primary indicator **or** outline, not both |
| Now-line | Primary | Soft Indigo only |
| Task / habit rows in panels | 4 | |
| Hover | 6 | Temporary |
| Search / capture field | 5 | |
| Dropdowns | 5 | |
| Context menus | 8 | |
| Quick Capture dialog | 9 | Content fields 5; avoid stacking many elevations |
| Settings modal (exception) | Shell **7**, nav rail **4** | Quieter than default dialogs; selected nav = `primary-soft`; fields Surface 5 |

**Today rules**

- Focus and docked Queue are **equal canvases** (both Surface 3).
- Collapsed Queue rail remains a narrow workspace strip (Surface 3 family), not Surface 0 chrome.
- Status rail merges with workspace; no boxed “dashboard widgets.”
- Tasks/Habits launchers sit on the desk; floating panels use floating rules above.

### Tasks

| Region | Surface | Notes |
|---|---|---|
| Page | 1 | |
| Board / list canvas | 3 | |
| Columns / group wells | 2 or 3 | One step only vs parent |
| Task cards / rows | 4 | Borderless default |
| Hover / selected | 6 / 7 | |
| Detail drawer | 3 | Groups via spacing, not nested cards |
| Inputs / planning controls | 5 | |
| Menus | 8 | |

Avoid cards-inside-cards in Task Details — use section spacing.

### Habits

| Region | Surface | Notes |
|---|---|---|
| Page | 1 | |
| Checklist / board canvas | 3 | |
| Habit cards / rows | 4 | |
| Stats / summary | Prefer Surface 3 + type, not extra boxes | |
| Inputs | 5 | |

### Focus (module page)

| Region | Surface | Notes |
|---|---|---|
| Page | 1 | |
| Timer / session canvas | 3 | |
| Analytics / history canvases | 3 | |
| Rows / heatmap cells | 4 / data color | No decorative frames |
| Settings panels | 3–4 | App Settings modal: shell 7 / rail 4 (decision-log 2026-07-20) |

### Notes

| Region | Surface | Notes |
|---|---|---|
| Page / panel background | 3 | |
| Editor body | 5 | Writing surface |
| Toolbar | 4 | Quiet chrome on canvas |
| List rows / cards | 4 | |
| Popovers | 8 | |
| Growth / sidebar regions | 2–3 | Context, not Surface 0 |

### Reflection

| Region | Surface | Notes |
|---|---|---|
| Panel / page canvas | 3 | |
| Question inputs | 5 | Keep input borders |
| Custom entries / boards | 4 | Spacing between sections |
| Dialogs | 9 | |

Strip accordion/section decorative borders; labels use muted section typography (~75% opacity — see Interaction).

### Schedule

| Region | Surface | Notes |
|---|---|---|
| Workspace / planner well | 2 | |
| Timeline events | 4 | |
| Current / selected | 7 | |
| Completed | 3 | Quieter than active work |
| Hover | 6 | |
| Context menu | 8 | |
| Task / plan pools | 3–4 | Borderless rows |

---

## Overlay & clash rules (Today)

1. Floating Next Up and floating Tasks/Habits must not fight for the same spatial language — exclusive clash behavior stays in layout code; visually both use floating elevation.
2. Dragging schedule items into Queue: dashed primary target only while dragging / empty target relevant.
3. Dismiss layers must not paint a new surface family; dimming if used stays neutral and soft.

---

## Consistency checklist (every page)

Before merge, confirm:

- [ ] Page background is Surface 1 (or documented exception).
- [ ] Major work area is Surface 3 (or Surface 2 for context wells).
- [ ] Content objects are Surface 4.
- [ ] No decorative borders on docked canvases or rows.
- [ ] Floating UI uses Surface 8–9 + allowed shadow only.
- [ ] Left nav remains Surface 0; right utility is not Surface 0.
- [ ] No new hex backgrounds; Soft Indigo only for allowed attention.
- [ ] Sections separated by spacing first, dividers second.
- [ ] Critical controls visible without hover.

---

## Migration notes

| Prior doc | Status under V3 |
|---|---|
| [Borderless Workspace](./DESIGN_SYSTEM_BORDERLESS_WORKSPACE.md) | Policy absorbed here; keep file as historical pointer |
| Tokyo Night Warm surface names | Alias to Surface 0–10 during token migration |
| Neutral Dark / Navy | Historical; do not mix charcoal families into V3 pages |

When in doubt: **one desk, tiny luminance steps, borderless docked work, Soft Indigo only for attention.**
