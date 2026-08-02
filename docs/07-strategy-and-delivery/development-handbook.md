# FlowOS Development Handbook

**Status:** Active  
**Authority:** Practical operating handbook for how FlowOS work moves from an approved idea to implemented, reviewed, approved, and released software  
**Owner:** Founder  
**Parent:** [Documentation Architecture](../00-constitution/documentation-architecture.md) · [MVP Implementation Masterplan](./mvp-implementation-masterplan.md) · [Engineering Standards](../06-engineering/engineering-standards.md)  
**Children:** Day-to-day implementation work, delivery plans, feature dossiers, reviews, release plans, and contributor guidance  
**Last reviewed:** 2026-08-01  
**Review trigger:** The team structure, decision rights, implementation lifecycle, or documentation responsibilities materially change.

---

## 1. Purpose and operating model

This handbook explains how FlowOS is built by the Founder, future engineers, future designers, and AI agents.

FlowOS is a startup, not a large enterprise. We use the smallest process that keeps work aligned, reviewable, safe, and easy to continue. A short written decision, a clear assignment, a focused pull request, and a direct review are preferred over meetings, committees, ticket theater, or paperwork for its own sake.

The operating model is simple:

1. The Founder decides what matters, what is in scope, and what is ready to advance.
2. The team turns approved direction into design, code, tests, documentation, and evidence.
3. The Founder reviews the result, approves or returns it, and decides whether it ships.
4. What we learn updates the appropriate living document and informs the next decision.

This handbook coordinates work. It does not replace the [Vision](../strategy/Vision.md), product and feature contracts, architecture documents, the [MVP Implementation Masterplan](./mvp-implementation-masterplan.md), or release plans.

---

## 2. Organization

FlowOS has a founder-led, execution-focused organization.

| Group | Primary purpose |
|---|---|
| **Founder** | Holds the vision and final decision right; directs product, architecture, documentation, approval, and release. |
| **Engineers** | Implement, test, fix, document, and improve approved work. |
| **Designers** | Turn approved product behavior into clear, accessible, coherent interaction and visual design. |
| **AI agents** | Accelerate research, drafting, implementation, testing, review preparation, and documentation under human direction. |

As the team grows, named leads may coordinate work or review their specialty. That does not transfer the Founder’s final authority unless the Founder explicitly delegates a bounded decision in writing.

---

## 3. Roles and responsibilities

### Founder

The Founder is accountable for:

- Vision and product direction;
- product decisions, scope, priorities, and MVP admission;
- planning and sequencing work;
- architecture and consequential technical choices;
- documentation authority and final documentation decisions;
- final review, approval, merge authorization, and release authorization;
- resolving conflicts between documents, people, or proposed approaches; and
- deciding to proceed, pause, reduce scope, defer, reject, repair, or release.

### Engineers

Engineers primarily execute approved work. They are responsible for:

- understanding the assigned scope and its parent documents before building;
- implementing features, fixes, improvements, migrations, and operational work;
- writing and running proportionate automated and manual tests;
- preserving product behavior, security, privacy, accessibility, reliability, and recoverability;
- updating implementation and technical documentation affected by their work;
- identifying uncertainty, risk, conflicts, and out-of-scope discoveries early;
- submitting a clear review package with evidence; and
- addressing approved review feedback.

Engineers may recommend solutions and make routine local implementation choices that fit active contracts. They must not silently change product behavior, durable architecture, release scope, or documentation authority.

### Designers

Designers primarily execute and refine approved product direction. They are responsible for:

- creating or updating feature design specifications and implementation-ready states;
- checking accessibility, content, responsive behavior, empty/loading/error states, and interaction clarity;
- working with engineers to ensure implemented behavior matches approved design;
- updating affected design documentation; and
- escalating any design finding that changes product meaning, scope, navigation, or behavior.

### AI agents

