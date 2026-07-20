# FlowOS Visual Design System v2.0

> **Historical.** Superseded by [DESIGN_SYSTEM.md](./DESIGN_SYSTEM.md) (v3.0) on 2026-07-13.
> Kept as the Sessions 1–5 visual baseline and as context for the surface model it established. Do not use it for new UI decisions.

| | |
|---|---|
| **Version** | 2.0 |
| **Status** | Superseded — Sessions 1–5 baseline retained |
| **Owner** | FlowOS Product |
| **Date** | July 10, 2026 |
| **Supersedes** | [Visual Design System v1.0](./DESIGN_SYSTEM_v1.md) |
| **Superseded by** | [Visual Design System v3.0](./DESIGN_SYSTEM.md) |
| **Implementation baseline** | `33928bb` and the then-current [globals.css](../../src/app/globals.css) |

---

## Purpose and vision

v2.0 established FlowOS as a **workspace, not a dashboard**. Its core principle was:

> Content is the product. Chrome supports the product.

It defined visual architecture rather than a complete component system. It required hierarchy to come from layout, spacing, typography, elevation, and subtle surfaces—not bright colour, decorative glow, or nested cards.

The product workflow remained:

```text
Capture → Plan → Execute → Reflect
```

Every screen had one visual hero:

| Screen | Hero |
|---|---|
| Today | Focus |
| Schedule | Timeline |
| Notes | Document |
| Reflection | Reflection editor |
| Analytics | Primary visualization |

---

## Frozen Layer 0–5 model

v2.0 used six semantic layers. The first four were implemented by the canonical dark tokens below; interactive and feedback roles were semantic state layers.

| Layer | Role | Token / signal | Purpose |
|---|---|---|---|
| 0 | Navigation | `--surface` | Darkest application chrome |
| 1 | Workspace | `--background` | Page canvas and gutters |
| 2 | Standard surfaces | `--card` | Cards, lists, panels, forms, dialogs |
| 3 | Hero surfaces | `--surface-focus` | One primary workspace per screen |
| 4 | Interactive | `--primary`, `--selected` | Buttons, selected and active states |
| 5 | Feedback | `--success`, `--warning`, `--destructive` | Status, validation, destructive action |

| Role | v2 token/value |
|---|---|
| Navigation | `--surface`: `oklch(0.148 0.032 268)` ≈ `#060A18` |
| Workspace | `--background`: `oklch(0.171 0.030 268)` ≈ `#0A0F1D` |
| Standard surface | `--card`: `oklch(0.229 0.032 268)` ≈ `#161C2C` |
| Hero | `--surface-focus`: `color-mix(in oklab, var(--card) 94%, white 6%)` |
| Primary | `--primary`: `oklch(0.575 0.205 272)` |

Hover was never a resting layer. Standard cards used `--surface-card-hover`; Focus used `--surface-focus-hover`.

### v2 board and Today baseline

- Tasks groups and Kanban lists used the shared `--surface-board` well with softened `--border-board` outer (`/55`) and header (`/45`) borders.
- Kanban cards used Layer 2 `--card` with `border-border/30`; task rows remained flat and hover-led.
- Today Tasks, Habits, and Quick Capture used `--card` and a quiet `--border`.
- Today Focus was the Layer 3 hero: a 6% white lift, `--border-focus`, no blue fill, no glow, no permanent elevated shadow, and no canvas-coloured holes in its tab chrome.
- `--surface-kanban-card` was an unused experiment, not the shipped card fill.

---

## Workspace and chrome

v2.0 distinguished primary **pages** from contextual **Workspace Drawer** workspaces:

| Area | v2 rule |
|---|---|
| Main workspace | `--background`; continuous canvas; no artificial outer container |
| Top bar | Merged into `--background` with a quiet divider |
| Left sidebar / drawer chrome | `--surface`, `rgba(255,255,255,.05)` outer border, no shadow |
| Workspace Drawer content | `--card` on `--surface` chrome; 24–32px vertical card gaps |
| Notes drawer | One editor document card |
| Reflection drawer | Modular cards, no single mega-wrap |
| Task Details | Scannable section cards |

The navigation frame was recessed below the workspace. Cards represented units of work; they did not exist merely to create depth.

---

## v2 styling rules

- Use accent only for active navigation, primary buttons, timer, links, and selected states.
- Never use accent as a permanent panel surface.
- Borders define structure; depth comes from surfaces.
- Avoid heavy outlines, double borders, nested borders, gradients, glassmorphism, and decorative glow.
- Cards used restrained `0 2px 12px rgba(0,0,0,.18)` shadows; modals used `0 12px 48px rgba(0,0,0,.35)`.
- Navigation had no shadow.
- Hover did not translate cards or Focus.

---

## Frozen decisions and acceptance criteria

1. Content is brighter than navigation chrome.
2. Chrome frames work and does not compete with content.
3. Every screen has one visual hero.
4. Pages own workflows; the Workspace Drawer owns contextual work.
5. Cards represent interaction; task rows may remain flat within organisational surfaces.
6. Primary accent communicates interaction only; feedback colours are semantic only.
7. Borders provide structure, while shadows remain minimal.
8. Future modules must reuse the existing hierarchy rather than invent permanent surfaces.

v2.0 acceptance required every component to map to Layer 0–5, no custom dark backgrounds outside known tokens, and clear separation between navigation chrome, workspace, standard cards, and the screen hero.

---

## Historical implementation references

- [m2-surface-hierarchy.md](../execution/runbooks/m2-surface-hierarchy.md) — completed surface-hierarchy sessions
- [m2-visual-design-v2.md](../execution/runbooks/m2-visual-design-v2.md) — Sessions 1–5 baseline; later sessions discarded
- [decision-log.md](../execution/logs/decision-log.md) — 2026-07-10 Layer 0–5 freeze

v3.0 replaces this contract with the global semantic system and will be implemented only through its future dedicated migration runbook.
