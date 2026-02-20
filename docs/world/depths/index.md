---
title: The Depths
type: dungeon
act: I-III
levels: 5
tileSize: [20, 25]
palette: dungeon-depths
encounters:
  enemies: [E-DP-01, E-DP-02, E-DP-03, E-DP-04, E-DP-05]
  levelRange: [4, 27]
connections:
  surface:
    - everwick -> level-1 (MQ-05+)
    - shimmer-marsh -> level-2 (MQ-05+)
    - hollow-ridge -> level-3 (MQ-05+)
    - resonance-fields -> level-4 (Singing Stones puzzle)
    - half-drawn-forest -> level-5 (MQ-08+)
  fortress:
    - level-5 -> preserver-fortress (GQ-03-F2 shortcut)
---

# The Depths

A layered underground dungeon system beneath the game world's surface. Accessed via entrances scattered across all surface zones, the Depths contain the densest dissolved memory deposits -- remnants of civilizations that chose to dissolve their collective memories into the earth. Each floor is a self-contained 20x25 tile map.

Unlike surface zones, the Depths have **fixed vibrancy per floor** that does not change with player broadcasts. Broadcasting in dungeons still works for puzzles and combat buffs but does not raise the floor's base vibrancy.

## Levels

| Level | Name | Surface Entrance | Vibrancy | Difficulty | Boss |
|-------|------|-----------------|----------|------------|------|
| [Level 1](level-1.md) | Memory Cellar | Everwick (8, 17) | 25 (Muted) | Low (4-8) | None (tutorial) |
| [Level 2](level-2.md) | Drowned Archive | Shimmer Marsh (33, 43) | 35 (Normal) | Mid (12-16) | The Archivist |
| [Level 3](level-3.md) | Resonant Caverns | Hollow Ridge (38, 3) | 40 (Normal) | Mid-High (15-18) | The Resonant King |
| [Level 4](level-4.md) | The Songline | Resonance Fields (28, 44) | 45 (Normal) | High (18-22) | The Conductor |
| [Level 5](level-5.md) | The Deepest Memory | Half-Drawn Forest (13, 36) | 30 (Muted) | Very High (22-27) | The First Dreamer |

## Dungeon Design Principles

- **Each floor is a self-contained map** (20 tiles wide x 25 tiles tall)
- **Floors connect via stairways** (descent events) and **memory lifts** (fast-travel back to surface after clearing a floor)
- **Enemies scale 1.3x-1.9x** of surface-zone equivalents
- **Each floor has a Dissolved Memory Cache** -- a mandatory encounter/puzzle yielding high-potency fragments
- **Boss encounters guard floors 2-5**
- **No random encounters in corridors narrower than 3 tiles** (prevents unfair ambush in tight spaces)

## Tileset Palettes

| Floor | Tileset Name | Visual Theme |
|-------|-------------|--------------|
| Level 1 | `depths_cellar` | Warm stone, amber lantern glow, brown wood |
| Level 2 | `depths_archive` | Blue-green water, dark stone, glowing ink |
| Level 3 | `depths_cavern` | Purple crystal, grey stone, prismatic refractions |
| Level 4 | `depths_songline` | Gold light corridors, translucent walls, star-motes |
| Level 5 | `depths_abyss` | Shifting hues, non-euclidean geometry, cosmic void |

## Quest Threading

The burdened Resonance Stone quest **GQ-02-S1 (The Composting)** threads through Levels 2, 3, and 4, requiring the player to broadcast sorrow-type fragments at three burdened stones across three different floors.

## Map Layers

All dungeon maps use the same 6-layer structure as surface maps:

| Layer | Purpose |
|-------|---------|
| `ground` | Base floor tiles (stone, water, crystal, void) |
| `ground2` | Floor detail overlays (cracks, moss, runes, puddles) |
| `objects` | Walls, pillars, furniture, chests, Resonance Stones |
| `objects_upper` | Ceiling elements, hanging formations, overhead bridges |
| `collision` | Impassable tiles (walls, deep water, sealed doors) |
| `events` | Touch/action/auto/parallel event triggers |

## Cross-References

- Detailed room layouts: [docs/maps/dungeon-depths.md](../../maps/dungeon-depths.md)
- Enemy catalog: [docs/design/enemies-catalog.md](../../design/enemies-catalog.md)
- Quest chains: [docs/story/quest-chains.md](../../story/quest-chains.md)
- Geography overview: [docs/world/geography.md](../geography.md)
