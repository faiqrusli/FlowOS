# Today - Design Specification

**Status:** `DEFERRED_FOR_MVP` — D-009 design retained for future re-admission; D-014 makes the interactive workspace canonical at `/`
**Owner:** Design Architect
**Authorized behavior contract:** [Today behavior contract](../../04-features/behavior/today.md)
**Authorized brief:** [Today feature brief](../../04-features/briefs/today.md)
**Journey context:** [MVP coherent loop](../../03-experience/journeys/mvp-coherent-loop.md) - Orientation and reorientation
**Affected destinations:** [Information Structure](../../03-experience/information-structure.md) - Today `/`, with links to Tasks, Focus, Reflection, Habits, Schedule, and Notes owners
**Reusable standards:** [Design System Architecture](../design-system-architecture.md), [Design System v3](../DESIGN_SYSTEM_V3.md), [Tokyo Night Warm](../DESIGN_SYSTEM_TOKYO_NIGHT_WARM.md), [Content Standards](../content-standards.md), [Accessibility Standards](../accessibility-standards.md), [Design Implementation Map](../design-implementation-map.md)
**Design exceptions:** None
**Validation plan:** [Today orientation validation plan](../../04-features/validation/today-orientation.md) · [Validation plan standard](../../04-features/validation-plans.md) and the `TODAY-*` acceptance questions below; Founder scope/design checkpoint approved through [D-009](../../08-decisions/records/D-009-approve-today-orientation-delivery-design.md).
**Review trigger:** Any change to Today’s composition owner, source set, handoff, information hierarchy, material state, or recovery path.

> The read-only orientation design is not the active MVP root experience. MVP `/` renders the interactive workspace; `/workplace` is a compatibility redirect. Re-admit this design before using it as current route or Gate 3 behavior authority.

## Identity and status

This document is the feature-specific design authority for the approved Today behavior carried from Phase 2 into Phase 3. Its status, owner, parents, affected destinations, reusable standards, exceptions, and validation reference are recorded in the metadata above.

## Authorized behavior and scope

Today inherits the linked brief, behavior contract, record rules, supporting-domain decisions, and journey contract. This specification defines how that approved behavior is presented; it does not add a write owner, a daily ritual, an outcome dashboard, autonomous prioritization, a score, a new route, or a new source.

Today may compose confirmed task, habit, Focus, reflection, planning, and relevant Notes context. Each consequential action routes to its canonical owner. A projection, selection, schedule value, elapsed session time, or absence of data is not presented as outcome evidence.

## Experience intent

Help a person regain orientation quickly, understand what is known and limited, choose an owner surface or leave, and return after interruption without reconstructing context. The visual treatment should reduce cognitive load while keeping source, freshness, uncertainty, and recovery visible wherever they affect a choice.

## Information hierarchy and access

### Page order

The authenticated page uses the existing application shell and primary Today destination. Within the main landmark, the reading and visual order is:

1. Page heading and the current orientation context, including the applicable `Asia/Singapore` date label.
2. A concise composition status: ready, loading, partial, stale, unavailable, disconnected, or error. This status describes the read composition, not personal performance.
3. Current and actionable owner context, grouped by source rather than blended into one score or ranking. Focus and task context may be prominent when confirmed current; prominence does not change ownership.
4. Reflection and factual/session context, with interpretation and evidence visibly distinct.
5. Optional supporting context from Habits, Schedule, and Notes, each retaining its source relationship and freshness.
6. Owner actions and recovery actions at the point of the relevant source. A person can leave without selecting an action.

The page must not imply that the order is a required journey. Workspace destinations remain directly reachable through the global navigation. Each material projection exposes enough identity and state to open its owning context.

### Source module anatomy

Every source module has, in this order:

- source and context label, such as `Tasks`, `Focus`, `Reflection`, `Habits`, `Schedule`, or `Notes`;
- the smallest useful representation of the confirmed context;
- a semantic state and provenance/freshness line where material;
- one or more existing owner-entry actions, if the contract permits them; and
- a limitation or recovery action when the source is partial, stale, unavailable, disconnected, or failed.

Today does not merge source records into a new composite record. A cross-source relationship is shown as context with identity preserved, not as a new owner.

### Entry and re-entry

Direct entry opens the Today composition. Deep entry into or back from a task, session, reflection, habit, planning item, or note retains the source identity and confirmed source state. Re-entry refreshes or discloses freshness; it never assumes that an owner mutation succeeded merely because the person returned.

## State and semantic expression

