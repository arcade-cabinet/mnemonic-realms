# Local Assets Catalog

Source: `/Volumes/home/assets/` (external volume)
Inventoried: 2026-02-13

---

## Directory Structure Overview

```
/Volumes/home/assets/
├── Kenney Game Assets All-in-1 3.0.0/   # CC0 — massive 2D/3D/Audio/UI/Icon/Font collection
│   ├── 2D assets/          (140+ packs)
│   ├── 3D assets/          (not relevant)
│   ├── Audio/              (16 packs — RPG, retro, UI, music)
│   ├── Icons/              (8 packs — game icons, input prompts)
│   ├── UI assets/          (10 packs — fantasy borders, pixel adventure)
│   ├── Goodies/            (fonts, wallpapers)
│   └── Other/              (fonts, miniguides)
├── AmbientCG/Assets/       # CC0 — PBR materials, HDRIs, terrain
│   ├── MATERIAL/           1,945 materials @ 1K-JPG (~13 GB)
│   ├── TERRAIN/            58 files (~15 GB)
│   ├── HDRI/               2,294 files (~1.2 GB)
│   ├── ATLAS/              566 files (~203 MB)
│   ├── DECAL/              513 files (~172 MB)
│   └── PLAIN/              19 files (~109 MB)
├── Music/                  # Clement Panchout — 20 WAV tracks (~397 MB)
├── PSX Mega Pack II v1.8/  # Low-res retro textures + 3D models
├── KayKit_*/               # 3D character/dungeon/medieval packs (not relevant)
├── Quaternius/             # 3D models (not relevant)
├── Kenney/                 # Duplicate of "Kenney Game Assets All-in-1 3.0.0"
└── [various 3D/alien/sci-fi packs — not relevant to 2D JRPG]
```

---

## Usable Assets by Category

### 1. 2D RPG Tilesets (HIGH VALUE)

All from `Kenney Game Assets All-in-1 3.0.0/2D assets/`. License: CC0.

| Pack | Tile Size | PNGs | Size | RPG Relevance |
|------|-----------|------|------|---------------|
| **Roguelike Base Pack** | 16x16 | 5 sheets | 325K | Dungeon floors, walls, doors, items, characters. Spritesheet 968x526 with 1px spacing. Includes TMX sample maps. |
| **Roguelike Characters Pack** | 16x16 | 4 sheets | 120K | Character sprites — heroes, monsters, NPCs |
| **Roguelike City Pack** | 16x16 | 1,040 tiles | 1.3M | Town buildings, streets, market stalls, furniture |
| **Roguelike Dungeon Pack** | 16x16 | 4 sheets | 125K | Dungeon-specific tiles — chasms, traps, treasure |
| **Roguelike Interior Pack** | 16x16 | 4 sheets | 150K | Indoor furniture, shelves, beds, tables |
| **Tiny Dungeon** | 16x16 | 136 tiles | 263K | Simplified dungeon tiles with Tiled TMX support |
| **Tiny Town** | 16x16 | 136 tiles | 324K | Simplified town tiles, pairs with Tiny Dungeon |
| **Tiny Battle** | 16x16 | 202 tiles | 339K | Battle-oriented sprites, weapons, effects |
| **Monochrome RPG Tileset** | 16x16 | 427 tiles | 847K | Full RPG tileset in monochrome — can be tinted per-zone |
| **Micro Roguelike** | 8x8 | 326 tiles | 489K | Tiny roguelike tiles (colored + monochrome variants) |
| **RPG Tiles Vector** | 64x64 | 233 tiles | 1.9M | Vector-style RPG tiles — too large for 16-bit aesthetic but could downsample |
| **RTS Medieval (Pixel)** | 16x16 | 211 tiles | 316K | Medieval buildings, units, terrain in pixel art |
| **Scribble Dungeons** | varies | 276 tiles | 3.1M | Hand-drawn dungeon style — unique aesthetic |
| **1-Bit Pack** | 16x16 | 14 sheets | 715K | Fantasy, interior, platformer, urban sample maps. Colored + monochrome variants. |
| **RPG Urban Pack** | varies | 582 tiles | 824K | Urban/town environment tiles |
| **Map Pack** | varies | — | — | Overworld map pieces |
| **Cartography Pack** | varies | — | — | Map decoration elements |

### 2. Audio (HIGH VALUE)

#### Kenney Audio (CC0)

| Pack | Files | Format | Size | Content |
|------|-------|--------|------|---------|
| **RPG Audio** | 51 | OGG | 881K | Footsteps, door sounds, cloth rustling, sword draws, book flips, coin handling, knife slices, metal latches |
| **Music Loops** | 29 (19 modern + 5 retro) | OGG | 5.9M | "Sad Town", "Game Over", "Retro Mystic", "Retro Comedy", "Farm Frolics", "Night at the Beach" |
| **Music Jingles** | 85 | OGG | 1.6M | Short musical cues for victories, discoveries, events |
| **Interface Sounds** | 100 | OGG | 1.3M | Click, hover, confirm, cancel, scroll, toggle |
| **Retro Sounds 1** | 34 | OGG | 304K | 8-bit/16-bit style sound effects |
| **Retro Sounds 2** | 65 | OGG | 874K | More retro SFX |
| **UI Audio** | 51 | OGG | 693K | Menu navigation, selections, transitions |

#### Clement Panchout Music (WAV, custom license — verify before use)

| Track | Size | RPG Relevance |
|-------|------|---------------|
| **Village (2002)** | 36 MB | Town/village BGM — strong JRPG fit |
| **Forest Of A Thousand Masks** | 28 MB | Overworld/forest exploration |
| **Journey (2017)** | 10 MB | Travel/adventure theme |
| **Dark (2004)** | 8.5 MB | Dungeon/cave atmosphere |
| **Spooky Soundscape: The Whispering Shadows Dungeon (2016)** | 19 MB | Dungeon ambient — labeled "Retro" |
| **16 Bit GEN Death Metal (2025)** | 11 MB | Boss battle music — Genesis-style |
| **Unsettling Victory (2019)** | 4 MB | Ambiguous victory jingle |
| **Shadowl OST (2019)** | 20 MB | Full game soundtrack |

**WARNING**: The Clement Panchout tracks are NOT CC0. License must be verified before integration. They are labeled as personal compositions, not open-license releases.

### 3. UI Elements (MEDIUM-HIGH VALUE)

| Pack | PNGs | Size | Content |
|------|------|------|---------|
| **Fantasy UI Borders** | 280 | 920K | 48x48 panel borders, frames, decorative edges — Default + Double variants. Perfect for JRPG dialogue boxes. |
| **UI Pack - Pixel Adventure** | 514 | 873K | Pixel-art buttons, panels, health bars, inventory frames. Multiple outline weights. |
| **UI Pack - Adventure** | 260 | 977K | Adventure-themed buttons, panels, sliders |
| **UI Pack** | 875 | 2.6M | Generic UI elements — buttons, checkboxes, sliders |
| **Cursor Pixel Pack** | 223 | 306K | Pixel-art cursors for menus |

