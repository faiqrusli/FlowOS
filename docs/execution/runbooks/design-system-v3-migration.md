# Visual Design System v3.0 - Global Migration

**Status:** Ready - not started  
**Scope:** Application-wide visual migration only. Implements [DESIGN_SYSTEM.md](../../foundation/DESIGN_SYSTEM.md) v3.0. Does **not** change product behaviour, persistence, routing, database logic, or feature architecture unless a visual replacement requires it.  
**Authority:** [DESIGN_SYSTEM.md](../../foundation/DESIGN_SYSTEM.md) section 10 · [decision-log.md](../logs/decision-log.md) 2026-07-13 "Visual Design System v3.0". Historical baseline: [DESIGN_SYSTEM_v2.md](../../foundation/DESIGN_SYSTEM_v2.md).  
**Repo root:** repository root (Next.js app).  
**Production baseline:** https://flowos-sage.vercel.app  
**Docs path:** `docs/` (tracked in VCS)  
**Idea capture:** [inbox.md](../logs/inbox.md) -> this runbook -> [july-log.md](../logs/july-log.md) after merge to `main`.

**Non-goals:** Command palette, new modules, monolith refactors, layout rewrites, light-theme polish, behaviour changes disguised as visual work.

---

## 1. Product understanding

**In plain terms:** FlowOS already has partial surface tokens and feature-specific appearance helpers from v1/v2. v3.0 defines a single global semantic system - Canvas, Navigation, Base, Raised, Overlay, Hover - plus shared typography, spacing, states, primitives, and domain appearance ownership. The migration replaces one-off page styling with reusable semantic recipes so every route feels like one productivity OS.

**Styling ownership rule (non-negotiable)**

Visual decisions belong at the lowest reusable semantic level:

- Primitives own Button, Input, Dialog, Popover, and overlay depth.
- Domain helpers own task rows, habit states, timeline events, priorities, and groups.
- Feature components own their row/card variants.
- Page composition owns hierarchy and spacing - not duplicated row styling.

**Today is last among major workspaces** because it composes Tasks, Habits, Focus, Timeline, Notes, Reflection, and Quick Capture. Do not migrate Today before Phases 5-8 establish the systems it consumes.

---

## Acceptance test

When Phases 1-11 are complete on production:

1. Every major surface maps intentionally to Canvas, Navigation, Base, Raised, or Overlay.
2. `globals.css` exposes v3 semantic tokens with documented compatibility aliases only where still required.
3. Shared primitives (`src/components/ui/`) and surface recipes (`surface-classes.ts`) consume v3 tokens - not page-specific hex or arbitrary slate/gray stacks.
4. Tasks, Habits, Focus, Schedule/Timeline, Notes, Kanban, Reflection, and Today each follow DESIGN_SYSTEM section 8 without page-specific grey hierarchies.
5. Focus timer remains cardless on Canvas; Current Focus Task is Raised; Next Up and complex overlays use Overlay.
6. Hover, selected, active, current, and drag-target states are distinguishable globally.
7. Primary indigo is scarce and meaningful; semantic status colours remain where they communicate meaning.
8. No behavioural regressions in focus sessions, queue order, drag-and-drop, scheduling, or persistence.
9. `npm run build` and `npm run lint` pass.

---

## Resume protocol

| Step | Action |
|------|--------|
| 1 | **Stop** at the phase stop/fail condition - do not skip dependency order. |
| 2 | **Record blocker** in [decision-log.md](../logs/decision-log.md): date, phase #, symptom, files touched, next action. |
| 3 | **Git:** commit WIP on the **phase branch** or `git stash`. Do **not** merge to `main` without founder approval. |
| 4 | **Resume** the same phase when unblocked. |
| 5 | **Behavioural regressions** discovered during migration are separate issues unless the visual change directly caused them. |

---

## Phase dependency table

