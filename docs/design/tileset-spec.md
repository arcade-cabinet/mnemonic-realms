# Tileset Specification: Art Production Guide

> Cross-references: [docs/design/visual-direction.md](visual-direction.md), [docs/world/vibrancy-system.md](../world/vibrancy-system.md), [docs/world/geography.md](../world/geography.md)

## Overview

This document is the **art production specification** for every tileset in Mnemonic Realms. It defines tile IDs, sheet layouts, color palettes, animation frames, autotile rules, and transition tiles — everything an artist or GenAI pipeline needs to produce the actual PNG tileset assets.

All tilesets use **32x32 pixel tiles** on a transparent PNG background. Each biome has **three tileset variants** (Muted, Normal, Vivid) corresponding to the vibrancy tiers defined in [vibrancy-system.md](../world/vibrancy-system.md).

---

## Conventions

### Naming Convention

Tileset files follow this pattern:

```
tiles_{biome}_{tier}.png
```

Examples: `tiles_village_muted.png`, `tiles_forest_normal.png`, `tiles_grassland_vivid.png`

Overlay tilesets (stagnation, transitions) use:

```
overlay_{type}_{variant}.png
```

Examples: `overlay_stagnation_crystal.png`, `overlay_transition_grassland_forest.png`

### Tile ID Format

Each tile has a unique ID for data reference:

```
{BIOME}-{CATEGORY}-{NUMBER}
```

Categories: `GR` (ground), `PA` (path), `DE` (decoration), `OB` (obstacle), `TR` (transition), `AN` (animated), `AT` (autotile)

Examples: `VIL-GR-01` (Village ground tile 1), `FOR-DE-03` (Forest decoration tile 3)

### Sheet Layout Standard

All tileset sheets are organized as follows:

- **Width**: 16 tiles (512 pixels)
- **Height**: variable per biome (rows as needed)
- **Row order**: Ground → Path → Autotile → Decoration → Obstacle → Animated → Special
- **No spacing** between tiles (edge-to-edge packing)
- **Transparent background** (PNG-32 with alpha channel)

Animated tiles use **horizontal frame strips**: frames are placed left-to-right in the same row. Frame count and speed are noted per tile.

### Autotile Standard

Autotiles use the **RPG Maker A2 format** (also called "Wang tile" or "blob" pattern):

- 47-tile complete set for each autotile type (covers all neighbor combinations)
- Organized as a 6-row x 8-column block (48 cells, last cell unused)
- Each autotile block occupies rows 48 tiles wide in the sheet (6 rows x 8 columns = 48 cells)

RPG-JS supports this format natively via TMX Tiled maps.

---

## Color Palettes Per Vibrancy Tier

These are the **master color keys** for each tier, derived from [visual-direction.md](visual-direction.md). All biomes use these as their base palette constraints.

### Muted Tier (Vibrancy 0-33)

| Role | Hex | Description |
|------|-----|-------------|
| Primary background | #F5F0E6 | Warm cream/parchment |
| Secondary background | #E8E0D0 | Soft tan |
| Green (vegetation) | #B8C4A0 | Pale sage |
| Blue (water) | #B0C4DE | Soft steel blue |
| Brown (earth/wood) | #C8B89C | Light warm brown |
| Gray (stone) | #C0BAB0 | Warm pale gray |
| Gold (memory accent) | #D4B870 | Muted amber |
| Shadow | #A09888 | Warm gray shadow (no black) |
| Highlight | #FAF6EE | Near-white warm |

### Normal Tier (Vibrancy 34-66)

| Role | Hex | Description |
|------|-----|-------------|
| Primary background | #E8DCC8 | Warm sand |
| Secondary background | #D4C8A8 | Golden tan |
| Green (vegetation) | #5C8C3C | Medium leaf green |
| Blue (water) | #4A8CB8 | Clear river blue |
| Brown (earth/wood) | #8B6D4C | Warm earth brown |
| Gray (stone) | #8C8078 | Textured stone gray |
| Gold (memory accent) | #DAA520 | Full amber/goldenrod |
| Shadow | #5C5040 | Warm deep shadow |
| Highlight | #FFF8E8 | Warm light |
| Red (accent) | #B85C4C | Warm brick/roof red |
| Yellow (accent) | #D4A030 | Wheat gold |

### Vivid Tier (Vibrancy 67-100)

| Role | Hex | Description |
|------|-----|-------------|
| Primary background | #D4C4A0 | Rich warm parchment |
| Secondary background | #C8B080 | Deep golden sand |
| Green (vegetation) | #2E8B2E | Rich emerald |
| Blue (water) | #2878A8 | Deep vivid blue |
| Brown (earth/wood) | #6B4C30 | Rich dark wood |
| Gray (stone) | #6C6058 | Warm mineral stone |
| Gold (memory accent) | #FFD700 | Bright pure gold |
| Shadow | #3C3028 | Deep warm shadow |
| Highlight | #FFFFF0 | Ivory light |
| Red (accent) | #CD5C5C | Vivid indian red |
| Yellow (accent) | #FFD700 | Pure gold |
| Aurora green | #66CDAA | Awe accent |
| Aurora pink | #DDA0DD | Vivid sky accent |
| Prismatic | #E0E8FF | Iridescent highlight |

### Emotion Accent Colors (Used Across All Tiers)

These appear in particle effects, UI, and memory-related tiles at the same values regardless of tier:

| Emotion | Hex | Usage |
|---------|-----|-------|
| Joy | #FFD700 | Sunlight yellow — healing areas, warm zones |
| Sorrow | #7B68EE | Twilight purple — reflective spaces, cleansing |
| Awe | #66CDAA | Aurora green — sacred spaces, shields |
| Fury | #CD5C5C | Forge red — volcanic areas, attack buffs |
| Calm | #87CEEB | Sky blue — neutral zones, water |
| Memory energy | #DAA520 | Amber — universal memory particle color |
| Stagnation | #B0C4DE → #E8E8E8 | Cold crystal blue-white gradient |

---

## Biome 1: Village

**Used by**: Village Hub (30x30 tiles)
**Sheet dimensions**: 16 x 14 tiles (512 x 448 pixels) per tier
**Total unique tiles**: 52 per tier (156 across all three tiers)

### Ground Tiles (Row 1-2)

