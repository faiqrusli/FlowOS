# Integration Architecture

**Status:** Active
**Authority:** Canonical architecture for FlowOS connected-system boundaries, exchange, synchronization, compatibility, reliability, and external effects
**Owner:** Engineering and integration leadership
**Parent:** [Engineering Architecture](./engineering-architecture.md) · [Data Architecture](./data-architecture.md) · [Identity and Access Architecture](./identity-and-access-architecture.md) · [Continuity and Interoperability System](../02-systems/continuity-and-interoperability.md) · [Action and Evidence System](../02-systems/action-and-evidence.md)
**Children:** Provider integration specifications, connector contracts, source-mapping specifications, synchronization designs, external-action specifications, compatibility policies, integration operation runbooks, and integration reviews
**Last reviewed:** 2026-08-01
**Review trigger:** A proposed change alters a connected-system boundary, source identity, exchange direction, synchronization model, source mapping, delegated credential, compatibility rule, failure or recovery behavior, external effect, or integration observability requirement.

---

## 1. Scope

This document defines how FlowOS technically connects with systems outside the product while preserving source ownership, bounded authority, provenance, truthful availability, and a person’s ability to disconnect or leave.

It answers:

> How does FlowOS receive, reference, synchronize, derive from, or send information to a connected system without treating technical connectivity as ownership, current truth, or permission to act?

It does not define the product meaning of a source relationship, the contents of a provider integration, a provider protocol, authorization mechanism, data schema, UI flow, feature behavior, retention duration, or incident procedure. Those responsibilities belong to the Continuity and Interoperability System, Identity and Access Architecture, Data Architecture, provider specifications, delivery designs, feature contracts, security and privacy standards, and operations runbooks.

---

## 2. Integration-Architecture Responsibility

Integration Architecture has eight responsibilities:

1. establish durable technical boundaries between FlowOS and connected systems;
2. define how source identity, declared scope, exchange direction, and operational availability are represented and enforced;
3. preserve provenance, semantic mapping, and lineage as information crosses product boundaries;
4. ensure incoming information cannot silently create consequential FlowOS state and outgoing effects cannot bypass person authority;
5. govern synchronization, idempotency, ordering, conflict, retry, compatibility, and schema evolution proportionate to the relationship’s risk;
6. define truthful degraded, unavailable, disconnected, and partial-exchange behavior;
7. make material exchanges and external effects observable, supportable, recoverable, and auditable; and
8. separate reusable integration architecture from provider-specific implementation, credentials, mappings, and operational facts.

Integration Architecture enables a bounded relationship. It does not make FlowOS the owner of a source’s original records, make a connected system authoritative over a person’s product state, or authorize automation merely because an external API permits it.

---

## 3. Integration Authority Model

Integration authority flows from a product-level source relationship to a technically enforced exchange and then to provider-specific implementation.

```text
Continuity and Interoperability System
  ↓
Identity and Access Architecture + Data Architecture
  ↓
Integration Architecture
  ↓
Provider integration and connector specifications
  ↓
Feature delivery design and implementation
  ↓
Exchange, synchronization, operational record, and review
```

The sequence does not make an integration passive. Provider limitations, technical evidence, source failures, or safety concerns can show that a product relationship is not feasible or should be narrowed. The team must return to the owning product or system document for a decision; it must not silently alter source scope, person authority, or product meaning in a connector.

### Source ownership remains above the connector

A connector proves a technical relationship to a source. It does not decide whether the source is relevant, what its information means, whether it may inform an inference, or whether it may cause a FlowOS or external-system action. These decisions remain governed by the applicable product, system, identity, intelligence, and feature contracts.

---

## 4. Integration Boundary Model

Every integration must define the following boundary elements before implementation.

