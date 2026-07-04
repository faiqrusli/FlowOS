# Phase 1 — Fresh-Eyes Scope Correction (Pre-Implementation)

**Date:** July 3, 2026  
**Timing:** After Phase 1 approval, immediately before implementation began  
**Source:** Agent transcript — no separate Canvas artifact

---

# Purpose

Final scope correction before Phase 1 code changes. Independent re-inspection caught a false-premise task and reduced SegmentedControl scope.

---

# Background

User approved the revised Phase 1 roadmap from `02-phase1-review.md`. Before writing code, a fresh-eyes pass re-read the codebase against the approved tasks.

---

# Problems identified

1. **Task 3 (Focus settings pill inputs) — FALSE PREMISE**  
   Audit claimed Focus settings used pill-shaped inputs. Re-inspection showed standard `Input` components already in use. Implementing this task would be a no-op or accidental regression.

2. **Task 1 (SegmentedControl primitive) — OVERSCOPED**  
   Full primitive + 4 migrations risked keyboard regressions. Quick Capture Plan toggle was the only high-traffic divergent instance requiring immediate fix.

3. **Timeline toggle — SEPARATE CONCERN**  
   Timeline planner toggle needs different treatment (zoom semantics) — not bundled into Quick Capture restyle.

---

# Decisions

| Change | From | To |
|--------|------|-----|
| Task 3 | Focus settings pill → Input | **REMOVED entirely** |
| Task 1 | SegmentedControl primitive + 4 migrations | **Option A:** inline Quick Capture Plan restyle only |
| Effort estimate | ~1.5–2 days | ~1–1.5 days |
| Task count | 5 | 4 |

User did not re-approve explicitly in a separate message — correction applied as implementation guidance within the already-frozen contract interpretation boundary.

---

# Scope

Correction reduced implementation to 4 tasks. No additions.

---

# Out of scope

Unchanged from approved Phase 1 — correction only removed/reduced, never expanded.

---

# Files affected

Removed from scope: `focus-settings-panel.tsx`

Reduced scope: only `quick-capture-dialog.tsx` for Task 1 (not 4 files)

---

# Verification

Fresh-eyes findings verified by reading `focus-settings-panel.tsx` and toggle implementations. Implementation report (`02-phase1-implementation.md`) confirms 4-task delivery.

---

# Deferred work

SegmentedControl primitive extraction deferred until copy-paste pain threshold. Timeline/Schedule/Workplace toggles remain on `panel-toggle-styles.ts` recipes — migrated cosmetically in Phase 2 Task 10.

---

# Lessons learned

1. **Always fresh-eyes inspect immediately before implementation** — approval of a review doc doesn't guarantee tasks match current code  
2. False-premise tasks waste time and erode trust in the review process  
3. Option A should be the default for Phase N.1 when primitive extraction isn't urgent

---

# Related documents

- [02-phase1-review.md](./02-phase1-review.md)  
- [02-phase1-spec.md](./02-phase1-spec.md)  
- [02-phase1-implementation.md](./02-phase1-implementation.md)  
- [AUDIT_HISTORY.md](./AUDIT_HISTORY.md) — SegmentedControl postponement rationale