### 4. Icons (MEDIUM VALUE)

| Pack | PNGs | Size | Content |
|------|------|------|---------|
| **Game Icons** | 425 | 1.1M | 50x50 icons — swords, shields, potions, arrows, magic. Black + White variants. |
| **Game Icons Expansion** | 365 | 963K | Extended icon set — more weapons, items, abilities |
| **Game Icons Fighter Expansion** | 161 | 552K | Combat-specific icons — attacks, blocks, specials |
| **Input Prompts Pixel 16x** | — | — | Pixel-art keyboard/gamepad button prompts |

### 5. Fonts (MEDIUM VALUE)

From `Kenney Game Assets All-in-1 3.0.0/Other/Fonts/` (CC0):

| Font | Style | Fit |
|------|-------|-----|
| **Kenney Pixel.ttf** | Pixel bitmap | Best match for 16-bit JRPG aesthetic |
| **Kenney Pixel Square.ttf** | Square pixel | Alternate pixel font |
| **Kenney Mini.ttf** | Small clean | HUD/status text |
| **Kenney Mini Square.ttf** | Small square | HUD alternate |
| **Kenney Blocks.ttf** | Blocky display | Title screens |
| **Kenney Bold.ttf** | Bold sans | Menu headers |
| **Kenney Future.ttf** | Futuristic | Not relevant |
| **Kenney Space.ttf** | Sci-fi | Not relevant |

Plus webfont ZIPs (Webfonts A.zip, Webfonts B.zip) for browser deployment.

### 6. PSX Mega Pack II (LOW-MEDIUM VALUE)

- **226 retro textures** at ~256x256 (PNG, RGBA)
- Low-poly 3D models (not relevant)
- Textures are PS1-era aesthetic — gritty, low-res brick, concrete, dirt, metal
- Could serve as GenAI style reference for "worn/ancient" locations
- Not directly usable as 2D RPG tiles without significant processing

### 7. AmbientCG PBR Materials (HIGH VALUE — biome tile base textures)

**Location**: `/Volumes/home/assets/AmbientCG/Assets/`
**License**: CC0 (Creative Commons Zero)
**Resolution**: 1024x1024 per texture (1K-JPG)

Each material directory contains: `_Color.jpg` (albedo), `_Displacement.jpg`, `_NormalGL.jpg`, `_Roughness.jpg`, `_AmbientOcclusion.jpg`, plus `.blend`/`.mtlx`/`.usdc` scene files. **Only `_Color.jpg` is relevant** for the downsampling pipeline.

#### Material Counts by Category

| Category | Count | RPG Biome Relevance |
|----------|-------|---------------------|
| **Ground** | 117 | Grassland, farmland, mountain, marsh, dungeon floors |
| **Rock** | 65 | Mountain, cliffs, dungeon walls, boulders |
| **Rocks** (scattered) | 26 | Mountain gravel, riverbed, path edges |
| **Gravel** | 43 | Paths, scree, mountain trails, riverbeds |
| **Grass** | 8 | Grassland, plains, forest clearings |
| **Snow** | 20 | Mountain peaks, Undrawn Peaks zone |
| **Moss** | 4 | Forest floor, wetland, dungeon walls |
| **Lava** | 5 | Volcanic regions, fury-themed areas (bonus: has Emission map) |
| **Ice** | 4 | Stagnation zones, crystal overlays |
| **Leaf/ScatteredLeaves** | 11 | Forest floor, autumnal zones |
| **Wood** | 100 | Building walls, fences, docks, interiors |
| **WoodFloor** | 70 | Interior floors, village buildings, inn |
| **Planks** | 59 | Boardwalks, docks, bridges, marsh paths |
| **Bark** | 15 | Tree trunks, forest obstacles |
| **WoodSiding** | 13 | Building exteriors, farmsteads |
| **Bricks** | 114 | Village walls, dungeon, Millbrook quays |
| **PavingStones** | 154 | Village cobblestone, town paths, bridges |
| **Tiles** (ceramic) | 158 | Dungeon floors, town interiors, roofs |
| **Marble** | 26 | Temples, Preserver Fortress, ornate dungeons |
| **Concrete** | 61 | Dungeon/ruins base textures |
| **Fabric** | 86 | Banners, tents, cloth accents |
| **Leather** | 50 | Equipment textures, GenAI reference |
| **Metal/MetalPlates** | 120 | Dungeon doors, armor, dungeon objects |
| **RoofingTiles** | 27 | Village/town rooftops |
| **Facade** | 26 | Building fronts — windows, plaster, paint |
| **Fence** | 12 | Village/farmland fences |
| **Chainmail** | 4 | Equipment overlay textures |
| **Rope** | 3 | Bridges, docks, dungeon props |
| **Clay** | 4 | Pottery, dungeon decor, farmland |
| **Wicker** | 19 | Baskets, thatched roofs, village props |
| **ThatchedRoof** | 4 | Village/farmstead roofs |
| **Tatami** | 6 | Interior flooring variant |
| **Cork/Paper/Cardboard** | 13 | GenAI reference for aged/weathered textures |
| **Rust** | 10 | Dungeon metal aging, old machinery |
| **Onyx/Granite/Travertine** | 43 | Ornate stone, temple floors, Fortress |
| **Other** (signs, candy, foam, etc.) | ~200 | Minimal RPG relevance |
| **TOTAL** | **1,945** | |

#### HDRI Sky Environments (382 images)

| Category | Count | Notes |
|----------|-------|-------|
| **DaySkyHDRI** | 122 | Clear blue skies, clouds — Normal/Vivid tier parallax backgrounds |
| **DayEnvironmentHDRI** | 101 | Outdoor environments with sky — landscape+sky combos |
| **EveningSkyHDRI** | 82 | Sunset/twilight skies — evening ambience |
| **MorningSkyHDRI** | 18 | Dawn/sunrise — morning zone transitions |
| **NightSkyHDRI** | 17 | Starfields, dark skies — dungeon entrance exteriors |
| **NightEnvironmentHDRI** | 10 | Night outdoor scenes |
| **EveningEnvironmentHDRI** | 6 | Sunset environment+sky combos |
| **IndoorEnvironmentHDRI** | 22 | Not relevant for outdoor parallax |
| **HDRIElement** | 4 | Misc lighting elements |

Format: Each HDRI has a `_1K_TONEMAPPED.jpg` (1024x512 equirectangular, ready to use as panoramic backdrop) and `_1K_HDR.exr` (raw HDR). The tonemapped JPGs are directly usable.

