---
title: "RPG-JS Integration Guide"
version: 1.0.0
date: 2026-02-12
authors: ["jbdevprimary", "copilot"]
status: "Active"
tags: ["rpgjs", "integration", "architecture", "procedural-generation"]
---

# RPG-JS Integration Guide

## Overview

Mnemonic Realms properly integrates with RPG-JS v4.3.0 using the framework's module system, not custom workarounds. This document explains how procedural generation is wired into RPG-JS.

## Architecture

### RPG-JS Module Structure

```
main/
├── server/
│   ├── index.ts              # Server module exports
│   ├── player.ts             # Procedural player class
│   └── maps/
│       ├── proceduralWorld.ts # Procedural map generator
│       └── tmx/
│           └── procedural.tmx # Tiled map template
├── client/
│   └── index.ts              # Client module exports
└── database/
    ├── maps/                 # Tiled JSON maps
    ├── sprites/              # Character spritesheets
    └── tilesets/             # Tile graphics
```

### Configuration (rpg.toml)

```toml
[app]
name = "Mnemonic Realms"
shortName = "mnemonic"

[type]
standalone = true  # Browser-only execution

[modules]
main = "./main"    # Our procedural module

[start]
map = "proceduralWorld"
graphic = "hero"
hitbox = [16, 16]
speed = 3
```

## Procedural Integration Points

### 1. Player Generation

**File**: `main/server/player.ts`

The `ProceduralPlayer` class extends `RpgPlayer` and implements `RpgPlayerHooks`:

```typescript
export class ProceduralPlayer extends RpgPlayer {
  setWorldSeed(seed: string) {
    // 1. Create procedural world
    const world = new ProceduralWorld();
    
    // 2. Generate character from seed
    const charId = world.createCharacter(seed);
    world.update();
    
    // 3. Extract ECS components
    const entity = world.getEntity(charId);
    const nameComp = entity.getComponent(Name);
    const classComp = entity.getComponent(CharacterClass);
    
    // 4. Apply to RPG-JS player
    this.name = nameComp.value;
    this.hp = calculateHP(classComp.value);
  }
  
  onConnected() {
    // Generate player on connection
    this.generatePlayerStats();
  }
}
```

**Key Points**:
- Uses ECS procedural world to generate stats
- Converts ECS components to RPG-JS player properties
- Deterministic: same seed = same stats
- Hooks into RPG-JS lifecycle (onConnected, onJoinMap)

### 2. Map Generation

**File**: `main/server/maps/proceduralWorld.ts`

The `ProceduralWorldMap` extends `RpgMap`:

```typescript
@MapData({
  id: 'proceduralWorld',
  name: 'Procedural World',
  file: require('./tmx/procedural.tmx'),
})
export class ProceduralWorldMap extends RpgMap {
  onLoad() {
    // Generate procedural terrain when map loads
    this.generateProceduralTerrain();
  }
  
  private generateProceduralTerrain() {
    const world = new ProceduralWorld();
    
    // Batch create terrain entities
    for (let y = 0; y < height; y++) {
      for (let x = 0; x < width; x++) {
        world.createTerrain(`${seed}-${x}-${y}`, x, y);
      }
    }
    
    // Single update for performance
    world.update();
    
    // Apply terrain to RPG-JS tiles
    // (tile setting implementation pending)
  }
}
```

**Key Points**:
- Loads Tiled TMX template
- Generates procedural terrain on map load
- Uses batch entity creation for performance
- Maps terrain types to tile IDs

### 3. Client Module

**File**: `main/client/index.ts`

```typescript
@RpgModule<RpgClient>({
  spritesheets: [],
  sounds: [],
  gui: [],
})
export default class ClientModule {}
```

**Key Points**:
- Handles rendering and client-side logic
- Will integrate with Next.js UI components
- Standalone mode renders in browser canvas

## Integration with Next.js

### Current Architecture

```
Next.js App
├── Landing Page (app/page.tsx)
│   └── Seed input → stores in Zustand
├── Game Page (app/play/page.tsx)
│   └── Initializes RPG-JS with seed
└── RPG-JS Modules (main/)
    └── Use seed from Zustand store
```

### Passing Seed to RPG-JS

**Option 1**: URL Parameter
```typescript
// Landing page
router.push(`/play?seed=${encodeURIComponent(seed)}`);

// Game page
const searchParams = useSearchParams();
const seed = searchParams.get('seed');
// Pass to RPG-JS player
```

**Option 2**: Zustand Store
```typescript
// Game page accesses store
const { player } = useGameStore();
// Initialize RPG-JS with player.worldSeed
```

## Build Integration

### Development

```bash
# Install dependencies
pnpm install

# Next.js dev server (landing page, UI)
pnpm dev

# RPG-JS build (future, when compiler integrated)
pnpm rpgjs:build
```

