# Validation Plans

**Status:** Active
**Authority:** Canonical standard for designing, governing, and linking validation of bounded FlowOS feature behavior before release and during learning
**Owner:** Product, engineering, and research leadership
**Parent:** [Documentation Architecture](../00-constitution/documentation-architecture.md) · [Success Model](../01-product/success-model.md) · [Feature Briefs](./feature-briefs.md) · [Behavior Contracts](./behavior-contracts.md) · [Delivery Designs](./delivery-designs.md) · [Journey Contracts](../03-experience/journey-contracts.md)
**Children:** Individual validation plans in `04-features/validation/`, test designs, research studies, measurement specifications, release-readiness records, evidence records, and feature reviews
**Last reviewed:** 2026-08-01
**Review trigger:** A proposed document changes the definition, required contents, evidence boundary, lifecycle, or assessment standard of a FlowOS feature validation plan.

---

## 1. Scope

This document defines what a FlowOS validation plan is, when one is required, and the single responsibility each individual validation plan must own.

It answers:

> How will FlowOS determine whether a bounded feature delivers its approved behavior, preserves its authority and trust constraints, and contributes to the intended outcome before and after release?

It does not decide whether a feature should exist, define observable behavior, choose a technical approach, set product-wide metric definitions, collect evidence, interpret results, approve a release, or revise product strategy. Those responsibilities belong to the feature brief, behavior contract, delivery design, Success Model, evidence records, review records, release decisions, and strategy documents respectively.

---

## 2. Validation-Plan Responsibility

An individual validation plan owns one answer to this question:

> What evidence must be gathered, by what method and threshold, to determine whether this approved feature behavior is safe, understandable, reliable, and useful enough for its intended decision?

The validation plan is the design for assessment. It translates a feature’s desired outcome, behavior, technical risk, and trust constraints into a proportionate evidence strategy. It does not contain the evidence or decide what the evidence ultimately means.

Every validation plan must:

1. link to the active feature brief, behavior contract, delivery design when applicable, and relevant journey contract;
2. state the decision the validation will inform and the risks it must reduce;
3. identify observable acceptance behavior, outcome signals, guardrails, and anti-metrics from the Success Model;
4. define the method, environment, participants or data sources, fixtures, analysis approach, and limitations appropriate to each question;
5. include normal, alternative, recovery, authority-sensitive, and harm-sensitive conditions; and
6. specify what records will hold raw evidence, interpreted findings, release disposition, and resulting decisions.

A validation plan is neither a test suite, research report, analytics dashboard, release checklist, nor retrospective.

---

## 3. When a Validation Plan Is Required

A validation plan is required before release for any feature that has a behavior contract. Its depth and method must be proportionate to risk, novelty, reversibility, and the decision it informs.

An expanded validation plan is required when a feature:

- creates or materially changes consequential product state, person authority, evidence, source relationships, export, deletion, recommendation, automation, or external-system effects;
- introduces a new or materially changed journey, entry context, recovery condition, or information-structure impact;
- handles sensitive information, access boundaries, privacy, security, safety, or trust;
- relies on incomplete, derived, source-provided, asynchronous, conflict-prone, or probabilistic information;
- requires migration, staged rollout, compatibility treatment, or an operational rollback or repair path; or
- claims to affect an outcome that cannot be responsibly inferred from basic usage alone.

A local correction to restore existing verified behavior may use a concise regression-validation record instead of a new plan, provided it does not change the feature boundary, behavior, authority, data, or risk profile.

---

## 4. Validation Boundaries

### Validate the authorized contract

Validation assesses the active feature brief and behavior contract, not an improvised implementation or a broader wish for engagement. If evidence reveals that the contract is wrong or incomplete, the team must revise the appropriate parent document rather than redefine success in the results.

### Evidence and interpretation remain separate

Raw observations, test outputs, participant responses, logs, measurements, and incident signals belong in evidence records. The analysis and assessment against an existing contract belong in a review record. The validation plan names those records; it does not become either of them.

### Method follows risk and uncertainty

