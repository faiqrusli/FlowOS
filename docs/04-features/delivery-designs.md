# Delivery Designs

**Status:** Active
**Authority:** Canonical standard for feature-specific technical delivery designs that preserve approved observable behavior
**Owner:** Engineering leadership
**Parent:** [Documentation Architecture](../00-constitution/documentation-architecture.md) · [Feature Briefs](./feature-briefs.md) · [Behavior Contracts](./behavior-contracts.md) · [Engineering Architecture](../06-engineering/engineering-architecture.md)
**Current implementation references:** [Technical Architecture](../06-engineering/TECHNICAL_ARCHITECTURE.md) · [Engineering Rules](../00-constitution/governance/ENGINEERING.md)
**Children:** Individual delivery designs in `04-features/delivery/`, implementation plans, migrations, operational runbooks, rollout plans, validation plans, and delivery reviews
**Last reviewed:** 2026-08-01
**Review trigger:** A proposed document changes the definition, required contents, authority boundary, lifecycle, or review standard of a FlowOS feature-specific technical delivery design.

---

## 1. Scope

This document defines what a FlowOS delivery design is, when one is required, and the single responsibility each individual delivery design must own.

It answers:

> How will FlowOS safely deliver one approved behavior contract through its affected technical systems, data, dependencies, operations, rollout, and recovery mechanisms?

It does not decide whether a feature should exist, define user-visible behavior, prescribe visual design, replace engineering architecture, set delivery priority, execute implementation, define validation methods, or report a release outcome. Those responsibilities belong to the feature brief, behavior contract, design specifications, engineering architecture, strategy-and-delivery documents, implementation artifacts, validation plan, and review record.

---

## 2. Delivery-Design Responsibility

An individual delivery design owns one answer to this question:

> Given an approved feature behavior contract, what technical change path can deliver it while preserving product semantics, reliability, security, privacy, observability, and recovery?

The delivery design is the feature-specific technical bridge between externally observable behavior and implementation work. It explains the approach and its tradeoffs so that implementation, review, rollout, and recovery are coordinated.

Every delivery design must:

1. link to the active feature brief and behavior contract that authorize the technical work;
2. identify the affected technical boundaries, data, integrations, dependencies, operational surfaces, and engineering standards;
3. show how the approach preserves the product and system semantics expressed by the behavior contract;
4. define migration, compatibility, failure, security, privacy, observability, rollout, and rollback considerations proportionate to risk;
5. identify implementation phases, dependencies, assumptions, and decision points without becoming a task tracker; and
6. state the evidence and validation required before, during, and after release.

A delivery design is an architecture-for-one-feature document. It is not a product requirements document, a code design document for every function, a backlog, or a release approval.

---

## 3. When a Delivery Design Is Required

A delivery design is required before implementation begins when a behavior contract requires any of the following:

- new or changed durable data, migrations, retention, deletion, export, or backfill;
- a new or materially changed service boundary, API, client state model, job, integration, source relationship, or external dependency;
- changes to authentication, authorization, user authority, privacy, security, auditability, or connected-system permissions;
- asynchronous, partial, conflict-prone, irreversible, or operationally sensitive behavior;
- staged rollout, feature flagging, compatibility treatment, data repair, monitoring, or rollback; or
- coordinated engineering work across multiple code or operational boundaries.

A concise delivery note may be enough for a low-risk localized change that leaves data, authority, operations, and dependencies unchanged. The note must still link to the behavior contract and state why a full delivery design is not needed.

A delivery design is never optional merely because a change is behind a feature flag, uses an established provider, or appears small in code. The requirement depends on the risk and irreversibility of the delivered behavior.

---

## 4. Delivery-Design Boundaries

### Behavior is the contract; delivery is the approach

The delivery design must preserve the behavior contract. When an implementation approach cannot satisfy the contract, the team must revise the approach or return to the behavior contract and its parents; it must not silently lower observable behavior to fit technical convenience.

