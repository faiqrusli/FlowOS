# Feature Dossier Standard

**Status:** Active  
**Authority:** Standard for complete feature lifecycle documentation  
**Owner:** Product Architect  
**Last Updated:** 2026-08-03  

---

## What a Feature Dossier Is

**A feature dossier is the complete lifetime of a major FlowOS feature.**

It is NOT "documentation for one build." It is "everything about this feature, forever."

**For major features** (Today, Tasks, Focus, Schedule, Notes):
- The dossier lives as long as the feature exists
- Foundational docs (brief, contract) evolve slowly
- Implementation artifacts accumulate over time
- Complete history preserved

### Two Levels

**1. Foundational Documents (Top-level files)**

Written once, updated rarely when fundamental behavior changes:

- `feature-brief.md` — What is this feature? Why does it exist? Scope boundaries.
- `behavior-contract.md` — How should it work? States, actions, rules, edge cases.

**These are comprehensive.** They define the feature's essence.

**2. Implementation Artifacts (Subfolders)**

Accumulate over the feature's lifetime:

- `implementation/` — Every version, every iteration, every significant change
- `validation/` — Test results per iteration
- `reviews/` — Pre-ship reviews
- `releases/` — What shipped when
- `post-release/` — Learning records, incidents, usage evidence
- `decisions/` — Feature-specific decisions

**These grow over time.** Each iteration adds new artifacts.

**Status:** Active
**Authority:** Canonical standard for organizing all feature documentation in FlowOS
**Owner:** Product Architect
**Approval Required:** Founder
**Parent:** [Documentation Architecture](../00-constitution/documentation-architecture.md) · [Product Model](../01-product/product-model.md)
**Children:** Individual feature dossiers in `04-features/<feature-name>/`, feature templates, feature examples
**Last Updated:** 2026-08-03
**Review trigger:** A proposed change alters dossier structure, document types, lifecycle phases, folder organization, or ownership boundaries.

---

## Document Ownership

### Owner
**Role:** Product Architect
**Responsibility:** Maintain feature dossier structure standards, ensure documentation organization supports feature lifecycle, and coordinate with Design Architect and Engineering Architect on cross-role documentation needs

### Modification Process
1. Product Architect proposes dossier standard changes (based on process improvements or cross-role coordination needs)
2. Design Architect and Engineering Architect review for design and engineering implications
3. Submit to Founder for approval
4. Founder reviews for Vision and documentation architecture alignment
5. If approved: Product Architect updates document
6. Document change in decision record if consequential
7. Update Last Updated date

### Authority Level
- Product Architect can: Propose dossier structure updates, maintain organization standards, coordinate with Design and Engineering Architects
- Requires approval for: Changes to dossier structure, document types, or lifecycle phases

---

## 1. Scope

This document defines the complete structure and lifecycle of a feature dossier in FlowOS.

It answers:

> Where does every piece of knowledge about a feature—from initial decision through shipping, learning, and iteration—belong?

It does not define the content standards for specific document types (those belong to feature-briefs.md, behavior-contracts.md, etc.), nor does it define product strategy, system rules, or engineering architecture. Those responsibilities belong to their respective parent documents.

---

## 2. Core Principle

**One dossier per feature. One folder with many documents.**

A dossier is not a single document. It is the complete collection of all knowledge about one bounded feature, organized by purpose and lifecycle phase.

```
docs/04-features/<feature-name>/    ← ONE dossier (the folder)
  ├── Core documents (what)
  ├── design/ (how it looks)
  ├── implementation/ (how to build)
  ├── validation/ (how to test)
  ├── reviews/ (pre-ship approval)
  ├── releases/ (what shipped when)
  ├── post-release/ (what we learned)
  └── decisions/ (why we chose)
```

**The dossier folder is created when a feature is admitted to active work.** It grows as the feature progresses through planning, design, implementation, validation, shipping, and learning.

---

## 3. Complete Dossier Structure

### Required Root Documents

These documents define WHAT the feature is and WHY it exists. They are stable after initial approval.

```
<feature-name>/
  ├── feature-brief.md              ← Product decision: why this feature?
  └── behavior-contract.md          ← Contract: what must it do?
```

**Always present.** These are the core contract between product, design, engineering, and users.

---

### Design Subfolder (How It Looks and Feels)

Created during design phase. Contains visual, interaction, accessibility, and content specifications.