No single method proves feature value. The plan selects methods that can answer the actual question: functional checks for observable behavior, accessibility assessment for access requirements, reliability testing for failure behavior, qualitative research for understanding and choice, measurement for sustained signals, and safety or security review for relevant risk.

### Passing one layer does not prove another

An implementation can function technically while remaining confusing, coercive, inaccessible, unreliable, unsafe, or unhelpful. The plan must separate behavioral correctness, operational readiness, understanding, authority, trust, and outcome evidence rather than collapse them into one score.

### Validation must not create harm

The plan must minimize unnecessary data collection, exposure, interruption, pressure, deceptive testing, and risk to participants or users. It must not require disclosure, acceptance of assistance, or continued use merely to demonstrate success.

---

## 5. Required Contents of an Individual Validation Plan

Every individual validation plan must include the following sections, in this order unless a documented exception makes a different sequence clearer.

| Section | Must establish | Must not contain |
|---|---|---|
| **Identity and status** | Name, status, owner, parent documents, children, review trigger, and evidence links. | Results, release approval, or a copy of the feature contract. |
| **Decision and scope** | The decision this plan informs, authorized feature boundary, behavior covered, and explicit exclusions. | A new feature scope, strategy decision, or undocumented release commitment. |
| **Validation questions** | The precise questions about behavior, understanding, trust, reliability, accessibility, safety, and outcome that evidence must answer. | Vague goals such as “validate the feature.” |
| **Acceptance and guardrail matrix** | Linked acceptance behavior, Success Model outcome signals, guardrails, anti-metrics, and the evidence needed for each. | New metric definitions, vanity metrics, or result claims. |
| **Methods and rationale** | Method, evidence type, population or environment, limitations, and why it can answer each question. | A generic list of tests detached from a decision. |
| **Scenarios and conditions** | Normal, alternative, recovery, source, assistance, accessibility, and failure conditions that must be assessed. | Interface scripts without a behavioral purpose. |
| **Fixtures, data, and environment** | Safe representative data, account roles, source conditions, tooling, environment, and cleanup requirements. | Uncontrolled production access or unnecessary sensitive data. |
| **Analysis and decision rules** | How evidence will be assessed, what constitutes pass, concern, block, or inconclusive evidence, and who interprets it. | Prewritten conclusions or a hidden release decision. |
| **Safety, privacy, and ethics** | Consent, data handling, participant protection, security review, exposure limits, and stop conditions. | A replacement for product-wide policies or a generic disclaimer. |
| **Evidence and review records** | Where raw evidence, findings, review, decision, and correction records will be stored and linked. | Embedded mutable results or silent changes to history. |
| **Change control** | Trigger, parent impacts, and revision path. | Unrecorded changes to acceptance evidence or success criteria. |

### Required metadata

An individual validation plan must use the durable-document metadata defined by Documentation Architecture. It also includes:

```text
Authorized behavior contract: Linked active behavior contract
Validation decision: Build readiness | rollout expansion | repair | learning | retirement | other
Risk domains: Behavior | accessibility | reliability | safety | security | privacy | trust | outcome
Evidence record locations: Planned study, measurement, test, and operational evidence records
Review record: Linked assessment record before the validation is closed
```

The metadata identifies the scope of assessment. It does not substitute for the validation questions, methods, or decision rules.

---

## 6. Validation Questions and Evidence Matrix

Every plan must turn the feature contract into answerable questions. Use a matrix that makes the intended decision explicit.

| Question class | The plan must determine | Typical evidence boundary |
|---|---|---|
| **Behavioral correctness** | Whether observable rules, states, permissions, and recovery paths behave as contracted. | Functional test evidence and defect records. |
| **Comprehension and control** | Whether a person can understand relevant state, consequence, uncertainty, provenance, and available choices. | Moderated or unmoderated research evidence, accessibility assessment, and behavioral observation. |
| **Authority and trust** | Whether consent, recommendation, automation, source exchange, correction, and exit remain meaningful and non-coercive. | Scenario assessment, audit evidence, and qualitative feedback. |
| **Reliability and recovery** | Whether normal, interrupted, partial, failed, stale, conflicting, or unavailable conditions remain truthful and recoverable. | Resilience tests, operational checks, and delivery evidence. |
| **Safety, privacy, and security** | Whether the feature respects exposure, access, data handling, and harm boundaries. | Required specialist review, security or privacy evidence, and controlled testing. |
| **Outcome contribution** | Whether the feature plausibly supports its desired outcome without confusing activity with value. | Appropriate product measurement, research, and longitudinal evidence. |

