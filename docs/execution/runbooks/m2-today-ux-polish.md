# M2 — Today UX Polish Runbook

**Scope:** M2 only — inbox-promoted Today/workplace UX fixes (does not add M2 exit criteria).  
**Authority:** Closed scope and exit criteria remain in [execution-masterplan.md](../../strategy/execution-masterplan.md) Step 2 (M2). This runbook implements [inbox.md](../logs/inbox.md) items only; it does **not** weaken or replace M2 Sessions 1–6 in [m2-founder-daily-driver.md](./m2-founder-daily-driver.md).  
**Repo root:** repository root (Next.js app).  
**Production baseline:** https://flowos-sage.vercel.app  
**Docs path:** `docs/` (tracked in VCS)  
**Idea capture:** [inbox.md](../logs/inbox.md) → sessions below → [july-log.md](../logs/july-log.md) after merge to `main`.

**Source inbox date:** 2026-07-05 (Today chrome, menus, quick-add, P0 bugs).

---

## Acceptance test

Founder opens `/` on production after Sessions 1–4: tasks list scrolls inside its card when long; no duplicate context menus on right-click; rapid Enter task capture keeps focus; timeline task menu is slim; task details drawer has complete toggle; quick-add uses consistent icons; daily note copy and shortcuts are labeled; reflection drawer links to `/reflection`; Today header chrome is compact (no giant H1 + full KPI + next-action stack); optional workspace density presets work. `npm run build` && `npm run lint` pass on each session branch before merge ask.

---

## Resume protocol

| Step | Action |
|------|--------|
| 1 | **Stop** at the session stop/fail condition — do not skip to a dependent session. |
| 2 | **Record blocker** in [decision-log.md](../logs/decision-log.md): date, session #, symptom, what was tried, next action. |
| 3 | **Git:** commit WIP on **session branch** or `git stash`. Do **not** merge to `main`. See [GIT_WORKFLOW.md](../../foundation/governance/GIT_WORKFLOW.md). |
| 4 | **Resume** the same session number when unblocked. |
| 5 | **Respect dependencies** — Session 4 requires Sessions 1–3 on `main` (chrome builds on stable workplace). |
| 6 | **Parallel:** none — all sessions are engineering; founder approves merge only. |

---

## Session dependency table

| Session | Depends on (must be on `main`) | Blocks |
|---------|----------------------------------|--------|
| 1 — P0 bugs | M2 Sessions 1–6 (Today at `/`) | 4 |
| 2 — Menus & details | 1 (recommended; menu bus in 1) | 4 |
| 3 — Quick-add & copy | 1 | 4 |
| 4 — Today chrome & density | 1, 2, 3 | — |

Sessions 2 and 3 may run in either order after Session 1.

---

## Session plan

**Budget:** 4 sessions × 2–3 hours each.  
**Engineering sessions:** 1–4 (Agent-executable).  
**Founder-only sessions:** none.

### Git workflow (required)

Full rules: [GIT_WORKFLOW.md](../../foundation/governance/GIT_WORKFLOW.md).

| Step | Rule |
|------|------|
| **Start session** | `git checkout main && git pull` → `git checkout -b tweak/session-N-short-name` |
| **During session** | Commit on branch; `git push -u origin HEAD` (not `main`) |
| **End session** | `npm run build && npm run lint` → report merge bundle → **ask founder to approve merge to `main`** |
| **After merge** | Push `main` → CI/Vercel → manual production check → [july-log.md](../logs/july-log.md) |

**Merge bundles:**

| Bundle | Sessions | Remind merge when |
|--------|----------|-------------------|
| B1 — Bug fixes | 1 | Session 1 verified on `/` |
| B2 — Interaction | 2 | Session 2 done (B1 on `main`) |
| B3 — Capture strip | 3 | Session 3 done |
| B4 — Today chrome | 4 | Session 4 done — runbook complete |

Ad-hoc branch prefix `tweak/` (not `m2/session-N`) — same founder approval rule.

