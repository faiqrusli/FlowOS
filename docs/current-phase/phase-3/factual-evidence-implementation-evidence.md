# Factual Evidence — Implementation Evidence

**State:** `IMPLEMENTED_AUTOMATED` — manual seeded/real-data, RLS, timezone, and accessibility evidence remains pending for the final Phase 3 validation pass
**Date:** 2026-08-05
**Owner:** Founder / Implementation Engineer
**Authority:** [Factual evidence delivery design](../../04-features/delivery/factual-evidence.md) · [Factual evidence validation plan](../../04-features/validation/factual-evidence.md)
**Gate link:** [Gate 3 checklist](./gate-checklist.md#exit-criteria)

## Implemented boundary

- Added typed factual evidence envelopes for source, canonical owner, record identity, provenance, user scope, freshness, effective/observed instants, derivation, limitations, and correction routing.
- Added pure adapters for owner-confirmed Task records, Focus session records, verified/unavailable Focus attribution, unavailable sources, and explicitly derived summaries.
- Integrated task/session evidence into the Today read model. Today still performs no durable write and keeps Next Up and Focus attribution unavailable until their migrations are applied and verified.
- Kept withdrawn Task history historical rather than relabelling it completion or deletion; Focus elapsed time remains session evidence rather than an outcome claim.

## Automated evidence

| Check | Result | Scope / limitation |
|---|---|---|
| `factual-evidence.test.ts` | `PASS` — 5 tests | Covers owner/identity/provenance/scope, withdrawn history, session-scoped timing, unavailable attribution, derivation inputs, and unavailable-source mapping. |
| `today-composition.test.ts` | `PASS` — 7 tests | Confirms task/session projections retain evidence metadata while source settlement, stale refresh, date forwarding, and migration fallback remain intact. |
| Targeted ESLint | `PASS` — 0 errors | Existing non-critical React hook warnings are carried repository debt. |

## Deferred evidence

- Seeded and real-data full/partial journey walkthrough with correction routing.
- Two-account RLS isolation, Singapore date-boundary, browser accessibility, and configured production-build evidence.
- Live verification of migration-backed attribution before any factual task totals are claimed.

