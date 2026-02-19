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

# Assemblage System
pnpm assemblage build [mapId|all]    # Generate TMX + events TS from assemblage definitions
pnpm assemblage preview [mapId]      # ASCII rendering for quick check
pnpm assemblage validate [mapId]     # Check overlaps, gaps, missing hooks
```

---

## CREATIVE DIRECTION — YOU ARE THE CREATIVE DIRECTOR

This is NOT a technical exercise. This is a living game world. Every name, every label, every interaction, every map must feel like part of an organic, inhabited world. **If something reads like a design-doc placeholder, a wireframe label, or a programmer's shorthand — OWN THE GAP. Fix it. Name it. Make it real.**

### The Mandate

1. **Every place needs a real name.** "Village Hub" is not a village. "Map 2" is not a destination. Use compound-word naming following established conventions (Heartfield, Ambergrove, Millbrook, Sunridge, Everwick).

2. **Every NPC needs personality.** Generic dialogue like "Welcome to the shop" is not acceptable. NPCs have histories, opinions, and speech patterns documented in `docs/story/characters.md` and `docs/story/dialogue-bank.md`.

3. **Every event should feel authored.** "You examine the quest-board" is a placeholder. Describe what the player actually sees, hears, and feels.

4. **No confirmation needed.** When you find a gap in creative quality, fix it immediately. Document your decision in the Creative Decisions Log below so future agents understand the reasoning.

5. **Think like a player, not a developer.** Would a player say "I'm in the Village Hub"? No. They'd say "I'm in Everwick." Would a player read "You examine the rs-ew-01"? No. They'd read about a glowing resonance stone pulsing with warmth.

### Creative Decisions Log

Document all creative decisions here so any agent can understand what was decided and why.

| Decision | Rationale | Date |
|----------|-----------|------|
| "Village Hub" → **Everwick** | Placeholder name. "Ever" = enduring/eternal (most-remembered place), "wick" = Old English for settlement (Warwick, Berwick). Follows compound-word pattern of surrounding zones. | 2026-02-19 |
| Event prefix `vh` → `ew` | Resonance stones `rs-ew-*`, chests `ch-ew-*` match the new map ID. | 2026-02-19 |
| BGM ID stays `bgm-vh` | Audio file IDs are internal, not player-facing. Renaming audio files is a separate concern. | 2026-02-19 |
| JSON DDL over TypeScript for scenes | Scene definitions are DATA, not code. JSON + Zod validation = parseable, diffable, generatable. TypeScript map compositions become compiled output, not hand-authored source. | 2026-02-19 |
| Markdown parser generates scene DDL | The act scripts in `docs/story/` are the narrative source of truth. The parser (`gen/assemblage/parser/act-script-parser.ts`) extracts structured data and generates `gen/ddl/scenes/act{N}.json`. Re-run when docs change. | 2026-02-19 |
| Scene compiler replaces hand-authored maps | The compiler reads scene DDL + map DDL → produces MapComposition objects. The `gen/assemblage/maps/*.ts` files will be deprecated as scene DDL is populated with assemblage refs. | 2026-02-19 |

### Zone Naming Convention

All zones use **compound English words**: [descriptor] + [geographic feature].

| Zone | Name Parts | Meaning |
|------|-----------|---------|
| Everwick | ever + wick | The eternal settlement |
| Heartfield | heart + field | Warm farmland |
| Ambergrove | amber + grove | Golden forest |
| Millbrook | mill + brook | Watermill on the stream |
| Sunridge | sun + ridge | Sun-washed highlands |

Future zones should follow this pattern. If the design docs use a placeholder, create a proper name.

---

## CRITICAL: Creative Direction Overhaul (Active Work)

### What Is Happening

ALL 20 existing maps are being **completely rebuilt** using premium 16x16 tilesets with auto-tiling. The old maps were built on `backterria` tilesets (32x32, no TMX/TSX/Rules support) and look terrible. A new **assemblage system** composes maps from reusable building blocks.

### CRITICAL RULES — DO NOT VIOLATE

1. **NEVER update or fix backterria references.** All backterria TSX files have been deleted. Old TMX files are stubs that will be **completely regenerated** by the assemblage system.

2. **Premium tilesets use 16x16 pixel tiles** (not 32x32). A 30x30 map at 32px becomes 60x60 at 16px.

3. **The game is story-driven.** Code structure follows the narrative: Acts → Scenes → Maps. Not the other way around. See "Narrative-First Architecture" below.

4. **The assemblage system generates TMX, not hand-edits.** Never hand-edit TMX files. Edit assemblage definitions in `gen/assemblage/`.

5. **Every scene gets a Playwright E2E test.** Not just maps — scenes. Each test injects the required game state and validates the scene plays correctly.

---

## Narrative-First Architecture

### The Problem

The design docs are organized by **Acts and Scenes** (the story), but the code was organized by **Maps** (the geography). This is backwards for a story-driven RPG. The story drives what maps are needed, not the other way around.

### The Structure: DDL-Driven Scene Architecture

The source of truth is **JSON DDL validated by Zod**. No TypeScript needed for scene definitions.

```
SOURCE (narrative-aligned, JSON DDL):
gen/schemas/ddl-scenes.ts        # Zod schema — the contract for all scene data
gen/ddl/scenes/act1.json         # 12 scenes with assemblage refs, NPC pointers, effects
gen/ddl/scenes/act2.json         # 18 scenes
gen/ddl/scenes/act3.json         # 12 scenes
gen/ddl/maps/everwick.json       # Geographic specs (canvas, tilesets, connections)

PIPELINE:
gen/assemblage/parser/           # Markdown → DDL parser
  act-script-parser.ts           # Reads docs/story/act{N}-script.md → scene DDL JSON
gen/assemblage/compiler/         # DDL → MapComposition compiler
  scene-compiler.ts              # Reads scene DDL + map DDL → MapComposition objects
gen/assemblage/pipeline/         # MapComposition → output files
  canvas.ts                      # Multi-layer stamp/path/border operations
  tmx-serializer.ts              # Canvas + palette → TMX XML
  event-codegen.ts               # Objects + hooks → TypeScript events

COMPILED OUTPUT (RPG-JS-aligned):
main/server/maps/everwick.ts     # Generated map class
main/server/maps/events/         # Generated event spawning
main/server/maps/tmx/            # Generated TMX files
gen/ddl/compiled/                # Scene metadata for E2E tests
```

### CLI Workflow

```bash
# Step 1: Parse act scripts → scene DDL JSON (re-run when docs change)
pnpm assemblage parse all

# Step 2: Compile scene DDL → TMX + events (re-run when DDL or assemblages change)
pnpm assemblage compile everwick

# Step 3: View scene coverage
pnpm assemblage scenes all        # List all maps and their scenes
pnpm assemblage scenes everwick   # Show scene details for one map

# Legacy: Build from TypeScript compositions (still works for existing maps)
pnpm assemblage build everwick
```

### Scene → Map Relationship

Each scene specifies which map it takes place on. Multiple scenes can use the same map. The scene scripts in `main/server/events/act*/` contain the narrative logic (triggers, conditions, dialogue sequences). The map files just handle geography and event spawning.

| Act 1 Scene | Location | Map ID |
|------------|----------|--------|
| Scene 1: A Familiar Place | Everwick — Elder's House | `everwick` |
| Scene 2: Memorial Garden | Everwick — Memorial Garden | `everwick` |
| Scene 3: Training Ground | Everwick — Training Ground | `everwick` |
| Scene 4: Hana's Workshop | Everwick — Workshop | `everwick` |
| Scene 5: First Journey | Heartfield | `heartfield` |
| Scene 6: The Ancient Grove | Ambergrove | `ambergrove` |
| Scene 7: River Crossing | Millbrook | `millbrook` |
| Scene 8: The High Road | Sunridge | `sunridge` |
| Scene 9: Into the Depths | Memory Cellar | `depths-l1` |
| Scene 10: Return & Report | Everwick | `everwick` |
| Scene 11: The Clearing Grows | Heartfield | `heartfield` |
| Scene 12: New Resolve | Everwick — Lookout Hill | `everwick` |

### Building Workflow (Scene-Driven)

For each act/scene in sequence:

1. **Read the scene script** in `docs/story/act{N}-script.md`
2. **Identify the map** the scene takes place on
3. **If the map doesn't exist yet**: Build it via assemblage system
   - Identify new/reusable assemblages needed
   - Create assemblage factories
   - Write the map composition
   - Generate: `pnpm assemblage build {map-id}`
4. **Review the scene's events/NPCs/dialogue** for creative quality
   - Fix placeholder names, generic dialogue, wireframe labels
   - Ensure NPC personalities match character docs
5. **Write the scene's Playwright E2E test** (see Scene Testing below)
6. **Run the AI player controller** through the scene
7. **Update progress** in this CLAUDE.md

---

## Scene Testing Infrastructure

### Scene State Injection

The game supports jumping to any act/scene via URL query parameters for testing:

```
?act=1&scene=1    # Jump to Act 1, Scene 1 (Everwick, Elder's House)
?act=1&scene=5    # Jump to Act 1, Scene 5 (First journey to Heartfield)
?act=2&scene=1    # Jump to Act 2, Scene 1 (Frontier opens)
```

**Implementation** (TODO — build as part of scene testing infrastructure):
- `main/server/systems/scene-loader.ts` — Reads query params, injects required game state
- Each scene defines its prerequisites: map, player position, quest flags, party members, inventory, vibrancy levels
- Scene loader sets all prerequisites and teleports the player to the correct location
- Works in both dev mode (`pnpm dev`) and E2E tests

### Playwright E2E Tests Per Scene

Each scene gets a dedicated test file:

```
tests/e2e/scenes/
  act1-scene01-familiar-place.test.ts
  act1-scene02-memorial-garden.test.ts
  act1-scene03-training-ground.test.ts
  ...
