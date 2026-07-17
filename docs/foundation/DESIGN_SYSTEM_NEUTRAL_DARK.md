# FlowOS Neutral Dark Visual Design System

| | |
|---|---|
| **Document type** | Visual Design System & Implementation Specification |
| **Status** | Active implementation contract — Neutral Dark Visual Design System |
| **Scope** | Application-wide dark theme |
| **Implementation role** | Source specification for the neutral-dark migration (implemented on branch) |
| **Date** | July 16, 2026 |
| **Related** | [Prior v3.0 navy contract](./DESIGN_SYSTEM.md) · [v3 migration runbook](../execution/runbooks/design-system-v3-migration.md) · [Code standards](./governance/CODE_STANDARDS.md) |

---

## 1. Executive summary

FlowOS is moving from a strongly navy-tinted interface to a neutral dark workspace with a restrained indigo identity.

The previous visual system used navy in nearly every surface:

| Role | Previous paint |
|---|---|
| Canvas | `#080E1B` |
| Navigation | `#070C18` |
| Base | `#0D1423` |
| Raised | `#121B2C` |
| Overlay | `#151E30` |
| Hover | `#1A2437` |

That system created a persistent blue atmosphere across canvas, navigation, cards, borders, elevated surfaces, and interaction states. FlowOS now needs a calmer visual foundation for its larger execution workspaces, persistent rails, Focus experience, task and habit systems, schedules, notes, reflections, integrations, drawers, and potential desktop application.

> The workspace is neutral. The work creates structure. FlowOS creates identity through intentional indigo accents.

The neutral-dark foundation is:

| Role | Paint |
|---|---|
| Environment | `#1B1B1B` |
| Work objects | `#242429` |
| Interaction / emphasis | `#29292D` |
| Floating surfaces | `#303034` |
| Temporary interaction | `#343438` |
| FlowOS identity | `#586CF6` |

This is not a copy of another product. The direction was informed by mature desktop and productivity applications, then adapted to FlowOS’s architecture.

## 2. Design vision

FlowOS is a personal execution workspace, not a collection of unrelated productivity widgets. The interface should remain quiet while the user’s work, priorities, schedule, focus state, progress, and decisions remain dominant.

### 2.1 The interface is an environment

Large structural regions should not compete through unnecessary background differences. The main canvas, left navigation, right utility rail, drawer shell, and large empty workspaces may share the same foundational surface. Separate them with borders, spacing, alignment, content, active states, and temporary elevation—not arbitrary background variation.

### 2.2 Work sits on the environment

Tasks, cards, panels, editors, capture surfaces, boards, and other meaningful work objects emerge from the application environment:

```text
APPLICATION ENVIRONMENT  #1B1B1B
             ↓
WORK OBJECT              #242429
```

### 2.3 Elevation must have meaning

A lighter surface communicates interaction, selection, emphasis, attention, or physical floating. Nesting alone never justifies elevation.

### 2.4 Colour is communication, not decoration

Indigo communicates active state, primary action, selection, focus, and identity. It must not tint the application environment. The neutral workspace makes each intentional accent more meaningful.

### 2.5 The UI should disappear during execution

When planning, executing, focusing, monitoring the day, reflecting, and improving, users should perceive:

- What am I doing?
- What comes next?
- How is my day going?

They should not need to parse a collection of competing visual containers.

---

## 3. Core surface architecture

The system uses five actual surface paints. Semantic aliases may reference them, but new intermediate surface colours require a clear semantic need.

| Level | Token | Paint | Meaning |
|---|---|---|---|
| Environment | `--surface-canvas` / `--surface-nav` | `#1B1B1B` | FlowOS application environment |
| Inset control | `--surface-inset` | `#1E1E20` | Recessed editable areas inside base cards |
| Persistent work | `--surface-base` | `#242429` | Objects that contain work |
| Emphasis | `--surface-raised` | `#29292D` | Interaction, selection, or attention |
| Floating | `--surface-overlay` | `#303034` | Temporary UI above the workspace |
| Transient | `--surface-hover` | `#343438` | Current pointer or keyboard interaction |

### 3.1 Environment

```css
--surface-canvas: #1B1B1B;
--surface-nav: #1B1B1B;
```

Use for the main workspace, page backgrounds, both persistent rails, large empty regions, drawer shell, appropriate application chrome, and uncontained timeline space.

```css
--background: var(--surface-canvas);
--surface-app: var(--surface-canvas);
--surface-page: var(--surface-canvas);
--timeline-surface: var(--surface-canvas);

--surface: var(--surface-nav);
--surface-sidebar: var(--surface-nav);
--sidebar: var(--surface-nav);
```

