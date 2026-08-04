# Phase 1 Gate Checklist — Gate 1: Current Build Truth

**Status:** OPEN — implementation-ready; Phase 1 sprint active (2026-08-04 → 2026-08-08)
**Owner:** Founder (executed via 6-hat solo workflow)  
**Parent:** [Phase 1 README](./README.md) · [MVP Implementation Masterplan](../mvp-implementation-masterplan.md)  
**Created:** 2026-08-04  
**Last Updated:** 2026-08-04

---

## Gate 1 Definition

**Gate 1 — Current build truth:** Every core MVP domain, and every supporting domain retained for the MVP journey, is demonstrable through current behavior, data path, known gaps, and owner. Unknown status must not pass into implementation.

This gate measures the current build; it does not require the product to be complete, polished, or ready for external dogfood. A partial behavior may pass when its boundary, impact, owner, and next disposition are explicit. A placeholder or deferred route is not evidence of an admitted capability.

## Gate 1 Scope

| Scope group | Domains | Gate treatment |
|---|---|---|
| **Core MVP** | Today, Tasks, Focus, Reflection | Each must have a complete implementation-truth record. |
| **Supporting MVP candidates** | Habits, Schedule, Notes / Knowledge | Each must be evidenced as retained supporting behavior or explicitly dispositioned as not required for the MVP journey. |
| **Embedded / derived** | Growth Areas, Progress | Verify ownership and boundaries; do not promote them to standalone MVP domains without a decision. |
| **Deferred / placeholder** | Goals, AI Coach | Verify that the route or shell does not imply MVP admission; no implementation work is required for Gate 1. |

## Gate 1 Exit Criteria

All criteria below must be checked before the Founder records the final decision. The audit-decision table later in this document is a parallel improvement register, not an additional exit criterion.

- [ ] MVP scope status is explicit for every domain in the scope table; no domain is left `Unknown`.
- [ ] Every core domain has current behavior, state transitions, and meaningful edge/recovery states documented.
- [ ] Every core domain has its read paths, write paths, persistence owner, record relationships, and identity/permission assumptions mapped.
- [ ] Every retained supporting domain has the same minimum behavior/data-path record, or has a recorded `Not retained` disposition.
- [ ] Every known gap has severity, owner, evidence, and next disposition; unresolved work is not silently treated as an implementation requirement.
- [ ] Feature, design, and architecture references reconcile with observed code or link to an explicit discrepancy/decision.
- [ ] Quality, accessibility, security, and production/operational baseline evidence is recorded with command or method, date, result, and limitations.
- [ ] No unresolved issue that changes admitted MVP scope or implementation truth is hidden from the Founder gate review.
- [ ] The Founder records `PASS`, `HOLD`, or `REWORK`, with date, rationale, and next-phase authorization or conditions.

## Domain Evidence Register

Use one row per domain. `Complete` means the evidence contract is satisfied; `Partial` is allowed only when every gap is owned and dispositioned; `Not retained` is allowed for a supporting domain when the MVP boundary explicitly excludes its behavior; `Unknown` cannot pass.

| Domain | MVP role | Current implementation starting points | Behavior | Data path | Gaps / owner | Evidence link |
|---|---|---|---|---|---|---|
| **Today** | Core entry and reorientation | `src/app/(main)/page.tsx`, `src/components/today/`, `src/lib/dashboard.ts` | ☐ | ☐ | ☐ | |
| **Tasks** | Core commitment and action | `src/app/(main)/tasks/`, `src/components/tasks/`, `src/lib/tasks.ts`, `src/lib/kanban.ts` | ☐ | ☐ | ☐ | |
| **Focus** | Core deliberate-attention mode | `src/app/(main)/focus/`, `src/components/focus/`, `src/lib/focus*.ts` | ☐ | ☐ | ☐ | |
| **Reflection** | Core sensemaking and adaptation | `src/app/(main)/reflection/`, `src/components/reflection/`, `src/lib/reflection*.ts` | ☐ | ☐ | ☐ | |
| **Habits** | Supporting recurring-action path | `src/app/(main)/habits/`, `src/components/habits/`, `src/lib/habits.ts` | ☐ | ☐ | ☐ | |
| **Schedule** | Supporting planning context | `src/app/(main)/schedule/`, `src/components/schedule/`, `src/lib/schedule*.ts` | ☐ | ☐ | ☐ | |
| **Notes / Knowledge** | Supporting user-owned context | `src/app/(main)/notes/`, `src/components/notes/`, `src/lib/notes.ts` | ☐ | ☐ | ☐ | |

