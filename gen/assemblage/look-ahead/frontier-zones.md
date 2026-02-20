# Frontier Zones -- Feature-Level Abstraction Report

> Scouted by frontier-scout. Sources: `docs/story/act2-script.md`, `docs/maps/frontier-zones.md`, `gen/ddl/maps/*.json`, existing assemblage factories and palette specs, Everwick map composition.

---

## The Abstraction Problem

The current assemblage system operates at the **molecule** level: `createHouse()`, `createForestBorder()`, `createWheatField()`. The Everwick map composition then manually places these molecules at hardcoded coordinates with hand-authored paths and loose visual objects. This works for one map but does not scale to 20+ maps.

The Frontier needs a **feature** layer (organisms) that composes molecules into meaningful gameplay clusters, and a **composer** layer that arranges features on a canvas with auto-routing paths and fill tiles.

### The Onion Model

```
ATOMS          Semantic tiles: 'terrain:ground.marsh', 'terrain:water', etc.
               Palette objects: 'tree.autumn-1', 'rock.seasons-2', etc.
               (Resolved by PaletteSpec at serialization time)

MOLECULES      Building, TreeCluster, TerrainPatch, WaterBody, PropGroup
               (Current: house.ts, forest-border.ts, wheat-field.ts, etc.)
               These are AssemblageDefinition instances — a tile stamp + collision + visuals

ORGANISMS      Hamlet, Shrine, Stagnation Zone, Boardwalk Network, Ridge Trail System
  (FEATURES)   Compose multiple molecules + NPCs + events + anchors into a gameplay-
               meaningful cluster. Know their own connectivity (anchor points for paths).

COMPOSER       MapComposer takes a list of Features + constraints (positions from DDL,
               connections between features) and:
               1. Places features on the canvas
               2. Auto-routes paths between feature anchors
               3. Fills empty space with biome-appropriate terrain + scatter objects
               4. Adds zone-transition events at map edges
               5. Applies biome-wide effects (vibrancy tier, environmental metadata)
```

---

## Feature Catalog: What the Frontier Needs

Instead of listing 28 individual factories, here are the **composable features** a smart map composer would work with. Each feature is an organism that knows how to lay itself out given a bounding box and a palette.

### Universal Features (All Zones, All Acts)

These features appear in every map. The composer should handle them automatically.

#### Feature: `Hamlet`
A player-facing settlement: rest point, merchant, NPCs, quest hub.

| Parameter | Type | Examples |
|-----------|------|---------|
| `style` | enum | `'village'`, `'camp'`, `'hermitage'`, `'outpost'` |
| `buildings` | BuildingSpec[] | List of building molecules with roles (inn, shop, elder, workshop) |
| `npcs` | NpcSpec[] | Named + generic NPCs with dialogue refs |
| `amenities` | enum[] | `['merchant', 'rest', 'quest-board', 'campfire']` |
| `anchors` | named | Entry points for paths: `'gate-north'`, `'gate-south'`, etc. |

**Settled Lands instances**: Everwick (village, 5 buildings, 6 NPCs, all amenities), Millbrook (village, bridge-town variant).
**Frontier instances**:
- Ridgewalker Camp (camp, 4-6 tent/shelters from Snow pack, Nel + 5 NPCs, merchant + campfire + rest)
- Flickering Village (village, 4-5 seasonal buildings with flicker metadata, Reza + 3 NPCs, merchant + inn + rest)
- Listener's Camp (outpost, minimal props only -- blankets/instruments, Vess + 3 audiomancers, rest only)
- Vash's Hut (hermitage, 1 building, Vash + researcher, chest only)

**Reuse**: Same `Hamlet` feature with different `style` and `buildings` params. The composer places it, the feature creates its internal layout and exposes anchors for path routing.

#### Feature: `Shrine`
A dormant god recall site or lesser resonance point.

