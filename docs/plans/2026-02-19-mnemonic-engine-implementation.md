# MnemonicEngine Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Replace RPG-JS with a custom engine (Expo + React Native Skia + Miniplex ECS) that renders maps from the gen/ pipeline's JSON output.

**Architecture:** The gen/ pipeline already produces deterministic MapComposition/MapCanvas instruction sets. We add ONE new serializer that outputs JSON instead of TMX, then build a Skia+ECS runtime that consumes it. UI uses React Native Reusables (shadcn for RN) with vibrancy-responsive theming.

**Tech Stack:** Expo (React Native), @shopify/react-native-skia, Miniplex 2.0, React Native Reanimated 3, expo-router, NativeWind, React Native Reusables, expo-audio

---

## Task 1: Create Expo App Scaffold

**Files:**
- Create: `app.json` (Expo config)
- Create: `app/_layout.tsx` (Root layout with providers)
- Create: `app/index.tsx` (Placeholder title screen)
- Create: `app/game.tsx` (Placeholder game screen)
- Create: `engine/ecs/world.ts` (Miniplex world definition)
- Create: `engine/ecs/queries.ts` (Entity queries)
- Create: `tsconfig.app.json` (Expo-specific TS config)
- Modify: `package.json` (add Expo deps, add `expo:start` script)

**Step 1: Initialize Expo project structure**

Create the Expo app configuration and install dependencies. We use the `with-skia` Expo template pattern but set it up manually to preserve our existing project structure.

```bash
# Install Expo + Skia + Reanimated + NativeWind + expo-router
pnpm add expo @shopify/react-native-skia react-native-reanimated \
  expo-router react-native-gesture-handler react-native-safe-area-context \
  nativewind tailwindcss react-native-css-interop \
  miniplex @miniplex/react expo-audio moti
```

**Step 2: Write the failing test**

```typescript
// tests/unit/engine/ecs/world.test.ts
import { describe, it, expect } from 'vitest';
import { createGameWorld, type GameEntity } from '../../engine/ecs/world';

describe('ECS World', () => {
  it('creates a world and adds a player entity', () => {
    const world = createGameWorld();
    const player: GameEntity = world.add({
      position: { x: 10, y: 10 },
      player: true,
      facing: 'down',
      velocity: { x: 0, y: 0 },
    });
    expect(player.position).toEqual({ x: 10, y: 10 });
    expect(player.player).toBe(true);
  });

  it('queries entities by archetype', () => {
    const world = createGameWorld();
    world.add({ position: { x: 5, y: 5 }, npc: true, dialogue: { id: 'artun-1', lines: ['Hello'] } });
    world.add({ position: { x: 10, y: 10 }, player: true });
    world.add({ position: { x: 3, y: 3 }, chest: { contents: ['potion'], opened: false } });

    const npcs = world.with('npc');
    expect([...npcs]).toHaveLength(1);

    const positioned = world.with('position');
    expect([...positioned]).toHaveLength(3);
  });
});
```

**Step 3: Run test to verify it fails**

Run: `pnpm test:unit tests/unit/engine/ecs/world.test.ts`
Expected: FAIL with "Cannot find module"

**Step 4: Write minimal implementation**

```typescript
// engine/ecs/world.ts
import { World } from 'miniplex';

export type GameEntity = {
  position?: { x: number; y: number };
  sprite?: { sheet: string; frame: number; width: number; height: number };
  layer?: 'ground' | 'object' | 'above';
  facing?: 'up' | 'down' | 'left' | 'right';
  player?: true;
  npc?: true;
  collidable?: true;
  interactable?: true;
  velocity?: { x: number; y: number };
  dialogue?: { id: string; lines: string[]; portrait?: string };
  aiState?: 'idle' | 'patrol' | 'follow';
  patrolPath?: { x: number; y: number }[];
  health?: { current: number; max: number };
  inventory?: string[];
  questFlags?: Record<string, boolean>;
  vibrancy?: number;
  chest?: { contents: string[]; opened: boolean };
  resonanceStone?: { fragmentId: string; discovered: boolean };
  transition?: { targetMap: string; targetTile: { x: number; y: number } };
  trigger?: { eventId: string; condition?: string };
};

export function createGameWorld() {
  return new World<GameEntity>();
}
```

