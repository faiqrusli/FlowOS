# M2 — Schedule Break Runbook

**Scope:** M2 only — implements the Schedule Break feature captured in [schedule-break-modal-spec.md](../../review/design/schedule-break-modal-spec.md). Does not add, remove, or weaken any M2 exit criterion.
**Authority:** [decision-log.md](../logs/decision-log.md) 2026-07-07 "Schedule Break: flexible focus reminders, not Pomodoro" is the product decision. This runbook does not re-litigate it — see Section 1 for why it stands.
**Repo root:** repository root (Next.js app).
**Production baseline:** https://flowos-sage.vercel.app
**Docs path:** `docs/` (tracked in VCS)
**Idea capture:** [inbox.md](../logs/inbox.md) (Promoted) → this runbook → [july-log.md](../logs/july-log.md) after merge to `main`.

**Note on scope correction:** The original task brief named `src/components/fable-greenfield/fable5-focus-hero.tsx` as the primary UI target. That file/directory does not exist anywhere in git history on this repo (verified via `git ls-files`, `git log --all`). The real production quick-focus surface is `src/components/workplace/workplace-focus-card.tsx`, rendered at `/` via `today-page-content.tsx`. Founder confirmed via question: **`workplace-focus-card.tsx` is the primary (and only) target for this session.**

---

## 1. Product Understanding

**The feature in plain terms:** Schedule Break lets a user, while quick-focusing, say "remind me once I've focused for 60 total minutes, and when I take that break, make it 10 minutes." The app does the counting and the reminding. It never starts or stops anything on its own.

**Intended experience:** A user starts Quick Focus with no plan for breaks (as today). At some point — before starting, or mid-session — they open **Schedule Break**, set a target focus duration and a break length, and go back to work. They forget about it. Later, a reminder appears. They decide, in that moment, whether to act on it. Same at the end of the break.

**Mental model:** "I'm setting a threshold-based alarm on my own focus clock, not handing control to the app." The user should never feel like FlowOS is going to yank them out of flow or force them back to work — every transition (focus→break, break→focus) remains a manual button press, exactly as it is today for the immediate **Break** button.

**Why this fits FlowOS better than Pomodoro:** FlowOS's continuous quick-focus timer already rejects the fixed 25/5 cycle — that's what the separate Pomodoro tab is for, and it's a deliberate, distinct mode. Schedule Break is not a secret Pomodoro clone; it's a *reminder*, not a *scheduler of transitions*. The distinction that matters: a reminder can be ignored with zero consequence to the running timer (focus keeps accruing seconds past the threshold, uninterrupted); a Pomodoro phase expiry actually changes `mode` and starts a new phase automatically (see `handlePomodoroPhaseExpiry` in `focus-session-context.tsx`). Schedule Break must never touch that auto-transition code path.

---

## 2. UX Review

- **Clarity:** The modal's two fields (Break at, Break length) plus one live countdown line is about as low-cognitive-load as a scheduling UI gets. Keep it that way — resist adding "recurring," "notify me twice," etc. in V1.
- **Discoverability:** "Schedule Break" as a second text/icon action next to the existing **Break** button is discoverable without being loud — a user scanning the row of controls will see it once they're in a focus session. Idle-state discoverability (before starting focus) is intentionally not solved in V1 — spec's modal reads "Current Focus" live, which only makes sense with a running session; we gate the entry point to `isFocusing` states only.
- **Simplicity improvement over spec:** the spec's compact "Break in Xm" strip variant and the full three-line strip are two states for the same widget. Building both is unnecessary UI-state surface for V1 — ship the full three-line strip only (label / breakAt / breakLength) and defer the compact countdown variant explicitly (see Section 12 and the out-of-scope note in Session 1 below). This removes a responsive-breakpoint decision from V1 without changing any behavior the founder asked for.
- **Cognitive load at the moment of interruption:** the two notification cards each present exactly two choices (act now / snooze 5). No third "dismiss forever" option — intentional, matches spec's "never auto-dismiss without user action."
- **Interaction flow:** Save always replaces any existing schedule (one schedule per session, per spec) — so "Edit" and "first-time schedule" are the same code path (`setScheduledBreak`), which keeps the modal implementation and mental model simple: there is no separate "update" vs "create" branch.
- **Accessibility:** Dialog gets Base UI's built-in focus trap and Escape-to-close for free. Steppers need explicit `aria-label`s on the ± buttons (value alone is not a label). The hover-reveal Edit/Cancel controls on the Next Break strip must also be reachable via keyboard focus (not hover-only) — implemented by keeping the buttons in the DOM at all times and only using opacity/pointer-events for the hover affordance (matches the existing `TimerHoverControls` pattern in `workplace-focus-card.tsx`, which already does this correctly for Pause/Break/Stop).

