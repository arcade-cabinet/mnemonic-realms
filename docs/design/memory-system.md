# Memory System: Core Mechanic

## Overview

Memory is the game's central resource, progression system, and narrative device. It replaces or augments traditional JRPG systems (XP, crafting, side quests) with a unified mechanic that ties directly into the world's theme.

## Memory Fragments

Memory fragments are collectible items that the player gathers from the world. Each fragment has:

- **Source**: Where it came from (NPC, environment, enemy, dissolved civilization)
- **Emotion**: Joy, sorrow, awe, fury, or calm
- **Element**: Fire, water, earth, wind, light, dark, or neutral
- **Potency**: 1-5 stars, representing the memory's power

### How to Collect Fragments

| Source | Method | Typical Potency |
|--------|--------|-----------------|
| NPCs | Complete quests, deepen relationships | 2-3 stars |
| Environment | Interact with Resonance Stones, explore new areas | 1-2 stars |
| Enemies | Drop on defeat (boss = guaranteed) | 2-4 stars |
| Dissolved | Found in memory dungeons, deep exploration | 3-5 stars |
| Remixed | Created by combining existing fragments | Varies |

## The Three Operations

### 1. Collect

Gathering fragments from the world. This is passive progression — it happens naturally as the player explores, fights, and talks to NPCs. The game tracks total fragments collected as a measure of engagement.

### 2. Remix

Combining fragments to create new, more powerful ones. This is the game's crafting system.

**Rules**:
- Combine 2-3 fragments of the same emotion → stronger version of that emotion
- Combine fragments of different emotions → new compound emotion (joy + fury = inspiration, sorrow + awe = reverence)
- Element combinations follow intuitive logic (fire + wind = stronger fire, fire + water = steam/neutral)
- Potency of output = average of inputs + 1 (capped at 5)

**Remix is permanent**: input fragments are consumed. This creates meaningful choices — do you remix for power now, or save fragments for a specific combination later?

### 3. Broadcast

Sharing fragments with the world to cause changes. This is the primary way the player advances the story and evolves the game world.

**Broadcast targets**:

| Target | Effect |
|--------|--------|
| NPC | Evolves their dialogue, unlocks new quests, deepens relationship |
| Location | Adds detail and vibrancy, can unlock new paths or areas |
| Stagnation Zone | Pushes back the freeze, liberates frozen NPCs/areas |
| Dormant God | Contributes to their recall — emotion type influences what form they take |
| Self (Class) | Class-specific benefits (see classes.md) |

## Memory and World Brightening

The game tracks per-zone vibrancy scores (0-100) based on memories broadcast into each area. As a zone's vibrancy increases:

- **Visual**: Colors become more saturated, particle effects appear, lighting warms
- **Audio**: Background music adds layers/instruments, ambient sounds become richer
- **Gameplay**: New NPCs appear, shops stock better items, new side quests unlock

This creates a feedback loop: engage with the world → collect memories → broadcast memories → world becomes richer → more to engage with.

## Memory and the Preservers

The Preservers' stagnation zones are anti-memory. Broadcasting fragments into a stagnation zone is the only way to break it, but:

- Low-potency fragments have minimal effect
- The Preservers reinforce zones over time if not fully broken
- Breaking a major zone requires specific emotion/element combinations (puzzle element)

This gives memory collection strategic importance beyond power leveling.

## Fragment Scale

A full playthrough generates **40-60 fragments**, with quality over quantity. Each fragment should feel like a meaningful pickup — not inventory noise. At this scale:

- Remix operations: ~15-20 per playthrough (2-3 inputs → 1 output)
- UI: visual collection grid (not a scrolling list)
- Strategic weight: every fragment matters, no "junk" fragments

## Vibrancy Tracking

Vibrancy is tracked **per-zone, not globally**. Each zone has its own 0-100 vibrancy score. Broadcasting into a specific area brightens *that* area — the player sees direct cause and effect.

- **Muted** (0-33): Soft pastels, sparse audio, limited NPC activity
- **Normal** (34-66): Full natural colors, standard audio, active NPCs
- **Vivid** (67-100): Saturated/luminous, full orchestration, evolved NPCs and side quests

The sky/ambient layer uses an **average of all visited zones** as a soft global indicator.

## Integration with Existing Systems

Memory doesn't replace XP, gold, or items. It layers on top:

- **XP**: Still earned from combat. Levels still gate stat growth and skill learning.
- **Gold**: Still earned from combat and quests. Shops still sell items for gold.
- **Items**: Still dropped and crafted. Memory fragments are a separate inventory category.
- **Memory**: The additional progression layer that drives world evolution and narrative.

This means players who don't engage deeply with the memory system can still complete the game through traditional JRPG grinding. But players who engage with memory collection, remixing, and broadcasting get a richer, more vibrant world with more content.
