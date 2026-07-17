# Decision Log

**Status:** Living document — append new entries at top  
**Audience:** Founders, engineers, future contributors  
**Last updated:** July 17, 2026

---

## Purpose

Permanent record of **product-level** decisions with context, rationale, and rejected alternatives. Design-phase decisions remain in [../../archive/design/july-3/AUDIT_HISTORY.md](../../archive/design/july-3/AUDIT_HISTORY.md). This log covers company direction, launch strategy, and cross-cutting product choices.

---

## How to use

When making a significant product decision:

1. Add an entry using the template below  
2. Link to related design docs if applicable  
3. Do not delete entries — mark superseded decisions as such  

### Entry template                                                                                                          

```
### YYYY-MM-DD — Decision title

**Context:** Why this decision was needed  
**Decision:** What was chosen  
**Alternatives rejected:** What was not chosen and why  
**Outcome:** (fill in later if unknown)  
**Related:** Links
```

---

## 2026 decisions

### 2026-07-17 — Today Neutral Dark palette lock (founder experiment)

**Context:** After Neutral Dark token migration and Today hierarchy/shell work on `tweak/today-focus-queue-layout`, founder iterated live surface hexes until the workspace felt calm and intentional.

**Decision:** Lock production dark paints to:
- Environment (nav + canvas): `#171717`
- Cards (`--surface-base`): `#212123`
- Raised: `#29292D` (incl. Focus current-task card)
- Overlay: `#303034`
- Borders: `#3A3A3F` / `#444449`
- Timeline: canvas (`#171717`), not a separate card fill

Also: left sidebar expands in-flow (pushes content); Tasks/Habits dock stays floating, inset toward the content column.

**Alternatives rejected:** Overlay-only left expand (content never shifts); matching Timeline to card `#212123`; keeping navy v3 atmosphere.

**Outcome:** Founder approved merge of `tweak/today-focus-queue-layout` to `main` (2026-07-17 / 2026-07-18).

**Related:** [DESIGN_SYSTEM_NEUTRAL_DARK.md](../../foundation/DESIGN_SYSTEM_NEUTRAL_DARK.md) · [july-log.md](./july-log.md)

### 2026-07-16 — Neutral Dark Visual Design System (implementation)

**Context:** The navy-tinted v3.0 palette created a persistent blue atmosphere across canvas, rails, cards, and interaction states. FlowOS needs a quieter neutral workspace so indigo communicates identity and action selectively.

**Decision:** Adopt [DESIGN_SYSTEM_NEUTRAL_DARK.md](../../foundation/DESIGN_SYSTEM_NEUTRAL_DARK.md) as the active visual implementation contract. Core paints: environment `#1B1B1B`, work `#242429`, emphasis `#29292D`, floating `#303034`, hover `#343438`, identity `#586CF6`. Implement via `globals.css` tokens first, then shared primitives and workspaces. Preserve product behaviour; migrate styling only. [DESIGN_SYSTEM.md](../../foundation/DESIGN_SYSTEM.md) v3.0 remains for non-conflicting semantic/component rules and is marked superseded for palette.

**Alternatives rejected:** Keeping navy v3 paints; page-by-page hardcoded rethemes; inventing additional intermediate greys.

**Outcome:** Superseded in part by 2026-07-17 palette lock (canvas/nav `#171717`, cards `#212123`). Token architecture from this entry remains.

**Related:** [DESIGN_SYSTEM_NEUTRAL_DARK.md](../../foundation/DESIGN_SYSTEM_NEUTRAL_DARK.md) · [globals.css](../../../src/app/globals.css)

### 2026-07-14 — Timeline is a full-height canvas, not a floating card

**Context:** Today hierarchy refinement initially rounded Queue and Timeline as matching panels. With Focus / Queue / Timeline as Now / Next / When, a floating rounded Timeline reads as another widget and weakens the planning workspace.

**Decision:** Timeline is permanent workspace infrastructure — continuous time canvas under the global Today top nav (never behind/replacing it). Full height from immediately below the top nav to the app bottom. Sticky ~48px toolbar (visibility, Now, 5m/10m/15m); only the time grid scrolls. Left divider only; no card rounding. Queue stays a collapsible rounded panel.

**Alternatives rejected:** Matching rounded floating cards for Queue and Timeline; Timeline as Level-2 card chrome; Timeline spanning behind/replacing the global top bar.

**Related:** [today-page-hierarchy-refinement-spec.md](../../review/design/today-page-hierarchy-refinement-spec.md) · `workplaceTimelineEdgeClassName`

### 2026-07-14 — Next Up Queue: keyboard reorder deferred to polish follow-up

**Context:** Hierarchy refinement Session 9 allows move up/down as a11y alternative to DnD, or documented deferral.  
**Decision:** Defer keyboard reorder buttons; Escape + rail focus remain. Ship DnD reorder only for B4.  
**Alternatives rejected:** Blocking B4 on full keyboard DnD pattern.  
**Related:** [m2-today-hierarchy-refinement.md](../runbooks/m2-today-hierarchy-refinement.md) Session 9 decision point #3

### 2026-07-14 — Next Up Queue: multi-source references (hierarchy refinement)

