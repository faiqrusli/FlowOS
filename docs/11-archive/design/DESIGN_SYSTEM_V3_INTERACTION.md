# FlowOS Design System v3 — Interaction, Type & Motion

| | |
|---|---|
| **Document type** | Supporter for [Design System v3](./DESIGN_SYSTEM_V3.md) |
| **Status** | Active implementation authority |
| **Version** | 3.0 |
| **Date** | July 19, 2026 |
| **Parent** | [DESIGN_SYSTEM_V3.md](./DESIGN_SYSTEM_V3.md) |
| **Sibling** | [DESIGN_SYSTEM_V3_WORKSPACE.md](./DESIGN_SYSTEM_V3_WORKSPACE.md) |

---

## What this document talks about

This supporter defines **how users perceive change and meaning** once surfaces and layout are correct:

1. Typography hierarchy (calm, readable for long sessions).
2. Spacing scale (grouping without boxes).
3. Radius system (consistent corners across controls and canvases).
4. Hover, selection, focus, and drag state recipes.
5. Borders & shadows (when allowed — aligned with borderless workspace).
6. Motion (quiet, short, ease-out).
7. Control patterns (buttons, inputs, section labels, chrome polish).
8. Semantic / module color (content identity, not shell lighting).

**Use with:** Surfaces from [DESIGN_SYSTEM_V3.md](./DESIGN_SYSTEM_V3.md). Page placement from [DESIGN_SYSTEM_V3_WORKSPACE.md](./DESIGN_SYSTEM_V3_WORKSPACE.md).

**Does not define:** New background hexes or per-page layout maps.

---

## Typography

FlowOS type must feel precise and quiet — premium software, not a marketing site, not a terminal theme dump.

Hierarchy relies primarily on **weight + opacity**, not font size. Avoid making everything bold. The eye should land on task titles and the timer before metadata.

### Opacity ladder (from `--text-primary` `#C0CAF5`)

| Role | Opacity | Token |
|---|---|---|
| Primary | 100% | `--text-primary` |
| Secondary | 78% | `--text-secondary` |
| Metadata | 62% | `--text-muted` |
| Inactive labels | 48% | `--text-inactive` |
| Section labels | 65% | `--text-section` |
| Placeholders | 42% | `--text-placeholder` |
| Disabled | 35% | `--text-disabled` |
| Dividers | 5% white | `--border-subtle` / `--divider` |

### Weight ladder

| Role | Weight | Utility |
|---|---|---|
| Display timer | 800 | `.flow-type-display` |
| Task titles | 700 | `.flow-type-title` |
| Section headers | 500 | `.flow-section-label` / `.flow-type-section` |
| Buttons | 550 | `.flow-type-button` / button base |
| Labels | 500 | `.flow-type-label` |
| Metadata | 425 | `.flow-type-meta` |
| Captions | 400 | `.flow-type-caption` |

### Hierarchy rules

1. Prefer weight/opacity over inventing more font sizes.
2. **Section labels** (`TODAY`, `NEXT UP`, `CONTINUE`): uppercase, weight 500, 65% opacity, `0.08em` tracking. Content titles stay louder.
3. Timer / hero numerals use display weight (800); they are the rare “loud” type moment.
4. Do not invent one-off text colors (no warm gray, no pure white `#FFF` for body).
5. Meta (Inbox, duration, timestamps) stays muted at ~62%; content titles stay primary at full opacity.
6. Do not stack `text-muted-foreground/80` (etc.) on top of muted — that re-boosts meta contrast.

### Fonts

Ship with existing app fonts (`Geist` / shell stack). Do not swap to Inter/Roboto/system defaults for “cleanup.” Expressive marketing fonts are out of scope for the authenticated app.

---

## Spacing

Spacing is the primary grouping tool after luminance. Freeze arbitrary margins — use the scale.

### Scale

| Token | Value | Typical use |
|---|---|---|
| `--space-2` | 8px | Tight control gaps |
| `--space-3` | 12px | Compact related gaps |
| `--space-4` | 16px | Metadata group gap, related rows |
| `--space-5` | 20px | Section label → items |
| `--space-6` | 24px | After current-task block / before divider |
| `--space-8` | 32px | Between major regions (Task → Queue) |
| `--space-10` | 40px | Before Continue / major chapter break |
| `--space-12` | 48px | Rare page-level breathing room |

