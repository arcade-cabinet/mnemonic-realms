# Settled Lands — Feature-Level Assemblage Analysis

> Look-ahead for Ambergrove, Millbrook, Sunridge.
> Sources: act1-script.md (Scenes 7-9), map DDLs, overworld-layout.md, village-premium palette, types.ts

## The Onion Model

The assemblage system needs four layers of abstraction, not one:

```
Layer 4: MAP COMPOSER
  Places organisms on an 80x80 canvas, auto-routes paths between
  anchors, flood-fills remaining space with biome default ground.

Layer 3: ORGANISMS (Feature clusters — the unit of map design)
  hamlet, riverside-town, forest-shrine, waystation, waterfall-grotto,
  stagnation-zone, fishing-dock, etc. Each organism bundles multiple
  molecules and defines its own internal path routing + NPC placement.

Layer 2: MOLECULES (Current assemblages — house, forest-border, wheat-field)
  A single building, terrain patch, or prop cluster with collision,
  layers, and anchors.

Layer 1: ATOMS (Palette entries — tiles, objects, terrains)
  Semantic tile refs resolved by village-premium palette.
```

The current codebase has Layers 1 and 2. What is missing — and what this analysis focuses on — is **Layer 3: Organisms**. An organism is a self-contained map feature that a composer can place as a unit, with its own internal layout logic.

---

## Feature Organisms Identified Across Settled Lands

Each organism below is a composable feature that a map composer can auto-place. They declare a bounding box, internal molecule composition, path anchors (named edge points where roads/trails can connect), and NPC slots.

### 1. HAMLET

**Pattern**: A cluster of 3-8 buildings around a central gathering point (well, campfire, market). Roads connect buildings to each other and to external anchors. NPCs wander the settlement interior.

**Instances**:
- Ambergrove Woodcutter's Camp (3 shelters, campfire, 3 NPCs, quest hub)
- Millbrook Town (8-10 buildings, market, fountain, 6 NPCs, shops, bridge approach)
- Sunridge Ridgetop Waystation (2 shelters within stone walls, campfire, 3 NPCs, merchant)
- (Already exists: Everwick — the first hamlet, hand-composed in `maps/everwick.ts`)

**Configuration parameters**:
```
type: 'hamlet'
size: 'camp' | 'village' | 'town'    // 3-5 | 5-8 | 8-12 buildings
style: 'open' | 'walled' | 'forest'  // fences vs walls vs tree ring
ground: string                        // default interior ground terrain
roadStyle: 'dirt' | 'road' | 'brick'  // internal path terrain
buildings: BuildingSlot[]             // what molecules to place inside
    each: { role, objectRef, npcSlot?, doorTarget? }
centralFeature: 'well' | 'campfire' | 'fountain' | 'market' | 'none'
anchors: Anchor[]                     // named edge points for external roads
npcSlots: NPCSlot[]                   // positions filled by map DDL npc data
```

**Internal layout logic**: The hamlet organism arranges buildings in a rough ring around the central feature, generates internal dirt/road paths between them, places props (barrels, crates, signs), and exposes anchor points at each cardinal edge for the map composer to route roads to.

**Molecules consumed**: `house` (x N), `well`/`campfire`/`fountain` (x 1), `fence-perimeter` or `wall-perimeter` (optional), internal path segments.

**Cross-map reuse**: This is the most-reused organism. Every map with NPCs has some form of hamlet. The key insight: Woodcutter's Camp, Ridgetop Waystation, Millbrook Town, and Everwick are all *the same pattern at different scales and styles*.

### 2. RIVER CORRIDOR

**Pattern**: A water channel that bisects the map, with shore transitions, bridge crossing(s), and bankside features. The corridor is a linear organism that spans the full map height or width.

**Instances**:
- Millbrook Brightwater River (N-S, ~6 tiles wide, one bridge crossing, narrows at falls)

**Configuration parameters**:
```
type: 'river-corridor'
orientation: 'north-south' | 'east-west'
width: number                           // river channel width in tiles (3-8)
shoreWidth: number                      // sand/transition strip width
bridgeAt?: { position: number, style: string }  // where to place bridge molecule
waterfallAt?: { position: number }      // where river becomes waterfall
narrowPoints?: { position: number, width: number }[]  // river width changes
```