### Default, loading, empty, partial, and degraded states

| State | Normative expression | Available action and constraint |
|---|---|---|
| Default / ready | Show the page hierarchy and available source modules. Each material module names its owner and truth meaning. | Open the owner, inspect, or leave. No Today mutation. |
| Loading | Preserve the page heading and stable source regions. Use neutral loading placeholders with text status; do not show blank values as empty or negative. | Conflicting owner actions are unavailable until the relevant read is known. Navigation and safe departure remain available. |
| Empty | At source level, state that the owner confirmed no relevant record for this bounded view. Keep the source name and voluntary next action. | Offer the existing owner entry where allowed; never imply deficiency or required setup. |
| Partial | Keep confirmed modules usable and attach a limitation to the affected source. Do not let one failed module make unrelated confirmed context appear failed. | Retry the affected read or open the owning route. No inferred value fills the gap. |
| Stale | Retain last-known context in a visibly historical/stale treatment with the last confirmed time/date when material. | Retry or open the owner. Do not present stale content as current. |
| Unavailable | Identify the source or capability that cannot be accessed or verified. Preserve known history if available. | Retry, reauthenticate when required, or open the owning route. Unavailable is not empty. |
| Disconnected | Preserve prior source context and identify that the relationship ended or is no longer verifiable. | Inspect the owner or leave. Do not silently erase prior context. |
| Composition error | State that current Today context is unverified, preserve any confirmed source modules, and place retry near the failed region. | Retry the composition or leave safely. No error treatment claims a domain mutation failed unless the owner reports it. |

### Pending, confirmed, failed, and rollback expression

Today has no durable write form. These states apply to a handoff or to an owner operation initiated from Today:

| Operation state | Today expression | Truth protection |
|---|---|---|
| Handoff pending | Keep the selected source identity and show that the owner surface is opening or the owner operation is awaiting confirmation. | Do not label the source changed or saved. |
| Owner-confirmed success | Return with the owner’s confirmed result and refresh Today, or label the projection as awaiting refresh. | The owner, not Today, reports the consequential success. |
| Owner failed | Keep the prior confirmed projection; expose the owner’s failure and its retry/correction path. | Never replace the old state with the requested state. |
| Rollback / unconfirmed optimistic state | Remove or mark any temporary pending treatment and restore the last confirmed projection. | Today does not claim a rollback as a new domain event; the source owner remains authoritative. |

Retry repeats the same owner/read request. It does not create a Today record or silently repeat a consequential mutation.

### Interruption and re-entry

If a read or handoff is interrupted, retain only the last confirmed projection and label it stale/historical or pending as applicable. A local draft belongs to the owner editor and is not displayed as a saved Today state. On return from Tasks, Focus, Reflection, or a supporting owner, Today shows the owner-confirmed result, unresolved pending/failed state, or unavailable limitation.

Authentication expiry is an access/unavailable state, not an empty Today. Preserve safe navigation context, require reauthentication before treating a read or write as authorized, and do not expose a misleading success state.

### Ownership, provenance, uncertainty, and recovery

| Displayed context | Owner / provenance | Required design treatment |
|---|---|---|
| Task commitment or Next Up view | Tasks; planned or current owner-confirmed record | Identify Tasks and distinguish current, deferred, completed, withdrawn, historical, or unavailable queue state. Selecting for Focus remains planned context. |
| Focus session | Focus; direct factual session lifecycle/timing when confirmed | Say session state and elapsed-session meaning; never say outcome or task completion. |
| Task relationship in Focus | Focus only through verified attribution path; otherwise planned/user-provided context with attribution unavailable | Show `Attribution unavailable` when the path is pending/unverified; never infer from selection, time, or proximity. |
| Reflection | Reflection; user-provided interpretation | Mark interpretation as reflection, not fact. Daily, custom, and session-end entries retain separate identity. |
| Habit completion | Habits; explicit user-provided occurrence | Show daily visibility/completion only; no score or moral meaning. |
| Schedule context | Task or Habit source; planned/source-provided | Mark as planned context. Schedule does not become evidence or a competing owner. |
| Notes/context | Notes; user-owned/source-provided context | Preserve source and freshness; do not turn note context into a task, evidence, or adaptation. |
| Derived summary | Identified derived read model | Label as derived and keep source references reachable; never make it a writable factual record. |
| Unavailable/disconnected source | Source relationship or capability cannot be verified | Say what is unavailable or disconnected and preserve known history. Do not substitute empty or inferred content. |

