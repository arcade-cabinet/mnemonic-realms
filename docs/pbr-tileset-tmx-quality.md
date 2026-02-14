# PBR: Tileset & TMX Quality Assessment

> Authored by visual inspection of all 27 tileset PNGs and 20 TMX maps.
> Cross-references: [tileset-spec.md](design/tileset-spec.md), [overworld-layout.md](maps/overworld-layout.md)

---

## Executive Summary

**Every tileset and every TMX map has critical quality failures.** The GenAI pipeline generated assets and code without any visual quality verification step. The result: tilesets with text burned in, TMX maps with random tile placement, and no tile-adjacency coherence. None of this was caught before integration.

### Severity Breakdown

| Category | Critical | Major | Minor |
|----------|----------|-------|-------|
| Tileset art quality | 9 | 5 | 3 |
| TMX tile placement | 20 | 0 | 0 |
| Missing assets | 3 | 0 | 0 |
| Rendering (seams) | 1 | 0 | 0 |
| **Total** | **33** | **5** | **3** |

---

## Section 1: Tileset Quality Issues

### 1.1 CRITICAL — Text Labels Burned Into Tiles

**Affected**: ALL 27 tilesets (all 9 biomes × 3 tiers)

The AI generation prompt included tile ID labels (e.g., "VIL_GR_01", "FOR-DE-03", "DUN-GR-02"). The AI rendered these labels as pixel text INSIDE the tile images. Every tile has its ID string burned into the artwork.

**Impact**: Makes all tiles visually unusable. Text is visible in-game at any zoom level.

**Evidence** (from visual inspection):
- Village normal: Every tile has "VIL_GR_01" / "VIL_PA_02" etc. in small text
- Dungeon normal: Nearly every tile has "DUN-" prefix text visible
- Forest normal: Less severe but still present on most tiles
- Mountain normal: Text visible on ground and path tiles
- Sketch normal: Labels visible as pencil-style text on parchment background

**Root cause**: The generation prompts included tile ID metadata. The AI model interpreted the IDs as text that should appear on the tile.

### 1.2 CRITICAL — Autotile Rows Are Nonfunctional

**Affected**: ALL 27 tilesets

Rows 4-9 (the autotile section per tileset-spec.md) should contain 47-tile blob sets for seamless terrain transitions. Instead they contain:
- Random ground texture variants (not autotile-compatible)
- Duplicate tiles from rows 1-2
- Empty/transparent tiles
- More text-labeled tiles

**Impact**: No seamless terrain transitions possible. Ground-to-grass, floor-to-wall, water-to-bank transitions all broken.

### 1.3 CRITICAL — Many Tiles Are Empty or Duplicates

Per-tileset assessment of usable unique tiles (out of 224 cells):

| Tileset | Usable Tiles | Empty/Transparent | Near-Duplicates | Text-Corrupted |
|---------|-------------|-------------------|-----------------|----------------|
| Village normal | ~30 | ~40 | ~50 | ~104 |
| Forest normal | ~45 | ~30 | ~40 | ~109 |
| Grassland normal | ~25 | ~60 | ~50 | ~89 |
| Mountain normal | ~40 | ~35 | ~40 | ~109 |
| Plains normal | ~20 | ~80 | ~30 | ~94 |
| Riverside normal | ~35 | ~40 | ~40 | ~109 |
| Dungeon normal | ~40 | ~30 | ~30 | ~124 |
| Wetland normal | ~35 | ~40 | ~40 | ~109 |
| Sketch normal | ~15 | ~120 | ~20 | ~69 |

The tileset-spec.md calls for 48-64 unique content tiles per biome. The actual PNGs have significantly fewer usable tiles even ignoring the text corruption.

### 1.4 MAJOR — Tiles Don't Tile Seamlessly

Ground tiles (row 1-2 in each biome) should tile seamlessly — left edge should match right edge, top should match bottom. The AI-generated tiles do NOT tile properly:
- Edge pixels differ between tiles that should be adjacent
- White/light edges on many tiles create visible seam gaps when tiled
- The `repair-tileset-edges.ts` script fixed 16,406 pixels of white edge artifacts but many non-white mismatches remain

### 1.5 MAJOR — Muted/Vivid Tiers Don't Match Normal Layout

The three vibrancy tiers (muted, normal, vivid) should be the same tile layout with different color palettes. Visual inspection shows:
- Tile positions shift between tiers (tile ID 5 in muted may be a different object than tile ID 5 in normal)
- Color palettes are inconsistent (some vivid tiles are darker than muted)
- Tile count varies between tiers of the same biome

### 1.6 MAJOR — Village Tileset Visual Catalog

