# FlowOS Visual Design System v1.0

> **Historical.** Superseded by [DESIGN_SYSTEM.md](./DESIGN_SYSTEM.md) (v2.0) on 2026-07-10.
> Kept for context on why the surface model was first frozen — do not use for new UI decisions.

**Version:** 1.0  
**Date:** July 8, 2026  
**Status:** Superseded — Sessions 1–5 complete (2026-07-08)  
**Scope:** Application-wide surface hierarchy, chrome treatment, and elevation model  
**Related:** [globals.css](../../src/app/globals.css), [CODE_STANDARDS.md](./governance/CODE_STANDARDS.md), [PRINCIPLES.md](./governance/PRINCIPLES.md)  
**Decision:** [decision-log.md](../execution/logs/decision-log.md) — 2026-07-08 "Four-level surface hierarchy"  
**Implementation:** [m2-surface-hierarchy.md](../execution/runbooks/m2-surface-hierarchy.md)  
**Superseded by:** [DESIGN_SYSTEM.md](./DESIGN_SYSTEM.md) (v2.0)

---

## Vision

FlowOS should feel like a **workspace**, not a dashboard.

The UI should quietly disappear while the user's work becomes the primary visual focus.

Navigation exists to support productivity, not compete with it.

The interface should communicate hierarchy through **elevation, spacing, typography, and subtle surface differences**, rather than obvious color blocks.

### Core philosophy

**Content first. Chrome second.**

Every design decision in this document supports that principle.

---

## Design goals

### Primary goals

- Maximize focus on user content
- Reduce visual noise
- Make the application feel larger than it is
- Create premium software aesthetics
- Build a scalable design language for future modules

### Avoid

- Heavy dashboard appearance
- Large visible UI seams
- Multiple unrelated background colors
- Chrome attracting more attention than user data
- Artificial visual complexity

---

## Surface hierarchy

FlowOS should use **only four elevation surfaces**.

No additional background colors should be introduced unless there is a clear semantic reason.

| Level | Token | Color | Purpose |
|-------|-------|-------|---------|
| **0** | `--background` | `#0E111B` | Application background ΓÇö the infinite workspace |
| **1** | `--surface` | `#121826` | Application chrome ΓÇö sidebars, drawers, command palette |
| **2** | `--card` | `#1A2133` | Interactive content ΓÇö cards, modals, widgets |
| **3** | `--surface-hover` | `#232D45` | Temporary interaction feedback ΓÇö never permanent |

### Level 0 ΓÇö Application background

**Purpose:** The infinite workspace. Everything lives on top of this.

**Characteristics:** Darkest workspace. Calm. Minimal. Never draws attention.

**Used by:** Main canvas, empty areas, scroll regions, behind cards.

### Level 1 ΓÇö Application surface

**Purpose:** Application chrome.

**Characteristics:** Very subtle elevation above the background. Users should barely notice it.

**Used by:** Left sidebar, right sidebar, future top bar, command palette background, drawer backgrounds.

### Level 2 ΓÇö Card surface

**Purpose:** Interactive content.

**Characteristics:** Cards should always appear visually above the application surface.

**Used by:** Task card, habit card, timeline card, reflection, focus card, dashboard widgets, modals.

### Level 3 ΓÇö Interactive hover

**Purpose:** Temporary interaction feedback.

**Used by:** Hover, selected state, pressed state, drop target, keyboard focus.

**Rule:** Never use hover color as a permanent background.

---

## Layout regions

### Top bar

The top bar should **not** be treated as another floating surface. Instead, it should visually merge into the workspace. The application should feel like one continuous environment.

**Instead of:**

```
Top Bar
ΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇ
Main Content
```

**Use:**

```
Continuous Workspace
ΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇ
Top controls
Content
Cards
```

The user perceives one uninterrupted canvas.

| Property | Value | Reason |
|----------|-------|--------|
| Background | `var(--background)` | Navigation should not compete with content |
| **Not** | `var(--surface)` | ΓÇö |
| Divider | `border-bottom: 1px solid rgba(255,255,255,.04)` | Alignment without a visible seam ΓÇö should almost disappear |

### Left sidebar

**Purpose:** Persistent navigation.