---

## 3. User Flow

| # | Flow | Result |
|---|------|--------|
| 1 | Idle (no session) | "Schedule Break" entry point not shown — no session to attach a schedule to. |
| 2 | Focus running, no schedule → open modal | Defaults: Break at = next milestone above current focus minutes; Break length = 10. |
| 3 | Save | Schedule written to session; modal closes; Next Break strip appears. |
| 4 | Focus running, schedule exists → hover strip → Edit | Modal reopens pre-filled with current `breakAtMinutes` / `breakLengthMinutes`. |
| 5 | Edit → change values → Save | Schedule replaced (same 3 fields overwritten, `scheduledAtFocusTime` reset to current focus seconds). |
| 6 | Hover strip → Cancel | Schedule fields cleared; strip disappears; timer session otherwise untouched. |
| 7 | Focus reaches `breakAtMinutes` while focusing (not paused) | "Time for a break" card appears. Focus timer keeps running. |
| 8 | Card → Start Break | Existing `quick.startBreak` runs (unchanged semantics) — mode flips to break, card disappears (condition no longer true because mode ≠ focus). |
| 9 | Card → Snooze 5 min | `breakAtMinutes += 5`; card disappears until new threshold is reached; focus keeps running. |
| 10 | Card ignored entirely | Card stays visible indefinitely (no auto-dismiss timer) until user acts or stops the session. |
| 11 | On break, elapsed break seconds reach `breakLengthMinutes` | "Break finished" card appears. Break keeps accruing in the background. |
| 12 | Card → Resume Focus | Existing `quick.resumeFocus` runs — mode flips to focus, card disappears. |
| 13 | Card → Snooze 5 min | `breakLengthMinutes += 5`; card disappears until new threshold reached. |
| 14 | User stops session (Stop button) at any point | `quick.stopSession()` unchanged — session (and its schedule) is cleared entirely; no orphaned schedule state. |
| 15 | User pauses focus before threshold | Countdown freezes (elapsed focus seconds frozen via existing `paused_segment_seconds`); no card fires while paused. |
| 16 | Browser refresh mid-schedule | `readActiveSession()` rehydrates the extended fields from `localStorage` unchanged — schedule survives refresh automatically (no new persistence code needed, see Section 5). |
| 17 | Schedule a break, then never start one, then stop session | Schedule silently discarded with the rest of the ephemeral session — no orphaned row in the persisted `focus_sessions` table (schedule fields are never sent to Supabase; see Section 7). |

---

## 4. Edge Cases

