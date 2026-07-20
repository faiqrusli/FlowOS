# FlowOS Pro Theme — Tokyo Night Warm Design System

| | |
|---|---|
| **Document type** | Visual Design System & Implementation Specification |
| **Status** | Active implementation contract — FlowOS Pro Tokyo Night Warm |
| **Version** | 1.1 |
| **Base inspiration** | Tokyo Night + Linear + Raycast |
| **Theme type** | Dark |
| **Design goal** | Calm, intelligent, focused productivity — UI disappears, work remains |
| **Date** | July 19, 2026 |
| **Related** | [Design System v3](./DESIGN_SYSTEM_V3.md) · [V3 Workspace](./DESIGN_SYSTEM_V3_WORKSPACE.md) · [V3 Interaction](./DESIGN_SYSTEM_V3_INTERACTION.md) · Historical themes: [archive/design/themes/](../archive/design/themes/) · [Code standards](./governance/CODE_STANDARDS.md) |

---

## Philosophy

Tokyo Night Warm is the locked dark foundation for FlowOS.

- Premium software
- Precision
- Clarity
- Calm professionalism

**Brand accent is Soft Indigo** — not amber, not teal experiments. Consistency beats novelty. Prefer polishing elevation, typography, spacing, and one signature interaction over swapping colors.

Brand recognition comes from the whole system: navy Tokyo Night surfaces, Soft Indigo accents, rounded cards, generous spacing, timeline, focus timer, utility rail, calm type.

---

## Core principles

### Deep navy foundation

Avoid charcoal gray. Everything is built from blue-black surfaces.

| Avoid | Prefer |
|---|---|
| `#282828` | `#1A1B26` |

### Soft elevation

Surfaces separate through brightness. Borders stay quiet — prefer fill hierarchy over border + shadow stacks.

```text
Canvas
  ↓
Section
  ↓
Card (base)
  ↓
Interactive (raised)
  ↓
Overlay
```

### Minimal accent usage

Only interactive / brand-critical elements receive Soft Indigo.

Semantic colors stay fixed: Green success · Amber warning · Red error · Cyan info.

---

## Surface hierarchy

### Level 0 — Canvas

```css
--surface-canvas: #12131A;
```

**Usage:** workspace, empty backgrounds, timeline shell. Must read clearly darker than cards so elevation works without borders.

### Level 1 — Navigation

```css
--surface-nav: #181921;
```

**Usage:** left sidebar chrome.

### Level 1a — Utility rail

```css
--surface-rail: #15161E;
```

**Usage:** right utility icon strip (no border).

### Level 1b — Side panels / drawer shell

```css
--surface-drawer: #1A1B26;
--surface-section: #181920;
```

**Usage:** right utility drawer, quiet inset wells. Not for primary Focus / Next Up panels on Today.

### Level 2 — Base cards

```css
--surface-base: #1C1E2C;
```

**Usage:** cards, Focus shell, docked Next Up Queue, lists, Kanban columns. Quiet lift above deep canvas.

### Level 3 — Raised / interactive

```css
--surface-raised: #22253A;
```

**Usage:** hovered / attention surfaces, selected task emphasis, kanban cards.

### Level 3.5 — Float (menus / dialogs)

```css
--surface-float: #2C3347;
```

**Usage:** context menus, dropdowns, popovers, dialogs. Slight lift above Base (~7 RGB) — elevated via soft shadow (`0 18px 45px`), not a bright highlight.

### Level 4 — Overlay

```css
--surface-overlay: #2A2E42;
```

**Usage:** Tasks/Habits dock shell. Same paint as Base; separation via border + shadow.

### Inset / editor (inside cards)

| Token | Value | Role |
|---|---|---|
| `--surface-inset` | `#23283A` | Inputs / fields (~4% darker than Base) |
| `--surface-editor` | `#24293C` | Notes / writing body (~2% darker than toolbar) |

---

## Interaction states

| Token | Value |
|---|---|
| `--surface-hover` | `#3B4261` |
| `--surface-active` | `#414868` |
| `--surface-selected` | `#565F89` |
| `--surface-disabled` | `#202230` |

