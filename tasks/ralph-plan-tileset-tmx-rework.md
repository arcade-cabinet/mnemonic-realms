# Ralph Loop Plan: Tileset & TMX Complete Rework

> **PBR Reference**: `docs/pbr-tileset-tmx-quality.md`
> **Dirty Manifest**: `gen/dirty.json` (70 entries — 27 tilesets + 43 sprites)
> **Tileset Spec**: `docs/design/tileset-spec.md`
> **Map Layout Spec**: `docs/maps/overworld-layout.md`
> **Model Requirement**: Gemini Pro (NOT Flash) for tilesets due to complexity
> **Max Iterations**: 40 (estimate)

---

## Problem Statement

The GenAI pipeline generated tilesets and TMX maps without visual quality verification. Every tileset has text labels burned in, nonfunctional autotile rows, and inconsistent tile layouts. Every TMX map has random tile placement that creates visual gibberish. The entire visual layer of the game is broken.

## Execution Strategy

**Three phases, strictly sequential** — each phase depends on the previous:

1. **Phase 1: Regenerate Tilesets** — Fix prompts, regen with Gemini Pro, visual QC each output
2. **Phase 2: Write Tile Catalog** — After regen, visually inspect every tile and document what's at each position
3. **Phase 3: Rewrite TMX Maps** — Using the tile catalog + map layout specs, manually write correct TMX data

