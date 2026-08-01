# Client Architecture

**Status:** Active
**Authority:** Canonical architecture for FlowOS client rendering, navigation, interaction state, data presentation, accessibility support, resilience, and performance boundaries
**Owner:** Engineering and design leadership
**Parent:** [Engineering Architecture](./engineering-architecture.md) · [Data Architecture](./data-architecture.md) · [Identity and Access Architecture](./identity-and-access-architecture.md) · [Quality Architecture](./quality-architecture.md) · [Experience Architecture](../03-experience/experience-architecture.md) · [Information Structure](../03-experience/information-structure.md) · [Design System Architecture](../05-design/design-system-architecture.md)
**Children:** Client state specifications, navigation and routing specifications, data-loading contracts, interaction implementation standards, accessibility implementation standards, performance budgets, client error and recovery standards, feature delivery designs, and client reviews
**Last reviewed:** 2026-08-01
**Review trigger:** A proposed change alters client ownership, navigation, rendering, local or remote state, authority enforcement, data freshness, optimistic behavior, error recovery, accessibility support, performance, or the relationship between implemented UI and product truth.

---

## 1. Scope

This document defines how the FlowOS client presents approved product context, supports deliberate interaction, manages local and remote state, navigates across destinations, and remains truthful, accessible, resilient, and performant under changing conditions.

It answers:

> How does FlowOS render and coordinate a responsive product experience without allowing client state, cached data, optimistic feedback, navigation convenience, or visual presentation to redefine product semantics, access authority, or factual state?

It does not define product or system semantics, feature behavior, information structure, visual language, components, routes, framework, rendering technology, API, data schema, authentication provider, test implementation, or deployment configuration. Those responsibilities belong to parent product, experience, design, engineering, and feature documents; child client specifications; and current implementation references.

---

## 2. Client-Architecture Responsibility

Client Architecture has eight responsibilities:

1. render product, source, assistive, and operational state so a person can distinguish what is current, planned, actual, derived, pending, unavailable, or historical;
2. implement the information structure’s destinations, contextual access paths, deep entry, re-entry, and cross-surface orientation without creating competing product ownership;
3. manage interaction, local, cached, optimistic, remote, and derived presentation state with clear truth and reconciliation boundaries;
4. preserve person authority by making consequential choices, source scope, recommendations, automations, confirmations, corrections, and recovery paths understandable and technically safe;
5. support accessible, responsive, interruptible, and recoverable interaction across supported conditions and input methods;
6. coordinate data loading, mutation, invalidation, synchronization, error, retry, conflict, and degraded behavior with Data, Access, Integration, and Quality Architecture;
7. protect attention and performance without hiding material state, consequence, or required control; and
8. separate reusable client architecture from routes, components, hooks, client libraries, rendering configuration, and feature-level implementation facts.

The client expresses product behavior. It does not own a person’s direction, commitment, action, evidence, reflection, adaptation, source relationship, recommendation, automation authority, or durable product record.

---

## 3. Client Authority and State Model

### The client is a presentation and interaction boundary

The client can render context, collect a person’s input, request an authorized action, represent pending or returned state, and support recovery. It must not be the sole trusted enforcement point for a consequential read, write, export, source exchange, automation, or external effect.

### Client state has a declared role

Every material client-side state must be classified by role so presentation does not become a false source of truth.

| State role | Meaning | Must not imply |
|---|---|---|
| **Rendered product state** | The latest product state the client has reliably received and can identify by source and freshness. | That it is globally current, complete, or authorized for every action. |
| **Local interaction state** | Ephemeral input, focus, selection, viewport, draft, or presentation state used during interaction. | A durable product record, accepted change, or person decision before committed. |
| **Pending request state** | A request has been initiated but final authoritative outcome is not yet known. | Completion, applied change, source confirmation, or successful external effect. |
| **Optimistic presentation** | A provisional UI representation intended to reduce latency while an authoritative result is pending. | That the product state changed or that recovery is unnecessary. |
| **Cached state** | A retained representation used for performance or continuity. | Current freshness, valid authority, or availability of the originating source. |
| **Derived presentation state** | A client-side grouping, sorting, calculation, or view transformation of available context. | Factual evidence, durable inference, or a person’s interpretation. |
| **Unavailable or degraded state** | The client cannot currently obtain or verify required context or action capability. | A negative personal conclusion, absent history, or silent fallback to fabricated state. |

