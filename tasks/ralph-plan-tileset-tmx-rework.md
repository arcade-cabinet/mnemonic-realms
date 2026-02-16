# Tileset & TMX Map Rework — Comprehensive Phased Plan

## Executive Summary

Replace all AI-generated tilesets and TMX maps with properly designed maps built from **Backterria CC0 assets** (4,500+ tiles purchased for this game). Kenney packs are supplementary ONLY for genuine gaps (Sketch biome, dungeon extras).

**Problem**: Current AI-generated tilesets produce checkerboard gaps and reference tile GIDs that don't map to real tileset images. The game has 4,500+ purchased Backterria CC0 tiles that are not being used.

**Solution**: Upscale Backterria tilesheets to 32px, create proper TSX tileset definitions, and hand-design every TMX map with real tiles aligned to bible specifications.

**Asset Catalog**: See `assets/tilesets/backterria/CATALOG.md` for the complete inventory.

---

## Asset Strategy

### Backterria = THE Foundation

The Backterria CC0 collection covers **every biome** in the game:

| Game Biome | Backterria Source | Coverage |
|------------|------------------|----------|
| Village | Overworld (Green Meadow) + Natural Props (fences, wells, trees) | **COMPLETE** |
| Grassland | Overworld (Green + Yellow variants) + Natural (paths, farmland) | **COMPLETE** |
| Forest | Overworld (Autumn variant) + Natural Tileset + Natural Props + Plants | **COMPLETE** |
| Mountain | Natural Tileset (stone) + Overworld (Dead/Brown variant) + Natural Props (rocks) | **ADEQUATE** |
| Riverside | Overworld (water) + Natural Tileset (river, water edges) | **COMPLETE** |
| Wetland/Marsh | Natural Tileset (water) + Plants (vegetation) | **ADEQUATE** |
| Plains | Overworld (Yellow Meadow) + Natural Tileset (paths) | **COMPLETE** |
| Dungeon | Interiors (dungeon templates, 8 room styles) | **COMPLETE** |
| Interiors | Interiors (all 8 templates) + Plants (potted) + Items | **COMPLETE** |
| Stagnation | Overworld (Dead/Brown) + Post-Apoc (damaged tiles) | **ADEQUATE** |
| Sketch | NOT in Backterria | **GAP** — use Kenney Monochrome RPG |

### Kenney = Supplements ONLY

Kenney packs are copied into the project **only** for these specific gaps:
- **Kenney Monochrome RPG**: The Sketch biome's monochrome aesthetic
- **Kenney Roguelike Base**: Mountain cliff edge tiles IF Backterria stone tiles prove insufficient
- **Kenney Tiny Dungeon**: Supplementary dungeon variety IF Backterria Interiors needs variety

### Tile Size

All Backterria tilesheets are 16px tiles. Existing TMX maps use 32px tiles.

**Strategy**: 2x nearest-neighbor upscale preserving pixel art crispness.

**Exception**: Backterria Natural Props (individual PNGs) are already at 32px/64px — they don't need upscaling. Backterria Signs 32 is already at 32px.

---

## Phase Structure

### Phase 0: Foundation (6 iterations)
Upscale Backterria assets, create TSX definitions, remove old AI tilesets.

### Phase 1: Act I — Settled Lands (12 iterations)
Village Hub + 4 surrounding maps using Backterria exclusively.

### Phase 2: Act II — Frontier Zones (10 iterations)
4 frontier maps using Backterria + minimal supplements.

### Phase 3: Act III — Sketch + Underground (12 iterations)
Sketch zones (Kenney Monochrome), Depths (Backterria Interiors), Fortress.

---

## Phase 0: Foundation

### US-001: Backterria Tileset Upscale Script
Build `gen/scripts/upscale-tilesets.ts`:
- Reads all Backterria tilesheets from `assets/tilesets/backterria/`
- 2x nearest-neighbor upscale via sharp for all 16px tilesheets
- Packs 101 Natural Props into composite tilesheet (16 columns wide)
- Copies Signs 32 and Natural Props as-is (already at 32px)
- Outputs to `assets/tilesets/32px/`
- `pnpm tileset:build` script in package.json

### US-002: Vibrancy Tier Generator
Extend upscale script for muted/vivid variants:
- Normal: base 32px upscaled image
- Muted: saturation -40%, brightness -15%
- Vivid: saturation +30%, brightness +10%
- Output: `{name}_normal.png`, `{name}_muted.png`, `{name}_vivid.png`

### US-003: Tile Catalog — All Backterria Tilesheets
Document tile GID mappings for every upscaled Backterria sheet:
- Overworld: map every tile (grass variants, terrain edges, water, buildings, farmland, characters)
- Natural: map terrain sections (grass, water, river, soil, path, stone)
- Plants: categorize by type (ground plants, potted plants, flowers)
- Interiors: identify room templates and individual furniture/props
- Items, Signs, Symbols: quick reference lists

