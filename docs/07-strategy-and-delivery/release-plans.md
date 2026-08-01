# Release Plans

**Status:** Active
**Authority:** Canonical standard for coordinating bounded FlowOS releases, rollout, readiness, communication, monitoring, containment, and recovery
**Owner:** Product, engineering, and operations leadership
**Parent:** [Documentation Architecture](../00-constitution/documentation-architecture.md) · [Roadmap](./roadmap.md) · [Delivery Plans](./delivery-plans.md) · [Validation Plans](../04-features/validation-plans.md) · [Quality Architecture](../06-engineering/quality-architecture.md) · [Operations Architecture](../06-engineering/operations-architecture.md)
**Children:** Individual release plans in `07-strategy-and-delivery/releases/`, rollout plans, release-readiness records, communications plans, operational runbooks, incident procedures, release reviews, and decision records
**Last reviewed:** 2026-08-01
**Review trigger:** A proposed document changes the definition, required contents, authority boundary, release class, rollout or recovery model, lifecycle, or review standard of a FlowOS release plan.

---

## 1. Scope

This document defines what a FlowOS release plan is, when one is required, and the single responsibility each individual release plan must own.

It answers:

> How does FlowOS make an approved bounded behavior available to a defined population or context with proportionate readiness, communication, monitoring, containment, and recovery?

It does not decide what should be built, define feature behavior, select a technical implementation, execute a deployment, determine test methods, record results, or approve release. Those responsibilities belong to the Roadmap, feature and design contracts, delivery design, operations architecture, validation and quality plans, evidence and review records, and decision records.

---

## 2. Release-Plan Responsibility

An individual release plan owns one answer to this question:

> Given approved behavior and delivery readiness, how will this specific release be scoped, introduced, observed, contained, recovered, and assessed?

Every release plan must:

1. link to the active roadmap outcome, delivery plan, feature contracts, delivery design, validation plan, and operations requirements it applies;
2. define the release population, eligibility, exposure, boundaries, and what does not become available;
3. identify readiness evidence, known limits, stop conditions, monitoring, accountable owners, communication, and support paths;
4. distinguish deployment, release, rollout expansion, rollback, repair, correction, withdrawal, and incident response;
5. define how a person’s authority, source scope, privacy, security, accessibility, and recovery remain protected during release; and
6. link the evidence, review, and decision required to expand, constrain, repair, withdraw, or close the release.

A release plan coordinates availability. It does not make the behavior true, safe, valuable, or approved by itself.

---

## 3. When a Release Plan Is Required

A release plan is required when a change becomes available to people outside a controlled development context and has material behavior, data, authority, source, automation, accessibility, reliability, security, privacy, migration, or operational consequence.

A concise release note may be sufficient for a low-risk corrective deployment that restores an already released contract without widening population, data, scope, source access, or risk. It must state the linked contract, evidence, monitoring, and recovery owner.

No release plan can authorize behavior that lacks an active feature brief, behavior contract, delivery design when required, validation plan, and applicable quality and operations readiness.

---

## 4. Release Classes

| Class | Meaning | Required release treatment |
|---|---|---|
| **Internal** | Available only to explicitly authorized internal operators or controlled test accounts. | Bounded access, evidence handling, operational monitoring, and safe containment. |
| **Limited** | Available to a defined small population or condition for validation or guarded use. | Explicit eligibility, consent or authority where applicable, close monitoring, stop conditions, and an expansion decision. |
| **Staged** | Increased availability through named cohorts, conditions, or gates. | Gate-by-gate evidence, compatibility, communication, monitoring, and rollback or repair assessment. |
| **General** | Available to the intended active population under normal product access. | Full readiness evidence, support, operations, privacy, security, accessibility, and recovery treatment. |
| **Withdrawal or repair** | Availability is narrowed, paused, removed, or corrected because of risk, incident, or changed evidence. | Containment, truthful communication, correction or repair, audit, review, and decision linkage. |

Release class describes availability, not product quality or investment confidence. A general release can still require monitoring, repair, or later withdrawal.

---

## 5. Required Contents of an Individual Release Plan