| Parameter | Type | Examples |
|-----------|------|---------|
| `type` | enum | `'dormant-god'`, `'resonance-stone'`, `'memory-well'` |
| `artifact` | string | Visual ref for the central object |
| `pedestals` | boolean | Whether 4 emotion pedestals surround it |
| `puzzle` | PuzzleSpec? | Optional gating puzzle (root-cluster, light-lens, harmonize, seismic) |
| `visionTrigger` | string? | Event ID for recall vision |
| `anchorApproach` | named | Single anchor for the path leading in |

**Frontier instances**:
- Verdance's Hollow (dormant-god, tree-trunk artifact, pedestals, root-cluster puzzle)
- Kinesis Spire (dormant-god, rock-spire artifact, pedestals, seismic puzzle via Kinetic Boots)
- Luminos Grove (dormant-god, prism artifact, pedestals, light-lens puzzle)
- Resonance Amphitheater (dormant-god, sound-column artifact, pedestals, harmonize-path puzzle)
- 20+ individual `resonance-stone` instances scattered across all 4 zones

**Insight**: ALL four god recall sites share the same structure: approach puzzle -> clearing -> artifact + 4 pedestals -> vision trigger -> transformation event. This is one feature parameterized four ways, not four bespoke assemblages.

#### Feature: `StagnationZone`
A Preserver-frozen area. Can be breakable, permanent, or choice-driven.

| Parameter | Type | Examples |
|-----------|------|---------|
| `crystalStyle` | enum | `'harsh'` (Heartfield), `'gentle'` (Rootwalker garden), `'ice'` (Shattered Pass), `'grand'` (Cathedral) |
| `frozen` | boolean | Whether it blocks passage |
| `breakable` | boolean | Whether player can shatter it |
| `moralChoice` | MoralChoiceSpec? | Optional preserve/break choice event |
| `frozenNpcs` | NpcSpec[]? | Crystallized NPCs inside (Frozen Festival) |
| `garrison` | NpcSpec[]? | Preserver guards outside |

**Frontier instances**:
- Stagnation Bog in Shimmer Marsh (harsh, breakable, garrison)
- Crystallized Garden in Shimmer Marsh (gentle, moral choice, NOT breakable by default)
- Shattered Pass in Hollow Ridge (ice, breakable puzzle)
- Preserver Cathedral in Resonance Fields (grand, breakable after boss, garrison)
- Frozen Festival in Resonance Fields (harsh, moral choice, frozen NPCs)

**Reuse**: The existing `stagnation-clearing.ts` is already this molecule. Promote it to a feature with garrison/choice/NPC support.

#### Feature: `ZoneEdge`
Map border treatment: transition gradient, gate, or wall.

| Parameter | Type | Examples |
|-----------|------|---------|
| `edge` | enum | `'north'`, `'south'`, `'east'`, `'west'` |
| `treatment` | enum | `'forest-wall'`, `'cliff-wall'`, `'transition-gradient'`, `'open'` |
| `gatePosition` | number? | Tile offset for path opening |
| `transitionSpec` | TransitionGradientSpec? | 5-tile gradient params (source biome, target biome) |
| `connectionTarget` | string? | Map ID for zone-transition event |

**Frontier instances**: Each 50x50 map has 4 edges. Most are `transition-gradient` (Settled->Frontier or Frontier->Sketch) or `cliff-wall` (impassable mountain). Hollow Ridge has `cliff-wall` on 2 sides, `transition-gradient` on 2. Flickerveil's east edge is the dramatic Veil's Edge transition to Sketch.

**Reuse**: Generalizes `forest-border.ts`. Instead of only forest walls, handles cliffs, gradients, and open borders.

#### Feature: `DepthsEntrance`
Transition to underground dungeon layer.

| Parameter | Type | Examples |
|-----------|------|---------|
| `style` | enum | `'sinkhole'`, `'cave-mouth'`, `'singing-stones'`, `'cellar'` |
| `targetMap` | string | Depths level ID |
| `condition` | string? | Quest/puzzle gate |
| `anchor` | named | Single approach anchor |