---

## Border system

Three white opacities — cards stay readable; avoid outlining every nested control at full strength.

| Token | Value | Role |
|---|---|---|
| `--border-subtle` | `rgba(255,255,255,0.06)` | Primary workspace cards (Focus, Queue, …) |
| `--border-elevated` | `rgba(255,255,255,0.085)` | Menus, dialogs, popovers only |
| `--border-control` / `--input` | `rgba(255,255,255,0.04)` | Inputs, selects, compact controls |
| `--divider` | `rgba(255,255,255,0.02)` | Internal separators — secondary to spacing |
| `--border-strong` | `rgba(255,255,255,0.10)` | Rare emphasis only |
| `--border-focus` | Soft Indigo border | Focus / brand |

Prefer tonal contrast, whitespace, and elevation over outlines. Workspace card borders stay at `--border-subtle`; only elevated chrome uses `--border-elevated`. Dividers should nearly disappear — spacing carries hierarchy. Selected segmented controls use fill + soft shadow (`flow-selected`), not an inset border.

---

## Typography

| Token | Value | Use |
|---|---|---|
| `--text-primary` | `#C0CAF5` | Primary |
| `--text-secondary` | `#A9B1D6` | Secondary |
| `--text-muted` | `#787C99` | Muted |
| `--text-placeholder` | `#6A708D` | Placeholder |
| `--text-disabled` | `#565F89` | Disabled |
| `--text-inverse` | `#1A1B26` | Inverse (on accent buttons) |

---

## Primary brand — Soft Indigo (locked)

Slightly deeper than the trial `#7D8CFF` for premium integration with Tokyo Night.

| Token | Value |
|---|---|
| `--primary` | `#7B88EF` (~5% less saturated Soft Indigo) |
| `--primary-hover` | `#6D7BE8` |
| `--primary-active` | `#5F6EDB` |
| `--primary-soft` | `rgba(120, 134, 242, 0.12)` |
| `--primary-muted` | `rgba(120, 134, 242, 0.18)` |
| `--primary-border` | `rgba(120, 134, 242, 0.28)` |
| `--primary-ring` | `rgba(120, 134, 242, 0.45)` |
| `--primary-foreground` | `#1A1B26` |

**Feeling:** smart · modern · calm · focused

Do not introduce parallel brand variants. Stop accent color experiments; polish craft instead.

---

## Signature detail

Reserved. Prefer craft (elevation, type, spacing) over decorative glow. Do not apply radial glows behind the focus timer.

---

## Accent palette

| Token | Value |
|---|---|
| `--blue` | `#7AA2F7` |
| `--cyan` | `#7DCFFF` |
| `--green` | `#9ECE6A` |
| `--purple` | `#BB9AF7` |
| `--orange` | `#FF9E64` |
| `--red` | `#F7768E` |
| `--yellow` | `#E0AF68` |

---

## Semantic colors

| Role | Token | Value | Background |
|---|---|---|---|
| Success | `--success` | `#9ECE6A` | `--success-muted: rgba(158, 206, 106, 0.15)` |
| Warning | `--warning` | `#E0AF68` | `--warning-muted: rgba(224, 175, 104, 0.15)` |
| Danger | `--destructive` | `#F7768E` | `--destructive-muted: rgba(247, 118, 142, 0.15)` |
| Info | `--info` | `#7DCFFF` | `--info-muted: rgba(125, 207, 255, 0.15)` |

---

## Buttons

### Primary

| Property | Value |
|---|---|
| Background | `#7886F2` |
| Text | `#1A1B26` |
| Hover | `#6D7BE8` |
| Pressed | `#5F6EDB` |

### Secondary

| Property | Value |
|---|---|
| Background | `#252A3D` |
| Border | `#353B4D` |
| Text | `#C0CAF5` |
| Hover | `#31384E` |

### Ghost

| Property | Value |
|---|---|
| Text | `#A9B1D6` |
| Hover | `#31384E` |

---

## Inputs

| Property | Value |
|---|---|
| Background | `#1F2335` |
| Border | `#2E3446` |
| Hover | `#353B4D` |
| Focus | Soft Indigo ring |
| Text | `#C0CAF5` |
| Placeholder | `#6A708D` |