#### PLAIN Backdrops (9 panoramic images)

| Asset | Resolution | Description |
|-------|-----------|-------------|
| Backdrop001 | 8192x714 | Wide panoramic backdrop |
| Backdrop002 | 8192x1270 | Taller panoramic |
| Backdrop003 | 8192x503 | Narrow panoramic |
| Backdrop004 | 8192x1365 | Medium panoramic |
| Backdrop005 | 8192x2731 | Tall panoramic |
| Backdrop006 | 8192x1365 | Medium panoramic |
| Backdrop007 | 8192x2048 | Standard panoramic |
| Backdrop008 | 8192x4096 | Large panoramic |
| Backdrop009 | 8192x1024 | Standard panoramic |

Format: 8K-JPG with Color + Opacity maps. Could be sliced and downsampled for parallax scrolling backgrounds.

#### TERRAIN (5 heightmap sets)

Each terrain has `_2K_Color.jpg` (2048x2048 overhead color), `_2K_Details.jpg`, `_2K_Flow.jpg`, `_2K_Protrusion.jpg`, `_2K_Soil.jpg` plus OBJ 3D mesh. The **Color maps** are top-down aerial views of natural terrain — directly relevant as tilemap generation source material.

#### ATLAS (55 sprite atlases)

| Category | Count | Description |
|----------|-------|-------------|
| LeafSet | 29 | Individual leaf sprites with transparency — autumnal variety |
| Foliage | 8 | Foliage clusters on transparent background |
| FoodCrossSectionSet | 5 | Not relevant |
| Other (tape, screws, etc.) | 13 | Not relevant |

The **LeafSet** and **Foliage** atlases (37 total) contain individual leaf/plant sprites on transparent backgrounds — useful for scatter-overlay decoration on forest/marsh tiles.

#### DECAL (49 surface decals)

| Category | Count | Description |
|----------|-------|-------------|
| Leaking | 15 | Water stain patterns — dungeon/marsh water damage overlays |
| ManholeCover | 9 | Metal circles — dungeon grate/drain patterns |
| RoadLines | 17 | Not relevant (modern road markings) |
| Other | 8 | Not relevant |

---

## AmbientCG-to-Biome Texture Mapping

This section maps AmbientCG materials to the game's 9 biomes and 3 vibrancy tiers, as defined in `docs/world/geography.md`, `docs/world/vibrancy-system.md`, and `docs/design/tileset-spec.md`.

**Target output**: 32x32 pixel tiles (game uses 32x32, not 16x16).

### Pipeline: AmbientCG Color Map to Tile Base

```
AmbientCG 1024x1024 _Color.jpg
  --> Crop to interesting 128x128 or 256x256 region
  --> Downscale to 32x32 (nearest-neighbor for pixel-art crispness)
  --> Posterize to 8-16 colors using biome tier palette
  --> Adjust hue/saturation to match tier color key
  --> Export as tile base PNG
  --> GenAI adds detail objects on top (furniture, flowers, etc.)
```

For each biome, the pipeline uses a different subset of AmbientCG textures as base inputs. The tile spec defines ~510 unique tile types across 9 biomes x 3 tiers = ~1,530 tile variants total (plus overlays/transitions).

### Biome 1: Village (30x30 map)

| Tile Category | AmbientCG Source | Count | Path Pattern |
|---------------|------------------|-------|-------------|
| Cobblestone ground (VIL-GR-01..03) | PavingStones001-154 | **154** | `MATERIAL/1K-JPG/PavingStones*/` |
| Grass patches (VIL-GR-04..05) | Grass001-008 | **8** | `MATERIAL/1K-JPG/Grass*/` |
| Dirt ground (VIL-GR-06) | Ground001-101 | **117** | `MATERIAL/1K-JPG/Ground*/` |
| Indoor wood floor (VIL-GR-08) | WoodFloor001-067 | **70** | `MATERIAL/1K-JPG/WoodFloor*/` |
| Building walls (VIL-OB-01..02) | Bricks001-103, Facade001-020 | **140** | `MATERIAL/1K-JPG/Bricks*/, Facade*/` |
| Roof thatch (VIL-OB-03) | ThatchedRoof001-002 | **4** | `MATERIAL/1K-JPG/ThatchedRoof*/` |
| Roof tile (VIL-OB-04) | RoofingTiles001-015 | **27** | `MATERIAL/1K-JPG/RoofingTiles*/` |
| Wood fences (VIL-OB-05) | Fence001-008, Planks001-039 | **71** | `MATERIAL/1K-JPG/Fence*/, Planks*/` |

**Best picks**: PavingStones (cobblestone variety is stunning), WoodFloor (for inn/shop interiors), ThatchedRoof + Wicker (for roof textures).

### Biome 2: Grassland/Farmland (Heartfield, Sunridge)

| Tile Category | AmbientCG Source | Count | Path Pattern |
|---------------|------------------|-------|-------------|
| Grass base (GRA-GR-01..03) | Grass001-008 | **8** | `MATERIAL/1K-JPG/Grass*/` |
| Wheat/crop field (GRA-GR-04..06) | Ground001-101 (dry earth variants) | **~40** | `MATERIAL/1K-JPG/Ground*/` |
| Dirt roads (GRA-PA-01..05) | Ground001-101 (packed earth) | **~30** | `MATERIAL/1K-JPG/Ground*/` |
| Hill terrain | Terrain001-005 Color maps | **5** | `TERRAIN/Terrain*/2K-JPG/*_Color.jpg` |
| Farmstead walls | WoodSiding001-013 | **13** | `MATERIAL/1K-JPG/WoodSiding*/` |
| Boulders | Rock001-062 | **65** | `MATERIAL/1K-JPG/Rock*/` |

**Best picks**: Grass textures + Ground textures for field/earth contrast, Terrain Color maps for overhead variety.

### Biome 3: Forest (Ambergrove, Flickerveil, Half-Drawn Forest)

| Tile Category | AmbientCG Source | Count | Path Pattern |
|---------------|------------------|-------|-------------|
| Forest floor (FOR-GR-01..03) | Ground (leaf-covered variants), ScatteredLeaves001-008 | **~25** | `MATERIAL/1K-JPG/Ground*/, ScatteredLeaves*/` |
| Moss (FOR-GR-05, FOR-DE-01) | Moss001-004 | **4** | `MATERIAL/1K-JPG/Moss*/` |
| Fallen leaves (FOR-GR-06) | ScatteredLeaves001-008, Leaf001-003 | **11** | `MATERIAL/1K-JPG/ScatteredLeaves*/, Leaf*/` |
| Tree bark (FOR-OB-01..03) | Bark001-015 | **15** | `MATERIAL/1K-JPG/Bark*/` |
| Tree root surface (FOR-GR-07) | TreeEnd001-005 | **5** | `MATERIAL/1K-JPG/TreeEnd*/` |
| Rock outcrop (FOR-OB-07) | Rock001-062 | **65** | `MATERIAL/1K-JPG/Rock*/` |
| Leaf overlays (decoration) | ATLAS: LeafSet001-029, Foliage001-008 | **37** | `ATLAS/1K-JPG/LeafSet*/, Foliage*/` |

