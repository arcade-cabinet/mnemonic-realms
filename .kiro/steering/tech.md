---
inclusion: auto
description: Tech stack, development tools, code style, and common commands for Mnemonic Realms
---

# Tech Stack

## Core Framework

- RPG-JS 4.3.0 (2D RPG framework with PixiJS rendering, Tiled maps, Vue GUI)
- @rpgjs/standalone (in-process socket mock for single-player browser deployment)
- TypeScript with ES modules
- Vue 3.5+ for GUI components

## Development Tools

- pnpm (package manager)
- Biome (linter and formatter)
- tsx (TypeScript execution)
- Playwright (E2E testing)
- Vitest (unit testing)

## GenAI Pipeline

- Google Gemini (@google/genai) for image and code generation
- Zod for schema validation (DDL and pipeline data)
- sharp for image post-processing (downscale, WebP conversion)

## Code Style

Enforced by Biome:
- 2-space indentation
- Single quotes for strings
- Semicolons required
- 100 character line width
- Recommended rules enabled with specific overrides for gen/ and test files

## Common Commands

```bash
# Development
pnpm dev              # Start dev server at localhost:3000 with hot reload
pnpm build            # Production build to dist/
pnpm start            # Run production build

# Code Quality
pnpm lint             # Check code with Biome
pnpm lint:fix         # Auto-fix linting issues

# Testing
pnpm test             # Run Playwright E2E tests
pnpm test:unit        # Run Vitest unit tests

# GenAI Pipeline
pnpm gen build all    # Rebuild manifests from docs/ and DDL
pnpm gen generate all # Generate assets/code via Gemini
pnpm gen integrate all # Post-process into main/
pnpm gen status       # Show generation status
pnpm gen:full         # Run all three steps sequentially

# Asset Scripts
pnpm audio:fetch-ambient        # Fetch ambient audio loops
pnpm audio:gen-bgm-placeholders # Generate placeholder BGM
pnpm verify:sprites             # Verify sprite integrity
pnpm tileset:build              # Upscale tilesets
pnpm tileset:tsx                # Generate TSX files
```

## Build Configuration

- TypeScript target: ES2020
- Module system: ESNext
- Decorators enabled (experimental)
- Strict mode: disabled (RPG-JS compatibility)
- Output: dist/
