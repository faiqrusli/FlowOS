# Complete Feature Dossier Lifecycle

**For:** Understanding what goes in a dossier, where implementation/review docs live, and how features evolve
**Last updated:** 2026-08-01

---

## The Core Question You Asked

> "Runbooks, implementation docs, reviews, acceptance — shouldn't these be in the dossier too? And can there be many dossiers per feature, or just one?"

**Short answer:**
1. **One dossier per feature** (the dossier itself is the folder)
2. **Multiple documents inside that dossier** (including runbooks, reviews, versions)
3. **Dossier grows over time** as you build, ship, learn, and iterate

Let me show you the complete structure.

---

## Part 1: Complete Dossier Structure

### What You Thought (Minimal):
```
docs/04-features/tasks/
  ├── feature-brief.md
  ├── behavior-contract.md
  ├── delivery-design.md
  └── validation-plan.md
```

### What It Actually Should Be (Complete):

```
docs/04-features/tasks/                      ← ONE dossier per feature
  │
  ├── 📄 feature-brief.md                    ← Why this exists
  ├── 📄 behavior-contract.md                ← What it must do (THE CONTRACT)
  │
  ├── 📁 design/                             ← All design artifacts
  │   ├── tasks-design-spec.md               ← Visual/interaction design
  │   ├── tasks-accessibility-spec.md        ← A11y requirements
  │   └── tasks-content-spec.md              ← Copy, errors, empty states
  │
  ├── 📁 implementation/                     ← Implementation planning & records
  │   ├── delivery-design.md                 ← Technical approach
  │   ├── tasks-v1-runbook.md                ← HOW to build v1
  │   ├── tasks-v2-bulk-actions-runbook.md   ← HOW to add bulk actions
  │   └── migration-plan.md                  ← Data migrations if needed
  │
  ├── 📁 validation/                         ← Testing & acceptance
  │   ├── validation-plan.md                 ← Test cases and acceptance criteria
  │   ├── test-results-v1.md                 ← Did tests pass?
  │   └── acceptance-checklist-v1.md         ← Ready to ship?
  │
  ├── 📁 reviews/                            ← Pre-ship reviews
  │   ├── design-review-2026-07-15.md        ← Design review results
  │   ├── security-review-2026-07-20.md      ← Security audit
  │   ├── accessibility-review-2026-07-22.md ← A11y audit
  │   └── acceptance-review-2026-07-25.md    ← Final check before ship
  │
  ├── 📁 releases/                           ← What shipped when
  │   ├── v1.0-release-2026-07-28.md         ← Initial release
  │   └── v1.1-bulk-actions-release.md       ← Iteration release
  │
  ├── 📁 post-release/                       ← After shipping
  │   ├── v1-learning-record.md              ← What we learned
  │   ├── v1-incident-log.md                 ← If something broke
  │   └── usage-evidence-week-1.md           ← Real usage data
  │
  └── 📁 decisions/                          ← Major decisions
      ├── 001-why-defer-not-archive.md       ← Why defer vs archive?
      ├── 002-bulk-actions-scope.md          ← What bulk actions to support?
      └── 003-recurring-tasks-deferred.md    ← Why not recurring?
```

---

## Part 2: Core vs Extended Documents

### **Core Documents (Must Have)**

These define WHAT the feature is:

```
📄 feature-brief.md          ← Why it exists, problem, outcome
📄 behavior-contract.md      ← THE CONTRACT (what it must do)
```

**These are stable** — rarely change after initial approval.

---

### **Design Documents (Before Implementation)**

These define HOW it should look and feel:

```
📁 design/
   ├── tasks-design-spec.md         ← Visual design, components, layout
   ├── tasks-accessibility-spec.md  ← Keyboard nav, screen readers, focus
   └── tasks-content-spec.md        ← Button labels, errors, empty states
```

**Created during:** Phase 2 (Contract the MVP)

---

### **Implementation Documents (How to Build)**

These define HOW to build it:

```
📁 implementation/
   ├── delivery-design.md           ← Technical architecture
   ├── tasks-v1-runbook.md          ← Step-by-step build instructions
   ├── migration-plan.md            ← Database changes
   └── api-contract.md              ← API endpoints and schemas
```

#### **What's a Runbook?**

**Runbook = Step-by-step instructions for implementation**

