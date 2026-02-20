# Assemblage System v4 — Fractal World Composition

## The Core Insight

**The world is a fractal.** Every compositional level uses the same algebra:
- A **container** holds **features** connected by **tissue**
- Features can themselves be containers (nesting)
- The only "real" boundaries are **transitions** (world ↔ child world)

Pokemon proved this in 1996. You walk from Route 1 into Viridian City — no transition. You walk into the Poke Mart — transition into a child world. Every town is the same building archetypes in different colors. Every route is the same grass/trees with different encounter tables. And a dungeon? That's just another world inside the world — worlds all the way down.

## The Hierarchy

```
WORLD (the whole game — or any child world)
 └── REGIONS (biome zones — outdoor continuous space)
      ├── TOWN ORGANISMS (building clusters ON the outdoor map)
      │    └── WORLD SLOTS → child WorldInstances (shops, inns, residences, etc.)
      ├── CONNECTIVE TISSUE (auto-generated paths, wild areas between towns)
      ├── DUNGEON ENTRIES → child WorldInstances (template: dungeon)
      │    └── FLOORS (the dungeon's "regions")
      │         └── ROOMS (the floor's "anchors")
      │              └── CORRIDORS (the floor's "connective tissue")
      └── FORTRESS ENTRIES → child WorldInstances (template: fortress)
           └── LEVELS (galleries, archives, throne rooms, boss arenas)
```

The fractal recursion: **World -> Region -> Anchor -> WorldSlot -> child WorldInstance -> (its own regions, anchors, world slots...)**. A shop is a world. A dungeon is a world. A dungeon room that contains a hidden cellar? That cellar is a world too.

### Towns Are Outdoor Organisms

This is the critical insight: **towns are NOT separate maps.** A town is a cluster of buildings placed directly on the region's outdoor map. When you walk from the countryside into Everwick, there is no transition. You just walk past the signpost and between the buildings.

The only transitions happen when you walk through a building door into a child world (Khali's Curios, The Bright Hearth, Elder Artun's Home). Each of those is a WorldInstance that references a world template (shop-single, inn, residence).

### Dungeons Are Child Worlds

A dungeon is a WorldInstance (template: `dungeon`) — its own fractal onion:
- The dungeon = a child world
- Floors = the dungeon's "regions"
- Rooms = the floor's "anchors"
- Corridors = the floor's "connective tissue"

Same compositional algebra. Same DDL shape. Just a child world inside the parent world. And if a dungeon room has a hidden cellar, that cellar is yet another child world.

### Fortresses Are The Same Pattern

A fortress (Preserver Fortress) is a WorldInstance (template: `fortress`) using the exact same nesting:
- Fortress = child world with a different biome theme
- Levels = regions (Gallery, Archive, Throne Room, Boss Arena)
- Rooms = anchors
- Hallways = connective tissue

---

## DDL Architecture — Split JSON Files

The world definition is split across multiple files for DRY. Each level of the hierarchy owns its own file.

```
gen/ddl/
  world.json                    ← World: name, properties, region ID refs, connections
  regions/
    settled-lands.json          ← Region: biome, anchors, connective tissue, time budget
    frontier.json
    sketch-realm.json
  templates/
    shop-single.json            ← World template: layout, slot definitions, archetype TMX
    inn.json
    residence.json
    dungeon.json
    fortress.json
    market.json
  worlds/
    everwick-khali.json         ← World instance: template ref + slot config + NPCs + objects
    everwick-hark.json
    everwick-inn.json
    everwick-artun.json
    depths-l1-f1.json           ← Dungeon floor (it's just a child world)
    fortress-f1.json
    fortress-f2.json
    fortress-f3.json
```

### Pointer Pattern

Files reference each other by string ID:
- `world.json` → `"regions": ["settled-lands", "frontier", "sketch-realm"]`
- `settled-lands.json` → anchor.worldSlots: `[{instanceId: "everwick-khali", transitionType: "door"}, ...]`
- `depths-l1` anchor → dungeon.worldSlots: `[{instanceId: "depths-l1-f1", transitionType: "stairs-down"}]`
- `everwick-khali.json` → `"template": "shop-single"` (references `templates/shop-single.json`)

The **world-loader** resolves all IDs to full objects at read time. No data duplication.

### World Templates

Templates define the structural blueprint for a category of child world. They specify layout, slot positions, and the archetype TMX to stamp from. World instances reference a template and fill its slots with specific content.

