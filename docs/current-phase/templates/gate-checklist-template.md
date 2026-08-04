# [Phase N] Gate Checklist — [Gate Name]

**Template state:** `REFERENCE_ONLY` — not a live gate
**Status:** `TEMPLATE — UNASSIGNED`
**Source example:** [Phase 1 Gate 1 Checklist](../phase-1/gate-checklist.md)
**Owner:** [Founder / accountable owner]
**Parent:** [Phase README] · [Masterplan]
**Created:** [YYYY-MM-DD]
**Last Updated:** [YYYY-MM-DD]

> This is a flexible starting point, not a strict layout. The Founder may explicitly add, improve, rename, reorder, or remove sections before using it. Copy this file into the applicable phase folder and replace all placeholders.

---

## Gate Definition

**[Gate name]:** [What this gate proves and what cannot pass as unknown.]

[Clarify what the gate does and does not require. Distinguish current truth, readiness, quality, and product completeness.]

## Gate Scope

| Scope group | Domains / workstreams | Gate treatment |
|---|---|---|
| Core / required | [Names] | [Evidence required] |
| Supporting / conditional | [Names] | [Retain, disposition, or evidence rule] |
| Embedded / derived | [Names] | [Boundary evidence] |
| Deferred / placeholder | [Names] | [Non-admission or no-work rule] |

## Exit Criteria

All criteria required for this gate must be explicit. Do not make parallel improvement work a gate blocker unless it changes admitted scope, safety, or the truth being evaluated.

- [ ] [Scope condition]
- [ ] [Behavior / delivery condition]
- [ ] [Data, security, or operational condition]
- [ ] [Known gaps have owner, evidence, and disposition]
- [ ] [Founder records a final decision]

---

## Evidence Register

Use one row per domain or workstream. Define allowed states for this gate; do not leave an unexplained `UNKNOWN`.

| Domain / workstream | Role | Starting points | Required evidence | Gaps / owner | Evidence link | State |
|---|---|---|---|---|---|---|
| [Name] | [Role] | [Routes, files, or systems] | [Behavior / output / baseline] | [Gap / owner] | [Link] | `NOT_STARTED` |

Suggested states: `NOT_STARTED`, `IN_PROGRESS`, `COMPLETE`, `PARTIAL`, `NOT_RETAINED`, `BLOCKED`, `UNKNOWN`. Define which states can pass before using the table.

### Evidence entry template

Copy and adapt this structure for each domain or workstream:

```markdown
### [Name] — [gate evidence]
- State: NOT_STARTED | IN_PROGRESS | COMPLETE | PARTIAL | NOT_RETAINED | BLOCKED | UNKNOWN
- Scope role:
- Routes, entry points, or delivery surfaces:
- Current behavior, output, or state transitions:
- Read paths, inputs, write paths, and persistence owner:
- Identity, ownership, permissions, and security assumptions:
- Loading, empty, error, unauthorized, interruption, correction, and recovery behavior:
- Known gaps: severity / owner / disposition:
- Evidence reviewed: files, tests, checks, screenshots, or production observations:
- Last verified: YYYY-MM-DD
```

## Reconciliations

- [ ] [Product or feature status reconciled with observed implementation]
- [ ] [Design and implementation references reconciled]
- [ ] [Architecture, data, auth, and operational claims reconciled]
- [ ] [Dead code, placeholders, duplicate paths, and undocumented states dispositioned]

## Baseline Evidence

Record evidence, not only a green/red label. Keep warnings, limitations, and deferred work visible.

| Baseline | Required evidence | Command / method | Date | Result / limitation | State |
|---|---|---|---|---|---|
| Quality | [Checks] | [Command] | [YYYY-MM-DD] | [Result] | `NOT_STARTED` |
| Accessibility | [Checks] | [Method] | [YYYY-MM-DD] | [Result] | `NOT_STARTED` |
| Security | [Checks] | [Method] | [YYYY-MM-DD] | [Result] | `NOT_STARTED` |
| Production / operations | [Checks] | [Method] | [YYYY-MM-DD] | [Result] | `NOT_STARTED` |

## Review Protocol — [YYYY-MM-DD]

- [ ] [Release / quality review confirms evidence is readable and reproducible]
- [ ] [Founder reviews required rows and unresolved gaps]
- [ ] [Scope or architecture changes have a decision record]
- [ ] [Final decision is recorded below]

---

## Parallel Improvements (Optional)

Track accepted improvements here only when they are separate from the gate. Promote an item to an exit criterion only when it changes the gate’s admitted scope, safety, or implementation truth.

| # | Improvement / decision | Owner | Next phase or date | Gate impact | State |
|---|---|---|---|---|---|
| 1 | [Improvement] | [Owner] | [Date / phase] | `NON_BLOCKING` | `SCHEDULED` |

## Evidence Index

| Evidence area | Link / record | State |
|---|---|---|
| Domain / workstream evidence | [Register or records] | `NOT_STARTED` |
| Reconciliations | [Records] | `NOT_STARTED` |
| Baselines | [Commands and results] | `NOT_STARTED` |

---

## Decision

**Decision:** `NOT_RECORDED` / `PASS` / `HOLD` / `REWORK`
**Date:**
**Founder:**
**Rationale and unresolved conditions:**
**Next-phase authorization or hold conditions:**

## Founder Customization

- **Add:**
- **Improve:**
- **Remove:**
- **Reason / authority:**
- **Founder approval checkpoint:**

---

## Related

- [Template index](./README.md)
- [Gate checklist source example](../phase-1/gate-checklist.md)
- [Current sprint](../current-sprint.md)
- [MVP Implementation Masterplan](../mvp-implementation-masterplan.md)