```typescript
// engine/ecs/queries.ts
import type { World } from 'miniplex';
import type { GameEntity } from './world';

export function createQueries(world: World<GameEntity>) {
  return {
    players: world.with('player', 'position'),
    npcs: world.with('npc', 'position'),
    interactables: world.with('interactable', 'position'),
    chests: world.with('chest', 'position'),
    resonanceStones: world.with('resonanceStone', 'position'),
    transitions: world.with('transition', 'position'),
    movable: world.with('velocity', 'position'),
  };
}
```

**Step 5: Run test to verify it passes**

Run: `pnpm test:unit tests/unit/engine/ecs/world.test.ts`
Expected: PASS

**Step 6: Create Expo app files**

Create `app.json`, `app/_layout.tsx`, `app/index.tsx`, `app/game.tsx`, `tsconfig.app.json` following the design doc's architecture diagram. These are the scaffold -- rendering comes in Task 4.

**Step 7: Commit**

```bash
git add engine/ecs/ app/ app.json tsconfig.app.json tests/unit/engine/ecs/
git commit -m "feat: Expo scaffold + Miniplex ECS world"
```

---

## Task 2: Build Runtime JSON Serializer

**Files:**
- Create: `gen/assemblage/pipeline/runtime-serializer.ts`
- Create: `gen/assemblage/pipeline/runtime-types.ts`
- Test: `tests/unit/gen/assemblage/pipeline/runtime-serializer.test.ts`

**Step 1: Write the failing test**

```typescript
// tests/unit/gen/assemblage/pipeline/runtime-serializer.test.ts
import { describe, it, expect } from 'vitest';
import { serializeToRuntime, type RuntimeMapData } from '../../../gen/assemblage/pipeline/runtime-serializer';
import { MapCanvas } from '../../../gen/assemblage/pipeline/canvas';

describe('Runtime Serializer', () => {
  it('serializes a simple canvas to runtime JSON', () => {
    const canvas = new MapCanvas({
      width: 4,
      height: 4,
      tileWidth: 16,
      tileHeight: 16,
      layers: ['ground', 'objects'],
    });

    // Fill ground with grass
    canvas.fillLayer('ground', 'grass');

    const result = serializeToRuntime(canvas);

    expect(result.width).toBe(4);
    expect(result.height).toBe(4);
    expect(result.tileWidth).toBe(16);
    expect(result.tileHeight).toBe(16);
    expect(result.layers.ground).toHaveLength(16); // 4x4
    expect(result.layers.objects).toHaveLength(16);
    expect(result.collision).toHaveLength(16);
  });

  it('preserves objects and visuals', () => {
    const canvas = new MapCanvas({
      width: 4, height: 4, tileWidth: 16, tileHeight: 16,
      layers: ['ground'],
    });
    canvas.addObject({
      name: 'test-npc', type: 'npc',
      x: 2, y: 2,
      properties: { dialogue: 'hello' },
    });
    const result = serializeToRuntime(canvas);
    expect(result.objects).toHaveLength(1);
    expect(result.objects[0].name).toBe('test-npc');
  });

  it('outputs valid JSON', () => {
    const canvas = new MapCanvas({
      width: 2, height: 2, tileWidth: 16, tileHeight: 16,
      layers: ['ground'],
    });
    canvas.fillLayer('ground', 'grass');
    const result = serializeToRuntime(canvas);
    const json = JSON.stringify(result);
    const parsed = JSON.parse(json) as RuntimeMapData;
    expect(parsed.width).toBe(2);
  });
});
```

**Step 2: Run test to verify it fails**

