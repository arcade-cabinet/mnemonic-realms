# RPG-JS Standalone Single-Player Mode Evaluation

## CORRECTED Understanding: Single-Player 16-bit RPG (Diablo/FF7 Style)

**Answer: YES! We can eliminate the client/server split for single-player mode!**

## RPG-JS Standalone Mode

### What is Standalone Mode?

RPG-JS has a **standalone single-player mode** (`RPG_TYPE=rpg`) that:
- ✅ Runs entirely in the browser
- ✅ No server required
- ✅ No multiplayer networking
- ✅ Perfect for traditional single-player RPG

### How It Works

```bash
# Development
RPG_TYPE=rpg npm run dev

# Production build
RPG_TYPE=rpg npm run build
# Output: dist/standalone/ (static files, deploy anywhere)
```

The game runs **100% client-side** in the browser - just like classic Flash games or modern web games.

## Next.js + RPG-JS Standalone = Perfect Match!

### Architecture (SIMPLIFIED)

```
Next.js App
├── app/
│   ├── page.tsx           # Landing page with seed input
│   ├── play/page.tsx      # Game page (RPG-JS renders here)
│   └── api/
│       └── generate/      # Preview API (optional)
├── lib/
│   ├── ecs/               # Procedural generators
│   ├── generators/        # Content generators
│   └── utils/             # Seed utilities
├── rpgjs/                 # RPG-JS game code
│   ├── modules/
│   │   └── main/
│   │       ├── client/    # Client-side game logic
│   │       └── database/  # Game data (maps, NPCs, items)
│   └── index.ts           # RPG-JS entry
```

**NO separate server process!** Everything runs in Next.js.

### How RPG-JS Standalone Integrates with Next.js

#### app/play/page.tsx (Game Page)
```tsx
'use client';
import { useEffect, useRef } from 'react';
import { useSearchParams } from 'next/navigation';

export default function PlayPage() {
  const searchParams = useSearchParams();
  const seed = searchParams.get('seed') || 'dark ancient forest';
  const canvasRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Dynamically import RPG-JS (client-side only)
    import('@/rpgjs').then(({ startGame }) => {
      if (canvasRef.current) {
        startGame(canvasRef.current, { seed });
      }
    });
  }, [seed]);

  return (
    <div className="w-full h-screen bg-black">
      <div ref={canvasRef} id="rpg-game" />
    </div>
  );
}
```

#### rpgjs/index.ts (RPG-JS Standalone Entry)
```typescript
import { RpgClient, RpgModule } from '@rpgjs/client';
import { ProceduralWorld } from '@/lib/ecs/world';

@RpgModule<RpgClient>({
  scenes: {
    map: {
      onLoad() {
        // Generate procedural content from seed
        const seed = this.game.globalConfig.seed;
        const world = new ProceduralWorld();
        
        // Generate map from seed
        const mapId = world.createTerrain(seed, 0, 0);
        world.update();
        
        // Apply to game
        this.game.changeMap(mapId);
      }
    }
  }
})
class MainClient {}

export function startGame(container: HTMLElement, config: any) {
  // Start RPG-JS in standalone mode
  const client = new RpgClient();
  client.start({
    container,
    standalone: true, // STANDALONE MODE - no server!
    globalConfig: config,
  });
}
```

## Comparison: Before vs After

### Before (Confusing Approach)
```
❌ Separate Express server
❌ Socket.io connections
❌ @rpgjs/server running
❌ Multiplayer architecture for single-player game
```

### After (Correct Approach)
```
✅ Next.js App Router
✅ RPG-JS standalone mode
✅ Everything runs in browser
✅ Deploy to Vercel/Netlify as static site
✅ NO server process needed
```

## Configuration

### package.json
```json
{
  "scripts": {
    "dev": "next dev",
    "build": "RPG_TYPE=rpg next build",
    "start": "next start",
    "export": "RPG_TYPE=rpg next build && next export"
  }
}
```

### next.config.ts
```typescript
import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  // Configure for RPG-JS
  webpack: (config) => {
    // RPG-JS uses PixiJS and other game libraries
    config.externals = config.externals || {};
    return config;
  },
  env: {
    RPG_TYPE: 'rpg', // Standalone mode
  },
};

export default nextConfig;
```

## Benefits of This Approach

### ✅ Single Codebase
- No client/server split
- All code in one Next.js app
- Simpler mental model

### ✅ Modern Web Framework
- Next.js App Router
- React components for UI
- TailwindCSS for styling
- File-based routing

### ✅ RPG-JS Power
- 16-bit graphics (PixiJS)
- Tiled map support
- Sprite animations
- Collision detection
- Event system

### ✅ Procedural Generation
- Seed-based world generation
- ECS architecture for content
- Deterministic generation
- Shareable seeds

### ✅ Easy Deployment
- Deploy to Vercel/Netlify
- Static export option
- No server costs
- Global CDN

## Game Flow

```
1. User visits landing page (/)
   ↓
2. Enters seed "dark ancient forest"
   ↓
3. Clicks "Start Game"
   ↓
4. Redirected to /play?seed=dark+ancient+forest
   ↓
5. RPG-JS initializes in standalone mode
   ↓
6. Procedural generators create world from seed
   ↓
7. Player explores generated 16-bit world
```

## Answer to "Can we avoid client/server split?"

**YES!** For single-player mode:

1. ✅ Use `RPG_TYPE=rpg` for standalone mode
2. ✅ RPG-JS runs entirely in browser
3. ✅ No @rpgjs/server needed
4. ✅ No Socket.io needed
5. ✅ No Express server needed
6. ✅ Next.js serves everything as static/SSR

## What We Keep vs Remove

### KEEP ✅
- @rpgjs/client (game rendering)
- @rpgjs/common (shared utilities)
- Procedural generators (ECS, content generation)
- Tiled maps
- Next.js (web framework)

### REMOVE ❌
- @rpgjs/server (not needed for single-player)
- socket.io-client (no multiplayer)
- Express server code
- Separate server process

## Implementation Plan

1. Configure RPG-JS for standalone mode
2. Create game page in Next.js
3. Wire seed from landing page to game
4. Integrate procedural generators with RPG-JS client
5. Build and deploy as static site

## Conclusion

**The user was right to question the architecture!**

For a **single-player 16-bit RPG** (Diablo/FF7 style):
- ✅ RPG-JS standalone mode is perfect
- ✅ Next.js provides modern web framework
- ✅ NO client/server split needed
- ✅ Simpler, cleaner architecture
- ✅ Easy to deploy

**We don't need multiplayer infrastructure for a single-player game.**
