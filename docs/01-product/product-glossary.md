# FlowOS Product Glossary

**Status:** Active
**Authority:** Canonical vocabulary for FlowOS product documentation
**Owner:** Product Architect
**Approval Required:** Founder
**Parent:** [Product Model](./product-model.md) · [Documentation Architecture](../00-constitution/documentation-architecture.md)
**Children:** System documents, experience architecture, feature contracts, design standards, engineering architecture, strategy, evidence, and reviews
**Last Updated:** 2026-08-03
**Review trigger:** A new durable product concept is introduced, an existing term becomes ambiguous, or two active documents use different words for the same concept.

---

## Document Ownership

### Owner
**Role:** Product Architect
**Responsibility:** Maintain canonical vocabulary, propose terminology changes, ensure consistent terminology across all product documents

### Modification Process
1. Product Architect proposes terminology changes (based on ambiguity, new concepts, or consistency needs)
2. Submit to Founder for approval
3. Founder reviews for Vision and product model alignment
4. If approved: Product Architect updates document
5. Document change in decision record if consequential
6. Update Last Updated date

### Authority Level
- Product Architect can: Propose terminology definitions, maintain glossary, ensure consistency
- Requires approval for: New canonical terms, changes to core concept definitions, terminology that affects multiple documents

---

## 1. Scope

This glossary owns the concise, canonical definition and approved use of FlowOS product terms.

It answers:

> What does this term mean when FlowOS uses it?

It does not explain why the product exists, define conceptual relationships, prescribe feature behavior, or specify technical implementation. Those responsibilities belong to the Vision, Product Model, feature contracts, and engineering documents respectively.

When this glossary and another active document appear to use a term differently, the glossary definition governs. If the difference is substantive rather than linguistic, the Product Model or an applicable system interface contract must be revised instead of redefining the term locally.

---

## 2. Usage Rules

- Use the exact preferred term in headings, contracts, data documentation, and measurement definitions.
- Link to this glossary when introducing a term to a new audience; do not reproduce a longer definition unless the parent document owns the concept’s relationships.
- Do not use a rejected or deprecated term as a synonym for a canonical term.
- Introduce a new term only when no existing term can accurately carry the meaning. New terminology requires a glossary update before it becomes normative elsewhere.
- Use lowercase for common concepts in prose unless a title, interface label, or proper name requires capitalization.
- A term may have a plain-language explanation in product copy, but product copy must not change the term’s canonical meaning.

---

## 3. Product Concepts

