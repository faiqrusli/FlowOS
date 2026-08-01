# Evidence-Based Development & Feature Dossiers Explained

**For:** Understanding how FlowOS makes decisions and documents features
**Last updated:** 2026-08-01

---

## Part 1: Evidence and Metrics Explained

### What is "Evidence"?

**Evidence = Observable facts about what actually happened**

It's **NOT:**
- ❌ Assumptions
- ❌ Beliefs
- ❌ Hopes
- ❌ Predictions
- ❌ "It seems like..."
- ❌ Competitor analysis

It **IS:**
- ✅ "5 out of 7 users completed the task"
- ✅ "Users spent average 3 minutes trying to find the button"
- ✅ "System crashed when user clicked X"
- ✅ "User said: 'I couldn't figure out how to...'"
- ✅ "90% of focus sessions were interrupted"
- ✅ "Users corrected their reflection 4 times on average"

---

### What Does "Define Evidence and Metrics" Mean?

Before building a feature, you must answer:

**1. How will we know if this works?**
- What will we observe?
- What will we measure?
- What data will we collect?

**Example: Focus Feature**

❌ **Bad (no evidence defined):**
- "Build a focus timer"
- "Make focus better"

✅ **Good (evidence defined):**
- **Metric 1:** % of focus sessions completed vs abandoned
- **Metric 2:** Average interruption recovery time
- **Metric 3:** User-reported "I felt present during work" (1-5 scale)
- **Evidence:** Can user resume interrupted focus? Do they understand focus ≠ completion?

---

### What Does "Admit Through Evidence" Mean?

**Admit = Allow a feature to be built or expanded**

Features are **NOT** admitted because:
- ❌ Founder wants it
- ❌ Competitor has it
- ❌ It seems cool
- ❌ Someone requested it
- ❌ Code already exists

Features **ARE** admitted when:
- ✅ Evidence shows people need it
- ✅ It strengthens the core loop (Direction → Action → Evidence → Learning)
- ✅ It solves an observed problem
- ✅ Success criteria are clear

---

### Example: Why "Goals" is Deferred

From `feature-catalog.md`:

**Goals:** Placeholder / Deferred
- **Why deferred?** No evidence yet that people need a separate Goals module
- **What would admit it?** Evidence that:
  - Current Direction system is insufficient
  - People have a clear mental model of "goal" vs "commitment"
  - Goals meaningfully improve the core loop
- **Current status:** Placeholder route exists, but we're NOT building it until evidence supports it

**This is "admit through evidence"** — build only what's proven necessary.

---

### What Does "Evidence Supports More" Mean?

This is about **scaling cautiously**:

**Phase 1:** Build minimal version
**Collect evidence:** Does it work? Do people use it? What breaks?
**Phase 2 decision based on evidence:**
- ✅ Evidence positive → Expand feature
- ⚠️ Evidence mixed → Simplify or fix core problems first
- ❌ Evidence negative → Defer, retire, or redesign

**Example: Habits Feature**

Current status: **Shipped**
MVP disposition: **Conditional supporting path**

Decision tree:
```
Build minimal habits → Use it → Collect evidence

Evidence shows habits strengthen the loop?
  ├─ YES → Keep and refine
  └─ NO → Simplify or retire

Evidence shows people use it differently than expected?
  └─ Adapt based on actual use, not assumptions
```

**"Evidence supports more"** = Don't expand until evidence proves it's working.

---

### What Are "Outcomes are Evidence"?

**Outcomes = Real results you can observe**

Not outputs (things you made), but changes in reality.

| Output (Not Evidence) | Outcome (Evidence) |
|---|---|
| "Shipped focus timer" | "Users completed 45% more tasks when using focus" |
| "Added Goals page" | "10% of users set a goal and reviewed it weekly" |
| "Built AI coach" | "AI suggestions were accepted 70% of the time" |
| "Designed reflection flow" | "Users who reflected daily showed 30% better adaptation" |

**In the Roadmap:**

Each outcome is evidence-gated:
- **Outcome 1:** Reliable personal use → **Evidence gate:** Can founder use it daily without breaking?
- **Outcome 2:** Independent user evidence → **Evidence gate:** Do users return without being told to?
- **Outcome 3:** Evidence-led deepening or simplification → **Evidence gate:** What did users actually struggle with?

**"Outcomes are evidence"** = Measure results, not just whether you shipped.

---

## Part 2: What is a "Dossier"?

### Dossier = Complete Documentation Package for ONE Feature

Think of a dossier as a **folder** that contains everything about a feature:

```
docs/04-features/tasks/          ← This is the "tasks dossier"
  ├── feature-brief.md           ← Why this feature?
  ├── behavior-contract.md       ← What must it do?
  ├── delivery-design.md         ← How will we build it?
  └── validation-plan.md         ← How will we test it?
```

