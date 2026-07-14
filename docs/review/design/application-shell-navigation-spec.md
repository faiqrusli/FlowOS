# FlowOS Application Shell Navigation System

**Status:** Recommended final specification  
**Scope:** Global FlowOS application shell  
**Applies to:** Today, Tasks, Habits, Schedule, Focus, Notes, Reflection, Task Details, and future utility panels  
**Implementation:** [m2-application-shell-navigation.md](../../execution/runbooks/m2-application-shell-navigation.md) on branch `tweak/today-focus-queue-layout`

This document replaces the previous fragmented navigation decisions. The goal is to stop the left and right rails from behaving like unrelated pieces of furniture humans kept moving around the room. Both rails should now follow one coherent shell system.

---

## 1. Core Design Principle

FlowOS has two different navigation systems, and they should not be designed identically.

**Left rail = primary application navigation**

The left side answers:

> Where am I in FlowOS?

It contains:

- FlowOS brand
- Today
- Tasks
- Habits
- Schedule
- Focus
- Notes
- Reflection
- User profile

**Right rail = contextual workspace utilities**

The right side answers:

> What supporting workspace do I want open beside my current page?

It contains:

- Task Details
- Notes
- Reflection

The right side is not another primary sidebar. It is a contextual utility switcher attached to an expandable workspace panel.

This distinction should remain visible in the design.

---

## 2. Global Application Shell

The desktop shell consists of:

```
┌──────────────┬──────────────────────────────┬──────────────────────┬──────────┐
│ LEFT NAV     │                              │                      │          │
│              │        MAIN WORKSPACE        │   UTILITY PANEL      │  RIGHT   │
│ Primary      │                              │   when expanded      │  RAIL    │
│ navigation   │                              │                      │          │
└──────────────┴──────────────────────────────┴──────────────────────┴──────────┘
```

When the utility panel is closed:

```
┌──────────────┬────────────────────────────────────────────────────┬──────────┐
│ LEFT NAV     │                  MAIN WORKSPACE                    │  RIGHT   │
│              │                                                    │  RAIL    │
└──────────────┴────────────────────────────────────────────────────┴──────────┘
```

The rails should feel like structural edges of the application, not floating cards.

---

## 3. Shared Global Header Alignment

This is the most important correction from the latest review.

The F logo must visually belong to the same horizontal system as the main top bar.

The previous oversized logo treatment made the F look like a separate sidebar header floating above the navigation. That breaks the application shell.

### Correct structure

```
┌──────────────┬────────────────────────────────────────────────────┬──────────┐
│      F       │ Wednesday, 15 July · 13% on track · 1/9 Tasks...  │          │
├──────────────┼────────────────────────────────────────────────────┼──────────┤
│              │                                                    │          │
│    Today     │                                                    │ Utility  │
│    Tasks     │                 Main content                       │ icons    │
│    Habits    │                                                    │          │
```

The logo cell and the global status bar must:

- share the same height
- share the same bottom divider
- align vertically
- feel like one continuous top row

The left navigation starts below that shared header row.

---

## 4. Global Header Dimensions

Use one frozen shell header height.

**Recommended**

```css
--shell-header-height: 68px;
```

A range of 64–72px is acceptable if the existing implementation requires adjustment, but once chosen, use the same value everywhere.

The structure should be:

```css
.shell-header {
  height: 68px;
}

.sidebar-brand-cell {
  height: 68px;
}

.main-status-header {
  height: 68px;
}

.utility-panel-header {
  height: 68px;
}
```

This creates one continuous horizontal architecture.

Do not use:

```css
brand-height: 120px;
```

That was the wrong direction. It separates the logo from the global header and creates unnecessary vertical dead space.

---

## 5. Left Navigation Rail

### 5.1 Purpose

The left rail is the permanent primary navigation system.

It should feel:

- stable
- quiet
- predictable
- compact
- structurally attached to the application

It should not visually compete with the workspace.

---

## 6. Left Rail Width

### Collapsed

**Recommended:**

```css
--sidebar-collapsed-width: 88px;
```

