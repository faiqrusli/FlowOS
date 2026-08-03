# FlowOS Engineering Lifecycle and SDLC Guide

**Status:** Active  
**Authority:** Canonical practical guide for moving approved FlowOS work from intake through implementation, testing, review, deployment, release, learning, and correction  
**Owner:** Founder  
**Parent:** [Development Handbook](../07-strategy-and-delivery/development-handbook.md) · [Engineering Standards](./engineering-standards.md) · [Quality Architecture](./quality-architecture.md) · [Operations Architecture](./operations-architecture.md) · [MVP Implementation Masterplan](../07-strategy-and-delivery/mvp-implementation-masterplan.md)  
**Children:** Feature delivery designs, implementation plans and runbooks, validation plans and results, review records, release plans, operational runbooks, and post-release learning records  
**Last reviewed:** 2026-08-01  
**Review trigger:** FlowOS changes its engineering lifecycle, team authority, required quality gates, CI/CD controls, deployment model, release process, or operating responsibilities.

---

## 1. Purpose and scope

This is the start-to-finish operational guide for building FlowOS. It tells the Founder, engineers, designers, and AI agents:

- which SDLC FlowOS currently uses;
- how an approved idea becomes working software;
- which document is needed at each stage and who prepares, owns, or approves it;
- how implementation, testing, review, merge, deployment, release, and learning work; and
- when to use the lightweight path versus the full feature-delivery path.

It coordinates existing standards; it does not replace them. Product meaning belongs in product and feature documents. Durable technical rules belong in engineering architecture. Individual validation plans define feature-specific tests. Release plans coordinate a specific release. The Founder remains the final authority for product, architecture, documentation, approval, merge, and release.

---

## 2. Current FlowOS SDLC

FlowOS currently uses a **lightweight, founder-led, evidence-gated, iterative SDLC**.

It is not a heavyweight enterprise waterfall process and it is not an unstructured “just ship code” process. Work advances through clear gates, but the amount of planning and evidence is proportional to risk and scope.

```text
Identify problem or opportunity
  -> Founder frames and admits work
  -> Specify the smallest necessary contract
  -> Design and plan proportionate delivery
  -> Implement on a branch
  -> Test and validate
  -> Submit review package
  -> Founder review and merge approval
  -> CI and deployment
  -> Founder release decision
  -> Observe, learn, repair, and adapt
```

The lifecycle is iterative. A test, review, production signal, or user observation may send work back to design, implementation, validation, or planning. It does **not** allow lower-level implementation work to silently change higher-level product, architecture, documentation, or release decisions.

### 2.1 Current confirmed delivery tooling

| Area | Current implementation | What it does | What it does not decide |
|---|---|---|---|
| Source control | Git and GitHub branches | Keeps work isolated, reviewable, and recoverable | Product, merge, or release approval |
| Primary branch | `main` | Production truth; receives Founder-approved changes only | Whether a feature should be built or released |
| Local quality commands | `npm run lint`, `npm run build`, `npm test` | Check linting, buildability, and the existing Vitest test suite | Product correctness or release readiness by themselves |
| Continuous integration | `.github/workflows/ci.yml` | Runs `npm ci`, `npm run lint`, and `npm run build` on pull requests to and pushes to `main` | Tests, acceptance, Founder approval, or release authorization |
| Application deployment | Vercel, as recorded by the current Git workflow and production URL | Serves the deployed application after approved main-branch changes | A decision to expose, expand, or approve a release |
| Data and authentication | Supabase | Provides the current data/authentication service; its live state is tracked in `supabase/APPLIED_STATE.md` | Product scope, data-access policy, or migration approval |
| Application stack | Next.js, React, TypeScript, ESLint, Vitest | Provides the current application and validation toolchain | The engineering lifecycle or acceptance criteria |

**Current limitation:** CI currently runs lint and build only. The repository has an `npm test` script, but it is not yet part of the checked-in CI workflow. Engineers must run relevant tests locally and report the result until the Founder explicitly changes CI.

---

## 3. Authority and roles

### 3.1 Founder

The Founder owns the decision gates:

- frames problems, outcomes, scope, priority, and MVP admission;
- approves product behavior, design direction, architecture changes, material documentation changes, and release boundaries;
- resolves conflicts and accepts, defers, rejects, narrows, or pauses work;
- gives final approval to merge to `main`; and
- authorizes deployment exposure and release or rollout expansion.

