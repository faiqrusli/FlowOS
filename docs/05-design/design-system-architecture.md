# Design System Architecture

**Status:** Active
**Authority:** Canonical architecture for FlowOS design-system responsibilities, design-document ownership, and the relationship between product semantics, design standards, feature specifications, and implemented UI
**Owner:** Design leadership
**Parent:** [Vision.md](../strategy/Vision.md) · [Documentation Architecture](../00-constitution/documentation-architecture.md) · [Experience Architecture](../03-experience/experience-architecture.md) · [Information Structure](../03-experience/information-structure.md) · [Behavior Contracts](../04-features/behavior-contracts.md)
**Children:** Visual foundation, workspace architecture, interaction and content standards, accessibility standards, component standards, feature design specifications, design reviews, and design implementation references
**Last reviewed:** 2026-08-01
**Review trigger:** A proposed change alters the responsibility boundary, authority order, reusable design layer, semantic-expression rule, or relationship between design documentation and implemented UI.

---

## 1. Scope

This document defines how FlowOS design knowledge is organized so that product meaning, visual language, interaction behavior, content, accessibility, components, feature-specific design, and implemented UI each have one clear authority.

It answers:

> How does FlowOS express product and experience semantics consistently in design without allowing visual conventions, component convenience, or code implementation to redefine what the product means?

It does not define the current palette, typography, spacing, layout, components, interaction recipes, content copy, accessibility techniques, or feature screens. Those responsibilities belong to the design documents and implementation artifacts this architecture governs.

---

## 2. Design-System Responsibility

The FlowOS design system has six responsibilities:

1. translate product and experience semantics into legible visual, interactive, content, and accessibility expression;
2. provide reusable foundations and patterns that preserve consistency without flattening meaningful differences in state, authority, provenance, uncertainty, or recovery;
3. give feature teams a clear path from behavior contract to feature-specific design without redefining product behavior locally;
4. make the relationship between design authority and implemented UI explicit, inspectable, and correctable;
5. prevent duplication among visual foundations, layout rules, interaction standards, component guidance, and feature specifications; and
6. ensure that design serves understanding, calm attention, and genuine person control rather than decorative novelty, coercive engagement, or opaque automation.

The design system expresses product meaning. It does not own the meaning of a direction, commitment, action, evidence, interpretation, adaptation, source relationship, recommendation, automation, or product outcome. Those belong to their parent product, system, and experience documents.

---

## 3. Design Authority Model

Design authority flows from product meaning to reusable expression and then to feature-specific application and implementation.

```text
Vision
  ↓
Product Model and System Documents
  ↓
Experience Architecture and Information Structure
  ↓
Feature Brief and Behavior Contract
  ↓
Design System Architecture
  ↓
Reusable design standards
  ↓
Feature design specification
  ↓
Implemented UI and design review
```

The sequence establishes responsibility, not a one-way workflow. A design review or implemented UI can reveal a parent-document gap, but it cannot silently change a product concept, system rule, feature behavior, or experience architecture.

### Subject authority

Each design layer is authoritative only within its assigned responsibility:

| Layer | Owns | Must not own |
|---|---|---|
| Product and experience documents | Meaning, state, authority, information availability, and required cross-surface legibility. | Visual treatment, component APIs, or CSS implementation. |
| Design System Architecture | Design-document ownership, authority boundaries, and the design-layer dependency model. | Actual tokens, layouts, components, or feature screens. |
| Visual foundation | Reusable visual language, semantic token roles, type, spacing, and elevation foundations. | Product state meaning, page architecture, or feature-specific behavior. |
| Workspace architecture | Reusable spatial hierarchy, shell, region, density, and placement rules. | Global product navigation meaning or a feature’s behavior contract. |
| Interaction and content standards | Reusable feedback, motion, control, state-expression, and content rules. | Feature-specific journey logic or implementation. |
| Accessibility standards | Reusable requirements for perceivability, operability, understanding, timing, and recovery. | A feature’s detailed layout or technical test implementation. |
| Component standards | Reusable component responsibilities, variants, states, and composition rules. | Product semantics that have not been authorized by a behavior contract. |
| Feature design specification | The feature-specific expression of an approved behavior contract. | A new reusable design rule, a product rule, or technical delivery plan. |
| Implemented UI | The actual current rendering and interaction behavior. | The normative product or design specification by itself. |

---

## 4. Design Document Families

### 4.1 Visual foundation

The visual-foundation document owns reusable visual foundations: semantic color and elevation roles, typography, spacing, shape, hierarchy, and other design tokens that make the product coherent across surfaces.

It must state what each foundation communicates and its permitted use. It must not use token names or decorative emphasis to change product state meaning or imply authority that the behavior contract does not grant.