**Context:** [today-page-hierarchy-refinement-spec.md](../../review/design/today-page-hierarchy-refinement-spec.md) §12 requires Queue items as references to `task | habit | schedule` (not duplicated payloads). Prior Next Up V2 (2026-07-10) persists a **task-only** queue on `tasks.queue_order`. Session 5 of [m2-today-hierarchy-refinement.md](../runbooks/m2-today-hierarchy-refinement.md) needs a persistence choice before coding.

**Decision:** **Hybrid (extend V2).**  
1. Keep **task** queue persistence on `tasks.queue_order` (unchanged V2 contract).  
2. Introduce a reference-shaped `QueueItem` type (`sourceType`, `sourceId`, `position`, `addedAt`) for UI/resolution; task rows map from `queue_order` at render time (titles/durations from live Task entities).  
3. **Habit** and **schedule** sources may be added in Session 6+ via additive client storage (or a later table) without replacing `queue_order` for tasks. Timeline events stay on the Timeline when queued (reference only).

**Alternatives rejected:** (A) localStorage-only for all sources (regresses durable task queue); (B) new Supabase table replacing `queue_order` in Session 5 (unnecessary migration risk); full multi-source write path in Session 5 before DnD exists.

**Outcome:** Gate cleared for Session 5 on `tweak/today-focus-queue-layout`.

**Related:** [today-page-hierarchy-refinement-spec.md](../../review/design/today-page-hierarchy-refinement-spec.md) · [m2-today-hierarchy-refinement.md](../runbooks/m2-today-hierarchy-refinement.md) · Next Up V2 2026-07-10

### 2026-07-13 — Visual Design System v3.0 migration sessions 1–4 complete

**Context:** v3.0 contract approved; runbook [design-system-v3-migration.md](../runbooks/design-system-v3-migration.md) defines phases 1–11.  
**Decision:** Implement migration in four founder-checked sessions (1–3 tokens/shell; 4–5 domain+Tasks/Habits; 6–8 Focus/Schedule/Notes/Reflection; 9–11 Today/overlays/audit). Behaviour unchanged; visual ownership via tokens, primitives, and appearance helpers.  
**Alternatives rejected:** One-shot CSS rewrite; Today-first redesign before domain recipes.  
**Outcome:** Complete on branches `m2/session-1-v3-phases-1-3` → `m2/session-4-v3-phases-9-11`. Merge to `main` pending founder approval.  
**Related:** [DESIGN_SYSTEM.md](../../foundation/DESIGN_SYSTEM.md) · FEATURE_INVENTORY design-system status.

### 2026-07-13 — Visual Design System v3.0: global semantic visual contract

**Context:** Visual Design System v2.0 established the Layer 0–5 architecture and Sessions 1–5 baseline, but it did not define a complete reusable system for typography, spacing, primitive variants, temporary UI, state distinctions, accessibility, or the full product surface. Existing implementation remains partially v2 and must not be represented as a completed v3 migration.

**Decision:** [DESIGN_SYSTEM.md](../../foundation/DESIGN_SYSTEM.md) is now Visual Design System v3.0, the sole authority for new visual work. It defines dark-only Canvas, Navigation, Base, Raised, Overlay, and Hover semantics; exact v3 surface, border, primary, text, spacing, radius, shadow, state, component, and workspace rules. [DESIGN_SYSTEM_v2.md](../../foundation/DESIGN_SYSTEM_v2.md) preserves the former frozen Sessions 1–5 contract as historical context. No product or code behaviour changes are approved by this documentation decision; a separate runbook must govern the phased implementation.

**Alternatives rejected:** Revise v2.0 in place (would erase a decision baseline); keep v2.0 and a separate parallel global system (would split authority); perform a one-shot visual rewrite without a runbook (unnecessary regression risk).

**Outcome:** v3.0 specification and [design-system-v3-migration.md](../execution/runbooks/design-system-v3-migration.md) published; code migration not started.

**Related:** [DESIGN_SYSTEM.md](../../foundation/DESIGN_SYSTEM.md) · [DESIGN_SYSTEM_v2.md](../../foundation/DESIGN_SYSTEM_v2.md) · [design-system-v3-migration.md](../execution/runbooks/design-system-v3-migration.md) · [CODE_STANDARDS.md](../../foundation/governance/CODE_STANDARDS.md)

### 2026-07-10 — Next Up V2: persistent task execution queue

**Context:** The original M2 Next Up design stored a mixed task/habit queue inside the active focus session. That made the queue disappear when a session ended and allowed planning controls into an execution surface. The founder approved V2 to make Next Up a durable, task-only expression of execution intent.

**Decision:** Next Up is an ordered list of task references stored on `tasks.queue_order`. It contains incomplete tasks scheduled for Today or unscheduled tasks only, persists independently of focus sessions, and is ordered solely by `queue_order`. Completing a task or moving it to Tomorrow/Later removes it immediately; moving it back to Today never restores it automatically. Queue UI provides only add, reorder, remove, complete, open task details, and optional start focus. The V1 session-scoped task/habit queue and its queue-specific scheduled suggestions are superseded.

**Alternatives rejected:** Retain the localStorage focus-session queue (loses execution intent between sessions); make Next Up a second task manager with planning controls; queue habits; automatically re-add tasks when they return to Today.

**Outcome:** Shipped to `main` via `tweak/recover-next-up-queue-ship` (2026-07-13).

**Related:** [next-up-queue-spec.md](../../review/design/next-up-queue-spec.md) · [m2-next-up-queue.md](../runbooks/m2-next-up-queue.md)

### 2026-07-10 — Next Up interaction and task focus attribution

