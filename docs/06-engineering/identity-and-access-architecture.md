# Identity and Access Architecture

**Status:** Active
**Authority:** Canonical architecture for FlowOS identity, authentication, authorization, delegation, session, revocation, and audit boundaries
**Owner:** Engineering Architect
**Approval Required:** Founder
**Parent:** [Engineering Architecture](./engineering-architecture.md) · [Data Architecture](./data-architecture.md) · [Product Model](../01-product/product-model.md) · [Continuity and Interoperability System](../02-systems/continuity-and-interoperability.md) · [Intelligence and Trust System](../02-systems/intelligence-and-trust.md)
**Children:** Authentication specifications, authorization policies, access-control specifications, delegation and source-credential specifications, session-management standards, audit-access standards, account-recovery procedures, security reviews, and access-operation runbooks
**Last Updated:** 2026-08-03
**Review trigger:** A proposed change alters identity proof, product authorization, delegated authority, source access, session behavior, revocation, operational access, auditability, or account-recovery behavior.

---

## Document Ownership

### Owner
**Role:** Engineering Architect
**Responsibility:** Maintain the identity and access architecture, propose authentication and authorization boundaries that preserve person authority and narrowest scope

### Modification Process
1. Engineering Architect proposes changes (based on delivery design needs or security evidence)
2. Submit to Founder for approval
3. Founder reviews for alignment with data architecture and system documents
4. If approved: Engineering Architect updates the document
5. Document change in decision record if consequential
6. Update the Last Updated date

### Authority Level
- Engineering Architect can: propose and maintain identity and access architecture, define auth/authz boundaries
- Requires approval for: any change to identity proof, authorization model, or delegated authority

---

## 1. Scope

This document defines how FlowOS establishes identity and enforces the authority boundaries that protect a person’s information, choices, source relationships, and connected systems.

It answers:

> How does FlowOS prove who or what is acting, determine what authority applies, enforce the narrowest valid scope, and preserve a person’s ability to withdraw or correct that authority?

It does not define a person’s product authority, data schema, authentication provider, credential type, UI flow, role list, permission table, policy language, secret-management mechanism, or incident procedure. Those responsibilities belong to parent product and system documents, data and engineering-domain specifications, feature design and behavior contracts, security policies, and operations runbooks.

---

## 2. Identity-and-Access Responsibility

Identity and Access Architecture has seven responsibilities:

1. distinguish proof of identity from authorization to read, change, derive, export, or act on product information;
2. translate person authority, system ownership, and source relationship scope into enforceable technical access boundaries;
3. govern delegated authority to clients, services, automations, support roles, and connected systems without expanding the person’s original consent;
4. make access revocable, time- and scope-bounded where appropriate, and sufficiently auditable for material actions;
5. preserve safe session, account-recovery, permission-change, and disconnection behavior;
6. prevent technical credentials, background workers, or operational privilege from becoming hidden product authority; and
7. separate normative access architecture from current providers, protocols, tokens, role definitions, configurations, and operational facts.

Identity architecture answers who or what can be reliably recognized. Access architecture answers what a recognized actor may do for a defined purpose. Neither decides what a person should choose or changes the product meaning of a direction, commitment, action, evidence, interpretation, adaptation, recommendation, or source relationship.

---

## 3. Authority Model

### Authentication is not authorization

Authentication establishes sufficient confidence in an actor’s identity for a particular interaction. It does not grant access to every record, action, source, automation, or operational capability associated with that identity.

Authorization evaluates whether a recognized actor may perform a defined action on a defined resource, within a defined scope, for a permitted purpose, at a particular time and system state.

### Product authority precedes technical authority

The Product Model and system documents define when a person must control a decision, record, source relationship, or consequential action. This architecture enforces that rule technically. A valid authenticated session, client request, stored preference, or delegated token cannot bypass a product requirement for explicit person authority.

### Every material action has an authority chain

For a consequential action, the system must be able to establish:

1. the initiating actor or authorized system;
2. the identity confidence appropriate to the risk;
3. the product object, operation, source, or external destination affected;
4. the applicable authority and its scope, purpose, and lifetime;
5. the technical enforcement boundary that permits or denies the action; and
6. the audit context required to investigate, correct, or contain the result.

