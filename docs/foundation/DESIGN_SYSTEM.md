# FlowOS Visual Design System v3.0


|                           |                                                                                                                                                          |
| ------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Version**               | 3.0                                                                                                                                                      |
| **Status**                | Approved implementation contract — migration pending                                                                                                     |
| **Owner**                 | FlowOS Product                                                                                                                                           |
| **Date**                  | July 13, 2026                                                                                                                                            |
| **Supersedes**            | [Visual Design System v2.0](./DESIGN_SYSTEM_v2.md)                                                                                                       |
| **Implementation source** | [globals.css](../../src/app/globals.css) after the dedicated migration                                                                                   |
| **Related**               | [CODE_STANDARDS.md](./governance/CODE_STANDARDS.md) · [PRINCIPLES.md](./governance/PRINCIPLES.md) · [decision-log.md](../execution/logs/decision-log.md) |


---

## 1. Purpose and scope

FlowOS is a premium, desktop-first productivity operating system for tasks, habits, focus, schedule, reflection, and notes. Its visual system must make every route, rail, drawer, overlay, and temporary control feel like one calm workspace:

- calm, focused, minimal, structured, and modern
- dense where organising work benefits from density
- spacious where focus and writing benefit from breathing room
- visually quiet enough that the workspace disappears behind the user's work

This document is the visual authority for the whole product: Today, Tasks, Habits, Schedule, Focus, Reflection, Notes, Kanban, Timeline, navigation, drawers, overlays, modals, popovers, and context menus.

It governs visual styling only. It does **not** change product behaviour, business logic, data, routing, feature architecture, or working layouts unless a visual replacement requires it.

### Non-goals

- A page-specific visual system or a Today-only redesign
- Generic colourful SaaS styling, decorative glows, or blue-as-decoration
- Nested-card hierarchy, arbitrary greys, or a container around every element
- New modules, command interfaces, or layout rewrites presented as design work
- A one-shot destructive CSS rewrite

### Current implementation status

The repository still implements the v2 token contract. The exact v3 tokens and component variants below are **target requirements**, not a claim that they are already shipped. The dedicated migration runbook will define phases, verification, compatibility aliases, and removal of legacy token names. Until then, `globals.css` remains code truth and this document remains design truth.

FlowOS is dark-only by product policy. Existing light-theme code is legacy implementation debt to be retired through the migration; it is not a second v3 visual system.

---

## 2. Core principles

### Content first

The user's work receives the strongest visual attention. Chrome frames it without becoming the subject.

### Hierarchy through structure

Create hierarchy in this order:

1. Surface depth
2. Typography
3. Spacing
4. Scale
5. State
6. Restrained accent colour

Do not create hierarchy by nesting increasingly raised cards.

### One clear current context

Each workspace must make these questions answerable at a glance:

1. Where am I?
2. What am I doing now?
3. What should I do next?
4. What can I interact with?

### Purposeful density

Task lists, habit lists, queue rows, note lists, Kanban cards, and timeline metadata are compact. Focus timers, current-task descriptions, reflection writing, notes editors, and empty workspaces receive more air.

---

## 3. Semantic surface system

Every permanent major surface belongs to one of four levels. Navigation is persistent chrome outside that stack; hover is temporary state only.


| Role       | Token               | Value     | Purpose                                                    |
| ---------- | ------------------- | --------- | ---------------------------------------------------------- |
| Canvas     | `--surface-canvas`  | `#080E1B` | Page background and cardless work area                     |
| Navigation | `--surface-nav`     | `#070C18` | Persistent left/right rails and sidebar chrome             |
| Base       | `--surface-base`    | `#0D1423` | Organisational panels, groups, lists, sections             |
| Raised     | `--surface-raised`  | `#121B2C` | Current, selected, or attention-worthy functional surfaces |
| Overlay    | `--surface-overlay` | `#151E30` | Temporary UI above the workspace                           |
| Hover      | `--surface-hover`   | `#1A2437` | Pointer, keyboard-row, or drag-candidate feedback only     |


### Surface responsibilities

**Canvas** is the lowest depth. Use it for the application workspace, empty page space, and the cardless Focus timer. Never use it for floating UI.

**Navigation** is slightly darker than the canvas. It frames the workspace without competing with it; it is not a content or editor surface.

**Base** is quiet organisation: task and habit groups, normal panels, notes lists, reflection sections, Kanban columns, timeline base, schedule groups, and secondary drawer content.