**Acceptable range:** 80–88px

Based on the current FlowOS screenshots, approximately 88px works well because it provides enough breathing room around 18px icons without making the rail feel oversized.

### Expanded

**Recommended:**

```css
--sidebar-expanded-width: 260px;
```

**Acceptable range:** 240–272px

The transition should change the horizontal dimension only.

The vertical position of navigation items must not change.

---

## 7. Left Brand Cell

### Critical rule

The brand area must have the same height in collapsed and expanded states.

```css
.sidebar-brand {
  height: var(--shell-header-height);
}
```

### Collapsed

```
┌────────────┐
│     F      │
└────────────┘
```

### Expanded

```
┌──────────────────────────┐
│    F     FlowOS          │
└──────────────────────────┘
```

The F mark must:

- remain the same size
- remain at the same Y coordinate
- remain vertically centered
- not grow when the sidebar expands
- not move vertically when the sidebar expands

---

## 8. F Logo Size

### Final recommendation

```css
width: 36px;
height: 36px;
```

Use the same 36×36px size in both states.

A 32×32px version is acceptable if the top bar becomes more compact, but 36px is the preferred size for the current FlowOS shell.

Do not use a large 48×48px or larger mark in the collapsed rail.

The larger mark creates three problems:

1. It dominates the global status header.
2. It forces excessive top spacing.
3. It makes the logo look like a separate sidebar object rather than part of the application header.

The visual relationship should be:

```
F logo       Date/status
36 × 36      ~16px primary text

        vertically centered
───────────────────────────
        shared divider
```

---

## 9. Expanded Brand Layout

**Recommended:**

```
[ F ]  FlowOS
```

**Specifications:**

| Element | Value |
|---------|-------|
| Logo | 36 × 36px |
| Gap | 12px |
| FlowOS text | 18–20px |
| Weight | 600 |

The expanded brand should not create a new taller header.

### Wrong

```
COLLAPSED                  EXPANDED

68px brand                 120px brand
    ↓                          ↓
Navigation                  FlowOS
                             huge gap
                             Navigation
```

### Correct

```
COLLAPSED                  EXPANDED

68px                        68px
[ F ]                       [ F ] FlowOS
─────                       ─────────────
Today                       Today
Tasks                       Tasks
```

---

## 10. Navigation Icon Size

Use:

```css
width: 18px;
height: 18px;
```

for both:

- left primary navigation
- right utility navigation

This is a good reduction from the previous oversized treatment.

The icon size should not change between:

- default
- hover
- active
- collapsed
- expanded

State is communicated through the container and color, not by resizing the icon.

---

## 11. Left Navigation Item Geometry

Each navigation destination should use a fixed row geometry.

**Recommended:**

| Property | Value |
|----------|-------|
| Collapsed hit area | 48 × 48px |
| Expanded row height | 48px |
| Icon | 18 × 18px |
| Border radius | 12–14px |

The center of the icon must remain at the same Y coordinate when the sidebar expands.

```
COLLAPSED             EXPANDED

   [ Today icon ]      [ Today icon ] Today
         │                    │
         └──── same Y ────────┘
```

The text appears horizontally. The icon does not move vertically.

---

## 12. Left Navigation Vertical Rhythm

The current rail should avoid giant gaps between navigation items.

**Recommended structure:**

```
GLOBAL HEADER
68px
────────────────

12–16px top breathing room

TODAY
48px

12–16px semantic gap

TASKS
48px
HABITS
48px
SCHEDULE
48px
FOCUS
48px
NOTES
48px
REFLECTION
48px

remaining flexible space

PROFILE
```

This is preferable to spacing every icon far apart across the entire rail.

The navigation should feel like a coherent group, not seven unrelated buttons distributed down a lift shaft.

---

## 13. HOME and WORKSPACE Labels

The expanded sidebar may use:

```
HOME
Today

WORKSPACE
Tasks
Habits
Schedule
Focus
Notes
Reflection
```

But the labels must not change the Y position of the actual navigation items when collapsing.

There are two valid approaches.

### Preferred approach: labels as expanded-state decoration

