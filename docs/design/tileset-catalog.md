# Tileset Catalog — Visual Tile Mapping

> Authored by visual inspection of all 9 regenerated normal-tier tilesets (Gemini Pro, 2026-02-13).
> TMX tile IDs are **1-indexed**: tile 1 = row 0, col 0. Tile N = row floor((N-1)/16), col (N-1)%16.
> All tilesets are 16 columns wide, 32x32 pixels per tile.

---

## How to Use This Catalog

When writing TMX map layer data:
- **Ground layer**: Use tile IDs from the Ground rows (1-32). Alternate between 2-4 similar IDs for natural variation.
- **Ground2 layer**: Sparse overlay — use path tiles (row 3) and scattered decoration ground details. Mostly 0 (empty).
- **Objects layer**: Buildings, trees, large props from Obstacle/Decoration rows.
- **Objects_upper layer**: Roof tiles, tree canopy tops — rendered above the player.
- **Collision layer**: Any non-zero tile = blocked. Mirror obstacle/building placement.
- **Events layer**: TMX object layer with event rectangles, not tile data.

Tile ID 0 = empty/transparent (no tile).

---

## Village Normal (16x14 = 224 tiles)

**File**: `tiles_village_normal.png` / `.tsx`

### Row 0 (Tiles 1-16) — Ground
| Tile | Visual | Use |
|------|--------|-----|
| 1 | Warm gray-brown cobblestone, regular pattern | Primary town ground |
| 2 | Cobblestone variant, offset/staggered stones | Town ground variation |
| 3 | Cobblestone variant, cracked/weathered | Town ground variation |
| 4 | Green grass with small yellow flowers | Garden/park areas |
| 5 | Full bright green grass | Open grass areas |
| 6 | Tan/sandy dirt | Unpaved areas |
| 7 | Dark brown tilled soil | Garden beds |
| 8 | Light wooden plank floor | Indoor areas |
| 9-16 | Additional ground variants (mixed stone, grass-dirt transitions) | Edge/transition areas |

### Row 1 (Tiles 17-32) — Ground continued
| Tile | Visual | Use |
|------|--------|-----|
| 17-20 | Brick/stone wall base textures | Building foundations |
| 21-24 | More ground variants (gravel, packed dirt) | Roads, courtyards |
| 25-28 | Grass-stone edge transitions | Where grass meets stone |
| 29-32 | Wood plank variants, crate tops | Indoor floors, docks |

### Row 2 (Tiles 33-48) — Paths
| Tile | Visual | Use |
|------|--------|-----|
| 33 | Dirt path straight horizontal | E-W paths |
| 34 | Dirt path straight vertical | N-S paths |
| 35 | Dirt path corner (top-left to right) | Path turns |
| 36 | Dirt path T-junction | Path intersections |
| 37 | Dirt path crossroads | 4-way intersections |
| 38 | Stone steps (gray rectangles) | Elevation changes |
| 39-42 | More path variants (wider, narrower, curved) | Path variation |
| 43-48 | Path edge transitions, grass-to-path blends | Path borders |

### Rows 3-8 (Tiles 49-144) — EMPTY (Autotile Reserved)
All transparent. Do not reference these tile IDs.

### Row 9 (Tiles 145-160) — Decorations
| Tile | Visual | Use |
|------|--------|-----|
| 145 | Flower pot (terra cotta with red flowers) | Near buildings |
| 146 | Lantern post (iron, warm glow) | Along paths |
| 147 | Wooden bench | Parks, squares |
| 148 | Stone well with wooden roof | Town center |
| 149 | Banner/flag on pole | Building fronts |
| 150 | Window box with flowers | Building decoration |
| 151 | Wooden barrel | Near shops, docks |
| 152 | Wooden cart with goods | Market area |
| 153 | Memorial stone (round, engraved) | Memorial garden |
| 154 | Wooden signpost | Path junctions |
| 155-160 | Empty or minor decoration variants | Sparse use |