Do not create separate left rail, right rail, and canvas backgrounds merely to distinguish architecture.

### 3.2 Persistent work surface

```css
--surface-base: #242429;
--card: var(--surface-base);
--surface-card: var(--surface-base);
--surface-board: var(--surface-base);
```

This is the default surface for persistent objects that contain work: cards, panels, Quick Capture, task and Kanban columns, boards, editors, persistent utility content, task containers, Next Up containers, appropriate schedule objects, forms, and persistent drawer content.

Use `--surface-base` by default for a contained persistent object. Size, nesting, or page location do not independently justify a new colour.

### 3.2.1 Inset / recessed control surface

```css
--surface-inset: #1E1E20;
```

Use for editable or recessed controls that sit **inside** a base (`#242429`) card — especially task title inputs and description textareas.

```text
#1B1B1B  Environment / drawer shell
   └── #242429  Card / container
         └── #1E1E20  Inset control (title, description)
```

Pair with `--border-subtle` (`#3A3A3F`) where separation is needed. Do **not** apply inset globally to every `Input` / `Textarea` — only where the control should read as recessed inside a base card. Prefer `surfaceInsetControlClass` / `drawerWritingFieldClass` from `surface-classes.ts`.

Inset interaction states:

| State | Paint | Notes |
|---|---|---|
| Default | `#1E1E20` (`--surface-inset`) | Recessed fill |
| Hover | `#232325` (`--surface-inset-hover`) | Subtle lift — not `--surface-hover` / `--control-*` |
| Focus | `#232325` + indigo border/ring | Keep recessed feel; use existing `--ring` / primary border |

### Compact selector controls

```css
--control-default: #29292D;
--control-hover: #303034;
--control-active: #343438;
```

Use for Date, Time, Duration, Alert Before, Priority, Group, and similar compact selectors inside cards. Prefer `compactControlTriggerClass` from `surface-classes.ts`.

| State | Paint | Notes |
|---|---|---|
| Default | `#29292D` | Visible control chrome |
| Hover / focus | `#303034` | Stronger than inset text hover; focus keeps indigo ring |
| Pressed / dropdown open | `#343438` | Strongest neutral interaction |
| Disabled | `#29292D` + muted text/icon | Keep fill; reduce emphasis |

Do **not** apply control tokens globally to every button — primary CTAs and chrome actions keep their existing recipes. Hierarchy: recessed text fields respond subtly; compact selectors respond more visibly; open/active controls are strongest.

Buttons and action-oriented chrome keep their current surfaces and may use `--surface-hover` (`#343438`) on hover where appropriate.

### 3.3 Raised and emphasised surface

```css
--surface-raised: #29292D;
--surface-elevated: var(--surface-raised);
--surface-focus: var(--surface-raised);
--surface-kanban-card: var(--surface-raised);
```

Use for selected objects, emphasised task cards, active work objects, card hover, board headers, attention surfaces, and selected Kanban cards.

Do not use a raised surface merely because one card is nested inside another. Use it only for an object that is active, selected, interactive, intentionally distinguished, or otherwise deserves immediate attention.

### 3.4 Floating surface

```css
--surface-overlay: #303034;
--popover: var(--surface-overlay);
--surface-popover: var(--surface-overlay);
--surface-dialog: var(--surface-overlay);
```

Use only for temporary UI that exists above the workspace: dialogs, popovers, dropdowns, context menus, floating menus, and command interfaces. A permanent panel is not an overlay solely because it is important.

### 3.5 Hover and temporary interaction surface

```css
--surface-hover: #343438;
```

Use for hover, temporary interactive chrome, and appropriate pressed states. It must not become a permanent component background.

### 3.6 Surface hierarchy

```text
#1B1B1B  ENVIRONMENT
├── Canvas, navigation, rails, drawer shell, large workspace
│
├── #242429  PERSISTENT WORK OBJECT
│   ├── Card, panel, capture, board, editor, task column
│   └── #1E1E20  INSET CONTROL (title, description, recessed fields)
│
├── #29292D  INTERACTION / EMPHASIS
│   ├── Selected object, active work object, card hover, board header
│
├── #303034  FLOATING
│   ├── Dialog, popover, menu, command palette, context menu
│
└── #343438  TRANSIENT
    └── Hover / active interaction
```

---

## 4. Drawer, borders, and text

### 4.1 Right utility drawer

```css
--surface-drawer: var(--surface-canvas);
```

The drawer shell is an architectural region and resolves to `#1B1B1B`. Contained objects inside it may use `#242429`; for example, a note editor is a base work surface within an environment drawer.