| Phase | Depends on (must be on `main`) | Blocks |
|-------|--------------------------------|--------|
| 1 - Global tokens and theme bridge | v3.0 spec + runbook published | 2-11 |
| 2 - Shared primitives and semantic recipes | 1 | 3-11 |
| 3 - Navigation and application shell | 2 | 5-11 |
| 4 - Shared domain appearance systems | 2 | 5-11 |
| 5 - Tasks and Habits | 3, 4 | 9 |
| 6 - Focus and Schedule / Timeline | 3, 4 | 9 |
| 7 - Notes and Kanban | 3, 4 | 9 |
| 8 - Reflection | 3, 4, 7 preferred | 9 |
| 9 - Today integration workspace | 5, 6, 7, 8 | 10 |
| 10 - Feature drawers and complex overlays | 2, 9 | 11 |
| 11 - Global consistency audit | 10 | - |

---

## Git workflow

Full rules: [GIT_WORKFLOW.md](../../foundation/governance/GIT_WORKFLOW.md).

| Step | Rule |
|------|------|
| **Start phase** | `git checkout main && git pull` -> `git checkout -b m2/session-N-v3-phase-{N}-short-name` |
| **During phase** | Commit on branch; `git push -u origin HEAD` |
| **End phase** | Run verification checklist -> report merge bundle -> **ask founder to approve merge to `main`** |
| **After merge** | Verify production -> append [july-log.md](../logs/july-log.md) |

**Suggested merge bundles**

| Bundle | Phases | Remind merge when |
|--------|--------|-------------------|
| B1 - Token foundation | 1-2 | Primitives render correctly in isolation |
| B2 - Shell + domain recipes | 3-4 | Nav/rails/canvas + appearance helpers aligned |
| B3 - Core workspaces | 5-6 | Tasks, Habits, Focus, Schedule/Timeline smoke clean |
| B4 - Thinking workspaces | 7-8 | Notes, Kanban, Reflection smoke clean |
| B5 - Integration + overlays | 9-10 | Today composes without local row redefinition |
| B6 - Audit closure | 11 | Global grep audit passes; aliases removed where safe |

Ad-hoc visual fixes during migration: `tweak/v3-short-description` from `main`.

---

## Verification checklist (every phase)

```powershell
npm run lint
npm run build
```

Plus manual smoke on every changed flow and visual inspection of touched surfaces. For Phases 2 and 10, include keyboard focus checks on changed interactive primitives.

**Must not change:** feature behaviour, persistence, database behaviour, routing, drag-and-drop semantics, Focus session logic, Task scheduling rules, Queue behaviour.

---

## Phase 1 - Global Tokens and Theme Bridge

**Goal:** Centralise v3 semantic tokens and compatibility aliases in `globals.css` without redesigning features.  
**Maps to:** DESIGN_SYSTEM sections 3-5, section 10 Phase 1  
**Merge bundle:** B1

### Current code reality

| Area | File | Today |
|------|------|-------|
| Token source | `src/app/globals.css` | v2 oklch navy: `--background`, `--surface`, `--card`, board/focus extensions |
| Tailwind bridge | `@theme inline` in globals | Maps legacy names to utilities |
| TS reference | `src/lib/theme/tokens.ts` | Documents four-level stack; needs v3 semantic names |
| Legacy aliases | globals `.dark` block | `--surface-app`, `--surface-page`, `--timeline-surface`, etc. |

### Target tokens (v3 contract)

| Role | CSS variable | Hex |
|------|--------------|-----|
| Canvas | `--surface-canvas` | `#080E1B` |
| Navigation | `--surface-nav` | `#070C18` |
| Base | `--surface-base` | `#0D1423` |
| Raised | `--surface-raised` | `#121B2C` |
| Overlay | `--surface-overlay` | `#151E30` |
| Hover | `--surface-hover` | `#1A2437` |
| Border subtle | `--border-subtle` | `#202B3D` |
| Border strong | `--border-strong` | `#303C51` |
| Primary | `--primary` | `#586CF6` |
| Text primary | `--text-primary` | `#F9FAFB` |
| Text secondary | `--text-secondary` | `#94A3B8` |
| Text muted | `--text-muted` | `#64748B` |
| Text disabled | `--text-disabled` | `#475569` |