```
<feature-name>/
  └── design/
      ├── <feature>-design-spec.md          ← Visual design, layout, components
      ├── <feature>-accessibility-spec.md   ← Keyboard nav, screen readers, WCAG
      ├── <feature>-content-spec.md         ← Copy, labels, errors, empty states
      └── design-iterations.md              ← Design evolution log (optional)
```

**Created:** During design phase (MVP Phase 2)  
**Governed by:** [Design System Architecture](../05-design/design-system-architecture.md), [Content Standards](../05-design/content-standards.md)

---

### Implementation Subfolder (How to Build It)

Created before implementation. Contains technical architecture, step-by-step build instructions, migration plans, and API contracts.

```
<feature-name>/
  └── implementation/
      ├── delivery-design.md                    ← Technical architecture
      ├── <feature>-v1-runbook.md               ← Build instructions v1
      ├── <feature>-v1.1-runbook.md             ← Build instructions v1.1 (iterations)
      ├── migration-plan.md                     ← Database/data migrations (if needed)
      ├── api-contract.md                       ← API endpoints and schemas (if needed)
      └── integration-notes.md                  ← How it integrates with other features (if needed)
```

**Created:** Before implementation begins (MVP Phase 2-3)  
**Governed by:** [Delivery Designs](./delivery-designs.md), [Technical Architecture](../06-engineering/engineering-architecture.md)

#### What's a Runbook?

A **runbook** is a step-by-step implementation guide. It's the recipe for building the feature.

**One runbook per major version/iteration:**
- `tasks-v1-runbook.md` ← Initial implementation
- `tasks-v1.1-bulk-actions-runbook.md` ← Added bulk actions
- `tasks-v2-redesign-runbook.md` ← Major redesign

**Runbooks are append-only.** Don't update old runbooks; create new ones for new iterations.

---

### Validation Subfolder (How to Test It)

Created before implementation. Contains test plans, test results, and acceptance checklists that prove the feature meets its contract.

```
<feature-name>/
  └── validation/
      ├── validation-plan.md                ← Test cases (written BEFORE coding)
      ├── test-results-v1.md                ← Did tests pass? (AFTER testing)
      ├── test-results-v1.1.md              ← More test results (iterations)
      ├── acceptance-checklist-v1.md        ← Ready to ship? (BEFORE deploy)
      └── acceptance-checklist-v1.1.md      ← Ready for next release?
```

**Created:** Before implementation begins  
**Governed by:** [Validation Plans](./validation-plans.md), [Quality Strategy](../06-engineering/quality-architecture.md)

**Validation plan = Test cases (what to test)**  
**Test results = Evidence (did it pass?)**  
**Acceptance checklist = Final gate (ready to ship?)**

---

### Reviews Subfolder (Pre-Ship Approval)

Created during validation phase. Contains formal reviews that approve the feature for release.

```
<feature-name>/
  └── reviews/
      ├── design-review-YYYY-MM-DD.md       ← Design approval
      ├── security-review-YYYY-MM-DD.md     ← Security audit
      ├── accessibility-review-YYYY-MM-DD.md ← A11y audit
      ├── code-review-YYYY-MM-DD.md         ← Code quality review (if formal)
      └── acceptance-review-YYYY-MM-DD.md   ← Final approval gate
```

**Created:** During Phase 4 (Trust, quality, and release readiness)  
**Governed by:** [Quality Strategy](../06-engineering/quality-architecture.md), [Trust Architecture](../06-engineering/intelligence-and-trust-architecture.md)

**Reviews are append-only.** Each review is a dated record of approval or rejection.

---

### Releases Subfolder (What Shipped When)

Created at deployment. Contains records of what was deployed to production.

```
<feature-name>/
  └── releases/
      ├── v1.0-release-YYYY-MM-DD.md        ← Initial release
      ├── v1.1-release-YYYY-MM-DD.md        ← Feature iteration
      ├── v1.0.1-hotfix-YYYY-MM-DD.md       ← Bug fix release
      └── v2.0-release-YYYY-MM-DD.md        ← Major version
```

**Created:** At deployment time  
**Governed by:** [Release Plans](../07-strategy-and-delivery/releases/)

**Release records are append-only.** They document:
- What shipped
- When deployed
- How to rollback
- Known issues at ship time
- Monitoring and on-call

---

### Post-Release Subfolder (What We Learned)

Created after shipping. Contains evidence from real use, incidents, and learning records.

