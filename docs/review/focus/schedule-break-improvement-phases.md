# Schedule Break — Improvement Phases

**Date:** July 8, 2026  
**Source:** [schedule-break-implementation-review.md](./schedule-break-implementation-review.md)  
**Goal:** Close every gap identified in the review so all quality dimensions reach **10/10** when every phase is complete.

---

## How to read this document

Each item is tagged:

| Tag | Meaning |
|-----|---------|
| **ADD** | Net-new behavior or infrastructure |
| **CHANGE** | Fix incorrect or divergent current behavior |
| **IMPROVE** | Refactor or polish existing behavior |
| **KEEP** | Do not regress — intentional implementation win |
| **DOC** | Documentation / governance only |

Phases are ordered **most important first**. Later phases are optional polish or future scope. Do not skip Phase 1 before calling Schedule Break V1 complete.

---

## Score trajectory

Target scores after each phase (cumulative):

| Dimension | Now | P1 | P2 | P3 | P4 | P5 | P6 |
|-----------|----:|---:|---:|---:|---:|---:|---:|
| Product Design | 8.0 | 9.0 | 9.5 | 9.5 | 10 | 10 | 10 |
| UX | 7.0 | 7.5 | 8.5 | 8.5 | 9.5 | 10 | 10 |
| UI | 7.5 | 7.5 | 8.0 | 8.5 | 9.0 | 9.5 | 10 |
| Architecture | 8.0 | 8.0 | 8.0 | 9.5 | 9.5 | 9.5 | 10 |
| State Management | 9.0 | 9.5 | 9.5 | 10 | 10 | 10 | 10 |
| Accessibility | 5.5 | 9.0 | 9.0 | 9.5 | 9.5 | 10 | 10 |
| Code Quality | 7.0 | 7.5 | 8.0 | 9.5 | 9.0 | 9.0 | 10 |

Phase 6 is the final audit pass that verifies nothing was missed and all acceptance gates hold.

---

## Inventory — everything to address

Consolidated from the review (deduplicated):

### Must fix (blocks V1 / WCAG)

| # | Item | Tag | Primary files |
|---|------|-----|---------------|
| M1 | Default break length **10 min** (not `null`) | CHANGE | `focus-scheduled-break.ts`, `schedule-break-modal.tsx` |
| M2 | Disallow Save when break length unset (or coerce to 10 on Save) | CHANGE | `schedule-break-modal.tsx` |
| M3 | Keyboard-operable ± steppers (not `onPointerDown`-only) | CHANGE | `schedule-break-stepper-field.tsx` or `ui/stepper.tsx` |
| M4 | `aria-live="polite"` on modal “Break in …” / “Break ready” | ADD | `schedule-break-modal.tsx` |
| M5 | Announce notification cards when `breakPrompt` appears | CHANGE | `focus-break-notification.tsx`, optionally context |
| M6 | Scope Enter-to-Save (not global on dialog while in custom input) | CHANGE | `schedule-break-modal.tsx` |

### Product / spec alignment

| # | Item | Tag | Primary files |
|---|------|-----|---------------|
| P1 | Milestone table → spec `[25, 45, 60, 90, 120]` +30 extend | CHANGE | `focus-scheduled-break.ts` |
| P2 | Move **Schedule Break** adjacent to **Break** (now-before-later order) | CHANGE | `workplace-focus-card.tsx` |
| P3 | Defensive floor clamp in `snoozeBreak()` helper | ADD | `focus-scheduled-break.ts` |
| P4 | Document snooze semantics in spec + decision-log | DOC | `schedule-break-modal-spec.md`, `decision-log.md` |

### UX polish

| # | Item | Tag | Primary files |
|---|------|-----|---------------|
| U1 | Live “Break in …” on Next Break strip | ADD | `focus-next-break-strip.tsx`, `workplace-focus-card.tsx` |
| U2 | Fix Schedule Break button clipping on narrow viewports | CHANGE | `workplace-focus-card.tsx` |
| U3 | Smooth stepper value transition (spec) | IMPROVE | stepper component |
| U4 | Show schedule strip during break (read-only) or document why hidden | CHANGE/DOC | `workplace-focus-card.tsx` |

### Architecture / code quality