| Term | Canonical definition | Use when | Do not use as |
|---|---|---|---|
| **FlowOS** | The product that supports a person’s self-direction by connecting chosen direction, deliberate action, evidence, sensemaking, and adaptation. | Referring to the product or its conceptual model. | A generic task manager, workspace, or autonomous agent. |
| **direction** | Personally chosen context that helps a person judge what deserves attention. | Referring to a value, responsibility, desired future, concern, or priority. | A fixed identity, prediction, score, or permanent promise. |
| **goal** | A user-defined objective or desired outcome that gives a direction more concrete expression. | Referring to an explicit, optional expression of direction. | Proof that a person must pursue one path or a measure of their worth. |
| **intention** | A stated or implied desire for a future action or result that has not become a present commitment. | Distinguishing an early preference from a deliberate present choice. | A commitment or an action that occurred. |
| **plan** | A time- or sequence-based hypothesis about how a person expects to act. | Referring to a proposed future arrangement. | A guarantee, commitment, or factual record. |
| **commitment** | A present, intentional choice to direct attention or effort toward something. | Referring to work or conduct a person has actively chosen to take on. | A plan that has not become actionable, or a completed action. |
| **action** | A deliberate behavior that actually occurs. | Referring to work, practice, care, recovery, communication, or another chosen use of attention. | A scheduled event, an intention, or an unverified claim of activity. |
| **outcome** | A result or state change associated with an action or commitment. | Referring to what the action produced or changed. | Effort, time spent, or a generic progress score. |
| **evidence** | A factual record related to an action, commitment, or outcome. | Referring to what is known to have occurred or resulted. | An interpretation, diagnosis, motive, or recommendation. |
| **context** | Information about circumstances that helps a person make or interpret a choice. | Referring to relevant conditions, constraints, knowledge, or history. | A substitute for evidence or a hidden assumption. |
| **knowledge** | Information that can inform a person’s choices or interpretation. | Referring to principles, references, resources, lessons, or other useful material. | The destination of FlowOS or a requirement to centralize every source. |
| **sensemaking** | Human interpretation of evidence in context. | Referring to a person’s effort to understand a pattern, constraint, result, or uncertainty. | A factual record, final truth, or automated judgment. |
| **reflection** | A structured act of sensemaking in which a person supplies context or interpretation. | Referring to deliberate human reflection on experience. | A generic text field, a compliance ritual, or evidence itself. |
| **insight** | A provisional conclusion or useful pattern produced through sensemaking. | Referring to something a person may carry into a later choice. | A fact without support or a mandatory recommendation. |
| **adaptation** | A deliberate revision, reinforcement, pause, removal, or replacement of a future choice or condition. | Referring to a change informed by sensemaking. | A required response to every reflection or a measure of progress. |
| **progress** | Meaningful movement toward a chosen direction, assessed through appropriate evidence and context. | Referring to a contextual understanding of advancement. | A universal percentage, a measure of personal worth, or an automatic consequence of time spent. |
| **source** | The origin of relevant context, work, evidence, or knowledge. | Identifying where information entered the FlowOS model. | Ownership by FlowOS of every external item. |
| **provenance** | Traceable information about where a record came from and how it was derived. | Referring to origin, transformation, and supporting evidence. | A vague attribution or an optional implementation detail. |
| **connected system** | A system outside FlowOS that can provide or receive relevant context while retaining its own responsibility. | Referring to an external tool, service, or source of work. | A dependency that determines FlowOS’s product identity. |
| **continuity** | The ability to retain and relate relevant context through time and change without erasing the history that makes it understandable. | Referring to the intelligible relationship among past, current, and connected context. | A requirement to preserve everything forever or keep all history active. |
| **interoperability** | The ability to work with a connected system through a bounded, intelligible relationship while each system retains its own responsibility. | Referring to authorized exchange, connection, or portability across a product boundary. | Source ownership by FlowOS or an automatic transfer of authority. |
| **source relationship** | A person-authorized, explicitly scoped connection between FlowOS and a source or connected system. | Referring to the declared access, exchange, and state of a connection. | A blanket permission, permanent access, or ownership transfer. |
| **native** | Created and managed directly within FlowOS. | Distinguishing FlowOS-owned records from external references. | Better, more trusted, or more meaningful than external information. |
| **recommendation** | A proposed action, interpretation, or adjustment offered to a person for consideration. | Referring to a suggestion from FlowOS or an intelligence capability. | A command, automatic change, or definitive conclusion. |
| **inference** | Derived information that identifies a possible pattern, relationship, classification, or condition from available context. | Referring to a computationally or systematically derived result. | Factual evidence, a person’s interpretation, or a certain conclusion. |
| **automation** | A system-performed action under explicit, bounded authority. | Referring to routine assistance that acts within a declared scope. | A recommendation, autonomous authority over consequential choices, or a hidden background change. |
| **correction** | An explicit revision to a record, assistive result, or its basis that preserves what changed and why. | Referring to a traceable amendment within the owning system’s rules. | Silent rewriting, deletion of history, or proof of a person’s error. |
| **user authority** | The person’s final control over their direction, commitments, records, interpretations, and choices. | Referring to approval, correction, dismissal, and revision rights. | A preference that automation may silently override. |

---

## 4. Documentation Concepts

