# Feature Documentation Standards (Solo Founder Adaptation)

**Status:** Active  
**Last Updated:** 2026-08-03  
**Context:** Adapted for solo founder development  

---

## Key Documents in This Folder

| Document | Purpose |
|----------|---------|
| **[FEATURE_INVENTORY.md](./FEATURE_INVENTORY.md)** | **Canonical inventory** — What's shipped vs deferred in production |
| **[feature-catalog.md](./feature-catalog.md)** | **Feature domain coverage** — Documentation status per feature |
| **Standards:** | Feature documentation standards below |

**FEATURE_INVENTORY and feature-catalog work together:**
- **FEATURE_INVENTORY** = Production state (what users can do)
- **feature-catalog** = Documentation coverage (what's documented)

---

## Core Principle

**Deep understanding of major features is essential for FlowOS.**

Today, Tasks, Focus, Schedule, Notes — these ARE FlowOS. Without detailed specifications, you lose the ability to improve them coherently over time.

The 6-hat structure adds quality checkpoints, not coordination overhead. The solution is to keep the depth while making Founder self-approval brief and evidence-based.

---

## What Changed (Aug 2026)

### Historical multi-person structure
```
Product Architect writes feature brief
  ↓ (wait for approval)
Founder approves
  ↓
Design Architect writes design spec
  ↓ (wait for approval)  
Founder approves
  ↓
Engineering Architect writes delivery design
  ↓ (wait for approval)
Founder approves
  ↓
Build...
```

**Problem:** Separate people introduced handoff and waiting overhead before coding.

### After (Solo Founder)
```
You write what you need:
  - Feature brief (if it helps you think)
  - Behavior contract (if behavior is complex)
  - Design notes (if UI is complex)
  - Delivery design (if architecture is complex)
  
Then you build.
```

**Solution:** Same depth, six authoritative hats grouped into Plan, Build, and Ship, with short Founder checkpoints at mode transitions.

---

## When to Use Each Standard

### Feature Brief

**When:** Starting a major feature (Today, Tasks, Focus-level)

**Purpose:** Think through the problem, scope, and approach before building

**Time:** 1-2 hours

**You're writing for yourself:**
- What problem am I solving?
- What's in/out of scope?
- Why this approach?

**Standard:** `feature-briefs.md` (keep it)

### Behavior Contract

**When:** Complex user-facing behavior that will evolve over time

**Purpose:** Document "how it should work" so future-you can improve it coherently

**Time:** 2-4 hours

**You're writing for future-you:**
- What states exist?
- What actions are available?
- How does error recovery work?
- What are the edge cases?

**Standard:** `behavior-contracts.md` (keep it)

**Examples needing behavior contracts:**
- Today page (many surfaces, complex state)
- Tasks (board vs list, planning, scheduling)
- Focus mode (timer states, break scheduling, reflection)

### Design Specification

**When:** Complex UI with multiple states, interactions, accessibility needs

**Purpose:** Document design decisions so you don't redesign from scratch each time

**Time:** 2-4 hours (for major features)

**You're writing for future-you:**
- What are all the UI states?
- How do interactions work?
- What's the accessibility approach?
- Where does content come from?

**Standard:** `feature-design-specifications.md` (keep it)

### Delivery Design

**When:** Complex technical implementation (data model, migrations, integrations)

**Purpose:** Think through architecture before building, document for future changes

**Time:** 1-3 hours

**You're writing for future-you:**
- What's the data model?
- How does this integrate with existing systems?
- What are the technical risks?
- How do we migrate/rollback?

**Standard:** `delivery-designs.md` (keep it)

### Validation Plan

**When:** Risky changes, user-facing features, data migrations

**Purpose:** Know how you'll verify it works before you build it

**Time:** 30 min - 1 hour

**You're writing for future-you:**
- What are the test cases?
- How do I verify each behavior?
- What are the acceptance criteria?

**Standard:** `validation-plans.md` (keep it)

---

## Simplified Feature Dossier (Solo Founder)

**A feature dossier is the complete lifetime of a major FlowOS feature, not just one build.**

**For major features (Today, Tasks, Focus, etc.):**

```
04-features/[feature-name]/
  ├── feature-brief.md           ← Foundational (written once, updated rarely)
  ├── behavior-contract.md       ← Foundational (evolves as behavior changes)
  ├── design/                    ← Design artifacts
  ├── implementation/            ← ALL iterations, runbooks, migrations
  │   ├── v1.0-initial.md
  │   ├── v1.1-feature-x.md
  │   ├── v1.2-bug-fixes.md
  │   └── v2.0-redesign.md       ← Accumulates over time
  ├── validation/                ← Test results per iteration
  ├── reviews/                   ← Pre-ship reviews
  ├── releases/                  ← What shipped when
  ├── post-release/              ← Learning, incidents, usage evidence
  └── decisions/                 ← Feature-specific decisions
```

**The dossier grows over time:**
- Brief and contract: Written upfront (6-8 hours), updated when fundamentals change
- Implementation: Every iteration adds a new runbook
- Post-release: Every release adds learning
- Complete history preserved

**Total upfront:** 6-14 hours of foundational thinking

**Why it's worth it:**
- Major features ARE FlowOS
- Will have 10+ iterations over their lifetime
- Each iteration builds on previous work
- Future-you needs complete context
- Prevents rebuilding from scratch

**You write them all yourself, progressing through the six hats and recording consequential Founder decisions without a separate handoff queue.**

**See:** `feature-dossier-standard.md` for complete lifecycle guide.

---

## For Small/Medium Features

**You don't need all 5 documents for everything.**

### Small Features (< 4 hours)
- Decision log entry only
- Example: Button polish, keyboard shortcut

### Medium Features (4-16 hours)
- Brief (1 page) if helpful
- Code + tests
- Example: Inline task capture

### Large Features (> 16 hours)
- Full dossier if it's a major surface
- Example: Notes module, Focus redesign

**The 3-tier approach still applies to most features. The full dossier is for the core FlowOS surfaces.**

---

## Comparison

| Aspect | 6-Role Approach | Solo Founder Approach |
|--------|-----------------|----------------------|
| **Depth** | Detailed specs | Detailed specs (same) |
| **Roles** | 3 separate people | You |
| **Approval flow** | Multi-person gates | 3 short Founder checkpoints |
| **Handoffs** | 3 handoffs | Same-session hat progression |
| **Time overhead** | 3-4 hours (waiting, context switching) | 0 hours |
| **Total time** | 9-18 hours | 6-14 hours |
| **Quality** | Same depth | Same depth |

**Result:** Same documentation quality, 25-40% less time (no coordination overhead).

---

## How to Use the Standards

**Starting a major feature:**

1. **Read the relevant standards** (feature-briefs.md, behavior-contracts.md, etc.)
2. **Create a dossier folder** (`04-features/feature-name/`)
3. **Write the docs you need** (all in one session, or spread over a few days)
4. **Then build**

**You're not waiting in a coordination queue. You're thinking through the problem and completing the applicable Founder checkpoint.**

**The Founder reviews scope and design at the Plan checkpoint before Build.**

**No unnecessary handoff queue. Just deep thinking, quick approval, then building.**

---

## Updated Workflow

**Complete workflow guide:** `docs/start-here/solo-founder-workflow.md` (6-hat quality procedures)

### Before (6-Role)
```
Product Architect writes → Submit → Wait for approval → 
Design Architect writes → Submit → Wait for approval → 
Engineering Architect writes → Submit → Wait for approval → 
Build
```

**Time:** 9-18 hours (including approval waits)

### After (Solo Founder with 6 Hats)
```
Hat 1 (Product Architect):
  - Write feature brief + behavior contract

Hat 2 (Design Architect):
  - Write design specification

Hat 3 (Engineering Architect):
  - Write delivery design + validation plan

Hat 4 (Implementation Engineer):
  - Build code + tests + runbook

Hat 5 (Release Manager):
  - Verify + Deploy + Document
```

**Time:** 6-14 hours plus brief decision checkpoints as needed

**You wear all 6 hats yourself, in sequence, maintaining each hat's quality standards with short Founder self-approval checkpoints.**

**See:** `docs/start-here/solo-founder-workflow.md` for complete 6-hat workflow with practical examples.

---

## Key Insight

**The problem wasn't "too much documentation."**

**The problem was "too much coordination overhead."**

For Today, Tasks, Focus, Schedule, Notes:
- ✅ Deep specifications (essential)
- ❌ 6-role handoffs (overhead)

**Keep the depth. Remove the theater.**

---

## Summary

**What we keep:**
- Feature briefs standard
- Behavior contracts standard
- Design specifications standard
- Delivery designs standard
- Validation plans standard
- Feature dossier structure

**What we remove:**
- 3 approval gates before building
- Role-based handoffs
- Separate "architects" who are all you

**Result:** Same documentation quality, less time, no coordination theater.

**For major features:** Full dossier. Worth it.  
**For small features:** 3-tier approach.

---

**See individual standards:**
- `feature-briefs.md`
- `behavior-contracts.md`
- `feature-design-specifications.md`
- `delivery-designs.md`
- `validation-plans.md`
- `feature-dossier-standard.md`