### 3.2 Engineers

Engineers execute approved work. They:

- inspect relevant code and active documents before starting;
- plan and implement the smallest coherent change within approved boundaries;
- write and run proportionate tests and manual checks;
- prepare migrations, recovery steps, and operational evidence when required;
- update implementation and technical documentation affected by the change;
- disclose assumptions, gaps, risks, and limitations; and
- submit a complete review package and address review feedback.

### 3.3 Designers

Designers execute approved design work. They:

- prepare or update feature design, content, responsive, state, and accessibility specifications;
- check implementation fidelity and accessibility for person-visible work;
- collaborate with engineers on feasible implementation; and
- escalate changes to product meaning, scope, navigation, or authority to the Founder.

### 3.4 AI agents

AI agents may research, draft, implement, test, document, and prepare review material under human direction. They must follow active documents, report what they actually checked, preserve scope, and stop for Founder decisions. They may not invent requirements, approve work, merge to `main`, deploy, change production data/access, or authorize release.

### 3.5 Decision-right summary

| Decision or work | Founder | Engineer | Designer | AI agent |
|---|---:|---:|---:|---:|
| Scope, priority, MVP admission | Final decision | Recommends | Recommends | Researches/recommends |
| Product behavior and acceptance criteria | Final decision | Implements | Designs/implements | Assists |
| Routine implementation within approved contracts | Oversight | Owns | Consulted | Assists |
| Durable architecture, data, access, integration, or security change | Final decision | Proposes and implements | Consulted | Assists |
| Testing and factual validation evidence | Accepts at gate | Produces | Produces relevant evidence | Assists |
| Documentation updates | Final authority | Prepares affected technical/implementation updates | Prepares affected design updates | Drafts/updates under review |
| Review disposition, merge, release, rollout | Final decision | Submits evidence | Consulted | Assists |

---

## 4. The end-to-end lifecycle

The following is the default path. Sections 5–13 explain each stage in detail.

| Stage | Goal | Primary executor | Founder gate | Required output |
|---|---|---|---|---|
| 0. Intake and triage | Turn an idea, defect, or observation into a bounded problem | Founder, with contributor input | Admit, defer, reject, or request discovery | Assignment, issue, or concise decision note |
| 1. Scope and contracts | Define what must change and what must not change | Founder; engineer/designer prepare inputs | Approve implementation boundary | Existing or updated feature/design/behavior contract |
| 2. Delivery planning | Decide how to implement safely | Engineer/designer | Approve consequential approach | Delivery design, runbook, and/or delivery plan as required |
| 3. Implementation | Build the approved change | Engineer | Escalate only if scope/architecture changes | Focused branch and commits |
| 4. Testing and validation | Produce evidence that the change meets its contract | Engineer/designer | Decide whether evidence is adequate | Test results, acceptance evidence, known limits |
| 5. Review | Assess completed work against its existing contract | Founder; specialist review input as needed | Approve, conditionally approve, return, defer, reject, or pause | Pull-request review and formal review record when material |
| 6. Merge and deployment | Integrate approved work and verify the deployed artifact | Founder-approved engineer/agent | Approve merge; confirm deployment action | `main` merge, CI result, deployment verification |
| 7. Release | Make approved behavior available to a defined population/context | Founder, with engineering support | Authorize release/rollout | Release plan or concise release note, release record |
| 8. Learn and adapt | Observe reality, repair defects, and decide next work | Engineer/designer gather facts; Founder decides | Decide expansion, repair, deferment, or retirement | Learning, incident, review, and/or decision record |

---

## 5. Stage 0 — Intake and triage

### Purpose

Establish whether a request is a bug, tweak, feature, investigation, documentation correction, operational task, or architecture decision—and whether it is worth doing now.

### Founder responsibilities

The Founder decides:

- the problem or opportunity being addressed;
- priority and relationship to the [Roadmap](../07-strategy-and-delivery/roadmap.md) and [MVP Implementation Masterplan](../07-strategy-and-delivery/mvp-implementation-masterplan.md);
- whether the work is admitted, deferred, rejected, or needs discovery first;
- the desired outcome, owner, boundaries, and acceptance criteria; and
- whether the work is a small correction, normal feature work, or consequential change.

### Employee responsibilities

