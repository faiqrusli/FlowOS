# Intelligence and Trust System

**Status:** Active
**Authority:** Canonical system rules for computational assistance, inference, recommendations, automation, explanation, correction, and user control
**Owner:** Product Architect
**Approval Required:** Founder
**Parent:** [Vision.md](../00-constitution/Vision.md) · [Product Model](../01-product/product-model.md) · [Product Glossary](../01-product/product-glossary.md) · [Documentation Architecture](../00-constitution/documentation-architecture.md)
**Children:** System interface contracts, experience architecture, feature briefs, behavior contracts, AI and automation policies, trust architecture, safety evaluation, validation plans
**Last Updated:** 2026-08-03
**Review trigger:** A proposed capability changes how FlowOS derives information, makes a recommendation, automates work, represents uncertainty, explains assistance, receives correction, or allocates authority between a person and a computational system.

---

## Document Ownership

### Owner
**Role:** Product Architect
**Responsibility:** Maintain system rules for intelligence and trust, ensure user authority over computational assistance, and coordinate with Engineering Architect on technical implementation

### Modification Process
1. Product Architect proposes system changes (based on feature requirements or assistance capabilities)
2. Submit to Founder for approval
3. Founder reviews for Vision and product model alignment
4. If approved: Product Architect updates document
5. Document change in decision record if consequential
6. Update Last Updated date

### Authority Level
- Product Architect can: Propose system rule updates, maintain authority boundaries, coordinate with Engineering Architect
- Requires approval for: Changes to assistance eligibility, authority allocation, or system invariants

---

## 1. Scope

This document defines the system that governs when and how FlowOS may use computation to help a person understand context, consider a choice, or reduce low-consequence effort.

It answers:

> How can FlowOS be meaningfully helpful without treating an inference, recommendation, or automation as a substitute for a person’s judgment and authority?

It does not define a person’s direction, commitment, factual evidence, reflection, adaptation, source relationship, interface layout, model selection, prompt design, technical controls, or provider-specific implementation. Those responsibilities belong to adjacent system documents, Experience Architecture, engineering architecture, and system interface contracts.

---

## 2. System Responsibility

The Intelligence and Trust System has six responsibilities:

1. determine what kinds of computational assistance are eligible for a given context;
2. preserve the distinction among factual evidence, derived information, interpretation, recommendation, and automated action;
3. make material assistance understandable enough for a person to assess its relevance, uncertainty, and limits;
4. require a person’s explicit authority before a consequential recommendation or automation changes their product state or an external system;
5. enable refusal, correction, suppression, and review without penalty; and
6. constrain assistance that would overclaim certainty, exploit vulnerability, or create hidden control over a person’s choices.

The system makes help available under clear limits. It does not determine what matters to a person, diagnose them, optimize their life, or turn behavioral predictions into product authority.

---

## 3. Forms of Assistance

### Assistive transformation

An assistive transformation changes the presentation or organization of available context without asserting a new fact or directing a consequential choice. Examples can include translation, formatting, retrieval, grouping, or a clearly bounded summary.

- The transformation must remain traceable to the context it uses when traceability affects trust or correction.
- It must not remove material uncertainty, source boundaries, or conflicting context merely to produce a smoother result.
- A transformation must not be represented as a person’s reflection, an observable fact, or a decision made by the person.

### Inference

An inference is derived information that identifies a possible pattern, relationship, classification, or condition from available context.

- An inference must be labeled as derived rather than factual source evidence.
- The system must preserve the basis and limits of an inference where it could materially affect a person’s judgment or an ensuing recommendation.
- An inference may be useful while incomplete, tentative, or wrong. It must never gain authority merely because it is computationally produced.
- An inference cannot silently rewrite factual evidence, a person’s reflection, or the status of a direction or commitment.

### Recommendation

A recommendation is a proposed action, interpretation, or adjustment offered for a person’s consideration.

- A recommendation must be eligible for the context, relevant to an available choice, and proportionate to the confidence and consequence involved.
- It must distinguish what is observed, what is inferred, and what is proposed.
- A recommendation may invite further sensemaking or create an adaptation proposal; it cannot apply a consequential change by itself.
- The person may ignore, modify, defer, decline, or correct a recommendation without creating a negative product state.

### Automation

Automation is a system-performed action under explicit, bounded authority.

- Automation is appropriate only where the action, scope, destination, and reversibility are clear enough for a person to authorize.
- It may reduce routine effort; it cannot make a consequential choice about a person’s direction, commitment, record, interpretation, adaptation, or external relationship without explicit approval at the applicable decision point.
- Automation must remain distinguishable from a recommendation, an inference, and a user-initiated action.
- An automation must stop, pause, or require review when its declared scope, underlying context, or source relationship is no longer reliable.

---

## 4. Eligibility and Proportionality

Not every available signal justifies assistance. Eligibility exists to ensure that the system’s level of intervention matches the quality of context and the consequence of the potential result.

Before presenting material assistance, the system must consider:

| Eligibility question | Required implication |
|---|---|
| Is there a legitimate product purpose? | Assistance must support an active product responsibility, not merely create engagement or demonstrate capability. |
| Is the available context sufficient for the claim? | Incomplete, stale, conflicting, or unreliable input must constrain or prevent stronger claims. |
| Is the assistance proportionate to consequence? | Higher-impact suggestions and actions require stronger explanation, clearer uncertainty, and more direct user control. |
| Can the person understand and act on it? | Assistance must be timely, comprehensible, and connected to a genuine choice or task. |
| Can the person correct or refuse it? | Material assistance must provide a meaningful route to dismiss, modify, contest, or pause it. |
| Does it respect source and consent boundaries? | Source-provided context may be used only within the relationship’s declared scope and applicable authority. |

When eligibility is uncertain, the system must reduce the strength of the claim, request relevant context, present assistance as optional exploration, or refrain from offering it.

---

## 5. Explanation and Uncertainty

### Explanation requirements

An explanation enables a person to understand why assistance is present, what it relied on, what it is proposing or doing, and what control they retain.

The required depth depends on consequence. At a minimum, material assistance must make clear:

1. its type: transformation, inference, recommendation, or automation;
2. its relevant basis, including material source, evidence, or user-provided context;
3. whether the result is factual, derived, or proposed;
4. its material limitations, uncertainty, and freshness;
5. the action it can and cannot take; and
6. how the person can accept, modify, decline, correct, pause, or review it.

An explanation must illuminate a choice. It must not use technical detail, opaque confidence language, or excessive information as a substitute for clarity.

### Uncertainty rules

- The system must not use a confident tone, ranking, score, or visual emphasis to imply evidence that it does not have.
- Absence of evidence, incomplete source access, or a stale relationship must remain distinguishable from a negative conclusion.
- When multiple plausible interpretations exist, the system should preserve the uncertainty or invite the person’s context rather than select a definitive account.
- A recommendation’s language and prominence must be proportionate to the reliability and relevance of its basis.
- The system must not claim causal insight about a person’s behavior, values, motives, capacity, health, or future without an appropriate, explicit product responsibility and evidence standard.

---

## 6. Authority and Control

### User authority

The person retains final authority over their direction, commitments, records, interpretations, adaptations, and the source relationships they authorize.

The system must not:

- silently create, materially change, complete, remove, or reprioritize a direction or commitment;
- rewrite a person’s reflection, insight, factual record, or correction history;
- send a consequential instruction or change to a connected system without applicable authorization;
- treat acceptance of one recommendation as consent for future, broader, or different actions; or
- require a person to accept assistance, disclose personal context, or maintain automation in order to receive ordinary FlowOS value.

### Control requirements

- A person must be able to distinguish system-generated material from their own input and source-provided information.
- A person must be able to decline, defer, modify, or disable eligible assistance at a level that matches its scope.
- A person must be able to correct a material inference, recommendation, or automated result and understand what that correction affects.
- A person must be able to inspect the current state and scope of an active automation.
- The system must not make refusal or correction needlessly costly, shameful, or difficult to discover.

---

## 7. Correction and Learning

Correction is a person’s or system’s explicit identification that an assistive result, its basis, or its application needs revision.

- Corrections must preserve the distinction between the original assistance, the correction, and any resulting change to another system’s state.
- A correction to an inference or recommendation must not alter the underlying factual evidence unless the evidence itself is separately corrected under the Action and Evidence System.
- The system may use correction to improve future assistance only within stated product, consent, and source boundaries.
- A person must not have to supply a justification in order to decline or correct material assistance.
- Repeated correction, non-use, deferral, or disabling assistance is meaningful feedback. The system must not respond by escalating pressure, prompts, or intervention.

---

## 8. Assistance Lifecycle

| State | Meaning | Must not imply |
|---|---|---|
| **Eligible** | The available context and intended purpose permit assistance to be considered. | That assistance is required, correct, or already presented. |
| **Presented** | The person can view the assistance with its relevant explanation and controls. | Acceptance, accuracy, or permission for a consequential change. |
| **Considered** | The person has interacted with the assistance or its controls. | Agreement, trust, or a decision. |
| **Accepted** | The person explicitly selected an assistance outcome within its stated scope. | That a resulting change has been applied, remains suitable, or authorizes future use. |
| **Modified** | The person changed the assistance before using it. | That the original system output became a person-authored conclusion. |
| **Deferred** | The person chose not to act on the assistance now. | Rejection, failure, or reduced product value. |
| **Declined** | The person chose not to use the assistance. | Incorrect user behavior or invalid feedback. |
| **Corrected** | The assistance, its basis, or its result was explicitly revised. | Silent deletion of the original history. |
| **Withdrawn** | The system removed assistance because its basis, scope, or eligibility is no longer valid. | That the person made an error or that the historical record disappears. |

The Sensemaking and Adaptation System owns the lifecycle of an adaptation proposal and its resulting deliberate choice. This system owns whether assistance may produce or present that proposal, how it is explained, and how its computational basis may be corrected.

---

## 9. Inputs and Outputs

