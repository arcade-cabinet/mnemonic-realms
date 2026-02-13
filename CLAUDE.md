# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What This Is

Mnemonic Realms is a single-player 16-bit style RPG with deterministic procedural generation. Users enter a 3-word seed ("adjective adjective noun") that generates a unique, reproducible world. Built as a pure RPG-JS 4.3.0 standalone game (browser-only via `@rpgjs/standalone`, no Express server).

## Commands

```bash
pnpm install          # Install dependencies
pnpm dev              # RPG-JS dev server (rpgjs dev)
pnpm build            # Production build (RPG_TYPE=rpg rpgjs build → dist/)
pnpm lint             # Biome check (main/**/*.ts)
pnpm lint:fix         # Biome auto-fix
pnpm test             # Playwright E2E tests (auto-starts dev server)
pnpm example          # Run procedural generation examples (tsx main/generation/examples.ts)
```

## Architecture

### Single RPG-JS Module (`main/`)

The entire game is one RPG-JS module. No Next.js, no React — RPG-JS uses its own Vite-based compiler (`rpgjs dev`/`rpgjs build`).

**`main/index.ts`** — Module entry using RPG-JS `client!`/`server!` import flags for tree-shaking.

**`main/server/`** — Server-side hooks and maps:
- `player.ts` — `RpgPlayerHooks`: shows title screen GUI on connect, waits for seed, applies procedural stats via `ProceduralWorld` + `ClassGenerator`, handles intro dialogue and level-ups
- `maps/overworld.ts` — 30x30 map that spawns procedural NPCs + enemies via `createDynamicEvent()`
- `maps/dungeon.ts` — 20x20 dungeon with procedural chests and boss

**`main/client/`** — Client-side module:
- `index.ts` — Registers spritesheets and GUI components
- `characters/` — `@Spritesheet` definitions with `RMSpritesheet()` for RPG Maker-style grids

**`main/gui/`** — Vue components (RPG-JS uses Vue for in-game UI):
- `title-screen.vue` — Seed input screen, emits `seed-selected` event to server

**`main/database/`** — RPG-JS database using decorators (`@Actor`, `@Class`, `@Weapon`, `@Item`, `@Skill`, `@State`):
- `actors/hero.ts`, `classes/` (Warrior/Mage/Rogue/Cleric), `weapons/`, `items/`, `skills/`, `states/`

**`main/generation/`** — Procedural generation engine (preserved from original codebase):
- `seededRandom.ts` — `SeededRandom` class wrapping `seedrandom`, `parseSeed()` enforces 3-word format
- `ecs/` — ecsy ECS: components, systems, traits, dataPools, `ProceduralWorld` class
- `generators/` — 7 standalone generators: Name, Dialogue, Microstory, Class, Terrain, NPC/Loot, Room

### Key Patterns

- **Seed format**: Always "adjective adjective noun" (exactly 3 words). `parseSeed()` enforces this.
- **Deterministic generation**: All randomness flows through `SeededRandom`. Same seed = same world, always.
- **ECS via ecsy**: Entities get components via trait functions (e.g., `applyCharacterTrait`), then systems process them in `world.update()`.
- **RPG-JS standalone**: `RPG_TYPE=rpg` env var + `@rpgjs/standalone` mocks socket.io in-process for single-player browser deployment.
- **GUI ↔ Server flow**: Title screen (Vue) emits events via `RpgGui.emit()`, server hooks listen via `player.gui(id).on()`.

### Config Files

- `rpg.toml` — RPG-JS app config: module list, start map, player hitbox
- `biome.json` — Biome 2.3: 2-space indent, single quotes, semicolons, 100 char width. Scoped to `main/**/*.ts`.
- `tsconfig.json` — `experimentalDecorators` + `emitDecoratorMetadata` for RPG-JS decorators
- `index.html` — Minimal HTML shell with `<div id="rpg">` for PixiJS canvas

### Testing

- E2E tests use Playwright (`tests/e2e/`). Playwright auto-starts dev server on port 3000.
- Reserved test seed: `"brave ancient warrior"`

### CI

GitHub Actions (`.github/workflows/build-deploy.yml`): pnpm install → lint → build → deploy `dist/` to GitHub Pages.

### Assets

- Placeholder tilesets and spritesheets are in `main/server/maps/tmx/` and `main/client/characters/`
- Real art assets available at `/Volumes/home/assets/` (2D RPG tilesets)
