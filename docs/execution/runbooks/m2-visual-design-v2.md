# M2 — Visual Design System v2.0 Implementation

**Scope:** M2 only — implement [DESIGN_SYSTEM.md](../../foundation/DESIGN_SYSTEM.md) (v2.0) across every shipped FlowOS surface: application chrome, Workspace Drawer modules, and all primary pages with their inner components. Does **not** add modules, command palette, or new surface levels.  
**Authority:** [DESIGN_SYSTEM.md](../../foundation/DESIGN_SYSTEM.md) v2.0 Frozen · [decision-log.md](../logs/decision-log.md) 2026-07-10 “Visual Design System v2.0” + drawer card-on-chrome principle. Historical surface freeze: [DESIGN_SYSTEM_v1.md](../../foundation/DESIGN_SYSTEM_v1.md). Prior token work: [m2-surface-hierarchy.md](./m2-surface-hierarchy.md) (complete).  
**Repo root:** repository root (Next.js app).  
**Production baseline:** https://flowos-sage.vercel.app  
**Docs path:** `docs/` (tracked in VCS)  
**Idea capture:** [inbox.md](../logs/inbox.md) → sessions below → [july-log.md](../logs/july-log.md) after merge to `main`.

---

## 1. Product understanding

**In plain terms:** v1 froze four surface tokens. v2 freezes the **visual architecture**: content first, chrome second, one hero per screen, pages vs contextual Workspace Drawer, and hierarchy via layout/spacing/typography — not decoration.

**Frozen drawer principle (non-negotiable)**

```
Workspace Drawer (`--surface` / bg-sidebar)
└── Content cards (`--card`)
    └── Components / inputs
```

- Expanding the drawer changes **layout width only** — never elevation or background color.
- Users interact with **cards**, not with application chrome.
- Vertical spacing between drawer cards: **24–32px** (`gap-6`–`gap-8`).
- No feature-specific permanent card colors; no decorative glows.

**Page heroes (one per screen)**

| Page | Route | Visual hero |
|------|-------|-------------|
| Today | `/` | Focus card |
| Tasks | `/tasks` | Task board |
| Habits | `/habits` | Habit list / cards |
| Schedule | `/schedule` | Timeline |
| Focus | `/focus` | Active session / timer |
| Notes | `/notes` | Document editor |
| Reflection | `/reflection` | Reflection editor sections |

---

## Acceptance test

When all sessions are complete on production: every shipped page and chrome region maps to the four surface levels; left nav and Workspace Drawer stay on `--surface`; drawer modules (Notes, Reflection, Task Details) put primary content on `--card` with 24–32px gaps; Notes feels like writing on a document card; Reflection stays modular multi-card (no single outer wrap); Task Details uses section cards and a contextual title (“Task Details” / “Habit Details”); page heroes are visually obvious; no custom dark backgrounds outside tokens; `npm run build` and `npm run lint` pass.

---

## Resume protocol

| Step | Action |
|------|--------|
| 1 | **Stop** at the session stop/fail condition — do not skip to a dependent session. |
| 2 | **Record blocker** in [decision-log.md](../logs/decision-log.md): date, session #, symptom, what was tried, next action. |
| 3 | **Git:** commit WIP on the **session branch** or `git stash`. Do **not** merge to `main`. |
| 4 | **Resume** the same session number when unblocked. |
| 5 | **Respect dependencies** — see session dependency table. |

---

## Session dependency table

| Session | Depends on (must be on `main` unless same bundle) | Blocks |
|---------|---------------------------------------------------|--------|
| 1 — Drawer chrome + shared primitives | DESIGN_SYSTEM v2.0 published | 2, 3, 4 |
| 2 — Notes drawer document card | 1 | — |
| 3 — Reflection drawer modular cards | 1 | — |
| 4 — Task Details section cards | 1 | — |
| 5 — Left nav + app shell chrome audit | 1 (soft) | 6–12 soft |
| 6 — Today page + workplace modules | 1; Focus whisper lift already in tokens | — |
| 7 — Tasks page + board + Quick Schedule drawer | 1, 4 preferred | — |
| 8 — Habits page + habit cards/dialog | 1 | — |
| 9 — Schedule / Timeline page | 1 | — |
| 10 — Focus hub page | 1, 6 preferred | — |
| 11 — Notes full page | 2 preferred (shared editor patterns) | — |
| 12 — Reflection full page | 3 preferred | — |
| 13 — Cross-cutting audit (dialogs, floating notes, muted→tokens) | 6–12 | 14 |
| 14 — Docs freeze + production sign-off | 13 | — |