**Context:** The persistent task-only queue established intent, but did not distinguish intentional immediate focus from queueing and incorrectly displayed session-wide time as task-specific focus after a target switch.

**Decision:** A task drag exposes explicit **Add to Next Up** and **Start focus** destinations. Queue drops preserve the timer and insert at the indicated position; start is intentional and never silently replaces an actively focused task. Starting a queued task removes it from the future queue. Task focus is attributed only while the quick timer is in focus mode and persisted by active-session/task totals, so pauses and breaks do not inflate it.

**Alternatives rejected:** Auto-start every drop; a queue-only drop surface with a hidden start path; local-only task timing; reintroducing habits or session-scoped queue data.

**Outcome:** Shipped to `main` via `tweak/recover-next-up-queue-ship` (2026-07-13).

### 2026-07-10 — Kanban cards on `--card`; shared soft board borders with Tasks groups

**Context:** After board-token polish, Kanban cards used `--surface-kanban-card` and looked flatter than production’s older `bg-card` units. Tasks group column borders were also stronger (`border-board` full / header `/80`) than the softened Kanban list borders.  
**Decision:** Kanban cards use standard Layer 2 `--card` with soft `border-border/30` on the `--surface-board` well. Tasks group columns and Kanban lists share outer `border-board/55` and header divider `/45`. Tasks board **rows** stay as-is (no card chrome).  
**Alternatives rejected:** Keep `--surface-kanban-card` for Kanban units; paint Tasks rows as Kanban cards; leave Tasks group borders at full opacity.  
**Outcome:** Shipped on `tweak/kanban-cards-standard-card` → `main`.  
**Related:** [DESIGN_SYSTEM.md](../../foundation/DESIGN_SYSTEM.md) · [surface-classes.ts](../../../src/lib/theme/surface-classes.ts) · [task-group-appearance.ts](../../../src/lib/task-group-appearance.ts)

### 2026-07-10 — Layer 0–5 freeze; Sessions 1–5 visual baseline

**Context:** VDS Sessions 6–14 darkened Focus (tabs on `bg-background`) and drifted from the founder-preferred Sessions 1–5 Today + navigation look. Founder rejected that lineage and needs a single hierarchy for all future UI (including Tasks).  
**Decision:** Reset `main` to Sessions **1–5** tip (`33928bb`). Freeze **Layer 0–5** in [DESIGN_SYSTEM.md](../../foundation/DESIGN_SYSTEM.md): Navigation → Workspace → Standard surfaces → Hero → Interactive → Feedback. Sessions 1–5 Today + nav are the visual source of truth. Discard Sessions 6–14 product commits and related branches.  
**Alternatives rejected:** Keep Sessions 6–14 on `main`; treat whisper Focus + deep navy as optional; continue four-token-only naming without hero/interactive/feedback layers.  
**Outcome:** `main` at Session 5 baseline + Layer 0–5 docs; later VDS page sessions treated as never shipped.  
**Related:** [DESIGN_SYSTEM.md](../../foundation/DESIGN_SYSTEM.md) · tip `33928bb`

### 2026-07-10 — Workspace Drawer: content on `--card`, chrome on `--surface`

**Context:** Notes/Reflection/Details panels put editable content directly on drawer chrome, so writing felt like editing the application frame. Expanding the drawer must not invent a new elevation.  
**Decision:** Workspace Drawer background is always `--surface`. Primary content (documents, form sections, reflection modules) lives on `--card` with 24–32px gaps. Notes = one document card (toolbar inside). Reflection = modular cards (no mega-wrap). Task Details = section cards; expanded header “Task Details” / “Habit Details”. Implementation: [m2-visual-design-v2.md](../runbooks/m2-visual-design-v2.md).  
**Alternatives rejected:** Card-colored drawer background; single outer Reflection wrap; one continuous Details form on chrome.  
**Outcome:** Principle frozen in DESIGN_SYSTEM v2.0; runbook Sessions 1–4 implement.  
**Related:** [DESIGN_SYSTEM.md](../../foundation/DESIGN_SYSTEM.md) · [m2-visual-design-v2.md](../runbooks/m2-visual-design-v2.md)

### 2026-07-10 — Visual Design System v2.0 (content-first architecture)

**Context:** v1.0 froze the four-token surface model and chrome treatment, but UI decisions still needed a broader authority — product philosophy, one-hero rule, pages vs workspace drawer, information hierarchy, and acceptance criteria. Overwriting v1 would erase why the surface model was first frozen.  
**Decision:** Keep [DESIGN_SYSTEM_v1.md](../../foundation/DESIGN_SYSTEM_v1.md) as historical context. Make [DESIGN_SYSTEM.md](../../foundation/DESIGN_SYSTEM.md) **v2.0 Frozen** the single source of truth for visual architecture. Preserve the four surface levels; document workspace architecture (pages vs drawer), one visual hero per screen, and frozen decisions / acceptance criteria. Token depths may refine in `globals.css` without a new major version while the four roles hold.  
**Alternatives rejected:** Overwrite v1 in place (loses change history); keep v1 as authority and add a parallel “architecture” doc (splits the single source of truth).  
**Outcome:** v2.0 published; v1 retained as superseded.  
**Related:** [DESIGN_SYSTEM.md](../../foundation/DESIGN_SYSTEM.md) · [DESIGN_SYSTEM_v1.md](../../foundation/DESIGN_SYSTEM_v1.md)

