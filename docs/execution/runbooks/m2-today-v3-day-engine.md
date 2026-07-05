# Today V3 — The Day Engine (owns all of Today until fully shipped)

**Scope:** All of Today (`/`) — supersedes M2's Today-chrome scope for the duration of this runbook. Where V3 exceeds masterplan M2 closed scope, it is planned here and explicitly gated on founder decision-log approval before Phase C (see appendix) — it is not deferred, shrunk, or renamed to fit M2.
**Authority:** [today-v3-greenfield-design.md](../../review/design/today-v3-greenfield-design.md) §4 (spec) and §13 (staged path) are the primary design source. [today-executive-review.md](../../review/design/today-executive-review.md) is the audit baseline for what's shipped vs. broken. [PRINCIPLES.md](../../foundation/governance/PRINCIPLES.md) is non-negotiable and wins any conflict with either design doc. [execution-masterplan.md](../../strategy/execution-masterplan.md) is reference only for sequencing sense, not a scope ceiling.
**Repo root:** repository root (Next.js app).
**Production baseline:** https://flowos-sage.vercel.app
**Docs path:** `docs/` (tracked in VCS)
**Idea capture:** [inbox.md](../logs/inbox.md) → sessions below → [july-log.md](../logs/july-log.md) after merge to `main`.

---

## Acceptance test

