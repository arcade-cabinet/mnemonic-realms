# Architecture Decision: Single-Player RPG with RPG-JS Standalone + Next.js

## Summary of Discussion

### Initial Misunderstanding
I initially assumed this was a **multiplayer MMORPG** project, leading to:
- Unnecessary client/server architecture
- Socket.io for multiplayer networking
- Separate Express server process
- Complex deployment requirements

### Clarification
User corrected: This is a **single-player 16-bit style RPG** (like Diablo/FF7):
- Traditional single-player experience
- 16-bit graphics aesthetic
- Procedurally generated content from seeds
- Browser-based game

### Question Answered
**"Can we use RPG-JS in Next.js without client/server split?"**

**YES!** Using RPG-JS standalone mode (`RPG_TYPE=rpg`):
- Runs entirely in browser
- No server process needed
- No multiplayer networking
- Perfect for single-player games

## Final Architecture

```
Next.js App (Unified)
├── app/
│   ├── page.tsx          # Landing page with seed input
│   ├── play/page.tsx     # Game page (RPG-JS renders here)
│   ├── layout.tsx        # Root layout
│   └── api/generate/     # API for procedural generation preview
├── components/
│   ├── SeedInput.tsx
│   └── GeneratedContent.tsx
├── lib/                  # Procedural generators (shared)
│   ├── ecs/
│   ├── generators/
│   └── utils/
├── rpgjs/                # RPG-JS game code (TODO)
│   └── modules/
└── public/               # Static assets
```

## Dependencies

### Production
- `next` - Web framework
- `react` + `react-dom` - UI library
- `@rpgjs/client` - Game engine (browser-side)
- `@rpgjs/common` - Shared utilities
- `@rpgjs/tiled` - Map support
- `ecsy` - ECS for procedural generation
- `seedrandom` - Deterministic randomness

### Development
- `@biomejs/biome` - Linting/formatting
- `tailwindcss` - Styling
- `typescript` - Type safety

### REMOVED (not needed for single-player)
- ~~@rpgjs/server~~ - Multiplayer game server
- ~~@rpgjs/compiler~~ - Build tool
- ~~express~~ - Web server (Next.js provides this)
- ~~socket.io-client~~ - Real-time networking
- ~~concurrently~~ - Process management

## Scripts

```json
{
  "dev": "RPG_TYPE=rpg next dev",
  "build": "RPG_TYPE=rpg next build",
  "start": "next start",
  "export": "RPG_TYPE=rpg next build && next export"
}
```

## Game Flow

1. User visits landing page (/)
2. Enters seed "dark ancient forest" or clicks "Random Seed"
3. Preview generated content (character, location, loot)
4. Clicks "Play Game"
5. Redirected to /play?seed=dark+ancient+forest
6. RPG-JS initializes in standalone mode
7. Procedural generators create world from seed
8. Player explores 16-bit procedurally generated world

## Key Benefits

### ✅ Simplified Architecture
- Single application (no microservices)
- One codebase to maintain
- Clear mental model

### ✅ Lower Costs
- No server infrastructure
- Deploy to Vercel/Netlify free tier
- CDN distribution included

### ✅ Better Performance
- No network latency (everything local)
- Instant game responses
- Smooth 60 FPS gameplay

### ✅ Easier Development
- Hot reload with Next.js
- Component-based UI
- Modern tooling (TypeScript, TailwindCSS)

### ✅ Portable Generators
- ECS generators work anywhere
- Can be used in API routes for previews
- Can be used in game for runtime generation

## RPG-JS Standalone Features

All single-player features work:
- ✅ Tiled map editor support
- ✅ Sprite animations
- ✅ Collision detection
- ✅ Event system
- ✅ Inventory/equipment
- ✅ Quest system
- ✅ Save/load (localStorage)

Multiplayer features disabled:
- ❌ Real-time networking
- ❌ Server authoritative state
- ❌ Other players

## Next Steps

1. **Create RPG-JS Module** for standalone mode
   - Configure client-side game initialization
   - Wire procedural generators to game startup
   - Generate maps, NPCs, items from seed

2. **Build Game Page**
   - Create /play route
   - Load RPG-JS in browser
   - Pass seed from URL params

3. **Integrate Procedural Content**
   - Generate terrain maps from seeds
   - Spawn NPCs with generated names/dialogue
   - Create items with procedural stats

4. **Polish UI**
   - Landing page design
   - Seed input validation
   - Loading states
   - Error handling

5. **Deploy**
   - Build for production
   - Deploy to Vercel
   - Test across browsers

## Conclusion

**The user was absolutely right to question the architecture.**

For a single-player 16-bit RPG:
- RPG-JS standalone mode is the correct choice
- Next.js provides modern web framework
- No need for client/server complexity
- Simpler, faster, cheaper solution

This is the foundation for **Mnemonic Realms** - a procedurally generated single-player RPG where every seed creates a unique, deterministic world to explore.