Sessions **2–4** may run in parallel after Session 1 (different panel files). Sessions **6–12** may run in parallel after Session 5 if file ownership does not overlap.

---

## Session plan

**Budget:** 14 sessions × 2–4 hours each (drawer bundle first; page audits next).  
**Engineering sessions:** 1–13.  
**Founder-only:** Session 14 visual sign-off (no Agent product code).

### Git workflow (required)

| Step | Rule |
|------|------|
| **Start session** | `git checkout main && git pull` → `git checkout -b m2/session-N-vds2-{short-name}` |
| **During session** | Commit on branch; `git push -u origin HEAD` (not `main`) |
| **End session** | `npm run build && npm run lint` → report merge bundle → **ask founder to approve merge to `main`** |
| **After merge** | Push `main` → production check → [july-log.md](../logs/july-log.md) |

**Merge bundles**

| Bundle | Sessions | Remind merge when |
|--------|----------|-------------------|
| B1 — Drawer architecture | 1–4 | All four verified locally |
| B2 — Shell chrome | 5 | Session 5 verified |
| B3 — Primary pages | 6–10 | Bundle complete (or ship per-page if needed) |
| B4 — Notes + Reflection pages | 11–12 | Both verified |
| B5 — Audit + freeze | 13–14 | Runbook complete |

Ad-hoc follow-ups: `tweak/vds2-{description}` from `main`.

---

## Shared implementation rules (all sessions)

| Rule | Do | Don't |
|------|----|-------|
| Surfaces | Map every bg to `--background` / `--surface` / `--card` / `--surface-hover` | New dark hexes, seven-level stacks, glows |
| Chrome | `bg-sidebar` / `surfaceChromeClass` for left nav + Workspace Drawer | Put editable content directly on chrome |
| Cards | `flow-surface-card` / `surfaceCardClass` + soft border | Feature-colored permanent card fills |
| Hover | `bg-surface-hover` / `interactiveHoverClass` temporary only | Permanent hover fills |
| Drawer gaps | `gap-6` or `gap-8` (24–32px) between cards | Tight `space-y-2` stacks of cards |
| Writing comfort | Textareas slightly lighter than card (`bg-muted/35` or inset token) | Transparent textareas that read as chrome |
| Scope | Smallest diff; match sibling patterns | Drive-by refactors, palette sweeps outside session files |
| Hero | One clear hero per page | Competing blue fills / exaggerated shadows |

**Shared drawer card primitive (introduce in Session 1):**

```ts
// Prefer exporting from surface-classes.ts or a tiny drawer helper
drawerCardClass =
  "flow-surface-card rounded-xl border border-border/50 p-4"; // or p-5
drawerCardStackClass = "flex flex-col gap-6 p-3"; // 24px; use gap-8 where airier
```

---

## Session 1 — Drawer chrome + shared card primitives

**Type:** `engineering`  
**Goal:** Lock Workspace Drawer on `--surface` at every width; add reusable drawer card stack classes; header/rail stay chrome; no elevation change on expand.  
**Time:** 2–3 hours  
**Prerequisites:** DESIGN_SYSTEM v2.0 in repo.  
**Maps to:** DESIGN_SYSTEM Workspace Drawer + Frozen Decisions  
**Merge bundle:** B1

### Current code reality

| Area | File | Behavior today |
|------|------|----------------|
| Drawer shell | `src/components/layout/global-right-sidebar.tsx` | `bg-sidebar` — correct chrome; expand animates width |
| Rail styles | `src/lib/panel-toggle-styles.ts` | Active rail often `bg-muted` not `surface-hover` |
| Surface helpers | `src/lib/theme/surface-classes.ts` | Has `surfaceChromeClass`, `surfaceCardClass`; no drawer stack helper |
| Persistence | `src/lib/global-right-sidebar-persistence.ts` | Width/expanded/panel only |

### Numbered steps

| # | Step |
|---|------|
| 1 | Confirm shell uses `surfaceChromeClass` / `bg-sidebar` only — never `bg-card` or `bg-background` for the aside. Document in a one-line comment near the aside className. |
| 2 | Verify resize/expand changes **width only** (no bg class swap). Fix if any width breakpoint changes background. |
| 3 | Add `drawerCardClass` + `drawerCardStackClass` to `surface-classes.ts` (or `workplace-panel-appearance`-style helper). Document: content on card, chrome on drawer. |
| 4 | Align rail active/hover with `bg-surface-hover` (temporary) instead of ad-hoc `bg-muted` where the rail is chrome. Keep accent for true active nav if already primary. |
| 5 | Header strip stays on chrome (`--surface`); title text only — no card behind the whole header. |
| 6 | `npm run build && npm run lint` → commit → push branch → **ask founder to approve merge to `main`**. |