| # | Item | Tag | Primary files |
|---|------|-----|---------------|
| A1 | Consolidate duplicate stepper implementations | IMPROVE | `ui/stepper.tsx`, `schedule-break-stepper-field.tsx` |
| A2 | Resolve `ScheduleBreakDurationPicker` — simplify to spec steppers OR document as intentional | IMPROVE/DOC | `schedule-break-duration-picker.tsx`, modal |
| A3 | Wire `remainingToBreakSeconds` to strip OR remove from public context until needed | IMPROVE | `focus-session-context.tsx`, strip |
| A4 | Unit tests for `focus-scheduled-break.ts` | ADD | new `*.test.ts`, `package.json` if needed |
| A5 | Update `FEATURE_INVENTORY` → Shipped | DOC | `FEATURE_INVENTORY.md` |
| A6 | Annotate decision-log 2026-07-07 with shipped deviations | DOC | `decision-log.md` |
| A7 | Comment at `breakPrompt` derivation (mode-gate invariant) | ADD | `focus-session-context.tsx` |

### Intentional wins — do not revert

| # | Item | Tag |
|---|------|-----|
| K1 | Production surface `workplace-focus-card.tsx` (not fable5) | KEEP |
| K2 | In-app-only notifications (no OS `Notification`) | KEEP |
| K3 | Strip `focus-within` for Edit/Cancel | KEEP |
| K4 | Preserve schedule on immediate **Break** | KEEP |
| K5 | Idle gating (no schedule without active session) | KEEP |
| K6 | Derived `breakPrompt` (not persisted) | KEEP |

### Future / worth implementing (post-V1)

| # | Item | Tag |
|---|------|-----|
| F1 | Compact “Break in Xm” strip variant | ADD |
| F2 | Browser notification bonus channel | ADD |
| F3 | `fable5` prototype parity (if surface revived) | ADD |
| F4 | Break-length soft ceiling (~180 min) anti-stuck-hold | ADD |
| F5 | Wall-clock “restart break at 5:00” snooze semantics | CHANGE |
| F6 | Recurring / stacked schedules | ADD |
| F7 | Schedule templates across sessions | ADD |
| F8 | Adherence analytics | ADD |
| F9 | System clock change mitigation | ADD |

---

## Phase 1 — V1 completion blockers

**Theme:** Fix correctness and accessibility gaps that prevent calling Schedule Break done.  
**Prerequisite:** None — start here.  
**Estimated effort:** 1 focused session.  
**Merge bundle suggestion:** `tweak/schedule-break-v1-blockers` or next M2 session branch.

### Why this phase is first

Two items break core product promise (null break length → no break-finished reminder). Three items fail WCAG / runbook acceptance (keyboard steppers, live region, notification announce). Nothing else matters until these ship.

### Work items

#### 1.1 Default break length 10 minutes — **CHANGE** (M1, M2)

| | |
|---|---|
| **Problem** | `DEFAULT_BREAK_LENGTH_MINUTES = null`; one-click Save yields no break-finished notification |
| **Change** | Set constant to `10`; seed modal draft with `10`; on Save, coerce `null` → `10` if user cleared field |
| **Files** | `src/lib/focus-scheduled-break.ts`, `src/components/focus/schedule-break-modal.tsx` |
| **Acceptance** | Fresh modal → Break length shows 10 min; Save without edits → strip shows “10 min break”; break-finished card fires |

**Score impact:** Product Design +1.0, UX +0.5

#### 1.2 Keyboard-operable steppers — **CHANGE** (M3)

| | |
|---|---|
| **Problem** | ± buttons use `onPointerDown` only; Space/Enter on focused button does not step |
| **Change** | Add `onClick` handler mirroring step logic, or migrate to `NumberStepper` with both pointer and click paths; add `ArrowUp`/`ArrowDown` on stepper group `role="spinbutton"` |
| **Files** | `schedule-break-stepper-field.tsx` and/or `ui/stepper.tsx` |
| **Acceptance** | Keyboard-only pass: Tab to ± buttons, activate with Space/Enter; adjust both fields without pointer |

**Score impact:** Accessibility +3.5

#### 1.3 `aria-live` on countdown — **ADD** (M4)

| | |
|---|---|
| **Problem** | “Break in Xm Ys” updates visually but screen readers do not hear countdown |
| **Change** | Wrap countdown `<p>` in `aria-live="polite"` `aria-atomic="true"` |
| **Files** | `schedule-break-modal.tsx` |
| **Acceptance** | VoiceOver/NVDA announces countdown changes (throttle if too noisy — announce on minute boundaries only if needed) |

