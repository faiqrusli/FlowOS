# Content Standards

**Status:** Active
**Authority:** Canonical standard for reusable FlowOS interface language, state disclosure, action language, error and recovery language, and assistive-capability disclosure
**Owner:** Design and product leadership
**Parent:** [Documentation Architecture](../00-constitution/documentation-architecture.md) · [Product Glossary](../01-product/product-glossary.md) · [Experience Architecture](../03-experience/experience-architecture.md) · [Design System Architecture](./design-system-architecture.md) · [Intelligence and Trust System](../02-systems/intelligence-and-trust.md)
**Children:** Feature content specifications, component content guidance, empty and error-state copy, confirmation and recovery language, source and authority disclosures, assistive-capability disclosures, and content reviews
**Last reviewed:** 2026-08-01
**Review trigger:** A proposed document changes the reusable language rules for product state, person authority, provenance, uncertainty, action, recovery, accessibility, or assistive capability.

---

## 1. Scope

This document defines how FlowOS uses reusable interface language to make product state, person authority, source provenance, uncertainty, actions, and recovery understandable.

It answers:

> How should FlowOS communicate what is true, what a person can do, what will happen next, and what remains uncertain without allowing copy to redefine product meaning or pressure a person into a choice?

It does not define canonical product terms, feature behavior, visual tokens, marketing voice, a specific screen's content, legal policy, or an assistive system's underlying reasoning. Those belong to the Product Glossary, behavior contracts, design standards, feature design specifications, applicable policies, and system or engineering documents.

---

## 2. Content-Standard Responsibility

Content standards own reusable rules for language that appears across features. They ensure the interface makes material distinctions legible without turning language into a second product model.

| Content layer | This document owns | Another document owns |
|---|---|---|
| Product terminology | Consistent presentation of canonical terms in interface language. | The Product Glossary's definitions and approved names. |
| State language | Reusable language for proposed, current, historical, unavailable, pending, completed, failed, corrected, and connected states. | What those states mean in a system or behavior contract. |
| Action language | Clear labels, confirmations, consequences, and recovery cues. | Whether the action exists, its authority, and its actual effect. |
| Error and recovery language | Truthful explanation of what happened, what remains possible, and safe next steps. | Technical detection, repair, and incident handling. |
| Assistive disclosures | Reusable language for recommendations, inferences, automation, limits, and correction. | The assistance policy, model behavior, and feature-specific interaction. |

When language exposes a missing distinction in a behavior contract or glossary term, the owning document must be revised. Content standards never resolve that gap by quietly inventing a new meaning in copy.

---

## 3. Core Writing Rules

### State what is known, not what is hoped

Use language that matches the evidence available to the interface. Distinguish a request from a completed result, a source-provided record from a native record, a recommendation from an applied change, and an unavailable value from a negative value.

Avoid generic reassurance that hides material uncertainty. If FlowOS is still processing, disconnected, unable to verify, or only partially complete, say so plainly and provide the relevant next action or expected update.

### Preserve person authority in grammar

Actions with material consequence should make the actor, effect, and reversibility clear. Prefer direct, neutral language such as "Save commitment," "Remove connection," or "Apply this change" over language that implies inevitability or external judgment.

Do not frame a person as failing, falling behind, or needing correction because a plan changed, an action did not occur, or evidence is incomplete. FlowOS may describe a state or invite reflection; it must not convert absence of activity into a moral verdict.

### Make consequences visible before commitment

Before a consequential action, state what changes, where it applies, what is retained, who can see it, and whether it can be undone or corrected. Confirmation language is not a ritual: it is required where a person needs material context to authorize a change.

### Prefer concrete, stable verbs

Use the canonical product term and a specific verb. For example, distinguish create, save, connect, import, recommend, apply, remove, restore, correct, and withdraw. Do not use a vague term such as "manage" when a more precise action is available.

---

## 4. Reusable State and Action Language

Every reusable content pattern must support the state distinctions required by its governing behavior contract.

