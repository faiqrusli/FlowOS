# Feature Catalog and Documentation Coverage

**Status:** Active implementation reference
**Authority:** Canonical inventory of FlowOS feature domains, their current implementation state, and the next documentation artifact required for each
**Owner:** Product Architect
**Approval Required:** Founder
**Parent:** [Information Structure](../03-experience/information-structure.md) · [Feature Standards](./README.md) · [MVP Implementation Masterplan](../current-phase/mvp-implementation-masterplan.md)
**Children:** Individual feature dossiers with briefs, behavior contracts, design specs, delivery designs, and validation plans (matched to complexity)
**Last Updated:** 2026-08-04 (adapted for solo founder development)
**Review trigger:** A route, product role, implementation status, feature disposition, or required feature-document set changes.
**Note:** Feature standards remain essential for major features like Today, Tasks, and Focus. The six hats are executed by the Founder in one session, with short scope/design, build-quality, and release self-approval checkpoints rather than a separate handoff queue.

---

## Document Ownership

### Owner
**Role:** Product Architect
**Responsibility:** Maintain feature inventory, track implementation status, and ensure feature documentation coverage aligns with MVP masterplan

### Modification Process
1. Product Architect proposes catalog updates (based on implementation changes or new feature admission)
2. Submit to Founder for approval
3. Founder reviews for strategic alignment and masterplan consistency
4. If approved: Product Architect updates document
5. Document change in decision record if consequential
6. Update Last Updated date

### Authority Level
- Product Architect can: Propose status updates, maintain inventory, track documentation needs
- Requires approval for: New feature admission, status changes that affect strategic priorities, or documentation requirement changes

---

## 1. Why this catalog exists

The canonical documentation architecture already defines the standards for feature briefs, behavior contracts, delivery designs, validation plans, and feature-specific design. It did not yet provide a current implementation inventory that answers a simpler question:

> Which feature domains exist in the code today, what is their real status, and where should their next durable documentation live?

This catalog supplies that missing bridge. It is an index and status map, not a substitute for any feature contract. It must not become a second behavior specification.

The user-facing feature list is intentionally not a `02 Features` folder. `02-systems` is reserved for enduring product mechanisms; bounded user capabilities belong in `04-features`. A feature may apply several systems, but it must not redefine them.

## 2. Status vocabulary

| Status | Meaning | Allowed implementation posture |
|---|---|---|
| **Shipped** | A person-facing capability is implemented and reachable in the current product. | Stabilize its contract and record gaps before material expansion. |
| **Partial** | Some implementation exists, but a material behavior, state, or journey is incomplete. | Do not describe it as complete; write the missing contract before expanding it. |
| **Placeholder** | A route or shell exists primarily to communicate future intent. | Do not treat it as MVP capability or build from the placeholder. |
| **Derived** | The concept is calculated or surfaced by another capability rather than owned as a standalone feature. | Document its meaning in the owning system, success model, or measurement specification. |
| **Embedded** | The concept exists as a bounded sub-capability of another feature. | Keep ownership with the host feature unless a new product decision admits a separate feature. |
| **Deferred** | The capability is intentionally outside the current MVP admission boundary. | Preserve the rationale; do not implement speculatively. |
| **Unknown** | Current behavior or ownership cannot yet be established from code and evidence. | Resolve in Phase 1 of the MVP masterplan before planning work. |

## 3. Current implementation coverage

The table is deliberately more honest than the old feature list: a route is not proof that a complete feature exists, and a concept without a route is not automatically a missing product.

| Feature domain | Current surface | Current status | Evidence in the repository | MVP disposition | Next durable artifact |
|---|---|---|---|---|---|
| **Today** | `/` | **Shipped** | `src/app/(main)/page.tsx`, `src/components/workplace/` | **Core MVP execution entry and reorientation surface; separate read-only orientation deferred by D-014** | [Brief](./briefs/today.md), [behavior contract](./behavior/today.md), journey contract, design spec, validation plan |
| **Tasks** | `/tasks` plus Today/Workplace task surfaces | **Shipped** | `src/app/(main)/tasks/`, `src/components/tasks/`, `src/lib/tasks.ts` | **Core MVP commitment and action surface** | [Brief](./briefs/tasks.md), [behavior contract](./behavior/tasks.md), delivery design, design spec, validation plan |
| **Habits** | `/habits` plus Today/Workplace cards | **Shipped** | `src/app/(main)/habits/`, `src/components/habits/`, `src/lib/habits.ts` | **Supporting MVP path; keep only where it strengthens the loop** | [Supporting-domain decision](./supporting-domain-decisions.md); design/validation only if retained behavior changes |
| **Schedule** | `/schedule`, task schedule controls, timeline | **Shipped** | `src/app/(main)/schedule/`, `src/components/schedule/`, `src/lib/schedule*.ts` | **Supporting planning context; simplify overlapping scheduling surfaces before expansion** | [Supporting-domain decision](./supporting-domain-decisions.md) and [record rules](./record-rules.md) |
| **Focus** | `/focus` and embedded focus mode in Today/Workplace | **Shipped** | `src/app/(main)/focus/`, `src/components/focus/`, `src/lib/focus*.ts` | **Core action mode; page remains history/analytics until evidence supports more** | [Brief](./briefs/focus.md), [behavior contract](./behavior/focus.md), design spec, validation plan |
| **Reflection** | `/reflection`, sidebar, session-end capture | **Partial** | `src/app/(main)/reflection/`, `src/components/reflection/`, `src/lib/reflection*.ts` | **Core sensemaking and adaptation path**; unify save semantics first | [Brief](./briefs/reflection.md), [behavior contract](./behavior/reflection.md), journey contract, validation plan |
| **Growth Areas** | Notes sub-capability; no primary route | **Embedded** | `src/components/notes/growth-area-*`, `src/lib/growth-areas.ts`, `growth_goals` data type | **Keep embedded in Notes until a distinct person need and outcome are evidenced** | Notes behavior addendum; separate feature brief only if admitted |
| **Goals** | `/goals` | **Placeholder / Deferred** | `src/app/(main)/goals/`, `src/lib/module-roadmap-content.ts`, placeholder middleware | **Not MVP**; re-admit only through evidence and a direction-system decision | No build dossier yet; preserve the deferral decision |
| **Knowledge** | Notes and linked context; no `/knowledge` route | **Derived / Embedded** | `src/app/(main)/notes/`, `src/components/notes/`, product glossary definition of knowledge | **No standalone Knowledge module for MVP**; keep source ownership explicit | [Supporting-domain decision](./supporting-domain-decisions.md) and [record rules](./record-rules.md) |
| **Progress** | Today status/KPIs, Focus analytics, derived summaries | **Derived** | `src/components/today/`, `src/components/focus/`, `src/lib/focus-analytics.ts`, dashboard types | **No standalone Progress destination for MVP**; define evidence and metrics first | Success Model and Measurement Specification; feature dossier only if a distinct capability is admitted |
| **AI Coach** | `/ai-coach` placeholder route | **Placeholder / Deferred** | `src/app/(main)/ai-coach/`, placeholder middleware, `02-systems/intelligence-and-trust.md` | **Not MVP**; no assistive expansion before trust, authority, and evidence gates | Intelligence/trust decision record and feature brief only after re-admission |

