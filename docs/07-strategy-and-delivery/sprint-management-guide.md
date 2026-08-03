# Sprint Management Guide

**Purpose:** How to use the sprint system to coordinate work across the 6-role organization  
**Owner:** Founder  
**Last Updated:** 2026-08-02  

---

## What is a Sprint?

A sprint is a time-boxed period (typically 1 week) where all roles execute coordinated work toward a specific phase gate in the MVP Implementation Masterplan.

**Sprint = Phase work + Role assignments + Approval workflows + Gate progress tracking**

---

## Sprint Lifecycle

### 1. Sprint Planning (End of previous sprint)

**Who:** Founder with input from all roles

**Activities:**
1. Review previous sprint outcomes
2. Check MVP Masterplan for current phase
3. Identify phase objectives
4. Break down work into role assignments
5. Map dependencies between roles
6. Set sprint duration (usually 1 week)
7. Create new sprint document from template

**Output:** New sprint document with all role assignments

**Time:** 2-3 hours

---

### 2. Sprint Kickoff (Day 1)

**Who:** All roles

**Activities:**
1. Founder shares sprint document
2. Each role reviews their assignments
3. Roles ask clarifying questions
4. Founder confirms priorities
5. Work begins

**Format:**
```
Founder: Here's the sprint document: [link]
Founder: Phase [X] focus is [Y]
Founder: Questions before we start?
[Roles ask questions]
Founder: [Answers and clarifications]
Founder: Let's begin. First standup tomorrow.
```

**Time:** 30 minutes

---

### 3. Daily Standup (Every day)

**Who:** All roles + Founder

**Format:**
```
Each role reports:
1. Yesterday: [What I completed]
2. Today: [What I'm working on]
3. Blockers: [What's stopping me]
4. Needs approval: [What's waiting for Founder]
5. Dependencies: [What I'm waiting for from others]

Founder responds:
- Approves completed work
- Unblocks issues
- Adjusts priorities if needed
```

**Time:** 15-30 minutes

**When:** Same time each day

---

### 4. Work Execution (Throughout sprint)

**Roles follow this pattern:**

```
1. Read assignment from sprint doc
2. Read input documents
3. Execute work per role workflow
4. Submit for approval (per approval workflow)
5. Wait for Founder approval
6. Hand off to next role (after approval)
7. Update sprint doc with completion
```

**Key principles:**
- Follow your role document workflow
- Follow approval workflows (upstream review before downstream handoff)
- Don't skip steps to go faster
- Escalate blockers immediately
- Update sprint doc as you complete work

---

### 5. Mid-Sprint Check (Day 3-4)

**Who:** Founder reviews progress

**Activities:**
1. Check sprint metrics
2. Review completion tracking
3. Identify at-risk items
4. Adjust assignments if needed
5. Communicate changes to roles

**Output:** Any necessary priority/scope adjustments

**Time:** 30-60 minutes

---

### 6. Sprint Review (Last day)

**Who:** All roles + Founder

**Activities:**
1. Review all completed work
2. Check gate progress
3. Identify incomplete items
4. Assess phase gate readiness
5. Make gate decision (pass/extend/adjust)
6. Celebrate wins
7. Capture learnings

**Format:**
```
Founder: Sprint review - let's assess Gate [X]
[Review each domain/deliverable]
Founder: Gate status: [Assessment]
Founder: Decision: [Pass/Extend/Adjust]
Founder: What went well?
[Roles share]
Founder: What can improve?
[Roles share]
Founder: Next sprint planning on [Date]
```

**Output:** 
- Gate decision
- Sprint retrospective notes
- Input for next sprint

**Time:** 1-2 hours

---

## Sprint Document Structure

### Essential Sections

1. **Sprint Overview**
   - Phase context from masterplan
   - Sprint objectives
   - Success criteria

2. **Role Assignments** (one per role)
   - Primary assignment
   - Specific tasks with clear deliverables
   - Time allocation
   - Blockers and dependencies

3. **Sprint Metrics**
   - Completion tracking table
   - Gate progress tracker
   - Visual status (⚪🟡🟢)

