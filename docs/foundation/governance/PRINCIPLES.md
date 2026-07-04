# Product Principles

**Status:** Active — single source for product rules and build/defer/reject decisions  
**Audience:** Founder, engineers  
**Last updated:** July 4, 2026 (consolidates former Principles, Philosophy rules, Decision Framework)

North star: [../PRODUCT_VISION.md](../PRODUCT_VISION.md). Current plan: [../../strategy/execution-masterplan.md](../../strategy/execution-masterplan.md).

---

## Core idea

FlowOS should feel like **one continuous day** — open → act in **under 5 seconds**. Intelligence lives on **Today**, not on read-only detours.

---

## Principles (24)

### Daily loop

1. **Execution over planning.** — Users should act before they organize.
2. **One obvious next action.** — The app always surfaces a single clear next step.
3. **One screen before many screens.** — Today is home; depth is optional.
4. **Open → act in under five seconds.** — No mandatory detours on launch.
5. **One continuous day.** — Morning, work, and evening feel connected, not modular.

### Friction

6. **Reduce thinking.** — Never make users choose between equivalent paths.
7. **Reduce clicks.** — Every click must advance the day, not the interface.
8. **Reduce context switching.** — Module hops are a cost, not a feature.
9. **Inline before modal.** — Capture and edit on the surface where work happens.
10. **Visible before hover.** — Critical controls are always reachable.

### Scope

11. **Workflow before feature count.** — Coherence beats breadth.
12. **No feature without measurable user value.** — Tie to WAD, D7, or loop completion.
13. **Every interaction earns its place.** — Remove or wire; never fake UI.
14. **Stop adding modules.** — Integrate before expanding until D7 retention proven.
15. **Defer differentiation theater.** — No AI, gamification, or Goals until loop works.

### Reflection

16. **Reflection improves tomorrow.** — Evening review is part of the product, not an appendix.
17. **One save behavior.** — Same data, same save model everywhere.
18. **Close the loop with data.** — Reflection should reference what user actually did today.

### Trust

19. **Security before users.** — No external user until RLS and auth are correct.
20. **Ship only what works.** — Broken build, dead buttons, and placeholder routes erode trust.
21. **Honest product surface.** — Hide or remove unfinished modules from production paths.

### Design system (frozen through Phase 2)

22. **Workflow before visuals.** — Do not polish what workflow has not validated.
23. **One entity, one accent.** — Extend accent rules deliberately; no rainbow drift.
24. **Dark-first is settled.** — Light theme is not a near-term product bet.

---

## Feature test

Answer **yes** to all before building:

| # | Question |
|---|----------|
| 1 | Does it reduce thinking, clicks, or context switches? |
| 2 | Does it strengthen plan → execute → reflect? |
| 3 | Can we measure impact on WAD or D7 within 30 days of alpha? |
| 4 | Does it avoid adding a new top-level nav item? |
| 5 | Is it wired, secure, and build-green before external users see it? |

If any **no** → default **defer or reject**.

---

## Decision types

| Outcome | Meaning |
|---------|---------|
| **Build** | In current milestone; add to masterplan + decision log |
| **Defer** | Valid; blocked by gate, capacity, or dependency |
| **Reject** | Violates principles or non-goals |
| **Kill** | Remove existing surface; simplify |

---

## Reject triggers (automatic)

| Trigger | Example |
|---------|---------|
| New top-level nav before D7 gate | Goals, AI Coach in sidebar |
| AI/automation before retention proof | FE-4 AI Coach |
| Mobile/calendar without strategy | FE-9, FE-11 |
| Fake or placeholder UI | Dead "Open" buttons |
| Breadth for thesis/SRS checkbox | FE-10 gamification |

---

## Defer queue (standing)

Valid but **not now** — see masterplan for milestone timing:

- Goals (FE-1), AI (FE-4), Calendar sync (FE-11), Mobile (FE-9)
- Notes kanban expansion
- Command palette until M4 (unless users ask)
- Phase 4 visual polish until alpha validates loop

---

## Workflow

```
Idea → Feature test (above)
    → Build: masterplan + decision-log
    → Defer: note reason in decision-log
    → Reject/Kill: decision-log + remove from codebase if applicable
```

Record every Build/Kill in [decision-log.md](../../execution/logs/decision-log.md).

---

## Anti-patterns

| Anti-pattern | Why it fails |
|--------------|--------------|
| AI before daily loop works | Retention unchanged |
| Dashboard as default home | Intelligence without execution |
| Modal-first capture | Breaks flow |
| Hover-gated critical controls | Fails accessibility |
| Three scheduling surfaces | Decision fatigue |
| Fake UI placeholders | Destroys alpha trust |

---

## Related

- [GATES.md](./GATES.md) — release stage gates + WAD, D7 definitions
- [QUALITY_GATES.md](./QUALITY_GATES.md) — per-feature definition of done
- [ENGINEERING.md](./ENGINEERING.md) — technical tradeoffs