| Situation | Content must make clear | Avoid |
|---|---|---|
| Draft or proposed change | It is not yet active or applied. | Treating a proposal as a commitment or completed action. |
| Pending action | What is in progress, its safe boundary, and what happens if it fails. | "Done" before completion or a spinner without context. |
| Completed action | What completed and where the result now appears. | Implied broader success or outcome without evidence. |
| Failed or partial action | What failed, what was preserved, and a safe recovery path. | Blame, silent disappearance, or an unqualified retry. |
| Historical or superseded item | Its time or replacement relationship. | Presenting it as current without qualification. |
| Source-linked information | The source, scope, freshness, and connection limitation where material. | Making external data appear native or permanent. |
| Recommendation or inference | It is a suggestion or derived result, its basis/limits where material, and person control. | Commands, certainty, or attribution to the person. |
| Automation | The authorized action, scope, status, and ability to stop or correct it. | Hidden background change or ambiguous ownership. |

Labels should be concise; helper text, confirmations, and recovery notices carry the context that cannot safely fit in a label. A feature design specification may add feature-specific wording, but it must link to this standard and identify any exception.

---

## 5. Errors, Empty States, and Recovery

An empty state explains what is absent, whether absence is expected, and the smallest appropriate next step. It does not invent urgency, imply a deficit, or obscure a source or permission limitation.

An error state distinguishes:

1. what FlowOS knows happened;
2. the effect on the person's records or current work;
3. the action the person can safely take now;
4. what FlowOS will do, if anything, without further action; and
5. how to obtain support or correct a record when relevant.

Do not expose sensitive technical detail, credentials, internal identifiers, or another person's information. Do preserve enough meaning for a person to understand whether an action succeeded, whether data remains safe, and whether retrying could duplicate or change something.

Recovery language must not promise reversal or restoration until it is confirmed. If a consequence cannot be undone, say so before the action. If a correction preserves history, describe the correction rather than calling it an erase or reset.

---

## 6. Source, Privacy, and Assistive-Capability Disclosures

When material to a choice, the interface must disclose source, scope, recency, derivation, and access limit. A person should not need to infer whether information was written by them, imported from a connected source, derived from evidence, or generated as a recommendation.

Assistive language must:

- name a recommendation, inference, or automation according to its actual status;
- distinguish an available suggestion from an applied change;
- disclose important limitations, dependencies, and uncertainty in context;
- provide a route to inspect, decline, correct, or withdraw where the capability permits; and
- avoid anthropomorphic claims of understanding, certainty, or authority over a person's choices.

Privacy and permission requests must name the data or capability requested, the purpose, scope, duration where relevant, and what remains possible if the person declines. A request for broad access must never be hidden in generic language such as "improve your experience."

---

## 7. Accessibility and Internationalization

Language is accessible when it is concrete, structured, understandable in context, and not dependent on color, position, timing, or cultural shorthand alone. Reusable content patterns must work with assistive technologies, varied reading levels, translation, and narrow display contexts.

Write headings, labels, descriptions, and error messages so that their relationship remains clear when read out of visual order. Do not rely on emoji, punctuation, abbreviations, or hover-only explanations to convey consequence or status. Avoid idioms and judgmental metaphors in product-state language.

Translation does not grant permission to change canonical product concepts. When a local-language expression cannot carry a glossary term precisely, the feature team escalates the ambiguity to the glossary owner rather than allowing each surface to choose its own meaning.

---

## 8. Content Changes and Review

A reusable language change requires review when it changes how people understand authority, consent, state, provenance, uncertainty, consequence, recovery, or assistive behavior. The change owner must assess affected feature specifications, behavior contracts, components, accessibility, implementation, validation, and active content.

Feature-specific copy changes require a behavior-contract review when they alter a promise, action consequence, permission scope, system state, source attribution, or recovery expectation. Editorial clarity changes may proceed within the feature's normal design review when they preserve those meanings.

Content reviews assess existing language against this standard and its governing contracts. They record findings and corrections; they do not change product semantics merely by adopting a preferred phrase.

---

## 9. Non-Goals and Change Control

Content Standards do not serve as a brand book, marketing copy library, product glossary, legal policy, feature specification, support runbook, translation database, or list of all interface strings.

This standard changes only when FlowOS changes the durable rules for communicating product state, authority, provenance, uncertainty, action, recovery, accessibility, or assistance. A change requires a decision record, impact assessment for affected standards and feature specifications, and confirmation of consistency with the Product Glossary, applicable system documents, Experience Architecture, and Design System Architecture.
