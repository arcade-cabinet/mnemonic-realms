# Backterria 32px Tile Catalog (US-003)

GID mappings for all upscaled Backterria tilesheets. Used by TMX map designers
to select correct tiles. All tiles are 32x32px.

## TMX Tileset Allocation

When composing maps, tilesets are loaded in this order:

| TSX File | firstgid | Tiles | GID Range |
|----------|----------|-------|-----------|
| backterria-overworld.tsx | 1 | 464 | 1–464 |
| backterria-natural.tsx | 465 | 572 | 465–1036 |
| backterria-natural-props.tsx | 1037 | 672 | 1037–1708 |
| backterria-plants.tsx | 1709 | 760 | 1709–2468 |
| backterria-interiors.tsx | 2469 | 2360 | 2469–4828 |
| backterria-items.tsx | 4829 | 132 | 4829–4960 |
| backterria-signs-32.tsx | 4961 | 100 | 4961–5060 |
| backterria-symbols.tsx | 5061 | 100 | 5061–5160 |
| backterria-postapoc-buildings.tsx | 5161 | 117 | 5161–5277 |
| backterria-postapoc-roads.tsx | 5278 | 33 | 5278–5310 |
| backterria-postapoc-pavement.tsx | 5311 | 33 | 5311–5343 |
| backterria-postapoc-icons.tsx | 5344 | 80 | 5344–5423 |

**GID formula**: TMX_GID = firstgid + (row * columns + col)

---

## backterria-overworld (29 cols x 16 rows, 464 tiles)

Sheet layout: 4 biome variants arranged left-to-right:
- **Green Meadow** (cols 0–7): Village, grassland terrain
- **Yellow-Green** (cols 8–14): Plains, marsh transition
- **Autumn/Orange** (cols 15–21): Forest, warm terrain
- **Brown/Dead** (cols 22–28): Mountain, stagnation, barren

### Key Tiles (verified by extraction)

| GID | Row | Col | Description | Use |
|-----|-----|-----|-------------|-----|
| 121 | 4 | 4 | Solid green grass | Base ground fill (village, grassland) |
| 120 | 4 | 3 | Dense green (forest floor) | Forest edges, thick vegetation |
| 149 | 5 | 3 | Green with white flowers | Garden areas, meadow accents |
| 154 | 5 | 8 | Red/orange flower cluster | Memorial garden, flower beds |
| 180 | 6 | 5 | Solid olive | Dense border, impassable areas |
| 150 | 5 | 4 | Bush/shrub on grass | Tree/bush decoration |

### Building Tiles (bottom rows)

| GID | Row | Col | Description |
|-----|-----|-----|-------------|
| 368 | 12 | 19 | House with door (top-left of 2x2) |
| 369 | 12 | 20 | Stone wall/roof (top-right) |
| 372 | 12 | 23 | Grey stone house (top-left) |
| 373 | 12 | 24 | Grey stone house (top-right) |

### Water Tiles (row 8–9 area)

| GID | Row | Col | Description |
|-----|-----|-----|-------------|
| 233 | 8 | 0 | Water with land edge (top-left) |
| 234 | 8 | 1 | Water top edge |
| 235 | 8 | 2 | Water top-right edge |
| 262 | 9 | 0 | Water bottom-left edge |
| 263 | 9 | 1 | Water bottom edge |
| 264 | 9 | 2 | Water bottom-right edge |

---

## backterria-natural (22 cols x 26 rows, 572 tiles)

**TMX offset**: +464 (firstgid=465)

Sheet layout organized by terrain type top-to-bottom:
- **Rows 0–3**: Grass/water terrain with transitions
- **Rows 4–7**: Soil/clay terrain with transitions
- **Rows 8–11**: Dirt path (9-tile sets)
- **Rows 12–15**: Sandy/beach terrain
- **Rows 16–19**: Stone/rock terrain with transitions
- **Rows 20–25**: Dark stone, holes, trenches

### Path Tiles (9-tile path set)

| Sheet GID | TMX GID | Position | Description |
|-----------|---------|----------|-------------|
| 177 | 641 | TL | Path top-left corner |
| 178 | 642 | T | Path top edge |
| 179 | 643 | TR | Path top-right corner |
| 199 | 663 | L | Path left edge |
| 200 | 664 | C | Path center (fill) |
| 201 | 665 | R | Path right edge |
| 221 | 685 | BL | Path bottom-left corner |
| 222 | 686 | B | Path bottom edge |
| 223 | 687 | BR | Path bottom-right corner |

### Stone Tiles

| Sheet GID | TMX GID | Position | Description |
|-----------|---------|----------|-------------|
| 397 | 861 | TL | Stone top-left |
| 398 | 862 | T | Stone top edge |
| 399 | 863 | TR | Stone top-right |
| 419 | 883 | L | Stone left edge |
| 420 | 884 | C | Stone center fill |
| 421 | 885 | R | Stone right edge |

### Grass Terrain

| Sheet GID | TMX GID | Description |
|-----------|---------|-------------|
| 24 | 488 | Natural grass center |

---

## backterria-natural-props (32 cols x 21 rows, 672 tiles)

**TMX offset**: +1036 (firstgid=1037)

Composite sheet of 101 individual props packed into 64x96 cells (2x3 tiles each).
Props are centered in their cells. Cell size accounts for multi-tile props like trees (64x64) and houses (64x95).

### Prop Layout (left-to-right, top-to-bottom)

Row 0-1: Bush 01–10, Cabbage Grow 1–5, Carrot Grow 1
Row 2-3: Carrot Grow 2–5, Corn Grow 1–5, Flower 01–07
Row 4-5: Flower 08–10, House 01, Plant 01–10, Rock 1–3
Row 5-6: Rock 4–10, Seed Bed 1–3, Stone Fence 01–08
Row 6-7: Stone Fence Door 1–2, Sunflower Grow 1–5, Tomato Grow 1–5, Tree 01–04
(remaining items continue in subsequent rows)

---

## backterria-plants (20 cols x 38 rows, 760 tiles)

**TMX offset**: +1708 (firstgid=1709)

Dense vegetation sheet: ground plants, potted plants, flowers, cacti, ferns.
Organized by plant type in rows.

---

## backterria-interiors (40 cols x 59 rows, 2360 tiles)

**TMX offset**: +2468 (firstgid=2469)

8 room template styles arranged in sections:
1. **Dark Blue/Purple Dungeon** (top rows) — Depths L1–L3
2. **Gold/Brown Tavern** — Inn interiors
3. **Teal** — Magic/library rooms
4. **Grey Stone** — Fortress, dungeon halls
5. **Prison** — Cells, cages
6. **Blue Bathroom/Kitchen** — Domestic interiors
7. **White/Blueprint** — Could serve Sketch biome indoors
8. **Green Garden** — Garden rooms, greenhouse
9. **Dark Stone** — Deep dungeon, boss rooms

---

## Vibrancy Variants

Each terrain sheet has `_muted` and `_vivid` variants with the same tile layout.
Maps swap TSX references based on zone vibrancy:

| Vibrancy Score | Variant | Saturation | Brightness |
|---------------|---------|------------|------------|
| 0–33 (Muted) | `*_muted.tsx` | 60% | 85% |
| 34–66 (Normal) | `*.tsx` (base) | 100% | 100% |
| 67–100 (Vivid) | `*_vivid.tsx` | 130% | 110% |

Sheets with vibrancy variants:
- backterria-overworld
- backterria-natural
- backterria-plants
- backterria-interiors
- backterria-natural-props
- backterria-postapoc-buildings
- backterria-postapoc-roads
- backterria-postapoc-pavement