**Frontier instances**: Deepwater Sinkhole (Shimmer -> L2), Echo Caverns (Hollow Ridge -> L3), Singing Stones Passage (Resonance -> L4).

---

### Frontier-Specific Features

These features are unique to the Frontier's "unfinished world" aesthetic.

#### Feature: `MarshroadNetwork` (Shimmer Marsh only)
Connected system of boardwalk planks over shallow water.

| Parameter | Type | Examples |
|-----------|------|---------|
| `segments` | PathSpec[] | Boardwalk path segments with waypoints |
| `pools` | PoolSpec[] | Shallow water bodies between boardwalks |
| `reeds` | ScatterSpec | Reed/tall-grass density around pools |

**Why a feature, not a molecule**: Individual boardwalk planks are molecules. But the *network* of interconnected boardwalks over water with reed scatter is the gameplay-meaningful unit. The composer needs to lay water first, then route boardwalks between features (Vash's Hut, Verdance's Hollow, zone edges), then scatter reeds in remaining water.

#### Feature: `RidgeTrailSystem` (Hollow Ridge only)
Connected system of narrow mountain paths with cliff borders.

| Parameter | Type | Examples |
|-----------|------|---------|
| `segments` | PathSpec[] | Trail segments with switchback waypoints |
| `cliffType` | enum | `'brown'`, `'gray'`, `'snow'`, `'ice'` |
| `elevationZones` | ElevationSpec[] | Areas where snow appears (high elevation) |

**Why a feature**: Individual trail segments are just paths. But the trail *system* -- with cliff walls on both sides, elevation-dependent snow, and switchback routing -- is what makes Hollow Ridge feel like a mountain zone. The composer uses this feature's internal routing logic to connect the camp, spire, pass, and caverns.

#### Feature: `FlickerForest` (Flickerveil only)
Dense forest with per-tree flicker cycling.

| Parameter | Type | Examples |
|-----------|------|---------|
| `density` | enum | `'dense'`, `'moderate'`, `'sparse'` |
| `clearings` | ClearingSpec[] | Open patches where trees don't spawn |
| `flickerMetadata` | boolean | Whether trees get flicker-cycle timers |

**Why a feature**: A `forest-border` molecule places trees in a strip. But Flickerveil needs forest that *fills the map* with clearings carved out for the village, grove, archive, and paths. The feature knows about the whole forest -- it fills available space, avoids placed features, and tags every tree with flicker metadata.

#### Feature: `StoneField` (Resonance Fields only)
Sparse plains with scattered standing stones.

| Parameter | Type | Examples |
|-----------|------|---------|
| `stoneDensity` | number | Stones per 100 tiles |
| `stoneMetadata` | boolean | Whether stones get `chordType` audio metadata |
| `exclusionZones` | Rect[] | Areas where stones don't spawn (camp, amphitheater, cathedral) |

**Why a feature**: Individual resonance stones are molecules. But the *field* of scattered stones across featureless plains is the gameplay-meaningful unit. The composer fills available space with stones at the specified density, avoiding placed features.

#### Feature: `PreserverFortification`
A Preserver military installation larger than a simple stagnation zone.

| Parameter | Type | Examples |
|-----------|------|---------|
| `type` | enum | `'cathedral'`, `'archive'`, `'crystal-wall'`, `'patrol-route'` |
| `garrison` | NpcSpec[] | Preserver agents/captains |
| `silenceRadius` | number? | Tiles around structure where memory abilities are disabled |
| `breakMechanic` | string? | How to destroy it (broadcast, combat, puzzle) |

**Frontier instances**:
- Preserver Cathedral in Resonance Fields (cathedral, 4 garrison, 10-tile silence, combat + broadcast)
- Resonance Archive in Flickerveil (archive, 1 garrison agent, no silence, combat)
- Crystal walls in Hollow Ridge (crystal-wall, 0 garrison, dynamic/event-spawned)

