---
title: "Mnemonic Realms: Game Vision"
version: 1.0.0
date: 2026-02-12
authors: ["jbdevprimary", "copilot"]
status: "Active"
tags: ["vision", "game-design", "procedural-generation"]
---

# Mnemonic Realms: Game Vision

## Executive Summary

**Mnemonic Realms** is a single-player, browser-based, 16-bit style procedural RPG inspired by classics like Diablo and Final Fantasy VII. Every world is deterministically generated from a three-word seed phrase, ensuring that identical seeds always produce identical worlds—making every adventure reproducible and shareable.

## Core Concept

### The Seed Philosophy

Players enter a three-word seed following the format: **"adjective adjective noun"**

Examples:
- `"dark ancient forest"`
- `"bright holy temple"`
- `"mystic forgotten dungeon"`
- `"cursed eternal wasteland"`

This seed becomes the DNA of an entire world:
- Character names and classes
- Terrain layouts and biomes
- NPC personalities and dialogue
- Item stats and loot tables
- Quest structures and storylines

### What Makes It Unique

**Reproducibility**: Share your seed with friends to explore the exact same world
**Memorability**: Three words are easy to remember and share
**Infinite Variety**: Millions of possible unique worlds
**Determinism**: No random chance—same seed, same experience every time
**Speedrunning**: Compete for fastest completion times on specific seeds

## Visual Style

### 16-Bit Aesthetic

Inspired by SNES-era RPGs:
- **Pixel art** characters and environments
- **Isometric or top-down** perspective like Diablo or FF7 overworld
- **Vibrant color palettes** that evoke nostalgia
- **Smooth animations** for modern feel with retro look

### Reference Games

- **Diablo (1996)** - Isometric dungeon crawler feel
- **Final Fantasy VII (1997)** - Character design and world variety
- **Chrono Trigger (1995)** - Combat system inspiration
- **Secret of Mana (1993)** - Art style and environment design

## Gameplay Vision

### Core Loop

1. **Enter Seed** → Choose your world
2. **Explore** → Discover procedurally generated terrain
3. **Battle** → Fight enemies with class-based abilities
4. **Loot** → Collect procedurally generated items
5. **Progress** → Level up and unlock new areas
6. **Complete** → Finish seed-specific quest chains
7. **Share** → Give seed to others or try new ones

### Game Systems

#### Alignment System
- **Light** - Clerics, Paladins, Holy magic
- **Dark** - Shadow Assassins, Necromancers, Dark magic
- **Neutral** - Bards, Rangers, Balanced abilities

Seeds with "bright", "holy", "radiant" keywords create Light worlds
Seeds with "dark", "shadow", "cursed" keywords create Dark worlds
Seeds with "mystic", "forgotten", "ancient" keywords create Neutral worlds

#### Class System
Procedurally generated classes based on seed:
- Primary stat (Strength, Intelligence, Dexterity, etc.)
- Special abilities (3-5 unique skills)
- Skill mastery progression
- Alignment-based restrictions

#### Terrain & Exploration
8 biome types:
- **Plains** - Grasslands with scattered trees
- **Forest** - Dense woodland areas
- **Mountain** - Rocky peaks and caves
- **Desert** - Sandy dunes and oases
- **Swamp** - Murky wetlands with hazards
- **Tundra** - Frozen ice fields
- **Volcano** - Lava flows and fire hazards
- **Ocean** - Coastal areas and islands

#### Combat System
- Real-time action combat (Diablo-style)
- Class-based abilities with cooldowns
- Dodge/roll mechanics
- Status effects (poison, burn, freeze, etc.)
- Boss encounters at key locations

#### Loot System
Procedural item generation:
- Rarity tiers (Common, Uncommon, Rare, Epic, Legendary)
- Seed-based stat distributions
- Unique items specific to each seed
- Treasure chests and boss drops

### Progression

#### Character Advancement
- Level 1-50 progression
- Skill points to unlock/upgrade abilities
- Stat allocation (Strength, Dex, Int, Vit, etc.)
- Equipment slots (Weapon, Armor, Accessories)

#### World Progression
Seeds generate increasing difficulty:
- Early areas (levels 1-15)
- Mid areas (levels 16-30)
- Late areas (levels 31-45)
- End-game areas (levels 46-50)

## Technical Vision

### Browser-Based
- No installation required
- Play anywhere with internet
- Instant access
- Cross-platform compatibility

### RPG-JS Framework
- Proven game engine for browser RPGs
- Tiled map editor support
- Sprite animation system
- Event/dialogue system

### Next.js + Modern Web Stack
- Fast page loads with SSR
- API routes for content generation
- Modern development experience
- Easy deployment

## Player Experience

### Onboarding
1. Landing page with seed input
2. Optional "Random Seed" button
3. Preview generated content (character, location)
4. "Play Game" launches into world

### In-Game Interface
- **Main viewport**: Isometric game view (16-bit style)
- **HUD**: Health, mana, experience bar
- **Minimap**: Current area overview
- **Inventory**: Grid-based item management
- **Character sheet**: Stats and abilities
- **Quest log**: Current objectives

### Save System
- Seed stored in localStorage
- Progress saved automatically
- Export save data for backup
- Import save data to continue

## Monetization (Future)

Free to play with optional:
- **Cosmetic skins** for characters
- **Seed premium** - curated "legendary" seeds
- **Custom sprite packs** for visual variety

No pay-to-win mechanics—all gameplay content free.

## Success Metrics

### Player Engagement
- Average session length: 30-60 minutes
- Return rate: 40%+ within 7 days
- Seed sharing: 20%+ of players share seeds

### Content Variety
- 1,000,000+ unique seeds explored
- Community discovering "legendary seeds"
- Speedrun leaderboards for popular seeds

### Technical Performance
- Load time: <3 seconds
- 60 FPS gameplay
- 99.9% uptime
- Mobile-friendly (future)

## Development Phases

### Phase 1: Foundation (Current)
- ✅ Procedural generators (ECS-based)
- ✅ Seed system implementation
- ✅ RPG-JS integration planning
- ✅ Next.js framework setup

### Phase 2: Core Gameplay
- 🔄 Player character with movement
- 🔄 Basic combat system
- 🔄 First playable map from seed
- 🔄 Inventory and equipment

### Phase 3: Content Expansion
- 📋 All 8 biomes implemented
- 📋 NPC interactions and dialogue
- 📋 Quest system
- 📋 Loot drops and progression

### Phase 4: Polish & Release
- 📋 UI/UX refinement
- 📋 Sound effects and music
- 📋 Tutorial system
- 📋 Public beta launch

### Phase 5: Post-Launch
- 📋 Community features (leaderboards, seed sharing)
- 📋 Mobile version
- 📋 Additional content updates
- 📋 Player-created content tools

## Community & Longevity

### Seed Community
- Players share favorite seeds
- Community curates "must-play" seeds
- Wiki documenting interesting seeds
- Speedrun competitions

### Content Longevity
Procedural generation ensures:
- Infinite replayability
- No content shortage
- Self-sustaining discovery
- Community-driven exploration

## Conclusion

**Mnemonic Realms** combines nostalgia for 16-bit RPGs with modern procedural generation technology. Every seed is a unique adventure waiting to be discovered, explored, and shared. The three-word seed system makes worlds memorable and shareable, fostering a community of explorers seeking the perfect realm.

**Mission**: Create a browser-based RPG that brings back the magic of classic 16-bit adventures while leveraging modern web technology and procedural generation to offer infinite variety and reproducible experiences.

---

*Next Steps: See `/docs/architecture/` for technical implementation details*
