# Mnemonic Realms

A single-player 16-bit JRPG about memory as creative vitality. The world is young and unfinished, growing more vivid as players discover and recall memory fragments.

Built with [RPG-JS 4.3.0](https://rpgjs.dev) in standalone mode — runs entirely in the browser.

## Development

```bash
pnpm install
pnpm dev
# Open http://localhost:3000
```

## Commands

```bash
pnpm dev              # RPG-JS dev server with hot reload
pnpm build            # Production build -> dist/
pnpm lint             # Biome linter
pnpm test             # Playwright E2E tests

# GenAI pipeline
pnpm gen build all    # Rebuild manifests from bible docs + DDL
pnpm gen generate all # Generate assets/code via Gemini
pnpm gen integrate all # Post-process into main/
pnpm gen status       # Show generation status
```

## Architecture

**`main/`** — Single RPG-JS module:
- `main/server/` — Server module: maps, player hooks, database
- `main/client/` — Client module: spritesheets, GUI components (Vue)

**`gen/`** — GenAI pipeline (manifest-driven asset + code generation):
- `gen/builders/` — Manifest builders for images and code (7 categories)
- `gen/config/` — Art direction constants, palette, dimensions
- `gen/ddl/` — Data Definition Layer: structured game data with Zod validation
- `gen/generators/` — Gemini API runners for image and code generation
- `gen/integrators/` — Post-processing: sharp downscale, WebP conversion, code copy
- `gen/manifests/` — JSON manifests tracking generation status (committed to git)
- `gen/output/` — Generated assets (gitignored, regenerated from manifests)
- `gen/schemas/` — Zod schemas for all pipeline data types
- `gen/scripts/` — Standalone pipeline scripts

**`docs/`** — Authored game bible (source of truth for all content):
- `docs/design/` — Visual direction, combat, classes, items, enemies, skills, UI specs
- `docs/story/` — Characters, act scripts, dialogue, quest chains
- `docs/world/` — Theme, setting, factions, geography, vibrancy system
- `docs/maps/` — Overworld layout, dungeons, frontier/stagnation zones
- `docs/bible/` — Master index, implementation order, consistency checks

## Tech Stack

- **RPG-JS 4.3.0** — 2D RPG framework (PixiJS rendering, Tiled maps, Vue GUI)
- **@rpgjs/standalone** — In-process socket mock for single-player browser deployment
- **Google Gemini** — Image and code generation via `@google/genai`
- **Zod** — Schema validation for DDL and pipeline data
- **sharp** — Image post-processing (downscale, format conversion)
- **TypeScript** — Full type safety
- **Biome** — Linter and formatter
- **Playwright** — E2E testing
- **GitHub Actions** — CI/CD to GitHub Pages

## License

ISC