**Score impact:** Accessibility (included in 1.2 trajectory), Product Design +0.5

#### 1.4 Notification announce on appear — **CHANGE** (M5)

| | |
|---|---|
| **Problem** | `role="status"` may not interrupt; threshold crossing is easy to miss for SR users |
| **Change** | Use `role="alert"` for card container when mounted, or add brief `aria-live="assertive"` title; ensure focus is **not** stolen (manual control philosophy) |
| **Files** | `focus-break-notification.tsx` |
| **Acceptance** | SR announces “Time for a break” / “Break finished” when card appears |

**Score impact:** Accessibility (consolidated), UX +0.5

#### 1.5 Enter-key Save scoping — **CHANGE** (M6)

| | |
|---|---|
| **Problem** | `DialogContent onKeyDown Enter` saves even when user presses Enter in custom time input |
| **Change** | Remove global handler; use `type="submit"` form pattern, or ignore Enter when `event.target` is `input` |
| **Files** | `schedule-break-modal.tsx` |
| **Acceptance** | Enter in custom duration field commits picker only; Enter on Save button saves modal |

**Score impact:** UX +0.5, Code Quality +0.5

#### 1.6 Defensive `snoozeBreak` floor — **ADD** (P3)

| | |
|---|---|
| **Problem** | Programmatic snooze could theoretically push `breakAtMinutes` below valid floor |
| **Change** | After increment, clamp to `getMinBreakAtMinutes(currentFocusMinutes)` |
| **Files** | `focus-scheduled-break.ts` |
| **Acceptance** | Unit/manual: snooze never sets target below current focus + 5 min |

**Score impact:** State Management +0.5

### Phase 1 exit gate

- [ ] Manual test matrix items 1–3, 6–9 from review pass
- [ ] Keyboard-only modal test passes
- [ ] `npm run build && npm run lint` clean
- [ ] No regression on K1–K6 intentional wins

---

## Phase 2 — Product & UX alignment

**Theme:** Match spec intent for defaults and discoverability without removing power-user affordances yet.  
**Prerequisite:** Phase 1 merged.  
**Estimated effort:** 1 session.

### Why this phase is second

After blockers, milestone drift and control placement are the highest-impact product/UX fixes. They affect every first-time schedule.

### Work items

#### 2.1 Milestone table alignment — **CHANGE** (P1)

| | |
|---|---|
| **Problem** | Presets `[25, 30, 45, 60, 75, 90, 120, 150]` — e.g. 29 min focus defaults to 30, spec says 45 |
| **Change** | `BREAK_AT_PRESET_MINUTES = [25, 45, 60, 90, 120]`; keep +30 extend via `getBreakAtMenuOptions` |
| **Files** | `focus-scheduled-break.ts` |
| **Acceptance** | Table matches spec: 0→25, 18→25, 29→45, 46→60, 73→90, 101→120, 125→150 |
| **Note** | If founder prefers denser presets, log deviation in `decision-log.md` instead of changing code |

**Score impact:** Product Design +0.5, UX +0.5

#### 2.2 Entry point placement — **CHANGE** (P2, U2)

| | |
|---|---|
| **Problem** | Schedule Break floats `absolute left-full` beside ring — disconnected from Break, may clip on narrow widths |
| **Change** | Move into `TimerHoverControls` row: order **Pause · Break · Schedule Break · Stop** (or visible sibling row on mobile); use `CalendarClock` icon retained |
| **Files** | `workplace-focus-card.tsx` |
| **Acceptance** | Reading order = now-before-later; no horizontal clip at minimum supported viewport |

**Score impact:** UX +1.0, UI +0.5

#### 2.3 Break length cannot decrement to null — **CHANGE** (extends M2)

| | |
|---|---|
| **Problem** | User can still clear break length via picker “Not set” and − stepper |
| **Change** | Remove “Not set” option from break-length picker; floor − stepper at 5 min |
| **Files** | `schedule-break-duration-picker.tsx`, `schedule-break-stepper-field.tsx` |
| **Acceptance** | Break length always ≥ 5 after any interaction |

**Score impact:** Product Design +0.5