---

## Scrollbar

| Part | Value |
|---|---|
| Track | `#1A1B26` |
| Thumb | `#353B4D` |
| Hover | `#454C63` |

---

## Productivity modules

| Module | Color |
|---|---|
| Tasks | `#7AA2F7` |
| Habits | `#9ECE6A` |
| Schedule | `#7DCFFF` |
| Focus | `#7886F2` |
| Notes | `#BB9AF7` |
| Reflection | `#C0CAF5` |
| Dashboard | `#FF9E64` |

---

## Charts

| Series | Color |
|---|---|
| Series 1 | `#7AA2F7` |
| Series 2 | `#9ECE6A` |
| Series 3 | `#E0AF68` |
| Series 4 | `#BB9AF7` |
| Series 5 | `#7DCFFF` |
| Series 6 | `#FF9E64` |

---

## Shadows

Prefer fill hierarchy. Raised shadow is light; overlays keep stronger depth.

| Size | Value |
|---|---|
| Card | `none` |
| Raised | `0 1px 3px rgba(0, 0, 0, 0.22)` |
| Overlay | `0 8px 20px rgba(0, 0, 0, 0.40)` |
| Modal | `0 20px 48px rgba(0, 0, 0, 0.50)` |

---

## Radius

| Role | Value |
|---|---|
| Buttons | `8px` |
| Inputs | `10px` |
| Cards | `12px` |
| Dialogs | `16px` |
| Floating panels | `18px` |

---

## Opacity

| Role | Value |
|---|---|
| Disabled | `40%` |
| Hover overlay | `6%` |
| Selected overlay | `10%` |
| Pressed overlay | `16%` |

---

## Animation philosophy

Animations should feel crisp rather than soft.

| Motion | Duration |
|---|---|
| Hover | `120ms` |
| Buttons | `150ms` |
| Drawers | `220ms` |
| Dialogs | `240ms` |
| Sidebar collapse | `250ms` |

Use ease-out for entrances and ease-in for exits.

---

## Complete token reference

```css
/* Canvas → chrome → cards → interactive → float */
--surface-canvas:      #12131A;
--surface-nav:         #181921;
--surface-rail:        #15161E;
--surface-drawer:      #1A1B26;
--surface-section:     #181920;
--surface-base:        #1C1E2C;
--surface-raised:      #22253A;
--surface-overlay:     #292C3F;
--surface-float:       #2C3347;

/* Interaction */
--surface-hover:       #3B4261;
--surface-active:      #414868;
--surface-selected:    #565F89;

/* Borders — three opacities */
--border-subtle:       rgba(255, 255, 255, 0.06);
--border-elevated:     rgba(255, 255, 255, 0.085);
--border-control:      rgba(255, 255, 255, 0.04);
--divider:             rgba(255, 255, 255, 0.02);
--border-strong:       rgba(255, 255, 255, 0.10);
--border-focus:        rgba(120, 134, 242, 0.28);

/* Typography */
--text-primary:        #C0CAF5;
--text-secondary:      #A9B1D6;
--text-muted:          #787C99;
--text-placeholder:    #6A708D;
--text-disabled:       #565F89;
--text-inverse:        #1A1B26;

/* Brand — Soft Indigo locked */
--primary:             #7886F2;
--primary-hover:       #6D7BE8;
--primary-active:      #5F6EDB;
--primary-soft:        rgba(120, 134, 242, 0.12);
--primary-muted:       rgba(120, 134, 242, 0.18);
--primary-border:      rgba(120, 134, 242, 0.28);
--primary-ring:        rgba(120, 134, 242, 0.45);

/* Semantic */
--success:             #9ECE6A;
--warning:             #E0AF68;
--destructive:         #F7768E;
--info:                #7DCFFF;

/* Accent */
--blue:                #7AA2F7;
--cyan:                #7DCFFF;
--green:               #9ECE6A;
--purple:              #BB9AF7;
--orange:              #FF9E64;
--red:                 #F7768E;
--yellow:              #E0AF68;
```