### Feature-specific, not platform-wide

The design describes the technical approach for one bounded feature. A reusable platform rule, data policy, integration policy, security policy, or system-wide architecture belongs in the relevant engineering document and is linked rather than duplicated here.

### Explain material tradeoffs

The design must name material alternatives, constraints, and risks that affected the approach. It does not need to document every rejected implementation detail, but it must make consequential choices understandable enough for later maintenance and review.

### Preserve ownership boundaries

Technical topology must not merge concepts that remain distinct in the product: intention, commitment, action, evidence, interpretation, adaptation, source context, inference, recommendation, and automation retain the semantic ownership defined by their parent system documents.

### A plan is not a record

The delivery design can state the proposed change path. Actual migrations, implementation decisions, incidents, validation results, rollout outcomes, and post-release findings belong in the linked records they produce.

---

## 5. Required Contents of an Individual Delivery Design

Every individual delivery design must include the following sections, in this order unless a documented exception makes a different sequence clearer.

| Section | Must establish | Must not contain |
|---|---|---|
| **Identity and status** | Name, status, owner, parent documents, children, review trigger, evidence links, and linked technical decisions. | A duplicate technical architecture or unrecorded decision. |
| **Authorized behavior** | Linked feature brief and behavior contract, the behavior to preserve, and relevant system invariants. | New product scope, hidden behavior changes, or a visual design. |
| **Delivery objective and constraints** | The technical outcome, non-negotiable product rules, affected risk domains, and relevant engineering standards. | A broad restatement of product strategy or generic engineering principles. |
| **Affected boundaries** | Code, data, service, integration, client, security, privacy, operations, and external dependencies that may change. | Line-by-line implementation instructions or a repository inventory. |
| **Proposed approach** | The intended technical path, information and control flow, and why it satisfies the contract. | Unexplained technical preference or a claim that implementation details do not matter. |
| **Data and state transition design** | Creation, mutation, derivation, migration, retention, correction, export, deletion, and compatibility treatment when relevant. | A product-state redefinition or a complete database schema dump. |
| **Authority, security, privacy, and trust** | Required authorization, consent, access controls, data handling, auditability, source scope, and assistance safeguards. | A replacement security policy or unreviewed security assumptions. |
| **Integration and dependency design** | Provider boundaries, contracts, failure modes, rate or availability limits, compatibility, and ownership. | Provider implementation manuals or a copy of a system interface contract. |
| **Reliability and recovery** | Failure handling, idempotency, partial work, conflict, retry, repair, rollback, and supportability appropriate to risk. | A vague promise that failures will be handled. |
| **Observability and operational readiness** | Signals, logs, alerts, audit evidence, support context, and operational ownership needed to detect and understand material behavior. | Raw dashboards, alert histories, or post-release results. |
| **Rollout and rollback** | Release scope, sequencing, feature gates, migration order, monitoring, compatibility, rollback trigger, and recovery ownership. | Final release approval or unsupported optimism about reversibility. |
| **Validation and open decisions** | Linked validation plan, preconditions, risks to validate, unresolved decisions, and their owners. | Executed test results or a completed review. |
| **Change control** | Trigger, impact on children, and the path for revising the design. | Silent implementation divergence. |

### Required metadata

An individual delivery design must use the durable-document metadata defined by Documentation Architecture. It also includes:

```text
Authorized behavior contract: Linked active behavior contract
Affected engineering domains: Data | client | service | integration | security | privacy | operations | other
Risk level: Low | Moderate | High | Critical
Migration required: Yes | No | To be determined
Rollout class: Direct | Staged | Gated | Migration-first
Rollback owner: Accountable role and linked recovery record, if applicable
Validation plan: Linked plan before implementation is complete
```

The metadata summarizes delivery risk and traceability. It does not replace the required design sections.

---

## 6. Data, State, and Compatibility Rules

### Preserve semantic distinctions