Recovery is always local to the owning surface: retry the read, open the owner, correct at the owner, resume where the owner permits, or leave. Today never offers a correction control that mutates another domain.

## Interaction and decision behavior

- Source modules are inspectable without hover. Hover may add a subtle Surface 6 treatment but cannot be the only way to discover owner, state, or recovery.
- Owner-entry controls use stable labels such as `Open task`, `Open Focus`, `Open reflection`, `Open habit`, `Open schedule`, or `Open note`, with the specific object/context included when available.
- A task selection control is labeled as selection/planned context and routes to Focus; it is not labeled `Complete`, `Done`, or `Worked on`.
- Retry is scoped to the affected read or owner operation. A failed handoff exposes the owner’s correction/retry path rather than a Today-specific mutation.
- Leave, navigation, and dismissal are valid exits and do not create a record or infer stage completion.
- Changes in composition state use concise, non-blocking status feedback. Do not use a toast as the sole record of a material owner result.

## Content and communication

### Content and status language

Use the canonical terms from [Content Standards](../content-standards.md) and the Product Glossary. Status language states what is known:

| Meaning | Preferred expression | Avoid |
|---|---|---|
| Planned | `Planned`, `Selected for Focus`, or `Scheduled` | `In progress` when no session is confirmed |
| Factual session | `Focus session active`, `Paused`, or `Session concluded` | `You made progress` or `Outcome achieved` |
| User interpretation | `Reflection`, `User-provided reflection` | `Your evidence` or an objective claim |
| Derived context | `Derived from [source]` | Presenting a summary as a direct event |
| Empty | `No [source] for this view.` | `You have nothing`, `You are behind`, or shame/urgency |
| Stale | `Showing last confirmed [source] from [date/time].` | `Current` without qualification |
| Unavailable | `[Source/capability] is unavailable.` | `Nothing here` or a guessed result |
| Pending | `[Operation] is pending confirmation.` | `Saved` or `Done` before owner confirmation |
| Failed | `[Operation] was not confirmed. Your last confirmed state is unchanged.` | Blame or silent disappearance |

Date-only labels use the product `Asia/Singapore` date key; persisted timestamps are instants. Error copy names the affected source, what remains confirmed, and the next safe action.

## Responsive and adaptive behavior

The design remains one Today surface across viewport sizes; responsive changes alter arrangement and disclosure, not behavior or ownership.

| Condition | Expression |
|---|---|
| Desktop / wide | Use the existing shell with a readable main orientation column and source modules grouped by hierarchy. Keep source state, owner, and recovery adjacent to each module. Optional detail may occupy a secondary region without becoming a second owner. |
| Tablet / medium | Collapse secondary regions into an ordered flow. Preserve the same source order, labels, state text, and owner-entry controls. Do not hide limitations in a collapsed region if they affect a choice. |
| Mobile / narrow | Use a single-column reading order. Keep page heading, composition status, source label, material state, primary owner action, and recovery visible without hover. Secondary provenance detail may be disclosed behind an explicitly labeled control. |
| Touch / coarse pointer | Give controls a sufficiently separated target and avoid hover-only actions. Confirmation/cancellation remains available through the same visible controls. |
| Slow or interrupted connection | Keep known confirmed context visible with loading/pending/stale language. Do not replace it with an empty skeleton after data was confirmed. |
| Reduced motion | Suppress nonessential transitions. State changes remain available in text and programmatic status. |

## Accessibility requirements

### Keyboard and focus behavior

- Provide a skip link to the Today main content and preserve the global navigation’s existing keyboard order.
- Reading order is heading, composition status, source modules, owner actions, then optional supporting controls. DOM order follows this sequence.
- Every owner-entry, retry, disclosure, and leave action is a native keyboard-operable control with a visible Soft Indigo focus ring.
- Focus is not moved for ordinary read refreshes. When a failed source region becomes available, preserve focus unless the person explicitly activated retry; after retry, return focus to the retry control or the first meaningful status in that region.
- A handoff may move focus to the destination heading or context identity only when navigation completes and the destination can establish it; it must not trap focus in Today.
- No action is available only on hover, drag, color, or pointer position. There is no Today modal required by this contract.

### Screen-reader semantics