Run: `pnpm test:unit tests/unit/gen/assemblage/pipeline/runtime-serializer.test.ts`
Expected: FAIL with "Cannot find module"

**Step 3: Write minimal implementation**

```typescript
// gen/assemblage/pipeline/runtime-types.ts
import type { AssemblageObject, EventHook, SemanticTile } from '../types';

/** Runtime map data consumed by the MnemonicEngine at load time. */
export interface RuntimeMapData {
  id?: string;
  width: number;
  height: number;
  tileWidth: number;
  tileHeight: number;
  layerOrder: string[];
  /** Each layer is a flat array of SemanticTile references (row-major). */
  layers: Record<string, SemanticTile[]>;
  /** Flat collision grid: 1 = blocked, 0 = passable. */
  collision: (0 | 1)[];
  /** Visual objects (buildings, trees, props). */
  visuals: { objectRef: string; x: number; y: number }[];
  /** Event objects (NPCs, chests, transitions, triggers). */
  objects: AssemblageObject[];
  /** Event hooks for behavior wiring. */
  hooks: EventHook[];
}
```

```typescript
// gen/assemblage/pipeline/runtime-serializer.ts
import type { MapCanvas } from './canvas';
import type { RuntimeMapData } from './runtime-types';

/**
 * Serialize a composed MapCanvas to runtime JSON format.
 *
 * Unlike the TMX serializer, this preserves semantic tile references
 * (e.g., 'terrain:grass') rather than resolving to numeric GIDs.
 * GID resolution happens at runtime using the palette.
 */
export function serializeToRuntime(canvas: MapCanvas): RuntimeMapData {
  const layers: Record<string, (string | 0)[]> = {};

  for (const layerName of canvas.layerOrder) {
    const semanticLayer = canvas.layers.get(layerName)!;
    layers[layerName] = [...semanticLayer];
  }

  return {
    width: canvas.width,
    height: canvas.height,
    tileWidth: canvas.tileWidth,
    tileHeight: canvas.tileHeight,
    layerOrder: [...canvas.layerOrder],
    layers,
    collision: [...canvas.collision],
    visuals: canvas.visuals.map((v) => ({
      objectRef: v.objectRef,
      x: v.x,
      y: v.y,
    })),
    objects: canvas.objects.map((o) => ({ ...o })),
    hooks: canvas.hooks.map((h) => ({ ...h })),
  };
}

export type { RuntimeMapData };
```

**Step 4: Run test to verify it passes**

Run: `pnpm test:unit tests/unit/gen/assemblage/pipeline/runtime-serializer.test.ts`
Expected: PASS

**Step 5: Commit**

```bash
git add gen/assemblage/pipeline/runtime-serializer.ts gen/assemblage/pipeline/runtime-types.ts tests/unit/gen/assemblage/pipeline/
git commit -m "feat: runtime JSON serializer for MnemonicEngine"
```

---

## Task 3: Generate Everwick Runtime JSON via CLI

**Files:**
- Modify: `gen/assemblage/cli.ts` (add `emit-runtime` command)
- Create: `data/maps/` directory
- Test: `tests/unit/gen/assemblage/cli-emit-runtime.test.ts`

**Step 1: Write the failing test**

Test the `emitRuntime` function directly (imported from the CLI module) rather than shelling out:

```typescript
// tests/unit/gen/assemblage/cli-emit-runtime.test.ts
import { describe, it, expect } from 'vitest';
import { existsSync, readFileSync, mkdirSync, rmSync } from 'node:fs';
import { emitRuntime } from '../../../gen/assemblage/cli';

describe('CLI emit-runtime', () => {
  it('generates runtime JSON for settled-lands', async () => {
    const outputDir = 'data/maps';
    mkdirSync(outputDir, { recursive: true });

    await emitRuntime('settled-lands', outputDir);

    const outputPath = `${outputDir}/settled-lands.json`;
    expect(existsSync(outputPath)).toBe(true);

    const data = JSON.parse(readFileSync(outputPath, 'utf-8'));
    expect(data.width).toBeGreaterThan(0);
    expect(data.height).toBeGreaterThan(0);
    expect(data.layerOrder).toBeInstanceOf(Array);
    expect(data.objects).toBeInstanceOf(Array);
  });
});
```

