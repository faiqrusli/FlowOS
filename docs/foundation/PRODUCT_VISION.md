# Product Vision

**Status:** Active  
**Audience:** Founders, contributors, early users  
**Last updated:** July 3, 2026

---

## Purpose

Define what FlowOS is building toward, who it serves, and what it explicitly will not become. This document is the north star for all major product decisions.

---

## Mission

Help self-directed individuals **plan, execute, focus, and reflect** in one continuous daily workflow — replacing the fragmented experience of switching between task managers, habit trackers, focus timers, and journals.

---

## Positioning statement

**For** self-directed knowledge workers and serious students **who** juggle tasks, habits, focus sessions, and personal reflection across multiple apps, **FlowOS is** a personal daily productivity operating system **that** unifies planning, execution, and reflection in one dark workspace **unlike** single-purpose tools **because** it supports the complete self-regulated learning cycle in a single product.

---

## Elevator pitch

> FlowOS is a personal daily productivity operating system — one workspace where you plan your day (tasks, habits, schedule), execute with focus sessions, and close with reflection. Plan, perform, reflect — in one place instead of four apps.

---

## Theoretical foundation

FlowOS is grounded in **Self-Regulated Learning (SRL)** theory (Zimmerman, 2002) and complementary frameworks documented in [../project/02-related-works.md](../project/02-related-works.md):

| Phase | Meaning | Product expression |
|-------|---------|-------------------|
| Forethought | Plan and prepare | Tasks, Habits, Schedule |
| Performance | Execute and monitor | Workplace, Focus sessions |
| Self-reflection | Evaluate and improve | Reflection, Notes |

See [PRODUCT_PHILOSOPHY.md](./PRODUCT_PHILOSOPHY.md) for how these phases map to product decisions.

---

## Target user

### Primary (2026 validation)

**Self-directed knowledge workers** — developers, researchers, writers, consultants — who already use 2–3 productivity apps daily and want one integrated loop.

### Secondary

**Graduate students and ambitious undergraduates** managing coursework, research, habits, and personal growth.

### Not for (yet)

- Teams and collaboration workflows
- Casual list-makers who need a simple todo app
- Users who require mobile-first or calendar-sync-first experiences

Details: [USER_PERSONAS.md](./USER_PERSONAS.md)

---

## Product category

**Integrated personal productivity OS** — adjacent to Sunsama, Morgen, and Akiflow, but without calendar sync or AI planning. Closer to "structured daily loop" than "task manager."

---

## Strongest differentiator

**The complete SRL cycle in one product.** Most competitors excel at one phase (tasks OR habits OR focus OR journaling). FlowOS integrates all three — when the daily loop works.

> **Current state:** The *promise* is differentiated. The *experience* still feels like eight modules until Phase 3 ships. See [../design/ux-friction-review.md](../design/ux-friction-review.md).

---

## Success vision (what "winning" looks like)

A user opens FlowOS and **within five seconds** knows what to do next. They complete their day — tasks, habits, focus, reflection — without asking "which module do I go to?" The app feels like **one continuous day**, not eight disconnected tools.

---

## Three-year ambition

| Horizon | Goal |
|---------|------|
| **Year 1** | Validate daily loop with alpha/beta users; D7 retention > 30% |
| **Year 2** | Public launch; clear positioning; optional Goals layer (FE-1) |
| **Year 3** | Sustainable product with proven retention; evaluate AI assist (FE-4) only if loop is solid |

---

## Explicit non-goals

FlowOS is **not**:

| Non-goal | Reason |
|----------|--------|
| Team / project management (Asana, Linear) | Solo productivity focus; scope control |
| Full calendar replacement | FE-11 deferred; no Google/Outlook sync planned |
| Note-first knowledge base (Notion, Obsidian) | Notes is supplementary, not primary |
| AI productivity coach (FE-4) | Deferred until retention proven |
| Mobile app (FE-9) | Web-only; resource constraints |
| Gamified habit app (Habitica) | SRL seriousness over XP badges |
| Production SaaS today | Launch readiness ~4/10; see [DEPLOYMENT_READINESS.md](./DEPLOYMENT_READINESS.md) |

---

## Current product assessment (July 2026)

| Dimension | Score | Summary |
|-----------|-------|---------|
| Vision (documentation) | 7/10 | Strong thesis; clear in docs |
| Vision (in-product) | 4/10 | Eight modules; no gravitational center |
| Overall product | 6/10 | Impressive solo build; not retention-ready |

**Strategic priority:** Phase 3 — Effortless Daily Loop. Not new modules. See [../design/ROADMAP.md](../design/ROADMAP.md).

---

## Related documents

- [PRODUCT_PHILOSOPHY.md](./PRODUCT_PHILOSOPHY.md) — principles and decision rules  
- [../project/01-introduction.md](../project/01-introduction.md) — original thesis vision  
- [../project/02-related-works.md](../project/02-related-works.md) — theoretical foundations  
- [LAUNCH_PLAN.md](./LAUNCH_PLAN.md) — go-to-market timeline  
- [SUCCESS_METRICS.md](./SUCCESS_METRICS.md) — how we measure progress toward this vision  