If any part of this chain is unknown or invalid, the action must be denied, deferred, or safely limited rather than treated as implicitly authorized.

---

## 4. Actor and Authority Classes

An actor class identifies how authority is evaluated. It does not grant any capability by itself.

| Actor class | Role in FlowOS | Authority requirements | Must not imply |
|---|---|---|---|
| **Person** | The individual using FlowOS and exercising final control over their product context. | Authenticated identity plus the product and data scope applicable to the action. | Permission to affect another person’s context or automatic approval of consequential choices. |
| **Client session** | A bounded interaction context acting for an authenticated person. | Current session validity, device or client safeguards as appropriate, and server-side authorization for material actions. | Permanent authority, access beyond the current person, or trust in unverified client state. |
| **Service** | A non-human system component performing a defined technical function. | Explicit service identity, narrow purpose, minimal scope, rotation or expiry treatment, and auditability. | General access to person data or authority to make product choices. |
| **Automation** | A bounded system-performed action under explicit product authority. | Eligible automation policy, declared scope, person authority where required, and enforceable controls. | A right to create consequential state merely because it can execute technically. |
| **Connected system** | An external source or destination interacting through a declared relationship. | Verified integration identity, source relationship scope, exchange direction, and failure or revocation treatment. | Ownership of FlowOS data or authority over a person’s product state. |
| **Operational role** | Authorized support, security, quality, or operations personnel or tooling. | Least-privilege, time- or task-bounded access where appropriate, approval, audit, and restricted handling. | Routine visibility into personal content or ability to override product authority without incident or policy basis. |
| **Anonymous or pre-authenticated visitor** | A person not yet recognized as an authenticated account holder. | Public or explicitly permitted limited access only. | Access to private product context, personalized state, or hidden account creation. |

Authorization specifications may define more granular actor types. They must inherit these boundaries rather than create an unbounded “internal” or “trusted” class.

---

## 5. Access Principles

### Least privilege and least duration

Access is granted at the narrowest resource, operation, purpose, and duration that can satisfy the approved behavior. Broad, permanent, or inherited access requires explicit architecture and security justification; convenience is not sufficient.

### Default deny for consequential boundaries

When identity, scope, source relationship, current authority, session integrity, or policy evaluation is uncertain, the system must deny or safely defer consequential read, write, export, derivation, automation, or external action. It must not fail open because the requested action appears routine.

### Separation of authority and implementation path

An action remains subject to the same product authority whether it originates from a client UI, background job, import, API, support tool, migration, integration callback, or automation. Alternative technical paths cannot become authority bypasses.

### Explicit delegation

Delegated authority must identify the delegator, recipient, action set, resource scope, purpose, lifetime, revocation path, and audit treatment. The recipient cannot delegate onward or broaden the scope unless that right is explicitly granted and permitted by product and security rules.

### Reauthorization and revocation are real

The system must support revocation, narrowing, expiration, session termination, disconnection, and reauthorization without treating previous use as ongoing consent. Revocation must stop future unauthorized use and make any residual limitation, pending work, or historical context understandable.

### Access is understandable when material

Feature behavior and design must make person-facing access choices, source connections, consequential automation scopes, and their effects understandable before authority is granted. This architecture enforces the choice; it does not replace the product’s responsibility to obtain meaningful authority.

---

## 6. Authorization and Enforcement Boundaries

### Enforce at a trusted boundary

Material authorization must be evaluated at an appropriate trusted boundary that cannot be bypassed by an untrusted client representation, stale local state, hidden route, replayed request, or background process. The implementation mechanism belongs in the relevant access-control specification.

### Bind access to resource and operation

Authorization decisions must be specific enough to distinguish at least the resource or resource class, operation, person or source context, and relevant current state. A generic “authenticated” check is not sufficient for a material write, export, source exchange, correction, automation, or operational action.

### Recheck on sensitive transitions

