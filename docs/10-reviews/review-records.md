# Review Records

**Status:** Active
**Authority:** Canonical standard for assessing a bounded FlowOS artifact, release, system, or outcome against its stated contract and preserving its disposition
**Owner:** Accountable review owner
**Parent:** [Documentation Architecture](../00-constitution/documentation-architecture.md) · [Roadmap](../07-strategy-and-delivery/roadmap.md) · [Quality Architecture](../06-engineering/quality-architecture.md) · [Operations Architecture](../06-engineering/operations-architecture.md) · [Research Program](../09-evidence/research-program.md) · [Measurement Specifications](../09-evidence/measurement-specifications.md)
**Children:** Individual review records in `10-reviews/records/`, release reviews, architecture reviews, feature reviews, research reviews, operational reviews, corrective-action records, and linked decision records
**Last reviewed:** 2026-08-01
**Review trigger:** A proposed document changes the definition, threshold, required contents, evidence boundary, disposition model, lifecycle, or authority relationship of a FlowOS review record.

---

## 1. Scope

This document defines what a FlowOS review record is, when a review is required, and the single responsibility an individual review must own.

It answers:

> Did this bounded artifact, release, system, outcome, or operating condition meet its stated contract when assessed against relevant, traceable evidence—and what disposition follows from that assessment?

It does not rewrite the thing under review, choose new product direction, define a feature, conduct research, define a metric, serve as an incident record, execute a release, or make a consequential decision. Those responsibilities remain with the relevant living contract, research and measurement evidence, operational records, release plans, and decision records.

---

## 2. Review-Record Responsibility

An individual review record owns one bounded assessment. It links a defined review scope to pre-existing criteria and evidence, preserves findings and uncertainty, and records an accountable disposition.

| Artifact | Review record owns | It does not own |
|---|---|---|
| Review scope | The exact artifact, release, system, outcome, or period assessed. | A new scope or contract for that artifact. |
| Criteria | The applicable, pre-existing criteria and their interpretation for this assessment. | Creation or alteration of the criteria. |
| Findings | Evidence-linked assessment, including gaps and uncertainty. | A replacement specification or raw evidence store. |
| Disposition | The assessment state and required follow-up links. | Authorization to alter product direction or bypass a control. |
| Decision record | A consequential choice prompted by findings. | The assessment itself. |

Reviews are warranted at defined gates; when a material risk, incident, complaint, evidence change, or quality signal calls an existing contract into question; before expansion of a release; after meaningful corrective work; and when a governing document's review trigger occurs.

A review is not an automatic pass/fail ceremony. It must be proportionate to the scope, impact, reversibility, novelty, authority or privacy exposure, and available evidence. A brief, well-evidenced review is stronger than a long assertion without traceability.

---

## 3. Preconditions and Review Framing

Before assessment begins, the review owner identifies:

1. the precise scope, time boundary, owner, decision or gate it can inform, and explicit exclusions;
2. the living contracts, criteria, prior decisions, and predecessor reviews that apply;
3. the evidence required, its provenance, quality, access boundary, and known gaps;
4. the reviewers, needed expertise, independence or conflict considerations, and escalation path; and
5. the possible dispositions and what each does and does not authorize.

The review may assess an outcome, behavior, architecture boundary, design expression, delivery readiness, release, operation, corrective action, or research/measurement practice. It must not assemble new criteria after seeing results merely to justify an intended outcome. If the existing criteria are inadequate, the review records that fact and refers a correction to the owning document's change-control process.

No review can override the Vision, its governing parent documents, user authority, source boundaries, security, privacy, accessibility, or safety requirements. Evidence may expose a conflict; accountable resolution belongs in the appropriate living contract or decision record.

---

## 4. Required Review Record Contents

Every individual record in `10-reviews/records/` must contain:

| Section | Required content |
|---|---|
| Identity and state | Title, review type, owner, reviewers, status, date range, and review trigger. |
| Scope | The item, period, population, release, system, or outcome assessed, plus exclusions. |
| Contract and criteria | Links to the pre-existing applicable contracts, definitions, criteria, gates, and prior dispositions. |
| Evidence register | Evidence links, provenance, collection period, quality or confidence state, access boundary, and important missing evidence. |
| Method | Assessment approach, sampling or inspection boundary, reviewer roles, independence/conflict note, and material deviations. |
| Findings | Criterion-by-criterion factual finding, severity where appropriate, uncertainty, dissent, and supporting evidence. |
| Disposition | Pass, pass with conditions, partial, defer, fail, withdraw, or informational; rationale and scope of the disposition. |
| Follow-through | Required links to corrective actions, decisions, parent updates, re-review conditions, accountable owners, and due or trigger conditions. |

An individual review may link to evidence held in research, measurement, validation, incident, or operational records. It does not copy raw data, sensitive source material, credentials, or lengthy evidence into the review record.

---

## 5. Evidence and Finding Discipline

Review findings must distinguish facts, assessment, uncertainty, and proposed action.

