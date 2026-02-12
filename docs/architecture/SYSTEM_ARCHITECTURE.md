---
title: "Mnemonic Realms: System Architecture"
version: 1.0.0
date: 2026-02-12
authors: ["copilot"]
status: "Active"
tags: ["architecture", "technical", "ecs", "rpgjs", "nextjs"]
---

# System Architecture

## High-Level Overview

```
┌─────────────────────────────────────────────────────────────┐
│                     Next.js Application                      │
├─────────────────────────────────────────────────────────────┤
│  Landing Page → API Routes → Game Page → RPG-JS Client      │
│       ↓              ↓            ↓              ↓           │
│   Seed Input    Preview API   Game Launch   Game Render     │
└─────────────────────────────────────────────────────────────┘
                              │
                              ↓
┌─────────────────────────────────────────────────────────────┐
│              Procedural Generation Layer (ECS)               │
├─────────────────────────────────────────────────────────────┤
│  ProceduralWorld → Systems → Components → Generators         │
└─────────────────────────────────────────────────────────────┘
                              │
                              ↓
┌─────────────────────────────────────────────────────────────┐
│                      RPG-JS Game Engine                      │
├─────────────────────────────────────────────────────────────┤
│  Map Rendering → Physics → Events → Inventory → Combat      │
└─────────────────────────────────────────────────────────────┘
```

## Stack Decisions

### Why Next.js + RPG-JS Standalone?

**Initial Misunderstanding**: Assumed multiplayer MMORPG architecture
- Separate client/server processes
- Socket.io networking
- Complex deployment

**Correction**: Single-player 16-bit RPG (Diablo/FF7 style)
- RPG-JS standalone mode (`RPG_TYPE=rpg`)
- Runs 100% in browser
- No server process needed

**Benefits**:
- ✅ Simpler architecture (one codebase)
- ✅ Lower costs (no server infrastructure)
- ✅ Easier deployment (static site)
- ✅ Better performance (no network latency)

### Technology Choices

| Component | Technology | Why? |
|-----------|-----------|------|
| **Web Framework** | Next.js 15 | SSR, API routes, modern DX |
| **Game Engine** | RPG-JS v4.3.0 | Browser-based, Tiled support, proven |
| **UI Library** | React 19 | Component-based, rich ecosystem |
| **Styling** | TailwindCSS | Utility-first, responsive |
| **ECS** | ecsy | Lightweight, flexible, data-oriented |
| **RNG** | seedrandom | Deterministic, reproducible |
| **Language** | TypeScript | Type safety, IDE support |
| **Linting** | Biome 2.3 | Fast, modern, replaces ESLint+Prettier |
| **Package Manager** | pnpm | Fast, efficient, space-saving |

## Architecture Layers

### 1. Presentation Layer (Next.js)

#### Routes
```
app/
├── page.tsx                    # Landing page with seed input
├── play/page.tsx              # Game page (RPG-JS renders here)
├── api/generate/route.ts      # Preview API for content generation
└── layout.tsx                 # Root layout
```

#### Components
```
components/
├── SeedInput.tsx              # Three-word seed input with validation
├── GeneratedContent.tsx       # Preview of generated content
├── GameCanvas.tsx             # RPG-JS game container
└── UI/
    ├── CharacterSheet.tsx
    ├── Inventory.tsx
    ├── MiniMap.tsx
    └── HUD.tsx
```

### 2. Procedural Generation Layer (ECS)

#### Entity Component System

```typescript
// World Manager
ProceduralWorld
  ├── createCharacter(seed: string): entityId
  ├── createTerrain(seed: string, x: number, y: number): entityId
  ├── createNPC(seed: string): entityId
  ├── createItem(seed: string, type: string): entityId
  └── exportEntity(entityId: number): object
```

