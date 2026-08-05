# Today - Behavior Contract

**Status:** Product Architect complete; approved for Design Architect handoff on 2026-08-05
**Owner:** Product Architect (Founder)
**Sprint tasks:** P1.1, P1.5, P5.2
**Authorized brief:** [Today feature brief](../briefs/today.md)
**Parent systems:** [Experience Architecture](../../03-experience/experience-architecture.md) - [Action and Evidence](../../02-systems/action-and-evidence.md) - [Sensemaking and Adaptation](../../02-systems/sensemaking-and-adaptation.md)
**Journey stage:** Orientation and reorientation
**Canonical owner:** Today owns composition, freshness, and handoff disclosure. The linked domain owns every durable mutation.
**Consumers:** `/`, Tasks, Focus, Reflection, Habits, Schedule, and Notes entry points
**Record rules:** [MVP record rules](../record-rules.md)
**Foundation:** [Phase 1.5 foundation pattern](../../11-archive/phases/phase-1.5/validation-and-date-time-pattern.md)

## Scope and non-goals

Today reads and composes available context for deliberate orientation. It must not become a persistence owner, a second task planner, an outcome dashboard, an autonomous recommender, or a required funnel through the six stages.

## Authority and truth model

| Participant | Allowed action | Canonical owner |
|---|---|---|
| Person | Inspect context, choose an entry, or leave | Person authority at the target surface |
| Today | Request reads, compose projections, expose state and freshness | No domain mutation |
| Tasks | Create, revise, complete, defer, withdraw, restore, and order task commitments | Tasks |
| Focus | Start, pause, resume, conclude, and correct sessions | Focus |
| Reflection | Draft, save, correct, withdraw, or skip interpretation | Reflection |
| Habits | Complete a recurring action explicitly | Habits |
| Schedule/Notes | Provide optional context through source owners | Task/Habit or Notes |

Today must label the difference between planned, factual, interpretive, proposed, applied, derived, and unavailable information. Missing or unavailable context is not evidence that the person did nothing.

## Observable states

| State | Meaning | Required behavior |
|---|---|---|
| Loading | A read is in progress | Do not label absent data empty or negative |
| Empty | The source confirmed no relevant record for the view | Explain the bounded absence and offer optional entry |
| Ready | All required projections for this view are available | Show owner and truth meaning where material |
| Partial | Some projections are available while another is stale, empty, or failed | Identify the limitation per source; keep available context usable |
| Stale | A previously confirmed projection cannot be refreshed within the stated freshness boundary | Show last-known context as historical/stale, never current without disclosure |
| Unavailable | A source cannot be accessed or verified | Preserve the source name and recovery/owning route |
| Disconnected | A source relationship ended | Preserve prior historical context; do not silently erase it |
| Error | The composition or route failed | State that current context is unverified; allow retry or safe departure |

## Entry, re-entry, pause, exit, and correction

- **Direct entry:** an authenticated person may open `/` and request current orientation.
- **Deep entry:** a task, session, reflection, habit, schedule item, or note may link to Today with identity and source state intact.
- **Re-entry:** after returning from any owner, Today refreshes or states its freshness; it does not assume the projection changed successfully.
- **Pause:** pausing orientation means leaving, switching surface, or dismissing a choice. No Today record is created and no domain state changes.
- **Exit:** choosing a target hands off; choosing no target, closing, or navigating away is valid departure.
- **Correction:** Today never edits a source record. Correction controls open the source owner and its confirmed, pending, or failed result.

## Handoffs and transitions

| Person choice | State change | State that remains unchanged |
|---|---|---|
| Open task | Enter Tasks with current task identity | Task remains unchanged |
| Select task for Focus | Pass a planned selection to Focus | Task is not completed or attributed |
| Start/resume Focus | Focus may begin or resume its own session | Today remains a projection |
| Open reflection | Enter Reflection with date/session context | Evidence and commitments remain unchanged |
| Open planning context | Enter source-owned planning control | Planning is not action evidence |
| Open habit/note | Enter source owner | Core commitment and evidence are unchanged |
| Retry | Request a new read | No domain record changes |
| Leave | No transition | All confirmed records remain intact |

## Persistence, permissions, and validation

- Today read paths must resolve the authenticated user through `requireUserId()` and use user-scoped queries/RLS. An unauthenticated or expired session is an access/unavailable state, not an empty Today.
- Today has no durable write form. Any invoked owner form uses the shared Zod schema at the server boundary and React Hook Form with the shared resolver; Today must display owner validation or write errors rather than translating them into success.
- Calendar labels and date validity use `date-fns`; product date keys use `Asia/Singapore` (`YYYY-MM-DD`), while persisted timestamps are instants. Today must not infer a date key from the browser timezone.
- Pending production migrations are unavailable until applied and verified. Today may show an unavailable capability and cannot represent a pending migration as ready behavior.

## Interruption and recovery

- If a read is interrupted, retain the last confirmed projection only as stale/historical and expose retry.
- If a handoff write fails, the owner reports failure; Today does not announce success.
- If authentication expires, preserve safe navigation context but require reauthentication before a read or write is treated as authorized.
- Re-entry after interruption restores the owner surface's last confirmed state, not an invented completion, reflection, attribution, or adaptation.

## Accessibility

Source, freshness, provenance, state, and consequence are available as semantic text and programmatic status, not color or hover alone. Keyboard order places orientation before consequential controls. Empty, partial, stale, unavailable, disconnected, error, and retry actions are reachable and announced. Responsive reduction may hide secondary detail but never the owner, limitation, or recovery path.

## Acceptance questions

- **TODAY-01:** Can an authenticated person distinguish current, planned, factual, interpretive, derived, stale, empty, and unavailable context?
- **TODAY-02:** Does every consequential action hand off to the canonical owner without a Today write?
- **TODAY-03:** Does Today avoid treating selection, schedule, elapsed duration, projection, or absence as an outcome?
- **TODAY-04:** Can a person enter directly, re-enter after interruption, pause, decline, retry, correct at the owner, or leave without a forced ritual?
- **TODAY-05:** Are loading, empty, partial, stale, unavailable, disconnected, error, and recovery states observable and accessible?
- **TODAY-06:** Do `requireUserId`, RLS, Zod/RHF, date-fns, `Asia/Singapore`, instant timestamps, and pending-migration limits remain explicit at the handoff boundary?

## Product Architect checkpoint

**Approved by Founder/Product Architect on 2026-08-05.** The contract is ready for design specification. Design may express the states and hierarchy but may not add a write owner, new admission, or unapproved meaning.
