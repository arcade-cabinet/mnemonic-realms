# PRD: MnemonicEngine — Custom Game Engine for Mnemonic Realms

## Overview

Replace RPG-JS entirely with a custom engine built on Expo (React Native) + Skia + Koota ECS. The gen/ pipeline already produces deterministic world instruction sets (MapComposition, MapCanvas). RPG-JS is a bottleneck — it forces TMX baking, discrete map loading, socket.io mocking, and a Vue GUI that fails to translate the game's core metaphor (memory as creative vitality, a world blooming into clarity).

The new engine renders the onion system directly: worlds contain worlds, the player navigates between them seamlessly. Think The Hobbit: Bag End is intimate and immediate, but the dwarves at the door prove the world is vast. From the very first interaction, the player must feel both the warmth of home and the pull of something immense beyond.

**The gorgeous 16-bit pixel art is ALWAYS visible, ALWAYS beautiful in the player's active area.** Vibrancy manifests as a spatial fog-of-war tied to quest progression: forgotten areas are opaque darkness, partially remembered areas glow through colored haze (an invitation), and fully remembered areas are crystal clear. This replaces traditional RPG area-gating (invisible walls, story triggers) with a memory-aligned metaphor. You tell a story and let it unwind. You don't slam players over the head with visual effects.

**Encounters are a World** in the onion hierarchy, not a modal overlay. Just like shops and dungeons, encounters are a separate world with regions (encounter classes) and locations (specific monsters/events). All special 1:1 moments — combat, special dialogue, surprise twists — transition to the encounters world. DDL-driven, chainable (beat this → talk to this → surprise → beat this), with Final Fantasy/Chrono Trigger split-screen as the default combat layout.

## Goals

- Render the entire game world from the gen/ pipeline's JSON output (no TMX compilation)
- Deliver a seamless open-world experience — transitions between worlds, not loading screens
- Vibrancy as spatial fog-of-war: forgotten areas dark, remembered areas crystal clear, quest progress unlocks visually
- Beautiful, authored UI that translates the game's metaphors to player experience
- Full 3-act game playable: all 20+ maps, all quests, all systems
- Encounters world system: combat, special dialogue, and story moments as world transitions
- Web deployment first (Expo web), with iOS/Android architecture ready
- Proper subpackage decomposition — no monoliths, logic in reusable packages, not TSX files
- Every story extends test coverage (unit + integration + E2E)

## Quality Gates

These gates apply to EVERY user story:

**Regression prevention:**
- All existing tests pass (no regressions): `pnpm test:unit`
- Linting clean: `pnpm lint`
- TypeScript compiles: `tsc --noEmit`

**Coverage mandate:**
- Test coverage must not decrease — every story adds tests proportional to the code it adds
- Unit tests (Vitest) for pure logic: ECS systems, serializers, loaders, game math
- Integration tests (Vitest) for subsystem interactions: ECS world setup, map loading pipelines
- E2E tests (Playwright) for UI and player-facing behavior: rendering, input, dialogue flow, transitions

**Architecture enforcement:**
- No monolith components — logic must be extracted to reusable subpackages
- TSX files contain ONLY rendering markup + hooks — business logic lives in `engine/` or `lib/`
- Subpackage boundaries enforced: `engine/ecs/`, `engine/renderer/`, `engine/world/`, `ui/`, `data/`
- Shared utilities go in dedicated packages, not duplicated across components

## User Stories

### US-001: Archive RPG-JS and scaffold Expo project
**Description:** As a developer, I want the RPG-JS codebase archived (not deleted) and a clean Expo project scaffolded so that the new engine has a home while preserving all legacy context.

