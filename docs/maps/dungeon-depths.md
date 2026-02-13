# Dungeon Layouts: The Depths & Preserver Fortress

> Cross-references: [docs/world/geography.md](../world/geography.md), [docs/design/enemies-catalog.md](../design/enemies-catalog.md), [docs/design/items-catalog.md](../design/items-catalog.md), [docs/design/combat.md](../design/combat.md), [docs/story/quest-chains.md](../story/quest-chains.md), [docs/maps/overworld-layout.md](overworld-layout.md), [docs/world/dormant-gods.md](../world/dormant-gods.md), [docs/design/tileset-spec.md](../design/tileset-spec.md)

## Overview

The Depths are a layered underground dungeon system beneath the game world's surface. Accessed via entrances scattered across all surface zones, the Depths contain the densest dissolved memory deposits — remnants of civilizations that chose to dissolve their collective memories into the earth. Each floor is a self-contained 20x25 tile map (640x800 pixels at 32x32 per tile).

### Dungeon Design Principles

- **Each floor is a self-contained map** (20 tiles wide × 25 tiles tall)
- **Floors connect via stairways** (descent events) and **memory lifts** (fast-travel back to surface after clearing a floor)
- **Enemies scale 1.3x–1.9x** of surface-zone equivalents (see [combat.md](../design/combat.md))
- **Each floor has a Dissolved Memory Cache** — a mandatory encounter/puzzle yielding high-potency fragments
- **Boss encounters guard floors 2–5** and all Fortress floors
- **No random encounters in corridors narrower than 3 tiles** (prevents unfair ambush in tight spaces)

### Map Layers (Per Tiled TMX)

All dungeon maps use the same 6-layer structure as surface maps:

| Layer | Purpose |
|-------|---------|
| `ground` | Base floor tiles (stone, water, crystal, void) |
| `ground2` | Floor detail overlays (cracks, moss, runes, puddles) |
| `objects` | Walls, pillars, furniture, chests, Resonance Stones |
| `objects_upper` | Ceiling elements, hanging formations, overhead bridges |
| `collision` | Impassable tiles (walls, deep water, sealed doors) |
| `events` | Touch/action/auto/parallel event triggers |

### Dungeon Tileset Naming

All dungeon tilesets follow the naming convention from [tileset-spec.md](../design/tileset-spec.md):

| Floor | Tileset Name | Palette |
|-------|-------------|---------|
| Level 1 | `depths_cellar` | Warm stone, amber lantern glow, brown wood |
| Level 2 | `depths_archive` | Blue-green water, dark stone, glowing ink |
| Level 3 | `depths_cavern` | Purple crystal, grey stone, prismatic refractions |
| Level 4 | `depths_songline` | Gold light corridors, translucent walls, star-motes |
| Level 5 | `depths_abyss` | Shifting hues, non-euclidean geometry, cosmic void |
| Fortress F1 | `fortress_gallery` | White crystal, frozen blue, warm amber (frozen scenes) |
| Fortress F2 | `fortress_archive` | Deep blue crystal, silver shelving, pale stasis glow |
| Fortress F3 | `fortress_chamber` | Pure white crystal, golden lattice, prismatic First Memory |

### Vibrancy in the Depths

Unlike surface zones, the Depths have **fixed vibrancy per floor** that does not change with player broadcasts (the dissolved memories maintain their own luminance). Broadcasting in dungeons still works for puzzles and combat buffs but does not raise the floor's base vibrancy.

| Floor | Fixed Vibrancy | Visual Tier |
|-------|---------------|-------------|
| Level 1 | 25 | Muted (dim, warm amber) |
| Level 2 | 35 | Normal (submerged blue-green glow) |
| Level 3 | 40 | Normal (prismatic crystal light) |
| Level 4 | 45 | Normal (golden corridor glow) |
| Level 5 | 30 | Muted (shifting, surreal luminance) |
| Fortress F1 | 50 | Normal (crystal-filtered daylight) |
| Fortress F2 | 55 | Normal (archive stasis glow) |
| Fortress F3 | 60 | Normal (First Memory radiance) |

---

## Depths Level 1: Memory Cellar

**Entrance**: Village Hub, Memorial Garden hidden passage at (8, 17) — revealed after MQ-05
**Surface exit**: Memory lift in Room 3 returns to Village Hub (8, 17)
**Size**: 20 × 25 tiles (640 × 800 px)
**Theme**: Tutorial dungeon. Ancient village ruins beneath the Memorial Garden. Warm stone walls, amber lantern brackets (some still lit), root systems piercing the ceiling, wooden support beams. Feels like an old root cellar that extends far deeper than it should.
**Difficulty**: Low (Level 4–8). Designed to teach dungeon mechanics.
**Quest link**: SQ-10 (The Depths Expedition)

### Room Layout

```
     1    5    10   15   20
  1  ┌────────────────────┐
     │                    │
     │     ROOM 1         │
  5  │   (Entry Hall)     │
     │     ↓              │
     │─────┤  ├───────────│
     │     │  │           │
     │  R2 │  │   ROOM 3  │
 10  │(Mem)│  │ (Guardian) │
     │     │  │           │
     │─────┤  ├───────────│
     │     │  │           │
     │     │  │   ROOM 4  │
 15  │ R5  │  │  (Cache)  │
     │(Lift│  │           │
     │     │  ├───────────│
     │     │  │           │
     │─────┘  │   ROOM 5  │
 20  │        │ (Stairway) │
     │        │    ↓ L2   │
     │        │           │
 25  └────────────────────┘
```

### Rooms

#### Room 1: Entry Hall (Tiles: 1,1 → 20,6)

**Dimensions**: 20 × 6 tiles
**Description**: A wide stone cellar with crumbling arched ceiling. Roots from the Memorial Garden above pierce through the roof, some wrapped around old Resonance Stones that glow faintly amber. A cobblestone path leads south from the entrance stairs at (10, 0) — the entry point from the surface.

**Tile composition**:
- Floor: Worn cobblestone with scattered soil patches
- Walls: Cut stone, root-veined, with rusted lantern brackets
- Objects: 2 decorative barrels (4, 3), (16, 3); 1 broken crate (12, 5)

**Events**:

| ID | Position | Trigger | Quest | Description |
|----|----------|---------|-------|-------------|
| EV-D1-001 | (10, 0) | touch | — | Entry from surface. Transition from Village Hub (8, 17). |
| EV-D1-002 | (3, 2) | action | SQ-10 | Inscription on wall: "The Memorial Garden was built atop our resting place. We chose this." Callum comments if SQ-10 active. |
| EV-D1-003 | (17, 4) | action | — | Cracked Resonance Stone. Gives 1 unnamed fragment (calm/earth/1). One-time. |

**Enemy spawns**: None (safe entry area).

#### Room 2: Memory Alcove (Tiles: 1,7 → 8,11)

**Dimensions**: 8 × 5 tiles
**Description**: Small side chamber off the main corridor. The walls are lined with shallow niches that once held memory containers — most are empty, but a few still glow faintly. This room teaches the player to investigate dungeon alcoves for loot.

**Tile composition**:
- Floor: Smooth flagstone, cleaner than the Entry Hall
- Walls: Niched stone (decorative object tiles showing empty shelves with occasional glow-spots)
- Objects: 1 Resonance Stone (4, 9), 1 treasure chest (2, 8)

**Events**:

| ID | Position | Trigger | Quest | Description |
|----|----------|---------|-------|-------------|
| EV-D1-004 | (4, 9) | action | — | Resonance Stone: 1 fragment (sorrow/neutral/2). One-time. |
| EV-D1-005 | (2, 8) | action | — | Treasure chest: Minor Potion (C-HP-01) ×3. One-time. |

**Enemy spawns**:

| Zone | Bounds | Enemies | Level Range | Encounter |
|------|--------|---------|-------------|-----------|
| Alcove patrol | (3, 7) → (7, 10) | E-DP-01 (Memory Shade) | 4–5 | Common: 1 Shade |

#### Room 3: Guardian Chamber (Tiles: 10,7 → 20,11)

**Dimensions**: 11 × 5 tiles
**Description**: A wider chamber with a raised stone platform at its center. The first dissolved memory encounter — a Memory Shade materializes from the walls when the player steps on the platform. This is the tutorial boss for dungeon mechanics (no formal boss fight, just a slightly tougher encounter).

**Tile composition**:
- Floor: Cobblestone with a raised 3×3 stone platform at (14, 9)
- Walls: Reinforced stone with iron bands
- Objects: 2 lantern brackets (lit), decorative shield on wall (11, 8)

**Events**:

| ID | Position | Trigger | Quest | Description |
|----|----------|---------|-------|-------------|
| EV-D1-006 | (14, 9) | touch | SQ-10 | Forced encounter: 2 Memory Shades + 1 scaled Memory Shade (1.3x stats). SQ-10 objective 4. |
| EV-D1-007 | (14, 9) | auto | SQ-10 | After victory: dissolved memory fragment drops. SQ-10 objective 5. Fragment: unnamed (calm/earth/2). |

**Enemy spawns**:

| Zone | Bounds | Enemies | Level Range | Encounter |
|------|--------|---------|-------------|-----------|
| Chamber | (10, 7) → (20, 11) | E-DP-01 (Memory Shade) | 4–6 | Standard: 2 Shades; Rare: 3 Shades |

#### Room 4: Dissolved Memory Cache (Tiles: 10,12 → 20,17)

**Dimensions**: 11 × 6 tiles
**Description**: The floor's memory cache — a circular chamber where dissolved memories pool like luminous fog at ankle height. Walking through the fog triggers brief flashes of ancient village life: children playing, a market stall, someone singing. The cache contains the floor's best loot.

**Tile composition**:
- Floor: Smooth stone with luminous fog (animated ground2 overlay)
- Walls: Ancient stone with carved village scenes (relief panels)
- Objects: 1 Resonance Stone (15, 14), 1 treasure chest (12, 15), 1 memory pool centerpiece (15, 14)

**Events**:

| ID | Position | Trigger | Quest | Description |
|----|----------|---------|-------|-------------|
| EV-D1-008 | (15, 14) | action | — | Resonance Stone: 1 fragment (joy/neutral/2). One-time. |
| EV-D1-009 | (12, 15) | action | — | Treasure chest: Mana Drop (C-SP-01) ×3, 50 gold. One-time. |
| EV-D1-010 | (15, 15) | auto | — | Memory fog vision: 15-second narrated vignette of the dissolved village. Lore entry. One-time. |

**Enemy spawns**: None (narrative/reward room).

#### Room 5: Stairway Chamber (Tiles: 10,18 → 20,25)

**Dimensions**: 11 × 8 tiles
**Description**: A tall chamber with a spiral staircase descending into darkness. The stairway leads to Depths Level 2 (Drowned Archive). A memory lift crystal stands near the entrance — activating it opens a fast-travel point back to the surface.

**Tile composition**:
- Floor: Stone with iron grating over a deep shaft
- Walls: Rough-hewn stone transitioning to natural cave rock
- Objects: Spiral staircase (15, 22), memory lift crystal (12, 20)

**Events**:

| ID | Position | Trigger | Quest | Description |
|----|----------|---------|-------|-------------|
| EV-D1-011 | (12, 20) | action | — | Memory lift: fast-travel to Village Hub (8, 17). Activated after clearing Room 3 encounter. |
| EV-D1-012 | (15, 22) | touch | — | Stairway descent → Depths Level 2 (10, 0). Always available. |

**Enemy spawns**:

| Zone | Bounds | Enemies | Level Range | Encounter |
|------|--------|---------|-------------|-----------|
| Stairway guard | (11, 18) → (19, 23) | E-DP-01 (Memory Shade) | 4–6 | Common: 1 Shade; Standard: 2 Shades |

### Level 1 Summary

