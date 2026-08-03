# Delivery Plans

**Status:** Active
**Authority:** Canonical standard for coordinating bounded delivery of an active FlowOS roadmap outcome
**Owner:** Product Architect
**Approval Required:** Founder
**Parent:** [Documentation Architecture](../00-constitution/documentation-architecture.md) · [Roadmap](./roadmap.md) · [Feature Briefs](../04-features/feature-briefs.md) · [Delivery Designs](../04-features/delivery-designs.md) · [Validation Plans](../04-features/validation-plans.md)
**Children:** Individual delivery plans in `07-strategy-and-delivery/plans/`, release plans, implementation plans, rollout plans, risk records, delivery updates, and delivery reviews
**Last Updated:** 2026-08-03
**Review trigger:** A proposed document changes the definition, required contents, authority boundary, lifecycle, or review standard of a FlowOS delivery plan.

---

## Document Ownership

### Owner
**Role:** Product Architect
**Responsibility:** Maintain delivery plan standards, ensure coordination aligns with roadmap outcomes, and coordinate with Engineering Architect and Release Manager on implementation and delivery implications

### Modification Process
1. Product Architect proposes delivery plan standard changes (based on process improvements or cross-role coordination needs)
2. Engineering Architect and Release Manager review for implementation and delivery implications
3. Submit to Founder for approval
4. Founder reviews for Vision and strategic alignment
5. If approved: Product Architect updates document
6. Document change in decision record if consequential
7. Update Last Updated date

### Authority Level
- Product Architect can: Propose delivery plan standard updates, maintain coordination rules, coordinate with Engineering Architect and Release Manager
- Requires approval for: Changes to delivery plan definition, required contents, or authority boundaries

---

## 1. Scope

This document defines what a FlowOS delivery plan is, when one is required, and the single responsibility each individual delivery plan must own.

It answers:

> How does FlowOS coordinate the smallest justified cross-functional work required to advance one active roadmap outcome without using execution planning to redefine product, feature, design, engineering, or release decisions?

It does not sequence the outcome roadmap, decide feature scope, define behavior or technical approach, assign a sprint backlog, approve release, record actual results, or alter a parent contract. Those responsibilities belong to the Roadmap, feature and behavior contracts, design specifications, delivery designs, implementation plans, release plans, evidence records, reviews, and decisions.

---

## 2. Delivery-Plan Responsibility

An individual delivery plan owns one answer to this question:

> What bounded coordination, dependency management, risk reduction, evidence, and decision sequence is required to responsibly advance this active roadmap outcome?

Every delivery plan must:

1. link to one active roadmap outcome, its commitment class, evidence gap, and decision gate;
2. identify the authorized feature, behavior, design, engineering, research, validation, and operational work that contributes to that outcome;
3. sequence dependencies and decision points without turning dates or implementation progress into proof of outcome achievement;
4. define the smallest justified scope, explicit exclusions, material risks, stop conditions, and recovery or replanning path;
5. make accountable owners and cross-functional handoffs clear; and
6. identify the evidence, review, and decision required to close, narrow, defer, retire, or extend the plan.

A delivery plan coordinates work. It does not own the underlying product or technical contract that work implements.

---

## 3. When a Delivery Plan Is Required

A delivery plan is required when advancing an active roadmap outcome requires coordinated work across more than one feature, discipline, technical domain, release boundary, research activity, or material risk.

A concise delivery note may be sufficient for a narrow, low-risk contribution with one clear owner, no cross-domain dependency, no new release or migration risk, and a direct linked validation plan. The note must state why a full plan is unnecessary.

A plan is not justified merely because a team wants a timeline. If there is no active roadmap outcome, authorized feature boundary, evidence gap, or decision gate, the work remains exploratory or out of scope.

---

## 4. Required Contents of an Individual Delivery Plan

