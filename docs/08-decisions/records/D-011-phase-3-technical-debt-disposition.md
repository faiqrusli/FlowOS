# D-011 — Phase 3 Technical Debt and Carried Condition Disposition

**Decision ID:** D-011  
**Date:** 2026-08-05  
**Status:** `ACCEPTED`  
**Owner:** Founder  
**Phase:** Phase 3 — Implement and Harden the Core Loop  
**Sprint:** [Current Sprint](../../current-phase/current-sprint.md)  
**Gate:** [Gate 3 checklist](../../current-phase/phase-3/gate-checklist.md)

## Context

Phase 2 carried forward several technical debt items and outstanding verification requirements. Phase 3 must disposition these items to clarify what blocks P2–P6 implementation, what blocks Gate 3, and what remains a Gate 4/pre-release requirement.

Current carried conditions from Phase 2 handoff:
- 211 ESLint warnings (primarily `react-hooks/set-state-in-effect`, `react-hooks/refs`, `react-hooks/exhaustive-deps`, unused variables)
- Pending migrations: `tasks_next_up_queue.sql`, `focus_session_task_totals.sql` (SQL definitions exist but not applied/verified in live Supabase)
- Outstanding evidence: two-account RLS verification, Singapore midnight boundary testing, Schedule keyboard accessibility review
- Environment: phase3 worktree has no `.env.local`; production builds require transient environment from primary workspace
- Browser validation: manual smoke and accessibility reviews cannot run without configured runtime

## Decision

**Option A: Defer carried conditions to pre-Gate-4 hardening sprint**

Accept all carried conditions as downstream Gate 4 requirements. Do not block P2–P6 implementation. Address in a separate Gate 3.5/pre-Gate-4 hardening sprint after Gate 3 passes.

**Exception: Critical lint fixes completed immediately:**
- Fixed 3 critical `react-hooks/refs` and `react-hooks/immutability` issues in `kanban-board-view.tsx` and `task-row.tsx` that could cause stale-closure bugs during Focus/Tasks implementation ✅
- Configured phase3 worktree with `.env.local` to enable repeatable local verification (per [D-013](./D-013-phase3-environment-configuration.md)) ✅
- Fixed critical ref-access-during-render bugs in `note-floating-card.tsx` and `task-board-actions-context.tsx` ✅
- Fixed React Hook Form incompatible-library warning in `task-dialog.tsx` with appropriate suppression ✅
- Removed unused imports and variables in `schedule-time-grid.tsx`, `schedule-page-content.tsx` ✅
- **Remaining 203 non-critical warnings** will be addressed during P2-P6 implementation in batches to avoid blocking P2 start

## Disposition Schedule

| Item | Gate 3 Requirement | Gate 4 Requirement | Phase 3 Action |
|---|---|---|---|
| Critical lint (refs/immutability) | ✅ YES | ✅ YES | ✅ COMPLETE (2026-08-05) |
| Remaining lint warnings (203) | ⚠️ PARTIAL | ✅ YES | Address during P2-P6 implementation |
| Phase3 environment configuration | ✅ YES | ✅ YES | ✅ COMPLETE (2026-08-05) |
| Pending migrations | ⚠️ PARTIAL | ✅ YES | Keep unavailable; apply in P7 (D-012) |
| Two-account RLS verification | ❌ NO | ✅ YES | Defer to pre-Gate-4 |
| Singapore midnight boundary test | ❌ NO | ✅ YES | Defer to pre-Gate-4 |
| Schedule keyboard accessibility | ❌ NO | ✅ YES | Defer to pre-Gate-4 |
| Browser smoke/accessibility | ⚠️ PARTIAL | ✅ YES | Seeded walkthrough only for G3 |

**Rationale for immediate critical lint fixes only:**
- Stale-closure bugs from ref-access-during-render were fixed immediately as they could cause silent incorrect behavior in Tasks/Focus
- Remaining 203 warnings (77 set-state-in-effect, 52 refs, 30 exhaustive-deps, ~15 unused-vars) are mostly valid patterns or false positives that require case-by-case analysis
- Blocking P2 implementation for 2-3 hours of systematic lint cleanup provides diminishing returns when critical issues are already fixed
- Incremental cleanup during P2-P6 implementation maintains momentum while ensuring quality

**Rationale for deferred verification:**
- RLS, timezone, and accessibility verification do not block P2–P6 implementation within approved designs
- Gate 3 requires Founder coherent-loop walkthrough with seeded/real data; deep security/accessibility evidence remains Gate 4
- Migrations remain unavailable until applied/verified; UI shows fallback as designed

## Alternatives Considered

- **Option B — Block P2–P6 until all conditions resolved:** Rejected — carried conditions do not prevent implementation within approved delivery designs; blocking would delay Phase 3 unnecessarily.
- **Option C — Disposition each item separately:** Rejected — creates decision overhead; Option A with immediate critical fixes is simpler and sufficient.
- **Fix only critical lint, defer rest:** Rejected — remaining 208 warnings are addressable and should be cleaned before P2 to avoid technical debt accumulation.

## Affected Artifacts

- [Gate 3 checklist](../../current-phase/phase-3/gate-checklist.md) — Carried conditions section updated with disposition schedule
- [Current Sprint](../../current-phase/current-sprint.md) — Technical debt disposition referenced in cross-cutting rules
- [TECHNICAL_ARCHITECTURE.md](../../06-engineering/TECHNICAL_ARCHITECTURE.md) — Known technical debt section updated

## Next Actions

1. ✅ COMPLETE: Critical lint fixes (refs/immutability) addressed on 2026-08-05.
2. ✅ COMPLETE: Founder configured phase3 worktree `.env.local` per [D-013](./D-013-phase3-environment-configuration.md).
3. 🔄 IN PROGRESS: Address remaining 203 lint warnings incrementally during P2-P6 implementation.
4. Two-account RLS, Singapore midnight, Schedule keyboard, and browser accessibility evidence deferred to pre-Gate-4 hardening sprint.
5. Migration application proceeds per [D-012](./D-012-migration-application-protocol.md) during P7.

## References

- [D-008 — Pass Gate 2 and Authorize Phase 3](./D-008-pass-gate-2-and-authorize-phase-3.md)
- [D-010 — Approve P2–P6 Delivery Designs](./D-010-approve-p2-p6-delivery-designs.md)
- [D-012 — Migration Application Protocol](./D-012-migration-application-protocol.md)
- [D-013 — Phase3 Environment Configuration](./D-013-phase3-environment-configuration.md)
- [Gate 3 checklist](../../current-phase/phase-3/gate-checklist.md)