### Row 10 (Tiles 161-176) — Decorations continued
| Tile | Visual | Use |
|------|--------|-----|
| 161-168 | Additional small props (sacks, crates, pots) | Building surroundings |
| 169-176 | Mostly empty | — |

### Row 11 (Tiles 177-192) — Obstacles
| Tile | Visual | Use |
|------|--------|-----|
| 177 | Building wall — cream plaster | Building sides |
| 178 | Building wall — gray stone | Building sides |
| 179 | Roof — tan thatch | Building tops (objects_upper) |
| 180 | Roof — brown/red tile | Building tops (objects_upper) |
| 181 | Wooden fence | Property borders |
| 182 | Green hedge | Garden borders |
| 183 | Large green tree (fills ~2x2 tiles) | Perimeter, parks |
| 184 | Wooden door (brown) | Building entrances |
| 185-192 | Additional obstacle variants or empty | — |

### Rows 12-13 (Tiles 193-224) — Animated
| Tile | Visual | Use |
|------|--------|-----|
| 193-196 | Fountain water frames (blue, splashing) | Central square fountain |
| 197-200 | Butterfly animation frames | Garden areas |
| 201-204 | Chimney smoke wisps | Above buildings |
| 205-208 | Lantern flicker frames | Night atmosphere |
| 209-212 | Banner wave frames | Building fronts |
| 213-224 | Empty or additional frames | — |

---

## Grassland Normal (16x16 = 256 tiles)

**File**: `tiles_grassland_normal.png` / `.tsx`

### Row 0 (Tiles 1-16) — Ground
| Tile | Visual | Use |
|------|--------|-----|
| 1-4 | Rich green grass variants (different blade patterns) | Primary ground |
| 5-6 | Golden wheat/hay field | Farm areas |
| 7-8 | Plowed brown field rows | Farmland |
| 9-10 | Light green meadow grass | Open fields |
| 11-12 | Dirt/mud ground | Paths, barn areas |
| 13-16 | Mixed grass-dirt transitions | Edge areas |

### Row 1 (Tiles 17-32) — Ground continued
| Tile | Visual | Use |
|------|--------|-----|
| 17-20 | More grass variants, clover patches | Ground variation |
| 21-24 | Stone/gravel ground | Road surfaces |
| 25-28 | Farm building floor (wood, hay) | Indoor barn |
| 29-32 | Field edge tiles | Crop borders |

### Row 2 (Tiles 33-48) — Paths
| Tile | Visual | Use |
|------|--------|-----|
| 33-38 | Dirt road tiles (H, V, corners, T, cross) | Farm roads |
| 39-42 | Stone-lined path variants | Main roads |
| 43-48 | Path-to-grass transitions | Road edges |

### Rows 3-8 (Tiles 49-144) — EMPTY

### Row 9-10 (Tiles 145-176) — Decorations
| Tile | Visual | Use |
|------|--------|-----|
| 145-148 | Scarecrow, hay bale, wooden bucket, watering can | Farm props |
| 149-152 | Fence post, gate, trough, feed bin | Animal pens |
| 153-156 | Wildflower clusters, tall grass tufts | Meadow detail |
| 157-160 | Windmill base, market stall frame | Town features |
| 161-168 | Additional farm/town decorations | Various |
| 169-176 | Wheat stalks, crop variants | Field overlay |

### Row 11 (Tiles 177-192) — Obstacles
| Tile | Visual | Use |
|------|--------|-----|
| 177-178 | Farmhouse walls (wood plank, stone base) | Buildings |
| 179-180 | Barn walls (red/brown wood) | Barn buildings |
| 181-182 | Roof tiles (thatch, shingle) | Building tops |
| 183 | Large oak tree | Field borders |
| 184 | Wooden farm fence (rail style) | Property borders |
| 185-188 | Hedgerow, stone wall, wooden gate | Boundaries |
| 189-192 | Silo, water tower base | Farm structures |