Separate the drawer from the workspace with a subtle border, appropriate shadow, and structural spacing—not an arbitrary intermediate background.

### 4.2 Border system

```css
--border-subtle: #3A3A3F;
--border-strong: #444449;

--divider: color-mix(in srgb, var(--border-subtle) 55%, transparent);
--input: color-mix(in srgb, var(--border-subtle) 75%, transparent);
--border-board: color-mix(in srgb, var(--border-subtle) 80%, transparent);
```

| Token | Use |
|---|---|
| `--border-subtle` | Standard card edges, default containment, inputs, lightweight panels |
| `--border-strong` | Major containment and important boundaries; use sparingly |
| `--divider` | Hairline separators, section and timeline divisions, light list separation |
| `--input` | Input borders |
| `--border-board` | Board boundaries |

Borders must be quieter than the previous system. Do not combine a different fill, border, and shadow for every object. A surface can be defined by contrast, spacing, and alignment alone.

### 4.3 Text hierarchy

```css
--text-primary: #E9ECEE;
--text-secondary: #D3D6D8;
--text-muted: #B4B6B8;
--text-tertiary: #9EA0A2;
--text-disabled: #747679;

--foreground: var(--text-primary);
--foreground-secondary: var(--text-secondary);
--muted-foreground: var(--text-muted);
```

| Level | Paint | Use |
|---|---|---|
| Primary | `#E9ECEE` | Page titles, task names, major values, Focus timer, crucial actions |
| Secondary | `#D3D6D8` | Supporting information, section labels, standard controls |
| Muted UI | `#B4B6B8` | Icons, navigation labels, secondary controls, useful metadata |
| Tertiary | `#9EA0A2` | Placeholders, timestamps, low-priority context |
| Disabled | `#747679` | Genuinely unavailable actions and controls only |

Tertiary information is still useful. Disabled styling means the user cannot currently act; it must not be used simply to make information less important.

---

## 5. FlowOS identity and states

```css
--primary: #586CF6;
--primary-foreground: #E9ECEE;
--primary-hover: color-mix(in srgb, var(--primary), white 10%);

--primary-subtle: color-mix(in srgb, var(--primary) 10%, transparent);
--primary-soft: color-mix(in srgb, var(--primary) 16%, transparent);
--primary-medium: color-mix(in srgb, var(--primary) 24%, transparent);
--selected: var(--primary-soft);
--selected-border: color-mix(in srgb, var(--primary) 42%, transparent);
--ring: color-mix(in srgb, var(--primary) 55%, transparent);
```

The FlowOS indigo remains the primary identity colour. Its neutral context means it should be used more selectively, not more frequently.

| Treatment | Use |
|---|---|
| Solid primary | Primary CTA, major action, strong active state |
| Primary subtle | Very soft identity tint, low-emphasis selected background |
| Primary soft | Active navigation, selected rows, persistent soft selection |
| Primary medium | Strong selected surface or important non-solid state; sparingly |
| Selected border | Selected task or object |
| Ring | Focus indication |

Use the minimum accent combination needed. Avoid blue background + border + icon + text + glow on one component.

Recommended recipes:

- **Active navigation:** primary-soft background + primary icon + primary or high-emphasis label.
- **Selected task:** subtle or soft background + selected border.
- **Focus:** accent text or icon with an optional restrained indicator.
- **Primary CTA:** solid primary fill + primary foreground.

Existing semantic status tokens remain independent:

- `--destructive` and `--destructive-muted`
- `--success` and `--success-muted`
- `--warning` and `--warning-muted`

Indigo denotes FlowOS identity, active state, or primary action. Status colours denote semantic conditions; do not replace errors, success, or warnings with indigo.

---

## 6. Derived token and component rules

### 6.1 Simplify derived surfaces

The system should have many semantic names but relatively few paints:

```css
--muted: var(--surface-raised);
--secondary: var(--surface-overlay);
--surface-card-hover: var(--surface-raised);
--surface-focus-hover: var(--surface-overlay);
--surface-board-header: var(--surface-raised);
```

Do not use generated white-opacity surfaces such as `bg-white/[0.07]`, `bg-white/[0.11]`, or `bg-white/[0.13]` unless transparency is materially required. Prefer semantic surface tokens.

### 6.2 Token-first implementation

Use semantic tokens and their Tailwind utilities:

```tsx
// Correct
className="bg-surface-base text-foreground"

// Incorrect
className="bg-[#242429] text-[#E9ECEE]"
```

