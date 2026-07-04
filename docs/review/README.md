# FlowOS Review Layer

**Purpose:** Close every phase and milestone with evidence — not vibes.  
**Cycle:** **S**ummarize → **R**eview → **A**udit → **I**mprove (SRAI)  
**Last updated:** July 4, 2026

---

## How review fits the doc stack

| Layer | Question | Folder |
|-------|----------|--------|
| **Strategy** | What milestone are we in? | [../strategy/](../strategy/) |
| **Execution** | What do we ship this week? | [../execution/](../execution/) |
| **Review** | Did we actually achieve the exit gate? What changes next? | `docs/review/` (here) |
| **Foundation** | What is true about the product? | [../foundation/](../foundation/) |
| **Archive** | Frozen history | [../archive/](../archive/) |

**Authority:** Review conclusions that change direction go to [decision-log.md](../execution/logs/decision-log.md). Review does not override the decision log or masterplan — it feeds them.

```
Runbook (execution) → ship work → july-log → SRAI review → update logs + foundation → next runbook
         ↑
    inbox (scratch ideas promoted into runbook)
```

---

## The SRAI cycle

Run this **after** a design phase or execution milestone reaches its exit gate (or fails it).

| Step | Question | Output |
|------|----------|--------|
| **Summarize** | What shipped? What was the plan vs actual? | Facts, commit refs, metric snapshot |
| **Review** | Did we achieve the business outcome? Was scope right? | Pass / fail / partial; strategic gaps |
| **Audit** | Does the codebase and production match the summary? | Ground-truth checklist; drift findings |
| **Improve** | What do we change before the next phase? | Updates to friction-log, decision-log, FEATURE_INVENTORY, next runbook scope |

**Template:** [template.md](./template.md)

**Rules:**
- No SRAI doc without linking to a runbook or phase spec.
- Audit must cite verifiable evidence (URL, commit, SQL test, log entry) — not documentation alone.
- Improve must produce at least one concrete follow-up (log entry, ticket, or runbook edit).

---

## Review indexes

| Track | Scope | Index |
|-------|-------|-------|
| **Design phases** | Visual/interaction program (Audit → Phase 2, July 2026) | [design/README.md](./design/README.md) |
| **Execution milestones** | M0–M5 business outcomes | [milestones/README.md](./milestones/README.md) |

---

## When to write a review

| Event | Write |
|-------|-------|
| Design phase complete | `review/design/phase-N-srai.md` (optional rollup) + archive post-review in [../archive/design/july-3/](../archive/design/july-3/) |
| Milestone exit gate passed | `review/milestones/mN-*.md` |
| Milestone failed or pivoted | Same file — mark fail; log pivot in decision-log |
| Major external audit (CEO review, validation) | Keep in [../archive/foundation/](../archive/foundation/); link from relevant milestone review |

**Do not** skip Improve. A review without follow-up actions is a report, not a review.

---

## Related

- [execution-masterplan.md](../strategy/execution-masterplan.md) — milestone exit criteria  
- [GATES.md](../foundation/governance/GATES.md) — release gates and metrics  
- [friction-log.md](../execution/logs/friction-log.md) — daily dogfood evidence (M2+)  
- [inbox.md](../execution/logs/inbox.md) — scratch UI/UX fixes before runbook  
- [july-log.md](../execution/logs/july-log.md) — July session memory  
- [document-map.md](../meta/document-map.md) — full doc inventory