### Rows 12-15 (Tiles 193-256) — Animated/Special
| Tile | Visual | Use |
|------|--------|-----|
| 193-196 | Wheat swaying frames | Crop animation |
| 197-200 | Water stream/irrigation frames | River/brook |
| 201-208 | Windmill blade rotation frames | Windmill feature |
| 209-256 | Additional animated or empty | — |

---

## Forest Normal (16x18 = 288 tiles)

**File**: `tiles_forest_normal.png` / `.tsx`

### Row 0 (Tiles 1-16) — Ground
| Tile | Visual | Use |
|------|--------|-----|
| 1-3 | Dark brown forest floor with leaf litter | Primary ground |
| 4-5 | Mossy green ground, root-covered | Dense forest floor |
| 6-7 | Gray stone/rock ground | Rocky clearings |
| 8 | Orange-red autumn leaf carpet | Seasonal areas |
| 9-12 | Light brown dirt, packed earth | Forest trails |
| 13-16 | Grass-forest floor transitions, root tiles | Edge areas |

### Row 1 (Tiles 17-32) — Ground continued
| Tile | Visual | Use |
|------|--------|-----|
| 17-20 | More dirt/moss variants | Ground variation |
| 21-24 | Puddle/damp ground | Wet areas |
| 25-28 | Rocky ground, gravel | Mountain transition |
| 29-32 | Leaf piles, pine needle carpet | Seasonal |

### Row 2 (Tiles 33-48) — Paths
| Tile | Visual | Use |
|------|--------|-----|
| 33-34 | Forest trail (H, V) — narrow dirt | Main paths |
| 35-36 | Wooden bridge planks (H, V) | Stream crossings |
| 37-38 | Stepping stones | Creek crossings |
| 39-42 | Path variants with root edges | Trail borders |
| 43-48 | Water/stream tiles (blue, with lily pads) | Brooks, ponds |

### Rows 3-8 (Tiles 49-144) — EMPTY

### Row 9-10 (Tiles 145-176) — Decorations
| Tile | Visual | Use |
|------|--------|-----|
| 145 | Red/brown mushroom cluster | Forest floor detail |
| 146 | Fallen log (horizontal) | Forest floor obstacle |
| 147 | Tree stump (ring pattern visible) | Cleared area |
| 148 | Standing stone/moss-covered rock | Ancient markers |
| 149 | Bird nest on branch | Tree detail |
| 150 | Wildflower/herb cluster | Forest clearing |
| 151 | Spider web between branches | Dense forest detail |
| 152 | Tree stump (wider, cut) | Logging area |
| 153 | Small wooden sign/marker | Trail markers |
| 154 | Campfire (small) | Camp area |
| 155-160 | Additional forest props (berries, ferns, moss) | Various |
| 161-176 | More props or empty | — |

### Row 11-12 (Tiles 177-208) — Obstacles
| Tile | Visual | Use |
|------|--------|-----|
| 177-178 | Large tree trunk (brown, thick) — bottom half | Forest trees |
| 179-180 | Tree trunk variants (birch, pine) | Tree variety |
| 181-182 | Large green bush/shrub | Dense undergrowth |
| 183-184 | Mossy boulder (gray-green) | Rocky obstacles |
| 185-188 | Rock face/cliff edge | Forest cliffs |
| 189-192 | Hollow log, fallen tree | Path obstacles |
| 193-208 | Tree canopy tiles (dark green, for objects_upper) | Above player |

### Rows 13-17 (Tiles 209-288) — Animated/Special
| Tile | Visual | Use |
|------|--------|-----|
| 209-212 | Leaf particles falling | Ambient animation |
| 213-216 | Firefly glow frames (yellow dots on dark) | Night forest |
| 217-220 | Water ripple frames | Pond/stream surface |
| 221-224 | Branch sway frames | Wind effect |
| 225-228 | Dragonfly frames | Near water |
| 229-288 | Additional animated or empty | — |

