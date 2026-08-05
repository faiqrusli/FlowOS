# Tasks — Feature Brief

**Status:** Draft
**Owner:** Product Architect
**Sprint tasks:** P1.2, P1.5, P4.5
**Foundation:** [Phase 1.5 foundation pattern](../../11-archive/phases/phase-1.5/validation-and-date-time-pattern.md)
**Parent:** [Product Model](../../01-product/product-model.md) · [Direction and Commitment System](../../02-systems/direction-and-commitment.md) · [Action and Evidence System](../../02-systems/action-and-evidence.md)
**Standard:** [Feature Briefs](../feature-briefs.md)
**Evidence:** [Phase 1 implementation truth](../../current-phase/phase-1/implementation-truth-evidence.md)
**Next contract:** [Tasks behavior contract](../behavior/tasks.md)
**Review trigger:** A change to task ownership, commitment/action meaning, planning states, or the allowed task-to-Focus handoff.

## Feature decision

**Proceed to behavior contract.** Tasks are admitted as the coherent MVP commitment and action surface. This brief preserves current capability while narrowing its meaning to the core loop.

## Person need and context

“I need to turn something I have chosen to do into a clear, revisable commitment, then see what happened without confusing a plan with an outcome.”

The current build supports creation, revision, completion, restoration, deletion, duplication, deferral, grouping, ordering, scheduling, and Focus selection across several surfaces. Phase 1 identified overlapping scheduling writes and pending Next Up/focus-attribution migrations as technical ownership concerns.

## Desired outcome

The person can make, revise, select, complete, defer, withdraw, and recover a present commitment while retaining a truthful distinction between commitment state, action occurrence, and outcome.

## Evidence and assumptions

- **Observed:** `/tasks`, Today, Workplace, quick capture, groups, schedule controls, and Focus Next Up expose task behavior.
- **Observed:** Task writes are user-scoped and validated through shared Zod/server parsing; failed board persistence has rollback/retry behavior.
- **Assumption:** A task is the MVP’s practical commitment representation, not a universal project-management object.
- **Uncertainty:** The final relationship among task completion, action evidence, Next Up, and Focus attribution requires record rules.

## Feature hypothesis

If task actions preserve commitment history and hand action/evidence to the correct owner, the person can make a bounded present choice and adapt it without FlowOS overstating what occurred.

## Scope

- Create and revise a task commitment.
- Assign or remove Today/group/planning context, reorder where supported, and select a task for Focus.
- Complete, restore, defer, withdraw/delete, duplicate, and recover from failed persistence according to explicit state rules.
- Show task state consistently across Tasks, Today, and Focus entry points.
- Use the Phase 1.5 Zod/RHF/date-fns patterns for admitted forms and date-only/planning values.

## Non-goals and exclusions

- Task completion is not an automatic claim of successful outcome or universal productivity.
- Tasks do not own focus-session evidence, reflection interpretation, or schedule projection semantics.
- No Goals, project-management expansion, automatic prioritization, or silent commitment changes.
- No new route or migration is implied by this brief; pending migrations remain explicit delivery/release work.

## Authority, trust, and risk

The person authorizes consequential task changes. Task source ownership remains visible across projections. Completion, deferral, withdrawal, and correction preserve meaningful history. A scheduled or selected task is planned context, not evidence that action occurred. RLS and `requireUserId()` boundaries remain non-negotiable.

## Alternatives and tradeoffs

- **Keep every current task surface independent:** fast locally, but risks conflicting state and ownership.
- **Centralize all work in Today:** simpler entry, but weakens task ownership and recovery.
- **One task contract with contextual projections:** chosen for MVP; requires clear handoffs and shared state language.

## Next contract and open questions

The behavior contract must define task states, transitions, confirmation/correction, planning context, Focus handoff, persistence failure, and the boundary between task completion and evidence. Record rules must resolve Next Up and focus-attribution ownership before Phase 3 delivery design.

## Change control

Revisit this brief if tasks become a new planning system, gain autonomous prioritization, or change the meaning of commitment/action. A new product boundary requires parent review and a decision record.