### 2026-07-09 — Today Focus card: subtle lift within design system

**Context:** Founder wanted Focus slightly more prominent on Today without a separate visual-hierarchy spec. A strong Focus fill shifted the page cast; pixel comparison later showed the preferred “last” Today look used deeper navy chrome (sidebar ≈ `#060A18`, canvas ≈ `#0A0F1D`), not the lighter July 8 hexes.  
**Decision:** Keep [DESIGN_SYSTEM.md](../../foundation/DESIGN_SYSTEM.md) as the single visual authority. Restore deep-navy four-token depths (sidebar recessed below canvas). Focus card may use a **whisper** `--surface-focus` lift — edit DESIGN_SYSTEM when adjusting; do not add parallel hierarchy specs.  
**Alternatives rejected:** Separate Today visual-hierarchy spec/runbook; strong Focus Surface 2 that shifts page cast; keeping lighter `#0E111B`/`#121826` chrome when founder preferred the deeper navy.  
**Outcome:** Hierarchy docs removed; deep navy chrome + subtle Focus lift live in DESIGN_SYSTEM + tokens.  
**Related:** [DESIGN_SYSTEM.md](../../foundation/DESIGN_SYSTEM.md) · [m2-surface-hierarchy.md](../runbooks/m2-surface-hierarchy.md)

### 2026-07-09 — Global navigation: Home + Workspace workflow

**Context:** FlowOS is a Capture → Plan → Execute → Reflect workflow. The M2 Session 3 five-item sidebar demoted Schedule and Notes so users had to return to Today to reach them. That conflicted with “every first-class feature is globally accessible.” The Schedule page was still labeled Timeline in the Today shortcut even though the route and metadata already say Schedule.
**Decision:** Primary sidebar uses two groups — **Home** (Today only) and **Workspace** (Tasks, Habits, Schedule, Focus, Notes, Reflection) in workflow order. Icons: LayoutDashboard, CheckSquare, Repeat, CalendarDays, Timer, BookOpen, NotebookPen. User-facing page name is Schedule (not Timeline); internal `TimelinePlanner` / Quick Schedule unchanged. Today keeps Schedule ↗ and Notes ↗ as optional shortcuts only.
**Alternatives rejected:** Keep flat five-item Productivity list; demote Schedule/Notes behind Today; use Home icon for Today; use Sparkles for Reflection; rename TimelinePlanner or Quick Schedule; add a third Review group in V1.
**Outcome:** Runbook ready — [m2-global-navigation.md](../runbooks/m2-global-navigation.md). Supersedes primary-nav demotion in [m2-founder-daily-driver.md](../runbooks/m2-founder-daily-driver.md) Session 3.
**Related:** [FEATURE_INVENTORY.md](../../foundation/FEATURE_INVENTORY.md)

### 2026-07-09 — Remove Today's note card from Today grid

**Context:** Full-density Workplace still showed a persistent "Today's note" card under Focus, competing with the Notes sidebar and leaving Focus short while Habits stayed bottom-left.  
**Decision:** Remove the Workplace daily-note card from the Today grid. Focus spans the habits row (`row-span-2`) so it fills the right column; Habits stays in the bottom-left cell. Daily notes remain via Notes sidebar / `Ctrl+Shift+D`.  
**Alternatives rejected:** Keep the card Full-density only (still clutter); move Habits up into the vacated cell (breaks the familiar Tasks-over-Habits stack).  
**Outcome:** Merged to `main` via `tweak/remove-workplace-daily-note`.  
**Related:** [FEATURE_INVENTORY.md](../../foundation/FEATURE_INVENTORY.md)

### 2026-07-08 — Four-level surface hierarchy (content first, chrome second)

**Context:** FlowOS reads as dashboard-like: the right panel uses card elevation while the left uses sidebar surface, the workspace uses a separate `--surface-page` / `--timeline-surface`, and the dark theme defines seven surface levels (L0–L6) with gradients and inner highlights. Founder documented a content-first visual language: workspace not dashboard, chrome second, four elevation tokens only.  
**Decision:** Adopt the visual design system in [DESIGN_SYSTEM.md](../../foundation/DESIGN_SYSTEM.md) as the authoritative surface model for all UI work:

- **Four tokens only:** `--background` (`#0E111B`), `--surface` (`#121826`), `--card` (`#1A2133`), `--surface-hover` (`#232D45`) — no new dark background colors without semantic reason.
- **Chrome:** Left and right sidebars both use `--surface` with `rgba(255,255,255,.05)` outer borders; no sidebar shadows.
- **Top bar:** Uses `--background`, not `--surface`; divider `rgba(255,255,255,.04)` only — no visible seam.
- **Workspace:** Main canvas uses `--background`; cards are the strongest visual objects.
- **Interaction:** Hover/selected/pressed/focus use `--surface-hover` temporarily only.
- **Shadows:** Cards `0 2px 12px rgba(0,0,0,.18)`; modals `0 12px 48px rgba(0,0,0,.35)`; sidebars and top bar none.

