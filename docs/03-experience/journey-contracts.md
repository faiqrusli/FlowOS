# Journey Contracts

**Status:** Active
**Authority:** Canonical standard for creating, governing, and reviewing bounded end-to-end experience journey contracts
**Owner:** Product and design leadership
**Parent:** [Experience Architecture](./experience-architecture.md) · [Information Structure](./information-structure.md) · [Product Glossary](../01-product/product-glossary.md) · [Documentation Architecture](../00-constitution/documentation-architecture.md)
**Children:** Individual journey contracts in `03-experience/journeys/`, related feature briefs, behavior contracts, interaction specifications, validation plans, and journey reviews
**Last reviewed:** 2026-08-01
**Review trigger:** A proposed document changes the definition, scope, required contents, ownership boundary, lifecycle, or review standard of a bounded FlowOS experience journey.

---

## 1. Scope

This document defines what a FlowOS journey contract is, when one is required, and the single responsibility each individual journey contract must own.

It answers:

> How does FlowOS specify an end-to-end person experience across destinations, product systems, choices, and recovery states without duplicating system rules, feature behavior, design, or implementation?

It does not define any specific journey, product state, feature behavior, route, screen, interaction, visual treatment, implementation, roadmap priority, or validation result. Those responsibilities belong to individual journey contracts and the product, system, feature, design, engineering, strategy, evidence, and review documents they reference.

---

## 2. Journey-Contract Responsibility

A journey contract owns one bounded answer to this question:

> How does a person move from a defined entry context to a meaningful exit context while FlowOS preserves orientation, truthful state, and person authority?

An individual journey contract coordinates existing authoritative rules for one person need. It makes the end-to-end relationship among those rules testable without becoming the owner of the rules themselves.

Every journey contract must:

1. state the person’s bounded intent and the meaningful outcome the journey is meant to enable;
2. identify valid entry contexts, involved systems, and destinations;
3. identify consequential decisions, transitions, authority, uncertainty, and recovery points;
4. define what a person must be able to understand and do at each material step; and
5. state a clear exit context and the evidence by which the journey can be assessed.

A journey contract is neither a generic user-flow diagram nor a feature specification. It is the contract for one coherent end-to-end experience.

---

## 3. When a Journey Contract Is Required

A journey contract is required when a proposed capability or change:

- crosses two or more primary destinations or experience domains;
- hands a person or product object between two product systems;
- contains a consequential choice, recommendation, automation, connection, correction, export, or recovery path;
- changes how a person enters, resumes, abandons, or completes a meaningful product experience; or
- needs a shared end-to-end acceptance definition across product, design, engineering, and validation work.

A journey contract is not required for a local visual refinement, isolated component change, copy edit, technical refactor with no experience effect, or a bounded behavior that remains entirely within an existing feature contract and has no material transition or recovery implication.

When uncertain, create a short journey outline during feature discovery. Promote it to an active journey contract only when the journey has a distinct, durable responsibility that cannot be adequately covered by a feature behavior contract.

---

## 4. Contract Boundaries

### One person intent, one bounded outcome

Each journey contract starts with one person intent and one meaningful exit context. It may contain branches, but it must not attempt to document every possible use of a destination or an entire product area.

### Reference rather than repeat

A journey contract must link to the Product Model, relevant system documents, information structure, and feature behavior contracts. It must not redefine their concepts, states, ownership, invariants, or authority rules.

### Make the experience contract observable

The contract states what a person can find, understand, choose, do, defer, correct, or recover. It must not prescribe internal implementation, visual component structure, or a preferred technical sequence.

### Preserve alternative valid paths

A journey must distinguish a meaningful alternative or recovery path from a failure. Deferral, rejection, correction, interrupted use, unavailable information, and exit may all be valid outcomes when the relevant system permits them.

### Do not treat the journey as a funnel

The contract must not define success as forcing a person to the most engaged, most disclosed, most automated, or longest path. A person may enter directly, take a brief path, use only relevant context, or leave with their authority intact.

---

## 5. Required Contents of an Individual Journey Contract

