# Accessibility Standards

**Status:** Active
**Authority:** Canonical standard for reusable FlowOS accessibility obligations across perception, operation, understanding, timing, error recovery, and assistive technology support
**Owner:** Design and engineering leadership
**Parent:** [Documentation Architecture](../00-constitution/documentation-architecture.md) · [Experience Architecture](../03-experience/experience-architecture.md) · [Design System Architecture](./design-system-architecture.md) · [Content Standards](./content-standards.md) · [Quality Architecture](../06-engineering/quality-architecture.md)
**Children:** Component accessibility specifications, feature design specifications, behavior contracts, client implementations, validation plans, accessibility assessments, and review records
**Last reviewed:** 2026-08-01
**Review trigger:** A proposed document changes reusable accessibility obligations, supported interaction patterns, assistive-technology behavior, recovery requirements, or validation expectations.

---

## 1. Scope

This document defines the reusable accessibility obligations that let people perceive, understand, operate, and recover within FlowOS across supported access needs and technology contexts.

It answers:

> What must remain available, understandable, controllable, and recoverable when a person uses FlowOS with different sensory, motor, cognitive, language, device, connectivity, or assistive-technology conditions?

It does not define product behavior, determine a feature's visual layout, specify an exact component implementation, replace technical tests, or make an accessibility claim for a particular release. Those belong to behavior contracts, feature design specifications, component specifications, client architecture, validation plans, quality records, and review records.

---

## 2. Accessibility-Standard Responsibility

Accessibility is a condition of product understanding and control, not a late visual check. This standard owns reusable obligations; each feature remains responsible for applying them to its actual behavior and context.

| Concern | This document owns | Adjacent document owns |
|---|---|---|
| Perception | Reusable requirements for non-color, text, contrast, structure, and multimodal cues. | The feature-specific content and visual expression. |
| Operation | Reusable keyboard, focus, pointer, touch, timing, and input expectations. | Whether a feature action exists and its consequence. |
| Understanding | Reusable language, state, relationship, and feedback expectations. | Product semantics and behavior rules. |
| Recovery | Reusable error, interruption, correction, and help obligations. | Underlying failure handling and repair. |
| Verification | Accessibility evidence expectations and escalation boundaries. | Test implementation, review disposition, and release decision. |

No feature may use visual calm, novelty, density, performance, or implementation convenience to hide a material state, remove a supported path to control, or make person authority depend on one input mode.

---

## 3. Reusable Obligations

### Perceivable information

Material information must not depend on color, position, shape, hover, sound, animation, or timing alone. State, source, importance, selection, validation, and consequence need a textual or programmatically available expression appropriate to the context.

Text, contrast, zoom, reflow, and responsive behavior must preserve reading order, relationships, and action availability. Decorative treatment must not obscure an error, source limit, pending state, recommendation, or path to correction.

### Operable control

Supported actions must be reachable and understandable through keyboard and other supported input paths. Focus moves predictably, remains visible, and returns to a meaningful location after dialogs, menus, asynchronous updates, interruption, or error. A pointer-only, hover-only, drag-only, gesture-only, or time-limited path requires an equivalent supported alternative when its action is material.

Do not capture focus, trigger unexpected context changes, or make a person race a timer to understand or preserve work. Shortcuts enhance a complete path; they do not replace it.

### Understandable state and consequence

Labels, instructions, status, validation, and recovery language must make the current state and next safe action clear. A person must be able to distinguish proposed, pending, completed, partial, failed, unavailable, historical, source-provided, derived, recommended, and automated information when that distinction affects a choice.

Errors identify the scope and effect of a problem without exposing sensitive technical material. Confirmation and destructive-action patterns state consequence and recovery before the person acts.

### Robust semantic structure

Interface structure must expose meaningful names, roles, values, relationships, and state changes to supported assistive technologies. Custom controls preserve the expectations of their semantic equivalents or provide an equally understandable alternative. Dynamic changes announce what changed when the person needs that information to continue safely.

---

## 4. Product-Specific Accessibility Boundaries

FlowOS has product states that require special accessibility care:

- a recommendation, inference, or automation must not appear person-authored or mandatory because its visual or assistive presentation omits its status;
- source-provided information must preserve its source and connection limitations through assistive output, not only visual badges;
- a change to a direction, commitment, action, evidence record, reflection, or adaptation must provide an understandable route to inspect, confirm, correct, or recover as the governing behavior permits;
- asynchronous and degraded conditions must communicate whether a person's work was saved, queued, partial, or failed; and
- privacy, permission, and access decisions must remain understandable without relying on dense legal text, color-only emphasis, or a single interaction mode.

Accessibility needs can reveal a behavior-contract gap. If a feature cannot explain, operate, or recover from its intended state through supported paths, the answer is not to conceal the state; the feature contract needs review.

---

## 5. Feature and Component Application

Every feature design specification identifies the relevant accessibility obligations, supported input paths, focus and announcement behavior, responsive/reflow considerations, error and recovery path, content requirements, and validation evidence. It records any justified exception and its time-bound review trigger.

A reusable component specification defines its semantic role, accessible name, variant/state treatment, keyboard and pointer behavior, focus treatment, content slots, announcement or validation behavior, and composition limits. Components do not decide feature authority or consequence; they preserve the behavior contract that supplies it.

Feature and component work must consider empty, loading, partial, permission-denied, disconnected, error, confirmation, destructive, and success states—not merely a default rendered state.

---

## 6. Verification and Escalation

Accessibility verification is proportionate to risk and includes the applicable combination of design review, keyboard checks, assistive-technology checks, zoom/reflow checks, content review, automated checks, manual scenarios, and real-person research where warranted. Automated tooling finds some defects; it does not establish that a person can understand or control a consequential flow.

Evidence links to the applicable validation plan, quality evidence, review record, or issue. A known limitation is not hidden by a broad conformance claim. If the limitation affects authority, privacy, safety, essential access, or recovery, release and operational owners must treat it as a material constraint.

---

## 7. Non-Goals and Change Control

Accessibility Standards do not serve as a generic legal conformance statement, component inventory, feature design, test suite, release approval, or incident record.

This standard changes only when FlowOS changes a durable accessibility obligation, supported interaction expectation, semantic-structure requirement, recovery rule, or verification boundary. A change requires a decision record, impact assessment for active standards and feature specifications, and confirmation of consistency with Experience Architecture, Content Standards, Design System Architecture, Client Architecture, Quality Architecture, and applicable behavior contracts.