4. **Dependencies Map**
   - Visual representation of who depends on whom
   - Critical path highlighted

5. **Daily Standup Format**
   - Consistent structure for updates

6. **Sprint Cadence**
   - Day-by-day key events

7. **Risks & Mitigation**
   - Identified risks with mitigation plans

---

## Role Assignment Format

**Every assignment should have:**

```
Assignment: [Clear, specific task]
Context: [Why this matters to phase/MVP]
Input Documents:
  - [Specific documents to read]
Expected Output:
  - [Concrete deliverables]
Definition of Done:
  - [Testable completion criteria]
  - [Approval requirements]
Hand Off To: [Next role after approval]
Due: [Specific date]
```

**Bad assignment:**
```
Assignment: Work on Tasks feature
Output: Make progress
Due: This week
```

**Good assignment:**
```
Assignment: Document Tasks domain current behavior
Context: Phase 1 implementation truth assessment
Input Documents:
  - docs/01-product/product-model.md
  - Current implementation (src/app/tasks/*)
Expected Output:
  - docs/04-features/tasks/current-behavior.md
  - Document: CRUD operations, states, data model, persistence
Definition of Done:
  - All task operations documented
  - State machine mapped
  - Known issues identified
  - Founder approved
Hand Off To: Design Architect (for design reconciliation)
Due: 2026-08-05
```

---

## Managing Dependencies

### Types of Dependencies

1. **Sequential:** B can't start until A completes
   ```
   Product Architect (behavior doc)
     ↓ must complete first
   Design Architect (design reconciliation)
   ```

2. **Parallel:** A and B can work simultaneously
   ```
   Engineering Architect (quality baseline)
   Product Architect (behavior doc)
   [Both work at same time, different inputs]
   ```

3. **Convergent:** C needs both A and B
   ```
   Product Architect → \
                        → Release Manager (gate assessment)
   Design Architect  → /
   ```

### Dependency Management

**In sprint planning:**
1. Identify all dependencies
2. Sequence work to minimize blocking
3. Start parallel tracks where possible
4. Have backup tasks for blocked roles

**During sprint:**
1. Upstream roles prioritize completing work that unblocks others
2. Downstream roles can prepare (read docs, set up environment)
3. Founder expedites approvals on blocking work
4. Blocked roles work on parallel tasks or next sprint prep

---

## Approval Workflow in Sprints

**Standard pattern:**

```
1. Role completes work
2. Role submits for approval:
   From: [Role]
   To: [Reviewing Role/Founder]
   Status: Complete
   Deliverables: [Links]
   Quality Checks: [What was verified]
   Decision Requested: Approve to hand off to [Next Role]

3. Founder reviews (or delegated reviewer)
4. Founder responds:
   ✅ Approved - proceed to handoff
   🔄 Changes requested - [specific feedback]
   ❌ Rejected - [rationale]

5. If approved, role hands off to next role
6. Role updates sprint doc completion status
```

**Time expectations:**
- Critical path items: Same day approval
- Normal items: Within 24 hours
- Non-blocking items: Within 2 days

---

## Sprint Metrics

### Track These Daily

**Completion Tracking:**
- Tasks assigned vs. completed per role
- Blocked items
- On track vs. at risk

**Gate Progress:**
- Domain-by-domain completion (⚪🟡🟢)
- Percentage complete per gate criterion
- Days remaining vs. work remaining

**Velocity:**
- Avg time from assignment to completion
- Avg time from completion to approval
- Avg time from approval to handoff

**Quality:**
- Rework requests per deliverable
- Escalations requiring Founder decision
- Blockers encountered

---

## Common Sprint Patterns

### Phase Assessment Sprint
**Purpose:** Understand current state before changing it

**Pattern:**
- Product Architect: Document current behavior
- Design Architect: Audit design vs. implementation
- Engineering Architect: Assess quality and architecture
- Implementation Engineer: Support with tooling and cleanup
- Release Manager: Define gate criteria and baseline

**Duration:** 1 week

---

### Feature Definition Sprint
**Purpose:** Contract new features before implementation