---

## Session 1 — P0 workplace bugs

**Type:** `engineering`  
**Goal:** Fix scroll, habit focus guard, context-menu stacking, and Enter refocus — no visual redesign.  
**Time:** 2 hours  
**Prerequisites:** Today at `/` (M2 Session 1 on `main`).  
**Maps to:** Inbox P0 items (2026-07-05)  
**Merge bundle:** B1

### Current code reality

| Area | File | Behavior today |
|------|------|----------------|
| Tasks scroll | `workplace-tasks-card.tsx`, `workplace-page-content.tsx` | List has `overflow-y-auto` but `row-span-2` wrapper lacks height chain — card grows over habits |
| Habits scroll | `workplace-habits-card.tsx` | Correct overflow chain (`bodyClassName`, `h-full min-h-0 flex-col`) — **copy this pattern** |
| Habit Start now | `workplace-compact-habit-row.tsx`, `timeline-planner.tsx` | Row hides focus when `completed`; context menus still offer Start now |
| Menu stacking | `task-detail-menu-coordinator.ts`, multiple menu components | Partial coordination (detail ↔ timeline); habit row + today task menus independent |
| Enter refocus | `workplace-quick-add-row.tsx` | `focus()` called while input `disabled` during save |

### Numbered steps

| # | Step |
|---|------|
| 1 | **Tasks scroll:** In `workplace-page-content.tsx`, add `h-full flex flex-col overflow-hidden` to the `row-span-2` tasks wrapper. In `workplace-tasks-card.tsx`, mirror habits: `className="min-h-0 overflow-hidden"`, `bodyClassName="flex min-h-0 flex-1 flex-col overflow-hidden"`, inner `flex h-full min-h-0 flex-col`. |
| 2 | **Habit Start now:** Add `&& !habit.completed` wherever habit context menus pass `onStartFocus` (`workplace-compact-habit-row.tsx`, `timeline-planner.tsx` habit branch ~2154). |
| 3 | **Global context-menu bus:** Extend `task-detail-menu-coordinator.ts` (or sibling `context-menu-coordinator.ts`) with `registerContextMenuCloser` + `closeAllContextMenus()`. On `document` `contextmenu` (capture), close all before opening new menu. Register: timeline (`timeline-planner.tsx`), today task menu (`workplace-page-content.tsx`), habit row menu (`workplace-compact-habit-row.tsx`). Keep `data-timeline-context-menu` selector. |
| 4 | **Enter refocus:** In `workplace-quick-add-row.tsx`, move `inputRef.current?.focus()` to `finally` after `setSaving(false)` (or `requestAnimationFrame` after enable). |
| 5 | `npm run build && npm run lint` → commit on branch → push → **ask founder to approve merge to `main`**. |

### Verification

**Commands**

```powershell
npm run build
npm run lint
git status -sb
```