The system must re-evaluate authority when the scope, destination, source relationship, session, sensitivity, or consequence materially changes. A previously authorized read does not automatically authorize a write, export, automation, or external effect.

### Restrict derived use

Access to an input record does not automatically authorize every derivation, inference, recommendation, automation, log entry, metric, or export that could be produced from it. Derived use must stay within the applicable product, source, privacy, and Intelligence and Trust boundaries.

### Preserve denial and recovery behavior

An authorization denial, expired session, revoked source, missing scope, or policy conflict must result in truthful, safe feature behavior. The system must not expose protected information in an error, perform a partial unauthorized action, or leave a person unable to understand the available recovery path.

---

## 7. Sessions, Delegation, and Connected Sources

### Sessions are bounded representations of access

A session represents a temporary ability for a client or actor to request authorized work. It must have defined issuance, renewal, expiry, termination, and recovery behavior proportionate to risk. Session persistence cannot make a person’s future authority permanent or conceal a changed access condition.

### Source credentials are not product consent

Connected-system credentials prove or enable a technical relationship with a source. They do not by themselves establish that FlowOS may display, derive, recommend from, modify, retain, export, or send information within every product context. Each use remains bounded by the declared source relationship and applicable person authority.

### Delegated background work remains attributable

When a person authorizes a background process, import, synchronization, export, or automation, the system must retain the person or product policy that authorized the work, the effective scope, the time, and the current revocation or cancellation state. Work that outlives its authority must stop or be safely limited.

### Disconnection and permission change are state changes

Loss, expiry, revocation, narrowing, or disconnection of authority must be represented as an access and source state change. It must stop future unauthorized behavior, preserve relevant history according to data and continuity rules, and trigger truthful user-visible limitation or recovery behavior.

---

## 8. Audit, Support, and Account Recovery

### Audit material access and action

For material access, changes, exports, delegated work, external effects, operational intervention, and policy failure, the architecture must provide proportional audit context: actor, time, scope, operation, affected resource class, authority basis, result, and relevant correlation context. Audit records must be protected from casual access and must not unnecessarily retain personal content.

### Operational access is exceptional

Support, security, quality, migration, and incident-response access must follow approved roles, minimal scope, documented purpose, and reviewable audit treatment. Operational convenience cannot become a standing route to personal data or a way to make unapproved product changes.

### Account recovery protects continuity and authority

Account recovery, identity change, lost-device treatment, and access restoration must balance a person’s continuity with protection against impersonation and inappropriate disclosure. Recovery procedures must identify evidence requirements, cooling or review conditions where appropriate, and safe behavior when confidence is insufficient.

### Audit supports correction, not surveillance

Auditability exists to investigate, repair, secure, and account for material access and action. It must not be repurposed into unbounded observation of a person’s behavior, productivity, or private content.

---

## 9. Failure, Abuse, and Recovery

Access architecture must assess the following conditions and explicitly mark non-applicable cases in child specifications and delivery designs.

| Condition | Required behavior |
|---|---|
| **Authentication failure** | Protect private context, provide a safe recovery route, and avoid exposing account or system details unnecessarily. |
| **Expired or invalid session** | Stop unauthorized work, preserve safe pending context where possible, and make re-entry or reauthentication understandable. |
| **Missing, narrowed, or revoked scope** | Deny the unapproved operation, show the material limitation, and provide authorized reauthorization or alternative path where appropriate. |
| **Delegation or automation beyond scope** | Prevent the action, retain audit context, contain any partial effect, and require explicit new authority. |
| **Source credential or callback failure** | Treat source context as unavailable or stale as appropriate; do not imply current exchange or ownership. |
| **Operational misuse or compromise** | Contain access, preserve evidence, revoke or rotate as appropriate, follow incident procedures, and assess affected product and data state. |
| **Account-recovery uncertainty** | Prefer safe limitation and accountable review over granting access on weak evidence. |

Recovery must distinguish restoration of access from restoration of product state, source availability, or a consequential action. Regaining a session does not prove a pending external effect succeeded.

---

## 10. Current Implementation References and Transition