| Edge case | Resolution |
|---|---|
| Break At set below current focus (via Edit, after time has passed) | Stepper floor is recomputed live from *current* focus minutes on every render, so the visible minimum always tracks forward. If a stale save somehow put `breakAtMinutes` below current focus, `isBreakReady` simply returns `true` immediately — correct behavior, not a bug (the threshold was already passed). |
| User pauses focus mid-schedule | `computeQuickFocusSeconds` already freezes on pause (uses `paused_segment_seconds`); `isBreakReady`/`getRemainingToBreakSeconds` are pure functions of that value, so they freeze too, automatically. No extra pause-awareness needed in the new helpers. |
| Browser refresh | Handled by existing `readActiveSession()`/`localStorage` round-trip; extended fields are plain optional JSON properties. |
| Multiple tabs open | Existing `storage` event listener in `FocusSessionProvider` already re-reads and re-broadcasts the session on any tab's write — schedule fields ride along for free. Two tabs racing to Save at the same instant is last-write-wins, same as every other session field today (no new risk introduced). |
| Notification permission denied | Both new cards are in-app UI (rendered in the React tree), not OS `Notification` calls — they always show regardless of permission. We do *not* call `showBrowserNotification` for these two cards in V1 (spec allows "where appropriate"; in-app card is sufficient and simpler — avoids a second permission-denied edge case entirely). |
| Sleeping computer / tab backgrounded then resumed | `getSegmentElapsedSeconds` computes from `Date.now() - phase_started_at`, i.e. wall-clock diff, not a running JS interval count — so waking up correctly reflects real elapsed time on the next tick. No drift correction needed because there was never a naive `setInterval` counter to drift. |
| System clock changes | Same wall-clock-diff design means a manual clock change mid-session will skew elapsed time exactly as it already does for the un-scheduled timer today — pre-existing behavior, explicitly not in scope to fix here. |
| Timer drift from `setInterval(..., 1000)` | The 1s tick only triggers a re-render; actual elapsed values are always recomputed from timestamps, so drift in the interval firing does not accumulate into the displayed numbers. |
| Focus stopped before a scheduled break fires | `quickStop`/`endSession` clears the whole session (and therefore the schedule) — nothing to reconcile. |
| Editing stepper values while the live countdown re-renders each second | Stepper is a fully controlled input driven by local modal state (`draftBreakAt`/`draftBreakLength`), not by the ticking session — the live "Break in …" text is a separate read-only computed line beneath it. Typing/clicking the stepper never fights the tick. |
| Snoozing multiple times in a row | Each snooze is `breakAtMinutes += 5` (or `breakLengthMinutes += 5`) — idempotent-safe to call repeatedly; no upper bound needed for V1 (a user snoozing 20 times has, by definition, decided not to break yet — respect that). |
| Saving a schedule, then immediately hitting the immediate **Break** button (not through the schedule) | `quickStartBreak` is untouched — mode flips to break exactly as before. The scheduled-break threshold check (`isBreakReady`) simply becomes irrelevant once `mode !== "focus"`; the "ready" card's visibility condition already requires `isFocusing`, so it disappears correctly even though the user didn't click "Start Break" from the card. |
| Break finishes while the "break ready" schedule for a *future* focus block is still set | Not possible in V1 — one schedule slot total, and the fields double as both the pending-reminder threshold (while focusing) and the break-length threshold (while on break); they cannot be "ready" for both interpretations simultaneously because the mode gates which check applies. |
| `breakAtMinutes`/`breakLengthMinutes` present on a **Pomodoro** session (defensive) | All new helpers and the modal only ever operate on `timer_type === "quick"` sessions; Pomodoro sessions never get these fields written. Even if they were present, `focus-session-context.tsx`'s pomodoro branch never reads them. |

---

## 5. State Management

