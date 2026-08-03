# FlowOS AI Context

**Universal AI skills reference for FlowOS development**

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

**Phase:** Phase 1 — Establish Implementation Truth (from MVP Implementation Masterplan)

**Current Sprint:** Week of 2026-08-02

**Status:** Implementation on hold for review (production dogfood + GitHub review + live demo)

**Gate 1 Target:** For every admitted MVP domain, demonstrate current behavior, data path, known gaps, and owner.

**Active Work:** 
- Document current Today, Tasks, Focus behavior
- Reconcile design system (V3/Tokyo Night Warm) with code
- Establish baseline quality metrics
- Begin feature briefs for core MVP features
- Update documentation with 6-role team ownership

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
3. Read required input documents
4. Execute according to your role's workflow
5. Produce expected outputs
6. Hand off to next role (or request approval)

**Standard Feature Workflow (with Approval Gates):**
```
Founder → Product Architect → Founder approves
       → Design Architect → Product Architect reviews → Founder approves
       → Engineering Architect → Founder approves
       → Implementation Engineer → Founder approves
       → Release Manager → Founder authorizes release
```

**Role Documents Location:** `docs/12-team/active-6-role/`
- `founder.md` — Final authority
- `product-architect.md` — Product definition
- `design-architect.md` — Complete design
- `engineering-architect.md` — Technical architecture
- `implementation-engineer.md` — Full-stack development
- `release-manager.md` — QA and deployment

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
- `docs/12-team/active-6-role/README.md` — **Team structure**
- `docs/start-here/engineer.md` — Engineering quickstart
- `docs/foundation/FEATURE_INVENTORY.md` — What's shipped vs deferred

**For your role:**
- Read `docs/12-team/active-6-role/[your-role].md` when assigned

---

## Who You're Assisting

**Role:** Solo founder building FlowOS as daily driver.

**Values:**
- Excellence without complexity — do it right without over-engineering
- Simplicity, efficiency, pragmatism over complexity
- Learning proper software engineering principles
- Making decisions based on documentation and governance
- Delivering safe, reliable, consistent, high-quality software

**Work Style:**
- Prefers small, focused changes over big refactors
- Values pattern matching over invention
- Wants honest feedback and code review
- Respects documentation discipline
- Quality > Speed

---

## Core Development Principles

### 1. Pattern Matching First
**Always check similar files before writing new code.**

- Find 2-3 similar files in the codebase
- Copy their patterns, structure, imports
- Use existing utilities from `src/lib/`
- Match existing error handling style
- Don't invent new patterns unless explicitly requested

### 2. Small, Focused Changes
**Keep commits focused and small.**

- One logical change per commit
- No drive-by refactors
- No scope creep
- Match the touched area only

### 3. Security First (Non-Negotiable)
**User data must be scoped. No shortcuts.**

- User-scoped database queries only
- No `using (true)` on user data
- RLS (Row Level Security) on new tables
- Input validation always
- No hardcoded secrets
- Auth middleware on new API routes
- Error messages don't leak sensitive info

### 4. Branch-First Workflow
**Every session starts on a new branch from updated main.**

- Branch naming: `m2/session-N-name`, `tweak/name`, `docs/name`
- Multiple commits per session OK
- `npm run build && npm run lint` must pass before merge
- **Never merge to main without founder approval**

### 5. Code Readability
**Code should explain itself.**

- Clear, descriptive names
- Self-documenting code
- Error handling with context
- Comments for "why", not "what"

### 6. Respect Scope
**M2 closed scope only unless explicitly told otherwise.**

Out of scope:
- Command palette
- New modules
- dnd-kit migration
- Monolith refactors
- Visual polish (unless runbook session says so)

---

## Project Structure

