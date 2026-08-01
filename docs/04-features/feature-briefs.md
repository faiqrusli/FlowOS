# Feature Briefs

**Status:** Active
**Authority:** Canonical standard for deciding, scoping, and governing bounded FlowOS feature briefs
**Owner:** Product leadership
**Parent:** [Documentation Architecture](../00-constitution/documentation-architecture.md) · [Product Model](../01-product/product-model.md) · [Product Strategy](../01-product/product-strategy.md) · [Success Model](../01-product/success-model.md) · [Experience Architecture](../03-experience/experience-architecture.md) · [Journey Contracts](../03-experience/journey-contracts.md)
**Children:** Individual feature briefs in `04-features/briefs/`, behavior contracts, delivery designs, validation plans, decision records, and feature reviews
**Last reviewed:** 2026-08-01
**Review trigger:** A proposed document changes the definition, admission criteria, required contents, lifecycle, or ownership boundary of a FlowOS feature brief.

---

## 1. Scope

This document defines what a FlowOS feature brief is, when one is required, and the single responsibility each individual feature brief must own.

It answers:

> How does FlowOS decide whether a bounded capability should exist, for whom, toward what outcome, and within what limits before defining its observable behavior or implementation?

It does not approve a specific feature, define a feature’s user-visible behavior, describe a journey, prescribe interface design, select a technical approach, set a roadmap sequence, or report validation results. Those responsibilities belong to individual feature briefs and their linked behavior contracts, journey contracts, design specifications, delivery designs, strategy-and-delivery documents, evidence records, and reviews.

---

## 2. Feature-Brief Responsibility

An individual feature brief owns one bounded product decision:

> Is this capability the right, appropriately scoped response to a defined person need and product outcome at this time?

The brief establishes the feature’s reason to exist and its boundaries. It does not establish the detailed rules by which the capability works.

Every feature brief must:

1. identify one bounded person need in a defined context;
2. state the desired product outcome and how it connects to Product Strategy and the Success Model;
3. name the systems, experience domains, and current information structure it will apply rather than redefine;
4. identify the evidence, assumptions, risks, and unresolved questions behind the proposal;
5. define what the feature includes and explicitly excludes; and
6. determine the appropriate next disposition: do not pursue, investigate further, create a behavior contract, or revise a parent document.

A feature brief is a product decision artifact. It is neither a requirements document, a design brief, nor a delivery plan.

---

## 3. When a Feature Brief Is Required

A feature brief is required before FlowOS introduces, materially expands, combines, or retires a bounded capability that:

- creates a new person-facing capability or material new outcome;
- applies one or more product systems in a new context;
- changes a primary destination’s experiential role or creates a materially new contextual access path;
- affects a consequential choice, evidence, source relationship, computational assistance, or person authority;
- requires coordinated product, design, engineering, and validation work; or
- represents a material investment, tradeoff, or removal that should be understandable years later.

A feature brief is not required for an editorial correction, visual refinement, defect fix that restores existing contract behavior, routine technical maintenance, or a local implementation change with no material product or experience effect.

If a proposal changes an enduring product concept, system invariant, experience-architecture rule, or information-structure rule, it must first revise the owning parent document through its change-control process. A feature brief cannot use a localized capability to introduce a product-wide rule by implication.

---

## 4. Feature Admission

A proposed feature is eligible for a brief only when it can pass all of the following tests.

| Test | The proposal must establish |
|---|---|
| **Person need** | A concrete person need in a relevant context, not merely an available technology, competitor feature, or internal request. |
| **Product fit** | A clear relationship to current Product Strategy and a product outcome defined in the Success Model. |
| **System fit** | The product systems and semantic rules the feature will apply, with no attempt to bypass their authority. |
| **Boundedness** | A scope small enough to state one primary responsibility and explicit non-goals. |
| **Distinctiveness** | Why an existing capability, destination, journey, or workflow cannot serve the need without a material change. |
| **Evidence and uncertainty** | What is observed, what is inferred, what remains unknown, and why the uncertainty is acceptable for the next decision. |
| **Authority and risk** | Any effect on user authority, provenance, source scope, assistance, privacy, trust, or irreversible state. |
| **Learnability** | What would show the feature created or failed to create the intended outcome without using engagement alone as proof. |

Failure of any test is a valid disposition. It can mean the proposal should be declined, absorbed into existing work, researched further, or escalated to a parent-document decision. It must not be hidden by broadening the feature until it appears viable.

