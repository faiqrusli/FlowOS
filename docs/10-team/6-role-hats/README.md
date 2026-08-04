# Active 6-Hat Procedures

**Status:** Production — Active solo-founder quality workflow  
**Authority:** These six hats are the current quality procedures; the three modes only group them for speed  
**Last Updated:** 2026-08-04  

---

## Purpose

This is the **active six-hat procedure set** used for FlowOS development.

The founder wears all six hats. Plan, Build, and Ship are a short execution grouping, not a replacement for the hats or their responsibilities.

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
6. Move to the next hat in the same working session; record a short self-review at the mode checkpoint

---

## Standard Workflow

### New Feature (three modes with quick self-approval)

```
PLAN: Product Architect → Design Architect
  ↓ quick Founder self-check: scope, behavior, design
BUILD: Engineering Architect → Implementation Engineer
  ↓ quick Founder self-check: delivery, security, tests
SHIP: Release Manager
  ↓ Founder release approval: evidence, production readiness
Production ────────── Feature shipped
```

**Key principle:** Keep the six-hat quality work and the Founder approval checkpoints, but make each checkpoint brief and decisive. There are no separate-agent handoffs or waiting periods when the founder is doing the work alone.

**Total flow:** 3 modes, 6 hats, and 3 short approval checkpoints (mode transitions plus release).

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
The Founder remains the decision authority. Self-approval is explicit but lightweight: review the mode outputs against the relevant contract and checklist, record the decision when consequential, and continue immediately when accepted.

**Escalations → Always to Founder**

**Sequential hat progression:**
1. Product Architect → Design Architect
2. Design Architect → Engineering Architect
3. Engineering Architect → Implementation Engineer
4. Implementation Engineer → Release Manager
5. Release Manager → Founder release decision

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

### Complete Feature Flow (three modes)

The Founder wears all six hats in one working session. The mode checkpoints are brief decisions, not separate handoffs.

**Plan — Hats 1–2: Product Architect → Design Architect**
```
Input: Founder direction, Vision, product and system docs
Output: Feature brief, behavior contract, design specification
Checkpoint: Founder approves scope, behavior, and design readiness
```

**Build — Hats 3–4: Engineering Architect → Implementation Engineer**
```
Input: Accepted Plan outputs and current implementation truth
Output: Delivery design, validation plan, code, tests, runbook
Checkpoint: Founder approves security, test evidence, and known gaps
```

**Ship — Hat 5, then Hat 6: Release Manager → Founder**
```
Input: Implementation, validation plan, behavior contract
Output: Test results, quality report, release plan, release record
Decision: Founder authorizes or rejects release from evidence and production readiness
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