**Current implementation family:** [DESIGN_SYSTEM_V3.md](../foundation/DESIGN_SYSTEM_V3.md) is the active visual-foundation reference for the Surface 0–10 hierarchy and core visual language. [DESIGN_SYSTEM_TOKYO_NIGHT_WARM.md](../foundation/DESIGN_SYSTEM_TOKYO_NIGHT_WARM.md) is the active palette implementation reference within that family.

### 4.2 Workspace architecture

The workspace-architecture document owns reusable spatial composition: application shell, region hierarchy, canvas relationships, density, elevation placement, and the structural relationship between persistent and contextual UI.

It applies Information Structure without redefining it. It does not decide which destinations exist, what their labels mean, or which product system owns a displayed object.

**Current implementation reference:** [DESIGN_SYSTEM_V3_WORKSPACE.md](../foundation/DESIGN_SYSTEM_V3_WORKSPACE.md).

### 4.3 Interaction and content standards

Interaction and content standards own reusable expression of state and action: controls, feedback, focus, selection, motion, empty states, error language, confirmation, undo, progressive disclosure, and wording rules where these recur across features.

They must make state, uncertainty, authority, provenance, and recovery understandable. They must not use a repeated interaction pattern to create a hidden product workflow or change a system’s semantic rules.

**Current implementation reference for interaction, type, and motion:** [DESIGN_SYSTEM_V3_INTERACTION.md](../foundation/DESIGN_SYSTEM_V3_INTERACTION.md).

### 4.4 Accessibility standards

Accessibility standards own reusable design requirements for people to perceive, operate, understand, and recover from the product across supported access needs. They specify design obligations and patterns; technical conformance methods belong in engineering and validation documents.

Accessibility is not a polish pass. When a product state, authority choice, error, source limitation, or assistive result cannot be understood or controlled through supported interaction, the feature behavior is incomplete.

### 4.5 Component standards

Component standards own reusable component responsibility, semantic variants, allowed states, composition rules, and migration treatment. A component is a reusable design and implementation expression; it must not become an unexamined shortcut for product behavior.

### 4.6 Feature design specifications

A feature design specification owns the feature-specific visual, interactive, and content expression of one active behavior contract and, when applicable, its journey contract. It links to reusable standards and states any justified exception.

It does not redefine behavior, add a product object, invent a new authority state, or determine the technical approach. A reusable pattern discovered through a feature specification must be promoted to the appropriate design-standard document before it is treated as a product-wide convention.

---

## 5. Semantics Must Survive Expression

Design may simplify information for focus, but it must not simplify away a distinction that a person needs for a grounded choice or correction.

### Required semantic distinctions

Where material, design must distinguish:

- chosen direction, current commitment, plan, actual action, evidence, outcome, reflection, insight, and adaptation;
- current, historical, superseded, proposed, accepted, applied, deferred, declined, corrected, unavailable, and disconnected states;
- person-authored, native, source-provided, derived, inferred, recommended, and automated information;
- an available suggestion from an applied change;
- a request, pending operation, partial result, completed result, and failed result; and
- ordinary contextual information from a consequential choice requiring explicit authority.

The Product Model and system documents determine what these distinctions mean. Design determines how they become legible in the context of use.

### Calm is not concealment

FlowOS should preserve focus and visual calm. Calmness must not hide material uncertainty, pending work, source limitation, unavailable context, a consequential automation, or a path to correction.

### Prominence is not authority

Visual priority can guide attention. It must not make a recommendation appear mandatory, make a system-generated result appear person-authored, or pressure a person toward a choice that remains voluntary.

### Reuse must preserve meaning

The same design token, component, pattern, or phrase can be reused only when its user-visible meaning is consistent. When two contexts have materially different authority, consequence, or recovery, the design system must express that difference rather than force superficial uniformity.

---

## 6. Design and Implemented UI

### Normative design versus actual implementation

Design documents state the current intended contract within their ownership. Implemented UI shows the product’s actual current behavior. Neither silently overrides the other.

If code diverges from an active design or behavior contract, the divergence is a defect, an intentional approved change, or evidence that the higher-level document is incomplete. The owner must record and resolve the discrepancy through the relevant document and decision process.

### Implementation references

The active UI implementation reference is [`src/app/globals.css`](../../src/app/globals.css) for shared visual tokens and global UI behavior, with relevant component and route code as the source of actual feature implementation. Code is evidence of what exists; it is not a substitute for an approved product, experience, or design contract.

### Design tokens and components

Reusable code must carry the semantic role and state defined by the applicable design standard. A token or component change that affects several features requires an impact review across the relevant feature design specifications, behavior contracts, accessibility obligations, and active implementation.

### Exceptions

A feature may depart from a reusable standard only when its behavior, accessibility, context, or technical constraint requires it. The feature design specification must name the exception, its rationale, scope, and review trigger. An exception does not become a new shared rule through repetition.

---

## 7. Feature Design Flow

