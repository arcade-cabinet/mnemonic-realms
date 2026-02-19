# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What This Is

Mnemonic Realms is a single-player 16-bit JRPG about memory as creative vitality. The world is young and unfinished, growing more vivid as players discover and recall memory fragments. Built as a pure RPG-JS 4.3.0 standalone game (browser-only via `@rpgjs/standalone`, no Express server).

## Commands

```bash
pnpm install          # Install dependencies
pnpm dev              # RPG-JS dev server (rpgjs dev)
pnpm build            # Production build (RPG_TYPE=rpg rpgjs build -> dist/)
pnpm lint             # Biome check (main/**/*.ts, gen/**/*.ts)
pnpm lint:fix         # Biome auto-fix
pnpm test             # Playwright E2E tests (auto-starts dev server)
pnpm test:unit        # Vitest unit tests

# GenAI Pipeline CLI
pnpm gen build [tilesets|sprites|portraits|items|code|all]
pnpm gen generate [images|code|all] [--dry-run] [--force] [--model <id>]
pnpm gen integrate [images|code|all] [--dry-run]
pnpm gen status

# Assemblage System (being built)
pnpm assemblage build [mapId|all]    # Generate TMX + events TS from assemblage definitions
pnpm assemblage preview [mapId]      # ASCII rendering for quick check
pnpm assemblage validate [mapId]     # Check overlaps, gaps, missing hooks
```

## CRITICAL: Creative Direction Overhaul (Active Work)

**Branch**: `creative-direction-overhaul` (worktree at `.worktrees/creative-direction/`)

### What Is Happening

ALL 20 existing maps are being **completely rebuilt** using premium 16x16 tilesets with auto-tiling. The old maps were built on `backterria` tilesets (32x32, no TMX/TSX/Rules support) and look terrible. A new **assemblage system** is being built to compose maps from reusable building blocks.

### CRITICAL RULES — DO NOT VIOLATE

1. **NEVER update or fix backterria references.** All backterria TSX files have been deleted. The old TMX files in `main/server/maps/tmx/` are stubs that will be **completely regenerated** by the assemblage system. Do not try to make them work.

2. **Premium tilesets use 16x16 pixel tiles** (not 32x32 like backterria). A 30x30 map at 32px becomes 60x60 at 16px. This is better — 4x tile resolution.

3. **Maps are built sequentially through the story** (Act 1 → Act 2 → Act 3). Assemblage factories are created as needed and reused. Don't build all assemblages upfront — grow them organically.

4. **The assemblage system generates TMX, not hand-edits.** Never hand-edit TMX files. They are generated outputs. Edit the assemblage definitions in `gen/assemblage/`.

5. **Each map gets a Playwright E2E test.** Map loads, player spawns, NPCs present, transitions work, collisions work.

### Tileset Strategy

**Tile size**: 16x16 pixels across all premium packs.

**Directory structure** (`assets/tilesets/`):
```
exteriors/
  premium/       # Primary overworld (51 TSX, 9 TMX, 6 Rules)
  castles/       # Fortress zones (25 TSX, 3 TMX, 2 Rules)
  desert/        # Desert/Sketch Realm (29 TSX, 5 TMX, 4 Rules)
  seasons/       # Seasonal variety (25 TSX, 5 TMX, 3 Rules)
  snow/          # Snow/mountain zones (32 TSX, 7 TMX, 4 Rules)
  old-town/      # Town exteriors (PNGs only, needs TSX creation)
interiors/
  premium/       # Interior maps (4 TSX, 11 TMX)
  old-town/      # Town interiors (PNGs only, needs TSX creation)
dungeons/        # Dungeon tiles (PNGs only, needs TSX creation)
world/
  tiles/         # World map tiles (PNGs only, needs TSX creation)
```

**Cruft removed**: No PDFs, licenses, readmes, example images. Just PNGs + Tiled files (TMX/TSX/Rules).

**Backup location**: All original packs (including removed ones) backed up to `/Volumes/home/assets/tilesets/`.

### Assemblage System Architecture

The assemblage system lives in `gen/assemblage/` and has these layers:

1. **Tileset tooling** (`gen/assemblage/tileset/`):
   - `tsx-parser.ts` — Parses TSX XML → structured data (tile dims, Wang sets, collisions, animations)
   - `palette-builder.ts` — Maps Wang set colors → semantic tile names, computes auto-tiling transitions
   - `palettes/*.ts` — Theme palettes (village-premium, fortress-castles, desert-sketch, etc.)

2. **Core types** (`gen/assemblage/types.ts`):
   - `SemanticTile` — String reference to a tile concept (e.g., `'ground.grass'`)
   - `TileStamp` — Rectangular grid of semantic tiles for one layer
   - `AssemblageDefinition` — Complete assemblage (layers, collision, objects, hooks, anchors)
   - `MapComposition` — Full map definition (canvas size, theme, placements, paths, objects)

