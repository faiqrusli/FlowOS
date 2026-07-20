# FlowOS Visual Design System v3.0

| | |
|---|---|
| **Document type** | Core design authority — philosophy, lighting, Surface 0–10, brand |
| **Status** | Active implementation contract — Surface 0–10 live in `globals.css` |
| **Version** | 3.0 |
| **Theme** | Tokyo Night + Soft Indigo |
| **Date** | July 19, 2026 |
| **Supersedes (visual)** | Ad-hoc surface ladders; Borderless Workspace policy lives in V3 Workspace ([archive snapshot](../archive/design/themes/DESIGN_SYSTEM_BORDERLESS_WORKSPACE.md)) |
| **Related** | [V3 Workspace](./DESIGN_SYSTEM_V3_WORKSPACE.md) · [V3 Interaction](./DESIGN_SYSTEM_V3_INTERACTION.md) · [Code standards](./governance/CODE_STANDARDS.md) · [Product principles](./governance/PRINCIPLES.md) |

---

## What this document is

This is the **core** of Design System v3. It defines:

1. Why FlowOS looks the way it does (philosophy).
2. The five non-negotiable design principles.
3. The **Surface 0–10** lighting ladder (single source of background color).
4. Soft Indigo brand rules (when color may be spent).

It does **not** cover page layouts, shell chrome maps, typography scales, spacing, motion, or hover recipes — those live in the supporter docs below so each file stays authoritative for one concern.

### How to use this family (implementation order)

| Order | Document | Answers |
|---|---|---|
| 1 | **This file** | What elevation is this? May I invent a new hex? |
| 2 | [DESIGN_SYSTEM_V3_WORKSPACE.md](./DESIGN_SYSTEM_V3_WORKSPACE.md) | How does this page / panel / shell piece sit in the workspace? Borderless? Docked vs floating? |
| 3 | [DESIGN_SYSTEM_V3_INTERACTION.md](./DESIGN_SYSTEM_V3_INTERACTION.md) | Type, spacing, radius, motion, hover/selection, borders, shadows, controls |

**Rule:** Before shipping UI on any FlowOS page, the component must map to a Surface level here and follow Workspace + Interaction without inventing parallel tokens.

---

## Philosophy

### Vision

FlowOS is not a collection of cards.

It is a calm digital workspace where every interface element feels like it exists under the same lighting conditions.

The goal is to make users forget about the UI and focus entirely on execution.

Unlike many productivity applications that rely on heavy borders, bright cards, and exaggerated elevation, FlowOS uses **subtle luminance changes** to communicate hierarchy.

Every page should feel like it belongs to the same workspace.

The design should feel:

- Calm
- Focused
- Professional
- Premium
- Timeless
- Comfortable during 8+ hour work sessions

The UI should never compete with the user's work.

### Product alignment

Visual craft supports [PRINCIPLES.md](./governance/PRINCIPLES.md):

- **Execution over planning** — Today and Focus stay quiet so work stays loud.
- **Visible before hover** — Critical controls stay discoverable; hover only softens, never hides essentials.
- **One continuous day** — All modules share one lighting system so hops feel like moving across a desk, not opening a new app.

### Long-term desk metaphor

When a user opens FlowOS they should perceive:

1. A calm workspace (Surface 1–2).
2. A few large work areas (Surface 3).
3. Their actual work sitting on those areas (Surface 4).
4. Controls that appear when needed (Surface 5–7).
5. Temporary floating interfaces that never become permanent clutter (Surface 7–10).

As AI, analytics, collaboration, and new modules arrive, **this ladder does not change**. New features consume existing elevations — they do not invent new shades, border styles, or visual treatments.

---

## Design Principles

### 1. One Neutral Hue

Everything derives from one neutral Tokyo Night hue.

Never introduce multiple gray families (warm gray, cool gray, purple gray, blue gray, charcoal).

