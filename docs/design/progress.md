# Progress Tracking

## Phase 1: Asset Reorganization COMPLETE (PR #20)
- [x] Verified originals, backed up to /Volumes/home/assets/tilesets/
- [x] Removed 7 unused packs, reorganized 10 kept packs
- [x] Stripped cruft, deleted all backterria TSX

## Phase 2: Tileset Tooling COMPLETE (PR #21)
- [x] TSX parser (`gen/assemblage/tileset/tsx-parser.ts`)
- [x] Palette generator (`gen/assemblage/tileset/palette-builder.ts`)
- [x] Village-premium palette with terrain + object definitions

## Phase 3: Assemblage System COMPLETE (PR #21)
- [x] Core types (`gen/assemblage/types.ts`)
- [x] Map canvas (`gen/assemblage/pipeline/canvas.ts`)
- [x] TMX serializer (`gen/assemblage/pipeline/tmx-serializer.ts`)
- [x] Event codegen (`gen/assemblage/pipeline/event-codegen.ts`)
- [x] CLI (`gen/assemblage/cli.ts`)

## Phase 3.5: DDL-Driven Scene Architecture COMPLETE
- [x] Enhanced scene DDL schema (`gen/schemas/ddl-scenes.ts`) -- 30+ fields covering assemblage refs, NPCs, events, prerequisites, test criteria, narrative metadata, cross-DDL pointers
- [x] Markdown-to-DDL parser (`gen/assemblage/parser/act-script-parser.ts`) -- Parses `docs/story/act{N}-script.md` -> scene DDL JSON. 42 scenes generated (12 + 18 + 12)
- [x] Scene compiler (`gen/assemblage/compiler/scene-compiler.ts`) -- Reads scene DDL + map DDL -> MapComposition. Merges assemblages, NPCs, events, transitions per map
- [x] CLI commands: `pnpm assemblage parse [act1|act2|act3|all]`, `pnpm assemblage compile [mapId|all]`, `pnpm assemblage scenes [mapId]`
- [x] Scene DDL generated: `gen/ddl/scenes/act1.json` (12 scenes), `act2.json` (18 scenes), `act3.json` (12 scenes)
- [x] Compiled output: `gen/ddl/compiled/{mapId}-scenes.json` -- Scene metadata for E2E test scaffolding
- [x] Village-hub -> Everwick rename completed across all DDL, manifests, scripts, events, TMX files (43 files)

## Phase 4: Markdown-as-DDL + Parallel Bootstrap IN PROGRESS

### Phase A: Palette + Assemblage Catalog COMPLETE
- [x] All 7 palettes built (village-premium, interior-premium, frontier-seasons, snow-mountain, fortress-castles, desert-sketch, dungeon-depths)
- [x] 92 assemblage catalog markdown files across all domains
- [x] Tilesets reorganized from pack-based to domain-based directories
- [x] Assemblage markdown parser (25/25 tests passing)
- [x] Library-backed table parser utility

### Phase B: Docs Hierarchy COMPLETE
- [x] Pass 1: Split overworld-layout.md into docs/world/ hierarchy (regions + locations)
- [x] Pass 2: Enrich location files with assemblage anchor links, correct sprite IDs

### Phase C: Markdown World Compiler COMPLETE
- [x] Build world-markdown-compiler.ts (reads docs/world/ hierarchy -> DDL JSON)
- [x] Parses all 3 levels: world index -> region indexes -> location files
- [x] Produces WorldDefinition + RegionDefinition with anchors, mapLayout, NPCs, events, transitions
- [x] Wire into CLI as `pnpm assemblage compile-world`
- [x] 24 tests passing (world-markdown-compiler.test.ts)
- [x] End-to-end: compile-world -> build-region settled-lands -> TMX + events (5 anchors, 200x200 tiles, 33 NPCs, 7 doors)
- [x] assemblage-parser.ts already existed (Phase A)
- [ ] Build child-world-composer.ts (template + world slots -> child world map) -- deferred to scene work

### Phase D: Verification COMPLETE
- [x] End-to-end: compile-world -> build-region -> TMX + events generated successfully
- [x] All 838 unit tests passing (0 failures)
- [x] Production build succeeds (pnpm build)
- [x] Fixed 12 pre-existing test failures across 5 files:
  - sketch-plains/mountain/forest sub-biomes registered in biomes.ts
  - SceneEventDdlSchema export aliases added to ddl-scenes.ts
  - preserver-fortress orphan linked to undrawn-peaks anchor
  - MCP indexer YAML parse error handling for markdown-in-frontmatter
  - node:fs mock compatibility for Vitest 4.x ESM
  - MapDdl schema arrays default to empty (backward compat)
  - "follow" NPC movement type added to scene schema
- [ ] Child world door transitions work (needs child-world-composer.ts)
- [x] Full dev server smoke test (pnpm dev boots, serves at localhost:3002)

## Phase 4 (Scene-Driven): Map Building IN PROGRESS

**Act 1: Awakening (Everwick + Settled Lands)**

| Scene | Map | Status | Assemblages Created |
|-------|-----|--------|-------------------|
| Scenes 1-4 | Everwick (60x60) | Map built, events authored | house, forest-border |
| Scene 5 | Heartfield (80x80) | Events authored | farm, field, stagnation-clearing |
| Scene 6 | Ambergrove (80x80) | Events authored | forest-clearing, lake, camp |
| Scene 7 | Millbrook (80x80) | Events authored | bridge, watermill, dock, river |
| Scene 8 | Sunridge (80x80) | Events authored | mountain-path, shrine, outpost |
| Scene 9 | Depths L1 (40x50) | Pending | dungeon-corridor, dungeon-room |
| Scenes 10-12 | Everwick (return) | Pending | (reuse existing) |

Everwick child worlds (Khali's shop, Hark's forge, Bright Hearth inn) -- build when Scene 1-4 testing reveals they're needed.

**Act 2: Expansion (Frontier)**
- Scenes 13-18: Shimmer Marsh, Hollow Ridge, Flickerveil, Resonance Fields
- Scenes 19-22: Depths L2-L5

**Act 3: Renaissance (Sketch + Fortress)**
- Scenes 23-28: Luminous Wastes, Undrawn Peaks, Half-Drawn Forest
- Scenes 29-36: Preserver Fortress F1-F3

### Phase E: Documentation + Asset Alignment IN PROGRESS
- [ ] Replace all `interiors:` frontmatter with `worldSlots:` across docs/world/ location files
- [ ] Update world-markdown-compiler to read `worldSlots:` from frontmatter
- [ ] Comprehensive tileset parity: create TSX + rules for dungeons/, old-town/, world/ PNGs
- [ ] Finalize domain/subdomain asset structure for ALL PNGs, build definitions, auto-rules
- [ ] Vision analysis of non-fantasy PNGs (interactions, animations, 8-point rotation, 4-point, etc.)
- [ ] Implement fill engine ground variant patches (biome groundVariants currently unused)
- [ ] Implement path dressing (biome pathDress rules currently unimplemented)
- [ ] Implement connective tissue wild features (hidden chests, resonance stones, shrines)
- [ ] Steps-based pacing calculations per region (tile distances, walk times, encounter rates)

## Phase 5: Cross-Cutting (Built During Scene Work)
- [ ] Scene state injection system (`?act=N&scene=M` query params)
- [ ] AI player controller for E2E scene testing
- [ ] Child world system (shop/inn/residence worlds accessed via door transitions)
- [ ] Town placard HUD (zone name display on map entry)
- [ ] Random encounter zone definitions per new maps
- [ ] NPC dialogue quality pass per scene