3. **Pipeline** (`gen/assemblage/pipeline/`):
   - `canvas.ts` — Multi-layer canvas with stamp/addPath/applyBorder operations
   - `tmx-serializer.ts` — Canvas + palette → TMX XML output
   - `event-codegen.ts` — Objects + hooks → TypeScript event code

4. **Assemblage factories** (`gen/assemblage/assemblages/`):
   - Grouped by domain: buildings/, terrain/, props/, dungeons/
   - Each factory returns an `AssemblageDefinition`
   - Factories are created as needed during map building and reused

5. **Map compositions** (`gen/assemblage/maps/`):
   - One file per map: `village-hub.ts`, `heartfield.ts`, etc.
   - Each composes a map from assemblage placements + paths + objects

6. **CLI** (`gen/assemblage/cli.ts`):
   - `pnpm assemblage build [mapId]` — Generate TMX + events TS
   - `pnpm assemblage preview [mapId]` — ASCII rendering
   - `pnpm assemblage validate [mapId]` — Overlap/gap/hook checks

### Map Building Workflow (For Any Agent)

To build the NEXT map in sequence:

1. **Check progress** below to find which map is next
2. **Read the design docs** for that scene/zone in `docs/maps/` and `docs/story/`
3. **Review what assemblages exist** in `gen/assemblage/assemblages/`
4. **Create new factories** as needed (reuse existing ones where possible)
5. **Write the map composition** in `gen/assemblage/maps/{map-id}.ts`
6. **Generate**: `pnpm assemblage build {map-id}`
7. **Write E2E test** in `tests/e2e/maps/{map-id}.test.ts`
8. **Verify**: `pnpm build` passes, `pnpm assemblage validate {map-id}` clean
9. **Update progress** in this CLAUDE.md

### Map Palettes (Which Tileset Pack → Which Maps)

| Palette | Source Pack | Maps |
|---------|-----------|------|
| `village-premium` | exteriors/premium | Village Hub, Heartfield, Ambergrove, Millbrook, Sunridge |
| `dungeon-depths` | dungeons/ | Depths L1-L5 |
| `frontier-seasons` | exteriors/seasons + snow | Shimmer Marsh, Hollow Ridge, Flickerveil, Resonance Fields |
| `desert-sketch` | exteriors/desert | Luminous Wastes, Undrawn Peaks, Half-Drawn Forest |
| `fortress-castles` | exteriors/castles | Preserver Fortress F1-F3 |
| `interior-premium` | interiors/premium | All shop/inn interior maps |

## Progress Tracking

### Phase 1: Asset Reorganization ✅ COMPLETE
- [x] Verified originals in assets/tilesets/ (all 17 packs intact)
- [x] Backed up all tilesets to /Volumes/home/assets/tilesets/
- [x] Removed 7 unused packs (32px, backterria, fantasy-free, grand-forests, lonesome-forest, natural-interiors, pixel-dungeon)
- [x] Reorganized 10 kept packs into domain structure (exteriors/interiors/dungeons/world)
- [x] Stripped cruft (PDFs, licenses, readmes, example images)
- [x] Deleted all backterria TSX from main/server/maps/tmx/

### Phase 2: Tileset Tooling ⬜ NEXT
- [ ] TSX parser tool (`gen/assemblage/tileset/tsx-parser.ts`)
- [ ] Palette generator (`gen/assemblage/tileset/palette-builder.ts`)
- [ ] Create TSX definitions for packs without them (old-town, world-map, dungeons) — ONLY when needed for a specific map
- [ ] PNG review tool (optional, create when useful)

### Phase 3: Assemblage System ⬜
- [ ] Core types (`gen/assemblage/types.ts`)
- [ ] Map canvas (`gen/assemblage/pipeline/canvas.ts`)
- [ ] TMX serializer (`gen/assemblage/pipeline/tmx-serializer.ts`)
- [ ] Event codegen (`gen/assemblage/pipeline/event-codegen.ts`)
- [ ] CLI (`gen/assemblage/cli.ts`)

### Phase 4: Sequential Map Building ⬜

**Act 1: Awakening (Village Hub + Settled Lands)**
- [ ] Map 1: Village Hub (60x60 @ 16px, vibrancy 60) — first map, creates ~13 assemblage factories
- [ ] Village Hub shop interiors (Khali's shop, Hark's forge, Bright Hearth inn)
- [ ] Map 2: Heartfield (80x80, vibrancy 55) — farm, field, stagnation-clearing assemblages
- [ ] Map 3: Ambergrove (80x80, vibrancy 50) — forest-clearing, lake, camp
- [ ] Map 4: Millbrook (80x80, vibrancy 45) — bridge, watermill, dock, river
- [ ] Map 5: Sunridge (80x80, vibrancy 40) — mountain-path, shrine, outpost
- [ ] Map 6: Depths L1 (40x50, vibrancy 25) — dungeon-corridor, dungeon-room, stairway

