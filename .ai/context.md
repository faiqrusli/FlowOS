# FlowOS AI Context

**Universal AI skills reference for FlowOS development (v2.0 — Solo Founder with 6-Hat Quality)**

This file provides core context for any AI (CLI, Cursor, Codex, WebStorm, etc.) working on FlowOS. Read this first, then reference specific skill files as needed.

---

## Product Identity

**What:** An operating system for self-direction — helping people turn chosen direction into deliberate action, learn from reality, and adapt with agency.

**Core Loop:** Direction → Commitment → Action → Evidence → Sensemaking → Adaptation

**Production:** https://flowos-sage.vercel.app

**Philosophy:**
- Execution before organization
- Evidence over narrative
- User authority over automation
- Deliberate adaptation, not automatic habits

---

## Current Status

**Phase:** Phase 1 — Establish Implementation Truth

**Current Sprint:** 2026-08-04 → 2026-08-08 (active)

**Status:** Active — Phase 1 sprint running (2026-08-04 → 2026-08-08)

**📋 Quick Reference:**
- **[Current Sprint](../docs/current-phase/current-sprint.md)** — What phase, what tasks, what status
- **[Phase 1](../docs/current-phase/phase-1/README.md)** — Current phase work (Gate 1)
- **[MVP Masterplan](../docs/current-phase/mvp-implementation-masterplan.md)** — Implementation roadmap

**Gate 1 Target:** For every admitted MVP domain, demonstrate the current behavior, data path, known gaps, and owner. Unknown status is not allowed to pass into implementation.

**Gate 0 (Phase 0):** PASSED — 2026-08-04. Phase 0 closed and archived to `docs/11-archive/phases/phase-0/`. See [D-003](../docs/08-decisions/records/D-003-pass-gate-0-and-authorize-phase-1.md).

**Phase 1 Focus (from MVP Masterplan):**
- Verify routes, entry points, data ownership, persistence, permissions, and current error/recovery behavior
- Reconcile the Feature Catalog with code and FEATURE_INVENTORY
- Reconcile V3/Tokyo Night Warm references, CSS tokens, component usage, legacy design
- Identify dead code, placeholder routes, duplicate scheduling surfaces, dual save paths, undocumented states
- Run baseline quality, accessibility, security, and production checks
- Create only the feature briefs and behavior contracts needed to describe admitted MVP behavior

**Phase 1 Status:** Active — sprint running 2026-08-04 → 2026-08-08.

---

## Development Workflow: Solo Founder with 6-Hat Quality Procedures

**FlowOS is developed by a solo founder using 6-role procedures for quality, without coordination overhead.**

**👉 Complete guide:** `docs/start-here/solo-founder-workflow.md`  
**👉 Quick reference:** `docs/start-here/how-to-develop-flowos.md`

### The Core Concept

**The 6 roles define WHAT quality work looks like.**  
**You execute all 6 roles yourself, in sequence, without approval delays.**

Think of roles as "hats" you wear:
- Each hat has specific responsibilities and deliverables
- You wear each hat in sequence
- You maintain the same quality standards
- But you don't wait for yourself to approve yourself

**The procedures stay. The coordination theater goes.**

### The 6 Hats (3 Modes)

**Mode 1: Plan (Product & Design Thinking)**
- **Hat 1: Product Architect** — Define WHAT to build and WHY (brief, contract)
- **Hat 2: Design Architect** — Define HOW it should look and feel (design spec)

**Mode 2: Build (Engineering)**
- **Hat 3: Engineering Architect** — Define HOW to build it technically (delivery design, validation plan)
- **Hat 4: Implementation Engineer** — BUILD it (code, tests, runbook)

**Mode 3: Ship (Release)**
- **Hat 5: Release Manager** — VERIFY and SHIP it (validation, deployment, release record)

**Hat 6: Founder** — Decide when uncertain (used during any hat as needed)

### Standard Major Feature Workflow

```
Hat 1 (Product Architect): Write feature brief + behavior contract
  ↓ (no approval, just move to next hat)
Hat 2 (Design Architect): Write design specification
  ↓
Hat 3 (Engineering Architect): Write delivery design + validation plan
  ↓
Hat 4 (Implementation Engineer): Build code + tests + runbook
  • Security checklist (6 points, non-negotiable)
  • Build + lint + test pass
  • Manual smoke test
  ↓
Hat 5 (Release Manager): Verify + Deploy + Document
  • Run validation plan checks
  • Merge to main
  • Deploy to production
  • Update FEATURE_INVENTORY + logs
  • Create release record
```