When Sessions 1–12 are complete and merged, the founder opens `/` and the page is a **state machine, not a grid**: one line of header orientation (date, day-state word, workload chips, escape links); below it a single polymorphic **NOW slot** that is silent when nothing matters and shows exactly one thing when something does (active focus, an imminent scheduled item, the engine's top recommendation, or the close-day ritual); below that a permanent one-line **capture** input reachable by pressing `N` from anywhere; below that a **NEXT queue** capped at 5 rows with tasks and due habits interleaved in one ordering, with `Later / Missed / Done` as collapsed disclosure rows that render only when non-empty; a thin **ambient time rail** on the right edge that expands to the full drag-planner on `T`; starting a focus session **morphs the whole page** into a calm, chrome-dimmed timer state with Pause/Break/Stop always visible and no idle hero timer ever rendered; ending a session drops a one-line inline reflection prompt into the same surface; when the day's tasks and habits are done, the page shows the **silence state** ("All clear. Nothing needs you.") with zero decorative UI; and in the evening the NOW slot becomes the **close-day panel**, pre-filled with the day's real data, skippable, resurfacing once the next morning. The density picker (Full/Work/Focus) no longer exists as user-facing UI — density is derived from day-state — unless the Phase C decision-log entry retiring it has not yet been approved, in which case it remains behind a feature flag. Every session in this runbook passes `npm run build && npm run lint` on its own branch before a merge ask.

---

## Resume protocol

| Step | Action |
|------|--------|
| 1 | **Stop** at the session's stop/fail condition — do not skip to a dependent session. |
| 2 | **Record blocker** in [decision-log.md](../logs/decision-log.md): date, session #, WP/area, symptom, what was tried, next action. |
| 3 | **Git:** commit WIP on the **session branch** (`WIP: Session N blocked — {reason}`) or `git stash`. Never merge to `main`. See [GIT_WORKFLOW.md](../../foundation/governance/GIT_WORKFLOW.md). |
| 4 | **Resume** the same session number when unblocked. |
| 5 | **Respect dependencies** — see session dependency table below. Phase C sessions (6–9) additionally **block on founder approval of the decision-log appendix** — do not start Session 6 without that approval, even if Sessions 1–5 are on `main`. |
| 6 | **Parallel exception:** Session 10 (typography/motion pass) content can be drafted in parallel with Phase C engineering but must not merge before Phase C is on `main` — it depends on the final morph/rail DOM. |

---

## Session dependency table

| Session | Depends on (must be on `main`) | Blocks |
|---------|----------------------------------|--------|
| 1 — Next-action foundation | M2 Today on `main` | 2, 3 |
| 2 — Dismiss + allowlist widening | 1 | 3, 4 |
| 3 — Visible focus controls (unhide) | M2 Today on `main` (independent of 1/2, same bundle) | 4 |
| 4 — NOW slot v1 (polymorphic promotion) | 1, 2, 3 | 5 |
| 5 — NEXT queue v1 (cap + disclosures) + session-end reflection line | 4 | 6 |
| 6 — Habits interleaved into NEXT | 5 + **decision-log approval** | 7 |
| 7 — Focus page-morph | 5 + **decision-log approval** | 8 |
| 8 — Ambient time rail + T-overlay | 5 + **decision-log approval** | 9 |
| 9 — Close-day terminal state | 5, 6 + **decision-log approval** | 10 |
| 10 — Typography/motion pass + density picker retirement | 6, 7, 8, 9 | 11 |
| 11 — Migration overlay + manual test matrix gate | 10 | 12 |
| 12 — Metric instrumentation + FEATURE_INVENTORY/masterplan reconciliation | 11 | — |

Sessions 2 and 3 may run in either order after Session 1. Sessions 6, 7, 8 may run in any order once their shared prerequisite (Session 5 + decision-log approval) is met, but each touches `workplace-page-content.tsx` — rebase or serialize merges to avoid conflicts; do not run them concurrently on the same machine without merging between.

---

## Session plan

**Budget:** 12 sessions × 2–4 hours each (Phase C sessions run 3–4h; Phase A/B run 2–3h).
**Engineering sessions:** 1–12, all Agent-executable.
**Founder-only sessions:** none — but Phase C cannot **start** without founder approval of the decision-log appendix (see below). That approval step is a founder action, not a session.

### Git workflow (required)

Full rules: [GIT_WORKFLOW.md](../../foundation/governance/GIT_WORKFLOW.md).

| Step | Rule |
|------|------|
| **Start session** | `git checkout main && git pull` → `git checkout -b m2/session-N-today-v3-{short-name}` |
| **During session** | Commit on branch; `git push -u origin HEAD` (not `main`) |
| **End session** | `npm run build && npm run lint` → agent reports merge bundle → **ask founder to approve merge to `main`** |
| **After merge** | Push `main` → CI/Vercel → manual production check → [july-log.md](../logs/july-log.md) |

**Merge bundles:**

| Bundle | Sessions | Remind merge when | Founder gate |
|--------|----------|-------------------|--------------|
| B1 — Foundation (Phase A) | 1, 2, 3 | All three verified on `/` | None — in M2 scope already |
| B2 — NOW + NEXT v1 (Phase B) | 4, 5 | Session 5 done and B1 on `main` | None — additive, reversible |
| B3 — Habits + morph (Phase C, part 1) | 6, 7 | Session 7 done and B2 on `main` | **Decision-log entries 1, 3, 5 approved before Session 6 starts** |
| B4 — Rail + close-day (Phase C, part 2) | 8, 9 | Session 9 done and B3 on `main` | **Decision-log entries 2, 4 approved before Session 8 starts** (may run parallel to B3 once approved) |
| B5 — Polish & gates (Phase D) | 10, 11, 12 | Session 12 done — runbook complete | Decision-log entry on density-picker retirement (#5) must be live on `main` before Session 10's deletion step |

Ad-hoc UI/UX unrelated to V3: branch `tweak/short-description` from `main` — same approval rule, separate runbook.

---

## Phase overview (V3 §13 mapped to sessions)

| Phase | V3 §13 target | Sessions | UX / effort / risk (per §13) |
|-------|----------------|----------|-------------------------------|
| **A — Foundation** | "Ship this week" | 1–3 | ★★★★ · XS–S · low risk · fully reversible |
| **B — NOW + NEXT** | "Ship this month" | 4–5 | ★★★★ · M · low-med risk · reversible |
| **C — Day Engine** | "Ship this quarter" | 6–9 | ★★★★★ · L · medium risk · reversible w/ flag |
| **D — Polish & gates** | Cross-cutting close-out | 10–12 | ★★★★ · M · low-med risk · reversible |

---

## Session 1 — Next action visible by default + compact NOW embryo

**Type:** `engineering`
**Goal:** Un-hide the existing next-action logic in default (Work) density as a one-line dismissible strip — the literal embryo of the NOW slot, per V3 §13 "ship this week."
**Time:** 2 hours
**Prerequisites:** M2 Today on `main`.
**Maps to:** WP-2.2 (extends), V3 §13 week-1 item 1; PRINCIPLES #2, #10
**Merge bundle:** B1

### Current code reality

| Area | File | Behavior today |
|------|------|------------------|
| Density gate | `src/lib/workplace-density.ts` `shouldShowTodayNextAction()` | `if (density !== "full") return false;` — next action invisible in default Work density |
| Rendering | `src/components/today/today-rail-stats-row.tsx` | Already renders a compact one-line "Next: {title} [action]" row — reusable as-is |
| Wiring | `src/components/today/today-page-content.tsx` | `showNextAction = shouldShowTodayNextAction(density, nextAction, {...})` passed straight into `TodayStatusRail` |
| Decision-log conflict | [decision-log.md](../logs/decision-log.md) 2026-07-05 "Today next-action hidden by default (density Work)" | This session **explicitly reverses** that decision — record a new entry (Session step 4) rather than editing history |

### Numbered steps

| # | Step |
|---|------|
| 1 | In `src/lib/workplace-density.ts`, change `shouldShowTodayNextAction` to allow `density === "work"` in addition to `"full"`. Keep the `hasActiveFocus` suppression and the type allowlist as-is for this session (allowlist widening is Session 2). |
| 2 | In `today-page-content.tsx`, no wiring change needed — `showNextAction` already flows through `TodayStatusRail` → `TodayRailStatsRow`. Verify the KPI strip itself (`showKpiStats`) stays Full-only; do not widen that in this session. |
| 3 | Visual check only: confirm the compact row in `today-rail-stats-row.tsx` reads well with `showKpiStats={false}` (i.e., without the divider chips before it) at Work density — if the "Next:" text feels orphaned without a preceding chip, add `pl-0` adjustment, no larger changes. |
| 4 | Append a decision-log entry: "2026-07-06 — Reverse: next-action visible by default (Work density)" superseding the 2026-07-05 entry, citing this runbook and V3 §13. |
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
| Load `/` at default density | One-line "Next: {title} [action]" row visible without switching to Full |
| Active focus session running | Next-action row disappears (existing `hasActiveFocus` suppression still works) |
| Click action button | In-place scroll/start behavior unchanged from M2 |

**Stop/fail if**

- Next-action row appears in Focus density (must stay `focus`-only = timer).
- Build or lint fails.

**Rollback:** revert merge on `main` — never force-push `main`.

---

## Session 2 — Dismiss-until-state-change + widen type allowlist

**Type:** `engineering`
**Goal:** Add per-entity dismiss semantics and widen the next-action type allowlist so focus/schedule/empty recommendations can render — the two items the executive review flagged as P1 gaps.
**Time:** 2–3 hours
**Prerequisites:** Session 1 on `main`.
**Maps to:** V3 §4 "the guidance layer," §13 week-1; PRINCIPLES #2
**Merge bundle:** B1

### Current code reality

| Area | File | Behavior today |
|------|------|------------------|
| Allowlist | `src/lib/workplace-density.ts` `shouldShowTodayNextAction` | `action.type === "task" \| "habit" \| "reflection"` only — `focus`, `schedule`, `empty` never render |
| Recommendation types | `src/lib/dashboard-command.ts` `NextAction.type` | Already includes `"focus" | "reflection" | "schedule" | "empty"` — the cascade computes these, UI just filters them out |
| Dismiss | none | No dismiss mechanism exists anywhere in the next-action pipeline |

### Numbered steps

| # | Step |
|---|------|
| 1 | Widen `shouldShowTodayNextAction` in `workplace-density.ts` to allow `task \| habit \| reflection \| focus \| empty`. Keep `schedule` out for now — V3 defers "imminent event" framing to Session 4's polymorphic NOW slot, which supersedes this simple strip; do not build schedule-specific copy twice. |
| 2 | Add a new small lib module `src/lib/next-action-dismiss.ts`: `dismissKey(action: NextAction) => \`${action.type}:${action.entityId ?? "none"}\``, `readDismissedKey(): string \| null`, `writeDismissedKey(key: string): void` using `sessionStorage` (resets on new day/tab — matches "until state change," not "forever"). |
| 3 | In `today-page-content.tsx`, compute `isDismissed = readDismissedKey() === dismissKey(nextAction)`; fold into the existing `showNextAction` boolean. Clear the dismissed key whenever `dismissKey(nextAction)` changes (new recommendation → old dismissal no longer applies) via a `useEffect` comparing previous vs current key. |
| 4 | In `today-rail-stats-row.tsx`, add a small dismiss (✕) icon-button next to the existing action button, calling a new `onDismiss` prop wired to `writeDismissedKey(dismissKey(nextAction))`. |
| 5 | `npm run build && npm run lint` → commit → push → **ask founder to approve merge to `main`**. |

### Verification

| Check | Expected |
|-------|----------|
| Dismiss the next-action strip | Strip disappears immediately |
| Complete the underlying task/habit (recommendation changes) | Strip reappears with the new recommendation, not stuck dismissed |
| "Start a focus session" recommendation (focus type, no active session) | Now renders instead of being filtered |
| Reload page same day, same recommendation | Dismissal persists (sessionStorage) until the recommendation itself changes |

**Stop/fail if**

- Dismissing one recommendation silently suppresses a different, later recommendation of the same type.
- Build or lint fails.

**Rollback:** revert merge on `main`.

---

## Session 3 — Un-gate focus controls (visible before hover)

**Type:** `engineering`
**Goal:** Remove the `opacity-0`/`group-hover` gating on Pause/Break/Stop — a pre-approved Phase 3.3 fix, P#10 violation, safe in isolation.
**Time:** 1 hour
**Prerequisites:** M2 Today on `main` (independent of Sessions 1–2; merges in the same B1 bundle).
**Maps to:** WP-2.4; PRINCIPLES #10
**Merge bundle:** B1

### Current code reality

| Area | File | Behavior today |
|------|------|------------------|
| Timer controls | `src/components/workplace/workplace-focus-card.tsx` `TimerHoverControls` | Already accepts `alwaysVisible` prop and **both call sites already pass `alwaysVisible`** (lines ~603, ~830) — inspect before assuming work is needed |

### Numbered steps

| # | Step |
|---|------|
| 1 | Read `workplace-focus-card.tsx` `TimerHoverControls` usages end to end. If both the Focus-tab and Pomodoro-tab call sites already pass `alwaysVisible`, this item is **already shipped** — do not touch code; instead verify visually on production and update `FEATURE_INVENTORY.md` row "Focus timer card | Hover-gated controls — Phase 3.3 fix" to "Shipped — controls always visible" with a decision-log line noting the audit found it pre-completed. |
| 2 | If any call site still omits `alwaysVisible`, add it and delete the now-dead hover-only branch of `TimerHoverControls` (the `pointer-events-none opacity-0 group-hover/timer:...` branch becomes unreachable — simplify the component to only render the always-visible branch). |
| 3 | Regardless of path taken, grep the codebase for other `group-hover` gated critical controls on the Today surface (`global-right-sidebar.tsx` hover-reveal is a **separate**, larger decision — do not touch it here; note it in Explicitly deferred). |
| 4 | `npm run build && npm run lint` → commit (even if commit is docs-only) → push → **ask founder to approve merge to `main`**. |

### Verification

| Check | Expected |
|-------|----------|
| Active focus session, no mouse movement | Pause/Break/Stop visible without hovering |
| Keyboard-only user (Tab to buttons) | Buttons reachable and visibly focused |

**Stop/fail if**

- Any critical timer control still requires hover to become visible.

**Rollback:** revert merge on `main`.

---

## Session 4 — NOW slot v1: promote to primary polymorphic region

**Type:** `engineering`
**Goal:** Promote the next-action strip into an actual **NOW slot** — a visually primary, taller region above capture, rendering one of {active focus, imminent schedule (≤15m), recommendation, empty/silence} instead of a one-line rail chip.
**Time:** 3–4 hours
**Prerequisites:** Sessions 1, 2, 3 on `main`.
**Maps to:** V3 §4 "NOW slot," §13 month target; PRINCIPLES #2, #4
**Merge bundle:** B2

### Current code reality

| Area | File | Behavior today |
|------|------|------------------|
| Recommendation cascade | `src/lib/dashboard-command.ts` `getNextActionRecommendation` | Already deterministic cascade: active focus → next timeline item → top task → last habit → reflection → start focus → plan day. This is the engine — do not rewrite it, wrap it. |
| Current rendering surface | `today-rail-stats-row.tsx` inside `today-status-rail.tsx` header | One-line rail chip — correct for Session 1–3, insufficient for the "largest type on the page" requirement in V3 §4 |
| Page layout | `today-page-content.tsx` | `<TodayStatusRail>` (header) then `<WorkplacePageContent>` (grid) — no dedicated NOW region between them yet |

### Numbered steps

| # | Step |
|---|------|
| 1 | Create `src/components/today/today-now-slot.tsx` — a new component rendered between `TodayStatusRail` and `WorkplacePageContent` in `today-page-content.tsx`. It takes `nextAction: NextAction`, `hasActiveFocus: boolean`, `onAction`, `onDismiss`, `loading`. |
| 2 | Polymorphic content resolution stays in `dashboard-command.ts` (already correct) — `today-now-slot.tsx` only changes **presentation** per `nextAction.type`: `focus` (active session) renders a compact "Continue focus" card with the session's task/habit title and a Resume action; `task`/`habit` renders per V3 §4 typography (title ~20px semibold, one-clause reason, one primary action, dismiss); `reflection` renders the close-day teaser (full close-day panel is Session 9); `empty` renders **nothing** — the component returns `null` and takes zero height (no "you're all caught up" card, per V3 §4 and Anti-pattern #2). |
| 3 | Remove the now-redundant "Next:" row from `today-rail-stats-row.tsx` when `showNextAction` would be true — the NOW slot replaces it. Keep the KPI chips (`showKpiStats`, Full-density only) in the rail; only the next-action portion moves down. Update `TodayRailStatsRow` props to drop `showNextAction`/`nextAction`/`onNextAction`/`onQuickComplete` (moved to the new component) — this is the one call-site refactor in this session; keep it mechanical. |
| 4 | Add `role="status"` and `aria-live="polite"` to the NOW slot wrapper per V3 §4 accessibility requirement — screen readers hear the recommendation change. |
| 5 | Cross-fade transition on content change (200–300ms opacity, respecting `prefers-reduced-motion`) so the user notices when the slot's content changes, per V3 §4 "Motion." Use existing Tailwind transition utilities; no new animation library. |
| 6 | `npm run build && npm run lint` → commit → push → **ask founder to approve merge to `main`**. |

### Verification

**Commands**

```powershell
npm run build
npm run lint
```

**Production manual checks**

| Check | Expected |
|-------|----------|
| Morning, tasks pending | NOW slot shows the top recommendation with title, one-clause reason, action, dismiss |
| Start a focus session | NOW slot switches to "Continue focus" framing; cross-fades, doesn't jump |
| Dismiss the NOW slot content | Collapses to zero height until state changes (per Session 2 dismiss key) |
| All tasks/habits done, no reflection yet | NOW slot shows reflection teaser, not silence (silence is only when literally nothing qualifies) |
| Screen reader | Announces NOW slot content changes |

**Stop/fail if**

- NOW slot renders a placeholder/empty-state card when `type === "empty"` (must render nothing).
- Cross-fade causes layout shift (CLS) — reserve height via `min-height` while empty state is height 0 intentionally, non-empty states reserve one row minimum.
- Build or lint fails.

**Rollback:** revert merge on `main` — `today-rail-stats-row.tsx` next-action removal must be reverted together with the NOW slot addition (same commit/PR) to avoid losing the feature entirely mid-rollback.

---

## Session 5 — NEXT queue v1 (cap + disclosures) + session-end reflection line

**Type:** `engineering`
**Goal:** Cap the visible task queue at 5 (Miller's law), add collapsed Later/Missed/Done disclosure rows, and add the one-line inline reflection prompt after a focus session ends.
**Time:** 3 hours
**Prerequisites:** Session 4 on `main`.
**Maps to:** V3 §4 "NEXT queue," "Focus — four states" (Ending → reflection transition); PRINCIPLES #7, #9, #16
**Merge bundle:** B2

### Current code reality

| Area | File | Behavior today |
|------|------|------------------|
| Task queue | `src/components/workplace/workplace-tasks-card.tsx` | Tabs (Queue/Unschedule/Missed/Completed), unbounded list per tab, `overflow-y-auto` |
| Partition logic | `src/lib/workplace-tasks.ts` `partitionWorkplaceTasks` | Already splits into `queue`, `unscheduled`, `missed`, `completed` — reusable |
| Session end | `src/components/workplace/workplace-focus-reflection-modal.tsx` | Full modal reflection on session end — V3 wants a one-line inline prompt in the same surface, not a modal (P#9 inline-before-modal) |
| Row component | `src/components/workplace/workplace-compact-task-row.tsx` | Existing compact row — reuse for queue rows |

### Numbered steps

| # | Step |
|---|------|
| 1 | In `workplace-tasks-card.tsx` (or a new sibling `today-next-queue.tsx` if the tab model conflicts too much with the cap — prefer editing in place per "compose over fork"), change the `queue` tab rendering to `sections.queue.slice(0, 5)` plus a "N more" affordance if `sections.queue.length > 5` per V3 §5 "heavy workload" rule (cap holds, no auto-reschedule, no hiding the count). |
| 2 | Convert the `Unschedule/Missed/Completed` tab bar into collapsed single-line disclosure rows below the capped queue list, matching V3 §4's "Later · Missed · Done" — reuse the existing `partitionWorkplaceTasks` counts; a zero-count row does not render at all (V3 §4 region inventory rule). Clicking a disclosure expands its list inline (accordion), not a tab switch — this is the biggest structural change in this session; keep the underlying data functions (`partitionWorkplaceTasks`, row components) untouched. |
| 3 | Missed disclosure renders its count in amber only when `> 0` — no wall-of-red styling (V3 §8 month-1 failure mode mitigation). |
| 4 | Session-end reflection: in `workplace-focus-card.tsx`, when `quick.stopSession()` fires and the session had meaningful duration, instead of (or in addition to, gated by a quick "skip" vs the full modal) immediately opening `WorkplaceFocusReflectionModal`, first render a one-line inline prompt ("What did this session produce? ___ · skip") in the same card surface where the timer was. Wire its submit to the existing reflection persistence path used by the modal (check `workplace-focus-reflection-modal.tsx` for the save call and reuse it directly — do not duplicate persistence logic). The full modal remains reachable via the existing "Focus Reflection" button for the deeper form. |
| 5 | `npm run build && npm run lint` → commit → push → **ask founder to approve merge to `main`**. |

### Verification

| Check | Expected |
|-------|----------|
| 8 queued tasks | Only 5 rows visible + "3 more" disclosure, not a scrolling list of 8 |
| Missed = 0 | Missed disclosure row does not render at all |
| Missed = 2 | Amber count "Missed (2)", no alarming red |
| Stop a focus session | One-line inline prompt appears in the focus card surface, not a modal; skip works with one click |
| Submit inline reflection | Persists via same path as full modal (verify in Supabase `reflections` table or via reload) |

**Stop/fail if**

- Queue shows more than 5 rows without a disclosure control.
- Inline reflection prompt fails to persist (falls back silently) — must either save correctly or show an inline retry, never lose data.
- Build or lint fails.

**Rollback:** revert merge on `main`.

---

## Session 6 — Habits interleaved into NEXT queue

**Type:** `engineering`
**Goal:** Remove the standalone Habits card from the default Today experience; due habits become NEXT queue rows with a HABIT glyph and streak, ordered together with tasks by one unified engine (schedule → priority → age).
**Time:** 3–4 hours
**Prerequisites:** Session 5 on `main` **and founder approval of decision-log entries #1, #3, #5 (see appendix)**.
**Maps to:** V3 §3 "Habits card → Merge," §4 "Tasks, habits, timeline, reflection"; PRINCIPLES #5, #8; supersedes WP-2.1's "Home merge" grid assumption
**Merge bundle:** B3 (gated)

### Current code reality

| Area | File | Behavior today |
|------|------|------------------|
| Habits card | `src/components/workplace/workplace-habits-card.tsx` | Separate `WorkplaceModuleCard` with its own tabs (Incomplete/Missed/Completed), rendered as its own grid cell in `workplace-page-content.tsx` |
| Habit rows | `src/components/workplace/workplace-compact-habit-row.tsx` | Compact row with streak + Start focus — visually close to what a queue row needs already |
| Task queue (post-Session 5) | `today-next-queue.tsx` (new from Session 5) or `workplace-tasks-card.tsx` | Tasks-only ordering; no habit awareness yet |
| Ordering primitives | `src/lib/dashboard-command.ts` `sortTasksForPreview`, `sortHabitsForPreview` | Separate sort functions per entity — no unified interleave function exists yet |

### Numbered steps

| # | Step |
|---|------|
| 1 | Add `src/lib/next-queue.ts` with a new `buildNextQueue(tasks, habits, timeline, options): NextQueueItem[]` that interleaves incomplete tasks and due-today habits into one ordered list using: scheduled time first, then priority, then age (created_at) — matching V3 §4's stated ordering ("schedule → priority → age"). `NextQueueItem` is a small discriminated union `{ kind: "task", task: Task } | { kind: "habit", habit: Habit }`. |
| 2 | Render the unified list in the NEXT queue component from Session 5, capped at 5, using `WorkplaceCompactTaskRow` for task items and a new lightweight `NextQueueHabitRow` (reuse `TimelineHabitLabel`'s HABIT glyph pattern from `workplace-focus-card.tsx`'s `HabitFocusRow`, don't reinvent it) for habit items, each showing streak count. |
| 3 | Remove `WorkplaceHabitsCard` from the default grid cell in `workplace-page-content.tsx` (`isWorkplaceModuleShown("habits", density)` cell). Keep the `WorkplaceHabitsCard` component itself in the codebase — it remains reachable from the Habits module (`/habits`) for management (schedules, streak history) per V3 §4 "the card disappears; the module remains for management." Do not delete the file. |
| 4 | Update `WorkplaceHabitsCardWithFocus` wrapper and its ref (`habitsTabRef`) — since the card no longer renders on Today, `ensureHabitVisible` needs a new home: either scroll-to the habit's queue row (add habit anchor IDs to queue rows via `todayHabitAnchorId`) or, if the habit isn't in the visible-5 queue, expand the "Later" disclosure. Reuse the existing `todayHabitAnchorId` helper from `today-in-place.ts` — don't invent new anchor logic. |
| 5 | Update `dashboard-command.ts`'s `getNextActionRecommendation` NOW-slot cascade to treat habits and tasks symmetrically at the "top pick" tier (it already does via `computeScheduleSummary`/`sortHabitsForPreview`; verify no regression). |
| 6 | Feature-flag this behind `NEXT_PUBLIC_TODAY_UNIFIED_QUEUE` (see Risk section) so it can be disabled without a redeploy rollback if habit completion rates regress per the V3 §12 reconsider trigger ("if habit completion drops >20% post-launch"). |
| 7 | Update `FEATURE_INVENTORY.md`: "Habits card" row → "Interleaved into Today NEXT queue (V3); standalone card remains on `/habits` for management." |
| 8 | `npm run build && npm run lint` → commit → push → **ask founder to approve merge to `main`**. |

### Verification

| Check | Expected |
|-------|----------|
| Morning, habit due at 7am, tasks due later | Habit row appears first in NEXT queue with HABIT glyph + streak |
| Complete a habit from the queue | Animates to Done like a task row (shared completion treatment) |
| Toggle feature flag off | Reverts to Session 5's task-only queue + separate habits card, no crash |
| `/habits` page | Full habit management (schedules, streak history) still fully functional |

**Stop/fail if**

- Habit completion requires navigating away from Today.
- Feature flag doesn't cleanly revert to pre-Session-6 behavior.
- Build or lint fails.

**Rollback:** disable feature flag first (instant); revert merge on `main` if flag rollback is insufficient.

---

## Session 7 — Focus page-morph (retire the idle hero card)

**Type:** `engineering`
**Goal:** Running a focus session morphs the whole Today page into a calm, chrome-dimmed state (per V3 §4 wireframe) instead of showing a timer inside a grid card; idle state shows no hero timer at all — only the `F` key / NOW slot action / queue-row Start affordance.
**Time:** 4 hours
**Prerequisites:** Session 5 on `main` **and founder approval of decision-log entries #1, #3 (see appendix)**.
**Maps to:** V3 §4 "Focus — four states"; PRINCIPLES #10, #22 (motion explains state, not decoration); supersedes 2026-07-03 "Focus reframed as mode, not page" decision by extending it to a page-level morph
**Merge bundle:** B3 (gated)

### Current code reality

| Area | File | Behavior today |
|------|------|------------------|
| Focus card | `src/components/workplace/workplace-focus-card.tsx` (899 lines) | Renders inline in the grid at all times, idle or running, with tabs (Focus/Pomodoro) always visible even when idle |
| Session state | `src/contexts/focus-session-context.tsx` | `quick.isIdle / isFocusing / isPaused / isOnBreak` — state already exists and is the source of truth; the morph only needs to **read** this, not add new state |
| Page composition | `src/components/today/today-page-content.tsx`, `src/components/workplace/workplace-page-content.tsx` | No page-level "focus mode" branch exists; the grid always renders the same regions |

### Numbered steps

| # | Step |
|---|------|
| 1 | In `today-page-content.tsx`, read `dashboardActive.isActive` (already available, used for `hasActiveFocus`) and branch the render: when active, render a new `TodayFocusMorph` component instead of `<TodayNowSlot>` + `<WorkplacePageContent>`. When idle, render the existing v1–v6 composition unchanged. |
| 2 | Build `src/components/today/today-focus-morph.tsx` reusing `workplace-focus-card.tsx`'s **running-state JSX** (the `quick.isFocusing`/`quick.isOnBreak` branches, timer clock, `TimerHoverControls`) — extract the shared bits into a hook or exported sub-component from `workplace-focus-card.tsx` (e.g. `useActiveFocusPresentation()`) rather than copy-pasting 200 lines, per "compose over fork." The morph adds: full-page centered layout (title, big timer, Pause/Break/Stop row, "on deck" next-item line reading from Session 6's unified queue), 300ms chrome-dim transition on mount/unmount respecting `prefers-reduced-motion`. |
| 3 | Chrome dims: the standard sidebar/rail/header reduce opacity or are visually de-emphasized (do not literally unmount navigation — P#3 "one screen before many screens" still requires Esc/back reachability) — use a CSS class toggle on a wrapper, not a route change. |
| 4 | Capture (`N`) still works during the morph — wire the existing `requestQuickCapture()` global handler; it must route captured items to the inbox silently per V3 §4 "Capture," not interrupt the timer view. |
| 5 | On session stop, transition back to the idle Today composition, landing exactly on Session 5's inline reflection prompt (already built) inside wherever it now renders (the morph's own surface, per V3 §4 "Ending → reflection transition — same surface, no modal"). |
| 6 | Delete (or hard-hide behind the flag) `workplace-focus-card.tsx`'s **idle-state** JSX (the `quick.isIdle` branch showing "Start Focus" button inside a grid card) — replace idle-state focus initiation with: the NOW slot's focus-type action (Session 4), the `F` key on any queue row (new — wire a keydown handler scoped to queue row focus/hover), and a persistent but minimal "Start Focus" entry point (V3 §4: "Idle: no timer chrome exists ... the absence of an idle timer is a feature"). Confirm no regression for users who relied on the idle Focus/Pomodoro tab toggle — Pomodoro config (focus/break minutes) needs a new idle entry point (e.g. a small settings affordance next to the `F` action) since its config UI lived in the now-deleted idle card. |
| 7 | Feature-flag via `NEXT_PUBLIC_TODAY_FOCUS_MORPH` — when off, Session 5/6 behavior (focus card inline in grid, both idle and running states) is preserved exactly as before this session. |
| 8 | `npm run build && npm run lint` → commit → push → **ask founder to approve merge to `main`**. |

### Verification

| Check | Expected |
|-------|----------|
| Idle Today | No hero timer card; `F` on a queue row and NOW slot's focus action both start a session |
| Start focus | Page morphs within 300ms; chrome dims; timer is the largest object |
| Capture during focus (`N`) | Task created silently to inbox; timer view uninterrupted |
| Pause/Break/Stop | All three visible without hover throughout |
| Stop session | Returns to idle Today with inline reflection prompt on the same surface |
| Feature flag off | Old inline focus card (idle + running) behaves exactly as before Session 7 |
| Pomodoro minute config | Reachable from a new idle entry point (not lost) |

**Stop/fail if**

- Idle Today shows any timer chrome (hero pixels for a state that isn't happening).
- Chrome-dim makes Esc/nav unreachable (traps the user in focus mode).
- Pomodoro configuration becomes unreachable.
- Build or lint fails.

**Rollback:** disable feature flag; revert merge on `main` if needed.

---

## Session 8 — Ambient time rail + T-overlay full planner

**Type:** `engineering`
**Goal:** Demote the full-width timeline column to a thin ambient rail (now-line, block silhouettes, next-event tick) on the right edge; pressing `T` (or clicking the rail) expands the existing `TimelinePlanner` as a full overlay, reusing it wholesale — no planner logic rewrite.
**Time:** 4 hours
**Prerequisites:** Session 5 on `main` **and founder approval of decision-log entries #2, #4 (see appendix)**.
**Maps to:** V3 §4 "Timeline," §3 "Timeline column → Contextual"; PRINCIPLES #7, #8; extends 2026-07-03 "Focus reframed as mode" precedent to the timeline surface
**Merge bundle:** B4 (gated)

### Current code reality

| Area | File | Behavior today |
|------|------|------------------|
| Timeline | `src/components/tasks/timeline-planner.tsx` | Large (2.5k+ line, per masterplan) full-width column component, `variant="workplace"` used in `workplace-page-content.tsx`, absolutely positioned at `right: 0` with `WORKPLACE_TIMELINE_WIDTH_PX` |
| Layout constants | `src/lib/workplace-layout.ts` `WORKPLACE_TIMELINE_WIDTH_PX`, `WORKPLACE_TIMELINE_RIGHT_GAP_PX` | Fixed-width column sizing consumed by both the grid padding and the timeline's own wrapper |
| Monolith tripwire | masterplan Step 3 | "Do not split proactively... second time a change causes >1-day slowdown, split then." This session **must not** refactor `timeline-planner.tsx` internals — only change how much of it is visible and add a new thin sibling component. |

### Numbered steps

| # | Step |
|---|------|
| 1 | Build `src/components/today/today-ambient-rail.tsx` — a new, small (~100–150 line) component rendering: a vertical now-line position, colored silhouette blocks for today's scheduled items (tasks/habits/focus blocks), and a small tick/label for the next event. It reads the **same data** already fetched for the full planner (`groups`, `habits`, `todayViewDate` from `workplace-page-content.tsx`) — do not create a second data-fetch path. |
| 2 | In `workplace-page-content.tsx`, replace the always-rendered `<WorkplaceTimelinePlanner>` in the idle Today composition with `<TodayAmbientRail>` at a much narrower width (e.g. 32–48px) — update `WORKPLACE_TIMELINE_WIDTH_PX` usage to a new `WORKPLACE_AMBIENT_RAIL_WIDTH_PX` constant in `workplace-layout.ts`, keeping the full-width constant intact for overlay use. |
| 3 | Add a `todayTimelineOverlayOpen` boolean to `today-page-content.tsx` (or a small dedicated context if multiple components need to trigger it — check `global-right-sidebar-context.tsx` for a precedent pattern of a boolean + open/close callbacks, don't duplicate a whole context system for one flag). Wire `T` keydown (extend `use-global-shortcuts.ts`) and a click/hover on the ambient rail to open it. |
| 4 | When the overlay is open, render `<WorkplaceTimelinePlanner variant="workplace" ...>` **unchanged**, full width, as a modal-like overlay (dim backdrop, Esc to close) positioned above the Today content — this is the "T-overlay full planner (reuses shipped planner wholesale)" requirement; the component itself receives zero new props beyond what it already has. |
| 5 | Drag-to-schedule from a NEXT queue row: add an `S` keyboard shortcut on a focused/hovered queue row that opens the T-overlay pre-scrolled/highlighted to that row's current or default time slot (reuse existing quick-schedule drawer logic in `timeline-planner.tsx`/`timeline-drag.ts` if a non-drag scheduling entry point already exists there — check `setQuickScheduleOpen` in `timeline-drag.ts` before building new UI). |
| 6 | Feature-flag via `NEXT_PUBLIC_TODAY_AMBIENT_RAIL` — off reverts to the full-width always-visible timeline column exactly as Sessions 1–6 left it. |
| 7 | `npm run build && npm run lint` → commit → push → **ask founder to approve merge to `main`**. |

### Verification

| Check | Expected |
|-------|----------|
| Idle Today | Thin rail visible at right edge with now-line and block silhouettes, timeline column is no longer full-width |
| Press `T` | Full planner overlay opens with drag-to-schedule, dims background, Esc closes |
| No events today | Rail shows bare now-line only, no error |
| `S` on a queue row | Opens overlay in scheduling context for that item |
| Feature flag off | Full-width timeline column restored exactly as before |
| 1024px half-screen | Rail hides entirely per V3 §4 responsive wireframe (verify in Session 11's manual matrix) |

**Stop/fail if**

- Overlay duplicates data-fetching instead of reusing `workplace-page-content.tsx` state.
- `timeline-planner.tsx` internals are refactored (tripwire violation) — only wrapper/visibility logic should change.
- Build or lint fails.

**Rollback:** disable feature flag; revert merge on `main` if needed.

---

## Session 9 — Close-day terminal state + carry-forward

**Type:** `engineering`
**Goal:** Evening NOW slot becomes the close-day panel — pre-filled with real data, two reflection prompts, carry-forward review of open items, skippable, resurfacing once next morning then silent.
**Time:** 3–4 hours
**Prerequisites:** Sessions 5, 6 on `main` **and founder approval of decision-log entries #1 (reflection-as-terminal-state), #3 (see appendix)**.
**Maps to:** V3 §4 "Reflection," §5 "Reflection pending (evening)"; PRINCIPLES #16, #18
**Merge bundle:** B4 (gated)

### Current code reality

| Area | File | Behavior today |
|------|------|------------------|
| Reflection sidebar | `src/contexts/global-right-sidebar-context.tsx` `openReflection()`, `sidebar-reflection-panel.tsx` | Existing sidebar panel with full reflection fields — remains as the "escape hatch" per V3 §4, not replaced |
| Reflection recommendation | `dashboard-command.ts` | Already returns `type: "reflection"` when all tasks/habits done and no reflection exists — the trigger condition already exists |
| Carry-forward | none | No existing mechanism to review/carry/drop open items at day end |
| NOW slot | `today-now-slot.tsx` (Session 4) | Currently renders a "teaser" for `type: "reflection"` — this session builds the real panel behind it |

### Numbered steps

| # | Step |
|---|------|
| 1 | Extend `getNextActionRecommendation`'s day-state detection: add an explicit "evening" condition (e.g. local time past a configurable threshold, default 6pm, or all-done regardless of time) distinct from the existing all-done reflection trigger, matching V3 §4 header day-state word ("Winding down"). Keep this in `dashboard-command.ts` alongside the existing cascade — do not create a parallel state machine. |
| 2 | Build `src/components/today/today-close-day-panel.tsx` rendered by `today-now-slot.tsx` when `nextAction.type === "reflection"` (replacing the Session 4 teaser): shows "Done today: N tasks · M habits · P sessions" (reuse `data.progress` already fetched in `today-page-content.tsx`), two prompts (what went well / what to change — reuse existing reflection field model from `sidebar-reflection-panel.tsx`, do not invent new fields), and a carry-forward list of open (incomplete, scheduled-today) tasks with per-item Carry/Drop actions. |
| 3 | "Close day" action persists the reflection via the same save path `sidebar-reflection-panel.tsx` uses (locate and reuse, per P#17 "one save behavior") and applies carry-forward decisions: Carry = `scheduled_date` → tomorrow (reuse `getTomorrowDateString` + `updateTask`, same as `handleMoveToTomorrow` in `workplace-page-content.tsx`); Drop = leave as-is (still shows in Missed later, user's explicit choice per V3 §8 month-6 mitigation "carry-forward forces a daily decision"). |
| 4 | Skippable via Esc — dismiss using the Session 2 dismiss-key mechanism, but with a **day-scoped** key (not session-scoped) so it resurfaces once the next morning as "Yesterday unclosed?" (V3 §4 close-day panel row) then goes silent — implement via a `localStorage` date-keyed dismiss rather than Session 2's `sessionStorage`, since this must survive a browser restart overnight. |
| 5 | Silence state: when `allTasksDone && allHabitsDone && reflection` (already closed), NOW slot renders nothing (reuse the Session 4 `empty`-type null-render path) — "All clear. Nothing needs you." copy per V3 §4 wireframe, with two quiet actions (Close the day / + add something) only when NOT yet closed; once closed, truly nothing. |
| 6 | `npm run build && npm run lint` → commit → push → **ask founder to approve merge to `main`**. |

### Verification

| Check | Expected |
|-------|----------|
| Evening, tasks/habits done, no reflection | NOW slot shows close-day panel pre-filled with today's real counts |
| Carry an open task | Task's `scheduled_date` moves to tomorrow; visible there next day |
| Drop an open task | Stays scheduled today, unchanged (will show as Missed/carried-manually) |
| Close the day | Reflection persists; NOW slot goes silent (all-clear, no panel) |
| Skip (Esc) | Panel dismissed for today; reappears tomorrow morning once, then silent if skipped again |
| Reflection escape hatch | Existing sidebar reflection still fully reachable and functional |

**Stop/fail if**

- Reflection save uses a different persistence path than the sidebar (violates P#17 one save behavior).
- Carry-forward silently loses a task (must always end up somewhere visible).
- Build or lint fails.

**Rollback:** revert merge on `main`.

---

## Session 10 — Typography/motion pass + density picker retirement

**Type:** `engineering`
**Goal:** Apply the V3 §4 strict 4-step type scale and motion rules across NOW/NEXT/morph/rail; retire the manual density picker behind a flag now that state-driven density (silence/queue-cap/morph) has shipped in Phases A–C.
**Time:** 3 hours
**Prerequisites:** Sessions 6, 7, 8, 9 on `main`.
**Maps to:** V3 §4 "Motion, typography, density, responsive"; PRINCIPLES #22 (frozen until validated — this is workflow-adjacent polish tied directly to the shipped state machine, not decorative)
**Merge bundle:** B5

### Current code reality

| Area | File | Behavior today |
|------|------|------------------|
| Density picker | `src/components/today/today-status-rail.tsx` `DropdownMenu` (Full/Work/Focus) | User-facing dropdown in the header — the exact "meta-decision about decisions" V3 §3 flags for removal |
| Density storage | `src/lib/workplace-density.ts` | `full \| work \| focus`, localStorage-backed, still needed internally to drive Phase C's flags (morph, rail, unified queue) even if the picker UI disappears |
| Typography | scattered across `today-*.tsx`, `workplace-*.tsx` | No single documented type scale; V3 §4 specifies NOW title ~20px semibold > running timer (display, tabular) > queue rows 14px > chrome 12px muted |

### Numbered steps

| # | Step |
|---|------|
| 1 | Confirm the decision-log entry retiring the density picker (appendix #5) is **approved and merged to `main`** before doing step 2 — this is a hard gate per the runbook's own rules. |
| 2 | In `today-status-rail.tsx`, remove the density `DropdownMenu` from the rendered header. Keep `readWorkplaceDensity`/`writeWorkplaceDensity` and the `full/work/focus` type as **internal** state now driven by: `full` retained only as a hidden power-user override reachable via a keyboard shortcut (e.g. `Ctrl+Shift+F` cycling density) per the V3 §12 "Kill density picker" decision's own reconsider clause ("returns as a keyboard-only toggle if alpha users ask >2×") — ship the keyboard override from day one since this runbook already anticipates that ask, rather than waiting for a second regression cycle. |
| 3 | Audit and align type scale: NOW slot title → `text-xl font-semibold` (~20px); running timer in the morph → keep existing large `font-mono` display treatment; NEXT queue rows → confirm `text-[14px]`; header/chrome chips → confirm `text-[12px]` muted. Make small class corrections only where a component clearly deviates — this is not a redesign pass. |
| 4 | Verify all state-change transitions (NOW slot cross-fade, morph mount/unmount, disclosure expand/collapse) respect `prefers-reduced-motion` — add the media-query guard anywhere still missing it (check via `@media (prefers-reduced-motion: reduce)` Tailwind variant `motion-reduce:transition-none`). |
| 5 | Update `FEATURE_INVENTORY.md`: "Workplace density presets" row → "Superseded — state-driven density (V3); manual full-density override remains via keyboard shortcut only, no UI picker." |
| 6 | `npm run build && npm run lint` → commit → push → **ask founder to approve merge to `main`**. |

### Verification

| Check | Expected |
|-------|----------|
| Header | No density dropdown visible |
| `Ctrl+Shift+F` | Cycles to Full density override (KPI strip, if still meaningful post-V3, or removed entirely per decision-log — confirm against appendix #5 final wording) |
| Reduced-motion OS setting | All V3 transitions become instant, no animation |
| Type scale spot-check | NOW title, queue rows, chrome text visually match the 4-step hierarchy |

**Stop/fail if**

- Density picker removed without the decision-log entry being merged first.
- Any remaining hover-gated or motion-only-discoverable control introduced by this pass (must stay P#10-compliant).
- Build or lint fails.

**Rollback:** revert merge on `main`; re-enable picker dropdown as an emergency fallback if state-driven density misbehaves in production.

---

## Session 11 — Migration overlay + full manual test matrix gate

**Type:** `engineering`
**Goal:** Ship the "Day 1" migration aid (first-run overlay mapping old regions to new keys) and run the full manual test matrix (below) as the release gate for the whole runbook.
**Time:** 3 hours
**Prerequisites:** Session 10 on `main`.
**Maps to:** V3 §8 "Day 1" failure analysis; PRINCIPLES #20, #21
**Merge bundle:** B5

### Current code reality

| Area | File | Behavior today |
|------|------|------------------|
| Onboarding | `FEATURE_INVENTORY.md` "Onboarding | Not built" | No existing first-run overlay pattern to extend — this is genuinely new, small UI |
| Keyboard grammar | `src/hooks/use-global-shortcuts.ts` | 4 shortcuts pre-runbook; by Session 11 has grown to include `N`, `F`, `T`, `S`, `Esc`, dismiss, density override — needs a single reference surface |

### Numbered steps

| # | Step |
|---|------|
| 1 | Build a minimal `src/components/today/today-migration-overlay.tsx`: a one-time (localStorage-flagged, `flowos.today.v3-migration-seen`) dismissible card shown on first Today load after this runbook ships, mapping old→new: "Timeline column is now the rail — press T for the full view," "Focus card is now a mode — press F or use a queue row," "Density picker is now automatic — Ctrl+Shift+F for manual override." Single dismiss ("Got it") permanently hides it. |
| 2 | Add a `?` or small help affordance in the header (reuse `TodayEscapeLink` pattern) that re-opens a static keyboard-grammar reference (N, F, C, S, T, Enter, Esc, j/k) — a simple popover listing shortcuts, not a new full page. |
| 3 | Implement `j`/`k` queue navigation if not already covered by a prior session (check Session 5/6 — if row focus/keyboard nav wasn't built, add minimal `j`/`k` to move a "focused row" indicator up/down the NEXT queue, `Enter` opens details, `C` completes, matching V3 §4 keyboard grammar table). |
| 4 | Run the full **Manual test matrix** below against production. Fix any FAIL before proceeding — do not mark Session 11 done with open failures. |
| 5 | `npm run build && npm run lint` → commit → push → **ask founder to approve merge to `main`**. |

### Verification

Run the Manual test matrix (below) in full. **Gate:** all rows PASS before Session 12 begins.

**Stop/fail if**

- Any matrix row fails and is not fixed within this session (extend the session rather than deferring silently).
- Build or lint fails.

**Rollback:** revert merge on `main`.

---

## Session 12 — Metric instrumentation + inventory/masterplan reconciliation

**Type:** `engineering`
**Goal:** Wire the V3 §9 success metrics (or the minimum measurable subset), and formally reconcile `FEATURE_INVENTORY.md` + the masterplan against what actually shipped.
**Time:** 3 hours
**Prerequisites:** Session 11 on `main` (matrix gate passed).
**Maps to:** V3 §9; GATES.md WAD/D7 definitions; PRINCIPLES #12
**Merge bundle:** B5

### Current code reality

| Area | File | Behavior today |
|------|------|------------------|
| Metrics | none dedicated | No event logging for dismiss rate, capture latency, or NOW-slot acceptance exists today — this is genuinely new instrumentation, scoped minimally |
| Masterplan WPs | `docs/strategy/execution-masterplan.md` Step 4 | WP-2.1–2.5 describe the pre-V3 "Home merge" shape; this runbook has extended/superseded parts of it — the masterplan itself is **not edited** (reference only per this runbook's authority section) but `FEATURE_INVENTORY.md` must reflect final reality |

### Numbered steps

| # | Step |
|---|------|
| 1 | Add lightweight client-side event logging (reuse whatever the codebase's existing analytics/telemetry primitive is — check for a `lib/analytics.ts` or similar before adding a new dependency; if none exists, a minimal `console`-gated + Supabase table `today_events(event_type, entity_type, entity_id, created_at, user_id)` is enough for founder-only M2 alpha) for: NOW-slot shown, NOW-slot acted, NOW-slot dismissed-unread (dismissed without action within N seconds), focus session started (source: NOW/F-key/queue-row), reflection/close-day completed. |
| 2 | Do **not** build a dashboard for these metrics in this session — a SQL query set (per masterplan WP-3.2 precedent) documented in this runbook's Appendix or a short `docs/execution/ops/` note is sufficient at founder-only scale. |
| 3 | Update `FEATURE_INVENTORY.md`: rewrite the "Target navigation," "Workplace sub-features," and "Dashboard sub-features" sections to reflect the shipped V3 state (NOW slot, NEXT queue, ambient rail, close-day terminal state, retired density picker, habits interleaved) — this is a factual sync, not new planning. |
| 4 | Add one consolidated decision-log entry: "2026-07-XX — Today V3 Day Engine shipped (Sessions 1–12)" summarizing what changed vs. the M2 masterplan's WP-2.1–2.5 assumptions, explicitly marking those WPs as "satisfied and extended by this runbook." |
| 5 | `npm run build && npm run lint` → commit → push → **ask founder to approve merge to `main`**. |

### Verification

| Check | Expected |
|-------|----------|
| Trigger a NOW-slot action | Event recorded (spot-check via Supabase table or log) |
| Complete a close-day | Event recorded |
| `FEATURE_INVENTORY.md` | Reads accurately against the live `/` experience |
| Decision-log | New consolidated entry present, links back to this runbook |

**Stop/fail if**

- Instrumentation introduces a new required third-party dependency (out of scope — keep it minimal/first-party).
- `FEATURE_INVENTORY.md` update contradicts the actual shipped UI (verify against production, not against this runbook's intent).

**Rollback:** revert merge on `main`. Runbook is complete once this session merges.

---

## Required decision-log entries (founder approval before Phase C)

These are **drafts** for the founder to review, edit, and copy into [decision-log.md](../logs/decision-log.md) using its standard template. Sessions 6–9 (Phase C) are **blocked** until the entries below are approved and merged — Sessions 1–5 (Phases A–B) do **not** require this approval; they proceed under existing M2/masterplan authority.

### 1. 2026-07-XX — Habits interleaved into Today NEXT queue (retires standalone Habits card on Today)

**Context:** V3 greenfield design (§3, §4) argues a separate Habits card implies habits are a different kind of work than tasks, contradicting "one continuous day" (P#5). The 2026-07-03 decision "Focus reframed as mode, not page" established the precedent of collapsing a standalone surface into the unified Today flow; this extends the same logic to habits.
**Decision:** Habits card is removed from the default Today grid. Due-today habits render as NEXT queue rows (HABIT glyph + streak), ordered by the same schedule → priority → age engine as tasks. `WorkplaceHabitsCard` remains fully functional at `/habits` for management.
**Alternatives rejected:** Keep habits as a separate card but visually demoted (splits attention without solving the "different kind of work" framing problem); build a toggle between "unified" and "separate" views (adds a second density-picker-style meta-decision, which V3 explicitly argues against).
**Outcome:** Pending Session 6 implementation, feature-flagged (`NEXT_PUBLIC_TODAY_UNIFIED_QUEUE`), reconsider if habit completion rate drops >20% post-launch (V3 §12).
**Related:** [today-v3-greenfield-design.md](../../review/design/today-v3-greenfield-design.md) §3, §4; this runbook Session 6.

---

### 2. 2026-07-XX — Timeline column demoted to ambient rail with T-overlay (extends "Focus reframed as mode")

**Context:** The full-width timeline column on Today competes visually with execution content every visit, even though most days don't require active scheduling. The shipped planner (`timeline-planner.tsx`) is valuable and stays — only its default visibility on Today changes.
**Decision:** Today's default timeline presentation becomes a thin ambient rail (now-line, block silhouettes, next-event tick). The full `TimelinePlanner` (unchanged internally) opens as a full overlay on the `T` key or rail click/hover.
**Alternatives rejected:** Keep the full-width column and only shrink habits/tasks (doesn't reduce cognitive load per V3 §6 cognitive load audit — ambient rail scores "peripheral, 0 decisions, 0s read time" vs. the column's "full third column" cost); refactor `timeline-planner.tsx` into a smaller component (violates the masterplan's monolith-split tripwire — not triggered yet).
**Outcome:** Pending Session 8 implementation, feature-flagged (`NEXT_PUBLIC_TODAY_AMBIENT_RAIL`), reconsider for calendar-heavy users at alpha (V3 §12).
**Related:** [today-v3-greenfield-design.md](../../review/design/today-v3-greenfield-design.md) §3, §4; this runbook Session 8; masterplan Step 3 monolith tripwire.

---

### 3. 2026-07-XX — Focus becomes a full page-morph state (extends 2026-07-03 "Focus reframed as mode, not page")

**Context:** The 2026-07-03 decision moved the running timer off `/focus` onto Today as "a mode." In practice it remained a grid card, present (idle or running) at all times — still consuming permanent hero pixels for a state that is usually not happening (V3 §3, §6). V3 argues the idle timer is "the single largest waste of hero pixels" in both prior designs.
**Decision:** Starting a focus session morphs the entire Today page (chrome dims, timer becomes the largest object, Pause/Break/Stop always visible, one "on deck" line). Idle state renders **no** timer chrome — only the `F` key, NOW slot's focus action, and per-row Start affordances.
**Alternatives rejected:** Keep the always-present card but shrink it further when idle (doesn't reach zero-hero-pixels, still a permanent region competing for attention); make the morph a route change to `/focus` (reverts the exact 2026-07-03 decision this entry extends — rejected on that basis alone).
**Outcome:** Pending Session 7 implementation, feature-flagged (`NEXT_PUBLIC_TODAY_FOCUS_MORPH`), reconsider if session starts/day fall below current baseline (V3 §12).
**Related:** [decision-log.md](../logs/decision-log.md) 2026-07-03 "Focus reframed as mode, not page"; [today-v3-greenfield-design.md](../../review/design/today-v3-greenfield-design.md) §3, §4; this runbook Session 7.

---

### 4. 2026-07-XX — Reflection becomes the day's terminal NOW state (extends sidebar/modal reflection, does not remove it)

**Context:** Reflection currently lives in three places (sidebar panel, focus-end modal, next-action nudge) with no architectural "the day isn't done until this" moment (P#16, #18 partially satisfied per executive review score 7/10 shipped vs. ChatGPT's 4/10 chip regression). V3 argues reflection should be the day's terminal state, referencing real data, not a parallel surface competing with execution.
**Decision:** In the evening (or once all tasks/habits are done), the NOW slot becomes a close-day panel: pre-filled data summary, two prompts, carry-forward review, skippable, resurfaces once the next morning then goes silent. The sidebar reflection panel remains as the explicit "escape hatch" for reflecting outside this flow (V3 §4 region inventory) — it is not removed.
**Alternatives rejected:** Reduce reflection to a status chip (explicitly the ChatGPT mockup's regression, scored 4/10 in the executive review — rejected on that evidence); make close-day a modal (violates P#9 inline-before-modal).
**Outcome:** Pending Session 9 implementation, no feature flag needed (additive to existing sidebar/modal paths, low regression risk — see Risk section for rationale).
**Related:** [today-executive-review.md](../../review/design/today-executive-review.md) §5 reflection scoring; [today-v3-greenfield-design.md](../../review/design/today-v3-greenfield-design.md) §4; this runbook Session 9.

---

### 5. 2026-07-XX — Retire the manual density picker (Full/Work/Focus dropdown); density becomes state-driven

**Context:** The 2026-07-05 decisions ("Today next-action hidden by default," "Full density: smart coach," "Full density: merge chrome") built three-tier manual density as the answer to chrome overload. V3 argues (§3, §12) that manual density is itself "an admission the page doesn't know what matters" — a meta-decision about decisions, listed as Anti-pattern #10 ("user-configurable layout ... outsources design to the user and bills them a meta-decision daily"). By Phase C, state-driven behaviors (NOW-slot silence, queue cap, focus morph, ambient rail) already deliver the calm/dense contrast the picker existed to provide.
**Decision:** Remove the density dropdown from the Today header. Density becomes fully derived from day-state (silence when clear, queue cap + disclosures under load, morph during focus). A keyboard-only override (`Ctrl+Shift+F`, cycling to a "Full" power-user view) ships immediately per V3 §12's own reconsider clause, rather than waiting for a second user complaint to re-add it.
**Alternatives rejected:** Keep the picker but hide it in a submenu (still a meta-decision, just harder to find — doesn't address the underlying anti-pattern); remove the picker with no override at all (V3 §12 itself flags this risk and pre-approves a keyboard toggle as the correct middle ground).
**Outcome:** Pending Session 10 implementation. This entry **explicitly supersedes** the three 2026-07-05 density entries for their density-picker-UI aspects; their next-action-visibility and chrome-consolidation reasoning remains valid and is carried forward into the NOW slot (Sessions 1–4).
**Related:** [decision-log.md](../logs/decision-log.md) three 2026-07-05 entries; [today-v3-greenfield-design.md](../../review/design/today-v3-greenfield-design.md) §3, §12; this runbook Session 10.

---

## Governance alignment

### Principles mapping

| Principle | Sessions | How satisfied |
|-----------|----------|----------------|
| #2 One obvious next action | 1, 2, 4 | NOW slot is the literal, promoted implementation |
| #4 Open → act < 5s | 1, 4, 11 | Silence/promotion removes scan cost; migration overlay preserves it during transition |
| #7 Reduce clicks | 5, 8 | Queue cap + disclosures avoid scroll; ambient rail avoids a permanent large region needing no interaction |
| #9 Inline before modal | 5, 9 | Session-end reflection line and close-day panel both render inline, not as modals |
| #10 Visible before hover | 3, 7 | Un-gated timer controls (3); morph keeps them always-visible (7) |
| #16 Reflection improves tomorrow | 5, 9 | Inline session-end line + close-day terminal state with carry-forward |
| #18 Close the loop with data | 9 | Close-day panel pre-filled with real task/habit/session counts |

### FEATURE_INVENTORY.md updates required per session

| Session | Inventory rows touched |
|---------|------------------------|
| 3 | "Focus timer card" status note |
| 6 | "Habits card" — interleaved, not removed |
| 7 | "Focus timer card" — page-morph note; idle card retired |
| 8 | "Timeline embed" — ambient rail + overlay note |
| 9 | "Reflection sidebar" — terminal state added, dual-save note resolved |
| 10 | "Workplace density presets" — superseded by state-driven density |
| 12 | Full IA/target-navigation section rewrite |

### Masterplan WP disposition

| WP | Disposition |
|----|--------------|
| WP-2.1 Home merge | **Satisfied**, then extended past its original "grid + KPI + next-action card" shape by Sessions 4–9 |
| WP-2.2 Routing truth | **Satisfied and preserved** — every in-place action pattern (`inPlaceAction`, scroll anchors) carries forward unchanged into the NOW slot and NEXT queue |
| WP-2.3 Nav reduction | **Unaffected** — this runbook does not touch `sidebar-navigation.tsx`; 5-item nav stands |
| WP-2.4 Visible focus controls | **Satisfied** in Session 3, then **superseded** by Session 7's full morph (controls remain visible, presentation changes) |
| WP-2.5 Inline capture | **Preserved and extended** — `WorkplaceQuickAddRow` remains the capture mechanism; Session 11 adds the `N` global keyboard entry point on top of it |
| Phase 3.3 split (masterplan Step 3) | **Fully executed** — "always-visible timer" (M2/Session 3) and "`/focus` page reframe" (unaffected, still history/analytics) both land as originally split |
| Phase 3.4 Planning simplification | **Not touched** — remains masterplan M4/conditional; this runbook does not pick a default scheduling surface, it only changes Today's default *visibility* of the existing planner |

---

## Top execution risks

| # | Risk | Impact | Mitigation |
|---|------|--------|------------|
| 1 | Phase C ships without founder approval of the decision-log appendix, retiring shipped UX (habits card, density picker, idle focus card) without sign-off | High — trust and rollback cost | Session dependency table hard-gates Sessions 6–9 on approval; this is enforced in the Resume protocol, not just documented |
| 2 | `timeline-planner.tsx` monolith gets touched beyond wrapper/visibility logic during Session 8, triggering the masterplan's split tripwire mid-runbook | Medium — could balloon Session 8 past budget | Session 8 steps explicitly forbid internal refactors; if a genuine need arises, stop and split the file as its own out-of-band session per the tripwire rule, do not silently absorb it |
| 3 | Feature flags (`unified queue`, `focus morph`, `ambient rail`) accumulate without a plan to remove them, becoming permanent branching complexity | Medium — code health | Session 12 is the natural checkpoint to flip all three to always-on and delete flags once Session 11's test matrix has passed in production for a stated dogfood period (recommend: flags live until the founder's next weekly review after Session 12, then removed in a `tweak/` cleanup) |
| 4 | Habit completion rate regresses after interleaving (Session 6) because habits lose their previously-dedicated visual space | Medium — directly named as V3's own reconsider trigger | Feature flag allows instant rollback; Session 12's instrumentation should track habit completion rate explicitly, not just NOW-slot metrics |
| 5 | Founder dogfooding time (per masterplan Step 6 weekly budget) gets consumed entirely by this runbook's 12 sessions, crowding out M3 recruiting (WP-2.8), which the masterplan flags as the single most schedule-risky item in the whole plan | High — company-level, not just Today-level | This runbook does not override the masterplan's recruiting priority; if a week's actuals show recruiting slipping because of Today V3 work, pause the runbook (safe at any session boundary per the Resume protocol) rather than the reverse |

---

## Feature-flag strategy

| Flag | Sessions gated | Default | Removal plan |
|------|-----------------|---------|----------------|
| `NEXT_PUBLIC_TODAY_UNIFIED_QUEUE` | 6 | off until Session 6 merges, then on | Remove after one dogfood week post-Session 12 with no habit-completion regression |
| `NEXT_PUBLIC_TODAY_FOCUS_MORPH` | 7 | off until Session 7 merges, then on | Remove after one dogfood week post-Session 12 with no session-count regression |
| `NEXT_PUBLIC_TODAY_AMBIENT_RAIL` | 8 | off until Session 8 merges, then on | Remove after one dogfood week post-Session 12; keep the flag longer if calendar-heavy days feel worse (V3 §12 explicit reconsider trigger) |
| Density picker keyboard override (`Ctrl+Shift+F`) | 10 | always on (not a flag — a permanent, intentionally minimal escape hatch per decision-log entry #5) | N/A — this is the permanent replacement, not a rollback path |

No flag is a boolean guess — each is tied to a named V3 §12 reconsider trigger so "when do we remove this" has a pre-committed answer instead of becoming permanent scaffolding.

---

## Per-phase rollback plan

| Phase | Rollback mechanism |
|-------|----------------------|
| A (Sessions 1–3) | Revert merge on `main` per session — no flags needed, each change is small and independently revertible |
| B (Sessions 4–5) | Revert merge on `main`; Session 4's NOW slot and Session 5's queue cap are structural but additive — reverting restores the Session 1–3 rail-chip presentation exactly |
| C (Sessions 6–9) | Feature flags (6, 7, 8) provide instant toggle-off without a deploy; Session 9 (close-day) has no flag but is additive to existing reflection paths, so reverting the merge is sufficient and low-risk |
| D (Sessions 10–12) | Session 10's density-picker removal is the only genuinely hard-to-reverse step (deletes user-facing UI) — gated on its own decision-log approval and shippable with the picker re-enabled as an "emergency fallback" per Session 10's stop/fail row; Sessions 11–12 are additive (overlay, instrumentation, docs) and trivially revertible |

---

## Manual test matrix

Run in full during Session 11 (gate for Session 12); re-run any relevant rows after later `tweak/` changes to Today.

| # | Scenario | Setup | Action | Expected | Pass/Fail |
|---|----------|-------|--------|----------|-----------|
| 1 | Morning triage | Tasks + habits pending, none started | Load `/` | Header shows "Morning"-style day-state word; NOW slot shows top recommendation; NEXT queue capped at 5 | ☐ |
| 2 | Midday executing | Some tasks done, one imminent scheduled item | Load `/` | NOW slot prefers the imminent (≤15m) item over a generic recommendation | ☐ |
| 3 | Deep focus morph | Start a focus session | Observe transition | Page morphs within ~300ms; chrome dims; Pause/Break/Stop visible with no hover; idle card never shown | ☐ |
| 4 | Evening close-day | All tasks/habits done, evening time, no reflection | Load `/` | NOW slot is the close-day panel, pre-filled with real counts | ☐ |
| 5 | All-clear silence | All tasks/habits done, reflection already closed | Load `/` | NOW slot renders nothing; no card, no placeholder | ☐ |
| 6 | 1024px half-screen | Resize viewport to ~1024px or split-screen laptop | Load `/` | Ambient rail hides; NOW slot truncates to one line; queue rows truncate chips; no reflow into a different grammar | ☐ |
| 7 | Active focus + capture | Focus session running | Press `N`, type a thought, Enter | Task created silently to inbox; timer view uninterrupted | ☐ |
| 8 | Dismiss + state change | NOW slot showing a task recommendation | Dismiss it, then complete that task via the queue | NOW slot updates to the next recommendation (does not stay dismissed/stuck) | ☐ |
| 9 | Heavy workload | 20+ open tasks today | Load `/` | Queue still caps at 5 + "N more" disclosure; NOW slot may add an overload hint; nothing auto-reschedules | ☐ |
| 10 | Habit interleave | Habit due at a specific time, tasks also pending | Load `/` | Habit row appears in NEXT queue with HABIT glyph + streak, ordered correctly relative to tasks | ☐ |
| 11 | Ambient rail → overlay | Idle Today, rail visible | Press `T` | Full `TimelinePlanner` opens as overlay with drag-to-schedule intact; Esc closes | ☐ |
| 12 | Keyboard grammar | Idle Today | Try `N`, `F`, `C`, `S`, `T`, `Enter`, `Esc`, `j`/`k` in sequence | Each performs its documented action; no conflicts with browser/OS shortcuts | ☐ |
| 13 | Reduced motion | OS `prefers-reduced-motion: reduce` enabled | Trigger NOW-slot change, focus morph, disclosure expand | All transitions become instant, no animation | ☐ |
| 14 | Migration overlay | First load after Session 11 ships (clear `flowos.today.v3-migration-seen`) | Load `/` | Overlay explains old→new mapping once; dismiss persists | ☐ |
| 15 | Feature flags off | Set all three V3 flags to off | Load `/` | Today behaves exactly as Session 5 left it (task-only queue, full-width timeline, inline focus card) | ☐ |

**Gate:** All applicable rows **PASS** before Session 12 begins.

---

## Decision points (founder forks — max 5)

| # | Decision | Options | Runbook default |
|---|----------|---------|-----------------|
| 1 | Kill density picker vs. keep keyboard-only override | (A) Remove entirely, no override (B) Remove UI, keep `Ctrl+Shift+F` override (C) Keep the dropdown | **(B)** — decision-log entry #5; V3 §12 itself pre-approves a keyboard toggle if requested, so ship it day one rather than waiting for the ask |
| 2 | Habits interleave timing | (A) Phase B preview (partial interleave alongside separate card) (B) Phase C full interleave, card removed (C) Never interleave, keep separate card | **(B)** — matches V3 §3/§4 exactly; a "preview" middle state adds a fourth density-picker-style toggle the design explicitly argues against |
| 3 | Focus morph vs. enhanced card interim | (A) Full page morph (Session 7 as written) (B) Enhanced idle-visible card with larger running-state typography, no page morph (C) Skip morph, keep M2 card indefinitely | **(A)** — V3 §3/§6 name the idle hero timer as the single largest pixel-waste in both prior designs; an "enhanced card" interim does not remove that cost, it just resizes it |
| 4 | Right sidebar fate during focus morph | (A) Sidebar dims/de-emphasizes but stays reachable (runbook default, Session 7 step 3) (B) Sidebar fully hides during morph, re-summonable via existing hover/expand controls (C) Sidebar unaffected, full opacity throughout morph | **(A)** — balances V3's "chrome dims" instruction with P#3 (one screen before many, but escape hatches must stay reachable) |
| 5 | Close-day skippable vs. soft-required | (A) Fully skippable via Esc, resurfaces once next morning then silent (runbook default, Session 9 step 4) (B) Soft-required — cannot fully dismiss until day count resets, gentle repeat nudge (C) Hard-required modal block | **(A)** — matches V3 §4 region inventory exactly ("Skippable (Esc) — reappears once next morning as 'Yesterday unclosed?' then goes silent"); (C) violates P#9 inline-before-modal outright |

Record founder overrides in [decision-log.md](../logs/decision-log.md), referencing this runbook.

---

## Out of scope

Explicitly not touched by Sessions 1–12, regardless of masterplan M2 packaging:

- NLP command bar as primary capture (V3 §11 Anti-pattern #1; masterplan M4-conditional)
- Auto-rescheduling / Motion-style scheduling engine (V3 §11 Anti-pattern #4; rejected outright per decision-log 2026-07-03-era reasoning, not just deferred)
- Command palette as product identity (V3 §4 "Left module sidebar," §13 future vision; M4 chrome-only per PRINCIPLES defer queue — may appear as a thin utility later, never as Today's identity)
- Adaptive low-energy / meeting-dense engine behaviors (V3 §5) until telemetry from Session 12's instrumentation exists — this is the "Future vision" tier of V3 §13, not this runbook's job
- Sidebar collapse to icon rail (V3 §3 "Left module sidebar") — a separate, smaller decision not required for the Day Engine's core loop; candidate for a future `tweak/` session
- Any change to `/tasks` kanban, `/focus` history page, `/schedule` full page, `/habits` management page, or `/notes` beyond the thin hooks explicitly named in Sessions 6, 8, 9 (habit anchor reuse, planner overlay reuse, reflection save-path reuse)
- Engine "learning" from skip/pin patterns (V3 §13 future vision) — out of scope until the static NOW slot cascade has run long enough to generate that data
- Monolith splits of `timeline-planner.tsx` or `tasks-board-view.tsx` — masterplan tripwire remains the only trigger

---

## Explicitly deferred

| Item | When / trigger |
|------|-----------------|
| Right sidebar hover-reveal accessibility fix | Separate audit — noted in Session 3 step 3 but not fixed here; candidate `tweak/` session |
| Pin-to-override-engine-order on NEXT queue rows (V3 §8 "pinning a queue row overrides the engine visibly") | Pull when Session 12 telemetry shows the engine's top-pick is frequently wrong (dismiss-unread rate high) |
| Meeting-dense rail widening (V3 §5) | After ≥ 2 alpha users with calendar-dense days report the rail as too thin |
| Low-energy detection (V3 §5, §11 Anti-pattern implicit) | 3 months of skip-pattern telemetry per V3 §12 |
| Weekly-reflection auto-summary (FE-5) | Unrelated to Today V3; remains masterplan's own backlog item |
| Command palette build-out | M4, per PRINCIPLES defer queue, unless ≥ 2 users ask "how do I find X" sooner |
| Sidebar icon-rail collapse | Pulled only if Today's own chrome reduction makes the 5-item sidebar feel comparatively heavy — no evidence yet |

---

## After runbook complete

1. Update [FEATURE_INVENTORY.md](../../foundation/FEATURE_INVENTORY.md) — done incrementally per session (see Governance alignment table), verify fully synced after Session 12.
2. Merge the five decision-log appendix entries (as approved/edited by the founder) into [decision-log.md](../logs/decision-log.md) — do not leave them living only in this runbook past Phase C approval.
3. Append a [july-log.md](../logs/july-log.md) entry after **each** merge bundle (B1–B5), not just at the end — this runbook spans potentially several weeks and the july-log is the session-by-session memory the git-workflow rule expects.
4. Begin a dogfood/friction-log protocol starting at Phase B (Session 4 merge) through Phase D completion — reuse the existing WP-2.7 dogfooding format (dated, specific: what, when, cost) rather than inventing a new template. Specifically watch: NOW-slot dismiss-unread rate (V3 §9 halt condition: >40% = engine failure alarm) and habit completion rate (V3 §12 reconsider trigger: -20%).
5. Do not rewrite this runbook after Session 12 — if scope changes mid-flight, append a decision-log entry and a dated note at the bottom of this file, per the standard runbook discipline.

---

*End of runbook. Today V3 — the Day Engine — is complete when Session 12 merges, all manual test matrix rows pass in production, and the five decision-log entries above are live. Masterplan M3 (First Strangers) recruiting continues in parallel throughout — per Top execution risk #5, it is never paused for this runbook's sake.*
