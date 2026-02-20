# World Composition Architecture -- Worlds All The Way Down

There are NO "interiors" and "exteriors." There are only **WORLDS**. A shop is a world. A dungeon is a world. A fortress is a world. The outdoor game map is also a world.

Canonical types: `gen/assemblage/composer/world-ddl.ts`

## The Fractal Algebra

```
WORLD
  └── REGIONS (biome zones -- theme, weather, fills, encounters, time budget)
       ├── ANCHORS (towns, dungeons, shrines -- give a region purpose)
       │    └── WORLD SLOTS --> child WorldInstances (shops, dungeons, etc.)
       ├── CONNECTIVE TISSUE (paths, wild areas, safe zones between anchors)
       └── TIME BUDGET (play hours --> map tiles --> encounter count --> step count)
            └── TOWNS (services + NPCs + quest triggers --> composer generates layout)
```

When the player walks through a door, they transition from a region in the parent world to a region in the **child world**. Same algebra at every level:
- A dungeon is a world with floors as regions
- A shop is a world with a single region
- A market is a hub-and-spoke world

**WorldTemplates** define the SHAPE (layout, slots, connections).
**WorldInstances** fill the slots with specifics (NPCs, inventory, theme).

## Terminology

| Wrong | Right |
|-------|-------|
| Interior map | Child world |
| Exterior map | Region / outdoor world |
| Interior door | World slot transition |
| Interior generator | Child world composer |
| `interiors:` in frontmatter | `worldSlots:` |

## Time Budget and Pacing

Region dimensions derive from play time, not arbitrary tile counts:

```
playTimeMinutes --> walking time (minus combat/dialogue %)
walking time * 4 tiles/sec = totalWalkingTiles
totalWalkingTiles / 120 tiles/screen = outdoorScreens
screens --> map dimensions (capped at 200x200)
```

Difficulty affects time split:
- Easy: 20% combat, 15% dialogue, 65% exploration
- Medium: 30% combat, 15% dialogue, 55% exploration
- Hard: 40% combat, 15% dialogue, 45% exploration

### Settled Lands Example

With 5 anchors (Everwick, Heartfield, Ambergrove, Millbrook, Sunridge) on a 200x200 tile map:
- Diagonal traversal ~280 tiles = ~70 seconds of pure walking
- Average town-to-town distance ~100 tiles = ~25 seconds walking
- With encounters: ~2-3 minutes between adjacent towns

## Connective Tissue

The space between anchors is not empty grass. `ConnectiveTissueRules` defines:

| Feature | Purpose |
|---------|---------|
| `pathDensity` | How many paths connect anchors (sparse/moderate/dense) |
| `safeZoneInterval` | Roadside camps every N minutes of walk time |
| `safePathRatio` | Ratio of safe path vs wild encounter area |
| `wildFeatures` | Hidden chests, resonance stones, mini-shrines, camp spots, fishing spots |
| `barriers` | Quest/level/item gates between sub-regions |

### Fill Engine

After the composer places anchors and routes paths, the fill engine populates ALL remaining space:
1. **Base terrain** -- biome's designated ground tile
2. **Ground variants** -- clusters of terrain patches (dark-grass, light-grass, dirt)
3. **Scatter objects** -- trees, rocks, bushes, flowers with exclusion radius
4. **Path dressing** -- fences, lampposts, signposts alongside roads
5. **Edge treatment** -- forest border, cliffs, water, void at map edges

## Location File Schema

Location files in `docs/world/{region}/{location}.md` use YAML frontmatter:

```yaml
---
id: everwick
type: village
biome: village
size: [60, 60]
vibrancy: 60
palette: village-premium
worldSlots:                    # NOT "interiors:" -- these are child worlds
  - id: everwick-khali
    template: shop-single
    keeper: khali
    shopType: general
assemblages:
  - ref: house-red-small
    position: [18, 16]
    meta: {name: "Khali's Curios", worldSlot: everwick-khali}
---
```

The markdown compiler reads this hierarchy: world index -> region indexes -> location files -> produces WorldDefinition + RegionDefinition with anchors, mapLayout, NPCs, events, transitions.