**Step 2: Run test to verify it fails**

Run: `pnpm test:unit tests/unit/gen/assemblage/cli-emit-runtime.test.ts`
Expected: FAIL with "emitRuntime is not a function" or similar

**Step 3: Implement the CLI command**

Add `emit-runtime` to the existing CLI in `gen/assemblage/cli.ts`. Export an `emitRuntime()` function that:
1. Uses the existing region-composer + canvas pipeline
2. Calls `serializeToRuntime()` instead of `serializeToTmx()`
3. Writes JSON to `data/maps/{regionId}.json`

**Step 4: Run test to verify it passes**

Run: `pnpm test:unit tests/unit/gen/assemblage/cli-emit-runtime.test.ts`
Expected: PASS + `data/maps/settled-lands.json` exists

**Step 5: Commit**

```bash
git add gen/assemblage/cli.ts data/maps/
git commit -m "feat: CLI emit-runtime command generates JSON for MnemonicEngine"
```

---

## Task 4: Skia Tile Renderer

**Files:**
- Create: `engine/renderer/tile-renderer.tsx`
- Create: `engine/renderer/camera.tsx`
- Create: `engine/world/loader.ts`
- Test: `tests/unit/engine/renderer/tile-renderer.test.ts`
- Test: `tests/unit/engine/world/loader.test.ts`

**Step 1: Write the failing test for map loader**

```typescript
// tests/unit/engine/world/loader.test.ts
import { describe, it, expect } from 'vitest';
import { loadMapData, type LoadedMap } from '../../engine/world/loader';

describe('Map Loader', () => {
  it('loads runtime JSON into tile arrays + entities', () => {
    const runtimeData = {
      width: 4, height: 4, tileWidth: 16, tileHeight: 16,
      layerOrder: ['ground'],
      layers: { ground: Array(16).fill('terrain:grass') },
      collision: Array(16).fill(0),
      visuals: [],
      objects: [
        { name: 'test-npc', type: 'npc', x: 2, y: 2, properties: { dialogue: 'hello' } },
      ],
      hooks: [],
    };

    const loaded = loadMapData(runtimeData);
    expect(loaded.tileLayers.ground).toHaveLength(16);
    expect(loaded.collision).toHaveLength(16);
    expect(loaded.entities).toHaveLength(1);
    expect(loaded.entities[0].name).toBe('test-npc');
  });
});
```

**Step 2: Run test to verify it fails**

Run: `pnpm test:unit tests/unit/engine/world/loader.test.ts`
Expected: FAIL

**Step 3: Implement map loader**

The loader parses the runtime JSON into two outputs:
- Typed arrays for tile data (stays as arrays, not entities)
- Entity descriptors for behavioral objects (NPCs, chests, transitions)

**Step 4: Implement tile renderer**

The tile renderer uses Skia's `<Atlas>` component to batch-render visible tiles. Viewport culling means only tiles within the camera bounds generate draw calls.

```tsx
// engine/renderer/tile-renderer.tsx
// Uses Skia Atlas API:
// - tilesetImage: loaded SkImage from PNG
// - sprites: SkRect[] sub-regions of the spritesheet
// - transforms: RSXform[] screen positions
// - FilterMode.Nearest for pixel-perfect rendering
```

**Step 5: Implement camera**

Camera tracks the player entity position. Wraps the tile + entity renderers in a Skia `<Group>` with translate transform.

**Step 6: Run tests**

Run: `pnpm test:unit tests/unit/engine/`
Expected: PASS

**Step 7: Commit**

```bash
git add engine/renderer/ engine/world/loader.ts tests/unit/engine/
git commit -m "feat: Skia tile renderer + map loader + camera system"
```

---

