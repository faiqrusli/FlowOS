# Implementing a Feature: Quick-Start Guide

**For:** Anyone implementing a new feature or iterating on an existing one
**Time to read:** 10 minutes
**Last updated:** 2026-08-01

---

## Before You Start

**Have you checked?**
- [ ] Feature is admitted to MVP in [feature-catalog.md](../04-features/feature-catalog.md)
- [ ] You're in the right MVP phase in [mvp-implementation-masterplan.md](../07-strategy-and-delivery/mvp-implementation-masterplan.md)
- [ ] You understand the [product model](../01-product/product-model.md)

**If no to any:** Stop and resolve first.

---

## The 10-Phase Flow

```
Plan → Design → Prepare → Build → Test → Review → Ship → Observe → Learn → Adapt
```

---

## Phase 1: Plan (Feature Brief & Contract)

### What You're Creating
- `docs/04-features/<feature-name>/feature-brief.md`
- `docs/04-features/<feature-name>/behavior-contract.md`

### Steps
1. **Create the dossier folder:**
   ```bash
   mkdir docs/04-features/<feature-name>
   ```

2. **Copy templates:**
   ```bash
   cp docs/04-features/_templates/feature-brief-template.md docs/04-features/<feature-name>/feature-brief.md
   cp docs/04-features/_templates/behavior-contract-template.md docs/04-features/<feature-name>/behavior-contract.md
   ```

3. **Write the brief** ([standard](../04-features/feature-briefs.md)):
   - Why this feature?
   - Who needs it?
   - What outcome?
   - What's in scope / out of scope?
   - Success criteria

4. **Write the behavior contract** ([standard](../04-features/behavior-contracts.md)):
   - What must it do?
   - What states exist?
   - What rules govern behavior?
   - What edge cases?
   - Accessibility requirements

5. **Get approval:**
   - Product leadership reviews brief
   - Team reviews contract
   - Decision: Proceed or defer

### Exit Criteria
- [ ] Feature brief approved
- [ ] Behavior contract approved
- [ ] Feature added to feature-catalog.md as "Admitted"

---

## Phase 2: Design

### What You're Creating
- `docs/04-features/<feature-name>/design/<feature>-design-spec.md`
- `docs/04-features/<feature-name>/design/<feature>-accessibility-spec.md`
- `docs/04-features/<feature-name>/design/<feature>-content-spec.md`

### Steps
1. **Create design subfolder:**
   ```bash
   mkdir docs/04-features/<feature-name>/design
   ```

2. **Write design specs:**
   - Visual design (layout, components, tokens)
   - Accessibility (keyboard nav, screen readers, WCAG)
   - Content (labels, errors, empty states)

3. **Reference:**
   - [Design System Architecture](../05-design/design-system-architecture.md)
   - [Design Implementation Map](../05-design/design-implementation-map.md)
   - Tokyo Night Warm palette

### Exit Criteria
- [ ] Design specs complete
- [ ] Designs use design system components
- [ ] Accessibility requirements clear
- [ ] Content standards followed

---

## Phase 3: Prepare Implementation

### What You're Creating
- `docs/04-features/<feature-name>/implementation/delivery-design.md`
- `docs/04-features/<feature-name>/implementation/<feature>-v1-runbook.md`
- `docs/04-features/<feature-name>/validation/validation-plan.md`

### Steps
1. **Create subfolders:**
   ```bash
   mkdir docs/04-features/<feature-name>/implementation
   mkdir docs/04-features/<feature-name>/validation
   ```

2. **Copy templates:**
   ```bash
   cp docs/04-features/_templates/delivery-design-template.md docs/04-features/<feature-name>/implementation/delivery-design.md
   cp docs/04-features/_templates/runbook-template.md docs/04-features/<feature-name>/implementation/<feature>-v1-runbook.md
   cp docs/04-features/_templates/validation-plan-template.md docs/04-features/<feature-name>/validation/validation-plan.md
   ```

3. **Write delivery design** ([standard](../04-features/delivery-designs.md)):
   - Technical architecture
   - Database changes
   - API endpoints
   - Integration points
   - Rollback plan

4. **Write runbook:**
   - Step-by-step implementation instructions
   - Prerequisites
   - Exit criteria
   - Database setup
   - API implementation
   - Component implementation
   - Tests

5. **Write validation plan** ([standard](../04-features/validation-plans.md)):
   - Test cases
   - Acceptance criteria
   - How to verify behavior matches contract

### Exit Criteria
- [ ] Delivery design approved
- [ ] Runbook complete and clear
- [ ] Validation plan covers all behavior contract requirements

---

## Phase 4: Build

### What You're Doing
Implementing in `src/` following the runbook.

### Steps
1. **Follow the runbook step-by-step:**
   - Database setup
   - API implementation
   - Components
   - Integration
   - Tests

2. **Update docs if behavior changes:**
   - If you discover the behavior contract is wrong → Update it
   - Record why in a decision record

3. **Write tests as you go:**
   - Unit tests
   - Integration tests
   - E2E tests

