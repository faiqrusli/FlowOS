# FlowOS Visual Design System v2.0

| | |
|---|---|
| **Version** | 2.0 |
| **Status** | ✅ Frozen |
| **Owner** | FlowOS Product |
| **Date** | July 10, 2026 |
| **Supersedes** | [Visual Design System v1.0](./DESIGN_SYSTEM_v1.md) |
| **Tokens** | [globals.css](../../src/app/globals.css) |
| **Related** | [CODE_STANDARDS.md](./governance/CODE_STANDARDS.md) · [PRINCIPLES.md](./governance/PRINCIPLES.md) · [decision-log.md](../execution/logs/decision-log.md) |

---

## Purpose

Defines the visual architecture of FlowOS.

This document is the single source of truth for:

- Color hierarchy
- Surface hierarchy
- Application chrome
- Workspace hierarchy
- Information hierarchy
- Elevation
- Visual focus

Every future UI component must conform to this document.

---

## Vision

FlowOS should feel like a **workspace**, not a dashboard.

The interface should quietly disappear while the user's work becomes the primary visual focus.

Navigation exists to support productivity.

**Content is the product. Chrome supports the product.**

---

## Product philosophy

FlowOS is not a collection of pages.

It is a productivity operating system.

The interface should reinforce the user's workflow:

```
Capture → Plan → Execute → Reflect
```

Every screen should communicate that workflow through hierarchy rather than decoration.

---

## Core principles

### Content first

The user's work should always receive the greatest visual attention.

The application itself should fade into the background.

### Chrome second

Navigation should never compete with content.

Chrome frames work. It does not become the work.

### One visual hero

Every screen should have exactly one visual hero.

| Screen | Hero |
|--------|------|
| Today | Focus |
| Schedule | Timeline |
| Notes | Document |
| Reflection | Reflection editor |
| Analytics | Primary visualization |

When multiple components compete for attention, the interface becomes noisy.

### Hierarchy through structure

FlowOS communicates importance using:

- Layout
- Spacing
- Typography
- Elevation
- Subtle surfaces

Avoid using bright colors or heavy decoration to create hierarchy.

---

## Design goals

FlowOS should:

- Maximize focus
- Reduce visual noise
- Feel larger than it is
- Feel premium
- Scale to future workspaces

Avoid:

- Heavy dashboard appearance
- Multiple unrelated background colors
- Decorative glows
- Artificial visual complexity
- Chrome competing with content

---

## Surface hierarchy (Layer 0–5)

**Canonical visual source:** VDS Sessions **1–5** tip (`33928bb`) — Workspace Drawer card-on-chrome, quiet left nav, and the Today page (including Focus tabs on `bg-muted/40` / active `bg-card`). All future UI (Tasks and beyond) must match that look.

FlowOS uses **six layers**. Do not invent new permanent background colors outside this stack.

| Layer | Role | Token / signal | Purpose |
|-------|------|----------------|---------|
| **0** | Navigation | `--surface` | Darkest — left nav, workspace drawer chrome |
| **1** | Workspace | `--background` | Page / canvas behind cards |
| **2** | Standard surfaces | `--card` | Cards, lists, panels, dialogs |
| **3** | Hero surfaces | `--surface-focus` | Current Focus / primary workspace hero |
| **4** | Interactive | `--primary`, selected | Buttons, selected, blue accent |
| **5** | Feedback | `--success`, `--warning`, `--destructive` | Success, warning, danger |

Temporary hover uses `--surface-hover` (and Focus hover variants). It is **not** a permanent layer — never ship hover as a resting fill.

### Current dark values (implementation)

Canonical values live in [globals.css](../../src/app/globals.css). Frozen to Sessions 1–5:

| Layer | Token | Value |
|-------|-------|-------|
| 0 | `--surface` | `oklch(0.148 0.032 268)` ≈ `#060A18` |
| 1 | `--background` | `oklch(0.171 0.030 268)` ≈ `#0A0F1D` |
| 2 | `--card` | `oklch(0.229 0.032 268)` ≈ `#161C2C` |
| 3 | `--surface-focus` | `color-mix(in oklab, var(--card) 92%, white 8%)` |
| 4 | `--primary` | `oklch(0.575 0.205 272)` (indigo accent) |
| 5 | semantic | success / warning / destructive tokens |

Navigation (Layer 0) is recessed below the workspace canvas (Layer 1). Do not reintroduce decorative glows or a seven-level stack.

---

## Surface responsibilities

