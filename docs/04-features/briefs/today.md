# Today — Feature Brief

**Status:** Draft
**Owner:** Product Architect
**Sprint tasks:** P1.1, P1.5
**Foundation:** [Phase 1.5 foundation pattern](../../11-archive/phases/phase-1.5/validation-and-date-time-pattern.md)
**Parent:** [Product Model](../../01-product/product-model.md) · [Experience Architecture](../../03-experience/experience-architecture.md) · [Information Structure](../../03-experience/information-structure.md)
**Standard:** [Feature Briefs](../feature-briefs.md)
**Evidence:** [Phase 1 implementation truth](../../current-phase/phase-1/implementation-truth-evidence.md)
**Next contract:** [Today behavior contract](../behavior/today.md)
**Review trigger:** A change to Today’s entry role, context composition, write ownership, or relationship to the bounded MVP journey.

## Feature decision

**Proceed to behavior contract.** Today is admitted as the primary entry and reorientation surface. This brief does not authorize new Today behavior or Phase 3 implementation.

## Person need and context

“When I return, I need to understand what is relevant now and choose a next step without rebuilding my context from several pages.”

The current build already composes task, habit, focus, reflection, and schedule context at `/`. Phase 1 identified density and the relationship between status/KPI context and action evidence as unresolved contract questions.

## Desired outcome

The person can orient to current context, distinguish planned information from what actually occurred, and reach the owning surface for a deliberate next choice. This supports the Product Model’s orientation from direction through action, evidence, sensemaking, and adaptation without making a ritual mandatory.

## Evidence and assumptions

- **Observed:** `/` is the primary entry; `fetchDashboardData()` composes Today context; writes are delegated to domain owners.
- **Observed:** Loading, route-error, and empty states exist in the main boundary and domain cards.
- **Assumption:** A concise current projection is more useful than exposing every historical relationship by default.
- **Uncertainty:** The final context priority and density require design validation after the behavior contract.

## Feature hypothesis

If Today presents only decision-relevant current context and clear paths to owning surfaces, a returning person can reorient and act with less reconstruction while retaining authority over what happens next.

## Scope

- Current task and commitment context, supporting habit visibility, focus status/history context, reflection context, and schedule planning context.
- Direct entry and re-entry from `/`, including recovery after loading or route failure.
- Read projections and links/actions that hand consequential changes to the owning domain.
- The Today position in the bounded [MVP coherent loop](../../03-experience/journeys/mvp-coherent-loop.md).

## Non-goals and exclusions

- Today is not a second persistence owner for tasks, focus, reflection, habits, or schedule records.
- No forced daily ritual, universal dashboard, productivity score, or standalone Progress destination.
- No promotion of Goals, AI Coach, Weekly Review, or other deferred routes.
- No new source, data model, automation, or cross-domain write path in this phase.

## Authority, trust, and risk

Today must distinguish current, planned, historical, derived, unavailable, and user-provided context. A summary or KPI must not appear to prove an outcome. A displayed item must link to the surface that owns correction or consequential change. Missing context must not be presented as evidence of non-action.

## Alternatives and tradeoffs

- **Existing domain pages only:** preserves ownership but makes reorientation expensive.
- **A broad dashboard:** improves visibility at the cost of density and misleading aggregation.
- **Bounded Today projection:** chosen for MVP; it requires explicit priority and provenance rules.

## Next contract and open questions

The behavior contract must define context priority, read-state truth, entry/re-entry, handoffs, empty/partial/error states, and validation questions. Design must later decide the responsive hierarchy and density without changing those semantics.

Open questions: Which current context is immediate versus supporting? Which derived status is safe to show without implying outcome? How should stale or partial domain reads be presented together?

## Change control

Revisit this brief if Today gains a write owner, becomes a distinct planning system, introduces a new primary destination, or changes the MVP boundary. Such a change requires parent and decision-record review.