Feature design work follows this dependency sequence:

1. **Feature brief:** establishes whether the capability should exist and its boundary.
2. **Behavior contract:** establishes observable behavior, authority, state, recovery, and acceptance behavior.
3. **Journey contract when required:** establishes cross-destination and cross-system experience context.
4. **Feature design specification:** applies reusable design standards to make the approved behavior understandable and controllable.
5. **Delivery design:** identifies the technical approach that can preserve the design and behavior constraints.
6. **Validation plan:** determines how behavior, comprehension, accessibility, trust, reliability, and outcome will be assessed.
7. **Design review:** assesses implementation against the approved contracts and design specification.

This is an authority sequence, not a waterfall rule. Discovery may expose a design question early, but delivery may not treat an exploratory mockup as a replacement for the behavior contract it eventually must express.

---

## 8. Design Review and Change Handling

### Review against a contract

A design review assesses an existing feature design specification, behavior contract, design standard, or implemented UI against its stated contract. It records findings, evidence, disposition, and follow-up; it does not silently edit the artifact it reviews.

### Changes to reusable standards

A change to visual foundation, workspace architecture, interaction, content, accessibility, or component standards requires:

1. a decision record for a consequential reusable change;
2. an impact assessment for affected feature specifications, behavior contracts, code, accessibility, validation, and active delivery work;
3. a migration or compatibility approach where implementation is already live; and
4. a review of whether the change changes user-visible state meaning, authority, or recovery.

### Changes to feature design

A feature-specific design change must review the feature behavior contract, journey contract when applicable, delivery design, and validation plan. If the design need changes what a person can understand, choose, or recover from, it is not merely visual and must trigger a behavior-contract review.

---

## 9. Boundaries With Other Documents

| Document family | Design System Architecture owns | That family owns |
|---|---|---|
| Product Model and system documents | The design-layer rules for expressing their semantics. | Product concepts, state, ownership, invariants, and authority. |
| Experience Architecture and Information Structure | How design documentation applies those constraints. | What context must be available and where primary destinations and objects are accessed. |
| Feature brief | The design-system path a feature must follow. | Feature rationale, scope, desired outcome, and decision to proceed. |
| Behavior contract | The required translation from behavior to design expression. | Observable behavior, permissions, state, recovery, and acceptance behavior. |
| Journey contract | Design requirements across a journey’s transitions. | The bounded end-to-end journey and its entry and exit conditions. |
| Delivery design | Design constraints that technical delivery must preserve. | Technical approach, data, integrations, rollout, and operations. |
| Engineering architecture | Normative design and implementation relationships. | Component implementation, token storage, client architecture, performance, and quality tooling. |
| Review records | The design contract to assess. | Findings, evidence, disposition, and lessons. |

---

## 10. Implications for Child Documents

Visual-foundation, workspace, interaction, content, accessibility, and component standards must each own one reusable responsibility and link to adjacent standards instead of reproducing them.

Feature design specifications must identify their authorizing behavior contract, involved experience domains, states and authority choices to express, reusable standards applied, exceptions, responsive and accessible considerations, handoff to delivery design, and review trigger.

Design reviews must identify the artifact assessed, its governing contract, observed evidence, deviations, severity, disposition, and linked corrections. They must not replace the design specification they evaluate.

Engineering and implementation documents must preserve semantic roles, design states, accessible behavior, and approved exceptions. They must not reduce a design contract to styling alone when it carries user authority or recovery meaning.

---

## 11. Non-Goals

This document does not:

- define the current FlowOS visual style, palette, tokens, typography, spacing, workspace layout, motion, component inventory, or feature screens;
- redefine product semantics, feature behavior, information architecture, source ownership, assistance policy, or system authority;
- prescribe a particular CSS framework, component library, file structure, testing tool, or rendering implementation;
- make visual consistency a reason to hide uncertainty, reduce control, erase provenance, or flatten material state distinctions;
- replace individual feature design specifications, accessibility standards, design reviews, engineering architecture, or validation plans; or
- turn design review into a substitute for a product, behavior, security, privacy, or release decision.

---

## 12. Change Control

This document changes only when FlowOS changes the enduring architecture of its design documentation, the responsibility of a reusable design layer, the authority order among design artifacts, or the relationship between normative design and implemented UI.

A change requires:

1. a decision record explaining the architecture-level need;
2. impact assessment for parent product, system, and experience documents; active design standards; feature design specifications; behavior contracts; delivery designs; implementation; accessibility; validation; and reviews;
3. evidence that the change preserves semantic legibility, person authority, recovery, accessibility, and single responsibility; and
4. confirmation of consistency with the Vision, Documentation Architecture, Product Model, applicable system documents, Experience Architecture, and Behavior Contracts.

A palette preference, one component request, a one-page redesign, or an implementation shortcut does not by itself justify changing this architecture.
