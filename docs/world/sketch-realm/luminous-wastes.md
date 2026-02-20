---
id: luminous-wastes
type: overworld
biome: sketch-plains
size: [80, 80]
vibrancy: 5
palette: desert-sketch
music: bgm-luminous-wastes
---

# Luminous Wastes

A vast, flat expanse of luminous nothing. The ground is a soft glow with faint grid lines -- like graph paper made of light. Occasional sketch-outlines of objects dot the landscape: a fence post, a well, a tree -- all incomplete.

Starting vibrancy 5 (Muted tier, near-zero).

> Cross-references: [Act III script](../../story/act3-script.md)

## Key Areas

| Area | Position | Size | Description |
|------|----------|------|-------------|
| Half-Built Village | (18, 18) | 8x8 | Sketch outlines of an entire village. Broadcasting solidifies it. |
| The Edge | (3, 18) | 3x3 | World's absolute western boundary. White void beyond. |
| Preserver Watchtower | (33, 8) | 4x4 | Crystallized tower at Sketch border. Elite Preserver agents. |
| Grid-line Plains | throughout | -- | Faint grid lines on luminous ground |

## NPCs

| NPC | Position | Movement | Graphic | Linked Quests |
|-----|----------|----------|---------|---------------|
| Preserver Archivist | (34, 9) | Static at watchtower | `npc_preserver_elite` | -- |
| (Solidified Village NPCs) | (18-25, 18-25) | Appear after broadcasting into Half-Built Village | various | -- (lore) |

## Events

| Event ID | Position | Type | Trigger | Linked Quest | Description |
|----------|----------|------|---------|--------------|-------------|
| EV-LW-001 | (20, 20) | action | MQ-08 | MQ-08 | Half-Built Village: broadcast to solidify (3 broadcasts needed) |
| EV-LW-002 | (4, 18) | action | -- | -- | The Edge: narrative beat (world still growing) |
| EV-LW-003 | (25, 0) | touch | MQ-07+ | -- | North edge -> Shimmer Marsh (25, 49) / Resonance Fields |
| EV-LW-004 | (39, 20) | touch | MQ-07+ | -- | East edge -> Resonance Fields (0, 25) |
| EV-LW-005 | (20, 0) | touch | MQ-08+ | -- | North edge -> Half-Drawn Forest (20, 39) |

## Transitions

| From | Direction | To Map | Destination Tile | Condition |
|------|-----------|--------|-----------------|-----------|
| (25, 0) | North | Shimmer Marsh | (25, 49) | After MQ-07 |
| (39, 20) | East | Resonance Fields | (0, 25) | After MQ-07 |
| (20, 0) | NE | Half-Drawn Forest | (20, 39) | After MQ-08 |

## Resonance Stones

| ID | Position | Fragments Available | Notes |
|----|----------|---------------------|-------|
| RS-LW-01 | (20, 20) | 3 fragments (various/3-4) | Half-Built Village center (after solidification) |
| RS-LW-02 | (4, 18) | 1 fragment (calm/neutral/4) | The Edge; world's boundary stone |
| RS-LW-03 | (30, 35) | 1 fragment (sorrow/neutral/3) | South plains, near transition |

## Treasure Chests

None documented in initial state. The Half-Built Village yields 3 high-potency dissolved fragments after solidification.

## Enemy Zones

| Zone | Bounds | Enemies | Level Range | Encounter Rate |
|------|--------|---------|-------------|----------------|
| Open Wastes | (5, 5) -> (35, 35) | Sketch Phantom, Void Wisp | 21-24 | Common: 1 Phantom; Standard: 1 Phantom + 1 Void Wisp |
| Watchtower Zone | (30, 5) -> (38, 14) | Preserver Archivist (elite) | 23-25 | Standard: 2 Archivists |
