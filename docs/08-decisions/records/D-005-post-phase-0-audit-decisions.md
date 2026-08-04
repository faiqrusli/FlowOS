# Decision Record: Post-Phase-0 Documentation Audit Decisions

**Status:** Accepted  
**Authority:** Founder decision record for the post-Phase-0 documentation and workflow audit  
**Owner:** Founder  
**Created:** 2026-08-04  
**Last reviewed:** 2026-08-04  
**Parent:** [Post-Phase-0 Audit](../../current-phase/phase-1/post-phase-0-audit.md) · [Phase 1 Gate Checklist](../../current-phase/phase-1/gate-checklist.md)

---

## Decision

The six hats remain authoritative. The three modes — Plan, Build, and Ship — group the hats for a faster solo implementation workflow. The Founder wears all six hats and performs brief self-approval checkpoints; the workflow must not create unnecessary handoff queues.

Post-Phase-0 documentation improvements run in parallel with Phase 1 and do not block Phase 1 start or Gate 1 unless an unresolved issue changes admitted MVP scope or implementation truth.

## Accepted audit decisions

1. Keep `authority-matrix.md` and `streamlined-organization.md` deferred for future use; do not move or remove them now.
2. Retire the legacy light-theme token block; implement a future light theme from scratch if needed.
3. Consolidate duplicate archive runbooks under `docs/11-archive/execution/runbooks/`.
4. Remove generated repository artifacts and ignore their report, lint, crash-log, and replay patterns.
5. Add `npm test` to CI now.
6. Defer Zod and technical integration to Phase 1.5; active documentation must not claim Zod is installed before adoption.
7. Keep implementation code status separate from MVP admission status in `FEATURE_INVENTORY.md`.
8. Treat archived workspace and interaction design documents as historical evidence; use `design-implementation-map.md` to reconcile active standards.

## Consequences

- Phase 1 continues immediately with implementation-truth work.
- Phase 1.5 is governed by the [Technology Integration Masterplan](../../06-engineering/technology-integration-masterplan.md) and [D-004](./D-004-add-phase-1-5-foundation-infrastructure-to-mvp-masterplan.md).
- Founder authorization remains required for consequential scope, architecture, merge, and release decisions.
- Gate 1 continues to measure current behavior, data path, known gaps, and owners; audit cleanup is not a blanket exit criterion.

## Evidence

- [Phase 1 Gate Checklist](../../current-phase/phase-1/gate-checklist.md)
- [Current Sprint](../../current-phase/current-sprint.md)
- [MVP Implementation Masterplan](../../current-phase/mvp-implementation-masterplan.md)