### Verification

| Check | Expected |
|-------|----------|
| Collapsed rail | Same `--surface` as expanded drawer |
| Expanded + resized | Background unchanged; only width changes |
| Helpers exported | `drawerCardClass` / `drawerCardStackClass` usable by Sessions 2–4 |

**Stop/fail if:** Drawer background becomes card-colored; expand introduces a second elevation; build/lint fails.

**Rollback:** revert merge on `main` — never force-push `main`.

---

## Session 2 — Notes drawer: document card

**Type:** `engineering`  
**Goal:** Notes editor feels like writing on a document, not on chrome.  
**Time:** 3–4 hours  
**Prerequisites:** Session 1.  
**Maps to:** DESIGN_SYSTEM Notes hero + founder Notes drawer spec  
**Merge bundle:** B1

### Target hierarchy

```
Workspace Drawer (`--surface`)
└── Editor Card (`--card`)
    ├── Title
    ├── Metadata
    ├── Formatting Toolbar
    └── Markdown Editor
```

List/search chrome may stay above the card or in a slim chrome region; **editable document** must be inside `--card`.

### Current code reality

| Area | File | Behavior today |
|------|------|----------------|
| Panel | `src/components/layout/sidebar-notes-panel.tsx` | List + editor flat on sidebar bg; rows `bg-muted` |
| Editor | `src/components/notes/markdown-editor.tsx` | Toolbar + `bg-transparent` textarea |
| Cache | `src/lib/sidebar-notes-cache.ts` | Unchanged functionally |

### Numbered steps

| # | Step |
|---|------|
| 1 | Keep drawer shell on `--surface`. Do not wrap the entire panel in one outer card if list + editor both need space — wrap the **editor workspace** in `drawerCardClass`. |
| 2 | Move formatting toolbar **inside** the editor card (above the markdown body). |
| 3 | Title + metadata (date, area, pin actions as needed) live inside the same editor card. |
| 4 | Apply standard FlowOS card styling (`flow-surface-card`, soft border, radius). Card grows with drawer width (flex/min-w-0). |
| 5 | List/search: chrome or light inset rows using `hover:bg-surface-hover`; selected row temporary hover/selected token — not a permanent custom dark fill. |
| 6 | Empty state: still on chrome or a quiet empty card — do not invent a fifth surface. |
| 7 | `npm run build && npm run lint` → commit → push → **ask merge approval**. |

### Verification

| Check | Expected |
|-------|----------|
| Open Notes panel | Document reads as a card floating on chrome |
| Resize drawer | Editor card expands; chrome color unchanged |
| Toolbar | Inside card, not on bare chrome |

**Stop/fail if:** Textarea still reads as writing on sidebar; toolbar left on chrome outside the card.

---

## Session 3 — Reflection drawer: modular cards

**Type:** `engineering`  
**Goal:** Reflection stays modular and scannable — multiple cards on chrome, never one nested mega-card.  
**Time:** 3–4 hours  
**Prerequisites:** Session 1.  
**Maps to:** DESIGN_SYSTEM Reflection hero + founder Reflection drawer spec  
**Merge bundle:** B1

### Target hierarchy

```
Workspace Drawer (`--surface`)
├── Reflection Card (`--card`)
│   ├── What went well?
│   └── What went wrong?
├── Custom Entries Card (`--card`)
└── Kanban Card (`--card`)
```

### Current code reality

| Area | File | Behavior today |
|------|------|----------------|
| Panel | `src/components/layout/sidebar-reflection-panel.tsx` | `space-y-4 p-3`; mixes compact cards |
| Questions | `src/components/reflection/reflection-questions-card.tsx` | `compact` → transparent / no shadow |
| Entries | `src/components/reflection/custom-entries-section.tsx` | Full Card; may sit oddly on chrome |
| Kanban | `src/components/reflection/reflection-kanban-section.tsx` | `compact`; Add Kanban may sit on chrome |

### Numbered steps

| # | Step |
|---|------|
| 1 | **Do not** wrap the whole Reflection drawer in an outer card. |
| 2 | Stack with `drawerCardStackClass` (`gap-6` or `gap-8`). |
| 3 | Reflection questions: real `--card` (not transparent compact-on-chrome). Keep both prompts in **one** card. |
| 4 | Custom entries: own `--card`. |
| 5 | Kanban + **Add Kanban** controls: own `--card` — nothing interactive left bare on drawer bg. |
| 6 | Textarea / writing fields: slightly lighter than card (`bg-muted/35` or shared inset) for writing comfort. |
| 7 | Align full-page Reflection later in Session 12; this session may add a `variant="drawer"` prop if needed — avoid breaking `/reflection`. |
| 8 | `npm run build && npm run lint` → commit → push → **ask merge approval**. |

