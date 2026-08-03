# Research Program

**Status:** Active
**Authority:** Canonical standard for framing, conducting, preserving, synthesizing, and governing decision-relevant FlowOS research
**Owner:** Product Architect
**Approval Required:** Founder
**Parent:** [Documentation Architecture](../00-constitution/documentation-architecture.md) · [Product Strategy](../01-product/product-strategy.md) · [Success Model](../01-product/success-model.md) · [Roadmap](../07-strategy-and-delivery/roadmap.md) · [Validation Plans](../04-features/validation-plans.md)
**Children:** Individual research records in `09-evidence/research/`, research protocols, participant-protection records, recruitment plans, research syntheses, and linked decision or review records
**Last Updated:** 2026-08-03
**Review trigger:** A proposed document changes the definition, required contents, integrity boundary, participant-protection rule, lifecycle, or relationship between research, evidence, synthesis, and decisions.

---

## Document Ownership

### Owner
**Role:** Product Architect
**Responsibility:** Maintain research program standards, ensure research integrity and participant protection, and coordinate with Release Manager on evidence and validation implications

### Modification Process
1. Product Architect proposes research program changes (based on process improvements or evidence needs)
2. Release Manager reviews for validation and evidence implications
3. Submit to Founder for approval
4. Founder reviews for Vision and product alignment
5. If approved: Product Architect updates document
6. Document change in decision record if consequential
7. Update Last Updated date

### Authority Level
- Product Architect can: Propose research program updates, maintain research standards, coordinate with Release Manager
- Requires approval for: Changes to research integrity rules, participant protection, or evidence boundaries

---

## 1. Scope

This document defines what the FlowOS research program owns, when research is required, and the responsibility of an individual research record.

It answers:

> How does FlowOS obtain and preserve trustworthy, proportionate evidence about people, context, problems, use, comprehension, and value without treating research as proof of a product decision?

It does not define the product's purpose, choose strategy, decide a roadmap outcome, define a feature, prescribe a metric, approve release, or state that a finding requires a particular action. Those responsibilities remain with the Vision, product and system documents, Roadmap, feature contracts, measurement specifications, delivery and release plans, decision records, and review records.

---

## 2. Research-Program Responsibility

The research program owns the durable method for producing decision-relevant human evidence. It protects a clear separation among:

| Artifact | Owns | Must not become |
|---|---|---|
| Research question | The uncertainty to resolve and why resolving it matters. | An answer the team has already chosen. |
| Protocol | The bounded method, population, prompts, safeguards, and analysis plan. | A feature or product specification. |
| Research record | What was done, observed, said, and materially limited. | A retrospective narrative that conceals disconfirming evidence. |
| Synthesis | A traceable interpretation across research records. | A decision, claim of universal truth, or replacement for underlying records. |
| Decision record | An accountable choice informed by research and other evidence. | A research result. |

Research is warranted when a material product, design, strategic, trust, accessibility, safety, or release question cannot responsibly be answered from existing reliable evidence. The required depth is proportionate to uncertainty, potential harm, reversibility, and the effect on person authority or source boundaries.

Research records are evidence records. They are factual and append-only after closure, except for explicit corrections that retain what changed, why, and who made the correction.

---

## 3. Research Questions and Decision Links

Every research effort starts with one bounded research question. It must name:

1. the uncertainty, affected people or contexts, and decision or contract it could inform;
2. why current evidence is insufficient and what could credibly reduce uncertainty;
3. the intended decision user, the latest useful date, and consequences of an inconclusive result;
4. the smallest suitable method, sample, and evidence threshold; and
5. explicit non-questions that the effort will not answer.

A question may be exploratory, evaluative, generative, or confirmatory. These modes must not be conflated. Exploratory evidence reveals possibilities; evaluative evidence tests a defined proposition or experience; confirmatory work tests a predeclared claim. No mode establishes product direction without accountable judgment recorded elsewhere.

When a research question derives from a roadmap outcome, feature brief, validation plan, delivery plan, release plan, incident, or review, the record links to that parent artifact. The parent remains responsible for its own conclusion or action.

---

## 4. Required Research Record Contents

Each individual record in `09-evidence/research/` must contain:

| Section | Required content |
|---|---|
| Identity and state | Title, owner, created date, status, research mode, and review trigger. |
| Question and decision link | The precise uncertainty, linked parent artifacts, intended decision user, and non-questions. |
| Method and protocol | Method, materials, prompt or task design, sampling rationale, recruitment source, and changes from the approved protocol. |
| Participant and consent boundary | Eligibility, consent basis, incentives where applicable, privacy limits, withdrawal handling, and information not collected. |
| Observations | Traceable factual observations, quotations or artifacts where permitted, and provenance. |
| Analysis | Coding or interpretation method, counterevidence, limitations, and confidence conditions. |
| Findings | Bounded findings differentiated from interpretation, recommendation, and decision. |
| Disposition | Whether the effort is closed, continued, corrected, invalidated, or superseded; links to any synthesis, decision, review, or parent update. |

