# Information Structure

**Status:** Active
**Authority:** Canonical current organization of FlowOS experience domains, primary destinations, labels, and access relationships
**Owner:** Product and design leadership
**Parent:** [Experience Architecture](./experience-architecture.md) · [Product Model](../01-product/product-model.md) · [Product Glossary](../01-product/product-glossary.md) · [System Documents](../02-systems/)
**Children:** Journey contracts, feature briefs, behavior contracts, navigation specifications, content standards, interaction specifications, accessibility standards
**Last reviewed:** 2026-08-01
**Review trigger:** A proposed change adds, removes, renames, groups, promotes, demotes, or materially repurposes a primary destination, route, global access mechanism, or cross-surface object path.

---

## 1. Scope

This document defines the current information structure of FlowOS: the enduring experience domains people can enter, their current primary destinations and interface labels, and the rules by which information and product objects are accessed across them.

It answers:

> Where does a person go to orient, make or carry out a choice, understand what occurred, learn from experience, and access supporting context in FlowOS today?

It does not define product concepts, system semantics, visual layout, component behavior, detailed journey flows, implementation routes, feature delivery status, or future roadmap commitments. Those responsibilities belong to the Product Model, system documents, design and feature documents, engineering architecture, Feature Inventory, and strategy-and-delivery documents.

---

## 2. Information-Structure Responsibility

The Information Structure has five responsibilities:

1. name and organize the primary places through which a person enters and moves through FlowOS;
2. assign each primary destination one clear experiential role rather than treating destinations as undifferentiated containers of features;
3. define how a person reaches the owning context for a product object, status, decision, record, source, or assistive result;
4. protect the distinction between primary product domains, secondary utilities, and future possibilities; and
5. ensure that changes to labels, grouping, or access paths preserve the Experience Architecture and the system boundaries it inherits.

The structure is the current application of Experience Architecture. It can evolve as evidence changes. It does not create a new product system, turn an interface label into a canonical product concept, or decide the behavior of the destinations it organizes.

---

## 3. Current Structural Model

FlowOS currently uses a two-level primary structure:

```text
Home
  Today

Workspace
  Tasks · Habits · Schedule · Focus · Notes · Reflection
```

**Home** gives a person a default place to regain orientation and choose an immediate next step.

**Workspace** gives a person direct, global access to the distinct working contexts that support deliberate action, planning, focus, context, and learning. Workspace destinations are peers. Their order may guide discovery, but it does not establish a mandatory sequence or a hierarchy of personal value.

The current primary labels are product interface labels. Their meaning in a given feature must remain consistent with the Product Glossary and relevant system documents; an interface label must not silently redefine a canonical product term.

---

## 4. Primary Destinations

| Group | Destination | Current interface label | Primary experiential role | May make available | Must not imply or own |
|---|---|---|---|---|---|
| Home | Today | **Today** | Reorient to relevant current context and choose or resume a deliberate next step. | Current commitments, action context, timely evidence, useful reminders, and bounded assistance. | A complete account of a person’s life, automatic priority, or a required daily ritual. |
| Workspace | Commitments | **Tasks** | Create, find, organize, and revisit the commitments a person is actively managing. | Commitment context, plans, status, and links to relevant action or evidence. | That every displayed item has been acted on, completed, or proven valuable. |
| Workspace | Repeated practice | **Habits** | Support recurring deliberate actions and their relevant record over time. | Recurring commitment and action/evidence context. | That repetition is universally desirable, that an absence proves failure, or that a habit record is a person’s identity. |
| Workspace | Time context | **Schedule** | Understand and work with time-based plans, constraints, and choices. | Planned commitments, time context, and links to current action when relevant. | That a scheduled item occurred, that a plan is a commitment, or that time allocation establishes worth. |
| Workspace | Attentional action | **Focus** | Support a person while they deliberately direct attention to an active action. | Current action context, focus controls, and associated history when useful. | That focused time proves meaningful action, outcome, or progress. |
| Workspace | Personal context | **Notes** | Create and retrieve knowledge or personal context that can inform later choices and sensemaking. | User-provided knowledge, references, and links to relevant product context. | That a note is factual evidence, a commitment, reflection, or an automated conclusion by default. |
| Workspace | Learning | **Reflection** | Support voluntary reflection, insight, and consideration of adaptation. | Evidence context, reflection, insight, and adaptation choices. | That reflection is required, that an interpretation is factual, or that a proposal is already applied. |

