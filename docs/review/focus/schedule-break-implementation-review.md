# Schedule Break — Implementation Review

**Date:** July 8, 2026  
**Reviewer role:** Principal Product Designer · Staff Frontend Engineer · UX Architect · Code Reviewer · Product Critic  
**Specification reviewed against:** [runbook_test.md](../../src/components/workplace/runbook_test.md) (Anthropic runbook, attached for this audit)  
**Cross-references:** [m2-schedule-break.md](../../execution/runbooks/m2-schedule-break.md) · [schedule-break-modal-spec.md](../design/schedule-break-modal-spec.md)  
**Implementation surfaces:** `workplace-focus-card.tsx` (production `/` Today page), **not** `fable5-focus-hero.tsx` (does not exist)

---

## Executive Summary

Schedule Break is **substantially implemented** and aligned with FlowOS’s continuous-focus philosophy. The core loop works: schedule → strip → threshold reminder → manual break → break-finished reminder → manual resume. State lives in the extended `StoredActiveFocusSession`, math is centralized in `focus-scheduled-break.ts`, and the UI is wired on the real production surface (`workplace-focus-card.tsx`), which is **better** than the Anthropic runbook’s primary target (`fable5-focus-hero.tsx`, which was never in this repo).

The implementation diverges from the runbook in ways that are **mixed**: production wiring and in-app-only notifications are improvements; milestone defaults, break-length default, stepper UX, accessibility, and automated tests are gaps or regressions relative to spec.

### Scores (1–10)

| Dimension | Score | Rationale |
|-----------|------:|-----------|
| **Product Design** | 8.0 | Philosophy preserved; nullable break length and milestone drift weaken the “two simple decisions” promise |
| **UX** | 7.0 | Functional flow is clean; entry-point placement and dropdown+stepper hybrid add cognitive load vs. spec’s two steppers |
| **UI** | 7.5 | Dark-mode tokens mostly respected; strip and cards match FlowOS language; duration picker uses focus-ring palette inline styles |
| **Architecture** | 8.0 | Strong lib/context split; unused `NumberStepper`, parallel stepper implementations, and schedule-specific picker add surface area |
| **State Management** | 9.0 | Single source of truth in session + localStorage; derived `breakPrompt`; cross-tab `storage` listener; no duplicate elapsed-time math |
| **Accessibility** | 5.5 | Dialog baseline OK; ± steppers are pointer-only; no `aria-live` on countdown; strip hover mitigated with `focus-within` |
| **Code Quality** | 7.0 | Readable, conventional naming; no unit tests; `FEATURE_INVENTORY` still “Planned” |

### Overall readiness

**~78% feature-complete** against the Anthropic runbook’s Sessions 1–4 bundle. **Production-ready for founder daily-driver** with manual smoke testing, **not** ready to call V1 “done” without addressing accessibility blockers and spec mismatches on defaults. Safe to merge behind founder approval once a11y and default-value gaps are triaged.

---

## Feature Comparison Matrix