| Property | Value |
|----------|-------|
| Background | `var(--surface)` |
| Border | `border-right: 1px solid rgba(255,255,255,.05)` |

No shadows. No gradients. No glassmorphism.

### Right sidebar

The right sidebar should match the left sidebar.

| Property | Value |
|----------|-------|
| Background | `var(--surface)` |
| Border | `border-left: 1px solid rgba(255,255,255,.05)` |

This creates symmetry. The current implementation makes the right panel appear disconnected because it uses a different elevation.

### Main workspace

| Property | Value |
|----------|-------|
| Background | `var(--background)` |

No borders. No artificial containers. Cards provide all structure.

---

## Card hierarchy and visual weight

Cards should become the **strongest visual objects**.

```
Background
  Γåô
Sidebar
  Γåô
Cards
  Γåô
Hover
  Γåô
Dropdown
  Γåô
Modal
```

Users naturally look at the cards first. This is desirable.

### Visual importance order

```
Cards
  Γåô
Focused interaction
  Γåô
Navigation
  Γåô
Application frame
  Γåô
Background
```

**Never:**

```
Navigation
  Γåô
Background
  Γåô
Cards
```

---

## Borders

Borders replace color differences. Instead of changing backgrounds dramatically, use subtle separators.

**Recommended:**

- `rgba(255,255,255,.05)`
- `rgba(255,255,255,.04)`

**Avoid:**

- Heavy outlines
- Bright borders
- Double borders
- Nested borders

---

## Shadows

Very restrained.

| Element | Shadow |
|---------|--------|
| Cards | `0 2px 12px rgba(0,0,0,.18)` |
| Modals | `0 12px 48px rgba(0,0,0,.35)` |
| Sidebars | None |
| Top bar | None |

---

## Elevation model

Stack order (top to bottom):

```
Modal
Dropdown
Tooltip
Hover
Cards
Sidebar
Background
```

Each level should feel intentional. Do not create random intermediate elevations.

---

## Future components

| Component | Background | Content |
|-----------|------------|---------|
| **Command palette** | Card | Backdrop: `rgba(0,0,0,.45)` |
| **AI assistant** | Surface | Conversation: card; response blocks: nested cards |
| **Calendar** | Background (canvas) | Events: cards; selection: hover |
| **Analytics** | Background | Charts: cards; metrics: cards; filters: surface |

---

## Why this works

This hierarchy creates three important psychological effects.

### 1. Larger workspace

Without a heavy top bar seam, the interface feels taller. Users perceive more working area.

### 2. Reduced cognitive load

The eye doesn't stop at artificial divisions. Attention naturally flows toward content.

### 3. Premium feeling

Most modern premium productivity software relies on:

- Small elevation changes
- Minimal borders
- Consistent spacing
- Restrained colors

ΓÇªrather than dramatic contrast.

---

## Inspiration

The design language aligns with principles seen in products such as:

Linear ┬╖ Raycast ┬╖ Arc Browser ┬╖ Notion Calendar ┬╖ Craft ┬╖ Superhuman ┬╖ Figma ┬╖ Vercel Dashboard

The goal is **not** to imitate any one product, but to adopt the common principles behind interfaces that feel calm, polished, and content-focused.

---

## Migration plan

| Phase | Work |
|-------|------|
| **1** | Standardize colors: background, surface, card, hover |
| **2** | Make both sidebars identical ΓÇö remove the lighter right sidebar |
| **3** | Convert the top bar to use the application background ΓÇö remove the visible seam, add only a subtle divider |
| **4** | Audit every component ΓÇö every UI element should map to one of the four surface tokens; no custom dark colors |
| **5** | Update design tokens (`--background`, `--surface`, `--card`, `--surface-hover`) so all components consume these variables |

---

## Final design principles

1. **Content is the product.** Navigation supports it but never dominates it.
2. **Use elevation, not color, to express hierarchy.**
3. **Keep the workspace visually continuous.** Avoid unnecessary seams and hard section breaks.
4. **Limit the palette.** Four surface tokens are enough for almost the entire application.
5. **Maintain consistency.** Every new component should fit into the same elevation system instead of introducing new shades or visual treatments.

Following these principles will give FlowOS a cohesive, premium visual identity that can scale from today's dashboard into a much larger productivity platform without feeling fragmented or visually noisy.

