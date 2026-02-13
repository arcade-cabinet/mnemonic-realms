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
pnpm gen:build        # Rebuild manifests from bible docs
pnpm gen:assets       # Generate assets via Gemini (needs GEMINI_API_KEY)
pnpm gen:status       # Show generation status
pnpm gen:integrate    # Post-process gen/output -> main/ (sharp downscale + WebP)
pnpm gen:full         # Full pipeline: build -> generate -> integrate
```

## Architecture

### RPG-JS Module (`main/`)

Single RPG-JS module. No Next.js, no React. RPG-JS uses its own Vite-based compiler (`rpgjs dev`/`rpgjs build`).

**`main/index.ts`** — Module entry using RPG-JS `client!`/`server!` import flags for tree-shaking.

**`main/server/index.ts`** — Server module registration. Maps, player hooks, database, and combat will be generated from bible specs.

**`main/client/index.ts`** — Client module. Registers generated spritesheets.

**`main/client/characters/generated.ts`** — Auto-generated `@Spritesheet` bindings from the GenAI pipeline. Do not edit manually.

### GenAI Pipeline (`gen/`)

Manifest-driven asset generation using Google Gemini 2.5 Flash.

**`gen/schemas/`** — Zod schemas for tilesets, sprites, portraits, item icons.

**`gen/style-context.ts`** — Global art direction constants (master style prompt, color palette, tier styles, dimension presets).

**`gen/scripts/`**:
- `build-manifests.ts` — Reads bible docs (`docs/design/`) and generates `gen/manifests/*/manifest.json` files with prompts, dimensions, and docRefs.
- `generate-assets.ts` — Processes manifests, calls Gemini API, writes raw PNGs to `gen/output/`. SHA-256 prompt hashing for idempotent reruns.
- `integrate-assets.ts` — Post-processes `gen/output/` into RPG-JS module: sharp downscale to pixel-perfect dimensions, lossless WebP output (PNG for tilesets), generates `@Spritesheet` TypeScript bindings.
- `markdown-loader.ts` — Extracts heading-scoped sections from bible markdown for DocRef resolution.

**`gen/manifests/`** — JSON manifests tracking asset generation status, prompts, and metadata. Committed to git. Merge-safe: rebuilding manifests preserves generation status for unchanged assets.

**`gen/output/`** — Raw generated PNGs. Gitignored. Regenerated from manifests.

### Bible Docs (`docs/`)

Authored game content written by Ralph (autonomous agent). These are the source of truth for all game content and drive both the GenAI pipeline and the code generation.

**`docs/design/`** — tileset-spec, spritesheet-spec, ui-spec, audio-direction, skills-catalog, enemies-catalog, items-catalog, progression, combat, classes, memory-system, visual-direction

**`docs/story/`** — characters, structure, act scripts

**`docs/world/`** — core-theme, setting, factions, geography, vibrancy-system, dormant-gods

### Key Patterns

- **RPG-JS standalone**: `RPG_TYPE=rpg` env var + `@rpgjs/standalone` mocks socket.io in-process for single-player browser deployment.
- **Gemini 2.5 Flash for all generation**: Cost-optimized. Flash handles structured pixel art layouts well because it reasons about art direction.
- **Idempotent pipeline**: SHA-256 prompt hash + output file hash + manifest merge on rebuild = assets only regenerate when prompts change.
- **DocRef system**: Manifest entries reference bible sections by `{ path, heading, purpose }`. The markdown-loader extracts the relevant section and injects it into the Gemini prompt.
- **WebP for sprites/portraits/icons, PNG for tilesets**: Tilesets stay PNG for Tiled TMX compatibility. Everything else uses lossless WebP.

### Config Files

- `rpg.toml` — RPG-JS app config: module list
- `biome.json` — Biome 2.3: 2-space indent, single quotes, semicolons, 100 char width. Scoped to `main/**/*.ts` and `gen/**/*.ts`.
- `tsconfig.json` — `experimentalDecorators` + `emitDecoratorMetadata` for RPG-JS decorators
- `index.html` — Minimal HTML shell with `<div id="rpg">` for PixiJS canvas

### CI

GitHub Actions (`.github/workflows/build-deploy.yml`): pnpm install -> lint -> build -> deploy `dist/` to GitHub Pages.
