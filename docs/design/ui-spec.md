# UI Specification: Wireframes and Interaction Design

> Cross-references: [docs/design/visual-direction.md](visual-direction.md), [docs/design/memory-system.md](memory-system.md), [docs/design/combat.md](combat.md), [docs/design/classes.md](classes.md), [docs/design/progression.md](progression.md), [docs/design/items-catalog.md](items-catalog.md), [docs/world/vibrancy-system.md](../world/vibrancy-system.md)

## Overview

Every in-game GUI screen is specified here with layout, element positions, responsive behavior, color scheme, font choices, and interaction model. All screens are mobile-first (designed at 375px width) and scale up to desktop.

RPG-JS renders GUI as Vue component overlays on top of the PixiJS game canvas. All UI elements are HTML/CSS positioned over the canvas, not drawn inside it. This means standard web layout (flexbox, grid) and standard web accessibility apply.

---

## Global Design System

### Color Palette

| Token | Hex | Usage |
|-------|-----|-------|
| `--bg-primary` | #2A1810 | Dark parchment — primary panel background |
| `--bg-secondary` | #3C2818 | Lighter parchment — secondary panels, cards |
| `--bg-overlay` | rgba(20, 12, 6, 0.85) | Full-screen overlay backdrop |
| `--text-primary` | #D4C4A0 | Main body text — warm cream |
| `--text-secondary` | #A08C6C | Subdued text — labels, hints |
| `--text-accent` | #DAA520 | Highlight text — memory amber |
| `--text-bright` | #F5F0E6 | Bright text — headings, emphasis |
| `--border` | #5C4033 | Panel borders — dark leather |
| `--border-accent` | #DAA520 | Active borders — amber glow |
| `--btn-primary` | #6B4C30 | Button background — warm wood |
| `--btn-hover` | #8B6D4C | Button hover state |
| `--btn-active` | #DAA520 | Button active/pressed state |
| `--btn-disabled` | #4A3728 | Button disabled state |
| `--hp-bar` | #5C8C3C | HP bar fill — leaf green |
| `--sp-bar` | #4A8CB8 | SP bar fill — river blue |
| `--xp-bar` | #DAA520 | XP bar fill — amber gold |
| `--danger` | #CD5C5C | Low HP, errors — forge red |
| `--stagnation` | #B0C4DE | Stagnation/crystal effects |

### Typography

| Token | Font | Size (mobile) | Size (desktop) |
|-------|------|---------------|----------------|
| `--font-heading` | "Press Start 2P" (pixel font) | 14px | 16px |
| `--font-body` | "Press Start 2P" | 10px | 12px |
| `--font-small` | "Press Start 2P" | 8px | 10px |
| `--font-ui` | System sans-serif fallback | 12px | 14px |

"Press Start 2P" is a free Google Font that evokes 16-bit JRPG text. System fallback ensures readability if the pixel font fails to load.

### Spacing Scale

All spacing uses a 4px base unit:

| Token | Value |
|-------|-------|
| `--space-xs` | 4px |
| `--space-sm` | 8px |
| `--space-md` | 16px |
| `--space-lg` | 24px |
| `--space-xl` | 32px |

### Touch Target Minimum

All interactive elements must be at least **44x44 CSS pixels** (Apple HIG / WCAG minimum). Pixel-styled buttons can be visually smaller but must have expanded tap areas via padding or invisible hit zones.

### Animation Standard

- Menu open/close: 200ms ease-out slide
- Tab switch: 150ms cross-fade
- Bar fill: 300ms ease-in-out
- Button press: 100ms scale(0.95) + background color shift
- Fragment collect notification: 400ms slide-in from right, 3-second display, 300ms fade-out

---

## Screen 1: Title Screen

**When shown**: On game launch, before gameplay begins.

**Purpose**: Class selection. No seed input — seed is buried internally using `Date.now()` (see [memory-system.md](memory-system.md)).

### Layout (375px mobile)

```
+-----------------------------------+
|                                   |
|     MNEMONIC REALMS               |  ← Game title, centered
|     ~~~~~~~~~~~~~~                |     --font-heading, 18px
|                                   |
|   [Class carousel area]          |
|   ◄  [Knight portrait]  ►       |  ← 128x128 class portrait
|       "Knight Oathweave"         |     Class name below
|       Short description          |     2-line tagline
|                                   |
|   ○ ○ ● ○                        |  ← Dot indicators (4 classes)
|                                   |
|   ┌─────────────────────┐        |
|   │  Begin Your Journey │        |  ← Primary CTA button
|   └─────────────────────┘        |     --btn-primary, full width
|                                   |
|   [Continue]  [Settings]         |  ← Secondary row (if save exists)
|                                   |
+-----------------------------------+
```

### Elements

