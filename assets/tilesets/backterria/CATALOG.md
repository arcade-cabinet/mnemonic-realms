# Backterria CC0 Asset Catalog — Mnemonic Realms

> Complete inventory of purchased Backterria CC0 assets.
> All assets are licensed CC0 — no attribution required.
> This catalog is the source of truth for the tileset/TMX rework pipeline.

---

## Quick Reference

| Pack | File | Dimensions | Tile Size | Tile Grid | Tile Count | Game Use |
|------|------|-----------|-----------|-----------|------------|----------|
| Overworld | `The Overworld 1-3.png` | 464x256 | 16px | 29x16 | ~464 | Primary surface terrain |
| Natural Tileset | `natural/Tiles/The Natural 1-4 Tileset.png` | 352x416 | 16px | 22x26 | ~572 | Terrain: water, rivers, paths, stone |
| Natural Props | `natural/Props/` | Individual PNGs | 32px / 64px | n/a | 101 pieces | Objects: trees, bushes, flowers, fences, crops |
| Natural Icons | `natural/Icons/` | Individual PNGs | 32px | n/a | 14 pieces | Item icons: farming tools + crops |
| Plants | `The Plants 1-1.png` | 320x608 | 16px | 20x38 | ~760 | Decorative vegetation, potted plants |
| Interiors | `The Interiors 1-5 Alpha.png` | 640x945 | 16px | 40x59 | ~2360 | Indoor maps: dungeons, shops, inns |
| Signs 16 | `The Signs 16 v1-0 Alpha.png` | 160x160 | 16px | 10x10 | 100 | Road signs, warning signs |
| Signs 32 | `The Signs 32 v1-1 Alpha.png` | 320x320 | **32px** | 10x10 | 100 | Same signs at 32px — **already game-ready** |
| Items | `The Items v1-0 Alpha.png` | 176x192 | 16px | 11x12 | 132 | Item icons: tools, weapons, potions, keys |
| Symbols | `The Symbols v1-0 Alpha.png` | 160x160 | 16px | 10x10 | 100 | UI symbols: weather, cards, stars |
| Post-Apoc Tiles | `post-apocalyptic/Tiles/` | Various | 16px | Various | ~183 | Roads, pavement, buildings |
| Post-Apoc Props | `post-apocalyptic/Props/` | Individual PNGs | 16px | n/a | ~70 | Cars, fences, holes, signs, foliage |
| Post-Apoc Prefabs | `post-apocalyptic/Prefabs/` | Multi-tile PNGs | 16px base | n/a | 20 | Pre-assembled buildings and roads |
| Post-Apoc Icons | `post-apocalyptic/Icons/` | Individual PNGs | 16px | n/a | ~66 | Tools, resources, weapons, food, apparel |
| Post-Apoc Chars | `post-apocalyptic/Characters/` | 18x29 | n/a | n/a | 1 | Zombie character sprite |
| Isometric | `The Isometric 1-8 Alpha.png` | 432x512 | n/a | n/a | n/a | **NOT USED** — isometric perspective |

**Total usable assets: ~4,500+ tiles/sprites/icons**

---

## Tile Size Notes

**CRITICAL for upscale pipeline:**

| Category | Native Size | Needs Upscaling? | Target Size |
|----------|------------|-------------------|-------------|
| Tilesheets (Overworld, Natural, Plants, Interiors, Signs 16, Items, Symbols) | 16px tiles | YES — 2x nearest-neighbor | 32px tiles |
| Signs 32 | 32px tiles | NO — already 32px | 32px (use as-is) |
| Natural Props (32x32 PNGs) | 32px sprites | NO — already 1 tile at 32px | Use as-is |
| Natural Props (64x64 trees) | 64px sprites | NO — already 2x2 tiles at 32px | Use as-is |
| Natural Props (64x95 house/tower) | Multi-tile | NO — already at 32px scale | Use as-is |
| Post-Apoc individual props (16px) | 16px | YES — 2x nearest-neighbor | 32px |
| Post-Apoc prefabs (multi-tile) | 16px base | YES — 2x nearest-neighbor | 32px base |

