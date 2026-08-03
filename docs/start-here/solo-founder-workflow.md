# Solo Founder Workflow Using 6-Role Procedures

**Status:** Active workflow for solo founder development  
**Last Updated:** 2026-08-03  
**Philosophy:** Use 6-role procedures for quality, execute as one person without handoff overhead  

---

## Core Principle

**The 6 roles define WHAT quality work looks like.**  
**You execute all 6 roles yourself, in sequence, without approval delays.**

**Think of roles as "hats" you wear:**
- Each hat has specific responsibilities and deliverables
- You wear each hat in sequence
- You maintain the same quality standards
- But you don't wait for yourself to approve yourself

**The procedures stay. The coordination theater goes.**

---

## The 6 Roles (Your 6 Hats)

| Role | What It Defines | Key Deliverable |
|------|-----------------|-----------------|
| **Product Architect** | WHAT to build and WHY | Feature brief, Behavior contract |
| **Design Architect** | HOW it should look and feel | Design specification |
| **Engineering Architect** | HOW to build it technically | Delivery design, Validation plan |
| **Implementation Engineer** | BUILD it | Working code + tests |
| **Release Manager** | VERIFY and SHIP it | Test results, Release |
| **Founder** | DECIDE when uncertain | Final decisions |

---

## Standard Feature Workflow (Solo Founder)

### For Major Features (Today, Tasks, Focus, etc.)

You work through all 6 hats in sequence, producing quality deliverables at each stage.

#### Hat 1: Product Architect

**Your responsibility:** Define what to build and why.

**Process:**
1. Read: Vision, Product Model, System documents
2. Create: Feature brief
   - Problem statement
   - User value
   - Success criteria
   - Scope boundaries (in/out)
3. Create: Behavior contract
   - Observable behavior
   - States and transitions
   - Error and recovery
   - Edge cases
4. Quality check: Does this align with Vision? Product Model?

**Deliverables:**
- `04-features/[feature]/feature-brief.md`
- `04-features/[feature]/behavior-contract.md`

**Time:** 4-8 hours for major features

**Reference:** `docs/10-team/6-role-hats/product-architect.md`

**When done:** Move to Design Architect hat (no waiting, no approval gate)

---

#### Hat 2: Design Architect

**Your responsibility:** Define how it should look and feel.

**Process:**
1. Read: Behavior contract (what you just wrote), Design System
2. Create: Design specification
   - Visual design for all states
   - Responsive behavior
   - Interaction patterns
   - Accessibility requirements
   - Content/copy
3. Quality check: Does this cover all behavior contract states? Design system consistent?

**Deliverables:**
- `04-features/[feature]/design/design-spec.md`

**Time:** 2-4 hours for major features

**Reference:** `docs/10-team/6-role-hats/design-architect.md`

**Review checkpoint:** As Design Architect, review your own work against the behavior contract you wrote as Product Architect. Any gaps?

**When done:** Move to Engineering Architect hat

---

#### Hat 3: Engineering Architect

**Your responsibility:** Define how to build it technically.

**Process:**
1. Read: Behavior contract, Design spec (what you just wrote), Engineering Architecture
2. Create: Delivery design
   - Technical approach
   - Data model changes
   - API contracts
   - Migration strategy
   - Risk assessment
3. Create: Validation plan
   - Test strategy
   - Quality checks
   - Acceptance criteria

**Deliverables:**
- `04-features/[feature]/implementation/[version]-delivery-design.md`
- `04-features/[feature]/validation/[version]-validation-plan.md`

**Time:** 2-4 hours for major features

**Reference:** `docs/10-team/6-role-hats/engineering-architect.md`

**When done:** Move to Implementation Engineer hat

---

#### Hat 4: Implementation Engineer

**Your responsibility:** Build it.

**Process:**
1. Read: Behavior contract, Design spec, Delivery design (what you wrote in previous hats)
2. Build:
   - Implement per delivery design
   - Follow CODE_STANDARDS
   - Write tests per validation plan
   - Document code