Sensitive source material, participant identifiers, access credentials, and protected recordings must not be placed in a broadly accessible record. The record instead preserves the necessary provenance, access boundary, retention rule, and de-identified evidence reference.

---

## 5. Participant Protection and Research Integrity

FlowOS research must respect a person's authority, privacy, time, safety, and ability to decline. A participant is never a means to establish a predetermined product claim.

Every protocol must make clear:

- what participation involves, what is collected, and how it may be used;
- how consent, withdrawal, deletion requests, and access restrictions are handled;
- whether research affects the participant's product access, standing, or experience; it must not create a hidden penalty for declining;
- foreseeable risks, accessibility or accommodation needs, and support or escalation paths; and
- who can access raw materials, for how long, and under what retention or deletion rule.

Do not use personal product records, connected-source data, or assistive inferences for research beyond their stated authority. Research access must be the minimum needed, independently auditable, and revocable. De-identification lowers risk but does not erase access or re-identification responsibility.

Research integrity requires preserving negative evidence, contradictions, method deviations, missing context, participant-selection limitations, and analysis uncertainty. Counts, quotes, and anecdotes must not be presented as more general, causal, or certain than the method supports.

---

## 6. Sampling, Method, and Evidence Quality

The program does not prescribe one universal sample size or method. It requires a reasoned fit between question, stakes, population variability, method limitations, and decision consequence.

Selection must identify the relevant context rather than imply that convenience participants represent every person. A study must state recruitment constraints, exclusions, potential bias, attrition, conflicts, and known gaps. Repeated similar observations can support confidence; they never excuse ignoring disconfirming evidence.

Methods may include contextual inquiry, interviews, usability evaluation, diary work, concept research, accessibility research, structured observation, or other bounded approaches. The record names what the method can and cannot establish. Research that produces a metric must also link to a measurement specification; it does not create measurement definitions locally.

No source is automatically authoritative because it is recent, quantified, vivid, senior, or convenient. Evidence quality is assessed through provenance, consent and authority, relevance, method fit, traceability, completeness, and limitations.

---

## 7. Synthesis and Decision Boundaries

A synthesis may combine multiple closed research records only when it names the included records, inclusion criteria, analysis method, material differences, uncertainty, and date range. It must distinguish:

1. direct observation;
2. an interpretation supported by observations;
3. a hypothesis for further testing; and
4. a recommendation or decision owned elsewhere.

Synthesis gives decision makers an intelligible view of evidence; it cannot silently revise an underlying record, replace a feature or system contract, or decide what FlowOS will do. A consequential choice creates or updates a linked decision record. An active parent document changes only through its own change-control process.

When evidence conflicts, preserve the conflict. The next step may be a narrower claim, further research, a reversible experiment, a documented decision under uncertainty, or no change. The program forbids resolving ambiguity by omitting inconvenient evidence.

---

## 8. Lifecycle, Access, and Correction

Research efforts move through **proposed**, **approved**, **in progress**, **closed**, **corrected**, **invalidated**, or **superseded** states. State changes identify owner, date, reason, and affected parent artifacts.

Before work begins, a protocol receives proportionate review for participant protection, authority, privacy, accessibility, safety, and decision relevance. During work, material protocol changes are recorded before or alongside their use. At closure, observations and limitations are preserved, access is narrowed as appropriate, and follow-on work is linked without claiming that it was completed.

Corrections do not erase historical content. A correction names the original record, the incorrect or incomplete element, the evidence for correction, impact on syntheses or decisions, and any required review. Invalidated evidence remains discoverable with its invalidation reason so that teams do not unknowingly rely on it.

---

## 9. Relationship to Adjacent Documents

| Document | Research program owns | Adjacent document owns |
|---|---|---|
| Product Strategy and Roadmap | Method and preservation of evidence relevant to a choice. | Strategic and investment choices. |
| Feature Briefs and Validation Plans | Research question, method, observations, and limitations. | Problem scope, intended behavior, and acceptance criteria. |
| Measurement Specifications | Qualitative or mixed-method research evidence. | Metric meaning, instrumentation, and quantitative measurement rules. |
| Decision Records | Evidence and synthesis links. | Accountable consequential choice and rationale. |
| Review Records | Evidence supplied for assessment. | Assessment findings, disposition, and follow-up. |
| Data, Identity, Integration, and Intelligence Architecture | Research-access requirements that must respect governing controls. | Durable technical access, lifecycle, and protection rules. |

---

## 10. Non-Goals and Change Control

The Research Program does not serve as a user-feedback inbox, raw analytics store, marketing proof, feature backlog, meeting note, product specification, decision log, or retrospective.

This standard changes only when FlowOS changes the enduring definition, evidence integrity requirement, participant-protection rule, lifecycle, or authority boundary for research. A change requires a decision record, impact assessment for active research records and parent documents, and confirmation that factual evidence, interpretation, and accountable choice remain separate.
