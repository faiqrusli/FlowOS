# Developer log

**Purpose:** Personal daily journal — timeline of meaningful work, WIP, and lessons.  
**Not authority:** Product decisions stay in [decision-records.md](../../../08-decisions/decision-records.md). The monthly narrative stays in [august-log.md](../august-log.md) and distinguishes committed, merged, and shipped state.

## Rules

1. **One file per coding day** — YYYY-MM-DD.md (skip days you don’t code).
2. **5–10 minutes** at end of session — skip empty sections.
3. **Timeline = meaningful beats**, not every commit. Optional: paste git log --oneline --since=midnight under Timeline.
4. **Decisions:** one line + link to decision-records when something is product-level. Don’t duplicate full entries.
5. **Don’t** update FEATURE_INVENTORY or catalog from here — do that when behavior ships.
6. **Every commit:** update both today’s developer log and the active monthly narrative log in the same commit. The monthly entry must distinguish committed, merged, and shipped state.

## Template

`markdown
# YYYY-MM-DD

## Overview
- Done:
- Still open:
- Blockers:

## Timeline
HH:MM — …

## Decisions
- … → [decision-records](../../../08-decisions/decision-records.md) (only if new)

## Next
- First thing tomorrow:
`

## Index

| Day | Focus |
|-----|--------|
| [2026-08-03](./2026-08-03.md) | Phase 0 Documentation cleanup, archiving, and AI developer log rules setup |
| [2026-08-04](./2026-08-04.md) | Phase 0 close-out (Gate 0 PASS), Phase 1 authorization, post-Phase-0 audit, docs-hygiene fixes |