Employees provide facts, not hidden scope decisions:

- describe the observed problem, reproduction steps, affected scope, user impact, and evidence;
- identify applicable existing documents and implementation areas;
- propose a bounded approach or estimate when asked; and
- raise urgent security, privacy, data-loss, or production-impact issues immediately.

### Intake output

For small work, a concise assignment is enough:

```text
Goal: [desired outcome]
Scope: [included behavior]
Out of scope: [explicit exclusions]
Acceptance criteria: [observable checks]
Parents: [relevant documents/masterplan phase]
Owner: [implementer]
Decision requested: [merge, review, release, etc.]
```

For a new or material feature, begin or update its dossier under `docs/04-features/<feature-name>/` using the [Feature Dossier Standard](../04-features/feature-dossier-standard.md).

---

## 6. Stage 1 — Scope, contracts, and design

### Required questions before material implementation

1. What approved problem is being solved?
2. Who is affected and what outcome must change?
3. What observable behavior, states, permissions, error/recovery paths, and acceptance criteria apply?
4. What is explicitly out of scope?
5. Which MVP Masterplan phase, admitted feature, and gate does this support?
6. Which product, system, experience, design, engineering, data, access, quality, and operations documents constrain the work?

### Minimum documents by work type

| Work type | Minimum input | Add when needed |
|---|---|---|
| Docs-only correction | Source document and clear factual correction | Decision record if it changes document authority or resolves a material conflict |
| Small bug fix or tweak | Existing behavior/design contract or clear bug report | Validation evidence; release note if production-impacting |
| Person-visible feature/improvement | Feature brief, behavior contract, feature design specification, validation plan | Delivery design for material technical risk; delivery plan for cross-functional coordination |
| Data, access, integration, migration, security, privacy, performance, or recovery change | Existing feature/engineering contracts plus delivery design | Decision record, architecture update, release plan, migration/recovery runbook |
| New reusable architecture rule | Concise architecture proposal | Decision record and canonical architecture update |

### Stop and escalate

The implementer must pause and ask the Founder before continuing if the work would:

- change user-visible behavior or acceptance criteria;
- widen product scope, the MVP boundary, population, source access, or automation;
- introduce a durable architecture, data model, access, integration, dependency, security, privacy, or operational change;
- require a migration, irreversible action, or new recovery approach;
- conflict with an active document; or
- exceed the assignment’s scope enough that a new decision is needed.

---

## 7. Stage 2 — Delivery planning and implementation preparation

Planning is proportionate. Do not create a large plan for a one-file bug fix. Do not skip planning when a change affects data, security, recovery, or release risk.

### Implementer checklist

Before coding, the assigned engineer:

1. reads the active parent documents and repository conventions;
2. inspects the current code, tests, dependencies, and relevant production/data state;
3. identifies files, interfaces, data changes, test boundaries, risks, and rollback/repair implications;
4. chooses the smallest approved solution;
5. creates a branch from updated `main`; and
6. prepares the required delivery-design/runbook/validation details before implementation begins.

### Branch and commit rules

The active [Git Workflow](../00-constitution/governance/GIT_WORKFLOW.md) governs repository work:

- all product work starts on a new branch from updated `main`;
- commit and push the branch as appropriate for backup and review;
- never merge or push `main` without explicit Founder approval;
- use a clear branch name such as `tweak/<description>`, `docs/<description>`, or the currently approved milestone pattern; and
- never force-push `main`; use a revert for a code rollback.

### Planning outputs

| Output | Use it when | Prepared by | Approved/accepted by |
|---|---|---|---|
| Delivery design | The change has material technical, data, integration, migration, security, performance, rollout, or recovery implications | Engineer | Founder |
| Implementation runbook | Multiple implementation steps, handoffs, or a repeatable/migration procedure need to be followed | Engineer | Founder for material work |
| Delivery plan | Multiple features, disciplines, dependencies, or material risks must be coordinated | Founder with contributor input | Founder |
| Validation plan | Any feature with a behavior contract before release | Engineer/designer prepare | Founder accepts scope and gate |
| Decision record | A consequential option, standard exception, material risk, or document conflict requires a durable rationale | Founder, with contributor facts | Founder |

---

## 8. Stage 3 — Implementation

### Implementation rules

Engineers and AI agents must:

- implement only approved scope and preserve parent contracts;
- keep the branch and pull request focused;
- follow active repository, TypeScript/React, design, accessibility, and engineering conventions;
- add or update tests with the implementation where they protect material behavior;
- handle errors and recovery paths required by the contract;
- protect data, identity, authorization, privacy, and secrets;
- make migrations reversible where possible, or document containment and repair where reversal is impossible;
- update documentation when implementation changes a durable truth; and
- report a blocker as soon as it needs a Founder decision.

### Work that must not be done silently

Do not silently:

- add a package, provider, API integration, or AI capability with material scope or data implications;
- change schema, row-level security, access permissions, or data-retention behavior;
- change defaults, automation, notifications, navigation meaning, user authority, or release population;
- alter an architecture boundary or create a reusable workaround that future work would inherit; or
- rewrite an active contract to make an unapproved implementation appear correct.

### Daily or session update

For work that is not completed in one short session, the implementer posts a concise update:

```text
Status: on track | blocked | needs decision
Completed: [facts]
Next: [next concrete step]
Risk/blocker: [impact and evidence]
Decision needed from Founder: [if any]
```

---

## 9. Stage 4 — Testing and validation

Testing produces evidence; it is not a ritual or a substitute for Founder acceptance.

### 9.1 Required baseline checks

Before requesting merge approval, the implementer runs and reports the applicable checks:

```powershell
npm run lint
npm run build
npm test
```

If `npm test` has no relevant tests, fails for an existing unrelated reason, or is not applicable to a documentation-only change, state that truthfully in the review package and provide the proportionate alternative evidence. Do not claim a check passed when it was not run.

### 9.2 Test proportionate to risk

| Change type | Minimum validation | Add when relevant |
|---|---|---|
| Docs-only | Link/format/content review | Build/lint if the change affects generated docs or repository tooling |
| Small UI tweak | Lint, build, manual desktop/mobile and keyboard check | Targeted test; screenshot/recording |
| Bug fix | Reproduce before fix where possible; verify fix and regression boundary; lint/build/test | Test that prevents recurrence; production monitoring for live defect |
| Feature | Acceptance criteria, happy path, error/empty/loading/recovery states, relevant automated tests, manual validation | Responsive, accessibility, integration, performance, security, and cross-account checks |
| Data/access/migration/integration | Automated and manual behavior checks, multi-user authorization checks, migration/repair verification | Rollback/repair exercise, degraded dependency behavior, audit/log evidence |
| Release | Linked validation evidence plus release-specific monitoring, containment, and recovery checks | Controlled rollout, support readiness, post-release review |

### 9.3 Quality domains to consider

Use the [Quality Architecture](./quality-architecture.md) and feature [Validation Plans](../04-features/validation-plans.md) to select the applicable domains:

- functional correctness and regression safety;
- usability, responsive behavior, content clarity, and accessibility;
- data integrity, identity, authentication, and authorization;
- security and privacy;
- integration and external-effect behavior;
- performance, reliability, resilience, and recovery;
- observability, operational readiness, and support; and
- user authority, source scope, and truthful product state.

### 9.4 Test evidence

For material features, record the results using the [test-results template](../04-features/_templates/test-results-template.md) and use the [acceptance checklist](../04-features/_templates/acceptance-checklist-template.md) for release readiness. Keep evidence factual: environment, steps, expected result, actual result, evidence links, limitations, failures, and follow-up.

---

## 10. Stage 5 — Documentation updates

Documentation is complete when the authoritative documents explain the new truth without duplicating unrelated authority.

| If this changed | Update or prepare | Primary preparer | Founder role |
|---|---|---|---|
| Product scope, behavior, acceptance, or terminology | Feature brief, behavior contract, product document, or glossary | Engineer/designer drafts facts; Founder owns product decision | Approves the canonical change |
| Visual design, content, interaction, responsive or accessibility behavior | Feature design specification and applicable design standards | Designer, with engineer input | Approves material design/contract change |
| Feature-specific technical approach, migration, rollout, recovery | Delivery design and implementation runbook | Engineer | Approves material approach |
| Reusable technical, data, access, quality, or operations boundary | Applicable engineering architecture/standard | Engineer prepares proposal | Decides and approves canonical update |
| Validation execution | Test results, acceptance checklist, evidence record | Engineer/designer | Accepts evidence at gate |
| Consequential rationale | Decision record | Founder with contributor inputs | Makes/records decision |
| Review finding and disposition | Review record | Reviewer/Founder with factual inputs | Final disposition |
| Deployment/release facts | Release plan/record, operational runbook, release note | Engineer prepares facts | Authorizes and confirms release disposition |
| Post-release observation | Learning, incident, evidence, or review record | Engineer/designer records facts | Decides next action |