---

## 5. Required Contents of an Individual Feature Brief

Every individual feature brief must include the following sections, in this order unless a documented exception makes a different sequence clearer.

| Section | Must establish | Must not contain |
|---|---|---|
| **Identity and status** | Name, status, owner, parent documents, children, review trigger, evidence links, and the decision record if a disposition exists. | A summary of the Vision or parent-document content. |
| **Feature decision** | The precise decision requested or already made: investigate, proceed to behavior contract, defer, decline, retire, or revise a parent. | An unrecorded roadmap commitment. |
| **Person need and context** | Who faces the need, what makes it relevant, and what is difficult or unavailable today. | A generic persona, a claim of universal need, or a solution disguised as a problem. |
| **Desired outcome** | The change the feature should enable for the person and its link to the Success Model. | Metric targets, instrumentation details, or a claim that usage equals success. |
| **Evidence and assumptions** | Linked factual evidence, reasoned interpretation, assumptions, uncertainty, and gaps. | Raw research transcripts, unsupported confidence, or a hidden decision. |
| **Feature hypothesis** | Why this bounded capability may enable the outcome under stated conditions. | A guarantee of value or an implementation proposal. |
| **Scope** | Included capability, affected systems, destinations, object types, and relevant journey context. | Detailed states, edge cases, screen behavior, or technical topology. |
| **Non-goals and exclusions** | What the feature intentionally will not solve, own, automate, centralize, or measure. | Vague wishes to address later without a boundary. |
| **Authority, trust, and risk** | Material effects on person authority, evidence, source relationships, computational assistance, privacy, and reversibility. | The complete security, data, or implementation design. |
| **Alternatives and tradeoffs** | Existing capabilities, smaller interventions, deferral, or non-build options considered. | A retrospective justification that hides genuine alternatives. |
| **Next contract and open questions** | The exact document required next and decisions it must resolve. | Detailed feature behavior or delivery tasks. |
| **Change control** | Review trigger, parent impacts, and disposition path. | A silent replacement of an approved product decision. |

### Required metadata

An individual feature brief must use the durable-document metadata defined by Documentation Architecture. It also includes:

```text
Feature decision: Investigate | Proceed to behavior contract | Defer | Decline | Retire | Revise parent
Person need: One sentence in the person’s language
Desired outcome: Linked Success Model outcome
Affected systems: Linked system documents and interface contracts
Experience impact: Linked information structure and journey contracts
Evidence links: Research, measurement, prior review, or decision records
```

The brief’s **Status** reflects its documentation lifecycle. The **Feature decision** records its product disposition; the two must not be conflated.

---

## 6. Scope Rules

### One primary responsibility

Each brief must state the capability’s primary responsibility in one sentence. If it needs several independent outcomes, it is probably a program, system change, or group of separate features rather than one feature.

### Apply systems; do not recreate them

A feature can create, display, connect, or enable action on existing product concepts only within the authority of its linked system documents. It must name those systems and defer their semantics to them.

### Use the current information structure deliberately

The brief must identify whether the capability belongs in an existing primary destination, adds a contextual path, or requires an Information Structure decision. It must not introduce a new route or navigation category merely because a feature needs visibility.

### Distinguish outcome from mechanism

The desired outcome describes what becomes better for the person. A feature hypothesis explains why the capability may help. Neither may be written as a particular interaction, screen, data model, AI model, automation, or integration.

### Keep the smallest valuable boundary

Scope must represent the smallest capability that can test or deliver the stated outcome without creating misleading product behavior or bypassing required trust, authority, or recovery rules.

---

## 7. Evidence, Assumptions, and Decisions

### Evidence is linked, not rewritten

The brief links to relevant study records, measurement reports, support evidence, or prior reviews. It may state a concise, attributed implication for the decision, but it must not become a second repository for raw evidence.

### Assumptions are explicit

An assumption is a claim the team is acting on without sufficient evidence. The brief must distinguish assumptions from observed evidence and state what would challenge or reduce the uncertainty where practical.

### The build decision is separate from evidence

Evidence can support a feature decision; it does not make the decision automatically. A consequential decision to proceed, defer, decline, retire, or revise a parent document requires a linked decision record.

### Negative evidence is meaningful

Evidence that a feature does not solve the stated need, creates harm, duplicates an existing capability, or requires an unjustified authority tradeoff is a valid reason to stop. The brief must preserve that conclusion rather than reframe it as a delivery delay.