| State | Kind | Lives in |
|---|---|---|
| `breakAtMinutes`, `breakLengthMinutes`, `scheduledAtFocusTime` | Persisted (survives refresh, cross-tab) | `StoredActiveFocusSession` in `localStorage`, same envelope as the rest of the active session — no new storage key. |
| `isBreakReady`, `isBreakFinished`, remaining seconds | Derived | Pure functions in `focus-scheduled-break.ts`, computed from the session + `Date.now()` on every tick — never stored. |
| "which break-related card is showing" (`breakPrompt: "ready" \| "finished" \| null`) | Derived | Computed in `FocusSessionProvider` from `isBreakReady`/`isBreakFinished` + current phase — not its own persisted flag, so there's nothing to desync on refresh (a refresh mid-"ready" state simply recomputes "ready" again from the same threshold math). |
| Schedule-Break modal draft values (stepper positions before Save) | Temporary UI state | Local `useState` inside `ScheduleBreakModal` — discarded on Cancel/close, never touches the session until Save. |
| Whether the modal is open, and whether it's in "edit" mode | Temporary UI state | Local `useState` in `WorkplaceFocusCard` (same pattern as existing `reflectionOpen`). |
| Next Break strip hover-reveal | Temporary UI state | Pure CSS (`group-hover`), no React state — matches existing `TimerHoverControls`. |

No new Supabase table or column. Nothing here is sent to the server — schedule state is purely a client-side enhancement of the already-client-side active session envelope (the persisted `focus_sessions` row on session end only ever stored `focus_seconds`/`break_seconds` totals, which is unaffected).

---

## 6. Component Architecture

```
workplace-focus-card.tsx (existing — quick-focus tab only)
├── ScheduleBreakModal (new — src/components/focus/schedule-break-modal.tsx)
│   ├── NumberStepper × 2 (new reusable — src/components/ui/stepper.tsx)
│   └── InfoTooltip × 2 (new reusable — src/components/ui/tooltip.tsx, thin Base UI wrapper)
├── NextBreakStrip (new — src/components/focus/focus-next-break-strip.tsx)
│   └── (reopens ScheduleBreakModal in edit mode via a callback prop; no import cycle)
└── BreakThresholdNotification (new — src/components/focus/focus-break-notification.tsx)
    (single component, renders either the "ready" or "finished" card body based on a `kind` prop; one card visible at a time by construction — the two conditions are mutually exclusive per Section 4)
```

**Responsibilities**

| Component | Responsibility |
|---|---|
| `schedule-break-modal.tsx` | Owns draft stepper state; reads live focus seconds from context for the "Current Focus" and "Break in …" lines; calls `quick.scheduleBreak()` on Save. No knowledge of where it's opened from. |
| `stepper.tsx` (`NumberStepper`) | Generic ± control: click, hold-to-repeat, min/max clamping, formatted display. No focus-domain knowledge — reusable for any future numeric setting. |
| `tooltip.tsx` (`InfoTooltip`) | Thin Base UI Tooltip wrapper matching the existing `dialog.tsx`/`dropdown-menu.tsx` styling conventions (`flow-surface-elevated`, `data-open`/`data-closed` animation classes). |
| `focus-next-break-strip.tsx` | Presentational: given `breakAtMinutes`/`breakLengthMinutes`/`onEdit`/`onCancel`, renders the label + hover-reveal controls, or nothing if no schedule. Does not read context directly — keeps it trivially testable and reusable if `focus-page-content.tsx` ever wants it. |
| `focus-break-notification.tsx` | Presentational card with two buttons; the *decision* of which card (if any) to show lives in `workplace-focus-card.tsx`, driven by `quick.breakPrompt` from context — keeps the notification component dumb and reusable. |
| `focus-scheduled-break.ts` | All pure math: milestone defaults, remaining-seconds, ready/finished booleans, snooze/save/clear session transforms, formatting. Zero React, zero side effects — fully unit-testable in isolation, mirrors the existing `focus-active-session.ts` convention. |
| `focus-session-context.tsx` (extended, not new) | Owns the single source of truth for `breakPrompt` derivation and exposes the four new actions (`scheduleBreak`, `cancelScheduledBreak`, `snoozeBreakReady`, `snoozeBreakFinished`) alongside existing `quick.*` actions — components never call `focus-active-session.ts`/`focus-scheduled-break.ts` transforms directly, same convention as every existing quick-focus action. |

---

## 7. Data Model