#### Feature: `MoralDilemma`
A crystallized scene with a preserve-or-break choice.

| Parameter | Type | Examples |
|-----------|------|---------|
| `scene` | string | Scene reference (act2-scene6, act2-scene11) |
| `frozenScene` | FrozenSceneSpec | Description of what's crystallized (garden, festival) |
| `choiceRewards` | { break: RewardSpec, preserve: RewardSpec } | Vibrancy gain vs. unique fragment |
| `witnessNpc` | NpcSpec? | Optional NPC present during choice (Miel, Rootwalker echo) |

**Frontier instances**: Rootwalker's Last Garden (Shimmer Marsh), Frozen Festival (Resonance Fields).

**Insight**: These share structure with `StagnationZone` but are narratively distinct. They might be a variant of StagnationZone with `moralChoice` populated, or a standalone feature that composes a StagnationZone molecule internally.

---

## The Composer's Job (Per Zone)

Here's how a smart composer would build each Frontier map:

### Shimmer Marsh Composition

```
CANVAS: 50x50, palette: frontier-seasons, defaultGround: ground.marsh

FEATURES (placed at DDL positions):
  Hamlet(hermitage)           @ (12, 15)  -- Vash's Hut
  Shrine(dormant-god)         @ (25, 35)  -- Verdance's Hollow
  StagnationZone(harsh)       @ (34, 6)   -- Stagnation Bog
  MoralDilemma                @ (28, 32)  -- Crystallized Garden
  DepthsEntrance(sinkhole)    @ (33, 43)  -- Deepwater Sinkhole
  ZoneEdge(north, gradient)   @ edge      -- -> Heartfield
  ZoneEdge(east, gradient)    @ edge      -- -> Flickerveil
  ZoneEdge(west, gradient)    @ edge      -- -> Hollow Ridge
  ZoneEdge(south, gradient)   @ edge      -- -> Luminous Wastes

FILL: MarshroadNetwork
  - Lay water pools in open space
  - Route boardwalks between: north-edge -> Vash -> Verdance -> south-edge
  - Route boardwalks between: west-edge -> Bog -> east-edge
  - Scatter reeds around pools

AUTO-ROUTE: Paths between feature anchors
  trail: north-gate -> Vash.gate-south
  boardwalk: Vash.gate-south -> root-cluster -> Verdance.approach
  trail: Vash.gate-east -> Bog.approach
  trail: Verdance.gate-west -> Sinkhole.approach

SCATTER: Resonance stones at DDL positions (RS-SM-01 through 06)
SCATTER: Seasonal trees in non-water, non-feature areas (sparse)
```

### Hollow Ridge Composition

```
CANVAS: 50x50, palette: frontier-seasons, defaultGround: ground.highland

FEATURES:
  Hamlet(camp)                @ (15, 25)  -- Ridgewalker Camp
  Shrine(dormant-god)         @ (25, 10)  -- Kinesis Spire
  StagnationZone(ice)         @ (33, 28)  -- Shattered Pass
  DepthsEntrance(cave-mouth)  @ (38, 3)   -- Echo Caverns
  ZoneEdge(south, gradient)   @ edge      -- -> Sunridge
  ZoneEdge(east, gradient)    @ edge      -- -> Flickerveil
  ZoneEdge(southeast, open)   @ edge      -- -> Shimmer Marsh
  ZoneEdge(north, gradient)   @ edge      -- -> Undrawn Peaks

FILL: RidgeTrailSystem
  - Cliff walls along map edges (west, parts of north)
  - Snow zones at elevation > y=15 (upper third)
  - Unfinished peaks at map corners (flat-topped mountain stubs)

AUTO-ROUTE: Ridge trails between feature anchors
  trail: south-gate -> Camp.gate-north (switchback path)
  trail: Camp.gate-north -> Spire.approach (steep climb)
  trail: Camp.gate-east -> ShatteredPass.approach
  trail: Camp.gate-northeast -> EchoCaverns.approach

SCATTER: Resonance stones (RS-HR-01 through 05)
SCATTER: Snow rocks at high elevation, bare rocks at low
SCATTER: Rectangular snow patches (conspicuously geometric, per frontier-zones.md)
```

