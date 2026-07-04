# M2 Founder Daily Driver Runbook

**Scope:** M2 only — Founder Daily Driver (weeks 2–4).  
**Authority:** Exit criteria and closed scope list in `FLOWOS_EXECUTION_MASTERPLAN.md` Step 2 (M2). This runbook does not add, remove, defer, or weaken any M2 exit criterion.  
**Repo root for all commands:** `flowos/` (the git repository).  
**Production baseline (Ship Gate complete):** https://flowos-sage.vercel.app  
**Docs path:** `flowos/docs/` (tracked in VCS since M0).

---

## Acceptance test

**Founder on production:** zero clicks to execution surface; open → first meaningful action **< 5s** (self-timed); every next-action stays on Today; full loop ≥ 5 days/week on hosted FlowOS; ≥ 3 recruiting candidates in pipeline.

After Sessions 1–6 ship and Sessions 7–8 run, all four M2 exit criteria in the completion checklist must pass.

---

## Resume protocol

Use this whenever a session is blocked mid-way (env failure, ambiguous product decision, production regression).

| Step | Action |
|------|--------|
| 1 | **Stop** at the session's stop/fail condition — do not skip ahead to a dependent session. |
| 2 | **Record blocker** in `docs/foundation/DECISION_LOG.md`: date, session #, WP id, symptom, what was tried, next action. |
| 3 | **Git state:** if changes were committed but not pushed, leave them on `main`. If uncommitted WIP breaks build, `git stash` with message `M2 Session N blocked: <reason>` or revert locally — do not push red builds. |
| 4 | **Resume at the same session number** when unblocked (e.g. Session 4 blocked → fix → resume Session 4). Dependencies are strict: Session 2 requires Session 1 merged on production; Session 4 requires Session 1; etc. |
| 5 | **Do not skip dependencies.** Example: Session 4 blocked on focus UI → note blocker → resume Session 4; do **not** jump to Session 5 inline capture. |
| 6 | **Parallel exception:** Session 7 (recruiting) may run alongside engineering Sessions 1–6 — it does not unblock or replace a blocked engineering session. Session 8 (dogfooding) starts after Session 1 lands on production but continues through M3. |

---

## Session plan

**Budget:** 8 sessions × 2–4 hours. Engineering Sessions 1–6 are Agent-executable. Sessions 7–8 are founder-only (templates below — no Agent code).

**Deploy cadence (every engineering session):** local `npm run build` + `npm run lint` → `git commit` → `git push origin main` → wait for CI green → confirm Vercel production deploy → **manual verification on https://flowos-sage.vercel.app** (not localhost-only).

---

### Session 1 — Home merge (`/` = Today)

**Goal:** `/` renders Today (Workplace execution surface + inline KPI strip + next-action card); user-facing label **"Today"**; `/workplace` redirects to `/`.  
**Time:** 3–4 hours  
**Prerequisites:** M1 Ship Gate complete (CI green, production URL live, RLS pass).  
**Maps to:** WP-2.1 + M2 exit criterion #1 (zero clicks to execution surface)

#### Current code reality (baseline)

| Route | File | Renders today |
|-------|------|---------------|
| `/` | `src/app/(main)/page.tsx` | `DashboardPageContent` — KPI cards, **not** Workplace timeline/focus |
| `/workplace` | `src/app/(main)/workplace/page.tsx` | `WorkplacePageContent` — real execution surface (`WorkplaceFocusCard`, `TimelinePlanner`, task/habit cards) |

Sidebar (`src/config/sidebar-navigation.tsx`) still lists **Dashboard** at `/` and **Workplace** at `/workplace`.

#### Numbered steps

