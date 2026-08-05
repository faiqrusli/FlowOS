# MVP Coherent Loop — Journey Contract

**Status:** Draft
**Owner:** Product Architect
**Sprint tasks:** P2.1–P2.4, P5.6
**Foundation constraints:** [Phase 1.5 foundation pattern](../../11-archive/phases/phase-1.5/validation-and-date-time-pattern.md)
**Parent:** [Experience Architecture](../experience-architecture.md) · [Information Structure](../information-structure.md) · [Product Model](../../01-product/product-model.md)
**Children:** [Today behavior](../../04-features/behavior/today.md) · [Tasks behavior](../../04-features/behavior/tasks.md) · [Focus behavior](../../04-features/behavior/focus.md) · [Reflection behavior](../../04-features/behavior/reflection.md)
**Evidence:** [Phase 1 implementation truth](../../current-phase/phase-1/implementation-truth-evidence.md)
**Journey intent:** “Help me orient, choose, act, understand what occurred, and decide what—if anything—I want to change.”
**Entry contexts:** Today `/`; Tasks; active Focus; Reflection; valid contextual/deep links
**Exit contexts:** Next choice, active/paused/concluded action, saved/paused/skipped reflection, explicit adaptation choice, or valid departure
**Review trigger:** A change to the core loop, a participating owner, an entry/exit context, or a material cross-surface handoff.

## Person intent and outcome

The person can begin with current context, a practical commitment, an action already in progress, or a wish to make sense of experience. They can reach a grounded next choice without completing every stage. When they do move through the loop, FlowOS preserves the difference between intention, occurrence, evidence, interpretation, and adaptation.

## Scope and non-goals

This contract owns the bounded relationship among Today orientation, Tasks commitment, Focus action mode, factual evidence, Reflection sensemaking, and an optional adaptation choice.

It does not require a linear funnel, a daily ritual, a direction link for every task, a Focus session for every action, a reflection for every day, or an adaptation after every insight. Habits, Schedule, and Notes support context only under [supporting decisions](../../04-features/supporting-domain-decisions.md). Goals, AI Coach, standalone Progress, and standalone Weekly Review are out of scope.

## Entry contexts

- **Today:** current projection and reorientation; Today owns no durable domain write.
- **Tasks:** direct commitment creation or revision; Tasks owns task state.
- **Focus:** direct return to an active/paused session; Focus owns session state.
- **Reflection:** direct sensemaking entry; Reflection owns reflection state.
- **Deep/contextual entry:** a person may arrive from a task, session, schedule item, or reflection context and must receive enough identity/status to continue or leave safely.

## Participating authority

| Journey moment | Contract | Owner of consequential state |
|---|---|---|
| Orientation | Today | Today composes; linked domain owns change |
| Commitment | Tasks | Tasks / Direction and Commitment |
| Action | Focus or direct action context | Action and Evidence / Focus session owner |
| Evidence | Focus and factual records | Action and Evidence |
| Sensemaking | Reflection | Sensemaking and Adaptation / Reflection owner |
| Adaptation | Reflection proposal and receiving owner | Person chooses; Direction and Commitment applies resulting change |

## Journey narrative

On return, the person may use Today to see the current context that is available and relevant. They can choose a task, revise or defer a commitment, start or resume Focus, open Reflection, inspect planning context, or leave. A task selected for action remains a commitment until action actually occurs.

During action, Focus can represent a bounded attention session. The person may pause, resume, conclude, or leave. The resulting session record says what the Focus session recorded; it does not say the task succeeded or what the person’s effort meant.

After action, factual evidence remains separate from interpretation. The person may open Reflection, capture what helped or constrained them, note uncertainty, connect relevant context, or skip. A possible adaptation is a proposal until the person explicitly chooses whether to accept, defer, decline, modify, or apply it through the owning system.

At every point, the person may enter directly, return after interruption, correct a record, defer a choice, or leave with authority intact.

## Decision and transition table

| Transition | Person choice/context | Owning contract | Truth and consequence | Valid alternative/recovery |
|---|---|---|---|---|
| Orient → commit | Current context and optional meaning | Tasks | A task becomes an explicit commitment after confirmed save | Leave, defer, or act without formalizing more context |
| Commit → action | Open task or emergent choice | Tasks → Focus/action | Selection is not completion; action begins only when recorded by its owner | Act without Focus, revise, defer, or withdraw |
| Action → evidence | Confirmed session/action state | Focus → Action and Evidence | Duration/state is factual session evidence, not outcome | Pause, conclude, leave, or mark unavailable |
| Evidence → sensemaking | Relevant factual record and context | Reflection | Reflection is user interpretation, not fact | Skip, save later, or interpret without a linked record |
| Sensemaking → adaptation | Reflection, evidence, uncertainty | Reflection → affected owner | Proposal is not applied state; person must authorize | Defer, decline, revisit, or make no change |
| Any → re-entry | Interrupted or returning context | Owning contract | Show last confirmed state and uncertainty | Retry, inspect owner, or leave |

## State, uncertainty, and provenance

The journey must keep these distinctions visible:

- planned commitment versus actual action;
- direct/user-provided/source-provided/derived evidence;
- factual evidence versus reflection/insight/recommendation;
- proposed versus accepted/applied adaptation;
- current versus historical/superseded/unavailable context; and
- confirmed versus pending/failed/partial state.

No source update, projection, elapsed timer, or recommendation may silently change a person’s commitment, interpretation, or adaptation.

## Recovery and interruption

- A person can re-enter any owning surface without returning to Today first.
- A pending or failed write identifies what is confirmed, what is not, and how to retry or correct.
- A pause, deferral, decline, or exit is a valid journey outcome.
- Missing evidence is not evidence of non-action; missing context remains unavailable or partial.
- Correction changes the relevant record while preserving the history needed to understand what changed.

## Exit contexts

Valid exits include: oriented but no action chosen; commitment created, revised, deferred, withdrawn, or completed; action active, paused, concluded, or unavailable; evidence inspected; reflection saved, paused, skipped, corrected, or revisited; adaptation proposed, accepted, applied, deferred, declined, or revisited; and simple departure.

## Acceptance evidence

- **JOURNEY-01:** A person can enter from Today, Tasks, Focus, or Reflection and regain orientation without a prescribed sequence.
- **JOURNEY-02:** Each material handoff names its owning contract and distinguishes planned, actual, factual, interpretive, proposed, and applied states.
- **JOURNEY-03:** The person can pause, defer, decline, correct, retry, or leave at appropriate points without a negative product state.
- **JOURNEY-04:** A complete seeded journey can move from orientation through commitment, action, evidence, sensemaking, and an explicit adaptation choice.
- **JOURNEY-05:** An interrupted or failed step does not fabricate completion, outcome, save, or adaptation.

Validation will be specified in the Phase 2 feature/journey validation package after design states are complete.

## Open questions and change control

The remaining Gate 2 work is tracked as P4.5 (record-rule resolution) and P5.1–P5.6 (design state coverage and review). Revise this contract if a participating system, primary destination, or core-loop meaning changes; update all child contracts and the Gate 2 register together.