---

### What's in Each Document?

#### **1. Feature Brief** (Why build it?)
```markdown
# Tasks Feature Brief

## Problem
Users need to capture and manage commitments

## Outcome
User can create, edit, complete, and defer tasks

## Non-goals
- Not a project management system
- Not for managing other people
- Not a universal inbox

## Success criteria
- User can create task in <5 seconds
- User can find their tasks
- User understands difference between task and commitment

## Dependencies
- Direction & Commitment system
- Action & Evidence system
```

---

#### **2. Behavior Contract** (What must it do?)
```markdown
# Tasks Behavior Contract

## States
- Draft (being created)
- Active (ready to act on)
- In Progress (currently doing)
- Complete (finished)
- Deferred (intentionally delayed)

## Rules
1. A task must have a title
2. A task can optionally have a deadline
3. Completing a task creates evidence
4. Deferring a task requires a reason (sensemaking)

## Edge cases
- What happens if user creates duplicate?
- What happens if user loses internet during creation?
- What happens if task is deleted while in focus?

## Accessibility
- Keyboard navigation required
- Screen reader support for all states
```

---

#### **3. Delivery Design** (How will we build it?)
```markdown
# Tasks Delivery Design

## Technical approach
- Database: `tasks` table with RLS policies
- API: `/api/tasks` CRUD endpoints
- Components: TaskList, TaskCard, TaskForm

## Data changes
- Add `deferred_reason` column
- Add index on `user_id` + `status`

## Migration
- Run migration script
- Backfill existing tasks

## Risks
- Task deletion might orphan focus sessions
- Need to handle offline creation
```

---

#### **4. Validation Plan** (How will we test it?)
```markdown
# Tasks Validation Plan

## Acceptance criteria
✅ User can create task
✅ User can complete task
✅ User can defer task with reason
✅ Task persists across sessions
✅ Task respects RLS (users can't see others' tasks)

## Test cases
- Create task with only title
- Create task with title + deadline
- Complete task → verify evidence created
- Delete task while in focus → verify graceful handling

## Accessibility checks
- Tab navigation works
- Screen reader announces state changes
- Focus indicators visible
```

---

### When Do You Create a Dossier?

**Create a dossier when:**
- ✅ Feature is admitted to MVP (in `feature-catalog.md`)
- ✅ You're about to start designing/building it
- ✅ Multiple people need to understand it

**Don't create a dossier when:**
- ❌ Feature is deferred (like Goals, AI Coach)
- ❌ It's embedded in another feature (like Growth Areas in Notes)
- ❌ It's just a small bug fix
- ❌ It's a design tweak

---

### "Bounded" Dossier = Limited Scope

**Bounded** means the dossier covers ONE feature, not everything.

**Example:**

**Tasks dossier** covers:
- ✅ Task creation, editing, completion
- ✅ Task states and rules
- ✅ How tasks become evidence