| Section | Must establish | Must not contain |
|---|---|---|
| **Identity and status** | Owner, parent and child documents, review trigger, plan horizon, and linked decision records. | A copy of roadmap, feature, or implementation content. |
| **Roadmap outcome and decision** | The active outcome, evidence gap, commitment class, gate, and decision this plan supports. | A new outcome or automatic progression claim. |
| **Scope and exclusions** | Smallest justified contribution, included contracts, and explicit non-goals. | A broad program or feature scope expansion. |
| **Dependencies and handoffs** | Product, design, engineering, research, operational, source, and external dependencies with accountable owners. | Detailed technical interface rules or task minutiae. |
| **Delivery sequence** | Ordered decision and evidence checkpoints, preconditions, and completion criteria. | Date promises, sprint tasks, or a substitute roadmap. |
| **Risk and stop conditions** | Material risk, signal, containment, escalation, and valid pause or simplification path. | Unsupported risk acceptance. |
| **Evidence and review** | Validation, research, measurement, readiness, review, and decision records required to close the plan. | Raw findings or a release decision. |
| **Change control** | Replanning trigger, child-impact process, and disposition path. | Silent plan expansion or priority change. |

Individual plans must use durable-document metadata plus:

```text
Roadmap outcome: Linked active item
Decision gate: Linked evidence and accountable decision
Plan horizon: Bounded period or condition, not a promise
Participating domains: Product | design | engineering | research | operations | other
Stop conditions: Linked risk or explicit none
```

---

## 5. Coordination Rules

### Follow the dependency chain

Delivery must respect the chain from roadmap outcome to feature brief, behavior contract, feature design specification, delivery design, validation plan, release plan, evidence, review, and decision. Work may discover a missing parent contract; it must pause and resolve the gap rather than implement a local interpretation.

### Sequence evidence before irreversible investment

When uncertain evidence, source scope, authority, data migration, external effect, automation, privacy, or recovery risk could invalidate later work, the plan must schedule the smallest evidence-producing or risk-reducing step first.

### Keep work in its owning document

Tasks and assignments belong in an implementation plan or work tracker. Technical topology belongs in a delivery design. User-visible behavior belongs in a behavior contract. The delivery plan links to these artifacts and coordinates their dependency; it does not copy them.

### Treat delay as information

Delay can reveal a dependency, unsafe assumption, missing contract, capacity constraint, or changed evidence. A plan update must state the implication and whether it requires a roadmap, feature, delivery, or decision review; it must not silently stretch scope or commitment.

---

## 6. Risks, Evidence, and Plan Closure

Every plan must identify risks to product meaning, person authority, source scope, data integrity, trust, accessibility, security, privacy, reliability, operation, schedule, and evidence quality where relevant.

A plan closes only when the linked decision gate is resolved through the required evidence, review, and decision record. Valid dispositions are complete the bounded contribution, continue through a named successor plan, narrow scope, repair and revalidate, defer, retire, or revise a parent document.

Delivery progress, deployed code, completed tasks, or elapsed time do not close a plan by themselves.

---

## 7. Relationship to Adjacent Documents

| Document | Delivery plan owns | Adjacent document owns |
|---|---|---|
| Roadmap | Bounded coordination to advance an active outcome. | Outcome sequence, investment gate, and commitment class. |
| Feature brief | Plan contribution and dependency. | Product need, outcome, scope, and feature decision. |
| Behavior and design contracts | Delivery dependencies and readiness. | Observable behavior and feature design expression. |
| Delivery design | Coordination constraints and risk. | Feature-specific technical approach, migration, rollout, and recovery. |
| Validation plan | Timing and evidence dependency. | Assessment methods, criteria, and evidence plan. |
| Release plan | Delivery readiness inputs. | Bounded release coordination and launch or rollback procedure. |
| Review and decision records | Plan closure evidence and choice. | Assessment, factual findings, and consequential disposition. |

---

## 8. Lifecycle and Non-Goals

### Lifecycle

A draft plan has no delivery authority. An active plan coordinates its named bounded contribution. A plan is closed only by a linked decision and evidence assessment. A superseded or retired plan remains historical and points to its successor or disposition.

### Non-Goals

Delivery Plans do not:

- replace the Roadmap, execution masterplan, feature contracts, design specifications, delivery designs, implementation plans, or release plans;
- create product commitments from task completion, dates, staffing, or implementation momentum;
- define a backlog, sprint, individual assignment, detailed estimate, technical design, test result, or release approval; or
- hide a decision to pause, narrow, defer, retire, or revise work.

---

## 9. Change Control

This standard changes only when FlowOS changes the enduring definition, boundary, required contents, or governance of delivery plans.

A change requires a decision record, impact assessment for Roadmap and active delivery work, evidence that the change preserves outcome-led sequencing and explicit authority, and confirmation of consistency with Documentation Architecture, Product Strategy, Success Model, and the Roadmap.