**Act 2: Expansion (Frontier)**
- [ ] Maps 7-10: Shimmer Marsh, Hollow Ridge, Flickerveil, Resonance Fields
- [ ] Maps 11-14: Depths L2-L5

**Act 3: Renaissance (Sketch + Fortress)**
- [ ] Maps 15-17: Luminous Wastes, Undrawn Peaks, Half-Drawn Forest
- [ ] Maps 18-20: Preserver Fortress F1-F3

### Phase 5: Cross-Cutting Fixes (During Map Building)
- [ ] Shop interior system (interior maps replace dropdown menus)
- [ ] Town placard HUD (zone name display on map entry)
- [ ] Random encounter zone definitions per new maps
- [ ] NPC dialogue fleshing out per map

## Architecture

### RPG-JS Module (`main/`)

Single RPG-JS module. No Next.js, no React. RPG-JS uses its own Vite-based compiler (`rpgjs dev`/`rpgjs build`).

**`main/index.ts`** — Module entry using RPG-JS `client!`/`server!` import flags for tree-shaking.

**`main/server/index.ts`** — Server module registration. Maps, player hooks, database.

**`main/client/index.ts`** — Client module. Registers spritesheets and GUI components.

**`main/server/maps/`** — RPG-JS map classes. Each uses `@MapData()` decorator with TMX file reference. Event spawning via `spawnMapEvents()` in `onJoin()`.

**`main/server/maps/tmx/`** — TMX map files. Currently contain old backterria-based stubs. Will be **completely replaced** by assemblage-generated TMX.

**`main/server/maps/events/`** — Event TypeScript files. Each map has a corresponding events file with factory functions for NPCs and events.

### GenAI Pipeline (`gen/`)

Manifest-driven asset and code generation using Google Gemini.

**`gen/cli.ts`** — Unified CLI entry. Dispatches to build/generate/integrate/status.

**`gen/config/`** — Art direction constants, color palette, dimension presets.

**`gen/schemas/`** — Zod schemas for pipeline data.

**`gen/builders/`** — Manifest builders. DDL data → manifest JSON.

**`gen/generators/`** — Gemini API runners for code and audio generation.

**`gen/integrators/`** — Post-processing: gen/output → main/.

**`gen/ddl/`** — Data Definition Layer. Game data by category.

**`gen/manifests/`** — JSON tracking generation status. Committed to git.

**`gen/assemblage/`** — **NEW**: Composable map building system (see Assemblage System Architecture above).

### Bible Docs (`docs/`)

Source of truth for all game content. Written by Ralph (autonomous agent).

- `docs/design/` — tileset-spec, spritesheet-spec, visual-direction, skills/enemies/items catalogs, combat, classes, progression
- `docs/story/` — characters, structure, act scripts (1-3), dialogue-bank, quest-chains
- `docs/world/` — core-theme, setting, factions, geography, vibrancy-system, dormant-gods
- `docs/maps/` — overworld-layout, frontier-zones, dungeon-depths, stagnation-zones, event-placement
- `docs/bible/` — master-index, implementation-order, consistency-check

### Key Patterns

- **RPG-JS standalone**: `RPG_TYPE=rpg` env var + `@rpgjs/standalone` mocks socket.io for single-player browser deployment.
- **16x16 pixel tiles**: All premium tilesets use 16x16. Maps are sized accordingly (60x60 = 960px wide).
- **Assemblage composition**: Maps built from reusable pieces, not hand-crafted. `gen/assemblage/` generates TMX + events.
- **Idempotent pipeline**: SHA-256 prompt hash + output hash + manifest merge = assets only regenerate when prompts change.
- **DocRef system**: Manifest entries reference bible sections by `{ path, heading, purpose }`.
- **DDL architecture**: `gen/ddl/` separates creative content (docs) from mechanical specs (DDL).
- **Sequential map building**: Maps built in story order. Assemblage factories grow organically.

### Config Files

- `rpg.toml` — RPG-JS app config: module list
- `biome.json` — Biome 2.3: 2-space indent, single quotes, semicolons, 100 char width
- `tsconfig.json` — `experimentalDecorators` + `emitDecoratorMetadata` for RPG-JS decorators
- `index.html` — Minimal HTML shell with `<div id="rpg">` for PixiJS canvas

### CI

GitHub Actions (`.github/workflows/build-deploy.yml`): pnpm install -> lint -> build -> deploy `dist/` to GitHub Pages.