#### 2.4 Document snooze semantics — **DOC** (P4)

| | |
|---|---|
| **Change** | Update spec: threshold snooze = `breakAtMinutes += 5`; finished snooze = `breakLengthMinutes += 5` (total elapsed threshold, not wall-clock restart) |
| **Files** | `schedule-break-modal-spec.md`, `decision-log.md` |
| **Acceptance** | Spec and implementation agree; no ambiguous “restart at 5:00” wording |

**Score impact:** Product Design +0.5, Code Quality +0.5

### Phase 2 exit gate

- [ ] Spec milestone table verified manually at 3+ focus durations
- [ ] Schedule Break discoverable next to Break without layout clip
- [ ] Decision-log annotated

---

## Phase 3 — Architecture & code quality

**Theme:** Reduce duplication, add test safety net, close governance drift.  
**Prerequisite:** Phase 2 merged.  
**Estimated effort:** 1–2 sessions (test infra may add time).

### Why this phase is third

Functional product is correct after P1–P2; this phase makes the codebase maintainable and prevents regression. Required for Architecture and Code Quality scores to reach 9.5+.

### Work items

#### 3.1 Consolidate stepper implementations — **IMPROVE** (A1)

| | |
|---|---|
| **Problem** | `ui/stepper.tsx` unused; `ScheduleBreakStepperField` duplicates hold-to-repeat |
| **Change** | Option A (preferred): Extend `NumberStepper` with step=5, formatValue, min; modal uses it for both fields. Option B: Delete `ui/stepper.tsx` if schedule field becomes the single primitive |
| **Files** | `ui/stepper.tsx`, `schedule-break-stepper-field.tsx`, `schedule-break-modal.tsx` |
| **Acceptance** | One hold-to-repeat implementation; keyboard support from Phase 1 preserved |

**Score impact:** Architecture +1.5, Code Quality +1.0

#### 3.2 Duration picker decision — **IMPROVE** or **DOC** (A2)

| | |
|---|---|
| **Problem** | `ScheduleBreakDurationPicker` adds scope beyond spec |
| **Options** | **Simplify:** Remove dropdown/custom input; pure steppers only → best spec alignment. **Keep:** Retain picker as power-user enhancement → document in decision-log + FEATURE_INVENTORY |
| **Files** | `schedule-break-duration-picker.tsx`, modal |
| **Acceptance** | No orphan complexity; founder-aware decision recorded |

**Score impact:** Architecture +0.5, UX +0.5 (if simplified), Product Design +0.5 (if simplified)

#### 3.3 `remainingToBreakSeconds` API cleanup — **IMPROVE** (A3)

| | |
|---|---|
| **Problem** | Context exposes value strip does not consume |
| **Change** | Pass `remainingToBreakSeconds` into strip in Phase 4, OR narrow context type until strip needs it |
| **Files** | `focus-session-context.tsx`, `focus-next-break-strip.tsx` |
| **Acceptance** | No dead public API on `quick.*` |

**Score impact:** Architecture +0.5, State Management +0.5

#### 3.4 Unit tests for pure helpers — **ADD** (A4)

| | |
|---|---|
| **Problem** | No automated coverage for milestone, remaining, ready, finished, snooze |
| **Change** | Add test runner if missing (vitest/jest); test `focus-scheduled-break.ts` boundary cases from runbook |
| **Cases** | `getDefaultBreakAtMinutes` table rows; `getRemainingToBreakSeconds` never negative; `isBreakReady`/`isBreakFinished` mode gates; snooze immutability |
| **Files** | `src/lib/focus-scheduled-break.test.ts`, `package.json` |
| **Acceptance** | `npm test` passes in CI/local |

**Score impact:** Code Quality +1.5

#### 3.5 Governance docs — **DOC** (A5, A6, A7)

| | |
|---|---|
| **Change** | `FEATURE_INVENTORY` Schedule Break → **Shipped**; decision-log 2026-07-07 annotated; `breakPrompt` mode-gate comment in context |
| **Files** | `FEATURE_INVENTORY.md`, `decision-log.md`, `focus-session-context.tsx` |
| **Acceptance** | Inventory matches production; comment prevents future dual-prompt bug |

**Score impact:** Code Quality +0.5

### Phase 3 exit gate