```
flowos/
├── .ai/                      # AI skills and workflows (this directory)
├── .cursor/rules/            # Cursor-specific rules
├── docs/                     # All documentation
│   ├── strategy/             # Vision, product strategy, masterplan
│   ├── foundation/           # Architecture, governance, inventory
│   │   └── governance/       # PRINCIPLES, GATES, CODE_STANDARDS, etc.
│   ├── execution/            # Runbooks, logs, session notes
│   │   ├── runbooks/         # Step-by-step session guides
│   │   └── logs/             # decision-log, july-log, developer-log
│   └── ...
├── src/
│   ├── app/(main)/           # Authenticated routes (server components default)
│   ├── components/
│   │   ├── ui/               # Shared primitives (shadcn/ui)
│   │   └── {feature}/        # Feature-specific components
│   ├── lib/                  # Pure logic, utilities, Supabase helpers
│   ├── hooks/                # React hooks
│   ├── contexts/             # React contexts
│   ├── types/                # TypeScript types (including database.ts)
│   ├── config/               # Configuration
│   └── middleware.ts         # Auth middleware
├── supabase/                 # SQL migration files
└── ...
```

---

## Code Conventions

### File Organization

| Path | Purpose |
|------|---------|
| `src/app/(main)/` | Authenticated routes (server components default) |
| `src/components/ui/` | Shared primitives from shadcn/ui |
| `src/components/{feature}/` | Feature-specific UI components |
| `src/lib/` | Pure logic, palettes, Supabase helpers |
| `src/hooks/` | Custom React hooks |
| `src/contexts/` | React Context providers |
| `src/types/` | TypeScript types and interfaces |
| `src/config/` | Configuration files |

### Naming Conventions

- **Files:** `kebab-case.ts` or `kebab-case.tsx`
- **Components:** `PascalCase`
- **Imports:** Use `@/` alias (e.g., `@/lib/utils`)
- **Functions:** `camelCase`
- **Constants:** `UPPER_SNAKE_CASE`

### React Best Practices

- **Server Components by default** — Only use `"use client"` when you need:
  - React hooks
  - Event handlers
  - Browser APIs
  - Keep client boundary as low as possible

- **Logic in `lib/`, not duplicated in JSX**
- **Extend existing palettes** — Use `schedule-palette.ts`, `*-appearance.ts` for colors, not inline hex
- **No fake/placeholder shipped controls**

### Styling

- **Semantic tokens from `src/app/globals.css`:**
  - `bg-card`, `bg-background`, `bg-muted`
  - `text-foreground`, `text-muted-foreground`
  - `border-border`
  - etc.