Keep the underlying navigation slots fixed.

When expanded:

```
HOME
Today

WORKSPACE
Tasks
Habits
...
```

When collapsed:

```
Today
Tasks
Habits
...
```

The implementation should use fixed navigation group geometry so expanding does not push everything downward unpredictably.

### Important

Do not blindly reserve large invisible label areas in the collapsed state if doing so creates awkward empty gaps.

The previous idea of permanently reserving:

- 20px label
- 12px gap

for every invisible section label can make the collapsed rail visually sparse and artificial.

The correct goal is not:

> Every hidden word must occupy invisible space.

The correct goal is:

> Primary navigation icons must remain stable during the transition.

Achieve that with fixed group containers, not random invisible vertical padding.

---

## 14. Recommended Left Navigation Group Structure

Use:

```
Header / Brand
    68px

Primary group
    Today

Workspace group
    Tasks
    Habits
    Schedule
    Focus
    Notes
    Reflection

Flexible spacer

Profile
```

Expanded labels can be positioned inside their group structure without changing the top coordinate of the group.

Conceptually:

```css
.nav-group {
  position: relative;
}

.nav-group-label {
  /* expanded presentation */
}

.nav-items {
  /* stable geometry */
}
```

If preserving exact icon coordinates between states is required, use CSS grid or absolute label placement rather than inserting/removing elements that affect document flow.

---

## 15. Left Active State

The current active Today state is directionally good, but the active treatment should be controlled.

### Collapsed

```
┌──────────────┐
│              │
│      ▦       │  subtle indigo surface
│              │
└──────────────┘

│ left accent indicator
```

Use:

- subtle accent-tinted background
- accent-colored icon
- optional thin left indicator

Avoid using an extremely bright filled button.

### Expanded

```
┌──────────────────────────┐
│  ▦    Today              │
└──────────────────────────┘
```

Use the same:

- background
- icon color
- text emphasis

The expanded and collapsed active states should clearly be the same component.

---

## 16. Left Active Indicator

The thin vertical accent on the far left can remain, but it should be restrained.

**Recommended:**

| Property | Value |
|----------|-------|
| Width | 3px |
| Height | 28–32px |
| Border radius | 0 4px 4px 0 |

Do not make it the full height of the navigation button.

It should reinforce selection, not become a second selection component competing with the active background.

---

## 17. Left Rail Colors

The collapsed rail should remain darker than the main workspace.

**Recommended hierarchy:**

| Surface | Role |
|---------|------|
| Left rail | darkest application surface |
| Main workspace | base workspace background |
| Expanded utility panel | slightly elevated surface |
| Cards | content surfaces |

The left rail should not change to a dramatically different color when expanded.

Collapsed and expanded states are the same component.

Only the width changes.

---

## 18. Profile Area

The profile control belongs at the bottom of the left navigation.

### Collapsed

Use a compact avatar: **40–44px**

Avoid oversized overlapping decorative rings unless they have a meaningful state.

The current avatar treatment has several competing outlines and accent shapes. Simplify it.

**Recommended:**

```
[ Avatar ]
```

with:

- one subtle border
- optional small status indicator
- hover background

### Expanded

```
[Avatar]  Ahmad Faiq...
          Student        ˅
```

The avatar must remain at the same Y position.

Expansion reveals text horizontally.

---

## 19. Right Utility Rail

### Purpose

The right utility rail is not primary navigation.

It controls contextual side workspaces:

- Task Details
- Notes
- Reflection

The right side has two states:

**COLLAPSED**

```
Main workspace | Utility rail
```

and:

**EXPANDED**

```
Main workspace | Utility panel | Utility rail
```

The utility rail must remain visible when a panel is open.

---

## 20. Right Rail Width

**Recommended:**

```css
--utility-rail-width: 64px;
```

**Acceptable:** 60–68px

Do not make it as wide as the left primary rail unless necessary.

The right rail has fewer items and is secondary.

---

## 21. Right Utility Icon Size

Use:

```css
width: 18px;
height: 18px;
```