| Boundary element | Required definition |
|---|---|
| **Connected system identity** | The distinct external system or source, its accountable boundary, and how technical identity is verified. |
| **Product relationship** | The linked source relationship and the product purpose for connection. |
| **Exchange direction** | Whether information is referenced, received into FlowOS, sent out, or managed through a defined two-way relationship. |
| **Permitted information scope** | The resource classes, fields, operations, and context the relationship may use. |
| **Authority chain** | Person, product, source, service, or operational authority required for each material operation. |
| **Semantic mapping** | How source information maps to FlowOS representations without collapsing provenance or product meaning. |
| **Freshness and availability** | What current, stale, pending, partial, unavailable, and disconnected mean technically and in user-visible behavior. |
| **Lifecycle and revocation** | Configuration, authorization, activation, pause, reauthorization, disconnection, credential revocation, and retirement treatment. |
| **Failure and recovery** | Timeout, partial exchange, duplicate, ordering, conflict, retry, reconciliation, repair, and external-effect containment. |
| **Observability and support** | Required audit, health, trace, operator access, alerts, and support context. |

No integration is complete merely because it can authenticate and exchange a payload. The provider specification must establish all applicable boundary elements.

---

## 5. Exchange and Synchronization Rules

### Direction is explicit

Each exchange operation must be classified as one of the following:

| Operation | Meaning | Must not imply |
|---|---|---|
| **Reference** | FlowOS identifies or links to source context without receiving its authoritative content as a native record. | Ownership, durable local retention, or current availability. |
| **Receive** | FlowOS receives source-provided information within declared scope. | That the information is complete, current, native, or authorized for every downstream use. |
| **Send** | FlowOS requests or sends approved information or an effect to a connected system. | That the external effect succeeded, is reversible, or authorizes broader future action. |
| **Synchronize** | FlowOS and a source update defined representations under a declared relationship. | Universal equivalence, immediate consistency, or a shared owner of all state. |
| **Reconcile** | FlowOS compares known states and safely resolves or surfaces a defined discrepancy. | Permission to invent a source fact, erase history, or select a user choice without authority. |

The product-level source relationship owns whether exchange is allowed. This architecture owns how its direction and consequences are technically enforced and made observable.

### Incoming information is not a consequential state change by default

An incoming source record can create a source-provided representation, reference, or eligible factual context. It cannot silently create or complete a direction, commitment, action, outcome, reflection, insight, adaptation, recommendation acceptance, or other consequential FlowOS state without the owning system’s rules and explicit authority.

### Outgoing effects require a separate authority check

Every send or two-way operation that could change a connected system must identify the exact destination, operation, source scope, person authority, idempotency behavior, and expected confirmation. An existing inbound connection, source credential, or previous outgoing action does not authorize a different or broader effect.

### Synchronization is bounded, not magical

Synchronization specifications must state the objects and fields within scope, exchange trigger, ordering model, expected latency, duplicate treatment, conflict behavior, freshness calculation, source-of-truth boundary, reconciliation cadence, and safe behavior when any of these cannot be established.

---

## 6. Mapping, Lineage, and Compatibility

### Map meaning before fields

Before a provider field is stored or displayed, the specification must identify what it represents in the source, whether it maps to an existing FlowOS representation class, who owns resulting meaning, and what provenance, reliability, availability, or uncertainty survives the mapping. A matching label or similar data shape is not sufficient semantic equivalence.

### Preserve original and derived context

When FlowOS transforms, normalizes, groups, filters, or derives from source-provided information, it must preserve enough source identity, receipt context, mapping version, derivation context, and link to original representation to support explanation, correction, reprocessing, and safe removal or restriction.

### Version contracts deliberately

Provider schema, capability, event, authentication, and semantic changes must be detected, assessed, and versioned where material. A provider update cannot silently change a FlowOS product representation, source scope, data quality, or external effect. The relevant provider specification defines compatibility and migration treatment.

### Treat unknown values as unknown

When a source cannot provide a required field, state, ordering guarantee, identity, or confirmation, the integration must preserve the limitation rather than infer an unsupported default. Missing information must not be converted into a completed, current, or negative product conclusion.

### Reprocess safely

If a mapping, source event, derivation rule, or synchronization mechanism must be reprocessed, the design must define idempotency, lineage, compatibility, audit, feature behavior, and recovery so that replay does not duplicate actions, rewrite history, or expand source scope.

---

## 7. Connector Lifecycle and Operational States

Connector operational state describes technical readiness and health. It complements but does not replace the product source-relationship state.