**Internal layout logic**: Paints water terrain in a channel, auto-tiles shore transitions (water -> sand -> light-grass -> default ground), clears collision except at bridge points, places bridge molecule. The corridor anchors at top/bottom (or left/right) edges.

**Molecules consumed**: `water-body` (auto-tiled channel), `shore-transition` (terrain gradient), `bridge` (at crossing point), `waterfall` (at terminus).

**Exclusive to Millbrook** in Act I, but streams appear in Heartfield and Shimmer Marsh.

### 3. WATERFALL GROTTO

**Pattern**: A cliff face with waterfall, with a hidden cave behind. Contains high-value loot and discovery-based gameplay. The grotto is a self-contained feature organism placed at a river's terminus or cliff edge.

**Instances**:
- Millbrook Upstream Falls + hidden cave (SQ-04, two 3-star fragments)

**Configuration parameters**:
```
type: 'waterfall-grotto'
cliffHeight: number                     // cliff face tiles
waterfallWidth: number                  // waterfall animation span
caveSize: { width: number, height: number }
hiddenEntry: boolean                    // true = passage behind waterfall
resonanceStones?: StoneConfig[]
chests?: ChestConfig[]
```

**Internal layout logic**: Cliff terrain on top half, waterfall animation in front of cliff, hidden walkable tile behind waterfall sprite, cave room behind the cliff. Ground transitions from grass -> dark-grass -> cliff face. Shadow overlay for cave interior.

**Molecules consumed**: `cliff-face`, `waterfall-animation`, `cave-room`, `hidden-passage`.

**Cross-map reuse**: Echo Caverns (Hollow Ridge) and Depths entrances use similar cliff+cave patterns.

### 4. SACRED CLEARING

**Pattern**: An open glade surrounded by forest, containing Resonance Stones or shrines. The clearing's internal content varies (stone circle, single shrine, dormant god pedestal), but the *container* — a tree-ring clearing with approach paths — is the same everywhere.

**Instances**:
- Ambergrove Hearthstone Circle (6 standing stones, 3 active, chest at center)
- Ambergrove Mossy Clearing (fallen log rest spot, ambient heal)
- Ambergrove hidden clearing (chest CH-AG-03)
- Sunridge Wind Shrine (ruined pillars, vibrating stone, cliff-plateau variant)
- Heartfield Memorial-style areas (smaller variants)

**Configuration parameters**:
```
type: 'sacred-clearing'
size: 'small' | 'medium' | 'large'   // 6x6, 10x10, 14x14
innerGround: string                    // dirt, light-grass, sand
treeRingDensity: 'sparse' | 'dense'
elevation?: 'flat' | 'plateau'        // if plateau, sits on cliff-plateau molecule
content:
  | { kind: 'stone-circle', stones: StoneConfig[], centerChest?: ChestConfig }
  | { kind: 'shrine', pillars: number, altarStone?: StoneConfig }
  | { kind: 'rest-spot', feature: 'fallen-log' | 'mossy-rock' }
  | { kind: 'empty' }                 // just the clearing
approachPaths: number                  // 1-4 path anchors through the tree ring
canopyOverlay: boolean                 // shadow dappling on ground2
```

**Internal layout logic**: Fills bounding box with forest-border-style tree ring, clears interior to inner ground terrain, places content molecules at center, punches path openings through tree ring at anchor points.

**Molecules consumed**: `tree-ring` (forest-border variant, circular), `stone-circle`/`shrine-ruin`/`rest-feature`, `cliff-plateau` (if elevated).

**The key abstraction**: Ambergrove's Hearthstone Circle, Sunridge's Wind Shrine, Shimmer Marsh's Verdance's Hollow, Hollow Ridge's Kinesis Spire, and Resonance Fields' Amphitheater are ALL sacred-clearing organisms at different scales and with different content. One organism, five+ instantiations across the whole game.

### 5. LAKE SHORE

**Pattern**: A body of water with accessible shore, optional submerged features, and bankside decoration. The lake has no current (unlike river-corridor) — it is a static water feature.

