# Decision Register

**Status:** Active
**Authority:** Canonical discovery index for consequential FlowOS decision records
**Owner:** Product and documentation leadership
**Parent:** [Documentation Architecture](../00-constitution/documentation-architecture.md) · [Decision Records](./decision-records.md)
**Children:** Individual decision records in `08-decisions/records/`
**Last reviewed:** 2026-08-03
**Review trigger:** A decision record is created, corrected, superseded, closed, or moved to archival history.

---

## Scope

This register makes decision records discoverable by identifier, status, owner, date, domain, and link. It does not repeat any record's context, alternatives, evidence, rationale, or consequences.

The register lists only decisions governed by [Decision Records](./decision-records.md). The historical [legacy decision log](../11-archive/execution/logs/decision-log.md) remains separate and append-only; its entries are not silently converted into individual records.

## Current Records

| ID | Title | Status | Owner | Date | Domain | Record |
|---|---|---|---|---|---|---|
| D-001 | Adopt the canonical FlowOS documentation ecosystem | Accepted | Product and documentation leadership | 2026-08-01 | Documentation governance | [D-001](./records/D-001-adopt-canonical-documentation-ecosystem.md) |
| D-002 | Founder holds Gate 0 for documentation cleanup | Accepted — Gate 0 held | Founder | 2026-08-03 | Phase 0 governance | [D-002](./records/D-002-founder-holds-gate-0-for-documentation-cleanup.md) |
| D-003 | Pass Gate 0 and authorize Phase 1 | Accepted — Gate 0 PASSED, Phase 1 authorized | Founder | 2026-08-04 | Phase governance | [D-003](./records/D-003-pass-gate-0-and-authorize-phase-1.md) |

## Register Rules

- Add a row when a new record is accepted, deferred, rejected, superseded, corrected, or closed.
- Preserve a record's original identifier and title; add status changes and successor links rather than replacing history.
- Link to the individual record. Do not summarize it here.
- Do not use the register as a backlog, meeting log, roadmap, or feature specification.

## Change Control

The register changes only to maintain accurate discovery of decision-record lifecycle and location. A change to the meaning or authority of a decision record belongs in [Decision Records](./decision-records.md), not in this index.
