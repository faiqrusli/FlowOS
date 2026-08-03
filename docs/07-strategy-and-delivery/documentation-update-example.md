# Documentation Update Example

**Purpose:** Concrete example of updating a document from "leadership" to role-based ownership  
**Created:** 2026-08-02  

---

## Example: Product Model Document

### BEFORE (Old Pattern)

```markdown
# Product Model

**Status:** Active  
**Authority:** Foundation of all product decisions  
**Owner:** Product leadership  
**Parent:** Vision · Documentation Architecture  
**Last reviewed:** 2026-08-01  

---

## Purpose

The product model defines FlowOS's core concepts, their relationships, and invariants...

[rest of document]
```

**Problems:**
- ❌ "Product leadership" is vague (who specifically?)
- ❌ No approval process documented
- ❌ No authority level specified
- ❌ Unclear who can modify vs. who must approve
- ❌ "Last reviewed" doesn't indicate updates

---

### AFTER (New Pattern)

```markdown
# Product Model

**Status:** Active  
**Authority:** Foundation of all product decisions  
**Owner:** Product Architect  
**Approval Required:** Founder  
**Parent:** Vision · Documentation Architecture  
**Last Updated:** 2026-08-02  

---

## Purpose

The product model defines FlowOS's core concepts, their relationships, and invariants...

---

## Document Ownership

### Owner
**Role:** Product Architect  
**Responsibility:** Maintain product model accuracy and coherence with Vision

The Product Architect owns this document and proposes changes based on:
- Evidence from product usage
- New feature requirements
- Clarifications needed for implementation
- Corrections to errors or ambiguities

### Modification Process

**Standard changes:**
1. Product Architect proposes changes (in PR or document)
2. Product Architect submits to Founder for approval
3. Founder reviews for Vision alignment
4. If approved: Product Architect merges changes
5. Product Architect updates "Last Updated" date
6. If consequential: Create decision record

**Emergency clarifications:**
- Product Architect can clarify ambiguities during sprint
- Must still get Founder approval before merging
- Document clarification in standup

**Consequential changes** (require decision record):
- Adding new core concepts
- Changing concept relationships
- Removing concepts
- Changing concept invariants
- Changes that affect existing features

### Authority Level

**Product Architect can (independent):**
- Draft proposed changes
- Add examples and use cases
- Clarify existing language
- Fix typos and formatting
- Reorganize sections for clarity

**Requires Founder approval:**
- All semantic changes to concepts
- All changes to relationships or invariants
- All additions or removals of concepts
- Anything that changes product behavior

### Related Role Documents
- [Product Architect Role](../12-team/active-6-role/product-architect.md) — Full role definition
- [Authority Matrix](../12-team/authority-matrix.md) — Authority levels

---

[rest of document content]
```

**Improvements:**
- ✅ Specific role: "Product Architect"
- ✅ Clear approval process documented
- ✅ Authority levels explicit
- ✅ Modification process step-by-step
- ✅ Related documents linked
- ✅ "Last Updated" shows when changed

---

## Example: Design System Architecture

### BEFORE

```markdown
# Design System Architecture

**Status:** Active  
**Owner:** Design leadership  
**Parent:** Experience Architecture · Documentation Architecture  
**Last reviewed:** 2026-08-01  

---

## Purpose

This document defines FlowOS's design system...

[rest of document]
```

**Problems:**
- ❌ "Design leadership" is vague
- ❌ No approval process
- ❌ No review process (should Product Architect review design contracts?)

---

### AFTER