The design must identify every durable or derived representation it creates or changes, which product system owns its meaning, and how the representation remains distinct from adjacent concepts. A convenient shared field or event must not collapse planned, actual, sourced, derived, inferred, or user-approved state.

### Make mutation and derivation traceable

For every material data change, the design must specify whether the system creates, updates, corrects, derives, imports, exports, archives, or deletes information. It must preserve origin, actor, time, and relevant basis where the behavior contract requires provenance or correction.

### Handle existing information deliberately

Where existing records, users, sources, or clients may encounter new behavior, the design must state the compatibility strategy: migrate, backfill, transform, support both forms temporarily, leave historical records unchanged, or prevent the change until a safer path exists.

### Retention, deletion, and export are product behavior

When a feature retains, removes, transfers, or makes information portable, the design must link to the applicable continuity, source, privacy, and product rules. It must not treat a database operation as sufficient justification for an irreversible user consequence.

---

## 7. Authority, Security, Privacy, and Trust

### Authorization follows product authority

The design must translate the behavior contract’s person authority and system ownership into enforceable access and action boundaries. It must identify who or what can initiate a material change, what scope they hold, and how a denied or changed permission is handled.

### Treat source access as bounded

For connected systems, the design must preserve the source relationship’s declared scope, direction of exchange, freshness, availability, disconnection, and audit requirements. A valid authorization token or API capability does not expand product permission.

### Computational assistance requires controls

For inference, recommendation, or automation, the design must identify input boundaries, output type, explanation data, correction and withdrawal path, automation authority, and failure behavior. It must not create a hidden route from derived information to consequential change.

### Privacy and security are design inputs

The design must identify sensitive information, access boundaries, least-privilege treatment, secrets, exposure risks, abuse cases, and the engineering review required for the feature’s risk level. It links to product-wide security and privacy rules rather than recreating them.

---

## 8. Reliability, Observability, and Recovery

### Identify material failure modes

The design must consider at least the relevant failures in this table and explicitly mark non-applicable cases.

| Failure class | Delivery design must establish |
|---|---|
| **Client interruption** | What is persisted, pending, or safely retried when a person leaves, loses connectivity, or resumes later. |
| **Partial write or asynchronous work** | Idempotency, visible pending state, final confirmation, and repair or retry path. |
| **Dependency failure** | Fallback behavior, stale or unavailable status, retry limits, and effect on person-visible truth. |
| **Conflict or concurrency** | Which update wins, what remains visible, when the person must decide, and how history is preserved. |
| **Migration or compatibility failure** | Safe halt, recovery owner, rollback or forward-fix path, and historical-data treatment. |
| **Authorization or permission change** | Prevention of unauthorized action, current-state visibility, and safe disconnection or reauthorization path. |
| **Incorrect derivation or automation** | Detection, correction, withdrawal, audit context, and prevention of repeated harm. |

### Define observable operations

The design must identify the minimum signals that allow engineering and support to determine whether material behavior is healthy, degraded, unsafe, or incorrect. Signals must be sufficient to investigate without creating unnecessary sensitive-data exposure.

### Rollback respects historical truth

Rollback must distinguish reversible code deployment from irreversible data or external-system effect. Where an action cannot be undone, the design must define repair, correction, containment, and communication rather than describe it as a rollback.

---

## 9. Delivery Sequencing and Decisions

The delivery design may organize work into dependency-aware phases, but it must not become the roadmap or work tracker. Each phase states the technical precondition it establishes, the behavior contract it unlocks, the material risk it reduces, and the evidence required to proceed.

Material technical choices—such as irreversible migration strategy, provider selection, cross-boundary ownership, security exception, or conflict-resolution policy—require a linked decision record. The delivery design records the chosen approach and its implementation consequences; the decision record preserves why the choice was made.

If an implementation discovery changes behavior, scope, authority, or a parent system rule, stop delivery work until the relevant feature brief, behavior contract, or parent document is revised and the impact is assessed.

---