| Template | Archetype TMX | Use |
|----------|--------------|-----|
| `shop-single` | WeaponSeller_1.tmx / Butchery_1.tmx / etc. | Single-room shops (Khali's, Hark's, specialty stores) |
| `inn` | Tavern_1.tmx | Inns and taverns (The Bright Hearth) |
| `residence` | House_1.tmx / House_2.tmx | Homes (Elder Artun's, NPC houses) |
| `dungeon` | (procedural) | Multi-floor dungeon worlds (Memory Depths) |
| `fortress` | CastleRoom_1.tmx | Multi-level fortress worlds (Preserver Fortress) |
| `market` | (multi-stamp) | Open-air markets with multiple vendor stalls |

A world instance file (e.g., `worlds/everwick-khali.json`) contains:
- `template`: which template to use (`"shop-single"`)
- `templateVariant`: which archetype TMX to stamp (e.g., `"weapon-shop"`)
- `npcs`: NPCs placed in this world
- `objects`: interactable objects
- `worldSlots`: optional nested child worlds (a shop with a back room, a dungeon room with a hidden cellar)

---

## Biome System — Why Every Town Feels Unique

The tileset artists designed for this. They shipped 10+ building color variants:

| Color | Atlas TSX | Biome | Towns |
|-------|-----------|-------|-------|
| Red | Atlas_Buildings_Wood_Red | village | Everwick |
| Hay | Atlas_Buildings_Hay | farmland | Heartfield |
| Green | Atlas_Buildings_Wood_Green | forest | Ambergrove, Flickerveil |
| Blue | Atlas_Buildings_Wood_Blue | mountain | Millbrook, Sunridge |
| Purple | Atlas_Buildings_Wood_Purple | marsh | Shimmer Marsh |
| Indigo | Atlas_Buildings_Wood_Indigo | snow | Hollow Ridge |
| Yellow | Atlas_Buildings_Wood_Yellow | desert | Desert zones |
| Orange | Atlas_Buildings_Wood_Orange | sketch | Half-Drawn Forest |

Same archetype shape. Different biome color. Each biome also defines:
- **Ground terrain** — base fill tile (grass, dark-grass, sand, snow, stone)
- **Road style** — dirt, brick, stone, plank
- **Scatter objects** — trees, bushes, rocks, mushrooms
- **Edge treatment** — forest border, cliffs, water, void
- **Weather** and **ambient music**

---

## The Composers (Top-Down)

### World Composer (`world-composer.ts`)

Entry point. Reads split DDL, orchestrates everything.

```
Input:  gen/ddl/world.json + regions/*.json + templates/*.json + worlds/*.json
Output: Complete game world (all region maps + all child world maps + transitions)
```

1. Load world DDL (world-loader resolves all refs, including template + instance resolution)
2. For each region: call Region Composer
3. Build child world maps from template archetypes + instance slot configs
4. Wire up all transitions (building doors, dungeon entries, region gates, nested world slots)
5. Recurse: if any child world has its own worldSlots, compose those too
6. Validate: all regions accessible per quest progression

### Region Composer (`region-composer.ts`)

Produces one or more outdoor maps per region.

```
Input:  RegionDefinition (biome, anchors, tissue rules, time budget)
Output: RegionMap (outdoor map with towns embedded as organisms)
```

1. Calculate map dimensions from time budget (chronometer)
2. Position anchors on map grid
3. Layout town organisms (outdoor building clusters)
4. Route main road through all anchors (A*)
5. Add branch paths and shortcuts
6. Fill all empty space with biome fill tile
7. Apply edge treatment
8. Register door transitions and NPC positions

### Town Organism (`organisms/town.ts`)

Outdoor building cluster — NOT a separate map.

```
Input:  TownDefinition (services, houses, central feature, size)
Output: TownLayout (building placements, roads, door positions, NPC positions)
```

1. Place central feature (well, fountain, memorial garden)
2. Place service buildings around center (archetype + service type)
3. Fill remaining slots with residential houses
4. Connect all doors to center with internal roads
5. Expose entry anchors for region path routing

### Scene-Level Composer (`composer.ts`)

The original composer — still works for individual map declarations. Used for special-purpose maps that don't fit the world → region → town hierarchy.

---

## Reference TMX Archetypes

The professional TMX maps are our building blocks:

### World Template Archetypes (11)

| ID | Source TMX | Size | Use |
|----|-----------|------|-----|
| weapon-shop | WeaponSeller_1.tmx | 25×22 | Shops (Khali's, Hark's, stores) |
| house-small | House_1.tmx | 20×19 | Elder homes, small residences |
| house-medium | House_2.tmx | 22×20 | Larger homes, guild halls |
| tavern | Tavern_1.tmx | 25×22 | Inns, taverns |
| library | Library_1.tmx | 22×20 | Libraries, archives |
| butchery | Butchery_1.tmx | 20×18 | Specialty shops |
| tailor | TailorShop_1.tmx | 22×20 | Tailors, clothiers |
| cartographer | Cartographer_1.tmx | 22×20 | Cartographers |
| fisherman-hut | FishermanHut_1.tmx | 18×16 | Fishmongers |
| huntmaster | HuntMasterHut_1.tmx | 18×16 | Huntmasters |
| castle-room | CastleRoom_1.tmx | 25×25 | Fortress rooms |

### Outdoor Templates (10)

| ID | Source TMX | Size | Use |
|----|-----------|------|-----|
| farm-shore | Farm Shore.tmx | 40×45 | Farmland base layout |
| village-bridge | Village Bridge.tmx | 60×36 | Village/town base |
| mage-tower | Mage Tower.tmx | 40×40 | Isolated tower features |
| mountain-village | Mountain Village.tmx | 50×40 | Highland settlements |
| desert-town | Desert Town.tmx | 50×40 | Desert settlements |
| forest-keep | Forest Keep.tmx | 50×40 | Forest fortress |
| autumn-fields | Autumn Fields.tmx | 50×40 | Seasonal outdoor areas |

---

## Fill Engine — Simple Fill Tiles

No noise. No ground variants. The fill engine does exactly three things:

1. **Fill all empty tiles** with the biome's designated fill tile (`baseGround`)
2. **Scatter objects** (trees, bushes, rocks) with exclusion radius spacing
3. **Apply edge treatment** (forest border, cliffs, water edges)

That's it. The biome defines what the fill tile is. Empty space = fill tile.

---

## Path Router — A* on Collision Grid

Connects features with walkable roads. Collision grid values:
- `0` = passable ground
- `1` = blocked (building footprint)
- `2` = road (prefer existing roads)
- `3` = reserved (clearance zone around buildings)

Roads route in priority order:
1. **Main roads** route first (region spine)
2. **Branch roads** adapt around main roads
3. **Internal roads** (within towns) last

Each routed path stamps itself as `2` (road) on the grid, so subsequent paths prefer to share roads — exactly like real road networks.

---

## Time Budget → Geography (Chronometer)

The chronometer bridges narrative time with physical map space:

```
Region: Settled Lands (Act 1)
  Total play time:   180 minutes
  Combat time:       36 minutes  (20% — easy difficulty)
  Dialogue time:     27 minutes  (15%)
  Walking time:      117 minutes (65%)
  Walk speed:        4 tiles/sec at 16px
  Total walk tiles:  28,080
  Screen traversal:  ~120 tiles average
  Outdoor screens:   ~234 → capped at practical size
  Anchors:           8
```

The composer uses this to size the region map and space out anchors.

---

## Implementation Status

| Component | File | Status |
|-----------|------|--------|
| TMX Parser | `tmx-parser.ts` | ✅ |
| Archetype Registry | `archetypes.ts` | ✅ 21 archetypes |
| Biome System | `biomes.ts` | ✅ 9 biomes |
| Path Router | `path-router.ts` | ✅ A* + road stamping |
| Fill Engine | `fill-engine.ts` | ✅ Simplified (no noise) |
| Hamlet Organism | `organisms/hamlet.ts` | ✅ |
| Town Organism | `organisms/town.ts` | ✅ |
| Scene Composer | `composer.ts` | ✅ |
| World DDL Types | `world-ddl.ts` | ✅ |
| World Loader | `world-loader.ts` | ✅ Split DDL support |
| Region Composer | `region-composer.ts` | ✅ |
| World Composer | `world-composer.ts` | ✅ |
| Split DDL Files | `gen/ddl/world.json` etc. | ✅ |
| Zod Schema | | ⬜ |
| CLI Integration | | ⬜ |
| TMX Output | | ⬜ |

---

## What This Enables

The entire game world — every outdoor map, every town layout, every road, every fill tile — generates from the split DDL:

```
gen/ddl/world.json + regions/*.json + templates/*.json + worlds/*.json
    ↓ World Composer
Region Maps (outdoor, towns embedded) + Child World Maps (template-stamped)
    ↓ TMX Serializer
.tmx files + event .ts files + transition metadata
    ↓ RPG-JS
Playable game
```

**Adding a new town** = add an anchor to a region JSON + create world instance JSONs for its buildings (each referencing a template like `shop-single` or `inn`).

**Changing a biome** = change one string. Every building recolors, every fill retiles.

**Adding a dungeon** = add a dungeon anchor to a region + create a world instance JSON (template: `dungeon`) with worldSlots for each floor.

**Nesting deeper** = give any world instance its own worldSlots. A dungeon room with a hidden cellar? Add a worldSlot to the room's instance. Worlds all the way down.

No hand-placing tiles. No manual coordinates. Just intent.