### US-004: TSX Definitions + Remove Old AI Tilesets
- Generate TSX files from upscaled 32px Backterria PNGs
- One primary TSX per Backterria source: `backterria-overworld.tsx`, `backterria-natural.tsx`, etc.
- Vibrancy variant TSX files: `*_muted.tsx`, `*_vivid.tsx`
- TMX template with standard layers: ground, ground2, objects, objects_upper, collision, events
- **REMOVE all 73+ old AI-generated TSX and PNG files**

### US-005: Copy Kenney Supplementary Tiles (gaps only)
Copy ONLY the Kenney packs needed for genuine gaps:
- Monochrome RPG (for Sketch biome)
- Roguelike Base (for mountain cliff edges, if needed)
- Handle 1px Kenney margin: strip, upscale each tile, repack as 0-margin 32px sheet

### US-006: Gap-Fill Tile Catalog
Document which Kenney tiles fill which Backterria gaps:
- Mountain cliff edges
- Sketch biome terrain/buildings/trees
- Any remaining holes identified in US-003

---

## Phase 1: Act I — Settled Lands (12 iterations)

All maps use Backterria tiles exclusively (Overworld, Natural, Plants, Natural Props).

### US-007/008/009: Village Hub (3 stories)
- Ground layer: Backterria Overworld green meadow + Natural path tiles
- Buildings + objects: Backterria Overworld buildings + Natural Props (fences, wells, trees, flowers)
- Collision + events + gates: Wire to village-hub-events.ts

### US-010/011: Heartfield (2 stories)
- Ground: Backterria Overworld green+yellow meadow, farmland, river
- Objects/events: Farmhouses, wheat fields, Stagnation Clearing

### US-012/013: Ambergrove (2 stories)
- Ground: Backterria Overworld autumn variant, Natural Tileset forest floor
- Objects/events: Natural Props trees, Plants dense vegetation, 5 resonance stones

### US-014/015: Millbrook (2 stories)
- Ground: Natural Tileset water/river system, Overworld water
- Objects/events: Bridge, mill, waterfall, cave entrance

### US-016/017: Sunridge (2 stories)
- Ground: Natural Tileset stone tiles, Overworld dead/brown variant
- Objects/events: Wind Shrine, Preserver Outpost

---

## Phase 2: Act II — Frontier Zones (10 iterations)

### US-018/019: Shimmer Marsh (2 stories)
- Primary: Natural Tileset water system + Plants vegetation
- Objects/events: Verdance recall site, floating platforms

### US-020/021: Hollow Ridge (2 stories)
- Primary: Natural Tileset stone + Overworld dead/brown
- Supplement: Kenney Roguelike cliff tiles IF needed
- Objects/events: Kinesis Spire, crystal caves

### US-022/023: Flickerveil (2 stories)
- Primary: Natural Tileset + Plants + Overworld autumn (mixed aggressively)
- Objects/events: Luminos Grove, flickering light objects

### US-024/025: Resonance Fields (2 stories)
- Primary: Overworld yellow meadow + Natural Tileset stone paths
- Objects/events: Amphitheater, standing stones

### US-026/027: Biome Transitions + Stagnation Overlay (2 stories)
- 5-tile transition gradients between adjacent biomes
- Stagnation crystal corruption overlay (Overworld dead variant + custom)

---

## Phase 3: Act III — Sketch + Underground (12 iterations)

### US-028/029/030: Sketch Zones (3 stories)
- Luminous Wastes, Undrawn Peaks, Half-Drawn Forest
- Primary: **Kenney Monochrome RPG** (only place Kenney is primary)
- Objects/collision/events for all 3

### US-031-036: Depths L1-L5 + Fortress F1-F3 (6 stories)
- Primary: **Backterria Interiors** (8 room templates)
- Supplement: Post-Apoc building tiles for Fortress architecture
- L1-L3: Backterria Interiors dark dungeon templates
- L4: Backterria + Post-Apoc for hazardous/damaged areas
- L5: Transition to Fortress style
- F1-F3: Backterria Interiors grey stone + Post-Apoc building tiles

### US-037/038/039/040: Verification (3 stories)
- Act I playthrough verification
- Act II + III playthrough verification
- Final build verification

---

## Quality Gates

Every story must pass:
- `pnpm build` — RPG-JS build compiles
- TMX files load without warnings
- All TSX files reference existing PNG images
- No checkerboard gaps or missing tile artifacts

Map stories also verify:
- Player can navigate between connected maps via gate events
- Event coordinates in TMX match TypeScript event files
- Collision prevents walking through walls, water, cliffs

---

## Iteration Budget

| Phase | Stories | Iterations |
|-------|---------|------------|
| Phase 0: Foundation | US-001 through US-006 | 6 |
| Phase 1: Act I | US-007 through US-017 | 11 |
| Phase 2: Act II | US-018 through US-027 | 10 |
| Phase 3: Act III | US-028 through US-040 | 13 |
| **Total** | **40 stories** | **40 iterations** |
