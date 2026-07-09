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

## Surface hierarchy

FlowOS uses **only four surface levels**.

No additional background colors should be introduced without a semantic reason.

| Level | Token | Purpose |
|-------|-------|---------|
| **0** | `--background` | Infinite workspace canvas |
| **1** | `--surface` | Application chrome |
| **2** | `--card` | Interactive content |
| **3** | `--surface-hover` | Temporary interaction only |

This hierarchy should remain stable across the entire application.

### Current dark values (implementation)

Canonical values live in [globals.css](../../src/app/globals.css). As of 2026-07-10:

| Level | Token | Value |
|-------|-------|-------|
| 0 | `--background` | `oklch(0.171 0.030 268)` ≈ `#0A0F1D` |
| 1 | `--surface` | `oklch(0.148 0.032 268)` ≈ `#060A18` |
| 2 | `--card` | `oklch(0.229 0.032 268)` ≈ `#161C2C` |
| 3 | `--surface-hover` | `oklch(0.262 0.034 268)` ≈ `#1D2435` |

Chrome is recessed (darker than the canvas) so navigation stays behind content. Do not reintroduce a seven-level stack or decorative glows.

---

## Surface responsibilities

### Level 0 — Background

**Purpose:** The infinite workspace.

**Used by:** Application canvas, empty layout, gutters, behind all cards.

**Rules:**

- Always darkest relative to content (canvas role)
- Never interactive
- Never contains user content

### Level 1 — Chrome

**Purpose:** Application infrastructure.

Chrome frames work. It never becomes the work.

**Chrome includes:**

- Left sidebar
- Workspace drawer
- Top navigation
- Command palette
- Inspector
- Future AI drawer

**Rules:**

- Darker than content
- Never brighter than cards
- Never used for editing

### Level 2 — Cards

**Purpose:** Units of interaction.

**Examples:** Tasks, habits, Focus, dashboard widgets, dialogs, forms.

Cards always appear above chrome.

Cards should share one common surface.

Avoid feature-specific card colors.

**Today Focus (whisper lift):** The Focus card may use `--surface-focus` — a subtle `color-mix` of `--card` toward white so Focus reads slightly above peer cards without changing the navy page cast. Border: `--border-focus` barely above `--border`. Same restrained card shadow; no glow, no blue fill, no elevated shadow. Hover: `--surface-focus-hover` (temporary). This is not a fifth surface level — it is a hero treatment within Level 2. Edit this note when adjusting; do not add a parallel hierarchy document.

### Level 3 — Hover

**Purpose:** Temporary interaction.

**Examples:** Hover, drag target, keyboard focus, selected state.

Never use as a permanent background. Never use `--surface-hover` as the permanent Focus fill.

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
| Background | Provides breathing room |
| Chrome | Provides navigation |
| Workspace | Provides context |
| Cards | Provide interaction |
| Components | Provide functionality |
| Accent | Communicates state |

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

- Four surface levels only
- Content is brighter than chrome
- Chrome frames work
- Every screen has one visual hero
- Pages own workflows
- Workspace Drawer owns contextual workspaces
- Cards represent interaction
- Accent colors communicate interaction only
- Borders provide structure
- Shadows remain minimal
- Future modules reuse the existing hierarchy

---

## Acceptance criteria

1. Every component maps to one of the four surface levels.
2. No custom dark backgrounds exist outside the design tokens.
3. Chrome never competes with user content.
4. Every page has a clearly identifiable visual hero.
5. The Workspace Drawer supports contextual work without replacing primary pages.
6. New modules integrate without introducing new surface categories.
7. Hierarchy is communicated through layout, spacing, typography, and restrained elevation rather than decorative effects.

---

## Why v2.0

v1.0 froze the four-token surface model and chrome treatment ([DESIGN_SYSTEM_v1.md](./DESIGN_SYSTEM_v1.md)).

v2.0 keeps that surface contract and elevates the document from a color/elevation spec into the **visual architecture** authority: product philosophy, one-hero rule, pages vs workspace drawer, information hierarchy, and acceptance criteria for every future UI decision.

Token depths may be refined in `globals.css` without a new major version, as long as the four roles and frozen decisions above hold.