---

## 8. Relationship to Adjacent Documents

| Document | Feature brief owns | Adjacent document owns |
|---|---|---|
| Product Strategy | The proposed application of strategy to one capability. | Current market choices, audience, positioning, and strategic hypotheses. |
| Success Model | The feature’s desired outcome and relevant signals. | Outcome definitions, metric meanings, anti-metrics, and evidence hierarchy. |
| Product Model and systems | The systems the feature applies and the need it serves. | Concepts, invariants, state, ownership, and interface rules. |
| Experience Architecture and Information Structure | The proposed feature’s experience fit and destination impact. | Cross-surface rules and current organization of destinations. |
| Journey contract | Why a journey contract may be required for the feature. | The bounded end-to-end journey and its acceptance contract. |
| Behavior contract | The decision to specify observable feature behavior. | User-visible states, rules, permissions, edge cases, and acceptance behavior. |
| Delivery design | Product constraints and risks relevant to delivery. | Technical approach, migration, rollout, dependencies, and operational risk. |
| Validation plan | Intended feature outcome and decision questions. | Methods, acceptance checks, samples, instrumentation, and evaluation procedure. |
| Decision record | The decision context and alternatives. | The append-only record of the consequential choice and rationale. |
| Review record | The feature scope and expected outcome against which it will be assessed. | Actual findings, disposition, and post-release learning. |

---

## 9. Lifecycle and Disposition

### Draft brief

A draft brief frames a proposal and has no authority to create a feature commitment, behavior contract, design work, or delivery work.

### Decision-ready brief

A brief is decision-ready when its person need, desired outcome, scope, evidence, assumptions, system fit, risks, non-goals, alternatives, and next decision are clear enough for a consequential product choice.

### Active brief

An active brief is the current authority for the feature’s reason to exist and its boundary. A linked behavior contract, delivery design, validation plan, and review must remain within that boundary or trigger a brief revision.

### Disposition

The brief records whether the feature should be investigated further, proceed to a behavior contract, be deferred, be declined, be retired, or cause a parent document to be revised. A material disposition requires a decision record; the brief links it rather than silently becoming the decision record.

### Supersession and retirement

A brief is superseded only by a named successor with the same feature responsibility. It is retired when the feature has been removed or absorbed into another explicitly named active feature. Its evidence and decision history remain accessible.

---

## 10. Quality Bar

An individual feature brief is ready to proceed only when a product manager, designer, engineer, and reviewer can independently answer:

1. What specific person need exists, in what context, and why is it important now?
2. What outcome should the capability enable, and how will that differ from mere usage?
3. Which existing systems, destinations, and journeys apply to the feature?
4. What is inside the smallest valuable boundary, and what is explicitly outside it?
5. What is observed evidence versus assumption, interpretation, or product decision?
6. What authority, trust, privacy, source, or reversibility risk exists?
7. Why is an existing capability, a smaller intervention, deferral, or non-build insufficient?
8. What document must exist next before work can be delivered safely?

If the team cannot answer these questions without proposing screen designs or technical implementation, the brief is not yet sufficiently grounded.

---

## 11. Non-Goals

Feature Briefs do not:

- define user-visible states, edge cases, permissions, acceptance behavior, interface design, implementation, or test procedure;
- replace product strategy, product systems, experience architecture, information structure, or a journey contract;
- convert a desired outcome, usage metric, or business desire into proof of user value;
- authorize new automation, data access, source exchange, or consequential product state without the applicable system and behavior contracts;
- make implementation work, a visible route, or a competitor’s feature a sufficient reason to build; or
- serve as a backlog, roadmap, decision record, evidence repository, or release review.

---

## 12. Change Control

This document changes only when FlowOS changes the enduring standard for what a feature brief is, when it is required, what it must contain, or how a feature proposal is admitted and governed.

A change requires:

1. a decision record explaining the standard-level need;
2. impact assessment for Product Strategy, Success Model, Experience Architecture, Information Structure, active feature briefs, behavior contracts, delivery designs, validation plans, decision records, and reviews;
3. evidence that the change preserves bounded product reasoning, explicit uncertainty, single responsibility, and person authority; and
4. confirmation of consistency with the Vision, Documentation Architecture, Product Model, and applicable system documents.

A preferred planning format, one feature’s urgency, or a delivery-management convention does not by itself justify changing this standard.
