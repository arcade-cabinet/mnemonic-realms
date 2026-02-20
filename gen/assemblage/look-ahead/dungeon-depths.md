# Look-Ahead: Dungeon Depths (L1-L5) Assemblages

## Summary

The Depths are a 5-level underground dungeon system, each level 20x25 tiles (at 32px; becomes 40x50 at 16px). Every level follows a room-and-corridor layout with locked progression, enemy zones, Resonance Stones, treasure chests, a memory lift (fast-travel back to surface), and a stairway to the next level. Levels 2-5 each have a boss fight.

This report covers two levels of analysis:
1. **Feature-level abstractions** (organisms) -- composable dungeon features that a DungeonComposer could auto-layout
2. **Atom/molecule inventory** -- tileset assets, semantic tiles, individual room factories

---

## Feature-Level Abstractions: The Dungeon Onion

Overworld maps compose organisms (hamlets, farms, shrines) onto open terrain with auto-routing paths between them. Dungeons need a fundamentally different composer because the topology is **negative space** -- walls are the default, and the composer carves out connected rooms. But the onion-layer principle still applies.

### Layer 1: Atoms (tiles + objects)

Individual tiles and placeable objects. These are the palette's semantic vocabulary.

| Atom | Examples | Notes |
|------|----------|-------|
| Floor tile | `terrain:stone-floor`, `terrain:crystal-floor`, `terrain:void` | Auto-tiled, per-level palette swap |
| Wall tile | `terrain:stone-wall` | Auto-tiled edges/corners, default fill |
| Water tile | `terrain:water-blue`, `terrain:water-green` | Auto-tiled edges, collision |
| Overlay tile | `fixed:fog-light`, `fixed:floor-rune`, `fixed:floor-moss` | ground2 detail/atmosphere |
| Prop object | `object:barrel`, `object:candle-wall`, `object:shelf-empty` | Decorative, placed on objects layer |
| Interactive object | `object:chest-closed`, `object:resonance-stone`, `object:memory-lift` | Has event hook |
| Door object | `object:door-wood`, `object:door-sealed` | Controls connectivity |

### Layer 2: Molecules (terrain patches + furniture clusters)

Small composable pieces that dress up a room or corridor. Not full assemblages -- they're stamped inside rooms by the composer.

| Molecule | Size | What It Is | Placed By |
|----------|------|------------|-----------|
| **Chest Nook** | 2x2 | Chest + wall indent + candle lighting | Any room type |
| **Resonance Alcove** | 2x3 | RS on a raised tile + ambient glow overlay | Any room type |
| **Rest Point** | 3x3 | Rest RS + benches/cushions + save-point marker | Safe rooms, hubs |
| **Lore Inscription** | 1x2 | Wall tile with action-event lore text | Entry halls, corridors |
| **Memory Lift Pad** | 3x3 | Lift crystal + glowing floor ring + transition event | One per level |
| **Stairway** | 3x4 | Stairway-down visual + transition event | Bottom of each level |
| **Raised Platform** | 3x3-5x5 | Elevated tile patch for forced encounter staging | Combat rooms |
| **Puzzle Object Cluster** | varies | 3-5 interactive objects (valves, pillars) + sealed door | Puzzle rooms |
| **Encounter Zone Marker** | NxM | Invisible bounds rect defining enemy spawn area | Combat rooms, corridors |
| **Burdened Stone** | 2x3 | Overloaded RS + quest event + sickly glow overlay | Quest rooms |
| **Bookshelf Row** | Nx1 | Line of shelf objects (empty/glowing variants) | L2 rooms |
| **Crystal Formation** | 2x2-3x3 | Crystal pillar cluster + prismatic ground2 overlay | L3 rooms |
| **Water Stepping Stones** | Nx2 | Passable tiles across water terrain | L2 flooded corridors |
| **Performer Ghost Cluster** | 3x3 | Translucent sprite objects, non-interactive | L4 verse rooms |
| **Floating Image** | 2x2 | Objects_upper sprite + action-event lore | L5 gallery rooms |

### Layer 3: Organisms (feature-level dungeon features)

These are the composable units that a DungeonComposer arranges on the map canvas. Each organism knows its own size, required connectivity (doors/anchors), and internal molecule placement. The composer places organisms and auto-routes corridors between them.

#### Universal Organisms (used across all 5 levels)

**1. Arrival Zone**
The top of every dungeon level. Always placed at the north edge of the canvas.

| Property | Value |
|----------|-------|
| Size | full-width x 3-6 rows |
| Contains | Surface entry transition, optional stairway-from-above transition, 1-2 lore inscriptions, 0-1 RS |
| Anchors | south (to first room/corridor) |
| Enemies | None (safe landing) |
| Variants | `cellar` (L1: wide, cobblestone, root-veined), `pool` (L2: shallow water floor), `crystal-cave` (L3: narrow, glittering), `golden-hall` (L4: luminous), `threshold` (L5: surreal, vision-trigger) |
| Composer rule | Always row 0. Full canvas width. One per level. |

**2. Gauntlet Wing**
A room where combat happens. The core gameplay space.

| Property | Value |
|----------|-------|
| Size | 8x5 to 20x5 (medium to wide) |
| Contains | Encounter zone marker, 0-1 RS, 0-1 chest, optional raised platform |
| Anchors | 1-3 doors (north, south, and/or east/west) |
| Enemies | 1-3 enemy types per encounter zone |
| Variants | `standard` (stone floor, enemy patrol), `flooded` (water terrain, speed penalty), `crystal` (crystal pillars, prismatic overlay), `crescendo` (dense encounters, L4-style) |
| Composer rule | 2-4 per level. Placed between entry and boss. Can chain vertically or branch horizontally. |

**3. Treasure Alcove**
A small side room with loot and optional lore. Reward for exploration.