**Acceptance Criteria:**
- [ ] `main/` moved to `docs/rpgjs-archive/main/`
- [ ] `rpg.toml` moved to `docs/rpgjs-archive/`
- [ ] All `@rpgjs/*` packages removed from `package.json` dependencies
- [ ] Metro bundler config excludes `docs/rpgjs-archive/`
- [ ] Biome config excludes `docs/rpgjs-archive/`
- [ ] TypeScript config excludes `docs/rpgjs-archive/`
- [ ] Expo app scaffolded: `app.json`, `app/_layout.tsx`, `app/index.tsx`, `app/game.tsx`
- [ ] Expo dependencies installed: `expo`, `@shopify/react-native-skia`, `react-native-reanimated`, `expo-router`, `react-native-gesture-handler`, `nativewind`, `koota`
- [ ] `pnpm expo start --web` launches without errors (blank screen is fine)
- [ ] `pnpm lint` passes (archive excluded)
- [ ] Tests: scaffold test verifying Expo app mounts

### US-002: ECS world + entity type system (Koota)
**Description:** As a developer, I want a Koota ECS world with data-oriented SoA (struct-of-arrays) storage so that all game objects can be modeled as entities with typed traits, enabling deterministic rendering from instruction sets.

**Acceptance Criteria:**
- [ ] `engine/ecs/world.ts` exports `createGameWorld()` using Koota's `createWorld()`
- [ ] `engine/ecs/traits.ts` defines all traits: Position, Sprite, Facing, Velocity, Player, Npc, Collidable, Interactable, Dialogue, AiState, PatrolPath, Health, Inventory, QuestFlags, Vibrancy, Chest, ResonanceStone, Transition, Trigger
- [ ] Traits use Koota's SoA storage for cache-friendly iteration (position.x[], position.y[] instead of entity.position)
- [ ] `engine/ecs/queries.ts` exports pre-built queries using Koota's query API
- [ ] Deterministic iteration order for rendering (Koota guarantees insertion-order queries)
- [ ] Unit tests: create world, add entities with traits, query by trait composition, verify counts
- [ ] Unit tests: entity lifecycle — add, remove, query updates reflect changes
- [ ] Unit tests: deterministic iteration order preserved across add/remove cycles

### US-003: Runtime JSON serializer + CLI emit-runtime
**Description:** As a developer, I want the gen/ pipeline to output runtime JSON (not TMX) so that the new engine can load maps directly from the onion system's instruction sets.

**Acceptance Criteria:**
- [ ] `gen/assemblage/pipeline/runtime-serializer.ts` exports `serializeToRuntime(canvas: MapCanvas): RuntimeMapData`
- [ ] `gen/assemblage/pipeline/runtime-types.ts` defines `RuntimeMapData` interface
- [ ] Runtime JSON preserves: semantic tile references, layer order, collision grid, visual objects, event objects, hooks, vibrancy state (forgotten/partial/remembered)
- [ ] CLI command `pnpm assemblage emit-runtime [regionId|all]` writes JSON to `data/maps/`
- [ ] `pnpm assemblage emit-runtime settled-lands` produces valid `data/maps/settled-lands.json`
- [ ] Unit tests: serialize simple canvas, verify structure
- [ ] Unit tests: round-trip — serialize then validate all fields present
- [ ] Integration test: emit-runtime for settled-lands, parse output, verify width/height/layers/objects

### US-004: Map loader — JSON to ECS world
**Description:** As a developer, I want a map loader that reads runtime JSON and populates the Koota ECS world so that tile data becomes typed arrays and behavioral objects become entities with traits.

**Acceptance Criteria:**
- [ ] `engine/world/loader.ts` exports `loadMapData(json: RuntimeMapData): LoadedMap`
- [ ] `LoadedMap` contains: tile layers as typed arrays (NOT entities), collision as Uint8Array, entity descriptors for NPCs/chests/stones/transitions/triggers
- [ ] Tile data stays as flat arrays for performance (3600+ tiles per map)
- [ ] Only behavioral objects (20-50 per map) become Koota entity descriptors with traits
- [ ] `engine/world/spawner.ts` exports `spawnEntities(world, entities)` to create entities with appropriate traits
- [ ] Unit tests: load minimal JSON, verify tile arrays and entity counts
- [ ] Unit tests: verify entity descriptors have correct trait compositions
- [ ] Integration test: load settled-lands.json, spawn into world, query NPCs by trait

