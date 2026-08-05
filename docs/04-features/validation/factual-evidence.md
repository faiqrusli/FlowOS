# Factual Evidence Validation Plan

**Status:** `APPROVED` — Founder checkpoint passed through D-010; automated evidence recorded, manual/live validation pending
**Owner:** Engineering Architect (Founder), with Product and Design review
**Created:** 2026-08-05
**Last updated:** 2026-08-05
**Decision this plan informs:** Factual evidence implementation readiness and Gate 3 contribution
**Authorized behavior contracts:** [MVP record rules](../record-rules.md) · [Tasks](../behavior/tasks.md) · [Focus](../behavior/focus.md)
**Delivery design:** [Factual evidence delivery design](../delivery/factual-evidence.md)
**Journey context:** [MVP coherent loop](../../03-experience/journeys/mvp-coherent-loop.md)
**Evidence record location:** [Factual evidence implementation evidence](../../current-phase/phase-3/factual-evidence-implementation-evidence.md) (automated record; manual/live record pending)
**Gate link:** [Gate 3 checklist](../../current-phase/phase-3/gate-checklist.md)
**Implementation evidence:** [Factual evidence implementation evidence](../../current-phase/phase-3/factual-evidence-implementation-evidence.md)
**Review trigger:** Any change to provenance classes, evidence source, derivation, attribution, correction, or acceptance threshold.

> This plan defines evidence to collect. It contains no implementation result, release approval, or Gate 3 decision.

## Decision scope and acceptance matrix

| ID | Acceptance question | Required evidence | Pass condition |
|---|---|---|---|
| `RECORD-01` | Every displayed record names owner/provenance | Projection contract and seeded UI review | Source, identity, provenance, freshness/scope are recoverable |
| `RECORD-02` | Task lifecycle/removal/deletion meanings stay distinct | Owner history walkthrough | Withdrawal is not completion/deletion; history remains traceable |
| `RECORD-03` | Next Up is Task-owned with truthful fallback | Migration-state fixture | No queue guarantee before verified migration |
| `RECORD-04` | Focus attribution is never inferred | Selected Task/session fixture | Attribution unavailable is explicit |
| `RECORD-05` | Reflection records stay separate and linked | Session-end/daily/custom walkthrough | No replacement/duplication semantics |
| `RECORD-06` | Lifecycle/correction states survive interruption | Fault/re-entry review | Current/history/pending/failed/local/unavailable states remain distinct |
| `RECORD-07` | Planned/direct/user/source/derived/proposed/applied meanings stay distinct | Semantic assertions and seeded walkthrough | No class is relabelled to imply stronger evidence |
| `RECORD-08` | Security/foundation constraints are testable | Static/service/date/RLS review | No unscoped read, browser date drift, or unsupported migration claim |
| `JOURNEY-03`/`04`/`08` | Core loop preserves truth and can reach explicit receiving-owner application | Full seeded journey plus partial valid path | Factual, interpretive, proposed, applied, and unavailable states are understandable |

## Methods and scenarios

- Pure adapter tests verify source identity, provenance, derivation, freshness, unavailable mapping, and late-response protection.
- Seeded walkthrough verifies task selection is not completion, Focus timing is not outcome, Reflection is interpretation, and adaptation is applied only by its receiving owner.
- Correction/withdrawal/deletion review verifies source-owner history and unchanged neighboring records.
- Empty, partial, stale, failed, disconnected, and pending-migration fixtures verify no silent inference.
- Security/date evidence uses two accounts, RLS checks, `requireUserId`, and a Singapore-midnight boundary.

## Analysis and decision rules

Any missing source/owner/provenance, inferred attribution/outcome, cross-account exposure, or inaccessible correction route is `Block`. All other concerns require an explicit owner and disposition; inconclusive evidence does not pass.

## Quality and evidence handling

Run repository checks before the implementation checkpoint and Gate 3 evidence. Store source/fixture/date/method/result/limitation and redact content. Passing test counts are not proof of meaning or trust.

## Change control

Changing a provenance class, evidence source, derivation rule, or owner requires review of the record rules, participating contracts, delivery design, sprint, and Gate 3 checklist.