- [ ] Single stepper primitive
- [ ] `npm test` passes for scheduled-break helpers
- [ ] FEATURE_INVENTORY updated
- [ ] No unused exports in context `quick` namespace

---

## Phase 4 — UX & UI polish

**Theme:** Elevate day-to-day experience from “works” to “effortless.”  
**Prerequisite:** Phase 3 merged (strip countdown depends on stable API).  
**Estimated effort:** 1 session.

### Work items

#### 4.1 Live countdown on Next Break strip — **ADD** (U1, A3)

| | |
|---|---|
| **Problem** | User must reopen modal to see “Break in …” |
| **Change** | Add second line or inline suffix: `formatBreakCountdownLabel(remainingToBreakSeconds)`; `aria-live="polite"` on strip countdown |
| **Files** | `focus-next-break-strip.tsx`, `workplace-focus-card.tsx` |
| **Acceptance** | Strip updates every second while focusing; shows “Break ready” at threshold |

**Score impact:** UX +1.0, Product Design +0.5, Accessibility +0.5

#### 4.2 Smooth stepper value transition — **IMPROVE** (U3)

| | |
|---|---|
| **Problem** | Spec requests smooth value animation; values jump |
| **Change** | CSS `transition` on value display; optional brief highlight on change (semantic `text-primary` flash) |
| **Files** | stepper component |
| **Acceptance** | Value changes feel intentional, not glitchy |

**Score impact:** UI +0.5, UX +0.5

#### 4.3 Duration picker semantic tokens — **IMPROVE**

| | |
|---|---|
| **Problem** | Stepper variant uses inline `style` with `FOCUS_TIMER_COLORS` and `ring-[#4f6ef7]/40` |
| **Change** | Replace with CSS variables / semantic tokens from `globals.css` or `focus-timer-appearance` |
| **Files** | `schedule-break-duration-picker.tsx` |
| **Acceptance** | No raw hex in component; dark mode consistent |

**Score impact:** UI +0.5

#### 4.4 Schedule visibility during break — **CHANGE** or **DOC** (U4)

| | |
|---|---|
| **Problem** | Strip hidden on break though schedule persists |
| **Options** | Show read-only strip on break (“Resume to continue toward …”), or document as intentional minimal UI |
| **Files** | `workplace-focus-card.tsx` |
| **Acceptance** | Founder sign-off on chosen behavior |

**Score impact:** UX +0.5

### Phase 4 exit gate

- [ ] Strip shows live countdown
- [ ] No inline hex in schedule-break components
- [ ] Responsive pass on Today page focus card

---

## Phase 5 — Worth implementing (post-V1 enhancements)

**Theme:** High-value additions that are not required for V1 sign-off but move scores toward 10.  
**Prerequisite:** Phases 1–4 complete.  
**Estimated effort:** Pick individually; each item is independent.

### Work items

| # | Item | Tag | Rationale | Score lift |
|---|------|-----|-----------|------------|
| 5.1 | Compact strip variant (“Break in 41 min”) | ADD | Responsive layouts with tight timer column | UX +0.5 |
| 5.2 | Browser notification bonus channel | ADD | OS-level reminder when tab backgrounded; in-app remains primary | UX +0.5 |
| 5.3 | `fable5` surface parity | ADD | Only if greenfield route becomes active again | UX +0.5 |
| 5.4 | Break-length soft ceiling (~180 min) | ADD | Prevent stuck hold-to-repeat runaway | Product +0.5 |
| 5.5 | Wall-clock snooze on break-finished (“5:00 from now”) | CHANGE | Spec literal interpretation; requires new field or reset `phase_started_at` — **product decision** | Product +0.5 |
| 5.6 | `focus-page-content.tsx` / `/focus` hub wiring | ADD | Second surface if founder uses focus hub daily | UX +0.5 |

### Phase 5 exit gate

- [ ] Each item has founder approval before implementation
- [ ] No regression on Phases 1–4 gates

---

## Phase 6 — Future roadmap & score-10 verification

**Theme:** Long-horizon features and final audit to confirm 10/10 across all dimensions.  
**Prerequisite:** Phases 1–4 required; Phase 5 optional.

### 6.1 Future product scope (not V1)