From my visual inspection of `tiles_village_normal.png` (the starting map's tileset):

**Row 1 (tiles 1-16)**: Ground variants. Mix of cobblestone textures, grass patches, and dirt. Text labels on all. Tiles 1-3 look like light tan/cream cobblestone. Tiles 4-5 are grass (green). Tile 6 is darker dirt. Most are usable IF text is removed.

**Row 2 (tiles 17-32)**: More ground variants and some path tiles. Mix of brick/stone wall textures. Tiles 17-22 are stone/brick variants. Several look like building wall sections.

**Row 3 (tiles 33-48)**: Expected to be paths per spec. Actually contains: building facade elements (sign, bench, market stall, barrel), furniture/props. Text labels heavily present.

**Row 4-9 (tiles 49-144)**: Should be 47-tile cobblestone-grass autotile. Actually contains: random ground texture variants, brick wall textures, roof tiles, miscellaneous props. No autotile pattern.

**Row 10-11 (tiles 145-176)**: Expected decorations. Contains: red/dark roof tile variants, brick wall variants, fence pieces. Some usable decoration tiles (lamp, bench, barrel) but mostly wall/roof textures.

**Row 12 (tiles 177-192)**: Expected obstacles. Contains: tree (1 decent tree tile), fountain (waterish), wood planks, stone variants. Sparse.

**Row 13-14 (tiles 193-224)**: Expected animated tiles. Contains: more ground variants, a large tree tile, some scattered objects. No actual animation frame strips.

### 1.7 MAJOR — Forest Tileset Visual Catalog

`tiles_forest_normal.png` — best quality of the bunch:

**Row 1-2**: Ground tiles — good variety of dirt, leaf litter, moss in brown/green tones. Multiple usable ground variants.

**Row 3**: Rock variants, fallen branches, mushrooms. Small props.

**Row 4-5**: Trees — multiple deciduous and conifer tree variants (green on brown trunks). These are the most visually coherent tiles across any tileset.

**Row 6-7**: Water/pond tiles (blue), more tree variants. A decent pond area.

**Row 8-9**: More ground variants, some rock faces.

**Row 10-14**: Mix of additional ground, more trees, some empty tiles. Less organized.

### 1.8 MAJOR — Dungeon Tileset Visual Catalog

`tiles_dungeon_normal.png` — heavily text-corrupted:

**Row 1-2**: Stone floor variants in gray/brown. Torch tiles (small yellow/orange on gray). Cracked floor. Text on nearly every tile.

**Row 3-4**: Wall variants — stone, brick, dark stone. Some door-like tiles. Heavy text corruption.

**Row 5-6**: Bookshelf, chest, gate, iron door tiles. Props/furniture. Text labels visible.

**Row 7-8**: More wall variants, crack patterns, ornate floor tiles.

**Row 9-10**: Gate/barrier tiles, crystal/magical tiles (one blue circle tile that could be a magic circle).

### 1.9 MINOR — Sketch Tileset Is Extremely Sparse

`tiles_sketch_normal.png` — conceptually correct but very sparse:

Only ~15 non-empty tiles in the entire 224-cell sheet. Parchment-colored background with pencil-drawn elements:
- A few tree outlines
- Triangle mountains
- A water/lake area (blue wash)
- Some small object sketches
- Most of the sheet is blank parchment

This is partially correct per the sketch biome spec (Muted tier should be nearly empty), but even the Normal tier should have more "partially filled" content.

---

## Section 2: TMX Map Quality Issues

### 2.1 CRITICAL — All 20 Maps Have Random Tile Placement

Every TMX map was generated by Gemini text model without any visual reference to the actual tileset content. The model picked tile IDs based on the spec's ID naming convention, but:

1. The actual tileset PNG layout doesn't match the spec's intended layout (AI generated tiles in different positions)
2. Gemini assigned tile IDs in the TMX without knowing which IDs correspond to which visual content
3. Result: tile IDs in the TMX map to completely wrong visual content

**Example — Village Hub** (`village-hub.tmx`):
- Ground layer uses tiles 1, 5, 6, 7, 33, 34 (only 6 unique IDs out of 224)
- Tile 1 = first tile in sheet (tan cobblestone with "VIL_GR_01" text)
- Tile 5 = green grass (with text)
- Tile 33 = first tile of row 3 (building prop, not a path tile)
- Tile 34 = second tile of row 3 (another prop, used as "path" in TMX)
- Objects/features layer is mostly empty (0s)
- Ground2 layer only has tile 193 placed in a few spots

**The map layout diagram in overworld-layout.md is detailed and correct** — but the TMX data doesn't implement it. The TMX has:
- No buildings (despite spec showing 6 named buildings)
- No paths connecting locations
- No trees lining the perimeter
- No central fountain
- No NPCs placed in correct positions
- Random tile blocks instead of structured layout

### 2.2 CRITICAL — Tile ID Mismatch Across Biomes

Each TMX map references one tileset (e.g., `tiles_village_normal.tsx`). The tile IDs in the map data reference positions in that tileset. But:
- The tileset PNGs were generated independently of the TMX maps
- Tile ID 5 in the village tileset is a different thing than tile ID 5 in the forest tileset
- The TMX generator assumed consistent ID→content mapping that doesn't exist

### 2.3 CRITICAL — Missing Layer Content

Per tileset-spec.md, every TMX should have 6 layers:
- `ground` (base terrain)
- `ground2` (detail overlay)
- `objects` (buildings, trees, rocks)
- `objects_upper` (canopy, rooftops)
- `collision` (invisible boundaries)
- `events` (trigger zones)

Most maps have:
- `ground`: Partially populated with 3-6 unique tile IDs
- `ground2`: Mostly empty (0s) with scattered tiles
- `objects`: Mostly empty
- `objects_upper`: Mostly or entirely empty
- `collision`: Broken (village-hub was 99% blocked until manually fixed)
- `events`: Object layer exists but events don't match spec positions

---

## Section 3: Missing Assets

### 3.1 CRITICAL — No Transition Tilesets

The tileset-spec.md defines 15 transition tilesets for smooth biome blending:
- `overlay_transition_village_grassland.png`
- `overlay_transition_village_forest.png`
- `overlay_transition_village_riverside.png`
- (12 more...)

**None of these have been generated.** Maps currently hard-cut between biomes with no visual transition.

### 3.2 CRITICAL — No Stagnation Overlay Tileset

The `overlay_stagnation_crystal.png` tileset (10 tiles + border autotile) is a core mechanic asset. It has not been generated.

### 3.3 CRITICAL — No Autotile Support in Current Tilesets

The spec calls for 16 total autotile blob sets (one or two per biome). These require specific 47-tile patterns arranged in RPG Maker A2 format. The current tilesets have random tiles in the autotile rows (4-9) instead.

---

## Section 4: Rendering Issues

### 4.1 Tile Seam Gaps

White/light lines visible between all tile boundaries in-game. Contributing factors:
- AI-generated tiles have lighter edge pixels (partially fixed by `repair-tileset-edges.ts`)
- PixiJS subpixel rendering at non-integer positions (mitigated by `ROUND_PIXELS = true`)
- Integer zoom enforced (`Math.max(1, Math.round(rawZoom))`)
- Tile extrusion (the standard fix) breaks RPG-JS — its TMX parser doesn't support TSX `margin`/`spacing` attributes
- Remaining seams are from non-white edge mismatches between adjacent tiles

---

## Section 5: Root Cause Analysis

### Why This Happened

1. **No visual QC gate**: Generated assets went from Gemini → `gen/output/` → `main/` with zero visual verification
2. **Blind TMX generation**: Gemini text model wrote TMX tile IDs without seeing the tileset images
3. **Prompt contamination**: Tile ID labels in generation prompts got rendered as pixel text
4. **Spec/reality gap**: The tileset-spec.md is excellent but the AI output doesn't match it
5. **Autotile complexity**: 47-tile blob sets require precise spatial relationships that AI image gen can't produce
6. **Integration pipeline assumed quality**: `gen/integrators/` resize and format but don't validate content

### What Should Have Been Done

1. **Visual spot-check after generation**: Open each generated PNG and verify it matches the spec
2. **Tile catalog verification**: Confirm tile ID positions match the spec's row/category layout
3. **TMX placement verification**: Render each TMX as a composite image and verify it matches the map layout diagram
4. **Autotile generation as code, not image**: Autotile blob sets should be procedurally generated or manually placed, not AI-generated
5. **Text-free prompts**: Strip all ID labels from generation prompts to prevent text contamination

---

## Section 6: Remediation Plan Summary

### Priority 1: Regenerate Tilesets (Text-Free)

Regenerate all 27 biome tilesets with prompts that:
- Remove all tile ID labels
- Specify "no text, no letters, no labels, no words" in negative prompt
- Generate ground tiles with seamless tiling constraints
- Keep autotile rows empty (will be filled procedurally or manually later)

### Priority 2: Create Tile Mapping Doc

After regeneration, visually inspect each tileset and write an authoritative catalog:
- Tile ID → visual description for every populated cell
- Mark empty/transparent cells
- Note which tiles tile seamlessly
- Note which tiles work as left/right/top/bottom edges

### Priority 3: Rewrite All TMX Maps

Using the tile mapping doc + overworld-layout.md, manually rewrite all 20 TMX maps:
- Match ground tiles to the biome (grass areas get grass tile IDs, stone areas get stone IDs)
- Place buildings using correct wall/roof tile IDs
- Add paths connecting locations per layout diagrams
- Fill objects layer with trees, props, features
- Set collision layer based on feature placement
- Place events at positions from overworld-layout.md

### Priority 4: Address Autotiles and Transitions

These are complex and may need hand-authoring or a different generation approach:
- Autotile blob sets (47-tile patterns) — likely need manual/procedural creation
- Transition tilesets — need both biome palettes established first
- Stagnation overlay — single variant, could be generated after base tilesets are fixed
