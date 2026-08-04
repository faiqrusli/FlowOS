# FlowOS AI Assistant Rules for WebStorm/IntelliJ

**Universal AI Skills Reference:** See `.ai/` directory for comprehensive context, workflows, and checklists.

---

## 🚨 CRITICAL: Read These First

**Before starting ANY work:**
1. **`.ai/context.md`** — Full product context, 6-hat workflow, Phase 1 status
2. **`docs/current-phase/current-sprint.md`** — Current Phase 1 sprint assignments
3. **Your role document** (if assigned): `docs/10-team/6-role-hats/[role-name].md`

**Then use:**
- `.ai/workflows/role-assignment.md` — How to execute when assigned a role
- `.ai/checklists/security.md` — 6-point security checklist
- `.ai/checklists/quality.md` — Build, lint, test checklist
- `.ai/testing-guide.md` — How to test (npm test, vitest, build, lint)

---

## Quick Context

**Product:** FlowOS — Operating system for self-direction  
**Core Loop:** Direction → Commitment → Action → Evidence → Sensemaking → Adaptation  
**Stack:** Next.js App Router, React, TypeScript, Tailwind, Supabase  
**Production:** https://flowos-sage.vercel.app  

**Current Phase:** Phase 1 — Establish Implementation Truth  
**Current Sprint:** 2026-08-04 → 2026-08-08 (Phase 1 sprint active)  
**Gate 1 Target:** Every admitted MVP domain demonstrable (current behavior, data path, known gaps, owner)  
**Progress:** Phase 0 CLOSED — Gate 0 PASSED 2026-08-04; Phase 1 authorized (D-003)

**Team:** Six authoritative hats grouped into Plan, Build, and Ship — solo founder wears all hats

---

## Essential References

**Before starting work:**
1. Read `.ai/context.md` — Full product context, principles, six-hat workflow
2. Check `docs/current-phase/current-sprint.md` — Phase 1 assignments
3. Review your role: `docs/10-team/6-role-hats/[role-name].md`

**During code review:**
1. Follow `.ai/workflows/code-review.md` — Comprehensive review process
2. Run `.ai/checklists/security.md` — 6-point security checklist
3. Run `.ai/checklists/quality.md` — Build, lint, test checks

**Before merge:**
1. Execute `.ai/workflows/merge-prep.md` — Pre-merge verification
2. Never merge without Founder authorization

**For documentation:**
1. Consult `.ai/workflows/documentation.md` — What/when to update

---

## Core Principles

### 1. Role-Based Execution
**The Founder wears one hat at a time, progressing through the six procedures.**
- Read the relevant `docs/10-team/6-role-hats/[role-name].md`
- Stay within that hat's scope and deliverables
- Self-approve at the three short mode checkpoints
- Continue to the next hat in the same session

### 2. Sprint-Driven Work
**Work comes from current sprint.**
- Current Phase: **Phase 1** (Establish Implementation Truth)
- Check `docs/current-phase/current-sprint.md` for your Phase 1 assignments
- Gate 1 target: every admitted MVP domain demonstrable (current behavior, data path, known gaps, owner)

### 3. Pattern Matching First
Always check similar files before writing new code. Copy existing patterns.

**Example:**
```typescript
// Creating new HabitsPage? Check TasksPage first.
// src/app/(main)/tasks/page.tsx ← pattern reference
// src/app/(main)/habits/page.tsx ← new file
```

### 4. Security Non-Negotiable
- User-scoped queries only
- No hardcoded secrets
- Input validation always (runtime server-side validation; Zod decision is scheduled for Phase 1.5)
- RLS on user tables
- Auth middleware on routes

**Check:** `.ai/checklists/security.md` (6-point checklist)

### 5. Small, Focused Changes
- One logical change per commit
- No drive-by refactors
- No scope creep
- Match touched area only

### 6. Branch-First Workflow (Git Worktree model)
Work happens on parallel branches off `main`, each owned by an agent or the Founder, each in its **own worktree**:
```
main
├── feature/<module>-<feature>   Agent A
├── experiment/<topic>           spike
└── shared/<scope>               shared code/config
```
Every agent works in its own folder (`flowos-agents/<branch>/`) so parallel tasks never collide.

```powershell
# Start work (from primary worktree on main)
git worktree add ../flowos-agents/<branch> -b <branch>
# Example: git worktree add ../flowos-agents/feature-focus-queue -b feature/focus-queue

# Never merge to main without Founder authorization
```

---

## Documentation Authority

When docs conflict, higher wins:

1. `docs/00-constitution/Vision.md` (highest)
2. `docs/00-constitution/documentation-architecture.md`
3. `docs/01-product/` through `docs/10-team/` (canonical numbered structure)
4. `docs/current-phase/mvp-implementation-masterplan.md` (current implementation source)
5. `docs/current-phase/current-sprint.md` (current Phase 1 work)
6. `docs/00-constitution/governance/` (PRINCIPLES, CODE_STANDARDS, GIT_WORKFLOW)
7. `.ai/context.md` (universal AI reference)

**Legacy (DO NOT use):**
- `docs/11-archive/strategy/execution-masterplan.md` (use MVP Masterplan instead)
- `docs/11-archive/` (historical only)

