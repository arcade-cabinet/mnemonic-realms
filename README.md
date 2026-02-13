# Mnemonic Realms

A single-player 16-bit style RPG with deterministic procedural generation. Enter a 3-word seed and explore a world uniquely generated from your words.

Built with [RPG-JS 4.3.0](https://rpgjs.dev) in standalone mode — runs entirely in the browser.

## Play

Visit the [GitHub Pages deployment](https://jbogaty.github.io/mnemonic-realms/) or run locally:

```bash
pnpm install
pnpm dev
# Open http://localhost:3000
```

Enter a seed like `"brave ancient warrior"` — three words: adjective adjective noun.

## How It Works

Every seed deterministically generates:
- **Character** — Name, class (Warrior/Mage/Rogue/Cleric), stats, alignment
- **World** — Terrain, NPCs with unique dialogue, enemy encounters
- **Loot** — Weapons, items, treasure from procedural generators

The same seed always produces the exact same world.

## Development

```bash
pnpm dev          # RPG-JS dev server with hot reload
pnpm build        # Production build → dist/
pnpm lint         # Biome linter
pnpm test         # Playwright E2E tests
pnpm example      # Run procedural generation examples
```

## Architecture

Single RPG-JS module in `main/`:
- `main/server/` — Player hooks, map definitions, procedural NPC/enemy spawning
- `main/client/` — Spritesheets, GUI components (Vue)
- `main/database/` — RPG-JS database: actors, classes, weapons, items, skills, states
- `main/generation/` — ECS-based procedural generation engine (ecsy + seedrandom)
- `main/gui/` — Title screen with seed input

## Tech Stack

- **RPG-JS 4.3.0** — 2D RPG framework (PixiJS rendering, Tiled maps, Vue GUI)
- **@rpgjs/standalone** — In-process socket mock for single-player browser deployment
- **ecsy** — Entity Component System for procedural generation
- **seedrandom** — Deterministic PRNG
- **TypeScript** — Full type safety
- **Biome** — Linter and formatter
- **Playwright** — E2E testing
- **GitHub Actions** — CI/CD to GitHub Pages

## License

ISC