### Flickerveil Composition

```
CANVAS: 50x50, palette: frontier-seasons, defaultGround: ground.forest-floor

FEATURES:
  Hamlet(village)             @ (35, 30)  -- Flickering Village
  Shrine(dormant-god)         @ (20, 20)  -- Luminos Grove
  PreserverFortification(archive) @ (8, 8) -- Resonance Archive
  ZoneEdge(west, gradient)    @ edge      -- -> Shimmer Marsh
  ZoneEdge(northwest, gradient) @ edge    -- -> Hollow Ridge
  ZoneEdge(southwest, gradient) @ edge    -- -> Ambergrove
  ZoneEdge(east, transition-gradient, sketch) @ edge -- Veil's Edge -> Half-Drawn

FILL: FlickerForest
  - Dense canopy covering ~70% of map
  - Clearings carved around: Village, Grove, Archive
  - All trees tagged with flickerCycle metadata
  - Leaf litter ground, checkerboard phase at low vibrancy

AUTO-ROUTE: Forest trails between feature anchors
  trail: west-gate -> Archive.approach (narrow, winding)
  trail: Archive.gate-south -> Grove.approach
  trail: Grove.gate-east -> Village.gate-west
  trail: Village.gate-east -> Veil's Edge

SCATTER: Resonance stones (RS-FV-01 through 08)
SCATTER: Memory motes particle zones in forest canopy
SCATTER: Contradictory shadow placements (inconsistent light sources)
```

### Resonance Fields Composition

```
CANVAS: 50x50, palette: frontier-seasons, defaultGround: ground.pale-grass

FEATURES:
  Hamlet(outpost)             @ (10, 35)  -- Listener's Camp
  Shrine(dormant-god)         @ (25, 25)  -- Resonance Amphitheater
  PreserverFortification(cathedral) @ (40, 15) -- Cathedral
  MoralDilemma                @ (18, 28)  -- Frozen Festival
  DepthsEntrance(singing-stones) @ (28, 44) -- Singing Stones -> L4
  ZoneEdge(east, gradient)    @ edge      -- -> Shimmer Marsh
  ZoneEdge(north, gradient)   @ edge      -- -> Hollow Ridge
  ZoneEdge(west, gradient)    @ edge      -- -> Luminous Wastes

FILL: StoneField
  - ~1 stone per 50 tiles (sparse but regular)
  - Exclusion zones around Camp, Amphitheater, Cathedral, Festival
  - All stones tagged with chordType metadata slot (null until broadcast)

FILL NOTE: This is the EMPTIEST map. Pale grass, scattered stones, enormous sky.
  No trees, no flowers, no terrain variation. The emptiness IS the aesthetic.
  The composer should resist filling empty space -- this zone's identity is its spareness.

AUTO-ROUTE: Simple trails (barely visible, faint dirt paths)
  trail: north-gate -> Amphitheater.approach (with dissonant stone barrier midway)
  trail: Camp.gate-north -> Festival.approach -> Amphitheater.gate-south
  trail: Amphitheater.gate-east -> Cathedral.approach
  trail: Camp.gate-south -> SingingStones.approach

SCATTER: Resonance stones at DDL positions (RS-RF-01 through 06)
```

---

## Feature Interface Design

Every feature should implement a common interface so the composer can work with them uniformly:

