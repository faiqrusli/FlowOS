# Today - Feature Brief

**Status:** Product Architect complete; approved for Design Architect handoff on 2026-08-05
**Owner:** Product Architect (Founder)
**Sprint tasks:** P1.1, P1.5
**Parent systems:** [Experience Architecture](../../03-experience/experience-architecture.md) - [Information Structure](../../03-experience/information-structure.md) - [Action and Evidence](../../02-systems/action-and-evidence.md) - [Sensemaking and Adaptation](../../02-systems/sensemaking-and-adaptation.md)
**Journey stage:** Orientation and reorientation
**Canonical owner:** Today owns composition and read-state disclosure; linked domains own all consequential writes.
**Foundation:** [Phase 1.5 foundation pattern](../../11-archive/phases/phase-1.5/validation-and-date-time-pattern.md)
**Evidence:** [Phase 1 implementation truth](../../current-phase/phase-1/implementation-truth-evidence.md)
**Next contract:** [Today behavior contract](../behavior/today.md)

## Product decision

Today is the primary entry and reorientation surface for the admitted MVP loop. It helps a person understand available context and choose a next step. It is a truthful read composition, not a new domain, planner, score, or daily ritual.

## Person need and outcome

When a person returns, they need enough current context to choose deliberately without reconstructing it across several pages. The desired outcome is orientation: the person can identify what is current, planned, factual, interpreted, unavailable, or stale and can enter the owner of a consequential action.

## Scope

- Compose current task/commitment context, daily habit visibility, Focus session context, reflection context, and schedule planning context.
- Support direct entry at `/`, re-entry after interruption, and deep/contextual entry from an owning surface.
- Show source, freshness, and limitation where a projection could affect a choice.
- Hand create, edit, complete, defer, withdraw, Focus, reflection, habit, and planning actions to their canonical owners.
- Preserve the bounded [MVP coherent loop](../../03-experience/journeys/mvp-coherent-loop.md) without requiring every stage.

## Non-goals and exclusions

- Today does not persist tasks, Focus sessions, reflections, habit completions, notes, or planning changes.
- No forced daily ritual, universal dashboard, productivity score, autonomous prioritization, or standalone Progress destination.
- No new route, migration, source, automation, or deferred-domain admission.
- A projection, timer, selection, schedule, or absence of data is never presented as outcome evidence.

## Authority and handoff decisions

| Context | Today may do | Consequential owner |
|---|---|---|
| Task | Show current task and offer entry | Tasks |
| Focus | Show active/paused/concluded session context and offer entry | Focus |
| Reflection | Show saved/draft/unavailable reflection context and offer entry | Reflection |
| Habit | Show today's recurring action and completion state | Habits |
| Schedule | Show planning context and source status | Task or Habit source record |
| Notes | Show user-owned context when relevant | Notes |

## Success and validation intent

Today succeeds when a person can orient without being misled, choose or decline a next step, and recover from partial context. The behavior contract defines `TODAY-*` questions; the later design specification must express all states without adding behavior.

## Product Architect checkpoint

**Approved by Founder/Product Architect on 2026-08-05.** Scope, behavior meaning, non-goals, owner boundaries, and Orientation-stage role are approved for design specification. This approval does not authorize implementation, migration application, or a delivery design.

## Change control

Changing Today into a write owner, a new primary destination, an autonomous recommendation surface, or a required ritual reopens product architecture review, all affected contracts, and Gate 2 traceability.