---

## Mountain Normal (16x16 = 256 tiles)

**File**: `tiles_mountain_normal.png` / `.tsx`

### Row 0 (Tiles 1-16) — Ground
| Tile | Visual | Use |
|------|--------|-----|
| 1-4 | Gray rock/stone ground variants | Primary mountain ground |
| 5-6 | White snow patches on rock | High elevation |
| 7-8 | Alpine grass (dark green, short) | Mountain meadows |
| 9-10 | Gravel/scree | Loose rock areas |
| 11-12 | Ice/frozen ground (blue-white) | Frozen areas |
| 13-16 | Dirt-rock transitions, packed earth | Trail surfaces |

### Row 1 (Tiles 17-32) — Ground continued
| Tile | Visual | Use |
|------|--------|-----|
| 17-20 | More rock/snow variants | Variation |
| 21-24 | Cliff face textures (vertical rock) | Cliff walls |
| 25-28 | Cave floor (dark stone) | Cave interiors |
| 29-32 | Mineral/ore veins in rock | Mining areas |

### Row 2 (Tiles 33-48) — Paths
| Tile | Visual | Use |
|------|--------|-----|
| 33-38 | Mountain trail (H, V, corners) — narrow rocky path | Hiking trails |
| 39-40 | Stone staircase tiles | Elevation changes |
| 41-44 | Rope bridge planks | Crevasse crossings |
| 45-48 | Path-to-cliff edge transitions | Trail borders |

### Rows 3-8 (Tiles 49-144) — EMPTY

### Row 9-10 (Tiles 145-176) — Decorations
| Tile | Visual | Use |
|------|--------|-----|
| 145-148 | Alpine flowers, small shrubs, lichen | Mountain flora |
| 149-150 | Mining pickaxe, ore cart | Mining camp |
| 151-152 | Cairn (stacked stones), trail marker | Waypoints |
| 153-156 | Small bones, skull, ancient rune stone | Lore elements |
| 157-160 | Icicles, frost crystals | Ice cave detail |
| 161-176 | Additional props or empty | — |

### Row 11 (Tiles 177-192) — Obstacles
| Tile | Visual | Use |
|------|--------|-----|
| 177-178 | Large boulder (gray, rounded) | Path obstacles |
| 179-180 | Pine tree (dark green, conical) | Mountain treeline |
| 181-182 | Rock wall/cliff face | Impassable terrain |
| 183-184 | Snow-covered boulder | High elevation |
| 185-186 | Cave entrance (dark opening in rock) | Dungeon entry |
| 187-188 | Frozen waterfall (blue-white) | Scenic obstacle |
| 189-192 | Additional rock formations | — |

### Rows 12-15 (Tiles 193-256) — Animated
| Tile | Visual | Use |
|------|--------|-----|
| 193-196 | Snowfall particle frames | Weather effect |
| 197-200 | Wind/dust particle frames | Mountain wind |
| 201-204 | Waterfall flow frames | Cliff waterfall |
| 205-256 | Additional animated or empty | — |

---

## Riverside Normal (16x16 = 256 tiles)

**File**: `tiles_riverside_normal.png` / `.tsx`

### Row 0 (Tiles 1-16) — Ground
| Tile | Visual | Use |
|------|--------|-----|
| 1-4 | Blue water tiles (river surface, varying depth) | River/lake |
| 5-6 | Sandy riverbank | Shore areas |
| 7-8 | Green grass near water | Riverside meadow |
| 9-10 | Wet mud/silt | Muddy banks |
| 11-12 | Cobblestone (town-style) | Millbrook town |
| 13-16 | Stone-water transitions, dock wood | Waterfront |

