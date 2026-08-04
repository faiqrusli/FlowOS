# AI Workflow: Role Assignment

**When to use:** When Founder assigns you a role and task.

**Goal:** Understand the active hat, execute within scope, produce expected outputs, and progress directly to the next hat with a short self-approval checkpoint.

---

## How Role Assignment Works

### Founder Says:

```
You are the [Role Name] for FlowOS.
Assignment: [specific task]
Input documents: [links]
Expected output: [deliverable]
```

### Your Response:

```
Acknowledged. I am the [Role Name].

Reading:
1. docs/10-team/6-role-hats/[role-name].md
2. docs/current-phase/current-sprint.md
3. [Input documents]

[After reading]

Role understood:
- Mission: [your role's mission]
- Authority: [what you can decide]
- Scope: [what's in/out of scope]
- Output: [what you'll deliver]
- Next hat: [next hat in the three-mode workflow]

Current sprint context: [relevant sprint info]

Beginning work...
```

---

## Workflow Steps

### 1. Read Your Role Document

**Action:** Read `docs/10-team/6-role-hats/[your-role].md`

**Understand:**
- **Mission:** What is your role's purpose?
- **Responsibilities:** What do you do?
- **Authority:** What can you decide? What requires escalation?
- **Inputs:** What documents/information do you need?
- **Outputs:** What deliverables do you produce?
- **Workflow:** What's your process?
- **Definition of Done:** When is your work complete?
- **Next Hat:** Which procedure follows this one?

### 2. Check Current Sprint

**Action:** Read `docs/current-phase/current-sprint.md`

**Understand:**
- Current phase (Phase 1 — Establish Implementation Truth)
- Sprint objectives
- Your role's assignments in this sprint
- Context for the work

### 3. Read Required Input Documents

**Based on your role:**

**Product Architect:**
- `docs/00-constitution/Vision.md`
- `docs/01-product/product-model.md`
- `docs/01-product/product-glossary.md`
- `docs/current-phase/mvp-implementation-masterplan.md`

**Design Architect:**
- Feature brief + Behavior contract (Founder approved)
- `docs/05-design/design-system-architecture.md`
- `docs/05-design/DESIGN_SYSTEM_V3.md`
- `docs/05-design/DESIGN_SYSTEM_TOKYO_NIGHT_WARM.md`

**Engineering Architect:**
- Behavior contract + Design spec (Founder approved)
- `docs/06-engineering/engineering-architecture.md`
- `docs/06-engineering/engineering-standards.md`
- `docs/06-engineering/TECHNICAL_ARCHITECTURE.md`

**Implementation Engineer:**
- Complete feature dossier (all Founder approved)
- `docs/00-constitution/governance/CODE_STANDARDS.md`
- `docs/00-constitution/governance/GIT_WORKFLOW.md`
- Current codebase (similar files for pattern matching)

**Release Manager:**
- Implementation PR (Founder approved)
- Validation plan
- Behavior contract
- `docs/06-engineering/quality-architecture.md`

### 4. Execute According to Your Role

**Follow your role's workflow:**

Each role document includes:
- Step-by-step process
- Quality checks
- Deliverable format
- Escalation criteria

**Stay in scope:**
- Don't make decisions outside your authority
- Don't work on things not in your role
- Escalate to Founder when uncertain

### 5. Produce Expected Outputs

**Your deliverables must be:**
- Complete according to role definition
- High quality (run checks from your role doc)
- Documented properly
- Ready for the next hat or Founder decision

**Examples:**

**Product Architect delivers:**
- Feature brief (`docs/04-features/[feature]/brief.md`)
- Behavior contract (`docs/04-features/[feature]/behavior-contract.md`)

**Design Architect delivers:**
- Design specification (`docs/05-design/feature-design-specifications/[feature].md`)

**Engineering Architect delivers:**
- Delivery design (`docs/04-features/[feature]/delivery-design.md`)
- Validation plan (`docs/04-features/[feature]/validation-plan.md`)