**Best picks**: ScatteredLeaves (gorgeous autumn floor textures), Bark (tree trunk variety), Moss (forest floor accent), ATLAS LeafSets for overlay scattering.

### Biome 4: Mountain/Highland (Hollow Ridge, Undrawn Peaks)

| Tile Category | AmbientCG Source | Count | Path Pattern |
|---------------|------------------|-------|-------------|
| Rock face (MTN-GR-01..02) | Rock001-062 | **65** | `MATERIAL/1K-JPG/Rock*/` |
| Gravel/scree (MTN-GR-04) | Gravel001-042 | **43** | `MATERIAL/1K-JPG/Gravel*/` |
| Snow/ice (MTN-GR-05) | Snow001-012, Ice001-004 | **24** | `MATERIAL/1K-JPG/Snow*/, Ice*/` |
| Alpine grass (MTN-GR-03) | Grass001-008 | **8** | `MATERIAL/1K-JPG/Grass*/` |
| Cave interior (MTN-GR-07) | Granite001-007, Onyx001-015 | **29** | `MATERIAL/1K-JPG/Granite*/, Onyx*/` |
| Crystal outcrop (MTN-DE-07) | Ice001-004, Marble001-026 | **30** | `MATERIAL/1K-JPG/Ice*/, Marble*/` |

**Best picks**: Rock (massive variety, 65 textures), Gravel (path/scree variety), Snow (ice crystals + shadows). Granite/Onyx for cave interiors.

### Biome 5: Riverside/Water (Millbrook)

| Tile Category | AmbientCG Source | Count | Path Pattern |
|---------------|------------------|-------|-------------|
| Riverbank earth (RIV-GR-01..02) | Ground001-101 (sandy/muddy variants) | **~20** | `MATERIAL/1K-JPG/Ground*/` |
| Cobblestone town (RIV-GR-06) | PavingStones001-154 | **154** | `MATERIAL/1K-JPG/PavingStones*/` |
| Stone bridge/quay (RIV-PA-03, RIV-OB-03) | Concrete001-048, Bricks001-103 | **~80** | `MATERIAL/1K-JPG/Concrete*/, Bricks*/` |
| Dock planks (RIV-PA-05) | Planks001-039, Wood001-094 | **~100** | `MATERIAL/1K-JPG/Planks*/, Wood*/` |
| Town buildings (RIV-OB-01..02) | Facade001-020, RoofingTiles001-015 | **~46** | `MATERIAL/1K-JPG/Facade*/, RoofingTiles*/` |

**Best picks**: PavingStones (town cobblestone), Planks (dock/bridge wood), Facade (building variety).

### Biome 6: Wetland/Marsh (Shimmer Marsh)

| Tile Category | AmbientCG Source | Count | Path Pattern |
|---------------|------------------|-------|-------------|
| Marsh ground (WET-GR-01..02) | Ground001-101 (muddy/wet variants) | **~30** | `MATERIAL/1K-JPG/Ground*/` |
| Moss carpet (WET-GR-05) | Moss001-004 | **4** | `MATERIAL/1K-JPG/Moss*/` |
| Peat/bog (WET-GR-06) | Ground (dark soil variants), Clay001-004 | **~10** | `MATERIAL/1K-JPG/Ground*/, Clay*/` |
| Boardwalk (WET-PA-01..03) | Planks001-039 | **59** | `MATERIAL/1K-JPG/Planks*/` |
| Mangrove bark (WET-OB-01) | Bark001-015 | **15** | `MATERIAL/1K-JPG/Bark*/` |
| Ruins (WET-DE-07, WET-OB-04) | Concrete001-048, Bricks (weathered) | **~50** | `MATERIAL/1K-JPG/Concrete*/, Bricks*/` |

**Best picks**: Ground (wet/muddy variants), Moss, Bark (mangrove root textures).

### Biome 7: Plains (Resonance Fields)

| Tile Category | AmbientCG Source | Count | Path Pattern |
|---------------|------------------|-------|-------------|
| Open grass (PLN-GR-01..03) | Grass001-008 | **8** | `MATERIAL/1K-JPG/Grass*/` |
| Bare earth (PLN-GR-04) | Ground (windswept variants) | **~15** | `MATERIAL/1K-JPG/Ground*/` |
| Stone platform (PLN-GR-05) | PavingStones, Marble | **~30** | `MATERIAL/1K-JPG/PavingStones*/, Marble*/` |
| Rock formation (PLN-OB-02) | Rock001-062, Rocks001-025 | **91** | `MATERIAL/1K-JPG/Rock*/, Rocks*/` |

**Best picks**: Grass + Ground for base, Rock for standing stone textures.

### Biome 8: Dungeon/Underground (Depths 1-5, Preserver Fortress)

| Tile Category | AmbientCG Source | Count | Path Pattern |
|---------------|------------------|-------|-------------|
| Stone floor (DUN-GR-01..03) | Tiles001-138, PavingStones | **~300** | `MATERIAL/1K-JPG/Tiles*/, PavingStones*/` |
| Cave floor (DUN-GR-05) | Rock001-062 | **65** | `MATERIAL/1K-JPG/Rock*/` |
| Stone walls (DUN-OB-01..02) | Bricks001-103, Concrete001-048 | **~160** | `MATERIAL/1K-JPG/Bricks*/, Concrete*/` |
| Iron doors/gates (DUN-OB-05..06) | Metal001-062, MetalPlates001-017 | **~120** | `MATERIAL/1K-JPG/Metal*/, MetalPlates*/` |
| Ornate floors (Fortress) | Marble001-026, Terrazzo001-019, Travertine001-014 | **~60** | `MATERIAL/1K-JPG/Marble*/, Terrazzo*/, Travertine*/` |
| Chains/metalwork (DUN-DE-09) | Chainmail001-004, Metal | **~10** | `MATERIAL/1K-JPG/Chainmail*/, Metal*/` |
| Rust/aged metal (dungeon props) | Rust001-010 | **10** | `MATERIAL/1K-JPG/Rust*/` |

**Best picks**: Tiles (ceramic floor variety is enormous — 158 textures), Bricks (wall variety), Metal (door/gate textures), Marble+Terrazzo (Preserver Fortress elegance).

### Biome 9: Sketch (Luminous Wastes, Undrawn Peaks, Half-Drawn Forest)

The Sketch biome uses a unique line-art aesthetic that does not map directly to photorealistic textures. However:

