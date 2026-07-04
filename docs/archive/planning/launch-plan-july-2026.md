# Launch Plan

> **Status: Superseded** — Timeline and milestone planning moved to [execution-masterplan.md](../strategy/execution-masterplan.md) (July 4, 2026). This file is retained for historical alpha/beta stage detail only. Do not use for current planning.

**Status:** Archive (superseded)  
**Audience:** Founder  
**Last updated:** July 3, 2026  
**Primary goal:** Validate FlowOS as a real product with early users (retention over breadth)

---

## Purpose

Actionable timeline from internal use through private alpha, closed beta, and public launch — with go/no-go gates, recruitment plan, and feedback cadence.

Execution detail for Phase 3 features: [../design/roadmap-pre-masterplan.md](../design/roadmap-pre-masterplan.md).  
Readiness gates: [governance/GATES.md](../../foundation/governance/GATES.md).  
Metrics: [GATES.md](../../foundation/governance/GATES.md).

---

## Launch stages overview

```
Internal alpha (now)
    ↓ Phase 3.1 MVP + blockers fixed
Private alpha Wave 1 (5 users)
    ↓ D7 gate: 3/5 return
Private alpha Wave 2 (15 users)
    ↓ Phase 3 complete + D7 > 30%
Closed beta (50 users)
    ↓ D30 > 15%, onboarding v1
Public beta / v1.0 (200+ users)
```

---

## Stage 0: Internal alpha (now — July 2026)

**Who:** Founder only (solo dogfooding)  
**Deploy:** Local or personal hosted instance  
**Goal:** Baseline friction metrics before Phase 3.1

### Activities

- Use FlowOS as daily driver where possible  
- Document module switches and open→action time  
- Do **not** recruit external users yet  

### Exit criteria

- Phase 3.1 MVP development started  
- Foundation docs complete  
- Baseline friction documented  

---

## Stage 1: Private alpha Wave 1 (target: Aug 2026)

**Who:** 5 knowledge workers ([USER_PERSONAS.md](../../archive/foundation/USER_PERSONAS.md) — Alex)  
**Deploy:** Hosted instance (Vercel + Supabase)  
**Goal:** First external validation of daily loop

### Prerequisites (go/no-go)

| Requirement | Status |
|-------------|--------|
| Phase 3.1 MVP shipped | Pending |
| `/workplace` auth middleware fix | Pending |
| Fake Agenda card removed | Pending |
| Error/loading boundaries on main routes | Pending |
| Supabase RLS verified for production | Pending |

**Do not recruit until all prerequisites pass.**

### Phase 3.1 MVP scope (minimum)

1. Today as home — Workplace + Dashboard next-action inline, fixed deep links  
2. Inline capture bar on Today  
3. Always-visible focus controls when session active  
4. Remove fake Agenda or replace with real "Plan tomorrow"  
5. Command palette v1 — search + jump only (strongly recommended before Wave 1)

### Recruitment

- Personal outreach (direct message, email) — no public landing page  
- Criteria: uses 2+ productivity apps daily; willing to switch for 2 weeks  
- Offer: free access; founder personally invested in feedback  
- Onboard: 30-minute video call — watch first 10 minutes of use  

### Feedback cadence

| When | Activity |
|------|----------|
| Day 0 | Onboarding call (30 min) |
| Day 3 | Async check-in (message) |
| Day 7 | Interview call (15 min) — five standard questions |
| Day 14 | Retrospective — continue or churn reason |

### Success gate (Wave 1 → Wave 2)

**3 of 5 users return on D7.**  
If failed: pause recruitment, fix loop, re-test with 2 users before expanding.

### Metrics

- D1, D7 retention  
- Open → first action < 5 sec (self-report + observation)  
- Focus sessions ≥ 3/week per active user  
- Reflection ≥ 3 days/week per active user  

---

## Stage 2: Private alpha Wave 2 (target: Sep–Oct 2026)

**Who:** 10 additional users (mix Alex + Sam personas) — 15 total  
**Goal:** Phase 3 complete; iterate from Wave 1 feedback

### Prerequisites

- Wave 1 gate passed  
- Phase 3.2–3.6 shipped (command layer, focus mode, planning simplification, day arc, keyboard OS)  
- Reflection save behavior unified  

### Additional features

- Focus as mode (not page)  
- Planning simplification (one default scheduling surface)  
- Day open/close arc  
- Keyboard shortcuts on Today  

### Success gate (Alpha → Closed beta)