Use [Documentation Architecture](../00-constitution/documentation-architecture.md) when ownership is unclear. Preserve historical records: do not silently edit closed decisions, reviews, releases, or learning records.

---

## 11. Stage 6 — Review and Founder approval

### 11.1 Self-review before submission

The implementer confirms:

- scope is complete and unrelated changes are removed or clearly justified;
- code is understandable and follows existing patterns;
- active requirements, design states, and acceptance criteria are met;
- relevant test, lint, and build checks were run and results are recorded;
- documentation is updated or the reason no update is needed is stated;
- known limitations, risks, and follow-up items are visible; and
- the requested decision is clear.

### 11.2 Review package

Submit a pull request or equivalent written review package containing:

```text
Summary: what changed and why
Scope: included and explicitly excluded work
Authority: links to the assignment, feature/design contracts, delivery design, and masterplan phase as applicable
Validation: commands run, automated tests, manual checks, screenshots/recording, and evidence links
Documentation: documents updated or why none changed
Risks and limitations: unresolved items, deferred work, and recovery considerations
Decision requested: approve to merge | approve with follow-up | decision needed | review before release
```

### 11.3 Review outcomes

The Founder gives one explicit disposition:

| Outcome | Meaning | Implementer action |
|---|---|---|
| Approved | Meets the requested gate | Merge or proceed only as authorized |
| Approved with follow-up | Gate may proceed with named non-blocking follow-up | Record owner/condition and continue as directed |
| Changes requested | Blocking gap, risk, or mismatch exists | Correct and resubmit; ask if scope changed |
| Deferred | Valid work, not current priority | Preserve context; do not proceed without re-admission |
| Rejected | Work should not proceed in current form | Stop and follow Founder direction |
| Paused | Evidence, dependency, or safety issue blocks advancement | Preserve branch/context and wait for resolution |

Formal feature, architecture, or release assessments use the [Review Records](../09-reviews/review-records.md) standard and, when helpful, the [review template](../04-features/_templates/review-template.md). A passing CI job, a reviewer recommendation, or a deployed preview is not Founder approval.

---

## 12. Stage 7 — Merge, CI, deployment, and release

### 12.1 Merge to `main`

`main` is production truth. Follow the active [Git Workflow](../00-constitution/governance/GIT_WORKFLOW.md):

1. The implementer completes local checks and submits the review package.
2. The Founder explicitly approves merge.
3. An authorized person merges the branch to `main`.
4. Run the required post-merge checks as the Git Workflow directs.
5. GitHub Actions runs CI on the `main` push.
6. Verify the deployed application at the current production target when a deployment occurs.
7. Record the merge/deployment outcome in the applicable operational or release record.

If a merged change must be reversed, use `git revert` for the merge commit; never force-push `main`. A code revert may not repair data, external effects, or user-visible corrections, so use the relevant repair procedure as well.

### 12.2 Deployment is not release

These are separate actions:

| Term | Meaning |
|---|---|
| **Merge** | Approved code enters `main`. |
| **Deploy** | A built artifact/configuration is applied to an environment. |
| **Release** | Founder-authorized availability of approved behavior to a defined population or context. |
| **Rollout expansion** | Founder-authorized increase in exposure after reviewing evidence. |
| **Rollback** | Revert code/configuration to a previous state where possible. |
| **Repair/correction** | Fix data, access, external effect, or person-visible truth that a rollback alone cannot restore. |

Never treat successful CI, a green Vercel deployment, or a visible route as automatic release authorization.

### 12.3 Release procedure

For changes that meet the threshold in [Release Plans](../07-strategy-and-delivery/release-plans.md)—including material behavior, data, access, automation, security, privacy, migration, reliability, or operational impact—use a release plan.