| # | Step |
|---|------|
| 1 | Create a composed Today page component (recommended: `src/components/today/today-page-content.tsx`) that wraps **Workplace layout** plus dashboard intelligence. Reuse — do not duplicate monolith internals: |
|   | - Execution: export/reuse `WorkplacePageContent` from `src/components/workplace/workplace-page-content.tsx` (692 lines — compose, do not fork `TimelinePlanner` / `tasks-board-view` logic). |
|   | - KPI strip: reuse `DashboardKpiStrip` from `src/components/dashboard/dashboard-kpi-strip.tsx` + `computeOnTrackStatus` from `src/lib/dashboard-command.ts`. |
|   | - Next action: reuse `DashboardNextAction` from `src/components/dashboard/dashboard-next-action.tsx` + `getNextActionRecommendation` from `src/lib/dashboard-command.ts`. |
|   | - Data: merge `fetchWorkplaceData()` (`src/lib/workplace-data.ts`) and dashboard progress fields (`fetchDashboardData()` in `src/lib/dashboard.ts`, or inline the same fetches — tasks, habits, focus seconds, reflection). |
| 2 | Replace `src/app/(main)/page.tsx` to render Today content. Apply the **same full-height wrapper** currently on `workplace/page.tsx` (negative margins + `h-[calc(100dvh-3rem)]`) so the embedded timeline layout is unchanged. |
| 3 | Add page title **"Today"** — replace `DashboardCommandHeader`'s hardcoded `"Dashboard"` (`src/components/dashboard/dashboard-command-header.tsx` line 21) with a prop or a Today-specific header. Remove "Command center" framing if visible. |
| 4 | **Redirect `/workplace` → `/`:** either (A) replace `src/app/(main)/workplace/page.tsx` with `redirect("/")` from `next/navigation`, or (B) add middleware redirect (prefer page-level redirect to keep middleware minimal). Update `metadata.title` on `/` to `"Today"`. |
| 5 | Update `src/contexts/global-right-sidebar-context.tsx` line 98: `workplaceHoverMode` must be true on **`/`** (Today), not only `/workplace`. Change to `pathname === "/" \|\| pathname === "/workplace"` until redirect is verified, then `pathname === "/"` only. |
| 6 | Search for hardcoded `/workplace` links that should land on Today (e.g. `src/components/focus/focus-current-session-card.tsx` line 103 `href="/workplace"`) — update to `/`. |
| 7 | Do **not** change routing hrefs in `dashboard-command.ts` yet (Session 2). Do **not** reduce sidebar yet (Session 3). |
| 8 | `npm run build` && `npm run lint` → commit → push → verify production. |

#### Verification

**Commands**

```powershell
cd flowos
npm run build
npm run lint
git status -sb   # clean after commit
```