The entire application should feel like a **single material**. Surfaces change only in brightness.

### 2. Tiny Elevation Steps

Hierarchy comes from many very small luminance changes. Large jumps make the UI noisy.

Prefer steps that almost disappear into the previous level. If users consciously notice a background difference, it is probably too strong.

### 3. Lighting Before Components

Never design components in isolation. Design the lighting system first; every component inherits a lighting level:

```
Workspace → Canvas → Card → Input → Hover → Selected → Popup
```

### 4. Borderless First

Borders are not hierarchy. Brightness is hierarchy.

Most components use `border: none`. Borders are reserved for inputs, keyboard focus, drag targets, active drop zones, and accessibility. Full border policy: [V3 Workspace](./DESIGN_SYSTEM_V3_WORKSPACE.md).

### 5. Color is Reserved

Color is expensive. Only spend Soft Indigo where attention matters. Most of the application remains neutral. Never use primary as a card background.

---

## Primary Accent — Soft Indigo

```css
--primary:             #7B88EF;
--primary-hover:       #707EE5;
--primary-pressed:     #6270D8;
--primary-active:      #6270D8;
--primary-foreground:  #1A1B26;
--primary-soft:        rgba(123, 136, 239, 0.07); /* nav / quiet selection wash */
--primary-muted:       rgba(123, 136, 239, 0.14);
--primary-border:      rgba(123, 136, 239, 0.28);
--primary-ring:        rgba(123, 136, 239, 0.45);
```

**Personality:** calm · technical · trustworthy · premium

### Allowed uses

- Primary buttons (Add Task, confirm)
- Active navigation / active utility icon
- Current timer / “in focus” emphasis
- Current time indicator (timeline now-line)
- Selected tabs
- Keyboard focus ring
- Active progress
- Interactive highlights that mean “this is the active thing”

### Forbidden

- Decorative washes on large canvases
- Card backgrounds
- Section backgrounds “to make it pop”
- Competing brand accents (amber, teal experiments) for chrome