Example:
```markdown
# Tasks V1 Implementation Runbook

## Goal
Implement basic task CRUD operations

## Prerequisites
- [ ] Database schema approved
- [ ] Design spec finalized
- [ ] API contract agreed

## Steps

### 1. Database Setup
```sql
CREATE TABLE tasks (
  id UUID PRIMARY KEY,
  user_id UUID REFERENCES auth.users,
  title TEXT NOT NULL,
  status TEXT DEFAULT 'active',
  created_at TIMESTAMPTZ DEFAULT NOW()
);
```

### 2. API Implementation
- [ ] Create `/api/tasks` endpoint
- [ ] Implement GET /api/tasks (list)
- [ ] Implement POST /api/tasks (create)
- [ ] Implement PATCH /api/tasks/:id (update)
- [ ] Implement DELETE /api/tasks/:id

### 3. Component Implementation
- [ ] Create TaskList component
- [ ] Create TaskCard component
- [ ] Create TaskForm component
- [ ] Wire up to API

### 4. RLS Policies
```sql
CREATE POLICY "Users can only see their tasks"
  ON tasks FOR SELECT
  USING (auth.uid() = user_id);
```

### 5. Tests
- [ ] Unit tests for task creation
- [ ] Integration tests for API
- [ ] E2E tests for user flow

### 6. Documentation
- [ ] Update behavior contract if behavior changed
- [ ] Update API docs
- [ ] Add code comments

## Exit Criteria
- [ ] All tests passing
- [ ] Code review approved
- [ ] Design review approved
- [ ] Accessibility checks passed
- [ ] Validation plan completed
```

**Runbook lives in:** `docs/04-features/tasks/implementation/tasks-v1-runbook.md`

---

### **Validation Documents (Testing & Acceptance)**

These prove it works:

```
📁 validation/
   ├── validation-plan.md           ← Test cases (written BEFORE coding)
   ├── test-results-v1.md           ← Did tests pass? (AFTER testing)
   └── acceptance-checklist-v1.md   ← Ready to ship? (BEFORE deploy)
```

**Example: Acceptance Checklist**

```markdown
# Tasks V1 Acceptance Checklist

**Date:** 2026-07-25
**Reviewer:** [Name]
**Version:** v1.0

## Behavior Contract Compliance
- [ ] Can create task with title
- [ ] Can create task with title + deadline
- [ ] Can complete task
- [ ] Can defer task with reason
- [ ] Can delete task
- [ ] Completing task creates evidence record

## Design Compliance
- [ ] Matches design spec visual layout
- [ ] Uses correct Tokyo Night tokens
- [ ] Responsive on mobile/tablet/desktop
- [ ] Empty state shows correct message
- [ ] Error states display properly

## Accessibility
- [ ] Keyboard navigation works (Tab, Enter, Esc)
- [ ] Screen reader announces task states
- [ ] Focus indicators visible
- [ ] Color contrast passes WCAG AA
- [ ] All interactive elements labeled

## Security
- [ ] RLS policies prevent cross-user access
- [ ] Input sanitized against XSS
- [ ] No sensitive data in client logs
- [ ] API rate limiting applied

## Performance
- [ ] Task list loads <500ms with 100 tasks
- [ ] Create task responds <200ms
- [ ] No memory leaks in long sessions

## Edge Cases
- [ ] Handles offline creation gracefully
- [ ] Handles concurrent edits
- [ ] Handles task deletion during focus
- [ ] Handles very long task titles (>500 chars)

## Documentation
- [ ] Behavior contract up to date
- [ ] API docs updated
- [ ] Runbook reflects actual implementation

## Decision
- [ ] ✅ APPROVED FOR RELEASE
- [ ] ⚠️  APPROVED WITH CONDITIONS: _______________
- [ ] ❌ NOT READY: _______________

**Signature:** _____________  **Date:** _______
```

**This checklist lives in:** `docs/04-features/tasks/validation/acceptance-checklist-v1.md`

---

### **Review Documents (Pre-Ship Audits)**

These are formal reviews before shipping:

```
📁 reviews/
   ├── design-review-2026-07-15.md
   ├── security-review-2026-07-20.md
   ├── accessibility-review-2026-07-22.md
   └── acceptance-review-2026-07-25.md
```

**Example: Security Review**