### Embedded, derived, and deferred dispositions

Record the disposition even though these are not implementation-truth domains for the current MVP loop.

| Concept | Current treatment | Required Gate 1 evidence | Status |
|---|---|---|---|
| **Growth Areas** | Embedded in Notes | Confirm no standalone admission or competing ownership boundary | ☐ |
| **Progress** | Derived from evidence and summaries | Confirm no standalone destination or score is being admitted | ☐ |
| **Goals** | Placeholder / deferred | Confirm route treatment does not imply MVP capability | ☐ |
| **AI Coach** | Placeholder / deferred | Confirm no implementation work or implied authority is admitted | ☐ |

### Evidence entry template

Copy this structure into the evidence link or the related implementation log for each domain:

```markdown
### [Domain] — implementation truth
- Status: Complete | Partial | Not retained | Unknown
- Routes and entry points:
- Rendered components and server/API boundaries:
- Current behavior and state transitions:
- Read paths and data sources:
- Write paths and persistence owner:
- Identity, ownership, permissions, and RLS assumptions:
- Loading, empty, error, unauthorized, interruption, correction, and recovery behavior:
- Known gaps: severity / owner / disposition:
- Evidence reviewed: files, tests, smoke checks, or screenshots:
- Last verified: YYYY-MM-DD
```

## Reconciliations

- [ ] Feature Catalog reconciled with observed code and `FEATURE_INVENTORY.md`; implementation status and MVP admission remain separate.
- [ ] V3 / Tokyo Night Warm references, CSS tokens, component usage, and historical design references reconciled through the [Design Implementation Map](../../05-design/design-implementation-map.md).
- [ ] Route and navigation inventory reconciled, including placeholder routes and deferred modules.
- [ ] Dead code, duplicate scheduling surfaces, dual save paths, undocumented states, and misleading UI claims identified and dispositioned.
- [ ] `TECHNICAL_ARCHITECTURE.md`, client/operations architecture, and the observed route/data/auth map agree or contain linked gaps.

## Baseline Evidence

Record evidence, not just a green/red label. Warnings and known limitations remain visible.

| Baseline | Required evidence | Status |
|---|---|---|
| **Quality** | `npm test`, `npm run lint`, `npm run build`, TypeScript result, warning count, and known deprecated conventions | ✅ Initial baseline captured 2026-08-04: 231 tests passed; lint 0 errors / 212 warnings; build passed on Next.js 16.2.11. Gate review must confirm the record and dispositions. |
| **Accessibility** | Keyboard/focus, semantic labels, responsive states, loading/empty/error/recovery review for retained domains | ☐ Open |
| **Security** | User scoping, auth boundaries, RLS assumptions, server-side validation boundary, secret review, and negative-path checks | ☐ Open; Zod adoption is Phase 1.5, not a Phase 1 assumption |
| **Production / operations** | Build/runtime configuration, route smoke check, deployment health, failure visibility, rollback/recovery ownership, and environment limitations | ☐ Open |

## Gate Review Protocol — 2026-08-08

