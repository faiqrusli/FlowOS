# Today Orientation — Delivery Design

**Status:** `DEFERRED_FOR_MVP` — superseded for the MVP entry route by D-014 on 2026-08-06
**Owner:** Engineering Architect (Founder)
**Product scope owner:** Product Architect (Founder)
**Created:** 2026-08-05
**Last updated:** 2026-08-06
**Authorized behavior contract:** [Today behavior contract](../behavior/today.md)
**Authorized brief:** [Today feature brief](../briefs/today.md)
**Design specification:** [Today design specification](../../05-design/features/today-design-spec.md)
**Journey context:** [MVP coherent loop](../../03-experience/journeys/mvp-coherent-loop.md) — Orientation and reorientation
**Record rules:** [MVP record rules](../record-rules.md)
**Supporting-domain constraints:** [Supporting-domain decisions](../supporting-domain-decisions.md)
**Affected engineering domains:** Client/read composition | data access | security | privacy | accessibility | operations
**Risk level:** `Moderate`
**Migration required:** `No` for the P1 orientation slice; pending migrations remain unavailable
**Rollout class:** `Direct` and reversible at the existing `/` route; no production release is authorized by this approval
**Rollback owner:** Founder / Implementation Engineer; revert the route change and preserve source records
**Validation plan:** [Today orientation validation plan](../validation/today-orientation.md)
**Linked authorization:** [D-008 — Pass Gate 2 and Authorize Phase 3](../../08-decisions/records/D-008-pass-gate-2-and-authorize-phase-3.md) · [D-009 — Approve Today Orientation Delivery Design and Validation Plan](../../08-decisions/records/D-009-approve-today-orientation-delivery-design.md)
**Evidence links:** [Phase 3 current sprint](../../current-phase/current-sprint.md) · [Gate 3 checklist](../../current-phase/phase-3/gate-checklist.md)
**Review trigger:** Any change to Today’s source set, ownership, durable writes, state semantics, route handoff, or recovery behavior.

> Founder approved this technical delivery path on 2026-08-05. D-014 supersedes it for the MVP entry route: `/` now uses the interactive workspace, while this read-only orientation composition is retained as deferred future work. It does not define active MVP behavior or Gate 3 evidence.

## Authorized behavior

Today is the authenticated primary entry and reorientation surface. The delivery must preserve these approved invariants:

- Today composes confirmed source context and discloses freshness, limitation, and provenance.
- Tasks owns task commitments and Next Up; Focus owns session facts; Reflection owns interpretation; Habits, Schedule, and Notes retain their source ownership.
- Today has no durable write owner. Every consequential action opens or hands off to the canonical owner.
- Planned selection, schedule context, elapsed time, a projection, or absence of data must never be presented as an outcome.
- Direct entry, re-entry, decline, retry, correction at the owner, interruption recovery, and safe departure remain valid paths.

The P1 delivery boundary is Today orientation, composition, owner handoff, and route recovery. It does not implement Tasks, Focus, Reflection, or supporting-domain behavior that is not already available through an owner surface.

## Delivery objective and constraints

### Objective

Replace the current mixed dashboard/workplace composition on `/` with a source-aware Today read model that can show ready, loading, empty, partial, stale, unavailable, disconnected, pending, failed, and recovery states without collapsing them into a score or an all-or-nothing page failure.

### Current implementation risks to resolve

The existing baseline is useful implementation context, not authority:

- `src/lib/dashboard.ts` gathers Tasks, Habits, Focus, and Reflection with one `Promise.all`; one failed read currently prevents the rest of the composition from being represented.
- `src/components/today/today-page-content.tsx` combines dashboard progress, Focus overlays, and `WorkplacePageContent`, which currently contains task and habit mutation handlers.
- `computeOnTrackStatus` derives an “on track” percentage and language from task/habit completion, Focus time, and Reflection presence. That meaning conflicts with the approved Today contract and must not remain the Today orientation status.
- The current Workplace composition performs its own task/habit reads, creating a duplicate read path that can diverge from the Today composition state.

The implementation must resolve these risks through the approved contract. If the safest resolution would change product meaning, ownership, route admission, or the source set, stop and reopen the relevant parent contract instead of adapting the contract in code.

### Non-negotiable constraints

- Keep the existing `/` route and authenticated shell; do not add a route or a new domain.
- Do not add a Today table, Today mutation endpoint, optimistic domain write, or Today-owned record.
- Resolve the authenticated user through `requireUserId()` and retain user-scoped queries/RLS at every owner boundary.
- Use `date-fns` and the product `Asia/Singapore` date key; persisted timestamps remain instants.
- Keep `tasks_next_up_queue.sql` and `focus_session_task_totals.sql` unavailable until applied and verified. Do not infer queue persistence or Focus attribution.
- Keep local drafts local to the owning editor. Today may preserve confirmed read context in memory during a refresh, but it must not turn that continuity into a saved record.
- Use existing semantic tokens and accessible primitives. Material owner, state, limitation, and recovery information cannot depend on color, hover, or a tooltip.