## Task 5: Player Movement + Collision + Camera Following

**Files:**
- Create: `engine/ecs/systems/movement.ts`
- Create: `engine/ecs/systems/collision.ts`
- Create: `engine/ecs/systems/camera.ts`
- Create: `engine/input.ts`
- Create: `engine/game-loop.ts`
- Test: `tests/unit/engine/ecs/systems/movement.test.ts`
- Test: `tests/unit/engine/ecs/systems/collision.test.ts`

**Step 1: Write the failing test for movement**

```typescript
// tests/unit/engine/ecs/systems/movement.test.ts
import { describe, it, expect } from 'vitest';
import { createGameWorld } from '../../../engine/ecs/world';
import { movementSystem } from '../../../engine/ecs/systems/movement';

describe('Movement System', () => {
  it('moves entities by their velocity', () => {
    const world = createGameWorld();
    const player = world.add({
      position: { x: 5, y: 5 },
      velocity: { x: 1, y: 0 },
      player: true,
    });

    movementSystem(world, 16); // 16ms tick

    expect(player.position!.x).toBeGreaterThan(5);
    expect(player.position!.y).toBe(5);
  });
});
```

**Step 2: Write the failing test for collision**

```typescript
// tests/unit/engine/ecs/systems/collision.test.ts
import { describe, it, expect } from 'vitest';
import { checkCollision } from '../../../engine/ecs/systems/collision';

describe('Collision System', () => {
  it('detects collision with blocked tile', () => {
    const collision = new Uint8Array([
      0, 0, 0, 0,
      0, 1, 1, 0,
      0, 1, 1, 0,
      0, 0, 0, 0,
    ]);
    expect(checkCollision(collision, 4, 4, 1, 1)).toBe(true);  // blocked
    expect(checkCollision(collision, 4, 4, 0, 0)).toBe(false); // clear
  });
});
```

**Step 3: Run tests to verify they fail**

Run: `pnpm test:unit tests/unit/engine/ecs/systems/`
Expected: FAIL

**Step 4: Implement systems**

Movement: Pure function that iterates `world.with('position', 'velocity')` and updates positions.
Collision: Pure function that checks a position against the collision grid before allowing movement.
Camera: Tracks player position, outputs camera x/y as shared values.

**Step 5: Implement input handler**

Maps keyboard (WASD/arrows), touch (d-pad or swipe), and gamepad to velocity shared values. Uses `react-native-gesture-handler` for touch.

**Step 6: Implement game loop**

Uses `useFrameCallback` from Reanimated 3 to tick all systems at 60fps on the UI thread.

**Step 7: Run tests**

Run: `pnpm test:unit tests/unit/engine/`
Expected: PASS

**Step 8: Commit**

```bash
git add engine/ecs/systems/ engine/input.ts engine/game-loop.ts tests/unit/engine/ecs/systems/
git commit -m "feat: player movement, collision, camera, input, game loop"
```

---

## Task 6: NPC Entities + Interaction System

**Files:**
- Create: `engine/ecs/systems/interaction.ts`
- Create: `engine/ecs/systems/npc-ai.ts`
- Create: `engine/renderer/sprite-renderer.tsx`
- Test: `tests/unit/engine/ecs/systems/interaction.test.ts`
- Test: `tests/unit/engine/ecs/systems/npc-ai.test.ts`

**Step 1: Write the failing test for interaction**

```typescript
// tests/unit/engine/ecs/systems/interaction.test.ts
import { describe, it, expect } from 'vitest';
import { createGameWorld } from '../../../engine/ecs/world';
import { findInteractionTarget } from '../../../engine/ecs/systems/interaction';

describe('Interaction System', () => {
  it('finds the NPC the player is facing', () => {
    const world = createGameWorld();
    world.add({ position: { x: 5, y: 5 }, player: true, facing: 'up' });
    world.add({ position: { x: 5, y: 4 }, npc: true, interactable: true,
                dialogue: { id: 'artun-1', lines: ['Ah, you are awake.'] } });

    const target = findInteractionTarget(world);
    expect(target).toBeDefined();
    expect(target!.dialogue!.id).toBe('artun-1');
  });

  it('returns null when no NPC in facing direction', () => {
    const world = createGameWorld();
    world.add({ position: { x: 5, y: 5 }, player: true, facing: 'down' });
    world.add({ position: { x: 5, y: 4 }, npc: true, interactable: true });

    const target = findInteractionTarget(world);
    expect(target).toBeNull();
  });
});
```

