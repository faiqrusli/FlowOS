# Today Orientation — Validation Plan

**Status:** `DRAFT` — Founder scope/design checkpoint pending
**Owner:** Engineering Architect (Founder), with Product Architect review
**Created:** 2026-08-05
**Last updated:** 2026-08-05
**Decision this plan informs:** Whether the proposed Today orientation delivery design is ready for implementation on `sprint/phase3`
**Authorized behavior contract:** [Today behavior contract](../behavior/today.md)
**Authorized brief:** [Today feature brief](../briefs/today.md)
**Delivery design:** [Today orientation delivery design](../delivery/today-orientation.md)
**Design specification:** [Today design specification](../../05-design/features/today-design-spec.md)
**Journey context:** [MVP coherent loop](../../03-experience/journeys/mvp-coherent-loop.md) — Orientation and reorientation
**Success model:** [FlowOS Success Model](../../01-product/success-model.md)
**Risk domains:** Behavior | accessibility | reliability | security | privacy | trust | outcome
**Evidence record locations:** `docs/current-phase/phase-3/evidence/today-orientation/` (planned execution evidence); `docs/09-reviews/records/today-orientation-validation-review.md` (planned review)
**Review trigger:** Any change to the Today contract, source set, acceptance questions, evidence threshold, owner handoff, or recovery semantics.

> This plan defines evidence to collect. It contains no executed results, release approval, Gate 3 decision, or claim that implementation exists.

## Decision and scope

### Decision

The Founder will decide whether the Today orientation delivery design and this validation plan are sufficiently bounded and testable to authorize implementation. Later execution evidence will inform Today contribution to Gate 3; it will not by itself authorize production release.

### In scope

- Direct entry at `/` and re-entry after returning from an owner surface.
- Source-aware composition of available Tasks, Focus, Reflection, Habits, Schedule, and optional Notes context.
- Loading, ready, empty, partial, stale, unavailable, disconnected, error, pending, confirmed, failed, and recovery expression where applicable.
- Canonical owner handoffs, identity preservation, safe departure, retry, and correction at the owner.
- Factual versus planned, interpretive, derived, and unavailable meaning.
- User-scoped access, RLS boundaries, `requireUserId()`, Singapore date keys, instant timestamps, local-draft semantics, and pending-migration truth.

### Explicit exclusions

- Implementing Tasks, Focus, Reflection, or supporting-domain behavior beyond the existing owner surfaces.
- Any Today durable write, new table, new migration, new route, autonomous prioritization, score, inferred attribution, or implicit adaptation.
- Applying or claiming `tasks_next_up_queue.sql` or `focus_session_task_totals.sql` as live behavior.
- Gate 3 passage, Gate 4 passage, production release, longitudinal product outcomes, or causal life improvement.

## Validation questions

| ID | Question | Decision relevance | Primary method | Limitation of method |
|---|---|---|---|---|
| TODAY-01 | Can an authenticated person distinguish current, planned, factual, interpretive, derived, stale, empty, and unavailable context? | Comprehension and reality contact | Seeded/empty manual walkthrough with think-aloud or structured explanation | A single Founder walkthrough does not establish population-level comprehension |
| TODAY-02 | Does every consequential action hand off to the canonical owner without a Today write? | Authority and product integrity | Interaction tests, route inspection, and manual handoff walkthrough | Static inspection cannot prove every runtime path without execution evidence |
| TODAY-03 | Does Today avoid treating selection, schedule, elapsed duration, projection, or absence as an outcome? | Trust and anti-metric protection | Contract-level assertions, copy review, and seeded scenarios | Passing text checks does not prove a person understood every implication |
| TODAY-04 | Can a person enter directly, re-enter after interruption, pause, decline, retry, correct at the owner, or leave without a forced ritual? | Agency and recovery | Manual scenario walkthrough plus route/state tests | Manual coverage is bounded to supported browsers and prepared fixtures |
| TODAY-05 | Are loading, empty, partial, stale, unavailable, disconnected, error, and recovery states observable and accessible? | Reliability, accessibility, and truthful limitation | Fault-injected adapter tests, keyboard/screen-reader review, and responsive manual checks | Fault injection may not reproduce every provider or network failure |
| TODAY-06 | Do `requireUserId`, RLS, Zod/RHF, `date-fns`, `Asia/Singapore`, instant timestamps, and pending-migration limits remain explicit at the handoff boundary? | Security and foundation integrity | Service-boundary tests, code review, date-boundary tests, and migration-state review | Two-account live isolation and production environment checks remain separate Gate 4 evidence |

## Acceptance and guardrail matrix

