# FlowOS Growth Theme — Everforest Dark Design System

| | |
|---|---|
| **Document type** | Visual Design System & Implementation Specification |
| **Status** | Draft candidate — not yet the active implementation contract |
| **Version** | 1.0 |
| **Base inspiration** | Everforest Dark + Arc Browser + Nature + Calm Productivity |
| **Theme type** | Dark |
| **Design goal** | A calm, nature-inspired workspace that encourages focus, reflection, learning, and sustainable productivity rather than urgency |
| **Date** | July 19, 2026 |
| **Related** | [Tokyo Night Warm](./DESIGN_SYSTEM_TOKYO_NIGHT_WARM.md) · [Gruvbox](./DESIGN_SYSTEM_GRUVBOX.md) · [Navy v3](./DESIGN_SYSTEM.md) · [Neutral Dark](./DESIGN_SYSTEM_NEUTRAL_DARK.md) · [Code standards](./governance/CODE_STANDARDS.md) |

---

## Philosophy

Everforest isn't simply "green."

It's about reducing mental fatigue through natural colors.

Where Tokyo Night feels like a premium software company, Everforest feels like a quiet library surrounded by trees.

The goal is to create software people enjoy opening every morning.

---

## Core principles

### Forest foundation

Avoid charcoal and navy. Surfaces have subtle green undertones.

| Avoid | Prefer |
|---|---|
| `#282828` | `#2B3339` |
| `#1A1B26` | |

### Organic contrast

Contrast should feel natural.

- No harsh white
- No neon colors
- Everything should feel slightly softened

### Growth first

Green represents growth, not success.

The interface should reinforce:

- learning
- habits
- reflection
- progress
- consistency

rather than speed.

---

## Surface hierarchy

### Level 0 — Canvas

```css
--surface-canvas: #2B3339;
```

**Usage:** workspace, timeline, empty areas.

### Level 1 — Navigation

```css
--surface-nav: #232A2E;
```

**Usage:** sidebar, header, utility rail.

### Level 2 — Base surface

```css
--surface-base: #343F44;
```

**Usage:** cards, panels, lists, Kanban.

### Level 3 — Raised

```css
--surface-raised: #3D484D;
```

**Usage:** hover, active cards, queue, timeline blocks.

### Level 4 — Overlay

```css
--surface-overlay: #475258;
```

**Usage:** dialogs, menus, popovers, dropdowns.

---

## Interaction states

| Token | Value |
|---|---|
| `--surface-hover` | `#4F5B58` |
| `--surface-active` | `#56635F` |
| `--surface-selected` | `#5F6D68` |
| `--surface-disabled` | `#2F373C` |

---

## Border system

| Token | Value | Role |
|---|---|---|
| `--border-subtle` | `#4A555B` | Subtle |
| `--border-default` | `#56635F` | Default |
| `--border-strong` | `#65736F` | Strong |
| `--border-focus` | `#A7C080` | Focus |
| `--border-danger` | `#E67E80` | Danger |

---

## Typography

| Token | Value | Use |
|---|---|---|
| `--text-primary` | `#D3C6AA` | Primary |
| `--text-secondary` | `#C1B59A` | Secondary |
| `--text-muted` | `#A6A08A` | Muted |
| `--text-placeholder` | `#8B9483` | Placeholder |
| `--text-disabled` | `#6C7A72` | Disabled |
| `--text-inverse` | `#2B3339` | Inverse (on accent buttons) |

---

## Primary brand

Forest green.

| Token | Value |
|---|---|
| `--primary` | `#A7C080` |
| `--primary-hover` | `#B6CC92` |
| `--primary-active` | `#8DAF65` |
| `--primary-soft` | `rgba(167, 192, 128, 0.16)` |

---

## Accent palette

| Name | Token | Value |
|---|---|---|
| Forest | `--green` | `#A7C080` |
| Moss | `--olive` | `#83C092` |
| Gold | `--gold` | `#DBBC7F` |
| Blue | `--blue` | `#7FBBB3` |
| Purple | `--purple` | `#D699B6` |
| Orange | `--orange` | `#E69875` |
| Red | `--red` | `#E67E80` |