### Row 1 (Tiles 17-32) — Ground continued
| Tile | Visual | Use |
|------|--------|-----|
| 17-20 | More water variants (shallow, deep, rapids) | River sections |
| 21-24 | Wooden dock/pier planks | Waterfront structures |
| 25-28 | Grassy bank variants | Riverside ground |
| 29-32 | Pebble/gravel shore | Beach areas |

### Row 2 (Tiles 33-48) — Paths
| Tile | Visual | Use |
|------|--------|-----|
| 33-36 | Wooden boardwalk tiles (H, V) | Waterfront paths |
| 37-38 | Stone bridge (H, V) | River crossings |
| 39-42 | Dirt path near water | Riverside trails |
| 43-48 | Bridge rails, path-water transitions | Path borders |

### Rows 3-8 (Tiles 49-144) — EMPTY

### Row 9-10 (Tiles 145-176) — Decorations
| Tile | Visual | Use |
|------|--------|-----|
| 145-148 | Fishing pier, boat (small), anchor, rope coil | Dock props |
| 149-152 | Reeds, cattails, water lilies | Waterside plants |
| 153-156 | Barrel, crate, fishing net, lobster trap | Harbor props |
| 157-160 | Lantern, bench, dock post | Town waterfront |
| 161-176 | Additional waterside props or empty | — |

### Row 11 (Tiles 177-192) — Obstacles
| Tile | Visual | Use |
|------|--------|-----|
| 177-178 | Watermill building walls | Millbrook buildings |
| 179-180 | Stone bridge supports | Bridge pillars |
| 181-182 | Large willow tree | Riverside tree |
| 183-184 | Dock warehouse wall | Harbor buildings |
| 185-186 | Waterfall (cascading blue-white) | Scenic feature |
| 187-192 | Additional obstacles or empty | — |

### Rows 12-15 (Tiles 193-256) — Animated
| Tile | Visual | Use |
|------|--------|-----|
| 193-196 | Water flow/current frames | River animation |
| 197-200 | Waterfall splash frames | Waterfall base |
| 201-204 | Fish jumping frames | River detail |
| 205-208 | Watermill wheel rotation | Millbrook feature |
| 209-256 | Additional animated or empty | — |

---

## Wetland Normal (16x16 = 256 tiles)

**File**: `tiles_wetland_normal.png` / `.tsx`

### Row 0 (Tiles 1-16) — Ground
| Tile | Visual | Use |
|------|--------|-----|
| 1-4 | Dark green-brown swamp water | Primary wetland surface |
| 5-6 | Muddy ground (dark brown, wet) | Walkable marsh |
| 7-8 | Mossy green ground | Dry patches |
| 9-10 | Peat/dark soil | Bog areas |
| 11-14 | Shallow water-mud transitions | Edge areas |
| 15-16 | Wooden boardwalk base | Walkway surface |

### Row 1 (Tiles 17-32) — Ground continued
| Tile | Visual | Use |
|------|--------|-----|
| 17-20 | More water/mud variants | Ground variation |
| 21-24 | Reed bed ground | Dense marsh |
| 25-28 | Dry island ground in marsh | Safe ground |
| 29-32 | Roots/organic matter floor | Mangrove areas |

### Row 2 (Tiles 33-48) — Paths
| Tile | Visual | Use |
|------|--------|-----|
| 33-36 | Wooden boardwalk (H, V, corners) | Primary paths |
| 37-38 | Stepping stones through water | Secondary paths |
| 39-42 | Raised dirt path | Dry paths |
| 43-48 | Path-swamp transitions | Path edges |

### Rows 3-8 (Tiles 49-144) — EMPTY

### Row 9-10 (Tiles 145-176) — Decorations
| Tile | Visual | Use |
|------|--------|-----|
| 145-148 | Lily pads (green, with/without flowers) | Water surface |
| 149-152 | Reeds, cattails (tall green stalks) | Marsh plants |
| 153-154 | Mangrove roots | Tree detail |
| 155-156 | Mushroom cluster (various colors) | Swamp flora |
| 157-160 | Bog lantern, wooden post | Path markers |
| 161-168 | Vines, hanging moss, frog on lily pad | Atmosphere |
| 169-176 | Additional swamp props or empty | — |