| Contract / signal | Acceptance or guardrail | Required evidence | Pass condition | Anti-metric protection |
|---|---|---|---|---|
| `TODAY-01` / Clarity | Source, state, freshness, and truth meaning are understandable in the page hierarchy | Seeded, empty, stale, and unavailable walkthrough notes | Person can name what is current, planned, factual, interpretive, and unavailable without the UI implying a score | Do not use task count, completion, or time as clarity proof |
| `TODAY-02` / Agency and trust | Owner-entry controls identify the canonical destination and Today issues no durable mutation | Interaction tests, network/service spy where available, and manual handoff evidence | Each consequential action reaches its owner; Today remains read/composition-only | Do not optimize for handoff clicks or recommendation acceptance |
| `TODAY-03` / Reality contact | Planned selection, schedule, elapsed time, projections, and absence remain non-outcome meanings | Copy/component review and semantic assertions | No “on track,” universal completion score, inferred attribution, or outcome claim appears | Total tasks, total Focus time, reflection count, and time in product remain anti-metrics |
| `TODAY-04` / Deliberate-action activation | A person can choose, decline, leave, and recover without a forced funnel | Direct/deep entry and interruption walkthrough | Valid non-action exits preserve records and do not report a completed stage | Faster movement is not treated as value without observed intent |
| `TODAY-05` / Reliability and accessibility | Per-source failure does not erase confirmed unrelated context; all material states are operable and announced | Settled-read tests, keyboard/focus review, responsive checks | Each applicable state has truthful text, scoped recovery, and no hover/color-only consequence | A successful happy path does not waive degraded-state evidence |
| `TODAY-06` / Security and foundation | Identity, RLS, date/time, validation, local draft, and pending migration constraints are preserved | Static review, unit tests, date boundary tests, RLS evidence plan | No unscoped read, browser-timezone date key, inferred migration capability, or durable Today draft | Data volume and feature parity are not security or quality evidence |
| Success Model: Decision value | Orientation helps the person make a clearer next choice | Structured manual observation and Founder notes during seeded walkthrough | Evidence may describe the decision moment and uncertainty; no causal outcome claim is made | Generic satisfaction or completion is insufficient |
| Success Model: Agency and trust | Person can understand, control, correct, and decline | Handoff, correction, departure, and limitation review | No hidden mutation, coercive language, or opaque source state | Recommendation acceptance and uninterrupted use are not trust metrics |

## Methods and rationale

### 1. Automated contract and composition tests

Create focused Vitest coverage for the proposed Today read model and pure state/meaning helpers:

- date key uses `Asia/Singapore` independently of the browser timezone;
- each source settles independently into ready, empty, partial, stale, unavailable, or error state;
- one failed source preserves unrelated confirmed sources;
- pending Next Up and Focus attribution migrations produce unavailable treatment, never a guessed value;
- selection, retry, leave, and owner-entry actions do not invoke a Today durable write;
- the old score-like “on track” interpretation is absent from Today orientation; and
- late refresh responses cannot replace newer confirmed state.

These tests establish deterministic behavior of the adapter and state mapping. They do not establish visual comprehension, live RLS isolation, or production reliability.

### 2. Component and interaction validation

Use the project’s existing test harness where it supports the relevant component boundaries. If a new browser/component harness would be required, document that as an implementation dependency rather than weakening the scenarios. Validate:

- source module labels and state text are present in the accessible tree;
- retry is scoped to the affected source;
- owner-entry controls name the destination and context;
- focus is preserved or moved only under the design specification’s rules;
- source failure does not replace confirmed unrelated context; and
- no mutation handler is attached to Today-only selection, navigation, retry, or departure.

### 3. Manual seeded and real-data walkthrough

Run the same bounded journey with a seeded account and then with real Founder data after implementation exists. Record the exact source fixtures, date key, browser, viewport, and observed limitations. At minimum:

1. Open `/` directly while authenticated and identify the date and composition state.
2. Open a task owner, return to Today, and verify the task state is owner-confirmed or explicitly pending/stale.
3. Select planned context for Focus without showing task completion or inferred attribution.
4. Open Focus and Reflection through their owning surfaces; verify factual session context remains distinct from interpretation.
5. Leave without choosing a next action; verify no stage or outcome is inferred.
6. Interrupt a read or handoff, re-enter, retry, and correct at the owner.
7. Repeat with empty and unavailable supporting sources.

### 4. Accessibility and responsive review

Use keyboard-only navigation at desktop, tablet, and mobile-width layouts. Verify heading/landmark order, visible focus, source/state/recovery announcements, no hover-only material information, and reduced-motion behavior. Use a screen reader where available for the final manual review. Record limitations instead of treating an unavailable assistive tool as a pass.

### 5. Security and foundation review

Review every Today read and owner handoff for `requireUserId()`, user-scoped access, RLS, safe errors, and no service-role exposure. Add targeted two-account isolation evidence before Gate 4. Verify the Singapore midnight boundary with deterministic tests and a controlled manual boundary check before core-loop release hardening. Confirm the pending SQL definitions are not treated as applied.