**Key insight:** The Natural Props individual PNGs are already at 2x the tilesheet resolution. They are designed as object sprites that sit on top of the 16px tile grid — at our game's 32px tile size, they are exactly 1 tile (32x32) or 2x2 tiles (64x64) with no upscaling needed.

---

## Pack 1: The Overworld 1-3 (PRIMARY SURFACE TILESET)

**File:** `The Overworld 1-3.png` (464x256px, 16px tiles, 29x16 grid)

This is the single most important tileset for the game. It contains 4 seasonal/color meadow variants plus buildings, farmland, water, and characters.

### Meadow Terrain Variants (Rows 0-9, ~4 variant blocks)

Each variant provides a complete terrain set with grass, terrain edges, and trees:

| Variant | Approximate Grid Area | Color | Game Use |
|---------|----------------------|-------|----------|
| **Green Meadow** | Cols 0-6, Rows 0-9 | Bright green | Village Hub, Heartfield (spring/summer) |
| **Yellow Meadow** | Cols 7-13, Rows 0-5 | Yellow-green | Heartfield wheat fields, Resonance Fields |
| **Autumn Meadow** | Cols 14-20, Rows 0-9 | Orange/amber | Ambergrove forest floor, autumn areas |
| **Dead/Brown Meadow** | Cols 21-28, Rows 0-9 | Brown/grey | Stagnation zones, corrupted terrain |

Each variant includes:
- **Base grass tiles** (solid fill, 2-3 variations)
- **Terrain edge transitions** (grass-to-dirt, grass-to-void borders on all sides + corners)
- **Large multi-tile trees** (~3x4 tiles each, canopy + trunk)
- **Small ground details** (rocks, flowers, mushrooms)
- **Sheep/animal sprites** (decorative background objects)
- **Flower patches** (multi-color wildflower clusters)

### Water & Bridges (Bottom-left quadrant, ~Rows 10-12, Cols 0-8)

- **Water tiles** — deep water, shallow water, lily pads
- **Water edge transitions** — water-to-grass borders (all 4 sides + corners)
- **Bridge tiles** — wooden bridge (horizontal + vertical, 3-tile span)
- **Pond composition** — complete small pond template with edges

### Buildings (Bottom-center/right, ~Rows 10-15, Cols 15-28)

| Building Type | Grid Area | Description |
|---------------|-----------|-------------|
| **Church/Temple** | ~Cols 15-18, Rows 10-13 | Stone church with steeple, arched windows |
| **Castle/Fortress** | ~Cols 19-22, Rows 10-13 | Castle walls, turrets, gate |
| **Tower** | ~Col 23, Rows 10-13 | Stone watchtower |
| **Wooden houses** | Bottom rows | Small cottages, roofs, walls, doors |
| **Stone houses** | Bottom rows | Larger stone buildings with varied roofs |

### Farmland (Bottom-center, ~Rows 10-12, Cols 9-14)

- **Tilled soil** — 3 variants (dry, wet, rich)
- **Crop rows** — wheat/grain in growth stages
- **Fence borders** — wood fences around farm plots
- **Farmland path tiles** — dirt paths between fields

### Characters (Very bottom rows, ~Row 15)

- Small character sprites (4 directions each, standing/walking)
- Multiple character types visible (farmer, villager, guard, etc.)
- **16x16 sprite size** matches our character sprite convention

### Object Details (Scattered bottom area)

- Barrels, crates, signposts
- Market stalls, well structure
- Small decorative items (pots, baskets)

---

## Pack 2: The Natural v1-4

### Tileset Sheet

**File:** `natural/Tiles/The Natural 1-4 Tileset.png` (352x416px, 16px tiles, 22x26 grid)

Terrain tiles organized by surface type:

| Section | Approximate Rows | Content |
|---------|-----------------|---------|
| **Grass** | 0-2 | Grass base variants, grass details (tufts, flowers embedded), tall grass |
| **Water** | 3-7 | Deep water, shallow water, water-to-grass edge transitions (all directions), lily pads, ripples |
| **River** | 8-10 | Flowing water tiles, river bank edges, river bends, river-to-grass transitions |
| **Soil/Dirt** | 11-13 | Tilled soil, dry earth, dark loam, soil edge transitions |
| **Path** | 14-16 | Cobblestone path tiles, dirt path tiles, path intersections, T-junctions, corners |
| **Holes** | 17-18 | Ground holes, pits, crater edges |
| **Trench** | 19-20 | Trench/ditch tiles, trench edges |
| **Stone** | 21-23 | Stone floor tiles, cobblestone, stone wall top-down, stone edge transitions |
| **Path (dark)** | 24-25 | Dark stone path variant, path edges |

**Key value:** Complete water and river edge-transition system. 16-direction auto-tiling for water, river, path, and stone surfaces.

### Props — Individual PNG Sprites

**Directory:** `natural/Props/` (101 files)

All individual PNGs — can be used as object-layer sprites or composited into a tilesheet.

#### Vegetation (42 pieces)

| Type | Count | Sizes | Files |
|------|-------|-------|-------|
| **Bushes** | 10 | 32x32 | `Bush 01.png` through `Bush 10.png` |
| **Flowers** | 10 | 32x32 | `Flower 01.png` through `Flower 10.png` |
| **Plants** | 10 | 32x32 | `Plant 01.png` through `Plant 10.png` |
| **Trees (small)** | 4 | 32x32 | `Tree 01.png` through `Tree 04.png` |
| **Trees (large)** | 4 | 64x64 | `Tree 05.png` through `Tree 08.png` |
| **Wood Crate** | 1 | 32x32 | `Wood Crate.png` |

Bushes range from small round shrubs to larger flowering bushes. Trees 01-04 are saplings/small trees; Trees 05-08 are full-size canopy trees with visible trunks. Plants include ferns, cacti, tall grass clumps, leafy ground plants.

#### Fencing (20 pieces)

| Type | Count | Sizes | Files |
|------|-------|-------|-------|
| **Wood Fences** | 8 | 32x32 | `Wood Fence 01.png` through `Wood Fence 08.png` |
| **Wood Fence Doors** | 2 | 32x32 | `Wood Fence Door 1.png`, `Wood Fence Door 2.png` |
| **Stone Fences** | 8 | 32x32 | `Stone Fence 01.png` through `Stone Fence 08.png` |
| **Stone Fence Doors** | 2 | 32x32 | `Stone Fence Door 1.png`, `Stone Fence Door 2.png` |

Fence pieces include straight sections, corners, T-junctions, and end caps for building complete fence perimeters.

#### Structures (5 pieces)

| Type | Count | Sizes | Files |
|------|-------|-------|-------|
| **Houses** | 1 | 64x95 | `House 01.png` |
| **Towers** | 1 | 64x95 | `Tower 01.png` |
| **Wells** | 2 | 32x32 | `Well 01.png`, `Well 02.png` |
| **Seed Beds** | 3 | 32x32 | `Seed Bed 1.png` through `Seed Bed 3.png` |

#### Rocks (10 pieces)

All 32x32: `Rock 1.png` through `Rock 10.png`
Range from small pebbles to larger boulders, varied shapes and colors (grey, brown, mossy).

#### Crops — Growth Stages (25 pieces, 5 crops x 5 stages each)

| Crop | Files | Description |
|------|-------|-------------|
| **Carrot** | `Carrot Grow 1.png` through `Carrot Grow 5.png` | Seed → sprout → leafy → mature → harvestable |
| **Corn** | `Corn Grow 1.png` through `Corn Grow 5.png` | Seed → sprout → stalk → ears → tall corn |
| **Tomato** | `Tomato Grow 1.png` through `Tomato Grow 5.png` | Seed → vine → flowers → green → red |
| **Sunflower** | `Sunflower Grow 1.png` through `Sunflower Grow 5.png` | Seed → sprout → stalk → bud → bloom |
| **Cabbage** | `Cabbage Grow 1.png` through `Cabbage Grow 5.png` | Seed → leaves → head forming → mature → large |