- Use one `main` landmark with the `Today` heading and distinct labeled `section`/`region` landmarks for source modules where grouping improves navigation.
- Associate each module’s state, owner, freshness, provenance, and limitation with its heading and content in the accessibility tree; do not rely on visual badges alone.
- Expose loading and non-blocking refresh changes through a concise `status` region. Use `alert` only for an actionable error or permission failure, not for timer-like refresh noise.
- Buttons and links name the destination and context, for example `Open Tasks: Prepare review`, `Retry Schedule`, or `Open Focus session`. Avoid repeated unlabeled `Open` controls.
- Empty, stale, unavailable, disconnected, pending, failed, and confirmed states are text nodes available in reading order. Disclosure controls expose their expanded/collapsed state and do not hide material consequence.
- The current date label is semantic text and is not inferred solely from visual position or color.

## Reusable standards and exceptions

- Map the Today workspace to the active Surface 0–10 ladder: application shell Surface 0, page workspace Surface 1, any attached utility region Surface 2, primary canvas Surface 3, source cards Surface 4, controls Surface 5, hover Surface 6, selected/floating treatments Surface 7, and dialogs only if an owner surface requires them at Surface 9.
- Use the locked Tokyo Night Warm / Soft Indigo palette and semantic success, warning, danger, and info colors. Do not introduce a Today-specific accent or background.
- Prefer tonal hierarchy, whitespace, and borderless cards. Reserve borders for controls, focus, or a material boundary; do not use a border to imply ownership.
- Use existing button, card, badge/status, disclosure, skeleton, and error/retry patterns from the implementation reference. A source badge is supplementary; semantic text remains authoritative.
- Critical controls are visible before hover. Motion is brief and optional; reduced-motion behavior preserves state communication.
- Content follows [Content Standards](../content-standards.md); accessibility follows [Accessibility Standards](../accessibility-standards.md). Any repeated new pattern must be promoted to a reusable standard before reuse.

## Annotated artifacts

### Normative reading wireframe

```text
Application shell / global navigation
└── main [Today]
    ├── h1 Today + Asia/Singapore date context
    ├── composition status [ready | loading | partial | stale | unavailable | error]
    ├── current/action context
    │   ├── source-labeled Tasks / Focus modules
    │   └── owner action + source state/freshness
    ├── evidence/sensemaking context
    │   ├── Focus factual session context
    │   └── Reflection user-provided interpretation
    ├── optional supporting context
    │   ├── Habits daily visibility/completion
    │   ├── Schedule planned context
    │   └── Notes user-owned context
    └── source-scoped recovery and leave paths
```

This wireframe specifies hierarchy and semantics, not a component API, route implementation, or required visual card count.

## Handoff, validation, and open questions

### Delivery constraints

- Preserve Today as a read/composition owner with no durable write.
- Preserve source identity, owner, provenance, freshness, and confirmed state across every handoff.
- Keep `requireUserId()`, user-scoped access/RLS, shared Zod/RHF owner-form boundaries, `date-fns`, `Asia/Singapore` date keys, instant timestamps, local-draft semantics, and pending-migration unavailability visible at the relevant owner boundary.
- Do not treat a projection refresh as confirmation of an owner mutation.

### Validation questions

- **TODAY-01:** Can an authenticated person distinguish current, planned, factual, interpretive, derived, stale, empty, and unavailable context?
- **TODAY-02:** Does every consequential action hand off to the canonical owner without a Today write?
- **TODAY-03:** Does Today avoid treating selection, schedule, elapsed duration, projection, or absence as an outcome?
- **TODAY-04:** Can a person enter directly, re-enter after interruption, pause, decline, retry, correct at the owner, or leave without a forced ritual?
- **TODAY-05:** Are loading, empty, partial, stale, unavailable, disconnected, error, pending, confirmed, failed, and rollback/recovery states observable and accessible?
- **TODAY-06:** Do `requireUserId`, RLS, Zod/RHF, `date-fns`, `Asia/Singapore`, instant timestamps, and pending-migration limits remain explicit at the handoff boundary?

### Design Architect checkpoint

Completed 2026-08-05. The specification was checked against the Today brief, behavior contract, journey contract, information structure, record rules, supporting-domain decisions, reusable design standards, and all `TODAY-*` questions. No new behavior, owner, route, source, or meaning was introduced.

### Open questions

No product or design decision is unresolved for this specification. Engineering must confirm implementation details and validation evidence in the next hat; that work must not reinterpret the contract.

## Change control

Changes to Today’s source set, ownership, durable writes, primary-destination role, state meaning, or handoff semantics reopen the Today brief/behavior contract and the cross-surface journey review. Visual or content refinements that preserve those contracts follow the feature-specification review path and update affected validation questions.
