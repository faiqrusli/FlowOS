# Decision Log

**Status:** Living document — append new entries at top  
**Audience:** Founders, engineers, future contributors  
**Last updated:** July 3, 2026

---

## Purpose

Permanent record of **product-level** decisions with context, rationale, and rejected alternatives. Design-phase decisions remain in [../design/AUDIT_HISTORY.md](../design/AUDIT_HISTORY.md). This log covers company direction, launch strategy, and cross-cutting product choices.

---

## How to use

When making a significant product decision:

1. Add an entry using the template below  
2. Link to related design docs if applicable  
3. Do not delete entries — mark superseded decisions as such  

### Entry template

```
### YYYY-MM-DD — Decision title

**Context:** Why this decision was needed  
**Decision:** What was chosen  
**Alternatives rejected:** What was not chosen and why  
**Outcome:** (fill in later if unknown)  
**Related:** Links
```

---

## 2026 decisions

### 2026-07-04 — FlowOS-old archived to git branch

**Context:** `FlowOS-old/` at workspace root was an undocumented duplicate repo (pre–Workplace snapshot at `9859cf6`).  
**Decision:** Preserve as `archive/flowos-old` branch on `origin`; delete local `FlowOS-old/` folder.  
**Alternatives rejected:** Zip in repo (large binary, redundant — commit already on GitHub).  
**Outcome:** Branch pushed; local folder removed in M0 Session 2.  
**Related:** WP-0.3, M0 exit criterion #4

---

### 2026-07-04 — Documentation lives inside the git repository

**Context:** The entire `docs/` tree (foundation, design, project) existed only on the founder laptop outside `flowos/` git — a disk failure would erase institutional knowledge (M0 custody gap).  
**Decision:** Copy `docs/` into the repository at `flowos/docs/`; keep git root at `flowos/` (Next.js app root) for Vercel/GitHub compatibility.  
**Alternatives rejected:** Relocate git root to workspace parent `FlowOS/` — would require reconfiguring Vercel root directory and GitHub default paths for minimal benefit.  
**Outcome:** Applied in M0 Session 1 (Ship Gate).  
**Related:** [M1_SHIP_GATE_RUNBOOK.md](./M1_SHIP_GATE_RUNBOOK.md) Session 1, WP-0.1

---

### 2026-07-03 — Create foundation documentation layer

**Context:** Design history (`docs/design/`) and thesis docs (`docs/project/`) exist but no documents answer "what should the company do next?"  
**Decision:** Create `docs/foundation/` with 10 permanent product documents (vision, philosophy, inventory, IA, technical, deployment, personas, metrics, decisions, launch).  
**Alternatives rejected:** Single mega-doc (hard to maintain); duplicating design history in foundation (link instead).  
**Outcome:** Foundation layer established.  
**Related:** [README.md](./README.md)

---

### 2026-07-03 — Primary 90-day goal: product validation

**Context:** FlowOS can be pursued as thesis, portfolio, or commercial product.  
**Decision:** Validate as a **real product with early users** — retention and daily loop over thesis completeness or commercial launch.  
**Alternatives rejected:** Thesis-first (UAT only); portfolio-first (polish without users); commercial-first (premature).  
**Outcome:** Roadmap prioritizes Phase 3 and private alpha over Phase 4 polish or new modules.  
**Related:** [LAUNCH_PLAN.md](./LAUNCH_PLAN.md), [SUCCESS_METRICS.md](./SUCCESS_METRICS.md)

---

### 2026-07-03 — Do not deploy to production; private alpha after Phase 3.1

**Context:** Feature-complete MVP with broken daily loop and trust-breaking UI (fake Agenda).  
**Decision:** Production deployment blocked. Private alpha allowed only after Phase 3.1 MVP + auth fix + fake UI removal.  
**Alternatives rejected:** Deploy now for portfolio; public beta without Phase 3.  
**Outcome:** See [DEPLOYMENT_READINESS.md](./DEPLOYMENT_READINESS.md).  
**Related:** [DEPLOYMENT_READINESS.md](./DEPLOYMENT_READINESS.md)

---

### 2026-07-03 — Phase 3 remains correct next investment

**Context:** UX friction review superseded visual Phase 3 (typography). Question: is Phase 3 still right for product validation?  
**Decision:** **Yes.** Phase 3 (Effortless Daily Loop) is the minimum viable product loop — not UX polish. Ship 3.1 before recruiting external users.  
**Alternatives rejected:** Phase 4 visual polish first; Goals/AI build; onboarding before IA fix.  
**Outcome:** Pending implementation.  
**Related:** [../design/ROADMAP.md](../design/ROADMAP.md), [../design/ux-friction-review.md](../design/ux-friction-review.md)

---

### 2026-07-03 — Today/Workplace becomes home; Dashboard demoted to Overview