**Step 2: Run test to verify it fails**

Run: `pnpm test:unit tests/unit/engine/ecs/systems/interaction.test.ts`
Expected: FAIL

**Step 3: Implement interaction + NPC AI + sprite renderer**

Interaction: Checks the tile in front of the player for interactable entities.
NPC AI: Simple patrol/idle state machine. NPCs walk predefined paths or stand still.
Sprite renderer: Second Skia `<Atlas>` for dynamic entity sprites, updated every frame.

**Step 4: Run tests**

Run: `pnpm test:unit tests/unit/engine/ecs/systems/`
Expected: PASS

**Step 5: Commit**

```bash
git add engine/ecs/systems/interaction.ts engine/ecs/systems/npc-ai.ts engine/renderer/sprite-renderer.tsx tests/unit/engine/ecs/systems/
git commit -m "feat: NPC interaction system + AI + sprite renderer"
```

---

## Task 7: Dialogue Box UI Component

**Files:**
- Create: `ui/dialogue-box.tsx`
- Create: `ui/hooks/use-typewriter.ts`
- Create: `ui/theme/game-theme.ts`
- Test: `tests/unit/ui/dialogue-box.test.tsx`

**Step 1: Write the failing test**

```typescript
// tests/unit/ui/dialogue-box.test.tsx
import { describe, it, expect } from 'vitest';
import { renderHook, act } from '@testing-library/react-native';
import { useTypewriter } from '../../ui/hooks/use-typewriter';

describe('useTypewriter', () => {
  it('reveals text character by character', () => {
    const { result } = renderHook(() =>
      useTypewriter('Hello, traveler.', { speed: 0 })
    );

    expect(result.current.displayedText).toBe('');
    expect(result.current.isComplete).toBe(false);

    // Advance to completion
    act(() => { result.current.complete(); });
    expect(result.current.displayedText).toBe('Hello, traveler.');
    expect(result.current.isComplete).toBe(true);
  });
});
```

**Step 2: Run test to verify it fails**

Run: `pnpm test:unit tests/unit/ui/`
Expected: FAIL

**Step 3: Implement dialogue box**

The dialogue box is a React Native component (NOT Skia). It sits ABOVE the game canvas as an overlay.

Key features:
- Character portrait (left side, animated idle)
- Speaker name in accent color
- Text materializes letter-by-letter with subtle opacity
- Frosted glass background with vibrancy-responsive tint
- Choice options slide in from right
- Advance indicator pulses gently

Uses React Native Reusables for base styling + NativeWind + Moti for spring animations.

**Step 4: Run tests**

Run: `pnpm test:unit tests/unit/ui/`
Expected: PASS

**Step 5: Commit**

```bash
git add ui/ tests/unit/ui/
git commit -m "feat: dialogue box UI with typewriter effect"
```

---

## Task 8: Vibrancy SkSL Shader

**Files:**
- Create: `engine/renderer/shader/vibrancy.ts` (SkSL as string constant)
- Create: `engine/renderer/shader/shimmer.ts`
- Create: `engine/ecs/systems/vibrancy.ts`
- Test: `tests/unit/engine/ecs/systems/vibrancy.test.ts`
- Test: `tests/unit/engine/renderer/shader/vibrancy-shader.test.ts`

**Step 1: Write the failing test for vibrancy system**