```

Each test:
1. **Navigates** to `/?act={N}&scene={M}` to inject scene state
2. **Validates** the scene loads correctly (correct map, NPCs present, UI elements)
3. **Runs the AI player controller** with scene-specific instructions
4. **Asserts** scene completion criteria (quest flags set, dialogue completed, transitions triggered)

### AI Player Controller

An AI-governed E2E player controller that can navigate the game world and execute scene instructions:

```typescript
// Example test structure
test('Act 1, Scene 1: A Familiar Place', async ({ page }) => {
  await page.goto('/?act=1&scene=1');
  await waitForMapLoad(page, 'everwick');

  // AI player controller executes scene instructions
  await playScene(page, {
    instructions: [
      'Talk to Artun in the Elder\'s House',
      'Listen to the awakening dialogue',
      'Exit the Elder\'s House to the village square',
      'Optionally talk to Khali, Hark, or Nyro',
    ],
    successCriteria: {
      questFlags: ['MQ-01'],
      visitedLocations: ['elders-house'],
    },
  });
});
```

---

## Assemblage System Architecture

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
   - Created as needed during scene building; reused across maps

5. **Scene DDL** (`gen/ddl/scenes/`) — **Source of truth for scene content**:
   - `act1.json`, `act2.json`, `act3.json` — Scene definitions validated by `gen/schemas/ddl-scenes.ts`
   - Each scene declares: mapId, assemblage refs, NPCs, events, prerequisites, quest changes, narrative metadata
   - Uses pointer pattern: string IDs reference assemblages, dialogues, quests, items in other DDL

6. **Markdown parser** (`gen/assemblage/parser/act-script-parser.ts`):
   - Parses `docs/story/act{N}-script.md` → scene DDL JSON
   - Extracts: location, trigger, NPCs, events, effects, quest changes, prerequisites
   - `pnpm assemblage parse [act1|act2|act3|all]`

7. **Scene compiler** (`gen/assemblage/compiler/scene-compiler.ts`):
   - Reads scene DDL + map DDL → MapComposition objects
   - Aggregates all scenes on same map, merges placements/NPCs/events
   - `pnpm assemblage compile [mapId|all]`

8. **CLI** (`gen/assemblage/cli.ts`):
   - `pnpm assemblage build [mapId]` — Generate TMX + events TS
   - `pnpm assemblage preview [mapId]` — ASCII rendering
   - `pnpm assemblage validate [mapId]` — Overlap/gap/hook checks
   - `pnpm assemblage parse [act|all]` — Markdown → scene DDL
   - `pnpm assemblage compile [mapId|all]` — Scene DDL → MapComposition
   - `pnpm assemblage scenes [mapId]` — List scenes per map

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

### Map Palettes

| Palette | Source Pack | Maps |
|---------|-----------|------|
| `village-premium` | exteriors/premium | Everwick, Heartfield, Ambergrove, Millbrook, Sunridge |
| `dungeon-depths` | dungeons/ | Depths L1-L5 |
| `frontier-seasons` | exteriors/seasons + snow | Shimmer Marsh, Hollow Ridge, Flickerveil, Resonance Fields |
| `desert-sketch` | exteriors/desert | Luminous Wastes, Undrawn Peaks, Half-Drawn Forest |
| `fortress-castles` | exteriors/castles | Preserver Fortress F1-F3 |
| `interior-premium` | interiors/premium | All shop/inn interior maps |

---

## Progress Tracking

### Phase 1: Asset Reorganization ✅ COMPLETE (PR #20)
- [x] Verified originals, backed up to /Volumes/home/assets/tilesets/
- [x] Removed 7 unused packs, reorganized 10 kept packs
- [x] Stripped cruft, deleted all backterria TSX

### Phase 2: Tileset Tooling ✅ COMPLETE (PR #21)
- [x] TSX parser (`gen/assemblage/tileset/tsx-parser.ts`)
- [x] Palette generator (`gen/assemblage/tileset/palette-builder.ts`)
- [x] Village-premium palette with terrain + object definitions

### Phase 3: Assemblage System ✅ COMPLETE (PR #21)
- [x] Core types (`gen/assemblage/types.ts`)
- [x] Map canvas (`gen/assemblage/pipeline/canvas.ts`)
- [x] TMX serializer (`gen/assemblage/pipeline/tmx-serializer.ts`)
- [x] Event codegen (`gen/assemblage/pipeline/event-codegen.ts`)
- [x] CLI (`gen/assemblage/cli.ts`)

### Phase 3.5: DDL-Driven Scene Architecture ✅ COMPLETE
- [x] Enhanced scene DDL schema (`gen/schemas/ddl-scenes.ts`) — 30+ fields covering assemblage refs, NPCs, events, prerequisites, test criteria, narrative metadata, cross-DDL pointers
- [x] Markdown-to-DDL parser (`gen/assemblage/parser/act-script-parser.ts`) — Parses `docs/story/act{N}-script.md` → scene DDL JSON. 42 scenes generated (12 + 18 + 12)
- [x] Scene compiler (`gen/assemblage/compiler/scene-compiler.ts`) — Reads scene DDL + map DDL → MapComposition. Merges assemblages, NPCs, events, transitions per map
- [x] CLI commands: `pnpm assemblage parse [act1|act2|act3|all]`, `pnpm assemblage compile [mapId|all]`, `pnpm assemblage scenes [mapId]`
- [x] Scene DDL generated: `gen/ddl/scenes/act1.json` (12 scenes), `act2.json` (18 scenes), `act3.json` (12 scenes)
- [x] Compiled output: `gen/ddl/compiled/{mapId}-scenes.json` — Scene metadata for E2E test scaffolding
- [x] Village-hub → Everwick rename completed across all DDL, manifests, scripts, events, TMX files (43 files)

### Phase 4: Scene-Driven Map Building 🔄 IN PROGRESS

**Act 1: Awakening (Everwick + Settled Lands)**

| Scene | Map | Status | Assemblages Created |
|-------|-----|--------|-------------------|
| Scenes 1-4 | Everwick (60x60) | ✅ Map built | house, forest-border |
| Scene 5 | Heartfield (80x80) | ⬜ Next | farm, field, stagnation-clearing |
| Scene 6 | Ambergrove (80x80) | ⬜ | forest-clearing, lake, camp |
| Scene 7 | Millbrook (80x80) | ⬜ | bridge, watermill, dock, river |
| Scene 8 | Sunridge (80x80) | ⬜ | mountain-path, shrine, outpost |
| Scene 9 | Depths L1 (40x50) | ⬜ | dungeon-corridor, dungeon-room |
| Scenes 10-12 | Everwick (return) | ⬜ | (reuse existing) |

Everwick shop interiors (Khali's shop, Hark's forge, Bright Hearth inn) — build when Scene 1-4 testing reveals they're needed.

**Act 2: Expansion (Frontier)**
- Scenes 13-18: Shimmer Marsh, Hollow Ridge, Flickerveil, Resonance Fields
- Scenes 19-22: Depths L2-L5

**Act 3: Renaissance (Sketch + Fortress)**
- Scenes 23-28: Luminous Wastes, Undrawn Peaks, Half-Drawn Forest
- Scenes 29-36: Preserver Fortress F1-F3

### Phase 5: Cross-Cutting (Built During Scene Work)
- [ ] Scene state injection system (`?act=N&scene=M` query params)
- [ ] AI player controller for E2E scene testing
- [ ] Shop interior system (interior maps replace dropdown menus)
- [ ] Town placard HUD (zone name display on map entry)
- [ ] Random encounter zone definitions per new maps
- [ ] NPC dialogue quality pass per scene

---

## Architecture

### RPG-JS Module (`main/`)

Single RPG-JS module. No Next.js, no React. RPG-JS uses its own Vite-based compiler.

**`main/index.ts`** — Module entry using RPG-JS `client!`/`server!` import flags.

**`main/server/index.ts`** — Server module registration. Maps, player hooks, database.

**`main/server/events/act{N}/`** — Scene event scripts organized by act. Each scene file contains trigger conditions, dialogue sequences, and state transitions.

**`main/server/maps/`** — RPG-JS map classes (generated by assemblage system). Each uses `@MapData()` decorator + TMX reference + `spawnMapEvents()`.

**`main/server/maps/events/`** — Map event files (generated by assemblage system). Spawn NPCs and gameplay events per map.

**`main/server/systems/`** — Game systems: vibrancy, memory, npc-interaction, combat, save-load, scene-loader.

**`main/client/`** — Client module. Spritesheets, GUI components, audio.

### GenAI Pipeline (`gen/`)

Manifest-driven asset and code generation using Google Gemini.

**`gen/assemblage/`** — Composable map building system (see Assemblage System Architecture above).

**`gen/cli.ts`** — Unified pipeline CLI.

**`gen/ddl/`** — Data Definition Layer. Game data by category (armor, classes, enemies, maps, scenes, etc.). Scene DDL (`gen/ddl/scenes/act{N}.json`) is the primary scene source of truth — compiled into maps by the scene compiler.

**`gen/ddl/compiled/`** — Compiled output from scene compiler. `{mapId}-scenes.json` contains scene metadata for E2E test scaffolding.

**`gen/manifests/`** — JSON tracking generation status. Committed to git.

### Bible Docs (`docs/`)

Source of truth for all game content.

- `docs/story/` — **Primary driver.** Act scripts, characters, dialogue-bank, quest-chains, structure
- `docs/maps/` — overworld-layout, frontier-zones, dungeon-depths, event-placement
- `docs/world/` — core-theme, setting, factions, geography, vibrancy-system, dormant-gods
- `docs/design/` — visual-direction, tileset-spec, spritesheet-spec, combat, classes, progression

### Key Patterns

- **RPG-JS standalone**: `RPG_TYPE=rpg` + `@rpgjs/standalone` mocks socket.io for single-player browser.
- **16x16 pixel tiles**: All premium tilesets. Maps sized accordingly (60x60 = 960px).
- **Assemblage composition**: Maps built from reusable pieces via `gen/assemblage/`.
- **DDL-driven scenes**: Scene definitions are JSON DDL validated by Zod — not hand-authored TypeScript. The scene compiler aggregates scenes per map into MapComposition objects.
- **Pointer pattern**: Scene DDL uses string IDs (assemblageId, npcId, dialogueRef, questRefs) referencing other DDL entries. No duplication.
- **Narrative-first**: Story drives map creation. Acts/Scenes are the organizing principle. `docs/story/act{N}-script.md` → parser → scene DDL → compiler → map output.
- **Scene testing**: Every scene gets a Playwright E2E test with state injection.

### Config Files

- `rpg.toml` — RPG-JS app config: module list
- `biome.json` — Biome 2.3: 2-space indent, single quotes, semicolons, 100 char width
- `tsconfig.json` — `experimentalDecorators` + `emitDecoratorMetadata` for RPG-JS decorators
- `index.html` — Minimal HTML shell with `<div id="rpg">` for PixiJS canvas

### CI

GitHub Actions: pnpm install → lint → build → deploy `dist/` to GitHub Pages.
