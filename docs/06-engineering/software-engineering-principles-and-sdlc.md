# FlowOS Software Engineering Principles & SDLC

**Status:** Active  
**Authority:** Comprehensive guide to FlowOS engineering principles, SDLC workflow, roles, responsibilities, and processes  
**Owner:** Founder  
**Parent:** [Documentation Architecture](../00-constitution/documentation-architecture.md) · [Engineering Architecture](./engineering-architecture.md) · [Development Handbook](../07-strategy-and-delivery/development-handbook.md)  
**Children:** Engineering Standards, Quality Gates, Implementation Procedures, Review Records, Release Plans  
**Last reviewed:** 2026-08-02  
**Review trigger:** Changes to engineering principles, SDLC stages, role definitions, quality gates, or development processes.

---

## Table of Contents

1. [Purpose and Scope](#1-purpose-and-scope)
2. [FlowOS Engineering Principles](#2-flowos-engineering-principles)
3. [Current SDLC Model](#3-current-sdlc-model)
4. [Roles and Responsibilities](#4-roles-and-responsibilities)
5. [SDLC Stages in Detail](#5-sdlc-stages-in-detail)
6. [Quality Gates and Checkpoints](#6-quality-gates-and-checkpoints)
7. [Development Workflows](#7-development-workflows)
8. [Testing and Quality Assurance](#8-testing-and-quality-assurance)
9. [Review and Approval Process](#9-review-and-approval-process)
10. [Deployment and Release](#10-deployment-and-release)
11. [Documentation Requirements](#11-documentation-requirements)
12. [Related Documentation Map](#12-related-documentation-map)

---

## 1. Purpose and Scope

### What This Document Covers

This document is the comprehensive reference for **how FlowOS is built**. It consolidates engineering principles, the Software Development Lifecycle (SDLC), role definitions, quality gates, testing strategies, review processes, and deployment procedures into one authoritative source.

Use this document to understand:

- **What principles guide engineering decisions** at FlowOS
- **What SDLC FlowOS uses** and why
- **Who is responsible for what** in the development process
- **How work flows** from idea to production
- **What quality gates** must be passed before release
- **How to implement, test, review, and deploy** different types of changes

### What This Document Does NOT Cover

- **Product strategy and vision** → See [Vision](../strategy/Vision.md) and [Product Model](../01-product/product-model.md)
- **Specific feature requirements** → See [Feature Catalog](../04-features/feature-catalog.md) and feature dossiers
- **Design specifications** → See [Design System Architecture](../05-design/design-system-architecture.md)
- **Code style conventions** → See [CODE_STANDARDS.md](../foundation/governance/CODE_STANDARDS.md)
- **Current implementation details** → See [TECHNICAL_ARCHITECTURE.md](../foundation/TECHNICAL_ARCHITECTURE.md)

### How to Use This Document

**If you are...**

- **A new engineer:** Read sections 2-4 first, then 5-10 as you work
- **Implementing a feature:** Follow section 7 (Development Workflows)
- **Reviewing code:** Use sections 8-9 (Testing and Review)
- **Deploying changes:** Follow section 10 (Deployment and Release)
- **The Founder:** This is your decision framework reference

---

## 2. FlowOS Engineering Principles

These principles guide all engineering decisions at FlowOS. When in doubt, return to these.

### Core Principles

#### 1. **User-Visible Loop Value Beats Internal Perfection**

- Favor changes that improve the daily execution loop over internal refactoring
- **Exception:** Security and data integrity are never deferred for features
- Build the smallest trustworthy next step, not the most elegant abstraction

#### 2. **Founder-Led, Evidence-Informed**

- The Founder makes final decisions on product, architecture, documentation, and release
- Engineers and designers provide evidence and recommendations
- Evidence improves decisions; it doesn't replace human judgment

#### 3. **Contracts Before Assumptions**

- Implement approved behavior defined in behavior contracts
- Escalate ambiguity instead of guessing what should be built
- No implementation shortcut creates authority to change product meaning

#### 4. **Execution Over Ceremony**

- Use documents and process only when they make decisions, handoffs, or recovery clearer
- Small fixes stay small; material changes get proportionate planning
- Prefer direct written communication over meetings

#### 5. **Traceability and Accountability**

- Every material change links back to an approved contract or repair need
- Scope, decisions, risks, tests, and limitations must be discoverable
- Preserve historical records; correct with linked records, never rewrite

#### 6. **Small, Coherent Changes**

- Keep branches and pull requests focused
- Avoid drive-by refactors unrelated to the current scope
- Complete one thing well before starting another

#### 7. **Protect User Authority and Trust**

- Convenience never justifies weakening consent, control, privacy, or security
- Accessibility is part of behavior and quality, not optional polish
- Preserve the ability for users to understand, control, and recover

#### 8. **Test What Matters**

- Use automated tests where they protect regression risk
- Manually validate user-visible and operational paths
- A passing build is necessary evidence, not proof of correctness

#### 9. **Secure and Private by Design**

- Apply least privilege by default
- Validate boundaries and protect data
- Do not add access or automation casually

#### 10. **Stop on Consequential Uncertainty**

- Escalate product, architectural, security, privacy, data, and release decisions
- Do not implement durable changes without explicit Founder approval
- Raise blockers early with options and recommendations

### Engineering Quality Standards

#### Correctness Before Cleverness

- Favor simple, readable, maintainable code that matches the contract
- Code should be understandable by the next person (or AI agent)
- Clarity and correctness over performance optimization unless performance is the requirement

#### Operate What You Build

- Consider logging, monitoring, failure handling, migration, and repair before release
- Include rollback/recovery paths in delivery designs
- Support the feature in production, not just build it

#### No Hidden Debt

- Name the risk, owner, consequence, and intended disposition of technical debt
- Do not use debt as an excuse to bypass required quality
- Record debt items; don't let them become an informal backlog

#### Accessible by Default

- Treat accessibility as part of behavior, not a final pass
- No hover-only critical controls
- Test with keyboard navigation and screen readers where applicable

---

## 3. Current SDLC Model

### Overview

FlowOS uses a **lightweight, founder-led, evidence-gated, iterative SDLC**.

It is:
- **Lightweight:** Process is proportionate to risk and scope
- **Founder-led:** The Founder holds final decision authority at gates
- **Evidence-gated:** Work advances based on verification, not assumptions
- **Iterative:** Feedback loops return work to earlier stages when needed

It is NOT:
- A heavyweight enterprise waterfall process
- An unstructured "just ship code" approach
- A committee-based approval system

### The FlowOS SDLC Stages

```text
┌─────────────────────────────────────────────────────────────────┐
│                    FLOWOS SDLC LIFECYCLE                        │
└─────────────────────────────────────────────────────────────────┘

1. INTAKE & TRIAGE
   ├─ Idea, bug, or observation
   ├─ Founder frames problem and scope
   └─ Decision: Admit / Defer / Reject / Investigate
         │
         ▼
2. SCOPE & CONTRACTS
   ├─ Define what must change and what must not
   ├─ Create/update: Feature Brief, Behavior Contract, Design Spec
   └─ Founder approves implementation boundary
         │
         ▼
3. DELIVERY PLANNING
   ├─ Decide how to implement safely
   ├─ Create: Delivery Design, Validation Plan, Runbook (if needed)
   └─ Founder approves consequential approach
         │
         ▼
4. IMPLEMENTATION
   ├─ Build the approved change on a focused branch
   ├─ Follow engineering standards and design contracts
   └─ Update affected documentation
         │
         ▼
5. TESTING & VALIDATION
   ├─ Run: lint, build, test, manual checks
   ├─ Verify acceptance criteria and regression boundaries
   └─ Produce test evidence and known limitations
         │
         ▼
6. REVIEW
   ├─ Submit review package with evidence
   ├─ Founder/reviewer assesses against contracts
   └─ Disposition: Approve / Changes Requested / Defer / Reject
         │
         ▼
7. MERGE & DEPLOYMENT
   ├─ Founder explicitly approves merge to main
   ├─ CI runs (lint, build, currently not tests in CI)
   └─ Verify deployed artifact
         │
         ▼
8. RELEASE DECISION
   ├─ Founder reviews release readiness
   ├─ Authorizes exposure to defined population
   └─ Deployment ≠ Release (separate decisions)
         │
         ▼
9. OBSERVE & LEARN
   ├─ Monitor behavior, quality, feedback, operations
   ├─ Repair defects, record incidents, update contracts
   └─ Decide: Expand / Repair / Defer / Retire

                  Iterative feedback loops
         ◄──────────────────────────────────────────
```

### Iterative Nature

- **Discovery in implementation** may return work to Scope & Contracts
- **Failed validation** may return to Implementation
- **Review findings** may change scope or return to earlier stages
- **Production issues** trigger the incident path and may require contract updates
- **Lower stages cannot silently override higher authority**

### Process Proportionality

The amount of ceremony scales with risk and scope:

| Change Type | Process Level |
|-------------|---------------|
| Documentation fix | Minimal: Edit → Self-review → Founder approval → Merge |
| Small bug fix | Light: Confirm contract → Fix → Test → Review → Merge |
| New feature | Full: All stages with complete dossier |
| Architecture change | Full + Decision Record + Deep review |
| Data/security change | Full + Delivery Design + Recovery plan |

---


## 4. Roles and Responsibilities

### 4.1 Role Definitions

FlowOS has a founder-led, execution-focused organization with four role types:

#### Founder

**Primary Accountability:** Vision, product direction, and final decision authority

**Responsibilities:**
- Holds Vision and product direction
- Decides product scope, priorities, and MVP admission
- Approves behavior contracts, design direction, and architecture changes
- Gives final approval to merge to `main`
- Authorizes deployment exposure and release/rollout expansion
- Resolves conflicts between documents, people, or approaches
- Decides to proceed, pause, reduce, defer, reject, repair, or release

**Does NOT:**
- Write all code or documentation personally (delegates execution)
- Need to attend meetings (prefers written communication)
- Approve silently (all approvals must be explicit and traceable)

#### Engineers

**Primary Accountability:** Execute approved technical work safely

**Responsibilities:**
- Understand assigned scope and parent documents before starting
- Implement features, fixes, improvements, migrations, operational work
- Write and run proportionate automated and manual tests
- Preserve product behavior, security, privacy, accessibility, reliability
- Update implementation and technical documentation
- Identify uncertainty, risk, conflicts, and out-of-scope discoveries early
- Submit complete review packages with evidence
- Address approved review feedback

**May:**
- Recommend solutions and make routine implementation choices within contracts
- Draft technical documentation updates
- Propose architecture changes with clear rationale

**Must NOT:**
- Silently change product behavior or acceptance criteria
- Make durable architecture changes without Founder approval
- Alter documentation authority or release scope
- Merge to `main` without explicit Founder approval

#### Designers

**Primary Accountability:** Execute approved design work

**Responsibilities:**
- Prepare/update feature design specifications, content, responsive, state, accessibility specs
- Check implementation fidelity and accessibility for person-visible work
- Collaborate with engineers on feasible implementation
- Update affected design documentation

**Must Escalate:**
- Changes to product meaning, scope, navigation, or behavior
- Design findings that would alter approved contracts

#### AI Agents

**Primary Accountability:** Accelerate execution under human direction

**May:**
- Research, draft, implement, test, document, prepare review materials
- Follow active documents and report what was checked
- Identify assumptions, conflicts, risks, and out-of-scope implications

**Must NOT:**
- Invent requirements or acceptance criteria when contracts are unclear
- Make final product, architecture, documentation, merge, approval, or release decisions
- Merge to `main`, deploy, or alter production data/access without authorization
- Claim validation or facts that were not actually verified
- Expose secrets, credentials, or private user data

---

### 4.2 Authority Matrix (RACI)

**A** = Accountable (final decision)  
**R** = Responsible (does the work)  
**C** = Consulted (input requested)  
**I** = Informed (kept updated)

| Activity | Founder | Engineer | Designer | AI Agent |
|----------|:-------:|:--------:|:--------:|:--------:|
| **Vision and Strategy** |
| Vision and product direction | A/R | I | I | I |
| Prioritization and feature admission | A/R | C | C | C |
| MVP boundary decisions | A/R | C | C | C |
| Roadmap sequencing | A/R | C | C | C |
| **Product Definition** |
| Product behavior and acceptance criteria | A | R/C | R/C | C |
| Feature scope and contracts | A | R/C | R/C | C |
| Product terminology and glossary | A | C | C | C |
| **Design** |
| Feature visual and interaction design | A | C | R | C |
| Design system updates | A | C | R | C |
| Accessibility standards | A | C | R | C |
| Content and copy | A | C | R | C |
| **Engineering** |
| Routine implementation (within contracts) | A (oversight) | R | C | R (assist) |
| Technical approach selection | A (oversight) | R | C | C |
| Code standards and conventions | A | R | I | C |
| **Architecture** |
| Durable architecture changes | A | R/C | C | C |
| Data model and schema changes | A | R/C | C | C |
| Security and access control design | A | R/C | C | C |
| Integration architecture | A | R/C | C | C |
| **Quality** |
| Test strategy and validation plans | A (accepts) | R | R (design) | R (assist) |
| Automated and manual testing | A (accepts) | R | C | R (assist) |
| Defect correction | A (oversight) | R | C | R (assist) |
| Quality gate pass/fail decisions | A | R (evidence) | R (evidence) | C |
| **Documentation** |
| Documentation architecture and authority | A/R | C | C | C |
| Product and feature documentation | A | R/C | R/C | R (draft) |
| Technical documentation | A (authority) | R | C | R (draft) |
| Design documentation | A (authority) | C | R | R (draft) |
| Implementation references | A (authority) | R | C | R (draft) |
| **Review and Approval** |
| Code review findings | A (final) | R/C | C | C |
| Design review findings | A (final) | C | R/C | C |
| Architecture review | A | R/C | C | C |
| Pull request approval | A | R (submits) | I | I |
| **Release** |
| Merge to main authorization | A | R (executes) | I | I |
| Deployment execution | A (oversight) | R | I | I |
| Release authorization | A/R | R/C | C | C |
| Rollout expansion decisions | A | R/C | C | C |
| **Operations** |
| Production monitoring | A (oversight) | R | I | I |
| Incident response | A (critical) | R | C | C |
| Backup and recovery | A (oversight) | R | I | I |
| Support access | A (authorizes) | R | I | I |

---

### 4.3 Decision Rights Summary

| Decision Category | Who Decides | Who Provides Input |
|-------------------|-------------|-------------------|
| **Should we build this?** | Founder | Engineers, Designers, Users |
| **What should it do?** | Founder | Engineers, Designers |
| **How should it look?** | Founder (approves design) | Designer (proposes), Engineer (feasibility) |
| **How should we build it?** | Engineer (routine), Founder (consequential) | Designer (constraints) |
| **Is it ready to merge?** | Founder | Engineer (evidence), Designer (fidelity) |
| **Should we release it?** | Founder | Engineer (readiness), Users (feedback) |
| **What should we do next?** | Founder | Team (evidence and recommendations) |

---

### 4.4 Communication Flow

#### When to Communicate What to Whom

| Situation | From | To | Expected Outcome |
|-----------|------|----|--------------------|
| New idea or product question | Contributor | Founder | Decision: Admit / Defer / Reject / Clarify |
| Scope conflict or ambiguity | Contributor | Founder | Clarification or scope adjustment |
| Routine implementation progress | Contributor | Work thread/PR | Status visibility |
| Implementation blocker | Contributor | Founder immediately | Decision or unblocking action |
| Design/engineering handoff | Designer | Engineer (Founder copied if scope changes) | Shared understanding |
| Bug or production concern | Contributor | Founder immediately | Impact known, containment, repair plan |
| Architecture/security/data risk | Contributor | Founder before implementation | Explicit decision, possibly decision record |
| Review request | Submitter | Founder | Approval with clear disposition |
| User feedback or evidence | Contributor | Founder with facts separated from interpretation | Decision about follow-up |

#### Blocker Report Format

When blocked, report:
- **What is blocked:** Specific scope affected
- **Why:** Root cause or constraint
- **What was checked:** Evidence of the blocker
- **Options (if known):** Alternative approaches
- **Recommendation (if any):** Proposed path forward
- **Decision needed:** What specific decision would unblock

#### Communication Principles

1. **Direct and written:** Prefer written, scope-specific communication
2. **Concise but complete:** Include enough context for decision-making
3. **Separate facts from interpretation:** State what you observed vs. what you conclude
4. **Early escalation:** Raise blockers before they become crises
5. **Explicit requests:** State clearly what decision or action you need

---


## 5. SDLC Stages in Detail

### 5.1 Stage 0: Intake and Triage

**Goal:** Turn an idea, defect, or observation into a bounded problem with a decision.

#### Founder Responsibilities

- Determine if this is a bug, tweak, feature, investigation, docs correction, operational task, or architecture decision
- Decide priority and relationship to Roadmap and MVP Implementation Masterplan
- Admit, defer, reject, or request discovery
- Define desired outcome, owner, boundaries, acceptance criteria
- Classify as small correction, normal feature, or consequential change

#### Contributor Responsibilities

- Describe observed problem, reproduction steps, affected scope, user impact, evidence
- Identify applicable existing documents and implementation areas
- Propose bounded approach or estimate when asked
- Raise urgent security, privacy, data-loss, or production-impact issues immediately

#### Outputs

For small work:
```text
Goal: [desired outcome]
Scope: [included behavior]
Out of scope: [explicit exclusions]
Acceptance criteria: [observable checks]
Parents: [relevant documents/masterplan phase]
Owner: [implementer]
Decision requested: [merge, review, release, etc.]
```

For material features:
- Begin or update feature dossier under `docs/04-features/<feature-name>/`
- Use [Feature Dossier Standard](../04-features/feature-dossier-standard.md)

#### Examples

**Example 1: Bug Report**
```
Title: Tasks disappear after page refresh
Type: Bug
Severity: P1 (data loss)
Reproduction: Create task → Refresh page → Task is gone
Expected: Task persists
Actual: Task disappears
Affected users: All users
Environment: Production
Owner: [Assigned engineer]
```

**Example 2: Feature Request**
```
Title: Add keyboard shortcut for inline task capture
Type: Feature improvement
Priority: M2 (founder daily driver)
Outcome: Founder can capture tasks without leaving current context
Scope: Keyboard shortcut activates inline capture on Today
Out of scope: Command palette, global shortcuts
Parent: M2 Founder Daily Driver runbook
Owner: [Assigned engineer]
```

---

### 5.2 Stage 1: Scope and Contracts

**Goal:** Define what must change and what must not change before implementation begins.

#### Required Questions Before Material Implementation

1. What approved problem is being solved?
2. Who is affected and what outcome must change?
3. What observable behavior, states, permissions, error/recovery paths, and acceptance criteria apply?
4. What is explicitly out of scope?
5. Which MVP Masterplan phase, admitted feature, and gate does this support?
6. Which product, system, experience, design, engineering, data, access, quality, and operations documents constrain the work?

#### Minimum Documents by Work Type

| Work Type | Minimum Input | Add When Needed |
|-----------|---------------|-----------------|
| Docs-only correction | Source document + clear factual correction | Decision record if authority changes |
| Small bug fix or tweak | Existing behavior/design contract or clear bug report | Validation evidence; release note if production-impacting |
| Person-visible feature | Feature brief + behavior contract + design spec + validation plan | Delivery design for technical risk; delivery plan for coordination |
| Data/access/integration change | Existing contracts + delivery design | Decision record, architecture update, release plan, recovery runbook |
| New reusable architecture | Concise architecture proposal | Decision record and canonical architecture update |

#### Stop and Escalate If...

Pause and ask Founder before continuing if the work would:
- Change user-visible behavior or acceptance criteria
- Widen product scope, MVP boundary, population, source access, or automation
- Introduce durable architecture, data model, access, integration, dependency, security, privacy, or operational change
- Require migration, irreversible action, or new recovery approach
- Conflict with an active document
- Exceed assignment scope enough that a new decision is needed

#### Contract Templates

Use these templates from `docs/04-features/_templates/`:
- `feature-brief-template.md` — Why build it?
- `behavior-contract-template.md` — What must it do?
- Feature design from `docs/05-design/` — How should it look/behave?
- `validation-plan-template.md` — How will we test it?

---

### 5.3 Stage 2: Delivery Planning

**Goal:** Decide how to implement safely with proportionate planning.

#### Planning Is Proportionate

- **Do not** create large plan for one-file bug fix
- **Do** plan when change affects data, security, recovery, or release risk

#### Implementer Checklist Before Coding

1. ✅ Read active parent documents and repository conventions
2. ✅ Inspect current code, tests, dependencies, relevant production/data state
3. ✅ Identify files, interfaces, data changes, test boundaries, risks, rollback/repair implications
4. ✅ Choose smallest approved solution
5. ✅ Create branch from updated `main`
6. ✅ Prepare required delivery-design/runbook/validation details

#### Branch and Commit Rules

Follow [Git Workflow](../foundation/governance/GIT_WORKFLOW.md):
- All product work starts on new branch from updated `main`
- Use clear branch name: `tweak/<description>`, `docs/<description>`, or milestone pattern
- Commit and push branch as appropriate for backup and review
- **Never merge or push `main` without explicit Founder approval**
- **Never force-push `main`** — use revert for code rollback

#### Planning Outputs

| Output | Use When | Prepared By | Approved By |
|--------|----------|-------------|-------------|
| **Delivery Design** | Material technical, data, integration, migration, security, performance, rollout, or recovery implications | Engineer | Founder |
| **Implementation Runbook** | Multiple steps, handoffs, or repeatable/migration procedure | Engineer | Founder for material work |
| **Delivery Plan** | Multiple features, disciplines, dependencies, or material risks to coordinate | Founder with contributor input | Founder |
| **Validation Plan** | Any feature with behavior contract before release | Engineer/designer | Founder accepts scope |
| **Decision Record** | Consequential option, standards exception, material risk, or document conflict | Founder with contributor facts | Founder |

#### Templates

- `docs/04-features/_templates/delivery-design-template.md`
- `docs/04-features/_templates/runbook-template.md`
- `docs/07-strategy-and-delivery/plans/delivery-plan-template.md`
- `docs/04-features/_templates/validation-plan-template.md`
- `docs/08-decisions/records/decision-record-template.md`

---

### 5.4 Stage 3: Implementation

**Goal:** Build the approved change on a focused branch.

#### Implementation Rules

Engineers and AI agents must:

✅ **DO:**
- Implement only approved scope and preserve parent contracts
- Keep branch and pull request focused
- Follow active TypeScript/React, design, accessibility, engineering conventions
- Add or update tests with implementation where they protect material behavior
- Handle errors and recovery paths required by contract
- Protect data, identity, authorization, privacy, and secrets
- Make migrations reversible where possible, or document containment and repair
- Update documentation when implementation changes durable truth
- Report blocker as soon as it needs Founder decision

❌ **DO NOT Silently:**
- Add package, provider, API integration, or AI capability with material scope/data implications
- Change schema, RLS, access permissions, or data-retention behavior
- Change defaults, automation, notifications, navigation meaning, user authority, or release population
- Alter architecture boundary or create reusable workaround that future work would inherit
- Rewrite active contract to make unapproved implementation appear correct

#### Daily/Session Update (for multi-session work)

```text
Status: [on track | blocked | needs decision]
Completed: [facts about what is done]
Next: [next concrete step]
Risk/blocker: [impact and evidence]
Decision needed from Founder: [if any]
```

#### Implementation Checklist

Before requesting review:
- [ ] Approved behavior is complete
- [ ] Unrelated changes are removed or clearly justified
- [ ] Code is understandable and follows existing patterns
- [ ] Lint, build, and applicable tests pass
- [ ] Loading, empty, error, recovery states considered for person-visible work
- [ ] Security, privacy, data integrity addressed where applicable
- [ ] Affected documentation updated
- [ ] Known limitations and risks disclosed
- [ ] Branch is focused and reviewable

---

### 5.5 Stage 4: Testing and Validation

**Goal:** Produce evidence that change meets its contract.

#### Required Baseline Checks

Before requesting merge approval, run and report:

```powershell
npm run lint
npm run build
npm test
```

**If no relevant tests exist or fail for unrelated reasons:** State that truthfully and provide proportionate alternative evidence.

**Do not claim a check passed when it was not run.**

#### Test Proportionate to Risk

| Change Type | Minimum Validation | Add When Relevant |
|-------------|-------------------|-------------------|
| Docs-only | Link/format/content review | Build/lint if affects generated docs |
| Small UI tweak | Lint, build, manual desktop/mobile/keyboard check | Targeted test; screenshot/recording |
| Bug fix | Reproduce before fix; verify fix and regression boundary; lint/build/test | Test that prevents recurrence; production monitoring for live defect |
| Feature | Acceptance criteria, happy path, error/empty/loading/recovery states, relevant automated tests, manual validation | Responsive, accessibility, integration, performance, security, cross-account checks |
| Data/access/migration | Automated and manual behavior checks, multi-user authorization checks, migration/repair verification | Rollback/repair exercise, degraded dependency behavior, audit/log evidence |
| Release | Linked validation evidence + release-specific monitoring, containment, recovery checks | Controlled rollout, support readiness, post-release review |

#### Quality Domains to Consider

From [Quality Architecture](./quality-architecture.md):
- ✅ Functional correctness and regression safety
- ✅ Usability, responsive behavior, content clarity, accessibility
- ✅ Data integrity, identity, authentication, authorization
- ✅ Security and privacy
- ✅ Integration and external-effect behavior
- ✅ Performance, reliability, resilience, recovery
- ✅ Observability, operational readiness, support
- ✅ User authority, source scope, truthful product state

#### Test Evidence

For material features, use:
- `docs/04-features/_templates/test-results-template.md` — Record actual results
- `docs/04-features/_templates/acceptance-checklist-template.md` — Release readiness

**Keep evidence factual:**
- Environment where tested
- Steps performed
- Expected result
- Actual result
- Evidence links (screenshots, recordings, logs)
- Limitations and known failures
- Follow-up items

---

### 5.6 Stage 5: Documentation Updates

**Goal:** Ensure authoritative documents explain the new truth.

#### What to Update

| If This Changed | Update/Prepare | Primary Preparer | Founder Role |
|-----------------|----------------|------------------|--------------|
| Product scope, behavior, acceptance, terminology | Feature brief, behavior contract, product doc, glossary | Engineer/designer drafts | Approves canonical change |
| Visual design, content, interaction, responsive, accessibility | Feature design spec, design standards | Designer with engineer input | Approves material design/contract change |
| Feature-specific technical approach, migration, rollout, recovery | Delivery design, implementation runbook | Engineer | Approves material approach |
| Reusable technical, data, access, quality, operations boundary | Applicable engineering architecture/standard | Engineer proposal | Decides and approves canonical update |
| Validation execution | Test results, acceptance checklist, evidence record | Person who performed work | Accepts evidence at gate |
| Consequential rationale | Decision record | Founder with contributor inputs | Makes/records decision |
| Review finding and disposition | Review record | Reviewer/Founder with factual inputs | Final disposition |
| Deployment/release facts | Release plan/record, operational runbook, release note | Engineer prepares facts | Authorizes and confirms release |
| Post-release observation | Learning, incident, evidence, or review record | Engineer/designer records facts | Decides next action |

#### When to Update Documentation

Update when:
- Product behavior, acceptance criteria, scope, terminology, or user authority changes
- Visual, interaction, content, accessibility, responsive, or state behavior changes
- Reusable boundary, data model, access rule, integration, dependency, migration, configuration, or recovery procedure changes
- Tests, validation coverage, known limitations, operational monitoring, or support instructions change
- Approved decision, review finding, release condition, or post-release learning changes what team must do next
- Implementation exposes ambiguity, conflict, or obsolete statement in active document
- New contributor would need to rediscover important rule from code or chat history

#### Do NOT

- Update living contract merely to make it match unapproved implementation
- Rewrite historical decisions, reviews, releases, or learning records
- Duplicate authority from other documents (link instead)

---


## 6. Quality Gates and Checkpoints

### 6.1 Gate Matrix

Quality gates ensure changes meet minimum standards before advancing.

| Gate | Required When | Pass Criteria | Enforced By |
|------|---------------|---------------|-------------|
| **Product** | User-facing change | Passes [PRINCIPLES.md](../foundation/governance/PRINCIPLES.md) feature test | Founder review |
| **UX** | Workflow, nav, routing, capture | Reduces clicks/switches; improves daily loop | Founder + Designer review |
| **Architecture** | Routes, data model, lib boundaries | Matches [TECHNICAL_ARCHITECTURE.md](../foundation/TECHNICAL_ARCHITECTURE.md) | Founder + Engineer review |
| **Accessibility** | Interactive controls | No hover-only critical controls; keyboard accessible | Designer + Engineer validation |
| **Performance** | Large lists, new fetches | No obvious regression from baseline | Engineer testing |
| **Security** | Auth, RLS, middleware | User-scoped data; no auth bypass | Engineer verification + Founder review |
| **Deployment** | Shipped to hosted env | Build green; production verified | CI + manual verification |
| **Documentation** | Behavior changes | FEATURE_INVENTORY + Decision Record if consequential | Submitter + Founder review |

### 6.2 Minimum Gates per Change Type

| Change Type | Gates Required |
|-------------|----------------|
| Bug fix (internal) | Deployment |
| Security fix | Security, Deployment, Documentation |
| M2 UX feature | Product, UX, Architecture, Security, Deployment, Documentation |
| Refactor (no behavior change) | Architecture, Deployment |
| New module | **All gates** + alpha gate before admission |

### 6.3 Security Gate Details

**Checklist:**
- [ ] Route protected in middleware if authenticated content
- [ ] Supabase queries scoped to `auth.uid()`
- [ ] RLS policies verified for new tables
- [ ] No secrets in client bundle
- [ ] No `using (true)` on user data tables
- [ ] Authorization checks for data access
- [ ] Input validation on boundaries

**Security is never deferred for features.**

### 6.4 Deployment Gate Details

**Checklist:**
- [ ] `npm run build` passes locally
- [ ] `npm run lint` has no new errors in touched files
- [ ] Manual smoke test: login → primary flow → logout
- [ ] Hosted deploy tested on production URL
- [ ] No console errors in primary path
- [ ] Responsive behavior checked on desktop and mobile widths

### 6.5 Documentation Gate Details

**Checklist:**
- [ ] [FEATURE_INVENTORY.md](../foundation/FEATURE_INVENTORY.md) updated if user-visible
- [ ] Behavior contract updated if acceptance criteria changed
- [ ] Design spec updated if visual/interaction changed
- [ ] Technical docs updated if implementation pattern changed
- [ ] [Decision Record](../08-decisions/decision-records.md) created for consequential choices
- [ ] Migration runbook created if data model changed

---

## 7. Development Workflows

### 7.1 Workflow by Change Type

#### Path A: Documentation-Only Correction

**Use when:** Factual or clarity correction doesn't change product, engineering, or documentation authority.

```text
Identify source 
  → Edit owning document 
  → Self-review links/accuracy 
  → Submit PR 
  → Founder approval 
  → Merge
```

**Example:** Fix typo in FEATURE_INVENTORY, update broken link in README

---

#### Path B: Small Bug Fix or Tweak

**Use when:** Restoring existing clear contract with no material architecture, data, access, or release-risk change.

```text
Confirm existing contract 
  → Branch 
  → Fix 
  → Reproduce/verify 
  → lint/build/test 
  → Update docs if needed 
  → Founder review 
  → Merge 
  → Deploy/verify if applicable
```

**Example:** Fix button style inconsistency, correct null check in task deletion

**Checklist:**
- [ ] Existing behavior contract identifies the correct behavior
- [ ] Branch created from latest `main`
- [ ] Fix implements contract behavior
- [ ] Bug is reproduced (before fix) and verified fixed
- [ ] Regression boundary tested (related features still work)
- [ ] `npm run lint` and `npm run build` pass
- [ ] Relevant manual tests performed
- [ ] Documentation updated if behavior or error handling changed
- [ ] PR submitted with clear description and test evidence
- [ ] Founder approval obtained
- [ ] Merge to `main` and deployment verified

---

#### Path C: Normal Feature or Material Improvement

**Use when:** Person-visible, admitted feature work.

```text
Founder admission 
  → Feature brief/behavior/design 
  → Delivery design if needed 
  → Validation plan 
  → Branch/implement 
  → Test evidence 
  → Docs 
  → Founder review 
  → Merge 
  → Release plan if threshold met 
  → Founder release decision 
  → Learn
```

**Example:** Add keyboard shortcut for inline capture, implement Next Up queue

**Checklist:**
- [ ] Feature admitted in [MVP Implementation Masterplan](../07-strategy-and-delivery/mvp-implementation-masterplan.md)
- [ ] Feature brief created or updated (why build this?)
- [ ] Behavior contract specifies acceptance criteria
- [ ] Feature design specification exists (visual/interaction)
- [ ] Validation plan defines test approach
- [ ] Delivery design created if technical risk is material
- [ ] Branch created and implementation follows contracts
- [ ] All acceptance criteria met
- [ ] Loading, empty, error, recovery states implemented
- [ ] Responsive behavior verified
- [ ] Keyboard navigation and accessibility verified
- [ ] Automated tests added/updated
- [ ] Manual validation performed per validation plan
- [ ] Test results recorded
- [ ] Documentation updated (feature, design, technical)
- [ ] Review package submitted with evidence
- [ ] Founder approval obtained
- [ ] Merge to `main` and deployment verified
- [ ] Release plan created if threshold met (see [Release Plans](../07-strategy-and-delivery/release-plans.md))
- [ ] Founder authorizes release
- [ ] Post-release monitoring and learning

---

#### Path D: Consequential Technical or Release Change

**Use when:** Material data, identity/access, integration, security, privacy, AI, migration, external effect, recovery, or architecture work.

```text
Problem and impact 
  → Proposal/options 
  → Founder decision (+ decision record when required) 
  → Architecture/delivery/recovery docs 
  → Controlled implementation 
  → Deep validation 
  → Formal review 
  → Founder merge approval 
  → Release plan 
  → Founder release authorization 
  → Monitoring and learning
```

**Example:** Add row-level security to new table, change authentication provider, introduce data migration

**Checklist:**
- [ ] Problem and impact clearly documented
- [ ] Options identified with tradeoffs
- [ ] Founder decision obtained
- [ ] Decision record created if consequential
- [ ] Architecture documentation updated
- [ ] Delivery design includes recovery/rollback plan
- [ ] Migration runbook created if data changes
- [ ] Security review performed
- [ ] Privacy impact assessed
- [ ] Multi-account testing if access control changed
- [ ] Rollback procedure tested in non-prod
- [ ] Monitoring and alerting defined
- [ ] Formal review record created
- [ ] Founder approval for merge
- [ ] Release plan created with containment strategy
- [ ] Founder authorization for release
- [ ] Post-release monitoring active
- [ ] Incident response plan ready

---

### 7.2 Feature Workflow Example (End-to-End)

**Scenario:** Implement inline task capture with keyboard shortcut on Today page

#### Step 1: Intake and Admission (Stage 0)
```
Title: Inline task capture on Today
Type: Feature
Priority: M2 Founder Daily Driver
Outcome: Founder can capture tasks without modal/navigation
Parent: M2 Founder Daily Driver runbook
Status: Admitted to MVP
Owner: [Engineer name]
```

#### Step 2: Contracts and Design (Stage 1)
- **Feature Brief:** `docs/04-features/inline-capture/feature-brief.md`
  - Problem: Current capture requires modal or navigation away
  - Outcome: Founder stays in context, captures immediately
  - User value: Faster capture, no interruption to flow
  
- **Behavior Contract:** `docs/04-features/inline-capture/behavior-contract.md`
  - Pressing `N` activates inline input at top of Today task list
  - Enter key saves task to Today
  - Escape key cancels
  - Task appears immediately in list
  - Input clears after save
  
- **Design Spec:** `docs/05-design/feature-design-specifications.md` (inline-capture section)
  - Visual appearance of input field
  - States: inactive, active, saving, error
  - Keyboard interaction pattern
  - Mobile behavior (show keyboard, position input)

#### Step 3: Planning (Stage 2)
- **Validation Plan:** `docs/04-features/inline-capture/validation-plan.md`
  - Desktop keyboard flow
  - Mobile touch flow
  - Concurrent with existing capture methods
  - Error handling (network failure)
  - Accessibility (screen reader announces input)

#### Step 4: Implementation (Stage 3)
```bash
git checkout main
git pull
git checkout -b feature/inline-capture-today

# Implement:
# - Add keyboard listener to Today component
# - Create inline input component
# - Wire to task creation mutation
# - Handle states and errors
# - Update responsive layout
# - Add keyboard navigation

npm run lint
npm run build
git add .
git commit -m "feat: inline task capture on Today with keyboard shortcut"
git push origin feature/inline-capture-today
```

#### Step 5: Testing (Stage 4)
**Automated:**
- Unit tests for keyboard handler
- Integration test for task creation flow

**Manual:**
- ✅ Press `N` → input appears
- ✅ Type task → Enter → task appears in list
- ✅ Type task → Escape → input clears, no task created
- ✅ Network error → error message shown
- ✅ Mobile: tap input → keyboard appears → save works
- ✅ Screen reader: announces input activation
- ✅ Existing capture methods still work

**Record results in:** `docs/04-features/inline-capture/test-results.md`

#### Step 6: Documentation (Stage 5)
- Updated `FEATURE_INVENTORY.md` — inline capture status
- Updated behavior contract with final acceptance criteria
- Updated design spec with implemented states
- Created test results record

#### Step 7: Review (Stage 6)
**Pull Request:**
```markdown
## Summary
Implements inline task capture on Today with keyboard shortcut (N key)

## Scope
- Keyboard shortcut activation
- Inline input component
- Task creation integration
- Error handling
- Mobile responsive behavior

## Authority
- Parent: M2 Founder Daily Driver runbook
- Behavior contract: docs/04-features/inline-capture/behavior-contract.md
- Design spec: docs/05-design/feature-design-specifications.md#inline-capture

## Validation
- Automated tests: Pass (see test-results.md)
- Manual checks: All acceptance criteria verified
- Accessibility: Screen reader tested
- Responsive: Desktop and mobile verified

## Documentation
- Updated: FEATURE_INVENTORY.md, behavior contract, design spec
- Created: test-results.md

## Risks and Limitations
- Keyboard shortcut may conflict with browser shortcuts (documented)
- Mobile behavior requires soft keyboard interaction (tested)

## Decision Requested
Approve to merge → production
```

**Founder reviews against contracts, approves**

#### Step 8: Merge and Deploy (Stage 7)
```bash
# Founder approves PR
# Engineer merges
git checkout main
git pull
git merge feature/inline-capture-today
git push

# CI runs (lint, build)
# Vercel deploys
# Verify on production: https://flowos-sage.vercel.app
```

#### Step 9: Release and Learn (Stage 8)
- **Release:** Behavior immediately available (no feature flag needed)
- **Monitor:** Check for errors in production logs
- **Observe:** Founder uses feature daily, logs friction if any
- **Learn:** Record in post-release learning if insights emerge

---

### 7.3 Bug Workflow Example

**Scenario:** Tasks disappear after page refresh

#### Step 1: Report
```
Title: Tasks disappear after page refresh
Type: Bug
Severity: P1 (data loss)
Reproduction:
  1. Create task "Test task"
  2. Refresh page
  3. Task is gone
Expected: Task persists
Actual: Task disappears
Affected: All users
Environment: Production
```

#### Step 2: Triage
- Founder confirms P1 severity
- Assigns to engineer
- Classification: Data persistence issue

#### Step 3: Investigation
```typescript
// Found: Task creation not awaiting database insert
const createTask = async (title: string) => {
  supabase.from('tasks').insert({ title })  // Missing await!
  router.refresh()  // Runs before insert completes
}
```

#### Step 4: Fix
```typescript
const createTask = async (title: string) => {
  await supabase.from('tasks').insert({ title })  // Fixed
  router.refresh()
}
```

#### Step 5: Verify
- ✅ Reproduce original bug (confirmed)
- ✅ Apply fix
- ✅ Verify fix: task persists after refresh
- ✅ Regression test: all task operations still work
- ✅ Add test to prevent recurrence

#### Step 6: Submit
```markdown
## Bug Fix: Tasks persist after page refresh

**Root cause:** Task creation not awaiting database insert

**Fix:** Added await to insert operation

**Verification:**
- Reproduced original bug
- Verified fix resolves issue
- Tested regression boundary (all task CRUD operations)
- Added integration test

**Documentation:** None needed (restores contract behavior)

**Decision requested:** Approve to merge → production (urgent P1 fix)
```

#### Step 7: Deploy
- Founder approves immediately (P1)
- Merge to main
- Verify in production
- Monitor for related issues

---


## 8. Testing and Quality Assurance

### 8.1 Testing Philosophy

**Testing produces evidence; it is not a ritual or substitute for Founder acceptance.**

- Tests protect against regression and verify contracts
- Passing tests are necessary but not sufficient for approval
- Manual validation complements automated tests
- Evidence must be factual and traceable

### 8.2 Test Types and When to Use

| Test Type | Purpose | When to Use | Example |
|-----------|---------|-------------|---------|
| **Unit Tests** | Verify isolated logic | Pure functions, utilities, state management | Task date calculation, validation rules |
| **Integration Tests** | Verify component interactions | API calls, database operations, auth flow | Task CRUD with Supabase |
| **Component Tests** | Verify UI behavior | Interactive components | Button clicks, form submission |
| **Manual Tests** | Verify user experience | Complex flows, accessibility, responsive | Complete focus session flow |
| **Regression Tests** | Prevent known bugs | After bug fixes | Prevent task disappearance bug |
| **Accessibility Tests** | Verify inclusive design | Interactive features | Screen reader, keyboard navigation |
| **Performance Tests** | Verify acceptable speed | Large datasets, complex operations | Task list with 1000 items |
| **Security Tests** | Verify access control | Authentication, authorization, data access | Multi-account RLS verification |

### 8.3 Testing Standards by Feature Type

#### Small UI Tweak
- ✅ Lint and build pass
- ✅ Visual inspection (desktop + mobile)
- ✅ Keyboard navigation
- ✅ Screenshot/recording if helpful

#### Bug Fix
- ✅ Reproduce bug before fix
- ✅ Verify fix resolves issue
- ✅ Test regression boundary (related features)
- ✅ Add test to prevent recurrence (if feasible)

#### New Feature
- ✅ All acceptance criteria verified
- ✅ Happy path works
- ✅ Error states handled
- ✅ Empty states handled
- ✅ Loading states handled
- ✅ Recovery/retry works
- ✅ Responsive (desktop + mobile)
- ✅ Keyboard accessible
- ✅ Automated tests for core logic
- ✅ Manual validation of user flow

#### Data/Schema Change
- ✅ Migration runs successfully
- ✅ Data integrity verified
- ✅ Rollback tested (if reversible)
- ✅ Multi-account testing if access control affected
- ✅ Backup verified before production
- ✅ Monitoring in place

### 8.4 Test Environment Setup

#### Local Development
```bash
# Run full test suite
npm test

# Run specific test file
npm test -- task.test.ts

# Run in watch mode
npm test -- --watch

# Run with coverage
npm test -- --coverage
```

#### Test Data
- Use fixtures and factories for consistent test data
- Do not use production data in tests
- Clean up test data after tests complete
- Use descriptive test data (not "Test 1", "Test 2")

### 8.5 Test Documentation

#### In Code
```typescript
// Good test description
describe('Task creation', () => {
  it('creates task with title and adds to today list', async () => {
    // Arrange
    const title = 'New task'
    
    // Act
    const task = await createTask({ title, listId: 'today' })
    
    // Assert
    expect(task.title).toBe(title)
    expect(task.list_id).toBe('today')
    expect(task.created_at).toBeDefined()
  })
  
  it('validates required title field', async () => {
    await expect(createTask({ title: '' }))
      .rejects
      .toThrow('Title is required')
  })
})
```

#### In Test Results Record
Use `docs/04-features/_templates/test-results-template.md`:
- Environment details
- Test cases executed
- Expected vs actual results
- Evidence (screenshots, logs)
- Pass/fail status
- Known limitations
- Follow-up items

---

## 9. Review and Approval Process

### 9.1 Self-Review Before Submission

**Before opening a pull request, confirm:**

- [ ] Scope is complete and focused
- [ ] Unrelated changes are removed or justified
- [ ] Code is understandable and follows patterns
- [ ] Active requirements and acceptance criteria are met
- [ ] Lint, build, and relevant tests pass
- [ ] Documentation is updated
- [ ] Known limitations and risks are visible
- [ ] Requested decision is clear

### 9.2 Review Package Contents

Every pull request or review submission must contain:

```markdown
## Summary
[One paragraph: what changed and why]

## Scope
**Included:** [What is in scope]
**Excluded:** [What is explicitly out of scope]

## Authority
- Assignment/Issue: [Link]
- Feature brief: [Link if applicable]
- Behavior contract: [Link]
- Design specification: [Link if applicable]
- MVP Masterplan phase: [Phase and work item]

## Validation
### Automated Tests
- Unit tests: [Pass/Fail + details]
- Integration tests: [Pass/Fail + details]
- Lint: [Pass/Fail]
- Build: [Pass/Fail]

### Manual Checks
- [Checklist of manual tests performed]
- [Screenshots/recordings if helpful]
- [Evidence links]

## Documentation
**Updated:**
- [List of documents updated]

**Created:**
- [List of new documents]

**No update needed because:**
- [Justification if no docs changed]

## Risks and Limitations
**Known limitations:**
- [List any known gaps]

**Unresolved risks:**
- [List any risks that need Founder decision]

**Follow-up items:**
- [Items deferred with owner and tracking]

## Decision Requested
[Approve to merge | Approve with follow-up | Decision needed on X | Review before release]
```

### 9.3 Review Outcomes

The Founder gives one explicit disposition:

| Outcome | Meaning | Implementer Action |
|---------|---------|-------------------|
| **Approved** | Meets gate; may proceed | Merge or continue as authorized |
| **Approved with follow-up** | Gate may proceed with named non-blocking work | Record owner/condition and continue |
| **Changes requested** | Blocking gap, risk, or mismatch exists | Correct and resubmit; ask if scope changed |
| **Deferred** | Valid work, not current priority | Preserve context; do not proceed without re-admission |
| **Rejected** | Should not proceed in current form | Stop and follow Founder direction |
| **Paused** | Evidence, dependency, or safety issue blocks | Preserve branch/context and wait |

### 9.4 Review Criteria

Reviewers assess:

#### Correctness
- ✅ Implements approved behavior contract
- ✅ Handles edge cases and error conditions
- ✅ Preserves product semantics and distinctions
- ✅ Does not silently change scope

#### Quality
- ✅ Code is readable and maintainable
- ✅ Follows established patterns
- ✅ Includes proportionate tests
- ✅ Handles accessibility and responsive requirements

#### Security and Privacy
- ✅ Access control is correct
- ✅ Data is properly scoped to user
- ✅ Secrets are not exposed
- ✅ Input validation is present

#### Architecture
- ✅ Fits within existing architecture
- ✅ Does not introduce durable changes without approval
- ✅ Migration and recovery paths are sound
- ✅ Dependencies are justified

#### Documentation
- ✅ Affected documents are updated
- ✅ Rationale is clear
- ✅ Limitations are disclosed
- ✅ Future maintainers can understand

#### Completeness
- ✅ All acceptance criteria met
- ✅ Validation evidence is adequate
- ✅ Risks are understood
- ✅ Ready for requested next step

### 9.5 Addressing Review Feedback

**When changes are requested:**

1. **Understand the concern**
   - Ask clarifying questions if needed
   - Separate technical concerns from scope concerns

2. **Determine if scope changed**
   - If feedback requires behavior change → escalate to Founder
   - If feedback is about implementation → address directly

3. **Make focused corrections**
   - Address each point systematically
   - Keep corrections focused
   - Avoid expanding scope

4. **Update validation**
   - Re-run affected tests
   - Add tests if gaps were identified
   - Update test results record

5. **Respond to feedback**
   - Mark each point as addressed
   - Link to commits that resolve concerns
   - Explain if you chose alternative approach

6. **Resubmit for review**
   - Summarize changes made
   - Highlight any remaining questions
   - Request re-review

### 9.6 Formal Review Records

For material features, architecture changes, or release gates, use:
- `docs/10-reviews/records/review-record-template.md`

Formal reviews include:
- Review scope and objectives
- Review method and participants
- Findings organized by severity
- Disposition for each finding
- Overall recommendation
- Follow-up items and owners

---

## 10. Deployment and Release

### 10.1 Key Distinctions

| Term | Meaning | Authority |
|------|---------|-----------|
| **Merge** | Approved code enters `main` | Founder approval required |
| **Deploy** | Built artifact applied to environment | Automated after merge to `main` |
| **Release** | Founder-authorized availability to defined population | Founder decision required |
| **Rollout expansion** | Authorized increase in exposure after reviewing evidence | Founder decision required |
| **Rollback** | Revert code/config to previous state (where possible) | Engineering execution |
| **Repair/correction** | Fix data, access, external effect that rollback can't restore | Requires delivery design |

**Critical:** Deployment ≠ Release. A deployed feature is not automatically released.

### 10.2 Merge to Main Process

**Only merge to `main` with explicit Founder approval.**

#### Pre-Merge Checklist
- [ ] Founder has explicitly approved in PR
- [ ] All review feedback addressed
- [ ] CI checks passing (if applicable)
- [ ] Branch is up to date with `main`
- [ ] Merge conflicts resolved
- [ ] Commit message follows convention

#### Merge Steps
```bash
# Ensure your branch is up to date
git checkout main
git pull origin main
git checkout your-feature-branch
git rebase main  # or merge main into your branch

# Push updated branch
git push origin your-feature-branch --force-with-lease

# After Founder approval, merge via GitHub PR
# OR if merging locally:
git checkout main
git merge your-feature-branch --no-ff
git push origin main
```

#### Post-Merge Verification
- [ ] CI runs successfully on `main`
- [ ] Deployment completes (Vercel)
- [ ] Production URL accessible
- [ ] Smoke test primary flow
- [ ] No console errors in production
- [ ] Monitoring shows healthy state

### 10.3 Current Deployment Pipeline

```text
┌──────────────────────────────────────────────────────────────┐
│                   FLOWOS DEPLOYMENT PIPELINE                  │
└──────────────────────────────────────────────────────────────┘

Developer
    │
    ├─ Implements on branch
    ├─ npm run lint (local)
    ├─ npm run build (local)
    ├─ npm test (local)
    ├─ Manual testing
    └─ Push branch → Opens PR
         │
         ▼
GitHub Pull Request
    │
    ├─ CI runs (.github/workflows/ci.yml)
    │    ├─ npm ci
    │    ├─ npm run lint
    │    └─ npm run build
    │         (Note: npm test not yet in CI)
    │
    ├─ Founder reviews
    └─ Founder approves → Merge to main
         │
         ▼
Main Branch
    │
    ├─ CI runs again on main push
    └─ Vercel auto-deploys
         │
         ▼
Production (Vercel)
    │
    ├─ https://flowos-sage.vercel.app
    ├─ Supabase (PostgreSQL + Auth)
    └─ Post-deployment verification
```

### 10.4 CI/CD Configuration

#### Current CI (GitHub Actions)
**File:** `.github/workflows/ci.yml`

**Runs on:**
- Pull requests to `main`
- Pushes to `main`

**Steps:**
1. Checkout code
2. Setup Node.js
3. Install dependencies (`npm ci`)
4. Run linter (`npm run lint`)
5. Build application (`npm run build`)

**Current limitation:** `npm test` not yet in CI workflow (must run locally)

#### Vercel Deployment
**Automatic on:**
- Push to `main` → Production deployment
- Pull requests → Preview deployment (for review)

**Configuration:**
- Build command: `npm run build`
- Output directory: `.next`
- Install command: `npm install`
- Framework preset: Next.js

### 10.5 Release Process

#### When to Create a Release Plan

From [Release Plans](../07-strategy-and-delivery/release-plans.md), create a release plan for:
- Material behavior changes
- Data or schema changes
- Access control changes
- New automation or AI capabilities
- Security or privacy changes
- Migration requirements
- Reliability or operational changes
- Changes affecting multiple features

#### Release Plan Contents

Use `docs/07-strategy-and-delivery/releases/release-plan-template.md`:

1. **Release scope and contracts**
   - What is being released
   - Approved behavior contracts
   - Delivery designs
   - Validation evidence

2. **Population and boundaries**
   - Who gets access (all users, subset, founder only)
   - What conditions enable the feature
   - What is explicitly excluded

3. **Readiness verification**
   - Validation complete
   - Documentation current
   - Monitoring in place
   - Support prepared
   - Rollback tested

4. **Deployment sequence**
   - Pre-deployment checks
   - Deployment steps
   - Post-deployment verification
   - Communication timing

5. **Monitoring and containment**
   - What signals to monitor
   - Success criteria
   - Stop conditions (when to rollback/pause)
   - Alert thresholds

6. **Rollback and repair**
   - How to rollback code
   - How to repair data (if code rollback insufficient)
   - Recovery time objective
   - Communication plan

#### Release Authorization

**Founder must explicitly authorize:**
- Initial release to any population
- Expansion of rollout
- Re-enable after pause
- Withdrawal decision

**Authorization is not automatic from:**
- Passing CI
- Successful deployment
- Merged to `main`
- Green monitoring

#### Low-Risk Corrective Deployments

For restoring already-released contract without expanding scope:
- Concise release note may suffice
- Must link: contract, validation, monitoring, recovery owner
- Still requires Founder authorization

### 10.6 Rollback Procedures

#### Code Rollback (Git Revert)

**Never force-push `main`. Use `git revert`.**

```bash
# Find the merge commit to revert
git log --oneline

# Revert the merge commit (preserves history)
git revert -m 1 <merge-commit-hash>

# Push revert
git push origin main

# Vercel will auto-deploy the reverted code
```

#### When Code Rollback Is Not Enough

Code rollback cannot restore:
- Changed data
- External effects (emails sent, API calls made)
- User-visible corrections
- Schema migrations (may need forward migration)

**For these, create repair procedure:**
1. Document current state and desired state
2. Create repair script or manual procedure
3. Test repair in non-prod (if possible)
4. Get Founder approval
5. Execute repair with monitoring
6. Verify repair completion
7. Document in incident or review record

### 10.7 Post-Deployment Verification

**After every production deployment:**

- [ ] Application loads at production URL
- [ ] Authentication works (login/logout)
- [ ] Primary user flow works
- [ ] No console errors in primary path
- [ ] Database connection healthy
- [ ] No obvious performance regression
- [ ] Monitoring shows healthy metrics

**For material releases, also verify:**
- [ ] New feature accessible to intended population
- [ ] Feature works as specified in behavior contract
- [ ] Error handling works
- [ ] Responsive behavior correct
- [ ] Monitoring/alerts configured
- [ ] Rollback procedure ready

### 10.8 Release Communication

#### Internal Communication
**When releasing material changes:**
- Update team on timing
- Share monitoring plan
- Clarify who owns post-release watch
- Document stop conditions

#### User Communication
**For private alpha and beyond:**
- Release notes summarizing changes
- Known limitations
- How to provide feedback
- Support contact

**Do not:**
- Promise features not yet released
- Overstate stability or completeness
- Hide known limitations

---

## 11. Documentation Requirements

### 11.1 Documentation Principles

1. **One truth, one place:** Each fact has one authoritative home
2. **Link, don't duplicate:** Reference other documents rather than copying
3. **Preserve history:** Update living docs; append to historical records
4. **Update with implementation:** Documentation is part of done, not cleanup
5. **Factual and traceable:** State what is true, link to evidence

### 11.2 Documentation Types and Ownership

| Document Type | Owner | Updated When | Location |
|---------------|-------|--------------|----------|
| **Vision** | Founder | Rarely (immutable philosophy) | `docs/strategy/Vision.md` |
| **Product Model** | Founder | Product concepts change | `docs/01-product/` |
| **System Contracts** | Founder | System boundaries change | `docs/02-systems/` |
| **Feature Contracts** | Founder | Feature behavior defined/changes | `docs/04-features/<feature>/` |
| **Design Specs** | Designer (Founder approves) | Visual/interaction defined/changes | `docs/05-design/` |
| **Engineering Architecture** | Founder (Engineer proposes) | Durable technical boundaries change | `docs/06-engineering/` |
| **Technical Details** | Engineer | Implementation changes | `docs/foundation/TECHNICAL_ARCHITECTURE.md` |
| **Feature Inventory** | Engineer (Founder approves) | Feature status changes | `docs/foundation/FEATURE_INVENTORY.md` |
| **Decision Records** | Founder | Consequential decision made | `docs/08-decisions/records/` |
| **Review Records** | Reviewer (Founder final) | Review completed | `docs/10-reviews/records/` |
| **Test Results** | Tester | Tests executed | `docs/04-features/<feature>/` |
| **Release Records** | Engineer (Founder authorizes) | Release executed | `docs/07-strategy-and-delivery/releases/` |
| **Learning Records** | Observer (Founder decides) | Post-release insights | `docs/10-reviews/post-release/` |

### 11.3 Required Metadata for New Documents

Every new canonical document should include:

```markdown
**Status:** [Active | Draft | Superseded | Historical | Archived]
**Authority:** [What this document governs]
**Owner:** [Who has final authority]
**Parent:** [Documents this must align with]
**Children:** [Documents that implement this]
**Last reviewed:** [Date]
**Review trigger:** [Conditions that require review]
```

### 11.4 Documentation Updates by Change Type

| Change Type | Documents to Update |
|-------------|---------------------|
| **Bug fix restoring contract** | Test results; possibly runbook or known limitations |
| **Bug fix changing behavior** | Behavior contract, test results, FEATURE_INVENTORY |
| **New feature** | Feature brief, behavior contract, design spec, validation plan, test results, FEATURE_INVENTORY, possibly architecture |
| **Design change** | Design spec, possibly behavior contract if interaction changed |
| **Architecture change** | Relevant architecture doc, decision record if consequential, TECHNICAL_ARCHITECTURE |
| **Data model change** | Data architecture, delivery design with migration, TECHNICAL_ARCHITECTURE |
| **Documentation correction** | The document itself |
| **Process change** | Relevant governance or handbook document |

### 11.5 When NOT to Update Documentation

**Do not update:**
- Historical decision, review, release, or learning records (these are append-only)
- Active contracts to match unapproved implementation (escalate the mismatch)
- Documents outside your authority (request update from owner)
- Duplicating information already in another canonical document (link instead)

---


## 12. Related Documentation Map

### 12.1 Documentation Hierarchy

```text
┌────────────────────────────────────────────────────────────────┐
│                  FLOWOS DOCUMENTATION HIERARCHY                 │
│                   (Authority flows downward)                    │
└────────────────────────────────────────────────────────────────┘

Layer 0: CONSTITUTION
├─ Vision.md — Immutable philosophy
└─ documentation-architecture.md — How knowledge is organized
    │
    ├─ Layer 1: PRODUCT
    │   ├─ product-model.md — What FlowOS is
    │   ├─ product-glossary.md — Canonical terminology
    │   ├─ product-strategy.md — Current market choices
    │   └─ success-model.md — How success is measured
    │       │
    │       ├─ Layer 2: SYSTEMS
    │       │   ├─ direction-and-commitment.md
    │       │   ├─ action-and-evidence.md
    │       │   ├─ sensemaking-and-adaptation.md
    │       │   ├─ continuity-and-interoperability.md
    │       │   └─ intelligence-and-trust.md
    │       │       │
    │       │       ├─ Layer 3: EXPERIENCE
    │       │       │   ├─ experience-architecture.md
    │       │       │   └─ information-structure.md
    │       │       │       │
    │       │       │       ├─ Layer 4: FEATURES
    │       │       │       │   ├─ feature-catalog.md ★ START HERE
    │       │       │       │   └─ [Feature dossiers]
    │       │       │       │       ├─ feature-brief.md
    │       │       │       │       ├─ behavior-contract.md
    │       │       │       │       ├─ delivery-design.md
    │       │       │       │       └─ validation-plan.md
    │       │       │       │           │
    │       │       │       │           ├─ Layer 5: DESIGN
    │       │       │       │           │   ├─ design-system-architecture.md
    │       │       │       │           │   ├─ design-implementation-map.md ★
    │       │       │       │           │   ├─ feature-design-specifications.md
    │       │       │       │           │   └─ accessibility-standards.md
    │       │       │       │           │       │
    │       │       │       │           │       ├─ Layer 6: ENGINEERING ★ YOU ARE HERE
    │       │       │       │           │       │   ├─ engineering-architecture.md
    │       │       │       │           │       │   ├─ software-engineering-principles-and-sdlc.md ◄─
    │       │       │       │           │       │   ├─ engineering-lifecycle-and-sdlc.md
    │       │       │       │           │       │   ├─ engineering-standards.md
    │       │       │       │           │       │   ├─ data-architecture.md
    │       │       │       │           │       │   ├─ quality-architecture.md
    │       │       │       │           │       │   └─ operations-architecture.md
    │       │       │       │           │       │       │
    │       │       │       │           │       │       ├─ Layer 7: STRATEGY & DELIVERY
    │       │       │       │           │       │       │   ├─ roadmap.md
    │       │       │       │           │       │       │   ├─ mvp-implementation-masterplan.md ★
    │       │       │       │           │       │       │   ├─ development-handbook.md ★
    │       │       │       │           │       │       │   └─ release-plans.md
    │       │       │       │           │       │       │       │
    │       │       │       │           │       │       │       ├─ Layer 8: DECISIONS
    │       │       │       │           │       │       │       │   ├─ decision-register.md
    │       │       │       │           │       │       │       │   └─ decision-records.md
    │       │       │       │           │       │       │       │       │
    │       │       │       │           │       │       │       │       ├─ Layer 9: EVIDENCE
    │       │       │       │           │       │       │       │       │   ├─ research-program.md
    │       │       │       │           │       │       │       │       │   └─ measurement-specifications.md
    │       │       │       │           │       │       │       │       │       │
    │       │       │       │           │       │       │       │       │       └─ Layer 10: REVIEWS
    │       │       │       │           │       │       │       │       │           ├─ review-records.md
    │       │       │       │           │       │       │       │       │           └─ post-release-learning-records.md
```

### 12.2 Key Documents by Activity

#### Before Starting ANY Work
1. ✅ **MVP Masterplan** — `docs/07-strategy-and-delivery/mvp-implementation-masterplan.md`
   - Is this feature admitted?
   - What phase are we in?
   - What gates must pass?

2. ✅ **Feature Catalog** — `docs/04-features/feature-catalog.md`
   - What's the current status?
   - What documentation exists?

3. ✅ **Vision** — `docs/strategy/Vision.md`
   - What are the immutable boundaries?
   - What principles guide decisions?

#### Understanding Product Meaning
- **Product Model** — `docs/01-product/product-model.md`
- **Product Glossary** — `docs/01-product/product-glossary.md`
- **System Documents** — `docs/02-systems/[relevant-system].md`

#### Implementing a Feature
- **Behavior Contract** — `docs/04-features/[feature]/behavior-contract.md`
- **Design Specification** — `docs/05-design/feature-design-specifications.md`
- **Delivery Design** — `docs/04-features/[feature]/delivery-design.md`
- **Validation Plan** — `docs/04-features/[feature]/validation-plan.md`
- **Engineering Standards** — `docs/06-engineering/engineering-standards.md`

#### Understanding Engineering Rules
- **This Document** — `docs/06-engineering/software-engineering-principles-and-sdlc.md`
- **Engineering Lifecycle** — `docs/06-engineering/engineering-lifecycle-and-sdlc.md`
- **Development Handbook** — `docs/07-strategy-and-delivery/development-handbook.md`
- **Quality Architecture** — `docs/06-engineering/quality-architecture.md`

#### Understanding Current Implementation
- **Technical Architecture** — `docs/foundation/TECHNICAL_ARCHITECTURE.md`
- **Feature Inventory** — `docs/foundation/FEATURE_INVENTORY.md`
- **Design Implementation Map** — `docs/05-design/design-implementation-map.md`

#### Following Process
- **Git Workflow** — `docs/foundation/governance/GIT_WORKFLOW.md`
- **Quality Gates** — `docs/foundation/governance/QUALITY_GATES.md`
- **Code Standards** — `docs/foundation/governance/CODE_STANDARDS.md`
- **Engineering Rules** — `docs/foundation/governance/ENGINEERING.md`

#### Recording Work
- **Decision Records** — `docs/08-decisions/decision-records.md`
- **Review Records** — `docs/10-reviews/review-records.md`
- **Test Results** — `docs/04-features/_templates/test-results-template.md`
- **Release Records** — `docs/07-strategy-and-delivery/releases/`

### 12.3 Document Relationships

#### Parent-Child Relationships

**This document (Software Engineering Principles & SDLC):**

**Parents (must align with):**
- Documentation Architecture — Document authority and lifecycle
- Engineering Architecture — Engineering domain boundaries
- Development Handbook — Day-to-day operating model

**Children (implements this through):**
- Engineering Standards — Detailed change practices
- Quality Architecture — Assurance boundaries
- Operations Architecture — Operational boundaries
- Engineering Lifecycle Guide — Operational SDLC procedure
- Quality Gates — Per-change quality checklist
- Feature Delivery Designs — Feature-specific implementation plans
- Review Records — Assessment of work
- Release Plans — Release execution plans

**Siblings (coordinate with):**
- Design System Architecture — Design decisions
- Data Architecture — Data decisions
- Identity and Access Architecture — Security decisions

### 12.4 Authority Resolution

**When documents conflict, authority order (highest to lowest):**

1. **Vision.md** — Immutable
2. **Decision records** — Can't override Vision, only resolve choices within it
3. **Roadmap + MVP Masterplan** — Outcome sequence and current plan
4. **Product/Systems** — Conceptual rules
5. **Feature contracts** — Specific behavior
6. **Implementation** — Code is truth of what exists, but not normative authority

**If you find a conflict:**
1. The higher document wins
2. The lower document is wrong
3. Fix the lower document or record a decision to change it
4. Do not silently implement against a conflict

### 12.5 Quick Reference: Document Usage Patterns

#### Starting a New Feature
```text
1. Check MVP Masterplan → Admitted?
2. Read Vision + Product Model → Understand purpose
3. Read relevant System docs → Understand constraints
4. Check Feature Catalog → Current status?
5. Read/Create Feature Brief → Why build?
6. Read/Create Behavior Contract → What must it do?
7. Read/Create Design Spec → How should it look?
8. Read Engineering Standards → How to build safely?
9. Create Delivery Design (if needed) → How to implement?
10. Create Validation Plan → How to test?
11. Implement following this SDLC guide
12. Record results in Test Results
13. Submit for Review
14. Update Feature Catalog status
```

#### Fixing a Bug
```text
1. Check Behavior Contract → What is correct behavior?
2. Reproduce bug → Confirm issue
3. Identify root cause
4. Determine scope → Small fix or broader issue?
5. Follow Bug Workflow (Section 7.2)
6. Update relevant documentation if behavior was ambiguous
7. Add test to prevent recurrence
```

#### Making an Architecture Change
```text
1. Identify affected domain → Data? Access? Integration?
2. Read relevant Architecture doc
3. Prepare proposal with options
4. Discuss with Founder
5. Create Decision Record if consequential
6. Update Architecture doc with new rule
7. Implement with Delivery Design
8. Deep validation
9. Formal Review Record
```

#### Deploying to Production
```text
1. Ensure Founder approval to merge
2. Follow Merge to Main process (Section 10.2)
3. Verify CI passes
4. Verify Vercel deployment completes
5. Post-deployment verification (Section 10.7)
6. If material release, follow Release Process (Section 10.5)
7. Monitor post-deployment
8. Record in Release Record if threshold met
```

### 12.6 Templates and Examples

All templates located in `docs/04-features/_templates/`:

| Template | Use For | When to Use |
|----------|---------|-------------|
| `feature-brief-template.md` | Feature rationale | Starting any new feature |
| `behavior-contract-template.md` | Acceptance criteria | Defining what feature must do |
| `delivery-design-template.md` | Technical approach | Material technical risk |
| `validation-plan-template.md` | Test strategy | Before implementing feature |
| `test-results-template.md` | Recording test evidence | After testing |
| `acceptance-checklist-template.md` | Release readiness | Before release |
| `runbook-template.md` | Step-by-step procedures | Migrations, deployments, complex operations |
| `release-template.md` | Release planning | Material releases |
| `review-template.md` | Formal reviews | Feature/architecture reviews |
| `learning-record-template.md` | Post-release insights | After release and observation |

Decision and review templates in respective directories:
- `docs/08-decisions/records/decision-record-template.md`
- `docs/10-reviews/records/review-record-template.md`
- `docs/10-reviews/post-release/post-release-learning-record-template.md`

### 12.7 Getting Help

#### When You're Unsure...

| Question | Consult |
|----------|---------|
| Should we build this? | Founder + MVP Masterplan |
| What should it do? | Feature Brief + Behavior Contract |
| How should it look? | Design Specification |
| How do I build it? | This document + Engineering Standards |
| How do I test it? | Validation Plan + Quality Architecture |
| Can I merge? | Review process (Section 9) |
| Can I release? | Release Plans + Founder authorization |
| Where do I document this? | Documentation Architecture |
| Which layer owns this question? | Documentation Hierarchy (Section 12.1) |

#### Communication Paths

- **Product questions** → Founder
- **Technical approach (routine)** → Engineer judgment within standards
- **Technical approach (consequential)** → Founder decision
- **Design questions** → Designer (escalate to Founder if scope changes)
- **Process questions** → This document + Development Handbook
- **Blockers** → Founder immediately

---

## Appendix A: Glossary

| Term | Definition |
|------|------------|
| **Admission** | Founder decision that work may proceed; inclusion in MVP Masterplan |
| **Behavior Contract** | Document specifying observable acceptance criteria for a feature |
| **CI/CD** | Continuous Integration / Continuous Deployment — automated build and deploy |
| **Consequential** | Material enough to require explicit decision, architecture update, or decision record |
| **Contract** | Authoritative document defining requirements, behavior, or boundaries |
| **Decision Record** | Document capturing consequential choice, rationale, and alternatives |
| **Defer** | Valid work, not current priority; preserve for later consideration |
| **Deployment** | Technical artifact applied to environment |
| **Dossier** | Complete set of documents for a feature (brief, contract, design, validation, etc.) |
| **Evidence** | Factual observation, test result, or measurement |
| **Feature Catalog** | Canonical status of all features (shipped, partial, deferred, etc.) |
| **Founder** | Final decision authority for product, architecture, documentation, approval, release |
| **Gate** | Quality checkpoint that must pass before work advances |
| **Material** | Significant enough to require proportionate planning, review, or approval |
| **Masterplan** | Current canonical implementation plan (MVP Implementation Masterplan) |
| **Merge** | Incorporating approved code into `main` branch |
| **MVP** | Minimum Viable Product — smallest coherent product for validation |
| **P0/P1/P2** | Priority levels: P0 = critical, P1 = high, P2 = medium |
| **Release** | Founder-authorized availability to defined population |
| **Review Record** | Formal assessment of work against contracts |
| **RLS** | Row-Level Security — Supabase database access control |
| **Rollback** | Reverting code/config to previous state |
| **Scope** | Boundaries of what is included and excluded from work |
| **SDLC** | Software Development Life Cycle — process from idea to production |
| **Traceability** | Ability to link work back to approved contracts and forward to evidence |
| **Validation Plan** | Document defining how feature will be tested |

---

## Appendix B: Checklists

### Quick Start Checklist (New Engineer)

- [ ] Read Vision.md (understand why FlowOS exists)
- [ ] Read this document (understand how we build)
- [ ] Read MVP Implementation Masterplan (understand current plan)
- [ ] Read Feature Catalog (understand current state)
- [ ] Read Development Handbook (understand day-to-day operations)
- [ ] Read Git Workflow (understand repository process)
- [ ] Review Code Standards (understand code conventions)
- [ ] Clone repository and run locally
- [ ] Verify build and test commands work
- [ ] Review open issues/PRs to see patterns
- [ ] Ask Founder any remaining questions

### Pre-Implementation Checklist

- [ ] Work is admitted in MVP Masterplan
- [ ] Scope and acceptance criteria are clear
- [ ] Parent contracts exist (feature brief, behavior contract)
- [ ] Design specification exists (if person-visible)
- [ ] Validation plan exists
- [ ] Delivery design exists (if material technical risk)
- [ ] Ambiguities escalated to Founder
- [ ] Branch created from updated `main`

### Pre-Review Checklist

- [ ] All acceptance criteria met
- [ ] Scope is complete and focused
- [ ] `npm run lint` passes
- [ ] `npm run build` passes
- [ ] `npm test` passes or rationale provided
- [ ] Manual testing performed per validation plan
- [ ] Documentation updated
- [ ] Known limitations documented
- [ ] Review package prepared with evidence
- [ ] Clear decision requested

### Pre-Merge Checklist

- [ ] Founder has explicitly approved
- [ ] All review feedback addressed
- [ ] Branch is up to date with `main`
- [ ] Merge conflicts resolved
- [ ] CI passing (if applicable)
- [ ] Commit message follows convention

### Pre-Release Checklist

- [ ] Validation evidence complete
- [ ] Documentation current
- [ ] Release plan created (if threshold met)
- [ ] Monitoring configured
- [ ] Rollback procedure ready
- [ ] Founder has authorized release
- [ ] Communication prepared (if user-facing)

---

## Appendix C: Workflow Diagrams

### High-Level SDLC Flow
```
IDEA → TRIAGE → SCOPE → PLAN → BUILD → TEST → REVIEW → MERGE → DEPLOY → RELEASE → LEARN
  ↑                                                                                    │
  └────────────────────── Feedback Loops ──────────────────────────────────────────┘
```

### Decision Flow
```
           Question Arises
                  │
         ┌────────┴────────┐
         │                 │
    Product scope?    Technical how?
         │                 │
      Founder         ┌────┴─────┐
      decides         │          │
                  Routine?  Consequential?
                      │          │
                  Engineer   Founder + 
                  decides    Decision Record
```

### Review Flow
```
Engineer → Self Review → Submit PR → CI → Founder Review
                                              │
           ┌──────────────┬─────────────┬────┴─────┬──────────┐
           │              │             │          │          │
        Approve    Approve w/    Changes    Defer    Reject    Pause
           │        follow-up   Requested    │        │         │
           ▼            │           │         └────────┴────┐    │
        Merge       Record         Fix               Archive  Wait
                    items          │                   PR
                      │            │
                      └────────────┘
                           │
                           ▼
                      Resubmit
```

### Deployment vs Release
```
                     CODE CHANGE
                          │
                          ▼
                    Founder Approves
                          │
                          ▼
                     MERGE TO MAIN
                          │
                          ▼
                     CI RUNS (auto)
                          │
                          ▼
                  DEPLOY TO VERCEL (auto)
                          │
                          ├─────────────────────────┐
                          │                         │
                  Low Risk Material              Material Change
                  Fix/Tweak                      Feature/Risk
                          │                         │
                          ▼                         ▼
                   Auto-Available          HOLD (not released)
                                                    │
                                                    ▼
                                           Release Plan Created
                                                    │
                                                    ▼
                                          Founder Authorizes RELEASE
                                                    │
                                                    ▼
                                           Feature becomes available
                                           to defined population
```

---

## Document Version History

| Version | Date | Changes | Author |
|---------|------|---------|--------|
| 1.0 | 2026-08-02 | Initial comprehensive document consolidating engineering principles, SDLC, roles, processes | Kiro AI + Founder |

---

**This document is the authoritative reference for FlowOS engineering principles and SDLC. When in doubt, return to this document, escalate to the Founder, and preserve the integrity of the contracts, quality, and user trust that FlowOS depends on.**