Aliases: `--space-tiny`→2, `--space-sm`→4, `--space-md`→6, `--space-lg`→8, `--space-xl`→10.

### Document rhythm (Focus / Queue example)

```
Current Task
  24px padding under title block
──────────────────────────────── divider
  24–32px
Queue label
  20px
items
  40px
Continue label
  20px
items
```

### Metadata spacing

Treat metadata as independent groups (Inbox vs time). Use `.flow-meta-row` — **≥16px** between groups. Prefer whitespace over raising contrast.

### Rules

1. Too close → increase gap, not border weight.
2. Related items: 8–16px. Unrelated sections: 24px+.
3. Docked Queue sections: spacing first; no divider between every section.
4. Do not invent one-off margins outside the scale.

---

## Queue indices

Queue numbers are **navigational markers**, not content (VS Code line numbers / Linear list indices).

Use `.flow-queue-index`:

- Monospace + tabular nums
- Fixed width (~1.25rem), right-aligned
- ~45% opacity of primary
- Smaller than task title
- Never compete with titles

---

## Icons

Chrome / decorative icons default to **~70% opacity** (`.flow-icon-quiet`), full opacity on hover/focus.

Prefer **Title → icon** over **icon → Title** for priority flags and similar markers so the title leads.

---

## Interactive hierarchy

Every interactive element should define states via **surface tone**, not new borders/shadows:

| State | Treatment |
|---|---|
| Default | Resting surface |
| Hover | Surface +1 (often → 6) |
| Pressed | Surface +2 (often → 7) |
| Selected / Active | Surface 7 + one primary cue |
| Focused (keyboard) | Primary ring |
| Disabled | ~45% opacity |
| Dragging | ~40% opacity + slight elevation |
| Drop target | Dashed primary (empty/relevant only) |
| Completed | ~70% opacity / strike where appropriate |

Utility: `.flow-interactive` (+ `data-selected` / `data-dragging` / `data-completed`).

---

## Radius

| Component | Radius |
|---|---|
| Buttons / compact controls | 10px |
| Inputs / selects | 12px |
| Cards / rows / content objects | 14px |
| Large canvases (Focus, Notes, docked Queue) | 18px |
| Dialogs | 22px |
| Command palette / highest float | 24px |

Keep radius consistent within a family. Do not mix pill-everything with sharp-everything on the same page.

Shell icon hit targets may use ~12px (`rounded-xl`) to match existing rails — stay within the control family, not dialog radius.

---

## Hover rules

Hover should never introduce:

- New borders
- Strong shadows
- Blue / primary glow washes on large surfaces

**Only luminance:** hover always **lights up** (Surface +1 or more). Never darken.

| Context | Resting | Hover |
|---|---|---|
| Content card / row on canvas | Surface 4 | Surface 6 (`--surface-hover`) |
| Floating dock / menu (`flow-floating-overlay`, `.flow-surface-elevated`) | Surface 7 | Surface 9 (`--surface-float-hover`) |
| Dialog (`.flow-surface-modal`) | Surface 9 | Surface 10 |
| Settings modal (exception) | Surface 7 shell / Surface 4 rail | Hover remap → Surface 8; nav selected = `primary-soft` |
| Inactive chrome (nav icon, utility icon, ghost control) | — | `rgba(255,255,255,0.03)` wash — temporary |
| Primary button | `--primary` | `--primary-hover` |

Floating parents rebind `--surface-hover` / `--surface-selected` so child `hover:bg-surface-hover` stays correct.