```typescript
interface Feature {
  /** Unique feature ID */
  id: string;
  /** Feature type for composer logic */
  type: FeatureType;
  /** Bounding box in tiles (the feature's footprint on the canvas) */
  bounds: { width: number; height: number };
  /** Named anchor points for path routing */
  anchors: Record<string, { x: number; y: number }>;
  /** Compose the feature into one or more AssemblageDefinitions */
  compose(palette: PaletteSpec): AssemblageDefinition[];
  /** Map-level objects this feature contributes (NPCs, events, transitions) */
  objects(): AssemblageObject[];
  /** Map-level hooks this feature needs */
  hooks(): EventHook[];
  /** Metadata for runtime systems (flicker, audio, silence fields) */
  metadata(): Record<string, unknown>;
}
```

The composer would then work like:

```typescript
interface MapComposer {
  /** Place a feature at a canvas position */
  place(feature: Feature, x: number, y: number): void;
  /** Route a path between two feature anchors */
  route(fromFeature: string, fromAnchor: string,
        toFeature: string, toAnchor: string,
        terrain: string, width: number): void;
  /** Fill remaining space with biome-appropriate content */
  fill(filler: FillStrategy): void;
  /** Add zone-edge treatments */
  edges(specs: ZoneEdgeSpec[]): void;
  /** Scatter objects in available space */
  scatter(spec: ScatterSpec): void;
  /** Export to MapComposition for the existing pipeline */
  toComposition(): MapComposition;
}
```

This lets the scene compiler read the DDL and call the composer rather than hand-authoring MapComposition objects.

---

## Molecule Inventory (What the Features Compose From)

Features compose from these molecule-level factories. Some exist, most need creation.

### Existing Molecules (Reusable)
| Molecule | File | Reuse Notes |
|----------|------|-------------|
| `createHouse()` | `buildings/house.ts` | Parameterize `objectRef` for seasonal/snow buildings. Core logic unchanged. |
| `createForestBorder()` | `terrain/forest-border.ts` | Swap `TREE_TYPES` for seasonal trees. Becomes a molecule inside `ZoneEdge` and `FlickerForest`. |
| `createWheatField()` | `terrain/wheat-field.ts` | Not directly needed in Frontier. But the pattern (terrain patch + optional border + scatter) generalizes to `createMarshPool`, `createSnowPatch`. |
| `createStagnationClearing()` | `terrain/stagnation-clearing.ts` | Core molecule inside `StagnationZone` and `MoralDilemma` features. Add crystal-style variants. |
| `createWindmill()` | `buildings/windmill.ts` | Pattern (building on terrain patch + optional objects) generalizes to any "building-on-ground" molecule. |

### New Molecules Needed
| Molecule | Description | Used By Features |
|----------|-------------|-----------------|
| `createShelter()` | Tent/lean-to from snow building refs. Like `createHouse` but smaller, no door transition. | Hamlet(camp), Hamlet(outpost) |
| `createCampfire()` | Campfire animation + surrounding dirt patch + 2-3 log-seat props. | Hamlet(camp), Hamlet(outpost) |
| `createMerchantStall()` | Market stand + NPC + shop trigger. | Hamlet (where amenities includes 'merchant') |
| `createPedestal()` | Single emotion pedestal object (glyph visual + trigger). Four of these compose the recall ring inside Shrine. | Shrine(dormant-god) |
| `createBoardwalkSegment()` | Bridge/plank strip over water. Variable length, 2 tiles wide. | MarshroadNetwork |
| `createWaterPool()` | Irregular water body with reed scatter on edges. | MarshroadNetwork |
| `createCliffWall()` | Rock slope strip along an edge. Variable length, 3-4 tiles deep. | ZoneEdge(cliff-wall), RidgeTrailSystem |
| `createStandingStone()` | Single tall stone object + dirt-patch base + metadata slot. | StoneField, Shrine, scatter |
| `createCrystalFormation()` | Crystal animation object cluster. Variable size. | StagnationZone, PreserverFortification |
| `createTransitionStrip()` | 5-tile gradient between two biome tilesets. | ZoneEdge(transition-gradient) |