Added to `StoredActiveFocusSession` (all optional/nullable — absence means "no schedule," fully backward compatible with sessions already in a user's `localStorage`):

| Field | Type | Stores | Why |
|---|---|---|---|
| `breakAtMinutes` | `number \| null` | Total accumulated focus minutes at which the "time for a break" reminder should fire. | This is a *duration threshold*, not a wall-clock time — matches the spec's explicit "not wall-clock" requirement, and matches how `computeQuickFocusSeconds` already accounts for pauses/prior break segments. |
| `breakLengthMinutes` | `number \| null` | How many minutes the break should last before the "break finished" reminder fires. | Reused both as the modal's second field and as the break-elapsed threshold once the break starts — one field, two read sites, no duplication. |
| `scheduledAtFocusTime` | `number \| null` | The focus-seconds value at the moment the user hit Save. | Audit trail (when was this scheduled, relative to the session) and a stable snooze/edit baseline — without it, re-opening Edit after time has passed would have no way to show "this was scheduled when you were at 12 minutes" if that's ever wanted (not built in V1, but the field is free to keep and matches the spec's explicit field list). |

No changes to the Supabase `focus_sessions` schema — these fields never leave `localStorage` / the in-memory session; `buildStopPayload`/`buildCompletedPayload` (which shape what gets persisted server-side) are untouched.

---

## 8. Event Timeline

```
Quick Focus starts (existing, unchanged)
        │
        ▼
User opens Schedule Break → sees defaults (milestone table) → adjusts steppers
        │
        ▼
Save → session.breakAtMinutes / breakLengthMinutes / scheduledAtFocusTime written
        │
        ▼
Every 1s tick (existing context interval):
  - Next Break strip re-renders "breakAt / breakLength" (static values — no live math needed here)
  - Modal, if open, re-renders "Break in Xm Ys" from getRemainingToBreakSeconds()
        │
        ▼
computeQuickFocusSeconds(session).focus reaches breakAtMinutes × 60
        │
        ▼
isBreakReady() flips true → quick.breakPrompt becomes "ready" → BreakThresholdNotification card mounts
        │
   ┌────┴─────┐
   ▼          ▼
Start Break   Snooze 5 min
(quick.startBreak,   (snoozeBreakReady → breakAtMinutes += 5,
 mode → break,        card unmounts, focus keeps running,
 card unmounts)        loop repeats from "Every 1s tick")
        │
        ▼
Break running — computeQuickFocusSeconds(session).break climbs
        │
        ▼
break seconds reach breakLengthMinutes × 60
        │
        ▼
isBreakFinished() flips true → quick.breakPrompt becomes "finished" → card mounts
        │
   ┌────┴─────┐
   ▼          ▼
Resume Focus   Snooze 5 min
(quick.resumeFocus,  (snoozeBreakFinished → breakLengthMinutes += 5,
 mode → focus,         card unmounts, break keeps running,
 card unmounts,         loop repeats)
 schedule fields remain on the session — same schedule can fire again only if user re-Saves; V1 does not auto-repeat)
```

---

## 9. Implementation Plan

Each phase is one commit on `m2/session-1-schedule-break`.