### Row 11 (Tiles 177-192) — Obstacles
| Tile | Visual | Use |
|------|--------|-----|
| 177-178 | Mangrove tree trunk | Swamp trees |
| 179-180 | Large mossy rock | Path obstacles |
| 181-182 | Dead/twisted tree | Spooky obstacle |
| 183-184 | Dense reed wall | Impassable marsh |
| 185-188 | Raised hut supports, stilted building | Marsh structures |
| 189-192 | Additional obstacles | — |

### Rows 12-15 (Tiles 193-256) — Animated
| Tile | Visual | Use |
|------|--------|-----|
| 193-196 | Bubbles rising from swamp | Marsh atmosphere |
| 197-200 | Firefly/will-o-wisp glow | Night marsh |
| 201-204 | Water ripple in swamp | Surface animation |
| 205-256 | Additional animated or empty | — |

---

## Plains Normal (16x14 = 224 tiles)

**File**: `tiles_plains_normal.png` / `.tsx`

### Row 0 (Tiles 1-16) — Ground
| Tile | Visual | Use |
|------|--------|-----|
| 1-4 | Open grassland (light green, windswept) | Primary ground |
| 5-6 | Tall grass (darker green) | Dense grass areas |
| 7-8 | Bare earth/dry grass | Worn areas |
| 9-10 | Sandy/dry soil | Arid patches |
| 11-14 | Mixed grass-dirt variants | Variation |
| 15-16 | Stone/rock ground | Resonance stone areas |

### Row 1 (Tiles 17-32) — Ground continued
| Tile | Visual | Use |
|------|--------|-----|
| 17-24 | Additional grass and earth variants | Ground variation |
| 25-32 | Grass-stone transitions | Edge tiles |

### Row 2 (Tiles 33-48) — Paths
| Tile | Visual | Use |
|------|--------|-----|
| 33-38 | Worn grass trail (H, V, corners) | Plains paths |
| 39-42 | Stone path tiles | Main roads |
| 43-48 | Transitions | Path borders |

### Rows 3-8 (Tiles 49-144) — EMPTY

### Row 9-10 (Tiles 145-176) — Decorations
| Tile | Visual | Use |
|------|--------|-----|
| 145-148 | Resonance stones (tall, crystalline) | Lore feature |
| 149-150 | Tent/camp stake | Camp areas |
| 151-152 | Campfire (with logs) | Rest sites |
| 153-156 | Tall grass tufts, prairie flowers | Field detail |
| 157-160 | Broken wagon wheel, milestone marker | Road props |
| 161-176 | Additional props or empty | — |

### Row 11 (Tiles 177-192) — Obstacles
| Tile | Visual | Use |
|------|--------|-----|
| 177-178 | Large resonance stone (2x2) | Major lore feature |
| 179-180 | Lone tree (wind-bent) | Sparse tree |
| 181-182 | Rock outcrop | Natural obstacle |
| 183-184 | Tent (full, canvas) | Camp structure |
| 185-192 | Additional obstacles or empty | — |

### Rows 12-13 (Tiles 193-224) — Animated
| Tile | Visual | Use |
|------|--------|-----|
| 193-196 | Grass wave/wind frames | Wind animation |
| 197-200 | Resonance stone glow frames | Magical effect |
| 201-204 | Campfire flame frames | Fire animation |
| 205-224 | Additional animated or empty | — |

---

## Dungeon Normal (16x16 = 256 tiles)

**File**: `tiles_dungeon_normal.png` / `.tsx`