**Production manual checks** (https://flowos-sage.vercel.app)

| Check | Expected |
|-------|----------|
| Many tasks in Today's Tasks | List scrolls inside card; habits card stays visible below |
| Completed habit → right-click | No "Start now" in menu |
| Menu open → right-click elsewhere | Old menu closes; only one menu visible |
| Quick-add Enter × 3 | Each task creates; cursor stays in input without extra click |

**Stop/fail if**

- Tasks card still expands over habits.
- Two context menus visible simultaneously.
- Build or lint fails.

**Rollback:** revert merge on `main` — never force-push `main`.

---

## Session 2 — Menus, task details, reflection link

**Type:** `engineering`  
**Goal:** Slim timeline task menu; add complete toggle in task details drawer; link reflection sidebar to full page.  
**Time:** 2–3 hours  
**Prerequisites:** Session 1 on `main`.  
**Maps to:** Inbox timeline menu, task details complete, reflection drawer link  
**Merge bundle:** B2

### Current code reality

| Area | File | Behavior today |
|------|------|----------------|
| Timeline task menu | `workplace-timeline-task-menu.tsx` | Up to 7 actions; delete in header |
| Today task list menu | `workplace-today-task-menu.tsx` | Full reschedule + complete + delete at bottom |
| Task details | `task-detail-panel.tsx`, `sidebar-details-panel.tsx` | Fields only — no complete toggle |
| Reflection drawer | `global-right-sidebar.tsx`, `sidebar-reflection-panel.tsx` | Header title only; no `/reflection` link |
| Daily note precedent | `workplace-daily-note-card.tsx` | `ExternalLink` in card header — reuse pattern |

### Numbered steps

| # | Step |
|---|------|
| 1 | **Timeline menu slim:** In `workplace-timeline-task-menu.tsx`, keep for incomplete: Start focus, Mark complete, Open details, Unschedule (if `scheduled_time`). **Remove** Move to tomorrow, Plan later (stay on `workplace-today-task-menu.tsx` only). Move Delete to bottom destructive row with separator; remove header trash button. Optional: icon-only row for Play + Check in header. |
| 2 | **Task details complete:** Add `onToggleComplete?: (task: Task) => void` to task detail source + `SidebarDetailsPanel`. In `TaskDetailFields`, checkbox left of title (match task row pattern); line-through when completed. Wire from `workplace-page-content` / task board actions. |
| 3 | **Reflection drawer link:** In `global-right-sidebar.tsx`, when `activePanel === "reflection"`, render header-right `Link` to `/reflection` with `ExternalLink` icon + tooltip "Open reflection page" (match daily note card). |
| 4 | `npm run build && npm run lint` → commit → push → **ask founder to approve merge to `main`**. |

### Verification

| Check | Expected |
|-------|----------|
| Timeline task right-click (incomplete) | ≤4 primary actions; no tomorrow/later; delete at bottom |
| Task list right-click | Still has tomorrow/later |
| Task details drawer | Checkbox toggles complete; list updates |
| Reflection panel header | Icon opens `/reflection` in same tab |

**Stop/fail if**

- Timeline menu regains full reschedule list.
- Complete toggle missing from details when task selected.

---

## Session 3 — Quick-add strip, icons, daily note copy

**Type:** `engineering`  
**Goal:** Shorter capture row; consistent Notes/Reflect icons; surface existing daily-note shortcut.  
**Time:** 2 hours  
**Prerequisites:** Session 1 on `main`.  
**Maps to:** Inbox quick-add, icons, daily note naming  
**Merge bundle:** B3

### Current code reality

| Area | File | Behavior today |
|------|------|----------------|
| Quick-add row | `workplace-quick-add-row.tsx` | Input + "Details…" text + Notes dropdown (`NotebookPen`) + "Reflect" text button |
| Shortcuts | `use-global-shortcuts.ts` | `Ctrl+Shift+D` → daily note; `Ctrl+Alt+N` → new note — only latter labeled in UI |
| Sidebar rail icons | `global-right-sidebar.tsx` | Notes=`BookOpen`, Reflection=`Sparkles` |
| Daily note card | `workplace-daily-note-card.tsx` | Title "Daily Note"; CTA "Create Daily Note" |

### Numbered steps

| # | Step |
|---|------|
| 1 | **Icons:** Quick-add Notes dropdown → `BookOpen`; Reflect → icon button with `Sparkles` + tooltip `Ctrl+Shift+R`. Align with sidebar rail (do not change main nav `/reflection` icon in this session unless trivial). |
| 2 | **Details control:** Replace "Details…" text with trailing suffix icon inside/beside input (`SlidersHorizontal` or `ListPlus`); tooltip `Ctrl+Shift+A`. |
| 3 | **Daily note copy:** Card title → "Today's note"; dropdown item → "Today's note" with `Ctrl+Shift+D`; empty CTA → "Create note". |
| 4 | **Row width:** Ensure icon-only actions; input keeps `flex-1 min-w-0`. No new features in dropdown. |
| 5 | `npm run build && npm run lint` → commit → push → **ask founder to approve merge to `main`**. |

### Verification

| Check | Expected |
|-------|----------|
| Quick-add row | Fits middle column without wrapping on laptop viewport |
| Notes / Reflect | Distinct icons; match sidebar rail |
| Notes dropdown | Shows `Ctrl+Shift+D` on today's note |
| Daily note card | Reads "Today's note" |

**Stop/fail if**

- Both Notes and Reflect use `NotebookPen`.
- Daily note shortcut still unlabeled in dropdown.

---

## Session 4 — Today chrome & workspace density

**Type:** `engineering`  
**Goal:** Replace heavy header stack with compact status rail; hide next-action by default; add density presets.  
**Time:** 3 hours  
**Prerequisites:** Sessions 1–3 on `main`.  
**Maps to:** Inbox Today chrome, Next Action, workspace density  
**Merge bundle:** B4

### Current code reality

| Area | File | Behavior today |
|------|------|----------------|
| Today header stack | `today-page-content.tsx` | `DashboardCommandHeader` + `DashboardKpiStrip` + escape links + `DashboardNextAction` |
| Module visibility | `workplace-module-visibility.ts` | Per-module `always` \| `hover` in localStorage |
| Next-action logic | `dashboard-command.ts`, `today-page-content.tsx` | In-place actions wired — keep logic, change default visibility |

### Numbered steps

| # | Step |
|---|------|
| 1 | **Compact status rail:** New component (e.g. `today-status-rail.tsx`): one row — date · on-track % · Timeline ↗ · Notes ↗. Remove greeting + H1 "Today" + full KPI strip from default Today view. Drop duplicate counts (module titles already show tasks/habits). |
| 2 | **Next Action:** Hide `DashboardNextAction` by default on Today (localStorage flag or extend visibility system). Keep KPI cell / scroll handlers using existing `getNextActionRecommendation` — do not delete lib code. |
| 3 | **Workspace density presets:** Extend visibility storage (e.g. `workplace-density.ts`): `full` \| `work` \| `focus`. Work: hide KPI/next-action/daily-note modules. Focus: focus card + active item + timeline only. One control in status rail; per-module eye overrides still apply. |
| 4 | **Decision log:** If default-next-action-hidden is a product choice, append one line to [decision-log.md](../logs/decision-log.md). |
| 5 | `npm run build && npm run lint` → commit → push → **ask founder to approve merge to `main`**. |

### Verification

| Check | Expected |
|-------|----------|
| Today `/` load | Status rail ~one row; workplace grid visible without scrolling past chrome |
| Next Action | Not shown by default; can re-enable via density or future toggle |
| Density Work | KPI strip / next-action hidden; tasks/habits/focus/timeline remain |
| Density Focus | Minimal modules per preset spec |
| M2 routing | Next-action in-place handlers still work if banner re-shown |

**Stop/fail if**

- Today page loses workplace execution surface.
- Next-action CTAs navigate away from `/` (regression vs M2 Session 2).

---

## Manual test matrix

Run on **production** after Session 4.

| # | Scenario | Setup | Action | Expected | Pass |
|---|----------|-------|--------|----------|------|
| 1 | Tasks scroll | 10+ tasks today | Scroll tasks list | Habits card visible; list scrolls internally | ☐ |
| 2 | Menu handoff | Open timeline menu | Right-click task list row | Single menu only | ☐ |
| 3 | Rapid capture | Empty input | Enter × 3 task titles | 3 tasks; focus never lost | ☐ |
| 4 | Timeline menu | Scheduled incomplete task | Right-click block | Focus, complete, details, unschedule; no tomorrow/later | ☐ |
| 5 | Details complete | Task open in drawer | Toggle checkbox | Task completes on board | ☐ |
| 6 | Reflection escape | Reflection panel open | Click header link | Navigates to `/reflection` | ☐ |
| 7 | Chrome | Default density | Load `/` | Compact rail; no giant Today + KPI stack | ☐ |

**Gate:** All applicable rows **PASS** before marking runbook complete.

---

## Decision points

| # | Decision | Options | Runbook default |
|---|----------|---------|-----------------|
| 1 | Next Action default | (A) Hidden (B) Collapsed one-line (C) Always visible | **(A)** — inbox 2026-07-05; logic retained for coach later |
| 2 | Timeline menu actions | (A) Slim 4-item (B) Icon toolbar (C) Keep all | **(A)** — Session 2 |
| 3 | Density presets | (A) Ship in Session 4 (B) Defer to follow-up tweak | **(A)** — inbox scoped |

Record founder override in [decision-log.md](../logs/decision-log.md).

---

## Out of scope

- First-run Daily Loop onboarding coach (defer until after density ships)
- `/overview` page or new modules
- Command palette, dnd-kit migration, monolith refactors
- Main nav icon change for `/reflection` (optional; not required for acceptance)
- New strategy docs except decision-log / july-log entries

---

## Top execution risks

| Risk | Impact | Mitigation |
|------|--------|------------|
| Session 4 breaks M2 "next-action on Today" | Exit criterion regression | Hide UI only; keep in-place handlers + tests |
| Context-menu bus misses a menu type | Stacked menus persist | Register all four menu owners in Session 1 |
| Chrome session too large | Session 4 slips | Ship Sessions 1–3 as B1–B3 independently |
| Icon churn confuses founder | Low trust in UI | Match sidebar rail; document in july-log |

---

## Code baseline / operational gotchas

1. **Habits card is the scroll reference implementation** — copy `bodyClassName` + `h-full min-h-0` chain to tasks, not the reverse.
2. **`task-detail-menu-coordinator.ts` already closes timeline menu when task detail menu opens** — extend, do not duplicate.
3. **`Ctrl+Shift+D` for daily note already exists** in `use-global-shortcuts.ts` — Session 3 is labeling + copy, not new shortcut logic.
4. **M2 Session 2 routing truth** — any next-action or KPI handler must stay in-place on `/`; Session 4 hides chrome, must not restore `/tasks` href escapes.
5. **Branch prefix `tweak/`** for this runbook — not `m2/session-N` (those belong to founder daily driver runbook).

---

## Explicitly deferred (not this runbook)

| Item | When / trigger |
|------|----------------|
| Daily Loop first-run coach | After Session 4 + 7 days dogfood |
| Main nav Reflection icon = Sparkles | Optional consistency pass |
| Friction-log metrics for menu count | M2 Session 8 dogfooding |

---

## Completion checklist

| # | Criterion | Session | Done |
|---|-----------|---------|------|
| R1 | P0 bugs fixed (scroll, habit menu, menu bus, Enter refocus) | 1 | ☑ `main` via B1 |
| R2 | Timeline menu slim; details complete; reflection link | 2 | ☑ `main` via B2 |
| R3 | Quick-add icons + daily note copy/shortcuts | 3 | ☑ `main` via B3 |
| R4 | Compact status rail + hidden next-action + density presets | 4 | ☑ `main` `9685c02` |
| R5 | Manual test matrix all PASS on production | 4 | ☐ founder sign-off |
| R6 | [inbox.md](../logs/inbox.md) items moved to Done; [july-log.md](../logs/july-log.md) updated | 4 | ☑ |

**Acceptance test:** Founder daily driver on `/` feels like a workplace, not a dashboard stacked above a workplace. ☐ pending production sign-off after B4

---

## After runbook complete

1. Move inbox lines to **Done** in [inbox.md](../logs/inbox.md) with commit refs.  
2. Append [july-log.md](../logs/july-log.md) with session summary and production URL check.  
3. Continue M2 Session 7–8 (recruiting + dogfooding) per [m2-founder-daily-driver.md](./m2-founder-daily-driver.md).  
4. Do not rewrite this runbook — append decision-log if scope changed mid-flight.

---

*End of runbook. M3 waits on M2 exit criteria — this runbook supports dogfood quality only.*