| Connector state | Meaning | Required behavior |
|---|---|---|
| **Unconfigured** | No technical connection is established. | Do not imply access, source availability, or pending sync. |
| **Configured** | Technical configuration exists but may lack current authority or verified readiness. | Prevent exchange beyond verified scope; identify next required action. |
| **Ready** | Identity, authority, required configuration, and health checks permit declared operations. | Treat actual exchange result separately from readiness. |
| **Operating** | A declared exchange or synchronization operation is underway. | Preserve pending status, correlation, cancellation or safe-stop behavior, and final outcome. |
| **Degraded** | The connector cannot reliably perform some declared operations. | Limit or stop affected work; represent freshness and availability truthfully. |
| **Suspended** | Exchange is intentionally paused by a person, policy, source, or safety control. | Stop future operations within scope while preserving permitted history. |
| **Revoked** | Required authority or credential is no longer valid. | Stop unauthorized operations, contain pending work, and require valid reauthorization. |
| **Disconnected** | The active technical relationship has ended. | Prevent future exchange; preserve or restrict prior information according to product, data, and privacy rules. |
| **Retired** | The connector is no longer supported. | Provide a documented migration, export, disconnection, or historical-reference path. |

Provider specifications map these states to product-visible behavior, retry policy, support action, and data lifecycle. They must not show a source as current or connected merely because configuration remains stored.

---

## 8. Reliability, Failure, and External Effects

### Design for partial and repeated work

Integrations must assume retries, duplicates, delayed callbacks, reordering, replay, pagination gaps, intermittent availability, changed source data, revoked authority, and partial completion where applicable. The provider specification defines how each condition is detected, contained, represented, and repaired.

### Idempotency preserves consequence

Material receive, send, synchronization, or reconciliation operations must have an idempotency strategy proportionate to risk. Repeating a request, event, job, or callback must not create duplicate product records, repeated external effects, hidden authority expansion, or conflicting historical truth.

### Failure behavior is part of the contract

When an exchange fails or becomes uncertain, the system must preserve the last reliable state with its freshness and limitation, prevent unapproved downstream behavior, expose a meaningful recovery path, and retain operational evidence needed to investigate. It must not conceal failure with stale success state or silently substitute a guessed result.

### External effects require confirmation and containment

For an outgoing operation, the integration must distinguish requested, accepted for processing, confirmed, partially completed, failed, unknown, and repaired outcomes. If confirmation is unavailable, the system must not present the effect as completed. The design must include containment and support handling for ambiguous or irreversible external effects.

### Rate, cost, and provider limits are integrity constraints

Rate limits, quotas, capability restrictions, provider outages, and cost controls can change the freshness and completeness of connected context. Integration designs must make their effect on product behavior, retry, degradation, and user communication explicit rather than treat them as invisible implementation details.

---

## 9. Security, Privacy, and Audit

### Credentials are narrow and protected

Integration credentials, keys, tokens, certificates, webhooks, and callbacks must be bound to the narrowest required scope, protected at rest and in transit as appropriate, rotated or revoked safely, and excluded from user-visible and uncontrolled operational logs.

### Validate external input

All source input, event, callback, payload, metadata, and provider identity must be treated as untrusted until validated at an appropriate boundary. A signed or authenticated source does not eliminate the need to validate scope, format, state, replay, and semantic compatibility.

### Respect data-use boundaries

Source-provided data may be processed only for the declared product relationship, permitted scope, and applicable privacy and intelligence rules. It must not be repurposed for unrelated analytics, recommendation, automation, or export because it is technically available.

### Audit material exchange

Material configuration, authorization, scope change, receive, send, synchronization failure, external effect, reauthorization, disconnection, and operational intervention must retain proportional audit context. Audit records must support correction and accountability without becoming an unnecessary copy of private source content.

---

## 10. Current Implementation References and Transition

[TECHNICAL_ARCHITECTURE.md](../foundation/TECHNICAL_ARCHITECTURE.md) remains the current reference for implemented integrations, application stack, dependencies, and known technical debt. Existing source credentials, configuration, migrations, jobs, logs, and code remain actual implementation evidence.

