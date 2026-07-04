# Phase 0 — Engineering Contract (Implementation Specification)

**Date:** July 3, 2026  
**Status:** APPROVED — frozen engineering contract  
**Source artifact:** `flowos-phase-0-spec.canvas.tsx`  
**Baseline commit after implementation:** `5fc780a`

---

# Purpose

Provide a self-contained, deterministic implementation specification for Phase 0. Target reader: an engineer or AI agent who has never seen the design audit. Zero interpretation allowed during implementation.

---

# Background

Phase 0 review refined audit P0 findings into 5 tasks touching ~9 files. User approved this document as the engineering contract with explicit instruction: do not reinterpret, improve, expand, or silently optimize.

Project root: `flowos/`. All paths relative unless noted.

---

# Problems identified

Phase 0 addresses these audit P0 findings only:

1. Serif font fallback (broken `--font-sans` / `--font-heading` token chain)  
2. Four native browser controls ignoring design system  
3. Two white/light selected-state surfaces in dark mode  
4. Missing global `prefers-reduced-motion` guard

---

# Decisions

- Fix fonts in `globals.css` only — do NOT modify `layout.tsx`  
- Reuse existing components — no new primitives  
- Fix exactly 2 inverted selected states — not all 10+ instances  
- Habit duration number input stays native (explicit exclusion)  
- Task 5 is documentation-only deferred inventory

---

# Scope

## Task 1 — Fix font token chain (P0)

**File:** `src/app/globals.css` only

Fix circular references:
- `--font-sans` → `var(--font-geist-sans)` with fallback stack  
- `--font-heading` → same  
- `--font-mono` → add fallback stack  

## Task 2 — Replace four native browser controls (P0)

| Subtask | File | Replacement |
|---------|------|-------------|
| 2a | `src/components/habits/habit-form-fields.tsx` | `ScheduleTimePickerField` |
| 2b | `src/components/tasks/task-dialog.tsx` | `TaskPrioritySelect` |
| 2c | `src/components/settings/panels/settings-preferences-panel.tsx` | Inline `DropdownMenu` (2 duration selects) |
| 2d | `src/components/layout/quick-capture-dialog.tsx` | Inline `DropdownMenu` for group select |

**Trap warnings:** Time-format round-trip in habit form (normalize at `onChange` boundary). Preserve exact trigger chrome on all replacements.

## Task 3 — Fix two white selected-state surfaces (P0)

| Subtask | File | Change |
|---------|------|--------|
| 3a | `src/components/notes/kanban-panel.tsx` | `bg-foreground text-background` → `flow-selected text-foreground` |
| 3b | `src/components/focus/focus-history-list.tsx` | → `flow-selected` |

## Task 4 — Global reduced-motion guard

Append `@media (prefers-reduced-motion: reduce)` block to end of `globals.css`.

## Task 5 — Deferred-work inventory (documentation only)

13 deferred items across timeline, schedule, workplace, notes, tasks files → Phase 1 or Phase 2.

---

# Out of scope

- Layout changes  
- Spacing changes  
- Color changes (except fixing light leaks in Task 3)  
- Component redesigns  
- New visual ideas  
- Fixing inverted instances beyond the 2 approved  
- Building Select/TimeField/SegmentedControl primitives  
- Modifying `layout.tsx`

---

# Files affected

| File | Tasks |
|------|-------|
| `src/app/globals.css` | 1, 4 |
| `src/components/habits/habit-form-fields.tsx` | 2a |
| `src/components/tasks/task-dialog.tsx` | 2b |
| `src/components/settings/panels/settings-preferences-panel.tsx` | 2c |
| `src/components/layout/quick-capture-dialog.tsx` | 2d |
| `src/components/notes/kanban-panel.tsx` | 3a |
| `src/components/focus/focus-history-list.tsx` | 3b |

**Stats:** 5 tasks, ~9 files, 0 new primitives, low risk, ~0.5 day.

---

# Verification

## Success criteria (all required)

1. Geist Sans renders app-wide — no serif fallback  
2. Zero native light popups on the four replaced controls  
3. Two approved selected states use indigo selected tokens  
4. Reduced-motion preference respected globally  
5. Keyboard accessibility preserved on all replaced controls  
6. No functional regressions  
7. No layout shifts  
8. `npm run build` passes

---

# Deferred work

Task 5 inventory (13 items) — see implementation report. Key paths: `timeline-planner.tsx`, `schedule-header.tsx`, `workplace-compact-task-row.tsx`, `kanban-panel.tsx`, `notes-panel.tsx`, `growth-area-sidebar.tsx`, `task-group-appearance.ts`, `workplace-group-accent.ts`.

---

# Lessons learned

Contract format with exact before/after CSS and trap warnings prevented implementation drift. Self-contained spec allowed agent implementation without audit context.

---

# Related documents

- [01-phase0-review.md](./01-phase0-review.md)  
- [01-phase0-implementation.md](./01-phase0-implementation.md)  
- [00-design-audit.md](./00-design-audit.md)  
- Source: `.cursor/projects/.../canvases/flowos-phase-0-spec.canvas.tsx`
