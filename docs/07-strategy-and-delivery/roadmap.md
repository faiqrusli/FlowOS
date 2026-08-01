# FlowOS Roadmap

**Status:** Active
**Authority:** Canonical current sequence of evidence-gated product outcomes, strategic bets, and investment decisions
**Owner:** Product leadership
**Parent:** [Vision.md](../strategy/Vision.md) · [Product Strategy](../01-product/product-strategy.md) · [Success Model](../01-product/success-model.md) · [Documentation Architecture](../00-constitution/documentation-architecture.md)
**Children:** Delivery plans, release plans, feature briefs, research programs, validation plans, decision records, and roadmap reviews
**Last reviewed:** 2026-08-01
**Review trigger:** Material evidence, a changed strategic assumption, a decision gate, a material shift in outcome sequence or investment, a new commitment, or a decision to defer, simplify, retire, or expand a roadmap outcome.

---

## 1. Scope

This document defines the current outcome sequence through which FlowOS earns the right to make greater product, engineering, and market commitments.

It answers:

> Which evidence-gated outcomes must FlowOS achieve or decide before it invests further, and what is deliberately not yet a commitment?

It does not define the Vision, product strategy, system behavior, feature specification, technical approach, sprint plan, milestone task list, release procedure, research method, evidence result, or retrospective finding. Those responsibilities belong to the parent documents and to delivery plans, feature briefs, behavior contracts, engineering documents, validation plans, evidence records, and reviews.

---

## 2. Roadmap Responsibility

The Roadmap has six responsibilities:

1. sequence product outcomes and strategic bets according to what must be learned, proven, or decided next;
2. make the conditions for increased investment explicit, especially when evidence could require simplification, deferral, or retirement rather than expansion;
3. distinguish committed outcome work from conditional and exploratory possibilities;
4. identify the strategy, Success Model, evidence, and decision gate associated with every active roadmap outcome;
5. constrain delivery planning and feature work to the smallest investment justified by current evidence; and
6. preserve the historical reasons an outcome entered, changed, left, or was retired from the roadmap.

The Roadmap sequences outcomes, not an accumulation of features. It does not turn a feature request, a technical opportunity, a competitor capability, a date, or a prior plan into a commitment without the evidence and decision required by this document.

---

## 3. Roadmap Principles

### Outcomes before outputs

Every roadmap item names a change in what a person, product, or business can reliably demonstrate. Features, designs, experiments, migrations, and releases are possible means to that outcome; they are not the roadmap outcome by themselves.

### Evidence earns expansion

Broader surface area, automation, integrations, audience expansion, commercial investment, and irreversible technical work are conditional on evidence that the current product model is useful, trusted, and viable for the intended audience. Absence of evidence is not a reason to accelerate.

### A negative decision is progress when it protects focus

Simplifying, deferring, narrowing, retiring, or declining a roadmap outcome is a valid result when evidence shows the proposed investment is not justified. The Roadmap must preserve that decision rather than recast it as a temporary delay without a basis.

### Horizon communicates confidence, not certainty

Near-term outcome commitments may be more concrete because their preconditions are known. Later outcomes are conditional hypotheses. A horizon must never make unknown future work appear promised, inevitable, or funded.

### The smallest justified investment comes first

For every outcome, FlowOS invests only enough feature, design, engineering, research, and operational work to answer the next material question or deliver the proven capability safely. The Roadmap must not use a large program to conceal an untested assumption.

### Roadmap changes are accountable

Every material outcome addition, removal, priority change, or gate change requires linked evidence and a decision record. A delivery delay, implementation preference, or informal conversation is not a roadmap change by itself.

---

## 4. Current Outcome Sequence

The current roadmap is a sequence of conditional product outcomes. It deliberately avoids feature commitments beyond what current evidence can support.

| Sequence | Outcome to earn or decide | Primary strategic question | Evidence gate before broader investment | Commitment class |
|---|---|---|---|---|
| 1 | **Reliable personal use** | Can the product safely and coherently support repeated personal self-direction in ordinary use? | Evidence of reliable, understandable use of the core model, including meaningful friction and recovery learning. | Active, evidence-gated |
| 2 | **Independent-user evidence** | Does the initial audience receive enough distinctive value to return without founder pressure? | Independent usage and research evidence that can confirm or challenge the initial product and audience assumptions. | Active, evidence-gated |
| 3 | **Evidence-led deepening or simplification** | Which part of the core model should be strengthened, narrowed, repaired, or retired in response to observed use? | A documented decision that identifies the strongest evidenced constraint or opportunity and the smallest justified response. | Conditional on outcome 2 |
| 4 | **Repeatable value and trust** | Can the product sustain valuable, trustworthy use across a broader but still bounded set of people without losing coherence? | Outcome and guardrail evidence sufficient to justify broader delivery, operational, and support investment. | Conditional on outcome 3 |
| 5 | **Deliberate expansion decision** | Is there sufficient evidence to expand audience, product surface, integrations, intelligence, or commercial investment—or should FlowOS remain focused or contract? | A recorded go, narrow, defer, or retire decision supported by the Success Model, research, measurement, and review. | Conditional on outcome 4 |