**Pattern:**
- Product Architect: Feature briefs and behavior contracts
- Design Architect: Design specifications (after approval)
- Engineering Architect: Delivery designs (after approval)
- Implementation Engineer: Prepare environment, review contracts
- Release Manager: Validation plan preparation

**Duration:** 1-2 weeks

---

### Implementation Sprint
**Purpose:** Build contracted features

**Pattern:**
- Implementation Engineer: Primary implementation work
- Engineering Architect: Technical guidance and reviews
- Design Architect: Design clarifications and assets
- Product Architect: Behavior clarifications
- Release Manager: Continuous testing and quality checks

**Duration:** 1-2 weeks

---

### Release Sprint
**Purpose:** Prepare and execute production release

**Pattern:**
- Release Manager: Release plan, final QA, deployment
- Implementation Engineer: Fix issues, support release
- Engineering Architect: Rollback procedures, monitoring
- Product Architect: Release communication, success criteria
- Design Architect: Final design verification

**Duration:** 3-5 days

---

## Sprint Anti-Patterns

### ❌ Don't Do This

1. **Vague assignments**
   - "Work on feature X"
   - "Make progress"
   - No clear deliverable

2. **Skip approval workflows**
   - Hand off work without approval
   - Assume silence is approval
   - Move to next phase without gate decision

3. **Overload one role**
   - Give one role 80% of the work
   - Create single points of failure
   - Ignore parallel work opportunities

4. **Ignore dependencies**
   - Assign work that can't start yet
   - Don't communicate blocks
   - Let roles sit idle

5. **No mid-sprint check**
   - Wait until end to discover problems
   - Don't adjust when things go wrong
   - Ignore warning signs

6. **Carry over incomplete work silently**
   - Don't reassess scope
   - Don't capture why work didn't finish
   - Just copy to next sprint

---

## Sprint Retrospective Questions

**After each sprint, discuss:**

1. **What went well?**
   - What helped us make progress?
   - What workflows felt smooth?
   - What should we keep doing?

2. **What can improve?**
   - What slowed us down?
   - What was confusing?
   - What should we change?

3. **Gate-specific:**
   - Did we meet gate criteria?
   - What evidence is strong?
   - What evidence is weak?

4. **Process:**
   - Were assignments clear?
   - Were dependencies managed well?
   - Were approvals timely?

5. **Next sprint:**
   - What should we do differently?
   - What's the biggest risk?
   - What's the critical path?

**Document answers in sprint notes section**

---

## Tools & Templates

**Available documents:**
- [Current Sprint](./current-sprint.md) — Active sprint
- [Sprint Template](./sprint-template.md) — For new sprints
- [MVP Implementation Masterplan](./mvp-implementation-masterplan.md) — Phase authority
- [Active 6-Role Configuration](../12-team/active-6-role/README.md) — Role details

**Update locations:**
- Sprint doc: Update completion status daily
- Standup: Update verbally or in chat daily
- Metrics: Update in sprint doc after standup

---

## Quick Reference: Founder's Sprint Checklist

### Sprint Planning
- [ ] Review previous sprint outcomes
- [ ] Identify current phase objectives
- [ ] Create sprint document from template
- [ ] Assign work to each role
- [ ] Map dependencies
- [ ] Set dates and cadence
- [ ] Share with team

### During Sprint
- [ ] Conduct daily standup
- [ ] Review submitted work
- [ ] Provide approvals/feedback
- [ ] Unblock roles
- [ ] Track metrics
- [ ] Mid-sprint check (day 3-4)
- [ ] Adjust scope if needed

### Sprint End
- [ ] Review all deliverables
- [ ] Assess gate progress
- [ ] Make gate decision
- [ ] Conduct retrospective
- [ ] Document learnings
- [ ] Plan next sprint

---

## Success Metrics

**Sprint is successful when:**
- ✅ All roles know what to do
- ✅ Dependencies are managed proactively
- ✅ Approvals don't become bottlenecks
- ✅ Gate progress is visible daily
- ✅ Issues are escalated and resolved quickly
- ✅ Phase gate decision is made with evidence
- ✅ Team learns and improves each sprint

---

**Use this system to coordinate the 6-role organization toward MVP completion.**