| Feature | Runbook | Current | Status | Notes |
|---------|---------|---------|--------|-------|
| Schedule Break entry point | Quick-focus tab, after **Break** button, clock/bell icon | `workplace-focus-card.tsx`: absolute-positioned button **right of timer ring**, `CalendarClock` icon, only when `quick.isFocusing` | 🔄 Implemented Differently | Production surface is correct per `m2-schedule-break.md`; placement and discoverability differ from runbook |
| Entry when idle (0:00, no session) | Flow A4: open modal before focus starts | Button hidden until active focus session | 🔄 Implemented Differently | Matches official M2 runbook flow #1 (idle = no entry); **better** for “Current Focus” live readout |
| Schedule Break modal | `schedule-break-modal.tsx` with Dialog, two fields, Save/Cancel | Implemented | ✅ Implemented | Title, tooltips, layout match spec |
| Break At field | ±5 stepper, hold-to-repeat, floor `currentFocusMinutes + 5` | `ScheduleBreakStepperField` + `ScheduleBreakDurationPicker` dropdown with presets, custom time input, ±5 hold-to-repeat | 🔄 Implemented Differently | More powerful than spec; milestone presets differ (see below) |
| Break Length field | ±5 stepper, min 5, default 10 | Same hybrid; default **`null` (“Not set”)**; can decrement to null | 🔄 Implemented Differently | Nullable break length is **not** in spec; breaks “break finished” notification if unset |
| Current Focus readout | Live `MM:SS`, same tick as main timer | `formatTimerClock(quick.currentFocusSeconds)` on context tick | ✅ Implemented | |
| Live “Break in Xm Ys” / “Break ready” | Below Break at, updates every second | `formatBreakCountdownLabel(remainingSeconds)` in modal | ✅ Implemented | Computed from draft `breakAtMinutes` + live focus seconds |
| `aria-live` on countdown text | Required (`polite`) | Not present | ❌ Missing | Runbook Session 2 acceptance criterion |
| Milestone defaults | `[25, 45, 60, 90, 120]` +30 extend | `[25, 30, 45, 60, 75, 90, 120, 150]` +30 extend | 🔄 Implemented Differently | e.g. at 29 min focus: runbook → 45, current → **30** |
| Default break length 10 min | Spec + runbook | `DEFAULT_BREAK_LENGTH_MINUTES = null` | ❌ Missing | Modal opens with “Not set” |
| Save persists 3 fields | `breakAtMinutes`, `breakLengthMinutes`, `scheduledAtFocusTime` | `setScheduledBreak()` via `quick.scheduleBreak()` | ✅ Implemented | |
| Cancel / Escape discards draft | No session write | Dialog `onOpenChange` + Cancel button | ✅ Implemented | Base UI Dialog provides Escape + focus trap |
| Enter to Save | Yes | `onKeyDown` Enter on `DialogContent` | 🟨 Partially Implemented | Fires on any Enter inside modal, including custom time input (may conflict) |
| Next Break strip | Three-line label when schedule exists | `FocusNextBreakStrip` | ✅ Implemented | Shows `breakAt` + length or “length not set” |
| Strip hidden when no schedule | Yes | `if (!breakAtMinutes) return null` | ✅ Implemented | |
| Strip Edit / Cancel | Hover-reveal | CSS `group-hover` + `group-focus-within` | ⭐ Current Implementation Better | Keyboard-reachable; runbook flagged touch-only hover as gap |
| Compact “Break in Xm” strip variant | Optional / deferred | Not implemented | 🟨 Partially Implemented | Explicitly deferred in both runbooks — acceptable |
| Live countdown on strip | Optional compact variant | Not on strip; `remainingToBreakSeconds` exposed in context but unused in UI | 🟨 Partially Implemented | |
| Threshold notification | “Time for a break” + Start Break / Snooze 5 min | `FocusBreakNotification` kind=`ready` | ✅ Implemented | In-app card, not toast |
| Focus keeps running at threshold | Yes | `isBreakReady` does not pause or auto-break | ✅ Implemented | |
| Break-finished notification | “Break finished” + Resume / Snooze 5 min | `FocusBreakNotification` kind=`finished` | ✅ Implemented | |
| No auto-start / auto-resume | Yes | User must click primary action | ✅ Implemented | |
| Snooze threshold (+5 to breakAt) | `snoozeBreak(session, 5)` | `quick.snoozeBreakReady()` | ✅ Implemented | |
| Snooze break-finished | Runbook: restart countdown at 5:00; M2 runbook: `breakLengthMinutes += 5` | `snoozeBreakFinished()` increments `breakLengthMinutes` | 🔄 Implemented Differently | Matches M2 runbook, not spec’s “restart at 5:00” if user ignored notification for a while |
| Notification ignored | Stays until user acts (M2 runbook) | Card stays mounted while `breakPrompt` derived true | ✅ Implemented | No auto-dismiss timer |
| OS / browser notification | Reuse `focus-utils` as bonus channel | Not called for schedule-break cards | 🔄 Implemented Differently | **Simpler and more reliable** — in-app only per M2 runbook self-critique |
| Immediate **Break** button unchanged | Yes | `quickStartBreakAction` untouched | ✅ Implemented | Idempotent when already on break |
| Schedule preserved on manual Break | Decision point; runbook recommends (a) cancel | Schedule fields **preserved** | ⭐ Current Implementation Better | Matches M2 runbook edge-case table |
| Schedule cleared on session stop | Yes | `updateSession(null)` → `clearActiveSession()` | ✅ Implemented | |
| Schedule cleared on strip Cancel | Yes | `clearScheduledBreak()` | ✅ Implemented | |
| Pause freezes Break-at countdown | Focus-seconds-based | `computeQuickFocusSeconds` freezes via `paused_segment_seconds` | ✅ Implemented | |
| No notification while paused | Implied | `breakPrompt` requires `quickPhase === "focus"` (not `focus_paused`) | ✅ Implemented | Card appears on resume if still past threshold |
| Persistence (refresh) | `localStorage` via `StoredActiveFocusSession` | `writeActiveSession` / `readActiveSession` | ✅ Implemented | |
| Multi-tab sync | `storage` event listener | Implemented in `FocusSessionProvider` | ✅ Implemented | |
| Pomodoro tab untouched | Yes | No schedule UI on Pomodoro path | ✅ Implemented | |
| `fable5` / greenfield wiring | Primary target in Anthropic runbook | Not wired | ❌ Missing | Acceptable — file never existed; production wired instead |
| `workplace-focus-card.tsx` wiring | Session 5 stretch goal | **Done** (Sessions 2–4 equivalent) | ⭐ Current Implementation Better | |
| Pure helpers `focus-scheduled-break.ts` | 4 functions + tests | Full helper module, **no unit tests** | 🟨 Partially Implemented | |
| Generic `NumberStepper` (`ui/stepper.tsx`) | Reused by modal | Exists but **unused** by schedule break | 🔄 Implemented Differently | `ScheduleBreakStepperField` duplicates hold-to-repeat logic |
| Unit tests for helpers | Session 1 requirement | None | ❌ Missing | No test runner in `package.json` |
| `FEATURE_INVENTORY` updated | Shipped | Still **Planned** | ❌ Missing | Docs drift |
| Hold-to-repeat steppers | Pointer hold | `onPointerDown` + interval | ✅ Implemented | |
| Keyboard stepper equivalent | Repeated Enter/Space or arrows | ± buttons use **pointer only** (`onPointerDown`, no `onClick`) | ❌ Missing | **Critical a11y gap** |
| Smooth value animation | Spec requests | `transition-[color]` on unused `NumberStepper` only | 🟨 Partially Implemented | Minimal animation on schedule controls |
| Break-length ceiling (~180 min) | Decision point, not in spec | No max | ✅ Implemented | Matches “no ceiling” default |
| `EXPERIMENT.md` §3.8 carve-out | Session 4 check | Not referenced; in-app cards always show | 🔄 Implemented Differently | Reasonable — document likely stale |

