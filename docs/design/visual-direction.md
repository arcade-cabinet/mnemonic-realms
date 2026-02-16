# Visual Direction

## Core Principle: Brightening, Not Darkening

The game gets **more vivid** as the player progresses. This is the opposite of the typical RPG pattern (bright village → dark final dungeon). The world starts muted and blooms into full color.

This is both a thematic choice (memory-as-creation makes the world brighter) and a practical one: dark/shadowy pixel art becomes illegible on mobile screens and small displays.

## Color Philosophy

### What We're NOT Doing
- No grimdark. No desaturated post-apocalyptic palettes.
- No neon. Neon reads as cyberpunk, not high fantasy.
- No "dark souls brown." We want players to actually see the game.

### What We ARE Doing

**Early Game (Low Vibrancy)**:
- Soft pastels, gentle saturation
- Warm cream backgrounds, muted greens and blues
- Think: watercolor sketch, morning mist, early spring

**Mid Game (Medium Vibrancy)**:
- Full natural color palette
- Rich greens, warm golds, deep sky blues
- Think: golden hour meadow, illuminated manuscript

**Late Game (High Vibrancy)**:
- Saturated, luminous, almost stained-glass quality
- Pastel auroras in the sky, crystalline accents
- Blooming crystal groves, iridescent water
- Think: cathedral light through colored glass, Studio Ghibli backgrounds

### Key Colors

| Element | Color | Usage |
|---------|-------|-------|
| Memory energy | Warm amber / gold (#DAA520) | Particle effects, UI accents, memory fragments |
| Stagnation | Cold crystal blue-white (#B0C4DE → #E8E8E8) | Preserver zones, frozen areas |
| Joy | Sunlight yellow (#FFD700) | Healing effects, warm areas |
| Sorrow | Twilight purple (#7B68EE) | Cleansing effects, reflective spaces |
| Awe | Aurora green (#66CDAA) | Shield effects, sacred spaces |
| Fury | Forge red (#CD5C5C) | Attack buffs, volcanic areas |
| Calm | Sky blue (#87CEEB) | Neutral zones, water features |

## Sprite Style

### Player Characters
- 16-bit JRPG proportions (2-3 head-tall chibi, clear silhouette)
- Each class has a distinct color accent and silhouette readable at 32x32
- Animation: 4 directions x 3 frames walking, idle, attack, cast, hit

### NPCs
- Same proportions as player but more varied body types
- Personality readable from sprite: merchants are rounder, elders taller, warriors broader
- NPCs that have been "brightened" by memory sharing get subtle glow/particle effects

### Enemies
- Overworld enemies: natural creatures with slight memory-corruption (glowing eyes, luminous markings)
- Dungeon enemies: more abstract, formed from dense dissolved memories
- Preserver agents: crystalline humanoids, beautiful but uncanny
- Bosses: Large sprites (64x64 or 96x96), multi-part, animated

### Environment Tiles
- 32x32 base tile size (standard for RPG-JS)
- Tileset organized by biome: grassland, forest, mountain, water, village, dungeon, stagnation
- Each biome has 3 vibrancy levels (muted → normal → vivid) — tiles swap as world brightens
- Stagnation zones use a crystalline overlay shader/tile variant

## UI Design

### HUD
- Minimal: HP/SP bars, memory fragment count, mini-map
- Semi-transparent, doesn't obscure gameplay
- Memory fragment counter pulses gently when new fragment collected

### Combat UI
- Full-screen overlay with enemy display area and command menu
- Dark parchment background (#2A1810) with warm text (#D4C4A0)
- Styled as a "remembered battle" — the frame has a soft vignette

### Dialogue
- Full-width bottom panel (already implemented in dialogue.vue)
- Speaker name in bronze/amber accent
- Tap-anywhere to advance (mobile-first)
- Typewriter effect with skip-on-tap

### Menus
- Inventory, equipment, memory collection, status
- Parchment/leather aesthetic
- Clear hierarchy: big touch targets, readable text

## Particle Effects

Memory-related actions produce soft particle effects:
- **Collection**: Fragments spiral toward player as golden motes
- **Remix**: Fragments swirl together, flash, resolve into new fragment
- **Broadcast**: Expanding wave of color ripples outward from broadcast point
- **Brightening**: Slow color bloom radiates from broadcast target over several seconds

## Audio Direction

Detailed in `audio-direction.md`. The principle matches visual:
- Early game: sparse, acoustic, folk instruments
- Mid game: fuller orchestration, additional voices/layers
- Late game: full ensemble, choral elements, rich reverb
- Stagnation zones: music becomes muffled, stripped of dynamics
