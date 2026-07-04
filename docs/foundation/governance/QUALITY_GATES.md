# Quality Gates

**Status:** Active  
**Audience:** Founder, engineers  
**Last updated:** July 3, 2026

---

## Purpose

Definition of done for any feature or phase shipment. A feature is **not complete** until all applicable gates pass.

Release stage gates: [RELEASE_CRITERIA.md](./RELEASE_CRITERIA.md).

---

## Gate matrix

Every feature change must pass applicable reviews:

| Gate | Required when | Owner | Pass criteria |
|------|---------------|-------|---------------|
| **Product review** | Any user-facing change | Founder | Aligns with [PRODUCT_PRINCIPLES.md](./PRODUCT_PRINCIPLES.md) + [PRODUCT_DECISION_FRAMEWORK.md](./PRODUCT_DECISION_FRAMEWORK.md) |
| **UX review** | Workflow, nav, routing, capture, focus | Founder | Reduces clicks/switches; no new detours |
| **Architecture review** | New routes, data model, lib boundaries | Founder | Matches [TECHNICAL_ARCHITECTURE.md](../TECHNICAL_ARCHITECTURE.md); no scope creep |
| **Accessibility review** | Interactive controls, hover-only patterns | Founder | No new hover-only critical controls; keyboard reachable |
| **Performance review** | Large lists, new data fetches | Founder | No obvious regression; lazy load if needed |
| **Security review** | Auth, RLS, middleware, API | Founder | User-scoped data; protected routes |
| **Deployment review** | Anything shipped to hosted env | Founder | Build green; env documented |
| **Documentation review** | New modules, behavior changes | Founder | FEATURE_INVENTORY + DECISION_LOG if significant |

**Solo founder:** These are checklist self-reviews, not committee meetings. Still mandatory.

---

## Minimum per change type

| Change type | Gates required |
|-------------|----------------|
| Bug fix (internal) | Deployment (build) |
| Security fix | Security, Deployment, Documentation |
| Phase 3 UX feature | Product, UX, Architecture, Security, Deployment, Documentation |
| Visual-only (Phase 4) | Product, UX, Accessibility, Deployment |
| Refactor (no behavior change) | Architecture, Deployment |
| New module | **Reject** unless all 8 gates + alpha gate |

---

## Accessibility gate (workflow-focused)

- [ ] Critical actions reachable without hover-only UI  
- [ ] Focus visible on interactive elements  
- [ ] `prefers-reduced-motion` not regressed  
- [ ] Form inputs have labels  
- [ ] Color not sole indicator of state (Phase 2 accent rules help)

Full WCAG audit deferred to closed beta ([BETA_SUCCESS_CRITERIA.md](./BETA_SUCCESS_CRITERIA.md)).

---

## Security gate

- [ ] Route in middleware if authenticated content  
- [ ] Supabase queries scoped to `auth.uid()`  
- [ ] RLS policies verified for new tables  
- [ ] No secrets in client bundle  
- [ ] No `using (true)` on user data tables  

---

## Deployment gate

- [ ] `npm run build` passes  
- [ ] `npm run lint` no new errors in touched files  
- [ ] Manual smoke: login → primary flow → logout  
- [ ] Hosted deploy tested if shipping to alpha  

---

## Documentation gate

- [ ] [FEATURE_INVENTORY.md](../FEATURE_INVENTORY.md) updated if user-visible  
- [ ] [DECISION_LOG.md](../DECISION_LOG.md) for Build/Kill decisions  
- [ ] Drift fixed in PROJECT_STATE if routes/nav changed  

---

## Phase 3 shipment bundle (additional)

Before marking Phase 3.x complete:

- [ ] Open → first action < 5 sec (founder tested)  
- [ ] Next-action never routes to wrong module  
- [ ] No fake/dead UI in user paths  
- [ ] Phase post-review doc in `docs/design/` per contract model  

---

## Related documents

- [RELEASE_CRITERIA.md](./RELEASE_CRITERIA.md)  
- [ENGINEERING_DECISION_FRAMEWORK.md](./ENGINEERING_DECISION_FRAMEWORK.md)  
- [../../design/README.md](../../design/README.md)  
