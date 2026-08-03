# FlowOS Gruvbox Design System

| | |
|---|---|
| **Document type** | Visual Design System & Implementation Specification |
| **Status** | Superseded — see [DESIGN_SYSTEM_TOKYO_NIGHT_WARM.md](./DESIGN_SYSTEM_TOKYO_NIGHT_WARM.md) (2026-07-19) |
| **Version** | 1.0 |
| **Style** | Warm Retro Groove |
| **Primary theme** | Dark |
| **Design goal** | Long-session comfort, reduced eye fatigue, warm contrast, productivity-focused interfaces |
| **Date** | July 19, 2026 |
| **Related** | [Navy v3 contract](./DESIGN_SYSTEM.md) · [Neutral Dark](./DESIGN_SYSTEM_NEUTRAL_DARK.md) · [Code standards](./governance/CODE_STANDARDS.md) |

---

## Philosophy

Gruvbox is designed around warm earthy colors instead of cold blue-gray palettes.

Instead of maximizing contrast, Gruvbox creates visual comfort through:

- Warm neutral backgrounds
- Soft contrast hierarchy
- Muted saturation
- Carefully balanced accents
- Reduced visual fatigue

It feels more like paper under warm light than a glowing monitor.

---

## Core principles

### Warm dark

Avoid pure black. Instead use dark warm browns.

| Avoid | Prefer |
|---|---|
| `#000000` | `#282828` |
| `#111111` | `#32302F` |

### Soft contrast

Never jump directly from black to white. Contrast is built gradually:

```text
Canvas
  ↓
Surface
  ↓
Raised Surface
  ↓
Overlay
  ↓
Primary Text
```

### Earth tones

Accent colors should feel natural:

- Forest Green
- Warm Yellow
- Rust Orange
- Muted Aqua
- Dusty Purple

Nothing should feel neon.

---

## Surface hierarchy

### Level 0 — Canvas

Entire application background.

```css
--surface-canvas: #282828;
```

**Usage:** page background, workspace, large empty areas.

### Level 1 — Navigation

Navigation chrome.

```css
--surface-nav: #1F1F1F;
```

**Usage:** sidebar, header, bottom navigation.

### Level 2 — Base surface

Primary cards.

```css
--surface-base: #32302F;
```

**Usage:** cards, panels, lists, tables.

### Level 3 — Raised

Focused content.

```css
--surface-raised: #3C3836;
```

**Usage:** selected cards, active panel, hovered containers.

### Level 4 — Overlay

Highest elevation.

```css
--surface-overlay: #45403D;
```

**Usage:** dialog, modal, popover, dropdown, tooltip.

---

## Interaction states

| Token | Value |
|---|---|
| `--surface-hover` | `#504945` |
| `--surface-active` | `#5A524C` |
| `--surface-selected` | `#665C54` |
| `--surface-disabled` | `#3A3735` |

---

## Border system

| Token | Value | Role |
|---|---|---|
| `--border-subtle` | `#504945` | Subtle borders |
| `--border-default` | `#665C54` | Standard borders |
| `--border-focus` | `#D8A657` | Focused border |
| `--border-danger` | `#EA6962` | Danger border |
| `--border-success` | `#A9B665` | Success border |

---

## Typography

| Token | Value | Use |
|---|---|---|
| `--text-primary` | `#EBDBB2` | Main content |
| `--text-secondary` | `#D5C4A1` | Supporting content |
| `--text-muted` | `#BDAE93` | Descriptions |
| `--text-placeholder` | `#928374` | Input placeholders |
| `--text-disabled` | `#7C6F64` | Disabled UI |
| `--text-inverse` | `#282828` | Text on accent buttons |

---

## Accent palette

### Yellow (primary brand)

| Token | Value |
|---|---|
| `--yellow-500` | `#D8A657` |
| `--yellow-400` | `#E0B463` |
| `--yellow-600` | `#C18F43` |
| `--yellow-soft` | `rgba(216, 166, 87, 0.15)` |

### Green

