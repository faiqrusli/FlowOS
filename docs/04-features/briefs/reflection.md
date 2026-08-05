# Reflection - Feature Brief

**Status:** Product Architect complete; approved for Design Architect handoff on 2026-08-05
**Owner:** Product Architect (Founder); Reflection domain owns reflection persistence
**Sprint tasks:** P1.4, P1.5, P4.5
**Parent systems:** [Sensemaking and Adaptation](../../02-systems/sensemaking-and-adaptation.md) - [Action and Evidence](../../02-systems/action-and-evidence.md) - [Continuity and Interoperability](../../02-systems/continuity-and-interoperability.md)
**Journey stage:** Sensemaking and optional Adaptation
**Canonical owner:** Reflection owns daily reflection records, custom entries, session-end reflection entries, correction, withdrawal, and skip state. Receiving domains own applied changes.
**Foundation:** [Phase 1.5 foundation pattern](../../11-archive/phases/phase-1.5/validation-and-date-time-pattern.md)
**Evidence:** [Phase 1 implementation truth](../../current-phase/phase-1/implementation-truth-evidence.md)
**Next contract:** [Reflection behavior contract](../behavior/reflection.md)

## Product decision

Reflection is voluntary sensemaking. It lets a person describe experience, uncertainty, and a possible adaptation while preserving the difference between factual evidence, user interpretation, a proposal, and an applied change.

## Person need and outcome

After action or at any direct entry, the person may make sense of what happened and decide whether anything should change. The desired outcome is a durable, user-owned reflection record or an explicit skip/leave, with an adaptation remaining a proposal until the person authorizes the receiving owner.

## Scope

- Daily reflection keyed to the person's `Asia/Singapore` date.
- Custom user-owned reflection entries that may carry context and links.
- Focus session-end records appended as linked reflection entries, without replacing the daily record.
- Direct full-page, sidebar, and session-end entry paths using one ownership and recovery model.
- Draft, save, retry, correct, withdraw, skip, and re-entry behavior.
- Optional adaptation proposal and explicit handoff to the receiving owner.

## Resolved P4.5 decision: record relationship

The daily reflection is the canonical date-scoped container/record for the person's daily sensemaking. Custom entries are separate user-owned records that preserve their own identity and history. A Focus session-end record is an appended custom reflection entry linked to the concluded Focus session; it is not an automatic replacement of the daily reflection, not a duplicate daily save, and not an automatic adaptation. Reflection owns all three persistence paths and presents their relationship clearly.

## Non-goals and exclusions

- Reflection is not factual telemetry, a required daily ritual, a productivity score, or a universal outcome evaluator.
- Reflection does not complete/defer/withdraw tasks, change Focus sessions, complete habits, or apply adaptation without explicit authority at the receiving owner.
- No autonomous interpretation, coaching, new weekly-review admission, Goals/Progress promotion, or new migration is implied.

## Supporting-domain write ownership

Reflection may reference Notes, Habits, Schedule, Tasks, or Focus context, but it cannot mutate those records through a reflection save. The source owner must receive an explicit person-authorized action for any consequential change.

## Success and validation intent

Reflection succeeds when a person can voluntarily capture and correct meaning, understand what is factual versus interpretive, recover a failed/local draft, and choose whether to leave a proposal unapplied. The behavior contract defines `REFLECT-*` questions for design and later validation.

## Product Architect checkpoint

**Approved by Founder/Product Architect on 2026-08-05.** Scope, record relationship, voluntary meaning, adaptation authority, and Sensemaking/Adaptation-stage role are approved for design specification. This approval does not authorize implementation or migration application.

## Change control

Making Reflection mandatory, allowing it to mutate commitments implicitly, or creating separate save ownership for sidebar/session-end entries reopens this brief, the behavior contract, journey, and record rules.
