# Features Index

This is a non-normative directory index. Create an individual feature dossier only after a bounded capability enters discovery or delivery.

## Quick Start

**New to feature dossiers?**
1. Read [Feature Dossier Standard](./feature-dossier-standard.md) — Complete dossier structure and lifecycle
2. Read [Complete Feature Dossier Lifecycle](../start-here/complete-feature-dossier-lifecycle.md) — Detailed implementation guide with examples
3. Read [Implementing a Feature](../start-here/implementing-a-feature.md) — Quick-start guide (coming soon)
4. Use [Templates](./_templates/README.md) — Starter documents for your dossier

**Key Concept:** One dossier per feature = One folder with many documents (brief, contract, design, implementation, validation, reviews, releases, learning)

---

## Active Standards

| Document | Responsibility | Status | Owner | Parent |
|---|---|---|---|---|
| [Feature Dossier Standard](./feature-dossier-standard.md) | **Complete dossier structure and lifecycle** | Active | Product and documentation leadership | Documentation Architecture |
| [Feature Catalog](./feature-catalog.md) | Current implementation coverage, feature-domain status, and next documentation artifact | Active implementation reference | Product leadership | Information Structure and feature standards |
| [Feature Briefs](./feature-briefs.md) | Standard for deciding and scoping a bounded capability | Active | Product leadership | Product Strategy and systems |
| [Behavior Contracts](./behavior-contracts.md) | Standard for externally observable feature behavior | Active | Product leadership | Feature Briefs and systems |
| [Delivery Designs](./delivery-designs.md) | Standard for feature-specific technical approach and recovery | Active | Engineering leadership | Behavior Contracts and engineering architecture |
| [Validation Plans](./validation-plans.md) | Standard for pre-release assessment planning | Active | Product and engineering leadership | Feature and behavior contracts |

---

## Templates and Examples

| Resource | Purpose |
|---|---|
| [Templates](./_templates/README.md) | Copyable starter documents (brief, contract, design, validation, runbook, test-results, acceptance-checklist, review, release, learning-record) |
| [Examples](./_examples/complete-dossier-example/README.md) | Complete example dossier showing full structure (coming soon) |

---

## Understanding Feature Dossiers

A **feature dossier** is not a single document. It is the complete collection of all knowledge about one bounded feature, organized by purpose and lifecycle phase.

**Structure:**
```
<feature-name>/                     ← ONE dossier (folder) per feature
  ├── feature-brief.md              ← Why
  ├── behavior-contract.md          ← What
  ├── design/                       ← How it looks
  ├── implementation/               ← How to build (runbooks)
  ├── validation/                   ← How to test
  ├── reviews/                      ← Pre-ship approval
  ├── releases/                     ← What shipped when
  ├── post-release/                 ← What we learned
  └── decisions/                    ← Why we chose
```

**See:** [Feature Dossier Standard](./feature-dossier-standard.md) for complete details.