| Phase | Goal | Files | Depends on | Test checklist | Expected result |
|---|---|---|---|---|---|
| A | Extend the data model | `src/lib/focus-active-session.ts` | — | `npm run build` compiles; existing sessions in `localStorage` (no new fields) still load via `readActiveSession` | Type extended, zero behavior change for existing flows. |
| B | Pure scheduled-break math | `src/lib/focus-scheduled-break.ts` (new) | A | Manual console checks of milestone table against spec's example rows (0→25, 18→25, 29→45, 46→60, 73→90, 101→120) | All helpers importable, no React, no side effects. |
| C | Reusable stepper + tooltip primitives | `src/components/ui/stepper.tsx`, `src/components/ui/tooltip.tsx` (new) | — | Click ±, hold ~1s and confirm repeat kicks in, release stops; tooltip opens on hover/focus, closes on Escape/blur | Two new `src/components/ui/` primitives, reusable outside focus feature. |
| D | Context wiring | `src/contexts/focus-session-context.tsx` | A, B | `quick.scheduleBreak`, `cancelScheduledBreak`, `snoozeBreakReady`, `snoozeBreakFinished` all present in provider value; `quick.breakPrompt` flips correctly across a manually-shortened threshold in dev tools | Components have everything they need without touching `focus-active-session`/`focus-scheduled-break` directly. |
| E | Schedule Break modal | `src/components/focus/schedule-break-modal.tsx` (new) | C, D | Defaults match milestone table; floor enforced; Enter saves; Escape cancels; focus trapped | Modal fully functional in isolation (can be opened via a temporary dev trigger before wiring step F). |
| F | Wire into `workplace-focus-card.tsx` (entry point + Next Break strip + notifications) | `src/components/workplace/workplace-focus-card.tsx`, `src/components/focus/focus-next-break-strip.tsx` (new), `src/components/focus/focus-break-notification.tsx` (new) | E | Full spec checklist (Section "After runbook complete" below) | Feature live on `/`, Pomodoro tab untouched. |
| G | Build/lint gate + docs | — | F | `npm run build && npm run lint` clean on touched files | Ready for founder review. |

---

## 10. Testing Plan

**Functional**
- [ ] Schedule a break from a fresh session; defaults match the milestone table for at least 3 different starting focus durations.
- [ ] Stepper floor blocks going below `currentFocusMinutes + 5` (Break at) and below 5 (Break length).
- [ ] Save persists all three fields; Cancel discards draft changes without touching the session.
- [ ] Next Break strip shows correct values immediately after Save.
- [ ] Edit reopens with the exact saved values, not the milestone defaults.
- [ ] Cancel (on strip) clears the schedule; strip disappears; no stale card appears afterward.
- [ ] Threshold reached while focusing (not paused) → card appears; ignored → stays; Start Break → dismisses + starts break; Snooze → dismisses + +5.
- [ ] Break-finished threshold reached → card appears; Resume Focus → dismisses + resumes; Snooze → dismisses + +5.
- [ ] Immediate **Break** button still works unchanged, with or without an active schedule.
- [ ] Pomodoro tab: no new UI, no new behavior, unaffected by any of the above.

**UI**
- [ ] Dark-mode semantic tokens only — spot-check no inline hex introduced.
- [ ] Stepper value transitions are visually smooth, not jumpy.
- [ ] Card copy matches spec wording exactly (case, punctuation).

**Keyboard**
- [ ] Tab order flows logically through modal fields and buttons.
- [ ] Enter triggers Save when focus is inside the modal.
- [ ] Escape closes the modal without saving.
- [ ] Next Break strip's Edit/Cancel are reachable by keyboard, not hover-only.

**Persistence**
- [ ] Refresh browser mid-schedule (before threshold) → schedule and countdown resume correctly.
- [ ] Refresh browser after threshold reached but card not yet acted on → card reappears on load.
- [ ] Open a second tab → schedule and Next Break strip reflect the same state.

**Responsive**
- [ ] Modal usable at narrow (sidebar-width) and wide viewport.
- [ ] Next Break strip does not overflow/clip in the existing card's column layout.

**Regression**
- [ ] Existing quick-focus start/pause/resume/break/stop flow unchanged for sessions with no schedule.
- [ ] Existing Pomodoro auto-break/auto-resume flow unchanged.
- [ ] Focus reflection modal / inline reflection flow (on stop) unaffected.

---

## 11. Risks

