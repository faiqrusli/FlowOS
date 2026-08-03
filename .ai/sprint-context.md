# FlowOS Current Sprint Context (Quick Reference)

**Sprint Period:** Beginning week of 2026-08-04  
**Phase:** Phase 1 — Establish Implementation Truth  
**Gate Target:** Gate 1 — for every admitted MVP domain, demonstrate current behavior, data path, known gaps, and owner  
**Last Updated:** 2026-08-04

---

## Quick Overview

**What we're doing:** Determining what the current build actually does before changing it.

**Why:** The MVP Masterplan is the source of truth. Phase 1 establishes the baseline truth of the shipped code so later contract and implementation work is evidence-based.

**Who:** Executed via the solo-founder 6-hat workflow.

---

## Phase 1 Objectives (from MVP Masterplan)

1. Verify routes, entry points, data ownership, persistence, permissions, and current error/recovery behavior
2. Reconcile the Feature Catalog with code and FEATURE_INVENTORY
3. Reconcile V3/Tokyo Night Warm references, CSS tokens, component usage, and legacy design material
4. Identify dead code, placeholder routes, duplicate scheduling surfaces, dual save paths, and undocumented states
5. Run baseline quality, accessibility, security, and production checks
6. Create only the feature briefs and behavior contracts needed to describe admitted MVP behavior

---

## Gate 1 Exit Criteria

**For Gate 1 to pass:**
- [ ] Every admitted MVP domain has documented current behavior
- [ ] Every admitted MVP domain has a mapped data path
- [ ] Known gaps and owners are identified
- [ ] No unknown status passes into implementation

**Phase 0 history:** Phase 0 CLOSED — Gate 0 PASSED 2026-08-04. Archived to `docs/11-archive/phases/phase-0/`. See [D-003](../docs/08-decisions/records/D-003-pass-gate-0-and-authorize-phase-1.md).

---

## Current Sprint Assignments (Phase 1)

*To be created — the Phase 1 sprint is the next step.*

Likely tracks (from the MVP Masterplan and prior Phase 0 preview):
- Document current behavior of Today and Tasks domains
- Reconcile design system (V3 / Tokyo Night Warm) with implementation
- Baseline quality, accessibility, security, and production checks
- Identify dead code, placeholder routes, dual save paths, undocumented states

---

## MVP Feature Admission

**Admitted to MVP:**
- ✅ **Today** — Primary entry and reorientation
- ✅ **Tasks** — Commitment and action
- ✅ **Focus** — Action mode
- ✅ **Reflection** — Sensemaking/adaptation

**Conditional (supporting):**
- ⚠️ **Habits** — Only behaviors that strengthen core loop
- ⚠️ **Schedule** — Reconcile overlapping surfaces, planning ≠ evidence
- ⚠️ **Notes** — User context, not universal knowledge base

**Deferred:**
- ❌ **Goals** — Re-admit only through direction-system decision + evidence
- ❌ **Progress** — Derived, not a destination
- ❌ **AI Coach** — Requires explicit intelligence/trust decision

---

## Key Documents for This Sprint

**Read these:**
1. `docs/current-phase/mvp-implementation-masterplan.md` — Phase 1 details
2. `docs/current-phase/current-sprint.md` — Sprint plan
3. `docs/00-constitution/Vision.md` — Why we're doing this
4. `docs/01-product/product-model.md` — What FlowOS is
5. `docs/11-archive/phases/phase-0/implementation-truth-backlog.md` — Starting question list

**Reference:**
- `docs/04-features/FEATURE_INVENTORY.md` — Current shipped features
- `docs/04-features/feature-catalog.md` — Feature domain status
- `docs/05-design/DESIGN_SYSTEM_V3.md` — Design system
- `docs/05-design/DESIGN_SYSTEM_TOKYO_NIGHT_WARM.md` — Active palette

---

## What's In Scope This Sprint (Phase 1)

✅ Verifying routes, entry points, data ownership, persistence, permissions, error/recovery behavior  
✅ Reconciling Feature Catalog and design references with code  
✅ Identifying dead code, placeholder routes, duplicate scheduling surfaces, dual save paths  
✅ Running baseline quality, accessibility, security, and production checks  
✅ Creating feature briefs/behavior contracts needed to describe admitted MVP behavior

---

## What's Out of Scope This Sprint

❌ Writing the coherent MVP loop contracts (Phase 2)  
❌ Implementing or hardening the core loop (Phase 3)  
❌ Trust/quality/release readiness (Phase 4)  
❌ Any feature implementation or refactor beyond documenting truth

---

## Next Phase Preview

**Phase 2:** Contract the Coherent MVP Loop
- Write Today, Tasks, Focus, Reflection feature briefs and behavior contracts
- Write the bounded journey contract
- Create feature design specifications

**Not starting Phase 2 until Gate 1 passes.**

---

## Quick Reference

**When someone asks "What should I work on?"**
→ Check the Phase 1 sprint assignments (being created)

**When someone asks "Should I write contracts?"**
→ Not yet. Phase 1 is about establishing truth. Phase 2 is contracts.

**When someone asks "What's the goal?"**
→ Gate 1: Current build does not pass into implementation if its behavior is unknown.

**When someone asks "When do we assess implementation?"**
→ Phase 1 — establishing the baseline now.

---

**This is Phase 1. We're determining what the code actually does before we branch contracts.