| Element | Type | Position | Details |
|---------|------|----------|---------|
| Game title | Text | Top center, 20% from top | "MNEMONIC REALMS" in `--font-heading` 18px, `--text-accent` |
| Subtitle | Text | Below title | "A World Unfinished" in `--font-body`, `--text-secondary` |
| Class carousel | Swipeable container | Center, 35-65% vertical | Horizontal swipe/arrow navigation. Shows one class at a time. |
| Class portrait | Image | Centered in carousel | 128x128 pixel art portrait of the selected class. From [spritesheet-spec.md](spritesheet-spec.md). |
| Class name | Text | Below portrait | `--font-heading` 14px, `--text-bright` |
| Class tagline | Text | Below name | 2 lines max, `--font-body`, `--text-primary`. E.g., "A warrior bound by remembered oaths." |
| Stat preview | Bar group | Below tagline | 4 mini-bars showing ATK/INT/DEF/AGI relative strengths per class |
| Dot indicators | Navigation dots | Below carousel | 4 dots, active = `--text-accent`, inactive = `--text-secondary` |
| Arrow buttons (◄ ►) | Buttons | Left/right of portrait | 44x44 tap target. Cycle classes. Desktop: also responds to arrow keys. |
| "Begin Your Journey" | Button | Bottom center | Full-width (minus margins). `--btn-primary` bg, `--text-bright` text. |
| "Continue" | Button | Below CTA | Half-width left. Only visible if a save file exists. |
| "Settings" | Button | Below CTA | Half-width right. Opens settings overlay. |

### Interaction

- **Swipe left/right** on mobile to cycle classes (touch gesture)
- **Arrow keys** on desktop to cycle classes
- **Tap portrait** to see expanded class info (skills preview, memory twist summary)
- **"Begin Your Journey"** creates the game with the selected class and a buried seed (`Date.now()`). No seed input is shown to the player.
- **"Continue"** loads the most recent save.

### Desktop Scaling (768px+)

- Layout shifts to side-by-side: class info panel on left, portrait on right
- Class portraits scale to 192x192
- All 4 class thumbnails visible as a horizontal row (click to select, no carousel)

### Background

- Animated PixiJS canvas showing a slowly brightening landscape (muted → normal palette cycle over 30 seconds)
- Subtle memory mote particles drifting upward

---

## Screen 2: HUD Overlay

**When shown**: Always visible during overworld exploration. Hidden during full-screen menus and combat.

**Purpose**: Show critical gameplay info without obscuring the game world.

### Layout (375px mobile)

```
+-----------------------------------+
| [HP bar] [SP bar]   [Fragment ✦8] |  ← Top bar, semi-transparent
|                                   |
|                                   |
|     (Game world visible)          |
|                                   |
|                                   |
|                                   |
|                          [Mini    |
|                           Map]    |  ← Bottom-right corner
|                     [Menu] [Map]  |  ← Action buttons
+-----------------------------------+
```

### Elements

| Element | Type | Position | Details |
|---------|------|----------|---------|
| HP bar | Progress bar | Top-left | `--hp-bar` fill. Shows current/max. Pulses red (`--danger`) below 25%. Width: 90px. |
| SP bar | Progress bar | Right of HP bar | `--sp-bar` fill. Shows current/max. Width: 90px. |
| Character name | Text | Above HP bar | `--font-small`, `--text-secondary`. Player name + "Lv.XX". |
| Fragment counter | Badge | Top-right | Amber diamond icon (✦) + count. `--text-accent`. Pulses with 400ms glow animation when new fragment collected. |
| Mini-map | Canvas element | Bottom-right corner | 80x80px. Shows immediate area with player dot (amber), NPC dots (green), exit indicators (white arrows). Semi-transparent background. |
| Menu button | Icon button | Bottom-right, above mini-map | Parchment scroll icon. Opens main menu. 44x44 tap area. |
| Map button | Icon button | Left of menu button | Compass icon. Opens full zone map. 44x44 tap area. |
| Zone name | Text | Top-center | Appears for 3 seconds on zone entry, then fades. `--font-body`, `--text-bright`. |
| Vibrancy indicator | Small icon | Right of zone name | Tiny colored dot: gray (Muted), green (Normal), gold (Vivid). |

### Interaction

- **Tap HP/SP bars** to open character status screen
- **Tap fragment counter** to open memory collection grid
- **Tap mini-map** to open full zone map
- **Tap menu button** to open main menu
- All HUD elements use `pointer-events: none` on their container except for interactive elements — ensures tapping the game world passes through to the canvas

### Opacity

- HUD sits at 85% opacity by default
- Fades to 40% opacity during NPC dialogue (so dialogue panel is unobstructed)
- Fully hidden during combat, cutscenes, and full-screen menus

### Desktop Scaling

- HP/SP bars widen to 120px
- Mini-map expands to 120x120px
- Additional info shown: XP bar below HP/SP, companion HP if in party

---

## Screen 3: Combat GUI

**When shown**: During combat encounters. Full-screen overlay.

**Purpose**: Display enemies, party status, and command selection.

### Layout (375px mobile)