Add `--primary-subtle`, `--primary-soft`, `--primary-medium`, radius/shadow/motion tokens, and **compatibility aliases** mapping existing shadcn/Tailwind consumers (`--background` -> canvas, `--surface` -> nav, `--card` -> base/raised contexts as documented) until later phases migrate consumers.

### Steps

| # | Step |
|---|------|
| 1 | Audit `globals.css` `:root` and `.dark` for all surface, border, text, shadow, and legacy alias definitions. |
| 2 | Add v3 semantic variables and document alias map in `tokens.ts`. |
| 3 | Extend `@theme inline` so Tailwind utilities can consume v3 names (`bg-surface-canvas`, etc.) without breaking existing `bg-background` / `bg-card` callers. |
| 4 | Do **not** remove legacy aliases in this phase. |
| 5 | Update DESIGN_SYSTEM cross-reference only if token names drift during implementation. |
| 6 | Run verification checklist. |

### Stop/fail if

- Any existing route loses contrast or fails to render due to alias breakage.
- Light-theme code is expanded instead of left untouched pending retirement.

---

## Phase 2 - Shared Primitives and Semantic Recipes

**Goal:** Establish the visual language all feature components will consume.  
**Maps to:** DESIGN_SYSTEM section 6, section 10 Phase 2  
**Merge bundle:** B1  
**Depends on:** Phase 1

### Primary files

| Primitive / recipe | Location |
|--------------------|----------|
| Button | `src/components/ui/button.tsx` |
| Input / Textarea | `src/components/ui/input.tsx`, `textarea.tsx` |
| Badge | `src/components/ui/badge.tsx` |
| Tabs | `src/components/ui/tabs.tsx` |
| Dialog | `src/components/ui/dialog.tsx` |
| Drawer | drawer/sheet primitives |
| Popover / Dropdown / Context menu | `popover.tsx`, `dropdown-menu.tsx`, `context-menu.tsx` |
| Tooltip | `tooltip.tsx` |
| Surface recipes | `src/lib/theme/surface-classes.ts` |
| Global component classes | `globals.css` `@layer components` (`.flow-surface-*`, `.flow-selected`, scrollbar utilities) |

### Steps

| # | Step |
|---|------|
| 1 | Map each primitive variant to v3 tokens: primary/secondary/ghost/destructive buttons; input states; overlay surfaces. |
| 2 | Remove or gate dark-specific glow/shadow exceptions that violate section 5 (e.g. primary button neon shadow) where primitives own them. |
| 3 | Add or extend semantic utilities: `surface-canvas`, `surface-nav`, `surface-base`, `surface-raised`, `surface-overlay` in `surface-classes.ts` only if they reduce duplication. |
| 4 | Standardise shared focus ring, scrollbar, and empty/dashed drop target classes. |
| 5 | Do **not** migrate feature pages in this phase. |
| 6 | Run verification checklist + keyboard focus on Dialog, Dropdown, and Button. |

### Stop/fail if

- A universal `Surface` wrapper is introduced around every container without reducing repeated styling.
- Basic overlay primitives are deferred to Phase 10.

---

## Phase 3 - Navigation and Application Shell

**Goal:** Establish Canvas -> Navigation relationship globally before feature workspaces.  
**Maps to:** DESIGN_SYSTEM section 7, section 10 Phase 3  
**Merge bundle:** B2  
**Depends on:** Phase 2

### Primary files

| Area | Location |
|------|----------|
| App shell | `src/components/app-shell.tsx` |
| Left nav | `src/components/app-sidebar.tsx` |
| Right utility rail | `src/components/layout/global-right-sidebar.tsx` |
| Rail toggles | `src/lib/panel-toggle-styles.ts` |
| Mobile header | `app-sidebar.tsx` (`MobileSidebarTrigger`) |
| Workspace canvas class | `.flow-workspace` in `globals.css` |

### Steps