---

## Code Conventions

**Files:** kebab-case (`habit-list.tsx`)  
**Components:** PascalCase (`HabitList`)  
**Imports:** `@/` alias (`@/lib/utils`)  
**Server components:** Default (use `"use client"` only when needed)  
**Styling:** Semantic tokens (`bg-card`, `text-foreground`)  
**Colors:** Use `schedule-palette.ts` or `*-appearance.ts`, not inline hex

---

## Git Workflow

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

**Before merge:**
- `npm run build` ✅ Must pass
- `npm run lint` ✅ Must pass
- `npm test` ✅ All passing
- Manual testing ✅ Completed
- Security checklist ✅ All 6 points
- Founder authorization ✅ **REQUIRED**

**Never:**
- Merge to main without Founder authorization
- Skip build/lint/test checks
- Skip security checklist
- Work outside your assigned role

---

## AI Assistant Behavior

### ✅ Do
- Be concise and direct
- Explain what and why
- Use tools efficiently
- Ask when uncertain
- Follow existing patterns
- Check security every time
- Review diffs thoroughly
- Respect scope (Phase 1 — truth establishment, no feature implementation)
- Wait for merge approval

### ❌ Don't
- Assume approval
- Push to main without permission
- Skip security checks
- Invent new patterns
- Add dependencies without asking
- Expand scope beyond Phase 1
- Skip build/lint
- Merge without testing

---

## Common Workflows

### When Assigned a Role
```
User: "You are the Product Architect"

AI:
1. Read .ai/workflows/role-assignment.md
2. Read docs/10-team/6-role-hats/product-architect.md
3. Read docs/current-phase/current-sprint.md
4. Acknowledge role, understand Phase 1 assignments
5. Execute according to role workflow
```

### Code Review
```
User: "Review my changes"

AI:
1. Run git diff main..branch
2. Follow .ai/workflows/code-review.md
3. Run .ai/checklists/security.md (all 6 checks)
4. Check build/lint/test
5. Provide detailed report
6. Wait for decision
```

### Before Merge
```
User: "Ready to merge?"

AI:
1. Follow .ai/workflows/merge-prep.md
2. Verify all checks pass
3. Confirm manual testing done
4. Ask: "Ready to merge? (requires Founder authorization)"
5. WAIT — never merge without explicit "yes"
```

---

## Quick Security Checklist
Run before every merge:

1. **User-scoped data:** All queries filtered by user_id or RLS
2. **Input validation:** Zod or similar schema validation
3. **No secrets:** Environment variables, not hardcoded
4. **RLS enabled:** On all new user data tables
5. **Auth protected:** Routes in (main) or PROTECTED_PREFIXES
6. **Safe errors:** Generic to client, detailed server-side only

**Full checklist:** `.ai/checklists/security.md`

---

## Out of Scope (Phase 1)

❌ Feature implementation or refactors (Phase 3)  
❌ Contract writing (Phase 2)  
❌ New modules  
❌ Monolith refactors unless needed to document truth  
❌ Visual polish (unless a design reconciliation item)

---

## File Structure

```
flowos/
├── .ai/                  # ← AI skills, workflows, checklists
│   ├── context.md        # ← Universal AI context (start here)
│   ├── workflows/        # ← Role assignment, review, merge, docs
│   └── checklists/       # ← Security, quality
├── docs/
│   ├── 00-constitution/  # ← Vision, governance
│   ├── current-phase/    # ← Sprint, masterplan
│   ├── 10-team/          # ← 6-role quality hats
│   ├── start-here/       # ← Workflow guides
│   └── 11-archive/       # ← History only
├── src/
│   ├── app/(main)/       # ← Authenticated routes
│   ├── components/       # ← UI components
│   ├── lib/              # ← Business logic, utilities
│   └── ...
```

---

## Integration with Other AI Tools

**This file works with:**
- Cursor (see `.cursor/rules/`)
- Codex
- CLI tools (Kiro, acp)
- Any AI reading repo context

**All reference:** `.ai/` directory as single source of truth.

---

## Quality Philosophy

**80% of quality comes from discipline, 20% from tools.**

Better to:
✅ Understand patterns first  
✅ Review thoroughly  
✅ Ask when uncertain  
✅ Ship simple, working code

Than to:
❌ Rush and break things  
❌ Skip security  
❌ Invent incompatible patterns  
❌ Ship complex, buggy code

---

## For More Details

**See:** `.ai/context.md` — Comprehensive AI context (10x more detailed than this file)

**Workflows:**
- `.ai/workflows/role-assignment.md`
- `.ai/workflows/code-review.md`
- `.ai/workflows/merge-prep.md`
- `.ai/workflows/documentation.md`

**Checklists:**
- `.ai/checklists/security.md`

**Governance:**
- `docs/00-constitution/governance/PRINCIPLES.md`
- `docs/00-constitution/governance/CODE_STANDARDS.md`
- `docs/00-constitution/governance/GIT_WORKFLOW.md`

---

**Remember:** You're helping build excellent software. Pattern matching, security first, small changes, always wait for approval. Quality > Speed.