3. Quality checks:
   - Security checklist (6 points, non-negotiable)
   - Build + lint pass
   - Tests pass
   - Pattern matching followed

**Deliverables:**
- Working code
- Tests
- `04-features/[feature]/implementation/[version]-runbook.md` (what you built, how it works)

**Time:** Varies (main implementation work)

**Reference:** `docs/10-team/6-role-hats/implementation-engineer.md`

**When done:** Move to Release Manager hat

---

#### Hat 5: Release Manager

**Your responsibility:** Verify and ship it.

**Process:**
1. Read: Validation plan (what you wrote as Engineering Architect)
2. Test:
   - Run all quality checks from validation plan
   - Manual smoke test
   - Security verification
   - Accessibility check
3. Verify:
   - All acceptance criteria met
   - No blocking issues
   - Ready for production
4. Release:
   - Merge to main
   - Deploy to production
   - Verify production works
5. Document:
   - Update FEATURE_INVENTORY
   - Create release record
   - Update execution logs

**Deliverables:**
- `04-features/[feature]/validation/[version]-test-results.md`
- `04-features/[feature]/releases/[version]-release.md`
- Updated FEATURE_INVENTORY
- Updated execution logs

**Time:** 1-2 hours

**Reference:** `docs/10-team/6-role-hats/release-manager.md`

**When done:** Post-release learning (after real usage)

---

#### Hat 6: Founder (Decision Points)

**Your responsibility:** Decide when uncertain during any hat.

**When to use:**
- Product direction unclear (during Product Architect hat)
- Design tradeoffs exist (during Design Architect hat)
- Technical options exist (during Engineering Architect hat)
- Ready to ship? (during Release Manager hat)

**As Founder, you decide. Then put the relevant hat back on and continue.**

---

## Time Comparison

### Major Feature (e.g., Inline Task Capture)

**6-Role Team Approach:**
```
Product Architect: 4 hours work → Submit → Wait for approval
Design Architect: 3 hours work → Submit → Wait for approval
Engineering Architect: 2 hours work → Submit → Wait for approval
Implementation Engineer: 6 hours work → Submit → Wait for approval
Release Manager: 1.5 hours work → Submit → Wait for authorization

Total work: 16.5 hours
Coordination overhead: 3-4 hours (context switching, approval delays)
Total: 19.5-20.5 hours
```

**Solo Founder (You):**
```
Hat 1 (Product Architect): 4 hours → done, move to next hat
Hat 2 (Design Architect): 3 hours → done, move to next hat
Hat 3 (Engineering Architect): 2 hours → done, move to next hat
Hat 4 (Implementation Engineer): 6 hours → done, move to next hat
Hat 5 (Release Manager): 1.5 hours → done, ship

Total work: 16.5 hours
Coordination overhead: 0 hours
Total: 16.5 hours
```

**Savings: 3-4 hours per major feature (17-20%)**

**Same quality. Same deliverables. No waiting.**

---

## When to Wear Each Hat

### Every Feature Needs:

✅ **Hat 4 (Implementation Engineer)** — Always write code  
✅ **Hat 5 (Release Manager)** — Always verify and ship

### Most Features Need:

✅ **Hat 1 (Product Architect)** — Brief for medium+ features, contract for complex behavior

### Major Features Need:

✅ **All 5 hats** — Full dossier for Today, Tasks, Focus, Schedule, Notes

### Small Features (< 4 hours):

- Hat 4: Implement
- Hat 5: Verify and ship
- Decision log instead of formal brief

---

## Quality Maintained Through Roles

**Each role has quality responsibilities:**

**Product Architect hat ensures:**
- Feature aligns with Vision
- Scope is clear
- Behavior is well-defined

**Design Architect hat ensures:**
- All states designed
- Accessibility considered
- Design system consistent

**Engineering Architect hat ensures:**
- Technical approach sound
- Risks identified
- Validation planned

**Implementation Engineer hat ensures:**
- Security checklist passed
- Tests written
- Code follows standards