---

## UX Review

### Runbook UX (Anthropic)

- **Strengths:** Minimal two-field modal; clear now-vs-later button ordering; explicit mental model (“soft reminder, not Pomodoro”); milestone defaults enable one-click Save.
- **Weaknesses:** Hover-only strip Edit/Cancel flagged as touch gap; assumes `fable5` surface; five-session incremental delivery.

### Current UX

- **Strengths:** Same lightweight modal shell; notification cards are non-blocking with exactly two actions; strip uses `focus-within` (keyboard + touch friendlier than hover-only); Schedule Break gated to active focus (avoids nonsensical idle state).
- **Weaknesses:** **Schedule Break** sits outside the timer hover cluster (absolute right of ring) — easy to miss and visually disconnected from **Break**; hybrid dropdown + ± stepper is more complex than spec’s `[−5] [60 min] [+5]`; default “Not set” for break length forces an extra decision; no live “Break in …” on the strip.

### Verdict

**Runbook wins on simplicity and defaults; current wins on surface choice, strip keyboard access, and in-app-only notifications.**

The **stronger overall design** is a **third approach**: keep production wiring + `focus-within` strip + in-app cards, but revert to spec-simple steppers (or wire existing `NumberStepper`), restore **10 min** default break length, align milestone table to spec, and move **Schedule Break** adjacent to **Break** inside the control cluster.