| Type | System input or output | Responsibility |
|---|---|---|
| Input | Evidence with provenance, reliability, and availability | Constrains factual basis for assistance. |
| Input | User-provided context, choices, corrections, and control settings | Establishes human meaning and available authority. |
| Input | Source relationship scope and status | Constrains whether connected context may be used. |
| Input | System semantics and interface contracts | Determines what assistance can read, propose, or hand off. |
| Output | Assistive transformation, inference, recommendation, or automation state | Provides bounded help with type and limits made legible. |
| Output | Explanation, uncertainty, and correction context | Enables a person to assess and govern assistance. |
| Output | Explicit proposal or authorized handoff to an owning system | Makes assistance available without bypassing product authority. |
| Output | Correction and withdrawal history | Preserves what changed and why without rewriting factual records. |

This system may offer assistance to another system. It cannot directly assign meaning to a person’s experience, alter consequential state, or initiate an external action beyond the authority granted by the receiving system and relevant interface contract.

---

## 10. System Invariants

### Help is not authority

Computational assistance may support attention and judgment. It must not present itself as the final authority on a person’s priorities, conduct, interpretation, or future.

### Derived information remains distinct

An inference, summary, score, classification, or recommendation must remain distinguishable from source-provided evidence and person-authored context.

### Consequential change requires explicit control

No material product or external-system change may result from assistance without the level of explicit person authority required by the owning system.

### Uncertainty is visible and proportionate

The less reliable, complete, or relevant the basis, the more the system must constrain claims, prominence, automation, and implied certainty.

### Correction is real

People must be able to refuse, correct, or withdraw from material assistance without hidden penalty or loss of ordinary product access.

### The system does not manipulate

Assistance must not exploit pressure, shame, fear, false urgency, or a misleading claim of personal knowledge to secure engagement, disclosure, acceptance, or continued use.

---

## 11. Boundaries With Other Systems

| System | Intelligence and Trust System owns | Other system owns |
|---|---|---|
| Direction and Commitment | Eligibility and explanation of assistance concerning a choice. | Meaning, state, and user-approved changes to direction or commitment. |
| Action and Evidence | Derived-assistance treatment and correction of its computational result. | Actual occurrence, factual evidence, outcome, reliability, and evidence correction. |
| Sensemaking and Adaptation | Eligibility and controls for a computational suggestion. | Human reflection, insight, adaptation proposal, and applied adaptation history. |
| Continuity and Interoperability | Whether assistance may use available context under product rules. | Source ownership, relationship scope, exchange, portability, and continuity state. |
| Experience Architecture | Required semantics for explanation, uncertainty, control, and correction. | Cross-surface presentation, navigation, and interaction design. |
| Engineering architecture | Product-level constraints for assistance. | Model behavior, prompt and tool design, evaluation, security, observability, reliability, and incident response. |

Any shared rule about a specific assistance-to-system handoff, correction effect, automation permission, evidence derivation, or source-context eligibility requires a system interface contract.

---

## 12. Implications for Lower-Level Documents

Experience documents must define how a person discovers that assistance is computational, assesses its basis and uncertainty, and exercises an available choice without needless interruption or overload.

Feature contracts must state the type of assistance, intended user benefit, eligibility criteria, inputs, output, uncertainty treatment, controls, correction path, and exact system that owns any resulting state change. They must never describe a recommendation as a completed user decision.

Engineering, AI, and trust documents must specify model and tool boundaries, evaluation, abuse prevention, privacy and security controls, data access, observability, failure behavior, and rollback. They must satisfy this system’s authority and explanation rules without treating a technical confidence score as a sufficient user explanation.

Validation plans must test correctness, relevance, uncertainty calibration, harmful overreach, meaningful control, correction, withdrawal, and the behavior of assistance when information is incomplete, stale, conflicting, or unavailable.

---

## 13. Non-Goals

This system does not:

- define a model, provider, prompt, algorithm, evaluation dataset, or technical implementation;
- establish factual truth, diagnose a person, infer their values, or determine the meaning of their life or work;
- replace human sensemaking, planning, or deliberate choice;
- authorize autonomous changes to a person’s consequential product state or connected systems;
- prescribe interface components, product copy, feature scope, or a roadmap; or
- make use of intelligence, recommendation acceptance, automation use, or correction frequency a measure of user worth or product success by itself.

---

## 14. Change Control

This system changes only when FlowOS changes an enduring rule about the eligibility, type, authority, explanation, uncertainty, correction, withdrawal, or control of computational assistance.

A change requires:

1. a decision record explaining the system-level need;
2. impact assessment for the Product Model, product glossary, adjacent system contracts, experience architecture, AI and trust architecture, privacy and security controls, active feature contracts, validation plans, and delivery work;
3. evidence that the change preserves clear distinction among fact, derivation, interpretation, recommendation, and action, as well as meaningful person control; and
4. confirmation of consistency with the Vision and Product Model.

A model upgrade, prompt refinement, provider change, interface convenience, or short-term performance gain does not by itself justify changing this system.