Every individual journey contract must include the following sections, in this order unless a documented exception makes a different sequence clearer.

| Section | Must establish | Must not contain |
|---|---|---|
| **Identity and status** | Name, status, owner, parent documents, children, review trigger, and evidence links. | A copy of parent-document content. |
| **Person intent and outcome** | The bounded need, entry premise, and meaningful exit context. | Market positioning, broad product philosophy, or a feature backlog. |
| **Scope and non-goals** | What part of the experience the contract owns and explicitly excludes. | A restatement of every related feature or system. |
| **Entry contexts** | Valid primary and contextual entry paths, including deep links and returning use where relevant. | Assumptions that every person begins at Home or in a prescribed sequence. |
| **Participating authority** | Linked destinations, systems, feature contracts, and the object or state each owns. | Local redefinition of product concepts or system rules. |
| **Journey narrative** | The person’s meaningful progression from entry to exit, written in plain language. | Pixel-level screen instructions or implementation pseudocode. |
| **Decision and transition table** | Material choices, required context, authority, resulting system handoff, and valid alternatives. | Hidden or automatic state changes that lack an owning system. |
| **State, uncertainty, and provenance** | What must remain legible when status, source, evidence, or assistance materially affects judgment. | Unqualified claims that a plan, inference, or source update is reality. |
| **Recovery and interruption** | Pause, deferral, correction, unavailable information, partial completion, and re-entry behavior. | Punitive or engagement-driven coercion to continue. |
| **Exit contexts** | Valid completed, deferred, declined, paused, corrected, or transferred outcomes. | A single mandatory definition of completion. |
| **Acceptance evidence** | Observable criteria and the validation plan that will assess the journey. | Actual study results, review conclusions, or release decisions. |
| **Open questions and change control** | Unresolved decisions, dependencies, review triggers, and the path for revision. | Undocumented product or system decisions. |

### Required metadata

An individual journey contract must use the durable-document metadata defined by Documentation Architecture. It also includes:

```text
Journey intent: One sentence in the person’s language
Entry contexts: Named valid starting contexts
Exit contexts: Named valid end states
Participating systems: Linked system documents and interface contracts
Evidence links: Research, measurement, or prior review that justified the contract
```

The metadata identifies the contract; it does not replace the required sections.

---

## 6. Decision and Transition Requirements

For every material decision or system handoff, the individual journey contract must document:

| Requirement | What must be clear |
|---|---|
| **Person choice** | What the person is being asked or enabled to choose, including the valid option not to proceed. |
| **Relevant context** | The direction, commitment, action, evidence, source, reflection, adaptation, or assistance context that materially informs the choice. |
| **Owning authority** | Which system and behavior contract own the resulting state or action. |
| **Truthful status** | What is proposed, current, historical, unavailable, inferred, source-provided, or applied. |
| **Consequence** | What changes, what does not change, and where the person can revisit the result. |
| **Recovery** | How the person can pause, defer, decline, correct, disconnect, or return where the choice does not proceed normally. |

The contract must state whether a transition is initiated by a person, a source update, or eligible computational assistance. It must never use a diagram or generic verb such as “continue,” “sync,” or “complete” to conceal a material authority change.

---

## 7. Journey Narratives and Diagrams

### Narrative is the normative form

The journey narrative is the authoritative explanation of what a person can experience and understand. It uses plain language and describes meaningful conditions, choices, and outcomes rather than a screen-by-screen tour.

### Diagrams are supporting evidence

A diagram may clarify branching, system handoff, or recovery. It is subordinate to the narrative and must label:

- valid entry contexts;
- material decision points;
- the system or feature contract that owns each consequential state change;
- alternative, deferred, and recovery paths; and
- valid exit contexts.

A diagram must not imply linearity where the contract permits direct entry, return, a different order of use, or a valid decision not to continue.

### State tables are required where ambiguity exists

Use a state or transition table whenever a journey includes source exchange, automation, consequential recommendation, correction, incomplete evidence, or a change that can be proposed, applied, deferred, declined, or withdrawn. The table prevents a polished narrative from hiding state ambiguity.

