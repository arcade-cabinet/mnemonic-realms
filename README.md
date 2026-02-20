# Mnemonic Realms

A single-player 16-bit JRPG about memory as creative vitality. The world is young and unfinished, growing more vivid as players discover and recall memory fragments. Vibrancy manifests as spatial fog-of-war: forgotten areas are dark, partially remembered areas glow through colored haze, and fully remembered areas are crystal clear.

Built with **MnemonicEngine** — Expo (React Native) + React Native Skia + Koota ECS. Web-first via Expo web, with iOS/Android architecture ready.

> **Note:** RPG-JS has been archived to `docs/rpgjs-archive/`. All active development uses MnemonicEngine.

## Quick Start

```bash
pnpm install
pnpm expo start --web
```

## Commands

```bash
pnpm expo start --web   # Expo dev server (web)
pnpm build:web          # Production build -> dist/
pnpm lint               # Biome linter
pnpm test               # Playwright E2E tests
pnpm test:unit          # Vitest unit tests
pnpm generate:content   # Generate all runtime JSON (maps + encounters)
pnpm validate:runtime   # Validate generated runtime data
```

## Architecture

- **`engine/`** — Koota ECS traits, pure systems, Skia renderers, game loop
- **`app/`** — Expo Router pages
- **`ui/`** — React Native overlay components (dialogue, HUD, combat, menus, touch controls)
- **`gen/`** — Assemblage compiler, DDL schemas, GenAI pipeline, runtime JSON serializer
- **`data/`** — Generated runtime JSON (maps, encounters) — never hand-edit
- **`docs/`** — Story bible, world geography, design docs, archived RPG-JS reference

See [CLAUDE.md](./CLAUDE.md) for full architecture documentation, critical rules, and development patterns.

## Tech Stack

- **Expo** — React Native cross-platform framework
- **React Native Skia** — GPU-accelerated Atlas tile/sprite rendering
- **Koota** — Data-oriented ECS with SoA storage
- **Reanimated** — 60fps game loop via `useFrameCallback`
- **NativeWind / Tailwind** — Utility-first styling
- **Gluestack UI** — Theme tokens
- **Zod** — Schema validation for DDL and pipeline data
- **TypeScript** — Full type safety
- **Biome** — Linter and formatter
- **Vitest** — Unit testing
- **Playwright** — E2E testing
- **GitHub Actions** — CI/CD to GitHub Pages

## License

ISC
