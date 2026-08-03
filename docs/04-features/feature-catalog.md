# Feature Catalog and Documentation Coverage

**Status:** Active implementation reference
**Authority:** Canonical inventory of FlowOS feature domains, their current implementation state, and the next documentation artifact required for each
**Owner:** Product Architect
**Approval Required:** Founder
**Parent:** [Information Structure](../03-experience/information-structure.md) · [Feature Briefs](./feature-briefs.md) · [Behavior Contracts](./behavior-contracts.md) · [MVP Implementation Masterplan](../07-strategy-and-delivery/mvp-implementation-masterplan.md)
**Children:** Individual feature briefs, behavior contracts, feature design specifications, delivery designs, validation plans, and feature reviews
**Last Updated:** 2026-08-03
**Review trigger:** A route, product role, implementation status, feature disposition, or required feature-document set changes.

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
| **Today** | `/` | **Shipped** | `src/app/(main)/page.tsx`, `src/components/today/`, Workplace and dashboard composition | **Core MVP entry and reorientation surface** | Feature brief, behavior contract, journey contract, design spec, validation plan |
| **Tasks** | `/tasks` plus Today/Workplace task surfaces | **Shipped** | `src/app/(main)/tasks/`, `src/components/tasks/`, `src/lib/tasks.ts` | **Core MVP commitment and action surface** | Feature brief, behavior contract, delivery design, design spec, validation plan |
| **Habits** | `/habits` plus Today/Workplace cards | **Shipped** | `src/app/(main)/habits/`, `src/components/habits/`, `src/lib/habits.ts` | **Supporting MVP path; keep only where it strengthens the loop** | Feature brief and behavior contract; then design/validation if retained |
| **Schedule** | `/schedule`, task schedule controls, timeline | **Shipped** | `src/app/(main)/schedule/`, `src/components/schedule/`, `src/lib/schedule*.ts` | **Supporting planning context; simplify overlapping scheduling surfaces before expansion** | Feature brief, journey/behavior contract, design reconciliation |
| **Focus** | `/focus` and embedded focus mode in Today/Workplace | **Shipped** | `src/app/(main)/focus/`, `src/components/focus/`, `src/lib/focus*.ts` | **Core action mode; page remains history/analytics until evidence supports more** | Feature brief, behavior contract, design spec, validation plan |
| **Reflection** | `/reflection`, sidebar, session-end capture | **Partial** | `src/app/(main)/reflection/`, `src/components/reflection/`, `src/lib/reflection*.ts` | **Core sensemaking and adaptation path**; unify save semantics first | Feature brief, behavior contract, journey contract, validation plan |
| **Growth Areas** | Notes sub-capability; no primary route | **Embedded** | `src/components/notes/growth-area-*`, `src/lib/growth-areas.ts`, `growth_goals` data type | **Keep embedded in Notes until a distinct person need and outcome are evidenced** | Notes behavior addendum; separate feature brief only if admitted |
| **Goals** | `/goals` | **Placeholder / Deferred** | `src/app/(main)/goals/`, `src/lib/module-roadmap-content.ts`, placeholder middleware | **Not MVP**; re-admit only through evidence and a direction-system decision | No build dossier yet; preserve the deferral decision |
| **Knowledge** | Notes and linked context; no `/knowledge` route | **Derived / Embedded** | `src/app/(main)/notes/`, `src/components/notes/`, product glossary definition of knowledge | **No standalone Knowledge module for MVP**; keep source ownership explicit | Notes feature brief/behavior contract plus continuity and interoperability review |
| **Progress** | Today status/KPIs, Focus analytics, derived summaries | **Derived** | `src/components/today/`, `src/components/focus/`, `src/lib/focus-analytics.ts`, dashboard types | **No standalone Progress destination for MVP**; define evidence and metrics first | Success Model and Measurement Specification; feature dossier only if a distinct capability is admitted |
| **AI Coach** | `/ai-coach` placeholder route | **Placeholder / Deferred** | `src/app/(main)/ai-coach/`, placeholder middleware, `02-systems/intelligence-and-trust.md` | **Not MVP**; no assistive expansion before trust, authority, and evidence gates | Intelligence/trust decision record and feature brief only after re-admission |

## 4. What was missing from the previous tree

The earlier tree listed feature-document *standards* but not feature-domain *coverage*. That made it impossible to tell whether `Today.md`, `Tasks.md`, or `AI Coach.md` was missing, intentionally deferred, or simply represented by an existing legacy document.

The distinction is now explicit:

1. `04-features/feature-briefs.md`, `behavior-contracts.md`, `delivery-designs.md`, and `validation-plans.md` define what each kind of feature document must do.
2. This catalog defines which product domains require those documents and records their current status.
3. Individual dossiers are created only when a domain is admitted for refinement or delivery. A dossier is not created merely because a route exists.
4. `05-design/design-implementation-map.md` performs the equivalent reconciliation for design references and code.

## 5. Target dossier shape

When a domain enters the refinement queue, create a bounded dossier under `docs/04-features/dossiers/<feature-slug>/`:

```text
feature-brief.md       # why this bounded capability exists and its limits
behavior-contract.md   # observable states, actions, permissions, and recovery
design-specification.md# feature-specific visual, interaction, content, and a11y expression
delivery-design.md     # technical approach, data, migration, rollout, and recovery
validation-plan.md     # checks and evidence required before release
```

Not every domain needs every child immediately. The masterplan and refinement plan admit the minimum set required by risk. A derived or embedded concept may instead receive an addendum to its owning feature document.

The planned coverage map is therefore:

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

This is a future implementation tree, not permission to create empty files. The [Documentation Refinement Plan](../07-strategy-and-delivery/documentation-refinement-plan.md) specifies the order and minimum package for each domain.

## 6. Relationship to legacy references

`docs/foundation/FEATURE_INVENTORY.md` remains useful as a detailed implementation snapshot, but it is not the authority for future sequencing. Its shipped/deferred observations are imported here and must be reconciled during Phase 1 of the [MVP Implementation Masterplan](../07-strategy-and-delivery/mvp-implementation-masterplan.md).

The old SRS feature IDs, placeholder pages, and route names are evidence about prior intent. They do not override the current Vision, Product Model, systems, or this catalog's explicit disposition.

## 7. Change control

Update this catalog when a feature is shipped, materially changed, embedded, derived, deferred, retired, or re-admitted. A status change must link to the relevant feature brief, decision record, review, or evidence record. Changing a product concept or system boundary requires changing the owning parent document instead.
