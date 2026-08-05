# Today Orientation — Implementation Evidence (In Progress)

**State:** `IN_PROGRESS` — implementation baseline is on `sprint/phase3`; this record does not pass Gate 3
**Date:** 2026-08-05
**Owner:** Founder / Implementation Engineer
**Authority:** [Today orientation validation plan](../../04-features/validation/today-orientation.md) · [D-009](../../08-decisions/records/D-009-approve-today-orientation-delivery-design.md)
**Gate link:** [Gate 3 checklist](./gate-checklist.md#exit-criteria)

## Scope implemented

- Replaced the `/` Today composition’s embedded `WorkplacePageContent` mutation surface with read-only source modules and canonical owner links.
- Added independently settled Tasks, Focus, Reflection, and Habits reads with source-local error, stale, empty, partial, and unavailable treatment.
- Added derived Schedule treatment from confirmed task/habit reads and explicit Notes-unavailable treatment; no new Notes integration was admitted.
- Kept Next Up persistence and Focus-to-task attribution unavailable pending the carried migrations.
- Added request-identity protection for full refresh, source-scoped retry, visibility re-entry, and Focus-owner re-entry after a saved session.
- Added a read-only habit reader that does not call the owner surface’s stale-flag repair path.

## Automated evidence

| Check | Result | Scope / limitation |
|---|---|---|
| `npm test` | `PASS` — 25 files, 253 tests | Pure adapter coverage does not establish visual comprehension or live RLS isolation. |
| Today composition tests | `PASS` — 7 tests | Covers explicit date key, independent settlement, empty/partial/error/stale states, scoped retry, migration limitations, and score-language absence. |
| `npm run lint` | `PASS` — 0 errors, 211 existing warnings | Existing React hooks, audit, and middleware technical-debt warnings remain. |
| `git diff --check` | `PASS` | Worktree diff was whitespace-clean at evidence capture. |
| TypeScript | `PARTIAL` | New Today files introduce no TypeScript errors; repository-wide `tsc` still reports four pre-existing test/type issues outside this change. |
| `npm run build` | `PARTIAL` | Production compilation and TypeScript completed; prerendering `/about` remains blocked by the known missing `NEXT_PUBLIC_SUPABASE_URL` environment. |

## Pending validation

- Seeded and real-data walkthrough at `/`, including direct entry, owner handoff, interruption, retry, and return.
- Keyboard, screen-reader, responsive, visible-focus, and reduced-motion review.
- Two-account RLS isolation evidence and Singapore midnight boundary evidence.
- Production build with `NEXT_PUBLIC_SUPABASE_URL` and required environment configured.
- Manual confirmation that Today navigation, retry, and departure issue no durable owner mutation.
- Browser smoke validation could not run because no browser backend is available in this execution environment; an unauthenticated local HTTP request returned `500` under the same incomplete runtime configuration. This is not a manual pass.

## Current disposition

The implementation is within D-009’s approved boundary and may continue to validation. Gate 3 remains `NOT_STARTED`; no migration application, production release, or Gate 3 pass is claimed.