| Term | Canonical definition | Use when | Do not use as |
|---|---|---|---|
| **product model** | The canonical conceptual objects, relationships, and invariants of FlowOS. | Defining what FlowOS understands. | A feature specification, interface map, or technical schema. |
| **system** | An enduring product mechanism with defined conceptual responsibilities and boundaries. | Referring to a stable part of the product model. | A page, navigation item, or temporary project. |
| **system interface contract** | The canonical shared semantic rule between two systems. | Defining ownership, handoff, or shared invariants across systems. | A complete description of either system or a code-level API alone. |
| **experience architecture** | The canonical cross-surface rules for making product context, states, choices, and system transitions understandable in use. | Defining enduring experience responsibilities across FlowOS. | A site map, page design, navigation labels, or a feature journey. |
| **information structure** | The current organization of experience domains, primary destinations, labels, and object-access relationships that applies the Experience Architecture. | Defining where people find and work with product context today. | A product model, system definition, page design, or a feature workflow. |
| **journey contract** | The bounded end-to-end experience contract for one person intent, from defined entry contexts to valid exit contexts. | Defining how a person experiences material transitions, choices, and recovery across product boundaries. | A generic user-flow diagram, feature specification, page design, or implementation plan. |
| **design system** | The reusable visual, interaction, content, accessibility, and component rules that consistently express approved product and experience semantics. | Defining shared design foundations and patterns. | Product meaning, a feature behavior contract, or a one-off screen design. |
| **feature design specification** | The feature-specific visual, interactive, content, responsive, and accessible expression of an approved behavior contract. | Defining how a bounded feature becomes understandable and controllable in use. | A behavior contract, reusable design system rule, technical implementation plan, or exploratory mockup. |
| **engineering architecture** | The durable technical-domain boundaries and preservation rules that translate approved product behavior into secure, reliable, operable systems. | Defining reusable technical ownership, invariants, and architecture change policy. | A current stack inventory, feature delivery design, implementation plan, or product behavior contract. |
| **data architecture** | The durable rules for representing, transforming, accessing, retaining, correcting, removing, and carrying product information. | Defining data lifecycle, lineage, integrity, and access boundaries. | A database schema, query, migration script, storage provider, or product concept definition. |
| **identity and access architecture** | The durable rules for proving identity and enforcing bounded authority, delegation, sessions, revocation, and audit. | Defining reusable technical access boundaries. | A product authority decision, authentication provider, permission table, or UI flow. |
| **integration architecture** | The durable rules for connected-system boundaries, exchange, synchronization, compatibility, reliability, and external effects. | Defining reusable technical interoperability controls. | A product source relationship, provider API, connector implementation, or feature behavior. |
| **intelligence and trust architecture** | The durable technical controls for computational assistance, automation, explanation, correction, evaluation, withdrawal, and safety. | Defining reusable safeguards for assistive capability delivery. | Product assistance policy, model choice, prompt, provider configuration, or feature behavior. |
| **quality architecture** | The durable assurance boundaries for verifying and monitoring product behavior, trust, accessibility, reliability, safety, and recoverability. | Defining reusable quality domains, evidence traceability, and verification governance. | A test case, test tool, release decision, raw result, or product requirement. |
| **operations architecture** | The durable rules for deploying, configuring, observing, supporting, containing, recovering, and operating the live product. | Defining reusable operational boundaries and recovery responsibilities. | A hosting provider, runbook step, dashboard, incident record, or release decision. |
| **client architecture** | The durable rules for rendering, navigating, presenting state, coordinating interaction, and recovering in the product client. | Defining reusable client boundaries that preserve approved product semantics. | A route, component, framework, client library, local state value, or visual design. |
| **roadmap** | The current sequence of evidence-gated product outcomes, strategic bets, and investment decisions. | Deciding what outcome FlowOS must earn or resolve next. | A feature backlog, sprint plan, release procedure, implementation schedule, or evidence record. |
| **delivery plan** | The bounded coordination of work, dependencies, evidence, risks, and decisions needed to advance one active roadmap outcome. | Coordinating cross-functional delivery toward a named outcome gate. | A roadmap, backlog, sprint plan, feature specification, technical design, or release approval. |
| **release plan** | The bounded coordination of availability, readiness, rollout, monitoring, containment, recovery, and review for one release. | Making approved behavior available to a defined population or context. | A deployment command, feature contract, raw readiness result, or release approval. |
| **research program** | The durable method for framing, conducting, preserving, synthesizing, and governing decision-relevant research. | Producing trustworthy human evidence about people, context, use, comprehension, or value. | A product decision, feature specification, raw feedback inbox, or universal claim. |
| **measurement specification** | The durable definition and governance of one bounded measurement, including meaning, collection, provenance, quality, limits, and revision. | Defining how a product, research, validation, or operational signal is observed and qualified. | A dashboard, a raw value, an analysis, a quota, or a decision. |
| **content standards** | The reusable rules for how FlowOS interface language communicates state, authority, provenance, uncertainty, action, recovery, accessibility, and assistance. | Defining cross-feature interface language patterns. | A product glossary, feature behavior contract, marketing voice, or a screen's final copy. |
| **accessibility standards** | The reusable obligations that keep FlowOS perceivable, operable, understandable, robust, and recoverable across supported access needs and technology contexts. | Defining cross-feature accessibility requirements and verification boundaries. | A feature layout, component implementation, test result, release approval, or generic legal claim. |
| **engineering standards** | The reusable practice for safely and accountably changing FlowOS software, data, infrastructure, dependencies, and technical documentation. | Governing engineering change discipline across technical work. | A technical architecture, code-style guide, implementation plan, release decision, or runbook. |
| **insight synthesis** | A traceable interpretation of multiple relevant evidence records that identifies bounded patterns, contradictions, uncertainty, and conditional implications. | Interpreting evidence across studies or measurements. | A raw evidence record, product decision, roadmap commitment, or feature specification. |
| **post-release learning record** | An append-only account of what one bounded release taught FlowOS under real conditions, including evidence links, lessons, uncertainty, and follow-through. | Preserving learning after a release observation window. | A release approval, review record, incident timeline, roadmap, or decision. |
| **feature** | A bounded product capability that applies one or more systems to a user problem. | Referring to a discrete capability with a defined contract. | A new product philosophy, system, or navigation category by default. |
| **feature brief** | The document that states a bounded problem, desired outcome, scope, and non-goals. | Deciding whether a feature should be explored or built. | A behavioral or technical specification. |
| **behavior contract** | The document that defines externally observable feature behavior. | Defining user-visible states, rules, edge cases, and permissions. | A delivery plan or implementation design. |
| **delivery design** | The feature-specific technical approach for delivering an approved behavior contract. | Describing affected systems, migrations, dependencies, rollout, and risk. | Product rationale or acceptance results. |
| **validation plan** | The document that defines how a feature will be assessed before release. | Defining acceptance criteria, checks, and expected evidence. | A record of actual outcomes. |
| **decision record** | An append-only record of one consequential choice and its rationale. | Preserving why an option was chosen. | A living specification or retrospective. |
| **evidence record** | A factual record from research or measurement. | Referring collectively to study and measurement records. | An insight, roadmap decision, or recommendation. |
| **review record** | An assessment of an existing artifact, feature, release, or system against its stated contract. | Determining whether a bounded scope met defined criteria. | A replacement specification or raw research store. |
| **feature catalog** | An implementation reference that maps bounded product domains to their current status, owner, and next documentation artifact. | Discovering whether a feature domain is shipped, partial, embedded, derived, placeholder, deferred, or unknown. | A feature behavior contract, roadmap, or implementation backlog. |
| **implementation masterplan** | The evidence-gated sequence of product, design, engineering, validation, and release work required to deliver a defined implementation outcome. | Coordinating implementation phases beneath the Roadmap. | A product vision, outcome roadmap, sprint backlog, or release procedure. |
| **documentation refinement plan** | The bounded plan for reconciling documentation sources, responsibilities, lifecycle labels, and missing contracts. | Organizing documentation cleanup before or alongside implementation. | A feature specification, implementation masterplan, or archive index. |

---

## 5. Deprecated and Rejected Terms

| Avoid | Use instead | Reason |
|---|---|---|
| “productivity score” | progress, evidence, or a named metric | FlowOS does not reduce a person to a universal score. |
| “AI decision” | recommendation | A person retains authority over choices and records. |
| “automatic progress” | evidence-informed progress | Time or activity alone does not establish meaningful progress. |
| “task completed” as proof of success | completed action or outcome | Completion and meaningful outcome are distinct. |
| “external task” | source-linked commitment or source-linked action | The source is relevant; the conceptual object remains a commitment or action. |
| “data knows” | evidence indicates | Evidence has scope and limitations; it does not possess judgment. |
| “failure” for every revision or deferral | revision, deferral, withdrawal, or unmet commitment | The model distinguishes change from moral judgment. |

---

## 6. Change Control

The glossary changes when terminology needs clarification, standardization, deprecation, or addition.

Changes that alter the relationship, invariant, or responsibility behind a term are Product Model changes and require the Product Model’s change-control process. A glossary change must never be used to make a conceptual change appear editorial.

Every new or revised term must identify:

1. its parent concept or document;
2. its approved definition;
3. terms it replaces or must not be confused with; and
4. active documents that require terminology updates.
