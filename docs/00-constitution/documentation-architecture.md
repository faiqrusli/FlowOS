# FlowOS Documentation Architecture

**Status:** Active
**Authority:** Governs documentation structure and lifecycle; subordinate to [Vision.md](../strategy/Vision.md)
**Owner:** Product and documentation leadership
**Parent:** [Vision.md](../strategy/Vision.md)
**Children:** Active documentation standards, folder indexes, templates, registers, and historical-transition records
**Last reviewed:** 2026-08-01
**Review trigger:** A proposed change alters a document responsibility, authority boundary, lifecycle rule, template/register rule, discovery rule, or archival treatment.
**Purpose:** Ensure every durable piece of FlowOS knowledge has one authoritative home, one responsibility, and a clear relationship to higher- and lower-level documents.

---

## 1. Scope

This document governs the architecture of FlowOS documentation. It determines:

- which kinds of documents exist;
- what each kind of document owns;
- how documents inherit authority;
- how documents are created, changed, reviewed, replaced, and archived; and
- how the team prevents duplication and contradiction.

It does not define product philosophy, product behavior, technical architecture, roadmap priorities, or design decisions. Those belong to the documents this architecture governs.

The canonical Vision remains at [`docs/strategy/Vision.md`](../strategy/Vision.md). It is immutable. No duplicate Vision, philosophy, or constitutional summary may be created elsewhere.

---

## 2. Governing Rule

Every document must answer one primary question.

If a document starts answering a second kind of question, it must link to the document that owns that question instead of copying its content.

The required distinction is:

| Knowledge type | Question it answers | Document family that owns it |
|---|---|---|
| Constitutional | Why does FlowOS exist and what may not be violated? | Vision |
| Product | What is the product, for whom, and what outcome must it create? | Product |
| System | What enduring mechanism makes the product coherent? | Systems |
| Experience | Where does information live and how do product states connect? | Experience |
| Feature | What bounded capability is being introduced and how must it behave? | Features |
| Design | How is the experience expressed consistently? | Design |
| Engineering | How is the product built, secured, tested, and operated? | Engineering |
| Delivery | What validated work is next and how is a release coordinated? | Strategy and delivery |
| Decision | Why was one consequential option selected? | Decisions |
| Evidence | What was observed or measured? | Evidence |
| Review | Did an artifact or release meet its existing contract, and what was learned? | Reviews |

No document may use a conclusion from another family as though it owns that conclusion. For example, a roadmap may sequence work, but it may not redefine product behavior; a review may identify a failure, but it may not silently rewrite the specification it assessed.

---

## 3. Authority Model

Authority flows downward. Information and evidence may flow upward to prompt a revision, but they do not silently override a higher-level document.

```text
Vision
  ↓
Documentation Architecture
  ↓
Product Model and Product Strategy
  ↓
Systems and Experience
  ↓
Feature Contracts and Design
  ↓
Engineering and Delivery
  ↓
Reviews, Evidence, and Decisions
```

The sequence describes authority, not a one-way workflow. Evidence, reviews, and decision records can identify that a lower document must change. They cannot amend the Vision. A conflict with the Vision means the lower document is invalid and must be corrected or retired.

### Subject authority

Each document is authoritative only within its responsibility:

- The Vision is authoritative on constitutional product intent.
- This document is authoritative on documentation structure and lifecycle.
- A product model is authoritative on its conceptual model.
- A system document is authoritative on its system boundaries and invariants.
- A feature behavior contract is authoritative on the observable behavior of that feature.
- An engineering architecture document is authoritative on its technical domain.
- A roadmap is authoritative on sequencing, not product definition.
- A decision record is authoritative on the historical decision it records, not on every document it cites.
- Evidence and reviews are authoritative on what they observed, not on what should be built next.

---

## 4. Documentation Layers

The durable documentation ecosystem uses the following folders. A folder is a responsibility boundary, not merely a filing preference.

