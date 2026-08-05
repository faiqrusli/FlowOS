# Reflection Core-Loop Validation Plan

**Status:** `APPROVED` — Founder checkpoint passed through D-010; automated evidence recorded, manual/live validation pending
**Owner:** Engineering Architect (Founder), with Product and Design review
**Created:** 2026-08-05
**Last updated:** 2026-08-05
**Decision this plan informs:** Reflection implementation readiness and Gate 3 contribution
**Authorized behavior contract:** [Reflection behavior contract](../behavior/reflection.md)
**Delivery design:** [Reflection core-loop delivery design](../delivery/reflection-core-loop.md)
**Design specification:** [Reflection design specification](../../05-design/features/reflection-design-spec.md)
**Journey context:** [MVP coherent loop](../../03-experience/journeys/mvp-coherent-loop.md)
**Evidence record location:** [Reflection implementation evidence](../../current-phase/phase-3/reflection-implementation-evidence.md) (automated record; manual/live record pending)
**Gate link:** [Gate 3 checklist](../../current-phase/phase-3/gate-checklist.md)
**Implementation evidence:** [Reflection implementation evidence](../../current-phase/phase-3/reflection-implementation-evidence.md)
**Review trigger:** Any change to a `REFLECT-*` question, record relationship, save threshold, adaptation handoff, or recovery rule.

> This plan defines evidence to collect. It contains no implementation result, release approval, or Gate 3 decision.

## Decision scope and acceptance matrix

| ID | Acceptance question | Required evidence | Pass condition |
|---|---|---|---|
| `REFLECT-01` | Direct/Today/Focus entry identifies record being edited/appended | Entry-path and record-identity walkthrough | Record type/identity/source is explicit |
| `REFLECT-02` | Empty/local/saving/saved/failed/corrected/historical/skipped/unavailable/disconnected differ | State tests and accessible UI review | No pending/local/empty state is called saved or failure |
| `REFLECT-03` | Draft/autosave stays non-durable until confirmation | Network/failure/re-entry scenario | Local and pending values are disclosed and recoverable |
| `REFLECT-04` | Interpretation stays distinct from facts, derived summaries, recommendations, applied change | Seeded semantic walkthrough | Reflection is user-provided; source facts and applied state retain owners |
| `REFLECT-05` | Correction/withdrawal preserve interpretation history and source facts | Owner-history and unchanged-source assertion | No source fact is rewritten by reflection correction |
| `REFLECT-06` | Daily/custom/session-end entries remain separate | Multi-entry seeded walkthrough | No replacement/duplication semantics |
| `REFLECT-07` | Adaptation proposal/apply/defer/decline/leave are explicit | Receiving-owner handoff walkthrough | Reflection cannot mutate commitments implicitly |
| `REFLECT-08` | Identity, RLS, validation, date/time, drafts, unavailable sources are testable | Static/service/two-account/Singapore review | No unscoped access or browser date drift |

## Methods and scenarios

- Automated tests cover schemas, record identity, pending/failed transitions, local-draft re-entry, separate daily/custom/session-end persistence, and no-cross-owner mutation.
- Manual seeded and real-data walkthrough covers direct entry, Today entry, Focus session-end handoff, save, retry, correction, withdrawal, skip, interruption, re-entry, proposal, receiving-owner apply/decline, and safe departure.
- Fixtures include empty record, local draft, failed save, historical entry, linked concluded session, adaptation proposal, two distinct accounts, and Singapore-midnight date boundary.
- Accessibility review covers field errors, save status, live announcements, keyboard/focus, responsive sidebar/full page, touch, and reduced motion.

## Analysis and decision rules

Any hidden durable write, interpretation presented as fact, implicit adaptation, lost history, cross-account exposure, or inaccessible recovery is `Block`. `Concern`, `Rework`, and `Inconclusive` require explicit disposition and do not pass silently.

## Quality and evidence handling

Run repository checks before the implementation checkpoint and Gate 3 evidence. Record record identity/type, date key, fixture, method, result, and limitation while redacting reflection content.

## Change control

Changing record relationship, save semantics, adaptation authority, threshold, or fixture interpretation requires review of the Reflection contract, delivery design, sprint, and Gate 3 checklist.