---

## 8. Relationship to Adjacent Documents

| Document | Journey contract owns | Adjacent document owns |
|---|---|---|
| Experience Architecture | The application of cross-surface rules to one bounded journey. | The enduring rules all journeys inherit. |
| Information Structure | The journey’s allowed entry and owning destinations. | Current destination organization, labels, and access relationships. |
| System documents | How a person experiences a specific system handoff in this journey. | System definitions, invariants, state, and authority. |
| System interface contract | Where the interface rule is encountered in the journey. | The shared semantic rule between systems. |
| Feature brief | How the bounded journey supports a feature’s intended outcome. | Feature problem, scope, and decision to explore or build. |
| Behavior contract | End-to-end user-visible behavior, including material transitions and recovery. | Detailed observable rules, edge cases, permissions, and state behavior of the feature. |
| Interaction specification | The required meaning and choice points. | Exact interaction, component, copy, responsive, and accessibility design. |
| Delivery design | Experience constraints relevant to delivery. | Technical approach, dependencies, rollout, migration, and risk. |
| Validation plan | Journey acceptance criteria. | Test methods, samples, instruments, and execution of validation. |
| Review record | The contract that was assessed. | Actual assessment, findings, and disposition. |

When a journey exposes a conflict between parent documents, the author must stop and follow the conflict-resolution process in Documentation Architecture. A journey contract cannot resolve the conflict by silently choosing one interpretation.

---

## 9. Lifecycle and Review

### Draft

A draft journey contract can coordinate discovery but has no authority to change a system, feature, design, or delivery plan.

### Active

An active journey contract is the authority for the bounded end-to-end experience it names. Related feature, design, engineering, and validation work must link to it when they affect that journey.

### Superseded or retired

A journey contract is superseded only by a named successor that owns the same journey responsibility, or retired when the experience it describes no longer exists. The historical contract and its review record remain accessible.

### Review triggers

Review a journey contract when a parent document changes, a participating system or destination changes materially, a new entry path or consequential transition is introduced, evidence reveals material confusion or harm, or a release review identifies that the journey no longer meets its acceptance contract.

---

## 10. Quality Bar

An individual journey contract is ready to become active only when a product manager, designer, engineer, and reviewer can independently answer:

1. Who is entering this journey, from what valid context, and for what bounded need?
2. What must they understand before each consequential choice or transition?
3. Which system owns every material state change?
4. Which paths are optional, deferred, corrective, unavailable, or valid exits?
5. What distinguishes evidence, interpretation, source context, assistance, and person choice in this journey?
6. Where does the person go to inspect or revise the result?
7. What observable evidence would show that the journey met its contract?

If the contract cannot answer these questions without relying on unstated implementation knowledge, it is not ready for delivery.

---

## 11. Non-Goals

Journey Contracts do not:

- prescribe a universal user journey or a mandatory sequence through FlowOS;
- replace the Product Model, system documents, information structure, feature contracts, or system interface contracts;
- define screen layout, interaction details, content copy, technical implementation, analytics events, or test results;
- turn a journey into a funnel whose purpose is increased engagement, disclosure, automation adoption, or retention;
- treat direct entry, pause, deferral, correction, disconnection, or exit as an invalid product outcome; or
- create a new feature, route, or primary destination without the appropriate parent document and evidence.

---

## 12. Change Control

This document changes only when FlowOS changes the enduring standard for what a journey contract is, when it is required, what it must contain, or how it is governed and assessed.

A change requires:

1. a decision record explaining the standard-level need;
2. impact assessment for Experience Architecture, Information Structure, active journey contracts, feature and behavior contracts, design standards, engineering architecture, validation plans, and reviews;
3. evidence that the change preserves single responsibility, truthful system handoff, recovery, and person authority; and
4. confirmation of consistency with the Vision, Documentation Architecture, Product Model, and Experience Architecture.

A preferred diagram style, project-management convention, or one feature’s delivery need does not by itself justify changing this standard.