Data, access, integration, and system documents determine the meaning of the underlying state. Client Architecture determines how the client preserves that meaning while the state is rendered or in transition.

---

## 4. Rendering and Information Availability

### Render the context needed for a grounded choice

The client must make the context required by Experience Architecture and a behavior contract available at the point a person can act. It may use progressive disclosure, but it cannot hide material authority, source limitation, uncertainty, pending work, consequence, or recovery behind a non-obvious path.

### Preserve origin and type in presentation

When it changes a person’s judgment or available control, the client must make clear whether context is native, user-provided, source-provided, directly recorded, derived, inferred, recommended, automated, historical, unavailable, or pending. A common visual container or component cannot erase these distinctions.

### Summaries retain a path to ownership

A destination may show a condensed representation of an object or state it does not own. The client must preserve enough identity, state, and contextual link for a person to reach the owning context whenever they need to inspect, change, correct, or understand the result.

### Loading is a meaningful state

The client must distinguish not-yet-loaded, loading, refresh-in-progress, partially-loaded, stale, unavailable, unauthorized, and empty context where the difference affects a person’s understanding or action. It must not replace a material limitation with a blank surface, placeholder success state, or repeated interruption.

### Rendering does not establish authorization

The appearance of an object or control does not prove that a person can perform every related action. Client affordances must reflect known access state, but the trusted authority boundary re-evaluates material actions. A denied or changed permission must return as truthful feature behavior.

---

## 5. Navigation, Entry, and Re-entry

### Implement the Information Structure, do not redefine it

Client navigation, routes, links, shortcuts, notifications, search, and contextual access must implement the current Information Structure and Experience Architecture. A route, deep link, or component-local flow must not create an unapproved primary destination or parallel product model.

### Deep entry retains orientation

When a person enters through a direct link, notification, search result, source handoff, or returning session, the client must make the object’s material state, context, access limitation, and available next choice understandable without forcing an artificial visit to Home or a prescribed workflow.

### Returning use is a first-class condition

The client must safely restore or explain relevant local interaction context after navigation, refresh, interruption, expiration, offline transition, or session change. It must distinguish recoverable local draft from durable product state and never imply a saved change that was not accepted by an authoritative boundary.

### Navigation respects consequence

Before navigating away from unsaved, pending, or consequential interaction, the client must provide behavior-contract-appropriate preservation, warning, cancellation, or recovery. It must not trap a person in a flow, force completion, or silently discard material context without a defined rule.

---

## 6. Mutation, Optimism, and Reconciliation

### Request, response, and applied state are distinct

For a material action, the client must distinguish a person’s request, any local optimistic representation, authoritative acceptance, actual applied result, external confirmation when relevant, and failure or unknown outcome. The behavior contract determines how these states appear; this architecture requires that the client can represent them truthfully.

### Optimism is conditional and recoverable

Optimistic presentation is appropriate only when it does not hide material uncertainty or irreversible consequence. It requires a known authority path, reconciliation strategy, visible pending or recoverable state where relevant, and safe treatment if the authoritative result differs, fails, or arrives out of order.

### Reconcile without erasing context

When server, source, or integration state differs from the client’s representation, the client must reconcile according to the owning domain’s conflict and history rules. It must not silently overwrite a person’s input, disguise a correction as success, duplicate action, or choose a source of truth outside the relevant architecture.

### Mutations are idempotent from the person’s perspective