**Raised** means “this deserves attention now”: Current Focus Task, Quick Capture, selected detail, active queue item, or an active editor context. If every card is raised, none is.

**Overlay** is temporary context: queue overlay, picker, quick drawer opened over another workspace, dialog, popover, dropdown, command interface, and context menu. It separates from the workspace with depth, border, and restrained shadow—never glow.

**Hover** is never a permanent card fill.

### Surface mapping rules

- Prefer surface contrast before adding a border.
- Task, note, habit, and queue rows are flat within their parent surface unless their object role requires a card, as in Kanban.
- Do not create a separate permanent grey for one page.
- Preserve compatibility aliases during migration so existing Tailwind and shadcn primitives can move incrementally to the new semantic names.

---

## 4. Colour, borders, and text

### Borders


| Token             | Value     | Use                                                                                |
| ----------------- | --------- | ---------------------------------------------------------------------------------- |
| `--border-subtle` | `#202B3D` | Base surfaces, quiet dividers, normal inputs, group boundaries, timeline structure |
| `--border-strong` | `#303C51` | Raised surfaces, overlays, active major containers, selected major surfaces        |


Borders provide structure, not primary hierarchy. Do not use strong borders on every task row or build a stack of card → card → bordered row → bordered badge.

### Primary accent


| Token              | Value                      |
| ------------------ | -------------------------- |
| `--primary`        | `#586CF6`                  |
| `--primary-subtle` | `rgba(88, 108, 246, 0.08)` |
| `--primary-soft`   | `rgba(88, 108, 246, 0.12)` |
| `--primary-medium` | `rgba(88, 108, 246, 0.20)` |


Indigo identifies primary actions, selected navigation, current Focus state, active controls, timeline Now, selected tabs, drag targets, active progress, and accessible focus where appropriate. The interface must remain useful without it; use it to direct attention, not decorate normal borders, icons, text, badges, dividers, or all buttons.


| Variant          | Meaning                                      |
| ---------------- | -------------------------------------------- |
| `primary-subtle` | Quiet selected background or current context |
| `primary-soft`   | Selected row or secondary active navigation  |
| `primary-medium` | Drag/drop zone or strong active interaction  |


### Text hierarchy


| Token              | Value     | Use                                                         |
| ------------------ | --------- | ----------------------------------------------------------- |
| `--text-primary`   | `#F9FAFB` | Titles, important numbers, active values, modal titles      |
| `--text-secondary` | `#94A3B8` | Descriptions, moderate-importance metadata                  |
| `--text-muted`     | `#64748B` | Empty states, helper copy, inactive tabs, historical values |
| `--text-disabled`  | `#475569` | Disabled or unavailable controls only                       |


Do not use pure white by default or disabled text for ordinary metadata.

### Semantic status colour

Semantic red, amber, green, and purple remain available only when they communicate meaning. Priority colour belongs on a flag, small badge, or indicator—not an entire task row. State badges are consistent globally: Focusing uses indigo, Next a subtle primary treatment, Completed recedes, and Missed is distinct without becoming aggressive red unless action is required.

---

## 5. Typography, spacing, shape, and depth

### Typography

Use the shared typography vocabulary in `[src/lib/typography.ts](../../src/lib/typography.ts)`. Do not invent a page-specific scale.


| Level         | Usage                                                                                                          |
| ------------- | -------------------------------------------------------------------------------------------------------------- |
| Page title    | Routes such as Tasks, Habits, Notes, Reflection, Focus, Schedule; compact semibold/bold, never marketing-sized |
| Section title | Today’s Tasks, Current Focus, Next Up, Daily Review, History; medium/semibold                                  |
| Item title    | Task, habit, note, queue, and Kanban titles; visually above metadata                                           |
| Metadata      | Duration, date, group, count, timestamps; deliberately recessive                                               |
| Micro label   | FOCUSING, TODAY, PINNED, NEXT; sparing uppercase only                                                          |


### Spacing

Use the 4px rhythm: **4, 8, 12, 16, 20, 24, 32px**. Use arbitrary values only when layout geometry requires them. Compact rows preserve scan speed; thinking and focus surfaces use larger gaps and vertical breathing room.

### Radius