#### Components (17 total)
```typescript
// Identity Components
- Name: { value: string }
- Description: { value: string }
- Seed: { value: string }

// Character Components
- Alignment: { type: 'light' | 'dark' | 'neutral' }
- Personality: { traits: string[] }
- Dialogue: { greeting: string, questHook: string }
- Backstory: { text: string }
- CharacterClass: { name: string, primaryStat: string }
- SkillMastery: { skills: { name: string, level: number }[] }

// World Components
- Terrain: { type: string, resources: string[], hazards: string[] }
- Location: { x: number, y: number, region: string }
- Room: { type: string, layout: string, contents: string[] }

// Item Components
- Item: { name: string, type: string, rarity: string }
- Loot: { gold: number, items: Item[] }

// Archetype Components (for data pool indexing)
- NameArchetype: { syllableSet: number }
- DialogueArchetype: { greetingStyle: number, questType: number }
- TerrainArchetype: { biomeConfig: number }
- RoomArchetype: { layoutType: number }
```

#### Systems (5 total)
```typescript
1. NameGenerationSystem
   - Reads: Seed, NameArchetype
   - Writes: Name
   - Logic: Generates names from syllable pools

2. DialogueGenerationSystem
   - Reads: Seed, Personality, DialogueArchetype
   - Writes: Dialogue
   - Logic: Creates personality-based dialogue

3. BackstoryGenerationSystem
   - Reads: Seed, Alignment, CharacterClass
   - Writes: Backstory
   - Logic: Generates character histories

4. ClassGenerationSystem
   - Reads: Seed, Alignment
   - Writes: CharacterClass, SkillMastery
   - Logic: Creates classes with skills

5. DescriptionGenerationSystem
   - Reads: Seed, all other components
   - Writes: Description
   - Logic: Synthesizes component data
```

#### Generators (8 specialized)
```typescript
1. NameGenerator - Character/place/item names
2. DialogueGenerator - NPC conversations
3. MicrostoryGenerator - Quest/backstory text
4. ClassGenerator - Character classes + skills
5. TerrainGenerator - Biome generation
6. RoomGenerator - Dungeon room layouts
7. NPCGenerator - Complete NPC entities
8. LootGenerator - Item drops and treasure
```

### 3. Game Engine Layer (RPG-JS)

#### Standalone Mode Configuration
```bash
RPG_TYPE=rpg
```

This tells RPG-JS to:
- Run entirely in browser (no server)
- Disable multiplayer networking
- Use local storage for saves
- Handle all game logic client-side

#### Game Module Structure
```
rpgjs/
├── modules/
│   └── main/
│       ├── index.ts           # Module registration
│       ├── player.ts          # Player entity
│       ├── events/            # Map events (NPCs, chests, etc.)
│       ├── database/          # Items, skills, classes
│       └── maps/              # Procedurally generated maps
```

#### Integration Points

```typescript
// Map Generation
ProceduralMapGenerator.generateTiledMap(seed, width, height)
  ↓
Tiled JSON Format
  ↓
RPG-JS Map Loader
  ↓
Rendered Game Map

// NPC Spawning
NPCGenerator.generateNPC(seed)
  ↓
NPC Entity (name, dialogue, class)
  ↓
RPG-JS Event System
  ↓
Interactive NPC in game

// Loot Generation
LootGenerator.generateLoot(level, seed)
  ↓
Item entities with stats
  ↓
RPG-JS Item Database
  ↓
Droppable/equippable items
```

## Data Flow

### 1. Seed Input → Preview
```
User enters "dark ancient forest"
  ↓
Next.js form submission
  ↓
API route: /api/generate
  ↓
ProceduralWorld.createCharacter(seed)
  ↓
Systems generate components
  ↓
JSON response with preview data
  ↓
React component renders preview
```

### 2. Play Game → World Generation
```
User clicks "Play Game"
  ↓
Navigate to /play?seed=dark+ancient+forest
  ↓
RPG-JS initializes in browser
  ↓
Game reads seed from URL params
  ↓
ProceduralMapGenerator creates starting map
  ↓
NPCGenerator populates map with characters
  ↓
Player spawns with procedural class/stats
  ↓
Game loop starts (60 FPS)
```

