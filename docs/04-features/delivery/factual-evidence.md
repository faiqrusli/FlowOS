# Factual Evidence Delivery Design

**Status:** `DRAFT` — ready for Founder scope/design checkpoint
**Owner:** Engineering Architect (Founder)
**Product scope owner:** Product Architect (Founder)
**Created:** 2026-08-05
**Last updated:** 2026-08-05
**Authorized behavior contracts:** [Tasks](../behavior/tasks.md) · [Focus](../behavior/focus.md) · [MVP record rules](../record-rules.md)
**Authorized brief/context:** [Tasks brief](../briefs/tasks.md) · [Focus brief](../briefs/focus.md) · [MVP coherent loop](../../03-experience/journeys/mvp-coherent-loop.md)
**Design specifications:** [Tasks](../../05-design/features/tasks-design-spec.md) · [Focus](../../05-design/features/focus-design-spec.md)
**Affected engineering domains:** Owner records | derived read models | Today/Focus history | provenance | security | correction | operations
**Risk level:** `High`
**Migration required:** `No` for source facts; `Conditional` for verified Focus attribution
**Rollout class:** `Direct` and reversible as a read/projection change
**Rollback owner:** Founder / Implementation Engineer; revert projection code and preserve source records
**Validation plan:** [Factual evidence validation plan](../validation/factual-evidence.md)
**Evidence links:** [Phase 3 current sprint](../../current-phase/current-sprint.md) · [Gate 3 checklist](../../current-phase/phase-3/gate-checklist.md)
**Review trigger:** Any new evidence type, source owner, derivation rule, attribution guarantee, correction path, or outcome language.

> This design does not create a universal score or a new evidence owner. It coordinates truthful presentation of evidence already confirmed by canonical source owners.

## Authorized behavior

Evidence is the factual part of the core loop: owner-confirmed task lifecycle records, Focus session lifecycle/timing records, and relevant source records. Planned selections, schedules, elapsed time by itself, projections, reflection interpretation, and absence are not universal outcomes. Attribution remains unavailable while its migration/path is unverified.

The delivery preserves `RECORD-01` through `RECORD-08`, `FOCUS-02`/`FOCUS-04`, `TASK-06`, and `JOURNEY-03`/`JOURNEY-04`/`JOURNEY-08` without introducing a new write owner.

## Delivery objective and constraints

Create a small, typed factual projection layer that retains source identity, provenance, scope, freshness, record identity, and derivation inputs. It may be consumed by Today, Focus history, Tasks, and Reflection context, but it cannot write source facts or convert interpretation/proposals into applied state.

- Direct/source-provided facts remain scoped to the owner record and its confirmed instants.
- Derived values name their inputs and derivation rule and are never presented as a new direct fact.
- Planned, user-provided, interpretive, proposed, unavailable, current, historical, pending, failed, local-draft, and disconnected meanings remain distinct.
- No universal completion percentage, productivity score, causality claim, inferred attribution, or autonomous adaptation is admitted.

## Affected boundaries

| Boundary | Delivery effect | Ownership constraint |
|---|---|---|
| Task records | Read confirmed task state/history | Tasks remains owner of task facts |
| Focus records | Read confirmed lifecycle/timing and attribution status | Focus remains owner of session facts |
| Reflection | Receives facts as context | Reflection interpretation remains user-provided |
| Today/Focus history | Render source-labelled factual projections | Projection cannot mutate or redefine source meaning |
| Correction | Route correction to source owner | Projection never edits history directly |

## Proposed approach

1. Identify existing source read paths and define a narrow evidence envelope with source, record identity, provenance, current/historical state, timestamps, and limitation.
2. Build pure adapters for task lifecycle facts, Focus lifecycle/timing facts, and verified/unavailable attribution.
3. Keep derived summaries explicit about inputs and derivation time; remove or quarantine score-like interpretations from core-loop surfaces.
4. Route correction, withdrawal, or deletion to the canonical owner and refresh projections only after confirmation.
5. Test that selection, planning, elapsed time, reflection save, and proposal state cannot enter the factual projection as an outcome.

## Data and state transition design

No new durable evidence table or event is introduced by this package. Existing owner records remain unchanged. A projection is disposable and must be reproducible from identified source records. Corrections create source-owner history; a projection refresh must not erase prior historical meaning or present a pending/failed mutation as fact.

## Authority, security, privacy, and trust

Every source read is user-scoped and RLS-protected. Evidence copy states exactly what the source proves and what it cannot prove. Reflection text remains user-provided interpretation; adaptation remains proposed until the receiving owner confirms application. Sensitive content is minimized in logs and screenshots.

## Integration and dependency design

| Dependency | Contract | Failure treatment |
|---|---|---|
| Tasks | Confirmed task state/history | Source unavailable/stale is disclosed; no inferred completion |
| Focus | Confirmed session lifecycle/timing | Unreliable timing or unavailable attribution is explicit |
| Reflection | Interpretation/proposal context | Never promote reflection to direct fact or applied change |
| Today | Orientation projection | Source identity and limitation remain visible |
| Next Up/attribution migrations | Optional verified capabilities | Pending/unverified remains unavailable |

## Reliability and recovery

Independent source failure preserves unrelated confirmed evidence. A stale projection is labelled historical/stale and never relabelled current without confirmation. Late responses cannot replace newer state. Correction/withdrawal/deletion follows source-owner recovery and does not pretend projection rollback can undo a source mutation.

## Observability and operational readiness

Evidence tests and review records capture source, record identity, provenance, derivation inputs/rule, freshness, limitation, and correction route. No analytics or score telemetry is needed. Any projection that cannot explain its source or truth class is a block for Gate 3.

## Rollout and rollback

Roll out with the existing owner surfaces and Today composition. Roll back projection code if it hides source limitations, creates a new owner, fabricates outcomes, or exposes another user's data. Preserve source records and use their owners for correction.

## Validation and open decisions

The linked plan covers factual/planned/interpretive/proposed/applied distinctions, correction and withdrawal, source failure, attribution unavailability, security, date/time, and the seeded coherent loop. Founder approval is required before implementation. Any new evidence type or inferred meaning requires a new product/engineering decision.

## Change control

Changes to evidence ownership, derivation, attribution, correction, or outcome language require review of source contracts, record rules, journey, current sprint, and Gate 3 checklist.