| Section | Must establish | Must not contain |
|---|---|---|
| **Identity and status** | Owner, release class, scope, parent and child documents, review trigger, and decision links. | Product rationale or a copy of feature behavior. |
| **Release boundary** | Population, eligibility, included behavior, exclusions, source or automation scope, and duration or gate. | A new feature scope or unstated access expansion. |
| **Readiness evidence** | Required validation, quality, design, security, privacy, data, integration, operations, and support inputs. | Raw evidence or a predetermined pass claim. |
| **Rollout and communication** | Exposure sequence, person-facing communication, support, expectations, and feedback routes. | Detailed deployment commands or marketing strategy. |
| **Monitoring and stop conditions** | Signals, owners, decision thresholds, containment action, and escalation. | Unactionable dashboards or unspecified “watch closely” language. |
| **Recovery and withdrawal** | Rollback, repair, correction, source or automation pause, data treatment, communication, and accountable owners. | A promise that every effect is reversible. |
| **Review and decision** | Evidence record, release review, and accountable expansion, constraint, repair, or closure decision. | A silent release approval or mutable result log. |
| **Change control** | Replan triggers and parent-impact review. | Unrecorded population or scope expansion. |

Individual plans use durable-document metadata plus release class, release population, readiness review, stop conditions, rollback or repair owner, and post-release review link.

---

## 6. Readiness, Rollout, and Recovery Rules

### Readiness is evidence, not a checkbox

Readiness records must identify what was assessed, what remains unknown, which conditions are acceptable for the release class, and what must block release. A build, deployment, check, or sign-off alone does not prove product value, authority, accessibility, security, privacy, or recoverability.

### Release exposure is deliberate

Population, eligibility, timing, source access, automation scope, feature availability, and external effect must increase only according to the approved release boundary. A technical flag, route, invitation, or account role is an implementation mechanism, not a substitute for release authorization.

### Recovery is truthful

The release plan must distinguish code or configuration rollback from data repair, source disconnection, withdrawal of assistance, external-effect correction, and person-facing communication. If a condition cannot be undone, the plan must define containment and repair instead of promising rollback.

### People retain control during rollout

A release must not use limited access, prompt framing, defaults, source connection, automation, or support intervention to reduce a person’s meaningful ability to decline, correct, disable, disconnect, or leave where their parent contracts require it.

---

## 7. Relationship to Adjacent Documents

| Document | Release plan owns | Adjacent document owns |
|---|---|---|
| Roadmap and delivery plan | Release contribution and gate. | Outcome sequence and delivery coordination. |
| Behavior and design contracts | Release boundary and readiness dependency. | Product behavior and design expression. |
| Delivery design | Release constraints and operations coordination. | Feature-specific technical approach, migration, and recovery design. |
| Validation and quality plans | Release evidence and monitoring dependency. | Methods, quality domains, evidence handling, and assessment. |
| Operations architecture | Application of release controls. | Reusable deployment, observability, incident, and recovery rules. |
| Evidence, review, and decision records | Required closure and expansion path. | Facts, assessment, and consequential disposition. |

---

## 8. Lifecycle and Non-Goals

### Lifecycle

A draft plan has no authority to expose behavior. An active plan governs one bounded release. A release is closed only after its planned review and decision; it may result in expansion, continued monitoring, repair, withdrawal, or successor release. Historical plans remain accessible.

### Non-Goals

Release Plans do not:

- define the roadmap, feature scope, behavior, design, technical architecture, test method, deployment command, or incident procedure;
- treat deployment, check completion, rollout size, usage, or elapsed time as proof of readiness or value;
- authorize unreviewed data migration, source access, automation, external effect, or population expansion; or
- hide a pause, withdrawal, repair, or known limitation to preserve release momentum.

---

## 9. Change Control

This standard changes only when FlowOS changes the enduring definition, boundary, release class, required contents, rollout, recovery, or governance of release plans.

A change requires a decision record, impact assessment for active releases and their parent plans and contracts, evidence that the change preserves person authority and truthful recovery, and confirmation of consistency with Documentation Architecture, Roadmap, Quality Architecture, and Operations Architecture.