| # | Step |
|---|------|
| 1 | Canvas: migrate main workspace to `--surface-canvas` / alias. |
| 2 | Left nav + right rail: `--surface-nav`; resolve `workspaceRailBackgroundClass` lift vs pure nav token per DESIGN_SYSTEM. |
| 3 | Active nav: primary indicator + `primary-soft`; inactive: secondary/muted; hover: `surface-hover`. |
| 4 | Top bar: compact, merged into canvas; no floating dashboard band. |
| 5 | Collapsed nav: stable icon alignment, obvious active state, tooltips. |
| 6 | Run verification checklist across `/`, `/tasks`, `/schedule` shell only. |

### Stop/fail if

- Navigation competes visually with workspace content.
- Right rail uses an unrelated colour hierarchy from left nav.

---

## Phase 4 - Shared Domain Appearance Systems

**Goal:** Normalise semantic ownership before feature-page migration.  
**Maps to:** DESIGN_SYSTEM section 6, section 10 Phase 4  
**Merge bundle:** B2  
**Depends on:** Phase 2

### Primary files

| Domain | Location |
|--------|----------|
| Task groups / board | `src/lib/task-group-appearance.ts` |
| Workplace panels | `src/lib/workplace-panel-appearance.ts` |
| Schedule / timeline | `src/lib/schedule-palette.ts`, timeline components |
| Focus timer | `src/lib/focus-timer-appearance.ts` (remove hardcoded hex) |
| Priority / groups | `src/lib/task-priority.ts`, group dot helpers |
| Typography adoption | `src/lib/typography.ts` |

### Steps

| # | Step |
|---|------|
| 1 | Inventory page-level colour/spacing duplicates for tasks, habits, focus, timeline, notes, reflection, queue. |
| 2 | Move repeated styling into the appropriate `*-appearance.ts` helper or shared component variant. |
| 3 | Preserve semantic status colours (priority red/amber/green, schedule channels, habit accents). |
| 4 | Replace inline `text-[13px]` and arbitrary greys in touched helpers with typography tokens where the helper owns the style. |
| 5 | Do **not** migrate full pages yet - only shared recipes and conflicting page-local duplicates that would block Phases 5-8. |
| 6 | Run verification checklist. |

### Stop/fail if

- Domain meaning is collapsed into primary indigo.
- `schedule-palette.ts` accent semantics are removed instead of surface chrome around them.

---

## Phase 5 - Tasks and Habits

**Goal:** Establish row, group, state, and drag language reused by Today.  
**Maps to:** DESIGN_SYSTEM section 8 (Tasks, Habits)  
**Merge bundle:** B3  
**Depends on:** Phases 3, 4

### Primary files

| Area | Location |
|------|----------|
| Tasks board | `src/components/tasks/tasks-board-view.tsx` |
| Task row | `src/components/tasks/task-row.tsx`, `task-compact-card.tsx` |
| Task detail | `src/components/tasks/task-detail-panel.tsx` |
| Habits | `src/components/habits/**` |
| Quick Schedule | quick-schedule drawer components |

### Steps

| # | Step |
|---|------|
| 1 | Page canvas -> Canvas; task/habit groups -> Base with subtle border. |
| 2 | Rows flat within groups; hover `surface-hover`; selected `primary-subtle` / `primary-soft`. |
| 3 | Priority on flag/badge only; group badges restrained. |
| 4 | Drag source, drop target, insertion line per global DnD contract. |
| 5 | Quick Schedule opens as Overlay. |
| 6 | Run verification checklist on `/tasks` and `/habits`. |

### Stop/fail if

- Every task row gets a permanent bordered card.
- Today-specific task row styling is introduced here instead of in shared components.

---

## Phase 6 - Focus and Schedule / Timeline

**Goal:** Establish execution-system visuals Today will compose.  
**Maps to:** DESIGN_SYSTEM section 8 (Focus, Schedule)  
**Merge bundle:** B3  
**Depends on:** Phases 3, 4

### Primary files

