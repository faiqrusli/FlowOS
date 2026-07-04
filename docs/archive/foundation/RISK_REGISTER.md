# Risk Register

**Status:** Living document  
**Audience:** Founder  
**Last updated:** July 3, 2026  
**Review cadence:** Weekly during alpha; monthly during beta

---

## Purpose

Track product, business, technical, and execution risks with mitigation and ownership.

---

## Risk matrix legend

| Likelihood | Definition |
|------------|------------|
| **High** | > 50% in next 90 days |
| **Medium** | 20–50% |
| **Low** | < 20% |

| Impact | Definition |
|--------|------------|
| **Critical** | Product death, data breach, or total timeline slip |
| **High** | Alpha failure, major rework |
| **Medium** | Delay, user churn |
| **Low** | Minor friction |

---

## Product

| ID | Risk | L | I | Mitigation | Owner | Review |
|----|------|---|---|------------|-------|--------|
| P1 | Daily loop never coheres; D7 fails | **High** | **Critical** | Phase 3.1; ALPHA_SUCCESS_CRITERIA; simplify nav if fail twice | Founder | Weekly |
| P2 | Too many modules; users confused | **High** | **High** | Nav cap 5; command palette; demote Schedule/Notes | Founder | Weekly |
| P3 | Reflection feels bolted-on | Medium | High | Unify save UX; evening nudge on Today | Founder | Biweekly |
| P4 | Notes kanban distracts from loop | Medium | Medium | No kanban investment until D7 gate | Founder | Monthly |
| P5 | SRL positioning doesn't resonate | Medium | Medium | Market with pain ("four apps"), not theory | Founder | Quarterly |

---

## Business

| ID | Risk | L | I | Mitigation | Owner | Review |
|----|------|---|---|------------|-------|--------|
| B1 | No paying users path | High | High | Validate retention before pricing; indie price hypothesis | Founder | Quarterly |
| B2 | Sunsama/Akiflow win daily planner wedge | Medium | High | Differentiate on habits+focus+reflection without calendar | Founder | Quarterly |
| B3 | Solo founder burnout | **High** | **Critical** | 90-day scope cap; reject FE-1–FE-13 breadth | Founder | Weekly |
| B4 | Alpha users are friends (biased feedback) | Medium | High | Recruit strangers; [USER_PERSONAS.md](./USER_PERSONAS.md) criteria | Founder | Per wave |
| B5 | Thesis deadline conflicts with product validation | Medium | Medium | Separate thesis deliverables from alpha scope | Founder | Monthly |

---

## Technical

| ID | Risk | L | I | Mitigation | Owner | Review |
|----|------|---|---|------------|-------|--------|
| T1 | **Production build broken** | **High** | **Critical** | Fix/delete `workplace-recover-day-bar.tsx` Week 1 | Founder | Daily until fixed |
| T2 | **Open RLS on core tables** | **High** | **Critical** | Migration Week 1; block external users until done | Founder | Daily until fixed |
| T3 | `/workplace` unauthenticated | **High** | **High** | Add to middleware Week 1 | Founder | Once |
| T4 | `tasks-board-view.tsx` monolith (~2.5k lines) | Medium | High | Careful Phase 3 edits; split post-alpha | Founder | Monthly |
| T5 | Dual drag systems | Low | Medium | Defer dnd-kit migration | Founder | Quarterly |
| T6 | No automated tests | **High** | High | Smoke tests before closed beta | Founder | Per gate |
| T7 | Supabase vendor lock-in | Low | Medium | Accept for indie scale; export path later | Founder | Annual |

---

## UX

| ID | Risk | L | I | Mitigation | Owner | Review |
|----|------|---|---|------------|-------|--------|
| U1 | Wrong next-action routing destroys trust | **High** | **High** | Fix `dashboard-command.ts`, `schedule.ts` in Phase 3.1 | Founder | Per sprint |
| U2 | Hover-gated focus controls | **High** | High | Always-visible timer Phase 3.3 | Founder | Per sprint |
| U3 | No onboarding; first-run confusion | **High** | High | Onboarding v1 before closed beta | Founder | Beta gate |
| U4 | Three scheduling surfaces | Medium | High | One default on Today; demote Schedule nav | Founder | Phase 3.4 |
| U5 | Modal capture breaks flow | Medium | Medium | Inline capture Phase 3.2 | Founder | Per sprint |