### Verification

| Check | Expected |
|-------|----------|
| Three distinct cards | Visible gaps 24–32px on chrome |
| Add Kanban | Inside Kanban card |
| No mega-wrap | Drawer bg still visible between cards |

**Stop/fail if:** Single outer card wraps everything; Add Kanban remains on bare chrome.

---

## Session 4 — Task Details: section cards + title

**Type:** `engineering`  
**Goal:** Details drawer is structured section cards, not one long form on chrome; title is contextual.  
**Time:** 3–4 hours  
**Prerequisites:** Session 1.  
**Maps to:** Founder Task Details drawer spec  
**Merge bundle:** B1

### Target hierarchy

```
Workspace Drawer (`--surface`)
├── Task Card (`--card`) — checkbox, title, description
├── Organization Card (`--card`) — group, priority
├── Schedule Card (`--card`) — plan, date, time, duration, alert
└── Future Cards (placeholders OK as comments only — do not build) — attachments, subtasks, dependencies
```

### Current code reality

| Area | File | Behavior today |
|------|------|----------------|
| Adapter | `src/components/layout/sidebar-details-panel.tsx` | Flat → `TaskDetailFields` |
| Fields | `src/components/tasks/task-detail-panel.tsx` | Single `space-y-3` form on chrome |
| Header | `global-right-sidebar.tsx` | Label **"Details"** |
| Habits | — | No habit details in drawer today; title string should support **"Habit Details"** when that path exists — wire title helper now even if habit edit stays dialog-only |

### Numbered steps

| # | Step |
|---|------|
| 1 | Rename drawer header: **"Task Details"** when editing a task; **"Habit Details"** when editing a habit (if no habit selection path yet, implement title helper + task path; leave habit branch ready). Update rail tooltip/label carefully — collapsed rail may stay short **"Details"** if space-constrained; expanded header uses full name. |
| 2 | Refactor `TaskDetailFields` into section cards using `drawerCardClass` + stack gap 24–32px. |
| 3 | Group fields exactly as hierarchy above. Do not leave inputs on bare drawer background. |
| 4 | Empty state: quiet message on chrome or single empty card — consistent with Session 1. |
| 5 | Preserve all existing mutations / planning state / pickers — visual regroup only. |
| 6 | `npm run build && npm run lint` → commit → push → **ask merge approval**. |

### Verification

| Check | Expected |
|-------|----------|
| Select task | Header “Task Details”; three cards scannable |
| Fields | Same data/behavior as before |
| Chrome | Visible between cards |

**Stop/fail if:** Still one continuous form on chrome; title remains generic “Details” when expanded.

---

## Session 5 — Left nav + app shell chrome audit

**Type:** `engineering`  
**Goal:** Left sidebar and app shell match v2 chrome rules; top controls merge into canvas.  
**Time:** 2–3 hours  
**Prerequisites:** Session 1 soft.  
**Maps to:** DESIGN_SYSTEM Navigation + Top bar  
**Merge bundle:** B2

### Current code reality

| Area | File | Behavior today |
|------|------|----------------|
| Shell | `src/components/app-shell.tsx` | `bg-background` outer + main |
| Left nav | `src/components/app-sidebar.tsx` | `bg-sidebar` |
| Account | `src/components/sidebar/sidebar-account-menu.tsx` | Trigger may use `bg-card` |
| Today rail | `src/components/today/today-status-rail.tsx` | On canvas (good) |
| Mobile header | `app-sidebar.tsx` | `bg-background border-b` |

### Numbered steps

| # | Step |
|---|------|
| 1 | Audit left nav: chrome only; active item uses primary accent (interaction), not a permanent bright surface. |
| 2 | Ensure main workspace remains `--background`; no accidental `bg-card` full-bleed page wrappers unless the page hero is intentionally a card (Notes/Schedule exceptions documented in later sessions). |
| 3 | Top/mobile bars: merge into canvas per DESIGN_SYSTEM (no floating `--surface` band). |
| 4 | Account menu: if trigger sits on chrome, keep quiet; menu uses elevated/popover card. |
| 5 | Replace one-off dark hexes in touched chrome files with tokens. |
| 6 | `npm run build && npm run lint` → commit → push → **ask merge approval**. |

### Verification