The icon itself remains 18px.

**Recommended interactive target:** 40 × 40px

**Active target:** 40 × 40px

Do not use giant 56–72px active pills around an 18px icon. That was one reason the previous right rail looked clumsy.

---

## 22. Right Utility Rail Layout

**Recommended:**

```
┌────────┐
│   <    │  collapse panel, only when open
├────────┤
│        │
│   □    │  Task Details
│        │
│   ▢    │  Notes
│        │
│   ✎    │  Reflection
│        │
└────────┘
```

The utilities should form one compact cluster near the top.

**Recommended spacing:**

| Region | Value |
|--------|-------|
| Header region | same 68px shell header |
| Top content padding | 12–16px |
| Icon target | 40px |
| Gap | 8px |

Do not distribute three utility icons across the entire viewport height.

---

## 23. Right Rail Header

When the panel is expanded, the collapse control should align with the utility panel header.

```
┌──────────────────────────────────┬────────┐
│ Notes                         ↗  │   <    │
├──────────────────────────────────┼────────┤
```

The utility panel header and rail header must use:

```css
height: var(--shell-header-height);
```

This maintains the global shell grid.

---

## 24. Right Rail Active State

The active utility should use a compact selection treatment.

```
┌──────────┐
│    ▢     │
└──────────┘
```

**Specifications:**

| Property | Value |
|----------|-------|
| Target | 40 × 40px |
| Radius | 10–12px |
| Background | subtle accent surface |
| Icon | accent foreground |

Do not use:

- huge rounded rectangles
- glowing blocks
- multiple borders
- excessive saturation

The active state should be obvious but secondary to the actual panel content.

---

## 25. Right Rail Collapsed State

When no utility panel is open:

```
┌─────────────────────────────────────────────────────┬────────┐
│                                                     │        │
│                    MAIN WORKSPACE                   │   □    │
│                                                     │   ▢    │
│                                                     │   ✎    │
│                                                     │        │
└─────────────────────────────────────────────────────┴────────┘
```

The rail should use the same rail surface it uses when a panel is expanded.

Do not make the collapsed state dark and the expanded rail suddenly look like part of the lighter panel.

The rail is persistent.

---

## 26. Right Rail Expanded State

When a utility opens:

```
┌────────────────────────────┬────────────────────────┬────────┐
│                            │ Notes                  │   <    │
│                            ├────────────────────────┤        │
│       MAIN WORKSPACE       │                        │   □    │
│                            │    NOTES CONTENT       │   ▢    │
│                            │                        │   ✎    │
│                            │                        │        │
└────────────────────────────┴────────────────────────┴────────┘
```

The utility panel appears to the left of the persistent utility rail.

The rail should not transform into the panel.

This is important.

---

## 27. Right Utility Panel Surface

The panel should be visibly elevated from the main workspace.

**Recommended hierarchy:**

| Surface | Role |
|---------|------|
| Main workspace | `#` base background |
| Utility panel | slightly lighter elevated surface |
| Utility rail | darker persistent navigation surface |

The panel needs stronger visual separation than a single thin border.

Use a combination of:

1. 1px separator
2. subtle directional shadow
3. slightly elevated surface

---

## 28. Utility Panel Shadow

This directly addresses the original problem where the expanded panel looked flat and visually fused with the workspace.

Use a shadow on the left edge of the expanded utility panel.

Conceptually:

```css
.utility-panel {
  border-left: 1px solid var(--border-subtle);
  box-shadow:
    -12px 0 32px rgba(0, 0, 0, 0.18),
    -2px 0 8px rgba(0, 0, 0, 0.10);
}
```

Exact opacity should follow the FlowOS theme tokens.

The purpose is not to create a floating modal.

The shadow should communicate:

> This workspace has been layered above and beside the current page.

Do not add a heavy shadow around all four sides.

Use a directional left-edge shadow.

---

## 29. Utility Panel Width

**Recommended:**

| Panel | Width |
|-------|-------|
| Task Details | 440–520px |
| Notes | 480–600px |
| Reflection | 440–520px |

A shared default can be:

```css
--utility-panel-width: 500px;
```

If the viewport becomes constrained, use responsive clamping:

```css
width: clamp(420px, 32vw, 560px);
```

Notes may benefit from slightly more width because it contains an editor.

---

## 30. Utility Panel Header

Every utility panel should use the same shell:

```
┌─────────────────────────────────────────────┐
│ Notes                                    ↗  │
├─────────────────────────────────────────────┤
│                                             │
│ Content                                     │
```

**Header:**

| Property | Value |
|----------|-------|
| Height | 68px |
| Horizontal pad | 20–24px |
| Title | 16px / 600 |
| Action icons | 18px |

The title should not sit at a different Y position between:

- Task Details
- Notes
- Reflection

One shell component should control all three.

---

## 31. Right Rail and Panel Color Relationship

This was one of the visible inconsistencies in the previous implementation.

### Correct relationship

| Surface | Role |
|---------|------|
| Main workspace | darkest/base |
| Utility panel | elevated/lighter |
| Utility rail | persistent dark structural surface |

The right rail remains visually stable whether the panel is:

- closed
- showing Task Details
- showing Notes
- showing Reflection

Only the active icon changes.

The rail should not inherit the panel background when opened.

---

## 32. Opening Behavior

Clicking a utility icon:

### If no panel is open

Click Notes → Notes panel opens → Notes icon becomes active

### If another utility is open

Task Details open → Click Notes → panel content switches directly to Notes

Do not:

- close Task Details
- animate closed
- then reopen Notes

That creates unnecessary movement.

Switch the panel content directly.

### Clicking the currently active utility

**Recommended:**

Click active Notes icon → close Notes panel

This provides a natural toggle.

---

## 33. Panel Transition

**Recommended:**

| Property | Value |
|----------|-------|
| Duration | 200–250ms |
| Easing | ease-out |

The panel should:

- slide horizontally
- fade very slightly

Avoid:

- spring bouncing
- overshoot
- dramatic scale animations

This is a productivity workspace, not a game loot chest.

---

## 34. Main Workspace Resizing

When the utility panel opens, the main workspace should generally resize, not be covered.

**Desktop:**

- Main content shrinks
- Utility panel occupies dedicated width
- Rail remains fixed

This preserves:

- context
- drag-and-drop relationships
- visual continuity

For smaller desktop widths, the panel may overlay if the main workspace would become unusably narrow.

---

## 35. Main Content Minimum Width

Define a minimum usable workspace width.

Example:

```css
--main-workspace-min-width: 720px;
```

If:

```
viewport
- left rail
- utility panel
- utility rail
< minimum workspace width
```

then switch the utility panel to overlay mode.

This should be responsive behavior, not arbitrary page-specific logic.

---

## 36. Layer Hierarchy

**Recommended conceptual z-index:**

| Layer | z-index |
|-------|---------|
| Base workspace | 0 |
| Cards | 1 |
| Sticky page controls | 10 |
| Utility panel | 20 |
| Utility rail | 21 |
| Dropdowns/popovers | 50 |
| Modals | 100 |
| Toasts | 200 |

The utility rail should remain interactable above the panel surface.

---

## 37. Border System

Avoid putting strong borders around everything.

**Recommended:**

| Region | Border |
|--------|--------|
| Left rail | Right border only |
| Utility panel | Left separator |
| Right utility rail | Left border only if needed |
| Cards inside panel | Use subtle borders |

The shell itself should define the major structure.

---

## 38. Recommended Surface Hierarchy

The final hierarchy should be:

| Level | Surface |
|-------|---------|
| LEVEL 0 | Application background |
| LEVEL 1 | Primary workspace |
| LEVEL 2 | Navigation rails / persistent structural surfaces |
| LEVEL 3 | Utility panel / elevated workspace |
| LEVEL 4 | Cards, inputs, selected items, temporary overlays |

Avoid using the same background color for every layer.

But also avoid turning each layer into a completely different shade.

The difference should be subtle and intentional.

---

## 39. Left and Right Rail Relationship

The rails should share:

- 18px icon size
- consistent stroke weight
- similar interaction language
- similar muted default icon color
- similar active accent color

But they should not be identical.

| Left | Right |
|------|-------|
| Primary | Secondary |
| Wider | Narrower |
| Contains branding | No branding |
| Contains profile | No profile |
| Stronger active state | Smaller active target |
| — | Contextual |

---

## 40. Icon System

Use one icon family consistently.

**Recommended characteristics:**

| Property | Value |
|----------|-------|
| Size | 18px |
| Stroke | approximately 1.75px |
| Default color | muted foreground |
| Hover | stronger foreground |
| Active | accent foreground |

Avoid mixing icons with visibly different:

- stroke thickness
- optical size
- corner style

The Notes book icon, Reflection notebook icon, Tasks icon, and Schedule icon should feel like members of one system.

---

## 41. Tooltip Behavior

Collapsed rails require tooltips.

For the left rail:

Hover icon → "Tasks"

For the right rail:

Hover icon → "Notes"

**Recommended delay:** 400–600ms

Do not show tooltips instantly during normal mouse movement.

---

## 42. Accessibility

All icon-only controls require accessible labels.

Examples:

```html
<button aria-label="Open Notes">
<button aria-label="Open Reflection">
<button aria-label="Collapse utility panel">
<button aria-label="Open Tasks">
```

Active navigation:

```html
aria-current="page"
```

Active utility:

```html
aria-pressed="true"
```

Tooltips must not be the only accessible name.

---

## 43. Keyboard Navigation

**Recommended:**

| Key | Behavior |
|-----|----------|
| Tab | moves between navigation controls |
| Enter / Space | activates item |
| Escape | closes expanded utility panel if focus is inside it |

Focus indicators should be visible but restrained.

---

## 44. Responsive Behavior

### Large desktop

- Collapsed or expanded left navigation
- main workspace
- optional utility panel
- right utility rail

### Medium desktop

Prefer:

- collapsed left rail
- main workspace
- optional narrower utility panel
- right rail

### Small viewport

Utility panel becomes overlay.

The left expanded sidebar may also overlay instead of permanently consuming width.

---

## 45. State Persistence

**Recommended persistence:**

| State | Persistence |
|-------|-------------|
| Left sidebar expanded/collapsed | persist across sessions |
| Last open utility | optional persistence |
| Utility panel open/closed | persist during current session |

Do not automatically reopen a large utility panel on every future visit unless that behavior proves useful.

---

## 46. Final Frozen Dimensions

Use these as the implementation baseline:

| Element | Recommended |
|---------|-------------|
| Global shell header | 68px |
| Left rail collapsed | 88px |
| Left rail expanded | 260px |
| F logo | 36×36px |
| Navigation icon | 18×18px |
| Left nav row | 48px |
| Left active target | 48×48px collapsed |
| Right utility rail | 64px |
| Right utility icon | 18×18px |
| Right utility target | 40×40px |
| Utility panel default | 500px |
| Panel animation | 200–250ms |
| Nav item gap | 8px |
| Rail content top padding | 12–16px |

---

## 47. Final Left Rail Structure

```
┌─────────────────────────────────────┐
│                                     │
│          F       [FlowOS]           │  68px
│                                     │
├─────────────────────────────────────┤
│                                     │
│          TODAY                      │
│                                     │
│          TASKS                      │
│          HABITS                     │
│          SCHEDULE                   │
│          FOCUS                      │
│          NOTES                      │
│          REFLECTION                 │
│                                     │
│              flexible               │
│               space                 │
│                                     │
│          PROFILE                    │
│                                     │
└─────────────────────────────────────┘
```

Expanded state reveals:

```
F  FlowOS

HOME
▦ Today

WORKSPACE
☑ Tasks
↔ Habits
▦ Schedule
◷ Focus
▢ Notes
✎ Reflection

[Avatar] Ahmad Faiq...
         Student
```

But the expansion must preserve the stable vertical navigation architecture.

---

## 48. Final Right Utility Structure

### Closed

