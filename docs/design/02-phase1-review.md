# Phase 1 — Strategic Re-Review

**Date:** July 3, 2026  
**Baseline:** Phase 0 commit `5fc780a`  
**Source artifact:** `flowos-phase-1-review.canvas.tsx`  
**Verdict:** Original Phase 1 plan NOT approved — only 2 of 5 tasks survive

---

# Purpose

Re-evaluate the audit's original Phase 1 plan after Phase 0 changed ground truth. Challenge every task: is it still Phase 1? Too large? Missing? Unnecessary? Could it accidentally become redesign work?

---

# Background

Original audit Phase 1 proposed: SegmentedControl primitive, TimeField primitive, Select consolidation, Badge/chip migration, group-dot identity. Phase 0 shipped Geist Sans, replaced native controls, fixed 2 inverted states, and produced a deferred inventory. Codebase re-inspection revealed several original tasks were obsolete or premature.

---

# Problems identified

## What Phase 0 changed

- Geist Sans removes serif noise → inverted pills now the loudest defect  
- TimeField already exists as `ScheduleTimePickerField` — Phase 0 finished adoption  
- Three dropdown-select implementations work and share DropdownMenu primitive  
- `native-picker-input.tsx` discovered as dead code  
- Timeline planner toggle is both segmented AND inverted  
- Panel-toggle sky accents belong in Phase 2 accent sweep

## Original task interrogation

| Original Task | Disposition | Reason |
|---------------|-------------|--------|
| SegmentedControl + 4 migrations | **KEEP** (reordered first) → later reduced to Option A | Highest traffic toggle divergent |
| TimeField primitive | **REMOVE** | Obsolete; tokenize sky highlight only (~4 strings) |
| Reusable Select | **POSTPONE** to Phase 3+ | Three working implementations; regression risk |
| Badge + chip migration | **MERGE into Phase 2** | Requires coordinated accent sweep |
| Group-dot identity | **MOVE to Phase 2** | Tied to accent language |
| Inverted bg-foreground remediation | **ADD** | ~7 files; surface-scale tokens only |
| Focus settings pill inputs | **KEEP** → later **REMOVED** | False premise — already standard Input |

---

# Decisions

## Revised Phase 1 — "Interaction & control consistency"

| # | Task | Effort | Impact |
|---|------|--------|--------|
| 1 | SegmentedControl primitive + 4 migrations → **Option A: Quick Capture Plan inline restyle** | 0.25 day | High |
| 2 | Inverted-pattern remediation (surface-scale) | 0.5 day | High |
| 3 | Focus settings inputs → standard Input → **REMOVED** | — | — |
| 4 | Tokenize time-picker highlight | 0.1 day | Low-medium |
| 5 | Delete dead files + lint fixes | 0.1 day | None |

**Execution order:** strictly 1 → 2 → 4 → 5.

**Fresh-eyes correction (pre-implementation):** Task 3 removed; SegmentedControl primitive deferred; Option A inline restyle only.

**Approved by user** as frozen engineering contract.

---

# Scope

- Quick Capture Plan toggle restyle to Workplace recipe  
- 4 inverted-surface remediations + timeline zoom active state  
- Time picker `ring-sky-400/45` → semantic tokens  
- Delete `native-picker-input.tsx`, `schedule-header.tsx`

---

# Out of scope

- SegmentedControl React primitive extraction  
- Select consolidation  
- Badge/chip migration  
- Group-dot migration  
- Layout changes  
- Color palette changes beyond token references  
- Typography scale

---

# Files affected

Identified for implementation:

- `src/components/layout/quick-capture-dialog.tsx`  
- `src/components/schedule/schedule-task-sidebar.tsx`  
- `src/components/notes/notes-panel.tsx`  
- `src/components/notes/growth-area-sidebar.tsx`  
- `src/components/notes/growth-area-icon-chooser.tsx`  
- `src/components/tasks/timeline-planner.tsx`  
- `src/components/ui/time-picker-panel.tsx`  
- `src/lib/native-picker-input.tsx` (delete)  
- `src/components/schedule/schedule-header.tsx` (delete)

---

# Verification

Gates before implementation:

1. 15-minute visual walkthrough of toggle recipes  
2. Frozen spec with inverted-pattern semantic mapping table  

Post-implementation: see `02-phase1-implementation.md`.

---

# Deferred work

Moved to Phase 2:

- Badge + chip migration  
- Group-dot identity  
- Panel-toggle sky accents  
- Remaining segmented control copy-pastes (timeline, schedule toolbar, workplace tabs)  
- Select primitive consolidation (Phase 3+)

---

# Lessons learned

1. Never trust memory of codebase — re-inspect after each phase  
2. "Build primitive" tasks may be "adopt existing" or "delete dead code"  
3. Fresh-eyes review before implementation caught a false-premise task (Focus settings)  
4. Option A (inline restyle) often beats primitive extraction for Phase 1 risk profile

---

# Related documents

- [02-phase1-spec.md](./02-phase1-spec.md) — contract note  
- [02-phase1-post-review.md](./02-phase1-post-review.md) — fresh-eyes correction  
- [02-phase1-implementation.md](./02-phase1-implementation.md)  
- [03-phase2-strategic-review.md](./03-phase2-strategic-review.md)  
- Source: `.cursor/projects/.../canvases/flowos-phase-1-review.canvas.tsx`