Interaction implementation must prevent duplicate person-visible effects from retries, refresh, double activation, delayed response, re-entry, or ambiguous network state where possible. When idempotency cannot be guaranteed, the client must preserve ambiguity, limit automatic retry, and give a person or operator a safe path to verify or recover.

### Error feedback states what is safe to do next

An error must communicate the relevant scope: what did not happen, what may have happened but remains uncertain, what remains unchanged, what information is unavailable, and what recovery, retry, correction, or support path is available. It must not expose protected details or place responsibility for a technical failure on the person.

---

## 7. Authority, Source, and Assistance in the Client

### Consequential actions are explicit

The client must make person-facing authority choices clear before initiating a consequential change, source connection, export, external effect, or automation. It must identify what will change, relevant scope or destination, available alternatives, and the valid path to defer, decline, cancel, correct, disconnect, or revisit where permitted.

### Source state is not a generic connection badge

For connected context, the client must distinguish source identity, declared scope, last known availability, freshness, pending exchange, partial result, failure, reauthorization, and disconnection when material. A technical connection indicator cannot make a source record appear current, complete, native, or owned by FlowOS.

### Assistance remains visibly typed and controlled

The client must express transformation, inference, recommendation, and automation as distinct assistance types. It must surface the explanation, uncertainty, source or evidence basis, limitations, control, correction, withdrawal, and downstream consequence required by the Intelligence and Trust System and Architecture.

### Client interaction cannot bypass authority

Client-side defaults, keyboard shortcuts, bulk actions, background refresh, cached scopes, client state restoration, or component reuse must not create a path around current authorization, product ownership, source relationship scope, or automation control. Any material action is rechecked at the trusted boundary.

---

## 8. Accessibility, Resilience, and Performance

### Accessibility is behavior delivered through the client

The client must implement the accessibility requirements of feature design specifications and behavior contracts across supported input, assistive technology, viewport, motion, connection, and timing conditions. Focus, reading order, status announcements, error discovery, control operability, time limits, and recovery are client responsibilities where they affect interaction.

### Resilience preserves agency

The client must support interruption, slow or unavailable network, expired session, source degradation, partial responses, background resumption, and feature withdrawal without misleading a person about state or trapping them in an unrecoverable experience. A graceful degradation may reduce capability; it cannot silently expand risk or remove material controls.

### Performance is an experience and trust constraint

Performance work must prioritize timely orientation, meaningful feedback, reliable controls, and truthful state. Loading optimizations, prefetching, caching, virtualization, hydration, client computation, or deferred rendering must not expose unauthorized information, hide a material update, present stale context as current, or delay a required authority choice until after action.

### Attention is protected technically

Client implementation must respect the experience and design constraints around notifications, persistent status, motion, interruption, and assistive prompting. It must not create excessive polling, repeated prompts, disruptive refresh, or visually urgent loops merely because technical events are available.

---

## 9. Current Implementation References and Transition

[TECHNICAL_ARCHITECTURE.md](../foundation/TECHNICAL_ARCHITECTURE.md) remains the current reference for the implemented application shell, client framework, directory structure, current routes, and client dependencies. [DESIGN_SYSTEM_V3.md](../foundation/DESIGN_SYSTEM_V3.md), [DESIGN_SYSTEM_V3_WORKSPACE.md](../foundation/DESIGN_SYSTEM_V3_WORKSPACE.md), [DESIGN_SYSTEM_V3_INTERACTION.md](../foundation/DESIGN_SYSTEM_V3_INTERACTION.md), and implementation code remain current references for visual and interaction implementation facts.

All new reusable client architecture, navigation and routing specifications, client state standards, data-loading contracts, accessibility implementation standards, performance budgets, and client recovery standards belong in `06-engineering/`. Existing references remain active for factual scope until a material revision creates an explicit successor. Do not copy route lists, component trees, framework APIs, CSS, or implementation code into this architecture; link to them and define only the durable boundary they do not own.

---

## 10. Boundaries With Other Documents

