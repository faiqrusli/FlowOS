# Behavior Contracts

**Status:** Active
**Authority:** Canonical standard for defining and governing observable behavior of bounded FlowOS features
**Owner:** Product Architect
**Approval Required:** Founder
**Parent:** [Documentation Architecture](../00-constitution/documentation-architecture.md) · [Product Model](../01-product/product-model.md) · [System Documents](../02-systems/) · [Experience Architecture](../03-experience/experience-architecture.md) · [Journey Contracts](../03-experience/journey-contracts.md) · [Feature Briefs](./feature-briefs.md)
**Children:** Individual behavior contracts in `04-features/behavior/`, delivery designs, interaction specifications, validation plans, test cases, and feature reviews
**Last Updated:** 2026-08-03
**Review trigger:** A proposed document changes the definition, required contents, authority boundary, lifecycle, or review standard of an observable FlowOS feature behavior contract.

---

## Document Ownership

### Owner
**Role:** Product Architect
**Responsibility:** Maintain behavior contract standards, ensure observable behavior definitions align with product model and system rules, and coordinate with Design Architect and Engineering Architect on experience and technical implications

### Modification Process
1. Product Architect proposes contract standard changes (based on process improvements or cross-role coordination needs)
2. Design Architect and Engineering Architect review for experience and technical implications
3. Submit to Founder for approval
4. Founder reviews for Vision and product alignment
5. If approved: Product Architect updates document
6. Document change in decision record if consequential
7. Update Last Updated date

### Authority Level
- Product Architect can: Propose contract standard updates, maintain behavior definition rules, coordinate with Design and Engineering Architects
- Requires approval for: Changes to required contents, authority boundaries, or lifecycle rules

---

## 1. Scope

This document defines what a FlowOS behavior contract is, when one is required, and the single responsibility each individual behavior contract must own.

It answers:

> How does FlowOS define what a bounded feature must visibly do, permit, preserve, and recover from before a team chooses its interface or technical implementation?

It does not decide whether a feature should exist, redefine product concepts or system rules, prescribe a visual design or interaction pattern, select a technical approach, define a test method, or report a release result. Those responsibilities belong to the feature brief, parent product and system documents, design specifications, delivery design, validation plan, and review record respectively.

---

## 2. Behavior-Contract Responsibility

An individual behavior contract owns one answer to this question:

> Given an approved bounded feature, what must a person and the product be able to observe, understand, choose, and recover from across all supported conditions?

The behavior contract is the authority for externally observable feature behavior. It turns an approved feature’s purpose and scope into precise user-visible obligations without dictating how the product is drawn or built.

Every behavior contract must:

1. link to an active feature brief and state the behavior it is authorized to define;
2. identify the systems, interface contracts, journey contracts, and information-structure rules it applies;
3. define supported actors, object states, permissions, valid actions, product responses, and resulting observable states;
4. make authority, provenance, uncertainty, source relationships, and computational assistance legible wherever they materially affect behavior;
5. define error, interruption, correction, recovery, and valid non-completion behavior; and
6. provide stable acceptance behavior that design, engineering, validation, and review work can independently apply.

A behavior contract is a product contract, not a collection of user stories, interface mocks, API definitions, test scripts, or implementation tasks.

---

## 3. When a Behavior Contract Is Required

A behavior contract is required before delivery work begins for a feature that:

- creates, displays, changes, relates, exports, imports, or retires a product object or its state;
- affects person authority, a consequential choice, correction, provenance, evidence, a source relationship, recommendation, or automation;
- introduces a material path across destinations, systems, or feature boundaries;
- requires explicit treatment of unavailable, conflicting, partial, historical, or asynchronous conditions; or
- will be validated, reviewed, or operated by more than one discipline.

A behavior contract may be brief when the feature is narrow, but it must remain complete for the observable risk it creates. A local styling adjustment, defect correction that restores an existing contract, copy correction, or purely internal refactor does not require a new contract unless it changes what a person can observe, understand, choose, or recover from.

If implementation exposes a missing product concept, system rule, experience-architecture rule, or feature boundary, work must pause and the owning parent document or feature brief must be revised. A behavior contract cannot solve an authority gap by inventing a local rule.

---

## 4. Contract Boundaries

### One bounded capability

Each contract covers one feature responsibility authorized by one active feature brief. If independent capabilities need independent state models, authority rules, or acceptance behavior, they require separate contracts.

### Observable, not internal

The contract describes the behavior a person, connected system, or reviewer can validly observe: inputs, states, permissions, outcomes, feedback, and recovery. It must not prescribe internal modules, services, database tables, API schemas, event names, prompts, or algorithms.

### Parent semantics remain authoritative

Product and system documents own concepts, state meanings, provenance, source ownership, adaptation, assistance, and authority. The behavior contract applies those semantics to a feature and links to them; it must not redefine them.

### Interface rules are shared, not copied

When a feature relies on a shared system handoff, the behavior contract links to the relevant system interface contract. It documents the feature’s observable application of that handoff, not a competing system definition.

### A valid refusal is behavior