**Instances**:
- Ambergrove Amber Lake (submerged dormant Resonance Stone at center)
- Fisher's Rest in Millbrook (small water body adjacent to dock)

**Configuration parameters**:
```
type: 'lake-shore'
size: { width: number, height: number }  // water body dimensions
shape: 'ellipse' | 'rectangle' | 'irregular'
shoreWidth: number
submergedFeature?: { type: string, x: number, y: number }
shoreFeatures?: ('dock' | 'beach' | 'rocks' | 'reeds')[]
approachAnchors: Anchor[]
```

**Molecules consumed**: `water-body`, `shore-transition`, `dock` (optional), `rock-cluster` (optional).

### 6. STAGNATION ZONE

**Pattern**: A Preserver-crystallized area. Visually distinct (sand/crystal ground, shadow overlay, frozen objects). May contain a frozen structure (watchtower, stone, clearing) and Preserver NPCs.

**Instances**:
- Heartfield Stagnation Clearing (5x5 at 32px, frozen butterflies, breaking tutorial)
- Sunridge Preserver Outpost (crystallized watchtower, scout NPC, larger)
- (Future: Shimmer Marsh Stagnation Bog, Shattered Pass, Preserver Cathedral, etc.)

**Configuration parameters**:
```
type: 'stagnation-zone'
size: { width: number, height: number }
frozenContent:
  | { kind: 'clearing', stone?: StoneConfig }
  | { kind: 'watchtower', towerRef: string, scouts: NPCSlot[] }
  | { kind: 'structure', structureRef: string }
breakRequirement?: { emotion?: string, element?: string, potency?: number }
walkable: boolean                      // clearing = yes, outpost perimeter = partial
cutscene?: string                      // event ID for discovery/breaking
```

**Internal layout logic**: Sand/crystal ground, shadow overlay at interior, frozen content molecule at center, collision based on walkability. For watchtower variant, places tower visual, crystal ring around it (impassable), and NPC positions at perimeter.

**Molecules consumed**: `crystal-ground` (sand + shadow terrain), `frozen-stone`/`frozen-tower`, Preserver NPC slots.

**Scaling insight**: This organism scales from a tiny 5x5 clearing to the massive Preserver Cathedral (16x12). The breakRequirement config lets the scene DDL control progression gating.

### 7. FISHING SPOT

**Pattern**: A dock or pier extending into water, with a fisher NPC and minigame trigger zone.

**Instances**:
- Millbrook Fisher's Rest (dock, Fisher Tam, SQ-04, fishing minigame)

**Configuration parameters**:
```
type: 'fishing-spot'
dockLength: number                     // tiles extending into water
dockWidth: number
fisherNPC: NPCSlot
minigameTrigger: { zone: Rect }
shoreProps: string[]                   // barrels, crates, rope
resonanceStone?: StoneConfig           // RS-MB-03 near dock
```

**Molecules consumed**: `dock-platform`, NPC slot, trigger zone.

### 8. WORLD EDGE

**Pattern**: The visual/gameplay boundary of a map region. Shows what lies beyond without letting the player pass (yet). Used at every map border but especially meaningful at the Settled Lands -> Frontier transition.

**Instances**:
- Sunridge Threshold (north edge -> Frontier shimmer, mountain pass, MQ-04 gate)
- Ambergrove Eastern Canopy Path (east edge -> Flickerveil shimmer)
- Every map's forest-border edges (generic)

**Configuration parameters**:
```
type: 'world-edge'
edge: 'north' | 'south' | 'east' | 'west'
length: number
variant:
  | { kind: 'forest', density: 'sparse' | 'dense', gapAt?: number }
  | { kind: 'threshold', gradientTerrain: string[], passCondition?: string }
  | { kind: 'canopy-tunnel', length: number, flickerAtEnd?: boolean }
  | { kind: 'cliff', cliffStyle: string }
transition?: { toMap: string, condition?: string }
```

**Internal layout logic**: Forest variant is the existing forest-border. Threshold variant paints a terrain gradient. Canopy-tunnel variant creates the narrow elevated path. Cliff variant places rock-slope tiles.

**Molecules consumed**: `forest-border` | `terrain-gradient` | `canopy-path` | `cliff-face`. Always includes a transition trigger at the gap.