## Affected boundaries

| Boundary | Proposed effect | Ownership constraint |
|---|---|---|
| `/` route and Today page | Keep route; render the Today composition and route recovery | Today owns composition only |
| Today client components | Add source modules, semantic status, retry, owner-entry controls, and stable re-entry context | No cross-domain mutation |
| Dashboard/read composition | Replace all-or-nothing aggregation with a per-source settled read model | Source services remain canonical owners |
| Tasks, Focus, Reflection, Habits, Schedule, Notes reads | Reuse existing owner read paths where available; disclose unavailable sources rather than inventing them | No new source admission in P1 |
| Existing Workplace components | Extract or explicitly configure read-only composition pieces; do not expose mutation handlers as Today ownership | Tasks/Habits mutations stay on owner surfaces |
| Auth and data access | Preserve `requireUserId()`, RLS, error redaction, and session-expiry handling | No service-role or unscoped browser access |
| Supabase schema | No P1 migration or live-state claim | Pending SQL remains pending/unverified |
| Validation and operations | Add unit/component/manual evidence and reversible rollout checks | Gate 3/Gate 4 remain separate decisions |

## Proposed approach

### 1. Build a Today composition read model

Introduce a feature-specific composition adapter and type model rather than making the page consume raw domain responses. Each source result carries its source identity, semantic state, confirmed data when available, freshness information when known, and a safe limitation/recovery message. The model is read-only and exists only for the current render/session.

The adapter may reuse `fetchTodayTasks`, `fetchTodayHabits`, `fetchFocusSessions`, `fetchTodayReflection`, and existing schedule builders. It must not use a single top-level rejection to erase unrelated confirmed sources. Source reads should settle independently, with a source-scoped retry path and a composition-level retry only when the whole read context is unavailable.

### 2. Make state meaning explicit

Use named semantic states in the read model and UI:

- `loading`: the source has not resolved; absence is not empty;
- `ready`: the source confirmed relevant context;
- `empty`: the source confirmed no relevant record for this bounded view;
- `partial`: the source returned usable but incomplete context and names the limitation;
- `stale`: previously confirmed in-memory context is shown after refresh failure, with no invented freshness time;
- `unavailable`: the source or capability cannot be verified, including pending migration behavior;
- `disconnected`: a source relationship ended and prior history remains visible where available; and
- `error`: the composition or source read was not confirmed and offers retry or safe departure.

Pending and owner-operation states remain distinct from source-read states. Today never labels a requested owner mutation as saved or complete.

### 3. Render read-only source modules with owner handoffs

The Today shell should render source-labeled modules in the approved hierarchy: date/orientation context, composition status, current/action context, factual/session and reflection context, optional supporting context, then source-scoped actions. Each material module exposes its owner, truth meaning, freshness/limitation, and recovery action.

Reuse existing visual primitives and owner entry patterns where they preserve read-only semantics. The current `WorkplacePageContent` mutation surface must either be split into read-only composition pieces plus owner-only controls, or be passed an explicit read-only mode whose absence of mutation handlers is testable. The separation is Founder-approved; the Implementation Engineer may choose either implementation path within this boundary, and both paths must keep durable writes out of Today.

Owner handoffs use existing route and context conventions, preserve object/session/date identity, and retain the valid `BackToTodayLink`/re-entry path. No new query contract or destination is invented silently. A missing owner identity is a blocked technical issue, not a reason to infer one.

### 4. Remove score-like orientation meaning

The Today status rail may report composition state and source context, but it must not report “on track,” a completion percentage, or an equivalent universal judgment. Counts and elapsed time may appear only when source-labelled and clearly factual; they are not a score or outcome. The current `computeOnTrackStatus` path should be removed from Today or replaced with neutral composition status.

### 5. Preserve re-entry and refresh truth

On direct entry, load the current Singapore date-keyed context. On return from an owner, refresh the relevant source or disclose that refresh is pending/stale. A refresh response must not overwrite a newer confirmed response; use request identity or cancellation guards. If a read fails after confirmed context was shown, retain that context as stale/historical and expose retry. Authentication expiry becomes unavailable/access-required, not empty.

## Data and state transition design

### Durable data

No new durable table, row, event, migration, retention rule, or Today record is introduced. Tasks, Focus, Reflection, Habits, Schedule, and Notes source records remain unchanged and are read through their owners. Today projections are disposable read models.

### Source state envelope

The implementation should use a typed source envelope equivalent to:

```text
source: Tasks | Focus | Reflection | Habits | Schedule | Notes
state: loading | ready | empty | partial | stale | unavailable | disconnected | error
data: confirmed source projection or absent
freshness: source-provided value or absent; never fabricated
limitation: safe, source-scoped explanation when material
recovery: retry | open owner | reauthenticate | leave
```

The exact TypeScript name is an implementation detail. The semantic distinctions are not.

### Migration and compatibility treatment

