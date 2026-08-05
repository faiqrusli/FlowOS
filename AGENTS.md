<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

<!-- BEGIN:flowos-ai-skills -->
# FlowOS AI Skills System (v2.0 — Solo Founder with 6-Hat Quality Procedures)

**For ANY AI working on FlowOS (CLI, Cursor, Codex, WebStorm, etc.):**

## 🚨 CRITICAL: Read These First (In Order)

**Before starting ANY work:**

1. **`.ai/context.md`** ← START HERE (Universal AI context)
   - Product identity, tech stack, 6-hat workflow
   - Current Phase 1 status and objectives
   - Documentation authority hierarchy
   - Core development principles

2. **`docs/current-phase/current-sprint.md`** ← Current sprint
   - Phase 1 work and status
   - Gate 1 criteria
   - What's in/out of scope

3. **`docs/start-here/solo-founder-workflow.md`** ← Complete 6-hat workflow
   - How to use 6 roles as quality "hats"
   - Practical examples
   - Time savings vs team approach

**Then use as needed:**
- `docs/start-here/how-to-develop-flowos.md` — Quick workflow reference
- `docs/current-phase/phase-1/README.md` — Gate 1 completion criteria
- `docs/10-team/6-role-hats/[role-name].md` — Detailed hat procedures
- `.ai/checklists/security.md` — 6-point security checklist (before every merge)
- `.ai/checklists/quality.md` — Build, lint, test verification
- `.ai/testing-guide.md` — How to run tests (npm test, vitest, build, lint)
- `.ai/workflows/documentation.md` — Includes **Phase-End Normalization** (archive phase sprint + checklist; shorten current-sprint at every phase close) — read this before/after phase transitions

---

## 🎭 6-Hat Quality Workflow

**Solo founder wears 6 quality hats in sequence:**

**Mode 1: Plan**
- Hat 1: Product Architect (brief, contract)
- Hat 2: Design Architect (design spec)

**Mode 2: Build**
- Hat 3: Engineering Architect (delivery design, validation plan)
- Hat 4: Implementation Engineer (code, tests, runbook)

**Mode 3: Ship**
- Hat 5: Release Manager (verify, deploy, release record)

**Hat 6: Founder (approve or reject consequential decisions and releases)**

**Each hat has quality responsibilities. Execute all hats yourself, in sequence, with short Founder self-approval checkpoints.**

**Hat references:** `docs/10-team/6-role-hats/[role-name].md` for detailed procedures

---

## 🔄 Current Status (Phase 2)

**Phase:** Phase 2 — Contract the Coherent MVP Loop  
**Sprint:** 2026-08-05 → 2026-08-08 (active)  
**Gate 2:** Contract coherence — every admitted behavior traces to parent system, journey, design, owner, and validation question  
**Progress:** Phase 1.5 CLOSED — Gate 1.5 PASSED 2026-08-05; Phase 2 sprint active  
**Prior phase:** Phase 1.5 — Foundation Infrastructure (closed 2026-08-05, archived to `docs/11-archive/phases/phase-1.5/`, full record in `phase-1.5-sprint.md`)

**Phase 2 Status:**
- ✅ Gate 1.5 passed and Phase 1.5 closed (2026-08-05)
- ✅ Phase 2 sprint created 2026-08-05 → 2026-08-08
- 📋 Gate 2 checklist: `docs/current-phase/phase-2/gate-checklist.md`
- 📋 Phase 1.5 foundation patterns: `docs/06-engineering/technology-integration-masterplan.md` (D-004)

---

## 🎯 Quick Reference

**Before starting work:** 
1. Read `.ai/context.md` (universal context)
2. Check `docs/current-phase/current-sprint.md` (current sprint)
3. Check `docs/current-phase/phase-2/gate-checklist.md` (what needs doing)

**During work:** Wear appropriate quality hats, maintain each hat's standards  
**Before merge:** Security checklist, build/lint/test pass  
**Never:** Merge to main without verification

**Core Principles:**
1. **6-hat quality workflow** — Wear each hat in sequence for quality
2. **Sprint-driven work** — Check current-phase/ for what to work on
3. **Quality through procedures** — Each hat has specific responsibilities
4. **Security non-negotiable** — 6-point checklist every merge
5. **Pattern matching** — Copy similar files before inventing
6. **Small focused changes** — One logical change per commit

**Documentation Authority:**
1. `docs/00-constitution/Vision.md` (highest)
2. `docs/current-phase/mvp-implementation-masterplan.md` (implementation roadmap)
3. `docs/current-phase/current-sprint.md` (current work)
4. `docs/10-team/6-role-hats/` (quality procedures)
5. `.ai/context.md` (universal AI reference)

**Legacy docs (DO NOT use for new work):**
- `docs/11-archive/strategy/execution-masterplan.md` (historical — use MVP Masterplan instead)
- `docs/11-archive/` (historical reference only)

For tool-specific configs, also see:
- `.cursor/rules/` (Cursor IDE)
- `.idea/ai-rules.md` (WebStorm/IntelliJ)
<!-- END:flowos-ai-skills -->

## Git Worktree Workflow (All Agents)

**Parallel branches off `main`, each owned by an agent or the Founder. Never work on `main`.**

```
main
├── feature/focus-queue           Agent A
├── feature/focus-break-reminder  Agent B
├── feature/today-right-sidebar   You (Founder)
├── feature/schedule-auto-resize  Agent C
└── experiment/<topic>            For throwaway/spike ideas (e.g. experiment/today-timeline-v2)
```

- Primary worktree: `C:\Users\faiqr\flowos` (stays on `main`, production truth)
- Each parallel branch = its own worktree: `C:\Users\faiqr\flowos-agents\<branch-name>\`
- Each worktree is a full checkout isolated on its branch so owners work in parallel without colliding.
- When a branch finishes: request review → Founder merges to `main` → delete branch → open next branch.

**Branch naming convention (required):**
- `feature/<module>-<feature>` — e.g. `feature/focus-queue`
- `fix/<module>-<issue>` — e.g. `fix/tasks-drag-drop`
- `refactor/<module>-<goal>` — e.g. `refactor/auth-validation`
- `docs/<topic>` — e.g. `docs/implementation-truth`
- `test/<module>` — e.g. `test/focus-reflection`
- `chore/<task>` — e.g. `chore/deps-upgrade`
- `experiment/<topic>` — For throwaway/spike ideas, e.g. `experiment/today-timeline-v2`
- `shared/<scope>` — For cross-module shared code/config, e.g. `shared/ui-components`
- `sprint/phase?` — reserved for phase/sprint coordination, not normal feature work

**Example module lines (Focus):**
```
feature/focus-queue
feature/focus-pomodoro
feature/focus-shortcuts
feature/focus-notifications
feature/focus-analytics
```

**Completion loop:** review → merge → delete branch → create next branch.

## Custom Agents

- **acp**: `C:\Users\faiqr\AppData\Local\Kiro-Cli\kiro-cli.exe`