The plan must identify what each method cannot establish. For example, a successful click path does not establish informed consent; a positive interview does not establish reliability at scale; usage does not establish meaningful outcome.

---

## 7. Scenario Coverage

Each validation plan must state the scenarios it covers. At a minimum, consider the following and explicitly mark non-applicable cases.

| Scenario | Validation must assess |
|---|---|
| **Normal path** | The behavior a person intends, the context they receive, the authority they exercise, and the outcome they can observe. |
| **Alternative valid path** | Deferral, decline, direct entry, a different order of use, or a path that uses less context without penalty. |
| **First use or empty context** | How the feature behaves without established history and whether absence is represented truthfully. |
| **Returning or interrupted use** | Re-entry, pending work, saved state, orientation, and no-loss recovery. |
| **Unavailable, stale, or conflicting context** | Truthful limitation, preservation of state, and meaningful recovery or deferral. |
| **Correction and withdrawal** | Correction, undo, revision, paused automation, declined recommendation, disconnected source, or repaired record. |
| **Authority-sensitive action** | The clarity and enforceability of consent, scope, destination, consequence, and refusal. |
| **Accessibility and inclusive use** | Whether required understanding, control, timing, and recovery remain available across supported access needs. |
| **Abuse, misuse, or harm condition** | The feature’s behavior under foreseeable inappropriate access, misleading input, pressure, or unsafe automation. |

The plan may add domain-specific scenarios. It must not omit a material scenario because it complicates the release decision.

---

## 8. Analysis and Decision Rules

### Define the decision before evidence collection

The plan must state the decision owner, the decision options, and the evidence threshold appropriate to each option. Typical dispositions are proceed, proceed with constraints, repair and revalidate, defer, limit rollout, withdraw, or revise a parent document.

### Separate criteria from results

Acceptance conditions, guardrails, stop conditions, and limits are set before assessment. If a criterion must change because the contract or risk understanding changed, record the change and assess parent-document impact before reinterpreting results.

### Treat inconclusive evidence honestly

Inconclusive evidence is not a pass. The plan must state whether it requires more research, a narrower rollout, reduced scope, technical hardening, a revised hypothesis, or a decision to stop.

### Use mixed evidence responsibly

When several forms of evidence differ, the assessment must preserve the conflict and explain the implication. It must not average away a safety, authority, reliability, or accessibility concern because another signal is positive.

### Escalate material harm

The plan must define stop conditions and escalation paths for evidence of material harm, security exposure, privacy violation, authority breach, data-loss risk, or systemic unreliability. Release momentum, adoption, or sunk effort never overrides a stop condition.

---

## 9. Evidence, Review, and Record Handling

### Evidence records hold what occurred

Test outputs, research observations, measurement results, audit evidence, logs, feedback, and operational signals are stored in their respective evidence records with source, date, scope, limitations, and applicable provenance.

### Reviews hold assessment

A review record assesses whether the feature met its behavior contract and validation plan, documents findings and disposition, and links to the underlying evidence. It does not silently alter acceptance conditions or make a product decision that belongs in a decision record.

### Decisions hold consequential choices

A choice to expand, constrain, defer, repair, withdraw, or retire a feature is captured in a decision record when it materially changes product direction, scope, or release posture. The validation plan links to that decision; it does not become the decision history.

### Preserve corrections

If validation evidence, analysis, or a review contains an error, create a traceable correction or successor record. Do not silently rewrite closed evidence or review history to make a release appear cleaner than it was.

---

## 10. Relationship to Adjacent Documents

