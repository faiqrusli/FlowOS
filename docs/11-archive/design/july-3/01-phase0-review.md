# Phase 0 Review — Scope Refinement

**Date:** July 3, 2026  
**Source:** Agent transcript (pre-spec self-review). No Canvas artifact exists.  
**Status:** Approved by user → led to frozen engineering contract

---

# Purpose

Challenge the original Phase 0 roadmap before implementation. Produce the smallest possible Phase 0 delivering the biggest visual improvement with least implementation risk.

---

# Background

After the design audit proposed Phase 0 tasks, a reconnaissance pass re-inspected the codebase and found several original assumptions wrong — components already existed, task sizing was off, and scope creep risks were identified.

---

# Problems identified

### Original assumptions that were wrong

1. **"Replace native time picker" framed as new work** — `TimePickerPanel` and `ScheduleTimePickerField` already exist; habit form never adopted them (~10-line swap)  
2. **"Replace native priority select" framed as new work** — `TaskPrioritySelect` exists and is used in Quick Capture; task dialog never adopted it  
3. **Settings native selects undercounted** — two duration `<select>` elements confirmed, not one  
4. **Quick Capture group select** — needs local DropdownMenu, not reusable Select primitive (Phase 1 scope)  
5. **Plan segmented control** — third light-surface leak identified among Phase 0 candidates  
6. **`bg-foreground text-background` pattern** — exists in 10+ places; Phase 0 should fix only 2 approved instances; rest → Phase 1 inventory

### Scope creep risks flagged

- Fixing all inverted instances in Phase 0 would become redesign work  
- Building Select primitive would expand Phase 0 beyond bug fixes  
- Habit duration `<Input type="number">` should stay native (working acceptably)

---

# Decisions

| Original task | Review decision | Rationale |
|---------------|-----------------|-----------|
| Fix font tokens | **Keep — Phase 0** | Two-line CSS bug, highest ROI |
| Replace native controls | **Keep — shrink to adoption swaps** | Components exist |
| Fix light-surface leaks | **Keep — exactly 2 approved** | Notes kanban + Focus history |
| Reduced-motion guard | **Keep — Phase 0** | Pure CSS, zero risk |
| Fix all inverted pills | **Move to Phase 1** | Too large for Phase 0 |
| Build TimeField | **Remove** | Already exists |
| Build Select primitive | **Defer to Phase 1 eval** | DropdownMenu sufficient for Phase 0 |
| Plan toggle white pill | **Inventory for Phase 1** | Segmented control work |

**Outcome:** 5 frozen tasks → engineering contract (`01-phase0-spec.md`).

---

# Scope

In scope for review output:

- Task-by-task Phase 0 interrogation  
- Risk assessment for each task  
- Revised task list with effort estimates  
- Explicit exclusions

---

# Out of scope

- Implementation  
- Modifying the approved audit findings  
- Phase 1+ planning (except deferral inventory)

---

# Files affected

None — review only. Identified files for subsequent spec:

- `src/app/globals.css`  
- `src/components/habits/habit-form-fields.tsx`  
- `src/components/tasks/task-dialog.tsx`  
- `src/components/settings/panels/settings-preferences-panel.tsx`  
- `src/components/layout/quick-capture-dialog.tsx`  
- `src/components/notes/kanban-panel.tsx`  
- `src/components/focus/focus-history-list.tsx`

---

# Verification

Review validated by codebase re-inspection. User approved revised roadmap before spec creation.

---

# Deferred work

13-item deferred inventory assigned to Phase 1 or Phase 2 (documented in Phase 0 spec Task 5). Key items: remaining inverted instances, timeline toggles, panel-toggle sky accents, notes growth-area colors.

---

# Lessons learned

1. Always re-inspect codebase before freezing scope — "build X" may be "adopt existing X"  
2. Phase 0 must resist becoming Phase 0.5 redesign  
3. Inventory deferred items explicitly rather than silently skipping them

---

# Related documents

- [00-design-audit.md](./00-design-audit.md)  
- [01-phase0-spec.md](./01-phase0-spec.md)  
- [01-phase0-implementation.md](./01-phase0-implementation.md)  
- [CHANGELOG.md](./CHANGELOG.md) — Phase 0 Review entry