| ID | Name | Muted | Normal | Vivid |
|----|------|-------|--------|-------|
| VIL-GR-01 | Cobblestone (primary) | Pale gray (#C0BAB0), joints barely visible | Warm gray-brown (#8C8078), visible mortar lines | Rich warm stone (#6C6058), golden mortar highlights (#DAA520) |
| VIL-GR-02 | Cobblestone (variant A) | Same palette, slightly offset pattern | Alternating stone sizes, moss in joints | Polished stone, amber light reflections |
| VIL-GR-03 | Cobblestone (variant B) | Cracked corner stone | Repaired stone with visible patches | Inlaid decorative stone patterns |
| VIL-GR-04 | Grass patch | Pale sage (#B8C4A0), sparse blades | Medium green (#5C8C3C), small flowers | Deep emerald (#2E8B2E), abundant wildflowers |
| VIL-GR-05 | Grass (full tile) | Flat sage, no texture detail | Lush green, clover patches | Emerald carpet, butterflies (see VIL-AN-02) |
| VIL-GR-06 | Dirt ground | Flat beige (#C8B89C) | Packed earth, pebble texture | Warm ochre (#8B6D4C), wildflower edges |
| VIL-GR-07 | Garden soil | Light brown, bare | Dark turned earth, seed rows | Rich loam, sprouting plants |
| VIL-GR-08 | Indoor floor (wood) | Pale planks, no grain | Warm wood grain, knotholes | Rich polished wood, rug edges |

### Path Tiles (Row 3)

| ID | Name | Muted | Normal | Vivid |
|----|------|-------|--------|-------|
| VIL-PA-01 | Dirt path (straight H) | Flat beige strip | Packed earth, footprint texture | Warm ochre, lined with small stones |
| VIL-PA-02 | Dirt path (straight V) | Flat beige strip | Packed earth, footprint texture | Warm ochre, lined with small stones |
| VIL-PA-03 | Dirt path (corner) | Beige curve | Rounded earth corner | Stone-edged corner, flower tufts |
| VIL-PA-04 | Dirt path (T-junction) | Beige T | Earth T with worn center | Stone-bordered T, signpost base |
| VIL-PA-05 | Dirt path (crossroads) | Beige cross | Earth crossroads, wheel marks | Paved center with decorative stone |
| VIL-PA-06 | Stone steps | Gray rectangles | Carved steps with wear marks | Mossy steps with carved railing |

### Autotile: Cobblestone-to-Grass (Row 4-9)

| ID | Name | Description |
|----|------|-------------|
| VIL-AT-01 | Cobblestone-grass autotile | 47-tile blob set. Inner: cobblestone ground (VIL-GR-01 style). Outer: grass (VIL-GR-05 style). Edge transition uses a 2-pixel grass creep over stone. |

### Decoration Tiles (Row 10-11)

| ID | Name | Muted | Normal | Vivid |
|----|------|-------|--------|-------|
| VIL-DE-01 | Flower pot | Empty clay pot | Clay pot with red/yellow flowers | Overflowing pot, cascading vines |
| VIL-DE-02 | Lantern post | Unlit gray metal frame | Warm amber glow (#DAA520) | Bright gold light, floating sparkle particles |
| VIL-DE-03 | Bench | Bare wood frame | Painted bench, armrests | Decorated bench, cushion, flowers beside |
| VIL-DE-04 | Well | Dry stone ring | Functional well, bucket on rope | Flowering vines on stone, sparkling water |
| VIL-DE-05 | Banner (on building) | None (empty space) | Simple cloth banner | Colorful banner, guild symbols, bunting |
| VIL-DE-06 | Window box | Empty ledge | Small flower box | Overflowing flower box, trailing ivy |
| VIL-DE-07 | Barrel | Plain wood barrel | Banded barrel with lid | Decorated barrel, ale tap, fruit nearby |
| VIL-DE-08 | Cart | Bare wooden frame | Loaded cart with sacks | Painted cart, merchant goods displayed |
| VIL-DE-09 | Memorial stone | Rough unmarked stone | Carved Resonance Stone, faint glow | Pulsing amber stone, memory motes rising |
| VIL-DE-10 | Signpost | Bare wooden post | Directional sign, readable text | Ornate carved signpost, painted arrows |

### Obstacle Tiles (Row 12)

| ID | Name | Muted | Normal | Vivid |
|----|------|-------|--------|-------|
| VIL-OB-01 | Building wall (plaster) | Washed-out cream (#F5F0E6) | Warm plaster (cream/peach/soft yellow) | Saturated plaster, painted trim |
| VIL-OB-02 | Building wall (stone) | Pale gray stone | Warm textured stone | Rich stone with carved details |
| VIL-OB-03 | Roof (thatch) | Flat tan | Golden straw, visible bundling | Rich gold-brown, bird nests, chimney smoke |
| VIL-OB-04 | Roof (tile) | Flat gray tiles | Terracotta tiles, visible overlap | Deep red tiles, mossy edges |
| VIL-OB-05 | Fence (wood) | Bare stakes | Whitewashed rail fence | Flowering vine-covered fence |
| VIL-OB-06 | Hedge | Sparse pale twigs | Full leafy hedge | Flowering hedge, cascading blossoms |
| VIL-OB-07 | Tree (village) | Bare trunk silhouette | Full green canopy | Lush canopy, blossoms, dappled light |
| VIL-OB-08 | Door (wood) | Plain flat rectangle | Paneled door, iron handle | Painted door, decorative hinges, welcome mat |

### Animated Tiles (Row 13-14)

| ID | Name | Frames | Speed | Muted | Normal | Vivid |
|----|------|--------|-------|-------|--------|-------|
| VIL-AN-01 | Fountain water | 4 | 200ms/frame | Still pale blue | Flowing blue, white ripples | Sparkling prismatic, golden motes |
| VIL-AN-02 | Butterflies | 3 | 300ms/frame | None (blank) | None (blank) | 3 butterflies fluttering over grass |
| VIL-AN-03 | Chimney smoke | 4 | 250ms/frame | None (blank) | Thin gray wisps | Thick warm smoke, occasional sparks |
| VIL-AN-04 | Lantern flicker | 2 | 400ms/frame | None (blank) | Gentle amber pulse | Bright golden pulse, sparkle variation |
| VIL-AN-05 | Flag/banner wave | 3 | 350ms/frame | None (blank) | Gentle cloth movement | Vibrant billowing with color shift |

---

## Biome 2: Grassland/Farmland

**Used by**: Heartfield (40x40), Sunridge (40x40)
**Sheet dimensions**: 16 x 16 tiles (512 x 512 pixels) per tier
**Total unique tiles**: 58 per tier (174 across all three tiers)

### Ground Tiles (Row 1-2)

| ID | Name | Muted | Normal | Vivid |
|----|------|-------|--------|-------|
| GRA-GR-01 | Grass (base) | Pale sage-green (#B8C4A0), flat | Medium green (#5C8C3C), subtle blade texture | Rich emerald (#2E8B2E), individual blades, wildflowers |
| GRA-GR-02 | Grass (variant A) | Slightly warmer sage | Clover patches among blades | Daisy clusters, ladybugs |
| GRA-GR-03 | Grass (variant B) | Cooler sage with bare spots | Tall grass tufts | Dense wildflower meadow |
| GRA-GR-04 | Wheat field | Pale straw (#C8B89C), short | Golden wheat (#D4A030), medium height | Deep gold, tall wheat, pollen motes |
| GRA-GR-05 | Wheat field (variant) | Same, slightly different angle | Wind-bent stalks | Heavy with grain, harvest-ready |
| GRA-GR-06 | Tilled soil | Flat gray-brown | Rich brown furrows, seed rows | Dark loam, green sprouts visible |
| GRA-GR-07 | Bare earth | Light tan, featureless | Packed dirt, scattered pebbles | Warm brown, small insects |
| GRA-GR-08 | Hill elevation (light) | Pale green rise | Gentle contour, shadow on slope | Rich undulation, sheep grazing |
| GRA-GR-09 | Hill elevation (dark) | Pale green shadow | Deeper shadow on slope | Shadow with wildflowers in lee |

### Path Tiles (Row 3)

| ID | Name | Muted | Normal | Vivid |
|----|------|-------|--------|-------|
| GRA-PA-01 | Dirt road (straight H) | Flat light brown | Packed brown, wheel ruts | Warm ochre, stone-lined edges |
| GRA-PA-02 | Dirt road (straight V) | Flat light brown | Packed brown, wheel ruts | Warm ochre, stone-lined edges |
| GRA-PA-03 | Dirt road (corner) | Brown curve | Rutted curve, mud puddle | Stone-edged curve, flower border |
| GRA-PA-04 | Dirt road (T-junction) | Brown T | Junction with worn center | Stone-paved junction |
| GRA-PA-05 | Dirt road (crossroads) | Brown cross | Crossroads, milestone post | Paved crossroads, signpost |
| GRA-PA-06 | Bridge (small, wood) | Gray planks | Weathered wood, simple rails | Painted rails, flower box |

### Autotile: Grass-to-Dirt (Row 4-9)

| ID | Name | Description |
|----|------|-------------|
| GRA-AT-01 | Grass-dirt autotile | 47-tile blob set. Inner: grass (GRA-GR-01). Outer: dirt/path (GRA-GR-07). Gradual transition with grass blades thinning at edge. |
| GRA-AT-02 | Grass-wheat autotile | 47-tile blob set. Inner: wheat (GRA-GR-04). Outer: grass (GRA-GR-01). Edge shows wheat thinning into grass. |

### Decoration Tiles (Row 10-11)

| ID | Name | Muted | Normal | Vivid |
|----|------|-------|--------|-------|
| GRA-DE-01 | Fence post | Simple pale post | Whitewashed post, wire strands | Painted post, climbing vine |
| GRA-DE-02 | Hay bale | Pale flat cylinder | Golden cylinder, straw texture | Deep gold, bird perched on top |
| GRA-DE-03 | Scarecrow | Bare stick frame | Dressed scarecrow, hat | Decorated scarecrow, birds nearby ignoring it |
| GRA-DE-04 | Windmill | Pale structure, still sails | Warm wood, slowly turning sails | Rich painted wood, spinning sails (animated) |
| GRA-DE-05 | Water trough | Gray basin | Wood trough, clear water | Decorated trough, butterflies at water |
| GRA-DE-06 | Crop marker | Simple stick | Small sign with crop name | Decorative marker with fruit icon |
| GRA-DE-07 | Flower cluster | None (blank) | Small flower patch | Abundant wildflower explosion |
| GRA-DE-08 | Beehive | None (blank) | Simple box hive | Active hive, visible bees |

### Obstacle Tiles (Row 12-13)

| ID | Name | Muted | Normal | Vivid |
|----|------|-------|--------|-------|
| GRA-OB-01 | Farmstead wall | Pale wood, minimal | Painted wood, flower boxes | Saturated color, hanging baskets, chimney smoke |
| GRA-OB-02 | Farmstead roof | Flat brown | Thatched, golden straw | Deep thatch, bird nests, ivy edges |
| GRA-OB-03 | Fence (rail) | Simple posts and rail | Whitewashed rail fence | Vine-draped fence, gate hardware |
| GRA-OB-04 | Boulder | Flat gray lump | Textured gray, moss patch | Gray-green, thick moss, small critter |
| GRA-OB-05 | Tree (deciduous) | Bare trunk, pale bark | Full canopy, bird nests | Fruit-bearing, butterflies, dappled shadow |
| GRA-OB-06 | Tree (small/bush) | Sparse pale shrub | Medium green bush | Dense flowering bush |
| GRA-OB-07 | Stream bank | Flat pale line | Sandy bank, small reeds | Wildflower-lined bank, smooth stones |

### Animated Tiles (Row 14-16)

| ID | Name | Frames | Speed | Description |
|----|------|--------|-------|-------------|
| GRA-AN-01 | Wheat sway | 4 | 250ms/frame | Wheat field gentle wind animation |
| GRA-AN-02 | Stream flow | 4 | 200ms/frame | Small stream ripple and flow |
| GRA-AN-03 | Windmill sails | 4 | 300ms/frame | Rotating windmill blades |
| GRA-AN-04 | Butterfly flight | 3 | 350ms/frame | Butterfly path over crops |
| GRA-AN-05 | Campfire | 4 | 200ms/frame | Small farmstead campfire |

---

## Biome 3: Forest

**Used by**: Ambergrove (40x40), Flickerveil (50x50), Half-Drawn Forest (40x40)
**Sheet dimensions**: 16 x 18 tiles (512 x 576 pixels) per tier
**Total unique tiles**: 64 per tier (192 across all three tiers)

### Ground Tiles (Row 1-2)

| ID | Name | Muted | Normal | Vivid |
|----|------|-------|--------|-------|
| FOR-GR-01 | Forest floor (primary) | Flat gray-brown (#C8B89C) | Leaf litter, moss patches, root textures | Dense undergrowth, mushrooms, fallen logs |
| FOR-GR-02 | Forest floor (variant A) | Slightly darker brown | Acorn scatter, twig details | Fern fronds, visible insects |
| FOR-GR-03 | Forest floor (variant B) | Brown with faint root lines | Root network visible, moss between | Thick moss carpet, bioluminescent spots (#66CDAA faint glow) |
| FOR-GR-04 | Clearing grass | Pale sage, sparse | Medium green, small wildflowers | Lush meadow, butterfly clouds |
| FOR-GR-05 | Mossy stone | Pale gray slab | Gray-green, moss creeping | Thick moss blanket, mushroom clusters |
| FOR-GR-06 | Fallen leaves | Flat beige | Multi-color leaves (amber, red, brown) | Dense leaf carpet, decomposing beautifully |
| FOR-GR-07 | Tree root surface | Pale raised lines | Visible gnarled roots, dirt between | Thick roots with moss, small creatures |

### Path Tiles (Row 3)

| ID | Name | Muted | Normal | Vivid |
|----|------|-------|--------|-------|
| FOR-PA-01 | Forest trail (H) | Barely visible flattened area | Clear dirt path, leaf-edged | Mossy stone stepping path, fern borders |
| FOR-PA-02 | Forest trail (V) | Barely visible flattened area | Clear dirt path, leaf-edged | Mossy stone stepping path, fern borders |
| FOR-PA-03 | Forest trail (corner) | Faint curve | Leaf-strewn turn | Stepping stone curve, mushroom ring |
| FOR-PA-04 | Elevated tree-bridge | Pale plank, unstable look | Sturdy wooden walkway, rope rails | Ornate bridge, carved rails, hanging lanterns |
| FOR-PA-05 | Stepping stones (water) | Flat gray dots in pale blue | Mossy stones in clear water | Carved stones, glowing runes, fish below |

### Autotile: Forest Floor-to-Clearing (Row 4-9)

| ID | Name | Description |
|----|------|-------------|
| FOR-AT-01 | Floor-clearing autotile | 47-tile blob set. Inner: forest floor (FOR-GR-01). Outer: clearing grass (FOR-GR-04). Edge shows undergrowth thinning into open grass. |
| FOR-AT-02 | Floor-water autotile | 47-tile blob set. Inner: forest floor (FOR-GR-01). Outer: lake water. Edge shows muddy shore with reeds. |

### Decoration Tiles (Row 10-12)

| ID | Name | Muted | Normal | Vivid |
|----|------|-------|--------|-------|
| FOR-DE-01 | Mushroom cluster | Pale gray caps | Brown/red caps, visible gills | Vivid colors, bioluminescent glow |
| FOR-DE-02 | Fallen log | Pale gray cylinder | Brown log, bark texture, moss | Moss-covered, fern growing from crack, insects |
| FOR-DE-03 | Resonance Stone (forest) | Dull gray pillar | Softly humming, faint amber glow | Bright pulsing amber, floating memory particles |
| FOR-DE-04 | Standing stone (non-resonance) | Gray slab | Carved stone, lichen | Ancient carved stone, ivy, readable runes |
| FOR-DE-05 | Bird nest | None (blank) | Small nest in branch | Active nest, eggs/chicks visible |
| FOR-DE-06 | Wildflower patch | Faint pale dots | Colorful flower cluster | Abundant blooms, bees hovering |
| FOR-DE-07 | Spider web | Faint gray lines | Visible web between branches | Dew-covered web, prismatic light |
| FOR-DE-08 | Hollow stump | Flat gray circle | Detailed stump, dark center | Fairy-ring around stump, glowing center |
| FOR-DE-09 | Wooden sign (trail marker) | Bare post | Carved directional sign | Ornate carved sign, painted lettering |
| FOR-DE-10 | Camp remnants | Bare stone ring | Old campfire, log seats | Active fire glow, cooking pot, bedroll |

### Obstacle Tiles (Row 13-14)

| ID | Name | Muted | Normal | Vivid |
|----|------|-------|--------|-------|
| FOR-OB-01 | Tree trunk (deciduous, large) | Bare trunk silhouette | Full bark texture, branches | Lush canopy edge, nesting birds |
| FOR-OB-02 | Tree trunk (deciduous, small) | Thin bare trunk | Slender trunk, small canopy | Flowering small tree, butterflies |
| FOR-OB-03 | Tree trunk (conifer) | Dark silhouette | Green needles, visible branches | Deep green, pinecones, sap gleam |
| FOR-OB-04 | Tree canopy (top) | Pale green mass | Layered green canopy | Multi-shade lush canopy, blossoms |
| FOR-OB-05 | Dense undergrowth | Pale tangled lines | Thick green underbrush | Impassable verdant wall, flowers |
| FOR-OB-06 | Boulder (forest) | Flat gray | Mossy gray, rounded | Thick moss, small waterfall over surface |
| FOR-OB-07 | Rock outcrop | Pale gray edge | Visible strata, lichen | Mineral veins, crystal inlays |
| FOR-OB-08 | Fallen tree (blocking) | Pale horizontal line | Large fallen trunk, bark detail | Moss garden on trunk, new growth |

### Animated Tiles (Row 15-18)

| ID | Name | Frames | Speed | Description |
|----|------|--------|-------|-------------|
| FOR-AN-01 | Canopy light (dappled) | 4 | 300ms/frame | Light patches shifting on ground |
| FOR-AN-02 | Lake/pond ripple | 4 | 250ms/frame | Water surface gentle movement |
| FOR-AN-03 | Fireflies | 4 | 400ms/frame | Floating bioluminescent points (Vivid only, blank in Muted/Normal) |
| FOR-AN-04 | Swaying branches | 3 | 350ms/frame | Tree branch gentle movement |
| FOR-AN-05 | Dragonfly | 3 | 200ms/frame | Dragonfly over water (Normal/Vivid only) |
| FOR-AN-06 | Memory motes (resonance) | 4 | 300ms/frame | Amber particles drifting near Resonance Stones |

---

## Biome 4: Mountain/Highland

**Used by**: Hollow Ridge (50x50), Undrawn Peaks (40x40)
**Sheet dimensions**: 16 x 16 tiles (512 x 512 pixels) per tier
**Total unique tiles**: 56 per tier (168 across all three tiers)

### Ground Tiles (Row 1-2)

| ID | Name | Muted | Normal | Vivid |
|----|------|-------|--------|-------|
| MTN-GR-01 | Rock face (flat) | Flat gray (#C0BAB0) | Textured gray, striations, lichen | Warm stone, mineral veins, crystal inlays |
| MTN-GR-02 | Rock face (variant) | Slightly darker gray | Different striation pattern | Different mineral vein colors |
| MTN-GR-03 | Alpine grass | Short, pale (#B8C4A0) | Wind-blown medium green | Vivid green tufts, alpine flowers |
| MTN-GR-04 | Gravel/scree | Flat gray dots | Loose rock, multiple sizes | Warm-toned gravel, lichen patches |
| MTN-GR-05 | Snow/ice | Flat white (#F5F0E6) | Textured snow, blue shadows | Sparkling snow, ice crystals catching light |
| MTN-GR-06 | Ledge surface | Flat gray strip | Carved ledge, chisel marks | Smooth carved stone, prayer offerings |
| MTN-GR-07 | Cave floor (interior) | Dark gray flat | Damp stone, puddle reflections | Glowing crystal formations, stalactite shadows |

### Path Tiles (Row 3)

| ID | Name | Muted | Normal | Vivid |
|----|------|-------|--------|-------|
| MTN-PA-01 | Switchback trail (H) | Barely visible ledge | Clear trail, cairn markers | Stone-paved path, iron handrails |
| MTN-PA-02 | Switchback trail (V) | Barely visible ledge | Clear trail, cairn markers | Stone-paved path, iron handrails |
| MTN-PA-03 | Switchback (corner) | Faint ledge turn | Cairn at corner | Carved stone turn, prayer flags |
| MTN-PA-04 | Rope bridge | Pale gray lines | Functional rope bridge, wooden planks | Sturdy bridge, prayer flag streamers |
| MTN-PA-05 | Stairway (carved) | Faint step outlines | Weathered carved steps | Ornate steps, handrail, torches |

### Autotile: Rock-to-Grass (Row 4-9)

| ID | Name | Description |
|----|------|-------------|
| MTN-AT-01 | Rock-grass autotile | 47-tile blob set. Inner: rock (MTN-GR-01). Outer: alpine grass (MTN-GR-03). Edge shows grass tufts growing from rock cracks. |
| MTN-AT-02 | Rock-snow autotile | 47-tile blob set. Inner: snow (MTN-GR-05). Outer: rock (MTN-GR-01). Edge shows snow drift lines. |

### Decoration Tiles (Row 10-11)

| ID | Name | Muted | Normal | Vivid |
|----|------|-------|--------|-------|
| MTN-DE-01 | Cairn (trail marker) | Rough stone pile | Stacked cairn, stable | Decorated cairn, prayer ties |
| MTN-DE-02 | Shrine (mountain) | Broken stone rubble | Weathered but intact structure | Restored shrine, glowing runes, offerings |
| MTN-DE-03 | Wind-carved rock | Smooth pale stone | Interesting erosion shapes | Dramatic wind-carved arch, crystal inlays |
| MTN-DE-04 | Ice formation | Flat white patch | Visible icicles, blue tint | Prismatic ice, rainbow refractions |
| MTN-DE-05 | Alpine flower | None (blank) | Small hardy flower | Cluster of vivid alpine blooms |
| MTN-DE-06 | Eagle nest | None (blank) | Large stick nest on ledge | Active nest, eagle present (Vivid only) |
| MTN-DE-07 | Crystal outcrop | Dull gray lump | Pale blue crystal points | Bright pulsing crystal, light refractions |
| MTN-DE-08 | Prayer flags | None (blank) | Faded cloth on rope | Vibrant multicolor flags, fluttering |

### Obstacle Tiles (Row 12-13)

| ID | Name | Muted | Normal | Vivid |
|----|------|-------|--------|-------|
| MTN-OB-01 | Cliff face (impassable) | Flat dark gray wall | Textured cliff, strata visible | Rich cliff with waterfalls, vegetation |
| MTN-OB-02 | Boulder (large) | Flat gray mass | Textured boulder, lichen | Warm stone, moss, small cave behind |
| MTN-OB-03 | Rockslide debris | Gray scattered lumps | Identifiable broken rock | Overgrown rubble, ferns emerging |
| MTN-OB-04 | Cave entrance | Dark hole in gray | Visible depth, stalactites | Glowing interior light, crystal formations |
| MTN-OB-05 | Frozen waterfall | White vertical strip | Ice cascade, blue tint | Prismatic ice, slowly melting streams |
| MTN-OB-06 | Mountain tree (pine) | Dark conifer silhouette | Weathered pine, snow-dusted | Full vivid pine, birds, snow sparkle |

### Animated Tiles (Row 14-16)

| ID | Name | Frames | Speed | Description |
|----|------|--------|-------|-------------|
| MTN-AN-01 | Wind dust | 4 | 200ms/frame | Dust particles blowing across rock |
| MTN-AN-02 | Snow fall | 4 | 300ms/frame | Gentle snowflakes drifting (Muted: sparse, Vivid: dense sparkle) |
| MTN-AN-03 | Waterfall cascade | 4 | 200ms/frame | Waterfall animation on cliff face |
| MTN-AN-04 | Prayer flag flutter | 3 | 350ms/frame | Cloth flags in wind (Normal/Vivid only) |
| MTN-AN-05 | Crystal pulse | 3 | 500ms/frame | Crystal outcrop glow pulse (Vivid only, blank otherwise) |

---

## Biome 5: Riverside/Water

**Used by**: Millbrook (40x40)
**Sheet dimensions**: 16 x 16 tiles (512 x 512 pixels) per tier
**Total unique tiles**: 60 per tier (180 across all three tiers)

### Ground Tiles (Row 1-2)

| ID | Name | Muted | Normal | Vivid |
|----|------|-------|--------|-------|
| RIV-GR-01 | Riverbank (earth) | Flat mud-brown | Sandy brown, visible texture | Rich earth, smooth river stones |
| RIV-GR-02 | Riverbank (sandy) | Pale tan | Golden sand, wave marks | Warm sand, shells, driftwood |
| RIV-GR-03 | River water (shallow) | Flat pale blue (#B0C4DE) | Flowing blue (#4A8CB8), ripple lines | Deep blue-green (#2878A8), sparkling surface |
| RIV-GR-04 | River water (deep) | Darker pale blue | Dark flowing blue, white crests | Deep blue, fish shadows visible |
| RIV-GR-05 | River water (rapids) | Choppy pale lines | White water, foam patches | Dramatic rapids, rainbow spray |
| RIV-GR-06 | Cobblestone (town) | Pale gray | Warm stone, mortar visible | Rich stone, puddle reflections |
| RIV-GR-07 | Grass (riverbank) | Pale sage | Medium green, river-edge reeds | Lush green, wildflowers, dragonflies |

### Path Tiles (Row 3)

| ID | Name | Muted | Normal | Vivid |
|----|------|-------|--------|-------|
| RIV-PA-01 | Stone road (H) | Flat gray | Warm flagstone, joints | Polished stone, flower-lined |
| RIV-PA-02 | Stone road (V) | Flat gray | Warm flagstone, joints | Polished stone, flower-lined |
| RIV-PA-03 | Bridge deck (stone) | Gray slab | Warm stone, railings, arches | Decorated stone, flower garlands, lanterns |
| RIV-PA-04 | Bridge deck (wood) | Gray planks | Weathered wood, rope rails | Painted wood, hanging baskets |
| RIV-PA-05 | Dock planks | Bare wood | Weathered dock, rope coils | Painted planks, moored boat tie |
| RIV-PA-06 | Stepping stones (river) | Gray dots in pale water | Mossy stones in clear water | Carved flat stones, fish between |

### Autotile: Water-to-Bank (Row 4-9)

| ID | Name | Description |
|----|------|-------------|
| RIV-AT-01 | Water-bank autotile | 47-tile blob set. Inner: river water (RIV-GR-03). Outer: riverbank earth (RIV-GR-01). Edge shows lapping water line with reeds. |
| RIV-AT-02 | Water-cobble autotile | 47-tile blob set. Inner: water (RIV-GR-03). Outer: town cobblestone (RIV-GR-06). Edge shows stone quay with iron rings. |

### Decoration Tiles (Row 10-11)

| ID | Name | Muted | Normal | Vivid |
|----|------|-------|--------|-------|
| RIV-DE-01 | Reeds/cattails | Sparse pale stalks | Medium clusters, natural brown | Dense, flowering, swaying |
| RIV-DE-02 | Moored boat | Gray hull outline | Painted boat, oars stowed | Colorful boat, fishing nets, name painted |
| RIV-DE-03 | Fishing rod | Bare pole | Rod with line in water | Decorated rod, bobber visible, fish nibbling |
| RIV-DE-04 | Crate/barrel (dockside) | Plain wood boxes | Stacked crates, branded | Colorful cargo, exotic goods |
| RIV-DE-05 | Bridge lantern | None (blank) | Simple bridge lamp | Ornate lantern, warm glow, moth circling |
| RIV-DE-06 | Lily pads | None (blank) | Green pads on water | Flowering pads, frog sitting |
| RIV-DE-07 | Waterwheel | Gray circle | Turning wooden wheel | Rich painted wheel, splashing water |
| RIV-DE-08 | Town sign (hanging) | Bare bracket | Painted shop sign | Ornate carved sign, gilt lettering |
| RIV-DE-09 | Flower garland | None (blank) | None (blank) | Festive garland across street/bridge |

### Obstacle Tiles (Row 12-13)

| ID | Name | Muted | Normal | Vivid |
|----|------|-------|--------|-------|
| RIV-OB-01 | Town building wall | Pale plaster, small windows | Warm plaster, window boxes | Saturated facades, balconies, hanging signs |
| RIV-OB-02 | Town roof (tile) | Flat gray | Warm terracotta overlap | Deep red, mossy edges, chimney smoke |
| RIV-OB-03 | Stone quay wall | Flat gray block | Textured stone, iron rings | Mossy stone, carved details |
| RIV-OB-04 | Waterfall rock | Pale gray wall | Wet dark rock, mist | Dramatic cascade, prismatic spray |
| RIV-OB-05 | Bridge pillar | Gray column | Stone column, archway | Decorated column, carved reliefs |
| RIV-OB-06 | Willow tree | Pale drooping lines | Green curtain branches | Lush trailing branches, golden light through |

### Animated Tiles (Row 14-16)

| ID | Name | Frames | Speed | Description |
|----|------|--------|-------|-------------|
| RIV-AN-01 | River flow | 4 | 200ms/frame | Water current animation (all tiers) |
| RIV-AN-02 | Waterfall cascade | 4 | 200ms/frame | Vertical water animation |
| RIV-AN-03 | Fish splash | 3 | 600ms/frame | Fish breaking surface (Normal/Vivid only) |
| RIV-AN-04 | Waterwheel turn | 4 | 300ms/frame | Mill wheel rotation |
| RIV-AN-05 | Reflection shimmer | 4 | 350ms/frame | Water reflection distortion |
| RIV-AN-06 | Rainbow in mist | 3 | 500ms/frame | Prismatic arc near waterfall (Vivid only) |

---

## Biome 6: Wetland/Marsh

**Used by**: Shimmer Marsh (50x50)
**Sheet dimensions**: 16 x 16 tiles (512 x 512 pixels) per tier
**Total unique tiles**: 56 per tier (168 across all three tiers)

### Ground Tiles (Row 1-2)

| ID | Name | Muted | Normal | Vivid |
|----|------|-------|--------|-------|
| WET-GR-01 | Marsh ground (primary) | Flat mud-gray (#A09888) | Spongy brown-green, puddle reflections | Rich dark earth, vibrant moss, glowing fungi |
| WET-GR-02 | Marsh ground (wet) | Darker gray with sheen | Mud with standing water, squelch texture | Iridescent wet earth, memory reflections |
| WET-GR-03 | Shallow pool | Gray, opaque | Semi-transparent blue-green (#4A8CB8) | Crystal pool reflecting memories (shimmer effect) |
| WET-GR-04 | Deep pool | Dark gray | Dark blue-green, still | Bioluminescent depths, dissolved memories visible |
| WET-GR-05 | Moss carpet | Pale gray-green | Rich green moss, star patterns | Thick bioluminescent moss (#66CDAA glow) |
| WET-GR-06 | Peat/bog | Dark flat brown | Spongy dark brown, air bubbles | Rich loam, gas wisps, vivid growth |

### Path Tiles (Row 3)

| ID | Name | Muted | Normal | Vivid |
|----|------|-------|--------|-------|
| WET-PA-01 | Boardwalk (H) | Rotting gray planks | Sturdy wooden walkway, nail heads | Ornate walkway, lanterns, safe rails |
| WET-PA-02 | Boardwalk (V) | Rotting gray planks | Sturdy wooden walkway | Ornate walkway with lanterns |
| WET-PA-03 | Boardwalk (corner) | Rotting corner planks | Corner with support posts | Decorated corner, hanging basket |
| WET-PA-04 | Stepping mounds | Pale raised dots | Mossy raised earth patches | Firm moss mounds, glowing border |
| WET-PA-05 | Root bridge | Pale tangled lines | Woven root bridge, stable | Living root bridge, flowers growing |

### Autotile: Marsh-to-Water (Row 4-9)

| ID | Name | Description |
|----|------|-------------|
| WET-AT-01 | Marsh-pool autotile | 47-tile blob set. Inner: shallow pool (WET-GR-03). Outer: marsh ground (WET-GR-01). Edge shows reeds and mud transition. |
| WET-AT-02 | Marsh-moss autotile | 47-tile blob set. Inner: moss carpet (WET-GR-05). Outer: marsh ground (WET-GR-01). Edge shows moss creeping across mud. |

### Decoration Tiles (Row 10-11)

| ID | Name | Muted | Normal | Vivid |
|----|------|-------|--------|-------|
| WET-DE-01 | Reeds (tall) | Sparse pale stalks | Medium cluster, natural brown-green | Dense, flowering tips, bioluminescent |
| WET-DE-02 | Marsh flower | None (blank) | Small floating bloom | Large luminous bloom on pad |
| WET-DE-03 | Stilted hut (detail) | Bare frame on stilts | Thatched roof, rope bridges | Decorated hut, glowing windows, wind chimes |
| WET-DE-04 | Hanging moss | Pale gray strands | Green Spanish moss | Thick moss, orchids, fireflies within |
| WET-DE-05 | Frog on lily pad | None (blank) | Small frog on green pad | Vivid frog, glowing eyes, large flowering pad |
| WET-DE-06 | Mist wisp | Faint gray smudge | White wisp of fog | Golden memory-mote haze |
| WET-DE-07 | Fallen column | Gray lump | Visible ruins, carved patterns | Moss-covered ancient column, readable glyphs |
| WET-DE-08 | Gas vent | None (blank) | Bubble plume from ground | Bioluminescent gas column |

### Obstacle Tiles (Row 12-13)

| ID | Name | Muted | Normal | Vivid |
|----|------|-------|--------|-------|
| WET-OB-01 | Mangrove trunk | Bare root system lines | Thick roots, dark bark | Lush roots, epiphytes, orchids |
| WET-OB-02 | Mangrove canopy | Pale green mass | Green canopy, hanging moss | Rich canopy, birds, fireflies nesting |
| WET-OB-03 | Dense cattails | Pale wall of stalks | Thick cattail barrier | Impassable reed wall, insects |
| WET-OB-04 | Sunken ruin wall | Gray underwater edge | Visible masonry below water | Rich ruin, coral growth, fish |
| WET-OB-05 | Bog boulder | Dark flat lump | Mossy rounded stone | Carved stone, ancient face, moss beard |

### Animated Tiles (Row 14-16)

| ID | Name | Frames | Speed | Description |
|----|------|--------|-------|-------------|
| WET-AN-01 | Pool ripple | 4 | 250ms/frame | Water surface gentle movement |
| WET-AN-02 | Mist drift | 4 | 400ms/frame | Fog bank slowly shifting |
| WET-AN-03 | Fireflies | 4 | 500ms/frame | Floating green-gold lights (Normal/Vivid) |
| WET-AN-04 | Bubble plume | 3 | 300ms/frame | Gas bubbles rising from ground |
| WET-AN-05 | Bioluminescent pulse | 3 | 600ms/frame | Moss/fungi glow pulse (Vivid only) |

---

## Biome 7: Plains

**Used by**: Resonance Fields (50x50)
**Sheet dimensions**: 16 x 14 tiles (512 x 448 pixels) per tier
**Total unique tiles**: 48 per tier (144 across all three tiers)

### Ground Tiles (Row 1-2)

| ID | Name | Muted | Normal | Vivid |
|----|------|-------|--------|-------|
| PLN-GR-01 | Open grass (primary) | Flat pale green, featureless (#B8C4A0) | Rolling green (#5C8C3C), individual blades | Tall vivid grass (#2E8B2E), wildflower seas |
| PLN-GR-02 | Open grass (variant A) | Slightly different shade | Taller grass, seed heads | Abundant wildflowers, seed puffs |
| PLN-GR-03 | Open grass (variant B) | Pale with bare patches | Clover meadow | Dense flower carpet, butterflies |
| PLN-GR-04 | Bare earth (wind-swept) | Flat pale tan | Hard-packed dirt, wind scoring | Warm earth, scattered stones, hardy flowers |
| PLN-GR-05 | Stone platform | Flat gray slab | Carved flat stone, rune borders | Glowing rune-carved platform |

### Path Tiles (Row 3)

| ID | Name | Muted | Normal | Vivid |
|----|------|-------|--------|-------|
| PLN-PA-01 | Worn trail (H) | Barely visible flattened grass | Clear path between grass | Glowing amber path (#DAA520 faint) connecting stones |
| PLN-PA-02 | Worn trail (V) | Barely visible | Clear path | Glowing amber path |
| PLN-PA-03 | Worn trail (corner) | Faint curve | Path curve | Amber-glowing curve |
| PLN-PA-04 | Stone circle path | Gray arc segment | Carved stone path segment | Rune-lit stone arc |

### Autotile: Grass-to-Stone (Row 4-9)

| ID | Name | Description |
|----|------|-------------|
| PLN-AT-01 | Grass-stone autotile | 47-tile blob set. Inner: stone platform (PLN-GR-05). Outer: open grass (PLN-GR-01). Edge shows grass growing against carved stone edge. |

### Decoration Tiles (Row 10-11)

| ID | Name | Muted | Normal | Vivid |
|----|------|-------|--------|-------|
| PLN-DE-01 | Resonance Stone (small) | Gray monolith, silent | Softly humming, amber runes | Pulsing bright amber (#DAA520), floating particles |
| PLN-DE-02 | Resonance Stone (large) | Tall gray monolith | Glowing rune-carved pillar | Brilliant amber pillar, memory column rising |
| PLN-DE-03 | Resonance Stone (broken) | Scattered gray chunks | Cracked stone, faint glow | Fragments still glowing, reconnecting energy arcs |
| PLN-DE-04 | Tent (camp) | Bare frame | Functional tent, campfire | Colorful tent, banners, bustling area |
| PLN-DE-05 | Campfire | None (blank) | Small fire, log seats | Roaring fire, cooking pot, lanterns |
| PLN-DE-06 | Wind-bent grass | None (blank) | Grass leaning in wind | Dramatic grass waves, floating seeds |
| PLN-DE-07 | Stone circle fragment | Gray stone arc | Partial stone ring, ancient | Complete visible ring, ambient glow |

### Obstacle Tiles (Row 12)

| ID | Name | Muted | Normal | Vivid |
|----|------|-------|--------|-------|
| PLN-OB-01 | Massive Resonance Stone | Tall gray wall | Imposing carved stone, deep glow | Brilliant stone, visible sound waves emanating |
| PLN-OB-02 | Rock formation | Gray lumps | Weathered stone cluster | Crystal-veined formation, grass between |
| PLN-OB-03 | Thorn bush | Pale spiky mass | Dense thorny shrub | Flowering thorns, bees, impenetrable |

### Animated Tiles (Row 13-14)

| ID | Name | Frames | Speed | Description |
|----|------|--------|-------|-------------|
| PLN-AN-01 | Grass wave | 4 | 300ms/frame | Wind flowing through tall grass |
| PLN-AN-02 | Resonance hum | 3 | 500ms/frame | Amber glow pulsing on Resonance Stones |
| PLN-AN-03 | Floating seeds | 4 | 400ms/frame | Dandelion seeds drifting (Normal/Vivid) |
| PLN-AN-04 | Memory column | 4 | 350ms/frame | Amber particle stream rising from large stones (Vivid) |

---

## Biome 8: Dungeon/Underground

**Used by**: Depths Levels 1-5, Preserver Fortress
**Sheet dimensions**: 16 x 16 tiles (512 x 512 pixels) per tier
**Total unique tiles**: 60 per tier (180 across all three tiers)

### Ground Tiles (Row 1-2)

| ID | Name | Muted | Normal | Vivid |
|----|------|-------|--------|-------|
| DUN-GR-01 | Stone floor (primary) | Flat dark gray | Worn tiles, dust patterns | Ornate tiles, dissolved civilization patterns |
| DUN-GR-02 | Stone floor (variant A) | Darker gray, cracks | Different tile pattern, moss in cracks | Inlaid mosaic, amber grout |
| DUN-GR-03 | Stone floor (variant B) | Uneven dark gray | Flagstone, water stains | Polished stone, reflective surface |
| DUN-GR-04 | Wet floor | Dark gray with sheen | Visible puddle, ripple texture | Bioluminescent puddle, memory reflections |
| DUN-GR-05 | Cave floor (natural) | Rough dark surface | Stalagmite stubs, uneven | Crystal-studded natural floor, ambient glow |
| DUN-GR-06 | Submerged floor | Dark blue-gray | Visible through shallow water | Bioluminescent water over ornate tiles |
| DUN-GR-07 | Rubble floor | Gray scattered chunks | Identifiable ruins: broken pottery, pillars | Rich ruins, readable inscriptions, intact murals |

### Path Tiles (Row 3)

| ID | Name | Muted | Normal | Vivid |
|----|------|-------|--------|-------|
| DUN-PA-01 | Corridor (straight H) | Dark gray strip | Worn stone corridor, torch brackets | Ornate corridor, glowing rune borders |
| DUN-PA-02 | Corridor (straight V) | Dark gray strip | Worn stone corridor | Ornate corridor, glowing runes |
| DUN-PA-03 | Corridor (corner) | Dark gray turn | Worn stone corner | Carved corner, decorative column |
| DUN-PA-04 | Stairway (down) | Dark rectangle | Carved steps descending | Ornate steps, rune-lit handrails |
| DUN-PA-05 | Stairway (up) | Dark rectangle, lighter center | Carved steps ascending | Ornate steps, light from above |
| DUN-PA-06 | Memory lift platform | Gray circle | Carved circular platform, faint glow | Brilliant amber platform, active particles |

### Autotile: Floor-to-Wall (Row 4-9)

| ID | Name | Description |
|----|------|-------------|
| DUN-AT-01 | Floor-wall autotile | 47-tile blob set. Inner: stone wall (DUN-OB-01). Outer: stone floor (DUN-GR-01). Edge shows wall base molding and floor transition. |
| DUN-AT-02 | Floor-water autotile | 47-tile blob set. Inner: submerged floor (DUN-GR-06). Outer: dry floor (DUN-GR-01). Edge shows water lapping at stone. |

### Decoration Tiles (Row 10-11)

| ID | Name | Muted | Normal | Vivid |
|----|------|-------|--------|-------|
| DUN-DE-01 | Torch (wall-mounted) | Dim, barely visible | Warm flickering amber (#DAA520) | Bright amber, dynamic shadow casting |
| DUN-DE-02 | Chest (wooden) | Simple dark box | Detailed chest, metal bands | Glowing chest, memory energy leaking |
| DUN-DE-03 | Chest (ornate) | Dark box with faint outline | Iron-banded chest, lock visible | Rune-covered chest, amber aura |
| DUN-DE-04 | Broken pottery | Dark shards | Identifiable vessel fragments | Reconstructible vessel, visible original colors |
| DUN-DE-05 | Fallen pillar | Dark cylinder | Carved column section, runes | Intact runes, faint glow, moss growing |
| DUN-DE-06 | Dissolved memory deposit | Faint amber shimmer | Visible amber veins in wall | Bright amber geodes, pulsing memory light |
| DUN-DE-07 | Bookshelf (ruined) | Dark rectangle | Visible books, some legible | Intact shelves, glowing tomes |
| DUN-DE-08 | Altar/pedestal | Gray block | Carved stone pedestal | Ornate altar, active glow, offering space |
| DUN-DE-09 | Chain/shackle (wall) | Dark line | Rusty iron chains | Broken chains, story implication |
| DUN-DE-10 | Mural (wall) | Dark flat section | Faded painted wall section | Vivid restored mural, narrative scene |

### Obstacle Tiles (Row 12-13)

| ID | Name | Muted | Normal | Vivid |
|----|------|-------|--------|-------|
| DUN-OB-01 | Stone wall | Dark gray, flat | Textured stone, cracks, moisture | Rich stone, mineral veins, crystal inlays |
| DUN-OB-02 | Stone wall (carved) | Dark gray with faint lines | Carved relief patterns | Vivid carved scenes, amber-lit grooves |
| DUN-OB-03 | Column (intact) | Dark cylinder | Carved column, capital details | Ornate column, glowing rune bands |
| DUN-OB-04 | Door (wooden) | Dark rectangle | Wooden door, iron studs | Ornate door, glowing lock runes |
| DUN-OB-05 | Door (iron) | Dark rectangle | Heavy iron door, rivets | Rune-etched iron, amber glow at seams |
| DUN-OB-06 | Gate (barred) | Dark vertical lines | Iron bars, lock mechanism | Rune-locked gate, visible energy barrier |
| DUN-OB-07 | Stalactite/stalagmite | Dark pointed shapes | Crystal-tipped formations | Luminous crystal formations, ambient glow |
| DUN-OB-08 | Collapsed passage | Dark rubble pile | Identifiable collapse, dust | Ancient collapse, plants growing through |

### Animated Tiles (Row 14-16)

| ID | Name | Frames | Speed | Description |
|----|------|--------|-------|-------------|
| DUN-AN-01 | Torch flicker | 4 | 200ms/frame | Wall torch flame animation |
| DUN-AN-02 | Dripping water | 3 | 400ms/frame | Water drip from ceiling |
| DUN-AN-03 | Memory deposit pulse | 3 | 500ms/frame | Amber vein glow cycle |
| DUN-AN-04 | Pool ripple (underground) | 4 | 300ms/frame | Underground pool surface movement |
| DUN-AN-05 | Crystal shimmer | 3 | 600ms/frame | Crystal formation light refraction |
| DUN-AN-06 | Memory lift glow | 4 | 350ms/frame | Platform activation particle spin |

---

## Biome 9: Sketch

**Used by**: Luminous Wastes (40x40), Undrawn Peaks (40x40), Half-Drawn Forest (40x40)
**Sheet dimensions**: 16 x 16 tiles (512 x 512 pixels) per tier
**Total unique tiles**: 56 per tier (168 across all three tiers)

The Sketch biome is fundamentally different from all other biomes. Instead of three quality levels of the same scene, the three tiers represent three levels of **completion** — from bare line outline to nearly-finished painting.

### Color Palette (Sketch-Specific)

| Role | Muted (Outline) | Normal (Partial Fill) | Vivid (Nearly Complete) |
|------|------------------|-----------------------|------------------------|
| Background | Luminous white (#FFFFF0) | Soft gold wash (#FFF8DC) | Pale blue gradient (#E8F0FF → #FFFFF0) |
| Line work | Warm gray (#A09888) | Warm brown (#8B6D4C) | Dark warm (#5C5040) fading to transparent |
| Fill (vegetation) | None (transparent) | Soft green wash (#B8C4A0 at 50% opacity) | Near-solid green (#5C8C3C at 85% opacity) |
| Fill (water) | None (transparent) | Pale blue wash (#B0C4DE at 50% opacity) | Near-solid blue (#4A8CB8 at 80% opacity) |
| Fill (earth) | None (transparent) | Soft brown wash (#C8B89C at 50% opacity) | Near-solid brown (#8B6D4C at 80% opacity) |
| Shimmer accent | Faint flicker at edges | Moderate shimmer | Subtle edge shimmer only |

### Ground Tiles (Row 1-2)

| ID | Name | Muted (Outline) | Normal (Partial Fill) | Vivid (Nearly Complete) |
|----|------|------------------|-----------------------|------------------------|
| SKT-GR-01 | Ground (primary) | Faint grid lines on luminous white | Brushstroke texture, soft warm color wash | Nearly solid ground, slightly translucent at edges |
| SKT-GR-02 | Ground (variant) | Slightly denser grid | Different brushstroke angle | Different solid pattern |
| SKT-GR-03 | Sketch-grass | Sparse vertical line-strokes (grass suggestion) | Green-washed strokes with dot-cluster flowers | Nearly solid grass, subtle shimmer at blade tips |
| SKT-GR-04 | Sketch-water | Flowing parallel curves | Colored flowing curves with wave wash | Near-solid water with impressionist sparkle |
| SKT-GR-05 | Sketch-rock | Angular geometric outlines | Gradient-filled geometric shapes | Solid rock with visible construction-line edges |
| SKT-GR-06 | Luminous void | Pure featureless glow (#FFFFF0) | Very faint grid emerging | Grid with color beginning to fill |

### Path Tiles (Row 3)

| ID | Name | Muted | Normal | Vivid |
|----|------|-------|--------|-------|
| SKT-PA-01 | Sketch path (H) | Dotted line | Dashed line with color fill | Nearly solid path, luminous border |
| SKT-PA-02 | Sketch path (V) | Dotted line | Dashed line with color fill | Nearly solid path, luminous border |
| SKT-PA-03 | Sketch path (corner) | Dotted curve | Dashed curve with fill | Nearly solid curve |
| SKT-PA-04 | Sketch bridge | Two parallel lines only | Lines with plank outlines between | Nearly solid bridge, translucent rails |

### Autotile: Sketch-Void-to-Filled (Row 4-9)

| ID | Name | Description |
|----|------|-------------|
| SKT-AT-01 | Void-ground autotile | 47-tile blob set. Inner: filled ground (SKT-GR-01). Outer: luminous void (SKT-GR-06). Edge shows line-work fading into nothing. |
| SKT-AT-02 | Ground-water autotile | 47-tile blob set. Inner: sketch-water (SKT-GR-04). Outer: sketch-ground (SKT-GR-01). Edge shows shore lines dissolving into water curves. |

### Decoration Tiles (Row 10-11)

| ID | Name | Muted (Outline) | Normal (Partial Fill) | Vivid (Nearly Complete) |
|----|------|------------------|-----------------------|------------------------|
| SKT-DE-01 | Sketch tree | Single curved trunk line | Trunk + branch outlines + dot-cluster leaves | Full tree silhouette with color, slight shimmer |
| SKT-DE-02 | Sketch bush | Small curved line | Line with green wash interior | Nearly solid bush, edge shimmer |
| SKT-DE-03 | Sketch flower | Small dot/circle | Colored dot with petal lines | Nearly complete flower, faint glow |
| SKT-DE-04 | Sketch fence | Dotted vertical lines | Partial rail outlines | Nearly solid fence, translucent |
| SKT-DE-05 | Sketch building | Blueprint outline only | Partially filled walls, empty windows | Nearly complete building, slightly transparent |
| SKT-DE-06 | Resonance Stone (sketch) | Faint rectangle outline | Half-filled monolith, amber line-glow | Nearly solid stone, active amber glow |
| SKT-DE-07 | Sketch well | Circle outline | Circle with depth lines, blue wash | Nearly complete well, water glint |
| SKT-DE-08 | Active drawing point | Faint flickering line | Line actively extending itself | Color actively filling in (animation) |

### Obstacle Tiles (Row 12-13)

| ID | Name | Muted | Normal | Vivid |
|----|------|-------|--------|-------|
| SKT-OB-01 | Sketch wall (impassable) | Dense line work | Partially filled wall | Nearly solid wall, construction-line edges visible |
| SKT-OB-02 | Sketch mountain (wireframe) | Geometric wireframe triangle | Wireframe + gradient fills | Solid mountain, sketch-line edges remaining |
| SKT-OB-03 | Sketch cliff | Angular line edge | Gradient-filled angular edge | Nearly solid cliff face |
| SKT-OB-04 | Unfinished structure | Blueprint outline, flickering | Half-filled, unstable | Mostly complete, faint shimmer |
| SKT-OB-05 | Void barrier | Faint shimmer line | Visible energy boundary | Clear energy wall, harmonic sound |

### Animated Tiles (Row 14-16)

| ID | Name | Frames | Speed | Description |
|----|------|--------|-------|-------------|
| SKT-AN-01 | Line drawing itself | 4 | 300ms/frame | Construction line extending into void |
| SKT-AN-02 | Color filling in | 4 | 350ms/frame | Wash of color spreading within outline |
| SKT-AN-03 | Edge shimmer | 3 | 400ms/frame | Object edges flickering between solid and outline |
| SKT-AN-04 | Void breathing | 3 | 600ms/frame | Luminous void gently pulsing brightness |
| SKT-AN-05 | Sketch erasure | 4 | 250ms/frame | Lines briefly dissolving and reforming |
| SKT-AN-06 | Memory paint effect | 4 | 200ms/frame | Broadcast-triggered: color rapidly filling an area |

---

## Overlay: Stagnation/Crystal

**Used by**: Applied on top of ANY biome in Stagnation Zones and Preserver Fortress
**Sheet dimensions**: 16 x 10 tiles (512 x 320 pixels)
**Single variant** — stagnation appearance does not change with vibrancy tier

The stagnation overlay is a **separate tile layer** rendered on top of the base biome tileset. It is NOT a separate biome — it modifies the existing biome tiles beneath it.

### Color Palette (Stagnation-Specific)

| Role | Hex | Description |
|------|-----|-------------|
| Crystal primary | #B0C4DE | Cold steel blue |
| Crystal highlight | #E8E8E8 | Near-white ice |
| Crystal shadow | #8090A0 | Cold dark blue-gray |
| Crystal accent | #C8D8F0 | Pale ice blue |
| Desaturation filter | 60% saturation reduction | Applied to base tile visible beneath |
| Frozen animation | All animated tiles freeze to frame 0 | No movement in stagnation zones |

### Overlay Tiles (Row 1-3)

| ID | Name | Description |
|----|------|-------------|
| STG-OV-01 | Crystal ground (full) | Semi-transparent blue-white (#B0C4DE at 70%) crystalline sheet. Base tile visible but desaturated beneath. |
| STG-OV-02 | Crystal ground (thin) | Light frost layer (#E8E8E8 at 40%). Used at zone edges for gradual transition. |
| STG-OV-03 | Crystal ground (cracked) | Post-breaking variant: fractured crystal fragments, warm light bleeding through cracks. |
| STG-OV-04 | Crystal growth (small) | Blue-white crystal formation, 1 tile, sprouting from ground. |
| STG-OV-05 | Crystal growth (medium) | Crystal cluster, 1 tile, taller formation with faceted surfaces. |
| STG-OV-06 | Crystal growth (large) | Massive crystal formation, 2 tiles tall — use bottom tile on ground, top tile above. |
| STG-OV-07 | Frozen object overlay | Prismatic frost coating applied over any decoration tile. Original object visible but ice-encased. |
| STG-OV-08 | Frozen NPC indicator | Blue-tinted grayscale NPC silhouette placeholder. Actual NPC sprite is rendered separately with blue tint shader. |
| STG-OV-09 | Frozen water | Water tile frozen mid-ripple: wave crests turned to ice, surface locked. Replaces animated water tiles. |
| STG-OV-10 | Crystal focal point | Central stagnation object (varies by zone). Large crystal formation with internal glow. 2x2 tiles. |

### Stagnation Border Autotile (Row 4-9)

| ID | Name | Description |
|----|------|-------------|
| STG-AT-01 | Stagnation border autotile | 47-tile blob set. Inner: crystal ground (STG-OV-01). Outer: transparent (base biome shows through). 2-tile-wide transition where normal tiles gradually gain crystal overlay. |

### Stagnation Breaking Animation (Row 10)

| ID | Name | Frames | Speed | Description |
|----|------|--------|-------|-------------|
| STG-AN-01 | Crystal shatter | 6 | 150ms/frame | Crystal fragments flying outward from impact point |
| STG-AN-02 | Warm flood | 4 | 200ms/frame | Golden warmth (#DAA520) spreading to replace blue crystal |
| STG-AN-03 | Thaw effect | 4 | 250ms/frame | Ice melting from objects, water dripping, color returning |

---

## Transition Tiles Between Biomes

Biome transitions occur at map edges and within maps where biomes meet. Each transition is a dedicated autotile set.

### Transition Tileset Overview

| File Name | From Biome | To Biome | Used At |
|-----------|------------|----------|---------|
| `overlay_transition_village_grassland.png` | Village | Grassland | Village Hub → Heartfield |
| `overlay_transition_village_forest.png` | Village | Forest | Village Hub → Ambergrove |
| `overlay_transition_village_riverside.png` | Village | Riverside | Village Hub → Millbrook |
| `overlay_transition_grassland_forest.png` | Grassland | Forest | Heartfield → Ambergrove |
| `overlay_transition_grassland_mountain.png` | Grassland | Mountain | Sunridge → Hollow Ridge |
| `overlay_transition_grassland_marsh.png` | Grassland | Marsh | Heartfield → Shimmer Marsh |
| `overlay_transition_forest_marsh.png` | Forest | Marsh | Flickerveil → Shimmer Marsh |
| `overlay_transition_forest_mountain.png` | Forest | Mountain | Flickerveil → Hollow Ridge |
| `overlay_transition_forest_sketch.png` | Forest | Sketch | Flickerveil → Half-Drawn Forest |
| `overlay_transition_mountain_sketch.png` | Mountain | Sketch | Hollow Ridge → Undrawn Peaks |
| `overlay_transition_marsh_sketch.png` | Marsh | Sketch | Shimmer Marsh → Luminous Wastes |
| `overlay_transition_grassland_plains.png` | Grassland | Plains | Sunridge → Resonance Fields |
| `overlay_transition_plains_marsh.png` | Plains | Marsh | Resonance Fields → Shimmer Marsh |
| `overlay_transition_surface_dungeon.png` | Any surface | Dungeon | All Depths entrances |
| `overlay_transition_sketch_dungeon.png` | Sketch | Dungeon | Sketch Passage → Depths L5 |

### Transition Tile Specification

Each transition tileset contains:

- **16 x 6 tiles (512 x 192 pixels)** per tier
- **47-tile autotile blob set** for smooth blending
- Inner tiles: destination biome ground tile
- Outer tiles: source biome ground tile
- Edge pixels: 4-pixel gradient blend between biome palettes

### Transition Design Rules

1. **Color blending**: The 4-pixel edge uses a linear gradient between the two biomes' ground colors for the current tier
2. **Texture blending**: Vegetation thins/changes gradually (grass → forest floor shows grass blades becoming sparser as leaf litter increases)
3. **No hard lines**: Every transition must be visually smooth at the tile boundary
4. **Tier consistency**: Transitions exist for all three tiers — Muted Village-to-Muted Grassland, Normal-to-Normal, Vivid-to-Vivid
5. **Sketch transitions are special**: The "from" biome fades from solid into line-work. Trees become outlines over 3-4 transition tiles. Ground texture dissolves into sketch grid-lines.

---

## Tile Count Summary

| Biome | Tiles Per Tier | Animated Tiles | Autotile Sets | Total (3 tiers) |
|-------|---------------|---------------|---------------|------------------|
| Village | 52 | 5 | 1 | 156 |
| Grassland | 58 | 5 | 2 | 174 |
| Forest | 64 | 6 | 2 | 192 |
| Mountain | 56 | 5 | 2 | 168 |
| Riverside | 60 | 6 | 2 | 180 |
| Wetland/Marsh | 56 | 5 | 2 | 168 |
| Plains | 48 | 4 | 1 | 144 |
| Dungeon | 60 | 6 | 2 | 180 |
| Sketch | 56 | 6 | 2 | 168 |
| **Subtotal (biomes)** | **510** | **48** | **16** | **1,530** |
| Stagnation overlay | 10 | 3 | 1 | 10 (single variant) |
| Transitions (15 sets) | 15 x 47 = 705 | 0 | 15 | 2,115 |
| **Grand Total** | | | | **3,655 unique tiles** |

### File Count

| Category | Files Per Tier | Tiers | Total PNG Files |
|----------|---------------|-------|-----------------|
| Biome tilesets (9 biomes) | 9 | 3 | 27 |
| Stagnation overlay | 1 | 1 | 1 |
| Transition tilesets (15) | 15 | 3 | 45 |
| **Total** | | | **73 PNG files** |

---

## GenAI Production Pipeline Notes

This section provides guidance for the GenAI asset pipeline (Phase 3 of development — see creative direction).

### Prompt Structure for Tile Generation

Each tile should be generated with a structured prompt:

```
[Style]: 16-bit JRPG pixel art, 32x32 pixels, [tier]-tier palette
[Biome]: {biome name}
[Tile]: {tile name from tables above}
[Palette]: {hex colors from tier palette}
[Mood]: {tier keyword — "watercolor sketch" / "golden hour meadow" / "stained-glass luminance"}
[Constraints]: No black outlines. Warm shadows only. Seamless tiling where applicable.
```

### Batch Production Order

Generate tiles in this order to establish visual consistency:

1. **Ground tiles first** — these set the base palette for each biome
2. **Path tiles** — must harmonize with ground
3. **Autotile sets** — must transition seamlessly between ground types
4. **Obstacle tiles** — buildings, walls, large objects (establish vertical scale)
5. **Decoration tiles** — smaller details that reference established palette
6. **Animated tiles** — frame strips based on established static tiles
7. **Transition tiles** — require both biome palettes to be established first
8. **Stagnation overlay** — applied last, references all base biomes

### Quality Validation Checklist

For each generated tile:

- [ ] Exactly 32x32 pixels
- [ ] Uses only colors from the tier's palette (with smooth gradients between)
- [ ] No pure black (#000000) — darkest allowed is the tier's shadow color
- [ ] No pure white (#FFFFFF) in Muted/Normal tiers — Vivid tier allows near-white highlights
- [ ] Seamless tiling for ground/floor tiles (left edge matches right, top matches bottom)
- [ ] Autotile blob patterns are complete (all 47 configurations)
- [ ] Animated tile frames are consistent size and centered
- [ ] Muted tier is noticeably desaturated compared to Normal
- [ ] Vivid tier is noticeably more saturated and detailed than Normal
- [ ] Three tiers of the same tile are clearly recognizable as the same object
- [ ] Sketch biome tiles use transparency/opacity correctly (outlines on luminous void)
- [ ] Stagnation overlay tiles have correct alpha transparency

### Tileset Sheet Assembly

After individual tile generation, tiles are assembled into tileset PNGs:

1. Create a 512-pixel-wide canvas (16 tiles at 32px each)
2. Place tiles in row order as specified per biome section above
3. Verify no gaps or overlaps between tiles
4. Export as PNG-32 (with alpha channel)
5. Name according to the naming convention: `tiles_{biome}_{tier}.png`

RPG-JS loads these sheets via Tiled TMX map references. Each TMX map's tileset source points to the appropriate PNG for the zone's current vibrancy tier.