[TECHNICAL_ARCHITECTURE.md](../foundation/TECHNICAL_ARCHITECTURE.md) remains the current reference for implemented authentication flow, session behavior, and current application access facts. [ENGINEERING.md](../foundation/governance/ENGINEERING.md) remains the current reference for active engineering guardrails, including security and row-level access review.

All new reusable identity, access, delegation, session, audit, and recovery architecture belongs in `06-engineering/`. Existing implementation references remain active for factual scope until a material revision creates an explicit successor. Do not duplicate implementation-specific provider, credential, route, or policy details here; link to the current reference and define only the durable architecture rule it lacks.

---

## 11. Boundaries With Other Documents

| Document family | Identity and Access Architecture owns | That family owns |
|---|---|---|
| Product Model and system documents | Technical enforcement of person authority, ownership, and source boundaries. | What authority, ownership, and product state mean. |
| Data Architecture | Access requirements for durable representations and operations. | Data lifecycle, lineage, retention, deletion, portability, and integrity. |
| Continuity and Interoperability System | Technical enforcement of source relationship scope and disconnection. | Product semantics of source, continuity, exchange, and portability. |
| Intelligence and Trust System | Access and delegation constraints for assistance and automation. | Eligibility, explanation, control, correction, and authority policy for assistance. |
| Feature behavior and design contracts | Enforceable access constraints that features must present truthfully. | Person-facing choices, understandable consent, observable behavior, and design expression. |
| Security and privacy standards | Identity and access controls that implement their requirements. | Threat assessment, policy, specialist review, incident governance, and data-handling obligations. |
| Operations architecture | Authorized operational access, audit, containment, and recovery requirements. | Deployment, monitoring, incident response, backup, and operational execution. |
| Delivery design | Reusable access architecture rules a feature must apply. | Feature-specific technical approach, rollout, and recovery. |

---

## 12. Implications for Child Documents

Authentication specifications must define identity confidence, credential lifecycle, session issuance and recovery, abuse controls, and relevant user-visible behavior without conflating authentication with authorization.

Authorization and access-control specifications must map resource classes, operations, actors, scopes, trusted enforcement boundaries, denial behavior, audit requirements, revocation, and tests to their parent product and engineering rules. They must not hide a consequential policy decision in a role name or query filter.

Delegation and source-credential specifications must define authority source, recipient, scope, purpose, lifetime, revocation, downstream use, audit, failure, and disconnection behavior. They must preserve the distinction between technical access and a person’s product consent.

Account recovery, support-access, and incident procedures must define evidence, approval, scope, communication, containment, audit, and correction requirements. They must not create informal or permanent privileged access.

---

## 13. Non-Goals

This document does not:

- prescribe an authentication provider, token or credential format, role taxonomy, policy language, UI, endpoint, middleware, session store, secret vault, or operational procedure;
- define a person’s product authority, source relationship, retention policy, privacy policy, security policy, or feature behavior;
- replace Data Architecture, Integration Architecture, Intelligence and Trust Architecture, security standards, privacy standards, delivery designs, or access-operation runbooks;
- treat a valid login, session, credential, client, service, or operational role as blanket authority;
- allow delegated work, background processes, integrations, or automation to expand scope or outlive revocation; or
- use audit, support, or recovery as a reason for unnecessary observation, data retention, or access to private content.

---

## 14. Change Control

This document changes only when FlowOS changes an enduring rule about identity proof, access evaluation, delegated authority, source credentials, sessions, revocation, auditability, operational access, or account recovery.

A change requires:

1. a decision record explaining the architecture-level need;
2. impact assessment for Engineering Architecture, Data Architecture, Product Model and affected system documents, active behavior and delivery contracts, source integrations, intelligence and automation, security and privacy requirements, operations, account recovery, and reviews;
3. evidence that the change preserves explicit person authority, least privilege, source boundaries, privacy, security, recovery, auditability, and truthful feature behavior; and
4. confirmation of consistency with the Vision, Documentation Architecture, Product Model, applicable system documents, Engineering Architecture, and affected Behavior Contracts.

A provider migration, token-library change, login-flow preference, one support case, or implementation shortcut does not by itself justify changing this architecture.