| # | Item | Notes |
|---|------|-------|
| F6 | Recurring break schedules | New data model |
| F7 | Schedule templates across sessions | Persistence beyond `StoredActiveFocusSession` |
| F8 | Adherence analytics | Supabase + privacy review |
| F9 | System clock change mitigation | Cross-cutting timer hardening |
| — | Calendar / wearable / health prompts | Explicitly out of M2 |

### 6.2 Score-10 verification checklist

Run this audit after Phases 1–4 (and any Phase 5 items) to confirm all dimensions at 10.

#### Product Design — 10/10

- [ ] Two decisions only: Break at + Break length (no null, no hidden third state)
- [ ] Milestone defaults match approved table
- [ ] One-click Save works out of the box
- [ ] Manual-control philosophy documented and enforced in code paths
- [ ] All decision-log deviations explicit

#### UX — 10/10

- [ ] Schedule Break adjacent to Break; reading order clear
- [ ] Full loop ≤ 3 clicks from schedule to first reminder action
- [ ] Strip answers “when” without reopening modal
- [ ] No dead-ends on touch, keyboard, or narrow viewport

#### UI — 10/10

- [ ] Semantic tokens only in all schedule-break files
- [ ] Smooth stepper transitions
- [ ] Cards, strip, modal visually consistent with workplace focus card
- [ ] Responsive at min supported width

#### Architecture — 10/10

- [ ] One stepper primitive
- [ ] Pure math only in `focus-scheduled-break.ts`
- [ ] Presentational notification/strip; context owns mutations
- [ ] No dead public API
- [ ] Picker complexity justified and documented OR removed

#### State Management — 10/10

- [ ] Three fields persisted; all else derived
- [ ] Multi-tab + refresh verified
- [ ] Defensive clamps in helpers
- [ ] `breakPrompt` mode-gate documented

#### Accessibility — 10/10

- [ ] WCAG 2.2 AA keyboard pass on modal + strip + cards
- [ ] `aria-live` on countdowns
- [ ] Notifications announced
- [ ] Focus trap + Escape + scoped Enter
- [ ] Contrast check on primary-tinted notification card

#### Code Quality — 10/10

- [ ] Unit tests for all exported helpers in `focus-scheduled-break.ts`
- [ ] `npm run build && npm run lint` clean
- [ ] FEATURE_INVENTORY accurate
- [ ] No duplicate hold-to-repeat logic
- [ ] Intentional wins (K1–K6) preserved

---

## Recommended execution order (summary)

```
Phase 1  V1 blockers          → ship gate (accessibility + defaults)
Phase 2  Product/UX align     → spec fidelity + discoverability
Phase 3  Architecture/quality → tests + dedup + docs
Phase 4  UX/UI polish         → strip countdown + tokens + animation
Phase 5  Worth implementing   → optional enhancements (pick per item)
Phase 6  Future + 10/10 audit → long roadmap + final verification
```

### Minimum path to “V1 done”

**Phases 1 + 2 only** — acceptable for merge to `main` if founder prioritizes speed. Scores land ~**8.5–9.0** average.

### Minimum path to “review scores 10/10”

**Phases 1 + 2 + 3 + 4 + Phase 6 audit** — Phase 5 is optional for 10/10 unless founder wants browser notifications or compact strip.

---

## Branch & merge guidance

| Phase | Suggested branch | Merge bundle |
|-------|------------------|--------------|
| 1 | `tweak/schedule-break-a11y-defaults` | B1 with Phase 2 if small |
| 2 | `tweak/schedule-break-ux-align` | Combine with Phase 1 |
| 3 | `m2/session-N-schedule-break-hardening` | Separate if test infra is large |
| 4 | `tweak/schedule-break-polish` | Independent |
| 5+ | Per-item `tweak/…` or inbox promotion | Independent |

Per [GIT_WORKFLOW.md](../../foundation/governance/GIT_WORKFLOW.md): never merge to `main` without founder approval; run `npm run build && npm run lint` (and `npm test` once Phase 3 lands) before asking.

---

## Related documents

- [schedule-break-implementation-review.md](./schedule-break-implementation-review.md) — audit source
- [schedule-break-modal-spec.md](../design/schedule-break-modal-spec.md) — product spec
- [m2-schedule-break.md](../../execution/runbooks/m2-schedule-break.md) — original implementation runbook

---

*When all phases through Phase 4 are complete and Phase 6 audit passes, Schedule Break meets the review’s 10/10 target across every quality dimension.*