**Release Manager hat ensures:**
- All validation complete
- Production verified
- Documentation updated

**By wearing each hat, you maintain the quality standards of a 6-person team.**

---

## The Key Insight

**6-role structure answered the right question:**

> "What quality work needs to happen for a feature?"

Answer:
1. Product thinking (brief, contract)
2. Design thinking (spec)
3. Engineering thinking (delivery design)
4. Implementation (code)
5. Verification (testing)

**But it answered the wrong question:**

> "How should one person execute this work?"

Wrong answer: "Split into 6 people with approval gates"

**Right answer:** "One person wears 6 hats in sequence"

---

## Practical Example: Inline Task Capture

### Session 1: Product & Design Hats (Morning, 7 hours)

**Hat 1: Product Architect (4 hours)**
- Read: Vision, Product Model, Today behavior
- Write: `feature-brief.md` (2 hours)
- Write: `behavior-contract.md` (2 hours)
- Quality check: Aligns with Vision? ✅

**Hat 2: Design Architect (3 hours)**
- Read: Behavior contract, Design System
- Write: `design-spec.md` (2.5 hours)
- Quality check: All states covered? Design system consistent? ✅
- Review: Does design match behavior contract? ✅

**Lunch break. Two hats done.**

### Session 2: Engineering Hat (Afternoon, 2 hours)

**Hat 3: Engineering Architect (2 hours)**
- Read: Behavior contract, Design spec, Technical Architecture
- Write: `delivery-design.md` (1 hour)
- Write: `validation-plan.md` (1 hour)
- Quality check: Risks identified? Migration plan clear? ✅

**End of day 1. Three hats done. Ready to build.**

### Session 3: Implementation Hat (Next day, 6 hours)

**Hat 4: Implementation Engineer (6 hours)**
- Read: All specs from previous hats
- Build: Implement per delivery design
- Test: Write tests per validation plan
- Check: Security checklist ✅, Build/lint pass ✅
- Write: `v1.1-inline-capture-runbook.md`

**Four hats done. Ready to ship.**

### Session 4: Release Hat (30 min)

**Hat 5: Release Manager (30 min)**
- Run: All checks from validation plan
- Test: Manual smoke test
- Ship: Merge, deploy, verify production
- Document: Update FEATURE_INVENTORY, create release record

**Done. Feature shipped.**

**Total: 15.5 hours over 2 days. Zero waiting. Full quality.**

---

## Small Feature Example: Fix Button Alignment

**Hat 4: Implementation Engineer (30 min)**
- Fix alignment
- Test manually
- Security check (minimal risk)

**Hat 5: Release Manager (10 min)**
- Verify fix
- Deploy
- Log in execution log

**Total: 40 min. Decision log entry only.**

---

## Reference Documents

**For each hat, reference:**

| Hat | Reference Document |
|-----|-------------------|
| Product Architect | `docs/10-team/6-role-hats/product-architect.md` |
| Design Architect | `docs/10-team/6-role-hats/design-architect.md` |
| Engineering Architect | `docs/10-team/6-role-hats/engineering-architect.md` |
| Implementation Engineer | `docs/10-team/6-role-hats/implementation-engineer.md` |
| Release Manager | `docs/10-team/6-role-hats/release-manager.md` |
| Founder | `docs/10-team/6-role-hats/founder.md` |

**These documents define:**
- Responsibilities for each hat
- Quality standards
- Expected deliverables
- What to check

**Use them as checklists when wearing each hat.**

---

## Summary

**The 6 roles are quality procedures, not coordination overhead.**

**Use them as:**
- ✅ Quality checklists
- ✅ Deliverable templates
- ✅ Responsibility definitions
- ✅ "Hats" to wear in sequence

**Don't use them as:**
- ❌ Separate people
- ❌ Approval gates
- ❌ Handoff ceremonies
- ❌ Coordination overhead

**Wear each hat. Do the quality work. Move to the next hat. Ship.**

**Same standards. Same deliverables. Zero waiting.**