### Production

```bash
# Build Next.js (includes static pages)
pnpm build

# Build RPG-JS modules
# TODO: Integrate @rpgjs/compiler

# Deploy as static site
pnpm export
```

## Data Flow

### Complete Flow: Seed → Game

1. **User enters seed** on landing page
   - Validates 3-word format
   - Shows procedural preview
   - Stores in Zustand

2. **User clicks "Start Game"**
   - Navigates to /play with seed
   - Initializes RPG-JS

3. **RPG-JS initialization**
   - Creates player with `ProceduralPlayer`
   - Calls `setWorldSeed(seed)`
   - Generates player stats from ECS

4. **Player joins map**
   - Loads `ProceduralWorldMap`
   - Calls `onLoad()`
   - Generates terrain from seed

5. **Game renders**
   - RPG-JS PixiJS renderer draws canvas
   - Player can move with WASD
   - Terrain matches seed deterministically

## ECS → RPG-JS Mapping

### Character Components

| ECS Component | RPG-JS Property | Notes |
|---------------|-----------------|-------|
| Name          | player.name     | Character name |
| CharacterClass| player variables| Affects hp, str, mag |
| Alignment     | player variables| light/dark/neutral |
| SkillMastery  | player skills   | Ability scores |

### Terrain Components

| ECS Component | RPG-JS Element | Notes |
|---------------|----------------|-------|
| Terrain.type  | Tile ID        | plains=1, forest=2, etc. |
| Location.x,y  | Tile position  | Grid coordinates |
| Terrain resources | Tile properties | Loot spawns |

### NPC Components

| ECS Component | RPG-JS Element | Notes |
|---------------|----------------|-------|
| Name          | event.name     | NPC name |
| Dialogue      | event.text     | Conversation |
| Personality   | event.behaviors| NPC AI |

## Future Enhancements

### Phase 1: Basic Integration (Current)
- ✅ Module structure created
- ✅ Player generation from seed
- ✅ Map template created
- ⏳ Tile setting implementation
- ⏳ Sprite assets

### Phase 2: Full Features
- [ ] NPC spawning from seeds
- [ ] Dialogue system integration
- [ ] Loot drops from terrain
- [ ] Combat with alignment system
- [ ] Quest generation

### Phase 3: Polish
- [ ] Custom tilesets
- [ ] Character sprites for each class
- [ ] Sound effects and music
- [ ] Particle effects
- [ ] UI/HUD integration

## Testing

### Unit Tests

```typescript
describe('ProceduralPlayer', () => {
  it('generates same stats from same seed', () => {
    const player1 = new ProceduralPlayer();
    player1.setWorldSeed('brave ancient warrior');
    
    const player2 = new ProceduralPlayer();
    player2.setWorldSeed('brave ancient warrior');
    
    expect(player1.name).toBe(player2.name);
    expect(player1.hp).toBe(player2.hp);
  });
});
```

### E2E Tests

```typescript
test('procedural map loads with correct terrain', async ({ page }) => {
  await page.goto('/play?seed=brave+ancient+warrior');
  
  // Wait for RPG-JS to initialize
  await page.waitForSelector('#rpg canvas');
  
  // Verify map loaded
  const console = await page.evaluate(() => {
    // Check RPG-JS map state
    return window.$rpgEngine.map.id === 'proceduralWorld';
  });
  
  expect(console).toBe(true);
});
```

## Debugging

### Console Logging

RPG-JS modules log to browser console:

```
Generated player from seed "brave ancient warrior": {
  name: "Halganon",
  class: "Adventurer",
  alignment: "neutral"
}
Procedural World Map loaded
Tile (0,0): plains
Tile (1,0): forest
...
```

### Accessing Game State

```typescript
// In browser console
$rpgEngine.player.name          // "Halganon"
$rpgEngine.player.hp            // 135
$rpgEngine.map.id               // "proceduralWorld"
$rpgEngine.player.getVariable('alignment') // "neutral"
```

## Troubleshooting

### Common Issues

**Issue**: Map not loading
- Check `tmx/procedural.tmx` file exists
- Verify tileset path is correct
- Check console for errors

**Issue**: Player stats not generated
- Verify `onConnected()` is called
- Check ECS world initialization
- Verify seed format (3 words)

**Issue**: TypeScript errors
- Ensure `@rpgjs/server` and `@rpgjs/client` installed
- Check tsconfig includes `main/` directory
- Verify decorator configuration

## References

- [RPG-JS Documentation](https://docs.rpgjs.dev/)
- [Tiled Map Editor](https://www.mapeditor.org/)
- [ECS Architecture](../architecture/SYSTEM_ARCHITECTURE.md)
- [Procedural Generation](../design/GAME_SYSTEMS.md)

---

**Status**: Initial integration complete
**Next**: Implement tile setting, add sprites, wire NPCs