### Exit Criteria
- [ ] All runbook steps complete
- [ ] Code matches behavior contract
- [ ] Tests written (not necessarily passing yet)

---

## Phase 5: Test

### What You're Creating
- `docs/04-features/<feature-name>/validation/test-results-v1.md`

### Steps
1. **Copy template:**
   ```bash
   cp docs/04-features/_templates/test-results-template.md docs/04-features/<feature-name>/validation/test-results-v1.md
   ```

2. **Run validation plan:**
   - Execute all test cases
   - Document results
   - Screenshot evidence
   - Note any failures

3. **Fix failures and re-test:**
   - Fix code
   - Re-run tests
   - Update test-results.md

### Exit Criteria
- [ ] All tests passing
- [ ] Test results documented
- [ ] Behavior matches contract

---

## Phase 6: Review

### What You're Creating
- `docs/04-features/<feature-name>/validation/acceptance-checklist-v1.md`
- `docs/04-features/<feature-name>/reviews/design-review-YYYY-MM-DD.md`
- `docs/04-features/<feature-name>/reviews/security-review-YYYY-MM-DD.md`
- `docs/04-features/<feature-name>/reviews/accessibility-review-YYYY-MM-DD.md`
- `docs/04-features/<feature-name>/reviews/acceptance-review-YYYY-MM-DD.md`

### Steps
1. **Create reviews subfolder:**
   ```bash
   mkdir docs/04-features/<feature-name>/reviews
   ```

2. **Copy templates:**
   ```bash
   cp docs/04-features/_templates/acceptance-checklist-template.md docs/04-features/<feature-name>/validation/acceptance-checklist-v1.md
   cp docs/04-features/_templates/review-template.md docs/04-features/<feature-name>/reviews/design-review-YYYY-MM-DD.md
   # Repeat for security, a11y, acceptance reviews
   ```

3. **Fill acceptance checklist:**
   - Behavior contract compliance
   - Design compliance
   - Accessibility compliance
   - Security compliance
   - Performance
   - Browser compatibility
   - Documentation complete

4. **Get formal reviews:**
   - Design review
   - Security review
   - Accessibility review
   - Final acceptance review

5. **Fix any issues found:**
   - Update code
   - Re-test
   - Update test results

### Exit Criteria
- [ ] Acceptance checklist complete
- [ ] All reviews approved
- [ ] Ready to ship

---

## Phase 7: Ship

### What You're Creating
- `docs/04-features/<feature-name>/releases/v1.0-release-YYYY-MM-DD.md`

### Steps
1. **Create releases subfolder:**
   ```bash
   mkdir docs/04-features/<feature-name>/releases
   ```

2. **Copy template:**
   ```bash
   cp docs/04-features/_templates/release-template.md docs/04-features/<feature-name>/releases/v1.0-release-YYYY-MM-DD.md
   ```

3. **Fill release record:**
   - What's being released
   - Deployment sequence
   - Rollback plan
   - Monitoring setup
   - On-call details

4. **Deploy:**
   - Database migrations
   - API deployment
   - Frontend deployment
   - Smoke tests
   - Monitoring check

5. **Verify deployment:**
   - Feature accessible
   - No error spikes
   - Performance normal

### Exit Criteria
- [ ] Deployed to production
- [ ] Release record complete
- [ ] Monitoring confirmed normal
- [ ] No critical issues

---

## Phase 8: Observe

### What You're Doing
Watching real usage for 7-14 days.

### Steps
1. **Monitor metrics:**
   - Error rates
   - Performance
   - User adoption
   - Usage patterns

2. **Collect feedback:**
   - User comments
   - Support tickets
   - Bug reports

3. **Track incidents:**
   - Any errors?
   - Any crashes?
   - Any confusion?

### Exit Criteria
- [ ] 7-14 days of observation complete
- [ ] Sufficient usage data collected
- [ ] Incidents documented (if any)

---

## Phase 9: Learn

### What You're Creating
- `docs/04-features/<feature-name>/post-release/v1-learning-record.md`
- `docs/04-features/<feature-name>/post-release/v1-incident-log.md` (if issues occurred)
- `docs/04-features/<feature-name>/post-release/v1-usage-evidence.md` (optional)

### Steps
1. **Create post-release subfolder:**
   ```bash
   mkdir docs/04-features/<feature-name>/post-release
   ```

2. **Copy template:**
   ```bash
   cp docs/04-features/_templates/learning-record-template.md docs/04-features/<feature-name>/post-release/v1-learning-record.md
   ```

3. **Write learning record:**
   - Did we meet success criteria?
   - What worked?
   - What didn't work?
   - What surprised us?
   - What should we do next?

4. **Analyze evidence:**
   - Usage metrics
   - User feedback
   - Technical performance
   - Integration health

5. **Make recommendations:**
   - Expand (evidence positive)
   - Simplify (too complex)
   - Fix (broken)
   - Defer (not enough evidence)
   - Retire (harmful)

