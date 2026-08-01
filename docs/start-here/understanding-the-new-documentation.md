# Understanding the New Documentation System

**For:** FlowOS founders and contributors who need to understand how the new documentation affects their work
**Last updated:** 2026-08-01

---

## What Just Changed?

You now have a **constitutional documentation architecture** that eliminates ambiguity about where to find truth and how to make changes safely.

### The Core Problem We Solved

**Before:** Documentation was spread across historical milestone plans, vision chapters, feature specs, design audits, and runbooks. When you wanted to build something, you had to guess which document was current, and often they contradicted each other.

**Now:** Every piece of knowledge has **one home**, **one responsibility**, and a **clear parent**. No document can reinterpret its parent. Evidence flows up; authority flows down.

---

## The New Document Families (10 Layers)

Think of these as a hierarchy where each layer can only answer its specific question:

### **Layer 0: Constitution** 📜
**Question:** "Why must FlowOS exist and what must never change?"

**Documents:**
- `Vision.md` — The immutable philosophical foundation
- `documentation-architecture.md` — How knowledge is organized

**Your action:** Read Vision.md once. It's your north star. Never change it.

---

### **Layer 1: Product** 🎯
**Question:** "What is the product, for whom, and what outcome must it create?"

**Documents:**
- `product-model.md` — The conceptual model (what FlowOS *is*)
- `product-glossary.md` — Canonical terminology
- `product-strategy.md` — Current market choices
- `success-model.md` — How success is measured

**Your action:** Read these to understand the product model before building anything.

---

### **Layer 2: Systems** ⚙️
**Question:** "What enduring product mechanisms make that possible?"

**Documents:**
- `direction-and-commitment.md`
- `action-and-evidence.md`
- `sensemaking-and-adaptation.md`
- `continuity-and-interoperability.md`
- `intelligence-and-trust.md` (coming next)

**Your action:** When building a feature, check which systems it touches. These define the rules your feature must follow.

---

### **Layer 3: Experience** 🗺️
**Question:** "How do systems form one coherent user experience?"

**Documents:**
- `information-architecture.md` (coming)
- `experience-architecture.md` (coming)

**Your action:** These will tell you where information lives and how surfaces connect.

---

### **Layer 4: Features** 🚀
**Question:** "What bounded capability is being introduced?"

**Documents:**
- `feature-catalog.md` — **START HERE** — current implementation status
- Individual feature folders with:
  - `feature-brief.md` — Why build it?
  - `behavior-contract.md` — How must it behave?
  - `delivery-design.md` — How will we build it?
  - `validation-plan.md` — How will we test it?

**Your action:** Check `feature-catalog.md` to see if your feature is admitted to MVP. If not, don't build it yet.

---

### **Layer 5: Design** 🎨
**Question:** "How is the experience expressed consistently?"

**Documents:**
- `design-implementation-map.md` — **IMPORTANT** — reconciles all design sources
- `design-system-architecture.md`
- Component specs (coming)
- Content standards (coming)

**Your action:** Use `design-implementation-map.md` to know which design doc is authoritative for tokens, components, or feature design.

---

### **Layer 6: Engineering** 🔧
**Question:** "How is it safely built and operated?"

**Documents:**
- Technical architecture (coming)
- Data architecture (coming)
- Integration architecture (coming)
- Trust architecture (coming)
- Engineering standards (coming)

**Your action:** These will define safe implementation patterns.

---

### **Layer 7: Strategy & Delivery** 📋
**Question:** "What should happen next, and when?"

**Documents:**
- `roadmap.md` — **READ THIS SECOND** — outcome sequence
- `mvp-implementation-masterplan.md` — **READ THIS FIRST** — your current implementation guide
- Release plans (as needed)

**Your action:** This tells you what to build and in what order.

---

### **Layer 8: Decisions** ✅
**Question:** "Why was a specific choice made?"

**Documents:**
- Decision register (coming)
- Decision records (coming)

**Your action:** When you make a consequential decision, record it here.

---

### **Layer 9: Evidence** 📊
**Question:** "What happened and what was learned?"

**Documents:**
- Research program (coming)
- Study records (coming)
- Measurement reports (coming)

**Your action:** Record observations; don't invent conclusions.

---