---

## Fill Strategies

The composer needs biome-specific fill strategies for empty space:

| Strategy | Biome | Behavior |
|----------|-------|----------|
| `MarshFill` | Shimmer Marsh | Water pools + reed scatter + boardwalk routing. Wetland default ground. |
| `MountainFill` | Hollow Ridge | Cliff walls at edges, snow at elevation, bare rock scatter. Highland default ground. |
| `ForestFill` | Flickerveil | Dense tree placement with clearings. Leaf-litter ground. Flicker metadata tagging. |
| `PlainsFill` | Resonance Fields | Almost nothing. Pale grass + widely scattered stones. Deliberate emptiness. |
| `VillageFill` | Settled Lands | Grass + flower scatter + decorative trees. Warm, lived-in. |

---

## Palette: `frontier-seasons`

### Source Packs
- `exteriors/seasons/` -- 25 TSX: seasonal ground, trees, buildings, props, rocks
- `exteriors/snow/` -- 32 TSX: snow ground, ice cliffs, snow trees, snow buildings, magic crystals

### Required Terrain Mappings

| Semantic Name | Expected TSX | Notes |
|---------------|-------------|-------|
| `ground.marsh` | Tileset_Ground_Seasons | Dark/mud variant for wetland |
| `ground.highland` | Tileset_Ground_Seasons | Autumn/bare variant for mountains |
| `ground.forest-floor` | Tileset_Ground_Seasons + Tileset_Leaves_Seasons | Dark ground + leaf overlay |
| `ground.pale-grass` | Tileset_Ground_Seasons | Lightest grass for empty plains |
| `ground.snow` | Tileset_Ground_Snow or Tileset_Snow | Snow patches |
| `ground.ice` | Tileset_RockSlope_2_Ice | Frozen ground |
| `water` | Tileset_Water (shared) | Standard water auto-tile |
| `road.trail` | Tileset_Road (shared) | Narrow frontier path |
| `cliff.brown` | Tileset_RockSlope_1_Brown (shared) | Standard cliffs |
| `cliff.snow` | Tileset_RockSlope_2_Brown_Snow | Snow-capped cliffs |
| `cliff.ice` | Tileset_RockSlope_2_Ice | Ice cliffs (Shattered Pass) |
| `sand.crystal` | Tileset_Sand (shared) | Stagnation ground |

### Required Object Mappings

| Semantic Name | Expected TSX | Notes |
|---------------|-------------|-------|
| `tree.autumn-*` (3-5) | Objects_Trees_Seasons | Marsh, forest zones |
| `tree.bare-*` (2-3) | Objects_Trees_Seasons | Mountain, plains zones |
| `tree.snow-*` (2-3) | Objects_Trees_Snow | Mountain peaks |
| `rock.seasons-*` (3-4) | Objects_Rocks_Seasons | All zones |
| `rock.snow-*` (2-3) | Objects_Rocks_Snow | Mountain zone |
| `building.camp-*` (2-3) | Objects_Buildings_Snow | Camp shelters |
| `building.seasons-*` (2-3) | Objects_Buildings_Seasons | Village buildings |
| `prop.seasons-*` | Objects_Props_Seasons | Misc frontier props |
| `prop.snow-*` | Objects_Props_Snow | Mountain props |
| `crystal.magic-snow` | Animation_MagicCrystal_Snow | Stagnation crystal glow |
| `bridge.snow` | Atlas_Buildings_Bridges_Snow | Mountain crossings |

### Blocking Status
Palette creation is the **#1 blocker** for all Frontier work. Requires:
1. Parse Wang sets from Seasons + Snow TSX files
2. Map Wang set colors to semantic terrain names
3. Map object collection tiles to semantic object names
4. Create `gen/assemblage/tileset/palettes/frontier-seasons.ts`

---

## Tileset Coverage Gaps