| Check | Expected |
|-------|----------|
| Left vs right chrome | Same recessed `--surface` family |
| Canvas | Continuous behind page content |

**Stop/fail if:** Nav brighter than cards; new top-bar seam.

---

## Session 6 — Today page + workplace modules

**Type:** `engineering`  
**Goal:** Today has one hero (Focus); modules are quiet cards on canvas; no chrome competition.  
**Time:** 3–4 hours  
**Prerequisites:** Session 1; Focus whisper lift already in tokens/DESIGN_SYSTEM.  
**Maps to:** DESIGN_SYSTEM Today → Focus hero  
**Merge bundle:** B3

### Current code reality

| Area | File | Behavior today |
|------|------|----------------|
| Page | `src/components/today/today-page-content.tsx` | Workplace layout |
| Focus | `src/components/workplace/workplace-focus-card.tsx` | `--surface-focus` whisper |
| Modules | `workplace-module-card.tsx`, tasks/habits cards | `flow-surface-card` |
| Appearance | `src/lib/workplace-panel-appearance.ts` | Panel/focus class helpers |
| Timeline edge | workplace timeline | `bg-timeline` → background |

### Numbered steps

| # | Step |
|---|------|
| 1 | Confirm Focus is the only visual hero (size/placement/type) — no blue fill, glow, or heavy shadow. |
| 2 | Audit Tasks/Habits/Quick-add modules: shared card surface; hover via `surface-hover`. |
| 3 | Status rail + NOW slot stay on canvas (not chrome bands). |
| 4 | Replace `bg-muted/*` hovers in touched workplace rows with `hover:bg-surface-hover` where equivalent. |
| 5 | Ensure no content paints directly as a second page background color. |
| 6 | `npm run build && npm run lint` → commit → push → **ask merge approval**. |

### Verification

| Check | Expected |
|-------|----------|
| First glance Today | Eye goes to Focus |
| Module cards | Consistent quiet cards |

**Stop/fail if:** Multiple competing heroes; Focus uses decorative glow/blue surface.

---

## Session 7 — Tasks page + board + Quick Schedule drawer

**Type:** `engineering`  
**Goal:** Task board is the hero; Quick Schedule drawer follows same chrome/card rules as Workspace Drawer.  
**Time:** 3–4 hours  
**Prerequisites:** Session 1; Session 4 preferred for detail consistency.  
**Maps to:** DESIGN_SYSTEM Tasks hero  
**Merge bundle:** B3

### Current code reality

| Area | File | Behavior today |
|------|------|----------------|
| Page | `src/components/tasks/tasks-page-content.tsx` | Board + optional timeline drawer |
| Board | `src/components/tasks/tasks-board-view.tsx` | Columns often `bg-muted/20` |
| Cards | `task-compact-card.tsx`, `task-row.tsx` | `bg-card` |
| Quick Schedule | `timeline-drawer.tsx` + `timeline-planner.tsx` | Left drawer; mixed `bg-sidebar` / `bg-card` |

### Numbered steps

| # | Step |
|---|------|
| 1 | Canvas = `--background`; board columns use restrained surfaces (muted inset or card — pick one pattern and apply consistently). |
| 2 | Task rows/cards = `--card`; hover temporary. |
| 3 | Quick Schedule (`timeline-drawer`): shell `--surface`; timeline content on card/canvas per DESIGN_SYSTEM Calendar/Timeline mapping — do not invent a new elevation. |
| 4 | Opening Task Details uses Session 4 section cards. |
| 5 | Strip custom dark backgrounds in touched task files. |
| 6 | `npm run build && npm run lint` → commit → push → **ask merge approval**. |

### Verification

| Check | Expected |
|-------|----------|
| `/tasks` | Board is clear hero |
| Quick Schedule open | Chrome vs content hierarchy holds |

**Stop/fail if:** Timeline drawer uses a unique background family; board unreadable.

---

## Session 8 — Habits page

**Type:** `engineering`  
**Goal:** Habits list/cards are the hero; dialogs use card/modal tokens.  
**Time:** 2–3 hours  
**Prerequisites:** Session 1.  
**Maps to:** DESIGN_SYSTEM Habits  
**Merge bundle:** B3

### Current code reality

| Area | File | Behavior today |
|------|------|----------------|
| Page | `src/components/habits/habits-page-content.tsx` | Header + list on canvas |
| Card | `src/components/habits/habit-card.tsx` | Nested `bg-card` |
| Dialog | `src/components/habits/habit-dialog.tsx` | Modal edit (not drawer) |

### Numbered steps

