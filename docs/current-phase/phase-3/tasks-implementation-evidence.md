# Tasks Core Loop — Implementation Evidence

**State:** `IMPLEMENTED_AUTOMATED` — manual, live-RLS, timezone, and browser evidence remains deferred until the Phase 3 implementation pass is complete
**Date:** 2026-08-05
**Owner:** Founder / Implementation Engineer
**Authority:** [Tasks delivery design](../../04-features/delivery/tasks-core-loop.md) · [Tasks validation plan](../../04-features/validation/tasks-core-loop.md)
**Gate link:** [Gate 3 checklist](./gate-checklist.md#exit-criteria)

## Implemented boundary

- Tasks reads and writes resolve the authenticated user and validate task IDs and payloads at runtime.
- Client-provided `user_id`, queue order, and withdrawal fields cannot override the Tasks owner boundary.
- Task state distinguishes open, deferred, completed, and withdrawn records.
- Withdraw keeps the task row and exposes retained history plus an explicit restore path. The lifecycle column remains unavailable until its SQL migration is applied and verified.
- Pending/failed operation state preserves the last confirmed task representation.
- Focus selection is represented as planned context and does not mutate task completion or history.
- Next Up read/write capability is unavailable unless the live queue migration is explicitly verified through `NEXT_PUBLIC_FLOWOS_NEXT_UP_QUEUE_VERIFIED=true`.

## Automated evidence

| Check | Result | Scope / limitation |
|---|---|---|
| `task-core-loop.test.ts` | `PASS` | Covers distinct lifecycle states, pending/failed confirmed-state preservation, confirmed transitions, lifecycle update payloads, and non-mutating Focus selection. |
| `phase3-capabilities.test.ts` | `PASS` | Covers explicit migration capability gating and the unavailable default. |
| Existing Next Up tests | `PASS` | Pure queue ordering/eligibility behavior remains covered; live persistence is intentionally unavailable until verification. |
| Targeted ESLint | `PASS` — 0 errors | Existing non-critical warnings remain in touched legacy components. |

## Deferred evidence

- Apply and verify `tasks_lifecycle.sql` before claiming durable withdrawal/restore in live data.
- Apply and verify `tasks_next_up_queue.sql` before claiming persistent Next Up membership/order.
- Execute seeded/real-data lifecycle, two-account RLS, Singapore date-boundary, keyboard, screen-reader, responsive, and browser checks after P2–P6 implementation.