**Production manual checks (https://flowos-sage.vercel.app)**

| Check | Expected |
|-------|----------|
| Log in → default landing | URL is `/`; Workplace-style layout visible (focus card, tasks column, timeline on right) — **not** the old Dashboard-only grid |
| Page heading | User-facing label reads **"Today"** (not "Dashboard" / "Workplace") |
| KPI strip | Visible inline above or beside execution content (tasks/habits/focus/reflection counts) |
| Next-action card | Visible with a computed recommendation |
| `/workplace` | Redirects to `/` (307/308 or client navigation — final URL `/`) |
| Zero extra clicks | From login redirect, founder is already on execution surface (no sidebar click required) |

**Stop/fail if**

- `/` still shows old `DashboardPageContent` only (no timeline/focus execution layout).
- `/workplace` still renders a separate page without redirect.
- Build or CI fails.
- Full-height Workplace layout broken (timeline clipped, scroll broken).

**Rollback:** `git revert HEAD` before push; if already deployed, revert commit and push — Vercel rolls back. Do not force-push `main`.

---

### Session 2 — Routing truth (stay on Today)

**Goal:** Every next-action and scheduled-item action from `dashboard-command.ts` / schedule libs acts **in place** on Today (scroll, highlight, start timer) — **never** navigates to `/focus`, `/tasks`, `/habits`, `/reflection` list pages from Today CTAs.  
**Time:** 3–4 hours  
**Prerequisites:** Session 1 on production.  
**Maps to:** WP-2.2 + M2 exit criterion #2 (every next-action stays on Today)

#### Files that currently navigate away (must fix)

| File | Lines / symbol | Current behavior |
|------|----------------|------------------|
| `src/lib/dashboard-command.ts` | `getNextActionRecommendation` | `href: "/focus"`, `"/tasks"`, `"/habits"`, `"/reflection"` |
| `src/lib/schedule.ts` | `buildScheduleItems` | `href: "/tasks"`, `"/habits"` on each item |
| `src/lib/schedule-utils.ts` | `buildFocusScheduleItem` | `href: "/focus"` |
| `src/components/dashboard/dashboard-next-action.tsx` | `Link href={action.href}` | Always client-navigates |
| `src/components/dashboard/dashboard-kpi-strip.tsx` | `KpiCell` hrefs | Links to `/tasks`, `/habits`, `/focus`, `/reflection` |
| `src/components/dashboard/dashboard-schedule-preview.tsx` | `href="/schedule"` | Panel link (demote OK; timeline on Today is primary) |

#### Numbered steps

| # | Step |
|---|------|
| 1 | Extend `NextAction` in `src/lib/dashboard-command.ts`: add optional `inPlaceAction` discriminant (`scroll-to-task`, `scroll-to-habit`, `start-focus`, `open-reflection-inline`, `complete-task`, `complete-habit`) + `entityId`. Keep `href` as fallback for non-Today contexts only — Today page must not use outbound module hrefs. |
| 2 | Update `getNextActionRecommendation` so all branches return in-place actions when used on Today (remove `/focus`, `/tasks`, `/habits`, `/reflection` as primary CTAs). |
| 3 | Update `buildScheduleItems` in `src/lib/schedule.ts`: replace module hrefs with stable anchor ids (e.g. `#today-task-{id}`, `#today-habit-{id}`) or null href + entity metadata consumed by Today handlers. |
| 4 | Update `buildFocusScheduleItem` in `src/lib/schedule-utils.ts`: in-place focus continuation, not `/focus`. |
| 5 | Refactor `DashboardNextAction` to accept `onAction?: (action: NextAction) => void`. When `onAction` provided, primary CTA is a **Button** (no `Link`). Wire on Today page. |
| 6 | Add scroll/highlight targets on Today: `id` attributes on `WorkplaceTasksCard` rows (`workplace-compact-task-row.tsx`), `WorkplaceHabitsCard` rows (`workplace-compact-habit-row.tsx`), `WorkplaceFocusCard` container. Implement `scrollIntoView` + brief highlight class. |
| 7 | Wire focus next-actions to `useFocusSessionContext()` (`src/contexts/focus-session-context.tsx`) / `WorkplaceFocusCard` start handlers — start or resume timer without route change. |
| 8 | Wire reflection next-action to `openReflection()` from `useGlobalRightSidebar()` (already used in `workplace-quick-add-row.tsx`) — opens reflection in sidebar, stays on `/`. |
| 9 | Update `DashboardKpiStrip` on Today: remove outbound `href`s from KPI cells OR replace with in-place scroll (tasks/habits sections on Today). "Open full timeline" link to `/schedule` is allowed as **secondary** demoted access (Session 3). |
| 10 | Run the **Manual test matrix** (below) on production. Commit only when all rows pass. |

#### Verification

**Commands:** `npm run build`, `npm run lint`, push, CI green.

**Production:** Execute full **Manual test matrix** on https://flowos-sage.vercel.app — every row **PASS**.

**Stop/fail if**

- Any next-action primary CTA changes URL pathname away from `/`.
- Scheduled-item click from next-action or timeline escapes Today.
- Manual test matrix has any **FAIL**.

**Rollback:** Revert Session 2 commit; re-deploy prior production.

---

### Session 3 — Nav reduction (5 items)

**Goal:** Sidebar reduced to **5 items:** Today, Tasks, Habits, Focus (history), Reflection. Schedule and Notes remain routes but demoted — reachable from Today ("Open full timeline") and secondary links. Dashboard nav item removed. No `/overview` page.  
**Time:** 2–3 hours  
**Prerequisites:** Session 1 on production (Today at `/`). Session 2 recommended complete (KPI strip in-place behavior).  
**Maps to:** WP-2.3 + M2 scope item #6

#### Numbered steps

| # | Step |
|---|------|
| 1 | Edit `src/config/sidebar-navigation.tsx`: replace `sidebarSections` with a **single flat section** (or one "Productivity" group) containing exactly: |
|   | - **Today** → `/` (icon: `LayoutTemplate` or calendar-day icon — not `LayoutDashboard`) |
|   | - **Tasks** → `/tasks` |
|   | - **Habits** → `/habits` |
|   | - **Focus** → `/focus` (history/analytics — label may clarify "Focus history" in tooltip only; sidebar label stays "Focus") |
|   | - **Reflection** → `/reflection` |
|   | Remove: Dashboard, Workplace, Schedule, Notes from primary nav. |
| 2 | Add **demoted secondary links on Today** (footer of KPI strip or below timeline header): |
|   | - `"Open full timeline"` → `/schedule` |
|   | - `"Notes"` → `/notes` |
|   | Use text links — not sidebar items. Placement decision → see Decision points if blocked. |
| 3 | Verify `src/components/app-sidebar.tsx` `isNavItemActive` (line 25–27): `/` active only on exact `/`. |
| 4 | Grep for stale nav copy: `git grep -i "Dashboard\|Workplace" src/config src/components/app-sidebar.tsx` — update user-facing strings on Today only; module pages keep their own titles. |
| 5 | Build, lint, commit, push, verify production sidebar shows **5 items** only. |

#### Verification

**Production manual checks**

| Check | Expected |
|-------|----------|
| Sidebar count | Exactly 5 primary items; no Dashboard, Workplace, Schedule, Notes |
| Today link | Points to `/`, active on Today |
| `/schedule`, `/notes` | Still reachable via direct URL and Today demoted links |
| `/overview` | Does not exist (404) — do not create |

**Stop/fail if**

- More than 5 primary sidebar items.
- Schedule or Notes removed as routes entirely.
- `/overview` page added.

**Rollback:** Revert `sidebar-navigation.tsx` and Today demoted-link commit.

---

### Session 4 — Visible focus controls

**Goal:** Timer controls always visible during an active session; one-click **start focus on this task** from task row / next-action.  
**Time:** 2–4 hours  
**Prerequisites:** Session 1 (Today hosts `WorkplaceFocusCard`). Session 2 (next-action focus branch starts in place).  
**Maps to:** WP-2.4 + M2 scope item #3

#### Current code reality

`src/components/workplace/workplace-focus-card.tsx`:

- `TimerHoverControls` (lines 55–60) hides pause/stop behind `group-hover/timer` opacity.
- `TaskFocusRow` uses `showStartOnHover` (line 153) — start button hover-gated.
- File is ~868 lines — **surgical edits only**; do not split monolith in M2.

#### Numbered steps

| # | Step |
|---|------|
| 1 | When `useFocusSessionContext().activeSession` is non-null (or quick/pomodoro active), render timer controls **always visible** — remove or bypass `TimerHoverControls` opacity/hover gate for active sessions. Keep hover polish optional for **idle** state only. |
| 2 | Add always-visible **Start focus** affordance on primary task row in focus card and/or `workplace-compact-task-row.tsx` — one click calls existing start handlers (`useWorkplaceFocusTask`, `prepareFocusTarget` + `quick.startFocus` / pomodoro start). No navigation. |
| 3 | Ensure Session 2 next-action type `"focus"` triggers the same start path (not link to `/focus`). |
| 4 | Manual prod test: start focus from next-action → controls visible without hover; pause/resume/stop visible while session active. |
| 5 | Build, lint, commit, push, verify on production. |

#### Verification

**Production manual checks**

| Check | Expected |
|-------|----------|
| Active session | Pause / stop / resume visible **without** hovering timer |
| Idle state | One-click start on a today task from focus card or next-action |
| URL | Stays `/` throughout |

**Stop/fail if**

- Active-session controls still hover-gated.
- Starting focus navigates to `/focus`.

**Rollback:** Revert focus-card commit.

---

### Session 5 — Inline capture bar (tasks only)

**Goal:** Inline capture bar on Today: type → **Enter** creates task; modal capture demoted to secondary. **Tasks only** — no note/habit prefixes in M2.  
**Time:** 2–4 hours  
**Prerequisites:** Session 1 (Today page hosts quick-add area).  
**Maps to:** WP-2.5 + M2 scope item #4

#### Current code reality

| File | Behavior today |
|------|----------------|
| `src/components/workplace/workplace-quick-add-card.tsx` | Hover-reveal chrome; delegates to row |
| `src/components/workplace/workplace-quick-add-row.tsx` | **Buttons only** — "Task" calls `onNewTask` → `requestQuickCapture()` → opens modal |
| `src/components/layout/quick-capture-dialog.tsx` | Full modal task create (`createTask` from `src/lib/tasks.ts`) |
| `src/hooks/use-global-shortcuts.ts` | `Ctrl+Shift+A` opens modal via `requestQuickCapture()` |

#### Numbered steps

| # | Step |
|---|------|
| 1 | Replace or augment `WorkplaceQuickAddRow` with a single **text input** (placeholder e.g. "Add a task…") visible by default (`workplace-module-visibility` for quick-add → prefer `"always"` as default on Today). |
| 2 | On **Enter**: call `createTask()` with title = input value, default group = inbox/today per existing quick-capture dialog logic (read `quick-capture-dialog.tsx` submit handler — reuse group selection defaults, do not duplicate RPC details). |
| 3 | On success: `notifyWorkplaceTaskCreated(task)` from `useGlobalRightSidebar()` so Today board updates (same hook modal uses). Clear input. |
| 4 | Demote modal: keep `QuickCaptureDialog` for **secondary** access — small "Details…" link or keep `Ctrl+Shift+A` / Task button opening modal for description/priority/scheduling. Primary path = inline Enter. |
| 5 | **Do not** add note/habit/reflection inline prefixes (masterplan NOT-allowed scope creep). |
| 6 | Remove hover-only gate as default for capture bar on Today (align with M2 friction #7). |
| 7 | Build, lint, commit, push. Production: type task title → Enter → task appears on Today board without modal. |

#### Verification

**Production manual checks**

| Check | Expected |
|-------|----------|
| Inline Enter | New task appears on Today without modal |
| Modal | Still reachable as secondary (shortcut or link) for extended fields |
| Scope | No inline note/habit capture added |

**Stop/fail if**

- Capture still modal-only for basic task create.
- Inline capture adds note/habit types.

**Rollback:** Revert quick-add commit; modal path still works.

---

### Session 6 — Error/loading boundaries on `(main)`

**Goal:** `error.tsx` + `loading.tsx` on the `(main)` route group — alpha trust when Supabase hiccups.  
**Time:** 1–2 hours  
**Prerequisites:** None blocking (can run after Session 1). Recommended after Sessions 1–5 to avoid re-testing boundaries after layout churn.  
**Maps to:** WP-2.6 + M2 scope item #5

#### Current code reality

No `error.tsx` or `loading.tsx` under `src/app/(main)/` (verified — App Router uses inline loading in page components only).

#### Numbered steps

| # | Step |
|---|------|
| 1 | Create `src/app/(main)/loading.tsx`: App Shell–compatible skeleton (match `AppShell` padding; simple pulse blocks — do not import heavy page data). |
| 2 | Create `src/app/(main)/error.tsx`: client component (`"use client"`) with reset button calling `reset()`, user-safe message, link back to `/` (Today). Match existing `ErrorBanner` tone from `src/components/shared/error-banner.tsx`. |
| 3 | Do **not** add boundaries to every nested route — `(main)` group level only per masterplan. |
| 4 | Build, lint, commit, push. |
| 5 | Optional prod smoke: temporarily disconnect network in DevTools during navigation — error boundary renders instead of white screen. |

#### Verification

**Commands:** `npm run build`, `npm run lint`.

**Production:** Navigate between Today / Tasks / Habits — brief loading skeleton may flash; no layout explosion. Forced error test optional in DevTools.

**Stop/fail if**

- Boundaries break `AppShell` layout (double sidebars, missing auth).
- Build fails.

**Rollback:** Delete the two new files via revert.

---

### Session 7 — Recruiting pipeline start (FOUNDER — no Agent code)

**Goal:** Build recruiting pipeline so M3 is not blocked — ≥ 3 alpha candidates committed by M2 exit; target 5 commitments.  
**Time:** 2–4 hours initial + 2–4 h/week ongoing  
**Prerequisites:** Session 1 on production (honest demo URL). **Run in parallel with Sessions 1–6** (masterplan: start week 2).  
**Maps to:** WP-2.8 + M2 exit criterion #4 (≥ 3 candidates in pipeline)

#### Checklist (founder executes)

- [ ] **15-name list** — knowledge workers who already use 2+ productivity apps; **not** developer friends (per `USER_PERSONAS.md` anti-personas).
- [ ] **Persona fit column** — for each name: role, current tools, why they'd switch, warm intro path.
- [ ] **Outreach template** (copy/paste — personalize first line):

```
Subject: Trying a daily productivity experiment (10 min?)

Hi [Name],

I'm building FlowOS — one screen for today's tasks, habits, focus, and reflection.
I use it daily myself at https://flowos-sage.vercel.app and I'm looking for [3–5] people
who already juggle 2+ productivity apps to try it for two weeks.

No pitch deck — I'd watch you use it for 10 minutes on a quick call, then check in on day 3 and day 7.
Desktop web only for now; single-device-primary (honest limitation).

Worth a short call this week or next?

— [Founder name]
```

- [ ] **Track pipeline** in a simple sheet: Name | Contacted | Reply | Call scheduled | Committed (Y/N) | Start date
- [ ] **Onboarding call script outline** (day 0):
  1. Founder says little for first **10 minutes** — watch screen share.
  2. Note: first navigation, first task, first focus attempt, first confusion.
  3. Minute 10–15: answer questions; set day-3 async check-in.
  4. State limitation: desktop-web, single-device-primary until fix ships.
  5. Send feedback template (below) after call.
- [ ] **Feedback template** (async, day 3 / day 7):
  - What did you try to do first?
  - Where did you stall?
  - What did you use outside FlowOS because FlowOS failed?
  - Would you open this tomorrow unprompted? Why / why not?
  - One thing to delete; one thing to keep.
- [ ] **M2 exit target:** ≥ **3** candidates with positive reply or scheduled call; stretch **5** commitments before M3.

**Stop/fail if**

- Zero outreach started by end of M2 engineering track.
- Pipeline is only developer friends / cofounder network (violates persona gate).

**Rollback:** N/A (ops artifact). Pause outreach if production P0 (security); resume when Ship Gate restored.

---

### Session 8 — Dogfooding + friction log (FOUNDER — no Agent code)

**Goal:** 10+ consecutive days of real hosted use with a **dated friction log**; baseline metrics for open→action, module switches, loop completions.  
**Time:** 15 min/day × 10+ days (starts day Session 1 lands on production)  
**Prerequisites:** Session 1 on production. Continue through M3.  
**Maps to:** WP-2.7 + M2 exit criterion #3 (full loop ≥ 5 days/week on hosted)

#### Protocol

| Rule | Detail |
|------|--------|
| **Host** | https://flowos-sage.vercel.app only — not localhost |
| **Start date** | First production day Session 1 merges |
| **Minimum** | 10 consecutive calendar days with ≥ 1 entry/day |
| **Daily loop target** | Plan → focus ≥ 1 session → reflect (M2 exit: ≥ 5 days in one week) |
| **Bias guard** | Log **specifics** (what, when, cost) — not mood summaries |

#### Friction log template

Create `docs/foundation/FRICTION_LOG.md` (or private sheet — if private, note location in decision log):

```markdown
## YYYY-MM-DD

| Field | Entry |
|-------|-------|
| **Open→first action (s)** | Self-timed from login/page load to first meaningful action |
| **What** | Exact friction (e.g. "Next-action scrolled task behind timeline") |
| **When** | Time of day / context (morning plan, mid-day focus, evening reflect) |
| **Cost** | Seconds lost, extra clicks, or abandoned action |
| **Loop** | Plan ✓/✗ · Focus session ✓/✗ · Reflect ✓/✗ |
| **Module switches** | Count of sidebar navigations away from Today |
| **Evidence** | Screenshot optional — one line quote yourself |

```

#### Weekly rollup (founder, 10 min)

- Median open→action seconds
- Days loop completed / 7
- Top 3 frictions by **cost × frequency**
- **Do not** fix more than one friction/week during M3 — in M2, log only unless P0

**Stop/fail if**

- Fewer than 10 consecutive days logged before declaring M2 complete.
- Log entries are vague ("felt fine") without what/when/cost.

**Rollback:** N/A — qualitative artifact.

---

## Manual test matrix (WP-2.2)

Run on **production** after Session 2. URL must stay **`/`** (pathname) for every primary next-action CTA.

| # | Scenario | Setup steps | Action | Expected (stay on `/`) | Pass/Fail |
|---|----------|-------------|--------|------------------------|-----------|
| 1 | **Empty day** | No tasks/habits scheduled today; no active focus | Open Today → click next-action primary CTA | Inline capture focus or "add task" in place — **no** navigation to `/tasks` | ☐ |
| 2 | **All done** | Complete all today tasks/habits; no reflection saved | Click next-action ("Reflect on your day") | Reflection opens inline/sidebar — **no** `/reflection` route | ☐ |
| 3 | **Active focus session** | Start focus from Today | Click next-action ("Continue focus" / return) | Timer visible; controls work — **no** `/focus` | ☐ |
| 4 | **Task next-action** | One incomplete scheduled task | Click next-action "Open task" / task CTA | Scroll/highlight task row on Today — **no** `/tasks` | ☐ |
| 5 | **Habit next-action** | One incomplete habit today | Click next-action habit CTA | Scroll/highlight habit row or complete inline — **no** `/habits` | ☐ |
| 6 | **Focus start next-action** | No active session; tasks exist | Click "Start Focus" next-action | Timer starts on Today — **no** `/focus` | ☐ |
| 7 | **Reflection next-action** | All tasks/habits done; no reflection | Click "Start reflection" | Reflection UI opens without leaving `/` | ☐ |
| 8 | **Timeline schedule item** | Scheduled task on embedded timeline | Click item action (if exposed) | In-place highlight/action — **no** module list route | ☐ |
| 9 | **KPI strip Tasks cell** | Today with tasks | Click Tasks KPI (if clickable post-S2) | Scroll to tasks region on Today — **no** `/tasks` | ☐ |
| 10 | **Quick complete** | Task-type next-action with Done button | Click Done | Task completes inline; URL stays `/` | ☐ |

**Session 2 gate:** All applicable rows **PASS** before Session 3 begins.

---

## Decision points (founder only — max 3)

Use only when truly blocked. Record choice in `docs/foundation/DECISION_LOG.md`.

| # | Decision | Options | Runbook default |
|---|----------|---------|-----------------|
| 1 | **KPI strip layout on Today** | (A) KPI strip **above** focus/tasks grid (B) **below** page title, above grid (C) compact single row in timeline header | **(A)** — matches dashboard order; keeps execution grid intact |
| 2 | **Demoted Schedule / Notes link placement** | (A) Below KPI strip as text links (B) Footer of timeline column (C) "More" kebab near page title | **(A)** — visible without opening timeline overflow |
| 3 | **`/workplace` redirect mechanism** | (A) `redirect()` in `workplace/page.tsx` (B) middleware 308 | **(A)** — minimal middleware churn post-M1 |

---

## Out of scope

Do not execute during M2 (masterplan closed scope + NOT-allowed):

- Command palette, keyboard OS, `/overview` page
- Monolith refactors (`tasks-board-view.tsx`, `timeline-planner.tsx`) beyond surgical touch points
- Visual polish, design-system/token work
- Schedule/Notes **feature** work (routes stay; no new scheduling surfaces)
- Reflection save unification, planning-model changes
- Any new module (Goals, AI Coach, gamification, calendar sync, mobile)
- M3+ work: alpha onboarding automation, smoke tests, Wave 1 gate, metrics harness
- dnd-kit migration, middleware→proxy migration
- Automated tests beyond CI build + lint
- New strategy docs (except friction log, decision-log entries, this runbook)

---

## Top 5 M2 execution risks + mitigations

| Risk | Impact | Mitigation |
|------|--------|------------|
| **1. Scope creep ("Phase 3 by another name")** | M2 never closes; strangers see wrong product | Closed scope list; Decision points max 3; revert feature commits that exceed WP |
| **2. Monolith adjacency** | Home/routing change breaks timeline or task board | Page-composition level only; no splits; full manual loop on production after each session |
| **3. Routing truth incomplete** | Exit #2 fails silently | Manual test matrix is Session 2 gate; grep for `href: "/focus"` etc. before merge |
| **4. Recruiting slips** | M3 blocked on calendar time | Session 7 in parallel from week 2; ≥ 3 names contacted before engineering ends |
| **5. Founder self-kindness bias** | Friction log useless | Session 8 template forces what/when/cost; 10+ consecutive days required |

---

## Operational gotchas

1. **`/` ≠ execution surface today** — `page.tsx` renders `DashboardPageContent`; real execution is `/workplace` (`WorkplacePageContent`). Session 1 fixes this — code wins over older docs that describe Dashboard as home.
2. **Sidebar has 8 nav items in 2 sections** (`sidebar-navigation.tsx` lines 25–42) — includes Dashboard + Workplace + Schedule + Notes; M2 target is 5.
3. **`getNextActionRecommendation` always returns module hrefs** (`dashboard-command.ts` lines 122–199) — `/focus`, `/tasks`, `/habits`, `/reflection`; Session 2 must replace with in-place actions.
4. **`buildScheduleItems` embeds `/tasks` and `/habits` hrefs** (`schedule.ts` lines 46, 65) — timeline links escape Today without Session 2.
5. **`buildFocusScheduleItem` href `/focus`** (`schedule-utils.ts` line 58) — active session chip routes away.
6. **`DashboardNextAction` uses `<Link href>`** — no in-place handler until Session 2 refactors.
7. **`DashboardKpiStrip` cells link to module pages** (`dashboard-kpi-strip.tsx` lines 108–127) — conflicts with stay-on-Today until Session 2.
8. **`workplaceHoverMode` only on `/workplace`** (`global-right-sidebar-context.tsx` line 98) — must move to `/` when Today merges or right sidebar hover breaks on home.
9. **Quick capture is modal-first** — `WorkplaceQuickAddCard` → `requestQuickCapture()` → `QuickCaptureDialog`; inline Enter is Session 5.
10. **Timer controls hover-gated** — `TimerHoverControls` + `showStartOnHover` in `workplace-focus-card.tsx` (~32KB file); Session 4 surgical only.
11. **Active focus session in localStorage** — key `flowos.focus.active` (`focus-active-session.ts`); device-local; tell alpha users single-device-primary until M4 pull.
12. **Monolith files adjacent** — `workplace-page-content.tsx` imports `TimelinePlanner` from `tasks-board-view.tsx` / `timeline-planner.tsx` (~2.5k lines each); do not refactor in M2; tripwire is second regression.
13. **No `(main)/error.tsx` or `loading.tsx`** — Session 6 adds them; until then errors are in-component `ErrorBanner` only.
14. **`/dashboard` middleware redirect** already sends to `/` (`middleware.ts` lines 64–67) — do not build `/overview`; KPIs inline on Today only.
15. **M1 runbook mentioned possible `/` hover-sidebar change** — current code still `pathname === "/workplace"` only; Session 1 must align with Today at `/`.

---

## Explicitly deferred (not M2)

| Item | When / trigger |
|------|----------------|
| Command palette v1 | M4 pull — ≥ 2 users ask "how do I find X" |
| Smoke tests (auth, CRUD, focus, reflection) | M4 mandatory WP-4.1 |
| Habit-completion localStorage/Supabase fix | M4 pull WP-4.2 — multi-device report |
| Monolith splits | Tripwire: second M2–M4 regression in same file |
| `/overview` page | Explicitly cut from M2 — KPIs inline on Today |
| Reflection save unification | M4 pull |
| Planning simplification (3 surfaces → 1 default) | M4 pull — user evidence |
| Onboarding automation | M5 GO path |
| dnd-kit migration | Indefinitely deferred |
| Middleware → Next.js proxy | Not M2 |

---

## M2 completion checklist

All four M2 exit criteria from masterplan — check only when evidence exists.

| # | Criterion | WP | Done |
|---|-----------|-----|------|
| M2-1 | Founder lands on execution surface with **zero clicks**; open → first meaningful action **< 5s** self-timed on hosted URL | WP-2.1, WP-2.4, WP-2.5 | ☐ |
| M2-2 | **Every next-action click keeps founder on Today** — verified task/habit/focus/reflection states (manual test matrix all PASS) | WP-2.2 | ☐ |
| M2-3 | Full loop (plan → focus ≥ 1 session → reflect) on hosted FlowOS **≥ 5 days in one week** | WP-2.7 | ☐ |
| M2-4 | **≥ 3 alpha candidates** in recruiting pipeline (parallel outreach) | WP-2.8 | ☐ |

**Scope items (all 7 required):**

| # | Scope item | WP | Done |
|---|------------|-----|------|
| S1 | `/` = Today + inline KPI + next-action; label "Today"; `/workplace` → `/` | WP-2.1 | ☐ |
| S2 | Routing truth — in-place actions, no module escapes from next-action | WP-2.2 | ☐ |
| S3 | Visible timer controls + one-click start focus | WP-2.4 | ☐ |
| S4 | Inline capture bar (tasks only) | WP-2.5 | ☐ |
| S5 | `error.tsx` + `loading.tsx` on `(main)` | WP-2.6 | ☐ |
| S6 | Sidebar 5 items; Schedule/Notes demoted | WP-2.3 | ☐ |
| S7 | 10+ day friction log on hosted instance | WP-2.7 | ☐ |

**Acceptance test:** Composer Agent can execute Sessions 1–6 using **only this runbook**; founder can run Sessions 7–8 without Agent. ☐

---

*End of runbook. M3 waits until every M2 exit criterion and scope item is checked.*
