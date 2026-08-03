# Start Here: Founder

**Audience:** You (the founder)  
**Purpose:** Quick reference for daily work  
**Last Updated:** 2026-08-03  

---

## Your Workflow

**👉 See: [How to Develop FlowOS](../start-here/how-to-develop-flowos.md)**

**Simple:** Plan → Build → Ship

- **Plan:** Decide what to build (5 min - 2 hours)
- **Build:** Implement with quality (varies)
- **Ship:** Deploy and document (30 min - 1 hour)

Quality maintained through checklists and standards, not process.

---

## Daily Reference

### What You Check Daily

1. **[Current Sprint](../current-phase/current-sprint.md)** — What phase am I in? What's the current task?
2. **[Gate Checklist](../current-phase/phase-1/gate-checklist.md)** — What needs to be done for Gate 1?
3. **[Vision](../00-constitution/Vision.md)** — When making product decisions
4. **[Product Principles](../00-constitution/governance/PRINCIPLES.md)** — Build/Defer/Reject test

### Before Every Merge

1. **Security Checklist** (`.ai/checklists/security.md`) — 6 non-negotiable checks
2. **Build + Lint + Test** — Must pass
3. **Manual Smoke Test** — Verify the changed flow works

### After Shipping

1. **Update [FEATURE_INVENTORY](../04-features/FEATURE_INVENTORY.md)** — If user-visible
2. **Log Decision** (`docs/08-decisions/`) — If consequential
3. **Update Sprint** ([Current Sprint](../current-phase/current-sprint.md)) — Track progress
4. **Brief Log Entry** (`docs/current-phase/logs/august-log.md`) — What shipped

---

## Feature Documentation Quick Guide

**Match documentation depth to feature complexity:**

### Small Features (< 4 hours)
**Documentation:**
- Decision log entry only (why, what, when)
- Code comments and commit messages

**Examples:** Fix button alignment, add keyboard shortcut, small UI polish

### Medium Features (4-16 hours)
**Documentation:**
- 1-page brief (problem, solution, scope, security)
- Code + tests
- Update FEATURE_INVENTORY

**Examples:** Inline task capture, keyboard navigation improvements

### Large/Major Features (> 16 hours)
**Documentation (Full feature dossier using all 6 hats):**
- **Hat 1 (Product Architect):** Feature brief + Behavior contract
- **Hat 2 (Design Architect):** Design specification
- **Hat 3 (Engineering Architect):** Delivery design + Validation plan
- **Hat 4 (Implementation Engineer):** Code + Tests + Runbook
- **Hat 5 (Release Manager):** Test results + Release record

**Why the depth matters:**
- Core features ARE FlowOS (Today, Tasks, Focus, Schedule, Notes)
- Will evolve over many cycles
- Need coherent improvement over time
- Future-you needs to understand decisions

**Standards:** See `docs/04-features/README.md` and individual standard docs in `docs/04-features/`

**Reference:** See `docs/10-team/6-role-hats/` for detailed responsibilities of each hat

---

## Working with AI

### Clear Instructions

✅ "Build inline task capture. Reference tasks/task-dialog.tsx. Run security checklist."

❌ "Make tasks better"

### Point to Standards

- **Design:** `docs/05-design/DESIGN_SYSTEM_V3.md`
- **Code:** `docs/00-constitution/governance/CODE_STANDARDS.md`
- **Security:** `.ai/checklists/security.md`
- **Git:** `docs/00-constitution/governance/GIT_WORKFLOW.md`

### Request Verification

- "Run security checklist"
- "Verify build and lint pass"
- "Review against CODE_STANDARDS"

---

## Essential Docs

| Need | Doc |
|------|-----|
| **Current phase work** | **[Current Sprint](../current-phase/current-sprint.md)** |
| **Gate 1 checklist** | **[Gate 1 Checklist](../current-phase/phase-1/gate-checklist.md)** |
| **MVP roadmap** | **[MVP Masterplan](../current-phase/mvp-implementation-masterplan.md)** |
| Product direction | [Vision](../00-constitution/Vision.md) |
| Product rules | [PRINCIPLES](../00-constitution/governance/PRINCIPLES.md) |
| What's shipped | [FEATURE_INVENTORY](../04-features/FEATURE_INVENTORY.md) |
| Code standards | [CODE_STANDARDS](../00-constitution/governance/CODE_STANDARDS.md) |
| Git workflow | [GIT_WORKFLOW](../00-constitution/governance/GIT_WORKFLOW.md) |
| Design system | [DESIGN_SYSTEM_V3](../05-design/DESIGN_SYSTEM_V3.md) |
| Tech stack | [TECHNICAL_ARCHITECTURE](../06-engineering/TECHNICAL_ARCHITECTURE.md) |
| Full workflow | [Solo Founder Workflow](../start-here/solo-founder-workflow.md) |
| Quick reference | [How to Develop FlowOS](../start-here/how-to-develop-flowos.md) |

---

## Quality Philosophy

**Excellence through clarity, not process.**

Quality comes from:
- ✅ Security checklist (always)
- ✅ Standards and patterns (CODE_STANDARDS, PRINCIPLES)
- ✅ Build/lint/test verification (always)
- ✅ Pattern matching (copy before inventing)

Not from:
- ❌ Approval gates where you approve yourself
- ❌ Role switching
- ❌ Heavy documentation for small features
- ❌ Coordination theater

---

## Historical Context

**Previously:** 6-role team structure with 5 approval gates per feature (archived Aug 2026)

**Now:** Simple 3-mode workflow

**Why:** You don't coordinate with yourself. Quality maintained through checklists and standards.

**Bring back when:** You hire team members and need actual coordination.

---

**Keep it simple. Build excellent software.**