Module identity colors (Tasks blue, Habits green, …) may label **content** (timeline events, chips) but must not redefine shell or workspace lighting. See [V3 Interaction](./DESIGN_SYSTEM_V3_INTERACTION.md#semantic--module-color).

---

## Surface Hierarchy (0–10)

This ladder **replaces** inventing new background hexes. Map legacy names when migrating. Never invent lifts like “2–3% lighter” via `color-mix` with white — always step to the next Surface token (0–10).

| Legacy (approx.) | V3 |
|---|---|
| `--surface-nav` / left chrome | Surface 0 |
| `--surface-canvas` / page | Surface 1 |
| `--surface-rail` / drawer / timeline well | Surface 2 |
| `--surface-section` / major canvas | Surface 3 |
| `--surface-base` / cards | Surface 4 |
| `--surface-overlay` / inputs | Surface 5 |
| Hover wash | Surface 6 |
| Selected raise | Surface 7 |
| `--surface-float` / menus | Surface 7 |
| Dialogs | Surface 9 |
| Command palette / highest | Surface 10 |

### Surface 0 — `#15161F`

Application chrome. Darkest surface.

**Use:** Left navigation rail, window chrome, outside-workspace frame.

Never use for right utility content or main page background.

### Surface 1 — `#171923`

Workspace background — visual foundation of FlowOS.

**Use:** Main application page, every module page background, empty workspace.

### Surface 2 — `#1A1C2A`

Right utility workspace — slightly lighter than Surface 1, slightly darker than canvases.

**Use:** Right utility rail + drawer shell, secondary work regions attached to the main workspace.

Shell ladder: Left **0** → App **1** → Right utility **2** → Canvas **3** → Cards **4** → Inputs **5**.

Must read as another work area, not a floating drawer and not chrome.

### Surface 3 — `#1B1D28`

Primary canvases — “tables” inside the workspace.

**Use:** Timer / Focus canvas, Task Detail canvas, Notes canvas, Reflection canvas, Schedule canvas, Analytics canvas, docked Next Up canvas (equal peer to Focus).

### Surface 4 — `#1D2030`

Content cards — primary interactive objects.

**Use:** Task cards/rows, habit cards, queue items, schedule events, reflection entries, note cards.

### Surface 5 — `#202333`

Interactive controls — anything the user types into or chooses from.

**Use:** Inputs, dropdowns, search, textareas, select menus, chips (control chrome).

### Surface 6 — `#232637`

Hover only. Must not exist as a permanent resting background.

### Surface 7 — `#262A3B`

Selected / active item lift + floating UI (menus, dock overlays).

**Use:** Active queue item, selected card, selected timeline event, active list item, context menus, tooltips, floating previews, small popovers, Tasks/Habits dock.

### Surface 8 — `#2A2E41`

Reserved step above float (legacy float paint). Prefer Surface 7 for floating chrome.

### Surface 9 — `#2D3247`

Dialogs.

**Use:** Quick Capture, Add/Edit Task, confirmation dialogs.

### Surface 10 — `#31364D`

Highest elevation — rare.

**Use:** Command palette, AI assistant shell, future floating workspaces. (M2 may not ship palette; token reserved.)

---

## Visual ladder (summary)

```
Window Chrome          Surface 0
  ↓
Workspace              Surface 1
  ↓
Context Workspace      Surface 2
  ↓
Canvas                 Surface 3
  ↓
Cards                  Surface 4
  ↓
Inputs                 Surface 5
  ↓
Hover                  Surface 6
  ↓
Selected               Surface 7
  ↓
Popup                  Surface 7
  ↓
Dialog                 Surface 9
  ↓
Command Palette        Surface 10
```

Every future component must fit this ladder. **Never invent new backgrounds.**

---

## Surface usage rules

Never skip hierarchy.

| Correct | Incorrect |
|---|---|
| Workspace → Canvas → Card → Input | Workspace → Input |
| Surface 1 → 3 → 4 → 5 | Surface 5 directly on Surface 1 |

### Component intake (required)

Before implementing any new component:

1. **What elevation?** Choose exactly one of Surface 0–10.
2. **What role?**

| Role | Surfaces |
|---|---|
| Workspace | 1–3 |
| Container (cards, events, entries) | 4 |
| Interaction (inputs, controls) | 5–7 |
| Floating UI | 8–10 |

If it does not fit, redesign — do not add a token.

---

## Complete surface token reference (proposed)

```css
--surface-0:  #15161F; /* chrome / left rail */
--surface-1:  #171923; /* workspace */
--surface-2:  #191B25; /* context workspace */
--surface-3:  #1B1D28; /* canvases */
--surface-4:  #1D2030; /* content cards */
--surface-5:  #202333; /* inputs / controls */
--surface-6:  #232637; /* hover */
--surface-7:  #262A3B; /* selected */
--surface-8:  #2A2E41; /* floating UI */
--surface-9:  #2D3247; /* dialogs */
--surface-10: #31364D; /* highest */

--primary: #7B88EF;
```

Implementation may alias these to existing names (`--surface-canvas` → Surface 1, etc.) during migration, but **new code must think in Surface 0–10**.

---

## Authority & conflict resolution

Within visual design:

1. **This file** wins for surface hexes and brand spend rules.
2. **V3 Workspace** wins for layout, shell, borderless, per-page maps.
3. **V3 Interaction** wins for type, space, motion, state recipes.
4. [decision-log.md](../execution/logs/decision-log.md) wins for product-level overrides.
5. Older theme docs (Tokyo Night Warm, Gruvbox, Everforest, Neutral Dark, Navy) are **reference / history** unless explicitly re-activated.

Code must still follow [CODE_STANDARDS.md](./governance/CODE_STANDARDS.md) (smallest diff, semantic tokens, no fake UI).