| Gap | Impact | Mitigation |
|-----|--------|-----------|
| **Boardwalk planks** | MarshroadNetwork fill strategy | Repurpose bridge atlas tiles or road tiles on elevated layer |
| **Tall standing stones** (3 tiles) | StoneField, Shrine(Resonance) | Stack/composite rock objects, or GenAI pipeline custom tiles |
| **Sketch-transition tiles** | ZoneEdge(transition-gradient, sketch) | Hand-crafted gradient tiles blending seasonal normals to outline |
| **Dormant god artifacts** | Shrine(dormant-god) central visuals | GenAI pipeline or composite of rock/tree/crystal objects |
| **Resonance Stones** (amber glow) | scatter across all zones | May need custom tile or repurpose MagicCrystal animation |

---

## Environmental Effect Systems (Runtime, Not Layout)

These are zone-wide runtime systems, not assemblage concerns. But features need to emit the right **metadata** for these systems:

| System | Metadata Emitted By | Fields |
|--------|-------------------|--------|
| Tree flicker engine | FlickerForest fill strategy | `flickerObjects: { id, cycleMs, stableRadius? }[]` |
| Proximity audio chords | StoneField fill strategy, StandingStone molecule | `chordType: 'joy'\|'fury'\|'sorrow'\|'awe'\|null` per stone |
| Silence field | PreserverFortification(cathedral) | `silenceRadius: number, center: {x,y}` |
| Painted detail spreading | All features (passive) | `paintedDetail: boolean[]` (initialized false, runtime tracks) |
| Memory-reflecting pools | MarshroadNetwork fill strategy | `memoryPools: {x,y,w,h}[]` |
| Vibrancy tier tile swap | All (passive, per palette) | Need Muted/Normal/Vivid variants for each terrain in palette |

---

## Build Priority

### Phase 0: Abstraction Infrastructure
1. Define `Feature` interface and `MapComposer` class
2. Create `frontier-seasons` palette
3. Refactor Everwick composition to use composer (proves the pattern)

### Phase 1: Universal Features
4. `Hamlet` feature (parameterized, covers all settlement types)
5. `Shrine` feature (covers all dormant god sites + resonance stones)
6. `StagnationZone` feature (covers all Preserver frozen areas)
7. `ZoneEdge` feature (covers all map borders)
8. `DepthsEntrance` feature (covers all dungeon entries)

### Phase 2: Frontier-Specific Features + Fill Strategies
9. `MarshroadNetwork` + `MarshFill` (Shimmer Marsh)
10. `RidgeTrailSystem` + `MountainFill` (Hollow Ridge)
11. `FlickerForest` + `ForestFill` (Flickerveil)
12. `StoneField` + `PlainsFill` (Resonance Fields)
13. `PreserverFortification` (Cathedral, Archive)
14. `MoralDilemma` (Garden, Festival)

### Phase 3: Map Compositions
15. Hollow Ridge (first zone entered)
16. Shimmer Marsh
17. Flickerveil
18. Resonance Fields

---

## Key Insight: Feature Count vs. Factory Count

The original report listed ~28 individual factories. Through feature-level abstraction:

- **5 universal features** cover ~15 of those factories (Hamlet, Shrine, StagnationZone, ZoneEdge, DepthsEntrance)
- **4 zone-specific features** cover ~8 more (MarshroadNetwork, RidgeTrailSystem, FlickerForest, StoneField)
- **2 narrative features** cover ~3 more (PreserverFortification, MoralDilemma)
- **~10 molecules** underpin all features (shelter, campfire, merchant-stall, pedestal, boardwalk-segment, water-pool, cliff-wall, standing-stone, crystal-formation, transition-strip)

**Total: 11 features + 10 molecules + 5 fill strategies** instead of 28 disconnected factories. Each feature is reusable across acts (Hamlet appears in Settled Lands, Frontier, and potentially Sketch). The composer handles placement and routing, eliminating hand-authored coordinates.