```
+-----------------------------------+
|                                   |
|      [Enemy sprites area]        |  ← Top 40% of screen
|      Centered, up to 4 enemies   |
|                                   |
|-----------------------------------+
| PC1 ████░░ HP  │ Companion       |  ← Party status (mid strip)
|     ███░░░ SP  │ ████░░ HP       |
+-----------------------------------+
|                                   |
|  ┌──────┐ ┌──────┐ ┌──────┐     |  ← Command buttons
|  │Attack│ │Skill │ │ Item │     |     (bottom 35%)
|  └──────┘ └──────┘ └──────┘     |
|  ┌──────┐ ┌──────┐              |
|  │Defend│ │ Flee │              |
|  └──────┘ └──────┘              |
|                                   |
+-----------------------------------+
```

### Elements

| Element | Type | Position | Details |
|---------|------|----------|---------|
| Combat backdrop | Full-screen bg | Behind all elements | `--bg-primary` (#2A1810) with soft vignette at edges. "Remembered battle" aesthetic. |
| Enemy display area | Sprite container | Top 40% | Enemies rendered as sprites from [spritesheet-spec.md](spritesheet-spec.md). Centered horizontally. Bosses take full width. |
| Enemy HP bar | Progress bar | Below each enemy sprite | Thin bar (2px height), `--danger` fill. Only appears after first hit on that enemy. |
| Enemy name | Text | Above targeted enemy | `--font-small`, `--text-primary`. Shows on tap/select. |
| Turn order bar | Icon row | Top of screen, horizontal | Small character/enemy icons in turn order left-to-right. Active combatant highlighted with `--border-accent`. |
| Party status strip | Panel | Middle, full width | Dark panel showing each party member's HP/SP bars, name, and level. |
| Player HP | Progress bar | In party strip | `--hp-bar` fill. Numeric display "HP: 120/150". Pulses red below 25%. |
| Player SP | Progress bar | In party strip | `--sp-bar` fill. Numeric display "SP: 35/50". |
| Player status icons | Icon row | Right of HP/SP bars | Small icons for active buffs/debuffs (Poison = purple skull, Stasis = blue crystal, etc.) |
| Companion status | Bars | Right section of party strip | Same format as player, slightly smaller. Only shown when companion is in party. |
| Command buttons | Button grid | Bottom 35% | 5 buttons in 3+2 grid. Each 44px tall minimum. `--btn-primary` bg, `--text-bright` text. |
| Attack | Button | Grid position 1 | Selects enemy target, then executes basic attack. |
| Skill | Button | Grid position 2 | Opens skill submenu (list of available skills with SP cost). |
| Item | Button | Grid position 3 | Opens item submenu (list of usable items with quantities). |
| Defend | Button | Grid position 4 | Immediate action, no submenu. 50% damage reduction, +5 SP. |
| Flee | Button | Grid position 5 | Attempts escape. Grayed out (`--btn-disabled`) against bosses. |
| Damage numbers | Floating text | Over target | Animated numbers that float upward and fade. White = physical, blue = magical, green = healing, amber = memory effect. |

### Skill Submenu

When "Skill" is tapped, the command buttons are replaced by a scrollable skill list:

```
+-----------------------------------+
| Skills:              [Back ←]    |
|                                   |
| ┌─────────────────────────────┐  |
| │ Oath Strike    0 SP   SE    │  |  ← Skill name, cost, target type
| │ Guardian Shield 8 SP  SA    │  |
| │ Vow of Steel   12 SP  S    │  |
| │ ▼ (scroll for more)        │  |
| └─────────────────────────────┘  |
+-----------------------------------+
```

Each skill row shows: name, SP cost, target type abbreviation (SE/AE/SA/AA/S). Skills with insufficient SP are dimmed (`--btn-disabled`). Tapping a skill selects a target (if applicable), then executes.

### Item Submenu

Same layout as skill submenu. Shows usable items with quantity. Items with 0 quantity are hidden (not dimmed).

### Enemy Targeting

When selecting a target (after choosing Attack or a targeted Skill), enemy sprites gain a pulsing amber outline. Tap an enemy to confirm the target. On mobile, swiping left/right cycles between enemies; on desktop, arrow keys cycle.

### Interaction Flow

1. Turn begins → command buttons active
2. Tap "Attack" → targeting mode → tap enemy → attack resolves
3. Tap "Skill" → submenu → tap skill → targeting (if needed) → skill resolves
4. Tap "Item" → submenu → tap item → targeting (if healing an ally) → item used
5. After all party members have acted, enemies take turns (automated, no player input)
6. Repeat until victory or defeat

### Desktop Scaling

- Layout expands: enemy area takes 50% height, more breathing room
- Command buttons become a single horizontal row of 5
- Keyboard shortcuts: A=Attack, S=Skill, I=Item, D=Defend, F=Flee, 1-5 for skills/items

---

## Screen 4: Dialogue Panel

**When shown**: During NPC conversations, cutscenes, and tutorial sequences.

**Purpose**: Display speaker name, dialogue text, and player response options.

### Layout (375px mobile)

```
+-----------------------------------+
|                                   |
|    (Game world visible above)     |
|                                   |
+-----------------------------------+
| [Speaker portrait]                |
| LIRA                              |  ← Speaker name, --text-accent
| "The world remembers through     |
|  us. Every fragment we collect   |  ← Dialogue text, typewriter
|  is a piece of what was — and    |
|  what can be again."             |
|                          [▼]     |  ← Advance indicator
+-----------------------------------+
```

### Elements

| Element | Type | Position | Details |
|---------|------|----------|---------|
| Panel background | Container | Bottom 40% of screen | `--bg-primary` with `--border` top edge. Slight transparency (95% opacity). |
| Speaker portrait | Image | Top-left of panel | 48x48 pixel portrait. Only shown for named NPCs. Procedural NPCs use a generic icon. |
| Speaker name | Text | Right of portrait | `--font-heading` 12px, `--text-accent` (#DAA520 amber). |
| Dialogue text | Text | Main panel area | `--font-body`, `--text-primary`. Typewriter effect: 30ms per character. |
| Advance indicator | Icon | Bottom-right of panel | Pulsing amber down-arrow (▼). Indicates "tap to continue". |
| Response options | Button list | Replaces dialogue text | When choices appear, 2-4 buttons vertically stacked. `--btn-primary` bg. |

### Interaction

- **Tap anywhere** on the dialogue panel (or game screen) to advance text
- **Tap during typewriter** to instantly complete the current line
- **Response buttons** appear below the completed dialogue text when a choice is required
- **No hover states** — all interaction is tap-based (mobile-first)

### Typewriter Settings

- Speed: 30ms per character (can be adjusted in Settings)
- Punctuation pauses: period = 200ms, comma = 100ms, ellipsis = 400ms
- "Skip all" not available during first playthrough of a dialogue. Available on repeat viewings.

### Desktop Scaling

- Panel height reduces to 30% of screen (more game world visible)
- Speaker portrait scales to 64x64
- Text area widens with max-width: 640px centered

---

## Screen 5: Main Menu

**When shown**: When player taps the menu button on the HUD or presses Escape.

**Purpose**: Navigation hub for all non-combat game systems.

### Layout (375px mobile)

```
+-----------------------------------+
| MENU                     [X]     |
+-----------------------------------+
|                                   |
|  ┌─ Status ──────────────────┐   |
|  │ [Portrait] Knight Lv.15  │   |
|  │ HP: 150/150  SP: 50/50   │   |
|  │ XP: ████████░░ 1,200/2,025│  |
|  └───────────────────────────┘   |
|                                   |
|  ┌─────────┐  ┌─────────┐       |
|  │Inventory│  │Equipment│       |
|  └─────────┘  └─────────┘       |
|  ┌─────────┐  ┌─────────┐       |
|  │Memories │  │  Quests │       |
|  └─────────┘  └─────────┘       |
|  ┌─────────┐  ┌─────────┐       |
|  │  Save  │  │Settings │       |
|  └─────────┘  └─────────┘       |
|                                   |
+-----------------------------------+
```

### Elements

| Element | Type | Position | Details |
|---------|------|----------|---------|
| Header | Text + close button | Top | "MENU" in `--font-heading`, Close (X) button top-right. |
| Status card | Info panel | Top section | Player portrait (64x64), class name, level, HP/SP bars, XP progress bar. |
| Companion card | Info panel | Below player (if companion active) | Companion portrait, name, HP bar. Smaller than player card. |
| Menu grid | Button grid | Center | 6 buttons in 2x3 grid. Each button 44px tall, icons + labels. |
| Inventory button | Grid button | Row 1, Col 1 | Backpack icon. Opens inventory/consumables screen. |
| Equipment button | Grid button | Row 1, Col 2 | Shield icon. Opens equipment screen. |
| Memories button | Grid button | Row 2, Col 1 | Fragment (✦) icon. Opens memory collection grid. |
| Quests button | Grid button | Row 2, Col 2 | Scroll icon. Opens quest log. |
| Save button | Grid button | Row 3, Col 1 | Floppy disk icon (retro!). Saves game. |
| Settings button | Grid button | Row 3, Col 2 | Gear icon. Opens settings overlay. |

### Interaction

- Each button opens a sub-screen (detailed below)
- Close (X) or swipe-down dismisses the menu
- On desktop, Escape key also dismisses

---

## Screen 6: Inventory / Consumables

**When shown**: From main menu "Inventory" button.

**Purpose**: View and use consumable items and key items.

### Layout (375px mobile)

```
+-----------------------------------+
| ◄ Inventory              Gold: 450|
+-----------------------------------+
| [Consumables] [Key Items]        |  ← Tab bar
+-----------------------------------+
|                                   |
| ┌─ Minor Potion ──────── x5 ──┐ |
| │ Restores 50 HP               │ |
| │              [Use]           │ |
| └──────────────────────────────┘ |
|                                   |
| ┌─ Antidote ──────────── x3 ──┐ |
| │ Cures Poison                 │ |
| │              [Use]           │ |
| └──────────────────────────────┘ |
|                                   |
| (scrollable list)                |
+-----------------------------------+
```

### Elements

| Element | Type | Position | Details |
|---------|------|----------|---------|
| Back button (◄) | Button | Top-left | Returns to main menu. |
| Gold display | Text | Top-right | Gold coin icon + amount. `--text-accent`. |
| Tab bar | Tab group | Below header | "Consumables" and "Key Items" tabs. Active tab: `--border-accent` bottom border. |
| Item cards | Scrollable list | Main area | Each card: item name, quantity, 1-line description, [Use] button. |
| Item icon | Image | Left of item name | 16x16 pixel icon per item type. |
| Use button | Button | Right side of card | Only on consumable items. `--btn-primary`. Disabled outside combat for combat-only items. |
| Empty state | Text | Center | "No items yet." in `--text-secondary` if inventory is empty. |

### Key Items Tab

Key items cannot be used manually — they're story triggers. Each card shows: name, description, how it was obtained. No [Use] button.

---

## Screen 7: Equipment

**When shown**: From main menu "Equipment" button.

**Purpose**: Equip/unequip weapons and armor. View stat changes.

### Layout (375px mobile)

```
+-----------------------------------+
| ◄ Equipment                       |
+-----------------------------------+
|  [Player sprite]                  |
|  Knight Lv.15                     |
|                                   |
|  Weapon: [Iron Sword      ▼]    |  ← Dropdown selector
|  ATK: 25 → 30 (+5)              |  ← Stat change preview
|                                   |
|  Armor:  [Chain Mail       ▼]    |
|  DEF: 20 → 22 (+2)              |
|                                   |
|  Accessory: [Empty         ▼]    |
|                                   |
+------- Stats Summary ────────────+
| ATK: 28  INT: 12  DEF: 22       |
| AGI: 15  HP: 150  SP: 50        |
+-----------------------------------+
```

### Elements

| Element | Type | Position | Details |
|---------|------|----------|---------|
| Player sprite | Image | Top center | 64x64 player class sprite (current equipment reflected if possible). |
| Equipment slots | Dropdown selectors | Center section | 3 slots: Weapon, Armor, Accessory. Tap to open item picker. |
| Stat preview | Text | Below each slot | Shows stat change: green (+X) for improvement, red (-X) for downgrade. |
| Stats summary | Panel | Bottom | Full stat block with current values after equipment changes. |
| Item picker | Modal overlay | Covers bottom half | Scrollable list of equippable items for the selected slot. Each shows item name + stat change. |

---

## Screen 8: Memory Collection Grid

**When shown**: From main menu "Memories" button or tapping the HUD fragment counter.

**Purpose**: View collected memory fragments, sort/filter them, and access the remix interface.

### Layout (375px mobile)

```
+-----------------------------------+
| ◄ Memories              ✦ 23/60  |
+-----------------------------------+
| [All] [Joy] [Sorrow] [Awe] [Fury]|  ← Emotion filter tabs
+-----------------------------------+
|                                   |
|  ✦✦   ✦✦✦  ✦     ✦✦✦✦  ✦✦      |  ← Fragment grid
|  Joy   Awe  Calm  Fury   Sorrow  |     (visual grid, not list)
|  Fire  Wind  —    Light  Water   |
|                                   |
|  ✦✦   ✦✦✦✦✦ ✦✦   ✦✦✦  ✦        |
|  Joy   Fury   Awe  Calm  Sorrow  |
|  Earth  —    Dark  Fire  Wind    |
|                                   |
|  (scrollable grid)               |
|                                   |
+-----------------------------------+
| [Remix Fragments]                |  ← Bottom action button
+-----------------------------------+
```

### Elements

| Element | Type | Position | Details |
|---------|------|----------|---------|
| Back button (◄) | Button | Top-left | Returns to previous screen. |
| Fragment counter | Text | Top-right | "✦ 23/60" — collected out of max per playthrough. `--text-accent`. |
| Emotion filter | Tab row | Below header | 5 tabs: All, Joy (gold), Sorrow (purple), Awe (green), Fury (red). Active tab colored. "Calm" included under "All". |
| Fragment grid | Grid | Main area | CSS Grid: 5 columns on mobile, 8 on desktop. Each cell is a 56x56 card. |
| Fragment card | Tappable cell | Grid position | Shows: potency stars (✦ repeated), emotion color as card background tint, element icon (small). Named fragments show a short title. |
| Selected fragment | Highlighted card | Same position | Tapped fragment gains `--border-accent` glow. Detail panel slides up from bottom. |
| Fragment detail panel | Slide-up panel | Bottom 40% | Shows: full name (or "Unnamed Fragment"), source description, emotion, element, potency stars, and [Select for Remix] button. |
| Remix button | Button | Bottom fixed | "Remix Fragments" — opens remix interface. Disabled if fewer than 2 fragments collected. |
| Empty state | Text | Center | "Explore the world to discover memory fragments." |

### Fragment Card Design

Each card is colored by emotion:

| Emotion | Card Tint | Border |
|---------|-----------|--------|
| Joy | Warm gold tint (#FFD700 at 15%) | Gold border |
| Sorrow | Purple tint (#7B68EE at 15%) | Purple border |
| Awe | Green tint (#66CDAA at 15%) | Green border |
| Fury | Red tint (#CD5C5C at 15%) | Red border |
| Calm | Blue tint (#87CEEB at 15%) | Blue border |

Element is shown as a small icon in the card corner: flame (Fire), droplet (Water), leaf (Earth), swirl (Wind), sun (Light), moon (Dark), circle (Neutral).

### Sorting

Default sort: by recency (newest first). Tap column header to sort by potency (highest first) or emotion (grouped). Sort indicator shows current mode.

---

## Screen 9: Memory Remix Interface

**When shown**: From "Remix Fragments" button on the memory collection grid.

**Purpose**: Combine 2-3 memory fragments into a more powerful one. This is permanent — consumed fragments are gone.

### Layout (375px mobile)

```
+-----------------------------------+
| ◄ Remix                          |
+-----------------------------------+
|                                   |
|  Input Fragments:                |
|  ┌────┐  ┌────┐  ┌────┐         |
|  │ ✦✦ │  │ ✦✦✦│  │ +  │         |  ← Drag targets / tap to add
|  │ Joy │  │ Awe│  │Add │         |
|  └────┘  └────┘  └────┘         |
|                                   |
|         ═══╤═══                  |
|            ▼                     |  ← Arrow/merge indicator
|         ┌──────┐                 |
|         │  ??  │                 |  ← Result preview
|         │ ✦✦✦  │                 |
|         │ ???  │                 |
|         └──────┘                 |
|                                   |
| Result: ~✦✦✦ Inspiration/Fire    |  ← Predicted result
|                                   |
| ┌───────────────────────────────┐|
| │ ⚠ This is permanent. Input   │|  ← Warning text
| │   fragments will be consumed. │|
| └───────────────────────────────┘|
|                                   |
| [Cancel]           [Remix Now]   |  ← Action buttons
+-----------------------------------+
```

### Elements

| Element | Type | Position | Details |
|---------|------|----------|---------|
| Input slots | Tappable cards | Top area | 3 slots. First 2 required, third optional. Tap empty slot (+) to open fragment picker. Tap filled slot to remove. |
| Fragment picker | Modal | Overlays bottom half | Filtered list of available fragments. Same card design as collection grid. |
| Merge indicator | Visual | Center | Downward arrow (═══╤═══▼) showing inputs combining into output. |
| Result preview | Card | Center-bottom | Shows predicted output: potency (average of inputs + 1), emotion (based on combination rules from [memory-system.md](memory-system.md)), element. Question marks until at least 2 inputs are selected. |
| Result explanation | Text | Below preview | "Joy + Awe → Inspiration, ✦✦✦" — plain text showing the combination logic. |
| Warning text | Alert panel | Below result | Amber border, warning icon. "This is permanent. Input fragments will be consumed." Always visible. |
| Cancel button | Button | Bottom-left | `--btn-primary`. Returns to collection grid. No fragments consumed. |
| Remix Now button | Button | Bottom-right | `--btn-active` (amber). Disabled until 2+ inputs selected. Tap triggers the remix with a visual animation. |

### Remix Animation

When "Remix Now" is tapped:
1. Input cards slide toward the center merge point (300ms)
2. Cards swirl together with particle effect (500ms) — see FX-02 from [spritesheet-spec.md](spritesheet-spec.md)
3. Flash of amber light (200ms)
4. Result card appears in the center with a gentle pulse (400ms)
5. "Fragment Created!" text appears briefly
6. Return to collection grid with new fragment highlighted

### Interaction

- Tap empty slot → fragment picker opens (only fragments not already in a slot)
- Tap filled slot → removes fragment back to inventory
- Result preview updates in real-time as slots change
- "Remix Now" requires confirmation via the tap (the warning is always visible, no extra confirmation dialog)

---

## Screen 10: Quest Log

**When shown**: From main menu "Quests" button.

**Purpose**: Track active, completed, and available quests.

### Layout (375px mobile)

```
+-----------------------------------+
| ◄ Quests                         |
+-----------------------------------+
| [Active] [Completed] [God Quests]|  ← Tab bar
+-----------------------------------+
|                                   |
| ┌─ Main Quest ──────────────────┐|
| │ ★ Find the Source of          │|
| │   Stagnation                  │|  ← Active quest with objective
| │   Objective: Reach the        │|
| │   Heartfield Stagnation Zone  │|
| │   Zone: Heartfield (South)    │|
| └───────────────────────────────┘|
|                                   |
| ┌─ Side Quest ──────────────────┐|
| │ ○ Deliver herbs to the        │|
| │   Marsh Hermit                │|
| │   NPC: Vash (Shimmer Marsh)   │|
| └───────────────────────────────┘|
|                                   |
+-----------------------------------+
```

### Elements

| Element | Type | Position | Details |
|---------|------|----------|---------|
| Tab bar | Tabs | Below header | "Active", "Completed", "God Quests" (4 god recall chains). |
| Quest cards | List | Main area | Each card: quest type icon (★ main, ○ side, ✦ god), title, current objective, location hint. |
| Quest type icon | Icon | Left of title | ★ gold = main quest, ○ white = side quest, ✦ colored = god quest (emotion color). |
| Quest detail | Expandable | Tap card | Expands to show full description, reward preview, involved NPCs. |
| Completed quests | Grayed list | "Completed" tab | Same cards but `--text-secondary` color, checkmark overlay. |
| God Quests tab | Special section | Third tab | Shows 4 god quest chains: Resonance, Verdance, Luminos, Kinesis. Each shows progress (locked/available/in progress/complete). |

---

## Screen 11: Shop Interface

**When shown**: When interacting with a shop NPC (Khali, Hark, Millbrook specialty shop, traveling merchants).

**Purpose**: Buy and sell items.

### Layout (375px mobile)

```
+-----------------------------------+
| ◄ Khali's Shop        Gold: 450  |
+-----------------------------------+
| [Buy] [Sell]                      |  ← Tab bar
+-----------------------------------+
|                                   |
| ┌─ Minor Potion ──── 50g ──────┐ |
| │ Restores 50 HP         [Buy] │ |
| └───────────────────────────────┘ |
|                                   |
| ┌─ Antidote ──────── 30g ──────┐ |
| │ Cures Poison           [Buy] │ |
| └───────────────────────────────┘ |
|                                   |
| ┌─ Iron Sword ──── 100g ───────┐ |
| │ ATK +10               [Buy] │ |
| └───────────────────────────────┘ |
|                                   |
+-----------------------------------+
```

### Elements

| Element | Type | Position | Details |
|---------|------|----------|---------|
| Shop name | Text | Top-left | NPC shop name. `--font-heading`. |
| Gold display | Text | Top-right | Current gold. Updates on purchase/sale. |
| Buy/Sell tabs | Tabs | Below header | Switch between buying and selling inventory. |
| Item list | Scrollable list | Main area | Each item: name, price, 1-line stat/effect, [Buy] button. |
| Buy button | Button | Right of item | `--btn-primary`. Disabled if insufficient gold (grayed + price in `--danger`). |
| Sell tab items | Same layout | Sell mode | Shows player's sellable items. Price = 50% of buy price. [Sell] button. |
| Stat comparison | Text | Below item name (equipment only) | Shows stat diff vs currently equipped item. Green (+) / Red (-). |
| Quantity selector | Counter | Replaces [Buy] for stackable items | [-] [1] [+] buttons + [Confirm]. Only for consumables. |

---

## Screen 12: Save Screen

**When shown**: From main menu "Save" button.

**Purpose**: Save game progress.

### Layout (375px mobile)

```
+-----------------------------------+
| ◄ Save Game                       |
+-----------------------------------+
|                                   |
| ┌─ Save Slot 1 ────────────────┐ |
| │ Knight Lv.15 — Shimmer Marsh │ |
| │ Played: 8h 23m               │ |
| │ Fragments: 23/60             │ |
| │ Last saved: 2 min ago        │ |
| │                    [Save ▶]  │ |
| └───────────────────────────────┘ |
|                                   |
| ┌─ Save Slot 2 ────────────────┐ |
| │ [Empty]            [Save ▶]  │ |
| └───────────────────────────────┘ |
|                                   |
| ┌─ Save Slot 3 ────────────────┐ |
| │ [Empty]            [Save ▶]  │ |
| └───────────────────────────────┘ |
|                                   |
+-----------------------------------+
```

### Elements

3 save slots. Each shows: class, level, current zone, play time, fragment count, last saved timestamp. Overwriting an occupied slot shows a confirmation dialog: "Overwrite save? This cannot be undone."

Auto-save occurs on zone transitions and after boss defeats, using a separate auto-save slot (not visible in the save screen but loaded as an option on the title screen's "Continue").

---

## Screen 13: Settings

**When shown**: From title screen or main menu "Settings".

### Layout (375px mobile)

```
+-----------------------------------+
| ◄ Settings                        |
+-----------------------------------+
|                                   |
| BGM Volume                       |
| [──────●──────────] 70%          |  ← Slider
|                                   |
| SFX Volume                       |
| [────────────●────] 85%          |
|                                   |
| Text Speed                       |
| [Slow] [Normal] [Fast]          |  ← Radio buttons
|                                   |
| Screen Size                      |
| [Fit] [Pixel Perfect] [Full]    |
|                                   |
| [Reset to Defaults]             |
|                                   |
+-----------------------------------+
```

### Elements

| Element | Type | Details |
|---------|------|---------|
| BGM Volume | Slider | 0-100%. Default 70%. |
| SFX Volume | Slider | 0-100%. Default 85%. |
| Text Speed | Radio buttons | Slow (50ms/char), Normal (30ms/char), Fast (15ms/char). |
| Screen Size | Radio buttons | Fit (scale to viewport), Pixel Perfect (integer scaling), Full (stretch). |
| Reset to Defaults | Button | Restores all settings. Confirmation dialog. |

---

## Screen 14: Game Over

**When shown**: When all party members reach 0 HP in combat.

**Purpose**: Allow retry without excessive penalty.

### Layout (375px mobile)

```
+-----------------------------------+
|                                   |
|                                   |
|      The memory fades...         |  ← Centered text
|                                   |
|      (BGM-GAMEOVER plays)        |
|                                   |
|  ┌──────────────────────────┐    |
|  │     Retry Battle         │    |  ← Primary: restart the fight
|  └──────────────────────────┘    |
|  ┌──────────────────────────┐    |
|  │     Load Save            │    |  ← Secondary: load save file
|  └──────────────────────────┘    |
|  ┌──────────────────────────┐    |
|  │     Title Screen         │    |  ← Tertiary: return to title
|  └──────────────────────────┘    |
|                                   |
+-----------------------------------+
```

### Elements

- "The memory fades..." in `--font-heading`, `--text-secondary`, centered
- 3-second fade from combat screen to game over (screen darkens via `--bg-overlay`)
- BGM-GAMEOVER plays once (0:20, no loop)
- "Retry Battle" restarts the encounter from the beginning with pre-combat HP/SP/items restored
- "Load Save" opens save slot picker
- "Title Screen" returns to title (unsaved progress lost — confirmation dialog)

---

## Screen 15: Victory / Ending

**When shown**: After the endgame bloom sequence (remixing the First Memory).

**Purpose**: Credits and post-game acknowledgment.

### Layout

The ending is a **multi-phase sequence**, not a single screen:

**Phase 1: The Bloom** (2 minutes)
- Full-screen PixiJS animation: every zone brightens to Vivid simultaneously
- BGM-BLOOM plays
- No UI elements — pure visual spectacle

**Phase 2: Grym's Resolution** (1 minute)
- Dialogue panel over the brightened Preserver Fortress
- Grym's final dialogue (varies by player choices — see story scripts)
- Player responds with a single line (auto-selected, not a choice — this is the narrative resolution)

**Phase 3: Credits** (4 minutes)
- Full-screen dark background (`--bg-primary`)
- Credits scroll upward at readable speed
- BGM-CREDITS plays
- Player sprite walks rightward along a slowly brightening path at the bottom of the screen

**Phase 4: Post-Credits**
- Returns to the game world at the Village Hub with all zones at 95+ vibrancy
- "The world continues..." message
- Player can freely explore the vivid world, talk to post-game NPCs, complete remaining side quests
- No new game+ (this is a single playthrough game with replay via different class/god choices)

---

## Screen 16: Zone Map (Full)

**When shown**: Tapping the mini-map or map button on HUD.

**Purpose**: Full-screen map of the current zone with landmarks, NPCs, and exits.

### Layout (375px mobile)

```
+-----------------------------------+
| ◄ Heartfield              [×]   |
+-----------------------------------+
|                                   |
|  ┌─────────────────────────────┐ |
|  │                             │ |
|  │    (Zone map rendered from  │ |
|  │     TMX data, top-down)     │ |
|  │                             │ |
|  │    ● Player position        │ |  ← Amber dot
|  │    ◆ NPC positions          │ |  ← Green diamonds
|  │    ▲ Exit indicators        │ |  ← White arrows at edges
|  │    ✦ Resonance Stone        │ |  ← Gold star
|  │    ❄ Stagnation Zone       │ |  ← Blue crystal
|  │                             │ |
|  └─────────────────────────────┘ |
|                                   |
| Legend: ● You  ◆ NPC  ▲ Exit    |
+-----------------------------------+
```

### Elements

- Pinch-to-zoom on mobile (2x-4x zoom range)
- Pan by dragging
- Tap a landmark icon to see its name and distance
- Visited areas are full color; unvisited areas are dimmed
- Stagnation zones shown as blue-tinted overlay regions
- Zone vibrancy tier shown in header (colored dot)

---

## Responsive Breakpoints

| Breakpoint | Width | Layout Changes |
|------------|-------|---------------|
| Mobile (default) | 375px | Single column, stacked layouts, swipe gestures |
| Tablet | 768px | 2-column menus, wider panels, larger sprites |
| Desktop | 1024px+ | Full keyboard shortcuts, hover states, expanded info panels |

### Mobile-First Principles

1. All touch targets ≥ 44x44 CSS pixels
2. No hover-dependent interactions (hover enhances but doesn't gate)
3. Swipe gestures for navigation (left/right for tabs, down for dismissal)
4. Bottom-anchored action buttons (within thumb reach zone)
5. No horizontal scrolling (all content fits viewport width)
6. Text sizes never below 8px (readability floor for pixel fonts)

---

## Accessibility Notes

| Concern | Implementation |
|---------|---------------|
| Color contrast | All text/background combinations meet WCAG AA (4.5:1 ratio). `--text-primary` (#D4C4A0) on `--bg-primary` (#2A1810) = 7.2:1 ratio. |
| Screen reader | All interactive elements have `aria-label`. Fragment grid cells have `aria-description` with emotion/element/potency. |
| Reduced motion | `prefers-reduced-motion` media query disables typewriter effect, particle animations, and screen transitions. Bars fill instantly. |
| Keyboard navigation | All screens navigable via Tab/Enter/Escape/Arrow keys on desktop. Focus ring uses `--border-accent`. |
| Font scaling | Pixel font sizes are set in px (not rem) to maintain pixel-perfect rendering. A separate "Large Text" option in Settings scales all text by 1.5x at the cost of pixel alignment. |