Implementation follows [m2-surface-hierarchy.md](../runbooks/m2-surface-hierarchy.md) in five sessions aligned with the migration plan in DESIGN_SYSTEM.md.  
**Alternatives rejected:** Keep the existing seven-level oklch “FlowOS Night” stack (too many elevations, chrome competes with content); treat the right panel as card elevation (creates asymmetry and disconnect); heavy top-bar surface (violates continuous-workspace principle).  
**Outcome:** Sessions 1–5 complete on branch `m2/session-3-continuous-chrome` (2026-07-08): canonical tokens, sidebar parity, continuous chrome, high-traffic audit, theme layer cleanup.  
**Related:** [DESIGN_SYSTEM.md](../../foundation/DESIGN_SYSTEM.md) · [m2-surface-hierarchy.md](../runbooks/m2-surface-hierarchy.md)

---

### 2026-07-07 — Schedule Break: flexible focus reminders, not Pomodoro

**Context:** Focus timer supports open-ended quick focus and a separate Pomodoro tab with optional auto-break. Founder wants to schedule *future* break reminders without turning quick focus into rigid Pomodoro cycles.  
**Decision:** Add **Schedule Break** as an optional overlay on quick focus: user sets a focus-duration threshold (“Break at”) and break length; app notifies at threshold and when break ends; **never** auto-starts break or auto-resumes focus. Immediate **Break** button and Pomodoro tab remain unchanged. One scheduled break per active session.  
**Alternatives rejected:** Merge into Pomodoro tab (conflates two mental models); auto-start break at threshold (violates flexible-focus philosophy); wall-clock “remind in N minutes” (wrong semantics — threshold is total focus duration).  
**Outcome:** Shipped on `workplace-focus-card.tsx` quick-focus tab (2026-07-08). Snooze semantics: threshold snooze adds 5 to `breakAtMinutes`; break-finished snooze **restarts a 5-minute wall-clock countdown from the snooze moment** (banks elapsed break, resets break segment). Schedule preserved when user hits immediate **Break**; default break length 10 min; max break length 180 min. Milestone presets `[25, 45, 60, 90, 120]` +30 extend per spec. **Duration picker** retained as power-user enhancement. Next Break strip: compact countdown on narrow viewports; read-only during break. OS browser notifications fire as bonus channel when tab is backgrounded (in-app cards remain primary). `/focus` hub shows strip + notifications via `FocusCurrentSessionCard`. `fable5` parity deferred — prototype route not in repo.  
**Related:** [schedule-break-modal-spec.md](../../review/design/schedule-break-modal-spec.md) · [schedule-break-implementation-review.md](../../review/focus/schedule-break-implementation-review.md)

---

### 2026-07-06 — Session 6 blocked pending Phase C decision-log approval

**Context:** Founder requested Sessions 5–6 back-to-back. Session 6 (habits interleaved into NEXT queue) is Phase C and requires approval of decision-log appendix entries #1, #3, #5 before engineering starts per [m2-today-v3-day-engine.md](../runbooks/m2-today-v3-day-engine.md) resume protocol.  
**Decision:** Session 5 completed on branch `m2/session-5-today-v3-next-queue`; Session 6 **not started** until founder approves and merges the three appendix entries into this log.  
**Alternatives rejected:** Ship Session 6 without approval (violates runbook hard gate).  
**Outcome:** Blocker recorded; resume Session 6 after approval.  
**Related:** Runbook appendix "Required decision-log entries (founder approval before Phase C)"

---

### 2026-07-06 — Focus timer controls audit (Today V3 Session 3)

**Context:** Today V3 Session 3 targeted un-gating Pause/Break/Stop per PRINCIPLES #10; FEATURE_INVENTORY still listed "Hover-gated controls — Phase 3.3 fix."  
**Decision:** Code audit of `workplace-focus-card.tsx`: both Focus-tab and Pomodoro-tab `TimerHoverControls` call sites already pass `alwaysVisible`. No code change; inventory row updated to reflect shipped state.  
**Alternatives rejected:** Delete hover-only branch in `TimerHoverControls` (dead path, no user impact).  
**Outcome:** Docs-only Session 3 on branch `m2/session-3-today-v3-focus-controls-visible`.  
**Related:** [m2-today-v3-day-engine.md](../runbooks/m2-today-v3-day-engine.md) Session 3 — **deferred separately:** `global-right-sidebar.tsx` workplace hover-reveal (`workplaceHoverMode`) is a larger IA decision, not in Session 3 scope.

---

### 2026-07-06 — Reverse: next-action visible by default (Work density)