| # | Step |
|---|------|
| 1 | Page canvas `--background`; habit cards `--card`. |
| 2 | Reduce nested competing surfaces inside habit cards if they flatten hierarchy. |
| 3 | Dialog: `flow-surface-modal` / card tokens only. |
| 4 | If Habit Details drawer path is added later, reuse Session 4 title helper — do not build habit drawer here unless already wired. |
| 5 | `npm run build && npm run lint` → commit → push → **ask merge approval**. |

### Verification

| Check | Expected |
|-------|----------|
| `/habits` | Clear card list hero on canvas |

**Stop/fail if:** Page introduces a third background color.

---

## Session 9 — Schedule / Timeline page

**Type:** `engineering`  
**Goal:** Timeline is the single hero of Schedule.  
**Time:** 3–4 hours  
**Prerequisites:** Session 1.  
**Maps to:** DESIGN_SYSTEM Schedule → Timeline  
**Merge bundle:** B3

### Current code reality

| Area | File | Behavior today |
|------|------|----------------|
| Page | `src/components/schedule/schedule-page-content.tsx` | Fullscreen planner |
| Planner | `src/components/tasks/timeline-planner.tsx` | `variant="fullscreen"` often root `bg-card` |
| Grid | `schedule-time-grid.tsx`, blocks, sidebar | Mixed card/background |

### Numbered steps

| # | Step |
|---|------|
| 1 | Decide and document in session notes: fullscreen timeline hero may be **one** card-plane or canvas+blocks — must read as **one** hero, not chrome. Prefer aligning with DESIGN_SYSTEM “Calendar: Background canvas; events cards.” |
| 2 | Migrate fullscreen root toward canvas + event cards if current full `bg-card` root fights “workspace not dashboard.” If change is large, ship minimal: remove competing side panels’ extra elevations first. |
| 3 | Selection/drag targets use `--surface-hover` temporarily. |
| 4 | Task click opens Workspace Drawer Details (Session 4). |
| 5 | `npm run build && npm run lint` → commit → push → **ask merge approval**. |

### Verification

| Check | Expected |
|-------|----------|
| `/schedule` | Timeline dominates; chrome recessed |

**Stop/fail if:** Multiple equal-weight panels fight the timeline.

---

## Session 10 — Focus hub page

**Type:** `engineering`  
**Goal:** Focus hub’s primary visualization/session card is the hero; supporting widgets quieter.  
**Time:** 2–3 hours  
**Prerequisites:** Session 6 preferred.  
**Maps to:** DESIGN_SYSTEM Focus / Analytics-style hero  
**Merge bundle:** B3

### Current code reality

| Area | File | Behavior today |
|------|------|----------------|
| Page | `src/components/focus/focus-page-content.tsx` | Grid of Cards `bg-card/90` |
| Session | `quick-focus-session.tsx` etc. | Card heroes |
| Appearance | `focus-timer-appearance.ts` | Ring colors (keep; not surfaces) |

### Numbered steps

| # | Step |
|---|------|
| 1 | Identify one hero (active session / timer). Demote secondary cards visually via size/spacing, not new colors. |
| 2 | Normalize `bg-card/90` → `bg-card` / `flow-surface-card` unless opacity is required for overlap. |
| 3 | Insets use muted/inset tokens, not custom dark fills. |
| 4 | `npm run build && npm run lint` → commit → push → **ask merge approval**. |

### Verification

| Check | Expected |
|-------|----------|
| `/focus` | One clear hero; widgets secondary |

**Stop/fail if:** Equal-weight card grid with no hero.

---

## Session 11 — Notes full page

**Type:** `engineering`  
**Goal:** Full Notes page document is the hero; align with Session 2 editor-card patterns where shared.  
**Time:** 2–3 hours  
**Prerequisites:** Session 2 preferred.  
**Maps to:** DESIGN_SYSTEM Notes → Document  
**Merge bundle:** B4

### Current code reality

| Area | File | Behavior today |
|------|------|----------------|
| Page | `src/components/notes/notes-page-content.tsx` | Editor in `bg-card` shell |
| Sidebar | `growth-area-sidebar.tsx` | Also `bg-card` |
| Editor | `markdown-editor.tsx` | Shared with drawer |

### Numbered steps

| # | Step |
|---|------|
| 1 | Document editor remains the hero card on `--background`. |
| 2 | Growth-area sidebar: chrome **or** secondary card — must not equal the document’s visual weight (prefer quieter). |
| 3 | Reuse toolbar-inside-document patterns from Session 2 where the same editor is shared. |
| 4 | Floating notes (`note-floating-card.tsx`) stay `--card` elevated — audit only if touched. |
| 5 | `npm run build && npm run lint` → commit → push → **ask merge approval**. |