**Quality maintained through:**
- Wearing each hat's responsibilities (6-role procedures as checklists)
- Security checklist (always)
- Build/lint/test verification (always)
- Standards and patterns (CODE_STANDARDS, PRINCIPLES)
- Pattern matching (copy before inventing)

**Time savings vs. 6-person team:** 3-4 hours per major feature (17-20% faster) by eliminating approval delays while maintaining quality.

**Reference documents for each hat:** `docs/10-team/6-role-hats/[role-name].md` (defines responsibilities, quality checks, deliverables for each hat)

---

## Tech Stack

| Layer | Technology |
|-------|------------|
| Framework | Next.js App Router (latest — check docs before using APIs) |
| Frontend | React 19, TypeScript, Tailwind CSS |
| Backend | Supabase (PostgreSQL, Auth, RLS) |
| Deployment | Vercel |
| Design | Dark mode only (Tokyo Night Warm theme) |

**Important:** Always check Next.js docs in `node_modules/next/dist/docs/` — this version may differ from your training data.

---

## Documentation Architecture

**NEW STRUCTURE:** FlowOS uses a canonical numbered documentation system.

### Documentation Authority (When Conflicts — Higher Wins)

1. **`docs/00-constitution/Vision.md`** — Timeless philosophy, product boundaries (HIGHEST)
2. **`docs/current-phase/`** — **Current implementation phase work** (Sprint, MVP Masterplan, Gate checklists)
3. **`docs/00-constitution/documentation-architecture.md`** — Documentation governance
4. **`docs/01-product/`** — Product model, strategy, glossary, success model
5. **`docs/02-systems/`** — System definitions (direction, action, evidence, sensemaking, continuity, intelligence)
6. **`docs/03-experience/`** — Experience architecture, information structure, journey contracts
7. **`docs/04-features/`** — Feature briefs, behavior contracts, delivery designs, validation plans
8. **`docs/05-design/`** — Design system architecture, feature design specifications
9. **`docs/06-engineering/`** — Engineering architecture, standards, SDLC
10. **`docs/07-strategy-and-delivery/`** — Strategic planning, roadmap, delivery standards (timeless guidance)
11. **`docs/08-decisions/`** — Decision records
12. **`docs/12-deferred/evidence/`** — Research and measurements (deferred until post-Gate 0)
13. **`docs/09-reviews/`** — Review records
14. **`docs/10-team/`** — **Team organization, 6-role-hats quality procedures**
15. **`docs/current-phase/logs/`** — Operational logs
16. **`docs/00-constitution/governance/`** — PRINCIPLES, CODE_STANDARDS, GIT_WORKFLOW, GATES
17. **`docs/11-archive/`** — Historical reference only (DO NOT use for current work)

### Key Documents to Know

**Start here every day:**
- `docs/current-phase/current-sprint.md` — **Current sprint and phase work**
- `docs/current-phase/phase-1/README.md` — **Current phase work (Gate 1)**
- `docs/current-phase/mvp-implementation-masterplan.md` — **Implementation roadmap**

**Essential reading:**
- `docs/00-constitution/Vision.md` — Highest authority
- `docs/start-here/solo-founder-workflow.md` — **Complete 6-hat workflow**
- `docs/start-here/how-to-develop-flowos.md` — **Quick workflow reference**
- `docs/00-constitution/documentation-architecture.md` — Where everything belongs
- `docs/01-product/product-model.md` — Product concepts
- `docs/01-product/product-glossary.md` — Canonical vocabulary
- `docs/10-team/README.md` — **Team organization and 6-role-hats**
- `docs/10-team/6-role-hats/` — **Detailed hat procedures**
- `docs/start-here/founder.md` — Quick reference
- `docs/04-features/FEATURE_INVENTORY.md` — What's shipped vs deferred

**For working on FlowOS:**
- Read `docs/start-here/solo-founder-workflow.md` for complete 6-hat workflow
- Read `docs/start-here/how-to-develop-flowos.md` for quick reference
- Follow security checklist before every merge
- Check CODE_STANDARDS and PRINCIPLES