AI agents are implementation assistants, not product owners, approvers, or release authorities. Their responsibilities are defined in [Section 17](#17-ai-responsibilities).

---

## 4. Authority matrix

**A = final accountable authority; R = performs or prepares the work; C = consulted; I = informed.**

| Activity | Founder | Engineer | Designer | AI agent |
|---|---:|---:|---:|---:|
| Vision, strategy, and MVP boundary | A/R | I | I | I |
| Prioritization and feature admission | A/R | C | C | C |
| Product behavior and acceptance criteria | A | R/C | R/C | C |
| Feature visual and interaction design | A | C | R | C |
| Routine implementation approach within approved contracts | A (oversight) | R | C | R (assisted) |
| Durable architecture, data, security, or integration change | A | R/C | C | C |
| Tests, validation evidence, and defect correction | A (accepts) | R | C | R (assisted) |
| Technical and implementation-document updates | A (final authority) | R | C | R (drafting) |
| Product, architecture, or canonical-document updates | A/R | C | C | C |
| Code review findings | A (final disposition) | R/C | C | C |
| Merge to `main` | A | R (submits) | I | I |
| Release and rollout expansion | A/R | R/C | C | C |

The Founder may ask another person to review or coordinate. Review input improves a decision; it does not replace final approval.

---

## 5. Development workflow

The default workflow for any change is:

```text
Idea or problem
  -> Founder decision and scope
  -> Required contracts/design/plan
  -> Assignment
  -> Implement and self-check
  -> Update affected documentation
  -> Submit review package
  -> Founder review and disposition
  -> Founder approval to merge
  -> Release decision when applicable
  -> Learn, correct, and update the next plan
```

Use the smallest version of this workflow that safely fits the change:

- **Small, low-risk correction:** clear existing contract, focused code change, tests or manual evidence, concise documentation update if behavior or operation changed, Founder review and merge approval.
- **Feature or material improvement:** approved feature scope, design and delivery artifacts as required, implementation, validation, review, Founder approval.
- **High-risk or consequential change:** add a delivery design, explicit validation and recovery plan, decision record where required, and a release plan before exposure expands.

Do not begin material work from a vague request. First establish the problem, owner, scope, parent contract, acceptance criteria, and what is explicitly out of scope. If any of these are missing, ask the Founder rather than guessing.

---

## 6. Feature workflow

1. **Founder frames the outcome.** State the user/problem, desired outcome, scope, priority, constraints, and MVP relationship.
2. **Confirm admission.** Check the [Feature Catalog](../04-features/feature-catalog.md) and [MVP Implementation Masterplan](./mvp-implementation-masterplan.md). A previously planned route or idea is not automatically admitted work.
3. **Create or update the minimum feature dossier.** Use the canonical [feature templates](../04-features/_templates/README.md): feature brief, behavior contract, design specification, delivery design, validation plan, and acceptance checklist as the risk requires.
4. **Founder approves implementation start.** Engineers and designers may refine feasibility, but ambiguity that changes behavior, scope, or architecture returns to the Founder.
5. **Implement in a focused branch.** Keep the change bounded. Add tests and manual checks for the approved acceptance criteria and regression boundary.
6. **Update documentation and prepare evidence.** Update the affected living documents; create new reviewable records rather than rewriting historical review, release, or decision records.
7. **Submit for review.** Include what changed, links to requirements, evidence, known limits, documentation updates, and the requested decision.
8. **Founder reviews and decides.** Approve, approve with follow-up, request changes, reduce scope, defer, or reject.
9. **Merge and release only with Founder approval.** A merged feature is not automatically a released feature. Use a release plan if the change meets its threshold.

---

## 7. Bug workflow

1. **Capture the bug clearly:** expected behavior, actual behavior, reproduction steps, affected user/data scope, environment, severity, and supporting evidence.
2. **Triage with the Founder:** determine urgency, affected contract, owner, and whether the safe response is repair, rollback, disablement, communication, or investigation.
3. **Contain first when needed:** protect people, data, security, privacy, or service before pursuing a complete fix.
4. **Reproduce and identify the smallest safe fix.** Do not expand into unrelated refactoring without approval.
5. **Implement and validate:** verify the fix, the original reproduction, and the relevant regression boundary.
6. **Update documentation:** update the source contract only if it was unclear or wrong; update runbooks, known limitations, validation evidence, or technical docs when affected.
7. **Submit the repair for Founder review.** State severity, cause or current hypothesis, fix, verification, residual risk, and rollback/repair path.
8. **Record material learning.** A consequential incident, risk acceptance, or durable correction may require a review or decision record. Do not rewrite history to make a defect disappear.

For a production-impacting issue, communicate immediately to the Founder. Do not wait for a polished diagnosis before reporting known impact and the first safe containment option.

---

## 8. Documentation workflow

Documentation is part of implementation, not cleanup after implementation.

1. Find the canonical document family using the [Documentation Architecture](../00-constitution/documentation-architecture.md) and `docs/README.md`.
2. Update the document that owns the changed rule, behavior, design, implementation detail, plan, or record. Link to adjacent documents instead of copying their content.
3. Keep living documents current. Preserve decisions, reviews, releases, evidence, and learning as append-only historical records; correct or supersede them with linked records when needed.
4. Use required metadata for new durable documents.
5. Include documentation changes in the same review package as the implementation whenever practical.
6. Ask the Founder when ownership is unclear, a document conflicts with another active document, or the change alters documentation structure or authority.

Documentation should be as small as possible while allowing the next person—or AI agent—to understand what is true, why it matters, and where to continue.

---

## 9. Architecture change workflow

An architecture change is any change to a durable boundary, reusable technical rule, data model/access rule, integration, security or privacy control, operational/recovery model, or cross-feature pattern.

1. **Stop before implementing the durable change.** Routine local refactoring inside an approved design may proceed; a durable boundary change requires explicit Founder review first.
2. **Prepare a concise proposal:** problem, affected scope, current constraint, options, recommendation, tradeoffs, migration/rollback or repair path, testing, documentation impacts, and MVP impact.
3. **Create a decision record when consequential.** Follow [Decision Records](../08-decisions/decision-records.md) for material alternatives, risk, standards exceptions, or cross-document impact.
4. **Founder decides.** The Founder may approve, request a narrower alternative, defer, or reject the proposal.
5. **Update the owning architecture and delivery documents.** Do this before or alongside implementation so code is not the only source of the new rule.
6. **Implement, validate, and review.** Include migration, compatibility, security, performance, observability, and recovery evidence appropriate to the change.

No convenience-driven implementation change creates authority to redefine FlowOS architecture or product behavior.

---

## 10. Review process

Reviews answer: **Did this bounded work meet its existing contract, and what decision is requested?** They are not a venue to silently redefine scope.

### Submitter checklist

Every review request should contain:

- a one-paragraph summary and exact scope;
- links to the approved parent documents and acceptance criteria;
- changed files and documentation updates;
- tests and manual validation performed, with results;
- known limitations, risks, follow-up work, and out-of-scope discoveries;
- screenshots, recordings, or reproduction steps for person-visible changes where useful; and
- the requested decision: approve to merge, approve with follow-up, decide a question, or review before release.

### Reviewer behavior

- Review against approved contracts, not personal preference alone.
- Identify concrete gaps, risks, or conflicts early.
- Keep feedback actionable and proportionate to impact.
- Return changed requirements to the Founder rather than asking implementers to infer a new product decision.
- Use a formal review record for material feature, architecture, release, or outcome gates; use a concise pull-request review for routine bounded changes.

The canonical standard for durable review records is [Review Records](../10-reviews/review-records.md).

---

## 11. Approval process

Only the Founder grants final approval for product, architecture, documentation, merge, and release decisions.

### Approval states

| State | Meaning |
|---|---|
| **Approved** | Work meets its current scope and may take the requested next step. |
| **Approved with follow-up** | The requested next step may proceed; named non-blocking work has an owner and due condition. |
| **Changes requested** | Work is not ready; the reviewer identifies the blocking gap or question. |
| **Deferred** | Work is valid but not currently prioritized or admitted. |
| **Rejected** | Work should not proceed in its current form. |
| **Paused** | Work stops pending evidence, a decision, dependency, or safety condition. |

Approval must be explicit and traceable in the pull request, issue, review record, release record, or written Founder instruction. Silence, a passing build, or a deployment is not approval.

No one merges to `main` or expands a release without Founder approval. Follow the repository’s [contributor guidance](../../CONTRIBUTING.md) and Git workflow.

---

## 12. Definition of done

A change is done only when it is ready for its requested gate—not merely when code compiles.

Unless the Founder explicitly narrows the scope, implementation is done when:

- the approved acceptance criteria and in-scope behavior are implemented;
- relevant loading, empty, error, permission, responsive, and accessibility states are considered for person-visible work;
- proportionate automated tests and manual checks pass, including the affected regression boundary;
- security, privacy, data integrity, reliability, and recovery implications are addressed where applicable;
- the change is focused, maintainable, and consistent with active engineering and design standards;
- affected implementation, design, feature, operational, and/or canonical documentation is updated;
- known limitations, deferred work, and risks are disclosed rather than hidden;
- the review package contains enough evidence for the Founder to decide; and
- the Founder explicitly approves the requested next step.

For release readiness, also meet the applicable [Release Plans](./release-plans.md), validation, monitoring, containment, communication, and recovery requirements. Release remains a separate Founder decision.

---

## 13. Documentation ownership

Each document has one accountable owner, but contributors who change the underlying truth are responsible for proposing the update. Ownership does not mean one person must type every edit; it means one person has final authority for accuracy and scope.

| Document family | Accountable owner | Primary contributors |
|---|---|---|
| Vision, product strategy, roadmap, MVP masterplan | Founder | Engineers, designers, AI agents supply evidence and proposals |
| Product model, feature scope, behavior contracts | Founder | Engineers and designers draft or update implementation-relevant detail |
| Design system and feature design specifications | Founder | Designers prepare; engineers validate feasibility and implementation fidelity |
| Engineering architecture and standards | Founder | Engineers prepare proposals, implement updates, and provide evidence |
| Delivery and release plans | Founder | Engineers and designers provide estimates, readiness, risks, and operating detail |
| Validation, test results, and implementation evidence | Founder accepts; implementing role owns accuracy | Engineers; designers for design validation; AI may assist drafting |
| Decision, review, release, and learning records | Founder owns final disposition | The person closest to the work drafts factual inputs |
| Repository contributor and operational guidance | Founder | Engineers maintain current technical and workflow detail |

---

## 14. Who updates which documents

| Change made | Person who prepares the update | Founder action |
|---|---|---|
| Feature behavior implemented or clarified | Assigned engineer and/or designer | Reviews and approves changes to the behavior contract or related product document |
| Feature UI, copy, interaction, or accessibility changes | Designer, with engineer input | Reviews and approves design-spec updates |
| Code, dependency, schema, API, migration, configuration, or runbook changes | Assigned engineer | Reviews material technical-document updates and approves merge/release |
| Reusable architecture boundary changes | Assigned engineer drafts proposal and architecture update | Makes final decision and approves the canonical update |
| Test/validation result | Person who performed the work records factual result | Accepts evidence at the relevant gate |
| Scope, priority, roadmap, MVP boundary, or product decision | Founder | Updates directly or directs the update |
| Review, approval, release, or learning disposition | Founder, using contributor-provided facts | Records or confirms final disposition |

When a change affects several families, update each owner’s document rather than creating a duplicate summary. For example: a new interaction updates the design specification; a new reusable client pattern updates client architecture; the feature’s delivery design explains the feature-specific implementation; test results remain validation evidence.

---

## 15. When documentation must be updated

Update documentation when any of the following become true:

- product behavior, acceptance criteria, scope, terminology, or user authority changes;
- visual, interaction, content, accessibility, responsive, or state behavior changes;
- a reusable technical boundary, data model, access rule, integration, dependency, migration, configuration, or recovery procedure changes;
- tests, validation coverage, known limitations, operational monitoring, or support instructions change;
- an approved decision, review finding, release condition, or post-release learning changes what the team must do next;
- implementation exposes ambiguity, conflict, or an obsolete statement in an active document; or
- a new contributor would otherwise need to rediscover an important rule from source code or chat history.

Do **not** update a living contract merely to make it match an unapproved implementation. Escalate the mismatch. The Founder decides whether code changes, the contract changes, or the work is stopped.

---

## 16. Communication flow

Use direct, written, scope-specific communication.

| Situation | Communication path | Expected outcome |
|---|---|---|
| New idea, product question, scope conflict, or priority question | Contributor -> Founder | Founder decision, clarification, deferment, or rejection |
| Routine implementation progress | Contributor -> assigned work thread/issue/PR | Concise status, current blocker, next step |
| Design/engineering handoff | Designer <-> engineer, with Founder copied when scope changes | Shared understanding of approved behavior and feasible implementation |
| Bug or production concern | Contributor -> Founder immediately | Impact known, containment decision, repair owner |
| Architecture, security, privacy, data, or release risk | Contributor -> Founder before implementation or exposure | Explicit decision and recorded path where needed |
| Review request | Submitter -> Founder | Clear requested approval and evidence |
| User feedback or evidence | Contributor -> Founder with source and interpretation separated | Decision about follow-up, not automatic scope change |

Raise blockers early. A blocker report should state: what is blocked, why, what was checked, options if known, recommendation if any, and the decision needed. Do not hide uncertainty behind a broad implementation attempt.

---

## 17. Example: a new developer implements one feature

**Scenario:** The Founder assigns a new developer a bounded improvement to an admitted MVP feature.

1. The Founder shares the problem, outcome, acceptance criteria, boundaries, relevant masterplan phase, and links to the feature brief, behavior contract, design specification, and validation plan.
2. The developer reads those documents, the [MVP Implementation Masterplan](./mvp-implementation-masterplan.md), applicable engineering standards, and repository contributor guidance. They confirm what is already implemented and list open questions.
3. The developer asks the Founder about any ambiguity that could change behavior, priority, data handling, architecture, or release scope. The Founder resolves it or narrows the assignment.
4. The developer creates a focused branch from current `main`, makes the smallest coherent implementation, and follows approved design and engineering patterns.
5. During implementation, the developer finds that the desired behavior would require a new durable data-access pattern. They pause that part, send a concise proposal to the Founder, and do not introduce the pattern by assumption.
6. The Founder either approves the bounded architecture change, chooses an alternative, or reduces the feature scope. If approved and consequential, the developer drafts the required decision and architecture/document updates.
7. The developer adds or updates tests, performs the validation-plan checks, and manually verifies the user path and relevant error/recovery states.
8. The developer updates affected implementation documentation, delivery design/runbook, validation evidence, and feature/design references as required. They do not edit a closed decision or review record; they link a new correction or successor record if needed.
9. The developer opens a review with a concise summary, document links, screenshots if useful, validation results, known limitations, and a request for approval to merge.
10. The Founder reviews against the approved contracts. The Founder requests changes for a gap in one empty state; the developer fixes it and updates the relevant validation evidence.
11. The Founder explicitly approves the pull request. The change is merged to `main` only under that approval.
12. If the feature will be exposed outside controlled development, the Founder reviews the release readiness and authorizes release under the applicable release plan. Otherwise, the completed work waits for the planned release gate.

The developer executed the work end to end. The Founder retained final authority at each decision and release boundary.

---

## 18. AI responsibilities

AI agents may be used to accelerate execution. They must work from active documents and repository evidence, disclose uncertainty, and leave work reviewable by humans.

### AI agents should

- read the relevant active contracts, standards, and implementation context before changing code;
- implement bounded assigned work, tests, documentation drafts, refactors, research summaries, and review preparation;
- follow repository conventions and preserve existing work outside the requested scope;
- identify assumptions, conflicts, missing acceptance criteria, security/privacy concerns, and out-of-scope implications;
- update implementation documentation when the assigned change makes it necessary;
- provide a concise summary of files changed, validation run, remaining risks, and decisions needed; and
- stop and escalate when a request requires a product, architecture, documentation-authority, approval, or release decision.

### AI agents must not

- invent product requirements, acceptance criteria, or user-facing behavior when the governing contract is unclear;
- make final product, architecture, documentation, merge, approval, or release decisions;
- merge to `main`, deploy, broaden release exposure, or alter production data/access without explicit Founder authorization and an approved procedure;
- silently change active specifications to justify code;
- claim validation, user research, test results, or external facts that were not actually performed or verified; or
- expose secrets, credentials, private user data, or proprietary context beyond the approved working environment.

AI output is a proposal or implementation contribution. A human remains accountable for reviewing its correctness and its impact on FlowOS.

---

## 19. Development principles

1. **Founder-led, evidence-informed.** The Founder decides; evidence and specialist input improve the decision.
2. **Build the smallest trustworthy next step.** Prefer a coherent MVP slice over breadth, speculative abstraction, or polish without product value.
3. **Contracts before assumptions.** Implement approved behavior; escalate ambiguity instead of guessing.
4. **Execution over ceremony.** Use documents and process only when they make a decision, handoff, implementation, validation, or recovery clearer.
5. **Make work visible.** Scope, decisions, risks, tests, known limitations, and follow-up work must be discoverable.
6. **Protect user authority and trust.** Convenience never justifies weakening consent, control, privacy, security, accessibility, or truthful recovery.
7. **Learn without rewriting history.** Preserve what was decided, observed, reviewed, and released; correct with linked records.
8. **Prefer reversible progress.** When uncertainty is high, choose bounded, observable, recoverable steps.

---

## 20. Software engineering principles

1. **Traceability:** Every material change links back to an approved problem, contract, or repair need.
2. **Small, coherent changes:** Keep branches and pull requests focused; avoid drive-by refactors.
3. **Correctness before cleverness:** Favor simple, readable, maintainable code that matches the contract.
4. **Test the behavior that matters:** Use automated tests where they protect regression risk; manually validate user-visible and operational paths.
5. **Secure and private by design:** Apply least privilege, validate boundaries, protect data, and do not add access or automation casually.
6. **Accessible by default:** Treat accessibility as part of behavior and quality, not a final polish pass.
7. **Operate what you build:** Consider logging, monitoring, failure handling, migration, repair, rollback, and support before release.
8. **Document durable knowledge:** Code alone is not sufficient for meaningful behavior, architecture, operations, or decisions.
9. **No hidden debt:** Name the risk, owner, consequence, and intended disposition of technical debt; do not use it to bypass required quality.
10. **Stop on consequential uncertainty:** Escalate product, architectural, security, privacy, data, and release decisions to the Founder.

---

## 21. SDLC used by FlowOS

FlowOS uses a lightweight, founder-led, evidence-gated SDLC with short implementation cycles:

```text
Discover / identify problem
  -> Founder decides and scopes
  -> Specify the minimum necessary contract
  -> Design and plan proportionate delivery
  -> Build
  -> Validate
  -> Review
  -> Founder approval
  -> Merge and release when authorized
  -> Observe, learn, and adapt
```

This is iterative, not waterfall. A discovery, validation, review, or release signal may return work to an earlier stage. However, lower-stage work does not silently override higher-stage authority: implementation evidence can reveal a problem, but the Founder decides the resulting product, architecture, documentation, and release change.

The complete operational procedure—including required documents, roles, testing, review, CI, deployment, release, and learning—is in the [Engineering Lifecycle and SDLC Guide](../06-engineering/engineering-lifecycle-and-sdlc.md). For a complete feature dossier lifecycle, use the [feature dossier lifecycle guide](../start-here/complete-feature-dossier-lifecycle.md). Apply process proportionately: small fixes stay small; material or irreversible changes receive the planning, validation, decision, and release rigor they require.

---

## 22. How implementation connects to the MVP Masterplan

The [MVP Implementation Masterplan](./mvp-implementation-masterplan.md) is the current canonical implementation source for the pre-dogfood MVP. It determines the admitted MVP boundary, implementation order, dependencies, and evidence gates.

Every implementation assignment must be traceable to the masterplan:

1. **Find the phase and admitted feature.** Verify that the work belongs to an active masterplan phase and an admitted feature disposition.
2. **Read upward before building.** Follow the authority path: Vision -> product/system/experience -> feature contract and design -> engineering/delivery -> masterplan phase and validation/release requirements.
3. **State the connection in the assignment or PR.** Name the masterplan phase, feature, required gate, and parent documents.
4. **Implement only the admitted slice.** Existing code, routes, placeholders, older runbooks, or historical plans do not expand current scope.
5. **Produce gate evidence.** Code is one input. Validation results, documentation, reviews, and release readiness show whether the phase can advance.
6. **Escalate scope or sequence changes.** If work reveals a need to add, remove, reorder, or materially alter MVP scope, bring evidence to the Founder. The Founder decides whether the masterplan, contracts, or implementation should change.

In short: the masterplan says **what validated work comes next and what must be true to advance**. Feature, design, and engineering documents say **what to build and how to preserve quality**. Engineers, designers, and AI agents execute that approved work. The Founder decides when it is correct, complete, and ready for the next gate.