Do not encode hierarchy through arbitrary opacity. Do not create a progressively lighter surface for each nested child. Prefer spacing, typography, and dividers for internal content structure.

### 6.3 Reusable component contract

Implement the system in dependency order:

```text
GLOBALS.CSS
    ↓
SEMANTIC TOKENS
    ↓
TAILWIND UTILITIES
    ↓
SHARED COMPONENTS
    ↓
FEATURE COMPONENTS
    ↓
PAGES
```

Do not repaint routes one by one with local hardcoded colours.

Shared components to audit before feature pages:

- Button, Card, Input, Textarea
- Dialog, Popover, Dropdown, command interface
- Tabs, Tooltip, Drawer, navigation item
- Badge, Select, Checkbox, Toggle

### 6.4 Geometry, shadow, and motion

- Keep the foundational radius at `--radius: 0.5rem` unless an existing component scale defines a specific variant.
- Avoid excessive rounding; FlowOS should feel like a workspace, not floating bubbles.
- Use shadows only to communicate real elevation: selectively lifted persistent surfaces, overlays, dialogs, and where a right drawer needs separation.
- Do not shadow every card; surface contrast and borders often suffice.
- Keep `--ease-premium` as the shared easing token if it remains valid.
- General interaction motion: 150–250ms. Use the longer end for drawer and larger spatial transitions.
- Motion communicates state changes, opening, closing, selection, and spatial movement. Do not animate just because an element can move.

---

## 7. Workspace application

### Today and Focus

- Environment and timeline: `#1B1B1B`
- Quick Capture, active task container, Next Up, and contained schedule objects: `#242429`
- Selected, active, or emphasised queue items: `#29292D`
- Keep the Focus timer dominant through scale, primary text, whitespace, and restrained accent.
- Do not place the timer inside an unnecessary bright card.

### Tasks

- Page environment: `#1B1B1B`
- Task columns: `#242429`
- Column headers: `#29292D` only when additional separation is required
- Selected task: primary-soft + selected border
- Hover: `#29292D` or the semantic hover token

Repeated columns must not become visually heavy through stacked borders and background changes.

### Notes

- Workspace: `#1B1B1B`
- Board and editor: `#242429`
- Kanban card: `#29292D` only where it genuinely needs separation from its column

Avoid workspace → board → column → card → nested content all using different greys.

### Schedule

- Timeline: `#1B1B1B`
- Scheduled objects: `#242429` or semantic status treatment where appropriate
- Current or selected item: restrained FlowOS accent
- Grid lines: `--divider`, not strong borders

### Habits

- Environment: `#1B1B1B`
- Habit object: `#242429`
- Active or selected: `#29292D` or primary-soft

Habit colours communicate category, status, or completion; they do not replace the foundational surface system.

### Reflection

- Workspace: `#1B1B1B`
- Input areas: `#242429`
- Active input: focus border or ring

Reflection is a calm writing experience, not a control panel. Do not dramatically brighten an entire active field.

### Goals and future modules

- Environment: `#1B1B1B`
- Goal cards: `#242429`
- Active goal: `#29292D` or restrained primary-soft
- Progress: primary, success, and semantic progress indicators

Do not give Goals—or any future module—its own dark background or make an important card entirely blue.

### Navigation and rails

Both the left navigation and right utility rail use `#1B1B1B`.

| State | Treatment |
|---|---|
| Default | Transparent |
| Hover | Restrained semantic hover surface |
| Active | Primary-soft background + primary icon + high-emphasis label |

The active state must be immediately recognisable without becoming a saturated block.

### Modal and popover system

| Element | Surface |
|---|---|
| Modal | `#303034` |
| Popover | `#303034` |
| Context menu | `#303034` |
| Hovered menu item | `#343438` |

Use an appropriate backdrop. Floating UI should depend on overlay surface, shadow, and backdrop—not an excessively bright border.

---

## 8. Implementation audit and migration plan

### 8.1 Hardcoded-colour audit

Before mass replacement, audit hardcoded legacy colours:

```text
#080e1b  #070c18  #0d1423  #121b2c  #151e30  #1a2437  #202b3d  #303c51
#0d1017  #0a0d13  #11151d  #161b25  #1a202b  #202733  #252c38  #343d4c
```

Also audit arbitrary Tailwind hex colours and uncontrolled neutral fills:

```text
bg-[#...]
text-[#...]
border-[#...]
bg-white/[...]
border-white/[...]
text-white/[...]
```

Classify every occurrence before changing it:

1. Legacy surface colour → migrate to a semantic token.
2. Intentional semantic status colour → preserve.
3. Illustration or decorative content → review separately.
4. Third-party component requirement → document.
5. Temporary prototype → migrate or remove.