**Context:** Dashboard at `/` is read-only intelligence; execution at `/workplace`. Friction #1 in UX review.  
**Decision:** Merge Dashboard intelligence into Today/Workplace as default landing. Dashboard becomes optional `/overview` — not deleted.  
**Alternatives rejected:** Remove Dashboard entirely; keep `/` as Dashboard; add 9th "Today mode" nav item without merging.  
**Outcome:** Phase 3.1 scope.  
**Related:** [INFORMATION_ARCHITECTURE.md](./INFORMATION_ARCHITECTURE.md), [../design/AUDIT_HISTORY.md](../design/AUDIT_HISTORY.md)

---

### 2026-07-03 — Focus reframed as mode, not page

**Context:** Next-action routes active focus to `/focus` while timer runs on Workplace.  
**Decision:** Focus execution becomes a **mode on Today**; `/focus` page reserved for history and analytics only.  
**Alternatives rejected:** Move timer entirely to `/focus` page; duplicate timer on both surfaces permanently.  
**Outcome:** Phase 3.3 scope.  
**Related:** [FEATURE_INVENTORY.md](./FEATURE_INVENTORY.md)

---

### 2026-07-03 — Stop building new modules until daily loop validated

**Context:** Goals, AI Coach, gamification, calendar sync in SRS but not built. Temptation to differentiate via features.  
**Decision:** Explicit stop list: Goals (FE-1), AI (FE-4), gamification (FE-10), calendar (FE-11), mobile (FE-9), music (FE-6), voice (FE-12). Revisit only after D7 retention > 30%.  
**Alternatives rejected:** Build Goals for differentiation; ship AI Coach for portfolio.  
**Outcome:** Active constraint.  
**Related:** [../project/03-future-enhancements.md](../project/03-future-enhancements.md)

---

### 2026-07-03 — Remove fake Agenda card before alpha

**Context:** `workplace-agenda-card.tsx` has hardcoded items and non-functional buttons. Friction #16; trust destroyer.  
**Decision:** Remove immediately or wire to real "Plan tomorrow" — not deferred to end of Phase 3.1.  
**Alternatives rejected:** Leave as visual placeholder; wait for FE-3 Manifesto build.  
**Outcome:** Pending implementation.  
**Related:** [DEPLOYMENT_READINESS.md](./DEPLOYMENT_READINESS.md)

---

### 2026-07-03 — Alpha users: knowledge workers, not developers

**Context:** Need first users for product validation.  
**Decision:** Recruit 5–15 self-directed knowledge workers and graduate students who use 2–3 productivity apps daily. Avoid developer-evaluators and casual list-makers as primary cohort.  
**Alternatives rejected:** Developer friends (tolerate broken UX); broad public launch; students only.  
**Outcome:** See [USER_PERSONAS.md](./USER_PERSONAS.md).  
**Related:** [USER_PERSONAS.md](./USER_PERSONAS.md)

---

### 2026-07-03 — North star: Weekly Active Days (WAD)

**Context:** Many possible metrics for a productivity app.  
**Decision:** North star = days per week user completes meaningful action in FlowOS. Retention over feature breadth.  
**Alternatives rejected:** NPS as north star; total users; time on site; module usage parity.  
**Outcome:** See [SUCCESS_METRICS.md](./SUCCESS_METRICS.md).  
**Related:** [SUCCESS_METRICS.md](./SUCCESS_METRICS.md)

---

## Design decisions (reference only)

The following decisions are documented in detail in [../design/AUDIT_HISTORY.md](../design/AUDIT_HISTORY.md). Summarized here for product context:

| Date | Decision | Outcome |
|------|----------|---------|
| 2026-07-03 | Bug-fix-first phasing (Phase 0 tiny) | Shipped `5fc780a` |
| 2026-07-03 | SegmentedControl primitive postponed (Option A inline) | `panel-toggle-styles.ts` recipes |
| 2026-07-03 | Select primitive postponed | Three DropdownMenu selects work |
| 2026-07-03 | Badge/chip merged into Phase 2 | Shipped `9f7e7c4` |
| 2026-07-03 | Midnight Focus palette chosen | Indigo-dominant accent system |
| 2026-07-03 | UX Phase 3 supersedes visual Phase 3 | Effortless Daily Loop roadmap |
| 2026-07-03 | Contract model: review → spec → implement → post-review | Phases 0–2 exact match |

Do not duplicate full rationale here — link to AUDIT_HISTORY for design-phase detail.

---

## Related documents

- [../design/AUDIT_HISTORY.md](../design/AUDIT_HISTORY.md) — design decision rationale  
- [../design/CHANGELOG.md](../design/CHANGELOG.md) — chronological design evolution  
- [PRODUCT_PHILOSOPHY.md](./PRODUCT_PHILOSOPHY.md) — principles derived from these decisions  
- [LAUNCH_PLAN.md](./LAUNCH_PLAN.md) — decisions applied to launch timeline  