| Dimension | Stronger | Why |
|-----------|----------|-----|
| Simplicity | Runbook | Two plain steppers vs. dropdown + custom time + presets |
| Discoverability | Runbook (slightly) | Inline with Break/Pause/Stop vs. floating satellite button |
| Cognitive load | Runbook | Nullable break length and extra picker options increase decisions |
| Interaction flow | Tie | Both are single-path save → strip → notify → act |
| Visual hierarchy | Current (marginally) | Notification card uses primary tint; strip is unobtrusive |
| Accessibility | Current (strip only) | `focus-within` on strip; modal steppers worse than runbook intent |

---

## Architecture Review

### Runbook architecture

```
fable5-focus-hero
├── ScheduleBreakModal
├── FocusNextBreakStrip
├── FocusBreakNotification
└── lib/focus-scheduled-break.ts (pure)
```

Context extended with schedule actions; modal owns draft state; notifications watch derived `isBreakReady`.

### Current architecture

```
workplace-focus-card.tsx
├── ScheduleBreakModal
│   ├── ScheduleBreakStepperField (schedule-specific)
│   └── ScheduleBreakDurationPicker (schedule-specific)
├── FocusNextBreakStrip (presentational, props-only)
├── FocusBreakNotification (presentational)
├── ui/stepper.tsx NumberStepper (orphaned for this feature)
└── focus-session-context.tsx (breakPrompt + actions)
```

### Assessment

| Topic | Assessment |
|-------|------------|
| **Component boundaries** | Good: strip and notification are dumb; context owns mutations; lib owns math |
| **State ownership** | Excellent: persisted fields in session; `breakPrompt` derived, not stored |
| **Helper reuse** | Good for elapsed time (`computeQuickFocusSeconds`); **poor** for steppers (duplicate hold-to-repeat) |
| **Complexity** | **Higher than necessary** — three schedule-specific UI modules where runbook planned one modal + generic stepper |
| **Maintainability** | Lib layer is easy to test; context `useMemo` growth is manageable; UI duplication is the main debt |
| **Scalability** | One-schedule-slot model scales to V1; recurring breaks would need new model, not refactor of current split |

### Unnecessary complexity

1. **`ScheduleBreakDurationPicker`** — preset dropdown + custom `H:MM` input exceeds V1 spec; couples break scheduling to `task-duration-options` and `FOCUS_TIMER_COLORS`.
2. **Parallel stepper implementations** — `ui/stepper.tsx` and `ScheduleBreakStepperField` both implement hold-to-repeat.
3. **`remainingToBreakSeconds` in context** — exposed but only modal could use it; strip doesn’t, suggesting incomplete wiring or dead API surface.

### Architectural improvements (documentation only)

1. Collapse modal controls onto `NumberStepper` or one shared hold-to-repeat primitive.
2. Move milestone presets to config constant matching spec; document intentional deviations.
3. Add unit tests for `focus-scheduled-break.ts` when a test runner lands.
4. Either use `remainingToBreakSeconds` on the strip or remove from public context API until needed.

---

## Product Review

Classifications for Anthropic runbook recommendations:

| Recommendation | Classification | Decision |
|----------------|----------------|----------|
| Extend `StoredActiveFocusSession` with 3 optional fields | **Should Implement** | Done |
| Pure `focus-scheduled-break.ts` helpers | **Should Implement** | Done |
| Milestone table `[25, 45, 60, 90, 120]` +30 | **Should Implement** | **Not done** — current presets include 30, 75, 150; changes default UX |
| Default break length 10 min | **Should Implement** | **Not done** — null default |
| ±5 hold-to-repeat steppers | **Should Implement** | Done (pointer) |
| `aria-live` on countdown | **Should Implement** | Not done |
| Keyboard stepper without pointer hold | **Should Implement** | Not done |
| Next Break strip (3-line) | **Should Implement** | Done |
| Compact strip countdown | **Nice to Have** | Deferred — agree |
| In-app threshold + finished cards | **Should Implement** | Done |
| Browser notification as bonus | **Nice to Have** | Skipped — **Current Version Better** (in-app sufficient) |
| `fable5-focus-hero` primary surface | **Not Necessary** | Production card is correct |
| `workplace-focus-card` Session 5 | **Should Implement** | Done early |
| Unit tests Session 1 | **Should Implement** | Not done — **Nice to Have** until test infra exists |
| Cancel schedule on immediate Break | **Not Necessary** | Preserving schedule is **Current Version Better** |
| Break-length 180 min ceiling | **Not Necessary** | Unless hold-to-repeat bug reports |
| Five-session branch plan | **Not Necessary** | Single-session delivery in M2 runbook was sufficient |
| Recurring / stacked breaks V1 | **Not Necessary** | Correctly out of scope |
| `EXPERIMENT.md` §3.8 carve-out | **Not Necessary** | In-app cards bypass the issue |

---

## Missing Features

### Critical

1. **Keyboard-operable ± steppers** — `onPointerDown`-only breaks keyboard and some assistive tech.
2. **`aria-live="polite"`** on “Break in …” / “Break ready” text.
3. **Default break length 10 minutes** per spec (currently null).

### Important

4. **Milestone table alignment** with spec (`29 min → 45`, not 30).
5. **Unit tests** for `focus-scheduled-break.ts` (runbook Session 1).
6. **`FEATURE_INVENTORY`** status update to Shipped.
7. **Enter-key handling** scoped to Save button / form submit, not global on dialog (conflict with custom input).

### Optional

8. Compact “Break in Xm” strip variant.
9. Live countdown on strip using existing `remainingToBreakSeconds`.
10. Browser notification channel for schedule-break transitions.
11. `fable5` prototype parity (if that surface is revived).

### Future

12. Recurring schedules, templates, analytics, calendar integration (all correctly out of V1).

---

## Improvements

Recommended changes that clearly improve quality (no cosmetic-only items):

### Usability

1. Set `DEFAULT_BREAK_LENGTH_MINUTES = 10` and disallow Save when break length is null (or default to 10 on Save).
2. Align `BREAK_AT_PRESET_MINUTES` to spec table unless founder explicitly wanted denser presets.
3. Place **Schedule Break** in the same control row as **Break**, ordered **Break** then **Schedule Break**.
4. Show live “Break in …” on `FocusNextBreakStrip` using `remainingToBreakSeconds` — reduces need to reopen modal.

### Accessibility

5. Add `aria-live="polite"` to countdown line in modal (and strip if countdown added).
6. Wire ± controls with `onClick` **or** keyboard handlers (`ArrowUp`/`ArrowDown`) on stepper group; ensure Tab order reaches all controls.
7. Announce notification cards with `role="alert"` or live region when `breakPrompt` transitions null → ready/finished (currently `role="status"` only).

### Maintainability

8. Delete or consolidate duplicate stepper — use `NumberStepper` in modal or remove unused file.
9. Add pure-function tests when test runner is available.
10. Update `FEATURE_INVENTORY.md` and annotate `decision-log.md` 2026-07-07 entry with shipped deviations.

### Product quality

11. Document snooze semantics: threshold snooze = +5 to target; finished snooze = +5 to required break duration (not wall-clock restart) — update spec wording to match implementation if intentional.

---

## Regressions

| Area | Runbook / spec expectation | Current behavior | Impact |
|------|---------------------------|------------------|--------|
| Milestone defaults | 29 min → 45 min break-at | 29 min → **30** min | Users hit reminders sooner than designed pairing |
| Break length default | 10 min | **Not set** | Save without editing → no break-finished reminder ever |
| Keyboard steppers | Adjustable without pointer | ± buttons pointer-only | WCAG failure for modal |
| Live region | Screen reader hears countdown | Silent updates | SR users miss threshold proximity |
| Unit tests | Session 1 gate | None | Regression risk on milestone/snooze math |
| Spec target copy | Exact tooltip strings | Match | OK — no regression |
| Snooze break-finished | “Restart at 5:00” (spec) | +5 min to total break threshold | If user lingers on break, snooze gives **less** extension than “5 min from now” |

