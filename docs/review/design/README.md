# Design Phase Reviews (Historical)

**Status:** Complete through Phase 2 (July 2026) — frozen in archive  
**Active reviews:** Use [../milestones/](../milestones/) for M0–M5 execution  
**Hold:** Large new design phases deferred while implementation is paused for review.

The design program (visual system, interaction consistency, accent language) ran **before** the execution masterplan. Its review artifacts live in the archive; this index is the entry point from `docs/review/`.

---

## SRAI mapping (design phases)

| SRAI step | Design program artifact | Location |
|-----------|-------------------------|----------|
| **Summarize** | Implementation report | `*-implementation.md` |
| **Review** | Strategic / scope review | `*-review.md`, `*-strategic-review.md` |
| **Audit** | Post-review, design audit | `*-post-review.md`, `00-design-audit.md` |
| **Improve** | CHANGELOG, AUDIT_HISTORY, PROJECT_STATE | [archive/design/july-3/](../../archive/design/july-3/) |

---

## Phase index

Read each phase in order: **review → spec → implementation → post-review**.

| Phase | Review | Spec | Implementation | Post-review |
|-------|--------|------|----------------|-------------|
| Audit | [00-design-audit.md](../../archive/design/july-3/00-design-audit.md) | — | — | [FINAL-AUDIT-REPORT.md](../../archive/design/july-3/FINAL-AUDIT-REPORT.md) |
| 0 | [01-phase0-review.md](../../archive/design/july-3/01-phase0-review.md) | [01-phase0-spec.md](../../archive/design/july-3/01-phase0-spec.md) | [01-phase0-implementation.md](../../archive/design/july-3/01-phase0-implementation.md) | [01-phase0-post-review.md](../../archive/design/july-3/01-phase0-post-review.md) |
| 1 | [02-phase1-review.md](../../archive/design/july-3/02-phase1-review.md) | [02-phase1-spec.md](../../archive/design/july-3/02-phase1-spec.md) | [02-phase1-implementation.md](../../archive/design/july-3/02-phase1-implementation.md) | [02-phase1-post-review.md](../../archive/design/july-3/02-phase1-post-review.md) |
| 2 | [03-phase2-strategic-review.md](../../archive/design/july-3/03-phase2-strategic-review.md) | [03-phase2-spec.md](../../archive/design/july-3/03-phase2-spec.md) | [03-phase2-implementation.md](../../archive/design/july-3/03-phase2-implementation.md) | [03-phase2-post-review.md](../../archive/design/july-3/03-phase2-post-review.md) |

### Cross-cutting reviews

| Document | Role |
|----------|------|
| [ux-friction-review.md](../../archive/design/july-3/ux-friction-review.md) | Simulated daily loop audit — input for M2/M3 |
| [AUDIT_HISTORY.md](../../archive/design/july-3/AUDIT_HISTORY.md) | Decision rationale index |
| [CHANGELOG.md](../../archive/design/july-3/CHANGELOG.md) | Chronological design evolution |

### Specs (July 2026)

| Document | Status | Role |
|----------|--------|------|
| [today-executive-review.md](./today-executive-review.md) | Review complete | ChatGPT proposal vs shipped Today |
| [today-page-hierarchy-refinement-spec.md](./today-page-hierarchy-refinement-spec.md) | **Shipped** | Hierarchy + PLAN→COMMIT→EXECUTE of current Today |
| [schedule-break-modal-spec.md](./schedule-break-modal-spec.md) | **Shipped** | Schedule Break modal |
| [notification-system-mvp-spec.md](./notification-system-mvp-spec.md) | **Partial** | Reminders MVP shipped; center gated |
| [flowos-live-demo-spec.md](./flowos-live-demo-spec.md) | **Approved** | Guest live demo v1.2 · [runbook](../../execution/runbooks/flowos-live-demo.md) |
| [today-v3-greenfield-design.md](./today-v3-greenfield-design.md) | **Deferred** | Day Engine rebuild — not current work |

**Retired after ship:** Application shell navigation spec/runbook — deleted after Jul 17 merge; see [july-log.md](../../execution/logs/july-log.md).

**Authoritative visual system:** [DESIGN_SYSTEM_V3.md](../../foundation/DESIGN_SYSTEM_V3.md) · [Tokyo Night Warm](../../foundation/DESIGN_SYSTEM_TOKYO_NIGHT_WARM.md) · Workspace · Interaction. Historical themes: [archive/design/themes/](../../archive/design/themes/).

**Superseded Next Up V1:** [archive/runbooks/next-up-queue-spec.md](../../archive/runbooks/next-up-queue-spec.md) · Living: [design/focus/next-up.md](../../design/focus/next-up.md)

**Git anchors:** Phase 0 `5fc780a` · Phase 1 `04fe227` · Phase 2 `9f7e7c4`

---

## Future design work

If a new design phase runs after the hold is lifted:

1. Review doc in `docs/review/design/` (or archive when frozen)  
2. Follow [../template.md](../template.md) SRAI structure  
3. Link from [../milestones/](../milestones/) if tied to an execution milestone  

Do not store authoritative history in `.cursor/plans/` or Canvas-only form.