```markdown
# Design System Architecture

**Status:** Active  
**Owner:** Design Architect  
**Review:** Product Architect (for product alignment)  
**Approval Required:** Founder  
**Parent:** Experience Architecture · Documentation Architecture  
**Last Updated:** 2026-08-02  

---

## Purpose

This document defines FlowOS's design system...

---

## Document Ownership

### Owner
**Role:** Design Architect  
**Responsibility:** Maintain design system coherence and guide implementation

The Design Architect owns this document and proposes changes to:
- Visual design tokens (colors, typography, spacing)
- Component specifications
- Interaction patterns
- Design principles

### Modification Process

**Standard changes:**
1. Design Architect proposes changes
2. Product Architect reviews (for product model alignment)
3. Design Architect submits to Founder for approval
4. Founder reviews
5. If approved: Design Architect merges changes
6. Design Architect updates "Last Updated" date
7. If consequential: Create decision record

**Why Product Architect review?**
- Design system must align with product model
- Component names should match product concepts
- Interaction patterns should match behavior contracts

**Consequential changes** (require decision record):
- Major visual system changes (color palette, typography scale)
- New interaction paradigms
- Breaking changes to component APIs
- Changes affecting existing implementations

### Authority Level

**Design Architect can (independent):**
- Add examples and documentation
- Clarify component usage
- Add component variants (within system rules)
- Fix typos and formatting
- Document implementation notes

**Requires Product Architect review + Founder approval:**
- Changes to design tokens
- New components or patterns
- Changes to component APIs
- Changes to design principles
- Breaking changes to existing components

### Related Role Documents
- [Design Architect Role](../12-team/active-6-role/design-architect.md) — Full role definition
- [Authority Matrix](../12-team/authority-matrix.md) — Authority levels
- [Approval Workflows](../12-team/active-6-role/README.md#communication-paths) — How approval works

---

[rest of document content]
```

**Improvements:**
- ✅ Specific role: "Design Architect"
- ✅ Review step added: "Product Architect reviews first"
- ✅ Clear approval chain: Design → Product review → Founder approval
- ✅ Rationale explained (why Product Architect reviews)
- ✅ Authority levels explicit

---

## Example: Multi-Owner Document (Behavior Contracts)

### BEFORE

```markdown
# Behavior Contracts

**Status:** Active  
**Owner:** Product, design, and engineering leadership  
**Parent:** Feature Briefs · Systems  

---

## Purpose

Behavior contracts define externally observable feature behavior...
```

**Problems:**
- ❌ Three "leadership" references (who is primary owner?)
- ❌ No clear workflow (who proposes, who reviews, who approves?)

---

### AFTER

```markdown
# Behavior Contracts

**Status:** Active  
**Owner:** Product Architect (primary), Design Architect & Engineering Architect (contributors)  
**Approval Required:** Founder  
**Parent:** Feature Briefs · Systems  
**Last Updated:** 2026-08-02  

---

## Purpose

Behavior contracts define externally observable feature behavior...

---

## Document Ownership

### Owner
**Primary Owner:** Product Architect  
**Responsibility:** Define what features must do (observable behavior)

**Contributors:**
- **Design Architect:** Reviews for design feasibility
- **Engineering Architect:** Reviews for technical feasibility

### Modification Process

**For new behavior contracts:**
1. Product Architect creates behavior contract (per feature brief)
2. Design Architect reviews (can this be designed?)
3. Engineering Architect reviews (can this be implemented?)
4. Product Architect incorporates feedback
5. Product Architect submits to Founder for approval
6. Founder approves or requests changes
7. If approved: Product Architect finalizes contract

**For changes to existing contracts:**
1. Product Architect proposes changes (based on evidence)
2. Implementation Engineer or Release Manager may propose (if ambiguity found)
3. Same review process as above
4. Create decision record if consequential

**During implementation:**
- If contract is ambiguous: Implementation Engineer escalates to Product Architect
- Product Architect clarifies and gets Founder approval
- Update contract with clarification

### Authority Level

**Product Architect can (independent):**
- Draft behavior contracts
- Add clarifying examples
- Fix typos and formatting
- Reorganize for clarity

**Design Architect can (review):**
- Request design feasibility changes
- Flag states not covered
- Suggest interaction improvements

**Engineering Architect can (review):**
- Request technical feasibility changes
- Flag error/recovery gaps
- Suggest observable behavior improvements

**Requires Founder approval:**
- All new behavior contracts
- All changes to existing contracts
- All scope expansions
- All behavior clarifications

### Related Role Documents
- [Product Architect Role](../12-team/active-6-role/product-architect.md)
- [Design Architect Role](../12-team/active-6-role/design-architect.md)
- [Engineering Architect Role](../12-team/active-6-role/engineering-architect.md)
- [Approval Workflows](../12-team/active-6-role/README.md#communication-paths)

---

[rest of document content]
```

**Improvements:**
- ✅ Primary owner clear: "Product Architect"
- ✅ Contributors identified: Design & Engineering Architects
- ✅ Multi-step review process documented
- ✅ Each role's contribution specified
- ✅ Escalation process included
- ✅ All three roles linked

---