## 10. Relationship to Adjacent Documents

| Document | Delivery design owns | Adjacent document owns |
|---|---|---|
| Feature brief | The technical approach required by the approved feature boundary. | Feature rationale, desired outcome, scope, non-goals, and product decision. |
| Behavior contract | How technical work preserves observable behavior. | User-visible states, permissions, recovery, and acceptance behavior. |
| Product Model and systems | Technical representation and handoff required by their semantics. | Product concepts, state meaning, ownership, invariants, and interface rules. |
| Engineering architecture | The feature-specific application and any proposed exception. | Reusable technical topology, data, integration, security, quality, and operations rules. |
| Interaction specification | Delivery constraints that affect interaction behavior. | Exact interface, content, responsive, and accessibility design. |
| Implementation plan | Dependency-aware technical approach and decision points. | Tasks, assignments, estimates, and day-to-day execution. |
| Validation plan | Technical risks and behavior requiring validation. | Validation methods, test cases, fixtures, instruments, and execution. |
| Rollout plan or runbook | Required rollout and recovery conditions. | Exact operational sequence, commands, communications, and incident actions. |
| Review record | The design and contract assessed. | Actual findings, defects, release decision, and follow-up learning. |

---

## 11. Lifecycle and Quality Bar

### Draft

A draft delivery design can explore technical options but authorizes neither implementation nor irreversible technical change.

### Active

An active delivery design is the current technical approach for its approved behavior contract. Implementation, migration, rollout, validation, and operations work must link to it and either follow it or record an explicit, reviewed change.

### Superseded or retired

A delivery design is superseded only by a named successor that owns the same feature delivery responsibility. It is retired when the feature is removed or its technical approach has been explicitly replaced. Historical designs remain accessible for migration, operations, and review context.

### Quality bar

A delivery design is ready for implementation only when a product manager, engineer, designer, security/privacy reviewer when applicable, and release reviewer can independently answer:

1. Which approved feature behavior does this design deliver, and which product semantics must it preserve?
2. What technical boundaries, data, dependencies, source relationships, and operational surfaces change?
3. How do mutation, derivation, migration, compatibility, retention, correction, and portability behave?
4. What authority, security, privacy, and trust controls prevent inappropriate action or exposure?
5. What happens if work is partial, delayed, conflicting, unavailable, incorrect, or irreversible?
6. How will the team observe health, detect material failure, repair harm, and distinguish rollback from correction?
7. What validation, rollout, and recovery evidence is required before broader release?

If the answer to any question is “engineering will decide later,” the delivery design is not ready for implementation.

---

## 12. Non-Goals

Delivery Designs do not:

- decide a feature’s product value, desired outcome, scope, observable behavior, information structure, or visual design;
- replace shared engineering architecture, security policy, privacy policy, data policy, integration policy, quality standards, or operational runbooks;
- define task assignments, estimates, sprint sequencing, a backlog, or a release calendar;
- serve as code documentation, an API specification, a schema dump, a test suite, an incident record, or a release approval;
- weaken a behavior contract or product-system rule because a simpler technical path exists; or
- hide irreversible effects, changed authority, source ownership, data loss, or an inability to rollback behind technical terminology.

---

## 13. Change Control

This document changes only when FlowOS changes the enduring standard for what a feature delivery design is, when it is required, what it must contain, or how technical delivery is governed against approved behavior.

A change requires:

1. a decision record explaining the standard-level need;
2. impact assessment for Behavior Contracts, active delivery designs, current and future engineering architecture, security and privacy rules, validation plans, rollout plans, operations, reviews, and developer workflows;
3. evidence that the change preserves product semantics, safety, recoverability, and independent operational understanding; and
4. confirmation of consistency with the Vision, Documentation Architecture, Product Model, applicable system documents, Feature Briefs, and Behavior Contracts.

A framework upgrade, team preference, implementation shortcut, or one feature’s delivery timeline does not by itself justify changing this standard.