Deferral, decline, cancellation, correction, withdrawal, disconnection, and exit are part of the contract wherever the feature presents a choice or assistance. The contract must not treat non-completion as an unspecified error path.

---

## 5. Required Contents of an Individual Behavior Contract

Every individual behavior contract must include the following sections, in this order unless a documented exception makes a different sequence clearer.

| Section | Must establish | Must not contain |
|---|---|---|
| **Identity and status** | Name, status, owner, parent documents, children, review trigger, evidence links, and linked feature decision. | Parent-document summaries or an unrecorded product decision. |
| **Authorized feature boundary** | The active feature brief, capability responsibility, included scope, and explicit non-goals that constrain this contract. | A widened feature scope or a new strategic rationale. |
| **Participants and authority** | Who can initiate, view, modify, approve, correct, pause, disconnect, or export, and which system owns each consequential change. | Assumed consent, hidden roles, or authority not granted by a parent rule. |
| **Objects and observable states** | Product objects involved, allowed states, material status distinctions, and direct links to their owning rules. | A duplicate data model, schema, or locally redefined state machine. |
| **Entry conditions and access** | Valid primary and contextual entry paths, prerequisites, and what orientation is available on entry. | A new information structure or an assumed required workflow. |
| **Behavior rules** | Valid person actions, product responses, state changes, and what remains unchanged. | Visual layout, component behavior, or internal implementation steps. |
| **Decision and transition table** | Material choices, required context, authority, resulting state, and valid alternatives. | Transitions that obscure who authorized a change. |
| **Truth, provenance, and uncertainty** | What must be marked as planned, actual, sourced, derived, inferred, proposed, applied, historical, or unavailable. | Unqualified claims or technical data lineage details. |
| **Assistance and automation** | Assistance type, eligibility reference, explanation, controls, correction, withdrawal, and any authorized action. | Model prompts, provider behavior, evaluation methods, or hidden autonomous choices. |
| **Error, interruption, and recovery** | Unavailable, partial, failed, conflicting, cancelled, returning, and correction behavior. | A generic error message without state, consequence, or recovery. |
| **Accessibility and inclusive behavior** | The observable access, understanding, control, timing, and recovery requirements that the feature must support. | Technical accessibility implementation or visual-design prescriptions. |
| **Acceptance behavior and open questions** | The observable criteria the feature must meet and unresolved questions that block completion. | Test procedures, result reports, or release approval. |
| **Change control** | Trigger, impacted child documents, and revision path. | Silent changes to the approved feature or parent rules. |

### Required metadata

An individual behavior contract must use the durable-document metadata defined by Documentation Architecture. It also includes:

```text
Authorized feature brief: Linked active feature brief
Participating systems: Linked system documents and interface contracts
Affected destinations: Linked information-structure destinations and journey contracts
Behavioral authority: One sentence describing the externally observable behavior owned here
Validation plan: Linked plan before release
```

The metadata identifies the behavior boundary; it does not replace the required sections.

---

## 6. Behavior Rules and State Transitions

### Use explicit conditions

Every material behavior rule must identify the initiating condition, the applicable object and state, the actor or system allowed to act, the observable result, and what happens if the condition is not met.

Use the following form where it increases clarity:

```text
Given [relevant context and current state],
when [authorized actor or eligible system] [takes an action],
FlowOS must [observable response and resulting state],
while [preserved context, authority, provenance, or recovery constraint].
```

This form does not replace the need to link to system ownership or provide a state table where several paths are possible.

### Define state before transition

The contract must name the allowed observable states before it defines the feature’s state transitions. It must distinguish existing state from presentation-only status and from a person’s intended next action.

### Specify what does not happen

For each consequential transition, the contract must state any material state that must not change. Examples include a source update that must not become a commitment, a recommendation that must not apply an adaptation, or a correction that must not erase factual history.

### Preserve asynchronous truth

If a response can be pending, delayed, partial, unavailable, conflicting, or fail after a person acts, the contract must define what the person sees, what state is preserved, and how they can recover or verify the final result.

---

## 7. Authority, Truth, and Control

### Person authority is observable

When a feature affects direction, commitments, action records, evidence, interpretations, adaptations, source relationships, or external systems, the contract must state the exact person authority required. An implicit default, a hidden side effect, or prior use of a different feature is not sufficient authority.

### Assistance remains distinguishable

Any transformation, inference, recommendation, or automation must visibly remain its own type. The contract must state how a person understands its basis, uncertainty, limits, available controls, and effect on any feature state.

### Source boundaries remain legible

For connected context, the contract must state the source relationship required, what FlowOS may read or send, how freshness and availability are expressed, and how the person pauses, corrects, disconnects, or exports where relevant.

### Correction is not erasure

The contract must define how a person corrects a material record or assistive result and what historical context remains visible after correction. It must not use “edit” to hide whether a fact, interpretation, source relationship, or recommendation was changed.

---

## 8. Recovery and Exceptional Conditions

Each contract must identify the exceptional conditions reasonably possible for its boundary. At a minimum, assess the following and explicitly mark any that are not applicable:

| Condition | Contract must establish |
|---|---|
| **No relevant context** | What remains available and how the feature avoids implying a missing personal obligation or negative conclusion. |
| **Unavailable or stale context** | How limitation, last known state, and recovery are made understandable. |
| **Partial or failed action** | What completed, what did not, what remains safe, and what the person can retry, revise, or inspect. |
| **Conflicting context** | Whether the feature preserves, asks for, or defers a conflict without fabricating resolution. |
| **Interrupted use** | What is retained, what is pending, and how a person re-enters without loss of orientation. |
| **Decline or cancellation** | What does not happen, what state remains, and how the person can return later. |
| **Correction or withdrawal** | How a person revises, removes, pauses, or retracts within the owning system’s history rules. |
| **Permission or source change** | How the feature behaves when authority or connected context is narrowed, revoked, or disconnected. |

The contract does not need to guarantee every outcome. It must make expected limitations, safety boundaries, and recovery paths observable.

---

## 9. Acceptance Behavior

Acceptance behavior is the set of observable conditions that must be true for a feature to fulfill its contract. It is not a test plan or a release decision.

Acceptance behavior must be:

- traceable to the authorized feature boundary and linked system rules;
- written in terms of person-visible state, control, and result;
- sufficient to cover normal, alternative, recovery, and authority-sensitive paths;
- free of implementation assumptions; and
- linked to a validation plan that specifies how each condition will be assessed.

An acceptance criterion that only states that a page renders, an endpoint returns data, a button works, or an event fires is incomplete unless it also establishes the behavior a person can validly observe and understand.

---

## 10. Relationship to Adjacent Documents

| Document | Behavior contract owns | Adjacent document owns |
|---|---|---|
| Feature brief | The feature’s detailed observable application. | The reason to exist, outcome, evidence, scope, and non-goals. |
| Product Model and systems | Feature-specific behavior that applies their rules. | Product concepts, state meaning, ownership, invariants, and shared interface rules. |
| Experience Architecture and Information Structure | Feature-level application of cross-surface access and legibility. | Enduring experience rules and destination organization. |
| Journey contract | Observable behavior within a bounded journey. | The end-to-end journey’s entry, exit, progression, and cross-feature coordination. |
| Interaction specification | Behavioral requirements and acceptance behavior. | Exact interactions, layout, content, components, responsive states, and accessible presentation. |
| Delivery design | External product behavior that delivery must preserve. | Technical approach, data changes, APIs, dependencies, rollout, and operations. |
| Validation plan | Required behavior to validate. | Validation methods, fixtures, test design, measurement, execution, and disposition evidence. |
| Review record | The contract assessed. | Actual findings, defects, and release or follow-up disposition. |

---

## 11. Lifecycle and Quality Bar

### Draft

A draft contract can clarify behavior during discovery but has no authority to start delivery work that would create or alter product state.

### Active

An active contract is the current authority for its bounded feature behavior. Design, delivery, validation, and review work must link to it and remain within its stated boundary.

### Superseded or retired

A behavior contract is superseded only by a named successor that owns the same behavior. It is retired when the associated feature is removed or explicitly replaced. The historical contract remains available for review and correction context.

### Quality bar

A behavior contract is ready for delivery only when a product manager, designer, engineer, and reviewer can independently answer:

1. Which approved feature boundary authorizes this behavior?
2. What can each actor observe and do in every material state?
3. Which system owns every consequential state change and what explicit authority is required?
4. What is planned, actual, sourced, derived, inferred, proposed, applied, historical, or unavailable?
5. What happens on non-completion, interruption, failure, conflict, correction, or changed permission?
6. What must design and engineering preserve without being told how to implement it?
7. What observable conditions must validation confirm before release?

If any answer depends on unstated design or implementation knowledge, the contract is not ready.

---

## 12. Non-Goals

Behavior Contracts do not:

- decide a feature’s strategic priority, existence, audience, desired outcome, or scope;
- redefine the Product Model, system semantics, information structure, or system interface contracts;
- prescribe visual hierarchy, component selection, interaction mechanics, content copy, or technical accessibility methods;
- define data schemas, APIs, services, prompts, models, event names, deployment, or operational procedures;
- execute tests, set release gates, record findings, or approve a release; or
- treat a person’s completion, acceptance of assistance, connection of a source, or volume of activity as sufficient proof of feature success.

---

## 13. Change Control

This document changes only when FlowOS changes the enduring standard for what a behavior contract is, when it is required, what it must contain, or how observable feature behavior is governed.

A change requires:

1. a decision record explaining the standard-level need;
2. impact assessment for Feature Briefs, active behavior contracts, Product Model and system documents, Experience Architecture, Information Structure, journey contracts, interaction specifications, delivery designs, validation plans, and reviews;
3. evidence that the change preserves truthful state, explicit authority, recoverability, and independent testability; and
4. confirmation of consistency with the Vision, Documentation Architecture, Product Model, applicable system documents, and Feature Briefs.

A preferred implementation pattern, design system change, test framework, or one feature’s delivery schedule does not by itself justify changing this standard.