### **Layer 10: Reviews** 🔍
**Question:** "Did it meet the contract? What did we learn?"

**Documents:**
- Review records (coming)
- Post-release learning (coming)

**Your action:** After shipping, document what worked and what didn't.

---

## How This Changes Your Workflow

### Before (Old Way):
1. Get a task to "improve Tasks feature"
2. Search through multiple docs trying to find what Tasks should do
3. Find conflicting information between old milestone plans and design specs
4. Make your best guess and implement
5. PR gets blocked because it doesn't match someone else's interpretation

### Now (New Way):
1. Get a task to "improve Tasks feature"
2. Go to `feature-catalog.md` → see Tasks is **Admitted** to MVP
3. Check `mvp-implementation-masterplan.md` → Phase 2, work item: "Tasks behavior contract"
4. Read `product-model.md` → understand what "Task" and "Commitment" mean
5. Read `action-and-evidence.md` → understand system rules
6. Read or write `tasks/behavior-contract.md` → know exact expected behavior
7. Read `design-implementation-map.md` → find design authority
8. Implement against a clear contract
9. PR reviews against the same contract

---

## Your Next Steps (Step by Step)

### **Step 1: Read Vision.md** (15 minutes)
**Location:** `docs/strategy/Vision.md`

**Why:** It's your constitutional authority. Everything else implements this.

**What to look for:**
- Why FlowOS exists (not just a task manager)
- The continuous improvement loop
- Product boundaries (what FlowOS will never be)
- Design and product principles

---

### **Step 2: Read MVP Implementation Masterplan** (20 minutes)
**Location:** `docs/07-strategy-and-delivery/mvp-implementation-masterplan.md`

**Why:** This is YOUR CURRENT WORK PLAN.

**What to look for:**
- Phase 0-5 sequence
- Which features are admitted to MVP
- Current phase gates
- What's deferred

**Key insight:** Goals, AI Coach, standalone Progress — all DEFERRED. Don't build them.

---

### **Step 3: Check Feature Catalog** (10 minutes)
**Location:** `docs/04-features/feature-catalog.md`

**Why:** Honest status of current implementation.

**What to look for:**
- Which features are **Shipped** vs **Partial** vs **Placeholder**
- Next documentation artifact needed for each
- What's **Deferred** (don't work on these)

**Example:**
- Today: Shipped, Core MVP
- Tasks: Shipped, Core MVP
- Focus: Shipped, Core MVP
- Goals: Placeholder/Deferred — **DON'T BUILD**

---

### **Step 4: Skim Product Model & Glossary** (10 minutes)
**Locations:** 
- `docs/01-product/product-model.md`
- `docs/01-product/product-glossary.md`

**Why:** Understand core concepts.

**What to look for:**
- What is a "Direction," "Commitment," "Action," "Evidence"?
- How do they relate?
- What's the difference between intention and occurrence?

---

### **Step 5: Read Relevant System Docs** (15 minutes each)
**Location:** `docs/02-systems/`

**Before building any feature, read the system docs it touches:**

If you're working on:
- **Tasks/Today** → Read `direction-and-commitment.md` + `action-and-evidence.md`
- **Focus** → Read `action-and-evidence.md`
- **Reflection** → Read `sensemaking-and-adaptation.md`
- **Habits** → Read `direction-and-commitment.md`
- **Integrations** → Read `continuity-and-interoperability.md`

---

### **Step 6: Check Design Implementation Map** (10 minutes)
**Location:** `docs/05-design/design-implementation-map.md`

**Why:** Know which design document is authoritative.

**What to look for:**
- Is it V3 reference? Tokyo Night palette? CSS in globals?
- Where do tokens come from?
- Which feature design is canonical?

---

### **Step 7: Work According to MVP Masterplan Phases**
**Location:** `docs/07-strategy-and-delivery/mvp-implementation-masterplan.md`

**Current phase: Phase 0-1 (establish truth)**

**Your work:**
1. **Don't add new features**
2. **Verify what exists:**
   - Does the current code match what feature-catalog says?
   - Are there dead routes/placeholder pages?
   - What's the actual behavior?
3. **Write missing contracts:**
   - Feature briefs for admitted features
   - Behavior contracts for shipped features