```
<feature-name>/
  └── post-release/
      ├── v1-learning-record.md             ← What we learned from v1
      ├── v1-incident-log.md                ← If something broke
      ├── v1-usage-evidence.md              ← Real usage data
      ├── v1.1-learning-record.md           ← Learning from v1.1
      └── user-feedback-synthesis.md        ← Aggregated user feedback (optional)
```

**Created:** 7-14 days after shipping  
**Governed by:** [Post-Release Learning](../09-reviews/post-release/)

**Learning records drive adaptation.** Evidence from real use informs whether to:
- Expand (evidence positive)
- Simplify (too complex)
- Fix (broken)
- Defer (not useful)
- Retire (harmful)

---

### Decisions Subfolder (Why We Chose)

Created when consequential decisions are made. Contains decision records for major choices about the feature.

```
<feature-name>/
  └── decisions/
      ├── 001-why-defer-not-archive.md      ← Numbered, dated
      ├── 002-bulk-actions-scope.md
      ├── 003-recurring-tasks-deferred.md
      └── 004-migration-approach.md
```

**Created:** When a consequential decision is made  
**Governed by:** [Decision Records](../08-decisions/)

**Decision records are append-only.** They document:
- Context
- Options considered
- Decision made
- Rationale
- Consequences
- Review trigger

---

## 4. Complete Example Structure

```
docs/04-features/tasks/                           ← ONE dossier per feature
  │
  ├── 📄 feature-brief.md                         ← Why it exists
  ├── 📄 behavior-contract.md                     ← What it must do (THE CONTRACT)
  │
  ├── 📁 design/                                  ← How it looks
  │   ├── tasks-design-spec.md
  │   ├── tasks-accessibility-spec.md
  │   └── tasks-content-spec.md
  │
  ├── 📁 implementation/                          ← How to build
  │   ├── delivery-design.md
  │   ├── tasks-v1-runbook.md
  │   ├── tasks-v1.1-bulk-actions-runbook.md
  │   └── migration-plan.md
  │
  ├── 📁 validation/                              ← How to test
  │   ├── validation-plan.md
  │   ├── test-results-v1.md
  │   ├── test-results-v1.1.md
  │   ├── acceptance-checklist-v1.md
  │   └── acceptance-checklist-v1.1.md
  │
  ├── 📁 reviews/                                 ← Pre-ship approval
  │   ├── design-review-2026-07-15.md
  │   ├── security-review-2026-07-20.md
  │   ├── accessibility-review-2026-07-22.md
  │   └── acceptance-review-2026-07-25.md
  │
  ├── 📁 releases/                                ← What shipped when
  │   ├── v1.0-release-2026-07-28.md
  │   ├── v1.1-release-2026-08-15.md
  │   └── v1.0.1-hotfix-2026-08-02.md
  │
  ├── 📁 post-release/                            ← What we learned
  │   ├── v1-learning-record.md
  │   ├── v1-incident-log.md
  │   ├── v1-usage-evidence.md
  │   └── v1.1-learning-record.md
  │
  ├── 📁 decisions/                               ← Why we chose
  │   ├── 001-why-defer-not-archive.md
  │   ├── 002-bulk-actions-scope.md
  │   └── 003-recurring-tasks-deferred.md
  │
  └── 📄 README.md                                ← Dossier index (optional)
```

---

## 5. Dossier Lifecycle

### Phase 1: Decision (Feature Brief)

**Create:**
```
<feature-name>/
  └── feature-brief.md
```

**Question:** Should we build this?  
**Gate:** Admit to active work or defer

---

### Phase 2: Contract (Behavior + Design)

**Create:**
```
<feature-name>/
  ├── behavior-contract.md
  └── design/
      ├── <feature>-design-spec.md
      ├── <feature>-accessibility-spec.md
      └── <feature>-content-spec.md
```

**Question:** What must it do and how should it look?  
**Gate:** Contract approved for implementation

---

### Phase 3: Plan Implementation

**Create:**
```
<feature-name>/
  ├── implementation/
  │   ├── delivery-design.md
  │   └── <feature>-v1-runbook.md
  └── validation/
      └── validation-plan.md
```

**Question:** How will we build and test it?  
**Gate:** Implementation plan approved

---

### Phase 4: Build

**Follow:** `implementation/<feature>-v1-runbook.md`  
**Implement:** Code in `src/`  
**Update:** Contracts if behavior changes during implementation