### Row 0 (Tiles 1-16) — Ground
| Tile | Visual | Use |
|------|--------|-----|
| 1-4 | Gray stone floor variants (smooth, cracked, mossy) | Primary dungeon floor |
| 5-6 | Dark circular floor pattern (magic circle/drain) | Special rooms |
| 7-8 | Cave/rough stone ground | Natural cavern |
| 9-10 | Brown dirt floor | Collapsed areas |
| 11-12 | Water puddle on stone | Damp areas |
| 13-16 | Tile/brick floor variants | Constructed rooms |

### Row 1 (Tiles 17-32) — Ground continued / Walls
| Tile | Visual | Use |
|------|--------|-----|
| 17-20 | Stone wall face (gray brick, dark mortar) | Dungeon walls |
| 21-22 | Reinforced door frame | Doorways |
| 23-24 | Staircase tiles (going up, going down) | Level transitions |
| 25-28 | More wall variants (crumbling, mossy) | Wall variation |
| 29-32 | Metal gate/portcullis tiles | Barriers |

### Row 2 (Tiles 33-48) — Paths/Features
| Tile | Visual | Use |
|------|--------|-----|
| 33-36 | Corridor floor (worn stone, with torch light) | Hallways |
| 37-40 | Bridge over chasm (dark below) | Pit crossings |
| 41-44 | Rail/track tiles for mine cart | Mine areas |
| 45-48 | Pressure plate, floor switch | Puzzle elements |

### Rows 3-8 (Tiles 49-144) — EMPTY

### Row 9-10 (Tiles 145-176) — Decorations
| Tile | Visual | Use |
|------|--------|-----|
| 145-146 | Wall torch (lit, warm orange) | Lighting |
| 147-148 | Treasure chest (closed, open) | Loot |
| 149-150 | Clay pot/urn, broken pottery | Floor clutter |
| 151 | Scroll/document on floor | Lore item |
| 152 | Bookshelf (wooden, with books) | Library areas |
| 153-154 | Cobweb, skull pile | Atmosphere |
| 155-156 | Carved wall relief, runic inscription | Lore detail |
| 157-158 | Pillar/column (stone, ornate) | Architecture |
| 159-160 | Wooden door, iron door | Entrances |
| 161-164 | Prison bars, chains, iron gate | Prison area |
| 165-168 | Collapsed rubble, bone pile | Destruction |
| 169-172 | Crystal cluster (blue/cyan) | Magic areas |
| 173-176 | Water pool (underground), stalactite | Cave features |

### Row 11 (Tiles 177-192) — Obstacles
| Tile | Visual | Use |
|------|--------|-----|
| 177-178 | Thick stone wall (impassable) | Dungeon walls |
| 179-180 | Large stalagmite/stalactite column | Cave obstacle |
| 181-182 | Collapsed ceiling rubble | Blocked passage |
| 183-184 | Large crystal formation | Magical obstacle |
| 185-186 | Iron portcullis (closed) | Locked barrier |
| 187-188 | Pit/chasm edge | Hazard |
| 189-192 | Additional walls or empty | — |

### Rows 12-15 (Tiles 193-256) — Animated
| Tile | Visual | Use |
|------|--------|-----|
| 193-196 | Torch flame flicker frames | Lighting animation |
| 197-200 | Dripping water frames | Cave atmosphere |
| 201-204 | Magic circle glow pulse | Spell effects |
| 205-208 | Crystal shimmer frames | Magic areas |
| 209-256 | Additional animated or empty | — |

---

## Sketch Normal (16x16 = 256 tiles)

**File**: `tiles_sketch_normal.png` / `.tsx`

The sketch biome has a unique watercolor/pencil-on-parchment aesthetic. Tiles are partially filled outlines, intentionally incomplete.

### Row 0 (Tiles 1-16) — Ground
| Tile | Visual | Use |
|------|--------|-----|
| 1-4 | Parchment ground with pencil hatching | Primary sketch ground |
| 5-6 | Light green watercolor grass wash | Partially drawn meadow |
| 7-8 | Blue watercolor (water wash) | Sketched water |
| 9-10 | Gray pencil rock/stone | Mountain sketch |
| 11-14 | Warm parchment/cream variants | Base ground |
| 15-16 | Half-drawn tiles (visible pencil grid lines) | Unfinished areas |

