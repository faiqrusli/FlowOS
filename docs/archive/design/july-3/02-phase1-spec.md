# Phase 1 — Engineering Contract

**Date:** July 3, 2026  
**Status:** APPROVED — merged into review document (no separate spec canvas)

---

# Purpose

This document records the Phase 1 engineering contract. Unlike Phase 0 and Phase 2, no separate spec Canvas was created — the approved revised roadmap in `02-phase1-review.md` served directly as the implementation contract after user approval.

---

# Background

User instruction at approval: *"The roadmap is now the engineering contract. Implement it exactly."* A fresh-eyes correction immediately before implementation further refined scope (see `02-phase1-post-review.md`).

---

# Problems identified

See [02-phase1-review.md](./02-phase1-review.md).

---

# Decisions

## Frozen implementation contract (final, post fresh-eyes correction)

### Task 1 — Quick Capture Plan toggle (Option A)

**File:** `quick-capture-dialog.tsx`

Replace divergent `rounded-full` / `bg-muted` toggle with Workplace Focus/Pomodoro recipe:
- Container: `rounded-lg border border-border`  
- Active: `bg-card shadow-xs text-foreground`  
- Inactive: muted text, no inverted fill  

**Not in scope:** SegmentedControl primitive; Workplace toggle migration; timeline toggle migration.

### Task 2 — Inverted-surface remediation

Replace `bg-foreground text-background` selected/active patterns with semantic tokens:

| File | Element | Replacement |
|------|---------|-------------|
| `schedule-task-sidebar.tsx` | Auto button | Secondary button variant |
| `notes-panel.tsx` | Toast surface | Popover surface tokens |
| `growth-area-sidebar.tsx` | Add button | Primary button variant |
| `growth-area-icon-chooser.tsx` | Selected icon | `flow-selected` |
| `timeline-planner.tsx` | Zoom active state | Card elevation (not inverted) |

**Excluded:** `convert-actions.tsx` (5% tint — not inverted pattern).

**Deleted:** `schedule-header.tsx` (dead file).

### Task 3 — Time picker tokenization

**File:** `time-picker-panel.tsx`

`ring-sky-400/45` → `ring` / `selected` semantic tokens (~4 string replacements).

### Task 4 — Dead code deletion

Delete `native-picker-input.tsx`. Delete approved `schedule-header.tsx`.

---

# Scope

4 tasks (after fresh-eyes correction). ~1–1.5 days. Interaction consistency only.

---

# Out of scope

- SegmentedControl primitive  
- Select consolidation  
- Badge/chip work  
- Focus settings pill inputs (removed — false premise)  
- Accent/color palette changes beyond token references  
- Layout or spacing changes

---

# Files affected

9 files expected (+23/−170 lines per commit).

---

# Verification

- Visual walkthrough of toggle restyle against Workplace reference  
- No inverted pills remain in the 4 remediated instances  
- Time picker highlight uses semantic tokens  
- Dead files removed  
- `npm run build` passes

---

# Deferred work

All Badge, group-dot, panel-toggle sky, and remaining segmented copy-pastes → Phase 2.

---

# Lessons learned

Not every phase needs a separate spec canvas if the review document is sufficiently deterministic. Fresh-eyes correction should happen *before* implementation starts, with explicit scope delta documented.

---

# Related documents

- [02-phase1-review.md](./02-phase1-review.md) — primary contract source  
- [02-phase1-post-review.md](./02-phase1-post-review.md) — scope correction  
- [02-phase1-implementation.md](./02-phase1-implementation.md)