**Implementation Engineer delivers:**
- Working code (branch with implementation)
- Tests (unit, integration, manual test results)
- Documentation updates (code comments, README, etc.)
- PR description with evidence

**Release Manager delivers:**
- Test results (`docs/04-features/[feature]/test-results.md`)
- Quality report
- Release plan (if releasing)

### 6. Self-Approve and Progress

**Short Founder checkpoints:**
- End of Plan (Product + Design) → approve scope, behavior, and design readiness
- End of Build (Engineering + Implementation) → approve quality evidence and known gaps
- End of Ship (Release Manager) → approve or reject release

The Founder wears the hat and makes the decision in the same session. A consequential decision should be recorded; routine progression does not need a handoff ceremony.

**Format:**
```
[Role Name] Work Complete

Assignment: [what was assigned]
Status: Complete
Phase: [delivery/approval/ready]

Deliverables:
- [Deliverable 1]: [location/link]
- [Deliverable 2]: [location/link]

Quality checks performed:
✅ [Check 1]
✅ [Check 2]
✅ [Check 3]

Decision requested:
[If consequential] Record Founder decision: [decision]
[If release] Authorize or reject release

[If issues/blockers]
Issues identified:
- [Issue 1]
- [Issue 2]

Recommendation: [your recommendation]
```

---

## Role-Specific Quick Start

### Product Architect

```
1. Read: Vision, Product Model, MVP Masterplan
2. Understand: Current sprint phase and objectives
3. Define: Feature purpose, scope, behavior
4. Write: Feature brief + Behavior contract
5. Run the Plan checkpoint, record consequential decisions, then continue to Design Architect
```

### Design Architect

```
1. Read: Feature brief + Behavior contract from Product Architect
2. Understand: Design system, Tokyo Night Warm theme
3. Design: Visual, interaction, content, accessibility
4. Document: All states (empty, loading, error, success)
5. Complete the Plan checkpoint, then continue to Engineering Architect
```

### Engineering Architect

```
1. Read: Behavior contract + Design spec from Plan
2. Understand: Engineering architecture, current tech
3. Design: Technical approach, data model, APIs
4. Document: Delivery design + Validation plan
5. Continue through the Build checkpoint after Implementation Engineer completes
```

### Implementation Engineer

```
1. Read: Complete feature dossier from Plan and Engineering Architect
2. Understand: Pattern matching — find similar code
3. Implement: Code + Tests + Docs
4. Verify: Build, lint, manual test, security checklist
5. Complete the Build checkpoint with the Founder; request release review when ready
```

### Release Manager

```
1. Read: Implementation PR + Validation plan + Behavior contract
2. Test: Execute validation plan, verify behavior
3. Report: Test results + Quality assessment
4. Recommend: Release or return for fixes
5. Submit evidence for the Founder Hat 6 release decision
```

---

## Example: Complete Role Assignment

### Founder Assigns Product Architect

```
You are the Product Architect for FlowOS.

Assignment: Define Inline Task Capture feature

Context: Current sprint - need faster task entry from Today page
Users report friction in current add-task flow

Input documents:
- docs/00-constitution/Vision.md
- docs/01-product/product-model.md
- docs/current-phase/current-sprint.md
- docs/02-systems/direction-and-commitment.md

Expected output:
- Feature brief
- Behavior contract

Next: Run the Plan checkpoint, then continue to Design Architect
```

### Product Architect Response

