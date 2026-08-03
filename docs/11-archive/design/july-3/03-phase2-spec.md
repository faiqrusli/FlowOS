# Phase 2 — Engineering Contract (Implementation Specification)

**Date:** July 3, 2026  
**Status:** FROZEN — do not reinterpret scope  
**Source artifact:** `flowos-phase-2-spec.canvas.tsx`  
**Baseline:** Phase 1 commit `04fe227`  
**Implementation commit:** `9f7e7c4`

---

# Purpose

Deterministic 12-task implementation contract for accent language and chip consolidation. Self-contained spec derived from strategic review. No design interpretation during implementation.

---

# Background

Phase 2 merges audit Phase 1 deferred items (Badge, group-dot) with audit Phase 2 (accent sweep) into one coordinated contract. Indigo must become dominant; entity types distinguished by dots, edges, and flags — not rainbow fills.

---

# Problems identified

1. 542 hardcoded palette references  
2. Orange habit fills, violet focus pills, emoji group pills competing per row  
3. Three chip systems with no shared Badge primitive  
4. Central libs (`task-group-appearance.ts`, `schedule-palette.ts`) encode rainbow logic  
5. Heatmap contrast failures  
6. Drag preview uses hardcoded colors and emoji HTML

---

# Decisions

## Master accent rule (FROZEN)

**One entity, one accent — max 2 non-neutral colors per row/card/chip cluster.**

| Role | Token mapping |
|------|---------------|
| Primary/brand | `primary`, `ring`, `selected` |
| Habits | `border-warning/40–60`, neutral surface |
| Focus | `accent-text` dot, no filled pill |
| Groups | 8px dot via `chart-1…5`, neutral label |
| Priority high | `destructive` edge or flag |
| Dashboard KPI | `success`, `warning`, `muted-foreground` |

## Badge variants (FROZEN)

`entity`, `entity-dot`, `entity-habit`, `entity-focus`, `status-success`, `status-warning`, `status-destructive`, `plain`

## Key structural decisions

- Extend `badge.tsx` — no separate Chip primitive  
- Refactor central libs first (Task 1) before feature migrations  
- Leave `notes/**`, `reflection/**`, `settings/**`, `auth/**` untouched  
- Do not remove emoji from data model — display-only changes allowed  
- Do not introduce new OKLCH hues

---

# Scope

## 12 tasks (strict order)

| Task | Purpose | Effort |
|------|---------|--------|
| 1 | Freeze accent exports in central libs | 0.5 day |
| 2 | Extend Badge primitive | 0.25 day |
| 3 | Group identity migration | 0.5 day |
| 4 | Habit surface migration | 0.5 day |
| 5 | Focus marker migration | 0.25 day |
| 6 | Priority migration | 0.25 day |
| 7 | Schedule channel migration | 0.5 day |
| 8 | Workplace + timeline row migration | 0.5 day |
| 9 | Dashboard accent migration | 0.25 day |
| 10 | Panel toggle migration | 0.1 day |
| 11 | Drag preview alignment | 0.1 day |
| 12 | Heatmap contrast spot-check | 0.1 day |

~35 files max. 0 new modules. ~2–2.5 days total.

---

# Out of scope

- Typography (`lib/typography.ts` untouched)  
- Layout changes  
- Border radii unification  
- Page headers  
- SegmentedControl extraction  
- Select primitive  
- Checkbox glyph replacement  
- New OKLCH hues  
- Light theme  
- Timeline architecture refactor  
- Notes growth-area colors  
- Kanban drop indicators  
- Redesigning any page  

---

# Files affected

### Central libs (modify)

- `lib/task-group-appearance.ts`  
- `lib/schedule-palette.ts`  
- `lib/timeline-habit-appearance.ts`  
- `lib/task-priority.ts`  
- `lib/schedule-layout.ts`  
- `lib/panel-toggle-styles.ts`  
- `lib/workplace-group-accent.ts`  
- `components/ui/badge.tsx`  
- `lib/task-drag-preview.ts`  
- `components/focus/focus-heatmap.tsx`  

### Feature components (~25 files)

Tasks board, Workplace, Schedule, Dashboard, Habits, Focus surfaces — full list in source canvas Section 4.

### Explicitly LEAVE UNTOUCHED

`notes/**`, `reflection/**`, `settings/**`, `auth/**`, `lib/typography.ts`, checkbox glyphs in timeline/workplace/schedule-block, `lib/notes-utils.ts`, kanban drop indicators.

---

# Verification

## Success criteria (measurable)

1. Zero rainbow group pills on Tasks board  
2. No `bg-sky-600` / `bg-orange-600` in central libs  
3. All entity chips use Badge variants  
4. Habit rows neutral surface + warning edge  
5. Focus marker is accent dot — not violet pill  
6. Indigo dominant on Workplace  
7. `npm run build` passes  
8. ESLint/TS pass

---

# Deferred work

Items explicitly excluded from Phase 2 contract:

- Notes/reflection accent alignment  
- Full hardcoded palette zero (542 → significant reduction, not elimination)  
- Typography application  
- SegmentedControl primitive  
- task-row completion glyph (flag-only allowed by contract — validated in post-release patch)

---

# Lessons learned

Central-lib-first ordering (Task 1 before migrations) prevents feature files from guessing accent values. Frozen accent rule table eliminates designer interpretation during implementation.

---

# Related documents

- [03-phase2-strategic-review.md](./03-phase2-strategic-review.md)  
- [03-phase2-implementation.md](./03-phase2-implementation.md)  
- [03-phase2-post-review.md](./03-phase2-post-review.md)  
- Source: `.cursor/projects/.../canvases/flowos-phase-2-spec.canvas.tsx`
