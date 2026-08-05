# Focus Core-Loop Validation Plan

**Status:** `DRAFT` — ready for Founder scope/design checkpoint
**Owner:** Engineering Architect (Founder), with Product and Design review
**Created:** 2026-08-05
**Last updated:** 2026-08-05
**Decision this plan informs:** Focus implementation readiness and Gate 3 contribution
**Authorized behavior contract:** [Focus behavior contract](../behavior/focus.md)
**Delivery design:** [Focus core-loop delivery design](../delivery/focus-core-loop.md)
**Design specification:** [Focus design specification](../../05-design/features/focus-design-spec.md)
**Journey context:** [MVP coherent loop](../../03-experience/journeys/mvp-coherent-loop.md)
**Evidence record location:** `docs/current-phase/phase-3/evidence/focus-core-loop/` (planned)
**Gate link:** [Gate 3 checklist](../../current-phase/phase-3/gate-checklist.md)
**Review trigger:** Any change to a `FOCUS-*` question, lifecycle threshold, attribution assumption, handoff, or recovery rule.

> This plan defines evidence to collect. It contains no implementation result, migration result, release approval, or Gate 3 decision.

## Decision scope and acceptance matrix

| ID | Acceptance question | Required evidence | Pass condition |
|---|---|---|---|
| `FOCUS-01` | Start/pause/resume/conclude/leave/re-enter preserve confirmed state | Lifecycle tests and interrupted manual walkthrough | Re-entry restores last confirmed state and explicit uncertainty |
| `FOCUS-02` | Timing/lifecycle remain factual, not outcome | Copy/semantic assertions and seeded review | Duration is scoped session fact; no completion/quality claim |
| `FOCUS-03` | Task selection remains planned | Task before/after assertion and deep-entry review | No task mutation occurs from selection or session start |
| `FOCUS-04` | Pending attribution migration is unavailable, not guessed | Migration-state fixture and history review | No totals/attribution claim before live verification |
| `FOCUS-05` | Lifecycle/degraded/recovery states are observable and accessible | Fault injection, keyboard/screen-reader review | Each applicable state has truthful text and operable recovery |
| `FOCUS-06` | Reflection owns interpretation and failed handoff is visible | Conclusion/handoff failure scenario | Session remains factual; adaptation is not applied |
| `FOCUS-07` | Identity, RLS, validation, time, drafts, migration limits are testable | Static/service review, two-account plan, Singapore boundary test | No unscoped access or invented timer/session state |

## Methods and scenarios

- Automated tests cover lifecycle transitions, pending/failed behavior, late response protection, elapsed-time semantics, attribution-unavailable mapping, and unchanged Task state.
- Manual seeded and real-data walkthrough covers direct and deep entry, start, pause, resume, conclude, leave, tab close/network interruption, re-entry, retry, history, and Reflection handoff.
- Fixtures include an active session, paused session, selected-but-unattributed Task, failed conclusion, local recovery payload, unavailable attribution, and two distinct accounts.
- Accessibility review covers keyboard controls, visible focus, concise timer announcements, state/error announcements, responsive layouts, touch targets, and reduced motion.

## Analysis and decision rules

`Pass` requires all `FOCUS-*` questions to have evidence or accepted limitation, with no fabricated session state, task attribution, outcome claim, owner breach, or inaccessible recovery. `Concern`, `Rework`, `Block`, and `Inconclusive` follow the Gate 3 evidence rules; none is silently converted to pass.

## Quality and evidence handling

Run `npm test`, `npm run lint`, configured `npm run build`, and `git diff --check` before the implementation checkpoint and again before Gate 3 evidence. Record confirmed instants, product date key, browser/viewport, migration applied-state, result, and limitation without logging user content.

## Change control

Changing lifecycle meaning, attribution, handoff, thresholds, or fixture interpretation requires review of the Focus contract, delivery design, sprint, and Gate 3 checklist before evidence is interpreted.