| Metric | Value |
|--------|-------|
| Rooms | 5 |
| Resonance Stones | 3 |
| Treasure Chests | 2 |
| Enemy types | E-DP-01 (Memory Shade) |
| Boss | None (tutorial floor — Room 3 is a forced encounter, not a formal boss) |
| Unique fragments | 3 unnamed fragments |
| Loot highlights | Minor Potions, Mana Drops, 50 gold |
| Memory lift | Room 5 → Village Hub |
| Stairway | Room 5 → Depths L2 |
| Quest link | SQ-10 objectives 3–5 |

---

## Depths Level 2: Drowned Archive

**Entrance**: Shimmer Marsh, Deepwater Sinkhole at (33, 43) — available after MQ-05
**Surface exit**: Memory lift in Room 6 returns to Shimmer Marsh (33, 43)
**Size**: 20 × 25 tiles (640 × 800 px)
**Theme**: Submerged library of a dissolved civilization. Blue-green water fills corridors to knee height. Waterlogged bookshelves line every wall, their contents dissolving into luminous ink that swirls through the water. Globes of compressed memory-water float at ceiling height, providing eerie blue-green illumination.
**Difficulty**: Mid (Level 12–16). Water puzzles and INT-heavy enemies.
**Quest link**: GQ-02-S1 (The Composting — burdened Resonance Stone in Room 3)

### Room Layout

```
     1    5    10   15   20
  1  ┌────────────────────┐
     │    ROOM 1           │
     │  (Entry Pool)       │
  4  │         ↓           │
     │─────────┤ ├─────────│
  5  │  ROOM 2 │ │ ROOM 3  │
     │ (Reading │ │(Burden) │
     │  Hall)   │ │         │
  9  │─────────┤ ├─────────│
     │         │ │          │
 10  │    ROOM 4            │
     │  (Flood Hall)        │
 13  │         ↓            │
     │─────────┤ ├─────────│
 14  │  ROOM 5 │ │ ROOM 6  │
     │ (Puzzle) │ │ (Lift)  │
 18  │─────────┘ └─────────│
     │                      │
 19  │    ROOM 7            │
     │  (Boss Arena)        │
     │  The Archivist       │
     │         ↓ L3         │
 25  └────────────────────┘
```

### Rooms

#### Room 1: Entry Pool (Tiles: 1,1 → 20,4)

**Dimensions**: 20 × 4 tiles
**Description**: A wide, shallow pool of luminous water at the base of the Deepwater Sinkhole. Light filters down from the surface far above. Waterlogged stone steps lead south into the archive proper. The water here is ankle-deep and safe.

**Events**:

| ID | Position | Trigger | Quest | Description |
|----|----------|---------|-------|-------------|
| EV-D2-001 | (10, 0) | touch | — | Entry from Shimmer Marsh (33, 43). |
| EV-D2-002 | (5, 2) | action | — | Submerged tablet: lore about the archive civilization. "We stored everything we were in these pages." |

**Enemy spawns**: None (entry area).

#### Room 2: Reading Hall (Tiles: 1,5 → 9,9)

**Dimensions**: 9 × 5 tiles
**Description**: A large reading room with waterlogged desks and floating bookshelves. Dissolved scholars' shadows flicker between the shelves, reenacting the act of reading. The water here is knee-deep, creating a slight movement speed reduction (-10% AGI on the tile layer, not in combat).

**Events**:

| ID | Position | Trigger | Quest | Description |
|----|----------|---------|-------|-------------|
| EV-D2-003 | (4, 7) | action | — | Resonance Stone (half-submerged): 1 fragment (sorrow/water/2). One-time. |
| EV-D2-004 | (2, 6) | action | — | Treasure chest (waterlogged): Potion (C-HP-02) ×2. One-time. |

**Enemy spawns**:

| Zone | Bounds | Enemies | Level Range | Encounter |
|------|--------|---------|-------------|-----------|
| Reading Hall | (1, 5) → (9, 9) | E-DP-02 (Drowned Scholar) | 14–15 | Common: 1 Scholar; Standard: 2 Scholars |

#### Room 3: Burdened Stone Chamber (Tiles: 11,5 → 20,9)

**Dimensions**: 10 × 5 tiles
**Description**: A circular chamber with a massive Resonance Stone at its center, weighed down by dense accumulated memories. The stone glows a sickly amber — it's overloaded and cannot release its stored fragments. This is one of the three burdened stones for GQ-02-S1 (The Composting).

**Events**:

| ID | Position | Trigger | Quest | Description |
|----|----------|---------|-------|-------------|
| EV-D2-005 | (15, 7) | action | GQ-02-S1 | Burdened Resonance Stone. Broadcast sorrow-type fragment to "compost" dense memories. Yields 2 fragments (potency 3, random emotions). Stone becomes a rest point (full HP/SP restore). |
| EV-D2-006 | (18, 6) | action | — | Treasure chest: Dissolved Metal (unique crafting material for SQ-11). One-time. |

**Enemy spawns**:

| Zone | Bounds | Enemies | Level Range | Encounter |
|------|--------|---------|-------------|-----------|
| Chamber guard | (11, 5) → (20, 9) | E-DP-02 (Drowned Scholar), E-DP-01 (Memory Shade, scaled) | 14–15 | Standard: 1 Scholar + 1 scaled Shade |

#### Room 4: Flood Hall (Tiles: 1,10 → 20,13)

**Dimensions**: 20 × 4 tiles
**Description**: A long corridor where the water level rises to waist height. Floating debris (books, desks, memory orbs) can be used as stepping stones to reach a higher path along the east wall that avoids the worst of the water. The western path is submerged but leads to a hidden alcove with treasure.

**Events**:

| ID | Position | Trigger | Quest | Description |
|----|----------|---------|-------|-------------|
| EV-D2-007 | (3, 12) | action | — | Hidden alcove: Mana Draught (C-SP-02) ×2. Requires wading through deep water (takes 20 HP damage to reach). |
| EV-D2-008 | (17, 11) | action | — | Resonance Stone (floating): 1 fragment (awe/water/3). One-time. |

**Enemy spawns**:

| Zone | Bounds | Enemies | Level Range | Encounter |
|------|--------|---------|-------------|-----------|
| Flood corridor | (1, 10) → (20, 13) | E-DP-02 (Drowned Scholar) | 14–16 | Common: 1 Scholar; Rare: 2 Scholars + 1 scaled Shade |

#### Room 5: Water Puzzle Chamber (Tiles: 1,14 → 9,18)