- **Paper001-006** could provide the luminous parchment background base
- **Cork001-004** could provide the warm cream base texture
- These would be heavily posterized to 2-3 colors for the sketch line-work base

### Stagnation/Crystal Overlay

| Tile Category | AmbientCG Source | Count | Path Pattern |
|---------------|------------------|-------|-------------|
| Crystal surface | Ice001-004, Marble (white variants) | **~15** | `MATERIAL/1K-JPG/Ice*/, Marble*/` |
| Frozen water | Ice001-004 | **4** | `MATERIAL/1K-JPG/Ice*/` |

---

## Procedural Generation Potential

### Texture-to-Tile Multiplication

The AmbientCG library's value is in **variety multiplication**. Each source texture, when processed through the pipeline, produces multiple visually distinct tiles.

**Base calculation**:

| Factor | Count | Notes |
|--------|-------|-------|
| Relevant AmbientCG textures | ~750 | Ground, Rock, Grass, Gravel, Snow, Moss, Lava, Ice, Bark, Bricks, PavingStones, Planks, Wood, Tiles, Marble, Metal, Facade, etc. |
| Crop variations per texture | x4 | Each 1024x1024 can yield 4+ distinct 256x256 crops |
| Vibrancy tiers | x3 | Muted, Normal, Vivid — different posterization palettes |
| **Theoretical unique tiles** | **~9,000** | Before deduplication and quality filtering |

**Realistic estimate after quality filtering**: ~2,000-3,000 usable tile bases.

**Versus production need**: The tileset spec requires 1,530 biome tiles + 2,115 transition tiles + 10 stagnation overlay tiles = **3,655 total tiles**. The AmbientCG library can supply base textures for roughly 80% of those, with GenAI adding detail objects, decorations, and animated frames.

### By-Biome Breakdown

| Biome | Tile Types (per tier) | Relevant Textures | Crops x3 Tiers | Coverage |
|-------|----------------------|-------------------|----------------|----------|
| Village | 52 | ~400 (PavingStones, Bricks, WoodFloor, Facade, ThatchedRoof) | >>156 | Excellent |
| Grassland | 58 | ~100 (Grass, Ground, WoodSiding, Rock) | >>174 | Excellent |
| Forest | 64 | ~160 (Ground, ScatteredLeaves, Bark, Moss, Rock, LeafSets) | >>192 | Excellent |
| Mountain | 56 | ~170 (Rock, Gravel, Snow, Ice, Granite) | >>168 | Excellent |
| Riverside | 60 | ~400 (PavingStones, Planks, Facade, Ground, Bricks) | >>180 | Excellent |
| Wetland | 56 | ~120 (Ground, Moss, Planks, Bark, Concrete) | >>168 | Good |
| Plains | 48 | ~150 (Grass, Ground, Rock, PavingStones) | >>144 | Good |
| Dungeon | 60 | ~750 (Tiles, Bricks, Metal, Marble, Rock, Concrete) | >>180 | Excellent |
| Sketch | 56 | ~10 (Paper, Cork — most is hand-drawn) | <<168 | Low (by design) |

### HDRI Parallax Background Potential

RPG-JS uses PixiJS which supports parallax scrolling background layers. The 382 HDRI tonemapped JPGs at 1024x512 could serve as:

| Use Case | HDRI Category | Count | Processing |
|----------|--------------|-------|------------|
| Daytime outdoor sky | DaySkyHDRI | 122 | Crop to horizontal strip, posterize to tier palette |
| Evening/sunset mood | EveningSkyHDRI | 82 | Warmer posterization, amber tones |
| Dawn transitions | MorningSkyHDRI | 18 | Soft pink/gold posterization |
| Night/dungeon entrance | NightSkyHDRI | 17 | Dark blue posterization, star dots |
| Environmental backdrop | DayEnvironmentHDRI | 101 | Landscape+sky combos for zone transitions |

**Pipeline**: HDRI 1024x512 --> crop horizontal strip (1024x128) --> downscale to 512x64 --> posterize to 8-color tier palette --> tile horizontally for infinite scroll.

**Realistic output**: 17 unique sky variants (one per zone) x 3 tiers = 51 parallax background strips, drawn from 382 HDRIs.

### Panoramic Backdrops (PLAIN)

The 9 Backdrop images at 8192px wide are particularly valuable for parallax. Processing:

```
Backdrop 8192xN --> crop to 8192x256 strip at horizon line
  --> downscale to 1024x32 (or 2048x64)
  --> posterize to biome palette
  --> use as deep-background parallax layer behind HDRI sky
```

These panoramic backdrops would give distant mountain/forest/plain horizons visible behind the tile layer — a visual effect seen in SNES-era games like Chrono Trigger and Secret of Mana.

---

## Style Compatibility Assessment

### Direct 16-bit JRPG Match
The following assets match the target aesthetic with minimal or no processing:

1. **Kenney Roguelike series** (Base/Characters/City/Dungeon/Interior) — 16x16 tiles, clean pixel art, complete dungeon+town coverage. Already includes TMX sample maps compatible with Tiled.

2. **Kenney Tiny series** (Dungeon/Town/Battle) — 16x16 tiles, simplified but charming pixel art. Could serve as a lighter visual tier or placeholder set.

3. **Kenney Monochrome RPG Tileset** — 16x16, full RPG tileset in monochrome. Strong candidate for the vibrancy system: tint monochrome tiles with zone-specific palettes for low-vibrancy areas.

4. **Kenney RTS Medieval (Pixel)** — 16x16 medieval buildings and terrain. Supplements the Roguelike packs with additional building types.

5. **Kenney 1-Bit Pack** — 16x16 with colored variants. Fantasy, interior, platformer, and urban sample maps included.

### Near Match (minor processing needed)
6. **Kenney RPG Audio + Music Loops** — Ready to use, OGG format. "Retro Mystic", "Retro Comedy", "Sad Town" are strong BGM candidates.

7. **Kenney Fantasy UI Borders** — 48x48 panel borders, slightly large but can be CSS-scaled or used as 9-slice sources for Vue dialogue components.

8. **Kenney UI Pack - Pixel Adventure** — Pixel-art UI elements that pair with the tile aesthetic.

9. **Kenney Pixel fonts** — Drop-in replacement for any system font currently used.

### High-Value Pipeline Input (automated processing)
10. **AmbientCG materials (~750 relevant)** — Color maps downsampled + posterized to create tile base textures. Covers ~80% of tile production needs across all 9 biomes and 3 vibrancy tiers. The key insight: photorealistic textures downscaled to 32x32 with palette restriction produce organic, high-quality pixel-art bases that pure GenAI struggles to match for ground/wall/floor tiles.