**Legacy documents (DO NOT start new work from these):**
- `docs/11-archive/strategy/execution-masterplan.md` — Historical milestone context (use MVP Masterplan instead)
- `docs/11-archive/execution/runbooks/m2-*.md` — Old M2 sessions (archived)
- `docs/11-archive/strategy/documentation-refinement-plan.md` — Completed (replaced by audit)
- `docs/11-archive/strategy/documentation-update-plan.md` — Completed (role ownership done)

---

## Current Sprint Context

**Always check:** `docs/current-phase/current-sprint.md` for current assignments.

**Phase 1 gate checklist:** `docs/current-phase/phase-1/gate-checklist.md` for completion criteria (scaffold created 2026-08-04; filled with the sprint).

**Phase 0 History (closed):**
- ✅ Solo-founder workflow with 6-hat quality procedures created
- ✅ Current-phase folder structure established
- ✅ Gate 0 PASSED 2026-08-04; Phase 0 archived to `docs/11-archive/phases/phase-0/`

**Gate 1 Progress:**
- Phase 1 sprint active (2026-08-04 → 2026-08-08)
- MVP Masterplan remains the implementation source
- Feature Catalog is the coverage map
- Implementation truth backlog (archived with Phase 0) is the starting question list

**Gate 1 Status:** In progress — sprint active (2026-08-04 → 2026-08-08).

---

## Who You're Assisting

**Role:** Founder building FlowOS with AI-first team structure

**Values:**
- Excellence through clarity, not process
- Evidence-based decisions
- Role-based organization (6 active roles)
- Sprint-based development
- Quality gates before proceeding

**Work Style:**
- Assigns specific role + task + inputs + expected outputs
- Expects role-appropriate work (stay in your lane)
- Reviews and approves before work proceeds
- Small, focused changes
- Documentation discipline

---

## Core Development Principles

### 1. 6-Hat Quality Workflow
**Solo founder wears 6 quality hats in sequence.**

**Complete guide:** `docs/start-here/solo-founder-workflow.md`

**The 6 hats (organized into 3 modes):**

**Mode 1: Plan**
- Hat 1: Product Architect (feature brief, behavior contract)
- Hat 2: Design Architect (design specification)

**Mode 2: Build**
- Hat 3: Engineering Architect (delivery design, validation plan)
- Hat 4: Implementation Engineer (code, tests, runbook)

**Mode 3: Ship**
- Hat 5: Release Manager (verification, deployment, release record)

**Hat 6: Founder (decision-making when uncertain)**

**Each hat has quality responsibilities. You wear all 6 yourself, in sequence, without approval delays.**

**Hat references:** `docs/10-team/6-role-hats/[role-name].md` defines responsibilities for each hat.

### 2. Sprint-Driven Work
**Work comes from the current sprint.**

- Check `docs/current-phase/current-sprint.md`
- Understand current phase
- Know sprint objectives
- Check gate checklist: `docs/current-phase/phase-1/gate-checklist.md`
- Align work with phase gate criteria
- Document progress

### 3. Quality Gates (Not Approval Gates)
**Quality maintained through verification, not self-approval.**

- Security checklist (6 points, non-negotiable)
- Build + lint + test pass
- Manual smoke test
- Pattern matching
- Standards compliance

**Never merge without verification. Never skip security checks.**

### 4. Feature Documentation (Feature Dossier Standard)
**Match documentation to feature complexity.**

**For major features (Today, Tasks, Focus, Schedule, Notes):**
- Use complete feature dossier structure
- Follow 6-hat workflow: Product Architect → Design Architect → Engineering Architect → Implementation Engineer → Release Manager
- Create: Feature brief, Behavior contract, Design specification, Delivery design, Validation plan, Implementation artifacts
- See: `docs/04-features/feature-dossier-standard.md` for complete lifecycle

**For medium features (4-16 hours):**
- Feature brief (1-2 pages)
- Code + tests
- Update FEATURE_INVENTORY

**For small features (< 4 hours):**
- Decision log entry only
- Code comments and commit messages

**Standard documents:**
- `docs/04-features/feature-briefs.md` — Brief standard
- `docs/04-features/behavior-contracts.md` — Contract standard
- `docs/05-design/feature-design-specifications.md` — Design spec standard
- `docs/04-features/delivery-designs.md` — Delivery design standard
- `docs/04-features/validation-plans.md` — Validation plan standard
- `docs/04-features/feature-dossier-standard.md` — Complete lifecycle guide

**Key principle:** Core features ARE FlowOS. Deep documentation enables coherent evolution over time.

