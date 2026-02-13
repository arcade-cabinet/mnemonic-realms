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

# GenAI Pipeline CLI — unified via `pnpm gen <subcommand> [targets] [flags]`
pnpm gen build [tilesets|sprites|portraits|items|code|all]
                      # Rebuild manifests from bible docs + DDL data
pnpm gen generate [images|code|all] [--dry-run] [--force] [--model <id>]
                      # Generate assets/code via Gemini (needs GOOGLE_API_KEY or GEMINI_API_KEY)
pnpm gen integrate [images|code|all] [--dry-run]
                      # Post-process gen/output -> main/ (sharp downscale + WebP for images, copy for code)
pnpm gen status       # Show generation status across all manifests

# Shorthand scripts (same as above)
pnpm gen:build        # pnpm gen build all
pnpm gen:generate     # pnpm gen generate all
pnpm gen:integrate    # pnpm gen integrate all
pnpm gen:status       # pnpm gen status
```

## Architecture

### RPG-JS Module (`main/`)

Single RPG-JS module. No Next.js, no React. RPG-JS uses its own Vite-based compiler (`rpgjs dev`/`rpgjs build`).

**`main/index.ts`** — Module entry using RPG-JS `client!`/`server!` import flags for tree-shaking.

**`main/server/index.ts`** — Server module registration. Maps, player hooks, database, and combat will be generated from bible specs.

**`main/client/index.ts`** — Client module. Registers generated spritesheets.

**`main/client/characters/generated.ts`** — Auto-generated `@Spritesheet` bindings from the GenAI pipeline. Do not edit manually.

### GenAI Pipeline (`gen/`)

Manifest-driven asset and code generation using Google Gemini. Decomposed into focused modules:

**`gen/cli.ts`** — Unified CLI entry point. Dispatches to `cli-build.ts`, `cli-generate.ts`, `cli-integrate.ts`, `cli-status.ts`.

**`gen/config/`** — Global art direction constants: master style prompt, color palette, tier styles, dimension presets, sprite style, DocRef defaults. Derived from `docs/design/visual-direction.md`.

**`gen/schemas/`** — Zod schemas for all pipeline data: tilesets, sprites, portraits, item icons, codegen DDL (weapons, armor, consumables, skills, enemies, classes, states), and common types (hashes, generation metadata, DocRefs).

**`gen/builders/`** — Manifest builders. Read bible docs and DDL data, emit `gen/manifests/*/manifest.json` files with prompts, dimensions, and DocRefs. Includes codegen builders for each database category (weapons, armor, consumables, skills, enemies, classes, states) plus image builders (tilesets, sprites, portraits, items).

**`gen/generators/`** — Generation runners. `batch-runner.ts` and `code-batch-runner.ts` process manifests, call Gemini API via `image-gen.ts` / `text-gen.ts`, write outputs to `gen/output/`. SHA-256 prompt hashing for idempotent reruns. `model-config.ts` manages Gemini model selection. `prompt-assembly.ts` handles DocRef resolution into prompts.

**`gen/integrators/`** — Post-processing. `sprite-integrator.ts` and `tileset-integrator.ts` use sharp for pixel-perfect downscaling. `code-integrator.ts` copies generated TypeScript files into `main/`. `generic-integrator.ts` handles portraits and item icons.

**`gen/ddl/`** — Data Definition Layer. Structured game data organized by category (armor, biomes, classes, consumables, enemies, items, npcs, player-classes, portraits, skills, stagnation, status-effects, transitions, weapons). Source of truth for code generation — bible docs define the creative vision, DDL entries define the mechanical specs.

**`gen/manifests/`** — JSON manifests tracking asset/code generation status, prompts, and metadata. Committed to git. Merge-safe: rebuilding manifests preserves generation status for unchanged entries.

**`gen/output/`** — Raw generated PNGs and TypeScript code. Gitignored. Regenerated from manifests.

**`gen/scripts/`** — Standalone pipeline scripts: `build-manifests.ts`, `generate-assets.ts`, `generate-code.ts`, `integrate-assets.ts`, `integrate-code.ts`, `markdown-loader.ts`.

**`gen/utils/`** — Shared utilities: `docref-resolver.ts` (extracts heading-scoped sections from bible markdown), `markdown-parser.ts`.

### Bible Docs (`docs/`)

Authored game content written by Ralph (autonomous agent). These are the source of truth for all game content and drive both the GenAI pipeline and the code generation.

**`docs/design/`** — tileset-spec, spritesheet-spec, ui-spec, audio-direction, audio-pipeline-research, skills-catalog, enemies-catalog, items-catalog, progression, combat, classes, memory-system, visual-direction

**`docs/story/`** — characters, structure, act scripts (1-3), dialogue-bank, quest-chains

**`docs/world/`** — core-theme, setting, factions, geography, vibrancy-system, dormant-gods

**`docs/maps/`** — overworld-layout, frontier-zones, dungeon-depths, stagnation-zones, event-placement

**`docs/bible/`** — master-index, implementation-order, consistency-check

### Key Patterns

- **RPG-JS standalone**: `RPG_TYPE=rpg` env var + `@rpgjs/standalone` mocks socket.io in-process for single-player browser deployment.
- **Gemini for all generation**: Image assets via Gemini imagen/flash models. Code generation via Gemini text models. Cost-optimized pipeline.
- **Idempotent pipeline**: SHA-256 prompt hash + output file hash + manifest merge on rebuild = assets only regenerate when prompts change.
- **DocRef system**: Manifest entries reference bible sections by `{ path, heading, purpose }`. The markdown-loader extracts the relevant section and injects it into the Gemini prompt.
- **DDL architecture**: Game data definitions in `gen/ddl/` subdirectories with Zod validation. Separates creative content (docs) from mechanical specs (DDL).
- **WebP for sprites/portraits/icons, PNG for tilesets**: Tilesets stay PNG for Tiled TMX compatibility. Everything else uses lossless WebP.
- **Code generation categories**: weapons, armor, consumables, skills, enemies, classes, states — each with its own builder, schema, and DDL directory.

### Config Files

- `rpg.toml` — RPG-JS app config: module list
- `biome.json` — Biome 2.3: 2-space indent, single quotes, semicolons, 100 char width. Scoped to `main/**/*.ts` and `gen/**/*.ts`.
- `tsconfig.json` — `experimentalDecorators` + `emitDecoratorMetadata` for RPG-JS decorators
- `index.html` — Minimal HTML shell with `<div id="rpg">` for PixiJS canvas

### CI

GitHub Actions (`.github/workflows/build-deploy.yml`): pnpm install -> lint -> build -> deploy `dist/` to GitHub Pages.