### 9. ROCKY OUTCROP (Sunridge-specific, but reusable)

**Pattern**: An isolated elevated rock formation creating height variation in open terrain. Smaller than a full cliff-plateau, these are scattered decorative/tactical features.

**Instances**:
- Sunridge has 3-5 rocky outcrops across the highland
- NE cliff requiring "climb" to reach RS-SR-03

**Configuration parameters**:
```
type: 'rocky-outcrop'
size: 'small' | 'medium' | 'large'    // 3x3, 5x5, 8x8
cliffStyle: 'brown' | 'gray'
topFeature?: 'chest' | 'resonance-stone' | 'none'
climbable: boolean                     // if true, approach from one side
```

**Molecules consumed**: `cliff-face` tiles, `rock-objects`, optional chest/stone.

---

## Map Compositions via Organisms

Here is how the map composer would use organisms to build each map. The composer's job: place organisms on the canvas, auto-route paths between their anchors, and flood-fill remaining space with the biome default ground + scattered decoration.

### Ambergrove — "Forest with clearings"

**Default ground**: `ground.dark-grass` (the inverse of most maps — forest IS the default)
**Biome fill**: Dense tree scatter + shadow overlay on ground2 + tallgrass undergrowth

| Organism | Position | Size | Anchors exposed |
|----------|----------|------|-----------------|
| `world-edge[forest,dense]` x4 | All edges | 80xD each | 3 gaps (W, E, S gates) |
| `sacred-clearing[stone-circle,large]` | (32, 12) | 14x14 | S, W (paths to camp + gate) |
| `sacred-clearing[rest-spot,small]` | (38, 38) | 8x8 | N, S (path intersection) |
| `sacred-clearing[empty,small]` | (58, 8) | 6x6 | S (hidden path for chest) |
| `lake-shore[ellipse]` | (50, 40) | 18x18 | W (shore path) |
| `hamlet[camp,forest,3]` | (12, 52) | 14x12 | N, E (path to clearing + gate) |
| `world-edge[canopy-tunnel]` | (72, 32) | 8x20 | W (main forest path) |

**Auto-routed paths**: 2-tile-wide dirt roads connecting anchor points. Winding (not straight) because it is a forest — the path router should use slight randomized offsets.

**Scatter fill**: The map composer fills all unoccupied space with tree visuals (from TREE_TYPES) at high density, shadow overlay, and tallgrass clumps. This is what makes Ambergrove feel different from Heartfield — the "fill" IS the forest.

### Millbrook — "Town on a river"

**Default ground**: `ground.grass`
**Biome fill**: Light tree scatter + flower grass clumps + occasional rock

| Organism | Position | Size | Anchors exposed |
|----------|----------|------|-----------------|
| `river-corridor[N-S,bridge@38]` | (34, 0)-(40, 80) | 12x80 | Bridge anchor (deck) |
| `waterfall-grotto[cave]` | (8, 2) | 14x14 | S (path from town) |
| `hamlet[town,open,10]` | (18, 20) | 28x28 | N, S, W, bridgeApproach(E) |
| `fishing-spot` | (54, 54) | 12x12 | W (path from east bank) |
| `world-edge[forest,sparse]` x2 | W, E edges | Dx80 | gaps at row 40 (gates) |

**Auto-routed paths**: Brick roads within town, dirt roads outside. The bridge is a critical routing node — all east-west traffic must cross it.

**Key composer challenge**: The river splits the map into west bank and east bank. The composer must route paths to the bridge, not directly across water. This implies the river-corridor organism *constrains* the path router — it is impassable except at bridge anchors.

### Sunridge — "Sparse highland with outcrops"

**Default ground**: `ground.grass` (but sparse — less fill than Heartfield)
**Biome fill**: Minimal. Occasional bush, exposed dirt patches, scattered rocks. The emptiness is the point.

