---
id: garden
size: [8, 8]
palette: village-premium
parameterized: true
params:
  variant: [memorial, flower-patch, herb, shrine]
  width: 6-14
  height: 6-14
  border: boolean
  resonanceStones: array | null
  centerFeature: { objectRef: string } | null
  flowerDensity: 0.0-1.0
  caretaker: { id, sprite, dialogue } | null
---
# Garden

A cultivated green space serving a specific purpose within a settlement. Gardens are where the vibrancy system is most visible -- flower density, bloom color, and growth state all respond to the player's memory fragment collection progress.

## Variants

### Memorial
Formal arrangement with a central brick path flanked by flower beds. Resonance stones are placed along the path at deliberate intervals. A cobblestone border frames the garden. The Memorial Garden in Everwick (Act 1, Scene 2) is the first place the player collects memory fragments.

Ground: `terrain:road.brick` (border + path), `terrain:ground.grass` (flower beds)
Detail: `terrain:tallgrass.flower` scattered at configured density, `terrain:ground.light-grass` between flowers

### Flower Patch
Informal wildflower cluster with an organic elliptical shape. No border, no paths -- just a riot of color in an open field. Flower patches appear spontaneously around settlements as vibrancy increases.

Ground: `terrain:ground.grass` within the ellipse, 0 (transparent) outside
Detail: Flowers scattered at high density within the ellipse

### Herb
Utilitarian herb rows with dirt walking paths between them. Organized in 3-tile-high strips separated by 1-tile dirt paths. Each strip uses different herb terrain. Near workshops and apothecaries.

Ground: Alternating `terrain:ground.dark-grass` (herb rows) and `terrain:ground.dirt` (paths)
Border: Optional cobblestone frame

### Shrine
Sacred garden around a central object with radiating paths. A circular cobblestone path surrounds the inner sanctum, with radial paths at cardinal directions. Flower beds fill the wedges between paths.

Ground: `terrain:road.brick` (paths), `terrain:ground.stone` (center platform), `terrain:ground.grass` (beds)
Detail: Flowers at configured density in the bed areas

## Collision
- Border tiles (when present): 1
- All other tiles: 0 (gardens are fully walkable)

## Visuals
- Center feature (fountain, statue, ancient tree) at garden midpoint
- Bush decorations at corners

## Objects
- **Resonance stones**: triggers at specified positions
- **Caretaker NPC**: positioned near the entrance

## Anchors
- **entrance**: (center_x, height-1) -- south entry
- **north**: (center_x, 0)

## Notes

- The existing TypeScript factory in `gen/assemblage/assemblages/terrain/garden.ts` implements all four variants with identical patterns.
- The `terrain:tallgrass.flower` reference maps to `Tileset_TallGrass` Wang set "Flower Grass" color.
- Memorial gardens are story-critical locations. The three resonance stones in Everwick's Memorial Garden (RS-EW-01, RS-EW-02, RS-EW-03) each unlock a memory fragment that advances the vibrancy system.
- The `Animation_Flowers` TSX provides animated flower overlays that can supplement the terrain layer for vibrancy-gated bloom effects.