```markdown
# Tasks Feature Security Review

**Date:** 2026-07-20
**Reviewer:** Security Team
**Version:** v1.0 pre-release

## Scope
Review Tasks feature for security vulnerabilities before production deployment

## Findings

### ✅ Pass
- RLS policies correctly prevent cross-user access
- Input sanitization prevents XSS
- SQL injection protected by parameterized queries
- Authentication required for all endpoints

### ⚠️  Warning
- Rate limiting not implemented (could allow spam)
- No audit log for task deletions

### ❌ Critical
- None

## Required Actions Before Release
1. [ ] Implement rate limiting on /api/tasks (5 req/sec per user)
2. [ ] Add audit log table for deletions

## Recommendation
**CONDITIONAL APPROVAL** — Fix rate limiting and audit log, then re-review.

**Follow-up review:** 2026-07-23
```

---

### **Release Documents (What Shipped)**

These record what went to production:

```
📁 releases/
   ├── v1.0-release-2026-07-28.md
   └── v1.1-bulk-actions-release.md
```

**Example:**

```markdown
# Tasks V1.0 Release

**Release Date:** 2026-07-28
**Version:** v1.0
**Status:** Shipped to production

## What Shipped
- Task creation (title + optional deadline)
- Task completion
- Task deferral with reason
- Task deletion
- Task list view (Today, Inbox, Later)

## What Didn't Ship (Deferred)
- Bulk actions
- Recurring tasks
- Task templates
- Sub-tasks

## Related Documents
- Behavior contract: `../behavior-contract.md`
- Implementation runbook: `../implementation/tasks-v1-runbook.md`
- Acceptance: `../validation/acceptance-checklist-v1.md`

## Deployment
- Database migrations: Applied 2026-07-27
- API deployment: 2026-07-28 10:00 UTC
- Frontend deployment: 2026-07-28 10:15 UTC
- Rollback plan: Available

## Monitoring
- Dashboard: [link]
- Alerts: Configured for error rate >1%
- On-call: [name]

## Known Issues
- None at release time

## Follow-up
- Observe usage for 7 days
- Write learning record: Due 2026-08-04
```

---

### **Post-Release Documents (After Shipping)**

These record what happened after shipping:

```
📁 post-release/
   ├── v1-learning-record.md        ← What we learned
   ├── v1-incident-log.md           ← If something broke
   └── usage-evidence-week-1.md     ← Real usage data
```

**Example: Learning Record**

```markdown
# Tasks V1 Post-Release Learning

**Period:** 2026-07-28 to 2026-08-04 (7 days)
**Version:** v1.0

## Evidence Collected

### Usage Metrics
- 95% of users created at least one task
- Average 12 tasks per user
- 62% completion rate (above target of 60%!)
- 15% deferral rate
- 8% deletion rate

### User Feedback
- 8/10 users: "Easy to create tasks"
- 6/10 users: "Want to complete multiple tasks at once"
- 4/10 users: "Want recurring tasks"
- 2/10 users: "Confused about defer vs delete"

### Technical Performance
- API response time: 145ms average (target <200ms) ✅
- No production incidents ✅
- One minor bug: Long titles overflow on mobile (fixed in v1.0.1)

## What Worked
✅ Core CRUD operations stable and fast
✅ RLS policies working correctly
✅ Deferral reason prompts good sensemaking
✅ Integration with Focus feature seamless

## What Didn't Work
⚠️  No bulk actions → users want it
⚠️  Defer vs Delete distinction unclear for some users
⚠️  Mobile title overflow (fixed)

## Decisions Made

### 1. Add Bulk Actions (Approved)
- Evidence: 60% of users requested it
- Scope: Bulk complete, bulk defer, bulk delete
- Timeline: v1.1 (next sprint)
- Runbook: `../implementation/tasks-v1.1-bulk-actions-runbook.md`

### 2. Improve Defer/Delete UX (Approved)
- Evidence: 20% confusion rate
- Approach: Better copy and confirmation dialogs
- Timeline: v1.0.2 (polish)

### 3. Recurring Tasks (Deferred)
- Evidence: Only 40% requested, not urgent
- Decision: Defer until more evidence
- Review trigger: If >70% request it

## Next Actions
- [ ] Write v1.1 bulk actions runbook
- [ ] Update behavior contract with bulk actions
- [ ] Schedule design review for bulk actions UX
```

---

