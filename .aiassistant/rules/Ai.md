---
apply: always
---

# FlowOS AI Assistant Rules (WebStorm)

**This file is read automatically by WebStorm AI Assistant.**

---

## 🚨 CRITICAL: Read These First (In Order)

**Before starting ANY work:**

1. **`.ai/context.md`** ← START HERE
   - Product identity, tech stack, 6-role team
   - Current Phase 0 status and objectives
   - Documentation authority hierarchy
   - Core development principles

2. **`docs/current-phase/current-sprint.md`** ← Current sprint
   - Phase 0 assignments per role
   - Gate 0 criteria and timeline (2026-08-06)
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

**Current Phase:** Phase 0 — Freeze Ambiguity and Establish Document Authority  
**Current Sprint:** Week of 2026-08-02 (updated 2026-08-03)  
**Gate 0 Target:** Every MVP work item traces to feature domain and masterplan phase  
**Progress:** 42% complete  
**Decision:** 2026-08-06  

**Team:** 6 roles (Founder, Product Architect, Design Architect, Engineering Architect, Implementation Engineer, Release Manager)

---

## Core Principles

1. **Role-Based Execution** — You are ONE role, stay in scope
2. **Sprint-Driven Work** — Check current sprint for Phase 0 context
3. **Approval Gates** — Request approval before proceeding downstream
4. **Security Non-Negotiable** — 6-point checklist every merge
5. **Pattern Matching** — Copy similar files before inventing
6. **Small Focused Changes** — One logical change per commit

---

## Security Checklist (Always Run Before Merge)

- [ ] User-scoped data access only (no `using (true)` on user data)
- [ ] Input validation present (Zod schemas)
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

**Branch naming:**
- Role-based: `[role]/[feature-name]` (e.g., `product-architect/update-docs`)
- Fixes: `fix/[description]`
- Docs: `docs/[description]`

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
5. `docs/current-phase/current-sprint.md` (current Phase 0 work)
6. `docs/00-constitution/governance/`
7. `.ai/context.md`

---

## Role-Based Work

**When assigned a role:**
1. Read `.ai/workflows/role-assignment.md`
2. Read `docs/10-team/6-role-hats/[your-role].md`
3. Read `docs/current-phase/current-sprint.md`
4. Execute according to role workflow
5. Request approval at gates
6. Hand off to next role

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