This sequence is intentionally outcome-level. The active detailed milestone plan currently lives in [execution-masterplan.md](../strategy/execution-masterplan.md) as a transitional delivery plan. That plan must not add or reorder an outcome without an explicit Roadmap update and decision record.

---

## 5. Roadmap Item Model

Every active roadmap item must have one primary outcome and the following fields.

| Field | Required meaning | Must not contain |
|---|---|---|
| **Outcome** | The person, product, or business capability FlowOS needs to earn or decide. | A feature list, implementation deliverable, or generic growth target. |
| **Strategic connection** | Linked Product Strategy choice, initial-audience job, and strategic assumption. | A new strategy statement or untested market claim. |
| **Success connection** | Linked Success Model outcome, signal, guardrail, and anti-metric. | A locally invented metric definition or vanity target. |
| **Evidence gap** | What remains unknown, risky, or unproven. | A hidden assumption or an assertion that evidence is unnecessary. |
| **Smallest justified investment** | The minimum research, feature, design, engineering, or delivery work required next. | A broad program, sprint backlog, or full solution before validation. |
| **Decision gate** | The evidence and accountable decision that determine progression, narrowing, deferral, or retirement. | A calendar date, team preference, or automatic expansion rule. |
| **Dependencies** | Parent outcomes, systems, trust constraints, delivery conditions, and external realities that must hold. | A task-by-task implementation plan. |
| **Current confidence and status** | Commitment class and a brief evidence-based reason. | Pretended certainty or an undocumented status change. |
| **Evidence and decision links** | Research, measurement, review, and decision records that support the item. | Raw evidence copied into the roadmap. |

An active roadmap item may reference several delivery plans or feature briefs. Those child documents must not redefine the item’s outcome, evidence gate, or commitment class.

---

## 6. Commitment Classes and States

### Commitment classes

| Class | Meaning | Delivery implication |
|---|---|---|
| **Active, evidence-gated** | The next outcome is currently justified, but progression depends on named evidence and a decision. | Delivery plans and feature briefs may be created only within the smallest justified investment. |
| **Conditional** | The outcome may become relevant after a named earlier gate or decision. | No feature or delivery commitment exists yet; discovery may prepare only what reduces the gate’s uncertainty. |
| **Exploratory** | A possible future direction with insufficient evidence to sequence. | Research or lightweight exploration only; it must not enter implementation planning. |
| **Deferred** | The outcome is not justified now but may be reconsidered under a stated review trigger. | No active delivery work unless a new decision reactivates it. |
| **Retired** | Evidence or a decision ended the outcome’s relevance. | No delivery work; retain linked evidence and decision history. |

### Item states

| State | Meaning | Must not imply |
|---|---|---|
| **Framed** | The outcome, evidence gap, and decision gate are defined. | A commitment to build or a claim that the outcome is proven. |
| **Preparing** | Evidence gathering or the smallest justified enabling work is underway. | That the target outcome has been achieved. |
| **Validating** | The outcome or hypothesis is being assessed against planned evidence. | A passing result, product success, or automatic progression. |
| **Deciding** | Evidence is sufficient for an accountable go, narrow, defer, retire, or revise decision. | That the decision has been made. |
| **Completed** | The named outcome or its explicit decision gate has been resolved. | Permanent product success or absence of future review. |
| **Deferred** | Work is paused pending a named condition or decision. | Failure, loss of agency, or an unrecorded reprioritization. |
| **Retired** | The outcome no longer belongs on the active roadmap. | Deletion of its evidence or decision history. |

Commitment class captures investment confidence. Item state captures the current lifecycle. They must not be conflated.

---

## 7. Admission, Sequencing, and Change Rules

### Admission gate

Before an outcome enters the active roadmap, its owner must establish:

1. the Product Strategy choice and Success Model outcome it serves;
2. the current evidence gap or decision that makes the outcome necessary now;
3. why an existing active roadmap outcome or feature investment is insufficient;
4. the smallest justified investment and what it must not expand into;
5. the decision gate, alternative dispositions, and accountable owner; and
6. the material system, trust, delivery, and operational dependencies.

If these cannot be stated, the work remains exploratory or is declined. A feature request or internal enthusiasm is not enough for active roadmap admission.

### Sequencing rule

An outcome precedes another only when it reduces a necessary uncertainty, establishes a required capability, protects a material safety or trust boundary, or creates evidence required for the later investment. “More visible,” “more exciting,” or “easier to estimate” are not sufficient sequencing reasons.

### WIP rule

The active roadmap must contain only the outcomes the team can meaningfully advance and assess. Starting several independent outcomes without evidence capacity increases the chance that FlowOS confuses activity with learning. New active work requires an explicit decision about what current work narrows, pauses, or retires.

### Feature and delivery admission

A feature brief may proceed only when it names the active roadmap outcome, evidence gap, and smallest justified contribution it serves. A delivery plan may proceed only when the feature behavior is authorized and the associated outcome remains active. A child document that cannot make this link is not roadmap work.

