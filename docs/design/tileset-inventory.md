# Tileset Asset Inventory

Complete audit of every tileset domain under `assets/tilesets/`. All tilesets use 16x16 pixel tiles.

Last updated: 2026-02-19

---

## Summary Table

| Domain | PNGs | TSX | Coverage | Orphan PNGs | Status |
|--------|------|-----|----------|-------------|--------|
| village/exteriors | 1,744 | 51 | 97% (1,696 of 1,744 PNGs ref'd) | 48 | Production-ready |
| village/interiors | 588 | 4 | 96% (566 of 588 PNGs ref'd) | 22 | Production-ready |
| fortress | 139 | 25 | 91% (127 of 139 PNGs ref'd) | 12 | Production-ready |
| frontier | 583 | 25 | 95% (555 of 583 PNGs ref'd) | 28 | Production-ready |
| mountain | 610 | 32 | 95% (582 of 610 PNGs ref'd) | 28 | Production-ready |
| sketch-realm | 200 | 29 | 92% (183 of 200 PNGs ref'd) | 17 | Production-ready |
| depths | 16 | 15 | 94% (15 of 16 PNGs ref'd) | 1 | Production-ready |
| old-town | 13 | 13 | 100% | 0 | **TSX created (new)** |
| world | 6 | 6 | 100% | 0 | **TSX created (new)** |

**Total**: 3,899 PNGs, 200 TSX definitions.

---

## Domain Details

### 1. village/exteriors (Premium Fantasy Village)

**Path**: `assets/tilesets/village/exteriors/`
**Pack**: The Fan-tasy Tileset (premium, primary overworld)
**Used by**: Everwick, Heartfield, Ambergrove, Millbrook, Sunridge

| Metric | Value |
|--------|-------|
| Total PNGs | 1,744 |
| TSX definitions | 51 |
| PNGs referenced by TSX | 1,696 |
| Orphan PNGs | 48 |
| Coverage | 97% |

**TSX categories** (51 files):
- 6 `Atlas_*` -- building atlases (bridges, hay, wood variants in 10 colors)
- 5 `Objects_*` -- object collections (buildings, props, trees, rocks, shadows, city walls)
- 11 `Tileset_*` -- terrain tilesets with Wang sets (ground, water, road, sand, tall grass, farm, shadow, walls, fences, rock slopes)
- 14 `Animation_*` -- animated tilesets (campfire, fountain, flowers, waterfall, torch, banner, magic crystal, market stands, candle holders)
- 4 `Atlas_Buildings_Wood_*` + 1 `Atlas_MapBackgrounds` -- additional building/map atlases

**Orphan PNGs** (48 files -- individual sprite variants already bundled into atlas TSX):
- 20 `Animation_Door_Normal_*.png` / `Animation_Door.png` -- door color variants (blue, green, indigo, etc.)
- 9 `Animation_Chest_*.png` -- chest animation variants (gold, steel, wood)
- 6 `Animation_Flowers_*.png` -- flower color variants (black, blue, purple, red, white, yellow)
- 3 `Character_*.png` -- character sprites (Idle, Slash, Walk) -- game uses own spritesheets
- 1 `Crate_Small_Flowers_Yellow.png` -- missing from objects collection
- remaining: animation overlays and map background variants

**Assessment**: Fully production-ready. Orphans are individual sprite extracts from atlas PNGs (the atlas versions are referenced). Wang sets defined for all terrain tilesets.

---

### 2. village/interiors (Premium Fantasy Interiors)

**Path**: `assets/tilesets/village/interiors/`
**Pack**: The Fan-tasy Tileset - Interiors
**Used by**: All shop/inn interior maps (Khali's shop, Hark's forge, Bright Hearth)

| Metric | Value |
|--------|-------|
| Total PNGs | 588 |
| TSX definitions | 4 |
| PNGs referenced by TSX | 566 |
| Orphan PNGs | 22 |
| Coverage | 96% |

**Note**: TSX files live in `Tiled/Tileset/` (singular), not `Tiled/Tilesets/`.

**TSX files** (4):
- `Atlas_Props_Interiors.tsx` -- interior props atlas
- `Objects_Props_Interiors.tsx` -- individual prop objects (references ~560 PNGs via object collection)
- `Tileset_Floor_Interiors.tsx` -- floor tileset with Wang set (Carpets: 7 colors)
- `Tileset_Walls_Interiors.tsx` -- wall tileset with Wang set

**Orphan PNGs** (22 files):
- 7 character sprites (`Character_*.png`, `Slime_*.png`) -- game uses own spritesheets
- 7 interior scene TMX references (`Butchery_1.png`, `Castle_1.png`, `FishermanHut_1.png`, `House_1.png`, `House_2.png`, `Huntmaster_1.png`, `Library_1.png`, `TailorShop_1.png`, `Tavern_1.png`, `WeaponSeller_1.png`) -- these are Tiled example TMX screenshots, not tileset assets
- 3 individual prop variants (`Bed_Fancy_Front_Yellow_Unmade.png`, `Bed_Fancy_Front_Yellow.png`, `Crate_Small_Destroyed.png`)
- 1 food sprite (`Food_Fish_1.png`)

**Assessment**: Production-ready. The 4 TSX files cover all needed tile types. Orphans are example assets and character sprites.

---

### 3. fortress (Castles and Fortresses)

**Path**: `assets/tilesets/fortress/`
**Pack**: The Fan-tasy Tileset - Castles and Fortresses
**Used by**: Preserver Fortress F1-F3

| Metric | Value |
|--------|-------|
| Total PNGs | 139 |
| TSX definitions | 25 |
| PNGs referenced by TSX | 127 |
| Orphan PNGs | 12 |
| Coverage | 91% |

**TSX categories** (25 files):
- 9 `Animation_*` -- animated props (banners x3, flowers, fountain, market stands x2, torch, waterfall)
- 3 `Atlas_*` -- atlas sheets (props, trees/bushes, castle building, castle details)
- 3 `Objects_*` -- object collections (buildings, props, trees)
- 7 `Tileset_*` -- terrain with Wang sets (castle grass, farm field, ground, road, rock slope, shadow, water)
- 2 building atlases (`Castle_Building.tsx`, `Castle_Details.tsx`)
- 1 character tileset (`Character.tsx`)

**Orphan PNGs** (12 files):
- 3 character sprites (`Character_Slash.png`, `Character_Walk.png` + Slime variants) -- game uses own spritesheets
- 6 individual flower color variants (`Flowers_Black.png` through `Flowers_Yellow.png`) -- already in `Animation_Flowers.tsx` atlas
- 3 slime sprites (`Slime_Attack.png`, `Slime_Death.png`, `Slime_Idle.png`, `Slime_Walk.png`)

**Assessment**: Production-ready. All terrain, building, and prop tiles are fully covered by TSX. Orphans are character sprites and individual flower extracts.

---

### 4. frontier (Seasons Pack)

**Path**: `assets/tilesets/frontier/`
**Pack**: The Fan-tasy Tileset - Seasons
**Used by**: Shimmer Marsh, Hollow Ridge, Flickerveil, Resonance Fields

| Metric | Value |
|--------|-------|
| Total PNGs | 583 |
| TSX definitions | 25 |
| PNGs referenced by TSX | 555 |
| Orphan PNGs | 28 |
| Coverage | 95% |

**TSX categories** (25 files):
- 5 `Animation_*` -- animated props (banner, campfire, flowers, torch, waterfall)
- 3 `Atlas_*` -- atlas sheets (buildings/bridges, buildings/hay, map backgrounds)
- 5 `Objects_*` -- object collections (buildings, props, rocks, shadows, trees -- each referencing hundreds of individual PNGs)
- 12 `Tileset_*` -- terrain with Wang sets (farm field, fences x2, ground, leaves, road, rock slopes x2, sand, shadow, tall grass, water)

**Orphan PNGs** (28 files):
- 7 character/slime sprites -- game uses own spritesheets
- 6 individual flower color variants -- already in `Animation_Flowers.tsx` atlas
- 4 door/market stand animations (`Door_Normal_Wood.png`, `Door_Small_Wood.png`, `MarketStand_1.png`, `MarketStand_2.png`)
- 3 torch variants (`Torch_2.png`, `Torch_3.png`, `Torch_4.png`) -- only `Torch_1` is animated TSX
- 2 atlas sheets (`Atlas_TreesBushes_Seasons.png`, `Buildings_Settlement.png`) -- superseded by the Objects_ TSX approach
- 2 rock variants (`Rock_Brown_Moss_10.png`, `Rock_Gray_Water_10.png`) -- likely numbering gaps
- 2 misc (`Animation_MagicCrystal.png`, `Crate_Small_Flowers_Yellow.png`, `Tileset_Wall.png`, `Rocks.png`)

**Assessment**: Production-ready. The 5 Objects_ TSX files use the atlas-of-individuals pattern, referencing 100+ PNGs each. Remaining orphans are color variants and character sprites.

---

### 5. mountain (Snow Pack)

**Path**: `assets/tilesets/mountain/`
**Pack**: The Fan-tasy Tileset - Snow
**Used by**: Shimmer Marsh (snow variant), Hollow Ridge

| Metric | Value |
|--------|-------|
| Total PNGs | 610 |
| TSX definitions | 32 |
| PNGs referenced by TSX | 582 |
| Orphan PNGs | 28 |
| Coverage | 95% |

**TSX categories** (32 files):
- 10 `Animation_*` -- animated props (banners, campfire, door, flowers, magic crystal, market stands, torch, waterfall)
- 6 `Atlas_*` -- atlas sheets (buildings/bridges/snow, buildings/snow, map backgrounds, props, rocks, trees/bushes)
- 5 `Objects_*` -- object collections (buildings, props, rocks, shadows, trees)
- 11 `Tileset_*` -- terrain with Wang sets (fences, ground, ice, leaves, road, rock slopes x2, sand, shadow, tall grass, water)

**Orphan PNGs** (28 files):
- 7 character/slime sprites -- game uses own spritesheets
- 6 individual flower color variants -- already in `Animation_Flowers.tsx` atlas
- 10 snow-variant market stands (`MarketStand_1_Blue_Snow.png` through `MarketStand_2_Yellow_Snow.png`)
- 3 bridge stones, 1 barrel, 1 street decoration, 3 torch variants

**Assessment**: Production-ready. Orphans are snow color variants of market stands not included in the base Objects TSX, plus the usual character sprites and flower variants.

---

### 6. sketch-realm (Desert Pack)

**Path**: `assets/tilesets/sketch-realm/`
**Pack**: The Fan-tasy Tileset - Desert
**Used by**: Luminous Wastes, Undrawn Peaks, Half-Drawn Forest

| Metric | Value |
|--------|-------|
| Total PNGs | 200 |
| TSX definitions | 29 |
| PNGs referenced by TSX | 183 |
| Orphan PNGs | 17 |
| Coverage | 92% |

**TSX categories** (29 files):
- 10 `Animation_*` -- animated props (banners, campfire, door, flowers, magic crystal, market stands, torch, waterfall)
- 5 `Atlas_*` -- atlas sheets (building props, buildings, props, rocks, trees/bushes)
- 4 `Objects_*` -- object collections (buildings, props, rocks, trees)
- 10 `Tileset_*` -- terrain with Wang sets (fence, ground, road, rock slopes x2, sand, shadow, tall grass, wall, water)

**Orphan PNGs** (17 files):
- 7 character/slime sprites -- game uses own spritesheets
- 6 individual flower color variants -- already in `Animation_Flowers.tsx` atlas
- 4 dead tree variants (`Tree_Dead_2.png` through `Tree_Dead_5.png`) -- not included in any Objects TSX

**Assessment**: Production-ready. The 4 dead tree variants are the only gameplay-relevant orphans and may warrant a dedicated `Objects_DeadTrees.tsx` if those trees are needed in maps.

**Action needed**: Consider creating an `Objects_Dead_Trees.tsx` for the 4 dead tree PNGs if the Sketch Realm maps require dead tree objects.

---

### 7. depths (Classic Dungeons)

**Path**: `assets/tilesets/depths/`
**Pack**: Classic Dungeons
**Used by**: Depths L1-L5

| Metric | Value |
|--------|-------|
| Total PNGs | 16 |
| TSX definitions | 15 |
| PNGs referenced by TSX | 15 |
| Orphan PNGs | 1 |
| Coverage | 94% |

**TSX files** (15):
- `Tileset_StoneFloor.tsx` -- floor with Wang set (Stone Floor, Dirt Floor)
- `Tileset_Walls.tsx` -- walls with Wang set (Stone Wall, Brick Wall, Dark Wall)
- `Tileset_FloorWallEdges.tsx` -- transitions with Wang set
- `Tileset_StagnantWater[Blue|Green|Red].tsx` -- water pools with Wang sets
- `Tileset_GeneralDetail.tsx` -- statues, potions, bones, crates
- `Tileset_Doors.tsx` -- wood, iron, ornate door sets
- `Tileset_DoorExitEnter.tsx` -- exit/enter portal tiles
- `Tileset_JailDoor.tsx` -- jail bars
- `Tileset_FoliageOvergrowth.tsx` -- vines, moss, ferns, mushrooms
- `Tileset_SewerDetails.tsx` -- pipes, grates, drains
- `Animation_Candles.tsx` -- candle animations (14 variants)
- `Animation_BoxChest.tsx` -- chest open/close animation
- `Tileset_Fog.tsx` -- fog overlay (references `fog_2.png`)

**Orphan PNGs** (1 file):
- `fog_1.png` -- alternate fog texture, not referenced by `Tileset_Fog.tsx` (which uses `fog_2.png`)

**Assessment**: Production-ready. The single orphan `fog_1.png` is an alternate fog texture. Could be used as a second fog layer if needed.

---

### 8. old-town (Town Exteriors and Interiors)

**Path**: `assets/tilesets/old-town/`
**Pack**: Old Town building + interior pack
**Used by**: Potential use for aged market districts, working-class neighborhoods

| Metric | Value |
|--------|-------|
| Total PNGs | 13 |
| TSX definitions | 13 (newly created) |
| PNGs referenced by TSX | 13 |
| Orphan PNGs | 0 |
| Coverage | 100% |

#### Exteriors (`old-town/exteriors/`) -- 4 PNGs, 4 TSX

| PNG | Dimensions | TSX | Content |
|-----|-----------|-----|---------|
| `Old_Town_STONE_BUILDING.png` | 128x272 | `Old_Town_STONE_BUILDING.tsx` (136 tiles, 8 cols) | Stone building facades, walls, roofs, windows, doors |
| `Old_Town_STUCCO_BUILDING.png` | 128x272 | `Old_Town_STUCCO_BUILDING.tsx` (136 tiles, 8 cols) | Stucco/plaster building facades |
| `Old_Town_WOOD_BUILDING.png` | 128x272 | `Old_Town_WOOD_BUILDING.tsx` (136 tiles, 8 cols) | Timber-frame building facades |
| `Old_Town_EXTRAS.png` | 112x480 | `Old_Town_EXTRAS.tsx` (210 tiles, 7 cols) | Chimneys, windows, doors, signs, roof details, misc props |

#### Interiors (`old-town/interiors/`) -- 9 PNGs, 9 TSX

| PNG | Dimensions | TSX | Content |
|-----|-----------|-----|---------|
| `Building_Interiors_Floor_Wood.png` | 112x240 | `Tileset_Floor_Wood.tsx` (105 tiles) | Wood floor planks, patterns |
| `Building_Interiors_Floor_Stone.png` | 112x240 | `Tileset_Floor_Stone.tsx` (105 tiles) | Stone floor slabs, cracked variants |
| `Building_Interiors_Floor_Carpet.png` | 112x112 | `Tileset_Floor_Carpet.tsx` (49 tiles) | Colored carpet tiles |
| `Building_Interiors_Floor_Carpet_Grey.png` | 112x112 | `Tileset_Floor_Carpet_Grey.tsx` (49 tiles) | Grey carpet variant |
| `Building_Interiors_Wall_Tiles.png` | 96x384 | `Tileset_Wall_Tiles.tsx` (144 tiles) | Wall tile patterns (brick, plain, etc.) |
| `Building_Interiors_Wall_Tops.png` | 112x256 | `Tileset_Wall_Tops.tsx` (112 tiles) | Wall top trim, crown molding |
| `Building_Interiors_Detail_Objects.png` | 112x592 | `Tileset_Detail_Objects.tsx` (259 tiles) | Furniture, shelves, barrels, beds, tables |
| `Building_Interiors_Water_Channel.png` | 112x112 | `Tileset_Water_Channel.tsx` (49 tiles) | Indoor water channel tiles |
| `animated_water_tiles.png` | 64x128 | `Animation_Water_Tiles.tsx` (32 tiles) | 4-frame animated water (8 rows, 4 cols) |

**Status**: TSX files newly created. No Wang set auto-tiling yet -- requires visual inspection of PNG grid layout to define Wang colors.

**Next steps**:
1. Visually inspect each PNG to map the tile grid layout
2. Add Wang set definitions to floor and wall TSX files for auto-tiling
3. Add collision properties to wall and furniture tiles
4. Define palette entries in `gen/assemblage/tileset/palettes/old-town.ts`

---

### 9. world (World Map Tiles)

**Path**: `assets/tilesets/world/tiles/`
**Pack**: World map tileset
**Used by**: Overworld / region map

| Metric | Value |
|--------|-------|
| Total PNGs | 6 |
| TSX definitions | 6 (newly created) |
| PNGs referenced by TSX | 6 |
| Orphan PNGs | 0 |
| Coverage | 100% |

| PNG | Dimensions | TSX | Content |
|-----|-----------|-----|---------|
| `world_map_tiles_SUMMER.png` | 112x320 | `Tileset_WorldMap_Summer.tsx` (140 tiles) | Summer terrain: grass, forest, mountain, water, desert, roads, villages |
| `world_map_tiles_WINTER.png` | 112x320 | `Tileset_WorldMap_Winter.tsx` (140 tiles) | Winter terrain: snow, frozen forest, icy mountains, frozen water |
| `world_map_tiles_SumerWinter-Merger_Tiles.png` | 112x112 | `Tileset_WorldMap_Merger.tsx` (49 tiles) | Seasonal transition tiles between summer and winter zones |
| `Clouds-Fog-of-War_47tileset.png` | 112x112 | `Tileset_Clouds_FogOfWar.tsx` (49 tiles) | Cloud/fog overlay for unexplored areas (47 unique tiles + 2 empty) |
| `Boat_and_Wagon_units.png` | 64x48 | `Objects_Boat_Wagon.tsx` (12 tiles) | Boat and wagon unit sprites for world map travel |
| `Simple Water Animation/simple_water_spritesheet.png` | 64x48 | `Animation_SimpleWater.tsx` (12 tiles) | 3-frame animated water tiles (4 tile columns, 3 rows) |

**Status**: TSX files newly created. No Wang set auto-tiling -- terrain transition edges should be defined via Wang sets.

**Next steps**:
1. Visually inspect summer/winter tile layouts to identify terrain types
2. Add Wang set definitions for terrain transitions
3. Define palette entries in `gen/assemblage/tileset/palettes/world-map.ts`

---

## Cross-Domain Orphan Analysis

Most orphan PNGs across all domains fall into predictable categories:

### Character/Slime sprites (ignored)
Every premium pack includes `Character_Idle.png`, `Character_Slash.png`, `Character_Walk.png`, `Slime_Attack.png`, `Slime_Death.png`, `Slime_Idle.png`, `Slime_Walk.png`. The game uses its own custom character spritesheets, so these pack-included sprites are irrelevant.

**Affected domains**: All 7 premium domains (village/ext, village/int, fortress, frontier, mountain, sketch-realm)
**Count**: ~42 sprites (6-7 per domain)

### Individual flower color variants (ignored)
The packs include `Flowers_Black.png`, `Flowers_Blue.png`, `Flowers_Purple.png`, `Flowers_Red.png`, `Flowers_White.png`, `Flowers_Yellow.png` as separate PNGs. The TSX files reference the combined `Flowers.png` animation atlas instead.

**Affected domains**: fortress, frontier, mountain, sketch-realm
**Count**: ~24 sprites (6 per domain)

### Animation variants not in TSX
Some color variants of animations (door colors, chest materials, torch levels) exist as separate PNGs but are not referenced by any TSX. These are available for future use if needed.

**Notable**:
- `village/exteriors`: 20 door color variants, 9 chest variants
- `frontier/mountain`: 3 torch variants each (`Torch_2/3/4.png`)
- `mountain`: 10 snow market stand color variants

### Atlas alternates
Some domains include both an atlas sheet and the individual tiles that compose it. The TSX files reference only one form (usually the atlas for terrain, the individuals for objects).

**Notable**:
- `frontier`: `Atlas_TreesBushes_Seasons.png`, `Buildings_Settlement.png` superseded by Objects_ TSX
- `mountain`: `Buildings_Settlement.png` superseded by Objects_ TSX

---

## Palette Coverage

| Palette File | Domain | Status |
|-------------|--------|--------|
| `village-premium.ts` | village/exteriors | Complete with terrains + objects |
| `interior-premium.ts` | village/interiors | Complete with terrains |
| `fortress-castles.ts` | fortress | Complete with terrains |
| `frontier-seasons.ts` | frontier | Complete with terrains |
| `snow-mountain.ts` | mountain | Complete with terrains |
| `desert-sketch.ts` | sketch-realm | Complete with terrains |
| `dungeon-depths.ts` | depths | Complete with terrains + fixed tiles |
| `old-town.ts` | old-town (ext + int) | **New** -- placeholder terrains, initial fixed tiles |
| `world-map.ts` | world | **New** -- placeholder terrains, initial fixed tiles |

---

## Recommendations

### Immediate (needed for current Phase 4 work)
None -- the village/exteriors, village/interiors, and depths palettes are complete and sufficient for Act 1 scene building.

### Near-term (for Act 2-3 scene building)
1. **Sketch-realm dead trees**: Create `Objects_Dead_Trees.tsx` for the 4 `Tree_Dead_*.png` files if needed for Half-Drawn Forest maps.
2. **Depths fog_1.png**: Consider creating a second fog TSX if fog layering is needed for deeper dungeon levels.

### Long-term (world map and old-town interiors)
1. **Wang set definitions**: Add Wang set auto-tiling data to old-town and world TSX files after visual inspection.
2. **Collision data**: Add collision properties to old-town wall and furniture tiles.
3. **Snow market stands**: Create TSX for the 10 snow market stand variants if mountain towns need colored market stalls.
4. **Torch variants**: Create TSX for `Torch_2/3/4.png` if additional torch styles are needed.