- A **fact** is a traceable observation in an evidence record, validated check, or cited artifact.
- An **assessment** states whether the fact meets the linked criterion, and why.
- An **uncertainty** explains an evidence limitation, context gap, conflict, or untested condition.
- A **proposed action** is a follow-up suggestion that receives its authority only from the parent plan, change process, or decision record that adopts it.

Findings must cover material counterevidence, not just evidence supporting the expected disposition. A review with insufficient evidence records an insufficient-evidence finding; it does not invent confidence. Where evidence quality is degraded, incomplete, or not comparable, the review defines the effect on the assessment.

Severity is used only for a stated review purpose—for example, safety, user authority, security, accessibility, reliability, data integrity, operational recoverability, or outcome risk. A severity label includes rationale and cannot be used as a substitute for evidence or accountability.

---

## 6. Dispositions and Authority

The review owner chooses one of these bounded dispositions:

| Disposition | Meaning | Does not mean |
|---|---|---|
| **Pass** | The reviewed scope met all applicable criteria on the available evidence. | It is permanently correct or requires no monitoring. |
| **Pass with conditions** | Criteria are met within explicit temporary limits and follow-through conditions. | Risks or missing evidence may be ignored. |
| **Partial** | Some criteria were met and others were not assessed or unmet. | The full scope is approved. |
| **Defer** | Assessment cannot yet reach a justified disposition. | The scope fails by default or may proceed without authority. |
| **Fail** | One or more material criteria were not met. | The review itself supplies the repair design. |
| **Withdraw** | The scope must no longer be available or relied upon under the stated conditions. | Historical evidence or reason is erased. |
| **Informational** | Assessment has no approval or gate effect. | Findings lack relevance or follow-up need. |

No disposition silently changes release access, product behavior, or roadmap priority. If a disposition has a consequential effect, the authorized release, delivery, roadmap, or decision artifact must make and record that effect. A review can require a re-review condition, but it cannot grant an exception to a governing requirement without a linked decision record and explicit authority.

---

## 7. Review Types and Boundaries

The common review types share this standard while retaining distinct scope:

| Type | Assesses | Must not replace |
|---|---|---|
| Feature review | Approved behavior, design, validation, and acceptance evidence. | Feature brief, behavior contract, or delivery design. |
| Release review | Readiness, actual rollout condition, monitoring, containment, and recovery evidence. | Release plan, operational runbook, or release authorization. |
| Architecture review | Conformance of a durable technical or experience boundary. | Architecture or implementation design. |
| Outcome review | Progress toward a roadmap outcome using relevant evidence. | Roadmap investment decision. |
| Research or measurement review | Integrity, ethics, validity, quality, or declared limitations of an evidence practice. | Research program or measurement specification. |
| Operational review | Live operation, incident follow-through, resilience, or support performance. | Incident record or operations architecture. |

A review record may include recommendations, but a recommendation is never treated as an approved change. It should link to the artifact that decides, plans, or implements the response.

---

## 8. Lifecycle, Re-Review, and Historical Integrity

Review records move through **planned**, **in review**, **issued**, **corrected**, **superseded**, or **closed** states. An issued record is append-only apart from explicit corrections. Corrections identify the original assertion, the basis for change, the affected disposition, and dependent artifacts that require reconsideration.

Closing a review means its required follow-through is complete or has been intentionally transferred to named successor artifacts; it does not erase the findings. A failed or withdrawn scope remains discoverable with its reason and resolution path.

Re-review is required when a disposition condition is met or missed, material evidence changes, the scope changes, a corrective action claims completion, or a governing parent document requires it. The new review links to the earlier record and states whether it confirms, narrows, corrects, or supersedes the prior disposition.

---

## 9. Relationship to Adjacent Documents

| Document | Review record owns | Adjacent document owns |
|---|---|---|
| Validation Plans and Quality Architecture | Evidence-linked assessment of a bounded scope. | Validation design and durable assurance rules. |
| Delivery and Release Plans | Disposition and follow-through constraints. | Coordination, rollout, recovery, and authorized execution. |
| Research Program and Measurement Specifications | Assessment of evidence quality or use for a stated review. | Evidence methods, definitions, and records. |
| Decision Records | Findings and disposition that may trigger a choice. | Consequential rationale and accountable choice. |
| Roadmap | Outcome-review assessment. | Current investment sequence, gate, and strategic commitment. |
| Legacy Review Layer | New review-record standard and successor location. | Historical SRAI artifacts and pre-existing review guidance. |

---

## 10. Non-Goals and Change Control

Review Records do not serve as feature specifications, implementation designs, test repositories, dashboards, research stores, incident logs, meeting notes, backlogs, or decision logs.

This standard changes only when FlowOS changes the enduring definition, required contents, evidence boundary, disposition authority, lifecycle, or correction process for reviews. A change requires a decision record, impact assessment for active review records and applicable parent documents, and confirmation that assessment, evidence, living contracts, and consequential decisions remain separate.