11. **AmbientCG HDRIs (382 sky images)** — Tonemapped JPGs at 1024x512, processable into parallax scrolling sky backgrounds. 17 zones x 3 tiers = 51 unique sky strips from 382 source images.

12. **AmbientCG Backdrops (9 panoramics)** — 8K-wide panoramic landscape strips for deep-layer parallax behind the sky layer. Gives distant horizon detail (mountains, forests) reminiscent of SNES-era parallax backgrounds.

13. **AmbientCG ATLAS LeafSets + Foliage (37 atlases)** — Individual leaf/plant sprites on transparent backgrounds. Scatter-overlay on forest/marsh tiles for decoration variety without custom GenAI work.

14. **AmbientCG TERRAIN Color maps (5 overhead views)** — 2048x2048 aerial terrain photographs. Can be sliced into many 256x256 crops and downsampled for grassland/mountain ground variety.

### Style Reference Only
15. **PSX textures** — Reference for worn/gritty environmental textures.
16. **Clement Panchout music** — Style reference for original composition (license unclear).

### Not Usable
- All 3D assets (KayKit, Quaternius, alien packs, spaceship packs, mushroom_hunting)
- AmbientCG normal/roughness/displacement/AO maps (PBR-specific, not needed)
- AmbientCG .blend/.mtlx/.usdc scene files (3D scene data)
- Kenney 3D assets, isometric packs (wrong perspective for top-down RPG-JS)
- Kenney vector packs at 64x64 (wrong resolution, though could be downsampled)

---

## Integration Recommendations

### Priority 1 — Immediate Wins (drop-in)

| Asset | Integration Target | Pipeline Stage | Notes |
|-------|-------------------|----------------|-------|
| Kenney Roguelike Base + Characters + City + Dungeon + Interior | `main/server/maps/tmx/` tilesets | Map authoring | 16x16 tiles match RPG-JS tile size. Copy spritesheets, reference in Tiled TMX files. |
| Kenney RPG Audio (51 SFX) | `main/client/audio/sfx/` | Audio integration | OGG files, ready to use. Footsteps, doors, swords, coins. |
| Kenney Retro Sounds 1+2 (99 SFX) | `main/client/audio/sfx/` | Audio integration | 8-bit/16-bit style effects for combat, UI, events. |
| Kenney Music Loops - Retro (5 tracks) | `main/client/audio/bgm/` | Audio integration | "Retro Mystic" for dungeons, "Retro Comedy" for towns. |
| Kenney Pixel.ttf | `main/client/` font directory | UI theming | Replace system font for authentic 16-bit look. |

### Priority 2 — Quick Integration (light processing)

| Asset | Integration Target | Pipeline Stage | Notes |
|-------|-------------------|----------------|-------|
| Kenney Fantasy UI Borders | Vue GUI components | UI architecture | 9-slice the 48x48 border PNGs for dialogue boxes, menus, inventory. |
| Kenney UI Pack - Pixel Adventure | Vue GUI components | UI architecture | Health bars, buttons, panels in pixel art. |
| Kenney Game Icons (951 total) | Item/skill icon system | Database integration | 50x50 icons — downsample to 16x16 or 32x32 for inventory/skill UI. |
| Kenney Music Loops (19 modern) | Background music | Audio integration | "Sad Town", "Game Over", "Farm Frolics" as BGM candidates. |
| Kenney Music Jingles (85 cues) | Event system | Audio integration | Victory, discovery, level-up, quest-complete jingles. |
| Kenney Interface Sounds + UI Audio (151 SFX) | Menu system | Audio integration | Click, hover, confirm, cancel for all GUI interactions. |

### Priority 3 — AmbientCG Tile Base Pipeline (HIGH VALUE, batch processing)

| Asset | Use | Pipeline Stage | Notes |
|-------|-----|----------------|-------|
| AmbientCG Ground/Grass/Rock/Snow/Moss/Gravel (~300 textures) | Base tile textures for all outdoor biomes | Tile generation | 1024x1024 Color.jpg --> crop --> 32x32 nearest-neighbor --> posterize to tier palette. Covers Village, Grassland, Forest, Mountain, Wetland, Plains ground tiles. |
| AmbientCG PavingStones/Bricks/Tiles/Concrete (~480 textures) | Base tile textures for built environments | Tile generation | Cobblestone paths, dungeon floors, town streets, walls. The 154 PavingStones alone provide more cobblestone variety than we could ever need. |
| AmbientCG Wood/WoodFloor/Planks/Bark (~245 textures) | Base textures for wooden structures | Tile generation | Interior floors, bridges, docks, boardwalks, tree trunks, fences. |
| AmbientCG Metal/Marble/Granite (~200 textures) | Dungeon/Fortress textures | Tile generation | Metal doors/gates, ornate dungeon floors, Preserver Fortress crystal-marble. |
| AmbientCG HDRIs (382 sky images) | Parallax scrolling sky backgrounds | Background layer | Tonemapped JPGs --> crop horizontal strip --> posterize to tier palette --> one per zone per tier. |
| AmbientCG Backdrops (9 panoramics) | Deep parallax horizon layer | Background layer | 8K panoramics --> crop/downscale --> posterize. SNES-style distant mountains/forests. |
| AmbientCG LeafSet + Foliage (37 ATLAS images) | Scatter-overlay decorations | Forest/marsh decoration | Individual leaf sprites on transparent BG. Randomly placed on forest floor tiles for variety. |
| AmbientCG TERRAIN Color maps (5 sets) | Overhead terrain base textures | Tile generation | 2048x2048 aerial views --> grid-slice into 256x256 crops --> downsample for grassland/mountain variety. |
| AmbientCG Ice (4 textures) | Stagnation/crystal overlay base | Overlay generation | Frozen water, crystal surfaces for Preserver zones. |
| AmbientCG Lava (5 textures) | Fury-themed area textures | Special tiles | Includes Emission maps for glow effects in volcanic/fury areas. |

### Priority 4 — Creative Pipeline Input

| Asset | Use | Pipeline Stage | Notes |
|-------|-----|----------------|-------|
| Kenney Monochrome RPG Tileset | Vibrancy system low-tier tiles | Post-processing | Tint monochrome tiles with zone palettes for "fading" areas. |
| Kenney Tiny Dungeon/Town | Prototype/placeholder tiles | Development | Quick map iteration before final art. |

### Not Recommended

- AmbientCG normal/roughness/displacement maps (PBR-specific, not needed for 2D)
- AmbientCG .blend/.mtlx scene files (3D scene data)
- Clement Panchout music (license unclear, WAV format needs conversion)
- Any 3D assets (wrong dimension for 2D RPG-JS)
- PSX textures (wrong aesthetic, would need heavy processing)

---

## Specific File Paths for Immediate Integration

