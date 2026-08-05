# Phase 2 Gate Checklist — Gate 2: Contract Coherence

**Status:** OPEN — Phase 2 authorized by Founder on 2026-08-05; sprint active
**Owner:** Founder (executed via 6-hat solo workflow)
**Parent:** [Phase 2 README](./README.md) · [MVP Implementation Masterplan](../mvp-implementation-masterplan.md)
**Created:** 2026-08-05
**Last Updated:** 2026-08-05

---

## Gate 2 Definition

**Gate 2 — Contract coherence:** A designer, engineer, and reviewer can trace each admitted behavior to a parent system, a journey, a design expression, a data/technical owner, and a validation question without inventing missing rules.

This gate measures contract completeness and traceability; it does not require Phase 3 implementation. A contract may pass when its behavior, design, technical ownership, and validation questions are explicit and traceable, even if the code does not yet exist.

## Gate 2 Scope

- Today, Tasks, Focus, and Reflection feature briefs and behavior contracts
- The bounded journey contract (orientation, commitment, action, evidence, sensemaking, adaptation)
- Minimum Habits, Schedule, and Notes behavior decisions
- Source ownership, provenance, correction, and continuity rules
- Feature design specifications with full state coverage

## Gate 2 Exit Criteria

- [ ] Every core domain (Today, Tasks, Focus, Reflection) has a feature brief and behavior contract.
- [ ] Every admitted behavior traces to a parent system, a journey, a design expression, a data/technical owner, and a validation question.
- [ ] The bounded journey contract connects orientation, commitment, action, evidence, sensemaking, and adaptation.
- [ ] Supporting domains (Habits, Schedule, Notes) have an explicit minimum-behavior decision that supports the journey.
- [ ] Source ownership, provenance, correction, and continuity rules are defined for the MVP records.
- [ ] Feature design specifications cover content, accessibility, responsive, loading, empty, error, interruption, and recovery states.
- [ ] Delivery designs are created only after behavior and design contracts are approved.
- [ ] Contracts reference the Phase 1.5 validation, form, and date/time patterns.
- [ ] The Founder records `PASS`, `HOLD`, or `REWORK`, with date, rationale, and next-phase authorization or conditions.

## Contract Register

Use one row per contract or surface. `Complete` means the contract satisfies Gate 2 exit criteria; `Partial` is allowed only when every gap is owned and dispositioned; `Unknown` cannot pass.

| Contract / surface | Type | MVP role | Traces to journey | Data/technical owner | Validation questions | Evidence link | State |
|---|---|---|---|---|---|---|---|
| **Today** | Feature brief + behavior contract | Core entry and reorientation | ☐ | ☐ | ☐ | | `NOT_STARTED` |
| **Tasks** | Feature brief + behavior contract | Core commitment and action | ☐ | ☐ | ☐ | | `NOT_STARTED` |
| **Focus** | Feature brief + behavior contract | Core deliberate-attention mode | ☐ | ☐ | ☐ | | `NOT_STARTED` |
| **Reflection** | Feature brief + behavior contract | Core sensemaking and adaptation | ☐ | ☐ | ☐ | | `NOT_STARTED` |
| **Journey** | Bounded journey contract | Coherent loop across surfaces | ☐ | ☐ | ☐ | | `NOT_STARTED` |
| **Habits** | Supporting decision | Supports the core journey | ☐ | ☐ | ☐ | | `NOT_STARTED` |
| **Schedule** | Supporting decision | Supports the core journey | ☐ | ☐ | ☐ | | `NOT_STARTED` |
| **Notes / Knowledge** | Supporting decision | Supports the core journey | ☐ | ☐ | ☐ | | `NOT_STARTED` |

## Known limitations and owners

- Phase 1.5 carried-forward items remain visible: Singapore midnight boundary, Schedule keyboard review, `npm audit` remediation, existing lint warnings, and the middleware-to-proxy deprecation. A Phase 2 contract may reference these only as explicit limitations or follow-up owners; they do not gate Phase 2 contracting.
- Contracts must not silently promote a deferred domain (Goals, AI Coach, Progress as a destination) into MVP scope.

## Decision

**Decision:** Pending — the Founder records `PASS`, `HOLD`, or `REWORK` at Gate 2 review.
**Date:** TBD
**Founder:** Founder
**Rationale and unresolved conditions:** TBD
**Next-phase authorization:** TBD — Phase 3 may be authorized only on a `PASS` decision.
