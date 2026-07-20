Implement the Schedule Break modal for FlowOS quick focus, per the spec at
docs/review/design/schedule-break-modal-spec.md (read it first, in full).

Context you must read before coding:
- docs/review/design/schedule-break-modal-spec.md (the spec — source of truth)
- src/lib/focus-active-session.ts (StoredActiveFocusSession type + session
  transition helpers: quickStartBreak, quickResumeFocus, computeQuickFocusSeconds,
  getSegmentElapsedSeconds)
- src/contexts/focus-session-context.tsx (quick focus state machine exposed to
  components: quick.isOnBreak, quick.startBreak, quick.currentFocusSeconds, etc.)
- src/components/fable-greenfield/fable5-focus-hero.tsx (primary UI target —
  quick focus tab, existing Break button, timer display)
- src/components/workplace/workplace-focus-card.tsx (production quick focus tab
  — secondary target if time allows; may defer to a follow-up session)
- .cursor/rules/git-workflow.mdc and .cursor/rules/code-standards.mdc (branch
  naming, smallest-diff rule, npm run build/lint gate, founder approval before
  merge to main)

Scope for this session (engineering, single runbook session):

1. Extend StoredActiveFocusSession (focus-active-session.ts) with an optional
   scheduled break: breakAtMinutes, breakLengthMinutes, scheduledAtFocusTime
   (all optional/nullable — sessions without a scheduled break are unaffected).
   Add pure helper functions (new file: src/lib/focus-scheduled-break.ts):
   - getDefaultBreakAtMinutes(currentFocusMinutes): number — milestone table
     from the spec ([25, 45, 60, 90, 120, ...+30 steps]), pick first > current.
   - getRemainingToBreakSeconds(session): number — breakAtMinutes*60 minus
     computeQuickFocusSeconds(session).focus, floored at 0.
   - isBreakReady(session): boolean.
   - snoozeBreak(session, minutes): updated session with breakAtMinutes bumped.
   No changes to Pomodoro logic or the existing immediate quickStartBreak path.

2. Build the Schedule Break modal (new file:
   src/components/focus/schedule-break-modal.tsx) using shadcn Dialog:
   - Current Focus (read-only, live, ticks off context tick/currentFocusSeconds)
   - Break at stepper (±5 min, hold-to-repeat, floor = currentFocusMinutes + 5)
     with live "Break in Xm Ys" / "Break ready" text underneath
   - Break length stepper (±5 min, floor = 5)
   - Info tooltips exactly as worded in the spec
   - Cancel / Save Break buttons; Save writes breakAtMinutes,
     breakLengthMinutes, scheduledAtFocusTime onto the active session via
     focus-session-context and closes the modal
   - Escape closes; proper focus trap (Dialog default); keyboard Save on Enter
   Build the ±5 stepper as a small reusable component if one does not already
   exist under src/components/ui — check first, do not duplicate.

3. Wire "Schedule Break" as a new action next to the existing Break button in
   fable5-focus-hero.tsx quick-focus tab only (do not touch Pomodoro tab).
   Opens the modal from step 2.

4. Add the "Next Break" strip beside the timer in the same component:
   - Shows "Next Break / {breakAt} min / {breakLength} min break" when a
     schedule exists on the active session, else renders nothing
   - Wrapped in a hover card revealing inline Edit / Cancel (Edit reopens the
     modal pre-filled; Cancel clears the schedule fields on the session)
   - Compact live "Break in Xm" variant is optional for this session if space
     is tight — note it as deferred in the runbook session notes if skipped

5. Break threshold notification: when isBreakReady(session) transitions to
   true during an active quick focus session (not break, not paused), show
   an in-app toast/card: "Time for a break — You've reached {N} minutes of
   focus." with [Start Break] (calls existing quick.startBreak) and
   [Snooze 5 min] (calls snoozeBreak, +5). Do not auto-start break. Reuse
   existing notification/toast plumbing in focus-utils.ts if present —
   check before adding new infrastructure.

6. Break-finished notification: when on break and elapsed break seconds
   reach breakLengthMinutes*60, show "Break finished — Ready to focus
   again?" with [Resume Focus] (quick.resumeFocus / quickResumeFocus) and
   [Snooze 5 min] (extend break by 5 min). Do not auto-resume.

Explicitly out of scope (per spec): Pomodoro tab changes, multiple stacked
breaks per session, schedule templates, OS-level DND, production
workplace-focus-card.tsx wiring (do only if trivial after fable5 is done —
otherwise leave a TODO note and mention it in your session report).

