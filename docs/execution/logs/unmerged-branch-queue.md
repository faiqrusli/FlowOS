# Unmerged branch queue (founder-led)

**Purpose:** Prioritized list of unfinished branches still worth bringing onto current `main`. Lead one item at a time; do not parallel-merge.  
**Baseline:** `origin/main` @ `4239768` (2026-07-10).  
**Authority:** [decision-log.md](./decision-log.md) · [GIT_WORKFLOW.md](../../foundation/governance/GIT_WORKFLOW.md)  
**Updated:** 2026-07-10

**How to use:** Founder picks the next **P#**. Agent works only that item until merge ask (or explicit skip). Mark status when done.

---

## Priority queue

| P# | Item | Branch tip(s) | Relevance | How to land on `main` | Status |
|----|------|---------------|-----------|----------------------|--------|
| **1** | Global nav B1 (Home + Workspace + Schedule naming + Reflection icon parity) | `m2/session-1-global-nav` (`eb4114e`, `dc922d7`) | **Ship now** — decision 2026-07-09; runbook complete | Merged to `main` 2026-07-10 | **Done** |
| **2** | Today V3 Phase C — Session 6 (habits in NEXT) | Reference: `m2/session-6-today-v3-unified-queue` (`d2f71d5`) | **Product-relevant** — S1–5 already on `main`; Phase C is the Day Engine gap | **Do not merge old tip.** Re-cut `m2/session-6-today-v3-…` from current `main`; use old branch as reference. **Blocked** on decision-log Phase C appendix approval (#1, #3, #5) | **NEXT** |
| **3** | Today V3 Phase C — Sessions 7–8 (focus morph + ambient rail) | Reference commits: `0d67e2b` (on S9–12 branches). Local `m2/session-7-8-…` tip is **stale** (still `d2f71d5`) | Same runbook; depends on S6 + Phase C approvals | Re-cut from `main` after P2 merges; do not fast-forward old branches | Queued |
| **4** | Today V3 Phase C — Session 9 (close-day) | Reference: `m2/session-9-today-v3-close-day` (`1e37dc6`) | Same | Re-cut after P2–P3 | Queued |
| **5** | Today V3 Phase D — Sessions 10–12 (typography, migration, metrics) | Reference: `…-10` / `…-11` / `…-12` (`f47fd28` → `3f080b7`) | Same; ends Day Engine runbook | Re-cut after Phase C on `main` | Queued |
| **6** | Fable5 Today greenfield experiment | `experiment/fable5-today-greenfield` (`52335ec`) | Optional R&D; flag-gated; not production path | Merge only if founder wants experiment on `main` behind flag; else keep remote-only | Optional |
| **7** | Local Supabase / cloud agent setup docs | `origin/cursor/setup-dev-environment-e00e` (`26068f0`) | Low — env docs only | Cherry-pick or PR docs commits if still useful; skip product code | Optional |

---

## Explicitly out of queue (do not update to `main`)

| Branch / tip | Why |
|--------------|-----|
| VDS / visual-design Sessions **6–14** (any leftover) | Decision 2026-07-10: Layer 0–5 freeze; discarded. Future page polish = new `tweak/…` or new runbook sessions under Layer 0–5 — not revive 6–14. |
| `v0/design-flowos-today-page-7cdf3d1e` | Prototype / design dump — not production. |
| `v0/faiqrusli-ba62a0a6` | Init stub — ignore. |
| Tips already ancestors of `main` | Surface hierarchy, Today V3 S1–5, schedule-break, kanban/tasks polish, tweak sessions 1–4 — **done**. Local “ahead of remote” on tweak/session-2/3 is noise (tips already in `main`). |

---

## P1 — Global nav (Done)

**Shipped 2026-07-10** on `main`. See [july-log.md](./july-log.md).

---

## P2–P5 — Today V3 Day Engine (start here next)

**Runbook:** [m2-today-v3-day-engine.md](../runbooks/m2-today-v3-day-engine.md)  
**On `main` today:** Sessions **1–5** only (Phase A/B).  
**Not on `main`:** Sessions **6–12** (Phase C/D). Old branches predate visual polish + kanban work — treat as **patch reference**, not merge sources.

**Hard gate before P2:** Approve Phase C decision-log appendix entries (habits interleave, morph/rail, density retirement — see runbook appendix). Recorded blocker: decision-log 2026-07-06 “Session 6 blocked pending Phase C approval.”

**Per session:** `git checkout main && git pull` → new branch → port intent from reference tip → build/lint → merge ask.

---

## P6–P7 — Optional

Only if founder explicitly wants them after P1–P5 (or instead of pausing Day Engine).

---

## Progress log

| Date | P# | Action |
|------|----|--------|
| 2026-07-10 | — | Queue created from unmerged-branch audit |
| 2026-07-10 | 1 | Merged to `main` — global nav B1 + NotebookPen parity + queue doc |

---

*When an item ships, move a one-liner to [july-log.md](./july-log.md) and set Status = Done above.*