**Context:** Today V3 runbook Session 1 — PRINCIPLES #2 requires a single clear next step on load; the 2026-07-05 decision hid next-action in default Work density. V3 §13 week-1 item 1 ships a compact one-line "Next:" strip as the NOW slot embryo.  
**Decision:** `shouldShowTodayNextAction` returns true for **Work** and **Full** density (still false for **Focus** and during active focus). KPI strip remains Full-only. Type allowlist unchanged this session (task \| habit \| reflection).  
**Alternatives rejected:** Keep next-action Full-only (violates P#2 default); widen allowlist now (deferred to Session 2).  
**Outcome:** Session 1 on branch `m2/session-1-today-v3-next-action-visible`.  
**Related:** [m2-today-v3-day-engine.md](../runbooks/m2-today-v3-day-engine.md) Session 1, [today-v3-greenfield-design.md](../../review/design/today-v3-greenfield-design.md) §13 — **supersedes** 2026-07-05 "Today next-action hidden by default (density Work)"

---

### 2026-07-05 — Today Full density: merge chrome into status rail

**Context:** Full density still used ~200px of bordered KPI + Next Action cards above the workplace after smart-coach filtering; dashboard-scale typography (`text-2xl` KPI values, full Next Action card) felt too large for a daily driver.  
**Decision:** Full density merges inline KPI chips and compact Next Action into `today-status-rail.tsx` row 2 via `today-rail-stats-row.tsx`. Separate `DashboardKpiStrip` / `DashboardNextAction` cards removed from Today. Smart coach rules unchanged.  
**Alternatives rejected:** Shrink cards in place; hide KPI strip entirely in Full.  
**Outcome:** Merged to `main` (`9685c02`).  
**Related:** [m2-today-ux-polish.md](../runbooks/m2-today-ux-polish.md) Session 4, supersedes smart-coach card layout

---

### 2026-07-05 — Today Full density: smart coach (KPI + selective Next Action)

**Context:** Full density still stacked KPI strip and Next Action on every Today load; focus-session banner duplicated the Focus module below. On-track % appeared in status rail, KPI "Today" cell, and KPI footer.  
**Decision:** Full density shows deduped KPI strip (Tasks · Habits · Focus · Reflection only — no Today cell or coaching footer). Next Action card appears only for concrete task, habit, or reflection nudges; hidden during active focus and for all focus-type recommendations ("Return to Focus", "Start Focus", etc.). Work remains default (status rail only).  
**Alternatives rejected:** Always show KPI + Next Action in Full; hide Next Action entirely in Full.  
**Outcome:** Merged to `main` (`9685c02`) — `workplace-density.ts`, `today-page-content.tsx`, `today-rail-stats-row.tsx`.  
**Related:** [m2-today-ux-polish.md](../runbooks/m2-today-ux-polish.md) Session 4, supersedes partial outcome of entry below

---

### 2026-07-05 — Today next-action hidden by default (density Work)

**Context:** Inbox (2026-07-05) — Today header felt like a dashboard stacked above the workplace; Next Action banner added chrome without daily-driver value once workplace modules show counts and focus.  
**Decision:** Default workspace density **Work**: compact status rail only; KPI strip and Next Action shown only when founder sets density **Full**. Next-action in-place handlers retained in code for Full density and future coach.  
**Alternatives rejected:** (B) collapsed one-line next-action always visible; (C) always show KPI + next-action (inbox complaint persists).  
**Outcome:** Merged to `main` (`9685c02`) — `workplace-density.ts`, `today-status-rail.tsx`.  
**Related:** [m2-today-ux-polish.md](../runbooks/m2-today-ux-polish.md), runbook decision point #1

---

### 2026-07-04 — Branch-first git workflow

**Context:** Runbook previously said push every session directly to `main`. Founder wants local testing on branches, per-session or per-bundle merges, and explicit approval before anything hits production.  
**Decision:** Add [GIT_WORKFLOW.md](../../foundation/governance/GIT_WORKFLOW.md) and Cursor rule `.cursor/rules/git-workflow.mdc`. M2 **merge bundles** B1–B5 group sessions for merge reminders; AI must ask before merge/push to `main`.  
**Alternatives rejected:** Continue push-to-main every session (no local isolation); merge without founder yes (violates production trust).  
**Outcome:** Applied July 4, 2026.  
**Related:** [m2-founder-daily-driver.md](../runbooks/m2-founder-daily-driver.md), [ENGINEERING.md](../../foundation/governance/ENGINEERING.md)

---

### 2026-07-04 — UX/UI fix inbox + july-log

**Context:** Founder needed a scratch pad for random UI/UX problems without opening a formal doc; friction-log is for measured daily dogfood, not quick ideas. Ideas should flow inbox → runbook → july-log → review.  
**Decision:** Add `docs/execution/logs/inbox.md` (one-line capture) and `docs/execution/logs/july-log.md` (monthly session memory). Wire pipeline in founder daily loop and review README.  
**Alternatives rejected:** Expand friction-log for all ideas (wrong ceremony); skip july-log and only use decision-log (loses session narrative and undocumented changes).  
**Outcome:** Applied July 4, 2026. Chronicle folder removed — single `july-log.md` in logs.  
**Related:** [inbox.md](./inbox.md), [july-log.md](./july-log.md)

---

### 2026-07-04 — Add review layer (SRAI cycle)

**Context:** Design phases 0–2 had review/audit/post-review docs buried in `archive/design/`. Execution milestones (M0–M5) had runbooks and logs but no standard place to Summarize, Review, Audit, and Improve after each milestone exit.  
**Decision:** Create `docs/review/` with SRAI cycle definition, template, design phase index (→ archive), and milestone reviews (`m0`, `m1` complete; `m2` in progress). Reviews feed decision-log and foundation updates; they do not override decision-log authority.  
**Alternatives rejected:** Fold reviews into execution/logs (mixes live logs with retrospective reports); leave only in archive (no home for M0–M5 reviews).  
**Outcome:** Applied July 4, 2026.  
**Related:** [review README.md](../../review/README.md), [milestones/](../../review/milestones/)

---

### 2026-07-04 — Foundation docs consolidated (Pass 5)

**Context:** Six active foundation files (`INFORMATION_ARCHITECTURE`, `SUCCESS_METRICS`, `USER_PERSONAS`, plus vision, inventory, architecture) overlapped with governance gates, execution runbooks, and each other. Stale M1 blockers (`/workplace` auth) remained in inventory and technical architecture.  
**Decision:** Reduce active foundation to **3 files**: `PRODUCT_VISION.md`, `FEATURE_INVENTORY.md` (includes IA section), `TECHNICAL_ARCHITECTURE.md`. Merge metric definitions into `governance/GATES.md`; merge M3 recruiting criteria into `execution/ops/recruiting-pipeline.md`. Archive full IA, metrics, and persona docs to `docs/archive/foundation/`.  
**Alternatives rejected:** Keep separate IA doc (duplicate of inventory module table); keep SUCCESS_METRICS standalone (gates already reference thresholds); delete persona profiles entirely (still useful for M3 reference).  
**Outcome:** Applied July 4, 2026. Cross-links updated in start-here guides, execution index, and document map.  
**Related:** [foundation README.md](../../foundation/README.md), [document-map.md](../../meta/document-map.md), [GATES.md](../../foundation/governance/GATES.md), [recruiting-pipeline.md](../ops/recruiting-pipeline.md)

---

### 2026-07-04 — Governance docs consolidated (Pass 4)

**Context:** Eleven governance files (`PRODUCT_PRINCIPLES`, decision frameworks, release/alpha/beta criteria, engineering framework) duplicated content and referenced pre-M1 state.  
**Decision:** Reduce active governance to **4 files**: `PRINCIPLES.md`, `GATES.md`, `QUALITY_GATES.md`, `ENGINEERING.md`. Archive CEO review, governance pass report, validation report, product strategy, philosophy, competitor analysis, risk register, and deployment readiness to `docs/archive/foundation/`. Update `GATES.md` for post-M1 reality (M1 complete, M2 in progress).  
**Alternatives rejected:** Single mega governance doc (hard to navigate); keep alpha/beta as separate files (thresholds belong with stage gates).  
**Outcome:** Applied July 4, 2026.  
**Related:** [governance README.md](../../foundation/governance/README.md), [document-map.md](../../meta/document-map.md)

---

### 2026-07-04 — FlowOS-old archived to git branch

**Context:** `FlowOS-old/` at workspace root was an undocumented duplicate repo (pre–Workplace snapshot at `9859cf6`).  
**Decision:** Preserve as `archive/flowos-old` branch on `origin`; delete local `FlowOS-old/` folder.  
**Alternatives rejected:** Zip in repo (large binary, redundant — commit already on GitHub).  
**Outcome:** Branch pushed; local folder removed in M0 Session 2.  
**Related:** WP-0.3, M0 exit criterion #4

---

### 2026-07-04 — Documentation lives inside the git repository

**Context:** The entire `docs/` tree (foundation, design, project) existed only on the founder laptop outside `flowos/` git — a disk failure would erase institutional knowledge (M0 custody gap).  
**Decision:** Copy `docs/` into the repository at `flowos/docs/`; keep git root at `flowos/` (Next.js app root) for Vercel/GitHub compatibility.  
**Alternatives rejected:** Relocate git root to workspace parent `FlowOS/` — would require reconfiguring Vercel root directory and GitHub default paths for minimal benefit.  
**Outcome:** Applied in M0 Session 1 (Ship Gate).  
**Related:** [m1-ship-gate.md](../runbooks/m1-ship-gate.md) Session 1, WP-0.1

---

### 2026-07-03 — Create foundation documentation layer

**Context:** Design history (`docs/design/`) and thesis docs (`docs/project/`) exist but no documents answer "what should the company do next?"  
**Decision:** Create `docs/foundation/` with 10 permanent product documents (vision, philosophy, inventory, IA, technical, deployment, personas, metrics, decisions, launch).  
**Alternatives rejected:** Single mega-doc (hard to maintain); duplicating design history in foundation (link instead).  
**Outcome:** Foundation layer established.  
**Related:** [foundation README.md](../../foundation/README.md)

---

### 2026-07-03 — Primary 90-day goal: product validation

**Context:** FlowOS can be pursued as thesis, portfolio, or commercial product.  
**Decision:** Validate as a **real product with early users** — retention and daily loop over thesis completeness or commercial launch.  
**Alternatives rejected:** Thesis-first (UAT only); portfolio-first (polish without users); commercial-first (premature).  
**Outcome:** Roadmap prioritizes Phase 3 and private alpha over Phase 4 polish or new modules.  
**Related:** [LAUNCH_PLAN.md](../../archive/planning/launch-plan-july-2026.md), [GATES.md](../../foundation/governance/GATES.md)

---

### 2026-07-03 — Do not deploy to production; private alpha after Phase 3.1

**Context:** Feature-complete MVP with broken daily loop and trust-breaking UI (fake Agenda).  
**Decision:** Production deployment blocked. Private alpha allowed only after Phase 3.1 MVP + auth fix + fake UI removal.  
**Alternatives rejected:** Deploy now for portfolio; public beta without Phase 3.  
**Outcome:** See [governance/GATES.md](../../foundation/governance/GATES.md).  
**Related:** [governance/GATES.md](../../foundation/governance/GATES.md)

---

### 2026-07-03 — Phase 3 remains correct next investment

**Context:** UX friction review superseded visual Phase 3 (typography). Question: is Phase 3 still right for product validation?  
**Decision:** **Yes.** Phase 3 (Effortless Daily Loop) is the minimum viable product loop — not UX polish. Ship 3.1 before recruiting external users.  
**Alternatives rejected:** Phase 4 visual polish first; Goals/AI build; onboarding before IA fix.  
**Outcome:** Pending implementation.  
**Related:** [../../archive/design/roadmap-pre-masterplan.md](../../archive/design/roadmap-pre-masterplan.md), [../../archive/design/ux-friction-review.md](../../archive/design/ux-friction-review.md)

---

### 2026-07-03 — Today/Workplace becomes home; Dashboard demoted to Overview

**Context:** Dashboard at `/` is read-only intelligence; execution at `/workplace`. Friction #1 in UX review.  
**Decision:** Merge Dashboard intelligence into Today/Workplace as default landing. Dashboard becomes optional `/overview` — not deleted.  
**Alternatives rejected:** Remove Dashboard entirely; keep `/` as Dashboard; add 9th "Today mode" nav item without merging.  
**Outcome:** Phase 3.1 scope.  
**Related:** [FEATURE_INVENTORY.md](../../foundation/FEATURE_INVENTORY.md) (IA section), [../../archive/design/AUDIT_HISTORY.md](../../archive/design/AUDIT_HISTORY.md)

---

### 2026-07-03 — Focus reframed as mode, not page

**Context:** Next-action routes active focus to `/focus` while timer runs on Workplace.  
**Decision:** Focus execution becomes a **mode on Today**; `/focus` page reserved for history and analytics only.  
**Alternatives rejected:** Move timer entirely to `/focus` page; duplicate timer on both surfaces permanently.  
**Outcome:** Phase 3.3 scope.  
**Related:** [FEATURE_INVENTORY.md](../../foundation/FEATURE_INVENTORY.md)

---

### 2026-07-03 — Stop building new modules until daily loop validated

**Context:** Goals, AI Coach, gamification, calendar sync in SRS but not built. Temptation to differentiate via features.  
**Decision:** Explicit stop list: Goals (FE-1), AI (FE-4), gamification (FE-10), calendar (FE-11), mobile (FE-9), music (FE-6), voice (FE-12). Revisit only after D7 retention > 30%.  
**Alternatives rejected:** Build Goals for differentiation; ship AI Coach for portfolio.  
**Outcome:** Active constraint.  
**Related:** [../../archive/project/03-future-enhancements.md](../../archive/project/03-future-enhancements.md)

---

### 2026-07-03 — Remove fake Agenda card before alpha

**Context:** `workplace-agenda-card.tsx` has hardcoded items and non-functional buttons. Friction #16; trust destroyer.  
**Decision:** Remove immediately or wire to real "Plan tomorrow" — not deferred to end of Phase 3.1.  
**Alternatives rejected:** Leave as visual placeholder; wait for FE-3 Manifesto build.  
**Outcome:** Pending implementation.  
**Related:** [governance/GATES.md](../../foundation/governance/GATES.md)

---

### 2026-07-03 — Alpha users: knowledge workers, not developers

**Context:** Need first users for product validation.  
**Decision:** Recruit 5–15 self-directed knowledge workers and graduate students who use 2–3 productivity apps daily. Avoid developer-evaluators and casual list-makers as primary cohort.  
**Alternatives rejected:** Developer friends (tolerate broken UX); broad public launch; students only.  
**Outcome:** See [recruiting-pipeline.md](../ops/recruiting-pipeline.md) and [USER_PERSONAS.md](../../archive/foundation/USER_PERSONAS.md).  
**Related:** [USER_PERSONAS.md](../../archive/foundation/USER_PERSONAS.md)

---

### 2026-07-03 — North star: Weekly Active Days (WAD)

**Context:** Many possible metrics for a productivity app.  
**Decision:** North star = days per week user completes meaningful action in FlowOS. Retention over feature breadth.  
**Alternatives rejected:** NPS as north star; total users; time on site; module usage parity.  
**Outcome:** See [GATES.md](../../foundation/governance/GATES.md).  
**Related:** [GATES.md](../../foundation/governance/GATES.md)

---

## Design decisions (reference only)

The following decisions are documented in detail in [../../archive/design/AUDIT_HISTORY.md](../../archive/design/AUDIT_HISTORY.md). Summarized here for product context:

| Date | Decision | Outcome |
|------|----------|---------|
| 2026-07-03 | Bug-fix-first phasing (Phase 0 tiny) | Shipped `5fc780a` |
| 2026-07-03 | SegmentedControl primitive postponed (Option A inline) | `panel-toggle-styles.ts` recipes |
| 2026-07-03 | Select primitive postponed | Three DropdownMenu selects work |
| 2026-07-03 | Badge/chip merged into Phase 2 | Shipped `9f7e7c4` |
| 2026-07-03 | Midnight Focus palette chosen | Indigo-dominant accent system |
| 2026-07-03 | UX Phase 3 supersedes visual Phase 3 | Effortless Daily Loop roadmap |
| 2026-07-03 | Contract model: review → spec → implement → post-review | Phases 0–2 exact match |

Do not duplicate full rationale here — link to AUDIT_HISTORY for design-phase detail.

---

## Related documents

- [../../archive/design/AUDIT_HISTORY.md](../../archive/design/AUDIT_HISTORY.md) — design decision rationale  
- [../../archive/design/CHANGELOG.md](../../archive/design/CHANGELOG.md) — chronological design evolution  
- [governance/PRINCIPLES.md](../../foundation/governance/PRINCIPLES.md) — principles derived from these decisions  
- [LAUNCH_PLAN.md](../../archive/planning/launch-plan-july-2026.md) — decisions applied to launch timeline  
