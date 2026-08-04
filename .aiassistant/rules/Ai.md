---
apply: always
---

# FlowOS AI Assistant Rules (WebStorm)

**This file is read automatically by WebStorm AI Assistant.**

---

## 🚨 CRITICAL: Read These First (In Order)

**Before starting ANY work:**

1. **`.ai/context.md`** ← START HERE
   - Product identity, tech stack, 6-hat workflow
   - Current Phase 1 status and objectives
   - Documentation authority hierarchy
   - Core development principles

2. **`docs/current-phase/current-sprint.md`** ← Current sprint
   - Phase 1 assignments per role
   - Gate 1 criteria
   - What's in/out of scope

3. **`docs/10-team/6-role-hats/[your-role].md`** ← Your role (if assigned)
   - Your mission and responsibilities
   - Your authority and limitations
   - Your inputs and outputs

**Then use as needed:**
- `.ai/workflows/role-assignment.md` — How to start when assigned a role
- `.ai/checklists/security.md` — 6-point security checklist (before every merge)
- `.ai/checklists/quality.md` — Build, lint, test verification
- `.ai/testing-guide.md` — How to run tests (npm test, vitest, build, lint)
- `.ai/sprint-context.md` — Quick reference for current sprint

---

## Quick Context

**Product:** FlowOS — Operating system for self-direction  
**Core Loop:** Direction → Commitment → Action → Evidence → Sensemaking → Adaptation  
**Stack:** Next.js App Router, React 19, TypeScript, Tailwind CSS, Supabase, Vercel  
**Production:** https://flowos-sage.vercel.app  

**Current Phase:** Phase 1 — Establish Implementation Truth  
**Current Sprint:** 2026-08-04 → 2026-08-08 (Phase 1 sprint active)  
**Gate 1 Target:** Every admitted MVP domain demonstrable (current behavior, data path, known gaps, owner)  
**Progress:** Phase 0 CLOSED — Gate 0 PASSED 2026-08-04; Phase 1 authorized (D-003)  
**Decision:** D-003 — Pass Gate 0 and Authorize Phase 1

**Team:** Six authoritative hats grouped into Plan, Build, and Ship — solo founder wears all hats

---

## Core Principles

1. **Role-Based Execution** — You are ONE role, stay in scope
2. **Sprint-Driven Work** — Check current sprint for Phase 1 context
3. **Approval Checkpoints** — Founder self-approves scope/design, build quality, and release evidence
4. **Security Non-Negotiable** — 6-point checklist every merge
5. **Pattern Matching** — Copy similar files before inventing
6. **Small Focused Changes** — One logical change per commit

---

## Security Checklist (Always Run Before Merge)

- [ ] User-scoped data access only (no `using (true)` on user data)
- [ ] Input validation present (runtime schema validation, e.g. see `.ai/checklists/security.md`)
- [ ] No hardcoded secrets or API keys
- [ ] RLS on new database tables
- [ ] Auth middleware on new API routes
- [ ] Error messages don't leak sensitive information

**Full checklist:** `.ai/checklists/security.md`

---

## Quality Checklist (Always Run Before Merge)

```bash
# Build verification
npm run build

# Lint check
npm run lint

# Run tests
npm test

# Manual testing
npm run dev
# Test happy path + edge cases + errors
```

**Full checklist:** `.ai/checklists/quality.md`

---

## Git Workflow

**Work happens on parallel branches off `main`, each owned by an agent or the Founder, each in its own worktree** so tasks never collide:
```
main
├── feature/<module>-<feature>   Agent A
├── experiment/<topic>           spike
└── shared/<scope>               shared code/config
```

**Branch naming convention (required):**
- `feature/<module>-<feature>` — e.g. `feature/focus-queue`
- `fix/<module>-<issue>` — e.g. `fix/tasks-drag-drop`
- `refactor/<module>-<goal>` — e.g. `refactor/auth-validation`
- `docs/<topic>` — e.g. `docs/implementation-truth`
- `test/<module>` — e.g. `test/focus-reflection`
- `chore/<task>` — e.g. `chore/deps-upgrade`
- `experiment/<topic>` — throwaway/spike ideas, e.g. `experiment/today-timeline-v2`
- `shared/<scope>` — cross-module shared code/config, e.g. `shared/ui-components`
- `sprint/phase?` — reserved for phase/sprint coordination, not normal feature work

```bash
# Start work (from primary worktree on main)
git worktree add ../flowos-agents/<branch> -b <branch>
# Example: git worktree add ../flowos-agents/feature-focus-queue -b feature/focus-queue

# Never merge to main without Founder authorization
```

**Before merge:**
- ✅ `npm run build` — Must pass
- ✅ `npm run lint` — Must pass
- ✅ `npm test` — All passing
- ✅ Manual testing completed
- ✅ Security checklist (6 points)
- ✅ **Founder authorization REQUIRED**

**Never merge to main without Founder authorization.**

---

## Documentation Authority (When Conflicts)

Higher wins:

1. `docs/00-constitution/Vision.md` (highest)
2. `docs/00-constitution/documentation-architecture.md`
3. `docs/01-product/` through `docs/10-team/`
4. `docs/current-phase/mvp-implementation-masterplan.md`
5. `docs/current-phase/current-sprint.md` (current Phase 1 work)
6. `docs/00-constitution/governance/`
7. `.ai/context.md`

---

## Role-Based Work

**When assigned a role:**
1. Read `.ai/workflows/role-assignment.md`
2. Read the relevant `docs/10-team/6-role-hats/[role-name].md`
3. Read `docs/current-phase/current-sprint.md`
4. Execute according to role workflow
5. Complete the applicable short Founder self-approval checkpoint
6. Continue to the next hat in the same session

---

## Common Commands

```bash
# Development
npm run dev          # Start dev server
npm run build        # Build production
npm run lint         # Run ESLint
npm test             # Run vitest tests
npm run test:watch   # Watch mode

# Git workflow
git checkout main && git pull origin main
git checkout -b [role]/[feature-name]
# Work, commit, push
# Request Founder approval before merge
```

---

## For More Details

**See the complete AI skills system:**
- `.ai/README.md` — System overview
- `.ai/context.md` — Full context (read this first!)
- `.ai/workflows/` — Detailed workflows
- `.ai/checklists/` — Quality and security checklists

**This is your universal AI reference. Always start with `.ai/context.md`.**