### Exit Criteria
- [ ] Learning record complete
- [ ] Evidence-based recommendations made
- [ ] Next actions identified

---

## Phase 10: Adapt

### What You're Doing
Based on learning, decide next steps.

### Options

#### Option A: Expand (Add Capability)
```bash
# Update behavior contract
# Create new runbook
cp docs/04-features/_templates/runbook-template.md docs/04-features/<feature-name>/implementation/<feature>-v1.1-runbook.md

# Create decision record
mkdir docs/04-features/<feature-name>/decisions
# Write decision record explaining why expanding

# Repeat phases 4-9
```

#### Option B: Simplify (Reduce Complexity)
```bash
# Create decision record
# Update behavior contract (remove complexity)
# Create new runbook for simplified version
# Repeat phases 4-9
```

#### Option C: Fix (Repair Issues)
```bash
# For small fixes: just update code
# For behavior changes: update behavior contract first
# Create hotfix release record
```

#### Option D: Defer (Wait for More Evidence)
```bash
# Update feature-catalog.md: mark as "Deferred"
# Set re-evaluation trigger
# Move to next priority
```

#### Option E: Retire (Not Useful)
```bash
# Create decision record explaining why
# Plan graceful removal
# Update feature-catalog.md
# Archive dossier
```

---

## Quick Reference Checklist

### Planning
- [ ] Create dossier folder
- [ ] Write feature brief
- [ ] Write behavior contract
- [ ] Get approval

### Design
- [ ] Create design/ subfolder
- [ ] Write design specs
- [ ] Write accessibility spec
- [ ] Write content spec

### Implementation Prep
- [ ] Create implementation/ subfolder
- [ ] Create validation/ subfolder
- [ ] Write delivery design
- [ ] Write runbook
- [ ] Write validation plan

### Build
- [ ] Follow runbook
- [ ] Implement code
- [ ] Write tests

### Test
- [ ] Run validation plan
- [ ] Document test results
- [ ] Fix failures

### Review
- [ ] Create reviews/ subfolder
- [ ] Fill acceptance checklist
- [ ] Get design review
- [ ] Get security review
- [ ] Get a11y review
- [ ] Get acceptance review

### Ship
- [ ] Create releases/ subfolder
- [ ] Write release record
- [ ] Deploy
- [ ] Verify

### Learn
- [ ] Observe 7-14 days
- [ ] Create post-release/ subfolder
- [ ] Write learning record
- [ ] Make recommendations

### Adapt
- [ ] Based on evidence, choose:
  - Expand
  - Simplify
  - Fix
  - Defer
  - Retire

---

## Common Questions

### Q: Do I create all folders at once?
**A:** No. Create folders only when you have documents for them. Start with just the root folder and feature-brief.md.

### Q: When do I update the behavior contract?
**A:** When the required behavior changes. Small bug fixes don't need contract updates. New capabilities do.

### Q: What if implementation reveals the contract is wrong?
**A:** Update the contract, create a decision record explaining why, then implement against the updated contract.

### Q: How many runbooks per feature?
**A:** One per major version/iteration. Don't update old runbooks; create new ones (v1, v1.1, v2, etc.).

### Q: When do I create a decision record?
**A:** When you make a consequential choice that affects the feature's direction, scope, or design approach.

---

## Templates You'll Need

| Phase | Template |
|---|---|
| Planning | feature-brief-template.md, behavior-contract-template.md |
| Design | (create your own design/a11y/content specs) |
| Prep | delivery-design-template.md, runbook-template.md, validation-plan-template.md |
| Test | test-results-template.md |
| Review | acceptance-checklist-template.md, review-template.md |
| Ship | release-template.md |
| Learn | learning-record-template.md |

**All templates:** `docs/04-features/_templates/`

---

## Further Reading

- [Feature Dossier Standard](../04-features/feature-dossier-standard.md) — Complete structure details
- [Complete Feature Dossier Lifecycle](./complete-feature-dossier-lifecycle.md) — Detailed guide with examples
- [Evidence and Dossiers Explained](./evidence-and-dossiers-explained.md) — Evidence-based development
- [Understanding the New Documentation](./understanding-the-new-documentation.md) — System overview

---

## Need Help?

**Stuck on where something goes?**
1. Check [Feature Dossier Standard](../04-features/feature-dossier-standard.md)
2. Check [Documentation Architecture](../00-constitution/documentation-architecture.md)
3. Ask: "What kind of knowledge is this?" → Go to that layer

**Feature not admitted yet?**
- Check [Feature Catalog](../04-features/feature-catalog.md)
- If deferred, don't start building
- If needs admission, propose to product leadership

**Not sure what MVP phase you're in?**
- Check [MVP Implementation Masterplan](../07-strategy-and-delivery/mvp-implementation-masterplan.md)
- Don't work ahead of current phase gate

---

**Remember:** The dossier is the complete story of your feature from birth to current state. Build it progressively, document decisions, learn from evidence, and adapt based on reality. 🚀
