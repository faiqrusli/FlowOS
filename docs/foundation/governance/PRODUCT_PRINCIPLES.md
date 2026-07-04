# Product Principles

**Status:** Active — test every feature against these  
**Audience:** Founder, engineers, designers, future contributors  
**Last updated:** July 3, 2026

---

## Purpose

Concise, testable rules for product decisions. If a feature violates a principle, it does not ship until redesigned or rejected.

Theory and SRL mapping live in [../PRODUCT_PHILOSOPHY.md](../PRODUCT_PHILOSOPHY.md). Strategy lives in [PRODUCT_STRATEGY.md](./PRODUCT_STRATEGY.md).

---

## Principles

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

## Feature test (use in reviews)

For any proposed feature, answer yes to all:

| # | Question |
|---|----------|
| 1 | Does it reduce thinking, clicks, or context switches for the target user? |
| 2 | Does it strengthen the plan → execute → reflect loop? |
| 3 | Can we measure impact on WAD or D7 within 30 days of alpha? |
| 4 | Does it avoid adding a new top-level nav item? |
| 5 | Is it wired, secure, and build-green before external users see it? |

If any answer is **no**, default is **defer or reject**.

---

## Related documents

- [PRODUCT_DECISION_FRAMEWORK.md](./PRODUCT_DECISION_FRAMEWORK.md)  
- [QUALITY_GATES.md](./QUALITY_GATES.md)  
- [../CEO_REVIEW_JULY_2026.md](../CEO_REVIEW_JULY_2026.md)  