The mapping describes experiential responsibility. A feature-specific behavior contract determines which system objects a destination can create, display, change, or relate, and under what authority.

---

## 5. Access and Ownership Rules

### Primary destinations provide a purposeful entry

Every primary destination must answer a distinct recurring need. It must not exist solely because a technical data type, historical feature, or competing shortcut needs a place to live.

### The owning context remains reachable

When a destination displays a condensed object, state, source relationship, assistive result, or historical record, it must provide a clear path to the owning context whenever a person needs to understand, act on, correct, or inspect it more deeply.

For example, Today may surface a commitment or evidence signal, but it does not become a separate owner of that commitment or record. A displayed summary must preserve enough identity and state for a person to reach the place that owns the consequential action.

### Cross-domain access does not erase meaning

A person may encounter a commitment through Schedule, an action through Focus, evidence through Reflection, or contextual knowledge through Today. The information structure must preserve what the object is and which system owns its current state, even when the access path changes.

### Direct access and contextual access are complementary

Global navigation offers intentional entry into a primary domain. Contextual links, related-object access, notifications, and shortcuts can provide timely entry into a specific object or decision. These mechanisms must converge on the same semantic destination rather than creating competing versions of the product model.

### Deep entry preserves orientation

When a person arrives through a link, notification, search result, shortcut, or returning session, the destination must make the object’s status, relevant context, and available next choice understandable without requiring them to first visit Home.

---

## 6. Navigation and Discovery Rules

### Home is a stable default, not a gate

Today is the primary Home destination because it helps a person orient to current context. It must not prevent direct entry into a Workspace destination, force a review before work, or become the only legitimate path to action.

### Workspace destinations are global peers

Tasks, Habits, Schedule, Focus, Notes, and Reflection remain directly reachable from the primary workspace structure. A contextual shortcut may improve speed, but it must not make an otherwise primary domain undiscoverable or hide it behind an unrelated workflow.

### Labels favor durable user purpose

A primary label should describe the recurring user purpose of the destination in ordinary language. Labels must not be renamed merely to mirror internal data entities, a temporary campaign, or an implementation detail.

### Search and command access are accelerators

Search, command access, keyboard shortcuts, notifications, and other global accelerators may shorten the path to a destination or object. They do not create a second information structure or replace the responsibility of the primary destinations to remain understandable and reachable.

### Secondary utilities remain secondary

Account, settings, authentication, support, and similar operational contexts are necessary service destinations. They must be reachable when relevant, but they do not compete with Home or Workspace as primary product domains unless their purpose changes materially.

---

## 7. Contextual States Across Destinations

The same context can appear in more than one destination. The following rules govern what a person must be able to understand wherever it appears.

| Context | Information-structure requirement |
|---|---|
| Direction or commitment | Show current state and a path to the owning choice context before a person makes a consequential change. |
| Action, evidence, or outcome | Preserve the distinction among plan, actual occurrence, factual record, and interpretation; make provenance and reliability reachable when material. |
| Reflection, insight, or adaptation | Make clear whether context is person-authored interpretation, a proposal, or an applied choice; keep reflection voluntary. |
| Source-provided context | Identify the source relationship, availability, and scope when they affect judgment or control; provide a path to connection or source details where appropriate. |
| Computational assistance | Make the assistance type, basis, uncertainty, and controls clear; do not present it as a person-authored or already accepted result. |
| Historical or unavailable context | Identify its historical, superseded, unavailable, or disconnected role without making it appear current. |

