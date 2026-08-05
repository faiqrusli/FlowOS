# Today — Behavior Contract

**Status:** Draft
**Owner:** Product Architect
**Sprint tasks:** P1.1, P1.5, P5.2
**Foundation:** [Phase 1.5 foundation pattern](../../11-archive/phases/phase-1.5/validation-and-date-time-pattern.md)
**Authorized feature brief:** [Today feature brief](../briefs/today.md)
**Participating systems:** [Direction and Commitment](../../02-systems/direction-and-commitment.md) · [Action and Evidence](../../02-systems/action-and-evidence.md) · [Sensemaking and Adaptation](../../02-systems/sensemaking-and-adaptation.md)
**Affected destinations:** `/` Today; contextual links to Tasks, Focus, Reflection, Habits, and Schedule
**Journey:** [MVP coherent loop](../../03-experience/journeys/mvp-coherent-loop.md)
**Validation plan:** [Validation plan standard](../validation-plans.md) — feature plan required before delivery
**Evidence:** [Phase 1 implementation truth](../../current-phase/phase-1/implementation-truth-evidence.md)
**Behavioral authority:** Today provides truthful current orientation and hands every consequential change to its owning surface.

## Authorized feature boundary

Today is a read/composition surface. It may show current projections and provide contextual entry to an owning feature. It does not create a second write path or redefine task, action, evidence, reflection, or schedule semantics.

## Participants and authority

| Participant | May do | Owning authority |
|---|---|---|
| Person | Inspect context, choose a next path, and invoke an owning action | Person authorizes the target feature change |
| Today | Compose current projections and expose truthful status | No durable domain write ownership |
| Domain owner | Create, change, correct, or recover its records | Tasks, Focus, Reflection, Habits, or task-owned planning |

## Objects and observable states

| State | Meaning | Must not imply |
|---|---|---|
| Loading | Current projections are being requested | That absent data is empty or negative evidence |
| Ready | Current context is available | That the projection is exhaustive or proves an outcome |
| Ready with no relevant context | No relevant record is available for this view | That the person did nothing or is behind |
| Partial/unavailable | One or more inputs are missing, stale, or failed | That the remaining context is complete |
| Route error | The surface cannot provide its current projection | That domain records were changed or lost |

The state of a task, focus session, reflection, habit, or schedule item remains owned by its domain system. Today may summarize it but cannot locally change its meaning.

## Entry conditions and access

- Primary entry is `/` for an authenticated person.
- Re-entry is valid after interruption, a failed request, or return from any owning surface.
- A contextual deep link must preserve enough identity and current status for the target owner to orient the person.
- Today does not require a person to visit every supporting surface or complete a daily ritual.

## Behavior rules

1. Given an authenticated person opens Today, when current projections are requested, FlowOS must show loading state and then identify which context is available, partial, empty, or unavailable.
2. Given a current item is shown, when the person needs to change it, FlowOS must offer a path to the owning surface and must not silently write through Today.
3. Given a task or commitment is shown, FlowOS must distinguish planned/current commitment state from action occurrence and outcome.
4. Given focus duration or derived status is shown, FlowOS must not present it as proof of completion, quality, or outcome.
5. Given reflection context is shown, FlowOS must distinguish user-provided interpretation from factual action/evidence context and keep reflection voluntary.
6. Given no context exists, FlowOS must explain the absence and offer only an appropriate optional next choice; it must not manufacture urgency or deficiency.
7. Given a person chooses no next action, FlowOS must preserve the available context and treat leaving as valid.
8. Given a projection is stale or partial, FlowOS must expose the limitation and provide retry or owning-surface recovery where available.

## Decision and transition table

| Person choice | Required context | Owner/result | What remains unchanged |
|---|---|---|---|
| Open a task | Task identity and current status | Tasks owns revision/completion/defer | Today does not mutate the task |
| Start/resume Focus | Selected action identity and focus availability | Focus owns session state | Task is not completed automatically |
| Capture reflection | Reflection context and voluntary entry | Reflection owns draft/save/correction | Evidence remains factual and unchanged |
| Review planning context | Date/time and item source | Task or Habit owner owns planning change | Planning is not action evidence |
| Do nothing/leave | Current view | No state change | All existing records remain intact |

## Truth, provenance, and uncertainty

Today’s cards are projections. Native records, user-provided records, source-provided records, and derived summaries must remain distinguishable when that distinction affects judgment. Missing or unavailable input is not negative evidence. Any derived value must retain a path to its owner and inputs.

## Assistance and automation

No autonomous assistance is admitted. A future recommendation shown on Today would require an Intelligence and Trust contract and must remain proposed, optional, explainable, and unable to apply a consequential change without person authority.

## Error, interruption, and recovery

- Loading is distinct from empty and failure.
- A failed read must state that current context could not be verified and provide retry or a safe owning route.
- Returning after an interruption must not imply that a displayed projection is current unless it was refreshed or its freshness is clear.
- A write failure belongs to the owning feature; Today must not report success until that owner confirms it.
- Route recovery must preserve the person’s authenticated context and not discard durable domain records.

## Accessibility and inclusive behavior

State, source, freshness, and available action must be available in semantic text, not color or hover alone. Reading and focus order must place current orientation before consequential controls. Partial, empty, error, and retry states must be reachable by keyboard and understandable with assistive technology. Responsive reduction may hide supporting detail but not ownership, consequence, or recovery.

## Acceptance behavior and open questions

- **TODAY-01:** A person can identify current, planned, historical, empty, and unavailable context without treating absence as failure.
- **TODAY-02:** Every consequential control hands off to the owning feature and exposes the result or failure there.
- **TODAY-03:** Today never represents a projection or elapsed duration as outcome evidence.
- **TODAY-04:** A person can return after interruption and recover orientation without forced ritual.
- **TODAY-05:** Loading, partial, empty, route-error, and retry states are observable and accessible.

P5.2 owns the remaining design questions: final information priority, density, and the minimum freshness disclosure for mixed domain reads. These do not change ownership or truth rules.

## Change control

Revise this contract if Today gains durable write ownership, a new primary destination, autonomous recommendation, or a changed role in the journey. Revisions return to the feature brief and Gate 2 traceability register.
