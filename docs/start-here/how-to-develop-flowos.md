# How to Develop FlowOS

**Status:** Active workflow guide for solo founder development  
**Audience:** Founder, AI assistants  
**Replaces:** 6-role team structure (archived Aug 2026)  
**Last Updated:** 2026-08-03  

---

## Philosophy

**You're building a product, not managing a team.**

FlowOS development uses a simple **3-mode workflow**: Plan → Build → Ship.

No role switching. No approval gates where you approve yourself. No coordination theater.

Just excellent software with quality maintained through checklists and standards, not process.

---

## The 3-Mode Workflow (with 6-Hat Quality Procedures)

**FlowOS uses 6-role procedures for quality, executed by you without coordination overhead.**

**Think of modes as phases, and roles as "quality hats" within each phase:**

### Mode 1: Plan (Product & Design Thinking)

**Wear 2 hats:**

**Hat 1: Product Architect**
- Define WHAT to build and WHY
- Create feature brief and behavior contract
- Time: 4-8 hours for major features

**Hat 2: Design Architect**
- Define HOW it should look and feel
- Create design specification
- Time: 2-4 hours for major features

**Output:** Complete planning docs (brief, contract, design spec)

### Mode 2: Build (Engineering)

**Wear 2 hats:**

**Hat 3: Engineering Architect**
- Define HOW to build it technically
- Create delivery design and validation plan
- Time: 2-4 hours for major features

**Hat 4: Implementation Engineer**
- BUILD it
- Implement, test, document
- Time: Varies

**Output:** Working code + tests + runbook

### Mode 3: Ship (Release)

**Wear 1 hat:**

**Hat 5: Release Manager**
- VERIFY and SHIP it
- Run validation, deploy, document
- Time: 1-2 hours

**Output:** Production deployment + release record

**Complete workflow:** `docs/start-here/solo-founder-workflow.md`

**The 6 hats define quality procedures. You execute all 6 yourself, in sequence, without approval delays.**

---

## Feature Documentation (Matched to Complexity)

**Core principle:** Deep understanding of major features is essential.

### Small Features (< 4 hours)

**Documentation:**
- Decision log entry only (why, what, when)
- Code comments and commit messages

**Example:** Fix button alignment, add keyboard shortcut, small UI polish

### Medium Features (4-16 hours)

**Documentation:**
- 1-page brief (problem, solution, scope, security)
- Code + tests
- Update FEATURE_INVENTORY

**Example:** Inline task capture, keyboard navigation improvements

### Large/Major Features (> 16 hours)

**Documentation:**
- **Full feature dossier** (for core FlowOS surfaces like Today, Tasks, Focus)
  - Feature brief (why, scope, approach)
  - Behavior contract (how it works, states, actions, edge cases)
  - Design specification (UI states, interactions, accessibility)
  - Delivery design (architecture, data model, risks)
  - Validation plan (test cases, acceptance criteria)

**Why the depth matters:**
- Core features ARE FlowOS
- Will evolve over many cycles
- Need coherent improvement over time
- Future-you needs to understand decisions

**Example:** Today page, Tasks board, Focus mode, Schedule planner

**Standards:** See `docs/04-features/README.md` and individual standard docs:
- `feature-briefs.md`
- `behavior-contracts.md`
- `feature-design-specifications.md` 
- `delivery-designs.md`
- `validation-plans.md`

**Key change from 6-role approach:** You write all the docs (no handoffs, no approval gates), but you still write them for major features.

---

## Quality Standards (Always Required)

### Security Checklist (Non-Negotiable)

Before every merge, verify:

1. User-scoped data access — No using(true), proper auth.uid() filtering
2. Input validation — Zod schemas, server-side validation
3. No hardcoded secrets — Environment variables only
4. Row Level Security (RLS) — On all user data tables
5. Auth middleware — Routes protected by auth
6. Safe error messages — Generic to client, detailed server-only

Full checklist: .ai/checklists/security.md

