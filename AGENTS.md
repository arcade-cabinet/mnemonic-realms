# AGENTS.md — Intent by Augment Configuration

> See [CLAUDE.md](./CLAUDE.md) for full project context, architecture, and critical rules.

## Project

**Mnemonic Realms** — A single-player 16-bit JRPG built with MnemonicEngine (Expo + React Native Skia + Koota ECS). Web-first via Expo web; iOS/Android architecture ready.

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | Expo (React Native) with Expo Router |
| Rendering | React Native Skia (Atlas tile/sprite rendering) |
| ECS | Koota (SoA storage, deterministic iteration) |
| Animation | Reanimated (`useFrameCallback` 60fps game loop) |
| Styling | NativeWind / Tailwind + Gluestack UI theme |
| Linting | Biome 2.3 (2-space indent, single quotes, semicolons, 100 char width) |
| Unit Tests | Vitest |
| E2E Tests | Playwright |
| Content Pipeline | Custom assemblage system + GenAI pipeline (tsx scripts) |
| Package Manager | pnpm |

## Directory Map

| Directory | Purpose | Who Touches It |
|-----------|---------|---------------|
| `engine/` | Koota ECS traits, pure systems, Skia renderers, game loop | Engine agents |
| `app/` | Expo Router pages (`_layout.tsx`, `index.tsx`, `game.tsx`) | UI agents |
| `ui/` | React Native overlay components (dialogue, HUD, combat, menus) | UI agents |
| `gen/` | Assemblage compiler, DDL schemas, GenAI pipeline, runtime JSON serializer | Pipeline agents |
| `data/` | Generated runtime JSON (maps, encounters) — **never hand-edit** | Generated output |
| `docs/story/` | Act scripts, characters, dialogue-bank — **story source of truth** | Content agents |
| `docs/world/` | Region + location hierarchy — **compilable DDL source** | Content agents |
| `docs/design/` | Architecture docs, visual direction, systems design | Reference only |
| `docs/plans/` | Design docs and implementation plans | Reference only |
| `docs/rpgjs-archive/` | Archived RPG-JS code — **never modify** | Nobody |
| `assets/` | Tilesets, sprites, audio, PWA icons | Asset pipeline |
| `tasks/` | PRD, ralph-tui JSON, execution plans | Orchestration |
| `tests/` | Vitest unit tests + Playwright E2E tests | All agents |

## Commands

```bash
# Development
pnpm install                    # Install dependencies
pnpm expo start --web           # Dev server (web)
pnpm build:web                  # Production build -> dist/

# Quality
pnpm lint                       # Biome check
pnpm lint:fix                   # Biome auto-fix
pnpm test:unit                  # Vitest unit tests
pnpm test                       # Playwright E2E tests

# Content Pipeline
pnpm assemblage compile-world   # docs/world/ -> DDL + maps
pnpm assemblage emit-runtime    # Generate runtime JSON for engine
pnpm assemblage validate        # Check overlaps, gaps, missing hooks
pnpm gen build all              # Build all GenAI assets
pnpm gen status                 # Check generation status
```

## Critical Rules

These rules are **non-negotiable**. Violating any of them is a task failure. Full details in [CLAUDE.md](./CLAUDE.md).

1. **RPG-JS is archived** — `docs/rpgjs-archive/` is read-only. Never modify or import from it.
2. **16×16 pixel tiles** — All tilesets use 16×16 tiles. Maps sized accordingly (60×60 = 960px).
3. **Art is ALWAYS visible** — Vibrancy is spatial fog-of-war (dark/haze/clear), NOT desaturation. The player's active area is never visually degraded.
4. **Story drives everything** — Open world, open map. No invisible walls. Quest progression unlocks areas via vibrancy state.
5. **Never hand-edit generated output** — Edit source (DDL, assemblages, `docs/world/`), not `data/` output.
6. **Build automation, not artifacts** — If a step requires manual repetition, build the tool instead.
7. **Logic in subpackages, not TSX** — TSX files contain ONLY rendering markup + hooks. Business logic lives in `engine/` subpackages.
8. **Encounters are a World** — Combat transitions to the encounters world, same fractal hierarchy as shops/dungeons/overworld.

## Agent Roles

### Engine Developer
- **Scope**: `engine/ecs/`, `engine/renderer/`, `engine/world/`, `engine/encounters/`, `engine/audio/`, `engine/save/`, `engine/inventory/`, `engine/input.ts`, `engine/game-loop.ts`
- **Key patterns**: Koota ECS traits + pure system functions, Skia Atlas rendering, Reanimated frame callbacks
- **Tests**: Vitest unit tests for all systems and traits

### UI Developer
- **Scope**: `ui/`, `app/`, `ui/theme/`
- **Key patterns**: React Native components (NOT Skia) overlaying the game canvas, Expo Router for navigation, NativeWind/Tailwind styling
- **Rule**: TSX files contain ONLY rendering + hooks. All logic delegates to `engine/` subpackages.

### Content Pipeline Developer
- **Scope**: `gen/`, `gen/assemblage/`, `gen/ddl/`, `gen/schemas/`
- **Key patterns**: Zod-validated DDL schemas, assemblage composition (atoms → molecules → organisms), runtime JSON serialization
- **Rule**: Never hand-edit `data/` output. Always edit source and regenerate.

### Content Author
- **Scope**: `docs/story/`, `docs/world/`, `gen/ddl/`
- **Key patterns**: Markdown act scripts, world hierarchy DDL, dialogue-bank entries
- **Rule**: Story drives everything. If something reads like a placeholder, fix it.

### QA / Playtester
- **Scope**: `tests/unit/`, `tests/e2e/`, validation scripts
- **Commands**: `pnpm test:unit`, `pnpm test`, `pnpm validate:all`
- **Focus**: Verify systems work together — movement, collision, camera, vibrancy transitions, encounter triggers, save/load

## Testing Strategy

| Type | Tool | Command | Location |
|------|------|---------|----------|
| Unit | Vitest | `pnpm test:unit` | `tests/unit/` |
| E2E | Playwright | `pnpm test` | `tests/e2e/` |
| Validation | Custom scripts | `pnpm validate:all` | `scripts/validation/` |

**Every agent must**:
1. Run `pnpm lint` before completing work
2. Run `pnpm test:unit` if engine or logic code was changed
3. Run `pnpm validate:all` if map/DDL/assemblage content was changed

## Quality Gate Checklist

Before marking any task complete, verify:

- [ ] Code follows Biome formatting (`pnpm lint` passes)
- [ ] No imports from `docs/rpgjs-archive/`
- [ ] TSX files contain only rendering + hooks (logic in `engine/`)
- [ ] Generated output in `data/` was not hand-edited
- [ ] Unit tests pass (`pnpm test:unit`)
- [ ] New systems/traits have corresponding unit tests
- [ ] Changes are consistent with the fractal world architecture