| Area | Location |
|------|----------|
| Focus page | `src/components/focus/**`, `focus-page-content.tsx` |
| Workplace focus | `src/components/workplace/workplace-focus-card.tsx` |
| Timer ring | `src/components/focus/focus-timer-ring.tsx` |
| Timeline | `src/components/tasks/timeline-planner.tsx`, `schedule-*.tsx` |
| Today timeline embed | workplace timeline components |

### Steps

| # | Step |
|---|------|
| 1 | Cardless Focus timer on Canvas; typography + whitespace hierarchy. |
| 2 | Current Focus Task -> Raised; metadata recessive; description scroll cap preserved. |
| 3 | Focus session/break states: strategic primary + calm break distinction. |
| 4 | Timeline base -> Base; events -> Raised; grid subtle; Now marker primary. |
| 5 | Align `/focus` hub with Today Focus language - one system, not two. |
| 6 | Run verification checklist on `/focus`, `/schedule`, and timeline embed. |

### Stop/fail if

- Focus timer is wrapped in a Base/Raised card container.
- Timeline lines all become strong borders.

---

## Phase 7 - Notes and Kanban

**Goal:** Migrate thinking workspace and object-card exception.  
**Maps to:** DESIGN_SYSTEM section 8 (Notes, Kanban)  
**Merge bundle:** B4  
**Depends on:** Phases 3, 4

### Primary files

| Area | Location |
|------|----------|
| Notes page | `src/components/notes/**` |
| Notes drawer | `src/components/layout/sidebar-notes-panel.tsx` |
| Kanban | `src/components/notes/kanban-board-view.tsx` |
| Surface helpers | `surface-classes.ts` (`kanbanColumnBodyClass`, `kanbanCardClass`) |

### Steps

| # | Step |
|---|------|
| 1 | Notes canvas -> Canvas; list/rail -> Base; editor continuous, Raised only if needed. |
| 2 | Notes drawer -> Overlay when above another page; flat rows, `primary-soft` selected. |
| 3 | Kanban columns -> Base; cards -> Raised; drag -> `primary-medium`. |
| 4 | Preserve flat navigator vs movable card distinction. |
| 5 | Run verification checklist on `/notes` and Kanban boards. |

---

## Phase 8 - Reflection

**Goal:** Calm, spacious writing workspace.  
**Maps to:** DESIGN_SYSTEM section 8 (Reflection)  
**Merge bundle:** B4  
**Depends on:** Phases 3, 4; Phase 7 preferred

### Primary files

| Area | Location |
|------|----------|
| Reflection page | `src/app/(main)/reflection/**` |
| Reflection drawer | `src/components/layout/sidebar-reflection-panel.tsx` |
| Reflection kanban | `reflection-kanban-section.tsx` |

### Steps

| # | Step |
|---|------|
| 1 | Canvas + Base sections with more vertical breathing room than Tasks. |
| 2 | Writing surfaces quiet; Save Reflection = local primary action. |
| 3 | Custom Entries and History on Base; purposeful empty states. |
| 4 | Run verification checklist on `/reflection` and drawer. |

---

## Phase 9 - Today Integration Workspace

**Goal:** Compose established domain systems without redefining them.  
**Maps to:** DESIGN_SYSTEM section 8 (Today)  
**Merge bundle:** B5  
**Depends on:** Phases 5, 6, 7, 8

### Primary files

| Area | Location |
|------|----------|
| Today page | `src/components/today/today-page-content.tsx` |
| Workplace layout | `src/components/workplace/workplace-page-content.tsx` |
| Module cards | `workplace-*-card.tsx`, `workplace-compact-*-row.tsx` |
| Quick Capture | workplace quick-add components |
| Status rail | today status rail components |

### Steps