| Organism | Position | Size | Anchors exposed |
|----------|----------|------|-----------------|
| `world-edge[threshold]` | (30, 0) | 20x6 | S (mountain pass path) |
| `world-edge[forest,sparse]` | S edge, E edge | 80xD | gaps (S gate, E gate) |
| `sacred-clearing[shrine,plateau]` | (14, 10) | 10x10 | S (path down from plateau) |
| `hamlet[walled,village,2]` | (32, 32) | 14x14 | N, S, E, W (crossroads) |
| `stagnation-zone[watchtower]` | (56, 22) | 14x12 | W (approach path) |
| `rocky-outcrop[large,climbable]` | (66, 6) | 8x8 | (no path — climb only) |
| `rocky-outcrop[small]` x3 | Scattered | 4x4 each | None (decoration) |

**Auto-routed paths**: Narrow dirt roads only. No brick. The waystation is the only crossroads node. Paths are long and exposed.

**Key composer challenge**: Elevation. The cliff-plateau molecule gives the shrine and some outcrops visual height. The path router needs to respect cliff edges — paths must approach plateaus from the access side, not through cliff faces. This means the path router needs collision awareness.

---

## Molecule (Assemblage) Inventory

Sorted by abstraction level. Organisms compose these.

### Terrain Molecules (auto-tiled ground patches)

| Molecule | Status | Description | Used by organisms |
|----------|--------|-------------|-------------------|
| `forest-border` | EXISTS | Tree strip along map edge | world-edge[forest] |
| `wheat-field` | EXISTS | Farm terrain with hay border | (Heartfield only) |
| `stagnation-clearing` | EXISTS | Crystal ground + shadow | stagnation-zone |
| `water-body` | NEW | Auto-tiled water fill | river-corridor, lake-shore |
| `shore-transition` | NEW | Water->sand->grass gradient | river-corridor, lake-shore |
| `cliff-face` | NEW | Rock-slope auto-tiled edge | sacred-clearing[plateau], rocky-outcrop, waterfall-grotto |
| `terrain-gradient` | NEW | Linear terrain fade | world-edge[threshold] |
| `tree-ring` | NEW | Circular tree border (forest-border variant) | sacred-clearing |
| `crystal-ground` | NEW | Sand+shadow combo (extract from stagnation-clearing) | stagnation-zone |
| `canopy-path` | NEW | Narrow elevated trail with overhead trees | world-edge[canopy-tunnel] |

### Building Molecules

| Molecule | Status | Description | Used by organisms |
|----------|--------|-------------|-------------------|
| `house` | EXISTS | Building with dirt footprint | hamlet |
| `windmill` | EXISTS | Hilltop building | (Heartfield only) |
| `bridge` | NEW | Stone bridge over water | river-corridor |
| `dock-platform` | NEW | Wood platform over water | fishing-spot |
| `wall-perimeter` | NEW | Stone wall enclosure | hamlet[walled] |
| `fence-perimeter` | NEW | Wood fence enclosure | hamlet[camp/open] |

### Prop Molecules (object clusters)

| Molecule | Status | Description | Used by organisms |
|----------|--------|-------------|-------------------|
| `stone-circle` | NEW | Ring of resonance stones | sacred-clearing[stone-circle] |
| `shrine-ruin` | NEW | Pillars + altar stone | sacred-clearing[shrine] |
| `rest-feature` | NEW | Fallen log / mossy rock | sacred-clearing[rest-spot] |
| `campfire` | NEW | Animated campfire + seating | hamlet[camp/walled] |
| `fountain` | NEW | Animated fountain | hamlet[town] |
| `market-cluster` | NEW | Market stands + props | hamlet[town] |
| `waterfall-face` | NEW | Animated waterfall + cliff | waterfall-grotto |
| `hidden-passage` | NEW | Walkable tile behind visual | waterfall-grotto |

### Event Molecules (trigger zones)

| Molecule | Status | Description | Used by organisms |
|----------|--------|-------------|-------------------|
| `transition-gate` | implicit | Map transition zone | world-edge, all organisms |
| `npc-slot` | implicit | NPC spawn position | all organisms with NPCs |
| `chest-slot` | implicit | Treasure chest position | sacred-clearing, waterfall-grotto |
| `resonance-stone` | implicit | Fragment-bearing trigger | sacred-clearing, lake-shore |
| `minigame-trigger` | NEW | Fishing / other minigame zone | fishing-spot |
| `rest-trigger` | NEW | HP/SP restore zone | hamlet[walled], sacred-clearing[rest-spot] |

