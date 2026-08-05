# D-012 — Migration Application and Verification Protocol

**Decision ID:** D-012  
**Date:** 2026-08-05  
**Status:** `ACCEPTED`  
**Owner:** Founder  
**Phase:** Phase 3 — Implement and Harden the Core Loop  
**Sprint:** [Current Sprint](../../current-phase/current-sprint.md)  
**Gate:** [Gate 3 checklist](../../current-phase/phase-3/gate-checklist.md)

## Context

Two Supabase SQL migrations exist in the repository but are not applied to the live database:
- `supabase/migrations/tasks_next_up_queue.sql` — Materialized view for persistent Next Up task membership/order
- `supabase/migrations/focus_session_task_totals.sql` — Derived attribution totals for Focus sessions by task

P2 Tasks and P3 Focus delivery designs keep these capabilities **unavailable** until applied and verified. The UI shows fallback/limitation language when these features are unavailable.

Phase 3 must define when, who, how, and what verification is required before claiming these capabilities are available.

## Decision

**Apply migrations during P7 Gate 3 evidence preparation, after P6 implementation completes**

### Timing
- Migrations remain unapplied during P2–P6 implementation
- Apply both migrations during P7 (Gate 3 evidence preparation), before Founder coherent-loop walkthrough
- If application or verification fails, migrations remain unavailable and UI fallback is considered correct for Gate 3

### Owner
- **Applier:** Implementation Engineer executes SQL via Supabase Studio or CLI during P7
- **Verifier:** Founder reviews verification evidence and approves capability as available
- **Rollback authority:** Founder; rollback via SQL script or Supabase migration revert

### Application Procedure
1. Implementation Engineer prepares rollback SQL for both migrations
2. Implementation Engineer applies `tasks_next_up_queue.sql` to live Supabase project
3. Implementation Engineer verifies materialized view exists and is queryable: `SELECT * FROM tasks_next_up_queue WHERE user_id = 'test-user-id' LIMIT 5;`
4. Implementation Engineer applies `focus_session_task_totals.sql` to live Supabase project
5. Implementation Engineer verifies derived totals are correct: compare manual SUM query to materialized view result for known session set
6. Implementation Engineer executes two-account verification: User A's Next Up queue and attribution totals do not include User B's data

### Verification Evidence Required
- SQL execution logs showing successful `CREATE MATERIALIZED VIEW` for both migrations
- Query results showing non-empty, user-scoped data from both views
- Two-account isolation evidence: User A query returns User A data only; User B query returns User B data only
- UI smoke test: Next Up reorder persists across page refresh; Focus attribution totals appear and match manual calculation
- Rollback script tested in Supabase Studio (non-production) or documented as `DROP MATERIALIZED VIEW` commands

### Failure Treatment
- If application fails: document error, leave migrations unapplied, UI fallback remains correct
- If verification fails: roll back applied migrations, document issue, UI fallback remains correct
- If rollback fails: escalate to Founder; may require Supabase support or manual data repair

## Rationale

1. **Timing:** Applying migrations during P2–P6 implementation risks blocking work if verification fails; P7 is the natural evidence-collection gate and allows P2–P6 to proceed with designed fallback behavior.

2. **Owner:** Implementation Engineer has SQL/Supabase access and technical context; Founder verification ensures migrations are not silently assumed available without evidence.

3. **Verification depth:** Two-account RLS verification is included because these migrations expose user-scoped derived data; single-account verification is insufficient for security confidence.

4. **Rollback readiness:** Migrations that fail verification are rolled back to preserve truthful unavailable state; no silent "assume it works" logic is permitted.

## Alternatives Considered

- **Apply migrations immediately before P2:** Rejected — blocks P2 if verification fails; fallback behavior is already designed.
- **Apply migrations inline during P2/P3 implementation:** Rejected — couples migration risk to feature implementation; separation is cleaner.
- **Defer migrations to Gate 4:** Rejected — Gate 3 requires Founder coherent-loop walkthrough; Next Up persistence and Focus attribution improve the walkthrough experience if verified.
- **Skip two-account verification:** Rejected — these views aggregate user-scoped data; RLS verification is mandatory before claiming availability.

## Affected Artifacts

- [Gate 3 checklist](../../current-phase/phase-3/gate-checklist.md) — G3-07 cross-package security evidence includes migration verification
- [Current Sprint](../../current-phase/current-sprint.md) — P7 Gate 3 evidence tasks include migration application and verification
- [Tasks delivery design](../../04-features/delivery/tasks-core-loop.md) — Next Up behavior remains conditional on verified migration
- [Focus delivery design](../../04-features/delivery/focus-core-loop.md) — Attribution behavior remains conditional on verified migration

## Next Actions

1. Implementation Engineer completes P2–P6 implementation with unavailable/fallback behavior for Next Up persistence and Focus attribution.
2. During P7, Implementation Engineer applies migrations per this protocol.
3. Implementation Engineer records verification evidence in [Gate 3 checklist](../../current-phase/phase-3/gate-checklist.md) G3-07.
4. Founder reviews verification evidence and approves capability availability or confirms fallback remains correct.

## References

- [D-008 — Pass Gate 2 and Authorize Phase 3](./D-008-pass-gate-2-and-authorize-phase-3.md)
- [D-010 — Approve P2–P6 Delivery Designs](./D-010-approve-p2-p6-delivery-designs.md)
- [D-011 — Phase 3 Technical Debt Disposition](./D-011-phase-3-technical-debt-disposition.md)
- [Gate 3 checklist](../../current-phase/phase-3/gate-checklist.md)
- [Tasks core-loop delivery design](../../04-features/delivery/tasks-core-loop.md)
- [Focus core-loop delivery design](../../04-features/delivery/focus-core-loop.md)