```typescript
// tests/unit/engine/ecs/systems/vibrancy.test.ts
import { describe, it, expect } from 'vitest';
import { computeZoneVibrancy } from '../../../engine/ecs/systems/vibrancy';

describe('Vibrancy System', () => {
  it('computes zone vibrancy from discovered fragments', () => {
    const fragments = { discovered: 3, total: 10 };
    const baseVibrancy = 30;
    const result = computeZoneVibrancy(baseVibrancy, fragments);
    expect(result).toBeGreaterThan(baseVibrancy);
    expect(result).toBeLessThanOrEqual(100);
  });

  it('caps at 100', () => {
    const result = computeZoneVibrancy(95, { discovered: 10, total: 10 });
    expect(result).toBe(100);
  });
});
```

**Step 2: Run test to verify it fails**

Run: `pnpm test:unit tests/unit/engine/ecs/systems/vibrancy.test.ts`
Expected: FAIL

**Step 3: Implement vibrancy shader**

The SkSL shader converts the game world between greyscale (0 vibrancy) and full color (1.0 vibrancy). It samples the child image, computes luminance via dot product with standard coefficients (0.299, 0.587, 0.114), and mixes between grey and color based on the vibrancy uniform.

The shader is defined as a TypeScript string constant in `engine/renderer/shader/vibrancy.ts`. Key uniforms:
- `shader image` -- the child image (game canvas) to process
- `float vibrancy` -- 0.0 = full grey, 1.0 = full color

The `main(float2 xy)` function uses `image.sample(xy)` to read the child, computes greyscale from the RGB dot product, then returns `mix(grey, color, vibrancy)`.

Applied via `<RuntimeShader>` over the entire game `<Group>`. The `vibrancy` uniform is a Reanimated shared value that updates smoothly.

**Step 4: Implement vibrancy system**

Pure ECS system that computes the vibrancy uniform value from discovered fragments + base zone vibrancy. Outputs a shared value consumed by the shader.

**Step 5: Run tests**

Run: `pnpm test:unit tests/unit/engine/`
Expected: PASS

**Step 6: Commit**

```bash
git add engine/renderer/shader/ engine/ecs/systems/vibrancy.ts tests/unit/engine/
git commit -m "feat: vibrancy SkSL shader + vibrancy system"
```

---

## Task 9: HUD Component

**Files:**
- Create: `ui/hud.tsx`
- Create: `ui/hud/vibrancy-meter.tsx`
- Create: `ui/hud/zone-placard.tsx`
- Create: `ui/hud/hp-bar.tsx`
- Test: `tests/unit/ui/hud.test.tsx`

**Step 1: Write the failing test**

```typescript
// tests/unit/ui/hud.test.tsx
import { describe, it, expect } from 'vitest';
import { computeVibrancyTier } from '../../ui/hud/vibrancy-meter';

describe('Vibrancy Meter', () => {
  it('maps vibrancy percentage to tier name', () => {
    expect(computeVibrancyTier(0)).toBe('Dormant');
    expect(computeVibrancyTier(25)).toBe('Muted');
    expect(computeVibrancyTier(50)).toBe('Emerging');
    expect(computeVibrancyTier(75)).toBe('Vivid');
    expect(computeVibrancyTier(100)).toBe('Radiant');
  });
});
```

**Step 2: Run test to verify it fails, then implement**

HUD components:
- **Vibrancy meter**: THE signature UI element. Horizontal bar transitioning from grey pencil-sketch to golden radiance. Tier label. Uses NativeWind + Moti for smooth transitions.
- **Zone placard**: Drifts in from top on zone entry, holds 3 seconds, dissolves. Shows zone name in authored font.
- **HP bar**: Red gradient, shows current/max. Fades to near-invisible during exploration.

**Step 3: Run tests and commit**

Run: `pnpm test:unit tests/unit/ui/`
Expected: PASS

```bash
git add ui/hud/ ui/hud.tsx tests/unit/ui/
git commit -m "feat: HUD with vibrancy meter, zone placard, HP bar"
```

---

