# Quality Gates

**Status:** Active  
**Audience:** Founder, engineers  
**Last updated:** July 4, 2026

Definition of done for any feature shipment. Release stages: [GATES.md](./GATES.md).

---

## Gate matrix

| Gate | Required when | Pass criteria |
|------|---------------|---------------|
| **Product** | User-facing change | [PRINCIPLES.md](./PRINCIPLES.md) feature test |
| **UX** | Workflow, nav, routing, capture | Reduces clicks/switches |
| **Architecture** | Routes, data model, lib boundaries | Matches [TECHNICAL_ARCHITECTURE.md](../TECHNICAL_ARCHITECTURE.md) |
| **Accessibility** | Interactive controls | No hover-only critical controls |
| **Performance** | Large lists, new fetches | No obvious regression |
| **Security** | Auth, RLS, middleware | User-scoped data |
| **Deployment** | Shipped to hosted env | Build green; production verified |
| **Documentation** | Behavior changes | FEATURE_INVENTORY + decision-log if significant |

Solo founder: self-review checklist, still mandatory.

---

## Minimum per change type

| Change type | Gates required |
|-------------|----------------|
| Bug fix (internal) | Deployment |
| Security fix | Security, Deployment, Documentation |
| M2 UX feature | Product, UX, Architecture, Security, Deployment, Documentation |
| Refactor (no behavior change) | Architecture, Deployment |
| New module | **Reject** unless all gates + alpha gate |

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
- [ ] Hosted deploy tested on https://flowos-sage.vercel.app

---

## Documentation gate

- [ ] [FEATURE_INVENTORY.md](../FEATURE_INVENTORY.md) updated if user-visible
- [ ] [decision-log.md](../../execution/logs/decision-log.md) for Build/Kill decisions

---

## Related

- [PRINCIPLES.md](./PRINCIPLES.md)
- [GATES.md](./GATES.md)
- [ENGINEERING.md](./ENGINEERING.md)