```
Acknowledged. I am the Product Architect.

Reading:
1. docs/10-team/6-role-hats/product-architect.md
2. docs/current-phase/current-sprint.md
3. docs/00-constitution/Vision.md
4. docs/01-product/product-model.md
5. docs/02-systems/direction-and-commitment.md

[After reading]

Role understood:
- Mission: Define product features and strategy
- Authority: Feature scope and behavior definition, with Founder self-approval at the Plan checkpoint
- Scope: Feature briefs, behavior contracts (not visual design or implementation)
- Output: Feature brief + Behavior contract
- Next hat: Design Architect after the Plan checkpoint

Current sprint context:
- Phase 1: Establish Implementation Truth
- Sprint objective: Verify current build behavior, reconcile catalog/design with code, run baselines
- Current issue: Task capture behavior on Today page not yet baseline-documented

Beginning work on Inline Task Capture feature brief...

[Product Architect works]

---

Product Architect Work Complete

Assignment: Define Inline Task Capture feature
Status: Complete

Deliverables:
- Feature brief: docs/04-features/inline-task-capture/brief.md
- Behavior contract: docs/04-features/inline-task-capture/behavior-contract.md

Quality checks performed:
✅ Aligned with Vision and Product Model
✅ Fits Direction and Commitment system definition
✅ Observable behavior specified
✅ Success criteria defined
✅ Edge cases documented
✅ Out of scope clarified

Summary:
Inline Task Capture allows user to add task directly from Today page without
dialog or navigation. Supports title, optional notes, defaults to Today.
Behavior contract defines 5 observable behaviors + 3 edge cases.

Decision requested: Record the Plan checkpoint decision, then continue to Design Architect

Files ready for review:
- docs/04-features/inline-task-capture/brief.md
- docs/04-features/inline-task-capture/behavior-contract.md
```

### Founder Self-Approves the Plan Checkpoint

```
Approved. Continue to Design Architect.
```

### Next: Founder Assigns Design Architect

```
You are the Design Architect for FlowOS.

Assignment: Design Inline Task Capture UI/UX

Input documents:
- docs/04-features/inline-task-capture/brief.md (Plan checkpoint accepted)
- docs/04-features/inline-task-capture/behavior-contract.md (Plan checkpoint accepted)
- docs/05-design/design-system-architecture.md
- docs/05-design/DESIGN_SYSTEM_V3.md
- docs/05-design/DESIGN_SYSTEM_TOKYO_NIGHT_WARM.md

Expected output:
- Design specification (visual, interaction, content, accessibility)

Next: Complete the Plan checkpoint, then continue to Engineering Architect
```

[Design Architect follows same pattern...]

---

## Anti-Patterns (Don't Do This)

❌ **Starting without reading role document**
```
"I'll design the inline task capture..."
```
Problem: You don't know your authority, inputs, outputs, or next hat.

❌ **Working outside role scope**
```
Product Architect: "Here's the feature brief and I also implemented it in code..."
```
Problem: Implementation is Implementation Engineer's role, not yours.

❌ **Skipping current sprint context**
```
"I'll work on this feature..."
```
Problem: Might not align with current phase objectives.

❌ **Skipping Founder self-approval checkpoints**
```
Plan → Build without recording a consequential scope or design decision
```
Problem: The Founder remains the decision authority; the checkpoint must not be skipped when a consequential decision is involved.

❌ **Vague deliverables**
```
"Feature is defined. Ready to move forward."
```
Problem: No specific deliverables, no location, no evidence.

---

## Best Practices

✅ **Always acknowledge role assignment**
Shows you understood the assignment.

✅ **Read role document first, every time**
Even if you've been this role before.

✅ **Check current sprint**
Understand phase context and objectives.

✅ **Stay in your role's lane**
Don't make decisions outside your authority.

✅ **Provide specific deliverables**
File paths, links, clear outputs.

✅ **Record consequential decisions explicitly**
"Decision requested: Record the [Plan/Build/Ship] checkpoint decision"

✅ **Escalate when uncertain**
Better to ask than make assumptions outside your scope.

---

## Checklist: Role Assignment Complete

- [ ] Role document read and understood
- [ ] Current sprint context checked
- [ ] Required input documents read
- [ ] Work executed according to role workflow
- [ ] Quality checks from role document completed
- [ ] Expected outputs produced
- [ ] Deliverables documented with locations
- [ ] Applicable Founder checkpoint completed
- [ ] Next hat identified

---

**Remember:** Wear one hat at a time. Read its procedure. Check the current sprint. Stay in scope. Produce quality outputs. Complete the applicable checkpoint and continue clearly.

**Roles are permanent, agents are temporary. Excellence through clarity.**
