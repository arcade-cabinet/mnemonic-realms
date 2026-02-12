# RPG-JS + Next.js Integration Evaluation

## Question: Can we use RPG-JS in Next.js without separate client/server?

**Short Answer: NO - but Next.js can HOST both, making development simpler**

## Understanding RPG-JS Architecture

### RPG-JS Components (MUST KEEP BOTH)

1. **@rpgjs/server** - Game server
   - Runs multiplayer game logic
   - Manages Socket.io connections
   - Handles player state, maps, NPCs
   - MUST run as Node.js server process

2. **@rpgjs/client** - Browser client
   - Renders game with PixiJS
   - Handles player input
   - Connects to server via Socket.io
   - Runs in browser

### Why You Can't Eliminate Client/Server Split

RPG-JS is a **multiplayer game engine**. The architecture requires:
- **Server**: Authoritative game state (prevents cheating)
- **Client**: Visual rendering and input
- **Socket.io**: Real-time bidirectional communication

This is fundamental to multiplayer games. You cannot merge them.

## What Next.js CAN Do

### ✅ Benefits of Adding Next.js

Next.js provides **web application framework** around the game:

```
Next.js App
├── Landing page (/)
├── Game lobby (/lobby)
├── Play page (/play) ← Embeds RPG-JS client
├── API routes (/api/*)
└── RPG-JS Server (custom server)
```

### Architecture Options

#### Option 1: Next.js with Separate RPG-JS Server (RECOMMENDED)
```
Port 3000: Next.js App (pages, API routes, SSR)
Port 3001: RPG-JS Game Server (Socket.io)
```

**Pros:**
- Clear separation of concerns
- Easy to scale game server independently
- Next.js handles web pages, RPG-JS handles game

**Implementation:**
```typescript
// app/play/page.tsx (Next.js page)
'use client';
import { useEffect } from 'react';

export default function PlayPage({ searchParams }) {
  const seed = searchParams.seed;
  
  useEffect(() => {
    // Load RPG-JS client
    import('@rpgjs/client').then(({ entryPoint }) => {
      import('socket.io-client').then(({ default: io }) => {
        entryPoint(modules, {
          io,
          serverUrl: 'http://localhost:3001', // RPG-JS server
          globalConfig: {
            seed, // Pass seed to game
          },
        }).start();
      });
    });
  }, [seed]);

  return <div id="rpg-canvas" />;
}
```

```typescript
// server/rpgjs-server.ts (Separate process)
import { expressServer } from '@rpgjs/server/express';
import modules from './modules';

expressServer(modules, {
  port: 3001,
  basePath: __dirname,
});
```

#### Option 2: Next.js Custom Server with RPG-JS (POSSIBLE but COMPLEX)
```
Port 3000: Next.js + RPG-JS Server (same process)
```

**Pros:**
- Single port
- Unified deployment

**Cons:**
- Violates Next.js best practices
- Harder to deploy on Vercel
- Couples web framework with game server

**Implementation:**
```typescript
// server.ts (Custom Next.js server)
import { createServer } from 'http';
import { parse } from 'url';
import next from 'next';
import { Server } from 'socket.io';
import { RpgServer } from '@rpgjs/server';

const dev = process.env.NODE_ENV !== 'production';
const app = next({ dev });
const handle = app.getRequestHandler();

app.prepare().then(() => {
  const server = createServer((req, res) => {
    const parsedUrl = parse(req.url!, true);
    handle(req, res, parsedUrl);
  });

  const io = new Server(server);
  
  // Initialize RPG-JS server with Socket.io
  const rpgServer = new RpgServer(modules, { io });
  
  server.listen(3000, () => {
    console.log('> Ready on http://localhost:3000');
  });
});
```

## Recommendation

### ✅ Use Option 1: Separate Servers

**Structure:**
```
mnemonic-realms/
├── app/                    # Next.js app
│   ├── page.tsx           # Landing page
│   ├── play/page.tsx      # Game page (embeds RPG-JS client)
│   └── api/               # API routes (leaderboards, etc.)
├── lib/                    # Shared code
│   ├── ecs/               # ECS generators
│   ├── generators/        # Procedural generators
│   └── utils/             # Utilities
├── src/                    # RPG-JS game (KEEP THIS)
│   ├── modules/           # RPG-JS modules
│   ├── maps/              # Game maps
│   └── server.ts          # RPG-JS server entry
├── package.json
└── README.md
```

**Scripts:**
```json
{
  "scripts": {
    "dev": "concurrently \"next dev\" \"tsx src/server.ts\"",
    "build": "next build && tsc --project tsconfig.rpgjs.json",
    "start": "concurrently \"next start\" \"node dist/server.js\""
  }
}
```

## Answer to Original Question

**"Can we avoid the need for a client and server?"**

**NO** - RPG-JS fundamentally requires:
- Server process for game logic
- Client code for browser rendering

**BUT** - Next.js simplifies the overall architecture by:
- ✅ Providing web framework for pages/routing
- ✅ Serving the RPG-JS client automatically
- ✅ Offering API routes for non-game features
- ✅ Better developer experience (hot reload, file routing)

**You still need both @rpgjs/server and @rpgjs/client**

## What Changes vs Pure RPG-JS

### Before (Pure RPG-JS + Express):
```
src/server.ts  → Express server + RPG-JS
src/client.ts  → Browser entry point
public/index.html → Static HTML
```

### After (Next.js + RPG-JS):
```
app/page.tsx   → Next.js landing page (better than static HTML)
app/play/page.tsx → Game page (loads RPG-JS client dynamically)
src/server.ts  → RPG-JS game server (SAME)
```

## Conclusion

**Keep RPG-JS** - It's the foundation of your game.

**Add Next.js** - It enhances the web application layer:
- Better routing
- Better UI components
- Better SEO
- Better developer experience

**You cannot eliminate the client/server split** - it's fundamental to multiplayer games.

**Next.js doesn't replace RPG-JS** - it complements it by handling the web application while RPG-JS handles the game.