All 32x32. Perfect for Heartfield farmland and any garden areas.

### Icons

**Directory:** `natural/Icons/` (14 files, all 32x32)

| Category | Items |
|----------|-------|
| **Tools** | Bucket, Hoe, Shovel, Watering Can |
| **Crop Icons** | Cabbage Icon, Carrot Icon, Corn Icon, Sunflower Icon, Tomato Icon |
| **Seed Bags** | Cabbage Bag, Carrot Bag, Corn Bag, Sunflower Bag, Tomato Bag |

### Reference Sheets

- `The Natural 1-4 Table A.png` (480x1193) — Visual catalog of all Natural pack contents, organized by category
- `The Natural 1-4 Props and Icons.png` (320x575) — Props and icons displayed together at native resolution

---

## Pack 3: The Plants 1-1

**File:** `The Plants 1-1.png` (320x608px, 16px tiles, 20x38 grid, ~760 tiles)

Massive vegetation library organized in sections:

| Section | Rows | Content |
|---------|------|---------|
| **Ground Plants** | 0-3 | Small grass tufts, ground cover, cacti, succulents, ferns — great for scatter decoration |
| **Small Flowers** | 4-5 | Individual flowers, seedlings, sprouts, mushrooms, clovers |
| **Potted Plants (clay pots)** | 6-11 | Round clay pots with various plants: cacti, ferns, flowering plants, succulents |
| **Potted Plants (baskets)** | 12-17 | Woven basket planters with similar variety |
| **Potted Plants (tall pots)** | 18-23 | Tall/decorative pots with larger plants |
| **Empty Pots** | 24-27 | Clay pots, baskets, and vases without plants |
| **Potted Plants (small)** | 28-37 | Additional small potted plant varieties, decorative arrangements |

**Game Use:**
- Ground plants → scatter on forest floors, garden areas, meadow decoration
- Potted plants → interior decoration (shops, inns, homes), village decoration
- Empty pots → breakable container props, shop inventory display
- Huge variety prevents repetitive interior decoration

---

## Pack 4: The Interiors 1-5 Alpha

**File:** `The Interiors 1-5 Alpha.png` (640x945px, 16px tiles, 40x~59 grid, ~2360 tiles)

Complete interior tileset with **8 themed room templates** plus individual tiles.

### Room Templates (Top Section)