- `tasks_next_up_queue.sql` remains unavailable until applied and verified; Today may label the capability unavailable and may not show a guessed persistent order.
- `focus_session_task_totals.sql` remains unavailable until applied and verified; Today may show session facts and planned selection, but never inferred task attribution.
- Existing historical source records remain readable through their owners; the new composition must not rewrite them.
- If a source adapter cannot produce a truthful state, it returns unavailable/error with recovery rather than an empty placeholder.

## Authority, security, privacy, and trust

- Every read resolves the authenticated user and is scoped to that user. RLS remains the database enforcement boundary; client filtering is not a substitute.
- Owner mutations remain on owner routes/services. Today has no write API and no privileged server action that crosses an owner boundary.
- Error copy exposes the affected source and safe next action, not raw database, auth, or migration details.
- A two-account RLS check remains required before Gate 4 and must be represented as evidence, not assumed from code review.
- Selection, schedule, elapsed session time, projection freshness, and absence remain non-evidence states unless the canonical owner has confirmed the relevant fact.

## Integration and dependency design

| Dependency | Contract | Failure treatment |
|---|---|---|
| Tasks read path | Current task/commitment context; Next Up availability is explicit | Source-scoped unavailable/error; open Tasks or retry |
| Focus read path | Confirmed session lifecycle/timing facts | Show session state; attribution remains unavailable when migration is unverified |
| Reflection read path | User-owned interpretation and save state | Preserve interpretation distinction; open Reflection for correction |
| Habits read path | Explicit recurring-action state | Optional source may be empty/unavailable without blocking core orientation |
| Schedule read path | Planned/source-provided context | Never present as action evidence; preserve keyboard-review limitation |
| Notes read path | Optional user-owned context only if an existing owner read is available | Do not add a new Notes integration in P1; disclose unavailable/omit without implying absence |
| Auth/middleware | Authenticated app shell and `requireUserId()` | Reauthenticate/access-required state; safe navigation remains available |

No external provider or new service boundary is introduced by P1.

## Reliability and recovery

- Initial load preserves the page heading and stable source regions while individual reads resolve.
- Source failure does not erase unrelated confirmed context. Retry is scoped to the failed source where practical.
- A refresh after owner return uses request identity/cancellation guards so late responses cannot replace newer confirmed state.
- Read-only Today has no optimistic write, write rollback, idempotency, or repair event of its own. Owner surfaces remain responsible for those concerns.
- Local component state may preserve a confirmed projection during a refresh; it must be labelled stale when current verification is unavailable and must not be treated as a durable draft.
- If an implementation discovery requires a new mutation, source, inference, route, or migration, stop and escalate to the Founder rather than extending this design.

## Observability and operational readiness

P1 adds no new analytics or user profiling. The following must be observable in tests and manual review:

- source identity and semantic state are present in the accessibility tree;
- retry and owner-entry controls identify their source and context;
- source failures do not silently become empty or success;
- no Today write is issued for navigation, selection, retry, or departure; and
- auth, RLS, pending-migration, and date-key assumptions are testable at the service boundary.

If production telemetry is later required to distinguish source degradation, that is a separate operational decision and must minimize sensitive data.

## Rollout and rollback

1. Founder approves this design and its validation plan before implementation.
2. Implementation proceeds on `sprint/phase3` with no migration application and no production release claim.
3. Automated tests, security review, manual seeded/empty/unavailable walkthroughs, lint, and build checks run before any release review.
4. The existing `/` route is the only rollout surface. A failure that hides source truth, creates a Today write, or crosses an owner boundary is a rollback trigger.
5. Rollback is a code revert/redeploy; it does not roll back or rewrite Tasks, Focus, Reflection, Habits, Schedule, or Notes records.

Release approval, production deployment, and Gate 3 passage are outside this design.

## Validation and checkpoint disposition

The linked [Today orientation validation plan](../validation/today-orientation.md) defines the evidence needed for implementation readiness and later Gate 3 contribution. It covers all `TODAY-*` questions plus security, accessibility, reliability, recovery, and truthful pending-migration behavior.

Founder scope/design checkpoint disposition:

1. **Approved:** P1 is read-only Today orientation, source-aware state, owner handoff, and route recovery; no new source, route, mutation, migration, or score.
2. **Approved:** Today read-only composition is separated from the current Workplace task/habit mutation surface.
3. **Approved:** Source reads settle independently and use source-scoped retry.
4. **Approved:** Pending migrations, two-account RLS verification, Singapore midnight testing, Schedule keyboard review, technical debt, and build environment remain downstream conditions.

Implementation may begin on `sprint/phase3` within this approved boundary. Any discovery that changes the boundary reopens this checkpoint and [D-009](../../08-decisions/records/D-009-approve-today-orientation-delivery-design.md).

## Change control

Changes to Today’s source set, durable writes, canonical ownership, route admission, truth meaning, or recovery semantics reopen the Today brief/behavior contract and the cross-surface journey review. Technical refinements that preserve those boundaries update this design, its validation plan, and affected implementation artifacts together.