Hover must not be required to discover critical controls ([PRINCIPLES #10](./governance/PRINCIPLES.md)).

---

## Selected rules

Selection uses **Surface lift** (typically +1–2), plus **exactly one** of:

- Primary **left indicator**, or
- Primary **outline / ring**

Never both. Never selection-by-border alone without luminance change. On floating docks, prefer luminance only (`bg-selected` → Surface 8) — rows already carry a group left edge.

| Context | Selected |
|---|---|
| Queue item / list row | Surface lift + one primary cue |
| Floating Tasks/Habits row | Surface 8 + primary ring; hover Surface 9 |
| Timeline event | Surface 7 + one primary cue |
| Nav / utility icon | `--primary-soft` fill + primary icon color |
| Segmented control | Fill + soft selected treatment — not heavy inset border |

### Active Focus identity (Current Task ↔ Timer)

Primary Soft Indigo (`--primary`) marks **active execution** via the same cues as Today / Timeline:

1. Timer status label (`IN FOCUS`)
2. Soft Indigo focus dot (`.timeline-focus-indicator`)
3. Group left edge on the Current Focus Task (`.timeline-task-in-focus`)

| Element | Treatment |
|---|---|
| Focus dot | Soft Indigo pulse on Current Focus / Today / Timeline while focusing |
| Left edge | Group accent edge (same as Timeline in-focus), not a separate primary bar |
| Current Task surface | Surface 6 (hover Surface 7); no glow, shadow, or gradient |
| Title | weight 600 (`.flow-focus-current-title`) |
| Meta (Focused …) | 70% (`.flow-focus-current-meta`) |
| Goal | 55% (`.flow-focus-current-goal`) |
| Focus switch | opacity + background only, **200ms ease-out** |

Do **not** invent a second primary left-bar system for Current Focus alone.

---

## Focus (keyboard) & drag

| State | Treatment |
|---|---|
| Keyboard focus | Primary ring / border (`--primary-ring` / `--primary-border`) — accessibility always |
| Empty drop target | 1px dashed primary, only while empty / relevant |
| Active drag | Slight elevation (shadow allowed), scale ~1.01 max, higher stacking — no neon outline flood |
| Drag cancel | Settle motion ~180ms ease-out |

---

## Borders (interaction view)

Aligned with [V3 Workspace](./DESIGN_SYSTEM_V3_WORKSPACE.md). Quick reference:

| Case | Treatment |
|---|---|
| Default docked UI | None |
| Inputs | `1px rgba(255,255,255,0.05)` |
| Elevated chrome (menus/dialogs) | Slightly stronger white opacity (~0.08) OK |
| Keyboard focus | Primary |
| Drag target | Dashed primary |

Chrome dividers (nav separators when used): ~`rgba(255,255,255,0.05)`.

---

## Shadows

Tokyo Night stays soft. Default docked UI: **none**.

| Layer | Shadow |
|---|---|
| Docked canvases / cards | None |
| Floating UI (menus, tooltips, floating panels) | `0 2px 6px rgb(0 0 0 / 15%)` |
| Dialogs | `0 10px 30px rgb(0 0 0 / 20%)` |

Nothing stronger. No multi-layer glass stacks. No primary-colored glow behind timers for decoration.

---

## Motion

Quiet presence, not noise.

| Token / pattern | Value |
|---|---|
| Default ease | `ease-out` |
| Fast interaction | ~150–180ms |
| Panel open (utility drawer) | ~220ms |
| Entrances | Ease-out |
| Exits | Ease-in or matched ease-out short |

### Rules

1. Prefer opacity + transform; avoid layout thrash animations on large trees.
2. Do not animate background color through large jumps; swap to the correct Surface.
3. Tooltips: short delay OK for dense chrome; collapsed nav may use instant tooltips for speed.
4. Ship intentional motion only — 2–3 signature moments max per surface (e.g. overlay rise), not decoration on every hover.
5. Focus task switch: opacity + background + accent bar only (~200ms ease-out). No scale, bounce, or glow.

---

## Buttons

### Primary

| Property | Token / value |
|---|---|
| Background | `--primary` `#7B88EF` |
| Text | `--primary-foreground` `#1A1B26` |
| Hover | `--primary-hover` |
| Pressed | `--primary-pressed` / `--primary-active` |

Add Task and other primary CTAs stay the strongest Soft Indigo fill on the page. Nav selection stays quieter (`--primary-soft`).

### Secondary

Surface 4–5 family fill; quiet border only if needed for affordance; text primary/secondary.

### Ghost

Muted text; hover `rgba(255,255,255,0.03)` or Surface 6 — no permanent chip.

---

## Inputs & fields

| Property | Rule |
|---|---|
| Background | Surface 5 |
| Border | `rgba(255,255,255,0.05)` |
| Text | `--text-primary` |
| Placeholder | `--text-placeholder` |
| Focus | Primary ring |
| Hover | Slightly lighter control surface — not primary wash |

Do not place Surface 5 directly on Surface 1 — sit fields on a canvas (Surface 3) or card (Surface 4) per [V3 core](./DESIGN_SYSTEM_V3.md#surface-usage-rules).

Quick Capture / dialogs: shell Surface 9; field content Surface 5; footer quieter (Surface 3). Avoid stacking many elevations inside one dialog.

**Settings modal exception:** shell Surface 7, nav rail Surface 4 (founder lock 2026-07-20) — quieter than default dialogs so the settings chrome does not compete with content.

---

## Section labels & chrome polish

| Element | Treatment |
|---|---|
| Section labels | 500 / 65% / `0.08em` (`.flow-section-label`) |
| Inactive chrome hover | `rgba(255,255,255,0.03)` |
| Structural dividers | `rgba(255,255,255,0.05)` when needed |
| Scrollbars | Quiet track/thumb from Tokyo Night family; no bright accents |

Collapse controls on rails: icon-first; hover wash only — no permanent bordered rectangle unless selected.

---

## Semantic & module color

<a id="semantic--module-color"></a>

Semantic color is for **meaning in content**, not for shell lighting.

### Semantic

| Role | Example | Use |
|---|---|---|
| Success | `#9ECE6A` | Done, positive |
| Warning | `#E0AF68` | Caution |
| Danger | `#F7768E` | Destructive |
| Info | `#7DCFFF` | Informational |

Muted backgrounds: ~15% alpha of the semantic hue.

### Module identity (content only)

| Module | Accent (approx.) | Allowed |
|---|---|---|
| Tasks | Blue `#7AA2F7` | Event/chip identity |
| Habits | Green `#9ECE6A` | Event/chip identity |
| Schedule | Cyan `#7DCFFF` | Event/chip identity |
| Focus | Soft Indigo (brand) | Timer / focus emphasis |
| Notes | Purple `#BB9AF7` | Content identity |
| Reflection | Cool text / soft accent | Content identity |

**Forbidden:** painting left nav, page canvas, or docked Focus shell with module colors.

---

## Implementation checklist (component / page)

Before merge:

- [ ] Surfaces match V3 ladder (no new hex).
- [ ] Layout matches V3 Workspace map for that module.
- [ ] Text uses primary/secondary/muted tokens only.
- [ ] Section labels quiet (500 / 65% / `0.08em`).
- [ ] Spacing follows 8 / 16 / 24 / 32 rhythm.
- [ ] Radius matches component family table.
- [ ] Hover = luminance or ghost wash — no glow/border.
- [ ] Selected = Surface +2 + one primary cue.
- [ ] Docked = no shadow; floating = soft shadow only.
- [ ] Motion ≤ ~180–220ms ease-out for chrome.
- [ ] Critical controls visible without hover.
- [ ] Primary Soft Indigo spent only on allowed attention.

---

## Code touchpoints (guidance)

| Concern | Prefer |
|---|---|
| Tokens | `src/app/globals.css` (migrate aliases → Surface 0–10) |
| Surface class helpers | `src/lib/theme/surface-classes.ts` |
| Workplace panels | `src/lib/workplace-panel-appearance.ts` |
| Shell geometry | `src/lib/shell-dimensions.ts`, right-sidebar persistence |
| Module event colors | `schedule-palette.ts`, `*-appearance.ts` — extend, don’t inline hex |
| Section labels | `.flow-section-label` |

Smallest diff; match sibling patterns ([CODE_STANDARDS.md](./governance/CODE_STANDARDS.md)).

---

## Authority

For interaction, type, spacing, motion, and control recipes, **this file wins** inside the V3 family. Surfaces stay in the [core V3 doc](./DESIGN_SYSTEM_V3.md); spatial composition stays in [V3 Workspace](./DESIGN_SYSTEM_V3_WORKSPACE.md).