| Token | Value |
|---|---|
| `--green-500` | `#A9B665` |
| `--green-400` | `#B7C97A` |
| `--green-600` | `#8EA34F` |

### Other accents

| Token | Value |
|---|---|
| `--aqua-500` | `#7DAEA3` |
| `--blue-500` | `#83A598` |
| `--orange-500` | `#E78A4E` |
| `--red-500` | `#EA6962` |
| `--purple-500` | `#D3869B` |

---

## Semantic colors

| Role | Token | Value | Background |
|---|---|---|---|
| Success | `--success` | `#A9B665` | `--success-bg: rgba(169, 182, 101, 0.15)` |
| Warning | `--warning` | `#D8A657` | `--warning-bg: rgba(216, 166, 87, 0.15)` |
| Danger | `--danger` | `#EA6962` | `--danger-bg: rgba(234, 105, 98, 0.15)` |
| Info | `--info` | `#7DAEA3` | `--info-bg: rgba(125, 174, 163, 0.15)` |

---

## Button system

### Primary

| Property | Value |
|---|---|
| Background | `#D8A657` |
| Text | `#282828` |
| Hover | `#E0B463` |
| Pressed | `#C18F43` |

### Secondary

| Property | Value |
|---|---|
| Background | `#32302F` |
| Hover | `#3C3836` |
| Border | `#504945` |
| Text | `#EBDBB2` |

### Ghost

| Property | Value |
|---|---|
| Text | `#D5C4A1` |
| Hover | `#3C3836` |

---

## Inputs

| Property | Value |
|---|---|
| Background | `#282828` |
| Border | `#504945` |
| Hover | `#665C54` |
| Focus | `#D8A657` |
| Placeholder | `#928374` |

---

## Scrollbar

| Part | Value |
|---|---|
| Track | `#282828` |
| Thumb | `#504945` |
| Hover | `#665C54` |

---

## Productivity module colors

| Module | Color |
|---|---|
| Tasks | `#D8A657` |
| Habits | `#A9B665` |
| Schedule | `#7DAEA3` |
| Focus | `#89B482` |
| Notes | `#83A598` |
| Reflection | `#D3869B` |
| Dashboard | `#E78A4E` |

---

## Charts

| Series | Color |
|---|---|
| Series 1 | `#D8A657` |
| Series 2 | `#A9B665` |
| Series 3 | `#7DAEA3` |
| Series 4 | `#83A598` |
| Series 5 | `#D3869B` |
| Series 6 | `#E78A4E` |

---

## Shadows

| Size | Value |
|---|---|
| Small | `0 1px 2px rgba(0, 0, 0, 0.30)` |
| Medium | `0 6px 16px rgba(0, 0, 0, 0.35)` |
| Large | `0 16px 40px rgba(0, 0, 0, 0.45)` |

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

## Complete token reference

```css
--surface-canvas:     #282828;
--surface-nav:        #1F1F1F;
--surface-base:       #32302F;
--surface-raised:     #3C3836;
--surface-overlay:    #45403D;

--surface-hover:      #504945;
--surface-active:     #5A524C;
--surface-selected:   #665C54;

--border-subtle:      #504945;
--border-default:     #665C54;
--border-focus:       #D8A657;

--text-primary:       #EBDBB2;
--text-secondary:     #D5C4A1;
--text-muted:         #BDAE93;
--text-placeholder:   #928374;
--text-disabled:      #7C6F64;
--text-inverse:       #282828;

--yellow:             #D8A657;
--green:              #A9B665;
--aqua:               #7DAEA3;
--blue:               #83A598;
--orange:             #E78A4E;
--red:                #EA6962;
--purple:             #D3869B;

--success:            #A9B665;
--warning:            #D8A657;
--danger:             #EA6962;
--info:               #7DAEA3;
```

---

## Note on authenticity

This documentation is inspired by Gruvbox rather than a verbatim specification of the official theme. The original Gruvbox is primarily a syntax-highlighting color scheme, not a comprehensive UI design system. This document extends its warm, low-fatigue philosophy into a complete set of UI tokens suitable for applications like FlowOS while staying faithful to its visual character.
