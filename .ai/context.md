# FlowOS AI Context

**Universal AI skills reference for FlowOS development (v2.0 — Updated for 6-Role Team)**

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

**Phase:** Phase 0 — Freeze Ambiguity and Establish Document Authority

**Current Sprint:** Week of 2026-08-02 (updated 2026-08-03)

**Status:** Active — Documentation ownership updates in progress

**Gate 0 Target:** Every proposed MVP work item points to feature domain, parent system, design/engineering contract, and masterplan phase. Work that cannot do so pauses.

**Active Work:** 
- Update all core docs with 6-role ownership (Product, Design, Engineering Architects)
- Mark legacy documents as historical (Implementation Engineer)
- Create implementation truth backlog (Implementation Engineer)
- Define Phase 0 gate criteria (Release Manager)
- Assess gate readiness (Release Manager)

**Gate 0 Progress:** 42% complete

---

## Team Organization: 6-Role Active Configuration

**FlowOS uses a role-based AI-first development team.**

### Active Roles

| Role | What They Do | Key Outputs |
|------|-------------|-------------|
| **Founder** (Human) | Final authority, approves all work | Decisions, approvals, releases |
| **Product Architect** | Define product and strategy | Feature briefs, behavior contracts |
| **Design Architect** | Design UX and visual | Design specifications |
| **Engineering Architect** | Design technical approach | Delivery designs, validation plans |
| **Implementation Engineer** | Build features | Code, tests, documentation |
| **Release Manager** | Test and deploy | Test results, releases |

### How This Works

**When assigned a role:**
1. You are told: "You are the [Role Name]"
2. Read your role document: `docs/12-team/active-6-role/[role-name].md`
3. Read the current sprint: `docs/07-strategy-and-delivery/current-sprint.md`
4. Read required input documents
5. Execute according to your role's workflow
6. Produce expected outputs
7. Hand off to next role (or request approval)

**Standard Feature Workflow (with Approval Gates):**
```
Founder assigns
  ↓
Product Architect creates feature brief + behavior contract
  ↓ (submits for approval)
Founder approves
  ↓
Design Architect creates design specification
  ↓ (submits for review then approval)
Product Architect reviews → Founder approves
  ↓
Engineering Architect creates delivery design + validation plan
  ↓ (submits for approval)
Founder approves
  ↓
Implementation Engineer builds code + tests + docs
  ↓ (submits for approval)
Founder approves
  ↓
Release Manager tests + prepares release
  ↓ (requests authorization)
Founder authorizes release
  ↓
Production deployment
```

**Role Documents Location:** `docs/12-team/active-6-role/`
- `founder.md` — Final authority
- `product-architect.md` — Product definition
- `design-architect.md` — Complete design
- `engineering-architect.md` — Technical architecture
- `implementation-engineer.md` — Full-stack development
- `release-manager.md` — QA and deployment

**Current Sprint Assignments:** `docs/07-strategy-and-delivery/current-sprint.md`

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

1. **`docs/strategy/Vision.md`** — Timeless philosophy, product boundaries (HIGHEST)
2. **`docs/00-constitution/documentation-architecture.md`** — Documentation governance
3. **`docs/01-product/`** — Product model, strategy, glossary, success model
4. **`docs/02-systems/`** — System definitions (direction, action, evidence, sensemaking, continuity, intelligence)
5. **`docs/03-experience/`** — Experience architecture, information structure, journey contracts
6. **`docs/04-features/`** — Feature briefs, behavior contracts, delivery designs, validation plans
7. **`docs/05-design/`** — Design system architecture, feature design specifications
8. **`docs/06-engineering/`** — Engineering architecture, standards, SDLC
9. **`docs/07-strategy-and-delivery/`** — **MVP Implementation Masterplan, Roadmap, Current Sprint**
10. **`docs/08-decisions/`** — Decision records
11. **`docs/09-evidence/`** — Research and measurements
12. **`docs/10-reviews/`** — Review records
13. **`docs/12-team/`** — **6-role team organization**
14. **`docs/execution/logs/`** — decision-log, july-log, developer-log (historical)
15. **`docs/foundation/governance/`** — PRINCIPLES, CODE_STANDARDS, GIT_WORKFLOW, GATES
16. **`docs/archive/`** — Historical reference only (DO NOT use for current work)

### Key Documents to Know

**Essential reading:**
- `docs/strategy/Vision.md` — Highest authority
- `docs/00-constitution/documentation-architecture.md` — Where everything belongs
- `docs/01-product/product-model.md` — Product concepts
- `docs/01-product/product-glossary.md` — Canonical vocabulary
- `docs/07-strategy-and-delivery/mvp-implementation-masterplan.md` — **Current implementation source**
- `docs/07-strategy-and-delivery/current-sprint.md` — **Current sprint assignments**
- `docs/07-strategy-and-delivery/development-handbook.md` — **How work flows**
- `docs/12-team/active-6-role/README.md` — **Team structure**
- `docs/start-here/engineer.md` — Engineering quickstart
- `docs/foundation/FEATURE_INVENTORY.md` — What's shipped vs deferred

**For your role:**
- Read `docs/12-team/active-6-role/[your-role].md` when assigned

