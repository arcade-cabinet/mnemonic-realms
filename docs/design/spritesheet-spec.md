# Spritesheet Specification: Character, NPC, and Enemy Art Production Guide

> Cross-references: [docs/design/visual-direction.md](visual-direction.md), [docs/design/classes.md](classes.md), [docs/design/enemies-catalog.md](enemies-catalog.md), [docs/story/characters.md](../story/characters.md), [docs/design/tileset-spec.md](tileset-spec.md)

## Overview

This document specifies the sprite assets in Mnemonic Realms. All character, NPC, enemy, and boss sprites are **purchased CC0 pixel art** organized in `assets/sprites/`. The game design sections below (enemies, bosses) describe intended game behavior — multiple game entities may share the same sprite asset.

All sprites use 16x16 pixel frames in 4-column spritesheets.

---

## Conventions

### Asset Locations

```
assets/sprites/
├── players/       # 4 player class sprites (warriors, mages, rogues)
├── npcs/
│   ├── citizens/  # 14 named NPC sprites (7 female, 7 male)
│   └── guards/    # 3 guard variants
├── enemies/       # 9 enemy types
├── bosses/        # Dragon boss (horizontal strip)
└── effects/       # Visual effect sprites
```

### Sprite Format Categories

| Category | Dimensions | Grid | Frame Size | Walk Rows |
|----------|-----------|------|-----------|-----------|
| Characters/NPCs | 64x496 | 4 cols x 31 rows | 16x16 | 0/4/8/12 (D/L/R/U) |
| Small enemies | 64x128 | 4 cols x 8 rows | 16x16 | 0/2/4/6 (D/L/R/U) |
| Medium enemies | 64x224 | 4 cols x 14 rows | 16x16 | 0/2/4/6 (D/L/R/U) |
| Dragon boss | 2304x96 | 24 cols x 1 row | 96x96 | N/A (horizontal strip) |

### Sprite ID Format

Named NPCs use `npc_{citizen_name}` (e.g., `npc_hana`, `npc_artun`).
Template NPCs use `npc_{role}` or `npc_{role}_{variant}` (e.g., `npc_villager`, `npc_guard_m1`).
Enemies use `sprite-enemy-{id}` (e.g., `sprite-enemy-e-sl-01`).
Players use `sprite-player-{class}` (e.g., `sprite-player-knight`).

### Direction Convention

All multi-directional sprites use 4-direction layout with `rowsPerDir` stride:

| Direction | Row Offset | Formula |
|-----------|-----------|---------|
| Down | 0 | `0 * rowsPerDir` |
| Left | N | `1 * rowsPerDir` |
| Right | 2N | `2 * rowsPerDir` |
| Up | 3N | `3 * rowsPerDir` |

Characters: `rowsPerDir = 4`. Small/medium enemies: `rowsPerDir = 2`.

### Animation Frame Standard

- Walking: **4 frames** per direction (4 columns), RPG-JS timing `time: 0/5/10/15/20`
- Stand: Frame 0 of the walk direction (first column)
- All animations registered via `Spritesheet({...})(class {})` factory in `generated.ts`

---

## Player Character Sprites (4 Classes)

Each class has a distinct silhouette and color accent readable at 32x32 pixels. The class should be identifiable at a glance from shape alone, even without color.

### Shared Specifications

| Property | Value |
|----------|-------|
| Tile size | 32x32 pixels |
| Proportions | 2.5 heads tall (chibi JRPG) |
| Walk directions | 4 (down, left, right, up) |
| Walk frames | 3 per direction |
| Additional animations | Idle (2f), Attack (4f), Cast (4f), Hit (2f), Death (3f) |
| Sheet size | 96 x 256 pixels (3 cols x 8 rows: 4 walk + idle + attack + cast + hit/death combined) |
| Outline | 1-pixel dark outline (tier shadow color, NOT black) |
| Shadow | Elliptical shadow at feet (4x2 pixels, 40% opacity) |

### PC-KNIGHT: Knight Oathweave

**Silhouette**: Broad shoulders, heavy armor, cape. Square, stable stance. Largest of the four classes. Sword at side in idle, raised in walk.

**Color Key**:

| Element | Hex | Description |
|---------|-----|-------------|
| Primary (armor) | #6B7B8B | Steel blue-gray |
| Secondary (cape/trim) | #8B4513 | Warm saddle brown |
| Accent (oath glow) | #DAA520 | Amber/goldenrod — glows brighter with more active oaths |
| Skin | #F5D5B5 | Warm medium skin |
| Hair | #4A3728 | Dark warm brown |
| Weapon (sword) | #A0A8B0 | Bright steel |
| Shadow outline | #3C3028 | Warm deep shadow |

**Animation Notes**:
- Walk: Cape sways opposite to step. Sword hand rests on hilt.
- Attack: Wide horizontal slash. Cape flares out. Impact frame has amber oath-spark at blade tip.
- Cast: Raises sword overhead. Amber oath-runes circle around blade. Amber flash on release.
- Hit: Planted stance, shield arm raised. Minimal stagger (tank class).
- Idle: Weight shifts, cape flutter. Sword rests at side.

**Subclass Variants** (palette swap + minor sprite edit):
- Luminary: Cape gains golden trim (#FFD700). Shield has sun emblem.
- Crucible: Cape turns deep red (#8B2020). Sword gains red ember glow (#CD5C5C).

### PC-CLERIC: Cleric Euphoric Recall

**Silhouette**: Medium build, flowing robes, hood or circlet. Staff held in one hand. Robes bell outward at base. Second smallest silhouette.

**Color Key**:

| Element | Hex | Description |
|---------|-----|-------------|
| Primary (robes) | #F5F0E6 | Warm cream/ivory |
| Secondary (sash/trim) | #7B68EE | Twilight purple (sorrow accent) |
| Accent (healing glow) | #FFD700 | Joy gold — pulses during healing |
| Skin | #E8C8A0 | Warm light skin |
| Hair | #C89060 | Auburn |
| Weapon (staff) | #8B6D4C | Warm wood, amber crystal at top |
| Shadow outline | #5C5040 | Warm shadow |

**Animation Notes**:
- Walk: Robes sway gently. Staff taps ground with each step (subtle ground glow).
- Attack: Swings staff forward. Simple physical motion. No magic.
- Cast: Raises staff overhead. Emotion-colored aura (joy=gold, sorrow=purple, awe=green, fury=red). Release pulse outward.
- Hit: Stumbles back, robes billow. Moderate stagger (mid-DEF class).
- Idle: Staff planted, free hand adjusts hood. Subtle amber glow from staff crystal.

**Subclass Variants**:
- Luminary: Circlet gains golden radiance (#FFD700). Robe hem glows warmly.
- Crucible: Sash deepens to dark purple (#4B0082). Staff crystal turns deep violet.

### PC-MAGE: Mage Inspired Casting

**Silhouette**: Slim, angular. Shortest proportions (2 heads tall). Wide-brimmed hat or headband. No staff — hands are the weapon. Robes are fitted, not flowing. Most visually distinct silhouette.

**Color Key**:

| Element | Hex | Description |
|---------|-----|-------------|
| Primary (robes) | #2F4F4F | Dark slate teal |
| Secondary (hat/trim) | #4A8CB8 | Clear river blue |
| Accent (spell glow) | varies by element | Adapts to current spell element |
| Skin | #D4A87C | Medium warm skin |
| Hair | #1C1C3C | Dark indigo-black |
| Weapon (none — hands) | N/A | Hands glow with elemental energy during cast |
| Shadow outline | #1C2828 | Dark teal shadow |

**Element Glow Colors** (used during cast animation):
- Fire: #CD5C5C | Water: #4A8CB8 | Earth: #8B6D4C | Wind: #66CDAA
- Light: #FFD700 | Dark: #7B68EE | Neutral: #DAA520

**Animation Notes**:
- Walk: Quick, light steps. Hat/headband sways. Hands at sides, faint elemental sparks.
- Attack: Open palm thrust. Small magic bolt. Quick motion (fastest attack animation).
- Cast: Both arms raised. Element-colored circle at feet. Spell gathers between hands, then fires. Most elaborate cast animation of all classes.
- Hit: Knocked back significantly. Arms flail (glass cannon, low DEF).
- Idle: One hand on chin (thinking pose). Occasional elemental spark between fingers.

**Subclass Variants**:
- Luminary: Hat/headband gains prismatic trim. Hands glow rainbow during cast.
- Crucible: Robe edges glow with volatile energy (#FF4500). Eyes glow during cast.

### PC-ROGUE: Rogue Foreshadow Strike

**Silhouette**: Lean, agile. Scarf or bandana. Dual daggers. Slightly crouched stance. Most dynamic poses. Similar height to Cleric but narrower.

**Color Key**:

| Element | Hex | Description |
|---------|-----|-------------|
| Primary (outfit) | #3C3C3C | Dark charcoal |
| Secondary (scarf/cloak) | #2E5C4C | Deep forest green |
| Accent (foreshadow) | #87CEEB | Sky blue — echo/ghost afterimage color |
| Skin | #C8A080 | Warm tan skin |
| Hair | #A0522D | Sienna red |
| Weapon (daggers) | #C0C0C0 | Bright silver |
| Shadow outline | #1C2020 | Near-black warm |

**Animation Notes**:
- Walk: Low, quick stride. Scarf trails behind. Daggers hidden (hands at sides).
- Attack: Quick dual slash (cross pattern). Afterimage trails in sky blue (#87CEEB).
- Cast: Crouches, hands glow with foreshadow blue. Echo of self appears translucent.
- Hit: Quick dodge animation (partial evasion feel even when hit). Minimal stagger.
- Idle: Weight on one foot, alert stance. Scarf flutter. Occasional dagger twirl.

**Subclass Variants**:
- Luminary: Scarf gains golden thread (#DAA520). Afterimages turn warm gold.
- Crucible: Eyes glow red (#CD5C5C). Daggers gain crimson edge. Afterimages turn dark red.

---

## Named NPC Sprites (14 Citizens)

All 14 named NPCs use purchased citizen sprites from `assets/sprites/npcs/citizens/`. Each citizen has a unique visual design in the same 64x496 format (4 cols x 31 rows @ 16x16).

### Shared NPC Specifications

| Property | Value |
|----------|-------|
| Frame size | 16x16 pixels |
| Sheet size | 64x496 pixels |
| Grid | 4 columns x 31 rows |
| Walk directions | 4 (Down/Left/Right/Up at rows 0/4/8/12) |
| Walk frames | 4 per direction |
| Registration | `makeWalkSprite()` factory in `generated.ts` |

### Named NPC Roster

| Sprite ID | Citizen | Role | Sprite Path |
|-----------|---------|------|-------------|
| `npc_hana` | Hana | Mentor | `female/Hana/Hana.png` |
| `npc_artun` | Artun | Village Elder | `male/Artun/Artun.png` |
| `npc_grym` | Grym | Antagonist (The Curator) | `male/Grym/Grym.png` |
| `npc_khali` | Khali | Shopkeeper | `female/Khali/Khali.png` |
| `npc_hark` | Hark | Blacksmith | `male/Hark/Hark.png` |
| `npc_nyro` | Nyro | Innkeeper | `male/Nyro/Nyro.png` |
| `npc_nel` | Nel | Ridge Guide | `female/Nel/Nel.png` |
| `npc_janik` | Janik | Sunridge Keeper | `male/Janik/Janik.png` |
| `npc_julz` | Julz | Flickerveil Warden | `female/Julz/Julz.png` |
| `npc_reza` | Reza | Flickerveil Elder | `male/Reza/Reza.png` |
| `npc_vash` | Vash | Marsh Researcher | `female/Vash/Vash.png` |
| `npc_meza` | Meza | Audiomancer of Ambergrove | `female/Meza/Meza.png` |
| `npc_seza` | Seza | Healer of Thornveil | `female/Seza/Seza.png` |
| `npc_serek` | Serek | Preserver Lieutenant | `male/Serek/Serek.png` |

### Variant Aliases (in `aliases.ts`)

| Alias ID | Citizen | Purpose |
|----------|---------|---------|
| `npc_hana_frozen` | Hana | Hana in frozen state (Act I climax) |
| `npc_frozen_festival_goer` | Meza | Frozen festival NPC |
| `npc_ghost_f1` | Seza | Ghost/spirit variant |
| `npc_ridgewalker_scout` | Hark | Ridgewalker faction scout |
| `npc_ridgewalker_elder` | Grym | Ridgewalker faction elder |
| `npc_rootwalker_echo` | Hana | Audiomancer echo |
| `god_cantara` | Nyro | Dormant god avatar |

### Legacy Aliases (backwards compatibility)

Old sprite IDs (`npc_lira`, `npc_callum`, etc.) are preserved as aliases in `aliases.ts` so existing event files continue to work. New code should use citizen-name IDs.

---

## Template NPC Sprites (15 Role Types)

Template NPCs reuse citizen sprites for background population. Each role type maps to a default citizen sprite via `spriteRef` in `gen/ddl/npcs/templates.json`.

### Template Specifications

| Property | Value |
|----------|-------|
| Same sprite format as named NPCs | 64x496, 4x31 @ 16x16 |
| Visual variety | 14 citizen designs + 3 guard variants = 17 unique appearances |
| Role differentiation | Via dialogue and behavior, not unique sprites |

### Role → Sprite Mapping

| Role | Default Sprite | Sprite ID |
|------|---------------|-----------|
| Villager | Rotates through all citizens | `npc_villager`, `npc_villager_m1`, etc. |
| Merchant | Serek | `npc_merchant` |
| Farmer | Artun | `npc_farmer` |
| Scholar | Reza | `npc_scholar` |
| Guard | Guard sprites (3 variants) | `npc_guard`, `npc_guard_m1`, `npc_guard_m2` |
| Child | Julz | `npc_child` |
| Elder | Grym | `npc_elder_m1` |
| Fisher | Serek | `npc_fisher_m1` |
| Innkeeper | Nyro | `npc_innkeeper_f1` |
| Woodcutter | Hark | `npc_woodcutter_m1` |
| Audiomancer | Meza | `npc_audiomancer_m1` |
| Ridgewalker | Nel | `npc_ridgewalker_m1` |
| Shopkeeper | Khali | `npc_shopkeep_f1` |
| Healer | Seza | — |
| Preserver Agent | Serek | `npc_preserver_agent` |

---

## Enemy Sprites (34 Types)

Enemies use 32x32 sprites with combat-only animations (no overworld walk cycle — enemies appear as encounter triggers on the map, not walking sprites).

### Shared Enemy Specifications

| Property | Value |
|----------|-------|
| Tile size | 32x32 pixels |
| Animations | Idle (2f), Attack (3f), Hit (2f), Death (3f) |
| Sheet size | 96 x 128 pixels (3 cols x 4 rows: idle, attack, hit, death) |
| Facing | Single direction (toward camera — left-facing in battle view) |
| Outline | 1-pixel outline using warm shadow tones (not black) |

### Settled Lands Enemies (8)

| ID | Name | Shape | Size | Primary Color | Accent | Animation Notes |
|----|------|-------|------|---------------|--------|-----------------|
| EN-SL-01 | Meadow Sprite | Tiny winged orb | 20x20 (centered in 32x32) | Pale gold (#D4B870) | Amber glow (#DAA520) | Floats, bobs up/down. Attack: pollen puff forward. Death: scatters into gold motes. |
| EN-SL-02 | Grass Serpent | Long horizontal snake | 32x24 | Muted green (#6B8E6B) | Gold scale accents | Coils idle. Attack: lunge forward. Death: coils loosely, fades. |
| EN-SL-03 | Forest Wisp | Floating flame shape | 24x24 | Pale green (#B8C4A0) | White-green glow | Drifts side-to-side. Attack: flare toward target. Death: pops into sparks. |
| EN-SL-04 | Thornback Beetle | Round armored bug | 28x24 | Dark brown (#5C4033) | Red-brown shell (#8B4513) | Scuttles in place. Attack: charges forward. Hit: shell flash. Death: flips over, fades. |
| EN-SL-05 | River Nymph | Humanoid water figure | 28x30 | Translucent blue (#4A8CB8) | White foam fringe | Ripple idle. Attack: water whip. Death: splashes and dissolves. |
| EN-SL-06 | Stone Crab | Wide squat crustacean | 30x24 | Stone gray (#8C8078) | Pale blue claw accents | Sidestep idle. Attack: claw snap. Death: crumbles. |
| EN-SL-07 | Highland Hawk | Bird, wings spread | 30x28 | Brown (#8B6D4C) | Gold wingtips | Hovers, wings beat. Attack: dive strike. Death: feathers scatter. |
| EN-SL-08 | Crag Golem | Humanoid rock pile | 32x32 | Dark gray (#6C6058) | Amber crystal eyes (#DAA520) | Slow shift idle. Attack: overhead slam. Death: crumbles to rubble. |

### Frontier Enemies (11)

| ID | Name | Shape | Size | Primary Color | Accent | Animation Notes |
|----|------|-------|------|---------------|--------|-----------------|
| EN-FR-01 | Mire Crawler | Low centipede-like | 32x20 | Dark olive (#4C5C3C) | Purple venom marks (#7B68EE) | Undulates idle. Attack: lunges with mandibles. Poison drip visible. |
| EN-FR-02 | Echo Toad | Bulbous frog | 28x26 | Teal-blue (#2E5C4C) | Amber belly (#DAA520) | Inflates/deflates idle. Attack: tongue strike. Special: splits into 2 smaller sprites. |
| EN-FR-03 | Bog Wisp | Ghostly flame | 22x22 | Sickly green (#6B8E6B) | Purple core (#7B68EE) | Erratic drift. Attack: SP-drain tendril. Death: implodes. |
| EN-FR-04 | Wind Elemental | Swirling vortex | 28x32 | Translucent white-gray | Green streaks (#66CDAA) | Constant rotation idle. Attack: wind blade arc. Death: disperses. |
| EN-FR-05 | Mountain Drake | Winged reptile | 32x32 | Slate blue (#6B7B8B) | Red-orange belly (#CD5C5C) | Wings spread idle. Attack: fire breath (3f). Death: collapses, ember scatter. |
| EN-FR-06 | Phantom Fox | Sleek canine | 28x26 | Translucent gray-white | Ice blue eyes (#87CEEB) | Phase shimmer idle. Attack: backstab (appears behind target). Death: fades to nothing. |
| EN-FR-07 | Canopy Crawler | Spider-like | 28x28 | Dark green (#2E4C3C) | Yellow markings (#D4A030) | Legs twitch idle. Attack: drops web ball. Death: curls up, fades. |
| EN-FR-08 | Flicker Wisp | Unstable light orb | 24x24 | Alternating visible/invisible | Amber core | Flicker between visible/transparent. Attack: light blast. Death: final bright flash. |
| EN-FR-09 | Sound Echo | Distorted humanoid | 30x30 | Semi-transparent (#8C8078 at 60%) | Ripple wave visual | Vibration idle. Attack: copies a player skill visually. Death: sound-wave burst. |
| EN-FR-10 | Stone Guardian | Massive humanoid statue | 32x32 | Dark stone (#6C6058) | Amber rune lines (#DAA520) | Barely moves idle. Attack: slow powerful punch. Death: runes go dark, crumbles. |
| EN-FR-11 | Harmony Wraith | Cloaked figure, floating | 28x32 | Dark purple (#4B0082) | Gold aura rim (#DAA520) | Sways gently. Attack: extends hands, resonance pulse. Death: cloak collapses empty. |

### Sketch Enemies (6)

Sketch enemies are unique — they are rendered as **line art**, not filled sprites. This matches the Sketch biome aesthetic from [tileset-spec.md](tileset-spec.md).

| ID | Name | Shape | Size | Line Color | Fill | Animation Notes |
|----|------|-------|------|------------|------|-----------------|
| EN-SK-01 | Sketch Phantom | Outline of random enemy | 30x30 | Warm gray (#A09888) | None (transparent) | Flickers between different enemy outlines. Attack: lunges as current outline. Death: erased (line shrinks to center). |
| EN-SK-02 | Void Wisp | Negative-space orb | 22x22 | White outline (#FFFFF0) | Inverted (dark center) | Pulses, seems to absorb light. Attack: drains color from target area. Death: collapses to a point. |
| EN-SK-03 | Wireframe Drake | Geometric dragon | 32x32 | Steel blue lines (#6B7B8B) | Partial gradient fill at 30% | Geometric wing flap. Attack: wireframe fire (triangle particles). Death: lines disconnect and scatter. |
| EN-SK-04 | Sketch Wolf | Line-art canine | 28x24 | Brown line (#8B6D4C) | None (transparent) | Rough sketch movement, jittery. Attack: lunges (lines blur). Death: scribble-out effect. |
| EN-SK-05 | Unfinished Treant | Half-drawn tree figure | 32x32 | Green-brown lines (#5C8C3C / #8B6D4C) | Left half filled, right half outline only | Asymmetric sway. Attack: the filled half strikes. Death: both halves dissolve. |
| EN-SK-06 | Memory Echo | Faded player silhouette | 30x30 | Amber line (#DAA520 at 50%) | Faint amber wash | Mirrors player class pose. Attack: replays a player attack visually. Death: golden fade-out. |

### Depths Enemies (5)

| ID | Name | Shape | Size | Primary Color | Accent | Animation Notes |
|----|------|-------|------|---------------|--------|-----------------|
| EN-DP-01 | Memory Shade | Amorphous shadow | 28x28 | Dark purple-brown (#3C2840) | Amber eye points | Oozes and shifts shape. Attack: tendril strike. Death: sinks into floor. |
| EN-DP-02 | Drowned Scholar | Spectral humanoid | 28x32 | Blue-gray translucent (#8090A0) | Parchment scraps (#F5F0E6) | Floats, reads book. Attack: throws book page (magic). Death: book falls, spirit disperses. |
| EN-DP-03 | Resonant Crystal | Animated crystal cluster | 26x28 | Pale blue crystal (#B0C4DE) | Amber vein (#DAA520) | Vibrates in place. Attack: crystal shard projectile. Death: shatters. |
| EN-DP-04 | Songline Phantom | Musical notation figure | 28x30 | Dark ink (#3C3028) | Gold note heads (#FFD700) | Sways to invisible rhythm. Attack: note projectile. Death: resolves to a chord (notes align then fade). |
| EN-DP-05 | Abyssal Memory | Dense memory cloud | 32x32 | Deep amber-brown (#5C4020) | Bright amber core (#FFD700) | Slow rotation. Attack: memory blast (amber burst). Death: fragments scatter upward. |

### Preserver Enemies (4)

Preservers are crystalline humanoids — beautiful but uncanny. They share a design language: ice-blue crystal, geometric precision, too-smooth movement.

| ID | Name | Shape | Size | Primary Color | Accent | Animation Notes |
|----|------|-------|------|---------------|--------|-----------------|
| EN-PV-01 | Preserver Scout | Slim crystalline humanoid | 28x32 | Ice white (#E8E8E8) | Steel blue edges (#B0C4DE) | Smooth glide movement. Attack: crystal shard throw. Death: shatters elegantly. |
| EN-PV-02 | Preserver Agent | Armored crystalline humanoid | 30x32 | Ice white with blue armor (#B0C4DE) | Crystal red accent (#CD5C5C) | Measured steps. Attack: crystal blade slash. Stasis aura visible. |
| EN-PV-03 | Preserver Captain | Tall crystalline humanoid, cape | 32x32 | Ice white, blue-crystal cape | Gold crystal crown (#FFD700) | Cape sway, regal pose. Attack: crystal lance thrust. AoE: cape billows, crystal wave. |
| EN-PV-04 | Preserver Archivist | Robed crystalline figure, floating books | 30x32 | Deep ice blue (#8090A0) | Amber-tinted frozen books | Hovers, books orbit. Attack: book slam (magic). Death: books fall, robes collapse. |

---

## Boss Sprites (10 Encounters)

Bosses use larger sprite sizes — 64x64 for standard bosses, 96x96 for major bosses. Multi-phase bosses have separate sprites per phase.

### Shared Boss Specifications

| Property | Value |
|----------|-------|
| Standard boss size | 64x64 pixels |
| Major boss size | 96x96 pixels |
| Animations | Idle (3f), Attack 1 (4f), Attack 2 (4f), Special (4f), Hit (2f), Phase transition (4f), Death (4f) |
| Sheet size (64x64) | 192 x 448 pixels (3 cols x 7 rows) |
| Sheet size (96x96) | 288 x 672 pixels (3 cols x 7 rows) |
| Facing | Single direction (toward camera) |

### BO-01: Stagnation Heart (64x64, 2 phases)

**Phase 1 — Crystal Shell**:
- Heart-shaped crystalline geode pulsing with cold blue light. Crystal tendrils extend from base.
- Primary: Ice blue (#B0C4DE). Accent: Cold white pulse (#E8E8E8). Core glow: Deep blue (#4A6080).
- Idle: Slow pulse glow. Attack: Crystal spikes shoot outward. Hit: Crack appears in shell. Transition: Shell shatters (4f dramatic explosion).

**Phase 2 — Memory Storm**:
- Inner heart exposed — swirling vortex of frozen memory fragments. Hana's amber silhouette visible at center.
- Primary: Swirling blue-white-amber. Accent: Amber Hana silhouette (#DAA520). Background: Dark vortex.
- Idle: Rotating fragment storm. Attack: Fragments launch outward. Hit: Storm destabilizes briefly. Death: Fragments scatter, warm gold light floods outward, Hana's silhouette brightens.

### BO-02: Shrine Guardians (64x64, 4 variants)

All share a humanoid construct base but with distinct god-themed elements.

**Variant A — Resonance Guardian**: Resonance Stone body, sound wave visual aura.
- Primary: Amber-gray stone (#8C8078). Accent: Visible sound ripples (#DAA520). Idle: Deep humming vibration. Attack: Sound wave blast (visible rings). Death: Stone shatters, harmonious chord sound.

**Variant B — Verdance Guardian**: Root-construct body, flowering surface.
- Primary: Living wood (#5C4033). Accent: Green glow (#2E8B2E), flowering blooms. Idle: Flowers bloom/wilt cycle. Attack: Vine lash extends. Death: Flowers bloom fully, then body peacefully crumbles to soil.

**Variant C — Luminos Guardian**: Concentrated light humanoid, too bright to look at.
- Primary: Brilliant white (#FFFFF0). Accent: Light ray corona. Idle: Gentle brightness pulse. Attack: Beam projects from hands. Hit: Brief dimming. Death: Peaceful dimming to warm glow, then fades.

**Variant D — Kinesis Guardian**: Multi-position humanoid, afterimage figure.
- Primary: Stone gray (#6C6058). Accent: Motion blur trail (#87CEEB). Idle: Position shifts between multiple stances. Attack: Teleport-strike (appears at impact). Death: All afterimages converge, then explode outward.

### BO-03a: The Archivist (64x64)

Massive spectral librarian. Body of flowing water and dissolving parchment. Crystal quill.
- Primary: Water blue translucent (#4A8CB8 at 70%). Accent: Parchment cream (#F5F0E6). Quill: Crystal amber (#DAA520).
- Idle: Water body flows, pages drift. Attack: Quill writes equation in air. Special: Book barricade forms. Death: Water cascades away, pages flutter gently to ground.

### BO-03b: The Resonant King (64x64)

Humanoid Resonance Stone figure on massive throne. Crystal crown ring.
- Primary: Amber stone (#8C8078). Accent: Crown crystals pulsing (#DAA520). Throne: Dark stone with amber veins.
- Idle: Crown shards orbit. Attack: Sound wave from throne. Special: Summons crystal shards. Phase transition: Destroys own throne (dramatic collapse). Death: Crown fragments settle gently, king bows.

### BO-03c: The Conductor (64x64)

Spectral robed figure hovering above stage. Conductor's baton of pure amber light.
- Primary: Dark robes, semi-transparent (#3C3028 at 80%). Accent: Amber baton (#FFD700), musical notation trails.
- Idle: Conducting invisible orchestra, notes float. Attack: Baton sweeps, note projectiles. Phase triggers correspond to musical movements (tempo changes visually). Death: Bows gracefully, music resolves, heals party (warm golden light).

### BO-03d: The First Dreamer (96x96 — major boss)

An immense shifting face filling the room. Composed of every biome layered together: grass through stone through water through light.
- Primary: All biome colors cycling. This sprite is uniquely multi-textured — grass tiles blend into water tiles blend into mountain stone.
- Phase 1 idle: Slow biome cycling across the face. Attack: Uses visual of previous bosses' attacks. Phase 2: Face becomes more focused, amber-golden. Death: Face smiles, dissolves into pure warm light.

### BO-04a: Grym's Right Hand (64x64)

Preserver in ornate ceremonial armor. Crystal shield depicting frozen scenes.
- Primary: Pristine crystal armor (#E8E8E8). Accent: Blue crystal details (#B0C4DE). Shield: Contains tiny painted scenes (animated miniatures).
- Idle: Reluctant stance, shield lowered. Attack: Shield bash, crystal slash. Special: Hesitation frame at 25% HP (lowers weapon). Death: Kneels, places shield down carefully.

### BO-04b: The Archive Keeper (96x96 — major boss)

Partially absorbed by the Archive. Lower body fused to crystal dais. Orbiting shelves of frozen memories.
- Primary: Upper body: Archivist robes (#8090A0). Lower body: Crystal dais (#B0C4DE). Accent: Orbiting memory spheres (#DAA520).
- Idle: Shelves orbit slowly, memory spheres pulse. Attack: Memory sphere projectile. Special: Summons frozen scene. Death: Archive shatters, warm light floods from broken shelves.

### BO-05: Grym (No combat sprite)

Grym is a **dialogue encounter** — no combat sprites needed. The NPC-CURATOR sprite is used in the final scene. However, Grym has one unique animation:
- `NPC-CURATOR-FINAL`: Standing before the First Memory. Subtle animation — hands clasped, crystal robes flowing. 4 frames, 400ms/frame. Used only in the final chamber.

---

## Combat View Layout

In the RPG-JS combat view, sprites are arranged:

```
+-----------------------------------------------+
|                                                |
|         [Enemy sprites — centered]             |
|         (up to 4 enemies in a row)             |
|                                                |
|-----------------------------------------------+
|                                                |
|   [PC1]   [PC2]   [PC3]   [Companion]         |
|   (party row — bottom-right area)              |
|                                                |
+-----------------------------------------------+
```

- Party sprites face right (toward enemies)
- Enemy sprites face left (toward party)
- Boss sprites are centered and occupy more vertical space (64x64 or 96x96)
- Multi-phase bosses swap sprite sheets at phase transition (2-second transition animation)

---

## Particle Effect Sprites

In addition to character sprites, the following particle sprites are used for combat and overworld effects:

| ID | Name | Size | Frames | Description |
|----|------|------|--------|-------------|
| FX-01 | Memory mote | 8x8 | 4 | Amber floating particle (#DAA520). Used universally. |
| FX-02 | Heal sparkle | 8x8 | 3 | Golden rising sparkle (#FFD700). Used for healing. |
| FX-03 | Hit flash | 16x16 | 3 | White starburst. Universal hit indicator. |
| FX-04 | Crystal shard | 8x8 | 3 | Blue crystal fragment (#B0C4DE). Stagnation effects. |
| FX-05 | Element fire | 16x16 | 4 | Red-orange flame (#CD5C5C). |
| FX-06 | Element water | 16x16 | 4 | Blue water droplet (#4A8CB8). |
| FX-07 | Element earth | 16x16 | 3 | Brown rock fragment (#8B6D4C). |
| FX-08 | Element wind | 16x16 | 4 | Green swirl (#66CDAA). |
| FX-09 | Element light | 16x16 | 3 | Golden beam (#FFD700). |
| FX-10 | Element dark | 16x16 | 4 | Purple wisp (#7B68EE). |
| FX-11 | Stasis freeze | 24x24 | 4 | Crystal encasement growing over target. |
| FX-12 | Poison drip | 8x8 | 3 | Purple droplet (#7B68EE). |
| FX-13 | Broadcast wave | 32x32 | 6 | Expanding golden ring. Memory broadcast visual. |
| FX-14 | Fragment collect | 16x16 | 4 | Golden mote spiraling toward player. |
| FX-15 | Level up | 32x32 | 6 | Warm golden column rising, sparkle burst at top. |
| FX-16 | Death dissolve | 32x32 | 6 | Enemy fading to amber motes. Universal enemy death. |

---

## Sprite Asset Summary

| Category | Assets | Format | Source |
|----------|--------|--------|--------|
| Player characters | 4 classes | 64x496 (4x31 @ 16x16) | Purchased CC0 |
| Named NPCs | 14 citizens | 64x496 (4x31 @ 16x16) | Purchased CC0 |
| Guards | 3 variants | 64x496 (4x31 @ 16x16) | Purchased CC0 |
| Small enemies | 1 type (slime) | 64x128 (4x8 @ 16x16) | Purchased CC0 |
| Medium enemies | 8 types | 64x224 (4x14 @ 16x16) | Purchased CC0 |
| Dragon boss | 1 type | 2304x96 (24x1 @ 96x96) | Purchased CC0 |
| Effects | 26 sprites | Various | Purchased CC0 |
| **Total sprite PNGs** | **148** | | |

### Game Entity → Sprite Mapping

Multiple game entities share the same sprite asset (e.g., 8 slime variants all use `slime.png`). The enemy/boss design sections above describe game behavior, not unique sprites.

---

## Technical Notes

### Registration in RPG-JS

All sprites are registered in `main/client/characters/generated.ts` using factory functions:

```typescript
// Character/NPC: 4-column walk sprite
makeWalkSprite(id, image, totalRows, rowsPerDir)

// Boss: horizontal strip
makeBossSprite(id, image, totalFrames)
```

Aliases and legacy IDs are in `main/client/characters/aliases.ts`.

### Sprite Quality Validation

Run `pnpm verify:sprites` to check all sprite PNGs for:
- Correct dimensions per category
- No solid horizontal lines (rendering artifacts)
- No identical/duplicate frames
- No fully blank frames