---

## Map Composer Requirements

Based on the organism analysis, the map composer needs these capabilities:

### 1. Organism Placement
Place named organisms at (x, y) on the 80x80 canvas. Each organism stamps its molecules onto the multi-layer canvas. Order matters for overlap resolution (later placements win).

### 2. Anchor-Based Path Routing
After all organisms are placed, the composer collects exposed anchors and routes paths between them. The router must:
- Respect collision (cannot route through cliff faces, water, buildings)
- Use the biome-appropriate road terrain
- Support width (2-3 tiles) and style (dirt, road, brick)
- Allow slight randomization for organic feel (forest paths wind, town roads are straight)
- Handle the river constraint (must route to bridge, cannot cross water)

### 3. Biome Fill
After organisms and paths, the composer fills remaining empty space:
- **Ambergrove**: Dense tree scatter + shadow + tallgrass (forest IS the fill)
- **Millbrook**: Light tree scatter + flower grass
- **Sunridge**: Sparse bushes + exposed dirt patches + rocks

This is configurable per biome:
```
biomeFill: {
  treeDensity: 'none' | 'sparse' | 'medium' | 'dense'
  treeTypes: string[]           // palette object refs
  undergrowth: string | null    // tallgrass terrain overlay
  shadowOverlay: boolean        // ground2 canopy dappling
  scatterProps: string[]        // rocks, flowers, etc.
  exposedGround: string | null  // dirt patches in sparse biomes
}
```

### 4. Constraint Propagation
Some organisms constrain others:
- `river-corridor` makes half the map unreachable except via bridge anchors
- `cliff-face` blocks approach from certain directions
- `stagnation-zone` may block progression until a quest flag is set
- `world-edge[threshold]` is passable only after MQ-04

The composer needs to verify that all placed organisms are reachable from the player spawn point given the current quest state.

---

## Palette Coverage

All organisms and molecules use the `village-premium` palette. Every terrain, object, and animation needed is already defined in `palettes/village-premium.ts`. No palette extensions required for Settled Lands.

| Category | Available | Used by Settled Lands |
|----------|-----------|----------------------|
| Ground terrains | 6 (grass, light-grass, dark-grass, dirt, autumn, cherry) | 4 |
| Water | 1 | 1 |
| Roads | 3 (road, brick, dark-brick) | 3 |
| Vegetation | 3 (tallgrass, flower-grass, hay) | 2 |
| Farm | 1 | 0 (Heartfield only) |
| Sand | 2 (sand, sea) | 1 |
| Shadows | 2 (25%, 100%) | 1 |
| Fences | 2 | 1 |
| Walls | 1 | 1 |
| Cliffs | 4 (2 brown, 2 gray) | 2 |
| Buildings | ~40 variants | ~15 |
| Trees | ~12 variants | ~8 |
| Props | ~10 types | ~8 |
| Animations | 13 TSX files | 6 |

---

## Build Order

### Phase A: Core molecules (used by multiple organisms)
1. `water-body` + `shore-transition` — needed by river-corridor, lake-shore, fishing-spot
2. `cliff-face` — needed by sacred-clearing[plateau], rocky-outcrop, waterfall-grotto
3. `tree-ring` — needed by sacred-clearing (all variants)
4. `wall-perimeter` + `fence-perimeter` — needed by hamlet variants

### Phase B: Organisms (one per map, in scene order)
5. `sacred-clearing` organism — unlocks Ambergrove's Hearthstone Circle + Mossy Clearing + Sunridge Wind Shrine
6. `hamlet` organism (camp variant) — unlocks Ambergrove's Woodcutter Camp + Sunridge Waystation
7. `world-edge` organism (generalize existing forest-border) — unlocks all 3 maps' borders
8. `lake-shore` organism — unlocks Ambergrove's Amber Lake
9. `river-corridor` organism — unlocks Millbrook
10. `hamlet` organism (town variant) — unlocks Millbrook Town
11. `waterfall-grotto` organism — unlocks Millbrook Upstream Falls
12. `fishing-spot` organism — unlocks Millbrook Fisher's Rest
13. `stagnation-zone` organism (generalize existing stagnation-clearing) — unlocks Sunridge Outpost
14. `rocky-outcrop` organism — unlocks Sunridge highland features

