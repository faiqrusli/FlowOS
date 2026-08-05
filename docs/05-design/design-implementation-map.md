# Design Implementation Map

**Status:** Active implementation reference
**Authority:** Canonical reconciliation of design-system documents, current UI implementation, and legacy design material
**Owner:** Design Architect
**Approval Required:** Founder
**Parent:** [Design System Architecture](./design-system-architecture.md) · [Experience Architecture](../03-experience/experience-architecture.md) · [Feature Design Specifications](./feature-design-specifications.md) · [MVP Implementation Masterplan](../current-phase/mvp-implementation-masterplan.md)
**Children:** Feature design specifications, component specifications, design reviews, and implementation migrations
**Last Updated:** 2026-08-04
**Review trigger:** A design reference, code authority, token family, component boundary, feature surface, or migration disposition changes.

---

## Document Ownership

### Owner
**Role:** Design Architect
**Responsibility:** Maintain the reconciliation of design-system documents, current UI implementation, and legacy design material so every visual decision has one clear source.

### Modification Process
1. Design Architect proposes changes (based on design evidence or implementation reconciliation)
2. Submit to Founder for approval
3. Founder reviews for alignment with Design System Architecture and the MVP Masterplan
4. If approved: Design Architect updates the document
5. Document change in decision record if consequential
6. Update the Last Updated date

### Authority Level
- Design Architect can: Maintain the map, reconcile design references with implementation, and record migration dispositions
- Requires approval for: Any change to authority order, source ownership, feature-surface coverage, or design-cleanup exit conditions

---

## 1. Why this map exists

FlowOS has a real visual implementation, but the knowledge about it is distributed across canonical design architecture, V3 reference files, palette notes, interaction guidance, CSS, component code, and historical audit material. The result is avoidable uncertainty:

- a contributor may not know which file owns a visual decision;
- a feature may look consistent while lacking a feature-specific design contract;
- a legacy reference may be mistaken for a live rule; and
- `globals.css` may silently become the design authority because it is the code that renders.

This map makes those relationships explicit. It is a discovery and migration reference. It does not replace the Design System Architecture, define new tokens, or prescribe a feature's behavior.

## 2. Authority order

```text
Vision and product/system meaning
  -> Experience Architecture and Information Structure
  -> Design System Architecture
  -> Reusable design standards
  -> Feature Design Specification
  -> Implemented UI
  -> Design review and evidence
```

Implemented UI is the current truth of what a person can see and do, but it is not automatically the normative design rule. When code and an active design contract disagree, record the gap, decide whether the contract or implementation is wrong, and do not let drift become an accidental redesign.

## 3. Current source map

| Design concern | Current source | Status | Owns | Does not own | Refinement action |
|---|---|---|---|---|---|
| Design-document boundaries | `design-system-architecture.md` | **Canonical active** | Responsibility, authority, and dependency model | Tokens, page layouts, feature behavior | Keep as parent; link all new design work to it |
| Visual foundation | `05-design/DESIGN_SYSTEM_V3.md` | **Active implementation reference** | Surface hierarchy, visual language, token intent, type/spacing guidance | Product meaning, feature behavior, CSS truth by itself | Reconcile with live tokens and promote stable rules into a future visual-foundation document |
| Palette | `05-design/DESIGN_SYSTEM_TOKYO_NIGHT_WARM.md` | **Active palette reference** | Tokyo Night Warm colors and semantic usage | Feature state semantics, component APIs, page architecture | Verify every semantic token against `src/app/globals.css`; retire duplicates |
| Workspace and shell | `11-archive/design/DESIGN_SYSTEM_V3_WORKSPACE.md` | **Historical evidence** | Prior regions, density, shell, and per-module surface maps | Current authority or navigation ownership | Promote only stable rules into active design standards; do not use the archive as a live contract |
| Interaction language | `11-archive/design/DESIGN_SYSTEM_V3_INTERACTION.md` | **Historical evidence** | Prior interaction, feedback, state, focus, and content cues | Feature-specific behavior contracts or current authority | Promote only stable rules into active interaction/content standards |
| CSS and token implementation | `src/app/globals.css`, `src/lib/theme/tokens.ts`, `src/lib/theme/surface-classes.ts` | **Current rendered authority** | What the shipped client actually paints | Normative product meaning or future design decisions | Add token/source references during each migration; remove dead aliases in cleanup |
| Feature-specific design | `docs/11-archive/review/design/`, `docs/11-archive/design/`, inline component conventions | **Historical / mixed** | Historical or local feature intent | Canonical future feature design authority | Use archived material only as evidence; admit current specs into `05-design` |
| Accessibility | `accessibility-standards.md` plus feature checks | **Canonical standard, incomplete coverage** | Reusable obligations and verification boundaries | Feature layout or test result | Add accessibility acceptance to each MVP feature dossier |
| Content | `content-standards.md` plus current copy | **Canonical standard, incomplete coverage** | Reusable language rules | Product glossary or feature behavior | Audit state, recovery, authority, and placeholder copy during feature refinement |
| Components | `src/components/ui/` and feature components | **Implementation reference, no complete register** | Current component composition | Product semantics not authorized by contracts | Create component specifications only for reused or risky components |
| Historical themes and audits | `11-archive/design/` | **Historical** | Prior decisions and lessons | Current visual authority | Do not edit for current work; link only when a migration needs context |