### Build Quality

- npm run build passes
- npm run lint no new errors
- Tests pass (if tests exist)
- Manual smoke test of changed flow

### Code Quality

- Pattern matching first — Copy similar existing files before inventing
- Small focused changes — One logical change per commit
- No scope creep — Match the touched area only
- Error handling — Don't ignore errors, handle gracefully

---

## Working with AI Assistants

### Clear Instructions

Good: "Build inline task capture on Today page. Reference similar pattern in tasks/task-dialog.tsx. Must pass security checklist before merge."

Bad: "Make tasks better"

### Point to Standards

- Design: docs/05-design/DESIGN_SYSTEM_V3.md
- Code: docs/00-constitution/governance/CODE_STANDARDS.md
- Security: .ai/checklists/security.md
- Git: docs/00-constitution/governance/GIT_WORKFLOW.md

### Request Verification

- "Run security checklist"
- "Verify build and lint pass"
- "Review against CODE_STANDARDS"

### AI Context

AI assistants read .ai/context.md for comprehensive guidance.

---

## Sprint & Task Management

### Lightweight Sprint Docs

Use docs/current-phase/current-sprint.md for:
- Current phase (Phase 0, 1, 2, etc.)
- Active tasks
- Gate criteria
- Completion tracking

Keep it simple: Task list + phase context. No role assignments, no approval gates.

### Daily Logging

Use docs/current-phase/logs/august-log.md (or current month) for:
- What was built
- What shipped
- Key decisions
- Blockers resolved

After shipping: Brief entry (2-3 sentences) of what went to production.

---

## Decision Making

### When to Log Decisions

Always log:
- Consequential product choices (Build/Defer/Reject features)
- Architecture changes affecting multiple modules
- Changes to core behavior
- Breaking changes

Don't need to log:
- Bug fixes
- Small improvements
- Implementation details
- Routine maintenance

### Decision Format

Use docs/08-decisions/decision-records.md standard. Keep it brief: 1 page max per decision.

---

## What This Replaces

Archived (Aug 2026):
- 6-role team structure (Founder, Product Architect, Design Architect, Engineering Architect, Implementation Engineer, Release Manager)
- 5 approval gates per feature
- Heavy role documentation (81KB)
- Role-based workflows
- Approval ceremonies

Why simplified:
- You don't coordinate with yourself
- Approval gates are self-approval theater
- Quality maintained through checklists, not process
- Faster iteration while maintaining standards

Bring back when:
- You hire team members
- You need actual coordination
- External approvals required

Until then: Plan → Build → Ship with quality maintained through standards.

---

## Quick Reference

| Need | See |
|------|-----|
| Product direction | docs/00-constitution/Vision.md |
| Product principles | docs/00-constitution/governance/PRINCIPLES.md |
| What's shipped | docs/04-features/FEATURE_INVENTORY.md |
| Code standards | docs/00-constitution/governance/CODE_STANDARDS.md |
| Security checklist | .ai/checklists/security.md |
| Git workflow | docs/00-constitution/governance/GIT_WORKFLOW.md |
| Design system | docs/05-design/DESIGN_SYSTEM_V3.md |
| Tech architecture | docs/06-engineering/TECHNICAL_ARCHITECTURE.md |
| Current sprint | docs/current-phase/current-sprint.md |
| MVP phases | docs/current-phase/mvp-implementation-masterplan.md |
| AI guidance | .ai/context.md |

---

## Summary

Simple workflow:
1. Plan: Decide what to build (5 min - 2 hours)
2. Build: Implement with quality (varies)
3. Ship: Deploy and document (30 min - 1 hour)

Quality maintained through:
- Security checklist (always)
- Build/lint/test verification (always)
- Pattern matching (copy before inventing)
- Standards and conventions

Documentation matched to complexity:
- Small: Decision log only
- Medium: 1-page brief
- Large: 2-page brief + optional notes

No coordination theater. Just excellent software.