**Dimensions**: 9 × 5 tiles
**Description**: A puzzle room with three water valves (stone wheels on the wall) and a sealed door to the south. The player must turn the valves in the correct sequence to drain the water from Room 7 (the boss arena) enough to fight. The sequence is hinted at by glowing symbols on a submerged mural: **left → right → center** (matching the reading direction of the dissolved civilization's script).

**Puzzle mechanics**:
1. Each valve has 2 positions: open/closed
2. Wrong sequences flood the room to chest height (minor damage, 30 HP to all party members, resets the puzzle)
3. Correct sequence (left → right → center) drains Room 7 to ankle depth and unseals the southern door

**Events**:

| ID | Position | Trigger | Quest | Description |
|----|----------|---------|-------|-------------|
| EV-D2-009 | (3, 15) | action | — | Left valve |
| EV-D2-010 | (7, 15) | action | — | Right valve |
| EV-D2-011 | (5, 15) | action | — | Center valve |
| EV-D2-012 | (5, 17) | action | — | Submerged mural hint: "We read from the edges inward, as all things converge." |

**Enemy spawns**: None (puzzle room).

#### Room 6: Memory Lift Chamber (Tiles: 11,14 → 20,18)

**Dimensions**: 10 × 5 tiles
**Description**: A quiet chamber with a memory lift crystal and a save-point Resonance Stone. The lift returns the player to the Shimmer Marsh surface entrance. A waterfall of luminous water cascades from a crack in the ceiling.

**Events**:

| ID | Position | Trigger | Quest | Description |
|----|----------|---------|-------|-------------|
| EV-D2-013 | (15, 16) | action | — | Memory lift: fast-travel to Shimmer Marsh (33, 43). Activated after clearing the water puzzle. |
| EV-D2-014 | (13, 15) | action | — | Resonance Stone (save/rest): full HP/SP restore. Reusable. |

**Enemy spawns**: None (safe room).

#### Room 7: Boss Arena — The Archivist (Tiles: 1,19 → 20,25)

**Dimensions**: 20 × 7 tiles (exceeds 10×10 minimum)
**Description**: The archive's deepest chamber — a grand reading hall with soaring (invisible) ceilings. Waterlogged bookshelves form a semicircular amphitheater around a central lectern. The Archivist stands at the lectern, endlessly reading a dissolving book. When the player approaches, the Archivist looks up and speaks: *"Another reader? The archive is closing. But I suppose... one more consultation."*

**Boss**: B-03a: The Archivist (see [enemies-catalog.md](../design/enemies-catalog.md))
- HP: 450 | ATK: 18 | INT: 32 | DEF: 25 | AGI: 14 | Level: 14–16
- Abilities: Tidal Equation, Book Barricade, Dissolution Lesson, Final Chapter (death trigger)

**Pre-fight dialogue trigger**: (10, 21), action event. The Archivist speaks before combat begins.

**Events**:

| ID | Position | Trigger | Quest | Description |
|----|----------|---------|-------|-------------|
| EV-D2-015 | (10, 21) | action | — | Pre-boss dialogue. The Archivist's monologue about preserving knowledge. |
| EV-D2-016 | (10, 21) | auto | — | Boss fight: B-03a The Archivist. Forced encounter after dialogue. |
| EV-D2-017 | (10, 23) | auto | — | Post-victory: Final Chapter death trigger. +10% INT buff for remainder of floor. |
| EV-D2-018 | (10, 24) | touch | — | Stairway descent → Depths Level 3 (10, 0). |
| EV-D2-019 | (15, 20) | action | — | Treasure chest (boss reward): Dissolved Essence (C-SP-09) ×1, 120 gold. One-time. |

**Enemy spawns**: Boss only (no random encounters in boss arena).

### Level 2 Summary

| Metric | Value |
|--------|-------|
| Rooms | 7 |
| Resonance Stones | 4 (1 burdened for GQ-02-S1) |
| Treasure Chests | 4 |
| Enemy types | E-DP-02 (Drowned Scholar), E-DP-01 (Memory Shade, scaled) |
| Boss | B-03a: The Archivist |
| Unique fragments | 4 unnamed + 2 from burdened stone |
| Loot highlights | Dissolved Metal (SQ-11), Dissolved Essence, Potions |
| Memory lift | Room 6 → Shimmer Marsh |
| Stairway | Room 7 → Depths L3 |
| Puzzle | Water valve sequence (Room 5) |
| Quest links | GQ-02-S1 (burdened stone), SQ-11 (Dissolved Metal) |

---

## Depths Level 3: Resonant Caverns

**Entrance**: Hollow Ridge, Echo Caverns at (38, 3) — available after MQ-05
**Surface exit**: Memory lift in Room 5 returns to Hollow Ridge (38, 3)
**Size**: 20 × 25 tiles (640 × 800 px)
**Theme**: Sound-themed caves with crystalline formations. The walls are living crystal that vibrates at different frequencies. Every footstep produces a musical tone. Resonance Stones are everywhere, humming in chords. The visual effect is prismatic — light refracts through crystal walls, casting rainbow patterns across the floor.
**Difficulty**: Mid-High (Level 15–18). Audio puzzles and crystalline enemies.
**Quest link**: GQ-02-S1 (The Composting — burdened Resonance Stone in Room 3)

### Room Layout

```
     1    5    10   15   20
  1  ┌────────────────────┐
     │    ROOM 1           │
     │  (Crystal Entry)    │
  3  │       ↓             │
     │───┤ ├──┤ ├──────────│
  4  │R2 │ │R3│ │  ROOM 4  │
     │   │ │  │ │ (Sound   │
     │   │ │  │ │  Puzzle) │
  8  │───┘ └──┘ └──────────│
     │                      │
  9  │    ROOM 5            │
     │  (Crystal Nexus)     │
 12  │       ↓              │
     │──────┤ ├─────────────│
 13  │      │ │             │
     │  R6  │ │   ROOM 7   │
     │(Grotto│ │ (Harmonic  │
     │      │ │  Bridge)   │
 17  │──────┘ └─────────────│
     │                      │
 18  │    ROOM 8            │
     │  (Boss Arena)        │
     │  The Resonant King   │
     │       ↓ L4           │
 25  └────────────────────┘
```

### Rooms

#### Room 1: Crystal Entry (Tiles: 1,1 → 20,3)

**Dimensions**: 20 × 3 tiles
**Description**: A narrow cavern mouth that opens into glittering crystal walls. The ceiling is studded with natural crystal formations that ring softly as air currents pass through. The entry from the Echo Caverns above descends via a winding crystal staircase.

**Events**:

| ID | Position | Trigger | Quest | Description |
|----|----------|---------|-------|-------------|
| EV-D3-001 | (10, 0) | touch | — | Entry from Hollow Ridge (38, 3). |
| EV-D3-002 | (15, 2) | action | — | Crystal wall inscription (musical notation): hints at Sound Puzzle sequence in Room 4. |

**Enemy spawns**: None (entry area).

#### Room 2: Echo Chamber (Tiles: 1,4 → 4,8)

**Dimensions**: 4 × 5 tiles
**Description**: A small side cave where every sound echoes with amplified intensity. A single Resonance Stone sits in the center, vibrating at the cavern's resonant frequency. Speaking near it produces eerie, multi-layered echoes.

**Events**:

| ID | Position | Trigger | Quest | Description |
|----|----------|---------|-------|-------------|
| EV-D3-003 | (2, 6) | action | — | Resonance Stone: 1 fragment (awe/wind/3). One-time. |

**Enemy spawns**:

| Zone | Bounds | Enemies | Level Range | Encounter |
|------|--------|---------|-------------|-----------|
| Echo Chamber | (1, 4) → (4, 8) | E-DP-03 (Resonant Crystal) | 16–17 | Common: 1 Crystal |

#### Room 3: Burdened Stone Alcove (Tiles: 6,4 → 9,8)

**Dimensions**: 4 × 5 tiles
**Description**: Another burdened Resonance Stone, this one encrusted with crystal growths that suppress its resonance. The stone hums painfully, as if trying to sing through a sealed mouth. This is the second of three burdened stones for GQ-02-S1.

**Events**:

| ID | Position | Trigger | Quest | Description |
|----|----------|---------|-------|-------------|
| EV-D3-004 | (7, 6) | action | GQ-02-S1 | Burdened Resonance Stone. Broadcast sorrow-type fragment to "compost." Yields 2 fragments (potency 3, random emotions). Becomes rest point. |

**Enemy spawns**: None (quest room).

#### Room 4: Sound Puzzle Hall (Tiles: 11,4 → 20,8)

**Dimensions**: 10 × 5 tiles
**Description**: A wide hall with 5 crystal pillars arranged in a semicircle. Each pillar produces a different musical tone when struck (A, C, E, G, B). The door to Room 5 is sealed behind a harmonic barrier — the player must strike the pillars in the correct sequence to produce the chord that unlocks it. The sequence was hinted at by the inscription in Room 1.

**Puzzle mechanics**:
1. 5 crystal pillars, each an action event
2. Correct sequence: C → E → G → A → B (ascending chord, matching the inscription's musical notation)
3. Wrong sequence: dissonant blast deals 40 HP damage to party, resets puzzle
4. Correct sequence: harmonic barrier dissolves with a resonant chord, door opens

**Events**:

| ID | Position | Trigger | Quest | Description |
|----|----------|---------|-------|-------------|
| EV-D3-005 | (12, 6) | action | — | Pillar A (tone A) |
| EV-D3-006 | (14, 5) | action | — | Pillar C (tone C) |
| EV-D3-007 | (16, 5) | action | — | Pillar E (tone E) |
| EV-D3-008 | (18, 6) | action | — | Pillar G (tone G) |
| EV-D3-009 | (19, 7) | action | — | Pillar B (tone B) |
| EV-D3-010 | (15, 8) | auto | — | Harmonic barrier: blocks passage until puzzle solved |

**Enemy spawns**:

| Zone | Bounds | Enemies | Level Range | Encounter |
|------|--------|---------|-------------|-----------|
| Puzzle hall patrol | (11, 4) → (20, 8) | E-DP-03 (Resonant Crystal) | 16–17 | Common: 1 Crystal; Standard: 2 Crystals |

#### Room 5: Crystal Nexus (Tiles: 1,9 → 20,12)

**Dimensions**: 20 × 4 tiles
**Description**: The cavern's central hub — a wide chamber where crystal formations converge from all directions. The floor is a mosaic of natural crystal tiles in prismatic colors. A memory lift crystal stands at the western wall. Multiple passages branch off from here.

**Events**:

| ID | Position | Trigger | Quest | Description |
|----|----------|---------|-------|-------------|
| EV-D3-011 | (3, 10) | action | — | Memory lift: fast-travel to Hollow Ridge (38, 3). Activated after solving Sound Puzzle. |
| EV-D3-012 | (10, 10) | action | — | Resonance Stone: 1 fragment (fury/earth/3). One-time. |
| EV-D3-013 | (17, 11) | action | — | Treasure chest: Stasis Breaker (C-SC-04) ×3, 80 gold. One-time. |

**Enemy spawns**:

| Zone | Bounds | Enemies | Level Range | Encounter |
|------|--------|---------|-------------|-----------|
| Nexus | (1, 9) → (20, 12) | E-DP-03 (Resonant Crystal), E-DP-02 (Drowned Scholar, scaled) | 16–17 | Standard: 2 Crystals; Rare: 2 Crystals + 1 scaled Scholar |

#### Room 6: Crystal Grotto (Tiles: 1,13 → 8,17)

**Dimensions**: 8 × 5 tiles
**Description**: A natural grotto with a pool of crystal-clear water. Stalactites of pure crystal hang from above, chiming softly. The water contains a dissolved memory deposit — touching the surface triggers a lore vision.

**Events**:

| ID | Position | Trigger | Quest | Description |
|----|----------|---------|-------|-------------|
| EV-D3-014 | (4, 15) | action | — | Crystal pool: lore vision (30-second cinematic about the mountain-dwelling civilization that built these caverns). One-time. |
| EV-D3-015 | (2, 14) | action | — | Treasure chest: Potion (C-HP-02) ×3, Mana Draught (C-SP-02) ×2. One-time. |
| EV-D3-016 | (6, 16) | action | — | Resonance Stone: 1 fragment (sorrow/earth/2). One-time. |

**Enemy spawns**: None (reward/lore room).

#### Room 7: Harmonic Bridge (Tiles: 10,13 → 20,17)

**Dimensions**: 11 × 5 tiles
**Description**: A long crystal bridge spanning a deep chasm. The bridge resonates with the player's footsteps — walking too fast causes it to vibrate dangerously. The player must walk (not run) across the bridge. Running triggers a 50 HP damage shockwave. The bridge leads to the boss arena.

**Events**:

| ID | Position | Trigger | Quest | Description |
|----|----------|---------|-------|-------------|
| EV-D3-017 | (15, 14) | touch | — | Bridge walking check: if player is running, trigger shockwave (50 HP party damage, knockback to bridge start). |

**Enemy spawns**:

| Zone | Bounds | Enemies | Level Range | Encounter |
|------|--------|---------|-------------|-----------|
| Bridge approach | (10, 13) → (14, 15) | E-DP-03 (Resonant Crystal) | 16–18 | Standard: 1 Crystal |

#### Room 8: Boss Arena — The Resonant King (Tiles: 1,18 → 20,25)

**Dimensions**: 20 × 8 tiles (exceeds 10×10 minimum)
**Description**: A vast crystalline throne room. The Resonant King sits on a Resonance Stone throne the size of a house, crowned with vibrating crystal shards. The floor is polished crystal that amplifies every sound. When the player enters, the King "speaks" by making the entire cavern vibrate — words form from harmonics rather than voice.

**Boss**: B-03b: The Resonant King (see [enemies-catalog.md](../design/enemies-catalog.md))
- HP: 550 | ATK: 22 | INT: 35 | DEF: 30 | AGI: 12 | Level: 16–18
- Abilities: Royal Chord, Dissonant Burst, Crown Shatter, Harmonic Shield, Resonant Collapse (death trigger)

**Pre-fight dialogue trigger**: (10, 20), action event.

**Events**:

| ID | Position | Trigger | Quest | Description |
|----|----------|---------|-------|-------------|
| EV-D3-018 | (10, 20) | action | — | Pre-boss dialogue. The Resonant King's harmonic speech. |
| EV-D3-019 | (10, 20) | auto | — | Boss fight: B-03b The Resonant King. |
| EV-D3-020 | (10, 24) | touch | — | Stairway descent → Depths Level 4 (10, 0). |
| EV-D3-021 | (15, 19) | action | — | Treasure chest (boss reward): Dissolved Essence (C-SP-09) ×1, 150 gold. |

**Enemy spawns**: Boss only.

### Level 3 Summary

| Metric | Value |
|--------|-------|
| Rooms | 8 |
| Resonance Stones | 4 (1 burdened for GQ-02-S1) |
| Treasure Chests | 4 |
| Enemy types | E-DP-03 (Resonant Crystal), E-DP-02 (scaled), E-DP-01 (scaled) |
| Boss | B-03b: The Resonant King |
| Unique fragments | 4 unnamed + 2 from burdened stone |
| Loot highlights | Stasis Breakers, Dissolved Essence, Potions |
| Memory lift | Room 5 → Hollow Ridge |
| Stairway | Room 8 → Depths L4 |
| Puzzles | Sound Puzzle (Room 4), Harmonic Bridge (Room 7) |
| Quest links | GQ-02-S1 (burdened stone) |

---

## Depths Level 4: The Songline

**Entrance**: Resonance Fields, Singing Stones passage at (28, 44) — available after Singing Stones puzzle
**Surface exit**: Memory lift in Room 3 returns to Resonance Fields (28, 44)
**Size**: 20 × 25 tiles (640 × 800 px)
**Theme**: Linear memory-corridor. Each room is a "verse" of a dissolved song — the final performance of a civilization that chose to dissolve itself through music. Corridors of golden light connect translucent rooms where ghostly performers endlessly repeat their verse. The architecture is impossible — rooms hang suspended in luminous void, connected by bridges of solidified sound.
**Difficulty**: High (Level 18–22). Dense encounters, strong enemies.
**Quest link**: GQ-02-S1 (The Composting — burdened Resonance Stone in Room 2)

### Room Layout

```
     1    5    10   15   20
  1  ┌────────────────────┐
     │    ROOM 1           │
     │  (First Verse)      │
  4  │       ↓             │
     │──────┤ ├────────────│
  5  │      │ │  ROOM 2    │
     │  R3  │ │ (Second    │
     │(Lift)│ │  Verse)    │
  9  │──────┘ └────────────│
     │         ↓            │
 10  │    ROOM 4            │
     │  (Third Verse)       │
 14  │       ↓              │
     │──────┤ ├────────────│
 15  │      │ │  ROOM 5    │
     │  R6  │ │  (Fourth   │
     │(Loot)│ │   Verse)   │
 19  │──────┘ └────────────│
     │                      │
 20  │    ROOM 7            │
     │  (Boss Arena)        │
     │  The Conductor       │
     │       ↓ L5           │
 25  └────────────────────┘
```

### Rooms

#### Room 1: First Verse — "Prelude" (Tiles: 1,1 → 20,4)

**Dimensions**: 20 × 4 tiles
**Description**: The entry chamber. A corridor of golden light opens into a translucent room where ghostly figures prepare instruments. The entry from the Singing Stones passage arrives at (10, 0). The air hums with anticipation — the song is about to begin.

**Lore vision**: A 15-second cinematic plays on first entry showing the civilization's performers assembling for their final concert. The Conductor raises their baton.

**Events**:

| ID | Position | Trigger | Quest | Description |
|----|----------|---------|-------|-------------|
| EV-D4-001 | (10, 0) | touch | — | Entry from Resonance Fields (28, 44). |
| EV-D4-002 | (10, 2) | auto | — | First Verse vision: performers assembling. One-time. |
| EV-D4-003 | (5, 3) | action | — | Resonance Stone: 1 fragment (awe/wind/3). One-time. |

**Enemy spawns**:

| Zone | Bounds | Enemies | Level Range | Encounter |
|------|--------|---------|-------------|-----------|
| Prelude hall | (1, 1) → (20, 4) | E-DP-04 (Songline Phantom) | 19–20 | Common: 1 Phantom |

#### Room 2: Second Verse — "Rising" (Tiles: 10,5 → 20,9)

**Dimensions**: 11 × 5 tiles
**Description**: The song grows louder. This room pulses with golden light that intensifies and fades in time with the music. Phantom performers are mid-performance — a string section sawing through a rising melody. The room contains a burdened Resonance Stone, the third and final for GQ-02-S1.

**Events**:

| ID | Position | Trigger | Quest | Description |
|----|----------|---------|-------|-------------|
| EV-D4-004 | (15, 7) | action | GQ-02-S1 | Burdened Resonance Stone (final). Broadcast sorrow-type fragment to "compost." Yields 2 fragments (potency 3, random emotions). Becomes rest point. Completes GQ-02-S1 collection (3/3). |
| EV-D4-005 | (18, 6) | action | — | Treasure chest: Strength Seed (C-BF-01) ×2, 100 gold. One-time. |

**Enemy spawns**:

| Zone | Bounds | Enemies | Level Range | Encounter |
|------|--------|---------|-------------|-----------|
| Rising hall | (10, 5) → (20, 9) | E-DP-04 (Songline Phantom) | 19–21 | Common: 1 Phantom; Standard: 2 Phantoms |

#### Room 3: Memory Lift / Interlude (Tiles: 1,5 → 8,9)

**Dimensions**: 8 × 5 tiles
**Description**: A quiet pause in the music. A small chamber off the main corridor with a memory lift crystal and a Resonance Stone rest point. The walls display sheet music in luminous script — the complete score of the dissolved civilization's final song.

**Events**:

| ID | Position | Trigger | Quest | Description |
|----|----------|---------|-------|-------------|
| EV-D4-006 | (4, 7) | action | — | Memory lift: fast-travel to Resonance Fields (28, 44). |
| EV-D4-007 | (2, 6) | action | — | Resonance Stone (rest): full HP/SP restore. Reusable. |

**Enemy spawns**: None (safe room).

#### Room 4: Third Verse — "Crescendo" (Tiles: 1,10 → 20,14)

**Dimensions**: 20 × 5 tiles
**Description**: The music intensifies dramatically. The entire room vibrates, and the translucent walls pulse in rhythm. Phantom performers are at their most intense — the song is building to its climax. Enemy density increases significantly on this floor. Treasure chests are guarded by forced encounters.

**Events**:

| ID | Position | Trigger | Quest | Description |
|----|----------|---------|-------|-------------|
| EV-D4-008 | (5, 12) | action | — | Resonance Stone: 1 fragment (fury/fire/3). One-time. |
| EV-D4-009 | (15, 12) | action | — | Guarded treasure chest (forced encounter: 2 Songline Phantoms). Contains: Memory's Edge (W-SW-08, ATK +50) or Echo of Tomorrow (W-DG-08, ATK +47). Weapon type matches player's class. |

**Enemy spawns**:

| Zone | Bounds | Enemies | Level Range | Encounter |
|------|--------|---------|-------------|-----------|
| Crescendo corridor | (1, 10) → (20, 14) | E-DP-04 (Songline Phantom) | 19–21 | Standard: 2 Phantoms; Rare: 3 Phantoms |

#### Room 5: Fourth Verse — "The Dissolution" (Tiles: 10,15 → 20,19)

**Dimensions**: 11 × 5 tiles
**Description**: The song's final verse before the climax. The phantom performers begin to dissolve even as they play — their bodies thinning to translucent wisps while their instruments continue to sound. The room's golden light fades to silver. This is the narrative peak: the civilization chose to dissolve through their art, and this room shows the beauty and tragedy of that choice.

**Lore vision**: A 20-second cinematic shows the performers dissolving one by one, their instruments falling silent in sequence, until only the Conductor remains, baton raised, awaiting the final note.

**Events**:

| ID | Position | Trigger | Quest | Description |
|----|----------|---------|-------|-------------|
| EV-D4-010 | (15, 17) | auto | — | Fourth Verse vision: performers dissolving. One-time. |
| EV-D4-011 | (18, 16) | action | — | Treasure chest: Dissolved Essence (C-SP-09) ×1, 150 gold. One-time. |

**Enemy spawns**:

| Zone | Bounds | Enemies | Level Range | Encounter |
|------|--------|---------|-------------|-----------|
| Dissolution hall | (10, 15) → (20, 19) | E-DP-04 (Songline Phantom) | 20–21 | Standard: 2 Phantoms; Rare: 3 Phantoms |

#### Room 6: Treasure Alcove (Tiles: 1,15 → 8,19)

**Dimensions**: 8 × 5 tiles
**Description**: A hidden alcove accessed from the main corridor. Contains the floor's best non-boss loot. The walls are covered in handwritten notes from the dissolved performers — personal messages to future listeners.

**Events**:

| ID | Position | Trigger | Quest | Description |
|----|----------|---------|-------|-------------|
| EV-D4-012 | (4, 17) | action | — | Treasure chest: Aegis Seed (C-BF-03) ×3, Wisdom Seed (C-BF-02) ×3. One-time. |
| EV-D4-013 | (2, 18) | action | — | Performer's note (lore): "We play not because the world needs saving, but because the world needs music." |

**Enemy spawns**:

| Zone | Bounds | Enemies | Level Range | Encounter |
|------|--------|---------|-------------|-----------|
| Alcove guard | (1, 15) → (8, 19) | E-DP-04 (Songline Phantom) | 19–21 | Common: 1 Phantom |

#### Room 7: Boss Arena — The Conductor (Tiles: 1,20 → 20,25)

**Dimensions**: 20 × 6 tiles (exceeds 10×10 minimum)
**Description**: The concert hall's stage. A grand semicircular platform of translucent crystal, suspended over a void of starlight. The Conductor stands center stage, baton raised, frozen in the instant before the final note. Behind them, ghostly orchestra chairs sit empty — the performers have all dissolved. The Conductor is the last one. They've been waiting centuries for someone to hear the finale.

**Boss**: B-03c: The Conductor (see [enemies-catalog.md](../design/enemies-catalog.md))
- HP: 650 | ATK: 25 | INT: 38 | DEF: 28 | AGI: 20 | Level: 19–21
- Abilities: First Movement: Allegro, Second Movement: Adagio, Third Movement: Crescendo, Fourth Movement: Fortissimo, Finale (death trigger — heals all party HP/SP)

**Pre-fight dialogue**: *"You've heard the verses. You've watched them dissolve. Now... the finale. I've been holding this last note for a thousand years. Help me finish it."*

**Events**:

| ID | Position | Trigger | Quest | Description |
|----|----------|---------|-------|-------------|
| EV-D4-014 | (10, 22) | action | — | Pre-boss dialogue. The Conductor speaks. |
| EV-D4-015 | (10, 22) | auto | — | Boss fight: B-03c The Conductor. |
| EV-D4-016 | (10, 22) | auto | — | Post-victory: Finale death trigger. Full HP/SP heal. The song resolves. |
| EV-D4-017 | (10, 24) | touch | — | Stairway descent → Depths Level 5 (10, 0). |
| EV-D4-018 | (5, 21) | action | — | Treasure chest (boss reward): Phoenix Feather (C-SP-10), 200 gold. |

**Enemy spawns**: Boss only.

### Level 4 Summary

| Metric | Value |
|--------|-------|
| Rooms | 7 |
| Resonance Stones | 4 (1 burdened for GQ-02-S1, 1 rest point) |
| Treasure Chests | 5 |
| Enemy types | E-DP-04 (Songline Phantom) |
| Boss | B-03c: The Conductor |
| Unique fragments | 3 unnamed + 2 from burdened stone |
| Loot highlights | Tier 3 weapons (W-xx-08), Phoenix Feather, Dissolved Essence, Buff Seeds |
| Memory lift | Room 3 → Resonance Fields |
| Stairway | Room 7 → Depths L5 |
| Puzzle | None (combat-focused floor) |
| Quest links | GQ-02-S1 (final burdened stone) |

---

## Depths Level 5: The Deepest Memory

**Entrance**: Half-Drawn Forest, Sketch Passage at (13, 36) — available after MQ-08
**Surface exit**: Memory lift in Room 5 returns to Half-Drawn Forest (13, 36)
**Size**: 20 × 25 tiles (640 × 800 px)
**Theme**: Abstract, surreal, non-euclidean. The world's oldest memory deposit. The architecture defies logic: staircases lead to ceilings, corridors loop back on themselves, rooms shift perspective like an Escher drawing. The color palette is constantly shifting — warm amber to cold violet to deep indigo. This is where memory and reality blur: the player sees fragments of scenes that haven't happened yet and scenes from civilizations that dissolved before the world had names.
**Difficulty**: Very High (Level 22–27). The hardest non-Fortress content.
**Quest links**: GQ-03-F2 (The Shadows of the Curator — shortcut access), MQ-09 (Fortress basement shortcut)

### Room Layout

```
     1    5    10   15   20
  1  ┌────────────────────┐
     │    ROOM 1           │
     │  (Threshold)        │
  3  │       ↓             │
     │───┤ ├──┤ ├──────────│
  4  │R2 │ │R3│ │  ROOM 4  │
     │   │ │  │ │(Paradox) │
  8  │───┘ └──┘ └──────────│
     │       ↓              │
  9  │    ROOM 5            │
     │  (Memory Nexus)      │
 12  │     ↓     ↓          │
     │──┤ ├──┤ ├──┤ ├──────│
 13  │R6│ │R7│ │R8│ │      │
     │  │ │  │ │  │ │ R9   │
     │  │ │  │ │  │ │(Lore)│
 17  │──┘ └──┘ └──┘ └──────│
     │                      │
 18  │    ROOM 10           │
     │  (Boss Arena)        │
     │  The First Dreamer   │
     │                      │
 25  └────────────────────┘
```

### Rooms

#### Room 1: The Threshold (Tiles: 1,1 → 20,3)

**Dimensions**: 20 × 3 tiles
**Description**: The entry from the Sketch Passage. The transition from the Sketch's minimalist line-art to the Deepest Memory's surreal density is jarring — the player steps from near-nothing into overwhelming detail. Colors shift and blend. The floor appears to be a window looking down into an infinite depth of layered memories.

**Events**:

| ID | Position | Trigger | Quest | Description |
|----|----------|---------|-------|-------------|
| EV-D5-001 | (10, 0) | touch | — | Entry from Half-Drawn Forest (13, 36). |
| EV-D5-002 | (10, 1) | auto | — | Threshold vision: the player sees a rapid montage of all the world's dissolved civilizations — a thousand years compressed into 10 seconds. One-time. |

**Enemy spawns**: None (narrative entry).

#### Room 2: Inverted Chamber (Tiles: 1,4 → 4,8)

**Dimensions**: 4 × 5 tiles
**Description**: A room where gravity appears reversed — stalactites grow from the floor, water drips upward, and the player's shadow is on the ceiling. Purely cosmetic (gameplay unchanged). Contains a high-value Resonance Stone.

**Events**:

| ID | Position | Trigger | Quest | Description |
|----|----------|---------|-------|-------------|
| EV-D5-003 | (2, 6) | action | — | Resonance Stone (inverted): 1 fragment (awe/light/4). One-time. |

**Enemy spawns**:

| Zone | Bounds | Enemies | Level Range | Encounter |
|------|--------|---------|-------------|-----------|
| Inverted chamber | (1, 4) → (4, 8) | E-DP-05 (Abyssal Memory) | 24–25 | Common: 1 Abyssal Memory |

#### Room 3: Timeline Fracture (Tiles: 6,4 → 9,8)

**Dimensions**: 4 × 5 tiles
**Description**: A room split down the middle — the left half shows a lush, vivid version of the Village Hub (Vivid tier), while the right half shows the same space as a Muted ruin. Walking between the halves produces a disorienting visual transition. Contains a treasure chest visible in the Vivid half.

**Events**:

| ID | Position | Trigger | Quest | Description |
|----|----------|---------|-------|-------------|
| EV-D5-004 | (7, 6) | action | — | Treasure chest (Vivid half): First Light (W-ST-08, INT +48) or Dissolved Memory Lens (W-WD-08, INT +49). Weapon type matches player's class (Cleric gets First Light, Mage gets Dissolved Memory Lens). One-time. |

**Enemy spawns**:

| Zone | Bounds | Enemies | Level Range | Encounter |
|------|--------|---------|-------------|-----------|
| Fracture zone | (6, 4) → (9, 8) | E-DP-05 (Abyssal Memory) | 24–25 | Common: 1 Abyssal Memory |

#### Room 4: Paradox Corridor (Tiles: 11,4 → 20,8)

**Dimensions**: 10 × 5 tiles
**Description**: A corridor that appears to loop infinitely — the exit is visible straight ahead but never gets closer. The solution: walk backward through the corridor (the player must turn around and walk in the opposite direction to reach the exit). This is the Deepest Memory's signature puzzle — memory works in reverse here.

**Puzzle mechanics**:
1. Walking forward loops the player back to the start (infinite scroll illusion)
2. Walking backward (pressing the opposite direction) progresses normally
3. No hint given — the player must experiment or recall that "in the deepest memory, everything is reversed" (lore from Room 9 in Depths L4 performer's note)
4. No penalty for trying the wrong direction, just no progress

**Events**:

| ID | Position | Trigger | Quest | Description |
|----|----------|---------|-------|-------------|
| EV-D5-005 | (15, 6) | auto | — | Loop trigger: if player walks forward past this point, teleport to (11, 6). |
| EV-D5-006 | (11, 6) | auto | — | Reverse progress: if player walks backward through here, proceed normally to Room 5. |

**Enemy spawns**:

| Zone | Bounds | Enemies | Level Range | Encounter |
|------|--------|---------|-------------|-----------|
| Paradox corridor | (11, 4) → (20, 8) | E-DP-05 (Abyssal Memory), E-DP-04 (Songline Phantom, scaled) | 24–26 | Standard: 1 Abyssal Memory; Rare: 1 Abyssal Memory + 1 scaled Phantom |

#### Room 5: Memory Nexus (Tiles: 1,9 → 20,12)

**Dimensions**: 20 × 4 tiles
**Description**: The dungeon's central hub. A wide chamber where multiple paths branch outward. The floor is a window into a swirling galaxy of dissolved memories — the densest deposit in the game. A memory lift crystal and a rest-point Resonance Stone sit at the western end. The eastern end has the passage leading to the boss arena.

**Events**:

| ID | Position | Trigger | Quest | Description |
|----|----------|---------|-------|-------------|
| EV-D5-007 | (3, 10) | action | — | Memory lift: fast-travel to Half-Drawn Forest (13, 36). |
| EV-D5-008 | (5, 10) | action | — | Resonance Stone (rest): full HP/SP restore. Reusable. |
| EV-D5-009 | (17, 11) | action | — | Resonance Stone: 1 fragment (calm/neutral/4). One-time. |

**Enemy spawns**: None (hub/safe room).

#### Room 6: Echo Gallery (Tiles: 1,13 → 4,17)

**Dimensions**: 4 × 5 tiles
**Description**: A gallery of floating images — dissolved memories rendered as translucent paintings suspended in mid-air. The images shift when the player moves, showing scenes from across the game world's history. One image shows the Curator as a young person, standing in a vibrant village, smiling.

**Events**:

| ID | Position | Trigger | Quest | Description |
|----|----------|---------|-------|-------------|
| EV-D5-010 | (2, 15) | action | — | Curator image: lore entry about the Curator's origins. "Before the crystal. Before the title. There was just a person who loved their home." |

**Enemy spawns**:

| Zone | Bounds | Enemies | Level Range | Encounter |
|------|--------|---------|-------------|-----------|
| Echo gallery | (1, 13) → (4, 17) | E-DP-05 (Abyssal Memory) | 24–26 | Common: 1 Abyssal Memory |

#### Room 7: Civilization's End (Tiles: 6,13 → 9,17)

**Dimensions**: 4 × 5 tiles
**Description**: A room depicting the final moments of the world's oldest dissolved civilization. The walls replay a looping scene: a circle of elders, hands joined, choosing to dissolve together. Their memories flow downward into the earth, becoming the foundation for everything that came after. This is the emotional core of the Deepest Memory.

**Events**:

| ID | Position | Trigger | Quest | Description |
|----|----------|---------|-------|-------------|
| EV-D5-011 | (7, 15) | auto | — | Civilization vision: 30-second cinematic of the oldest dissolution. One-time. Lore entry. |
| EV-D5-012 | (8, 14) | action | — | Treasure chest: Elixir (C-HP-04) ×1, Ether (C-SP-04) ×1. One-time. |

**Enemy spawns**: None (narrative room).

#### Room 8: Fragment Vault (Tiles: 11,13 → 14,17)

**Dimensions**: 4 × 5 tiles
**Description**: A chamber containing the floor's Dissolved Memory Cache — the densest fragment deposit outside the First Memory itself. Multiple Resonance Stones are arranged in a circle, each containing a fragment of extraordinary potency.

**Events**:

| ID | Position | Trigger | Quest | Description |
|----|----------|---------|-------|-------------|
| EV-D5-013 | (12, 14) | action | — | Resonance Stone A: 1 fragment (joy/light/4). One-time. |
| EV-D5-014 | (13, 16) | action | — | Resonance Stone B: 1 fragment (fury/fire/4). One-time. |
| EV-D5-015 | (12, 16) | action | — | Resonance Stone C: 1 fragment (sorrow/dark/4). One-time. |

**Enemy spawns**:

| Zone | Bounds | Enemies | Level Range | Encounter |
|------|--------|---------|-------------|-----------|
| Fragment vault | (11, 13) → (14, 17) | E-DP-05 (Abyssal Memory) | 25–27 | Standard: 1 Abyssal Memory; Rare: 2 Abyssal Memories |

#### Room 9: Lore Archive (Tiles: 16,13 → 20,17)

**Dimensions**: 5 × 5 tiles
**Description**: A quiet chamber containing the floor's best non-boss treasure and the final lore revelation before the boss fight. Stone tablets line the walls, inscribed with the world's oldest written language.

**Events**:

| ID | Position | Trigger | Quest | Description |
|----|----------|---------|-------|-------------|
| EV-D5-016 | (18, 15) | action | — | Treasure chest: Memory-Woven Plate (A-14, DEF +35). One-time. |
| EV-D5-017 | (17, 14) | action | — | Stone tablet: "The First Memory is not a beginning. It is a question: 'What do you want the world to be?' We dissolved so that someone new could answer." |
| EV-D5-018 | (19, 16) | action | GQ-03-F2 | Shortcut passage to Preserver Fortress basement. Only accessible if GQ-03-F2 (Shadows of the Curator) is completed. See MQ-09 notes. |

**Enemy spawns**: None (lore/reward room).

#### Room 10: Boss Arena — The First Dreamer (Tiles: 1,18 → 20,25)

**Dimensions**: 20 × 8 tiles (exceeds 10×10 minimum)
**Description**: The deepest point in the game world. A vast, circular chamber where the walls are windows into pure memory — shifting scenes of every era, every civilization, every dissolved choice. At the center floats a figure that is not quite a person — the First Dreamer, the oldest dissolved memory given form. It has no fixed appearance; it shifts between faces, landscapes, animals, and abstract shapes as it speaks.

**Boss**: B-03d: The First Dreamer (see [enemies-catalog.md](../design/enemies-catalog.md))

**Phase 1: The Test of Memory** (HP 1,200 → 600)
- Level: 24–26
- Abilities: Primal Recall (random previous boss ability), Memory Surge (AoE % damage), Dream Shift (element cycling)

**Phase 2: The Offering** (HP 600 → 0)
- Abilities: Gift of Remembrance (party buff + AoE), Memory Storm (multi-hit), The Final Question (HP threshold: stops attacking, asks the player to broadcast a fragment to end the fight)

**Pre-fight dialogue**: *"You've come to the bottom of memory. I've been dreaming here since before the first stone was laid. I don't want to fight you. But I need to know if you're ready. Show me what you remember."*

**Events**:

| ID | Position | Trigger | Quest | Description |
|----|----------|---------|-------|-------------|
| EV-D5-019 | (10, 21) | action | — | Pre-boss dialogue. The First Dreamer speaks. |
| EV-D5-020 | (10, 21) | auto | — | Boss fight: B-03d The First Dreamer. |
| EV-D5-021 | (10, 21) | auto | — | Post-victory: The First Dreamer dissolves peacefully. Reveals the First Memory's existence and the Fortress's purpose. |
| EV-D5-022 | (10, 23) | action | — | Treasure chest (boss reward): Dissolved Essence (C-SP-09) ×2, Memory Incense (C-BF-05) ×1, 300 gold. |

**Enemy spawns**: Boss only.

### Level 5 Summary

| Metric | Value |
|--------|-------|
| Rooms | 10 |
| Resonance Stones | 6 (including 3 high-potency in Fragment Vault) |
| Treasure Chests | 5 |
| Enemy types | E-DP-05 (Abyssal Memory), E-DP-04 (Songline Phantom, scaled) |
| Boss | B-03d: The First Dreamer (two-phase) |
| Unique fragments | 7 unnamed (potency 4), 1 calm/neutral/4 |
| Loot highlights | Memory-Woven Plate (A-14), Tier 3 weapons (W-xx-08), Dissolved Essence ×2, Elixir, Ether |
| Memory lift | Room 5 → Half-Drawn Forest |
| Stairway | None (deepest floor, Fortress shortcut via Room 9) |
| Puzzles | Paradox Corridor (Room 4) — walk backward to progress |
| Quest links | GQ-03-F2 (Fortress shortcut), MQ-09 (Fortress basement access) |

---

## Preserver Fortress (Final Dungeon)

**Entrance**: Undrawn Peaks, Crystalline Fortress Gate at (19, 35) — available after MQ-08 (gate solidified via broadcast)
**Surface exit**: Memory lift on Floor 1 returns to Undrawn Peaks (19, 35)
**Size**: 3 floors, each 20 × 25 tiles (640 × 800 px per floor)
**Theme**: Crystalline museum. Every room is a gallery displaying frozen moments of perfect beauty. NPCs from across the game are trapped in crystalline stasis, frozen at their happiest moments. The architecture is pristine — polished crystal walls, perfectly geometric corridors, not a crack or imperfection anywhere. It is beautiful and deeply unsettling.
**Difficulty**: Very High (Level 24–30). The game's final dungeon.
**Quest link**: MQ-09 (The Preserver Fortress)

### Fortress Principles

- **No random encounters on Floor 3** (boss-only floor, narrative climax)
- **Stasis is the primary mechanic**: Preserver enemies inflict Stasis frequently. Stasis Breakers (C-SC-04) are essential
- **Moral complexity**: Some frozen scenes can be freed (restoring the NPC), others are presented as dilemmas (is freeing them better than their perfect frozen moment?)
- **Crystal receptacle puzzles**: Broadcasting matching-emotion fragments into crystal receptacles opens doors and removes barriers
- **Preserver enemies**: Agents (E-PV-02), Captains (E-PV-03), and Archivists (E-PV-04) in escalating combinations

---

### Floor 1: The Gallery of Moments

**Entry**: Crystalline Fortress Gate at (19, 35) from Undrawn Peaks → Floor 1 (10, 0)
**Exit**: Stairway in Room 6 → Floor 2 (10, 0)
**Theme**: Frozen snapshots of villages, festivals, peaceful scenes. Crystal display cases contain frozen moments from across the game world — some the player might recognize from their own travels.

#### Room Layout

```
     1    5    10   15   20
  1  ┌────────────────────┐
     │    ROOM 1           │
     │  (Entry Gallery)    │
  4  │       ↓             │
     │───┤ ├──┤ ├──────────│
  5  │R2 │ │R3│ │  ROOM 4  │
     │   │ │  │ │(Receptacle│
     │   │ │  │ │ Puzzle)  │
  9  │───┘ └──┘ └──────────│
     │       ↓              │
 10  │    ROOM 5            │
     │  (Memory Lift +      │
     │   Phoenix Feather)   │
 13  │       ↓              │
     │──────────────────────│
 14  │    ROOM 6            │
     │  (Boss Arena)        │
     │  Curator's Right Hand│
     │       ↓ F2           │
 20  └────────────────────┘
```

#### Room 1: Entry Gallery (Tiles: 1,1 → 20,4)

**Dimensions**: 20 × 4 tiles
**Description**: A wide, pristine crystal corridor lined with frozen dioramas. Each diorama shows a perfect moment: a family dinner in the Village Hub, children playing in Heartfield, a sunset over Millbrook's bridge. The crystal cases are warm to the touch — the moments inside are still alive, just frozen. Two Preserver Agents patrol the corridor.

**Events**:

| ID | Position | Trigger | Quest | Description |
|----|----------|---------|-------|-------------|
| EV-F1-001 | (10, 0) | touch | MQ-09 | Entry from Undrawn Peaks (19, 35). MQ-09 objective 1 begins. |
| EV-F1-002 | (5, 2) | action | — | Frozen diorama: Village Hub family dinner. "They were so happy. We wanted them to stay this way forever." |
| EV-F1-003 | (15, 2) | action | — | Frozen diorama: children in Heartfield. Player recognizes NPC children from Act I. |

**Enemy spawns**:

| Zone | Bounds | Enemies | Level Range | Encounter |
|------|--------|---------|-------------|-----------|
| Entry patrol | (1, 1) → (20, 4) | E-PV-02 (Preserver Agent), E-PV-04 (Preserver Archivist) | 24–26 | Standard: 2 Agents; Rare: 1 Agent + 1 Archivist |

#### Room 2: Stasis Wing (Tiles: 1,5 → 4,9)

**Dimensions**: 4 × 5 tiles
**Description**: A side gallery containing frozen NPCs the player may have interacted with. If Lira was not freed by SQ-14, her crystallized form appears here (narrative consequence). A Resonance Stone hums behind a crystal barrier that must be shattered by broadcasting any fragment.

**Events**:

| ID | Position | Trigger | Quest | Description |
|----|----------|---------|-------|-------------|
| EV-F1-004 | (2, 7) | action | — | Resonance Stone (behind crystal): 1 fragment (sorrow/dark/3). Broadcast any fragment at the barrier to shatter it. |
| EV-F1-005 | (3, 6) | action | SQ-14 | If SQ-14 NOT completed: Lira's frozen form. Dialogue: "She's smiling. Whatever moment they froze her in, she was happy." |

**Enemy spawns**: None (narrative room).

#### Room 3: Weapon Cache (Tiles: 6,5 → 9,9)

**Dimensions**: 4 × 5 tiles
**Description**: A crystal armory where the Preservers store confiscated weapons and equipment. Guarded by a forced Preserver Agent encounter.

**Events**:

| ID | Position | Trigger | Quest | Description |
|----|----------|---------|-------|-------------|
| EV-F1-006 | (7, 7) | touch | — | Forced encounter: 2 Preserver Agents. |
| EV-F1-007 | (8, 6) | action | — | Treasure chest: Stasis Breaker (C-SC-04) ×5, High Potion (C-HP-03) ×3. One-time. |

**Enemy spawns**: Forced encounter only (see above).

#### Room 4: Crystal Receptacle Puzzle (Tiles: 11,5 → 20,9)

**Dimensions**: 10 × 5 tiles
**Description**: Three crystal receptacles on pedestals, each marked with an emotion glyph (joy, sorrow, fury). The player must broadcast a matching fragment into each receptacle to open the door to Room 5. This is the MQ-09 objective 1 resonance puzzle.

**Puzzle mechanics**:
1. 3 receptacles: joy (11, 7), sorrow (15, 7), fury (19, 7)
2. Each requires broadcasting a fragment of the matching emotion (any potency)
3. Fragments are consumed by the broadcast (normal broadcast rules apply)
4. All 3 must be filled to open the inner door at (15, 9)

**Events**:

| ID | Position | Trigger | Quest | Description |
|----|----------|---------|-------|-------------|
| EV-F1-008 | (11, 7) | action | MQ-09 | Joy receptacle: broadcast joy fragment |
| EV-F1-009 | (15, 7) | action | MQ-09 | Sorrow receptacle: broadcast sorrow fragment |
| EV-F1-010 | (19, 7) | action | MQ-09 | Fury receptacle: broadcast fury fragment |
| EV-F1-011 | (15, 9) | auto | MQ-09 | Inner door: opens when all 3 receptacles filled |

**Enemy spawns**:

| Zone | Bounds | Enemies | Level Range | Encounter |
|------|--------|---------|-------------|-----------|
| Puzzle room | (11, 5) → (20, 9) | E-PV-04 (Preserver Archivist) | 24–26 | Standard: 1 Archivist; Rare: 1 Archivist + 1 Agent |

#### Room 5: Memory Lift + Phoenix Feather (Tiles: 1,10 → 20,13)

**Dimensions**: 20 × 4 tiles
**Description**: A wide corridor leading to the boss arena. Contains the memory lift crystal (first and last on this floor), the hidden alcove where the Phoenix Feather is found (MQ-09 objective 1), and a rest-point Resonance Stone.

**Events**:

| ID | Position | Trigger | Quest | Description |
|----|----------|---------|-------|-------------|
| EV-F1-012 | (3, 11) | action | — | Memory lift: fast-travel to Undrawn Peaks (19, 35). |
| EV-F1-013 | (5, 11) | action | — | Resonance Stone (rest): full HP/SP restore. Reusable. |
| EV-F1-014 | (17, 12) | action | MQ-09 | Hidden alcove: Phoenix Feather (C-SP-10). MQ-09 objective 1 sub-goal. |
| EV-F1-015 | (10, 11) | action | K-14 | If K-14 (Elyn's Intelligence Report) carried: reveals all Room events on floor map. |

**Enemy spawns**: None (safe room before boss).

#### Room 6: Boss Arena — Curator's Right Hand (Tiles: 1,14 → 20,20)

**Dimensions**: 20 × 7 tiles (exceeds 10×10 minimum)
**Description**: The Gallery's grand finale room — the largest crystal case in the Fortress, designed to hold the Curator's most valued collection piece. The Right Hand stands before it in ceremonial armor, crystal shield depicting frozen scenes. Behind them, a stairway descends to Floor 2.

**Boss**: B-04a: The Curator's Right Hand (see [enemies-catalog.md](../design/enemies-catalog.md))
- HP: 750 | ATK: 32 | INT: 28 | DEF: 38 | AGI: 16 | Level: 24–26
- Abilities: Gallery Strike, Exhibit Shield, Stasis Wave, Curator's Lament (hesitation at 25% HP), Final Stand
- Guaranteed drop: Phoenix Feather (C-SP-10), unnamed sorrow/neutral/4★ fragment

**Pre-fight dialogue**: *"The Curator weeps for every battle. So do I. But you must understand — every step you take forward is a moment that can never be perfect again."*

**Events**:

| ID | Position | Trigger | Quest | Description |
|----|----------|---------|-------|-------------|
| EV-F1-016 | (10, 16) | action | MQ-09 | Pre-boss dialogue. The Right Hand speaks. |
| EV-F1-017 | (10, 16) | auto | MQ-09 | Boss fight: B-04a Curator's Right Hand. |
| EV-F1-018 | (10, 16) | auto | — | Post-victory: Curator's Lament narrative beat. The Right Hand removes their helmet and speaks as a person, not a soldier. |
| EV-F1-019 | (10, 19) | touch | MQ-09 | Stairway descent → Fortress Floor 2 (10, 0). |

**Enemy spawns**: Boss only.

### Floor 1 Summary

| Metric | Value |
|--------|-------|
| Rooms | 6 |
| Resonance Stones | 2 (1 behind barrier, 1 rest) |
| Treasure Chests | 2 |
| Enemy types | E-PV-02 (Agent), E-PV-04 (Archivist) |
| Boss | B-04a: Curator's Right Hand |
| Unique fragments | 1 unnamed + boss drop (sorrow/neutral/4) |
| Loot highlights | Phoenix Feather (×2 — alcove + boss drop), Stasis Breakers |
| Memory lift | Room 5 → Undrawn Peaks |
| Stairway | Room 6 → Fortress F2 |
| Puzzle | Crystal Receptacle (Room 4) — 3 emotion broadcasts |
| Quest links | MQ-09 (objectives 1), K-14 reveal |

---

### Floor 2: The Archive of Perfection

**Entry**: Floor 1 stairway → Floor 2 (10, 0)
**Exit**: Stairway in Room 6 → Floor 3 (10, 0)
**Theme**: The Curator's personal collection. More refined and curated than Floor 1 — each display case is a masterwork. The crystal here is darker (deep blue) and more ornate. The Curator's personal touch is everywhere: handwritten labels on each display, carefully chosen arrangements, obvious love for the preserved moments.

#### Room Layout

```
     1    5    10   15   20
  1  ┌────────────────────┐
     │    ROOM 1           │
     │  (Curator's Hall)   │
  4  │       ↓             │
     │───┤ ├──────────────│
  5  │R2 │ │   ROOM 3     │
     │   │ │ (Moral Dilemma│
     │   │ │  Gallery)     │
  9  │───┘ └──────────────│
     │       ↓              │
 10  │    ROOM 4            │
     │  (Central Archive)   │
     │  Curator's Grief     │
 14  │       ↓              │
     │──────┤ ├────────────│
 15  │  R5  │ │   ROOM 6   │
     │(Safe)│ │ (Boss Arena)│
     │      │ │ Archive     │
     │      │ │  Keeper     │
 20  │──────┘ └────────────│
     │       ↓ F3           │
 25  └────────────────────┘
```

#### Room 1: Curator's Hall (Tiles: 1,1 → 20,4)

**Dimensions**: 20 × 4 tiles
**Description**: A grand entrance hall with the Curator's personal motto inscribed in crystal above the doorway: *"What is perfect should endure. What endures becomes perfect."* Display cases line both walls, containing increasingly personal items — a child's drawing, a wedding ring, a pressed flower.

**Events**:

| ID | Position | Trigger | Quest | Description |
|----|----------|---------|-------|-------------|
| EV-F2-001 | (10, 0) | touch | MQ-09 | Entry from Fortress Floor 1. |
| EV-F2-002 | (5, 2) | action | — | Display case: child's drawing. "My daughter drew this before she chose to dissolve with the Choir. I keep it perfect." |
| EV-F2-003 | (15, 2) | action | — | Display case: wedding ring. "Two people who loved each other so completely that they became one memory. I froze the moment so it would never fade." |

**Enemy spawns**:

| Zone | Bounds | Enemies | Level Range | Encounter |
|------|--------|---------|-------------|-----------|
| Entry hall | (1, 1) → (20, 4) | E-PV-04 (Preserver Archivist), E-PV-03 (Preserver Captain) | 26–28 | Standard: 2 Archivists; Rare: 1 Archivist + 1 Captain |

#### Room 2: Witness Chamber (Tiles: 1,5 → 4,9)

**Dimensions**: 4 × 5 tiles
**Description**: Narrative vignettes play here — crystal projections show scenes from the world's past. The player witnesses (no combat, no interaction) three frozen perfect moments: a village festival, a first snowfall, a father teaching his son to fish. This is MQ-09 objective 2 (witness the frozen perfect moments).

**Events**:

| ID | Position | Trigger | Quest | Description |
|----|----------|---------|-------|-------------|
| EV-F2-004 | (2, 7) | auto | MQ-09 | Vignette 1: Village festival in Heartfield. 15-second cinematic. |
| EV-F2-005 | (3, 6) | auto | MQ-09 | Vignette 2: First snowfall in Sunridge. 15-second cinematic. |
| EV-F2-006 | (2, 8) | auto | MQ-09 | Vignette 3: Father teaching son to fish at Millbrook. 15-second cinematic. |

**Enemy spawns**: None (narrative room).

#### Room 3: Moral Dilemma Gallery (Tiles: 6,5 → 20,9)

**Dimensions**: 15 × 5 tiles
**Description**: Three frozen NPC scenes, each presenting a choice: free the NPC from stasis, or leave them in their perfect moment. Freeing costs a fragment broadcast. The NPCs freed here appear in the post-game world. The NPCs left frozen are mentioned in the ending narration.

**Dilemma 1** (8, 7): A musician frozen mid-performance, the most beautiful note they ever played suspended in crystal. Freeing them: they wake confused, the note is lost forever. Leaving them: the note plays forever, but they never grow.

**Dilemma 2** (13, 7): A pair of lovers frozen in an embrace. Freeing them: they wake and the world has changed; they must rebuild their relationship. Leaving them: the embrace is eternal, but they never learn what comes after.

**Dilemma 3** (18, 7): An old scholar frozen while reading, a look of pure discovery on their face. Freeing them: they lose the thread of their thought forever. Leaving them: the discovery never reaches anyone else.

**Events**:

| ID | Position | Trigger | Quest | Description |
|----|----------|---------|-------|-------------|
| EV-F2-007 | (8, 7) | action | — | Dilemma 1: Broadcast any fragment to free musician. Choice tracked for ending. |
| EV-F2-008 | (13, 7) | action | — | Dilemma 2: Broadcast any fragment to free lovers. Choice tracked for ending. |
| EV-F2-009 | (18, 7) | action | — | Dilemma 3: Broadcast any fragment to free scholar. Choice tracked for ending. |

**Enemy spawns**:

| Zone | Bounds | Enemies | Level Range | Encounter |
|------|--------|---------|-------------|-----------|
| Gallery patrol | (6, 5) → (20, 9) | E-PV-04 (Preserver Archivist), E-PV-03 (Preserver Captain) | 26–28 | Standard: 1 Captain; Rare: 1 Captain + 1 Archivist |

#### Room 4: Central Archive — Curator's Grief (Tiles: 1,10 → 20,14)

**Dimensions**: 20 × 5 tiles
**Description**: The heart of Floor 2. A circular chamber with a single crystal pedestal at its center, holding the Curator's Grief (MF-09) — the Curator's most personal memory: watching their beloved community dissolve and being powerless to stop it. Collecting MF-09 is MQ-09 objective 2. The room is guarded by a Preserver Captain who must be defeated first.

**Events**:

| ID | Position | Trigger | Quest | Description |
|----|----------|---------|-------|-------------|
| EV-F2-010 | (10, 12) | touch | MQ-09 | Forced encounter: Preserver Captain (E-PV-03). MQ-09 boss guard for F2-F3 stairway. |
| EV-F2-011 | (10, 11) | action | MQ-09 | Curator's Grief (MF-09, sorrow/dark/5) on pedestal. MQ-09 objective 2 completion. |
| EV-F2-012 | (5, 12) | action | — | Resonance Stone: 1 fragment (calm/dark/4). One-time. |
| EV-F2-013 | (15, 13) | action | — | Treasure chest: Panacea (C-SC-05) ×3, 200 gold. One-time. |

**Enemy spawns**: Forced encounter (see above), plus:

| Zone | Bounds | Enemies | Level Range | Encounter |
|------|--------|---------|-------------|-----------|
| Archive patrol | (1, 10) → (20, 14) | E-PV-04 (Preserver Archivist) | 26–28 | Standard: 2 Archivists |

#### Room 5: Safe Room (Tiles: 1,15 → 8,20)

**Dimensions**: 8 × 6 tiles
**Description**: A quiet chamber with a memory lift crystal and rest-point Resonance Stone. A Preserver defector (if GQ-01-A2 or GQ-03-S1 completed) sits here, offering to sell items and share intel.

**Events**:

| ID | Position | Trigger | Quest | Description |
|----|----------|---------|-------|-------------|
| EV-F2-014 | (3, 17) | action | — | Resonance Stone (rest): full HP/SP restore. Reusable. |
| EV-F2-015 | (6, 16) | action | GQ-01-A2/GQ-03-S1 | If either completed: Preserver defector NPC. Sells: Stasis Breaker ×10 (120g each), High Potion ×5 (180g each), Panacea ×3 (200g each). |

**Enemy spawns**: None (safe room).

#### Room 6: Boss Arena — The Archive Keeper (Tiles: 10,15 → 20,20)

**Dimensions**: 11 × 6 tiles (exceeds 10×10 minimum)
**Description**: A gallery room where crystal shelves orbit the Archive Keeper like a planetary system. The Keeper is partially fused with a crystal dais — they cannot move but project devastating magic from their fixed position. Frozen memories orbit them, creating a rotating shield barrier.

**Boss**: B-04b: The Archive Keeper (see [enemies-catalog.md](../design/enemies-catalog.md))
- HP: 900 | ATK: 25 | INT: 42 | DEF: 35 | AGI: 18 | Level: 26–28
- Abilities: Archive Blast (element-adaptive), Perfect Memory (summon healing-reduction scene), Catalogue (passive DEF scaling), Stasis Prison (extended 3-turn stasis), Dissolution (death trigger — +15% all stats for remainder of Fortress)

**Pre-fight dialogue**: *"I've catalogued every memory worth preserving. Every smile, every triumph, every moment of grace. You want to... remix them? That's not creation. That's vandalism."*

**Events**:

| ID | Position | Trigger | Quest | Description |
|----|----------|---------|-------|-------------|
| EV-F2-016 | (15, 17) | action | MQ-09 | Pre-boss dialogue. Archive Keeper speaks. |
| EV-F2-017 | (15, 17) | auto | MQ-09 | Boss fight: B-04b The Archive Keeper. |
| EV-F2-018 | (15, 17) | auto | — | Post-victory: Dissolution death trigger. +15% all stats for Fortress remainder. |
| EV-F2-019 | (15, 19) | touch | MQ-09 | Stairway descent → Fortress Floor 3 (10, 0). |
| EV-F2-020 | (12, 16) | action | — | Treasure chest (boss reward): Dissolved Essence (C-SP-09) ×1, Memory Incense (C-BF-05) ×1, 300 gold. |

**Enemy spawns**: Boss only.

### Floor 2 Summary

| Metric | Value |
|--------|-------|
| Rooms | 6 |
| Resonance Stones | 2 (1 fragment, 1 rest) |
| Treasure Chests | 3 |
| Enemy types | E-PV-04 (Archivist), E-PV-03 (Captain) |
| Boss | B-04b: The Archive Keeper |
| Key item | Curator's Grief (MF-09, sorrow/dark/5) |
| Moral dilemmas | 3 (choices tracked for ending) |
| Loot highlights | MF-09, Panaceas, Dissolved Essence, Memory Incense |
| Memory lift | None (Floor 2 has no lift — must use Floor 1 lift) |
| Stairway | Room 6 → Fortress F3 |
| Puzzle | None (moral choices replace puzzles) |
| Quest links | MQ-09 (objectives 2), GQ-01-A2/GQ-03-S1 (defector NPC) |

---

### Floor 3: The First Memory Chamber

**Entry**: Floor 2 stairway → Floor 3 (10, 0)
**Exit**: Post-game return to Undrawn Peaks via memory lift (activated after MQ-10)
**Size**: 20 × 25 tiles (640 × 800 px)
**Theme**: The Curator's sanctum. A single vast chamber of purest white crystal. The First Memory hovers at the center in a golden lattice — a sphere of warm light that pulses like a heartbeat. The Curator stands before it. This is not a combat floor — it is the game's narrative climax.

**No random encounters.** Floor 3 is a dialogue and narrative experience.

#### Room Layout

```
     1    5    10   15   20
  1  ┌────────────────────┐
     │                     │
     │    ROOM 1           │
     │  (Approach)         │
  6  │       ↓             │
     │                     │
  8  │    ROOM 2           │
     │  (The First Memory  │
     │   Chamber)          │
     │                     │
     │   The Curator       │
     │   The First Memory  │
     │   (MF-10)           │
     │                     │
     │   Remix → MF-11     │
     │   Broadcast MF-11   │
     │   = ENDGAME BLOOM   │
     │                     │
 25  └────────────────────┘
```

#### Room 1: The Approach (Tiles: 1,1 → 20,7)

**Dimensions**: 20 × 7 tiles
**Description**: A long crystal corridor leading to the final chamber. The walls display the Curator's life story in frozen vignettes — each step reveals another moment from the Curator's past: as a child, as a young Architect, as the person who watched their community dissolve, as the founder of the Preservers. By the time the player reaches the end, they understand the Curator's motivation completely.

**Events**:

| ID | Position | Trigger | Quest | Description |
|----|----------|---------|-------|-------------|
| EV-F3-001 | (10, 0) | touch | MQ-09 | Entry from Fortress Floor 2. |
| EV-F3-002 | (5, 2) | auto | MQ-09 | Vignette: Curator as a child, playing in a sunlit village. |
| EV-F3-003 | (10, 3) | auto | MQ-09 | Vignette: Curator as a young Architect, proudly broadcasting their first memory. |
| EV-F3-004 | (15, 4) | auto | MQ-09 | Vignette: Curator watching their community dissolve. Tears on their face. |
| EV-F3-005 | (10, 5) | auto | MQ-09 | Vignette: Curator founding the Preservers, face hardened with resolve. "Never again." |
| EV-F3-006 | (10, 6) | auto | MQ-09 | Final Resonance Stone: full HP/SP restore before the confrontation. |

**Enemy spawns**: None (narrative corridor).

#### Room 2: The First Memory Chamber (Tiles: 1,8 → 20,25)

**Dimensions**: 20 × 18 tiles
**Description**: The largest single room in the game. A circular chamber of flawless white crystal with the golden lattice at its center, holding the First Memory (MF-10) — a sphere of warm, pulsing light that is the world's original seed. The Curator stands between the player and the First Memory.

The Curator is B-05 (see [enemies-catalog.md](../design/enemies-catalog.md)) — but this is a **dialogue encounter**, not combat. The final confrontation plays out through conversation.

**The Confrontation Sequence** (MQ-09 objective 3):

1. **The Curator speaks** (position: 10, 15). Dialogue varies based on:
   - Which gods the player recalled (4 unique dialogue branches)
   - Whether the player carries K-06 (Curator's Manifesto) — unlocks a philosophical argument
   - Whether the player carries K-13 (Curator's Doubt) — shortens the encounter by one phase
   - Whether the player carries MF-09 (Curator's Grief) — unlocks the empathy dialogue option

2. **Three dialogue phases**:
   - Phase 1: The Curator argues for preservation. The player responds with evidence from their journey.
   - Phase 2: The Curator challenges the player's recalled gods — "You changed them. Were they better before?"
   - Phase 3: The player approaches the First Memory. The Curator either steps aside willingly (if K-13 carried), is held back by doubting Preservers (if GQ-01-A2/GQ-03-S1 completed), or simply watches in silence.

3. **The player collects the First Memory** (MF-10, calm/neutral/5) from the golden lattice at (10, 18).

**The Remix** (MQ-10):

4. The player uses the Remix interface to combine MF-10 with any fragment in their inventory.
5. This creates MF-11: World's New Dawn (joy/light/5).
6. The player broadcasts MF-11 from the center of the chamber.
7. **Endgame bloom triggers** (see [vibrancy-system.md](../world/vibrancy-system.md)): all zones rise to Vivid tier, Stagnation Zones shatter, the Sketch fills with color, the world blooms.

**Events**:

| ID | Position | Trigger | Quest | Description |
|----|----------|---------|-------|-------------|
| EV-F3-007 | (10, 12) | auto | MQ-09 | Curator confrontation begins. Dialogue sequence. |
| EV-F3-008 | (10, 15) | action | MQ-09 | Curator dialogue: phase responses based on carried items and recalled gods. |
| EV-F3-009 | (10, 18) | action | MQ-09 | Collect the First Memory (MF-10). MQ-09 objective 3 complete. |
| EV-F3-010 | (10, 18) | action | MQ-10 | Remix MF-10 → MF-11 (World's New Dawn). MQ-10 objective 1. |
| EV-F3-011 | (10, 18) | action | MQ-10 | Broadcast MF-11. Endgame bloom triggers. MQ-10 objective 2 complete. |
| EV-F3-012 | (10, 18) | auto | MQ-10 | Endgame cinematic: world blooms. See [act3-script.md](../story/act3-script.md) Scene 12. |
| EV-F3-013 | (10, 18) | auto | — | Post-game: memory lift activated. Returns to Undrawn Peaks (19, 35). |

**Enemy spawns**: None (Floor 3 has no combat).

### Floor 3 Summary

| Metric | Value |
|--------|-------|
| Rooms | 2 |
| Resonance Stones | 1 (rest, pre-confrontation) |
| Treasure Chests | 0 |
| Enemy types | None (dialogue floor) |
| Boss | B-05: The Curator (dialogue encounter, no combat) |
| Key items | MF-10 (The First Memory), MF-11 (World's New Dawn, created via remix) |
| Loot highlights | The ending itself |
| Memory lift | Post-game only → Undrawn Peaks |
| Puzzle | Dialogue encounter with branching based on carried items and recalled gods |
| Quest links | MQ-09 (objective 3), MQ-10 (all objectives) |

---

## God Shrine Dungeons

The four dormant god shrines in the Frontier are not traditional dungeons — they are **approach challenges** that the player must overcome to reach the recall pedestal. Each shrine is an outdoor area within its parent Frontier zone, not a separate map. The shrine approach is 10–15 tiles of navigable terrain with a unique mechanic tied to the god's domain.

Full shrine locations, recall mechanics, and 16 transformation outcomes are detailed in [dormant-gods.md](../world/dormant-gods.md). The approach challenges are:

### Resonance's Amphitheater (Resonance Fields, 25,25)

**Approach mechanic**: Harmonize 3 Resonance Stones surrounding the amphitheater. Each stone emits a dissonant tone. The player must broadcast a memory fragment into each stone (any emotion, any potency) to harmonize them and open the path. Wrong-element broadcasts produce louder dissonance (cosmetic feedback, no penalty). The path opens when all 3 are harmonized.

**Approach area**: (18, 20) → (32, 30), within the Resonance Fields map. No separate dungeon map needed.

**Approach enemies**: Sound Echoes, Stone Guardians (see [enemies-catalog.md](../design/enemies-catalog.md), Resonance Fields enemies).

### Verdance's Hollow (Shimmer Marsh, 25,35)

**Approach mechanic**: Clear a root barrier by broadcasting earth or water fragments (any potency) at 3 root clusters blocking the path. Each broadcast causes the roots to retract, opening a wider passage. The roots regrow after 30 seconds if the player retreats, requiring commitment to push through.

**Approach area**: (18, 28) → (32, 42), within the Shimmer Marsh map.

**Approach enemies**: Mire Crawlers, Echo Toads (see [enemies-catalog.md](../design/enemies-catalog.md), Shimmer Marsh enemies).

### Luminos Grove (Flickerveil, 20,20)

**Approach mechanic**: Requires K-04 (Light Lens) from Solen in Flickerveil. Without it, the grove's concentrated light blinds the player (screen whites out, player pushed back). With the Light Lens, the player can see a path of shadow stepping-stones through the blinding light. Walking on lit tiles without the Lens deals 30 HP damage per step.

**Approach area**: (14, 14) → (26, 26), within the Flickerveil map.

**Approach enemies**: Flicker Wisps, Canopy Crawlers (see [enemies-catalog.md](../design/enemies-catalog.md), Flickerveil enemies).

### Kinesis Spire (Hollow Ridge, 25,10)

**Approach mechanic**: Requires K-05 (Kinetic Boots) from Petra at Ridgewalker Camp. The Spire's vibrational pushback forces the player backward without them. With the boots, the player can resist the pushback and climb. The climb is a linear path (25, 15) → (25, 10) with 3 vibrational wave checkpoints where the player must stop and broadcast any fragment to create a stability anchor.

**Approach area**: (20, 5) → (30, 18), within the Hollow Ridge map.

**Approach enemies**: Wind Elementals, Mountain Drakes (see [enemies-catalog.md](../design/enemies-catalog.md), Hollow Ridge enemies).

---

## Dungeon Cross-Reference Table

### Entrance Summary

| Dungeon | Surface Map | Position | Entrance Type | Condition |
|---------|------------|----------|---------------|-----------|
| Depths L1: Memory Cellar | Village Hub | (8, 17) | Hidden passage (Memorial Garden) | After MQ-05 |
| Depths L2: Drowned Archive | Shimmer Marsh | (33, 43) | Deepwater Sinkhole | After MQ-05 |
| Depths L3: Resonant Caverns | Hollow Ridge | (38, 3) | Echo Caverns | After MQ-05 |
| Depths L4: The Songline | Resonance Fields | (28, 44) | Singing Stones passage | After Singing Stones puzzle |
| Depths L5: The Deepest Memory | Half-Drawn Forest | (13, 36) | Sketch Passage (hidden) | After MQ-08 |
| Preserver Fortress F1 | Undrawn Peaks | (19, 35) | Crystalline Fortress Gate | After MQ-08 (gate solidified) |

### Boss Summary

| Floor | Boss | Level | HP | Key Reward | Death Trigger |
|-------|------|-------|----|------------|---------------|
| Depths L2 | B-03a: The Archivist | 14–16 | 450 | Dissolved Essence | +10% INT for floor |
| Depths L3 | B-03b: The Resonant King | 16–18 | 550 | Dissolved Essence | Resonant Collapse |
| Depths L4 | B-03c: The Conductor | 19–21 | 650 | Phoenix Feather | Full HP/SP heal |
| Depths L5 | B-03d: The First Dreamer | 24–26 | 1,200 (2-phase) | Dissolved Essence ×2, Memory Incense | Peaceful dissolution |
| Fortress F1 | B-04a: Curator's Right Hand | 24–26 | 750 | Phoenix Feather (guaranteed) | Curator's Lament narrative |
| Fortress F2 | B-04b: The Archive Keeper | 26–28 | 900 | Dissolved Essence, Memory Incense | +15% all stats for Fortress |
| Fortress F3 | B-05: The Curator | — | — (dialogue) | MF-10 (The First Memory) | Endgame bloom |

### Treasure Distribution

| Floor | Chests | Best Item | Gold Total |
|-------|--------|-----------|------------|
| Depths L1 | 2 | Minor Potions, Mana Drops | 50 |
| Depths L2 | 4 | Dissolved Metal (SQ-11), Dissolved Essence | 120 |
| Depths L3 | 4 | Stasis Breakers, Dissolved Essence | 230 |
| Depths L4 | 5 | Tier 3 weapons (W-xx-08), Phoenix Feather | 450 |
| Depths L5 | 5 | Memory-Woven Plate (A-14), Tier 3 weapons | 300 |
| Fortress F1 | 2 | Phoenix Feather, Stasis Breakers | 0 |
| Fortress F2 | 3 | MF-09 (Curator's Grief), Panaceas | 500 |
| Fortress F3 | 0 | MF-10, MF-11 (created) | 0 |
| **Total** | **25** | | **~1,650** |

### Puzzle Summary

| Floor | Puzzle | Mechanic |
|-------|--------|----------|
| Depths L2 | Water valve sequence | Turn 3 valves in correct order (left → right → center) |
| Depths L3 | Sound Puzzle | Strike 5 crystal pillars in ascending chord sequence |
| Depths L3 | Harmonic Bridge | Walk (don't run) across resonant crystal bridge |
| Depths L4 | (Combat-focused) | No puzzle — dense encounters replace puzzle rooms |
| Depths L5 | Paradox Corridor | Walk backward to progress through looping corridor |
| Fortress F1 | Crystal Receptacle | Broadcast 3 matching-emotion fragments into receptacles |
| Fortress F2 | Moral Dilemma Gallery | Choose to free or leave 3 frozen NPCs (story consequence) |
| Fortress F3 | Curator Dialogue | Branching conversation based on inventory and recall choices |

### Quest Dependencies

| Quest | Dungeon Interaction |
|-------|-------------------|
| SQ-10 (Depths Expedition) | Depths L1 — objectives 3–5 |
| SQ-11 (Torvan's Masterwork) | Depths L2 — Dissolved Metal in Room 3 |
| GQ-02-S1 (The Composting) | Depths L2 Room 3, L3 Room 3, L4 Room 2 — 3 burdened Resonance Stones |
| GQ-03-F2 (Shadows of Curator) | Depths L5 Room 9 — Fortress basement shortcut |
| MQ-09 (Preserver Fortress) | Fortress F1–F3 — all objectives |
| MQ-10 (First Memory Remix) | Fortress F3 — remix and broadcast |
| K-14 (Elyn's Intel Report) | Fortress F1 Room 5 — reveals all events on floor map |
| GQ-01-A2 / GQ-03-S1 | Fortress F2 Room 5 — Preserver defector NPC shop |

### Floor-to-Floor Connections

```
Village Hub (8,17) → Depths L1 (10,0)
                        ↓ Room 5 stairway
Shimmer Marsh (33,43) → Depths L2 (10,0)
                        ↓ Room 7 stairway
Hollow Ridge (38,3) → Depths L3 (10,0)
                        ↓ Room 8 stairway
Resonance Fields (28,44) → Depths L4 (10,0)
                        ↓ Room 7 stairway
Half-Drawn Forest (13,36) → Depths L5 (10,0)
                        ↓ Room 9 shortcut (GQ-03-F2 only)
Undrawn Peaks (19,35) → Fortress F1 (10,0)
                        ↓ Room 6 stairway
                       Fortress F2 (10,0)
                        ↓ Room 6 stairway
                       Fortress F3 (10,0)
```

Note: Each Depths floor also has an independent surface entrance. The stairways provide sequential dungeon progression, but floors can be accessed in any order once their surface entrance conditions are met. The Fortress is strictly sequential (F1 → F2 → F3).