### **Decision Documents (Major Choices)**

These record consequential decisions:

```
📁 decisions/
   ├── 001-why-defer-not-archive.md
   ├── 002-bulk-actions-scope.md
   └── 003-recurring-tasks-deferred.md
```

**Example:**

```markdown
# Decision: Why Defer Instead of Archive?

**Date:** 2026-07-10
**Status:** Accepted
**Deciders:** Product team

## Context
Users need a way to say "not now, but not deleted either."

## Options Considered

### Option A: Archive
- Pro: Common pattern (Gmail, etc.)
- Con: Implies "done but keep record"
- Con: Doesn't capture intent to return

### Option B: Defer
- Pro: Clear intent to postpone
- Con: Requires reason (more friction)
- Pro: Prompts sensemaking

### Option C: Snooze
- Pro: Time-based
- Con: Requires date picker
- Con: What if user doesn't know when?

## Decision
**Defer** with optional reason field.

## Rationale
- Aligns with sensemaking system (reason = adaptation)
- "Archive" implies finished, defer implies postponed
- Can add date later if evidence supports it

## Consequences
- Must prompt for reason (can be optional)
- Need good UX to make defer feel lightweight
- Deferred tasks need their own view

## Review Trigger
If >30% of users leave reason blank, reconsider requiring it.
```

---

## Part 3: One Dossier Per Feature, Many Documents Inside

### **You Asked: Can there be many dossiers per feature?**

**Answer: ONE dossier (folder) per feature, MANY documents inside that folder.**

**Think of it like:**

```
Feature = Person
Dossier = Their medical file folder
Documents inside = Individual records over time

Just like a medical file:
- One folder per patient
- Many documents inside (X-rays, test results, visit notes)
- Documents added over time
- Old documents kept as history
```

### **Example: Tasks Feature Over Time**

```
Week 1 (Planning):
docs/04-features/tasks/
  ├── feature-brief.md
  └── behavior-contract.md

Week 2 (Design):
docs/04-features/tasks/
  ├── feature-brief.md
  ├── behavior-contract.md
  └── design/
      └── tasks-design-spec.md

Week 3 (Implementation Planning):
docs/04-features/tasks/
  ├── feature-brief.md
  ├── behavior-contract.md
  ├── design/
  │   └── tasks-design-spec.md
  └── implementation/
      ├── delivery-design.md
      └── tasks-v1-runbook.md

Week 4 (Testing):
docs/04-features/tasks/
  ├── ... (all previous docs)
  └── validation/
      ├── validation-plan.md
      └── test-results-v1.md

Week 5 (Review):
docs/04-features/tasks/
  ├── ... (all previous docs)
  └── reviews/
      ├── design-review.md
      ├── security-review.md
      └── acceptance-review.md

Week 6 (Ship):
docs/04-features/tasks/
  ├── ... (all previous docs)
  └── releases/
      └── v1.0-release.md

Week 7 (Learn):
docs/04-features/tasks/
  ├── ... (all previous docs)
  └── post-release/
      └── v1-learning-record.md

Month 2 (Iteration):
docs/04-features/tasks/
  ├── ... (all previous docs)
  ├── implementation/
  │   ├── tasks-v1-runbook.md          ← Original
  │   └── tasks-v1.1-bulk-runbook.md   ← New iteration
  ├── decisions/
  │   └── 002-bulk-actions-scope.md    ← Why bulk actions?
  └── releases/
      ├── v1.0-release.md
      └── v1.1-release.md               ← Second release
```

**The dossier GROWS, but it's always ONE folder for Tasks.**

---

## Part 4: Updating the Dossier

### **You Asked: "Any new tweak, improve will update on the relevant doc in dossier?"**

**Answer: YES, but it depends on WHAT changed.**

### **Scenario 1: Small Fix (Bug Fix, Polish)**

**What:** Fix a visual bug, improve copy, small performance tweak

**Update:**
- ✅ Code
- ❌ Don't update behavior contract (behavior didn't change)
- ✅ Maybe update content spec if copy changed
- ✅ Add to incident log if it was a bug

**Example:**
```
Bug: Task title overflows on mobile
Fix: Add text truncation CSS

Update:
- src/components/tasks/TaskCard.tsx (code fix)
- docs/04-features/tasks/post-release/v1-incident-log.md (document the bug)
```

