---
inclusion: auto
description: Project structure, directory organization, and key conventions for Mnemonic Realms
---

# Project Structure

## Top-Level Organization

```
main/          Game code (single RPG-JS module)
gen/           GenAI pipeline (manifest-driven generation)
docs/          Game bible (source of truth for all content)
assets/        Static assets (audio, images not generated)
public/        Public web assets
tests/         E2E and unit tests
scripts/       Standalone utility scripts
```

## main/ — Game Module

Single RPG-JS module with client/server split:

```
main/
├── server/           Server-side game logic
│   ├── maps/         Tiled map files and configurations
│   ├── events/       Game events and triggers
│   ├── dialogue/     Dialogue system
│   ├── quests/       Quest definitions
│   ├── systems/      Game systems (combat, inventory, etc.)
│   ├── player.ts     Player class and hooks
│   └── index.ts      Server module entry
├── client/           Client-side rendering and GUI
│   └── spritesheets/ Character and object sprites
├── gui/              Vue GUI components
├── database/         Game database (items, skills, enemies, etc.)
└── index.ts          Module entry point
```

## gen/ — GenAI Pipeline

Manifest-driven asset and code generation:

```
gen/
├── builders/         Manifest builders (7 categories: images + code)
├── generators/       Gemini API runners for generation
├── integrators/      Post-processing (sharp, WebP, code copy)
├── manifests/        JSON manifests (committed, track status)
├── output/           Generated assets (gitignored, regenerated)
├── ddl/              Data Definition Layer (Zod-validated game data)
├── schemas/          Zod schemas for pipeline types
├── config/           Art direction, palette, dimensions
├── scripts/          Standalone pipeline scripts
├── utils/            Shared utilities
└── cli.ts            Main CLI entry point
```

## docs/ — Game Bible

Authored content (source of truth):

```
docs/
├── bible/            Master index, implementation order
├── design/           Visual direction, combat, classes, items, enemies, skills, UI
├── story/            Characters, dialogue, quests, act scripts
├── world/            Theme, setting, factions, geography, vibrancy
└── maps/             Overworld layout, dungeons, zones
```

## Key Conventions

- Generated assets live in `gen/output/` (gitignored, regenerated from manifests)
- Manifests in `gen/manifests/` are committed to git
- All game content originates in `docs/` markdown files
- TypeScript files in `main/` and `gen/` are linted by Biome
- Test files use `.test.ts` suffix
- Maps use Tiled TMX format in `main/server/maps/`