---

## Semantic colors

| Role | Token | Value | Background |
|---|---|---|---|
| Success | `--success` | `#A7C080` | `--success-bg: rgba(167, 192, 128, 0.15)` |
| Warning | `--warning` | `#DBBC7F` | `--warning-bg: rgba(219, 188, 127, 0.15)` |
| Danger | `--danger` | `#E67E80` | `--danger-bg: rgba(230, 126, 128, 0.15)` |
| Info | `--info` | `#7FBBB3` | `--info-bg: rgba(127, 187, 179, 0.15)` |

---

## Buttons

### Primary

| Property | Value |
|---|---|
| Background | `#A7C080` |
| Text | `#2B3339` |
| Hover | `#B6CC92` |
| Pressed | `#8DAF65` |

### Secondary

| Property | Value |
|---|---|
| Background | `#343F44` |
| Border | `#56635F` |
| Text | `#D3C6AA` |
| Hover | `#3D484D` |

### Ghost

| Property | Value |
|---|---|
| Text | `#C1B59A` |
| Hover | `#3D484D` |

---

## Inputs

| Property | Value |
|---|---|
| Background | `#2F373C` |
| Border | `#4A555B` |
| Hover | `#56635F` |
| Focus | `#A7C080` |
| Text | `#D3C6AA` |
| Placeholder | `#8B9483` |

---

## Scrollbar

| Part | Value |
|---|---|
| Track | `#2B3339` |
| Thumb | `#56635F` |
| Hover | `#65736F` |

---

## Productivity modules

| Module | Color |
|---|---|
| Tasks | `#7FBBB3` |
| Habits | `#A7C080` |
| Schedule | `#83C092` |
| Focus | `#DBBC7F` |
| Notes | `#D699B6` |
| Reflection | `#A7C080` |
| Dashboard | `#E69875` |

---

## Charts

| Series | Color |
|---|---|
| Series 1 | `#A7C080` |
| Series 2 | `#DBBC7F` |
| Series 3 | `#7FBBB3` |
| Series 4 | `#83C092` |
| Series 5 | `#D699B6` |
| Series 6 | `#E69875` |

---

## Shadows

| Size | Value |
|---|---|
| Small | `0 2px 4px rgba(0, 0, 0, 0.28)` |
| Medium | `0 8px 18px rgba(0, 0, 0, 0.35)` |
| Large | `0 18px 42px rgba(0, 0, 0, 0.45)` |

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

Everforest should feel softer than Tokyo Night.

| Motion | Duration |
|---|---|
| Hover | `160ms` |
| Buttons | `180ms` |
| Cards | `220ms` |
| Dialogs | `260ms` |
| Sidebar | `280ms` |

Use ease-out almost everywhere.

Nothing should feel snappy. Everything should feel calm.

---

## Complete token reference

```css
/* Canvas */
--surface-canvas:      #2B3339;
--surface-nav:         #232A2E;
--surface-base:        #343F44;
--surface-raised:      #3D484D;
--surface-overlay:     #475258;

/* Interaction */
--surface-hover:       #4F5B58;
--surface-active:      #56635F;
--surface-selected:    #5F6D68;

/* Borders */
--border-subtle:       #4A555B;
--border-default:      #56635F;
--border-strong:       #65736F;
--border-focus:        #A7C080;

/* Typography */
--text-primary:        #D3C6AA;
--text-secondary:      #C1B59A;
--text-muted:          #A6A08A;
--text-placeholder:    #8B9483;
--text-disabled:       #6C7A72;
--text-inverse:        #2B3339;

/* Brand */
--primary:             #A7C080;
--primary-hover:       #B6CC92;
--primary-active:      #8DAF65;

/* Semantic */
--success:             #A7C080;
--warning:             #DBBC7F;
--danger:              #E67E80;
--info:                #7FBBB3;

/* Accent */
--green:               #A7C080;
--olive:               #83C092;
--gold:                #DBBC7F;
--blue:                #7FBBB3;
--purple:              #D699B6;
--orange:              #E69875;
--red:                 #E67E80;
```