### Tilesets (copy to project)
```
/Volumes/home/assets/Kenney Game Assets All-in-1 3.0.0/2D assets/Roguelike Base Pack/Spritesheet/roguelikeSheet_transparent.png
/Volumes/home/assets/Kenney Game Assets All-in-1 3.0.0/2D assets/Roguelike Base Pack/Map/sample_map.tmx
/Volumes/home/assets/Kenney Game Assets All-in-1 3.0.0/2D assets/Roguelike City Pack/Tiles/
/Volumes/home/assets/Kenney Game Assets All-in-1 3.0.0/2D assets/Roguelike Dungeon Pack/
/Volumes/home/assets/Kenney Game Assets All-in-1 3.0.0/2D assets/Roguelike Interior Pack/
/Volumes/home/assets/Kenney Game Assets All-in-1 3.0.0/2D assets/Roguelike Characters Pack/
/Volumes/home/assets/Kenney Game Assets All-in-1 3.0.0/2D assets/Tiny Dungeon/
/Volumes/home/assets/Kenney Game Assets All-in-1 3.0.0/2D assets/Tiny Town/
/Volumes/home/assets/Kenney Game Assets All-in-1 3.0.0/2D assets/Tiny Battle/
/Volumes/home/assets/Kenney Game Assets All-in-1 3.0.0/2D assets/Monochrome RPG Tileset/
/Volumes/home/assets/Kenney Game Assets All-in-1 3.0.0/2D assets/RTS Medieval (Pixel)/
```

### Audio (copy to project)
```
/Volumes/home/assets/Kenney Game Assets All-in-1 3.0.0/Audio/RPG Audio/Audio/
/Volumes/home/assets/Kenney Game Assets All-in-1 3.0.0/Audio/Retro Sounds 1/Audio/
/Volumes/home/assets/Kenney Game Assets All-in-1 3.0.0/Audio/Retro Sounds 2/Audio/
/Volumes/home/assets/Kenney Game Assets All-in-1 3.0.0/Audio/Music Loops/Loops/
/Volumes/home/assets/Kenney Game Assets All-in-1 3.0.0/Audio/Music Loops/Retro/
/Volumes/home/assets/Kenney Game Assets All-in-1 3.0.0/Audio/Music Jingles/
/Volumes/home/assets/Kenney Game Assets All-in-1 3.0.0/Audio/Interface Sounds/
/Volumes/home/assets/Kenney Game Assets All-in-1 3.0.0/Audio/UI Audio/
```

### UI (copy to project)
```
/Volumes/home/assets/Kenney Game Assets All-in-1 3.0.0/UI assets/Fantasy UI Borders/PNG/
/Volumes/home/assets/Kenney Game Assets All-in-1 3.0.0/UI assets/UI Pack - Pixel Adventure/
```

### Fonts (copy to project)
```
/Volumes/home/assets/Kenney Game Assets All-in-1 3.0.0/Other/Fonts/Kenney Pixel.ttf
/Volumes/home/assets/Kenney Game Assets All-in-1 3.0.0/Other/Fonts/Kenney Pixel Square.ttf
/Volumes/home/assets/Kenney Game Assets All-in-1 3.0.0/Other/Fonts/Kenney Mini.ttf
/Volumes/home/assets/Kenney Game Assets All-in-1 3.0.0/Other/Fonts/Kenney Mini Square.ttf
```

### Icons (copy to project)
```
/Volumes/home/assets/Kenney Game Assets All-in-1 3.0.0/Icons/Game Icons/
/Volumes/home/assets/Kenney Game Assets All-in-1 3.0.0/Icons/Game Icons Expansion/
/Volumes/home/assets/Kenney Game Assets All-in-1 3.0.0/Icons/Game Icons Fighter Expansion/
```

### AmbientCG Tile Base Textures (process via pipeline)

Only the `_Color.jpg` files are needed. Glob pattern:

```bash
# All material color maps (~1,225 relevant Color.jpg files from ~750 materials)
/Volumes/home/assets/AmbientCG/Assets/MATERIAL/1K-JPG/Ground*/*_Color.jpg     # 117 ground textures
/Volumes/home/assets/AmbientCG/Assets/MATERIAL/1K-JPG/Rock*/*_Color.jpg       # 65 rock textures
/Volumes/home/assets/AmbientCG/Assets/MATERIAL/1K-JPG/Rocks*/*_Color.jpg      # 26 scattered rocks
/Volumes/home/assets/AmbientCG/Assets/MATERIAL/1K-JPG/Gravel*/*_Color.jpg     # 43 gravel textures
/Volumes/home/assets/AmbientCG/Assets/MATERIAL/1K-JPG/Grass*/*_Color.jpg      # 8 grass textures
/Volumes/home/assets/AmbientCG/Assets/MATERIAL/1K-JPG/Snow*/*_Color.jpg       # 20 snow textures
/Volumes/home/assets/AmbientCG/Assets/MATERIAL/1K-JPG/Moss*/*_Color.jpg       # 4 moss textures
/Volumes/home/assets/AmbientCG/Assets/MATERIAL/1K-JPG/Lava*/*_Color.jpg       # 5 lava textures
/Volumes/home/assets/AmbientCG/Assets/MATERIAL/1K-JPG/Ice*/*_Color.jpg        # 4 ice textures
/Volumes/home/assets/AmbientCG/Assets/MATERIAL/1K-JPG/Leaf*/*_Color.jpg       # 3 leaf textures
/Volumes/home/assets/AmbientCG/Assets/MATERIAL/1K-JPG/ScatteredLeaves*/*_Color.jpg  # 8 fallen leaves
/Volumes/home/assets/AmbientCG/Assets/MATERIAL/1K-JPG/Wood*/*_Color.jpg       # 100 wood textures
/Volumes/home/assets/AmbientCG/Assets/MATERIAL/1K-JPG/WoodFloor*/*_Color.jpg  # 70 floor textures
/Volumes/home/assets/AmbientCG/Assets/MATERIAL/1K-JPG/Planks*/*_Color.jpg     # 59 plank textures
/Volumes/home/assets/AmbientCG/Assets/MATERIAL/1K-JPG/Bark*/*_Color.jpg       # 15 bark textures
/Volumes/home/assets/AmbientCG/Assets/MATERIAL/1K-JPG/WoodSiding*/*_Color.jpg # 13 siding textures
/Volumes/home/assets/AmbientCG/Assets/MATERIAL/1K-JPG/Bricks*/*_Color.jpg     # 114 brick textures
/Volumes/home/assets/AmbientCG/Assets/MATERIAL/1K-JPG/PavingStones*/*_Color.jpg  # 154 cobblestone textures
/Volumes/home/assets/AmbientCG/Assets/MATERIAL/1K-JPG/Tiles*/*_Color.jpg      # 158 ceramic tile textures
/Volumes/home/assets/AmbientCG/Assets/MATERIAL/1K-JPG/Marble*/*_Color.jpg     # 26 marble textures
/Volumes/home/assets/AmbientCG/Assets/MATERIAL/1K-JPG/Concrete*/*_Color.jpg   # 61 concrete textures
/Volumes/home/assets/AmbientCG/Assets/MATERIAL/1K-JPG/Metal*/*_Color.jpg      # 120 metal textures
/Volumes/home/assets/AmbientCG/Assets/MATERIAL/1K-JPG/RoofingTiles*/*_Color.jpg  # 27 roofing textures
/Volumes/home/assets/AmbientCG/Assets/MATERIAL/1K-JPG/Facade*/*_Color.jpg     # 26 facade textures
/Volumes/home/assets/AmbientCG/Assets/MATERIAL/1K-JPG/Fence*/*_Color.jpg      # 12 fence textures
/Volumes/home/assets/AmbientCG/Assets/MATERIAL/1K-JPG/ThatchedRoof*/*_Color.jpg  # 4 thatch textures
/Volumes/home/assets/AmbientCG/Assets/MATERIAL/1K-JPG/Fabric*/*_Color.jpg     # 86 fabric textures
/Volumes/home/assets/AmbientCG/Assets/MATERIAL/1K-JPG/Leather*/*_Color.jpg    # 50 leather textures
/Volumes/home/assets/AmbientCG/Assets/MATERIAL/1K-JPG/Rust*/*_Color.jpg       # 10 rust textures
/Volumes/home/assets/AmbientCG/Assets/MATERIAL/1K-JPG/Chainmail*/*_Color.jpg  # 4 chainmail textures
/Volumes/home/assets/AmbientCG/Assets/MATERIAL/1K-JPG/Granite*/*_Color.jpg    # 14 granite textures
/Volumes/home/assets/AmbientCG/Assets/MATERIAL/1K-JPG/Onyx*/*_Color.jpg       # 15 onyx textures
/Volumes/home/assets/AmbientCG/Assets/MATERIAL/1K-JPG/Terrazzo*/*_Color.jpg   # 21 terrazzo textures
/Volumes/home/assets/AmbientCG/Assets/MATERIAL/1K-JPG/Travertine*/*_Color.jpg # 14 travertine textures
```