### US-005: Skia tile renderer with viewport culling
**Description:** As a player, I want to see the game world rendered as pixel-perfect 16x16 tiles so that the world looks intentional and authored, not blurry or stretched.

**Acceptance Criteria:**
- [ ] `engine/renderer/tile-renderer.tsx` renders tile layers using Skia `<Atlas>` component
- [ ] `FilterMode.Nearest` for pixel-perfect rendering (no anti-aliasing on 16x16 tiles)
- [ ] Viewport culling: only tiles within camera bounds generate draw calls
- [ ] Multiple layers stack correctly: ground -> road -> water -> objects -> above
- [ ] Tile rendering logic lives in `engine/renderer/`, NOT in the component TSX
- [ ] Unit tests: viewport culling math — given camera bounds, correct tile subset selected
- [ ] Integration test: render a 4x4 test map, verify Atlas receives correct sprite rects

### US-006: Camera system with smooth following
**Description:** As a player, I want the camera to smoothly follow my character so that movement feels natural and the world scrolls fluidly.

**Acceptance Criteria:**
- [ ] `engine/renderer/camera.tsx` wraps renderers in Skia `<Group>` with translate transform
- [ ] Camera follows player entity position using Reanimated shared values
- [ ] Smooth interpolation (not instant snap) using spring or lerp
- [ ] Camera clamps to map bounds (doesn't show void beyond edges)
- [ ] Camera logic is a pure function in `engine/ecs/systems/camera.ts`, component only reads values
- [ ] Unit tests: camera system computes correct position from player position
- [ ] Unit tests: camera clamps at map boundaries

### US-007: Player movement + collision
**Description:** As a player, I want to move my character with arrow keys/WASD and be blocked by walls so that I can explore the world and it feels solid.

**Acceptance Criteria:**
- [ ] `engine/ecs/systems/movement.ts` — pure function, updates Position trait from Velocity trait
- [ ] `engine/ecs/systems/collision.ts` — pure function, checks collision grid before allowing movement
- [ ] `engine/input.ts` — maps keyboard (WASD/arrows) to velocity shared values
- [ ] `engine/game-loop.ts` — `useFrameCallback` ticks all systems at 60fps
- [ ] Grid-based movement: player moves tile-to-tile, not free-form
- [ ] Movement blocked by collision grid value 1
- [ ] Movement system is a pure function taking (world, dt), no side effects
- [ ] Unit tests: movement updates position correctly
- [ ] Unit tests: collision blocks movement into blocked tiles
- [ ] Unit tests: collision allows movement into clear tiles
- [ ] E2E test (Playwright): player renders on screen, arrow key moves player

### US-008: NPC entities + interaction system
**Description:** As a player, I want to walk up to NPCs and press action to talk to them so that the world feels inhabited and I can advance quests.

**Acceptance Criteria:**
- [ ] `engine/ecs/systems/interaction.ts` — finds entity with Interactable trait in the tile the player faces
- [ ] `engine/ecs/systems/npc-ai.ts` — simple patrol/idle state machine using AiState + PatrolPath traits
- [ ] `engine/renderer/sprite-renderer.tsx` — Skia Atlas for entity sprites (player + NPCs)
- [ ] Action key (Space/Enter/Z) triggers interaction with faced entity
- [ ] Interaction returns the entity's Dialogue/Chest/ResonanceStone trait data for the UI to handle
- [ ] Sprite renderer logic in `engine/renderer/`, only markup in component
- [ ] Unit tests: interaction finds NPC in facing direction
- [ ] Unit tests: interaction returns null when facing empty tile
- [ ] Unit tests: NPC AI patrol follows path points
- [ ] Unit tests: NPC AI idle stays in place

### US-009: Dialogue box UI component
**Description:** As a player, I want dialogue to appear in a beautiful bottom panel with character portraits and typewriter text so that conversations feel authored and immersive, not like database queries.

**Acceptance Criteria:**
- [ ] `ui/dialogue-box.tsx` — React Native component (NOT Skia), overlays game canvas
- [ ] `ui/hooks/use-typewriter.ts` — hook for letter-by-letter text reveal with complete() function
- [ ] Character portrait on left (animated idle)
- [ ] Speaker name in accent color
- [ ] Text materializes with subtle opacity (not harsh typewriter)
- [ ] Frosted glass background
- [ ] Choice options slide in from right when dialogue has choices
- [ ] Advance indicator pulses gently at bottom-right
- [ ] All dialogue logic in hooks/utilities, component is pure rendering
- [ ] Unit tests: useTypewriter reveals text, complete() finishes instantly
- [ ] Unit tests: useTypewriter tracks isComplete state
- [ ] Integration test: dialogue component renders with portrait + text + choices

### US-010: Vibrancy fog-of-war system
**Description:** As a player, I want forgotten areas to be shrouded in darkness and areas I've awakened through quests to be crystal clear, so that the world visually reflects my journey without degrading the gorgeous pixel art in my active area.

**Acceptance Criteria:**
- [ ] `engine/ecs/systems/vibrancy.ts` — computes per-area vibrancy state from quest progression
- [ ] Three visual states per area: Forgotten (opaque darkness), Partial (colored haze), Remembered (crystal clear)
- [ ] `engine/renderer/shader/fog-of-war.ts` — SkSL shader that applies darkness/haze per-area based on vibrancy map
- [ ] Player's current area and all fully-remembered areas are ALWAYS crystal clear — no filter, no haze, no degradation
- [ ] Forgotten areas: opaque black fog. Player can enter a few paces, then gets warned ("This place has faded from memory...") and starts taking damage until they leave
- [ ] Partially remembered areas: colored haze that signals "it's time to explore here" — the player can see shapes through the haze, an invitation
- [ ] Quest progression gradually unlocks areas: forgotten → partial → fully remembered
- [ ] Vibrancy state per area stored in save data
- [ ] Unit tests: vibrancy system computes area state from quest flags
- [ ] Unit tests: damage-on-entry for forgotten areas, warning trigger
- [ ] Unit tests: quest completion transitions area from forgotten → partial → remembered
- [ ] Integration test: shader renders different visual states for different areas

### US-011: HUD — vibrancy meter, zone placard, HP bar
**Description:** As a player, I want a minimal HUD showing my health, the current zone name, and a subtle vibrancy indicator so that I always know where I am.

**Acceptance Criteria:**
- [ ] `ui/hud.tsx` — container component, React Native overlay
- [ ] `ui/hud/vibrancy-meter.tsx` — subtle indicator showing area memory state (not a prominent bar)
- [ ] `ui/hud/zone-placard.tsx` — zone name drifts in on entry, holds 3s, dissolves
- [ ] `ui/hud/hp-bar.tsx` — red gradient, current/max
- [ ] HUD fades to near-invisible during exploration, brightens during key moments
- [ ] All tier logic in `ui/hud/vibrancy-meter.ts` (pure function), not in component
- [ ] Unit tests: zone placard timing logic (show, hold, dissolve)
- [ ] Integration test: HUD renders with all sub-components

### US-012: Memory mote particle system
**Description:** As a player, I want ambient particles (memory motes) drifting through the world so that the atmosphere feels alive and areas have different ambient character.

**Acceptance Criteria:**
- [ ] `engine/ecs/systems/particles.ts` — manages particle pool as typed arrays (NOT entities)
- [ ] `engine/renderer/particle-renderer.tsx` — Skia Atlas for mote sprites
- [ ] Mote density and character varies by area state: ghostly wisps in partial areas, golden sparkles in remembered areas, absent in forgotten
- [ ] Motes drift with random velocity, fade over lifetime
- [ ] Expired particles are recycled, not garbage collected
- [ ] Particle logic is pure functions in `engine/ecs/systems/`, renderer only reads state
- [ ] Unit tests: spawnMotes produces correct mote types per area state
- [ ] Unit tests: updateParticles removes expired, moves active
- [ ] Unit tests: particle pool size stays bounded

### US-013: World transition system — seamless zone changes
**Description:** As a player, I want to walk from Everwick to Heartfield without loading screens so that the world feels connected and real, not like a series of disconnected rooms.

**Acceptance Criteria:**
- [ ] `engine/world/transition.ts` — manages seamless zone transitions
- [ ] Walking to a transition tile triggers: load adjacent JSON, cross-fade, swap tile data, spawn new entities, show zone placard
- [ ] No loading screens, no black frames
- [ ] Camera pans smoothly during transition
- [ ] Old zone entities are removed, new zone entities spawned
- [ ] Transition system is a pure function in `engine/world/`, renderer reacts to state changes
- [ ] Works for all transition types: overworld-to-overworld, overworld-to-child-world (shops, inns), child-world-to-overworld, overworld-to-encounters-world
- [ ] Unit tests: transition state machine (idle -> loading -> crossfade -> complete)
- [ ] Integration test: load two maps, trigger transition, verify entity swap
- [ ] E2E test: player walks to zone edge, transition occurs, new zone renders

### US-014: Encounters world — DDL-driven encounter system
**Description:** As a player, I want combat and special encounters to be a separate world I transition into (like shops or dungeons), so that encounters can be chained, scripted, and composed from DDL — not just a modal overlay.

**Acceptance Criteria:**
- [ ] `engine/encounters/` subpackage — encounter world system
- [ ] Encounters world uses the same world/region/location hierarchy as everything else in the onion system
- [ ] Regions = encounter classes (e.g., "settled-lands-wildlife", "frontier-elementals", "depth-horrors")
- [ ] Locations = specific encounters within a class (e.g., "wolf-pack", "slime-swarm", "bandit-ambush")
- [ ] DDL schema for encounters: `gen/schemas/ddl-encounters.ts` with Zod validation
- [ ] DDL defines: encounter layout, enemy positions, background, music, dialogue hooks, chain-to references
- [ ] Default layout: Final Fantasy / Chrono Trigger split-screen — enemies top, player commands bottom
- [ ] Player commands: Attack, Broadcast (Resonance), Item, Defend, Flee
- [ ] Class skills and weapon masteries selectable from command menu
- [ ] Encounter chaining: beat this → go to this, talk to this → talk to this, surprise twist → fight this
- [ ] Special encounters support dialogue exchange within the encounter (NPC talks mid-fight, story moments)
- [ ] Random encounter pools per overworld region (configurable in region DDL)
- [ ] Transition TO encounters world uses same transition system as shops/dungeons (US-013)
- [ ] Anchors between overworld locations and encounter world locations (same anchor pattern as tiles)
- [ ] `gen/ddl/encounters/` — DDL files for all encounter classes and specific encounters
- [ ] Unit tests: encounter DDL validates correctly
- [ ] Unit tests: encounter chain resolution — given chain spec, correct sequence produced
- [ ] Unit tests: random encounter pool selection respects region config
- [ ] Integration test: transition to encounter, execute combat round, transition back
- [ ] E2E test: walk in wilderness, random encounter triggers, complete combat, return to overworld

### US-015: Game theme + Gluestack UI setup
**Description:** As a player, I want the game UI to feel like the game world — warm and authored — so that every pixel translates the game's metaphor.

**Acceptance Criteria:**
- [ ] `ui/theme/game-theme.ts` — theme tokens (colors, radii, shadows) with warm amber palette
- [ ] NativeWind (Tailwind for RN) configured with custom game color palette
- [ ] Gluestack UI installed and configured with context-based theme provider
- [ ] Custom game-specific components (dialogue box, vibrancy meter, inventory, encounter UI) built from scratch
- [ ] All UI components use theme tokens, never hardcoded colors
- [ ] Unit tests: theme function returns correct color tokens
- [ ] Integration test: theme provider wraps app, components receive correct tokens

### US-016: Expo web build + deployment
**Description:** As a developer, I want `pnpm build:web` to produce a deployable static site so that the game can be hosted on GitHub Pages just like the current RPG-JS build.

**Acceptance Criteria:**
- [ ] `pnpm build:web` runs `expo export --platform web` successfully
- [ ] Output directory is `dist/` (matching current CI)
- [ ] All game assets (tileset PNGs, runtime JSON, sprites) bundled correctly
- [ ] PWA configuration for offline caching and lazy asset loading
- [ ] GitHub Actions CI updated: install -> lint -> test -> build:web -> deploy
- [ ] Game loads in browser from deployed build
- [ ] E2E test (Playwright): navigate to built game, verify title screen renders

### US-017: Touch input + mobile controls
**Description:** As a mobile player, I want touch controls (virtual d-pad) so that the game is playable on phones and tablets without a keyboard.

**Acceptance Criteria:**
- [ ] `engine/input.ts` extended with touch input via `react-native-gesture-handler`
- [ ] Virtual d-pad overlay on mobile (semi-transparent, bottom-left)
- [ ] Action button (bottom-right) for interaction/confirm
- [ ] Input handler is platform-agnostic — keyboard on web, touch on mobile, both available everywhere
- [ ] Input logic decoupled from rendering — produces velocity/action shared values consumed by systems
- [ ] Unit tests: keyboard handler maps keys to velocity
- [ ] Unit tests: touch handler maps gestures to velocity
- [ ] E2E test: touch d-pad visible on mobile viewport size

### US-018: Inventory + equipment + shop screens
**Description:** As a player, I want to manage my items, equip gear, and buy from shops so that character progression feels tangible and shopkeepers have personality.

**Acceptance Criteria:**
- [ ] `ui/inventory-screen.tsx` — parchment grid, equipment silhouette, resonance fragments as orbiting gems
- [ ] `ui/shop-screen.tsx` — buy/sell with keeper personality quotes (from dialogue DDL)
- [ ] Drag-to-equip with spring animations (Moti)
- [ ] Item detail: name, in-world description, then stats
- [ ] Shop prices, inventory management in `engine/inventory/` subpackage
- [ ] Unit tests: add/remove items, equip/unequip, gold calculations
- [ ] Unit tests: shop buy/sell transactions
- [ ] Integration test: inventory screen renders items from player entity

### US-019: Audio system — BGM + SFX with vibrancy response
**Description:** As a player, I want background music per zone and sound effects for interactions so that the world has an auditory identity, with area memory state affecting the audio mood.

**Acceptance Criteria:**
- [ ] `engine/audio/music.ts` — BGM management using expo-audio
- [ ] `engine/audio/sfx.ts` — SFX playback (dialogue blip, chest open, resonance hum)
- [ ] BGM crossfades on zone transitions (not hard cut)
- [ ] Audio responds to area memory state via BiquadFilterNode low-pass sweep: forgotten areas = muffled (2000Hz cutoff), remembered areas = full clarity (20000Hz cutoff)
- [ ] SFX for: dialogue advance, choice select, chest open, stone discover, combat hit, menu navigate
- [ ] Audio logic in `engine/audio/` subpackage, components trigger via events
- [ ] Unit tests: audio state machine (idle -> playing -> crossfading -> playing)
- [ ] Integration test: zone transition triggers BGM crossfade

### US-020: Quest log + save/load
**Description:** As a player, I want to track active quests and save my progress so that I can play in sessions and always know what to do next.

**Acceptance Criteria:**
- [ ] `ui/quest-log.tsx` — styled as Callum's journal, not a database table
- [ ] Active quests with current objective highlighted
- [ ] Completed quests accessible but visually distinct
- [ ] `engine/save/` subpackage — serializes player entity + quest flags + discovered stones + area vibrancy states
- [ ] Save to AsyncStorage (web: localStorage)
- [ ] Load restores exact game state: position, inventory, quests, area vibrancy states
- [ ] Title screen: New Journey / Continue options
- [ ] Unit tests: save serialization round-trips correctly
- [ ] Unit tests: quest state tracking (start, advance, complete)
- [ ] E2E test: save game, reload page, continue from save

### US-021: Title screen with class selection
**Description:** As a player, I want a beautiful title screen where I choose my class and start a new journey so that the first impression sets the tone for the entire game.

**Acceptance Criteria:**
- [ ] `ui/title-screen.tsx` — game logo emerges from soft haze to golden clarity
- [ ] "Mnemonic Realms" appears letter-by-letter with memory mote particles
- [ ] Menu: New Journey / Continue / Settings
- [ ] Class selection: three archetypes with idle animations and personality quotes
- [ ] Spring-based animations throughout (Moti)
- [ ] E2E test: title screen renders, class selection works, game starts

### US-022: Full content generation — all maps + encounters to runtime JSON
**Description:** As a developer, I want all 20+ maps and all encounter definitions generated as runtime JSON so that the entire game world (including encounters world) is loadable by the new engine.

**Acceptance Criteria:**
- [ ] `pnpm assemblage emit-runtime all` generates JSON for all regions
- [ ] Settled Lands (5 maps): Everwick, Heartfield, Ambergrove, Millbrook, Sunridge
- [ ] Frontier (4 maps): Shimmer Marsh, Hollow Ridge, Flickerveil, Resonance Fields
- [ ] Sketch Realm (3 maps): Luminous Wastes, Undrawn Peaks, Half-Drawn Forest
- [ ] Depths (5 maps): L1 through L5
- [ ] Fortress (3 maps): F1 through F3
- [ ] All child world maps (shops, inns, residences)
- [ ] Encounters world: all encounter class regions + specific encounter locations as runtime JSON
- [ ] Each JSON validated against RuntimeMapData / RuntimeEncounterData schemas
- [ ] Integration test: load every generated JSON, verify structure

### US-023: CLAUDE.md + documentation update
**Description:** As a developer, I want CLAUDE.md and project docs updated to reflect the new engine architecture so that future development sessions have correct context.

**Acceptance Criteria:**
- [ ] CLAUDE.md updated: remove all RPG-JS references from active sections
- [ ] CLAUDE.md updated: new Architecture section for MnemonicEngine (Koota ECS, Skia renderer, encounters world)
- [ ] CLAUDE.md updated: new Commands section (expo start, build:web, etc.)
- [ ] CLAUDE.md updated: archive reference pointing to `docs/rpgjs-archive/`
- [ ] README.md updated with new setup instructions
- [ ] All references to `main/` directory updated to `engine/` + `app/` + `ui/`

## Functional Requirements

- FR-1: The engine must render 16x16 pixel-perfect tiles using Skia Atlas with viewport culling
- FR-2: The Koota ECS world must support adding/removing/querying entities by trait composition at 60fps with deterministic iteration order
- FR-3: The game loop must run at 60fps on the UI thread via Reanimated useFrameCallback
- FR-4: Zone transitions must be seamless — no loading screens, no black frames — for all world types (overworld, shops, encounters)
- FR-5: Vibrancy is spatial fog-of-war: forgotten areas opaque, partial areas hazed, remembered areas pristine. Player's active area is NEVER visually degraded
- FR-6: All game data (maps, NPCs, quests, dialogue, encounters) must come from the gen/ pipeline JSON output
- FR-7: The UI must use Gluestack UI context-based theming with game-appropriate tokens
- FR-8: Player progress (including area vibrancy states) must persist via save/load (AsyncStorage on web)
- FR-9: Touch controls must work on mobile viewport sizes
- FR-10: Web build deployed as PWA with lazy asset loading for optimal initial load time
- FR-11: All business logic must live in `engine/` or dedicated subpackages, never in TSX components
- FR-12: The gen/ pipeline must support both TMX (legacy, archived) and runtime JSON output
- FR-13: Encounters world follows the same onion system hierarchy as all other worlds — DDL-driven, with regions (encounter classes) and locations (specific encounters)
- FR-14: Audio responds to area memory state via BiquadFilterNode low-pass sweep (2000Hz muffled → 20000Hz vivid)
- FR-15: Encounter chaining enables scripted sequences: combat → dialogue → combat, or dialogue → surprise → combat

## Non-Goals (Out of Scope)

- iOS/Android native builds (architecture ready, but not shipping in v1)
- Multiplayer or online features
- Procedural map generation (all maps are authored via the gen/ pipeline)
- Custom map editor UI (maps are edited via markdown + gen/ CLI)
- Achievement/trophy system
- Gamepad support beyond basic d-pad mapping
- Localization/i18n (English only for v1)
- Analytics or telemetry
- In-app purchases or monetization
- Global vibrancy shader that desaturates or color-tints the entire screen — vibrancy is SPATIAL, not global

## Technical Considerations

- **Expo SDK**: Use latest stable. The `with-skia` template pattern provides Skia setup.
- **Metro bundler**: Must be configured to ignore `docs/rpgjs-archive/` completely.
- **Koota ECS**: Chosen over Miniplex — SoA (struct-of-arrays) storage for cache-friendly iteration, deterministic query order, data-oriented architecture that fits the "render maps from instruction sets" philosophy. From pmndrs ecosystem, same team as Miniplex but newer and more data-oriented.
- **Gluestack UI**: Chosen over React Native Reusables — context-based theme provider enables runtime color shifts without prop drilling. RN Reusables is designed for light/dark toggle, not continuous theming. Standard UI from Gluestack, game-specific UI (dialogue, encounters, inventory) built custom.
- **Encounters World**: Combat and special moments are a WORLD in the onion hierarchy, not a modal. Uses same DDL patterns, same transition system, same anchor system. Regions = encounter classes, locations = specific encounters. Enables chaining, scripting, composition.
- **Vibrancy Fog-of-War**: Per-area SkSL shader, NOT global. Each area has a vibrancy state (forgotten/partial/remembered) stored in save data. Quest progression drives state transitions. Forgotten = opaque black + damage on entry. Partial = colored haze (invitation). Remembered = crystal clear.
- **Audio Vibrancy**: Low-pass BiquadFilterNode sweep on existing Web Audio pipeline. 2000Hz cutoff for forgotten areas, 20000Hz for remembered. Subtle atmospheric depth.
- **Tileset images**: Skia loads PNG directly. No need for TexturePacker or atlas generation — the existing tileset PNGs work as-is. Small tileset sizes enable on-the-fly loading as players travel.
- **Worklets**: Game loop systems run as Reanimated worklets. They cannot access React state directly — use shared values.
- **Memory**: Typed arrays for tile data (Uint16Array, Uint8Array) keep memory footprint low. Only 20-50 entities per map.
- **Subpackage boundaries**: `engine/ecs/`, `engine/renderer/`, `engine/world/`, `engine/encounters/`, `engine/audio/`, `engine/save/`, `engine/inventory/`, `ui/`, `data/`

## Dependencies

| Story | Depends On |
|-------|-----------|
| US-002 | US-001 |
| US-003 | (independent, gen/ pipeline) |
| US-004 | US-002, US-003 |
| US-005 | US-004 |
| US-006 | US-005 |
| US-007 | US-002, US-006 |
| US-008 | US-007 |
| US-009 | US-001, US-015 |
| US-010 | US-005 |
| US-011 | US-010, US-015 |
| US-012 | US-010 |
| US-013 | US-004, US-006, US-011 |
| US-014 | US-009, US-013, US-015 |
| US-015 | US-001 |
| US-016 | US-001 |
| US-017 | US-007 |
| US-018 | US-009, US-015 |
| US-019 | US-001 |
| US-020 | US-009, US-015 |
| US-021 | US-010, US-015 |
| US-022 | US-003, US-014 |
| US-023 | US-001 |

## Success Metrics

- All 20+ maps render at 60fps on Chrome desktop
- Player can complete full Act 1 playthrough: Everwick -> Heartfield -> Ambergrove -> Millbrook -> Sunridge -> Depths L1 -> return
- Zone transitions feel seamless (no perceptible loading) for all world types
- Forgotten areas are visually dark and hostile; remembered areas are crystal clear and gorgeous
- Encounter chaining works: combat flows naturally to dialogue and back
- Dialogue feels authored (typewriter, portraits, personality)
- Test coverage exceeds 80% for engine/ and ui/ packages
- Web build deployed as PWA to GitHub Pages
- The game FEELS like memory awakening, not a tech demo