### 5. Security First (Non-Negotiable)
**User data must be scoped. No shortcuts.**

- User-scoped database queries only
- No `using (true)` on user data
- RLS (Row Level Security) on all user tables
- Input validation always (Zod schemas)
- No hardcoded secrets
- Auth middleware on routes
- Error messages don't leak sensitive info

### 6. Pattern Matching
**Copy existing patterns before inventing new ones.**

- Check similar files in codebase
- Use existing utilities from `src/lib/`
- Match TypeScript types from `src/types/`
- Follow existing error handling
- Use semantic tokens from `globals.css`

### 7. Small, Focused Changes
**One logical change per commit.**

- No drive-by refactors
- No scope creep
- Match the touched area only
- Keep PRs reviewable

### 8. Git Workflow
**Branch first, approve before merge.**

- Branch naming: `[role]/[feature-name]` or `fix/[description]`
- Commit on branch
- `npm run build && npm run lint` must pass
- Request approval before merge
- **Never merge to main without Founder authorization**

---

## Project Structure

```
flowos/
├── .ai/                           # AI skills and workflows
├── docs/
│   ├── current-phase/             # **Current implementation phase** (Sprint, MVP Masterplan, Gate checklists, Logs)
│   ├── start-here/                # **Onboarding and workflow guides** (solo-founder-workflow, how-to-develop)
│   ├── 00-constitution/           # Vision + documentation & governance rules
│   ├── 01-product/                # Product model, strategy, glossary, success model
│   ├── 02-systems/                # System definitions
│   ├── 03-experience/             # Experience architecture
│   ├── 04-features/               # Feature briefs, contracts, FEATURE_INVENTORY
│   ├── 05-design/                 # Design system architecture
│   ├── 06-engineering/            # Engineering architecture, standards
│   ├── 07-strategy-and-delivery/  # Roadmap, delivery and release standards
│   ├── 08-decisions/              # Decision records
│   ├── 09-reviews/                # Review records
│   ├── 10-team/                   # **Team organization, 6-role-hats quality procedures**
│   ├── 12-deferred/               # Deferred docs (evidence, onboarding, team) — not active
│   └── 11-archive/                # Historical (DO NOT use)
├── src/
│   ├── app/(main)/                # Authenticated routes
│   ├── components/                # UI components
│   ├── lib/                       # Business logic, utilities
│   ├── hooks/                     # React hooks
│   ├── contexts/                  # React contexts
│   ├── types/                     # TypeScript types
│   └── middleware.ts              # Auth middleware
└── supabase/                      # SQL migration files
```

---

## Code Conventions

### File Organization

| Path | Purpose |
|------|---------|
| `src/app/(main)/` | Authenticated routes (server components default) |
| `src/components/ui/` | Shared primitives from shadcn/ui |
| `src/components/{feature}/` | Feature-specific UI components |
| `src/lib/` | Pure logic, utilities, Supabase helpers |
| `src/hooks/` | Custom React hooks |
| `src/contexts/` | React Context providers |
| `src/types/` | TypeScript types and interfaces |

### Naming Conventions

- **Files:** `kebab-case.ts` or `kebab-case.tsx`
- **Components:** `PascalCase`
- **Imports:** Use `@/` alias (e.g., `@/lib/utils`)
- **Functions:** `camelCase`
- **Constants:** `UPPER_SNAKE_CASE`

### React Best Practices

- **Server Components by default** — Only use `"use client"` when needed (hooks, events, browser APIs)
- **Logic in `lib/`, not duplicated in JSX**
- **Extend existing palettes** — Use `schedule-palette.ts`, `*-appearance.ts` for colors
- **No fake/placeholder shipped controls**

### Styling

- **Semantic tokens from `src/app/globals.css`:**
  - `bg-card`, `bg-background`, `bg-muted`
  - `text-foreground`, `text-muted-foreground`
  - `border-border`
- **Dark mode only** (Tokyo Night Warm theme)
- **Critical controls visible without hover**

### Security Checklist (Run Before Every Merge)

- [ ] User-scoped data access only (no `using (true)` on user data)
- [ ] Input validation present (Zod schemas)
- [ ] No hardcoded secrets or API keys
- [ ] RLS on new database tables
- [ ] Auth middleware on new API routes (new routes added to `PROTECTED_PREFIXES` in `middleware.ts`)
- [ ] Error messages don't leak sensitive information

