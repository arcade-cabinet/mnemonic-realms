# RPG-JS Integration Guide

## How It Works

Mnemonic Realms uses **RPG-JS** as the game framework, with our procedural generators providing the content.

### Architecture

```
┌─────────────────────────────────────────┐
│         RPG-JS Framework                │
│  (Rendering, Physics, Networking)       │
└───────────────┬─────────────────────────┘
                │
                │ Hooks & Events
                │
┌───────────────▼─────────────────────────┐
│   Procedural Generator System (ECS)     │
│  - Name Generator                       │
│  - Dialogue Generator                   │
│  - Class Generator                      │
│  - Terrain Generator                    │
│  - NPC Generator                        │
│  - Loot Generator                       │
└─────────────────────────────────────────┘
```

### Integration Points

1. **Maps** - `ProceduralMapGenerator` creates Tiled JSON maps
2. **NPCs** - Spawned dynamically using seed-based generation
3. **Dialogue** - Generated on-demand from personality traits
4. **Classes** - Player/NPC classes from alignment system
5. **Loot** - Drops generated from seed-based loot tables

### File Structure

```
src/
├── modules/
│   └── main/
│       ├── server/      # Server-side game logic
│       ├── client/      # Client-side rendering
│       └── database/    # Future: save/load system
├── game/
│   ├── maps/           # Procedural map definitions
│   ├── sprites/        # Character/tile sprites
│   └── events/         # Game events
├── ecs/                # Procedural generation engine
├── generators/         # Content generators
└── module/             # Tiled integration

public/
└── index.html         # Game client

```

### Running the Game

```bash
# Install dependencies
pnpm install

# Build TypeScript
pnpm build

# Start game server
pnpm game
```

Then open `http://localhost:3000` in your browser.

### How RPG-JS Powers the Game

- **Rendering**: RPG-JS handles all sprite rendering and animations
- **Movement**: Built-in physics and collision detection
- **Multiplayer**: WebSocket-based MMORPG support (future)
- **UI**: Vue.js integration for menus and HUD
- **Maps**: Tiled map loader with automatic tileset registration

We just provide:
- The JSON map data (procedurally generated)
- NPC definitions (from our generators)
- Dialogue scripts (generated on-the-fly)
- Game events (triggered by seed-based rules)

### Next Steps

1. ✅ RPG-JS module structure
2. ✅ Procedural map integration
3. 🔄 NPC spawning system
4. 🔄 Dialogue event handlers
5. 🔄 Combat & loot systems
6. 🔄 Save/load with world seeds