| Token / role | Value | Use                                                    |
| ------------ | ----- | ------------------------------------------------------ |
| Small        | 6px   | Badges and compact controls                            |
| Medium       | 8px   | Inputs, rows, buttons                                  |
| Large        | 12px  | Functional cards and drawers                           |
| Extra large  | 16px  | Major overlays and major workspace surfaces, sparingly |


Do not mix `rounded-xl`, `rounded-2xl`, and `rounded-3xl` without semantic purpose.

### Shadows and elevation


| Surface | Shadow                                                 |
| ------- | ------------------------------------------------------ |
| Base    | None                                                   |
| Raised  | Very subtle only when surface contrast is insufficient |
| Overlay | Restrained separation shadow                           |
| Modal   | Strongest allowed shadow                               |


No blue glow, ambient glow, neon shadow, or decorative shadow. Surface contrast supplies most depth.

### Motion and scroll

- Fast interaction: 100–150ms
- Normal state change: 150–200ms
- Drawer or overlay: 200–250ms
- Motion serves hover, selection, collapse, overlay opening, and drag feedback—not static text, cards, or backgrounds.
- Respect `prefers-reduced-motion`.
- Use one thin, quiet dark scrollbar globally; increase contrast on hover.
- Limit internal scroll to genuinely constrained content such as the Notes drawer, queue overlay, long current-task description, or Kanban workspace. Avoid nested scrolling.

---

## 6. Shared component contract

Update shared primitives before page-level components. Existing `src/components/ui/` primitives and appearance helpers remain the implementation API; do not create an unrelated parallel component taxonomy.

### Buttons


| Variant     | Use                                                                          | Treatment                                            |
| ----------- | ---------------------------------------------------------------------------- | ---------------------------------------------------- |
| Primary     | Save Reflection, Start Focus, confirmation, critical forward action          | Indigo fill, strong contrast, medium radius, no glow |
| Secondary   | Pomodoro, Focus Reflection, Open today’s note, View Full Timeline, New Group | Quiet surface and subtle border                      |
| Ghost       | Toolbars, icon controls, collapse, visibility, overflow                      | Quiet at rest; background appears on hover           |
| Destructive | Delete, Clear All, irreversible actions                                      | Semantic destructive colour only                     |


Only one dominant primary action normally exists in a local context.

### Inputs

Text, search, textarea, number, date, and Quick Capture share the same states:


| State    | Treatment                                 |
| -------- | ----------------------------------------- |
| Normal   | Quiet surface and subtle border           |
| Hover    | Slightly stronger border contrast         |
| Focus    | Primary border or accessible primary ring |
| Disabled | Muted and clearly unavailable             |


Quick Capture is a raised, immediately actionable surface—not a glowing panel.

### Icons, badges, and labels

- Use the existing icon library consistently.
- Standard sizes: 14px micro metadata, 16px compact row controls, 18px navigation/toolbars, 20px major controls.
- Icons inherit semantic text colour; no arbitrary per-icon greys.
- Group badges identify category without overpowering item titles.
- Badge and state variants must be shared by primitives, not recreated per page.

### Temporary UI

Dialogs, drawers, popovers, dropdown menus, tooltips, task pickers, quick-schedule UI, and context menus use Overlay. Modals trap focus; Escape closes an overlay when appropriate; icon-only buttons require accessible labels.

### Drag and drop

All drag interactions share one language:


| State           | Treatment                                                                |
| --------------- | ------------------------------------------------------------------------ |
| Dragging item   | Slightly elevated overlay-like surface, strong border, restrained shadow |
| Drag source     | Reduced opacity                                                          |
| Drop target     | `primary-medium` background and primary border                           |
| Insertion point | Primary indicator line                                                   |


Tasks, Habits, Queue, and Kanban must not use unrelated drag colours. Provide keyboard alternatives where the interaction supports them.

### State distinction


| State       | Meaning                          | Visual treatment                    |
| ----------- | -------------------------------- | ----------------------------------- |
| Hover       | Temporary pointer feedback       | `surface-hover`                     |
| Selected    | User-selected object             | `primary-subtle` or `primary-soft`  |
| Active      | Operating control or tab         | Primary indicator and stronger text |
| Current     | System’s present context         | Strategic primary accent            |
| Drag target | Accepted insertion/drop location | `primary-medium`                    |


Selected, active, current, and hover must never collapse into one indistinguishable treatment.

---

## 7. Application shell

### Navigation