All new reusable integration architecture, provider contracts, source mappings, synchronization designs, and external-effect specifications belong in `06-engineering/`. Existing implementation references remain active for factual scope until a material revision creates an explicit successor. Do not copy provider manuals, credentials, code paths, or raw operational history into this architecture; link to them and define only the durable boundary they do not own.

---

## 11. Boundaries With Other Documents

| Document family | Integration Architecture owns | That family owns |
|---|---|---|
| Continuity and Interoperability System | Technical enforcement of connected-system exchange and operational state. | Product source relationship, continuity, portability, and exchange semantics. |
| Action and Evidence System | Technical source mapping, receipt, and provenance constraints. | Meaning of action, evidence, outcome, reliability, and factual correction. |
| Data Architecture | Integration use of representation, lineage, lifecycle, and integrity rules. | Durable data classes, access, retention, deletion, portability, and repair. |
| Identity and Access Architecture | Integration use of source identity, credentials, delegation, revocation, and audit. | Reusable identity and authorization enforcement rules. |
| Intelligence and Trust System | Availability and controlled use of connected context. | Eligibility, explanation, correction, and user control of assistive outputs. |
| Delivery design | Reusable integration constraints a feature must apply. | Feature-specific provider approach, rollout, migration, and recovery. |
| Security, privacy, and operations architecture | Integration requirements to enforce. | Cross-domain controls, incident response, monitoring, and runbook execution. |
| Provider specification | Architecture rules and shared boundary requirements. | One provider’s protocol, mappings, capabilities, implementation, and operation. |

---

## 12. Implications for Child Documents

Provider integration specifications must define the source, product purpose, authority, exchange direction, scope, mapping, connector state, failure behavior, idempotency, compatibility, observability, support, security, privacy, data lifecycle, and retirement path. They must not redefine product source ownership or write generic integration policy.

Source-mapping specifications must map source semantics to FlowOS representation classes, preserve lineage and unknown values, identify derivation and correction treatment, and link to data-model specifications. They must not equate a provider field with a FlowOS concept without a documented semantic basis.

Synchronization and external-action specifications must define initiation, authority, ordering, duplicate treatment, confirmation, partial and ambiguous outcomes, retry, reconciliation, cancellation, audit, and recovery. They must not call a provider’s technical capability a person’s authorization.

Integration-operation runbooks and reviews must link to the relevant provider specification, record factual operational state or findings, and use correction and decision records for consequential changes. They must not silently alter exchange scope or source policy in production.

---

## 13. Non-Goals

This document does not:

- define a product source relationship, provider selection, provider protocol, credential format, webhook, API, synchronization schedule, schema, UI, feature behavior, or operational command;
- redefine source ownership, data meaning, evidence reliability, person authority, recommendation eligibility, or automation policy;
- replace Data Architecture, Identity and Access Architecture, security and privacy standards, provider specifications, delivery designs, operations runbooks, or incident records;
- treat successful connection, a valid credential, a received payload, or provider capability as proof of current truth, data quality, ownership, or authorization;
- hide stale, partial, failed, unknown, or ambiguous exchange behind a generic “synced” state; or
- allow incoming information or outgoing technical capability to bypass the owning product system and a person’s applicable authority.

---

## 14. Change Control

This document changes only when FlowOS changes an enduring integration boundary, exchange-direction rule, mapping or lineage requirement, connector lifecycle rule, compatibility model, reliability requirement, external-effect control, or integration audit and recovery model.

A change requires:

1. a decision record explaining the architecture-level need;
2. impact assessment for Engineering Architecture, Data Architecture, Identity and Access Architecture, Continuity and Interoperability System, affected behavior and delivery contracts, provider specifications, privacy and security requirements, operations, and reviews;
3. evidence that the change preserves source ownership, bounded authority, provenance, truthful availability, privacy, security, idempotency, recoverability, and operational understanding; and
4. confirmation of consistency with the Vision, Documentation Architecture, Product Model, applicable system documents, Engineering Architecture, and affected Behavior Contracts.

A new provider, API revision, connector refactor, rate-limit workaround, or one feature’s integration urgency does not by itself justify changing this architecture.