```bash
# HDRI sky backgrounds (tonemapped JPGs, ready for parallax processing)
/Volumes/home/assets/AmbientCG/Assets/HDRI/1K/DaySkyHDRI*/*_TONEMAPPED.jpg       # 122 day skies
/Volumes/home/assets/AmbientCG/Assets/HDRI/1K/EveningSkyHDRI*/*_TONEMAPPED.jpg    # 82 evening skies
/Volumes/home/assets/AmbientCG/Assets/HDRI/1K/MorningSkyHDRI*/*_TONEMAPPED.jpg    # 18 morning skies
/Volumes/home/assets/AmbientCG/Assets/HDRI/1K/NightSkyHDRI*/*_TONEMAPPED.jpg      # 17 night skies
/Volumes/home/assets/AmbientCG/Assets/HDRI/1K/DayEnvironmentHDRI*/*_TONEMAPPED.jpg  # 101 day environments
/Volumes/home/assets/AmbientCG/Assets/HDRI/1K/EveningEnvironmentHDRI*/*_TONEMAPPED.jpg  # 6 evening environments
```

```bash
# Panoramic backdrops (8K wide, for deep parallax horizon layers)
/Volumes/home/assets/AmbientCG/Assets/PLAIN/Backdrop*/8K-JPG/*_Color.jpg  # 9 panoramics
```

```bash
# Terrain overhead color maps (2K, for grassland/mountain ground tiles)
/Volumes/home/assets/AmbientCG/Assets/TERRAIN/Terrain*/2K-JPG/*_Color.jpg  # 5 terrain overheads
```

```bash
# Foliage sprite atlases (for scatter-overlay decorations)
/Volumes/home/assets/AmbientCG/Assets/ATLAS/1K-JPG/LeafSet*/   # 29 leaf sprite atlases
/Volumes/home/assets/AmbientCG/Assets/ATLAS/1K-JPG/Foliage*/   # 8 foliage cluster atlases
```

---

## Summary Statistics

### Direct Integration (copy and use)

| Category | Usable Assets | Files | Size |
|----------|--------------|-------|------|
| 2D Tilesets (16x16 pixel) | 11 packs | ~3,400 tiles | ~5 MB |
| Audio SFX | 4 packs | 250 files | ~3 MB |
| Music (BGM + jingles) | 3 packs | 119 tracks | ~9 MB |
| UI Elements | 2 packs | ~794 files | ~1.8 MB |
| Icons | 3 packs | 951 files | ~2.6 MB |
| Fonts | 4 TTF files | 4 files | ~200 KB |
| **Total directly usable** | **23 packs** | **~5,518 files** | **~22 MB** |

### AmbientCG Pipeline (process to create tile bases)

| Category | Source Textures | Output Tiles (est.) | Biomes Covered |
|----------|----------------|---------------------|----------------|
| Ground/earth base textures | ~300 Color.jpg | ~1,200 tile bases | All outdoor |
| Built environment textures | ~480 Color.jpg | ~1,400 tile bases | Village, Dungeon, Riverside |
| Wood/organic textures | ~245 Color.jpg | ~700 tile bases | All biomes with structures |
| Metal/stone/ornate textures | ~200 Color.jpg | ~500 tile bases | Dungeon, Fortress |
| HDRI sky backgrounds | 382 TONEMAPPED.jpg | ~51 parallax strips | All 17 zones |
| Panoramic horizons | 9 Backdrop Color.jpg | ~9 horizon strips | Outdoor zones |
| Foliage overlays | 37 ATLAS images | ~100 scatter sprites | Forest, Marsh |
| Terrain overhead views | 5 Terrain Color.jpg | ~80 tile bases | Grassland, Mountain |
| **Pipeline total** | **~1,658 source files** | **~4,040 output assets** | **All 9 biomes** |

### Production Coverage

| Metric | Value |
|--------|-------|
| Total tiles needed (tileset-spec.md) | 3,655 |
| AmbientCG can provide bases for | ~2,500-3,000 (~75-80%) |
| GenAI still needed for | Decorations, animated frames, Sketch biome, character-scale objects |
| Parallax backgrounds (new capability) | 51 sky strips + 9 horizon strips = 60 background assets |
| Total unique visual assets from pipeline | ~4,100 |

The AmbientCG library transforms from "wrong aesthetic, skip" to "primary tile base texture source" once the downsampling + posterization pipeline is in place. The photorealistic textures, when reduced to 32x32 pixels with palette restriction, produce naturally organic ground patterns that are difficult to achieve with pure GenAI — especially for ground, stone, wood, and brick surfaces where real-world texture variety is visible even at low resolution.