---

## Better Than Runbook

| Area | Why keep it |
|------|-------------|
| **Production surface first** | `workplace-focus-card.tsx` is what founders use daily; `fable5-focus-hero` never existed |
| **Strip `focus-within`** | Edit/Cancel reachable without hover — fixes runbook’s touch-device concern |
| **In-app-only notifications** | Always visible; no permission-denied path; simpler than dual toast + OS |
| **`breakPrompt` derivation in context** | Single derived enum; refresh-safe; no extra persisted notification flags |
| **Preserve schedule on manual Break** | User can return to focus and still see pending threshold if they broke early |
| **Idle gating** | Avoids scheduling with no live “Current Focus” context |
| **Mode-gated `isBreakFinished`** | Prevents false “break finished” while still focusing |
| **`ScheduleBreakDurationPicker` custom times** | Power-user affordance (if retained, document as intentional enhancement) |
| **M2 single-session delivery** | Faster ship than 5-branch Anthropic plan with same outcome |

---

## Edge Case Audit

| # | Edge case (runbook) | Status | Explanation |
|---|---------------------|--------|-------------|
| 1 | Break-at below `currentFocusMinutes + 5` | **Handled** (UI) | `getMinBreakAtMinutes` + stepper `min`; Save guarded. **Partial** in `snoozeBreak` — no defensive clamp if programmatic bypass |
| 2 | Adjust Break-at while paused | **Handled** | Modal available when `isFocusing` (includes paused); floor recomputes from frozen focus minutes |
| 3 | Browser refresh mid-countdown | **Handled** | `readActiveSession()` rehydrates all three fields |
| 4 | Two tabs, one edits schedule | **Handled** | `storage` event syncs session |
| 5 | Notification permission denied | **Handled** | In-app cards only |
| 6 | Computer sleep | **Handled** | `getSegmentElapsedSeconds` uses `Date.now() - phase_started_at` |
| 7 | System clock change | **Missing** (known limitation) | Same as base timer — acceptable |
| 8 | Timer drift | **Handled** | Tick triggers re-render; values from timestamps |
| 9 | Focus stopped before threshold | **Handled** | Session cleared |
| 10 | Editing stepper while live text updates | **Handled** | Draft state separate from session tick |
| 11 | Repeated threshold snoozes | **Handled** | Unbounded `breakAtMinutes += 5` |
| 12 | Double-fire Start Break | **Handled** | `quickStartBreakAction` no-ops if `mode !== "focus"` |
| 13 | Break-length hold past sane value | **Handled** (no ceiling) | Per runbook decision point — no cap shipped |
| 14 | Re-open modal doesn’t reset to fresh milestones | **Handled** | `useEffect` seeds from `quick.breakAtMinutes` when open |
| 15 | Snooze then close tab | **Handled** | Ephemeral session cleared on end; no background worker |

**Additional edge cases (implementation-specific):**

| Edge case | Status | Explanation |
|-----------|--------|-------------|
| `breakLengthMinutes === null` at Save | **Partially handled** | Save allowed; `isBreakFinished` never true; strip shows “length not set” |
| Threshold while `focus_paused` | **Handled** | No card until `quickPhase === "focus"` |
| Break finished while `break_paused` | **Handled** | No card until `quickPhase === "break"` |
| Schedule UI during break | **Missing** (UI only) | Strip hidden on break; schedule data persists in session |
| `JSON.stringify` equality in `updateSession` | **Handled** | Prevents write storms; rare edge: key order change could block write |

---

## Accessibility Audit

