# Supporting Surfaces Delivery Design

**Status:** `APPROVED` — Founder checkpoint passed through D-010; automated implementation evidence recorded, manual/live evidence pending
**Owner:** Engineering Architect (Founder)
**Product scope owner:** Product Architect (Founder)
**Created:** 2026-08-05
**Last updated:** 2026-08-05
**Implementation evidence:** [Supporting surfaces implementation evidence](../../current-phase/phase-3/supporting-surfaces-implementation-evidence.md)
**Authorized boundary:** [Supporting-domain decisions](../supporting-domain-decisions.md)
**Journey context:** [MVP coherent loop](../../03-experience/journeys/mvp-coherent-loop.md) · [MVP record rules](../record-rules.md)
**Design context:** [Today](../../05-design/features/today-design-spec.md) · [Tasks](../../05-design/features/tasks-design-spec.md) · [Focus](../../05-design/features/focus-design-spec.md) · [Reflection](../../05-design/features/reflection-design-spec.md)
**Affected engineering domains:** Habits | Schedule | Notes | Today/owner projections | security | accessibility | recovery | operations
**Risk level:** `Moderate`
**Migration required:** `No` for bounded reads/owner paths
**Rollout class:** `Direct` and reversible within existing surfaces
**Rollback owner:** Founder / Implementation Engineer; revert projection or bounded owner changes without rewriting source records
**Validation plan:** [Supporting surfaces validation plan](../validation/supporting-surfaces.md)
**Evidence links:** [Phase 3 current sprint](../../current-phase/current-sprint.md) · [Gate 3 checklist](../../current-phase/phase-3/gate-checklist.md)
**Review trigger:** Any promotion of a supporting domain, new owner/route, planning-as-evidence behavior, source mutation, or failure/recovery meaning.

> This package does not promote deferred domains or create a second loop. It implements only the minimum bounded paths already approved in Phase 2.

## Authorized behavior

- Habits: daily visibility and explicit completion only; no streak/analytics/moral scoring.
- Schedule: planning context and source-owned task/habit placement; no competing source of truth and no evidence meaning.
- Notes: user-owned context for choice/reflection with embedded Growth Areas; no standalone Knowledge, Goals, or automatic meaning.

The core journey remains usable when any supporting source is empty, unavailable, stale, disconnected, or failed. `SUPPORT-01` through `SUPPORT-07` are the acceptance boundary.

## Delivery objective and constraints

Make optional supporting context source-aware and non-blocking across existing owner/projection surfaces. Reuse existing reads and owner mutation paths where they already exist; do not add a new route, migration, domain, source relationship, autonomous planning, or cross-owner write.

- Every owner operation resolves `requireUserId()` and uses user-scoped access/RLS.
- Forms use shared Zod/RHF; date keys use `Asia/Singapore`/`date-fns`; persisted timestamps remain instants.
- Empty, loading, partial/stale, unavailable, disconnected, and error states must remain semantically distinct.
- Schedule keyboard review remains an explicit carried condition until evidenced; it is not silently marked complete.

## Affected boundaries

| Boundary | Delivery effect | Ownership constraint |
|---|---|---|
| Habits | Show daily state and explicit completion through Habits owner | Habits owns habit records/completions |
| Schedule | Show planning context and route source changes | Tasks/Habits own plan/state; Schedule owns no competing fact |
| Notes | Show optional user context where an existing owner read exists | Notes owns notes/embedded Growth Areas |
| Today/core loop | Compose source-labelled optional modules | Today has no supporting mutation |
| Failure/recovery | Preserve known source context and allow retry/leave | Unavailable is not empty or negative evidence |

## Proposed approach

1. Inventory the existing owner read/write paths and select only paths already admitted by Phase 2.
2. Add independent source settlement/state envelopes to optional composition; one failure must not erase core context.
3. Keep each source's mutation controls on its canonical owner and route projections there.
4. Label source, freshness, planning/provenance, and limitation in the accessible tree.
5. Validate empty/unavailable/stale/disconnected cases before adding any convenience integration.

## Data and state transition design

No new supporting record type or competing source is created. Habit completion remains an explicit Habits mutation. Schedule values remain derived/planning context from Task/Habit owners. Notes and embedded Growth Areas remain Notes-owned context. Local drafts are not durable; failed writes preserve prior confirmed state; correction/withdrawal goes to the source owner.

## Authority, security, privacy, and trust

RLS and `requireUserId()` apply to every supporting read/write. The UI must not infer that unavailable context is absent, that unscheduled work was not done, or that a missing note means missing meaning. Supporting content is minimized in test logs and screenshots.

## Integration and dependency design

| Dependency | Contract | Failure treatment |
|---|---|---|
| Habits owner | Daily visibility/completion | Empty/unavailable does not block core loop |
| Tasks/Habits planning | Source-owned schedule context | Schedule routes corrections; it does not write competing facts |
| Notes owner | Optional context | Omit only with explicit unavailable treatment where choice-relevant |
| Today/core owners | Optional projection consumers | Source error remains scoped and retryable |
| Auth/RLS | User boundary | Permission failure becomes unavailable/access-required |

## Reliability and recovery

Independent reads settle independently. Re-entry preserves last confirmed source context and identifies stale/local/pending/failed/unavailable/disconnected states. A supporting failure never fabricates absence or blocks Tasks, Focus, Reflection, or evidence. Late responses cannot overwrite newer confirmed state.

## Observability and operational readiness

Manual and automated evidence records source, state, freshness/limitation, owner route, fixture/date key, and accessibility result. No analytics or scoring is required. A source without an identifiable owner or recovery path is a block for the affected Gate 3 evidence.

## Rollout and rollback

Roll out in existing surfaces only. Roll back code for cross-owner writes, planning-as-evidence, silent omission of choice-relevant unavailable state, cross-account exposure, or inaccessible recovery. Preserve source records and use canonical owners for correction.

## Validation and open decisions

The linked plan maps `SUPPORT-*` questions to optionality, ownership, state, accessibility, recovery, security, date, and seeded/real-data evidence. Founder approval is required before implementation. Any supporting-domain promotion requires a new brief, parent review, and decision record.

## Change control

Changes to minimum behavior, source ownership, route admission, planning/evidence meaning, or failure treatment require review of the supporting-domain decisions, participating contracts/designs, record rules, sprint, and Gate 3 checklist.