---

### Phase 5: Test

**Follow:** `validation/validation-plan.md`  
**Create:** `validation/test-results-v1.md`

**Question:** Does it meet the contract?  
**Gate:** All tests pass

---

### Phase 6: Review

**Create:**
```
<feature-name>/
  └── reviews/
      ├── design-review-YYYY-MM-DD.md
      ├── security-review-YYYY-MM-DD.md
      ├── accessibility-review-YYYY-MM-DD.md
      └── acceptance-review-YYYY-MM-DD.md
```

**Create:**
```
<feature-name>/
  └── validation/
      └── acceptance-checklist-v1.md
```

**Question:** Ready to ship?  
**Gate:** All reviews approved, acceptance checklist complete

---

### Phase 7: Release

**Create:**
```
<feature-name>/
  └── releases/
      └── v1.0-release-YYYY-MM-DD.md
```

**Action:** Deploy to production  
**Record:** What shipped, when, how to rollback

---

### Phase 8: Observe

**Wait:** 7-14 days  
**Collect:** Usage metrics, user feedback, incidents

---

### Phase 9: Learn

**Create:**
```
<feature-name>/
  └── post-release/
      ├── v1-learning-record.md
      ├── v1-incident-log.md
      └── v1-usage-evidence.md
```

**Question:** What worked? What didn't? What should change?  
**Output:** Evidence-based recommendations

---

### Phase 10: Adapt

**Based on evidence:**

**Option A: Expand (evidence positive)**
```
Update: behavior-contract.md (add new capability)
Create: implementation/<feature>-v1.1-runbook.md
Create: validation/acceptance-checklist-v1.1.md
Repeat: Phases 4-9
```

**Option B: Simplify (too complex)**
```
Create: decisions/00X-simplify-rationale.md
Update: behavior-contract.md (remove capability)
Create: implementation/<feature>-v2-simplified-runbook.md
```

**Option C: Fix (broken)**
```
Create: post-release/<feature>-incident-log.md
Create: releases/v1.0.1-hotfix-YYYY-MM-DD.md
Update: Code only (if behavior unchanged)
OR Update: behavior-contract.md (if behavior must change)
```

**Option D: Defer or Retire (not useful)**
```
Create: decisions/00X-defer-rationale.md
Update: Feature-catalog.md (mark as deferred)
Archive: Dossier (move to 11-archive/ with reason)
```

---

## 6. Document Type Ownership

| Document Type | Lives In | When Created | When Updated | Append-Only? |
|---|---|---|---|---|
| Feature Brief | Root | Planning | Rarely (scope change only) | No |
| Behavior Contract | Root | Planning | When behavior changes | No |
| Design Specs | design/ | Design phase | When design changes | No |
| Delivery Design | implementation/ | Pre-implementation | When architecture changes | No |
| Runbook | implementation/ | Pre-implementation | Never (new versions instead) | Yes |
| Validation Plan | validation/ | Pre-implementation | When test cases change | No |
| Test Results | validation/ | After testing | After each test run | Yes |
| Acceptance Checklist | validation/ | Before release | Before each release | Yes |
| Reviews | reviews/ | During validation | Never (dated snapshots) | Yes |
| Releases | releases/ | At deployment | Never (dated snapshots) | Yes |
| Learning Records | post-release/ | After shipping | Never (dated snapshots) | Yes |
| Decision Records | decisions/ | When decided | Never (dated snapshots) | Yes |

---

## 7. Iteration Rules

### Small Changes (Bug Fix, Polish)

**Don't create new docs.** Just update code.

**Maybe update:**
- Content spec (if copy changed)
- Incident log (if bug)