| Property | Value |
|----------|-------|
| Size | 4x5 to 8x5 (small) |
| Contains | 1 chest (always), 0-1 RS, 0-1 lore inscription, optional enemy guard |
| Anchors | 1 door (connects to corridor or adjacent room) |
| Enemies | 0 or 1 (guard encounter) |
| Variants | `standard` (chest + candle), `library` (bookshelves + chest, L2), `crystal-grotto` (pool + chest, L3), `performer-notes` (inscriptions + chest, L4), `fragment-vault` (3+ RS in circle, L5) |
| Composer rule | 1-3 per level. Branched off main path as optional exploration. |

**4. Puzzle Gate**
A room containing an interactive puzzle that blocks forward progress.

| Property | Value |
|----------|-------|
| Size | 9x5 to 10x5 (medium) |
| Contains | Puzzle object cluster (3-5 interactive objects), sealed door, hint inscription (may be in a different room), failure-consequence event |
| Anchors | 2 doors: entry and gated exit |
| Enemies | 0-1 patrol (distraction while puzzling) |
| Variants | `valve-sequence` (L2: 3 water valves, ordered), `harmonic-pillars` (L3: 5 crystal pillars, chord sequence), `paradox-walk` (L5: directional reversal) |
| Composer rule | 0-1 per level. When present, sits on the critical path. Gated exit leads to hub, boss approach, or next wing. |

**5. Waystation**
A safe room with memory lift and rest RS. The player's mid-dungeon breather.

| Property | Value |
|----------|-------|
| Size | 8x5 to 10x5 |
| Contains | Memory lift pad, rest point, 0-1 chest |
| Anchors | 2-3 doors (connects to hub or main corridor) |
| Enemies | None (enforced safe zone) |
| Variants | `standard` (stone, lift + rest), `waterfall` (L2: cascading water visual), `interlude` (L4: sheet music walls, quiet pause in the song) |
| Composer rule | Exactly 1 per level. Placed at mid-level (vertically centered). Memory lift transition always points to the surface zone for this level. |

**6. Quest Shrine**
A room containing a burdened Resonance Stone or other quest-specific mechanic.

| Property | Value |
|----------|-------|
| Size | 4x5 to 10x5 |
| Contains | Burdened RS (quest event), healing/reward after resolution |
| Anchors | 1 door |
| Enemies | 0-1 (guard) |
| Variants | `burdened-stone` (GQ-02-S1: broadcast sorrow fragment to "compost"), `moral-dilemma` (choice event with branching outcomes) |
| Composer rule | 0-1 per level. Present on L2, L3, L4 for the three burdened stones of GQ-02-S1. Side room off the main path. |

**7. Lore Chamber**
A room focused on narrative delivery. The player learns something about the world.

| Property | Value |
|----------|-------|
| Size | 4x5 to 8x5 |
| Contains | Lore vision trigger (auto or action event), 0-1 RS, 0-1 chest, optional NPC echo |
| Anchors | 1 door |
| Enemies | None |
| Variants | `memory-fog` (L1: fog overlay + village visions), `reading-room` (L2: dissolved librarian echo), `crystal-pool` (L3: lore vision in water reflection), `verse` (L4: cinematic of performers dissolving), `echo-gallery` (L5: floating images of dissolved civilizations), `civilization-end` (L5: oldest dissolution vision) |
| Composer rule | 1-3 per level. Side rooms or inline narrative rooms. L4 is special: verse rooms ARE the main path (linear narrative corridor). |

**8. Boss Sanctum**
The climactic encounter space. Always at the bottom of the level.

| Property | Value |
|----------|-------|
| Size | full-width x 6-8 rows |
| Contains | Pre-fight dialogue trigger, boss fight trigger, post-victory trigger, boss reward chest, exit (stairway or end) |
| Anchors | north (from corridor/bridge), south (stairway to next level) |
| Enemies | Boss only (no random encounters) |
| Variants | `archive-amphitheater` (L2: semicircular bookshelves, lectern), `crystal-throne` (L3: massive RS throne), `concert-stage` (L4: translucent platform over starlight void), `memory-nexus` (L5: walls as windows into pure memory, shifting form boss) |
| Composer rule | Exactly 1 per level (except L1 which uses a gauntlet wing for its tutorial encounter). Always placed at the bottom. Full canvas width. |

**9. Hazard Crossing**
A traversal challenge connecting two areas. Not a puzzle -- a dexterity/knowledge check.

| Property | Value |
|----------|-------|
| Size | 11x5 (bridge) or 20x4 (flooded corridor) |
| Contains | Hazard mechanic (movement check, damage on failure), 0-1 enemy patrol |
| Anchors | 2 doors (entry and exit) |
| Variants | `harmonic-bridge` (L3: walk-only, running = 50 HP), `flood-hall` (L2: deep water with stepping stones, HP damage to reach hidden alcove), `void-bridge` (L5: abstract crossing over cosmic void) |
| Composer rule | 0-1 per level. Placed between hub/gauntlet and boss sanctum. Creates tension before the climax. |

**10. Hub Nexus**
A wide central room where multiple paths converge. The decision point of the level.

| Property | Value |
|----------|-------|
| Size | full-width x 4 rows |
| Contains | 0-2 RS, 0-1 chest, multiple exits to branches |
| Anchors | 3-5 doors (north, south, east, west, and possibly additional) |
| Enemies | 0-2 patrol (optional) |
| Variants | `crystal-nexus` (L3: prismatic mosaic floor), `memory-nexus` (L5: galaxy-window floor) |
| Composer rule | 0-1 per level. When present, sits at mid-level as the routing center. L1 doesn't need one (simple linear layout). L4 doesn't need one (linear narrative corridor). |

### Layer 4: The DungeonComposer

The DungeonComposer takes a level specification (list of organisms + connectivity graph) and auto-layouts them onto the 40x50 canvas.

#### How It Differs from the Overworld Composer

| Aspect | Overworld Composer | Dungeon Composer |
|--------|-------------------|------------------|
| Default fill | Open terrain (grass) | Solid wall (collision) |
| Organism placement | Free-form with spacing rules | Grid-aligned rooms carved from walls |
| Connectivity | Auto-routed paths (roads, rivers) | Auto-routed corridors (2-3 tiles wide, carved through wall) |
| Layout direction | Radial/organic (hub-and-spoke) | Top-to-bottom progression (entry -> boss) |
| Map border | Terrain border (forest, cliff) | All walls, no border assemblage needed |
| Anchor semantic | "connect a road here" | "place a door here, carve a corridor to the next door" |