| Document family | Client Architecture owns | That family owns |
|---|---|---|
| Experience Architecture and Information Structure | Technical delivery of cross-surface context, entry, re-entry, and destination access. | What context must be available, how it must be understood, and the current destination organization. |
| Design System Architecture and feature design specifications | Client implementation constraints that preserve visual and accessible expression. | Design-document ownership, reusable patterns, and feature-specific design requirements. |
| Product Model and system documents | Faithful client representation and request of product state. | Product concepts, ownership, state meaning, authority, provenance, and invariants. |
| Data Architecture | Client use of representation, freshness, lineage, mutation, and correction context. | Durable lifecycle, access, integrity, portability, and repair rules. |
| Identity and Access Architecture | Client request and presentation of access state. | Authentication, authorization, delegation, revocation, and trusted enforcement. |
| Integration and Intelligence Architecture | Client presentation and initiation of connected and assistive behavior. | Source exchange, automation, model or tool boundaries, and technical controls. |
| Quality Architecture | Client quality requirements and evidence needed for verification. | Assurance governance, test data, defect, regression, and readiness boundaries. |
| Delivery design | Reusable client constraints a feature must apply. | Feature-specific technical approach, rollout, and recovery. |

---

## 11. Implications for Child Documents

Client state specifications must define the role, source, freshness, authority, lifecycle, reconciliation, persistence, error, and recovery behavior of each material client state. They must not turn a local representation into a new product state or authority source.

Navigation and routing specifications must map Information Structure destinations and contextual entry to actual paths, deep-link behavior, protected access, re-entry, unsaved or pending work, error, and accessibility treatment. They must not create a primary destination or product workflow without parent authority.

Data-loading and mutation contracts must define inputs, cache and freshness behavior, pending and optimistic state, invalidation, conflict, authorization, retry, failure, source limitation, and recovery. They must not recreate Data, Access, Integration, or product-system policy.

Accessibility implementation standards, performance budgets, and client recovery standards must link to behavior and design requirements, identify measurable client responsibility, and preserve the limits of their evidence. They must not substitute a score or tool result for the complete person experience.

---

## 12. Non-Goals

This document does not:

- define product meaning, system ownership, feature rationale, behavior, design language, navigation labels, routes, components, data schema, API, framework, rendering strategy, client library, or deployment configuration;
- replace Experience Architecture, Information Structure, Design System Architecture, Data Architecture, Identity and Access Architecture, Integration Architecture, Intelligence and Trust Architecture, Quality Architecture, delivery designs, or feature implementation specifications;
- treat an in-memory value, cache, visual state, optimistic UI, rendered control, route, or successful request dispatch as authoritative product truth or permission;
- allow client-side convenience, performance optimization, offline state, shortcut, or component pattern to bypass product authority, trusted access enforcement, source scope, or automation controls;
- hide material pending, failure, stale, unavailable, partial, or conflicting state to make an interaction appear simpler; or
- use performance, interaction volume, screen time, or client telemetry alone as proof of product value or user success.

---

## 13. Change Control

This document changes only when FlowOS changes an enduring rule about client rendering, navigation, state role, data freshness, optimistic behavior, authority presentation, resilient recovery, accessibility support, performance boundary, or the relationship between client implementation and product truth.

A change requires:

1. a decision record explaining the architecture-level need;
2. impact assessment for Engineering Architecture, Experience Architecture, Information Structure, Design System Architecture, Data, Access, Integration, Intelligence, Quality, and Operations Architecture, active behavior and delivery contracts, feature design specifications, implementation, and reviews;
3. evidence that the change preserves truthful state, person authority, source and assistance boundaries, accessibility, privacy, security, recovery, and operational understanding; and
4. confirmation of consistency with the Vision, Documentation Architecture, Product Model, applicable system documents, Experience Architecture, Design System Architecture, Engineering Architecture, and affected Behavior Contracts.

A framework upgrade, component preference, route refactor, caching optimization, performance benchmark, or one feature’s implementation shortcut does not by itself justify changing this architecture.
