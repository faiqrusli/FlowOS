# Supporting Domain Decisions — MVP Contracting

**Status:** Draft
**Owner:** Product Architect
**Sprint tasks:** P3.1–P3.4, P5.6
**Foundation constraints:** [Phase 1.5 foundation pattern](../11-archive/phases/phase-1.5/validation-and-date-time-pattern.md)
**Parent:** [MVP Masterplan](../current-phase/mvp-implementation-masterplan.md) · [MVP coherent loop](../03-experience/journeys/mvp-coherent-loop.md)
**Evidence:** [Phase 1 implementation truth](../current-phase/phase-1/implementation-truth-evidence.md)
**Review trigger:** A supporting domain is promoted to a core loop owner, gains a new primary responsibility, or changes the MVP boundary.

## Decision summary

Habits, Schedule, and Notes remain supporting context. They are retained only where they make orientation, commitment, action, evidence, sensemaking, or adaptation more understandable. None is admitted as a second product loop or new primary MVP destination.

## Minimum admitted behavior

| Domain | Retain | Owner and relation to loop | Exclude for MVP |
|---|---|---|---|
| Habits | Show a daily recurring action and allow explicit completion | Habits owns `habits`/`habit_completions`; Today may project it; completion is user-provided evidence, not a universal score | Habit analytics, expanded scheduling, autonomous habit coaching, separate loop |
| Schedule | Show planning context and allow task/habit-owned planning changes through existing owner paths | Task/Habit records remain source of truth; Schedule is a projection/context surface | Schedule as action evidence, competing planning models, breadth expansion |
| Notes / Knowledge | Preserve user-owned context and relevant links for choice or reflection; keep Growth Areas embedded | Notes owns note/context records and source relationships; other surfaces may link/project | Standalone Knowledge/Growth Areas product, universal knowledge base, automatic meaning |

## Cross-domain rules

- Supporting context is optional and must not block the core loop.
- A scheduled or recurring item is planned context until an owner records actual occurrence.
- A habit completion is user-provided evidence about that completion, not proof of a broader outcome.
- Notes can inform a choice or reflection without becoming a commitment, action, or fact automatically.
- Any write from a supporting surface routes to its owning record path; projections do not create a second persistence owner.
- Empty, unavailable, stale, and disconnected supporting context must remain intelligible and must not be treated as negative evidence.

## Journey trace

| Supporting domain | Supports | Does not own |
|---|---|---|
| Habits | Orientation and recurring action choice | Core commitment semantics or outcome scoring |
| Schedule | Orientation and bounded planning context | Actual action or evidence |
| Notes | Orientation, contextual commitment, sensemaking | Automatic direction, interpretation, or adaptation |

## Acceptance questions

- **SUPPORT-01:** The core journey remains usable when all supporting domains are empty or unavailable.
- **SUPPORT-02:** Supporting records retain their owner and provenance across Today, Tasks, Focus, and Reflection.
- **SUPPORT-03:** Schedule surfaces do not imply that planned time equals action.
- **SUPPORT-04:** Notes and Growth Areas do not silently become a new Knowledge or Goals product.
- **SUPPORT-05:** Habit completion does not become a score, moral judgment, or substitute for action evidence.

## Open questions and change control

P5.6 owns reconciliation of the overlapping Schedule surfaces and keyboard treatment. Engineering must preserve the source ownership matrix in [record rules](./record-rules.md). Any promotion of a supporting domain requires a new feature brief, parent review, and decision record.