### Phase C: Map composer
15. Auto-path router with collision awareness
16. Biome fill system (per-biome scatter logic)
17. Constraint propagation / reachability checker

---

## Per-Map Organism Placement Plans

### Ambergrove (Scene 7)

```
Canvas: 80x80, default: ground.dark-grass
Biome fill: dense trees, shadow overlay, tallgrass

Organisms:
  world-edge[forest,dense,gap@34]    x4 edges (W gap->Everwick, S gap->Heartfield, E gap->Flickerveil[MQ-04])
  sacred-clearing[stone-circle,lg]   @ (32,12)  — Hearthstone Circle
  sacred-clearing[rest-spot,sm]      @ (38,38)  — Mossy Clearing
  sacred-clearing[empty,sm]          @ (58,8)   — Hidden clearing (CH-AG-03)
  lake-shore[ellipse,submerged-stone] @ (50,40) — Amber Lake + RS-AG-04
  hamlet[camp,forest,3]              @ (12,52)  — Woodcutter Camp (3 NPCs, SQ-03)
  world-edge[canopy-tunnel]          @ (72,32)  — Eastern Canopy Path (CH-AG-02)

Paths: winding 2-tile dirt roads connecting organism anchors
NPCs: 3 woodcutters (camp), 0 town NPCs
Stones: 5 (3 in hearthstone, 1 submerged, 1 hidden in forest fill)
Chests: 3 (hearthstone center, canopy path, hidden clearing)
Transitions: W->Everwick, S->Heartfield, E->Flickerveil(MQ-04)
```

### Millbrook (Scene 8)

```
Canvas: 80x80, default: ground.grass
Biome fill: light trees, flower-grass clumps

Organisms:
  river-corridor[N-S,w=6,bridge@38]  @ (34,0)  — Brightwater River + Bridge (RS-MB-01)
  waterfall-grotto[cave,hidden]      @ (8,2)    — Upstream Falls (RS-MB-02, RS-MB-04, CH-MB-01)
  hamlet[town,open,10,brick]         @ (18,20)  — Millbrook Town (6 NPCs, shop, elder)
  fishing-spot[dock,fisher]          @ (54,54)  — Fisher's Rest (Fisher Tam, RS-MB-03, CH-MB-03)
  world-edge[forest,sparse]          @ W, E     — Sparse tree borders with gate gaps

Paths: 3-tile brick roads in town, 2-tile dirt roads outside
NPCs: 6 (shopkeeper, elder, bridge guard, 2 townsfolk, fisher)
Stones: 4 (bridge, behind falls, cave, dock)
Chests: 3 (cave fragments, riverbank haste seed, dock potions)
Transitions: E->Everwick, S->Heartfield, W->Hollow Ridge(MQ-04)
```

### Sunridge (Scene 9)

```
Canvas: 80x80, default: ground.grass
Biome fill: minimal — sparse bushes, exposed dirt, scattered rocks

Organisms:
  world-edge[threshold,gradient]     @ (30,0)   — The Threshold (N->Hollow Ridge, MQ-04)
  world-edge[forest,sparse]          @ S, E     — Sparse borders (S->Everwick, E->Ambergrove)
  sacred-clearing[shrine,plateau]    @ (14,10)  — Wind Shrine on cliff (RS-SR-01, CH-SR-01)
  hamlet[walled,village,2]           @ (32,32)  — Ridgetop Waystation (3 NPCs, rest, merchant)
  stagnation-zone[watchtower]        @ (56,22)  — Preserver Outpost (Janik NPC, CH-SR-03)
  rocky-outcrop[large,climbable]     @ (66,6)   — NE cliff (RS-SR-03)
  rocky-outcrop[small] x3            @ scattered — Decorative elevation

Paths: narrow 2-tile dirt roads only
NPCs: 4 (keeper, merchant, guard, Janik[MQ-04])
Stones: 3 (shrine[dormant], waystation garden, NE cliff[climb])
Chests: 3 (shrine, rocky outcrop, outpost)
Transitions: S->Everwick, N->Hollow Ridge(MQ-04), E->Ambergrove
```