| Folder | Owns | Must not contain |
|---|---|---|
| `00-constitution/` | Documentation governance and constitutional references | Product or implementation specifications |
| `01-product/` | Product model, canonical vocabulary, strategy, and success definitions | System implementation and feature behavior |
| `02-systems/` | Enduring product mechanisms and their semantic contracts | Page design, schemas, and roadmaps |
| `03-experience/` | Information architecture and cross-surface experience rules | Component tokens and feature implementation |
| `04-features/` | Bounded feature contracts and delivery artifacts | Reusable system definitions |
| `05-design/` | Shared visual, component, and content standards | Product strategy and engineering topology |
| `06-engineering/` | Technical, data, integration, trust, quality, and operations architecture | Product rationale or feature discovery |
| `07-strategy-and-delivery/` | Outcome sequencing and bounded release coordination | Feature specifications and retrospective findings |
| `08-decisions/` | Append-only records of consequential choices | Living specifications or raw research |
| `09-evidence/` | Research, measurement definitions, and factual reports | Roadmap commitments or undocumented interpretation |
| `10-reviews/` | Assessment against an existing contract and post-release learning | Replacement specifications or raw evidence stores |

---

### 4.1 Feature Dossier Structure

Each feature receives **one dossier** (folder) containing all knowledge about that bounded capability from decision through shipping and learning.

**Canonical standard:** [Feature Dossier Standard](../04-features/feature-dossier-standard.md)

**Complete structure:**
```
04-features/<feature-name>/                ← ONE dossier per feature
  ├── feature-brief.md                     ← Why (product decision)
  ├── behavior-contract.md                 ← What (the contract)
  ├── design/                              ← How it looks
  │   ├── <feature>-design-spec.md
  │   ├── <feature>-accessibility-spec.md
  │   └── <feature>-content-spec.md
  ├── implementation/                      ← How to build
  │   ├── delivery-design.md
  │   ├── <feature>-v1-runbook.md
  │   ├── <feature>-v1.1-runbook.md       ← Versioned per iteration
  │   └── migration-plan.md
  ├── validation/                          ← How to test
  │   ├── validation-plan.md
  │   ├── test-results-v1.md
  │   └── acceptance-checklist-v1.md
  ├── reviews/                             ← Pre-ship approval
  │   ├── design-review-YYYY-MM-DD.md
  │   ├── security-review-YYYY-MM-DD.md
  │   └── acceptance-review-YYYY-MM-DD.md
  ├── releases/                            ← What shipped when
  │   ├── v1.0-release-YYYY-MM-DD.md
  │   └── v1.1-release-YYYY-MM-DD.md
  ├── post-release/                        ← What we learned
  │   ├── v1-learning-record.md
  │   ├── v1-incident-log.md
  │   └── v1-usage-evidence.md
  └── decisions/                           ← Why we chose
      ├── 001-decision-title.md
      └── 002-decision-title.md
```

**Key principles:**
- **One dossier per feature:** The dossier is the folder, not a single document
- **Progressive creation:** Create subfolders only when you have documents for them
- **Versioned iterations:** New runbooks, test results, and learning records for each major version; don't update old ones
- **Append-only records:** Reviews, releases, learning records, and decisions are never edited after close
- **Lifecycle phases:** Decision → Design → Build → Test → Review → Release → Learn → Adapt

**Templates:** See `04-features/_templates/` for runbook, test-results, acceptance-checklist, review, release, and learning-record templates.

**Lifecycle guide:** See [start-here/complete-feature-dossier-lifecycle.md](../start-here/complete-feature-dossier-lifecycle.md) for detailed implementation guide.

---

## 5. Required Metadata

Every durable document must begin with the following fields:

```text
Status: Draft | Active | Superseded | Archived
Authority: The specific domain it governs
Owner: The role accountable for accuracy
Parent: The document from which it inherits
Children: Documents it constrains, if any
Last reviewed: YYYY-MM-DD
Review trigger: The event that requires reconsideration
```

Records with permanent historical value — decisions, completed studies, measurement reports, closed reviews, and post-release learning records — also include:

```text
Created: YYYY-MM-DD
Evidence links: Relevant sources
Disposition: Accepted | Superseded | Closed
```

Metadata identifies responsibility and lifecycle. It must not be used to restate the document’s substantive contents.

---

## 6. Writing and Reference Rules

### Link instead of repeat

When a higher-level document already owns a principle, definition, or decision, lower documents link to the exact heading rather than paraphrasing it.

### State the boundary

Every document begins by stating what it owns and what it does not own. This makes overlap visible before it becomes drift.

### Separate intent, contract, plan, and record

These four forms must never be collapsed:

- **Intent** states the desired outcome.
- **Contract** states what must be true.
- **Plan** states the proposed sequence of work.
- **Record** states what was decided, observed, or learned.

### Preserve historical truth