### Row 1 (Tiles 17-32) — Ground continued
| Tile | Visual | Use |
|------|--------|-----|
| 17-24 | More parchment/wash variants | Ground variation |
| 25-32 | Transitional (pencil to watercolor) | Edge areas |

### Row 2 (Tiles 33-48) — Paths
| Tile | Visual | Use |
|------|--------|-----|
| 33-36 | Pencil-drawn road (dashed lines, H/V/corners) | Sketch paths |
| 37-40 | Watercolor bridge strokes | Crossings |
| 41-48 | Path variants, railing sketches | Path borders |

### Rows 3-8 (Tiles 49-144) — EMPTY

### Row 9-10 (Tiles 145-176) — Decorations
| Tile | Visual | Use |
|------|--------|-----|
| 145-148 | Watercolor trees (loose brush strokes) | Sketch trees |
| 149-152 | Green bush outlines, flower sketches | Sketch plants |
| 153-156 | House outline (pencil, partially colored) | Sketch building |
| 157-160 | Crystal/obelisk sketch, well outline | Lore features |
| 161-168 | Pencil props (fence, sign, stone) | Detail elements |
| 169-176 | Additional sketches or empty | — |

### Row 11 (Tiles 177-192) — Obstacles
| Tile | Visual | Use |
|------|--------|-----|
| 177-180 | Stone wall outline, brick sketch | Sketch walls |
| 181-184 | Mountain triangle outlines | Sketch terrain |
| 185-188 | House frame with partial roof | Sketch buildings |
| 189-192 | Additional obstacles or empty | — |

### Rows 12-15 (Tiles 193-256) — Animated
| Tile | Visual | Use |
|------|--------|-----|
| 193-196 | Pencil-to-color transition frames | Drawing animation |
| 197-200 | Sparkle/light burst (watercolor glow) | Magic effect |
| 201-256 | Mostly empty (intentionally sparse) | — |

---

## Quick Reference — Key Tile IDs by Category

For rapid TMX authoring, these are the most important tile IDs per biome:

| Biome | Ground (fill) | Path | Grass | Tree | Wall | Roof | Door | Water |
|-------|--------------|------|-------|------|------|------|------|-------|
| Village | 1-3 | 33-37 | 4-5 | 183 | 177-178 | 179-180 | 184 | 193-196 |
| Grassland | 1-4 | 33-38 | 1-4 | 183 | 177-180 | 181-182 | — | 197-200 |
| Forest | 1-3 | 33-34 | — | 177-180 | — | — | — | 43-48 |
| Mountain | 1-4 | 33-38 | 7-8 | 179-180 | 181-182 | — | — | — |
| Riverside | 11-12 | 33-36 | 7-8 | 181-182 | 177-178 | — | — | 1-4 |
| Wetland | 5-8 | 33-36 | 7-8 | 177-178 | — | — | — | 1-4 |
| Plains | 1-4 | 33-38 | 1-4 | 179-180 | — | — | — | — |
| Dungeon | 1-4 | 33-36 | — | — | 177-178 | — | 159-160 | 11-12 |
| Sketch | 1-4 | 33-36 | 5-6 | 145-148 | 177-180 | 185-188 | — | 7-8 |

---

## Verification Notes

- All 27 tilesets regenerated with Gemini Pro (2026-02-13)
- Zero text contamination — no tile IDs, labels, or letters visible
- Autotile rows (4-9) correctly empty across all biomes
- Ground tiles show reasonable variety (3-8 distinct variants per biome)
- Decoration tiles are distinct objects on transparent backgrounds
- Obstacle tiles suitable for collision layer blocking
- Edge repair applied: 8,616 pixels total (down from 16,406 in previous generation)
- Three tiers (muted/normal/vivid) share consistent layouts per biome
