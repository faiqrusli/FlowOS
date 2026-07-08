# Design Phase Reviews (Historical)

**Status:** Complete through Phase 2 (July 2026) — frozen in archive  
**Active reviews:** Use [../milestones/](../milestones/) for M0–M5 execution

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

### Today page (July 2026)

| Document | Source canvas | Role |
|----------|---------------|------|
| [today-executive-review.md](./today-executive-review.md) | `flowos-today-executive-review.canvas.tsx` | ChatGPT proposal vs shipped Today — audit, gap analysis, V2 convergence, 80/20 plan |
| [today-v3-greenfield-design.md](./today-v3-greenfield-design.md) | `flowos-today-v3-greenfield-design.canvas.tsx` | First-principles Day Engine design (Concept B: NOW + NEXT + rest) |
| [schedule-break-modal-spec.md](./schedule-break-modal-spec.md) | — | Schedule Break modal for quick focus — user-initiated reminders, not Pomodoro |

**Authoritative visual system:** [../../foundation/DESIGN_SYSTEM.md](../../foundation/DESIGN_SYSTEM.md) — four-level surface hierarchy, chrome philosophy, migration plan.

**Git anchors:** Phase 0 `5fc780a` · Phase 1 `04fe227` · Phase 2 `9f7e7c4`

---

## Future design work

If a new design phase runs (e.g. visual polish after M3), create:

1. Review doc in `docs/review/design/` (or archive when frozen)  
2. Follow [../template.md](../template.md) SRAI structure  
3. Link from [../milestones/](../milestones/) if tied to an execution milestone  

Do not store authoritative history in `.cursor/plans/` or Canvas-only form.