## Template for Document Updates

### Standard Header Update

```markdown
# [Document Title]

**Status:** Active  
**Owner:** [Specific Role Name]  
**Approval Required:** [Founder / Role Name]  
**Parent:** [Parent documents]  
**Last Updated:** [YYYY-MM-DD]  
```

If multiple roles involved:
```markdown
**Owner:** [Primary Role] (primary), [Other Role] & [Other Role] (contributors)  
**Review:** [Reviewer Role] (for [reason])  
```

### Standard Ownership Section

```markdown
## Document Ownership

### Owner
**Role:** [Role Name]  
**Responsibility:** [What owner does with this document]

[Paragraph explaining what triggers changes to this document]

### Modification Process

**Standard changes:**
1. [Role] proposes changes
2. [Reviewer Role] reviews (if applicable)
3. [Owner Role] submits to Founder for approval
4. Founder reviews
5. If approved: [Owner Role] merges changes
6. [Owner Role] updates "Last Updated" date
7. If consequential: Create decision record

**Consequential changes** (require decision record):
- [Type of change 1]
- [Type of change 2]
- [Type of change 3]

### Authority Level

**[Role] can (independent):**
- [Action 1]
- [Action 2]
- [Action 3]

**Requires [Reviewer] review + Founder approval:**
- [Action requiring approval 1]
- [Action requiring approval 2]
- [Action requiring approval 3]

### Related Role Documents
- [Role Document Link] — Full role definition
- [Authority Matrix](../12-team/authority-matrix.md) — Authority levels
```

---

## Checklist for Each Update

When updating a document:

- [ ] Change "Owner:" from "leadership" to specific role name
- [ ] Add "Approval Required:" line
- [ ] Change "Last reviewed:" to "Last Updated:"
- [ ] Add "Document Ownership" section
- [ ] Document modification process (step-by-step)
- [ ] Specify authority levels (can do independently vs. needs approval)
- [ ] Add "Related Role Documents" links
- [ ] Search and replace all "leadership" references in body text
- [ ] Update any workflow descriptions to use role names
- [ ] Update "Last Updated" to current date
- [ ] Create PR with all changes
- [ ] Get Founder approval

---

## Common Patterns

### Pattern 1: Single Owner, Founder Approves
**Example:** Product Model, Product Glossary, Feature Catalog

```markdown
**Owner:** Product Architect  
**Approval Required:** Founder  

## Document Ownership
1. Product Architect proposes changes
2. Founder approves
3. Product Architect merges
```

### Pattern 2: Owner + Reviewer, Founder Approves
**Example:** Design System Architecture, Behavior Contracts

```markdown
**Owner:** Design Architect  
**Review:** Product Architect (for product alignment)  
**Approval Required:** Founder  

## Document Ownership
1. Design Architect proposes changes
2. Product Architect reviews
3. Design Architect submits to Founder
4. Founder approves
5. Design Architect merges
```

### Pattern 3: Co-Owners, Founder Approves
**Example:** Quality Architecture, Operations Architecture

```markdown
**Owner:** Engineering Architect & Release Manager (co-owners)  
**Approval Required:** Founder  

## Document Ownership
Either role can propose changes:
1. [Proposing Role] drafts changes
2. [Other Co-owner] reviews
3. [Proposing Role] submits to Founder
4. Founder approves
5. [Proposing Role] merges
```

### Pattern 4: Founder Owns (No Approval Needed)
**Example:** Vision, Decision Records

```markdown
**Owner:** Founder  
**Authority:** Final  

## Document Ownership
Founder has sole authority to modify this document.
No approval process required.
```

---

## Search & Replace Guide

Use these to update document bodies:

| Find | Replace With |
|------|--------------|
| product leadership | Product Architect |
| design leadership | Design Architect |
| engineering leadership | Engineering Architect |
| product and engineering leadership | Product Architect and Engineering Architect |
| product and design leadership | Product Architect and Design Architect |
| design and engineering leadership | Design Architect and Engineering Architect |
| product, design, and engineering leadership | Product Architect, Design Architect, and Engineering Architect |
| technical lead | Engineering Architect |
| product lead | Product Architect |
| quality leadership | Release Manager |
| operations leadership | Release Manager |

**Note:** Always review replacements in context - some may need different wording.

---

**Use this as reference when updating documents per the Documentation Update Plan.**