Process:
- Branch from main: m2/session-N-schedule-break (confirm next session number
  against docs/execution/runbooks/ — this is not yet in a runbook file; create
  docs/execution/runbooks entry or treat as a tweak/schedule-break branch if
  founder prefers ad-hoc — ask if unclear).
- Smallest diff; match sibling component patterns (quick-focus-session.tsx,
  focus-settings-panel.tsx) instead of inventing new styles.
- Dark-mode semantic tokens only, no inline hex.
- Run npm run build && npm run lint before reporting done; fix any new errors
  in touched files.
- Do not merge to main. Report branch, commits, build/lint status, and ask
  for approval per git-workflow.mdc.

Deliverable: working Schedule Break modal + Next Break strip + both
notifications on the /fable quick focus tab, verified against the 10-item
checklist at the end of the spec doc.
keep this in mind also
# FlowOS Runbook Request - Schedule Break Feature

You are the senior product engineer for FlowOS.

Do **not** start coding immediately.

Your first task is to create a complete implementation runbook for this feature. Think like a staff engineer, product designer, and technical lead reviewing a feature before development begins.

## Context

FlowOS is **not** a traditional Pomodoro app.

The Focus Timer is a continuous timer where users manually decide when to start focusing, take breaks, and resume work.

This feature introduces **Schedule Break**, allowing users to schedule a future break without changing the existing focus workflow.

The timer must never automatically transition between focus and break.

---

## Your Deliverables

Create a structured implementation runbook before writing any code.

Include the following sections:

### 1. Product Understanding

* Explain the feature in your own words.
* Describe the intended user experience.
* Identify the mental model users should have.
* Explain why this feature fits FlowOS better than a fixed Pomodoro timer.

---

### 2. UX Review

Evaluate the proposed design.

Discuss:

* clarity
* discoverability
* simplicity
* cognitive load
* interaction flow
* accessibility

Suggest improvements if you believe something can be simplified without changing the core behavior.

---

### 3. User Flow

Map every possible flow.

Examples:

* user schedules a break before focus starts
* schedules during focus
* edits scheduled break
* cancels scheduled break
* starts break
* snoozes notification
* ignores notification
* resumes focus
* stops focus before scheduled break
* timer resets
* application reloads

---

### 4. Edge Cases

Identify every edge case.

Examples include but are not limited to:

* Break At is less than current focus
* user pauses focus
* browser refresh
* multiple tabs
* notification permission denied
* sleeping computer
* system clock changes
* timer drift
* focus stopped before break
* editing values while countdown updates
* snoozing multiple times

Add any additional edge cases you find.

---

### 5. State Management

Describe:

* required state
* derived state
* persisted state
* temporary UI state

Explain where each should live.

---

### 6. Component Architecture

Propose the component tree.

Example:

* ScheduleBreakModal
* BreakSettings
* NumberStepper
* BreakNotification
* NextBreakCard
* BreakCountdown
* Tooltip
* etc.

Describe responsibilities for each.

---

### 7. Data Model

List every field required.

Explain what each field stores and why.

---

### 8. Event Timeline

Describe the complete lifecycle.

Example:

Focus starts

↓

User schedules break

↓

Countdown updates

↓

Reminder appears

↓

User starts break

↓

Break countdown

↓

Reminder appears

↓

User resumes focus

Include every event in chronological order.

---

### 9. Implementation Plan

Break development into small phases.

For each phase include:

* goal
* files affected
* dependencies
* testing checklist
* expected result

The phases should be small enough that each could be completed in a single commit.

---

### 10. Testing Plan

Create a comprehensive checklist covering:

* functional testing
* UI testing
* keyboard navigation
* persistence
* browser refresh
* notifications
* responsive layouts
* edge cases
* regression testing

---

### 11. Risks

Identify technical and UX risks.

Explain how each should be mitigated before implementation.

---

### 12. Future Improvements

List features that should **not** be implemented now but could be added later.

Examples:

* recurring break schedules
* adaptive AI break recommendations
* calendar integration
* health reminders
* smartwatch support
* statistics
* automatic Pomodoro mode

---

## After the Runbook

Once the runbook is complete:

1. Critique your own plan.
2. Identify weaknesses.
3. Improve the architecture.
4. Only after the runbook is finalized should implementation begin.

Do not skip reasoning.

Optimize for long-term maintainability, clean architecture, scalability, and a polished user experience rather than the fastest implementation.