Accepted decision records, completed studies, measurement reports, reviews, and post-release learning records are append-only. Errors are corrected by a linked correction or superseding record, never by silently rewriting history.

### Use canonical vocabulary

Product terms must come from the product glossary. New terms require a glossary update before they become normative in another document.

### Keep evidence separate from interpretation

Observed facts belong in study and measurement records. Cross-record interpretation belongs in insight synthesis. A product or roadmap decision requires its own decision record.

---

## 7. Lifecycle

### Draft

A document is being developed and has no authority beyond its stated scope of exploration.

### Active

The document is the current authority for its defined responsibility.

### Superseded

A newer active document owns the same responsibility. The old document remains available with a direct link to its replacement.

### Archived

The document is historical reference only. It must not be used to make current decisions.

### Retirement rule

A document may be retired only when its responsibility has moved explicitly to one named replacement or is no longer needed. Deleting a document without resolving its responsibility creates institutional amnesia and is prohibited.

---

## 8. Change Control

The level of required review increases with authority.

| Document layer | Change rule |
|---|---|
| Vision | Immutable. It is never revised through normal documentation work. |
| Documentation architecture | Rare change; requires explicit confirmation that the change does not create duplicate authority. |
| Product, system, experience, design, and engineering architecture | Change requires a linked decision record and an impact check on child documents. |
| Feature contracts and delivery designs | Change requires affected parent and child links to be reviewed before implementation continues. |
| Roadmaps and release plans | Change requires updated evidence or a documented decision. |
| Evidence, reviews, and historical records | Never silently edited after close; use corrections or successor records. |

Any change to a parent document requires a child-impact review. The owner must identify whether each child remains valid, requires revision, or should be retired.

---

## 9. Creation Gate

Before creating a document, the author must answer:

1. What single question does this document answer?
2. Which existing document already owns the closest adjacent question?
3. Why is linking to that document insufficient?
4. What lower-level documents will inherit from this one?
5. What event will require this document to be reviewed or retired?

If the first question cannot be stated in one sentence, the document is not ready to exist. If an existing document already owns the answer, create a link, a record, or a section within that document instead of a new file.

---

## 10. Conflict Resolution

When two documents disagree:

1. Identify the responsibility each document claims.
2. Use the document with the narrower, valid subject authority.
3. If one document has exceeded its responsibility, remove or replace the conflicting claim from that document.
4. If both documents legitimately own adjacent parts of the question, create or revise a system interface contract.
5. Record consequential resolutions in `08-decisions/`.

The answer is never to maintain two competing sources of truth.

---

## 11. Discovery and Maintenance

The document map is the discovery index for active documentation. It must show each active document’s path, responsibility, status, owner, and parent.

Each folder maintains only an index of the documents it contains. Folder indexes do not summarize the contents of those documents.

Every active document is reviewed on its declared trigger. A review can confirm that the document remains accurate; it does not require a change for its own sake.

---

## 12. Templates, Registers, and Discovery Views

Templates, registers, and discovery views support the documentation system without becoming competing sources of truth.

| Artifact | Sole responsibility | Must not contain |
|---|---|---|
| Folder index | Makes the documents and starter artifacts within one folder discoverable. | A summary or replacement of a listed document. |
| Template | Provides a copyable structure for one future document or record type. | Normative requirements copied from its governing standard, factual records, or product decisions. |
| Register | Makes permanent records discoverable by stable identifier, status, owner, domain, and links. | The record's rationale, findings, or raw evidence. |
| Document map | Gives an organization-wide view of active normative documents and transitional or historical locations. | A second authority hierarchy or a summary of document contents. |

Templates are non-normative starter artifacts. They link to the active standard that governs their required contents and must be updated when that standard changes. They are excluded from the global document map because they are not authorities; their folder index makes them discoverable.

Folder indexes and the root documentation index are navigational views. They may list a document's title, responsibility, status, owner, parent, and location, but their listings never override the listed document. The global document map must show every active normative document's path, responsibility, status, owner, and parent.

---

## 13. Non-Goals

This document does not:

- restate or interpret the Vision;
- decide the product model or product strategy;
- prescribe feature behavior;
- define implementation details;
- replace decision records, evidence, or reviews; or
- create a requirement to produce documentation without a real responsibility to own.

Documentation exists to preserve clear reasoning and coordinated action. It is not an output to optimize for on its own.