## 4. What was missing from the previous tree

The earlier tree listed feature-document *standards* but not feature-domain *coverage*. That made it impossible to tell whether `Today.md`, `Tasks.md`, or `AI Coach.md` was missing, intentionally deferred, or simply represented by an existing legacy document.

The distinction is now explicit:

1. `04-features/feature-briefs.md`, `behavior-contracts.md`, `delivery-designs.md`, and `validation-plans.md` define what each kind of feature document must do.
2. This catalog defines which product domains require those documents and records their current status.
3. Individual dossiers are created only when a domain is admitted for refinement or delivery. A dossier is not created merely because a route exists.
4. `05-design/design-implementation-map.md` performs the equivalent reconciliation for design references and code.

## 5. Feature documentation approach

**Standards kept, coordination removed (Aug 2026).**

**See:** `docs/04-features/README.md` for complete guidance.

### When to Use Feature Dossiers

**Major features** (Today, Tasks, Focus, Schedule, Notes):
- Full dossier with brief, behavior contract, design spec, delivery design, validation plan
- These ARE FlowOS — depth is essential
- 6-14 hours upfront thinking prevents rebuilding from scratch
- **Current:** You write all docs through the six hats; record consequential Founder decisions at the three mode checkpoints

**Medium features** (4-16 hours):
- Brief (1 page) if helpful
- Code + tests
- Update FEATURE_INVENTORY

**Small features** (< 4 hours):
- Decision log only
- Code + tests

### Feature Dossier Structure

```
04-features/<feature-name>/
  ├── feature-brief.md           # Why, scope, approach
  ├── behavior-contract.md       # States, actions, edge cases
  ├── design-spec.md             # UI, interactions, accessibility
  ├── delivery-design.md         # Architecture, data model
  └── validation-plan.md         # Test cases, verification
```

**Key insight:** Problem wasn't "too much documentation." Problem was "too much coordination overhead."

**Standards:**
- `feature-briefs.md` — Standard for briefs
- `behavior-contracts.md` — Standard for contracts
- `feature-design-specifications.md` — Standard for design
- `delivery-designs.md` — Standard for technical
- `validation-plans.md` — Standard for validation
- `feature-dossier-standard.md` — Complete lifecycle

```text
04-features/
├── feature-catalog.md                 # this status and coverage map
└── dossiers/                          # created only when a domain is admitted
    ├── today/                          # MVP first-entry and reorientation
    ├── tasks/                          # MVP commitments and actions
    ├── focus/                          # MVP deliberate-attention mode
    ├── reflection/                     # MVP sensemaking and adaptation
    ├── habits/                         # conditional supporting path
    ├── schedule/                       # conditional planning context
    ├── notes-knowledge/                # conditional user-owned context
    ├── growth-areas/                   # embedded addendum unless re-admitted
    ├── goals/                          # deferred; no dossier until re-admitted
    ├── progress/                       # measurement-owned; no dossier by default
    └── ai-coach/                        # deferred; trust decision required first
```

This is a future implementation tree, not permission to create empty files. The [Documentation Refinement Plan](../11-archive/strategy/documentation-refinement-plan.md) specifies the order and minimum package for each domain.

## 6. Relationship to legacy references

`docs/04-features/FEATURE_INVENTORY.md` remains useful as a detailed implementation snapshot, but it is not the authority for future sequencing. Its shipped/deferred observations are imported here and must be reconciled during Phase 1 of the [MVP Implementation Masterplan](../current-phase/mvp-implementation-masterplan.md).

The old SRS feature IDs, placeholder pages, and route names are evidence about prior intent. They do not override the current Vision, Product Model, systems, or this catalog's explicit disposition.

## 7. Change control

Update this catalog when a feature is shipped, materially changed, embedded, derived, deferred, retired, or re-admitted. A status change must link to the relevant feature brief, decision record, review, or evidence record. Changing a product concept or system boundary requires changing the owning parent document instead.