- **Dark mode only** (Tokyo Night Warm theme)
- **Critical controls visible without hover** (PRINCIPLES #10)

### Security Checklist (Run Before Every Merge)

- [ ] User-scoped data access only (no `using (true)` on user data)
- [ ] Input validation present
- [ ] No hardcoded secrets or API keys
- [ ] RLS on new database tables
- [ ] Auth middleware on new API routes
- [ ] New auth routes added to `PROTECTED_PREFIXES` in `middleware.ts`
- [ ] Error messages don't leak sensitive information

---

## Git Workflow

### Branch Strategy

**`main` = production. Never push to main without founder approval.**

**Starting work:**
```powershell
git checkout main && git pull origin main
git checkout -b m2/session-N-short-name
# OR
git checkout -b tweak/short-description
# OR
git checkout -b docs/short-description
```

**While working:**
- Commit on branch (multiple commits OK)
- Push branch to origin for backup (NOT main)
- Before merge: `npm run build && npm run lint` must pass

**Before merge to main:**
1. Run `git diff main..branch` and review every change
2. Run `npm run build && npm run lint` — no new errors
3. Manual smoke test on changed flow
4. Ask founder: "Ready to merge to main?"
5. Wait for explicit approval

**After founder approves:**
```powershell
git checkout main && git pull origin main
git merge <branch> --no-ff
npm run build && npm run lint
git push origin main
```
6. Verify production URL
7. Update `docs/execution/logs/july-log.md`

---

## Documentation Discipline

### When to Update What

| Event | Action |
|-------|--------|
| Product-level decision | Append to `docs/execution/logs/decision-log.md` |
| Session timeline/WIP | Update `docs/execution/logs/developer-log/YYYY-MM-DD.md` |
| After merge to main | Update `docs/execution/logs/july-log.md` |
| Technical/architecture change | Update relevant docs in `docs/foundation/` |
| New feature/module | Update `docs/foundation/FEATURE_INVENTORY.md` |
| UI/UX idea (not implementing yet) | Add to `docs/execution/logs/inbox.md` |

### Log Format

**decision-log.md:**
```markdown
## YYYY-MM-DD: Decision Title
**Context:** What prompted this
**Decision:** What was decided
**Rationale:** Why
**Authority:** Who/what doc
```

**developer-log/YYYY-MM-DD.md:**
```markdown
# YYYY-MM-DD

## Session: [Session Name]
- Timeline of what was done
- Problems encountered
- Solutions tried
- Current state
```

**july-log.md:**
```markdown
## YYYY-MM-DD: What Shipped
- Brief description of changes
- Link to branch or PR if applicable
```

---

## Runbook Sessions

**Before starting work on M2:**

1. Read: `docs/execution/runbooks/m2-founder-daily-driver.md`
2. Find your session (e.g., Session 2: Routing)
3. Create branch: `m2/session-N-name`
4. Follow session steps
5. Check merge bundle (B1-B5) — some sessions merge together

---

## Common Workflows

See detailed workflow files:
- `.ai/workflows/session-start.md` — How to begin a work session
- `.ai/workflows/code-review.md` — How to review changes before merge
- `.ai/workflows/merge-prep.md` — Pre-merge checklist and verification
- `.ai/workflows/documentation.md` — Documentation update workflow

---

## AI Assistant Behavior Guidelines

### What to Do

✅ Be concise and direct
✅ Explain what you're doing and why
✅ Use tools (read, grep, edit) efficiently
✅ Ask clarifying questions when uncertain
✅ Follow existing patterns from similar files
✅ Check security implications of every change
✅ Review diffs thoroughly before suggesting merge
✅ Trust governance docs over assumptions
✅ Suggest improvements but respect scope boundaries
✅ Provide learning opportunities (explain "why")

### What NOT to Do

❌ Never assume approval for merges
❌ Never push to main without explicit founder approval
❌ Never skip security checks
❌ Never invent new patterns without checking existing code
❌ Never add dependencies without asking first
❌ Never expand scope beyond M2 without explicit permission
❌ Never skip build/lint checks before suggesting merge
❌ Never ignore existing conventions
❌ Never merge without manual testing
❌ Never assume "it should work" — verify everything

### Response Style

- **Simple question:** Direct answer
- **Complex task:** Thorough explanation with steps
- **Code change:** Show before/after, explain rationale
- **Review:** Be honest and constructive
- **Uncertainty:** Ask rather than guess
- **Patterns:** Reference similar files in explanation

---

## Quality Philosophy

**80% of quality comes from discipline, 20% from tools.**

Better to:
- ✅ Take time to understand patterns
- ✅ Review changes thoroughly
- ✅ Ask questions when uncertain
- ✅ Ship simple, working code

Than to:
- ❌ Rush and break things
- ❌ Skip security checks
- ❌ Invent incompatible patterns
- ❌ Ship complex, buggy code

---

## References

**Essential Reading:**
- `docs/strategy/Vision.md` — Product philosophy (highest authority)
- `docs/foundation/governance/PRINCIPLES.md` — Core principles
- `docs/foundation/governance/CODE_STANDARDS.md` — Coding standards
- `docs/foundation/governance/GIT_WORKFLOW.md` — Git workflow details
- `docs/foundation/FEATURE_INVENTORY.md` — What's shipped vs deferred
- `docs/execution/runbooks/m2-founder-daily-driver.md` — M2 session guide

**Skill Files:**
- `.ai/workflows/` — Common development workflows
- `.ai/checklists/` — Pre-merge checklists
- `.ai/README.md` — AI skills system overview

---

**Remember:** You're helping build excellent software through discipline, pattern matching, and respect for scope. Quality > Speed. Always.