| Risk | Impact | Mitigation |
|---|---|---|
| Scope creep into `fable5`/other surfaces that don't exist or are out of scope | Wasted session time, confused diff | Confirmed with founder up front (see note at top); `workplace-focus-card.tsx` only, `focus-page-content.tsx`/other focus surfaces untouched. |
| New Base UI Tooltip/Stepper primitives drift from existing dialog/dropdown visual language | Inconsistent UI | Copied class patterns directly from `dialog.tsx`/`dropdown-menu.tsx` (`flow-surface-elevated`, `data-open`/`data-closed` animation utilities) instead of inventing new styles. |
| `breakPrompt` derivation logic living in the big `useMemo` in `focus-session-context.tsx` grows the already-large context further | Maintainability | Kept all math in `focus-scheduled-break.ts`; context only calls the pure functions and exposes the result — no new business logic duplicated inline. |
| Hold-to-repeat stepper implemented with raw timers could leak intervals on unmount mid-hold | Memory leak / stuck repeating value | Cleanup on unmount via `useEffect` return, and on `pointerup`/`pointerleave`. |
| Two schedule-driven notification cards competing for the same visual real estate as the existing habit-drop notice / inline reflection banner in `workplace-focus-card.tsx` | Visual clutter, cards stacking | Cards render only in mutually exclusive phases (`isFocusing` vs `isOnBreak`) and only replace/sit alongside the timer area the same way the existing inline reflection banner already does — no more than one break-related card can show at once by construction (Section 4). |

---

## 12. Future Improvements (explicitly not V1)

- Compact "Break in Xm" strip variant (deferred from this session — full 3-line strip ships instead).
- Multiple/stacked scheduled breaks per session.
- Schedule templates persisted across sessions.
- Break length auto-paired to break-at tier (e.g., longer focus → longer suggested break).
- OS-level Do Not Disturb integration.
- Recurring break schedules ("every 60 minutes, always").
- Adaptive/AI-suggested break timing.
- Calendar integration, health reminders, smartwatch support.
- Aggregate statistics on schedule adherence (how often users act vs. snooze vs. ignore).
- Automatic Pomodoro-style auto-transition mode (explicitly rejected — see decision-log).
- `workplace-focus-card.tsx`'s Pomodoro tab gaining any form of "schedule" concept — Pomodoro's fixed-cycle model already covers that need; conflating the two mental models was explicitly rejected in the 2026-07-07 decision-log entry.

---

## Self-critique (per "After the Runbook" instruction)

1. **Weakness — no automated tests.** This is a client-only, `localStorage`-backed feature in a codebase with no visible test runner configured (`package.json` has no `test` script). The testing plan above is manual. If FlowOS adds a test runner later, `focus-scheduled-break.ts`'s pure functions are the highest-value target (zero React, zero mocking needed).
2. **Weakness — one schedule slot is a simplification, not a limitation-free design.** A power user who wants "break at 60, then again at 120" cannot express that in V1. Accepted per spec's explicit out-of-scope list; flagged again here so it's a deliberate, visible trade-off rather than a silent gap.
3. **Weakness — `breakPrompt` as a single derived enum could race if both thresholds were somehow true simultaneously.** Verified in Section 4 this cannot happen (mode gates which check runs), but the code should assert this with a comment at the derivation site, not just in this doc, so a future refactor doesn't reintroduce the possibility silently.
4. **Improvement made during planning:** moved the compact Next Break variant to explicitly deferred (Section 2) rather than "optional if time allows," which the original brief left ambiguous — ambiguous scope inside a single session is exactly what causes half-finished UI states to ship. Better to ship the full strip cleanly than two half-built variants.
5. **Improvement made during planning:** chose in-app cards over browser `Notification` calls for both new reminders, removing an entire edge-case category (permission denied/blocked) rather than mitigating it. The spec allowed either; the simpler, always-visible option was chosen.

---

## Session 1 — Schedule Break (single engineering session)

**Type:** `engineering`
**Goal:** Ship Schedule Break modal, Next Break strip, and both notifications on `workplace-focus-card.tsx`'s quick-focus tab.
**Time:** ~1 session.
**Prerequisites:** `main` at current HEAD (Today V3 Sessions 1–5 merged).
**Maps to:** Inbox "Schedule Break modal" promoted item; [schedule-break-modal-spec.md](../../review/design/schedule-break-modal-spec.md).
**Merge bundle:** B1 (only bundle — single session).