Left navigation and the right utility rail use Navigation. Inactive items are secondary/muted with no resting card background; hover uses `surface-hover`.

Active navigation uses a primary indicator, `primary-soft` background, and primary or high-contrast text. Collapsed navigation preserves aligned icons, obvious active state, stable layout, and hover tooltips.

The right rail follows the same hierarchy. An active drawer has a raised or soft-selected state; inactive utilities remain muted.

### Top bar

The top bar stays compact and usually one line. It presents context, not a dashboard:

```text
Monday, 13 July · 40% on track · Schedule ↗ · Notes ↗
0/3 Tasks · 4/7 Habits · 25m Focus · Pending Reflection
```

Do not introduce a large greeting header unless a page explicitly needs it.

### Viewport behaviour

At desktop widths, retain a clear workspace structure without over-stretching prose. At narrower widths, collapse navigation and overlay utility drawers while preserving the central execution workspace. Adapt layout; do not solve responsiveness by shrinking all typography.

---

## 8. Workspace patterns

### Today

Today is the execution workspace. Priority is:

1. Current Focus state
2. Current Focus Task
3. Next Up
4. Today’s Tasks and Habits
5. Timeline
6. Secondary utilities

The Focus timer is cardless on Canvas. Its hierarchy comes from scale, whitespace, indigo state, and typography.

Current Focus Task is Raised and is the strongest functional card in the central workspace. Show task title, priority, group, task details, overflow, focused duration, goal duration, and a visible-by-default collapsible description. The description has a fixed maximum height and its own scroll so it cannot push Next Up away.

Next Up is a compact Base or raised-adjacent preview of exactly one next task with group and optional duration, followed by “(N more).” The full queue is an Overlay for reorder, removal, task detail access, and clear queue. It is an execution sequence, not a second task manager: inline date, duration, and priority editing do not belong in queue rows.

### Tasks and Habits

Tasks and Habits are dense organisation workspaces: Canvas page, Base groups, subtle borders, consistent headers, and mostly flat rows. Selected items use a primary subtle/soft state. Quick Schedule is Overlay when open. Habits share this structure and state hierarchy; habit identity may use small semantic accents but not a second surface system.

### Notes

Notes is a thinking workspace with more air. The Canvas supports a Base list and rail; the editor is continuous rather than over-carded, becoming Raised only where hierarchy genuinely requires it. Selected notes use `primary-subtle`.

When opened over another page, the Notes drawer is Overlay. It remains a flat navigator structured by muted section labels (Pinned, Mindset, Daily Notes, growth areas), spacing, selection, and hover—not a card gallery. Selected rows use `primary-soft`.

### Kanban

Kanban is the intentional repeated-card exception: board/columns are Base; movable cards are Raised with subtle borders. Selected cards use a primary subtle treatment or primary border. Drag targets use `primary-medium`. Do not give every column a blue border.

### Reflection

Reflection is calm and spacious: Canvas with Base Daily Review, writing, Custom Entries, and History surfaces. Inputs are quiet darker or raised surfaces. Save Reflection is the local primary action. Empty custom Kanban states are purposeful and do not resemble unfinished feature cards.

### Focus

The dedicated Focus route shares Today’s Focus language: cardless timer where possible, Raised current task, Base history, and strategic indigo session states. Break states receive calm semantic distinction. Focus must not split into two unrelated visual systems.

### Schedule and Timeline

Timeline base is Base; events are Raised or contextually elevated rows. Time-grid lines use subtle borders. Current time and Now marker use primary. Scheduled items use semantic indicators sparingly. The full-height Today timeline anchors the right side without making every line strong.

---

## 9. Empty, accessible, and resilient UI

### Empty states

Empty states are quiet: muted text and an optional simple icon. A dashed border means an interactive drop or add target only:

- “No tasks here” does not require a dashed box.
- “Drop tasks or habits here” does.

### Accessibility

- Keyboard focus is visible and has sufficient contrast.
- Buttons have accessible labels; icon-only controls expose `aria-label`.
- Selected state is not colour-only.
- Modals trap focus and overlays close with Escape where appropriate.
- Drag interactions expose keyboard alternatives where supported.
- Reduced motion is respected.
- Minimalism never hides a critical control.

---

## 10. Implementation architecture

### Token and primitive ownership

The migration must:

- Audit `globals.css`, Tailwind theme bridges, and all current theme tokens.
- Map hardcoded backgrounds, borders, text greys, repeated Tailwind combinations, arbitrary colour utilities, and page-specific shadows to semantic visual roles.
- Define the FlowOS v3 semantic tokens and required compatibility aliases centrally.
- Update shared primitives, semantic recipes, and appearance helpers before feature-page migration.
- Migrate feature components before integration workspaces that consume those components.
- Avoid duplicating semantic styling logic directly in page JSX.
- Preserve feature behaviour throughout the visual migration.

Expected migration ownership:

| Area | Primary location |
|---|---|
| CSS variables and Tailwind bridge | `src/app/globals.css` |
| Surface class recipes | `src/lib/theme/surface-classes.ts` |
| Typography | `src/lib/typography.ts` |
| Domain semantic colours | `src/lib/*-appearance.ts`, `schedule-palette.ts` |
| Shared controls and primitives | `src/components/ui/` |
| Shared domain components | `src/components/{feature}/` |
| Page composition | page-level routes and workspace components |

A `Surface` component or semantic utilities such as:

- `surface-canvas`
- `surface-nav`
- `surface-base`
- `surface-raised`
- `surface-overlay`

are acceptable only when they extend the existing FlowOS architecture and reduce repeated styling.

Do not introduce a universal `Surface` abstraction merely to wrap every container.

Semantic surface ownership may remain in existing component variants when that produces a simpler architecture.

### Styling ownership rule

Visual decisions should be owned at the lowest reusable semantic level.

Examples:

- Button appearance belongs to the shared Button primitive.
- Input appearance belongs to shared input primitives.
- Task row appearance belongs to the shared Task row component or Task appearance helper.
- Habit state appearance belongs to the Habit appearance system.
- Timeline event appearance belongs to Schedule/Timeline appearance helpers.
- Overlay depth belongs to shared overlay primitives.
- Today page owns composition and visual priority, not duplicated Task or Habit styling.

Page-level JSX must not redefine a visual system already owned by a primitive or feature component.

### Migration boundary

The future migration follows this dependency-aware order.

This defines migration boundaries and ownership. It is not the detailed execution runbook. See [design-system-v3-migration.md](../execution/runbooks/design-system-v3-migration.md).

#### Phase 1 — Global Tokens and Theme Bridge

- Define semantic colour tokens.
- Define text hierarchy tokens.
- Define border tokens.
- Define radius, shadow, and motion rules where required.
- Update Tailwind/theme bridges.
- Add temporary compatibility aliases for existing tokens where necessary.

No feature redesign occurs in this phase.

#### Phase 2 — Shared Primitives and Semantic Recipes

Migrate shared UI foundations:

- Button
- Input
- Textarea
- Badge
- Tabs
- Dialog
- Drawer
- Popover
- DropdownMenu
- ContextMenu
- Tooltip
- shared focus states
- shared scrollbar treatment
- semantic surface recipes

This phase establishes the visual language consumed by feature components.

#### Phase 3 — Navigation and Application Shell

Migrate:

- left navigation
- collapsed navigation
- right utility rail
- application canvas
- global page boundaries
- compact top navigation
- persistent shell controls

Establish the global Canvas → Navigation relationship before migrating feature workspaces.

#### Phase 4 — Shared Domain Appearance Systems

Audit and normalise semantic appearance ownership for:

- tasks
- habits
- focus states
- schedule and timeline events
- priorities
- groups
- queue states
- notes
- reflection states

Preserve legitimate semantic colours.

Do not collapse all domain meaning into the primary indigo token.

This phase should remove conflicting page-specific appearance logic before feature migration.

#### Phase 5 — Tasks and Habits

Migrate Tasks and Habits first because their components are reused throughout FlowOS.

Establish:

- task group surfaces
- habit group surfaces
- Task row hierarchy
- Habit row hierarchy
- selected state
- hover state
- completed state
- missed state
- group and priority indicators
- drag states

Today must later consume these established visual rules.

#### Phase 6 — Focus and Schedule / Timeline

Migrate the core execution systems.

Establish:

- cardless Focus timer language
- current Focus state
- Current Focus Task raised hierarchy
- Focus metadata
- break states
- timeline base
- timeline grid
- event surfaces
- Now marker
- scheduled Task/Habit appearance

Today must later reuse these Focus and Timeline semantics.

#### Phase 7 — Notes and Kanban

Migrate:

- Notes workspace
- growth area navigation
- note list
- note editor
- Notes navigation hierarchy
- Kanban workspace
- Kanban columns
- Kanban cards
- Kanban drag states

Preserve the distinction between the flat Notes navigation model and the object-based Kanban card model.

#### Phase 8 — Reflection

Migrate Reflection after writing and organisational surface patterns have been established.

Establish:

- Daily Review hierarchy
- Reflection writing surfaces
- Custom Entries
- Reflection History
- Reflection empty states
- local primary Save action

Reflection should intentionally use lower density and more breathing room than Tasks.

#### Phase 9 — Today Integration Workspace

Migrate Today after its major domain dependencies have established their visual language.

Today is an integration workspace.

It must compose existing semantic systems for:

- Tasks
- Habits
- Focus
- Current Focus Task
- Next Up
- Timeline
- Notes
- Reflection
- Quick Capture

Today owns:

- page composition
- execution hierarchy
- spatial priority
- current-state emphasis
- responsive workspace behaviour

Today does NOT independently redefine:

- Task row styling
- Habit row styling
- Timeline event styling
- priority colours
- group badges
- Focus semantic states

The final Today hierarchy should make the following immediately understandable:

1. What am I doing now?
2. What should I do next?
3. What else is relevant today?
4. What is happening on my timeline?

#### Phase 10 — Feature Drawers and Complex Overlays

Audit feature-level temporary contexts:

- Next Up Queue overlay
- Task picker
- Habit picker
- Notes quick drawer
- Reflection quick drawer
- Quick Schedule
- task detail overlays
- contextual feature panels

Shared overlay primitives were established in Phase 2.

This phase migrates complex feature compositions that use those primitives.

Do not defer basic Dialog, Drawer, Popover, DropdownMenu, or ContextMenu styling until this phase.

#### Phase 11 — Global Consistency Audit

Audit the entire FlowOS application.

Search for:

- hardcoded background hex values
- hardcoded border colours
- arbitrary slate/gray utilities
- conflicting blue utilities
- repeated Tailwind style combinations
- page-specific shadows
- unnecessary borders
- unnecessary cards
- one-off radius values
- inconsistent hover states
- inconsistent selected states

For every major surface, identify:

- Canvas
- Navigation
- Base
- Raised
- Overlay

Any surface that cannot be intentionally classified must be reviewed.

Remove compatibility aliases only when all consumers have migrated safely.

### Verification per phase

Every implementation phase must run:

1. lint
2. TypeScript/type checking
3. production build verification
4. manual smoke testing of changed flows
5. visual inspection of changed surfaces
6. keyboard interaction checks for changed interactive primitives

Visual migration must not alter:

- feature behaviour
- persistence
- database behaviour
- routing
- drag-and-drop semantics
- Focus session logic
- Task scheduling rules
- Queue behaviour

Any behavioural change discovered during migration must be treated as a separate issue unless the visual migration directly caused the regression.

---

## 11. Acceptance and consistency audit

Before a migrated surface is accepted, answer:

1. What is the page canvas?
2. Which surfaces organise work?
3. Which deserve Raised attention?
4. Which are temporary Overlays?
5. Is indigo reserved for meaningful action and current state?
6. Are there unnecessary borders or containers?
7. Are hover and selected states distinct?
8. Is text hierarchy consistent?
9. Does spacing follow the system?
10. Are radius and shadow values consistent?
11. Does the page belong visually to FlowOS?
12. Does it introduce an undefined one-off grey?

The final audit searches for hardcoded surface/border/text hexes, arbitrary slate/gray classes, conflicting blue utilities, and page-specific shadows. Do not blindly replace semantic status colours.

---

## 12. Frozen v3 decisions

- Canvas is for work; Base is for organisation; Raised is for attention; Overlay is for temporary context.
- Navigation is persistent recessed chrome, not a content surface.
- Indigo is the scarce primary action and current-state signal.
- Typography and spacing create more hierarchy than borders.
- Cards are purposeful, not default wrappers.
- Focus timer remains cardless.
- Repeated Kanban cards are a valid object-representation exception.
- The UI is desktop-first, dark-only, accessible, and precise rather than playful.
- v2.0 remains available as historical context; v3.0 is the sole visual authority for new work.
- Code migration follows [design-system-v3-migration.md](../execution/runbooks/design-system-v3-migration.md).