- D7 retention > 30% sustained over 4 weeks  
- Module switches −50% vs pre-Phase 3 baseline  
- Reflection completion +25%  

---

## Stage 3: Closed beta (target: Jan 2027 — 6 months)

**Who:** 50 users via waitlist (personal network + word of mouth)  
**Goal:** Scale validation; Phase 4 polish; onboarding v1

### Prerequisites

- Alpha gates passed  
- Phase 4 signature moments (empty states, focus hero, now-line)  
- Onboarding v1 (3-step first-run)  
- Phase 5 QA subset (keyboard, contrast)  
- Lightweight analytics events  

### Activities

- Soft waitlist page (minimal — email capture only)  
- Weekly release notes to beta users  
- Monthly retention review  

### Success gate (Beta → Public)

- D30 retention > 15%  
- D7 retention > 25%  
- 60% weekly reflection rate among active users  

---

## Stage 4: Public beta / v1.0 (target: Jul 2027 — 12 months)

**Who:** 200+ users  
**Goal:** Clear positioning; optional monetization hypothesis

### Prerequisites

- Beta gates passed  
- Full WCAG audit  
- Performance profiling  
- Privacy policy and terms  
- Landing page with positioning  

### Features (if retention proven)

- Goals v1 minimal (FE-1)  
- Weekly reflection improvements (FE-5)  
- Smart notifications subset (FE-8)  

### Not before public beta

- AI Coach (FE-4)  
- Mobile (FE-9)  
- Calendar sync (FE-11)  
- Gamification (FE-10)  

---

## 12-month roadmap summary

### 30 days (Jul–Aug 2026)

| Area | Goals |
|------|-------|
| Product | Phase 3.1–3.2 MVP; remove fake UI; fix auth |
| Business | No marketing; prepare Wave 1 recruitment list |
| Technical | Error/loading boundaries; deploy to Vercel |
| Launch | Internal + 5-user private alpha |
| Metrics | Open → action < 5 sec; 3/5 D7 |

### 90 days (Aug–Oct 2026)

| Area | Goals |
|------|-------|
| Product | Phase 3 complete; 15 alpha users |
| Business | Case study collection from engaged users |
| Technical | Phase 5 QA subset |
| Launch | Private alpha (15 users) |
| Metrics | D7 > 30%; focus ≥ 3/week |

### 6 months (Jan 2027)

| Area | Goals |
|------|-------|
| Product | Phase 4 polish; onboarding v1 |
| Business | Waitlist; soft public presence |
| Technical | dnd-kit if needed; critical path tests |
| Launch | Closed beta (50 users) |
| Metrics | D30 > 15%; 60% weekly reflection |

### 12 months (Jul 2027)

| Area | Goals |
|------|-------|
| Product | Goals v1; positioning clear |
| Business | Pricing hypothesis; landing page |
| Technical | Full WCAG; performance audit |
| Launch | Public beta |
| Metrics | 200+ users; D7 > 25%; 40% organic weekly active |

---

## Rollback criteria

**Pause all recruitment** if:

- Data loss or corruption reported  
- Auth bypass on any protected route  
- Critical workflow broken (cannot task, focus, or reflect)  
- > 2 of 5 alpha users abandon within 48 hours without feedback  

**Revert to internal-only** until root cause fixed and re-validated with 2 users.

---

## What NOT to do before private alpha

1. Public landing page or Product Hunt launch  
2. Social media marketing  
3. Build Goals, AI, or mobile to attract users  
4. Polish empty states while daily loop is broken  
5. Recruit developer friends as primary feedback source  

---

## Founder weekly checklist (during alpha)

- [ ] Review D1/D7 retention for active alpha users  
- [ ] Read all feedback messages — note "where am I supposed to be?" mentions  
- [ ] Ship at least one friction fix per week from alpha feedback  
- [ ] Do not start new modules  
- [ ] Update [decision-log.md](../../execution/logs/decision-log.md) if strategic choice made  

---

## Related documents

- [governance/GATES.md](../../foundation/governance/GATES.md) — pre-launch checklists
- [GATES.md](../../foundation/governance/GATES.md) — gates and targets
- [USER_PERSONAS.md](../../archive/foundation/USER_PERSONAS.md) — who to recruit
- [roadmap-pre-masterplan.md](../design/roadmap-pre-masterplan.md) — Phase 3 feature breakdown
- [decision-log.md](../../execution/logs/decision-log.md) — strategic decisions