---

## Git Workflow

### Branch Strategy

**`main` = production. Never push to main without Founder authorization.**

**Starting work:**
```powershell
git checkout main && git pull origin main
git checkout -b [role]/[feature-name]
# Example: implementation-engineer/inline-task-capture
```

**While working:**
- Commit on branch (multiple commits OK)
- Push branch to origin for backup (NOT main)
- Before requesting approval: `npm run build && npm run lint` must pass

**Before merge:**
1. Run `git diff main..branch` and review every change
2. Run `npm run build && npm run lint` — no new errors
3. Manual smoke test on changed flow
4. Submit for approval with evidence
5. **Wait for Founder authorization**

**After Founder authorizes:**
```powershell
git checkout main && git pull origin main
git merge <branch> --no-ff
npm run build && npm run lint
git push origin main
```

**Never merge without authorization. Ever.**

---

## Documentation Discipline

### When to Update What

| Event | Action |
|-------|--------|
| Product-level decision | Create decision record in `docs/08-decisions/records/` |
| Sprint work complete | Update `docs/current-phase/current-sprint.md` |
| Feature complete | Update `docs/04-features/FEATURE_INVENTORY.md` |
| After merge to main | Update the active `docs/current-phase/logs/august-log.md` |
| Technical/architecture change | Update relevant docs in `docs/06-engineering/` |

---

## AI Assistant Behavior Guidelines

### What to Do

✅ **Read your role document first**
When assigned a role, immediately read `docs/10-team/6-role-hats/[role-name].md`

✅ **Check current sprint**
Read `docs/current-phase/current-sprint.md` to understand context

✅ **Stay in your role's scope**
If assigned Implementation Engineer, don't make product decisions

✅ **Request approval at gates**
Product Architect → submit to Founder for approval before handoff

✅ **Provide evidence**
"Verified user-scoped queries in TaskService.ts" > "Security looks good"

✅ **Hand off explicitly**
State deliverables, completion status, next role, any blockers

✅ **Ask when uncertain**
Better to ask than make assumptions

### What NOT to Do

❌ **Never skip your role document**
Don't assume you know what the role does

❌ **Never skip approval gates**
Work requires approval before proceeding downstream

❌ **Never work outside your role**
Implementation Engineer shouldn't write feature briefs

❌ **Never merge without authorization**
Even if all checks pass, Founder must authorize

❌ **Never skip security checks**
Security is non-negotiable, no exceptions

❌ **Never use archived docs for new work**
`docs/11-archive/` is historical only

❌ **Never assume "should work"**
Verify everything with evidence

---

## Common Workflows

See detailed workflow files:
- `.ai/workflows/role-assignment.md` — How to start work when assigned a role
- `.ai/workflows/code-review.md` — How to review code before merge
- `.ai/workflows/merge-prep.md` — How to prepare a merge
- `.ai/workflows/documentation.md` — How to update documentation
- `.ai/checklists/security.md` — Security checklist

---

## Quality Philosophy

**Excellence through clarity, not process.**

Better to:
- ✅ Read role document and understand scope
- ✅ Check current sprint for context
- ✅ Follow approval gates
- ✅ Request approval before proceeding
- ✅ Ship simple, working code

Than to:
- ❌ Rush without understanding role
- ❌ Skip sprint context
- ❌ Work outside assigned scope
- ❌ Merge without authorization
- ❌ Ship complex, buggy code

---

## References

**Essential Reading:**
- `docs/00-constitution/Vision.md` — Product philosophy (highest authority)
- `docs/current-phase/mvp-implementation-masterplan.md` — Current implementation source
- `docs/current-phase/current-sprint.md` — Current sprint assignments
- `docs/start-here/solo-founder-workflow.md` — Complete 6-hat workflow
- `docs/10-team/6-role-hats/README.md` — Team structure
- `docs/00-constitution/governance/CODE_STANDARDS.md` — Coding standards
- `docs/00-constitution/governance/GIT_WORKFLOW.md` — Git workflow details

**Skill Files:**
- `.ai/workflows/` — Common development workflows
- `.ai/checklists/` — Pre-merge checklists
- `.ai/README.md` — AI skills system overview

---

**Remember:** You're part of a role-based AI-first team. Read your role document. Check current sprint. Stay in scope. Request approval. Ship quality work.

**Quality > Speed. Clarity > Process. Evidence > Opinion. Always.**