4. **Clean up ambiguity:**
   - Remove placeholder routes for deferred features
   - Mark legacy docs as historical

**Next phases come AFTER Phase 1 gate is passed.**

---

## When You Want to Change Something

### For Small Changes (bug fixes, polish):
1. Check feature-catalog.md → Is it an admitted MVP feature?
2. Check if a behavior contract exists → Does your change align?
3. Implement
4. Update behavior contract if behavior meaningfully changed

### For New Features or Major Changes:
**STOP. Follow this sequence:**

1. **Check MVP Masterplan** → Is this feature admitted?
   - ❌ Not admitted → Don't build (or propose admission decision)
   - ✅ Admitted → Continue

2. **Check Feature Catalog** → What's needed next?
   - Missing brief → Write feature brief first
   - Missing behavior contract → Write contract before implementation

3. **Read parent system docs** → What rules must you follow?

4. **Check design authority** → What's the visual contract?

5. **Write delivery design** → How will you implement?

6. **Write validation plan** → How will you test?

7. **Implement** against contracts

8. **Review** against contracts

9. **Record what you learned** in a review or post-release doc

---

## What If Documents Conflict?

**Authority order (highest to lowest):**

1. **Vision.md** — immutable
2. **Decision records** — can't override Vision, only resolve choices within it
3. **Roadmap** — outcome sequence
4. **Product/Systems** — conceptual rules
5. **Feature contracts** — specific behavior
6. **Implementation** — code is truth of what exists, but not normative authority

**If you find a conflict:**
1. The higher document wins
2. The lower document is wrong
3. Fix the lower document or record a decision to change it
4. Don't silently implement against a conflict

---

## Quick Reference Card

**Before starting ANY work:**

```
1. Is it in MVP? → feature-catalog.md
2. What's the current phase? → mvp-implementation-masterplan.md
3. What does it mean? → product-model.md + product-glossary.md
4. What system rules apply? → docs/02-systems/<relevant>.md
5. What's the behavior contract? → docs/04-features/<feature>/behavior-contract.md
6. What's the design authority? → design-implementation-map.md
7. Implement
8. Validate against contracts
9. Document what you learned
```

**When confused:**
1. Check documentation-architecture.md → which layer owns this question?
2. Go to that layer
3. If the document doesn't exist yet, write it according to its template

---

## What Makes This Different?

### Old system:
- 50+ docs with unclear authority
- Historical plans treated as current
- Vision spread across multiple chapters
- Feature specs mixed with philosophy
- Couldn't tell what was shipped vs planned

### New system:
- Clear hierarchy
- One document = one question
- Vision is immutable
- Feature catalog shows honest current state
- Every doc has a parent and children
- Evidence can flow up, but can't override parents
- Changes are accountable

---

## Your Immediate Next Action

**Right now, do this:**

1. ✅ Read `Vision.md` (15 min)
2. ✅ Read `mvp-implementation-masterplan.md` (20 min)
3. ✅ Read `feature-catalog.md` (10 min)
4. ✅ Identify which phase you're in
5. ✅ Start working ONLY on admitted MVP features in current phase
6. ✅ Write missing behavior contracts for shipped features before adding anything new

**Do NOT:**
- ❌ Build Goals, AI Coach, or standalone Progress (they're deferred)
- ❌ Add new features not in feature-catalog.md
- ❌ Work ahead of the current MVP phase gate
- ❌ Implement before writing the behavior contract
- ❌ Trust old milestone plans (they're historical context only)

---

## Summary

**The new docs give you:**
1. **Clarity** — One place for each kind of truth
2. **Authority** — Know which doc wins when there's a conflict
3. **Protection** — Can't accidentally override Vision
4. **Accountability** — Changes require decisions
5. **Focus** — Clear MVP boundary with honest status

**Your workflow:**
- Vision → Systems → Feature Contracts → Design → Implementation → Evidence → Learning → Adaptation

**Your safety net:**
- If you're not sure, check the documentation architecture
- Every document has a parent
- When in doubt, ask: "What question am I answering?" → Go to that layer

---

**You're currently in Phase 0-1 of MVP Implementation Masterplan.**

**Next gate:** Phase 1 — establish implementation truth before building new things.

Start there. 🚀