**Don't update:**
- Behavior contract (behavior unchanged)
- Runbook (it's historical reference)

---

### New Capability (Iteration)

**This is a behavior change.**

**Update:**
1. ✅ behavior-contract.md (add new rules)
2. ✅ Create new runbook (v1.1)
3. ✅ Update validation-plan.md (new tests)
4. ✅ Create decision record (why add this?)
5. ✅ Update/create design specs (new UI)
6. ✅ Create new acceptance-checklist (v1.1)
7. ✅ Implement following new runbook
8. ✅ Create new test-results (v1.1)
9. ✅ Create new reviews (v1.1)
10. ✅ Create new release record (v1.1)
11. ✅ Create new learning record (v1.1)

---

### Major Redesign (v2)

**This is a major behavior change.**

**Update:**
1. ✅ behavior-contract.md (major revision, note version)
2. ✅ Create decision record (why redesign?)
3. ✅ Create new design specs (v2)
4. ✅ Create new delivery-design (if architecture changed)
5. ✅ Create new runbook (v2)
6. ✅ Update validation-plan.md (new test suite)
7. ✅ Create migration-plan.md (how to transition users)
8. ✅ Repeat full cycle (build, test, review, release, learn)

---

## 8. Dossier Metadata

Every dossier should include a root README.md for quick navigation:

```markdown
# <Feature Name> Feature Dossier

**Status:** Active | Deferred | Retired  
**Current Version:** v1.1  
**Owner:** [Team/Person]  
**Last Updated:** YYYY-MM-DD

## Quick Links

- [Feature Brief](./feature-brief.md) - Why this exists
- [Behavior Contract](./behavior-contract.md) - What it must do
- [Latest Design Spec](./design/<feature>-design-spec.md)
- [Latest Runbook](./implementation/<feature>-v1.1-runbook.md)
- [Latest Release](./releases/v1.1-release-YYYY-MM-DD.md)
- [Latest Learning](./post-release/v1.1-learning-record.md)

## Version History

- v1.0 (2026-07-28): Initial release
- v1.1 (2026-08-15): Added bulk actions
- v1.0.1 (2026-08-02): Hotfix for mobile overflow

## Related Features

- [Focus](../focus/) - Tasks integrate with focus sessions
- [Reflection](../reflection/) - Completed tasks create evidence
```

---

## 9. Folder Creation Timing

**Don't create all folders immediately.** Create them as you reach each phase.

**Week 1 (Decision):**
```
<feature-name>/
  └── feature-brief.md
```

**Week 2 (Contract):**
```
<feature-name>/
  ├── feature-brief.md
  ├── behavior-contract.md
  └── design/
      └── (design specs)
```

**Week 3 (Plan):**
```
<feature-name>/
  ├── ... (previous docs)
  ├── implementation/
  │   ├── delivery-design.md
  │   └── <feature>-v1-runbook.md
  └── validation/
      └── validation-plan.md
```

**Week 4-6 (Build & Test):**
```
<feature-name>/
  ├── ... (previous docs)
  └── validation/
      └── test-results-v1.md
```

**Week 7 (Review):**
```
<feature-name>/
  ├── ... (previous docs)
  ├── reviews/
  │   └── (review records)
  └── validation/
      └── acceptance-checklist-v1.md
```

**Week 8 (Ship):**
```
<feature-name>/
  ├── ... (previous docs)
  └── releases/
      └── v1.0-release-YYYY-MM-DD.md
```

**Week 9+ (Learn):**
```
<feature-name>/
  ├── ... (previous docs)
  └── post-release/
      ├── v1-learning-record.md
      ├── v1-incident-log.md
      └── v1-usage-evidence.md
```

**Create folders only when you have documents to put in them.**

---

## 10. Templates and Examples

**Templates:** See [_templates/](./_templates/) for starter documents

**Complete Example:** A complete example dossier is planned; use the folder structure above as the reference until it is admitted to the active docs.

**Quick Start:** See [start-here/implementing-a-feature.md](../start-here/implementing-a-feature.md) for the step-by-step guide

---

## 11. Summary

**Remember:**

1. ✅ **One dossier per feature** (it's a folder, not a document)
2. ✅ **Many documents inside** (accumulate over lifecycle)
3. ✅ **Organized by purpose** (design/, implementation/, validation/, etc.)
4. ✅ **Created progressively** (don't create all folders at once)
5. ✅ **Contracts are stable** (rarely change)
6. ✅ **Runbooks are versioned** (new file for each major iteration)
7. ✅ **Reviews and releases are append-only** (never edit history)
8. ✅ **Learning drives adaptation** (evidence → update contract → new runbook → repeat)

**The dossier is the complete story of a feature from inception to current state.** 📚



---

## How Features Evolve

### Initial Creation

```
04-features/today/
  ├── feature-brief.md              ← Write this first (foundational)
  ├── behavior-contract.md          ← Write this second (foundational)
  ├── implementation/
  │   └── v1.0-initial.md           ← First implementation
  └── validation/
      └── v1.0-tests.md             ← Initial validation
```

### Small Improvement (v1.1)

**Example:** Add inline task capture

**Process:**
1. Create `implementation/v1.1-inline-capture.md` (new runbook)
2. IF behavior changes: Update `behavior-contract.md`
3. Create `validation/v1.1-tests.md`
4. Ship and create `releases/v1.1-release.md`

**The dossier grows:**
```
04-features/today/
  ├── feature-brief.md              ← Unchanged
  ├── behavior-contract.md          ← Updated (new capture behavior)
  ├── implementation/
  │   ├── v1.0-initial.md
  │   └── v1.1-inline-capture.md    ← NEW
  ├── validation/
  │   ├── v1.0-tests.md
  │   └── v1.1-tests.md             ← NEW
  └── releases/
      ├── v1.0-release.md
      └── v1.1-release.md           ← NEW
```

### Bug Fix (v1.1.1)

**Example:** Fix timeline scroll bug

**Process:**
1. Create `implementation/v1.1.1-bug-fixes.md` (document the fix)
2. Behavior contract unchanged (no behavior change)
3. Ship and log in `post-release/v1.1-incident-log.md`

### Major Redesign (v2.0)

**Example:** Completely redesign Today page

**Process:**
1. UPDATE `behavior-contract.md` (major behavior changes)
2. MAYBE update `feature-brief.md` (if scope changed)
3. Create `implementation/v2.0-redesign.md`
4. Create `design/v2-design-spec.md`
5. Full validation, review, release cycle

---

## When to Update Foundational Docs

### Update `feature-brief.md` when:
- Feature scope changes significantly
- The "why" changes
- Boundaries shift

**Rare** — maybe once or twice over the feature's lifetime.

### Update `behavior-contract.md` when:
- New user-facing behavior added
- States or actions change
- Error handling changes
- Edge cases discovered

**Occasional** — when behavior evolves, not for every bug fix.

### Always create new implementation artifacts:
- Every meaningful change gets a runbook
- Every release gets a release record
- Every learning gets a learning record

**Frequent** — the dossier accumulates history.

---

## Small Fixes and Improvements

**Question:** "I fixed a small bug. Do I update the behavior contract?"

**Answer:**

**If the bug fix changes observable behavior:**
- YES, update `behavior-contract.md`
- Document in `implementation/vX.X.X-bug-fixes.md`

**If the bug fix doesn't change behavior (just makes existing behavior work correctly):**
- NO, don't update contract
- Document in `implementation/vX.X.X-bug-fixes.md` or `post-release/incident-log.md`

**Even small fixes are tracked.** The dossier shows everything.

---

## The Value Over Time

**After 6 months of Today page evolution:**

```
04-features/today/
  ├── feature-brief.md              ← Updated once
  ├── behavior-contract.md          ← Updated 3 times
  ├── design/
  │   ├── v1-design.md
  │   └── v2-redesign.md
  ├── implementation/
  │   ├── v1.0-initial.md
  │   ├── v1.1-inline-capture.md
  │   ├── v1.2-focus-polish.md
  │   ├── v1.3-bug-fixes.md
  │   ├── v1.4-timeline-improvement.md
  │   └── v2.0-major-redesign.md    ← 6 iterations
  ├── validation/
  │   └── [6 test result files]
  ├── releases/
  │   └── [6 release records]
  ├── post-release/
  │   ├── v1.0-learning.md
  │   ├── v1.1-incident-log.md
  │   ├── v1.2-usage-evidence.md
  │   └── v2.0-learning.md          ← Learning from each release
  └── decisions/
      ├── 001-inline-capture-approach.md
      └── 002-v2-redesign-rationale.md
```

**You can now:**
- Understand what Today page is (brief)
- Understand how it should work (contract)
- See every iteration (implementation/)
- Understand what worked/didn't work (post-release/)
- Avoid repeating mistakes
- Build coherently on previous work

**This is why dossiers are valuable for major features.**

---

## Summary

**Feature dossier = Complete feature lifetime**

**Foundational docs (top-level):**
- Written once
- Updated when fundamentals change
- Comprehensive and authoritative

**Implementation artifacts (subfolders):**
- Accumulate over time
- Every iteration adds to history
- Complete record of evolution

**For major features (Today, Tasks, Focus):**
- Worth the upfront investment (6-14 hours)
- Prevents rebuilding from scratch
- Enables coherent evolution

**For small features:**
- Don't need full dossier
- Decision log + code is fine

**The dossier grows with the feature. It's not created once — it's maintained forever.**