### 3. Deterministic Generation
```
Seed "dark ancient forest" → seedrandom
  ↓
Hash to integers:
  - First word: 0x4D2F (name archetype index)
  - Second word: 0x7A81 (dialogue archetype index)
  - Third word: 0x3B19 (terrain archetype index)
  ↓
Archetype components added to entity
  ↓
Systems read archetype indices
  ↓
Data pools accessed at specific indices
  ↓
Same seed → same indices → same output
```

## Deployment Architecture

### Development
```
pnpm dev
  ↓
Next.js dev server on localhost:3000
  ↓
Hot reload for instant feedback
  ↓
RPG-JS runs in browser
```

### Production
```
pnpm build
  ↓
Next.js static export
  ↓
Deploy to Vercel/Netlify
  ↓
CDN distribution
  ↓
Global low-latency access
```

### Build Artifacts
```
.next/
├── static/
│   ├── chunks/              # JavaScript bundles
│   ├── css/                 # Stylesheets
│   └── media/               # Images, fonts
├── server/                  # API routes
└── cache/                   # Build cache
```

## Performance Considerations

### Bundle Size
- Next.js code splitting (automatic)
- Dynamic imports for RPG-JS (load on /play)
- Tree shaking unused code
- Target: <200KB initial JS bundle

### Memory Management
- ECS world cleanup after generation
- Entity pooling for frequent creation/destruction
- Dispose unused textures in RPG-JS
- Target: <100MB memory usage

### Rendering
- 60 FPS gameplay target
- PixiJS WebGL rendering (RPG-JS uses this)
- Sprite atlases for efficient rendering
- Viewport culling (only render visible area)

## Security Considerations

### Client-Side Only
- No server = reduced attack surface
- No database = no SQL injection
- No user accounts = no credential theft

### Input Validation
- Seed format validation (3 words only)
- Sanitize seed text (no XSS)
- Rate limiting on API routes

### Save Data
- Local storage only (browser-based)
- No sensitive data stored
- Export/import for backup

## Scalability

### Horizontal Scaling
Not applicable (client-side game)

### Content Scalability
- Millions of unique seeds possible
- Deterministic = no database needed
- Archetype system allows adding new content pools

### Performance Scaling
- Client hardware determines performance
- WebGL for GPU acceleration
- Web Workers for background generation (future)

## Monitoring & Analytics (Future)

### Client-Side Events
- Seed usage statistics
- Session length tracking
- Popular seeds identification
- Performance metrics (FPS, load time)

### Error Tracking
- Sentry for runtime errors
- Console error capture
- Save data corruption detection

## Dependencies

### Production Dependencies
```json
{
  "next": "^15.2.4",
  "react": "^19.0.0",
  "react-dom": "^19.0.0",
  "@rpgjs/client": "^4.3.0",
  "@rpgjs/common": "^4.3.0",
  "@rpgjs/tiled": "^4.3.0",
  "ecsy": "^0.4.3",
  "seedrandom": "^3.0.5"
}
```

### Development Dependencies
```json
{
  "typescript": "^5.9.3",
  "@biomejs/biome": "~2.3.15",
  "tailwindcss": "^4.1.6",
  "@types/node": "^25.2.3",
  "@types/seedrandom": "^3.0.8"
}
```

## Future Enhancements

### Near-Term (3-6 months)
- Web Workers for background generation
- Service Worker for offline play
- IndexedDB for complex save data
- WebGL shader effects

### Long-Term (6-12 months)
- Multiplayer co-op (optional)
- Mobile responsive controls
- Progressive Web App (PWA)
- User-generated content tools

## Conclusion

The architecture balances simplicity with power:
- **Simple**: Single-page app, no backend complexity
- **Powerful**: Full RPG game engine + procedural generation
- **Scalable**: Infinite content from deterministic seeds
- **Performant**: Browser-native, GPU-accelerated
- **Maintainable**: TypeScript, modern tooling, clear separation

Next.js provides the web framework, RPG-JS provides the game engine, and our ECS procedural generators provide the infinite content. Together, they create **Mnemonic Realms**.

---

*Related: See `/docs/design/` for gameplay systems and `/docs/vision/` for product vision*