### 6. Repository quality checks

Before implementation handoff and again before release evidence, run `npm test`, `npm run lint`, `npm run build`, and `git diff --check` as applicable. The required Supabase environment must be present before relying on the production build; the known local `NEXT_PUBLIC_SUPABASE_URL` limitation remains disclosed until then. Existing warnings, audit vulnerabilities, and middleware deprecation are recorded rather than silently treated as resolved.

## Scenarios and conditions

| Scenario | Required condition and expected assessment |
|---|---|
| Normal path | Seeded Tasks/Focus/Reflection context renders with source and truth meaning; owner entry works |
| Alternative valid path | Person declines, leaves, or enters an owner directly without Today fabricating a prior stage |
| First use / empty | No task, habit, reflection, or optional source is represented as bounded empty context, not deficiency or failure |
| Returning / interrupted | Return restores last confirmed owner state and discloses pending, local, stale, or unavailable context |
| Partial source failure | One source fails while unrelated confirmed modules remain usable |
| Stale refresh | Previously confirmed context is shown as stale/historical with retry; no current claim is made |
| Pending migration | Next Up persistence or Focus attribution is unavailable and never inferred |
| Correction / withdrawal | Correction opens the canonical owner; Today does not rewrite history or apply an adaptation |
| Authority-sensitive action | Task selection, Focus start, Reflection save, habit completion, and planning actions remain owner-controlled |
| Authentication / permission change | Expiry or denied access becomes unavailable/access-required, not empty or success |
| Accessibility / inclusive use | Keyboard, screen reader, responsive, touch, and reduced-motion paths preserve understanding and control |
| Misuse / harm condition | No score, shame, coercive urgency, silent automation, or raw sensitive error exposure appears |

## Fixtures, data, and environment

### Fixtures

- Account A with confirmed tasks, habits, a Focus session, reflection, and optional planning context.
- Account A with no records for one or more source domains.
- Account A with a forced source failure, unavailable source, stale last-confirmed projection, and pending migration capability.
- Account B with distinct records for isolation testing; no cross-account fixture data is reused.
- A task selected for Focus but not completed, and a Focus session with attribution unavailable.
- Reflection text that is clearly user interpretation and a factual session record to verify semantic distinction.

### Environment and cleanup

- Use a non-production test project or safe seeded data; do not expose real user data in logs or screenshots.
- Record `Asia/Singapore` date key, instant timestamps, browser timezone, viewport, authentication state, and migration applied-state for each run.
- Provide `NEXT_PUBLIC_SUPABASE_URL` and the required Supabase environment before relying on production build output.
- Remove or reset test fixtures after execution without altering historical evidence records.

## Analysis and decision rules

The Founder interprets the evidence at the scope/design checkpoint and later review. The following dispositions apply:

- **Pass:** All six `TODAY-*` questions have evidence or an explicitly accepted limitation, no owner/security/truth breach is found, and the implementation may proceed within the approved boundary.
- **Concern:** Evidence is usable but a non-blocking issue remains; the issue receives an owner and due disposition before the affected gate.
- **Rework:** The delivery design, validation plan, or implementation needs correction before implementation or before the next evidence run.
- **Block:** Any unauthorized write, cross-account exposure, inferred attribution, hidden pending state, fabricated outcome, unsafe error, or inaccessible material recovery path stops progression.
- **Inconclusive:** Evidence cannot answer the question; it is not a pass and requires additional evidence, narrower scope, or Founder disposition.

Passing automated tests alone cannot establish comprehension, trust, accessibility, safety, or outcome value. Positive manual experience cannot waive security, reliability, or data-integrity evidence.

## Safety, privacy, and ethics

- Use the minimum fixture data necessary and redact user content from logs and screenshots.
- Do not require a person to accept a suggestion, complete a task, save a reflection, or continue a journey to demonstrate success.
- Treat correction, decline, leave, and non-use as valid evidence of agency.
- Stop and escalate for unauthorized access, data loss, misleading factual claims, coercive language, hidden automation, or inability to recover a material state.

## Evidence, review, and record handling

Execution evidence will be stored under the planned Today orientation evidence path with source, date, fixture, method, observed result, and limitation. A review record will assess the evidence against this plan and link any defects or decision records. The Gate 3 checklist will link the completed evidence package; this draft does not pre-fill results.

If a contract, threshold, or fixture changes after evidence collection begins, record the change and assess parent-document impact before interpreting results. Do not rewrite a failed or inconclusive result into a pass.

## Change control

Changing an acceptance question, source owner, truth meaning, required state, evidence threshold, or release implication requires review of the Today behavior contract, delivery design, current sprint, and Gate 3 checklist. Technical test refinements that preserve the approved boundary may update this plan with a dated explanation.