### Verification

| Check | Expected |
|-------|----------|
| `/notes` | Writing feels document-first |

**Stop/fail if:** Sidebar competes equally with the document.

---

## Session 12 — Reflection full page

**Type:** `engineering`  
**Goal:** Full Reflection page matches modular card model from Session 3.  
**Time:** 2–3 hours  
**Prerequisites:** Session 3 preferred.  
**Maps to:** DESIGN_SYSTEM Reflection → Reflection editor  
**Merge bundle:** B4

### Current code reality

| Area | File | Behavior today |
|------|------|----------------|
| Page | `src/components/reflection/reflection-page-content.tsx` | Stacked Cards |
| Shared sections | questions / entries / kanban | Same as drawer |
| History | `reflection-history.tsx` | Card rows |

### Numbered steps

| # | Step |
|---|------|
| 1 | Keep modular cards (no single page mega-wrap). |
| 2 | Apply 24–32px gaps between major section cards. |
| 3 | Writing fields slightly lighter than card. |
| 4 | History remains secondary to today’s editor hero. |
| 5 | `npm run build && npm run lint` → commit → push → **ask merge approval**. |

### Verification

| Check | Expected |
|-------|----------|
| `/reflection` | Modular, scannable, same language as drawer |

**Stop/fail if:** Page and drawer diverge into two visual systems.

---

## Session 13 — Cross-cutting audit

**Type:** `engineering`  
**Goal:** Repo-wide pass on shipped UI: every touched surface maps to four levels; kill stray dark backgrounds.  
**Time:** 3–4 hours  
**Prerequisites:** Sessions 6–12.  
**Maps to:** DESIGN_SYSTEM Acceptance Criteria  
**Merge bundle:** B5

### Numbered steps

| # | Step |
|---|------|
| 1 | Grep for raw dark hex / `oklch` backgrounds outside `globals.css` in `src/components` — eliminate or tokenize in high-traffic shipped paths. |
| 2 | Audit dialogs (`ui/dialog`), quick capture, settings modal: modal = card elevation; backdrop only. |
| 3 | Audit floating notes + notification host: elevated card, not chrome. |
| 4 | Replace remaining `hover:bg-muted` in files already touched by this runbook with `hover:bg-surface-hover` when semantically hover. |
| 5 | Confirm no fifth permanent surface introduced (Focus whisper remains Level-2 treatment). |
| 6 | Update [FEATURE_INVENTORY.md](../../foundation/FEATURE_INVENTORY.md) only if user-visible chrome labels changed (Task Details). |
| 7 | `npm run build && npm run lint` → commit → push → **ask merge approval**. |

### Verification

| Check | Expected |
|-------|----------|
| Spot-check all primary routes | Four-level mapping holds |
| Drawer resize | Still chrome-only bg |

**Stop/fail if:** New surface tokens added; acceptance criteria fail on any primary page.

---

## Session 14 — Docs freeze + production sign-off

**Type:** `founder-only`  
**Goal:** Confirm production matches v2.0 acceptance test; freeze runbook.  
**Time:** 1–2 hours  
**Prerequisites:** Session 13 on `main`.  
**Merge bundle:** B5

### Numbered steps

| # | Step |
|---|------|
| 1 | Walk production checklist below; mark pass/fail. |
| 2 | Append [july-log.md](../logs/july-log.md) with merge commits + visual notes. |
| 3 | Mark this runbook **Complete** in [runbooks/README.md](./README.md) + [execution/README.md](../README.md). |
| 4 | Do not reopen surface architecture without a new decision-log entry. |

### Production checklist

| # | Scenario | Expected | Pass |
|---|----------|----------|------|
| 1 | Left nav vs canvas | Chrome recessed; content brighter | ☐ |
| 2 | Drawer collapsed/expanded/resized | Same `--surface`; width only | ☐ |
| 3 | Notes drawer | Document card; toolbar inside | ☐ |
| 4 | Reflection drawer | 3+ modular cards; gaps 24–32px | ☐ |
| 5 | Task Details | Section cards; title “Task Details” | ☐ |
| 6 | Today | Focus is sole hero | ☐ |
| 7 | Tasks / Habits / Schedule / Focus / Notes / Reflection pages | One hero each; cards on canvas | ☐ |
| 8 | No decorative glows / accent fills as surfaces | Holds | ☐ |

**Gate:** All rows PASS before calling v2.0 implementation complete.

---

## Manual test matrix (drawer bundle B1)