1. **Prepare release scope.** Link approved contracts, delivery design, validation evidence, owner, population, exclusions, known limits, monitoring, support, stop conditions, and rollback/repair path.
2. **Verify readiness.** Engineer supplies factual evidence; unresolved risks are explicit.
3. **Founder reviews and authorizes.** The Founder decides to release, narrow, delay, repair, or withdraw.
4. **Deploy and verify.** Execute the approved runbook, confirm the deployment, and perform the planned smoke checks/monitoring.
5. **Record release facts.** Preserve what shipped, timing, population, known issues, monitoring, and recovery information in the release record.
6. **Observe and decide next.** Expand, continue monitoring, repair, pause, withdraw, or close only through the planned evidence and Founder decision.

For a low-risk corrective deployment that restores an already released contract without expanding scope or risk, a concise release note may be enough if it names the affected contract, validation, monitoring, and recovery owner.

---

## 13. Stage 8 — Post-release learning, incidents, and correction

After release, collect facts about behavior, quality, user feedback, operational health, and limitations. Do not hide unfavorable evidence to preserve momentum.

### Incident or urgent defect path

1. Report impact to the Founder immediately.
2. Contain harm first: disable exposure, revert, restrict access, repair, or communicate as appropriate.
3. Preserve factual evidence, including scope, timing, affected users/data, and actions taken.
4. Implement and validate the correction on a branch unless emergency procedure requires otherwise.
5. Obtain Founder approval for merge/release action.
6. Record the incident, review, learning, or consequential decision as appropriate.
7. Update the contract, runbook, test boundary, or architecture only if the evidence shows it should change.

### Learning loop

The Founder uses release and post-release evidence to decide whether to:

- continue or expand;
- repair and revalidate;
- simplify or narrow;
- defer or pause;
- withdraw or retire; or
- revise a parent contract, plan, or architecture through the appropriate decision process.

Use [Post-Release Learning Records](../09-reviews/post-release-learning-records.md), [Review Records](../09-reviews/review-records.md), and [Decision Records](../08-decisions/decision-records.md) when their respective thresholds are met.

---

## 14. Paths by change size

### Path A — Documentation-only correction

Use when a factual or clarity correction does not change product, engineering, or documentation authority.

```text
Identify source -> Edit owning document -> Self-review links/accuracy -> Submit -> Founder approval -> Merge
```

### Path B — Small bug fix or tweak

Use when restoring an existing clear contract with no material architecture, data, access, or release-risk change.

```text
Confirm existing contract -> Branch -> Fix -> Reproduce/verify -> lint/build/test -> Update docs if needed -> Founder review -> Merge -> Deploy/verify if applicable
```

### Path C — Normal feature or material improvement

Use for person-visible, admitted feature work.

```text
Founder admission -> Feature brief/behavior/design -> Delivery design if needed -> Validation plan -> Branch/implement -> Test evidence -> Docs -> Founder review -> Merge -> Release plan if threshold met -> Founder release decision -> Learn
```

### Path D — Consequential technical or release change

Use for material data, identity/access, integration, security, privacy, AI, migration, external effect, recovery, or architecture work.

```text
Problem and impact -> Proposal/options -> Founder decision (+ decision record when required) -> Architecture/delivery/recovery docs -> Controlled implementation -> Deep validation -> Formal review -> Founder merge approval -> Release plan -> Founder release authorization -> Monitoring and learning
```

When uncertain, choose the safer path or ask the Founder. Process may be reduced only by an explicit Founder decision, never by omission.

---

## 15. Document map and ownership