Phase 1 must complete before Phase 2 starts (can't catalog tiles that don't exist yet).
Phase 2 must complete before Phase 3 starts (can't place tiles without knowing what they are).

---

## Phase 1: Regenerate Tilesets (Iterations 1-12)

### Prompt Fixes Required

The tileset builder (`gen/builders/tilesets.ts`) must be updated:

1. **Remove tile ID labels from prompts** — strip all `VIL-GR-01`, `FOR-DE-03` etc. from the user prompt. These get rendered as text.
2. **Add negative prompt**: "No text, no letters, no labels, no words, no numbers, no watermarks"
3. **Switch to Gemini Pro model** for tileset generation (not Flash)
4. **Simplify per-tile prompts** — instead of describing every tile with its ID, describe tile categories in bulk:
   - "Row 1-2: 16 ground tiles — 8 variants of [biome ground type]. Seamlessly tileable, no visible edges."
   - "Row 3: 6 path tiles — horizontal, vertical, corner, T-junction, crossroads, steps."
   - "Rows 4-9: LEAVE EMPTY (transparent). These will be filled with autotile data later."
   - "Row 10-11: 16 decoration tiles — [list of objects]."
   - "Row 12: 8 obstacle tiles — [list of obstacles]."
   - "Row 13-14: 16 cells for animated tile frames — [list of animations]."
5. **One tileset per API call** — don't batch, each tileset is its own generation call for quality
6. **Dimension enforcement**: Each biome's sheet dimensions per spec (512×448 for village/plains, 512×512 for others, 512×576 for forest)

### Iteration 1: Fix tileset builder prompts
**Task**: Modify `gen/builders/tilesets.ts`
- Strip tile ID labels from all prompts
- Add "no text" negative prompt constraint
- Simplify prompt structure (category descriptions, not per-tile)
- Leave autotile rows (4-9) explicitly empty
- Update model config to use Gemini Pro for tilesets

### Iteration 2: Regenerate Village tilesets (3 tiers)
**Task**: `doppler run --project gha --config ci -- pnpm gen generate tilesets --force --filter village`
**QC**: Visually inspect each PNG. Verify:
- [ ] No text/labels visible
- [ ] Ground tiles (rows 1-2) look like cobblestone/grass
- [ ] Path tiles (row 3) are recognizable paths
- [ ] Rows 4-9 are empty/transparent
- [ ] Decoration tiles (rows 10-11) show benches, barrels, lanterns, etc.
- [ ] Obstacle tiles (row 12) show walls, roofs, fences, trees
- [ ] Row 13-14 have animated tile frames

If QC fails: adjust prompt, regenerate. Don't proceed until QC passes.

### Iteration 3: Regenerate Forest tilesets (3 tiers)
Same structure as Iteration 2. QC checks adapted for forest biome (dirt, trees, mushrooms, etc.)

### Iteration 4: Regenerate Grassland tilesets (3 tiers)
QC checks: grass, wheat, fences, farmsteads

### Iteration 5: Regenerate Mountain tilesets (3 tiers)
QC checks: rock, snow, alpine grass, cave entrance, cliffs

### Iteration 6: Regenerate Riverside tilesets (3 tiers)
QC checks: water, docks, bridges, waterfall, town buildings

### Iteration 7: Regenerate Wetland tilesets (3 tiers)
QC checks: swamp water, lily pads, reeds, mangroves, boardwalk

### Iteration 8: Regenerate Plains tilesets (3 tiers)
QC checks: open grass, resonance stones, tents, campfire

### Iteration 9: Regenerate Dungeon tilesets (3 tiers)
QC checks: stone floors, walls, torches, doors, chests, crystals

### Iteration 10: Regenerate Sketch tilesets (3 tiers)
QC checks: pencil-drawn aesthetic, parchment background, appropriate fill level per tier

### Iteration 11: Integrate regenerated tilesets
**Task**: `pnpm gen integrate images --filter tilesets`
Then run edge repair: `pnpm exec tsx scripts/repair-tileset-edges.ts`
Verify no regression.

### Iteration 12: Regenerate dirty sprites (43 sprites)
**Task**: `doppler run --project gha --config ci -- pnpm gen generate sprites --dirty`
**QC**: Run `pnpm exec tsx scripts/verify-sprites.ts` — target 0 warnings
If any sprites still have solid-line artifacts or identical direction rows, re-dirty and regenerate.

---

## Phase 2: Write Tile Catalog (Iterations 13-18)

After Phase 1, the tilesets should be clean. Now visually inspect each one and document what's at every tile position.

### Output: `docs/design/tileset-catalog.md`

For each biome (using the Normal tier as reference):

```
## Village Normal

### Row 1 (Tiles 1-16)
| Tile ID | Col | Visual Description | Tiling | Category |
|---------|-----|-------------------|--------|----------|
| 1 | 0 | Light tan cobblestone | seamless | ground |
| 2 | 1 | Cobblestone variant, offset pattern | seamless | ground |
| ... | ... | ... | ... | ... |

### Row 2 (Tiles 17-32)
...
```

### Iteration 13: Catalog Village + Forest tilesets
Read each PNG, document every non-empty tile with visual description and category.

### Iteration 14: Catalog Grassland + Mountain tilesets
Same process.

### Iteration 15: Catalog Riverside + Wetland tilesets
Same process.

### Iteration 16: Catalog Plains + Dungeon tilesets
Same process.

### Iteration 17: Catalog Sketch tileset
Same process. Note which tiles are intentionally empty per the sketch aesthetic.

### Iteration 18: Cross-reference catalog against tileset-spec.md
For each biome, verify:
- [ ] All spec-defined tiles exist in the regenerated tileset
- [ ] Tile positions match spec's row layout
- [ ] Ground tiles are seamlessly tileable
- [ ] Three tiers of same tile are recognizably the same object
- [ ] Decoration/obstacle tiles are distinct from ground tiles

Write a verification report at the end of tileset-catalog.md.

---

## Phase 3: Rewrite TMX Maps (Iterations 19-38)

Using the tile catalog + `docs/maps/overworld-layout.md`, rewrite every TMX map's layer data.

### TMX Layer Writing Rules

For each map, follow this process:

1. **Read the map spec** in overworld-layout.md (layout diagram, NPC positions, events, transitions)
2. **Identify the tileset** (biome + tier from map properties)
3. **Open the tile catalog** for that tileset
4. **Write ground layer**: Fill with appropriate ground tile IDs per the layout diagram
   - Open areas: grass/ground tile IDs with variation (alternate between 2-3 similar tiles)
   - Paths: path tile IDs connecting locations per the layout diagram
   - Water: water tile IDs where the spec shows water
5. **Write ground2 layer**: Detail overlay
   - Flowers, cracks, puddles on top of ground
   - Keep sparse — 10-20% coverage
6. **Write objects layer**: Buildings, trees, features
   - Building walls at spec positions
   - Trees at perimeter and in groves per layout
   - Props (benches, barrels, signs) at spec positions
7. **Write objects_upper layer**: Above-player elements
   - Roof tiles above buildings
   - Tree canopy tiles above tree trunks
8. **Write collision layer**: Based on objects
   - Buildings: blocked
   - Trees: blocked
   - Water: blocked (unless bridge)
   - Paths: passable
   - Open ground: passable
9. **Write events layer**: From the map spec
   - NPC positions as event objects
   - Transition zones at map edges
   - Resonance stones, chests, trigger areas

### Iteration 19: Rewrite village-hub.tmx
**Priority**: This is the starting map and the most visible.
**Read**: overworld-layout.md Map 1 section
**Tileset**: tiles_village_normal
**Size**: 30x30

The layout diagram shows:
- Trees along north and south edges
- Lookout Hill (12,2) 6x5 — elevated area with telescope
- Training Ground (8,10) 6x5 — open sparring area
- Elder's House (18,10) 5x5 — building with roof
- Central Square (12,14) 6x6 — fountain at center
- Quest Board (8,14) 3x3
- Memorial Garden (8,16) 4x3
- Lira's Workshop (8,18) 5x4
- General Shop (18,16) 5x4
- Blacksmith (18,18) 4x4
- Inn Bright Hearth (20,14) 5x4
- Paths connecting all locations
- Gates at N/S/E/W edges

### Iteration 20: Rewrite heartfield.tmx
**Map 2A**: Heartfield (South Settled Lands)
**Tileset**: tiles_grassland_normal
**Size**: 40x40

### Iteration 21: Rewrite ambergrove.tmx
**Map 2B**: Ambergrove (East Settled Lands)
**Tileset**: tiles_forest_normal
**Size**: 40x40

### Iteration 22: Rewrite millbrook.tmx
**Map 2C**: Millbrook (West Settled Lands)
**Tileset**: tiles_riverside_normal
**Size**: 40x40

### Iteration 23: Rewrite sunridge.tmx
**Map 2D**: Sunridge (North Settled Lands)
**Tileset**: tiles_grassland_normal
**Size**: 40x40

### Iteration 24: Rewrite resonance-fields.tmx
**Map 3A**: Resonance Fields (South Frontier)
**Tileset**: tiles_plains_normal
**Size**: 50x50

### Iteration 25: Rewrite hollow-ridge.tmx
**Map 3B**: Hollow Ridge (East Frontier)
**Tileset**: tiles_mountain_normal
**Size**: 50x50

### Iteration 26: Rewrite shimmer-marsh.tmx
**Map 3C**: Shimmer Marsh (West Frontier)
**Tileset**: tiles_wetland_normal
**Size**: 50x50

### Iteration 27: Rewrite flickerveil.tmx
**Map 3D**: Flickerveil (North Frontier)
**Tileset**: tiles_forest_normal
**Size**: 50x50

### Iteration 28: Rewrite luminous-wastes.tmx
**Map 4A**: Luminous Wastes (Sketch zone)
**Tileset**: tiles_sketch_normal
**Size**: 40x40

### Iteration 29: Rewrite undrawn-peaks.tmx
**Map 4B**: Undrawn Peaks (Sketch zone)
**Tileset**: tiles_sketch_normal
**Size**: 40x40

### Iteration 30: Rewrite half-drawn-forest.tmx
**Map 4C**: Half-Drawn Forest (Sketch zone)
**Tileset**: tiles_sketch_normal
**Size**: 40x40

### Iteration 31: Rewrite depths-l1.tmx
**Depths Level 1**
**Tileset**: tiles_dungeon_normal
**Size**: 20x25

### Iteration 32: Rewrite depths-l2.tmx
**Depths Level 2**
**Size**: 20x25

### Iteration 33: Rewrite depths-l3.tmx
**Depths Level 3**
**Size**: 20x25

### Iteration 34: Rewrite depths-l4.tmx
**Depths Level 4**
**Size**: 20x25

### Iteration 35: Rewrite depths-l5.tmx
**Depths Level 5**
**Size**: 20x25

### Iteration 36: Rewrite fortress-f1.tmx
**Fortress Floor 1**
**Size**: 20x25

### Iteration 37: Rewrite fortress-f2.tmx
**Fortress Floor 2**
**Size**: 20x25

### Iteration 38: Rewrite fortress-f3.tmx
**Fortress Floor 3**
**Size**: 20x25

---

## Phase 4: Visual Verification (Iterations 39-40)

### Iteration 39: Full playthrough verification
- Start dev server
- Click through title screen → class selection → village hub
- Walk to every building, every NPC, every gate
- Transition to at least 2 adjacent maps
- Screenshot each map for visual QC
- Note any remaining issues

### Iteration 40: Fix remaining issues
- Address any problems found in Iteration 39
- Run `pnpm verify:sprites` — confirm 0 warnings
- Run `pnpm build` — confirm clean build
- Final screenshot walkthrough

---

## QC Gate: Definition of Done

- [ ] No text/labels visible on any tile in any tileset
- [ ] Every map loads without errors
- [ ] Every map has recognizable terrain (grass looks like grass, buildings look like buildings)
- [ ] Paths connect locations per the layout diagrams
- [ ] Buildings have walls AND roofs (objects + objects_upper layers)
- [ ] Trees have trunks AND canopies
- [ ] Collision layer matches feature placement (can't walk through buildings)
- [ ] NPC events are at correct positions per overworld-layout.md
- [ ] Map transitions work between adjacent maps
- [ ] Tile seam gaps are minimized (no white lines between tiles)
- [ ] 0 sprite quality warnings from verify-sprites.ts
- [ ] Clean `pnpm build`

---

## Dependencies

| Dependency | Status | Notes |
|------------|--------|-------|
| `gen/builders/tilesets.ts` prompt fixes | NOT STARTED | Must be done before any regen |
| `gen/generators/model-config.ts` Gemini Pro config | NOT STARTED | Need Pro model for tilesets |
| Gemini API key (Doppler) | AVAILABLE | `doppler run --project gha --config ci --` |
| tileset-spec.md | COMPLETE | Authoritative tile definitions |
| overworld-layout.md | COMPLETE | Map layout diagrams and NPC positions |
| dungeon-depths.md | COMPLETE | Underground level specs |
| docs/design/tileset-catalog.md | NOT STARTED | Phase 2 output |

---

## Risk Mitigations

1. **Gemini Pro may still produce text**: Add multiple "no text" directives at different prompt positions. If Pro still adds text, try Gemini Ultra or switch to individual-tile generation instead of full-sheet.
2. **Autotile generation is likely impossible for AI**: Leave autotile rows empty. Autotiles can be hand-authored or procedurally composed later. Focus on getting ground + decoration + obstacle tiles correct.
3. **TMX rewriting is labor-intensive**: 20 maps × ~6 layers each = ~120 layer data arrays to write. Each layer for a 30x30 map is 900 integers. Larger maps (50x50) are 2,500 integers. Total: ~150,000+ tile IDs to specify. Consider writing a helper that takes a simplified room/zone definition and expands to full CSV.
4. **Tile seam gaps may persist**: If PixiJS seams remain after clean tilesets, investigate RPG-JS source for tiling renderer patches or find a PixiJS 7 tilemap plugin that supports extrusion.