| # | Step |
|---|------|
| 1 | Canvas page background; compose Tasks/Habits/Focus/Timeline modules using Phase 5-6 components - no local row restyling. |
| 2 | Focus timer cardless; Current Focus Task Raised; Next Up compact preview. |
| 3 | Establish execution hierarchy: now -> next -> today lists -> timeline. |
| 4 | Quick Capture Raised and immediately actionable. |
| 5 | Verify four questions from DESIGN_SYSTEM section 10 Phase 9 are obvious on `/`. |
| 6 | Run full Today smoke: density presets, focus session, task/habit completion, timeline. |

### Stop/fail if

- Today redefines task row, habit row, timeline event, priority, or group badge styling locally.
- Next Up queue is inlined instead of overlay pattern where spec requires overlay.

---

## Phase 10 - Feature Drawers and Complex Overlays

**Goal:** Migrate feature compositions built on Phase 2 overlay primitives.  
**Maps to:** DESIGN_SYSTEM section 10 Phase 10  
**Merge bundle:** B5  
**Depends on:** Phases 2, 9

### Primary targets

| Overlay | Location |
|---------|----------|
| Next Up Queue | `src/components/focus/next-up-*.tsx` |
| Task / habit pickers | task/habit picker dialogs |
| Notes quick drawer | sidebar notes panel overlay state |
| Reflection quick drawer | sidebar reflection panel |
| Quick Schedule | schedule drawer |
| Task detail overlays | `task-detail-panel.tsx`, sidebar details |

### Steps

| # | Step |
|---|------|
| 1 | Confirm Dialog/Drawer/Popover/Dropdown/ContextMenu already migrated in Phase 2. |
| 2 | Apply Overlay surface, strong border, restrained shadow to each feature composition. |
| 3 | Preserve behaviour: queue reorder, focus trap, Escape close, keyboard alternatives. |
| 4 | Run verification checklist on each overlay flow. |

---

## Phase 11 - Global Consistency Audit

**Goal:** Remove accidental one-off styling and retire safe compatibility aliases.  
**Maps to:** DESIGN_SYSTEM section 11, section 10 Phase 11  
**Merge bundle:** B6  
**Depends on:** Phase 10

### Grep targets

```powershell
rg "#[0-9A-Fa-f]{3,8}" src/components src/lib --glob "!*.test.*"
rg "bg-slate-|bg-gray-|text-slate-|text-gray-|border-slate-|border-gray-" src/components
rg "bg-blue-|text-blue-|border-blue-" src/components
rg "shadow-\[" src/components
```

### Audit questions (every route)

1. Canvas, Navigation, Base, Raised, Overlay - classified?
2. Primary indigo scarce and meaningful?
3. Unnecessary borders/cards?
4. Hover vs selected vs active vs current distinct?
5. Typography and spacing from system?
6. One-off grey introduced?

### Steps

| # | Step |
|---|------|
| 1 | Run grep audit; file list of remaining violations. |
| 2 | Fix high-traffic violations only - no drive-by refactors outside audit list. |
| 3 | Remove compatibility aliases only when zero consumers remain. |
| 4 | Update `tokens.ts` and `FEATURE_INVENTORY.md` design-system status to **shipped**. |
| 5 | Append outcome to [decision-log.md](../logs/decision-log.md) and [july-log.md](../logs/july-log.md). |
| 6 | Final `npm run build && npm run lint`; production visual sign-off. |

---

## Out of scope (defer)

- Command palette and global search
- Light theme rewrite (product is dark-only; retire light path separately if needed)
- Monolith splits (`tasks-board-view.tsx`, `timeline-planner.tsx`)
- dnd-kit migration
- New modules or layout architecture changes
- Low-traffic routes (`auth-shell`, `future-work`, `about`) unless touched by audit

---

## Related documents

- [DESIGN_SYSTEM.md](../../foundation/DESIGN_SYSTEM.md) - v3.0 authority
- [CODE_STANDARDS.md](../../foundation/governance/CODE_STANDARDS.md) - styling rules
- [m2-surface-hierarchy.md](./m2-surface-hierarchy.md) - historical v1 implementation
- [m2-visual-design-v2.md](./m2-visual-design-v2.md) - historical v2 baseline

*End of runbook. Do not change phase order without a decision-log entry.*