- [ ] Release Manager confirms every evidence link is readable and reproducible.
- [ ] Founder reviews each core row and each supporting-domain disposition.
- [ ] Founder reviews all unresolved gaps affecting scope, data integrity, security, recovery, or user authority.
- [ ] Any proposed scope or architecture change has a decision record before it is admitted.
- [ ] Founder records one final decision below; no implicit pass is allowed.

---

## Audit Decisions and Parallel Improvement Track

These Founder decisions are recorded for execution during Phase 1 and Phase 1.5. They are not additional Gate 1 exit criteria. Source: [post-phase-0-audit.md](./post-phase-0-audit.md) §8, [D-005](../../08-decisions/records/D-005-post-phase-0-audit-decisions.md), and [Technology Integration Masterplan](../../06-engineering/technology-integration-masterplan.md).

| # | Decision | Status / Gate impact |
|---|---|---|
| **1** | Keep `authority-matrix.md` and `streamlined-organization.md` deferred for future use; do not move or remove them now | ✅ Recorded and complete — future-use disposition; not a Gate 1 blocker |
| **2** | Retire the legacy light-theme token block; a future light theme will be implemented from scratch | ✅ Implemented — no Gate 1 blocker |
| **3** | Consolidate duplicate archive runbooks under `docs/11-archive/execution/runbooks/` | ✅ Implemented — no Gate 1 blocker |
| **4** | Remove generated repository artifacts and add ignore rules so they stay local | ✅ Ignore rules implemented — no Gate 1 blocker |
| **5** | Add `npm test` to CI now | ✅ Implemented in `.github/workflows/ci.yml` — no Gate 1 blocker |
| **6** | Defer Zod and technical integration to Phase 1.5; current guidance must not claim Zod is installed | ↗ Scheduled in Phase 1.5 — not required for Gate 1; active docs must remain library-neutral |
| **7** | Keep code status and MVP admission as separate fields in `FEATURE_INVENTORY.md` | ✅ Implemented — no Gate 1 blocker |
| **8** | Treat archived workspace/interaction design files as historical; use the design implementation map to reconcile active standards | ✅ Implemented — no Gate 1 blocker |

Gate rule: The statuses above record Founder direction and improvement scheduling. They are still useful in this checklist for traceability, but they are not Gate 1 exit criteria. Only an unresolved decision that changes admitted MVP scope or implementation truth can be promoted into a Gate 1 blocker.

---

## Evidence Index

Attach or link evidence for each line item as the Phase 1 sprint completes. Prefer a concise implementation log or source reference over duplicating the full code review in this checklist.

| Evidence area | Link / record | Status |
|---|---|---|
| Domain truth entries | Domain Evidence Register above | ☐ Open |
| Feature status reconciliation | `feature-catalog.md` + `FEATURE_INVENTORY.md` | ☐ Open |
| Design reconciliation | `design-implementation-map.md` + `src/app/globals.css` | ☐ Open |
| Architecture and data/auth map | `TECHNICAL_ARCHITECTURE.md` + relevant source paths | ☐ Open |
| Quality baseline | August log / command output | ✅ Initial baseline captured |
| Accessibility baseline | Phase 1 evidence record | ☐ Open |
| Security baseline | Phase 1 evidence record; Phase 1.5 validation decision separate | ☐ Open |
| Production / operations baseline | Phase 1 evidence record | ☐ Open |

---

## Decision

_Recorded here once the Founder completes the 2026-08-08 review._

**Decision:** `PASS` / `HOLD` / `REWORK`
**Date:**
**Founder:**
**Rationale and unresolved conditions:**
**Next-phase authorization:**

---

## Related

- Starting question list: [implementation truth backlog](../../11-archive/phases/phase-0/implementation-truth-backlog.md)
- Masterplan Phase 1: [mvp-implementation-masterplan.md](../mvp-implementation-masterplan.md)
- Phase 1.5 technical integration: [Technology Integration Masterplan](../../06-engineering/technology-integration-masterplan.md)
- Sprint: [current-sprint.md](../current-sprint.md) (Phase 1 sprint active)