**Tasks dossier does NOT cover:**
- ❌ How Focus works (that's Focus dossier)
- ❌ How Today works (that's Today dossier)
- ❌ The overall Direction system (that's a system doc)

**"Bounded dossier"** = Focused documentation for one feature only.

---

## Part 3: Embedded Features & No Dossier by Default

### What Does "Embedded" Mean?

**Embedded feature = A capability that lives INSIDE another feature**

It's not a standalone route or module.

**Example: Growth Areas**

From `feature-catalog.md`:

| Feature | Status | Evidence | MVP Disposition |
|---|---|---|---|
| **Growth Areas** | Notes sub-capability; no primary route | **Embedded** | Keep embedded in Notes until a distinct person need and outcome are evidenced |

**What this means:**

```
❌ NOT THIS:
/growth-areas                    ← Separate route
docs/04-features/growth-areas/   ← Separate dossier

✅ THIS:
/notes                           ← Only Notes route
  └── Growth areas appear here   ← Inside Notes
docs/04-features/notes/
  └── behavior-contract.md       ← Growth Areas documented HERE
      "Section 5: Growth Areas sub-capability"
```

---

### Why Keep It Embedded?

**Reasons to keep embedded:**
1. **Unclear if it deserves standalone status** — No evidence people think of it as separate from Notes
2. **Simpler** — Don't create unnecessary navigation/architecture
3. **Wait for evidence** — If people start asking "Where's my growth areas page?", THEN consider separating

**When to promote from embedded to standalone:**
- ✅ Evidence shows people want it separate
- ✅ It has distinct navigation needs
- ✅ It has its own outcome/success criteria
- ✅ It's complex enough to deserve its own system rules

---

### What is "Addendum"?

**Addendum = A section added to an existing document**

Instead of creating a new dossier, you ADD to the parent feature's documentation.

**Example: Growth Areas Addendum**

```markdown
# Notes Behavior Contract

## Section 1: Note Creation
...

## Section 2: Note Organization
...

## Section 5: Growth Areas (Addendum)

### Purpose
Growth Areas let users associate learning context with topics

### Rules
- Growth Areas are created within Notes
- They reference notes, not standalone content
- They appear in Notes sidebar

### States
- Active
- Archived

### Edge cases
- What happens if user deletes all notes in a Growth Area?
```

**"Embedded addendum"** = Document it in the parent feature's contract, don't create a separate dossier.

---

### "No Dossier by Default"

This principle means:

**DON'T automatically create a dossier for every concept or capability.**

Create a dossier ONLY when:
1. ✅ Feature is admitted to MVP
2. ✅ It's complex enough to need its own documentation
3. ✅ Multiple people need to coordinate on it

**Example: Progress**

From `feature-catalog.md`:

| Feature | Status | MVP Disposition | Next Artifact |
|---|---|---|---|
| **Progress** | Derived (calculated from other data) | No standalone Progress destination for MVP | Success Model and Measurement Specification; feature dossier only if a distinct capability is admitted |

**What this means:**

```
❌ DON'T CREATE:
/progress                        ← No route
docs/04-features/progress/       ← No dossier

✅ INSTEAD:
docs/01-product/success-model.md
  "How we measure progress"

docs/09-evidence/measurement-specification.md
  "How progress is calculated"

Code calculates progress from:
  - Focus sessions
  - Task completions
  - Reflection entries

IF users need a Progress page later → THEN create dossier
```

**"No dossier by default"** = Don't document things that don't exist as distinct features yet.

---

## Part 4: Where Does Implementation Documentation Stay?

### Before Implementation: Design Documents

```
docs/04-features/tasks/
  ├── feature-brief.md           ← Product decision
  ├── behavior-contract.md       ← What it must do
  ├── delivery-design.md         ← Technical plan
  └── validation-plan.md         ← Test plan
```

---

### During Implementation: Code

```
src/
  ├── app/(main)/tasks/          ← Route implementation
  ├── components/tasks/          ← UI components
  ├── lib/tasks.ts               ← Business logic
  └── types/task.ts              ← TypeScript types
```

**Code is the implementation truth.**

But code is NOT the authority for:
- ❌ Why the feature exists
- ❌ What problem it solves
- ❌ What behavior is expected
- ❌ What success looks like

That stays in the dossier.

---

### After Implementation: What Happens?

**Scenario 1: Implementation matches contract** ✅

```
1. Code is written
2. Tests pass (validation plan)
3. Review confirms behavior matches contract
4. Ship it
5. Write post-release learning record:
   "Tasks shipped. Evidence: 90% completion rate. Learning: Users want bulk actions."
6. Dossier stays as-is (it's still the contract)
```

**Scenario 2: Implementation reveals contract was wrong** ⚠️

```
1. Code is written
2. During testing: "Wait, the contract says X but users actually need Y"
3. Decision: Update the contract
4. Record decision: "Changed task deferral to require reason field"
5. Update behavior-contract.md
6. Update code to match new contract
7. Ship
```

**Scenario 3: Implementation incomplete** 🚧

```
1. Code partially written
2. Some acceptance criteria not met
3. Feature marked as "Partial" in feature-catalog.md
4. Next artifact needed: "Complete validation plan checklist"
5. Don't ship until complete
```

---

### What Happens to Dossier After Shipping?

**The dossier stays and evolves:**

```
Timeline:

Phase 1: Planning
  - Write feature-brief.md
  - Write behavior-contract.md

Phase 2: Design
  - Write delivery-design.md
  - Write validation-plan.md

Phase 3: Implementation
  - Code against contracts
  - Update contracts if needed

Phase 4: Validation
  - Test against validation-plan.md
  - Mark completed criteria

Phase 5: Ship
  - Deploy
  - Code is now live

Phase 6: Learn
  - Collect evidence
  - Write review or post-release learning
  - Evidence might prompt:
    → Update contract (new behavior needed)
    → Simplify (too complex)
    → Retire (not useful)

Phase 7: Iterate
  - Dossier becomes reference for next iteration
  - New changes update the contract FIRST
  - Then implement
```

**The dossier never "finishes"** — it's the living contract for that feature.

---

## Part 5: Catalog & Design Implementation

### What Happens When You Follow the Catalog?

**feature-catalog.md says:**

| Feature | Status | Next Artifact |
|---|---|---|
| Tasks | Shipped | Feature brief, behavior contract, journey contract, design spec, validation plan |

**Your workflow:**

```
1. Read feature-catalog.md → Tasks needs these artifacts

2. Create docs/04-features/tasks/
   - Write feature-brief.md
   - Write behavior-contract.md
   - Write validation-plan.md

3. Read design-implementation-map.md
   → Find: "Tasks uses V3 workspace patterns + Tokyo Night tokens"

4. Write docs/05-design/feature-design-specifications/tasks-design.md
   - Visual specs
   - Component usage
   - Accessibility requirements

5. Implement in code

6. Test against validation plan

7. Ship

8. Update feature-catalog.md:
   Status: Shipped → Documented
   Next artifact: Post-release learning record
```

---

### What Happens After All Catalog Items Done?

**When every feature in catalog has:**
- ✅ Feature brief
- ✅ Behavior contract
- ✅ Design spec
- ✅ Validation plan
- ✅ Implementation
- ✅ Tests passing

**Then:**

```
Gate 2 Complete: Contract coherence
  ↓
Move to Phase 3: Implement and harden the core loop
  ↓
Ship to founder dogfood
  ↓
Collect evidence
  ↓
Write post-release learning records
  ↓
Evidence informs next phase:

Option A: Expand (evidence positive)
  → Add new features to catalog
  → Repeat process

Option B: Simplify (evidence shows too complex)
  → Remove features from catalog
  → Update contracts to be simpler

Option C: Pivot (evidence shows wrong approach)
  → Decision record: why we're changing direction
  → Update Vision? NO (Vision is immutable)
  → Update Product Strategy: YES
  → Update feature contracts: YES
  → Implement new approach
```

---

## Summary with Examples

### Evidence & Metrics

**Question:** "Should we build Goals?"

❌ **Bad answer:** "Other apps have it, so we should too"

✅ **Good answer:** 
- "Let's observe: Are users struggling to express direction with current model?"
- "Define metric: % of users who create multi-month commitments"
- "Collect evidence: Interview 10 users about long-term planning"
- "Decision: Evidence shows 8/10 users confused between Goal and Commitment"
- "Admit feature: YES, but define clear behavior contract first"

---

### Dossier

**Question:** "Where do I document the Tasks feature?"

✅ **Answer:**
```
docs/04-features/tasks/          ← This is the dossier
  ├── feature-brief.md           ← Why it exists
  ├── behavior-contract.md       ← What it must do
  ├── delivery-design.md         ← How we'll build it
  └── validation-plan.md         ← How we'll test it
```

**When finished implementing:**
- Dossier stays as reference
- Code is the implementation
- Evidence determines if dossier needs updates

---

### Embedded vs Standalone

**Question:** "Should Growth Areas have its own page?"

🤔 **Current state:** No evidence

✅ **Decision:**
- Keep embedded in Notes
- Document in `docs/04-features/notes/behavior-contract.md` (addendum)
- No separate `/growth-areas` route
- No separate dossier

⏰ **Future:** IF evidence shows people want it separate → THEN create standalone dossier

---

### No Dossier by Default

**Question:** "Should we create a Progress dossier?"

❌ **Don't:**
```
docs/04-features/progress/       ← Don't create this yet
```

✅ **Instead:**
- Progress is calculated/derived
- Define metrics in `success-model.md`
- Define calculation in `measurement-specification.md`
- Code calculates it from tasks, focus, reflection
- No separate feature needed YET
- IF evidence shows need for Progress dashboard → THEN create dossier

---

## Quick Reference

| Concept | Meaning | Example |
|---|---|---|
| **Evidence** | Observable facts | "5/7 users completed task" |
| **Admit through evidence** | Only build if evidence supports it | Goals deferred until evidence shows need |
| **Outcomes are evidence** | Measure results, not outputs | "Users returned daily" not "We shipped feature" |
| **Dossier** | Complete docs for ONE feature | `docs/04-features/tasks/` folder |
| **Bounded dossier** | Limited to one feature's scope | Tasks dossier doesn't document Focus |
| **Embedded** | Lives inside another feature | Growth Areas inside Notes |
| **Addendum** | Section added to parent doc | Growth Areas section in Notes contract |
| **No dossier by default** | Only create when needed | No Progress dossier until it's a distinct feature |

---

## Your Action Items

1. ✅ **Before building:** Check if feature is admitted (feature-catalog.md)
2. ✅ **Before designing:** Define evidence and success metrics
3. ✅ **Before coding:** Write the dossier (brief, contract, design, validation)
4. ✅ **During implementation:** Code matches contract
5. ✅ **After shipping:** Collect evidence, write learning record
6. ✅ **Based on evidence:** Expand, simplify, or defer next iteration

**Start with evidence, end with evidence.** 🎯