Run after Sessions 1–4 merge.

| # | Scenario | Action | Expected | Pass |
|---|----------|--------|----------|------|
| 1 | Chrome stable | Expand/collapse/resize drawer | Background unchanged | ☐ |
| 2 | Notes document | Edit note in drawer | Writing on card, not chrome | ☐ |
| 3 | Reflection scan | Open Reflection panel | Distinct cards with air | ☐ |
| 4 | Task structure | Select task | Task / Organization / Schedule cards | ☐ |
| 5 | Title | Select task | Header “Task Details” | ☐ |

---

## Decision points

| # | Decision | Options | Runbook default |
|---|----------|---------|-----------------|
| 1 | Schedule fullscreen root surface | (A) Canvas + event cards (B) Keep single card-plane hero | **(A)** — matches DESIGN_SYSTEM Calendar mapping; Session 9 may phase if large |
| 2 | Collapsed rail label | (A) Keep “Details” (B) “Task” | **(A)** — expanded header carries full “Task Details” |
| 3 | Habit Details in drawer | (A) Title-ready only (B) Full habit drawer now | **(A)** — habit edit stays dialog until product asks |

Record deviations in [decision-log.md](../logs/decision-log.md).

---

## Out of scope

- Command palette, AI drawer content design beyond surface mapping
- New modules (Goals, Analytics, Whiteboard, Files)
- dnd-kit migration, monolith refactors
- Light-theme redesign
- Changing Capture → Plan → Execute → Reflect product workflow
- Global navigation IA (separate runbook: [m2-global-navigation.md](./m2-global-navigation.md))

---

## Top execution risks

| Risk | Impact | Mitigation |
|------|--------|------------|
| 1. Page audits become palette sweeps | Never closes | Touch only session file list; no repo-wide muted replace until Session 13 |
| 2. Nested cards in Reflection | Noise | Explicit “no mega-wrap” + modular hierarchy |
| 3. Schedule fullscreen change too large | Blocks B3 | Session 9 phased default (A) with minimal first pass |
| 4. Drawer/page pattern drift | Two systems | Sessions 11–12 reuse 2–3 patterns |
| 5. Scope creep into nav IA | Conflicts with nav runbook | Nav labels/icons out of scope here |

---

## Code baseline / operational gotchas

1. `--sidebar` aliases to `--surface` in dark theme — prefer `bg-sidebar` / `surfaceChromeClass` for chrome consistency with shadcn.
2. Today Focus `--surface-focus` is a **whisper** inside Level 2 — not a fifth surface level.
3. `GlobalAccessPanel` is a legacy parallel shell for standalone `TaskDetailPanel`; Workspace Drawer uses `GlobalRightSidebar` — don’t restyle the wrong shell.
4. Habit selection on timeline clears task details (`openDetails: false`) — Habit Details title may not appear until a habit drawer path exists.
5. Quick Schedule on Tasks is a **left** drawer (`timeline-drawer.tsx`), separate from Workspace Drawer — same chrome/card rules, different component.
6. Reflection `compact` prop currently strips card chrome — Session 3 must invert that for drawer.
7. Do not overwrite [DESIGN_SYSTEM_v1.md](../../foundation/DESIGN_SYSTEM_v1.md).

---

## Explicitly deferred

| Item | When / trigger |
|------|----------------|
| AI drawer conversation cards | AI module session |
| Attachments / subtasks / dependencies detail cards | Feature build |
| Habit Details full drawer editor | Product decision to move habits out of dialog |
| Light theme parity pass | Post–dark freeze |

---

## Completion checklist

| # | Criterion | Done |
|---|-----------|------|
| V2-1 | Every shipped component maps to one of four surface levels | ☐ |
| V2-2 | No custom dark backgrounds outside tokens on primary paths | ☐ |
| V2-3 | Chrome never competes with user content | ☐ |
| V2-4 | Every primary page has one identifiable hero | ☐ |
| V2-5 | Workspace Drawer supports contextual work on `--card` over `--surface` | ☐ |
| V2-6 | Notes / Reflection / Task Details match founder drawer hierarchies | ☐ |
| V2-7 | Hierarchy via layout, spacing, typography, restrained elevation | ☐ |

**Acceptance test:** Production matches the paragraph at the top of this runbook. ☐

---

## After runbook complete

1. SRAI note in [review/milestones/](../../review/milestones/) if warranted.  
2. Final [july-log.md](../logs/july-log.md) entry.  
3. Freeze this runbook — append decision-log if architecture changes later.

---

*End of runbook. Future visual work requires a new decision-log entry — do not silently unfreeze v2.0.*