**No behavior change = No contract update**

---

### **Scenario 2: New Feature (Bulk Actions)**

**What:** Add bulk actions (complete many tasks at once)

**This is a behavior change!**

**Update:**
1. ✅ **Update behavior-contract.md** (add bulk action rules)
2. ✅ **Write new runbook** (`tasks-v1.1-bulk-runbook.md`)
3. ✅ **Update validation plan** (add bulk action tests)
4. ✅ **Write decision record** (why bulk actions?)
5. ✅ **Design spec for bulk UI**
6. ✅ **Implement code**
7. ✅ **New acceptance checklist**
8. ✅ **New release doc** (`v1.1-release.md`)
9. ✅ **New learning record** after shipping

**Example:**

```markdown
# Behavior Contract (Updated)

## Version History
- v1.0: Initial release (2026-07-28)
- v1.1: Added bulk actions (2026-08-15)

## V1.1 Changes
Added bulk operations:
- Bulk complete (select multiple, complete all)
- Bulk defer (select multiple, defer all with shared reason)
- Bulk delete (select multiple, delete with confirmation)

## Rules
... (original rules)

### Bulk Actions (Added v1.1)
1. User can select multiple tasks via checkbox
2. Bulk complete: All selected tasks → Complete state
3. Bulk defer: Prompt for one reason, apply to all
4. Bulk delete: Confirmation required if >5 tasks selected
5. Bulk actions create individual evidence records (not one combined)
```

**Behavior change = Contract updated + new implementation docs**

---

### **Scenario 3: Direction Change (Pivot)**

**What:** Based on evidence, we decide Tasks should work totally differently

**Update:**
1. ✅ **Write decision record** (why the pivot?)
2. ✅ **Update behavior-contract.md** (major revision)
3. ✅ **New implementation runbook**
4. ✅ **Mark old runbooks as superseded**
5. ✅ **New validation plan**
6. ✅ **New design specs**
7. ✅ **Document migration plan** (how to transition users)

**This is rare** — usually evidence leads to incremental improvements, not pivots.

---

## Part 5: Runbook Integration with Contract

### **The Relationship**

```
behavior-contract.md    ← WHAT it must do (the law)
         ↓
delivery-design.md      ← HOW technically (architecture)
         ↓
runbook.md             ← Step-by-step HOW to build it (the recipe)
         ↓
test-results.md        ← Proof it matches the contract
         ↓
acceptance-review.md   ← Authority says: "yes, contract is met"
         ↓
DEPLOY                 ← Ship to production
         ↓
learning-record.md     ← Evidence from real use
         ↓
Maybe update contract if evidence shows needed changes
```

---

### **Example Flow: Tasks Feature**

```
1. Write behavior-contract.md
   "Tasks must support create, complete, defer, delete"

2. Write delivery-design.md
   "Use Supabase RLS, React components, zustand state"

3. Write tasks-v1-runbook.md
   "Step 1: Create database table
    Step 2: Write RLS policies
    Step 3: Build TaskList component
    ..."

4. Developer follows runbook → implements

5. Write test-results-v1.md
   "✅ Create task works
    ✅ Complete task works
    ✅ Defer task works
    ✅ Delete task works"

6. Write acceptance-review.md
   "Reviewer confirms: All contract requirements met ✅"

7. Write v1.0-release.md
   "Deployed 2026-07-28"

8. Collect evidence for 7 days

9. Write v1-learning-record.md
   "Evidence: Users want bulk actions
    Decision: Add bulk actions in v1.1"

10. Update behavior-contract.md
    "V1.1: Added bulk complete, defer, delete"

11. Write tasks-v1.1-bulk-runbook.md
    "Step 1: Add selection state
     Step 2: Add bulk action buttons
     ..."

12. Repeat cycle
```

---

## Part 6: Complete Dossier Template

Here's the **full structure** every feature should aim for:

```
docs/04-features/<feature-name>/
│
├── 📄 feature-brief.md              ← Why (product decision)
├── 📄 behavior-contract.md          ← What (THE CONTRACT)
│
├── 📁 design/
│   ├── <feature>-design-spec.md     ← Visual design
│   ├── <feature>-a11y-spec.md       ← Accessibility
│   ├── <feature>-content-spec.md    ← Copy/content
│   └── design-iterations.md         ← Design changelog
│
├── 📁 implementation/
│   ├── delivery-design.md           ← Technical architecture
│   ├── <feature>-v1-runbook.md      ← Build instructions v1
│   ├── <feature>-v1.1-runbook.md    ← Build instructions v1.1
│   ├── migration-plan.md            ← Data migrations
│   ├── api-contract.md              ← API spec
│   └── integration-notes.md         ← How it integrates with other features
│
├── 📁 validation/
│   ├── validation-plan.md           ← Test cases (before)
│   ├── test-results-v1.md           ← Test results (after)
│   ├── test-results-v1.1.md         ← More test results
│   ├── acceptance-checklist-v1.md   ← Ready to ship?
│   └── acceptance-checklist-v1.1.md
│
├── 📁 reviews/
│   ├── design-review-YYYY-MM-DD.md
│   ├── security-review-YYYY-MM-DD.md
│   ├── a11y-review-YYYY-MM-DD.md
│   └── acceptance-review-YYYY-MM-DD.md
│
├── 📁 releases/
│   ├── v1.0-release-YYYY-MM-DD.md
│   ├── v1.1-release-YYYY-MM-DD.md
│   └── v2.0-release-YYYY-MM-DD.md
│
├── 📁 post-release/
│   ├── v1-learning-record.md
│   ├── v1-incident-log.md
│   ├── v1-usage-evidence.md
│   ├── v1.1-learning-record.md
│   └── v2-learning-record.md
│
├── 📁 decisions/
│   ├── 001-decision-title.md
│   ├── 002-decision-title.md
│   └── 003-decision-title.md
│
└── 📄 README.md                     ← Index of the dossier
    "Quick nav to all docs in this dossier"
```

---

## Part 7: Summary

### **What Goes in the Dossier:**

| Document Type | When Created | When Updated | Lives In |
|---|---|---|---|
| Feature Brief | Planning phase | Rarely (only if scope changes) | Root of dossier |
| Behavior Contract | Planning phase | When behavior changes | Root of dossier |
| Design Specs | Design phase | When design changes | `design/` |
| Delivery Design | Before implementation | When architecture changes | `implementation/` |
| Runbooks | Before each build | Never (new versions instead) | `implementation/` |
| Validation Plan | Before implementation | When test cases change | `validation/` |
| Test Results | After testing | After each test run | `validation/` |
| Acceptance Checklist | Before deployment | Before each release | `validation/` |
| Reviews | Before shipping | After each formal review | `reviews/` |
| Releases | At deployment | Never (append-only) | `releases/` |
| Learning Records | After shipping | Never (append-only) | `post-release/` |
| Decision Records | When decided | Never (append-only) | `decisions/` |

### **Key Principles:**

1. ✅ **One dossier per feature** (it's the folder)
2. ✅ **Many documents inside** (they accumulate over time)
3. ✅ **Contracts rarely change** (stable unless behavior changes)
4. ✅ **Runbooks are versioned** (new runbook for each major iteration)
5. ✅ **Reviews and releases are append-only** (never delete history)
6. ✅ **Learning records drive adaptation** (evidence → update contract → new runbook)

### **The Complete Flow:**

```
Plan → Design → Build → Test → Review → Deploy → Learn → Adapt → Repeat
  ↓       ↓       ↓      ↓       ↓       ↓       ↓       ↓
Brief  Design  Runbook Tests  Reviews Release Learning Decision
  ↓       ↓       ↓      ↓       ↓       ↓       ↓       ↓
    Contract                                          Update Contract
```

**Everything lives in ONE dossier folder, organized by phase and purpose.** 🚀

---

## Your Next Action

When you start implementing a feature:

1. ✅ Create the dossier folder: `docs/04-features/<feature>/`
2. ✅ Write feature-brief.md
3. ✅ Write behavior-contract.md
4. ✅ Write design specs
5. ✅ Write delivery-design.md
6. ✅ Write runbook (step-by-step build instructions)
7. ✅ Write validation-plan.md
8. ✅ Build according to runbook
9. ✅ Test according to validation plan
10. ✅ Get reviews and acceptance
11. ✅ Deploy and write release doc
12. ✅ Collect evidence and write learning record
13. ✅ Based on learning, update contract and write new runbook for next iteration

**The dossier is the COMPLETE STORY of the feature from inception to current state.** 📚