## 4. Feature-surface coverage

The design system is not complete when the palette is documented. Every MVP surface needs a feature-specific design specification that proves how the reusable system expresses the approved behavior.

| Surface | Current implementation | Design documentation state | Required next action |
|---|---|---|---|
| Today | `src/components/today/`, Workplace composition | [Canonical feature specification](./features/today-design-spec.md) complete; checkpointed 2026-08-05 | Keep implementation aligned with source ownership, state, handoff, and recovery contract |
| Tasks | `src/components/tasks/` | [Canonical feature specification](./features/tasks-design-spec.md) complete; checkpointed 2026-08-05 | Keep board/list, scheduling, drag, empty, error, and recovery implementation aligned with the contract |
| Habits | `src/components/habits/` | Local patterns are implemented; no canonical feature spec | Decide whether retained in MVP; then document recurring-action states |
| Schedule | `src/components/schedule/` and task scheduling controls | Multiple surfaces and legacy references | Reconcile one scheduling role before writing detailed design |
| Focus | `src/components/focus/` and embedded Today mode | [Canonical feature specification](./features/focus-design-spec.md) complete; checkpointed 2026-08-05 | Keep Focus mode/history aligned with session truth, attribution limits, and recovery contract |
| Reflection | `src/components/reflection/` and sidebar | [Canonical feature specification](./features/reflection-design-spec.md) complete; checkpointed 2026-08-05 | Keep sidebar/full-page entry on one Reflection save/recovery owner; weekly-review boundary remains outside Phase 2 |
| Notes / Knowledge | `src/components/notes/` | No canonical feature spec; growth areas are embedded | Define Notes ownership of personal context and source relationships |
| Placeholder modules | Goals, AI Coach, Weekly Review | No MVP design deliverable should be created | Keep placeholder treatment explicit; do not polish deferred capability into implied commitment |

## 5. Refinement rules

1. **Start with meaning.** A design change must link to the owning system, experience, feature, or behavior contract.
2. **Use one source per layer.** If a token, layout rule, or interaction pattern appears in two active files, choose an owner and turn the other into a reference or archive.
3. **Separate current truth from desired state.** A screenshot, CSS rule, and future spec must be labeled as current, transitional, or proposed.
4. **Document states, not only the happy path.** Loading, empty, error, permission, interruption, correction, undo, and assistive states are part of design.
5. **Do not make placeholders look shipped.** A polished shell for Goals or AI Coach must not imply MVP admission.
6. **Accessibility and content are part of the feature design.** They are not a final visual pass.
7. **Design reviews produce evidence.** A review may reveal a contract gap, but it cannot silently change product meaning.

## 6. Target design documentation tree

The target tree is intentionally smaller than the current collection of references:

```text
05-design/
├── design-system-architecture.md       # ownership and authority
├── visual-foundation.md                 # future promoted token/foundation authority
├── workspace-architecture.md            # future promoted shell and spatial authority
├── content-standards.md                 # reusable language rules
├── accessibility-standards.md           # reusable access and recovery obligations
├── feature-design-specifications.md     # standard for feature-specific specs
├── design-implementation-map.md         # this current-to-target reconciliation
├── components/                          # only reusable component contracts
└── reviews/                             # bounded design review records
```

The active `05-design/DESIGN_SYSTEM_V3.md` and `DESIGN_SYSTEM_TOKYO_NIGHT_WARM.md` files remain the visual references. Workspace and interaction documents are archived under `11-archive/design/`; do not recreate them as parallel active authorities. Promote a rule once, update this map, and mark the old source's role.

## 7. Exit condition for design cleanup

Design documentation is sufficiently refined for MVP implementation when:

- every admitted MVP feature has a linked feature design specification;
- every specification identifies its behavior contract and relevant journey;
- every reused token/component has one named source;
- the live CSS/token implementation has no unexplained active-vs-legacy conflict;
- accessibility, content, responsive, and recovery states are explicit; and
- a new contributor can determine whether a reference is canonical, implementation-current, transitional, or historical within one page.