### 8.2 Phased implementation

1. **Token foundation:** update core surfaces, drawer, borders, text hierarchy, accent derivations, and semantic aliases. Do not touch individual pages yet.
2. **Derived token simplification:** map muted, secondary, card hover, focus hover, and board header to the constrained palette.
3. **Hardcoded colour audit:** produce the classified report before mass replacement.
4. **Shared component audit:** update primitives before individual pages.
5. **Navigation and app shell:** establish one continuous `#1B1B1B` environment, using boundaries rather than unnecessary fills.
6. **Today and Focus:** review Quick Capture, timer, active task, Next Up, queue, timeline, Focus Reflection, and scheduled items. Preserve timer dominance.
7. **Tasks:** review columns, headers, rows, selected and hover states, and reflection drawer. Keep repeated columns quiet.
8. **Habits and Schedule:** keep the timeline environmental, persistent objects base, status colours semantic, and grid lines divider-led.
9. **Notes:** review workspace, category rail, board, Kanban columns and cards, editor, and utility drawer. Avoid nested surface hierarchy.
10. **Reflection:** review textareas, custom entries, custom Kanban, and drawer integration. Keep writing readable and calm.
11. **Goals and future modules:** require use of this system; do not create module-specific dark backgrounds without an unmet semantic need.
12. **Final visual QA:** test normal desktop and small laptop widths; expanded and collapsed navigation; drawer closed and open; modal; keyboard focus; hover; selected; and disabled states.

---

## 9. Visual QA checklist

For each page, confirm:

### Environment

- Does the page feel like one continuous workspace?

### Surface

- Does each different background have a semantic reason?

### Border

- Could the border be removed without losing comprehension?

### Accent

- Does indigo communicate something meaningful?

### Text

- Is the information hierarchy clear without relying entirely on font size?

### Nesting

- Are there unnecessary cards inside cards?

### Interaction

- Can users distinguish default, hover, selected, focused, and disabled states?

### Focus

- Does the most important work remain visually dominant?

---

## 10. Constraints and final token reference

Do not recreate the prior problem with neutral greys. The following progression must not become an unofficial surface scale:

```text
#1B1B1B #202022 #222224 #242429 #26262A
#29292D #2B2B2F #303034 #323236 #343438
```

`#1E1E20` (`--surface-inset`) is an intentional recessed-control paint inside base cards — not a free intermediate grey for arbitrary nesting.

Every other added paint requires an essential semantic purpose.

| Category | Role | Paint |
|---|---|---|
| Surface | Canvas / environment | `#1B1B1B` |
| Surface | Navigation | `#1B1B1B` |
| Surface | Drawer shell | `#1B1B1B` |
| Surface | Inset control | `#1E1E20` |
| Surface | Inset control hover / focus | `#232325` |
| Surface | Base | `#242429` |
| Surface | Raised | `#29292D` |
| Surface | Overlay | `#303034` |
| Surface | Hover | `#343438` |
| Control | Compact default | `#29292D` |
| Control | Compact hover / focus | `#303034` |
| Control | Compact active / open | `#343438` |
| Border | Subtle | `#3A3A3F` |
| Border | Strong | `#444449` |
| Text | Primary | `#E9ECEE` |
| Text | Secondary | `#D3D6D8` |
| Text | Muted UI | `#B4B6B8` |
| Text | Tertiary | `#9EA0A2` |
| Text | Disabled | `#747679` |
| Identity | Primary indigo | `#586CF6` |
| Selection | Subtle / soft / medium | Primary at 10% / 16% / 24% |
| Selection | Selected border / focus ring | Primary at 42% / 55% |

## 11. Final philosophy

```text
ENVIRONMENT  #1B1B1B
        ↓
WORK         #242429
        ↓
EMPHASIS     #29292D
        ↓
FLOATING     #303034
        ↓
INTERACTION  #343438
        +
IDENTITY     #586CF6
```

`#1B1B1B` is the environment. `#242429` contains work. `#1E1E20` recesses editable controls inside those cards. `#29292D` communicates interaction or emphasis. `#303034` floats above the workspace. `#343438` exists temporarily during interaction. `#586CF6` communicates FlowOS identity, action, selection, and active state.

The goal is not simply to make FlowOS darker or to imitate another productivity application. It is to create a visual foundation that supports users from student productivity through professional and founder-level personal execution, while staying understandable, credible, efficient, and quiet during hours of work.

> Do not design every component independently. Design the semantic system once, then require every component to explain why it deserves a different visual treatment.
