# CLAUDE.md

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

# Assemblage System
pnpm assemblage compile-world            # Compile docs/world/ hierarchy -> DDL + TMX + events
pnpm assemblage build-region [id|all]    # Build region outdoor maps from DDL
pnpm assemblage build [mapId|all]        # Generate TMX + events TS from compositions
pnpm assemblage preview [mapId]          # ASCII rendering
pnpm assemblage validate [mapId]         # Check overlaps, gaps, missing hooks
pnpm assemblage parse [act1|act2|act3|all] # Markdown act scripts -> scene DDL
pnpm assemblage compile [mapId|all]      # Scene DDL -> MapComposition
pnpm assemblage scenes [mapId]           # List scenes per map
pnpm assemblage test                     # Run assemblage-specific tests
pnpm assemblage snapshot                 # Generate region snapshot PNGs

# GenAI Pipeline
pnpm gen build [tilesets|sprites|portraits|items|code|all]
pnpm gen generate [images|code|all] [--dry-run] [--force] [--model <id>]
pnpm gen status
```

---

## CRITICAL RULES -- DO NOT VIOLATE

1. **NEVER update or fix backterria references.** All backterria TSX files have been deleted. Old TMX files are stubs that will be completely regenerated.

2. **16x16 pixel tiles everywhere.** All premium tilesets. Maps sized accordingly (60x60 = 960px).

3. **Story drives maps.** Code follows Acts -> Scenes -> Maps. Not the other way around. See [narrative-architecture.md](docs/design/narrative-architecture.md).

4. **Never hand-edit TMX.** The assemblage system generates all TMX files. Edit assemblage definitions in `gen/assemblage/`.

5. **Never hand-craft map compositions.** DDL -> region composer -> RegionMap -> MapCanvas -> TMX. Build the bridge, don't bypass the system. See [assemblage-system.md](docs/design/assemblage-system.md).

6. **Build automation, not artifacts.** When the next step requires manual repetition, STOP. Build the tool that automates it.

7. **You are the creative director.** If something reads like a placeholder, fix it. No confirmation needed. See [creative-direction.md](docs/design/creative-direction.md).

---

## Detailed Documentation

| Topic | File | What's In It |
|-------|------|-------------|
| World architecture | [docs/design/world-architecture.md](docs/design/world-architecture.md) | Fractal world algebra, pacing, connective tissue, fill engine |
| Creative direction | [docs/design/creative-direction.md](docs/design/creative-direction.md) | The mandate, naming conventions, decisions log |
| Assemblage system | [docs/design/assemblage-system.md](docs/design/assemblage-system.md) | Full architecture, tileset strategy, palettes |
| Narrative architecture | [docs/design/narrative-architecture.md](docs/design/narrative-architecture.md) | DDL pipeline, scene->map relationship, CLI workflow |
| Scene testing | [docs/design/scene-testing.md](docs/design/scene-testing.md) | State injection, Playwright E2E, AI player controller |
| Progress tracking | [docs/design/progress.md](docs/design/progress.md) | Phase status, per-scene map building status |
| Story bible | `docs/story/` | Act scripts, characters, dialogue-bank, quest-chains |
| World geography | `docs/world/` | Region + location hierarchy (the DDL source of truth) |
| Visual direction | `docs/design/visual-direction.md` | Art style, color palettes, sprite conventions |
| Tileset catalog | `docs/design/tileset-catalog.md` | All tileset packs, what they contain, domain mapping |

---

## Core Concept: Worlds All The Way Down

There are NO "interiors" and "exteriors." There are only **WORLDS**. A shop is a world. A dungeon is a world. The outdoor map is also a world. Everything composes fractally: World -> Regions -> Anchors -> World Slots -> Child Worlds.

**Full details**: [docs/design/world-architecture.md](docs/design/world-architecture.md)

**Wrong terminology -> Right**: "interior" -> "child world", "exterior" -> "region/outdoor world", `interiors:` -> `worldSlots:`

---

## Architecture (Quick Reference)

### RPG-JS Module (`main/`)

Single RPG-JS module. No Next.js, no React.

- `main/server/events/act{N}/` -- Scene event scripts by act
- `main/server/maps/` -- Generated map classes (`@MapData()` + TMX + `spawnMapEvents()`)
- `main/server/maps/events/` -- Generated event spawning per map
- `main/server/systems/` -- Game systems: vibrancy, memory, npc-interaction, combat, save-load
- `main/client/` -- Spritesheets, GUI, audio

### GenAI Pipeline (`gen/`)

- `gen/assemblage/` -- Composable map building system
- `gen/assemblage/composer/` -- Region composer, fill engine, path router, biomes, world DDL
- `gen/assemblage/compiler/` -- Markdown world compiler, scene compiler, assemblage parser
- `gen/assemblage/pipeline/` -- Canvas, TMX serializer, event codegen
- `gen/assemblage/catalog/` -- Markdown assemblage definitions (atoms -> molecules -> organisms)
- `gen/ddl/` -- Data Definition Layer (scenes, maps, enemies, items, etc.)
- `gen/manifests/` -- Generation status tracking

### Bible Docs (`docs/`)

- `docs/story/` -- **Primary driver.** Act scripts, characters, dialogue-bank
- `docs/world/` -- Region + location hierarchy (compilable DDL source of truth)
- `docs/design/` -- Architecture, visual direction, systems design
- `docs/maps/` -- Overworld layout, frontier zones, dungeon depths

### Key Patterns

- **RPG-JS standalone**: `RPG_TYPE=rpg` + `@rpgjs/standalone` for single-player browser
- **Worlds all the way down**: Everything is a world. Child worlds accessed via world slot transitions (doors).
- **Assemblage composition**: Maps built from reusable markdown-defined pieces (atoms -> molecules -> organisms)
- **DDL-driven scenes**: JSON DDL validated by Zod, compiled into maps
- **Pointer pattern**: String IDs reference across DDL entries. No duplication.
- **Narrative-first**: `docs/story/act{N}-script.md` -> parser -> scene DDL -> compiler -> map output
- **Time budget pacing**: Region dimensions derived from play time. See [world-architecture.md](docs/design/world-architecture.md).

### Config Files

- `rpg.toml` -- RPG-JS app config: module list
- `biome.json` -- Biome 2.3: 2-space indent, single quotes, semicolons, 100 char width
- `tsconfig.json` -- `experimentalDecorators` + `emitDecoratorMetadata` for RPG-JS decorators

### CI

GitHub Actions: pnpm install -> lint -> build -> deploy `dist/` to GitHub Pages.