| Need | Canonical document | Primary preparer | Final owner/authority |
|---|---|---|---|
| Product direction and immutable boundaries | [Vision](../00-constitution/Vision.md) | Founder | Founder |
| Work sequence, MVP admission, and phase gates | [Roadmap](../07-strategy-and-delivery/roadmap.md) and [MVP Implementation Masterplan](../07-strategy-and-delivery/mvp-implementation-masterplan.md) | Founder, with team evidence | Founder |
| Feature need and scope | [Feature Briefs](../04-features/feature-briefs.md) | Founder or delegated drafter | Founder |
| Observable feature behavior | [Behavior Contracts](../04-features/behavior-contracts.md) | Engineer/designer drafts with Founder direction | Founder |
| Feature visual/interaction/accessibility expression | [Feature Design Specifications](../05-design/feature-design-specifications.md) | Designer | Founder |
| Feature technical approach, data/migration/recovery | [Delivery Designs](../04-features/delivery-designs.md) | Engineer | Founder |
| Multi-discipline coordination | [Delivery Plans](../07-strategy-and-delivery/delivery-plans.md) | Founder with contributor input | Founder |
| Verification method and acceptance evidence | [Validation Plans](../04-features/validation-plans.md) | Engineer/designer | Founder accepts gate use |
| Durable technical rules | Engineering, data, access, integration, quality, and operations architecture | Engineer prepares proposal | Founder |
| Code and repository workflow | [Engineering Standards](./engineering-standards.md), [Git Workflow](../00-constitution/governance/GIT_WORKFLOW.md), and active code standards | Engineer follows/updates technical detail | Founder final authority |
| Consequential choice | [Decision Records](../08-decisions/decision-records.md) | Founder with contributor facts | Founder |
| Assessment and disposition | [Review Records](../09-reviews/review-records.md) | Reviewer with factual evidence | Founder final disposition |
| Availability, rollout, containment, recovery | [Release Plans](../07-strategy-and-delivery/release-plans.md) | Engineer prepares operational facts | Founder authorizes release |
| Live operations | [Operations Architecture](./operations-architecture.md) and runbooks | Engineer | Founder final operational authority |
| Learning after release | [Post-Release Learning Records](../09-reviews/post-release-learning-records.md) | Engineer/designer supplies facts | Founder decides follow-up |
| Documentation location and lifecycle | [Documentation Architecture](../00-constitution/documentation-architecture.md) | All contributors update affected truth | Founder final documentation authority |

---

## 16. Definition of engineering done

Engineering work is ready for Founder review when:

- the approved scope and acceptance criteria are implemented;
- required behavior, state, error, recovery, responsiveness, accessibility, and authority constraints are addressed;
- appropriate lint, build, test, and manual validation evidence is available;
- data, security, privacy, access, integration, reliability, migration, and recovery effects were considered where applicable;
- relevant documentation is updated or an explicit reason is supplied;
- known risks, limitations, and deferred work are visible;
- the branch is focused and reviewable; and
- the review request clearly states the decision needed.

Work is not accepted, merged, or released until the Founder makes the relevant explicit decision.

---

## 17. Practical checklists

### Implementer: before starting

- [ ] I know the goal, owner, scope, exclusions, acceptance criteria, and requested next gate.
- [ ] I read the relevant active documents and MVP Masterplan phase.
- [ ] I understand whether a delivery design, validation plan, decision record, or release plan is required.
- [ ] I created a branch from updated `main`.
- [ ] I raised any product, architecture, data/access, security/privacy, or release ambiguity before building.

### Implementer: before review

- [ ] The approved behavior is complete and unrelated work is excluded.
- [ ] I ran `npm run lint`, `npm run build`, and applicable `npm test` checks, or truthfully recorded why a check was not applicable.
- [ ] I manually verified the relevant user/operational path and regression boundary.
- [ ] I considered accessibility, responsive, loading, empty, error, permission, and recovery states as applicable.
- [ ] I updated affected documentation and evidence records.
- [ ] I documented known limitations and risks.
- [ ] My review package links requirements, implementation, validation, and the requested Founder decision.

### Founder: review and release

- [ ] The work matches the admitted scope and parent contracts.
- [ ] Validation evidence is proportionate and limitations are understood.
- [ ] Material documentation, architecture, data/access, operational, and recovery impacts are addressed.
- [ ] The requested decision is explicit: merge, release, follow-up, pause, defer, or reject.
- [ ] For release, population, monitoring, containment, repair/rollback, communication, and stop conditions are understood.
- [ ] The next action and owner are clear.

---

## 18. Relationship to the MVP Masterplan

The [MVP Implementation Masterplan](../07-strategy-and-delivery/mvp-implementation-masterplan.md) is the current canonical implementation source for the pre-dogfood MVP. This SDLC guide explains **how** assigned work is performed; the masterplan determines **what admitted work comes next**, its dependencies, and the evidence gate required to advance.

Every material assignment and review request should name:

- the relevant masterplan phase and admitted feature;
- the parent feature/design/engineering contracts;
- the evidence or decision gate it contributes to; and
- whether it changes scope, dependencies, or readiness.

Existing code, old runbooks, a route, or a historical plan do not automatically create current MVP scope. If implementation reveals a need to change the MVP boundary, phase order, or gate, bring the evidence to the Founder for a decision and update the owning documents through the established process.