| Template | Color | Game Use |
|----------|-------|----------|
| **Dark Blue/Purple Dungeon** | Cool blue-purple | Depths dungeon levels, mysterious caves |
| **Gold/Brown Tavern** | Warm amber/gold | Inn (Nyro's Bright Hearth), taverns |
| **Teal/Green Room** | Blue-green | Temple interiors, magical spaces |
| **Grey Stone Chamber** | Neutral grey | Castle rooms, Preserver fortress, generic stone |
| **Prison/Jail** | Dark with bars | Dungeon cells, Preserver outpost jail |
| **Blue Bathroom/Kitchen** | Bright blue tile | Shop interiors, bathrooms, kitchens |
| **White/Blueprint** | White outlines | Sketch zone interiors (monochrome areas) |
| **Green Garden Room** | Nature green | Greenhouse, garden interior, Verdance shrine |
| **Dark Stone Dungeon** | Dark grey stone | Deep dungeon, Fortress inner rooms |

Each room template includes:
- **Floor tiles** — base floors, decorative floor patterns, rugs/carpets
- **Wall tiles** — wall faces, wall tops, corners, T-junctions
- **Doors** — open, closed, arched, wooden, stone
- **Furniture** — tables, chairs, beds, shelves, cabinets
- **Decorations** — torches, paintings, curtains, banners, candles
- **Containers** — chests, barrels, crates, bookshelves
- **Stairs** — ascending/descending stair tiles

### Individual Furniture/Props (Scattered rows between templates)

- Beds (single, double, various colors)
- Tables (round, square, long dining)
- Chairs and stools
- Bookshelves (empty, full, varied)
- Chests (open, closed, locked)
- Barrels and crates
- Potions and bottles
- Rugs and carpets (multiple patterns)
- Torches and lanterns (wall-mounted, standing)
- Paintings and wall decorations
- Curtains and drapes
- Kitchen items (stove, counter, sink)

**Game Use:** This single sheet covers ALL indoor map needs:
- Village Hub interiors (shops, inn, houses)
- Dungeon rooms (Depths L1-L5)
- Fortress rooms (F1-F3)
- Temple/shrine interiors
- With the blueprint/white template: Sketch zone interiors

---

## Pack 5: Signs

### Signs 16
**File:** `The Signs 16 v1-0 Alpha.png` (160x160px, 16px tiles, 10x10 = 100 tiles)

### Signs 32 (GAME-READY — no upscaling needed)
**File:** `The Signs 32 v1-1 Alpha.png` (320x320px, **32px tiles**, 10x10 = 100 tiles)

Same signs at both resolutions. Contents:
- Speed limit signs (20, 30, 40, 50, 68)
- Stop, yield, no entry, one way
- Parking, handicap, construction
- Direction arrows (left, right, straight, merge)
- Warning signs (danger, pedestrian crossing, curves)
- WC/restroom signs (men, women)
- Exit sign, full/empty parking
- Various European-style road signs

**Game Use:** Repurpose as fantasy world signage (directional signs for map transitions, quest board signs, warning signs for dangerous areas). The Signs 32 sheet is already at game resolution.

---

## Pack 6: Items

**File:** `The Items v1-0 Alpha.png` (176x192px, 16px tiles, 11x12 = 132 tiles)

Organized by category (visible in image):

| Category | Items |
|----------|-------|
| **Kitchen** | Pots, pans, cups, mugs, pitchers, spoons, forks, knives, plates, bowls |
| **Garden Tools** | Pitchfork, rake, hoe, shovel, watering can, wheelbarrow |
| **Weapons** | Swords (3+), shields (2+), bow, arrows, axe, dagger, mace, spear |
| **Craft Tools** | Hammer, wrench, screwdriver, saw, pliers, scissors, paintbrush |
| **Musical** | Guitar/lute, drum, trumpet, harp |
| **Potions** | Bottles in various colors (red, blue, green, yellow, purple) |
| **Keys** | Multiple key styles and sizes |
| **Gems** | Colored gems (red, blue, green, yellow, purple) |
| **Scrolls/Books** | Scrolls, open books, closed books, letters, envelopes |
| **Misc** | Compass, magnifying glass, hourglass, mirror, crown, ring, coins, target, dice |

**Game Use:** Inventory system item icons, treasure chest contents display, shop item display, quest item indicators.

---

## Pack 7: Symbols

**File:** `The Symbols v1-0 Alpha.png` (160x160px, 16px tiles, 10x10 = 100 tiles)

- **UI elements:** Question mark (large), exclamation point
- **Weather:** Sun, moon, stars, clouds, rain cloud, snow
- **Recording:** REC indicator, play/pause symbols
- **Cards:** Hearts, diamonds, clubs, spades (filled and outline variants)
- **Stars:** 5-pointed stars in different sizes and fills
- **Arrows:** Directional arrows, pointers
- **Misc:** Speech bubble indicators, status icons

**Game Use:** NPC interaction indicators (? and ! above heads), weather effects, HUD elements, status indicators.

---

## Pack 8: The Post Apocalyptic v1-6

While designed for post-apocalyptic settings, many assets can be **creatively repurposed** for Mnemonic Realms:

### Tiles

| File | Dimensions | Grid | Content | Game Repurpose |
|------|-----------|------|---------|----------------|
| `Tiles/Road Tiles.png` | 176x48 | 11x3 | Asphalt roads, lane markings, crosswalks, intersections | Stagnation zone paths (cracked/corrupted) |
| `Tiles/Building Tiles.png` | 144x208 | 9x13 | Roofs (4 colors), brick walls, stone walls, damaged walls, doors, windows | Preserver fortress architecture |
| `Tiles/Pavement Tiles.png` | 176x48 | 11x3 | Sidewalk, curb, cracked pavement | Fortress courtyard tiles |

### Props

| Category | Count | Items | Game Repurpose |
|----------|-------|-------|----------------|
| **Misc** | 13 | Barrel, barriers (red/yellow), campfire (lit/unlit), chest (open/closed), cone, crate, sewer grate, skull | Dungeon props, decoration |
| **Fences** | 10 | 2 styles x 5 pieces (chain-link style) | Preserver outpost fencing |
| **Holes** | 9 | Ground holes and craters | Dungeon/cave floor details |
| **Signs** | 17 | Danger, radioactive, stop, parking, numbered signs | Warning signs in stagnation zones |
| **Foliage/Grass** | 11 | Various grass tufts (withered/dry) | Dead grass for stagnation areas |
| **Cars** | 6 | Cars in 6 colors (64x48 each) | NOT USED (anachronistic) |
| **Rocks** | 5 | Small rocks (16x16) | Cave/dungeon floor rocks |

### Prefabs (Multi-tile assembled buildings/roads)

| Category | Count | Items |
|----------|-------|-------|
| **Buildings** | 12 | Houses (4), garages (4), markets (2), parking lots (3), toilets (2) |
| **Roads** | 8 | Road sections (6), crossroads (2) |

**Game Repurpose:**
- Building prefabs → Preserver architecture (fortified, geometric, orderly)
- Road prefabs → Stagnation zone paths (rigid, artificial-looking)
- Damaged wall tiles → Corrupted/crumbling fortress walls

### Icons (66 total)

| Category | Count | Items | Game Repurpose |
|----------|-------|-------|----------------|
| **Tools** | 11 | Saw, pliers, torch, flashlight, binoculars, screwdriver, shovel, compass, crowbar, hammer, swiss army knife | Dungeon exploration items |
| **Resources** | 11 | Paper, matches, branch, electronics, wire, fuel tank, thread, plank, nails, duct tape, scrap | Crafting materials (if implemented) |
| **Weapons** | 11 | Bow, chainsaw, grenade, arrow, spiked bat, pistol, automatic gun, axe, knife, shotgun, iron fist | NOT USED (modern/anachronistic) |
| **Food** | 11 | Flask, bread, chips, can, meat, apple, cheese, water, sandwich, chocolate, coke | Consumable item icons |
| **Apparel** | 11 | Boots, hat, gas mask, vest, shirt, backpack, helmet, goggles, gloves, belt, pants | Equipment slot icons |
| **Items** | 11 | Battery, radio, bandage, key, alcohol, first aid kit x2, pills, money, syringe, coins | Consumable/key item icons |

### Characters

- `Characters/Zombie 1.png` (18x29) — Single zombie sprite. Could repurpose as undead enemy.

---

## Asset-to-Game-Biome Mapping

### How Backterria covers each biome:

| Game Biome | Primary Backterria Source | Specific Assets | Coverage |
|------------|-------------------------|-----------------|----------|
| **Village** | Overworld (Green Meadow) + Natural Props | Green grass, cobblestone paths, buildings, fences, wells, trees, flowers | **COMPLETE** |
| **Grassland** | Overworld (Green + Yellow Meadow) + Natural Tileset | Grass variants, farmland, wheat, stone walls, water | **COMPLETE** |
| **Forest** | Overworld (Autumn Meadow) + Natural Tileset + Natural Props + Plants | Autumn trees, forest floor dirt/leaves, dense vegetation, rocks, mushrooms | **COMPLETE** |
| **Mountain** | Natural Tileset (stone/path sections) + Overworld (Dead Meadow) + Natural Props (rocks) | Stone terrain, cliff paths, rocks, sparse grass | **ADEQUATE** — may need cliff edge tiles from Kenney Roguelike |
| **Riverside** | Overworld (water tiles) + Natural Tileset (water/river sections) | Water, river, water edges, bridges, riverbanks, lily pads | **COMPLETE** |
| **Wetland/Marsh** | Natural Tileset (water) + Plants (ground vegetation) + Overworld (dark water) | Shallow water, mud, reeds, vegetation | **ADEQUATE** — may need swamp-specific tiles |
| **Plains** | Overworld (Yellow Meadow) + Natural Tileset (grass/path) | Open grass, scattered rocks, gentle paths | **COMPLETE** |
| **Dungeon** | Interiors (Dark Blue, Grey Stone, Dark Stone templates) + Post-Apoc props | Dungeon floors, walls, doors, chests, torches, stairs, traps | **COMPLETE** |
| **Interiors** | Interiors (all templates) + Plants (potted) + Items | Rooms in every style, furniture, decoration | **COMPLETE** |
| **Stagnation** | Overworld (Dead/Brown Meadow) + Post-Apoc (damaged tiles, dead grass) | Brown/dead grass, damaged structures, crystalline corruption | **ADEQUATE** — may need custom crystal overlay |
| **Sketch** | NOT COVERED by Backterria | n/a | **GAP** — use Kenney Monochrome RPG |

### Gap Analysis

**What Backterria FULLY covers (no supplements needed):**
- Village terrain + buildings + decoration
- Grassland + farmland
- Forest + dense vegetation
- Riverside + water features
- Plains
- All indoor interiors
- Dungeon/underground
- Item icons
- NPC-interaction UI symbols

**What may need Kenney supplements:**
- Mountain cliff edges (Roguelike Base Pack has cliff tiles)
- Swamp/marsh specific tiles like boardwalks (Roguelike Base)
- Sketch biome (Kenney Monochrome RPG — monochrome aesthetic not in Backterria)

**What needs custom/GenAI assets:**
- Stagnation crystal corruption overlay (unique to game)
- God shrine/altar objects (unique landmarks)
- Specific magic effects (crystal formations, resonance stones)

---

## File Organization

```
assets/tilesets/backterria/
├── The Overworld 1-3.png           # PRIMARY — surface terrain
├── The Interiors 1-5 Alpha.png     # PRIMARY — all indoor maps
├── The Plants 1-1.png              # Vegetation decoration
├── The Items v1-0 Alpha.png        # Item icons
├── The Signs 16 v1-0 Alpha.png     # Signs at 16px
├── The Signs 32 v1-1 Alpha.png     # Signs at 32px (GAME-READY)
├── The Symbols v1-0 Alpha.png      # UI symbols
├── The Isometric 1-8 Alpha.png     # NOT USED (wrong perspective)
├── The Natural v1-4.zip            # Source archive
├── The Post Apocalyptic v1-6.zip   # Source archive
├── natural/
│   ├── Tiles/
│   │   └── The Natural 1-4 Tileset.png   # Terrain tiles
│   ├── Props/                              # 101 individual sprites
│   │   ├── Bush 01-10.png                 # 10 bushes (32x32)
│   │   ├── Flower 01-10.png              # 10 flowers (32x32)
│   │   ├── Plant 01-10.png               # 10 plants (32x32)
│   │   ├── Tree 01-04.png                # 4 small trees (32x32)
│   │   ├── Tree 05-08.png                # 4 large trees (64x64)
│   │   ├── Rock 1-10.png                 # 10 rocks (32x32)
│   │   ├── Wood Fence 01-08.png          # 8 fence pieces (32x32)
│   │   ├── Wood Fence Door 1-2.png       # 2 fence gates (32x32)
│   │   ├── Stone Fence 01-08.png         # 8 stone fence pieces (32x32)
│   │   ├── Stone Fence Door 1-2.png      # 2 stone fence gates (32x32)
│   │   ├── Well 01-02.png                # 2 wells (32x32)
│   │   ├── House 01.png                   # House (64x95)
│   │   ├── Tower 01.png                   # Tower (64x95)
│   │   ├── Seed Bed 1-3.png              # 3 seed beds (32x32)
│   │   ├── Carrot Grow 1-5.png           # 5 growth stages (32x32)
│   │   ├── Corn Grow 1-5.png             # 5 growth stages (32x32)
│   │   ├── Tomato Grow 1-5.png           # 5 growth stages (32x32)
│   │   ├── Sunflower Grow 1-5.png        # 5 growth stages (32x32)
│   │   ├── Cabbage Grow 1-5.png          # 5 growth stages (32x32)
│   │   └── Wood Crate.png                # 1 crate (32x32)
│   ├── Icons/                              # 14 item icons (32x32)
│   │   ├── Bucket.png, Hoe.png, Shovel.png, Watering Can.png
│   │   ├── Cabbage Icon.png, Carrot Icon.png, Corn Icon.png, etc.
│   │   └── Cabbage Bag.png, Carrot Bag.png, Corn Bag.png, etc.
│   ├── The Natural 1-4 Table A.png       # Reference sheet
│   └── The Natural 1-4 Props and Icons.png # Reference sheet
└── post-apocalyptic/
    ├── Tiles/
    │   ├── Road Tiles.png                 # Road tiles (176x48)
    │   ├── Building Tiles.png             # Building tiles (144x208)
    │   └── Pavement Tiles.png             # Pavement tiles (176x48)
    ├── Prefabs/
    │   ├── Buildings/                     # 12 pre-assembled buildings
    │   └── Roads/                         # 8 pre-assembled road sections
    ├── Props/
    │   ├── Misc/                          # 13 misc props
    │   ├── Fences/                        # 10 fence pieces
    │   ├── Holes/                         # 9 ground holes
    │   ├── Signs/                         # 17 signs
    │   ├── Foliage/Grass/                 # 11 grass variations
    │   ├── Cars/                          # 6 cars (NOT USED)
    │   └── Rocks/                         # 5 rocks
    ├── Icons/
    │   ├── Tools/                         # 11 tool icons
    │   ├── Resources/                     # 11 resource icons
    │   ├── Weapons/                       # 11 weapon icons (mostly NOT USED)
    │   ├── Food/                          # 11 food icons
    │   ├── Apparel/                       # 11 apparel icons
    │   └── Items/                         # 11 item icons
    ├── Characters/
    │   └── Zombie 1.png                   # 1 zombie sprite
    └── The Post Apocalyptic v1-6 Spreadsheet.png  # Reference sheet
```

---

## Upscale Pipeline Summary

**Step 1 — Tilesheets (16px → 32px via 2x nearest-neighbor):**
- `The Overworld 1-3.png` → `backterria-overworld_normal.png`
- `natural/Tiles/The Natural 1-4 Tileset.png` → `backterria-natural_normal.png`
- `The Plants 1-1.png` → `backterria-plants_normal.png`
- `The Interiors 1-5 Alpha.png` → `backterria-interiors_normal.png`
- `The Signs 16 v1-0 Alpha.png` → (use Signs 32 instead)
- `The Items v1-0 Alpha.png` → `backterria-items_normal.png`
- `The Symbols v1-0 Alpha.png` → `backterria-symbols_normal.png`
- `post-apocalyptic/Tiles/*.png` → `backterria-postapoc-*.png`

**Step 2 — Already game-ready (no upscaling):**
- `The Signs 32 v1-1 Alpha.png` → copy as-is
- `natural/Props/*.png` at 32x32 → use as-is (already 1 tile at 32px)
- `natural/Props/Tree 05-08.png` at 64x64 → use as-is (already 2x2 tiles at 32px)
- `natural/Icons/*.png` at 32x32 → use as-is

**Step 3 — Pack individual props into composite tilesheet:**
- All 101 Natural Props → pack into single `backterria-natural-props.png` (16 columns wide)
- Post-Apoc individual props → pack into `backterria-postapoc-props.png`

**Step 4 — Vibrancy variants (automated HSL adjustment):**
- Each upscaled sheet → `_normal.png`, `_muted.png`, `_vivid.png`