### Layer 0 — Navigation

**Purpose:** Application chrome — darkest frame.

**Includes:** Left sidebar, workspace drawer shell, future AI drawer chrome.

**Rules:** Darker than workspace and cards. Never used for editing. Expand/resize changes width only — never elevation.

### Layer 1 — Workspace

**Purpose:** Page background / infinite canvas.

**Includes:** Main content area, gutters, top bar (merged into canvas).

**Rules:** Never interactive content. Never brighter than cards.

### Layer 2 — Standard surfaces

**Purpose:** Units of work — cards, lists, panels, forms, dialogs.

**Rules:** Share one common `--card` surface. No feature-specific permanent card colors. Content in the drawer lives on Layer 2 over Layer 0 chrome.

**Tasks board columns (workspace lift, not hero):** Task group columns use `--surface-board` — a ~2–4% lift above `--background` toward `--card`, with `--border-board` (~10–15% stronger edge than default border) and a whisper header `--surface-board-header`. This is **not** Layer 3 / `--surface-focus`. Columns should read as independent workspaces, not floating cards and not Focus-hero surfaces.

### Layer 3 — Hero surfaces

**Purpose:** The one primary workspace on a screen (Today = Focus).

**Rules:** Use `--surface-focus` whisper lift above `--card`. Border `--border-focus`. No glow, no blue fill, no elevated shadow as permanent hero treatment. Focus/Pomodoro tab chrome stays on card/muted — **never** `bg-background` holes in the hero.

### Layer 4 — Interactive

**Purpose:** Buttons, selected states, blue accent, active nav.

**Rules:** Primary indigo is the loud voice. Selected uses `--selected` / primary tints. Do not paint whole panels with primary.

### Layer 5 — Feedback

**Purpose:** Success, warning, danger.

**Rules:** Semantic only — status, validation, destructive actions. Never as page or card resting backgrounds.

---

## Information hierarchy

FlowOS organizes information in layers:

```
Application
  ↓
Workspace
  ↓
Card
  ↓
Component
  ↓
Interaction
```

Every feature should naturally fit this structure.

---

## UI responsibilities

Each visual layer has one responsibility.

| Layer | Responsibility |
|-------|----------------|
| 0 Navigation | Frames the app (darkest) |
| 1 Workspace | Provides page breathing room |
| 2 Standard surfaces | Hold lists, panels, forms |
| 3 Hero | One primary workspace per screen |
| 4 Interactive | Buttons, selected, blue accent |
| 5 Feedback | Success, warning, danger |

---

## Workspace architecture

FlowOS distinguishes between **pages** and **contextual workspaces**.

### Pages

Pages are destinations.

**Examples:** Today, Tasks, Habits, Schedule, Focus.

Pages own the user's primary workflow.

### Workspace drawer

The Workspace Drawer is not another sidebar.

It is contextual workspace.

**Examples:** Notes, Reflection, Kanban, future AI, Calendar, References.

Users can continue working without leaving the current page.

The drawer should feel secondary to the main workspace while remaining fully functional.

#### Drawer card-on-chrome (frozen)

```
Workspace Drawer (`--surface`)
└── Content cards (`--card`)
```

| Rule | Detail |
|------|--------|
| Drawer background | Always `--surface` / `bg-sidebar`, at every width |
| Expand / resize | Changes **layout only** — never elevation or background color |
| Primary content | Lives on `--card`, never directly on drawer chrome |
| Card spacing | 24–32px vertical gap between cards (`gap-6`–`gap-8`) |
| Card styling | Shared padding, radius, border — no feature-specific card colors |

**Module patterns**

| Module | Structure |
|--------|-----------|
| **Notes** | One editor document card (title, metadata, toolbar, markdown) |
| **Reflection** | Multiple modular cards (questions, custom entries, kanban) — **no** single outer wrap |
| **Task Details** | Section cards (task, organization, schedule) — scannable form |

Implementation runbook: [m2-visual-design-v2.md](../execution/runbooks/m2-visual-design-v2.md).

---

## Navigation philosophy

Navigation should always remain behind user content.

Navigation exists to answer: **"Where am I?"**

Content answers: **"What am I doing?"**

The user should naturally spend most of their time inside workspaces rather than navigation.

### Top bar

The top bar should visually merge into the canvas.

Avoid creating another floating layer.

**Preferred:**

```
Continuous Workspace
────────────────────────────────
Controls
Content
```

**Avoid:**

```
Top Bar
──────────
Content
```