```
┌────────────────────────────────────────────┬────────┐
│                                            │        │
│                                            │   □    │
│              MAIN WORKSPACE                │   ▢    │
│                                            │   ✎    │
│                                            │        │
└────────────────────────────────────────────┴────────┘
```

### Notes open

```
┌──────────────────────┬─────────────────────┬────────┐
│                      │ Notes            ↗  │   <    │
│                      ├─────────────────────┤        │
│                      │                     │   □    │
│   MAIN WORKSPACE     │   NOTES CONTENT     │   ▢    │
│                      │                     │   ✎    │
│                      │                     │        │
└──────────────────────┴─────────────────────┴────────┘
```

The panel and rail are separate structural regions.

---

## 49. What Should Be Removed From the Current Design

Remove or correct:

- oversized F logo
- 120px artificial brand region
- different F sizes between collapsed and expanded states
- logo that does not align with the main top bar
- navigation icons moving vertically during expand/collapse
- giant gaps between collapsed navigation icons
- huge active utility buttons
- right rail changing its entire surface identity when a panel opens
- flat utility panel with no elevation from the main workspace
- utility icons spread unnecessarily across the viewport
- strong borders around every shell region
- invisible spacing hacks that create dead space merely to preserve labels

---

## 50. Implementation Rule: One Geometry, Two Presentations

This should be the central engineering rule for the left sidebar:

> Collapsed and expanded states must share the same structural geometry. Expansion reveals horizontal information. It should not redesign the vertical navigation.

For the left sidebar:

**Collapsed → Expanded**

- width changes
- text appears
- labels appear
- profile details appear

**BUT:**

- logo Y does not change
- logo size does not change
- Today Y does not change
- Tasks Y does not change
- Habits Y does not change
- Schedule Y does not change
- Focus Y does not change
- Notes Y does not change
- Reflection Y does not change
- Profile Y does not change

For the right utility system:

> Opening a panel adds a workspace surface to the left of the rail. The rail itself remains structurally stable.

---

## 51. Recommended Implementation Architecture

```
AppShell
├── PrimarySidebar
│   ├── SidebarBrand
│   ├── PrimaryNavigation
│   │   ├── Today
│   │   └── WorkspaceNavigation
│   └── UserProfile
│
├── MainWorkspace
│   ├── GlobalHeader
│   └── PageContent
│
└── UtilityWorkspace
    ├── UtilityPanel
    │   ├── UtilityPanelHeader
    │   └── UtilityPanelContent
    │
    └── UtilityRail
        ├── UtilityRailHeader
        └── UtilityNavigation
```

Do not let individual pages independently recreate the right rail.

Task Details, Notes, and Reflection should be content rendered inside the same UtilityPanel shell.

---

## 52. Final Visual Direction

The target should feel like:

```
Quiet application frame
        ↓
Stable navigation edges
        ↓
Main workspace receives attention
        ↓
Contextual utilities appear when needed
        ↓
Nothing jumps when navigation expands
```

### Strongest left-side correction

> The F logo is part of the global header row

It is not the top item of a vertically oversized sidebar region.

Use:

- 68px shared header
- 36×36px F logo
- same logo size in both states
- same Y coordinate in both states
- shared bottom divider with the status bar
- navigation begins below the divider

### Strongest right-side correction

> The utility rail is persistent; the utility panel is added beside it

Use:

- 64px persistent rail
- 18px icons
- 40px active targets
- compact top cluster
- stable rail background
- 500px elevated panel
- left-edge separator + subtle directional shadow

That gives FlowOS a much more coherent application shell. The left side becomes a proper primary navigation system, the right side becomes a proper contextual workspace system, and the main content finally sits between them instead of being squeezed between two competing sidebars.

---

## Related docs

- IA / route order (already shipped): [m2-global-navigation.md](../../execution/runbooks/m2-global-navigation.md)
- Visual tokens: [DESIGN_SYSTEM.md](../../foundation/DESIGN_SYSTEM.md)
- Feature inventory (nav): [FEATURE_INVENTORY.md](../../foundation/FEATURE_INVENTORY.md)