**Legacy documents (DO NOT start new work from these):**
- `docs/strategy/execution-masterplan.md` — Historical milestone context (use MVP Masterplan instead)
- `docs/archive/runbooks/m2-*.md` — Old M2 sessions (archived)

---

## Current Sprint Context

**Always check:** `docs/07-strategy-and-delivery/current-sprint.md` for current assignments.

**Phase 0 Focus:**
- Update all core docs with 6-role ownership
- Mark legacy documents as historical
- Create implementation truth backlog (questions, not features)
- Define Phase 0 gate criteria
- Assess gate readiness

**Gate 0 Exit Criteria:**
- MVP Masterplan adopted as implementation source
- Feature Catalog adopted as coverage map
- Design Implementation Map adopted
- 6-role ownership on all core docs
- Legacy docs marked historical
- AI skills reference new structure
- Implementation truth backlog created

**Gate 0 Progress:** 42% complete (target: 2026-08-06)

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

### 1. Role-Based Execution
**You are assigned ONE role at a time.**

- Read your role document immediately
- Understand your authority and limitations
- Know what inputs you need
- Know what outputs you produce
- Know who you hand off to
- **Stay in your role's scope**

### 2. Sprint-Driven Work
**Work comes from the current sprint.**

- Check `docs/07-strategy-and-delivery/current-sprint.md`
- Understand current phase (Phase 0: Freeze Ambiguity and Establish Document Authority)
- Know your sprint assignments
- Align work with phase gate criteria
- Document progress

### 3. Approval Gates
**Work requires approval before proceeding.**

- Product Architect → Founder approves → Design Architect
- Design Architect → Product Architect reviews + Founder approves → Engineering Architect
- Engineering Architect → Founder approves → Implementation Engineer
- Implementation Engineer → Founder approves → Release Manager
- Release Manager → Founder authorizes → Production

**Never skip approval. Never merge without authorization.**

### 4. Contract Before Implementation
**Contracts define behavior, then code implements.**

- Feature Brief (what and why)
- Behavior Contract (observable behavior)
- Design Specification (visual, interaction, content, accessibility)
- Delivery Design (technical approach)
- Validation Plan (how to verify)
- Implementation (code, tests, docs)

**Sequence matters. Don't skip upstream contracts.**

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
│   ├── 00-constitution/           # Documentation governance
│   ├── 01-product/                # Product model, strategy, glossary
│   ├── 02-systems/                # System definitions
│   ├── 03-experience/             # Experience architecture
│   ├── 04-features/               # Feature briefs, behavior contracts
│   ├── 05-design/                 # Design system architecture
│   ├── 06-engineering/            # Engineering architecture
│   ├── 07-strategy-and-delivery/  # MVP Masterplan, Roadmap, Sprints
│   ├── 08-decisions/              # Decision records
│   ├── 09-evidence/               # Research and measurements
│   ├── 10-reviews/                # Review records
│   ├── 12-team/                   # Team organization (6 roles)
│   ├── strategy/                  # Vision (highest authority)
│   ├── foundation/                # FEATURE_INVENTORY, governance
│   ├── execution/                 # Logs (historical)
│   ├── start-here/                # Onboarding guides
│   └── archive/                   # Historical (DO NOT use)
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
- [ ] Auth middleware on new API routes
- [ ] New auth routes added to `PROTECTED_PREFIXES` in `middleware.ts`
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
| Sprint work complete | Update `docs/07-strategy-and-delivery/current-sprint.md` |
| Feature complete | Update `docs/foundation/FEATURE_INVENTORY.md` |
| After merge to main | Update `docs/execution/logs/july-log.md` |
| Technical/architecture change | Update relevant docs in `docs/06-engineering/` |

---

## AI Assistant Behavior Guidelines

### What to Do

✅ **Read your role document first**
When assigned a role, immediately read `docs/12-team/active-6-role/[role-name].md`

✅ **Check current sprint**
Read `docs/07-strategy-and-delivery/current-sprint.md` to understand context

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
`docs/archive/` is historical only

❌ **Never assume "should work"**
Verify everything with evidence

---

## Common Workflows

See detailed workflow files:
- `.ai/workflows/role-assignment.md` — How to start work when assigned a role
- `.ai/workflows/feature-workflow.md` — Complete feature lifecycle
- `.ai/workflows/approval-gates.md` — How approval gates work
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
- `docs/strategy/Vision.md` — Product philosophy (highest authority)
- `docs/07-strategy-and-delivery/mvp-implementation-masterplan.md` — Current implementation source
- `docs/07-strategy-and-delivery/current-sprint.md` — Current sprint assignments
- `docs/07-strategy-and-delivery/development-handbook.md` — How work flows
- `docs/12-team/active-6-role/README.md` — Team structure
- `docs/foundation/governance/CODE_STANDARDS.md` — Coding standards
- `docs/foundation/governance/GIT_WORKFLOW.md` — Git workflow details

**Skill Files:**
- `.ai/workflows/` — Common development workflows
- `.ai/checklists/` — Pre-merge checklists
- `.ai/README.md` — AI skills system overview

---

**Remember:** You're part of a role-based AI-first team. Read your role document. Check current sprint. Stay in scope. Request approval. Ship quality work.

**Quality > Speed. Clarity > Process. Evidence > Opinion. Always.**
