# Active 6-Role Configuration

**Status:** Production — Active Development Organization  
**Authority:** This is the current operational structure  
**Last Updated:** 2026-08-02  

---

## Purpose

This is the **active 6-role configuration** used for FlowOS development.

These 6 roles cover the complete SDLC with balanced specialization and manageable coordination.

---

## Active Roles

### Decision Layer
1. **[Founder](./founder.md)** (Human) — Final authority

### Coordination Layer
2. **[Product Architect](./product-architect.md)** — Product definition and strategy
3. **[Design Architect](./design-architect.md)** — Complete design ownership
4. **[Engineering Architect](./engineering-architect.md)** — Technical architecture

### Execution Layer
5. **[Implementation Engineer](./implementation-engineer.md)** — Full-stack development
6. **[Release Manager](./release-manager.md)** — Quality assurance and deployment

---

## Quick Start

### For Founder

To assign work to an AI agent:

```
You are the [Role Name] for FlowOS.
Read: docs/10-team/6-role-hats/[role-name].md
Assignment: [specific task]
Input documents: [links]
Expected output: [deliverables]
```

### For AI Agent

1. Read your role document
2. Understand your scope and authority
3. Read required input documents
4. Execute according to workflow
5. Produce expected outputs
6. Hand off to next role

---

## Standard Workflow

### New Feature (with Approval Gates)

```
Founder
  ↓ (assigns)
Product Architect ──── Feature brief + Behavior contract
  ↓ (submits for approval)
Founder ───────────── Approves
  ↓ (hands off)
Design Architect ───── Design specification
  ↓ (submits for review)
Product Architect ──── Reviews against behavior contract
  ↓ (submits for approval)
Founder ───────────── Approves
  ↓ (hands off)
Engineering Architect ─ Delivery design + Validation plan
  ↓ (submits for approval)
Founder ───────────── Approves
  ↓ (hands off)
Implementation Engineer ─ Working code + Tests
  ↓ (submits for approval)
Founder ───────────── Approves
  ↓ (hands off)
Release Manager ────── QA validation + Release plan
  ↓ (requests authorization)
Founder ───────────── Authorizes release
  ↓
Production ────────── Feature shipped
```

**Key principle:** Work is reviewed and approved by upstream roles before proceeding downstream.

**Total flow: 6 work stages + 5 approval gates**

---

## Role Quick Reference

| Role | What They Do | Key Outputs |
|------|-------------|-------------|
| **Founder** | Decide, approve, authorize | Decisions, approvals |
| **Product Architect** | Define product and strategy | Feature briefs, behavior contracts |
| **Design Architect** | Design UX and visual | Design specifications |
| **Engineering Architect** | Design technical approach | Delivery designs, validation plans |
| **Implementation Engineer** | Build features | Code, tests, docs |
| **Release Manager** | Test and deploy | Test results, releases |

---

## Authority Summary

| Decision | Who Decides | Who Recommends |
|----------|-------------|----------------|
| Product scope | Founder | Product Architect |
| Feature design | Founder | Design Architect |
| Technical architecture | Founder | Engineering Architect |
| Implementation approach | Implementation Engineer | Engineering Architect |
| Quality standards | Founder | Release Manager |
| Release authorization | Founder | Release Manager |

---

## Communication Paths

**Approval Flow Principle:**
All work must be approved by upstream roles before proceeding downstream:
- Product Architect → Founder approves → Design Architect
- Design Architect → Product Architect reviews → Founder approves → Engineering Architect
- Engineering Architect → Founder approves → Implementation Engineer
- Implementation Engineer → Founder approves → Release Manager
- Release Manager → Founder authorizes → Production

**Escalations → Always to Founder**

**Sequential handoffs (after approvals):**
1. Product Architect → Design Architect (after Founder approval)
2. Design Architect → Engineering Architect (after Product Architect review + Founder approval)
3. Engineering Architect → Implementation Engineer (after Founder approval)
4. Implementation Engineer → Release Manager (after Founder approval)
5. Release Manager → Founder (for release authorization)

**Clarifications:**
- Product questions → Product Architect
- Design questions → Design Architect
- Technical questions → Engineering Architect
- Quality questions → Release Manager

---

## When to Use Each Role

### Start: Product Architect
When: New feature, product change, strategy question

### Start: Design Architect
When: Design-only change, UX improvement

### Start: Engineering Architect
When: Architecture decision, technical standard change

### Start: Implementation Engineer
When: Bug fix, small implementation, code improvement

### Start: Release Manager
When: Release issue, quality concern, deployment problem

---

## Example Assignments

### Complete Feature Flow (with Approvals)

