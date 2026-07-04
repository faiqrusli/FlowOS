# Product Philosophy

**Status:** Active  
**Audience:** Founders, designers, engineers  
**Last updated:** July 3, 2026

---

## Purpose

Translate FlowOS's theoretical foundations and design history into **decision rules** that govern product, UX, and engineering choices going forward.

---

## Core principle: One continuous day

FlowOS should feel like **one continuous day**, not eight disconnected modules.

**Success metric:** Time from open app → doing the right thing **under 5 seconds**.

**Implication:** Intelligence lives where execution happens (Today/Workplace), not on a read-only detour (Dashboard). Navigation, capture, focus, and reflection must connect without context-switching tax.

Source: [../design/ux-friction-review.md](../design/ux-friction-review.md)

---

## The SRL cycle as product architecture

Self-Regulated Learning (Zimmerman, 2002) is not marketing language — it is the **structural backbone** of FlowOS.

```
Forethought          Performance           Self-reflection
(plan)               (execute)             (evaluate)
    │                     │                      │
Tasks ──┐            Workplace ──┐          Reflection
Habits ─┼──► Today ◄── Focus ───┘          Notes (secondary)
Schedule┘            (mode, not page)
```

### Forethought phase

Users establish goals, organize activities, and allocate time.

- **Modules:** Tasks, Habits, Schedule  
- **Philosophy:** Capture must be frictionless (inline, not modal-first). Planning should happen by dragging time on Today, not by learning three scheduling surfaces.

### Performance phase

Users execute, maintain concentration, and monitor progress.

- **Modules:** Workplace (primary), Focus (mode)  
- **Philosophy:** Focus is a **mode**, not a destination page. Timer controls must be always visible during active sessions — never hover-gated.

### Self-reflection phase

Users evaluate outcomes and identify improvements.

- **Modules:** Reflection (essential), Notes (secondary)  
- **Philosophy:** One save behavior everywhere. Evening nudge on Today. Weekly reflection stays secondary until daily loop is proven.

---

## Design principles (ranked)

### 1. Workflow before visuals

Visual polish (Phases 0–2) raised the score from 5.5 → 7.8/10 but did **not** fix daily retention blockers. UX workflow architecture is a separate track with higher ROI than typography or signature moments.

**Rule:** Do not ship Phase 4 visual work before Phase 3 daily loop is validated with real users.

### 2. Fix trust-breaking UI immediately

Fake buttons, dead routes, and placeholder modules destroy credibility — especially with alpha users.

**Rule:** Remove or wire UI before recruiting external users. No "Open" buttons that do nothing.

### 3. One entity, one accent

From Phase 2 design contract: **max 2 non-neutral colors per row/card/chip cluster.** Indigo is dominant; entity types use dots, edges, and flags — not rainbow fills.

**Rule:** Extend accent discipline to Notes and Reflection only with dedicated review — not opportunistically during feature work.

Source: [../design/03-phase2-spec.md](../design/03-phase2-spec.md)

### 4. Stop adding modules

Phase 3 thesis: **Make the existing OS feel like one continuous day.** New sidebar items, timeline variants, and module builds are out of scope until the daily loop works.

**Rule:** Every new surface must answer: "Does this reduce module switches, or add another?"

### 5. Contract-based changes

Design phases 0–2 established: Review → Spec (frozen) → Implement (exact) → Post-review.

**Rule:** Product and engineering changes above trivial bug fixes follow the same discipline. Record decisions in [DECISION_LOG.md](./DECISION_LOG.md).

---

## Visual identity: "Lamplit desk at night"

- **Palette:** Midnight Focus — navy-indigo neutrals, single indigo accent  
- **Typography:** Geist Sans (body), Geist Mono (timers)  
- **Surfaces:** Layered ladder — app → sidebar → page → card → elevated  
- **Motion:** Global `prefers-reduced-motion` guard  

Visual identity is **settled** through Phase 2. Future visual work (Phase 4) polishes; it does not redefine.

Source: [../design/PROJECT_STATE.md](../design/PROJECT_STATE.md)

---

## Information hierarchy philosophy

| Tier | Surfaces | User mental model |
|------|----------|-------------------|
| **Primary** | Today / Workplace | "This is my day" |
| **Secondary** | Tasks, Focus history, Reflection | "I go here when I need depth" |
| **Tertiary** | Schedule fullscreen, Notes, Overview | "Power features and archives" |

Eight equal sidebar items violate this hierarchy. Phase 3.1 merges Dashboard intelligence into Today and demotes Overview.

Details: [INFORMATION_ARCHITECTURE.md](./INFORMATION_ARCHITECTURE.md)

---

## What we optimize for (in order)

1. **Daily return rate** — Will users open FlowOS tomorrow?  
2. **Time to first action** — Open → doing the right thing  
3. **Loop completion** — Plan → execute → reflect in one session  
4. **Module switch reduction** — Fewer context changes per day  
5. **Visual craft** — Important, but not before 1–4  

---

## What we do not optimize for (yet)

- Feature breadth (Goals, AI, gamification)  
- Module parity in navigation  
- Portfolio impressiveness over user retention  
- Thesis completeness over product validation  

---

## Anti-patterns to reject

| Anti-pattern | Why it fails |
|--------------|--------------|
| Building AI before daily loop works | Differentiation theater; retention unchanged |
| Dashboard as default home | Intelligence without execution; mandatory detour |
| Modal-first capture | Breaks flow; penalizes power users |
| Hover-gated critical controls | Fails accessibility and deep work |
| Three scheduling surfaces | Decision fatigue; no clear default |
| Fake UI placeholders | Destroys trust in alpha |

---

## Related documents

- [PRODUCT_VISION.md](./PRODUCT_VISION.md) — north star and positioning  
- [INFORMATION_ARCHITECTURE.md](./INFORMATION_ARCHITECTURE.md) — module hierarchy  
- [../design/ux-friction-review.md](../design/ux-friction-review.md) — friction diagnosis  
- [../design/AUDIT_HISTORY.md](../design/AUDIT_HISTORY.md) — design decision rationale  
- [DECISION_LOG.md](./DECISION_LOG.md) — product-level decisions  
