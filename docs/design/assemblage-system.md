# Assemblage System Architecture

The assemblage system lives in `gen/assemblage/` and composes maps from reusable building blocks.

## Layers

1. **Tileset tooling** (`gen/assemblage/tileset/`):
   - `tsx-parser.ts` -- Parses TSX XML -> structured data (tile dims, Wang sets, collisions, animations)
   - `palette-builder.ts` -- Maps Wang set colors -> semantic tile names, computes auto-tiling transitions
   - `palettes/*.ts` -- Theme palettes (village-premium, fortress-castles, desert-sketch, etc.)

2. **Core types** (`gen/assemblage/types.ts`):
   - `SemanticTile` -- String reference to a tile concept (e.g., `'ground.grass'`)
   - `TileStamp` -- Rectangular grid of semantic tiles for one layer
   - `AssemblageDefinition` -- Complete assemblage (layers, collision, objects, hooks, anchors)
   - `MapComposition` -- Full map definition (canvas size, theme, placements, paths, objects)

3. **Pipeline** (`gen/assemblage/pipeline/`):
   - `canvas.ts` -- Multi-layer canvas with stamp/addPath/applyBorder operations
   - `tmx-serializer.ts` -- Canvas + palette -> TMX XML output
   - `event-codegen.ts` -- Objects + hooks -> TypeScript event code

4. **Assemblage factories** (`gen/assemblage/assemblages/`):
   - Grouped by domain: buildings/, terrain/, props/, dungeons/
   - Each factory returns an `AssemblageDefinition`
   - Created as needed during scene building; reused across maps

5. **Assemblage catalog** (`gen/assemblage/catalog/`):
   - Markdown-defined assemblages organized as atoms -> molecules -> organisms
   - Each `.md` file has YAML frontmatter (id, size, palette, composes) + ASCII grid layers
   - Markdown anchor links as cross-references between assemblages, palettes, and locations

6. **Scene DDL** (`gen/ddl/scenes/`) -- **Source of truth for scene content**:
   - `act1.json`, `act2.json`, `act3.json` -- Scene definitions validated by `gen/schemas/ddl-scenes.ts`
   - Each scene declares: mapId, assemblage refs, NPCs, events, prerequisites, quest changes, narrative metadata
   - Uses pointer pattern: string IDs reference assemblages, dialogues, quests, items in other DDL

7. **Markdown parser** (`gen/assemblage/parser/act-script-parser.ts`):
   - Parses `docs/story/act{N}-script.md` -> scene DDL JSON
   - Extracts: location, trigger, NPCs, events, effects, quest changes, prerequisites
   - `pnpm assemblage parse [act1|act2|act3|all]`

8. **Scene compiler** (`gen/assemblage/compiler/scene-compiler.ts`):
   - Reads scene DDL + map DDL -> MapComposition objects
   - Aggregates all scenes on same map, merges placements/NPCs/events
   - `pnpm assemblage compile [mapId|all]`

9. **CLI** (`gen/assemblage/cli.ts`):
   - `pnpm assemblage build [mapId]` -- Generate TMX + events TS
   - `pnpm assemblage preview [mapId]` -- ASCII rendering
   - `pnpm assemblage validate [mapId]` -- Overlap/gap/hook checks
   - `pnpm assemblage parse [act|all]` -- Markdown -> scene DDL
   - `pnpm assemblage compile [mapId|all]` -- Scene DDL -> MapComposition
   - `pnpm assemblage scenes [mapId]` -- List scenes per map

## Tileset Strategy

**Tile size**: 16x16 pixels across all premium packs.

**Directory structure** (`assets/tilesets-organized/`):

Tilesets are organized by domain, NOT by interior/exterior. Each domain corresponds to a biome or world type.

```
village/           # Settled Lands overworld + child worlds (Everwick, Heartfield, etc.)
  exteriors/       # Outdoor tilesets (51 TSX, 9 TMX, 6 Rules) -- FULL DEFINITIONS
  interiors/       # Child world tilesets (4 TSX, 11 TMX) -- FULL DEFINITIONS
fortress/          # Preserver Fortress (25 TSX, 3 TMX, 2 Rules) -- FULL DEFINITIONS
sketch-realm/      # Sketch Realm (29 TSX, 5 TMX, 4 Rules) -- FULL DEFINITIONS
frontier/          # Frontier seasonal zones (25 TSX, 5 TMX, 3 Rules) -- FULL DEFINITIONS
mountain/          # Mountain/snow zones (32 TSX, 7 TMX, 4 Rules) -- FULL DEFINITIONS
depths/            # Dungeon tiles -- PNGs ONLY, NEEDS TSX+RULES CREATION
shared/            # Common cross-domain assets
old-town/          # Old town tiles -- PNGs ONLY, NEEDS TSX+RULES CREATION
world/
  tiles/           # World map tiles -- PNGs ONLY, NEEDS TSX+RULES CREATION
```

**PARITY GAP**: The premium fantasy packs (village, fortress, sketch-realm, frontier, mountain) all have full TSX definitions, Wang set auto-tile rules, collision data, and animation frames. But dungeons, old-town, and world map tilesets are raw PNGs without any of this. They need comprehensive vision analysis to create TSX, palette entries, auto-tile rules, collision masks, interaction definitions, and animation sequences.

## Map Palettes

| Palette | Source Pack | Maps | Status |
|---------|-----------|------|--------|
| `village-premium` | village/exteriors | Everwick, Heartfield, Ambergrove, Millbrook, Sunridge | Built |
| `interior-premium` | village/interiors | All child world maps (shops, inns, residences) | Built |
| `dungeon-depths` | depths/ | Depths L1-L5 | Built (palette only; source PNGs lack TSX) |
| `frontier-seasons` | frontier/ + mountain/ | Shimmer Marsh, Hollow Ridge, Flickerveil, Resonance Fields | Built |
| `desert-sketch` | sketch-realm/ | Luminous Wastes, Undrawn Peaks, Half-Drawn Forest | Built |
| `fortress-castles` | fortress/ | Preserver Fortress F1-F3 | Built |