**1. Founder → Product Architect**
```
Role: Product Architect
Assignment: Define Inline Task Capture feature
Context: M2 Founder Daily Driver needs faster capture
Input: Vision.md, product-model.md, MVP Masterplan
Output: Feature brief + Behavior contract
Hand off to: Submit to Founder for approval, then Design Architect
```

**2. Product Architect → Founder (Approval Request)**
```
From: Product Architect
To: Founder
Status: Complete
Deliverables: Feature brief + Behavior contract
Decision Requested: Approve to hand off to Design Architect
```

**3. Founder → Design Architect (After Approval)**
```
Role: Design Architect
Assignment: Design Inline Task Capture UI/UX
Input: Feature brief (Founder approved), Behavior contract, Design system
Output: Complete design specification (states, responsive, interactions)
Hand off to: Submit to Product Architect for review, then Founder for approval
```

**4. Design Architect → Product Architect → Founder (Approval Request)**
```
From: Design Architect
To: Product Architect (review) → Founder (approval)
Status: Design complete
Deliverables: Design specification
Decision Requested: Approve to hand off to Engineering Architect
```

**5. Founder → Engineering Architect (After Approval)**
```
Role: Engineering Architect
Assignment: Design implementation approach for Inline Task Capture
Input: Behavior contract, Design spec (Founder approved), Engineering architecture
Output: Delivery design + Validation plan
Hand off to: Submit to Founder for approval, then Implementation Engineer
```

**6. Engineering Architect → Founder (Approval Request)**
```
From: Engineering Architect
To: Founder
Status: Delivery design complete
Deliverables: Delivery design + Validation plan
Decision Requested: Approve to hand off to Implementation Engineer
```

**7. Founder → Implementation Engineer (After Approval)**
```
Role: Implementation Engineer
Assignment: Implement Inline Task Capture
Input: Complete feature dossier (all Founder approved)
Output: Working implementation + Tests + Docs
Hand off to: Submit to Founder for approval, then Release Manager
```

**8. Implementation Engineer → Founder (Approval Request)**
```
From: Implementation Engineer
To: Founder
Status: Implementation complete
Deliverables: Implementation PR + Test results + Docs
Decision Requested: Approve to hand off to Release Manager
```

**9. Founder → Release Manager (After Approval)**
```
Role: Release Manager
Assignment: Test and release Inline Task Capture
Input: Implementation PR (Founder approved), Validation plan, Behavior contract
Output: Test results + Quality report + Release plan
Hand off to: Submit to Founder for release authorization
```

**10. Release Manager → Founder (Authorization Request)**
```
From: Release Manager
To: Founder
Status: Ready for release
Test results: All pass
Recommendation: Approve for production
Decision requested: Authorize release
```

**11. Founder → Release Manager (Authorization)**
```
Decision: Approved
Release Manager: Execute deployment per release plan
```

---

## This Configuration vs. Others

| Aspect | 4-Role | 6-Role (Active) | 11-Role |
|--------|--------|-----------------|---------|
| Roles | 4 | **6** | 11 |
| Handoffs | 4 | **6** | 8+ |
| Specialization | Low | **Medium** | High |
| Coordination | Simple | **Balanced** | Complex |
| Best for | Testing | **Active development** | Mature org |

**6-role balances simplicity with specialization.**

---

## Migration

**From 4-role:**
- Split Product Architect into Product + Design
- Split Engineering Lead into Architecture + Implementation
- Keep Release as combined QA + Deployment

**To 8-role:**
- Split Product into Product + Strategy
- Split Release into QA + Release
- Add Documentation Architect if needed

**To 11-role:**
- Add Planning Lead
- Add UX Architect separate from Design
- Split Engineering into specialized roles
- Full organizational maturity

---

## Success Metrics

Track effectiveness:
- **Speed:** Feature idea → shipped (target: 1-2 weeks)
- **Quality:** Bugs escaping to production (target: < 5%)
- **Clarity:** Escalations due to ambiguity (target: < 10%)
- **Handoff quality:** Issues found at next stage (target: < 20%)

---

## Team Principles

All roles follow the [12 Team Principles](../team-principles.md):

1. Roles are permanent, agents are temporary
2. Founder has final authority
3. Clarity over speed
4. Contracts before implementation
5. Evidence over opinion
6. Explicit handoffs, zero gaps
7. Authority follows responsibility
8. Conflicts escalate, never hidden
9. Quality is built-in, not bolted on
10. Document to enable, not to cover
11. Preserve history, correct forward
12. Scale through clarity, not process

---

## Getting Started

**Today, you can:**

1. Assign any of the 6 roles to an AI conversation
2. Use the standard workflow for features
3. Start building FlowOS with clear structure
4. Scale to more roles only when needed

**Read the individual role documents for complete details.**

**This is your active development organization. Use it to build FlowOS.**