---

## 8. Roadmap, Delivery, and Existing Masterplan

### Separate outcome sequencing from delivery planning

| Document | Owns | Must not own |
|---|---|---|
| **Roadmap** | Outcome sequence, commitment classes, evidence gaps, investment gates, and strategic progression. | Task lists, milestone implementation, release procedure, or feature behavior. |
| **Delivery plan** | Bounded coordination of people, dependencies, release scope, risks, and execution for an active outcome. | Strategic outcome choice, product-system meaning, or evidence interpretation. |
| **Feature brief** | The bounded capability proposed to serve an active outcome. | Roadmap priority, broad sequencing, or release schedule. |
| **Validation plan** | The planned evidence needed for a feature or delivery decision. | Roadmap item status, product strategy, or final decision. |
| **Review record** | Assessment of an existing outcome, delivery, release, or feature contract. | Silent roadmap revision or raw evidence storage. |
| **Decision record** | The dated consequential choice to advance, narrow, defer, retire, or revise. | The ongoing roadmap state or delivery execution. |

### Transitional masterplan

[execution-masterplan.md](../strategy/execution-masterplan.md) remains active as the detailed milestone delivery plan during the documentation transition. It owns its current milestone coordination, scope controls, and delivery detail. This Roadmap owns the outcome sequence and gate logic to which future delivery planning must link.

When a masterplan milestone is materially updated, added, deferred, retired, or expanded, the owner must confirm the linked roadmap outcome, evidence gap, and decision gate. When a roadmap outcome changes, the owner must assess whether the masterplan, active feature briefs, delivery designs, validation plans, and reviews remain valid.

No duplicate roadmap may be maintained in a milestone plan, release plan, or feature backlog. If the current masterplan and this Roadmap appear to disagree, this Roadmap governs outcome sequencing; the masterplan must be revised or its delivery work paused pending a decision record.

---

## 9. Evidence, Review, and Decision Handling

### Evidence informs; it does not auto-advance

Research, measurement, operational signals, validation results, and reviews can support or challenge a roadmap outcome. They do not automatically advance it. The Roadmap owner records the implication and an accountable decision record captures a material progression, narrowing, deferral, or retirement choice.

### Preserve uncertainty and disconfirmation

Every active outcome must name what evidence could challenge its premise. Conflicting or negative evidence remains linked to the item and can require a smaller investment, a revised hypothesis, a pause, or retirement. It must not be buried in a delivery update because it complicates the desired sequence.

### Reviews assess existing commitments

Roadmap reviews assess whether the current outcome sequence, commitment classes, gates, and evidence links remain appropriate. They must not become a new roadmap or rewrite completed evidence. A material change produces a decision record and an updated roadmap item with its historical relationship preserved.

---

## 10. Implications for Child Documents

Delivery and release plans must identify the active roadmap outcome, commitment class, evidence gate, dependencies, smallest justified scope, and decision they support. They must not use implementation progress or a date to claim that an outcome is achieved.

Feature briefs must identify the roadmap outcome and evidence gap they serve. A proposed feature that does not contribute to an active outcome is exploratory, deferred, or out of scope until a roadmap decision says otherwise.

Research programs, validation plans, measurement specifications, and reviews must link evidence to the outcome and decision it informs while preserving the boundary between factual evidence, assessment, and roadmap choice.

Decision records that change outcome sequence, investment, commitment class, or gate must update this Roadmap and trigger child-impact review. They must not leave delivery work running against a retired or deferred outcome.

---

## 11. Non-Goals

This Roadmap does not:

- restate the Vision, Product Strategy, Success Model, system documents, feature behavior, design, or engineering architecture;
- prescribe a backlog, sprint, task assignment, estimate, date promise, release procedure, implementation plan, or feature checklist;
- turn a feature request, competitor capability, technical opportunity, usage number, or business pressure into a committed outcome without the required evidence and decision;
- equate shipping, activity, user count, retention, revenue, or adoption with product value without the Success Model’s evidence framework;
- hide a decision to simplify, defer, narrow, or retire work because it is less attractive than expansion; or
- maintain a duplicate active outcome sequence in the execution masterplan, a release plan, a feature backlog, or a review.

---

## 12. Change Control

This document changes only when FlowOS changes the active outcome sequence, an item’s commitment class or state, a decision gate, a material investment boundary, or the enduring standard for outcome-led roadmap governance.

A change requires:

1. linked research, measurement, validation, operational, or review evidence appropriate to the outcome;
2. a decision record that identifies the change, alternatives, and consequences;
3. impact assessment for Product Strategy, Success Model, current delivery plans, the execution masterplan, active feature briefs, behavior contracts, delivery designs, validation plans, engineering dependencies, and reviews; and
4. confirmation of consistency with the Vision, Product Model, Product Strategy, Success Model, and Documentation Architecture.

A date change, implementation delay, team preference, feature request, market anecdote, or delivery urgency does not by itself justify changing this Roadmap.