| Property | Value | Reason |
|----------|-------|--------|
| Background | `var(--background)` | Navigation should not compete with content |
| **Not** | `var(--surface)` | Would create a floating chrome band |
| Divider | `border-bottom: 1px solid rgba(255,255,255,.04)` | Alignment without a visible seam |

### Left sidebar / workspace drawer

| Property | Value |
|----------|-------|
| Background | `var(--surface)` |
| Outer border | `1px solid rgba(255,255,255,.05)` |

No shadows. No gradients. No glassmorphism.

### Main workspace

| Property | Value |
|----------|-------|
| Background | `var(--background)` |

No borders. No artificial containers. Cards provide all structure.

---

## Card philosophy

Cards represent work.

Cards should be:

- Consistent
- Quiet
- Readable

Hierarchy should come from:

- Placement
- Size
- Spacing

Not arbitrary color changes.

### Focus card

The Focus card is the hero of the Today page.

Its importance comes primarily from:

- Location
- Size
- Typography
- Timer
- Surrounding whitespace

Surface changes should remain subtle.

**Avoid:** Blue backgrounds, glows, exaggerated shadows.

---

## Borders

Borders define structure. They do not create depth.

Depth comes from surfaces.

Borders should remain soft and unobtrusive.

**Recommended:**

- `rgba(255,255,255,.05)`
- `rgba(255,255,255,.04)`

**Avoid:** Heavy outlines, bright borders, double borders, nested borders.

---

## Shadows

Use only restrained shadows.

| Element | Shadow |
|---------|--------|
| Cards | Small — `0 2px 12px rgba(0,0,0,.18)` |
| Modals | Medium — `0 12px 48px rgba(0,0,0,.35)` |
| Navigation | None |

Never use shadows as decoration.

---

## Elevation model

Stack order (top to bottom):

```
Modal
Dropdown
Tooltip
Hover
Cards
Sidebar / drawer (chrome)
Background
```

Each level should feel intentional. Do not create random intermediate elevations.

---

## Accent philosophy

Accent colors communicate interaction.

Primary blue is reserved for:

- Active navigation
- Buttons
- Timer
- Links
- Selection

Never use accent colors as permanent surfaces.

---

## Future compatibility

This architecture must support future modules without new surface categories.

**Examples:** AI, Goals, Analytics, Calendar, Whiteboard, Files, Reading, References.

| Module | Canvas | Content |
|--------|--------|---------|
| Command palette | Card | Backdrop: `rgba(0,0,0,.45)` |
| AI assistant | Surface (drawer) | Conversation: card; response blocks: nested cards |
| Calendar | Background | Events: cards; selection: hover |
| Analytics | Background | Charts / metrics: cards; filters: surface |

Every module should naturally fit into the existing hierarchy.

No new surface colors should be required.

---

## Frozen decisions

- Layer 0–5 only (Navigation → Workspace → Standard → Hero → Interactive → Feedback)
- Sessions 1–5 Today + navigation are the visual source of truth for future UI
- Content is brighter than navigation chrome
- Chrome frames work
- Every screen has one visual hero (Layer 3)
- Pages own workflows
- Workspace Drawer owns contextual workspaces (Layer 0 shell + Layer 2 cards)
- Cards represent interaction
- Accent colors communicate interaction only (Layer 4)
- Feedback colors are semantic only (Layer 5)
- Borders provide structure
- Shadows remain minimal
- Future modules reuse the existing hierarchy

---

## Acceptance criteria

1. Every component maps to one of Layer 0–5.
2. No custom dark backgrounds exist outside the design tokens.
3. Navigation chrome never competes with user content.
4. Every page has a clearly identifiable visual hero.
5. The Workspace Drawer supports contextual work without replacing primary pages.
6. New modules integrate without introducing new surface categories.
7. Hierarchy is communicated through layout, spacing, typography, and restrained elevation rather than decorative effects.
8. Focus/hero tab chrome never uses canvas `bg-background` as a permanent hole in Layer 3.

---

## Why v2.0

v1.0 froze the four-token surface model and chrome treatment ([DESIGN_SYSTEM_v1.md](./DESIGN_SYSTEM_v1.md)).

v2.0 keeps that surface contract and elevates the document from a color/elevation spec into the **visual architecture** authority: product philosophy, one-hero rule, pages vs workspace drawer, information hierarchy, and acceptance criteria for every future UI decision.

Token depths may be refined in `globals.css` without a new major version, as long as the four roles and frozen decisions above hold.