#### Composer Algorithm (Proposed)

```
Input: DungeonSpec {
  canvas: { width: 40, height: 50 }
  palette: 'dungeon-cellar' | 'dungeon-archive' | ...
  organisms: [
    { type: 'arrival-zone', variant: 'cellar', ... },
    { type: 'gauntlet-wing', variant: 'standard', ... },
    ...
  ]
  connectivity: [
    { from: 'arrival', to: 'gauntlet-1', corridor: { width: 3 } },
    { from: 'gauntlet-1', to: 'treasure-1', corridor: { width: 2 } },
    ...
  ]
}

Algorithm:
1. Fill entire canvas with wall terrain + collision
2. Place arrival-zone at row 0 (full width)
3. Place boss-sanctum at bottom rows (full width)
4. Place waystation at vertical midpoint
5. Place remaining organisms using a top-to-bottom packing strategy:
   - Critical-path organisms (gauntlet, puzzle-gate) in the center column
   - Side organisms (treasure, quest-shrine, lore) branching east/west
6. Auto-route corridors between anchored doors:
   - Carve floor terrain + remove collision along corridor path
   - Use L-shaped or straight routing (prefer straight)
   - Place door objects at corridor-to-room junctions
7. Apply level-specific overlays:
   - L1: root-ceiling objects on objects_upper, fog on ground2
   - L2: water terrain in corridors, stepping-stone molecules
   - L3: crystal formation molecules, prismatic ground2
   - L4: golden glow ground2, phantom performers
   - L5: shifting color ground2, fog-dense overlay
8. Place molecules within organisms:
   - Each organism knows where to place its internal furniture
   - Chest nooks, RS alcoves, encounter zones, lore inscriptions
9. Output: MapComposition with all placements, objects, hooks
```

#### Level Specifications as Organism Graphs

Each level becomes a simple declarative spec -- a list of organisms and their connections:

**L1: Memory Cellar** (simplest -- linear)
```
arrival(cellar) -> corridor -> gauntlet(standard) -> corridor
                                                       |
                               treasure(standard) <----+
                                                       |
                               gauntlet(standard) -> corridor -> lore(memory-fog)
                                                                   |
                                                       corridor -> waystation(standard)
                                                       |
                                                       boss-sanctum(NONE -- uses gauntlet for tutorial)
                                                       -> stairway-exit
```

**L2: Drowned Archive** (branching + puzzle)
```
arrival(pool)
  |
  +-> gauntlet(flooded) --+-> quest-shrine(burdened)
  |                       |
  +-> corridor            |
  |                       |
  hazard(flood-hall) <----+
  |
  puzzle-gate(valve-sequence) --+-> waystation(waterfall)
  |
  boss-sanctum(archive-amphitheater) -> stairway-exit
```

**L3: Resonant Caverns** (hub-and-spoke)
```
arrival(crystal-cave)
  |
  +-> treasure(standard) -- quest-shrine(burdened)
  |
  puzzle-gate(harmonic-pillars)
  |
  hub-nexus(crystal-nexus) ---- waystation in hub
  |         |
  |         +-> lore(crystal-pool)
  |
  hazard(harmonic-bridge)
  |
  boss-sanctum(crystal-throne) -> stairway-exit
```

**L4: The Songline** (linear narrative corridor)
```
arrival(golden-hall) = lore(verse-1)
  |
  quest-shrine(burdened) + waystation(interlude)  [side by side]
  |
  gauntlet(crescendo) = lore(verse-3)
  |
  lore(verse-4) + treasure(performer-notes)  [side by side]
  |
  boss-sanctum(concert-stage) -> stairway-exit
```

**L5: The Deepest Memory** (maximum branching)
```
arrival(threshold)
  |
  +-> treasure(standard) -- treasure(standard)  [inverted + fracture rooms]
  |
  puzzle-gate(paradox-walk)
  |
  hub-nexus(memory-nexus) ---- waystation in hub
  |    |    |    |
  |    |    |    +-> lore(civilization-end)
  |    |    +-> treasure(fragment-vault)
  |    +-> lore(echo-gallery)
  |
  lore(lore-archive) + shortcut-exit(fortress)
  |
  boss-sanctum(memory-nexus) [no stairway -- deepest level]
```

### Cross-Domain Feature Parallels

The dungeon organisms map to overworld organisms conceptually:

| Overworld Organism | Dungeon Equivalent | Shared Pattern |
|-------------------|-------------------|----------------|
| Hamlet (cluster of houses + NPCs) | Waystation (lift + rest + safe zone) | "Player rest/resupply hub" |
| Farm (wheat fields + farmhouse) | Gauntlet Wing (encounter zone + loot) | "Primary gameplay space" |
| Shrine (standing stones + RS) | Quest Shrine (burdened RS + quest event) | "Fragment interaction point" |
| Market (shops + merchant NPCs) | -- (no equivalent in dungeons) | -- |
| Stagnation Clearing (crystal zone) | -- (dungeons don't have stagnation) | -- |
| Windmill / Landmark (visual landmark + lore) | Lore Chamber (narrative + vision) | "Lore delivery point" |
| Secret area (hidden path + reward) | Treasure Alcove (optional side room) | "Exploration reward" |
| Boss encounter zone | Boss Sanctum | "Climactic encounter" |
| -- | Puzzle Gate | Dungeon-exclusive (overworld has no gate puzzles) |
| -- | Hazard Crossing | Dungeon-exclusive (overworld has no traversal hazards) |
| Map border (forest-border assemblage) | Wall fill (default canvas) | "Map boundary treatment" |
| Road (PathSegment) | Corridor (carved through wall) | "Connectivity" |

---

## Key Structural Differences from Overworld Maps

Dungeons differ from overworld maps in several fundamental ways that affect assemblage design:

1. **Room-based layout**: Overworld maps are open terrain with placed assemblages. Dungeon maps are enclosed rooms connected by corridors. Walls are the default; open space is carved out.
2. **Default fill is wall, not ground**: The canvas default should be `wall.stone` (collision enabled). Rooms and corridors are stamped on top, carving walkable space.
3. **No paths/roads**: Corridors replace the `PathSegment` system. Corridors are narrow (2-3 tiles wide) connecting rooms.
4. **Fixed vibrancy**: Unlike overworld zones, dungeon vibrancy does not change with player broadcasts. Visual tier is baked into the palette.
5. **No outdoor terrain**: No grass, trees, water bodies. Terrain is stone, crystal, water (flooded), void.
6. **Vertical connectivity**: Every level has entry (top), stairway (bottom), and memory lift (mid-level fast-travel).
7. **Encounter zones**: Enemy spawn areas are defined per-room, not per-map-region. Narrow corridors (< 3 tiles) are encounter-free.
8. **6-layer TMX structure**: Same as overworld (ground, ground2, objects, objects_upper, collision, events) but uses dungeon-specific tile semantics.

---

## Tileset Palette: `dungeon-depths`

**Source**: `assets/tilesets/depths/` (16 PNG files, no TSX yet)

### Available Tileset Assets

| Asset File | Content | Used By |
|------------|---------|---------|
| `classic_dungeons_WALLS.png` | Wall tiles, edges, corners | All levels |
| `classic_dungeons_stone_floor.png` | Stone floor variants | L1, L2, L3 |
| `classic_dungeons_stone_floor_wall_edges.png` | Floor-to-wall transition | All levels |
| `classic_dungeons_general_detail.png` | Props, furniture, barrels, crates, shelves | All levels |
| `classic_dungeons_doors.png` | Door variants (wood, iron, sealed) | All levels |
| `classic_dungeons_door_exit_enter.png` | Entry/exit door tiles | All levels |
| `classic_dungeons_animated_candles.png` | Animated candle/lantern props | L1, L2 |
| `classic_dungeons_animated_box_chest.png` | Chest open/close animation | All levels |
| `classic_dungeons_stagnant_water_blue.png` | Blue water (flooding) | L2 |
| `classic_dungeons_stagnant_water_green.png` | Green water (marsh/sewer) | L2 |
| `classic_dungeons_stagnant_water_red.png` | Red water (lava/danger) | L5 (surreal) |
| `classic_dungeons_sewer_details.png` | Pipes, grates, drain details | L1, L2 |
| `classic_dungeons_foilage_overgrowth.png` | Vines, moss, root growth | L1 |
| `classic_dungeons_jail_door.png` | Barred door/gate | L3, L5 |
| `fog_1.png` | Fog overlay (light) | L1 (memory fog), L4 |
| `fog_2.png` | Fog overlay (dense) | L5 (surreal void) |

### TSX Creation Required

None of these PNGs have TSX files yet. Before building any dungeon map, TSX files must be created for:
- Walls (with Wang set for auto-tiling wall edges/corners)
- Stone floor (with Wang set for floor variants)
- Water (with auto-tile for water edges)
- All prop sheets (standard tile grids)

### Semantic Tile Mapping (Proposed)

```
# Terrain (auto-tiled via Wang sets)
terrain:stone-floor         # Standard stone floor
terrain:stone-floor-dark    # Darker variant (L3, L5)
terrain:stone-wall          # Solid wall
terrain:water-blue          # Flooded corridors (L2)
terrain:water-green         # Stagnant pools
terrain:crystal-floor       # Crystal terrain (L3)
terrain:void                # Empty void (L5 surreal)

# Fixed tiles
fixed:floor-crack           # Ground2 detail
fixed:floor-moss            # Ground2 detail
fixed:floor-rune            # Ground2 detail (L3, L4)
fixed:floor-puddle          # Ground2 detail (L2)
fixed:fog-light             # Ground2 overlay (L1, L4)
fixed:fog-dense             # Ground2 overlay (L5)

# Objects
object:door-wood            # Standard door
object:door-iron            # Heavy door
object:door-sealed          # Locked/puzzle door
object:door-bars            # Jail/barred door
object:chest-closed         # Treasure chest
object:barrel               # Decorative barrel
object:crate                # Decorative crate
object:candle-wall          # Wall-mounted candle
object:candle-floor         # Floor candlestick
object:shelf-empty          # Empty bookshelf (L2)
object:shelf-glowing        # Glowing shelf (L2)
object:pillar-stone         # Stone pillar
object:pillar-crystal       # Crystal pillar (L3)
object:stairway-down        # Stairway to next level
object:stairway-up          # Stairway to previous level
object:memory-lift          # Memory lift crystal
object:resonance-stone      # Standard RS
object:resonance-stone-cracked  # Cracked RS (L1)
object:resonance-stone-burdened # Burdened RS (quest)
object:resonance-stone-rest     # Rest/save RS
object:vine-wall            # Overgrowth on walls (L1)
object:root-ceiling         # Root piercing ceiling (L1)
object:pipe-wall            # Sewer pipe detail
object:grate-floor          # Floor grate
```

---

## Per-Level Analysis

### Level 1: Memory Cellar (Act I, Scene 9)

**Theme**: Tutorial dungeon. Ancient village ruins beneath Everwick's Memorial Garden.
**Vibrancy**: 25 (Muted)
**Palette mood**: Warm stone, amber lantern glow, brown wood, root systems.
**Size**: 20x25 at 32px -> 40x50 at 16px
**Rooms**: 5
**Boss**: None (forced encounter in Room 3 is tutorial-tier)
**Surface connection**: Everwick (8,17) via entry and memory lift

#### Rooms Breakdown

| Room | Name | Dims (32px) | Dims (16px) | Type | Notes |
|------|------|-------------|-------------|------|-------|
| 1 | Entry Hall | 20x6 | 40x12 | entry | Safe area, lore inscription, cracked RS |
| 2 | Memory Alcove | 8x5 | 16x10 | side-room | RS, chest, 1 enemy patrol |
| 3 | Guardian Chamber | 11x5 | 22x10 | combat-room | Forced encounter, raised platform |
| 4 | Dissolved Memory Cache | 11x6 | 22x12 | reward-room | RS, chest, memory fog vision, no enemies |
| 5 | Stairway Chamber | 11x8 | 22x16 | stairway | Memory lift, stairway down, enemy patrol |

#### Assemblage Factories Needed

- `dungeon-entry-hall` (wide room with entry stairs from surface)
- `dungeon-side-room` (small alcove off a corridor)
- `dungeon-combat-room` (medium room with raised platform for forced encounters)
- `dungeon-reward-room` (medium room with lore elements, no enemies)
- `dungeon-stairway-room` (room with stairway down + memory lift)
- `dungeon-corridor-v` (vertical connecting corridor, 2-3 tiles wide)
- `dungeon-corridor-h` (horizontal connecting corridor, 2-3 tiles wide)

#### Unique Elements
- Root systems piercing ceiling (object layer)
- Amber lantern brackets (some lit, some dark)
- Memory fog overlay (animated ground2 in Room 4)
- Cobblestone floor variant (warmer than standard stone)

---

### Level 2: Drowned Archive (Act II, Scene 8)

**Theme**: Submerged library. Blue-green water fills corridors.
**Vibrancy**: 35 (Normal)
**Palette mood**: Blue-green water, dark stone, glowing ink, waterlogged bookshelves.
**Size**: 20x25 at 32px -> 40x50 at 16px
**Rooms**: 7
**Boss**: B-03a The Archivist (HP 450)
**Surface connection**: Shimmer Marsh (33,43)

#### Rooms Breakdown

| Room | Name | Dims (32px) | Dims (16px) | Type | Notes |
|------|------|-------------|-------------|------|-------|
| 1 | Entry Pool | 20x4 | 40x8 | entry | Shallow luminous pool, safe |
| 2 | Reading Hall | 9x5 | 18x10 | combat-room | Waterlogged desks, RS, chest |
| 3 | Burdened Stone Chamber | 10x5 | 20x10 | quest-room | GQ-02-S1 burdened RS |
| 4 | Flood Hall | 20x4 | 40x8 | corridor-room | Deep water, stepping stones, RS |
| 5 | Water Puzzle Chamber | 9x5 | 18x10 | puzzle-room | 3 valve puzzle |
| 6 | Memory Lift Chamber | 10x5 | 20x10 | safe-room | Lift, rest RS, waterfall |
| 7 | Boss Arena | 20x7 | 40x14 | boss-room | The Archivist |

#### Assemblage Factories Needed

- `dungeon-flooded-entry` (wide pool entry room)
- `dungeon-flooded-corridor` (corridor with water tiles, stepping stones)
- `dungeon-puzzle-room` (room with interactive puzzle objects)
- `dungeon-boss-arena` (large room, 20x7+ tiles, boss encounter area)
- `dungeon-safe-room` (memory lift + rest RS, no enemies)
- `dungeon-quest-room` (burdened RS or quest-specific mechanic)

#### Unique Elements
- Water terrain (blue) filling corridors to varying depths
- Waterlogged bookshelves (decorative objects)
- Floating memory orbs (animated objects_upper)
- Water valve puzzle mechanic (3 valves, ordered sequence)
- Stepping stones across deep water

#### Puzzle: Water Valve Sequence
- 3 action events (left, right, center valves)
- Correct order: left -> right -> center
- Wrong sequence: flood damage (30 HP), reset
- Hint: submerged mural in same room

---

### Level 3: Resonant Caverns (Act II)

**Theme**: Sound-themed crystal caves. Prismatic refractions.
**Vibrancy**: 40 (Normal)
**Palette mood**: Purple crystal, grey stone, prismatic rainbow patterns.
**Size**: 20x25 at 32px -> 40x50 at 16px
**Rooms**: 8
**Boss**: B-03b The Resonant King (HP 550)
**Surface connection**: Hollow Ridge (38,3)

#### Rooms Breakdown

| Room | Name | Dims (32px) | Dims (16px) | Type | Notes |
|------|------|-------------|-------------|------|-------|
| 1 | Crystal Entry | 20x3 | 40x6 | entry | Crystal staircase, hint inscription |
| 2 | Echo Chamber | 4x5 | 8x10 | side-room | RS, amplified echoes |
| 3 | Burdened Stone Alcove | 4x5 | 8x10 | quest-room | GQ-02-S1 burdened RS |
| 4 | Sound Puzzle Hall | 10x5 | 20x10 | puzzle-room | 5 crystal pillars, harmonic barrier |
| 5 | Crystal Nexus | 20x4 | 40x8 | hub-room | Memory lift, RS, chest, central hub |
| 6 | Crystal Grotto | 8x5 | 16x10 | lore-room | Crystal pool, lore vision, RS |
| 7 | Harmonic Bridge | 11x5 | 22x10 | hazard-room | Bridge over chasm, walk-only |
| 8 | Boss Arena | 20x8 | 40x16 | boss-room | The Resonant King |

#### Assemblage Factories Needed

- `dungeon-crystal-entry` (narrow entry with crystal formations)
- `dungeon-crystal-hub` (wide central nexus room)
- `dungeon-crystal-grotto` (natural cavern with pool)
- `dungeon-bridge-room` (room with hazardous bridge over chasm)
- Reuse: `dungeon-puzzle-room`, `dungeon-quest-room`, `dungeon-side-room`, `dungeon-boss-arena`

#### Unique Elements
- Crystal pillar objects (5 pillars, each an action event producing tones)
- Harmonic barrier (sealed door, removed on puzzle solve)
- Crystal bridge over void/chasm
- Walk-speed hazard (running on bridge = 50 HP damage)
- Prismatic light refraction (ground2 rainbow overlay)

#### Puzzle: Sound Pillar Sequence
- 5 crystal pillars: A, C, E, G, B
- Correct order: C -> E -> G -> A -> B (ascending chord)
- Wrong sequence: 40 HP party damage, reset
- Hint: inscription in Room 1

---

### Level 4: The Songline (Act II, Scene 13)

**Theme**: Linear memory-corridor. Each room is a "verse" of a dissolved song.
**Vibrancy**: 45 (Normal)
**Palette mood**: Gold light corridors, translucent walls, star-motes, luminous void.
**Size**: 20x25 at 32px -> 40x50 at 16px
**Rooms**: 7
**Boss**: B-03c The Conductor (HP 650)
**Surface connection**: Resonance Fields (28,44)

#### Rooms Breakdown

| Room | Name | Dims (32px) | Dims (16px) | Type | Notes |
|------|------|-------------|-------------|------|-------|
| 1 | First Verse (Prelude) | 20x4 | 40x8 | entry + narrative | Lore vision auto-trigger, RS |
| 2 | Second Verse (Rising) | 11x5 | 22x10 | quest-room | GQ-02-S1 final burdened RS |
| 3 | Memory Lift / Interlude | 8x5 | 16x10 | safe-room | Lift, rest RS |
| 4 | Third Verse (Crescendo) | 20x5 | 40x10 | combat-room | Dense encounters, guarded chest |
| 5 | Fourth Verse (Dissolution) | 11x5 | 22x10 | narrative-room | Lore vision, chest |
| 6 | Treasure Alcove | 8x5 | 16x10 | loot-room | Best non-boss loot |
| 7 | Boss Arena (The Conductor) | 20x6 | 40x12 | boss-room | The Conductor |

#### Assemblage Factories Needed

- `dungeon-memory-corridor` (linear golden-light corridor, verse-themed)
- `dungeon-loot-alcove` (small side room with treasure + lore inscriptions)
- Reuse: `dungeon-boss-arena`, `dungeon-safe-room`, `dungeon-quest-room`, `dungeon-combat-room`

#### Unique Elements
- Golden light corridors (ground2 glow overlay)
- Translucent walls (objects layer with transparency effect)
- Phantom performer sprites (animated objects, non-interactive)
- Linear progression (mostly straight-line layout, not branching)
- Narrative visions auto-triggering on room entry
- The Conductor's death trigger heals all party HP/SP (unique boss mechanic)

#### No Puzzle
This is a combat-focused floor. The narrative visions are the "puzzle" -- the player experiences the Choir's dissolution story through 5 verses.

---

### Level 5: The Deepest Memory (Act III)

**Theme**: Abstract, surreal, non-euclidean. Shifting hues, cosmic void.
**Vibrancy**: 30 (Muted -- paradoxically dimmer than L3/L4)
**Palette mood**: Shifting hues (amber to violet to indigo), non-euclidean geometry, cosmic void.
**Size**: 20x25 at 32px -> 40x50 at 16px
**Rooms**: 10
**Boss**: B-03d The First Dreamer (HP 1200, two-phase)
**Surface connection**: Half-Drawn Forest (13,36)
**Special**: Shortcut to Preserver Fortress via Room 9 (requires GQ-03-F2)

#### Rooms Breakdown

| Room | Name | Dims (32px) | Dims (16px) | Type | Notes |
|------|------|-------------|-------------|------|-------|
| 1 | The Threshold | 20x3 | 40x6 | entry | Vision montage auto-trigger |
| 2 | Inverted Chamber | 4x5 | 8x10 | side-room | Gravity-reversed cosmetic, high-value RS |
| 3 | Timeline Fracture | 4x5 | 8x10 | side-room | Split room (vivid/muted halves), chest |
| 4 | Paradox Corridor | 10x5 | 20x10 | puzzle-room | Walk-backward puzzle |
| 5 | Memory Nexus | 20x4 | 40x8 | hub-room | Central hub, lift, rest RS |
| 6 | Echo Gallery | 4x5 | 8x10 | lore-room | Floating images, Grym origin lore |
| 7 | Civilization's End | 4x5 | 8x10 | narrative-room | Oldest dissolution vision |
| 8 | Fragment Vault | 4x5 | 8x10 | reward-room | 3 high-potency RS (potency 4) |
| 9 | Lore Archive | 5x5 | 10x10 | lore-room | Final lore, chest, Fortress shortcut |
| 10 | Boss Arena | 20x8 | 40x16 | boss-room | The First Dreamer (two-phase) |

#### Assemblage Factories Needed

- `dungeon-surreal-room` (room with shifting palette, non-euclidean cosmetics)
- `dungeon-split-room` (room divided into two visual halves)
- `dungeon-paradox-corridor` (corridor with loop/reverse mechanic)
- `dungeon-fragment-vault` (room with multiple high-value RS in a circle)
- `dungeon-gallery` (room with floating image objects)
- Reuse: `dungeon-boss-arena`, `dungeon-hub-room`/`dungeon-crystal-hub`, `dungeon-safe-room`, `dungeon-lore-room`

#### Unique Elements
- Non-euclidean cosmetics (inverted gravity, split reality)
- Paradox corridor: walking forward loops back, walking backward progresses
- Shifting color palette (ground2 overlays cycling amber/violet/indigo)
- Two-phase boss (First Dreamer: HP 1200->600 test, 600->0 offering)
- Fortress shortcut (Room 9 -> Fortress F1, gated by quest flag)
- Densest fragment deposit: 6 RS with potency 4 fragments
- Boss ends by asking player to broadcast a fragment (unique mechanic)

#### Puzzle: Paradox Corridor
- Walking forward past trigger point teleports player back to start
- Walking backward through trigger point allows normal progress
- No hint in this level; hint is in L4 Room 6 performer's note
- No penalty, just no progress when going wrong way

---

## Cross-Cutting Assemblage Patterns

### Organism-to-Factory Mapping

The organism abstractions above map down to concrete assemblage factories. Each organism is implemented as a factory function that returns an `AssemblageDefinition`, internally composed from molecules.

### Reusable Dungeon Assemblage Factories (Full Catalog)

These should be parameterized to accept theme/palette variations. Organized by which organism they implement:

| Factory | Description | Reused By | Params |
|---------|-------------|-----------|--------|
| `dungeon-entry-hall` | Wide room with surface entry stairs | L1-L5 | width, has_inscription, has_rs |
| `dungeon-corridor-v` | Vertical connecting corridor | All levels | length, width (2-3), has_door |
| `dungeon-corridor-h` | Horizontal connecting corridor | All levels | length, width (2-3), has_door |
| `dungeon-side-room` | Small alcove (4-8 tiles wide) | L1, L2, L3, L5 | width, height, contents[] |
| `dungeon-combat-room` | Medium room with encounter zone | L1, L2, L4 | width, height, has_platform |
| `dungeon-puzzle-room` | Room with interactive puzzle objects | L2, L3 | width, height, puzzle_type |
| `dungeon-reward-room` | Lore/treasure room, no enemies | L1, L4, L5 | width, height |
| `dungeon-safe-room` | Memory lift + rest RS | L2, L3, L4, L5 | width, height |
| `dungeon-quest-room` | Burdened RS or quest mechanic | L2, L3, L4 | width, height |
| `dungeon-boss-arena` | Large room (20x6-8), boss encounter | L2, L3, L4, L5 | width, height, boss_id |
| `dungeon-stairway-room` | Room with stairway down + memory lift | L1 | width, height |
| `dungeon-hub-room` | Central nexus (wide, multi-exit) | L3, L5 | width, height |
| `dungeon-loot-alcove` | Small treasure + lore room | L4, L5 | width, height |
| `dungeon-flooded-corridor` | Corridor with water tiles | L2 | length, water_depth |
| `dungeon-flooded-entry` | Entry room with shallow pool | L2 | width |
| `dungeon-crystal-entry` | Narrow crystal cave entry | L3 | width |
| `dungeon-crystal-grotto` | Natural cavern with pool | L3 | width, height |
| `dungeon-bridge-room` | Bridge over chasm/void | L3 | bridge_length |
| `dungeon-memory-corridor` | Golden-light verse corridor | L4 | width, verse_number |
| `dungeon-surreal-room` | Room with shifting palette | L5 | effect_type |
| `dungeon-split-room` | Room divided into visual halves | L5 | left_theme, right_theme |
| `dungeon-paradox-corridor` | Loop/reverse mechanic corridor | L5 | length |
| `dungeon-fragment-vault` | Multiple high-value RS | L5 | rs_count |
| `dungeon-gallery` | Floating image display room | L5 | image_count |

### Minimum Viable Set (Priority Order)

For initial implementation, these 10 factories cover all 5 levels:

1. **`dungeon-entry-hall`** -- every level needs one
2. **`dungeon-corridor-v`** + **`dungeon-corridor-h`** -- connects everything
3. **`dungeon-side-room`** -- small generic room (alcoves, side chambers)
4. **`dungeon-combat-room`** -- medium room with encounter zones
5. **`dungeon-boss-arena`** -- large room for boss fights
6. **`dungeon-safe-room`** -- memory lift + rest point
7. **`dungeon-puzzle-room`** -- interactive puzzle objects
8. **`dungeon-reward-room`** -- lore/treasure rooms
9. **`dungeon-hub-room`** -- central nexus
10. **`dungeon-flooded-corridor`** -- L2-specific water corridors

Level-specific factories (crystal, surreal, memory-corridor, etc.) can be built as each level is reached in the scene-building sequence.

---

## Transition Patterns Between Levels

All dungeon levels follow a consistent vertical connection pattern:

```
Surface Zone (overworld map)
     |
     v  (entry event, touch trigger at top of map)
[Level N, Room 1: Entry Hall]
     |
     | (rooms and corridors)
     |
[Level N, Mid-level: Safe Room with Memory Lift]
     |  ^-- memory lift returns to surface
     |
     | (more rooms, boss arena)
     |
[Level N, Bottom: Stairway Room]
     |
     v  (stairway event, touch trigger at bottom of map)
[Level N+1, Room 1: Entry Hall]
```

### Connection Table

| From | Exit Tile (32px) | Direction | To | Entry Tile (32px) |
|------|-----------------|-----------|-----|-------------------|
| Everwick (8,17) | -- | down | L1 (10,0) | Entry |
| L1 (12,20) | -- | up | Everwick (8,17) | Memory lift |
| L1 (15,22) | -- | down | L2 (10,0) | Stairway |
| Shimmer Marsh (33,43) | -- | down | L2 (10,0) | Alt entry |
| L2 (15,16) | -- | up | Shimmer Marsh (33,43) | Memory lift |
| L2 (10,24) | -- | down | L3 (10,0) | Stairway |
| Hollow Ridge (38,3) | -- | down | L3 (10,0) | Alt entry |
| L3 (3,10) | -- | up | Hollow Ridge (38,3) | Memory lift |
| L3 (10,24) | -- | down | L4 (10,0) | Stairway |
| Resonance Fields (28,44) | -- | down | L4 (10,0) | Alt entry |
| L4 (4,7) | -- | up | Resonance Fields (28,44) | Memory lift |
| L4 (10,24) | -- | down | L5 (10,0) | Stairway |
| Half-Drawn Forest (13,36) | -- | down | L5 (10,0) | Alt entry |
| L5 (3,10) | -- | up | Half-Drawn Forest (13,36) | Memory lift |
| L5 (19,16) | -- | down | Fortress F1 (10,0) | Shortcut (quest-gated) |

### Dual Entry Pattern
Levels 2-5 each have TWO entries: one from the level above (stairway) and one from a surface zone. The surface entry and the stairway entry converge on the same entry room (tile 10,0). This means each entry hall needs to handle both inbound transitions.

---

## Boss Room Requirements

| Level | Boss | HP | Arena Size (32px) | Arena Size (16px) | Special Mechanic |
|-------|------|------|-------------------|-------------------|------------------|
| L1 | None | -- | -- | -- | Tutorial forced encounter |
| L2 | The Archivist | 450 | 20x7 | 40x14 | Water magic, book barricades |
| L3 | The Resonant King | 550 | 20x8 | 40x16 | Royal Chord, Harmonic Shield |
| L4 | The Conductor | 650 | 20x6 | 40x12 | 4-movement symphony, death heals party |
| L5 | The First Dreamer | 1200 | 20x8 | 40x16 | Two-phase, ends via broadcast |

Boss arenas are always the widest rooms (full 20-tile width at 32px). They need:
- Pre-fight dialogue trigger (action event)
- Boss fight trigger (auto event, chained after dialogue)
- Post-victory trigger (auto event, drops/effects)
- Treasure chest (boss reward)
- Exit (stairway to next level, or end-of-dungeon)

---

## Puzzle Mechanics Summary

| Level | Puzzle | Room | Mechanic | Hint Location |
|-------|--------|------|----------|---------------|
| L1 | None | -- | -- | -- |
| L2 | Water Valves | Room 5 | 3 valves, ordered sequence (left->right->center) | Submerged mural in Room 5 |
| L3 | Sound Pillars | Room 4 | 5 crystal pillars, ascending chord (C->E->G->A->B) | Inscription in Room 1 |
| L4 | None | -- | Combat-focused floor | -- |
| L5 | Paradox Corridor | Room 4 | Walk backward to progress | Performer's note in L4 Room 6 |

Puzzle assemblages need:
- Multiple action event objects (valves, pillars)
- A sealed door/barrier object (opened on puzzle solve)
- Failure consequence (HP damage, reset)
- Hint object (inscription, mural) in another room

---

## Implementation Recommendations

### Build Order

1. **L1 first** -- tutorial dungeon, simplest layout, establishes all base patterns
2. **L2 second** -- introduces water terrain and puzzle mechanics
3. **L3 third** -- introduces crystal theme and more complex puzzles
4. **L4 fourth** -- linear layout, combat-focused (simpler than L3)
5. **L5 last** -- most complex (10 rooms, surreal effects, two-phase boss)

### TSX Prerequisite

Before any dungeon map can be built, the `assets/tilesets/depths/` PNGs need TSX files created via the tsx-parser. This is a blocking dependency. The TSX files should define:
- Wang sets for stone floor auto-tiling
- Wang sets for wall edge auto-tiling
- Wang sets for water edge auto-tiling
- Standard tile definitions for all props/objects

### Palette Strategy

A single `dungeon-depths` palette can be shared across all 5 levels with per-level terrain overrides:
- L1: `terrain:stone-floor` = warm cobblestone variant
- L2: `terrain:stone-floor` = dark wet stone, `terrain:water-blue` for flooded areas
- L3: `terrain:crystal-floor` = crystal terrain, `terrain:stone-floor-dark` for walls
- L4: `terrain:stone-floor` = golden-tinted translucent floor
- L5: `terrain:void` = surreal shifting floor

Alternatively, 5 sub-palettes (`dungeon-cellar`, `dungeon-archive`, `dungeon-cavern`, `dungeon-songline`, `dungeon-abyss`) could each customize the semantic mappings while sharing the same underlying tileset assets.

### Canvas Default

Unlike overworld maps where `defaultGround` is a terrain type (e.g., `terrain:grass`), dungeon maps should use:
```
defaultGround: 'terrain:stone-wall'
```
With collision enabled by default. Rooms and corridors are carved out by stamping passable terrain on top.

### DungeonComposer: New Types Needed

The current `MapComposition` type assumes overworld-style layout. Dungeons need new types or extensions:

```typescript
/** A dungeon organism placed in the composer's layout */
interface DungeonOrganism {
  type: 'arrival' | 'gauntlet' | 'treasure' | 'puzzle-gate' | 'waystation'
      | 'quest-shrine' | 'lore' | 'boss-sanctum' | 'hazard' | 'hub';
  variant: string;  // e.g., 'cellar', 'flooded', 'crystal-cave'
  /** Molecules to place inside this organism */
  molecules?: MoleculeRef[];
  /** Event objects specific to this organism instance */
  objects?: AssemblageObject[];
  hooks?: EventHook[];
}

/** A molecule placed inside an organism */
interface MoleculeRef {
  type: 'chest-nook' | 'rs-alcove' | 'rest-point' | 'lore-inscription'
      | 'memory-lift' | 'stairway' | 'raised-platform' | 'puzzle-cluster'
      | 'encounter-zone' | 'burdened-stone' | 'bookshelf-row'
      | 'crystal-formation' | 'stepping-stones' | 'performer-ghost'
      | 'floating-image';
  /** Relative position within the organism (auto-placed if omitted) */
  position?: { x: number; y: number };
  /** Molecule-specific config */
  config?: Record<string, unknown>;
}

/** Connectivity edge between two organisms */
interface DungeonEdge {
  from: string;  // organism ID
  to: string;    // organism ID
  corridor: {
    width: 2 | 3;
    hasDoor?: boolean;
    doorType?: 'wood' | 'iron' | 'sealed' | 'bars';
    terrain?: string;  // floor override for this corridor
  };
}

/** Complete dungeon level specification */
interface DungeonSpec {
  id: string;
  name: string;
  canvas: { width: number; height: number };
  palette: string;
  vibrancy: number;
  surfaceConnection: { map: string; tile: string };
  organisms: Record<string, DungeonOrganism>;
  connectivity: DungeonEdge[];
}
```

This would let each dungeon level be defined as a compact organism graph (see "Level Specifications as Organism Graphs" above) rather than hand-placing 20+ individual assemblages.

### Phased Implementation

**Phase A: Build with molecule-level factories (current system)**
- Write assemblage factories for each room type
- Manually compose them in MapComposition definitions
- This works now with existing types

**Phase B: Introduce organism wrappers**
- Each organism factory internally composes its molecules
- Still placed manually in MapComposition, but organisms handle their own internal layout

**Phase C: Build DungeonComposer**
- Takes a DungeonSpec (organism graph)
- Auto-places organisms top-to-bottom
- Auto-routes corridors between doors
- Outputs MapComposition
- Eliminates manual x,y placement for dungeon maps

Phase A can start immediately. Phase C is the end goal -- dungeons should be as easy to define as "list of rooms + how they connect."