| Area | Status | Notes |
|------|--------|-------|
| **Keyboard — modal** | Partial | Tab/Escape/Enter work via Dialog; ± steppers **fail** keyboard activation |
| **Keyboard — strip** | Good | Edit/Cancel in DOM; visible on `focus-within` |
| **Focus management** | Good | Base UI Dialog focus trap |
| **ARIA — modal** | Partial | Tooltip triggers have `aria-label`; countdown lacks `aria-live` |
| **ARIA — notifications** | Partial | `role="status"` — may not announce on appear; consider `alert` for transitions |
| **Screen readers** | Weak | Countdown and threshold crossing not announced |
| **Motion** | Good | No problematic motion; opacity transitions only |
| **Contrast** | Good | Semantic tokens on card/strip; picker uses theme focus ring color |
| **Touch** | Good | Strip buttons always in DOM; ± steppers work on touch |
| **Responsive** | Partial | Schedule button `absolute left-full` may clip on narrow viewports beside ring |

---

## Code Quality Audit

| Topic | Assessment |
|-------|------------|
| **Naming** | Clear: `isBreakReady`, `snoozeBreakFinished`, `FocusNextBreakStrip` |
| **File organization** | Correct buckets: `lib/`, `components/focus/`, context extension |
| **Component responsibilities** | Mostly single-purpose; modal slightly heavy due to picker |
| **Reuse** | Strong for session math; weak for steppers |
| **Pure functions** | `focus-scheduled-break.ts` is clean, documented, importable |
| **State duplication** | No duplicate elapsed-time logic; draft vs. session split is correct |
| **Complexity** | Lib low; UI moderate-high for V1 scope |
| **Future maintainability** | Good if steppers consolidated; milestone constants should be single source |

**Notable files:**

- `src/lib/focus-scheduled-break.ts` — authoritative math
- `src/contexts/focus-session-context.tsx` — `quickBreakPrompt` derivation (lines 389–396)
- `src/components/focus/schedule-break-modal.tsx` — modal draft + save
- `src/components/workplace/workplace-focus-card.tsx` — integration (lines 742–797, 999–1002)

---

## Final Verdict

### Implementation completeness: **~78%**

Sessions 1–4 functional goals are largely met on the correct production surface. Gaps concentrate in **accessibility**, **default values**, **milestone fidelity**, and **test/documentation** hygiene.

### Production readiness

**Conditionally ready** for founder daily-driver use after manual test matrix pass. **Not ready** to mark V1 complete in governance docs without addressing Critical items in Missing Features.

### Biggest strengths

1. Correct product philosophy — manual control preserved end-to-end  
2. Clean persisted + derived state architecture  
3. Production wiring on `workplace-focus-card.tsx`  
4. Cross-tab and refresh resilience via existing session envelope  
5. Keyboard-accessible strip pattern (`focus-within`)

### Biggest weaknesses

1. Pointer-only ± steppers (accessibility blocker)  
2. Null default break length undermines half the feature  
3. Milestone preset drift from spec  
4. No automated tests for pure helpers  
5. Documentation inventory still says “Planned”

### Highest-priority improvements

1. Fix keyboard access on steppers + add `aria-live` on countdown  
2. Default break length to 10 min; require or coerce on Save  
3. Realign milestone presets to spec (or log founder-approved deviation in `decision-log.md`)  
4. Move Schedule Break adjacent to Break control  
5. Add unit tests for `focus-scheduled-break.ts` when infra allows; update `FEATURE_INVENTORY`

---

## Appendix: Implementation map

| Runbook artifact | Implemented as |
|------------------|------------------|
| `focus-scheduled-break.ts` | `src/lib/focus-scheduled-break.ts` |
| `schedule-break-modal.tsx` | `src/components/focus/schedule-break-modal.tsx` |
| `focus-next-break-strip.tsx` | `src/components/focus/focus-next-break-strip.tsx` |
| `focus-break-notification.tsx` | `src/components/focus/focus-break-notification.tsx` |
| `NumberStepper` | `src/components/ui/stepper.tsx` (unused by feature) |
| Entry + wiring | `src/components/workplace/workplace-focus-card.tsx` |
| Context actions | `src/contexts/focus-session-context.tsx` |
| Extra (not in runbook) | `schedule-break-stepper-field.tsx`, `schedule-break-duration-picker.tsx` |

---

*This document is the reference for future Schedule Break improvements. The Anthropic runbook is a strong draft; the implementation is a credible V1 with deliberate wins and fixable gaps. Neither should be copied blindly — merge the best of both.*