## Task 10: Particle System (Memory Motes)

**Files:**
- Create: `engine/renderer/particle-renderer.tsx`
- Create: `engine/ecs/systems/particles.ts`
- Test: `tests/unit/engine/ecs/systems/particles.test.ts`

**Step 1: Write the failing test**

```typescript
// tests/unit/engine/ecs/systems/particles.test.ts
import { describe, it, expect } from 'vitest';
import { updateParticles, spawnMotes, type Particle } from '../../../engine/ecs/systems/particles';

describe('Particle System', () => {
  it('spawns motes proportional to vibrancy', () => {
    const lowVibrancy = spawnMotes(10, { width: 60, height: 60 }, 20);
    const highVibrancy = spawnMotes(10, { width: 60, height: 60 }, 90);
    expect(highVibrancy.length).toBeGreaterThan(lowVibrancy.length);
  });

  it('removes expired particles', () => {
    const particles: Particle[] = [
      { x: 5, y: 5, vx: 0.1, vy: -0.05, lifetime: 0, maxLifetime: 100, alpha: 1 },
      { x: 10, y: 10, vx: 0.1, vy: -0.05, lifetime: 99, maxLifetime: 100, alpha: 0.01 },
    ];
    const updated = updateParticles(particles, 16);
    expect(updated).toHaveLength(1); // second particle expired
  });
});
```

**Step 2: Implement particle system and renderer**

Particles are NOT ECS entities (too many, too transient). They live in a typed array managed by the particle system. The renderer uses a Skia Atlas for small sprite particles with per-frame position updates.

Behavior:
- Motes drift gently with random velocity
- Density scales with vibrancy (more motes = more vivid world)
- At Dormant (<10): zero motes
- At Muted (10-40): sparse, dim
- At Radiant (90+): dense, bright, leave subtle trails

**Step 3: Run tests and commit**

```bash
git add engine/renderer/particle-renderer.tsx engine/ecs/systems/particles.ts tests/unit/engine/ecs/systems/
git commit -m "feat: memory mote particle system"
```

---

## Task 11: Multi-Map Zone Transitions (outline)

Connect Everwick -> Heartfield -> Ambergrove. Seamless transitions: camera pans, tile data swaps, entities respawn. No loading screens. Zone placard appears. Test: walk between all 3 maps.

---

## Task 12: Random Encounters + Combat UI (outline)

Step counter triggers encounters in enemy zones. Combat screen is a fullscreen overlay (expo-router modal). Turn-based with resonance broadcast mechanic (emotion + element + potency radial selector). HP/SP tracking.

---

## Task 13: Inventory + Equipment + Shop (outline)

Inventory screen: illustrated icons on parchment grid. Equipment silhouette slots. Drag-to-equip with spring animations. Shop screen: buy/sell with keeper personality quotes. React Native Reusables components.

---

## Task 14: Audio System (outline)

BGM per zone (crossfade on transitions). SFX for interactions (dialogue blip, chest open, resonance hum). Use expo-audio. Vibrancy affects audio: muted zones have quieter, more reverb-heavy BGM.

---

## Task 15: Polish + Delete RPG-JS (outline)

Remove all `@rpgjs/*` packages. Delete `main/` directory. Delete `rpg.toml`. Update CI for Expo build. Update `CLAUDE.md`. Final pass: ensure the game FEELS like memory awakening.

---

## Execution Notes

- Tasks 1-3 are pure build-time work (gen/ pipeline changes). No Expo runtime needed.
- Tasks 4-6 are the core game loop. After Task 6, Everwick is walkable with NPC interaction.
- Tasks 7-10 add the soul: dialogue, vibrancy, HUD, particles. After Task 10, one map is BEAUTIFUL.
- Tasks 11-15 expand to full game.
- Each task follows TDD: failing test -> implement -> pass -> commit.
- Tasks are independent enough for parallel agent dispatch (1-3 can parallel, 4-6 sequential, 7-10 can parallel).