This table specifies availability and legibility. The Product Model and system documents remain authoritative on each context’s meaning, state, and change rules.

---

## 8. Admission and Change Rules for Primary Destinations

A new primary destination, renamed destination, or material regrouping requires evidence that it represents a durable user need that cannot be served coherently by an existing destination or contextual access path.

Before promoting a destination, the proposal must establish:

1. the recurring person need it serves;
2. the experience domain and system documents it applies;
3. why an existing destination, object view, or accelerator is insufficient;
4. the owning context for any consequential objects or actions it exposes;
5. how it preserves direct access, deep-entry orientation, and cross-surface consistency; and
6. the evidence and success signals that justify its prominence.

Potential future capabilities such as Goals, Projects, Analytics, AI, or other specialized contexts are not primary destinations until they meet this gate. A hidden route, experiment, placeholder, or planned feature does not establish a durable information-architecture category.

---

## 9. Boundaries With Other Documents

| Document family | Information Structure owns | That family owns |
|---|---|---|
| Experience Architecture | The current primary destinations, grouping, labels, and access relationships that apply the architecture. | Cross-surface experience responsibilities, availability rules, and enduring transition requirements. |
| Product Model and system documents | Where system context is reached and made legible. | What the context is, who owns it, and how its state can change. |
| Feature Inventory | The information-architecture role of a current destination. | Whether a feature or capability is shipped, partial, placeholder, deferred, or retired. |
| Journey contracts | The entry and owning destinations available to a journey. | The bounded journey’s sequence, branches, behavior, and acceptance conditions. |
| Feature contracts | The structural constraints a feature must follow. | The feature’s problem, scope, behavior, and delivery evidence. |
| Design documents | Information hierarchy and access expectations. | Layout, visual hierarchy, components, interactions, content, and accessibility execution. |
| Engineering documents | Required destinations and semantic access paths. | Route implementation, state management, data loading, performance, and operational behavior. |
| Strategy and delivery | Current organization of active product domains. | Whether and when a capability is prioritized for delivery. |

---

## 10. Implications for Lower-Level Documents

Journey contracts must identify their entry destination, any contextual entry paths, the owning context for each consequential object, and how a person regains orientation after interruption or deep linking.

Feature briefs must explain whether the capability belongs within an existing primary destination, introduces a contextual access path, or meets the gate for a new primary destination. They must not add a route or navigation item merely to make a feature visible.

Navigation and interaction specifications must define the exact labels, route behaviors, responsive treatment, keyboard access, active state, and accessibility behavior that implement this structure. They must not contradict an established destination’s experiential role.

Feature Inventory must link here for current information structure and retain only delivery status, code references, known implementation gaps, and feature-level scope.

---

## 11. Non-Goals

This document does not:

- define a user journey, workflow sequence, page layout, component, responsive pattern, shortcut, or notification behavior;
- define the underlying meaning or state transitions of product objects;
- determine whether an existing feature is shipped, successful, prioritized, or ready to release;
- create a requirement that every person visit Today, plan with Schedule, focus, reflect, or use every Workspace destination;
- make a visible route or internal data entity a new primary product domain by default; or
- commit FlowOS to future destinations, integrations, or navigation mechanisms.

---

## 12. Change Control

This document changes only when the current primary structure, a destination’s experiential responsibility, its durable label, its access relationship, or the admission rule for primary destinations changes.

A change requires:

1. a decision record explaining the structural need;
2. impact assessment for Experience Architecture, affected system documents, active journey and feature contracts, Feature Inventory, navigation and accessibility specifications, engineering architecture, analytics and measurement definitions, and delivery work;
3. evidence that the change preserves orientation, object ownership, truthful state, direct access, deep-entry recovery, and person authority; and
4. confirmation of consistency with the Vision, Product Model, applicable system documents, and Experience Architecture.

A route refactor, visual refresh, temporary experiment, or isolated feature request does not by itself justify changing this document.