---

## Security

| ID | Risk | L | I | Mitigation | Owner | Review |
|----|------|---|---|------------|-------|--------|
| S1 | Cross-user data read via open RLS | **High** if deployed | **Critical** | RLS migration; no alpha until fixed | Founder | Pre-alpha |
| S2 | Auth bypass on `/workplace` | Medium | High | Middleware fix | Founder | Week 1 |
| S3 | Anon key exposure misuse | Low | Medium | Standard Supabase patterns; no service key in client | Founder | Per deploy |
| S4 | No privacy policy at beta | Medium | Medium | Draft before closed beta | Founder | Beta gate |

---

## Performance

| ID | Risk | L | I | Mitigation | Owner | Review |
|----|------|---|---|------------|-------|--------|
| PF1 | Large task board slow | Low | Medium | Profile if reported; virtualize later | Founder | On report |
| PF2 | Cold start on Vercel | Low | Low | Accept for alpha | Founder | On report |

---

## Maintainability

| ID | Risk | L | I | Mitigation | Owner | Review |
|----|------|---|---|------------|-------|--------|
| M1 | Documentation drift from code | **High** | High | Code wins; update on Phase 3 ship; drift register in CEO review | Founder | Per phase |
| M2 | Dead code accumulates | Medium | Medium | Delete unused components (Agenda, recover-day) | Founder | Week 1 |
| M3 | Design docs vs governance overlap | Low | Low | Clear layers: design=history, governance=rules | Founder | This pass |

---

## Competition

| ID | Risk | L | I | Mitigation | Owner | Review |
|----|------|---|---|------------|-------|--------|
| C1 | Sunsama copies integrated loop | Low | Medium | Speed to alpha; indie niche | Founder | Quarterly |
| C2 | Motion AI makes manual planning obsolete | Low | Medium | Privacy/no-AI positioning | Founder | Annual |
| C3 | Todoist adds reflection/focus | Low | Medium | Depth + aesthetic differentiation | Founder | Quarterly |

---

## Execution

| ID | Risk | L | I | Mitigation | Owner | Review |
|----|------|---|---|------------|-------|--------|
| E1 | Phase 3 scope too large pre-alpha | **High** | **High** | Ship 3.1 only before Wave 1; defer 3.4–3.6 | Founder | Weekly |
| E2 | Recruit users before ready | Medium | **Critical** | [GATES.md](./GATES.md) gates | Founder | Pre-alpha |
| E3 | Visual polish procrastination | Medium | Medium | Workflow before Phase 4 | Founder | Weekly |
| E4 | Documentation over building | Medium | Medium | Governance pass complete; code Week 1 | Founder | Now |

---

## Founder

| ID | Risk | L | I | Mitigation | Owner | Review |
|----|------|---|---|------------|-------|--------|
| F1 | Building for thesis evaluators not users | Medium | High | Product validation goal; ignore FE checklist | Founder | Monthly |
| F2 | Perfectionism delays alpha | **High** | **High** | ALPHA_SUCCESS_CRITERIA; 5 users not 50 | Founder | Weekly |
| F3 | No co-founder bottleneck | Medium | High | Document governance; clear onboarding path | Founder | This pass |

---

## Top 5 risks (July 2026)

1. **T1 + T2** — Build broken + open RLS (Critical)  
2. **P1** — Daily loop / D7 failure (Critical)  
3. **B3** — Founder burnout from scope (Critical)  
4. **E1** — Phase 3 too large before alpha (High)  
5. **M1** — Documentation drift (High)  

---

## Related documents

- [../archive/foundation/CEO_REVIEW_JULY_2026.md](../archive/foundation/CEO_REVIEW_JULY_2026.md)  
- [GATES.md](./GATES.md)  
- [PRODUCT_VISION.md](./PRODUCT_VISION.md)  