### Numbered steps

| # | Step |
|---|------|
| 1 | Extend `StoredActiveFocusSession` in `focus-active-session.ts` with the three optional fields. |
| 2 | Add `src/lib/focus-scheduled-break.ts` with milestone defaults, remaining/ready/finished math, save/clear/snooze transforms. |
| 3 | Add `src/components/ui/stepper.tsx` (`NumberStepper`) and `src/components/ui/tooltip.tsx` (`InfoTooltip`). |
| 4 | Wire `quick.scheduleBreak` / `cancelScheduledBreak` / `snoozeBreakReady` / `snoozeBreakFinished` / `breakPrompt` / `remainingToBreakSeconds` into `focus-session-context.tsx`. |
| 5 | Build `src/components/focus/schedule-break-modal.tsx`. |
| 6 | Build `src/components/focus/focus-next-break-strip.tsx` and `src/components/focus/focus-break-notification.tsx`. |
| 7 | Wire all three into `workplace-focus-card.tsx` quick-focus tab only. |
| 8 | `npm run build && npm run lint` → fix any new errors in touched files → commit → push branch → ask founder to approve merge to `main`. |

### Verification

**Commands**

```powershell
npm run build
npm run lint
git status -sb
```

**Manual checks on `/` (Today page, Focus card → Focus tab)** — mirrors the spec's verification checklist:

| # | Check | Expected |
|---|-------|----------|
| 1 | Start Quick Focus → Schedule Break → defaults | Match milestone table. |
| 2 | Adjust Break at ±5, hold-to-repeat | Floor enforced at current + 5 min. |
| 3 | Live "Break in …" | Updates every second; "Break ready" at threshold. |
| 4 | Save | Modal closes; Next Break strip shows correct values. |
| 5 | Hover strip | Edit / Cancel both work. |
| 6 | Reach threshold | Notification appears; focus keeps running until user acts. |
| 7 | Start Break → countdown to zero | Break-finished notification; no auto-resume. |
| 8 | Snooze 5 min | Works on both notifications. |
| 9 | Escape / focus trap / Enter-to-save | All work. |
| 10 | `npm run build && npm run lint` | Both pass. |

**Stop/fail if**

- Pomodoro tab shows any new UI or behavior change.
- Focus/break auto-transitions without a user click.
- Build or lint fails on touched files.

**Rollback:** revert merge on `main` — never force-push `main`. See [GIT_WORKFLOW.md](../../foundation/governance/GIT_WORKFLOW.md).

---

## Out of scope

- `fable-greenfield`/`fable5-focus-hero.tsx` — does not exist; not created as part of this feature.
- `focus-page-content.tsx` (`/focus` hub page) and `quick-focus-session.tsx` (currently unused/dead component) — not touched.
- Pomodoro tab.
- Everything listed in Section 12.

---

## M2-Schedule-Break completion checklist

| # | Criterion | Done |
|---|-----------|------|
| 1 | `StoredActiveFocusSession` extended, backward compatible | ☐ |
| 2 | `focus-scheduled-break.ts` pure helpers implemented | ☐ |
| 3 | Schedule Break modal live on `workplace-focus-card.tsx` | ☐ |
| 4 | Next Break strip live with Edit/Cancel | ☐ |
| 5 | Break-ready notification live | ☐ |
| 6 | Break-finished notification live | ☐ |
| 7 | `npm run build && npm run lint` clean | ☐ |
| 8 | Founder approval requested for merge to `main` | ☐ |

**Acceptance test:** Founder opens `/`, starts Quick Focus, schedules a break, sees the live countdown, gets reminded at threshold without focus auto-stopping, starts the break, gets reminded when it ends without auto-resuming, and can edit/cancel the schedule at any time. ☐

---

*End of runbook.*