| Document | Validation plan owns | Adjacent document owns |
|---|---|---|
| Success Model | Feature-level questions and planned evidence that apply success definitions. | Outcome dimensions, signal meaning, guardrails, anti-metrics, and evidence hierarchy. |
| Feature brief | Assessment of the proposed feature outcome and its assumptions. | Person need, rationale, scope, alternatives, and product disposition. |
| Behavior contract | Validation of required observable feature behavior. | The behavior, states, authority, recovery, and acceptance behavior itself. |
| Delivery design | Validation of delivery risks and operational readiness. | Technical approach, migration, reliability, rollout, and recovery design. |
| Journey contract | Assessment of a journey’s relevant part within feature validation. | End-to-end experience contract, entry, exit, and cross-feature coordination. |
| Evidence record | Planned collection and linkage of evidence. | Raw observation, measurement, study, test, and operational results. |
| Review record | The questions and criteria to be assessed. | Actual assessment, findings, and disposition. |
| Decision record | Evidence required before a consequential feature decision. | The dated rationale and choice to proceed, constrain, defer, repair, or retire. |
| Strategy and delivery | Validation dependencies and release constraints. | Sequencing, release coordination, and allocation decisions. |

---

## 11. Lifecycle and Quality Bar

### Draft

A draft plan may shape discovery but cannot establish release readiness, acceptance, or a feature disposition.

### Active

An active plan is the authority for how its bounded feature behavior will be assessed. Test design, research, measurement, release readiness, and review work must link to it and remain within its stated decision scope.

### Closed

A plan is closed when its linked evidence and review records have assessed the planned decision and any consequential disposition has been recorded. Closed plans are historical records; corrections use linked records rather than silent edits.

### Superseded or retired

A plan is superseded when a named successor owns the next assessment of the same behavior or feature outcome. It is retired when the feature is removed or a decision explicitly ends the need for validation. The original remains accessible.

### Quality bar

A validation plan is ready to execute only when a product manager, designer, engineer, researcher or evaluator when applicable, and reviewer can independently answer:

1. Which approved feature boundary and observable behavior are being assessed?
2. What decision will the evidence inform, and what are the valid resulting dispositions?
3. Which questions assess behavior, understanding, authority, trust, recovery, accessibility, safety, reliability, and outcome?
4. Which methods and evidence sources can answer each question, and what can they not establish?
5. Which normal, alternative, recovery, unavailable, authority-sensitive, and harm-sensitive scenarios are covered?
6. How are pass, concern, block, and inconclusive evidence treated without redefining the contract after the fact?
7. Where will evidence, assessment, and decisions be recorded and corrected?

If any answer is left to improvised interpretation during release, the plan is not ready.

---

## 12. Non-Goals

Validation Plans do not:

- define a feature’s strategic rationale, scope, behavior, design, data model, technical architecture, or release sequence;
- replace evidence records, research studies, test suites, measurement specifications, incident reports, review records, or decision records;
- use engagement, completion, data volume, recommendation acceptance, automation use, or retention alone as proof of value;
- treat a passing technical check as proof of comprehension, authority, accessibility, safety, or outcome;
- hide negative, conflicting, or inconclusive evidence to protect a release; or
- require a person to disclose, continue using a feature, connect a source, or accept assistance to produce validation evidence.

---

## 13. Change Control

This document changes only when FlowOS changes the enduring standard for what a feature validation plan is, when it is required, what it must contain, or how validation evidence informs feature decisions and reviews.

A change requires:

1. a decision record explaining the standard-level need;
2. impact assessment for Success Model, Feature Briefs, Behavior Contracts, Delivery Designs, active validation plans, evidence records, measurement specifications, release readiness, decision records, and reviews;
3. evidence that the change preserves separation of contract, plan, evidence, assessment, and decision, as well as proportional safety and person authority; and
4. confirmation of consistency with the Vision, Documentation Architecture, Product Model, applicable system documents, and the Success Model.

A test-tool preference, schedule pressure, a positive early signal, or one release’s urgency does not by itself justify changing this standard.
