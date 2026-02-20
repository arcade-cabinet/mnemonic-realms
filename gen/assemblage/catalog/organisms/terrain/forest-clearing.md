---
id: forest-clearing
size: [18, 18]
palette: village-premium
parameterized: true
params:
  diameter: 8-16
  resonanceStones: array | null
  centerObject: { objectRef: string } | null
  chest: { id: string, contents: string } | null
---
# Forest Clearing

A roughly circular opening in the dense forest canopy where sunlight pools on soft grass. Clearings are sacred spaces in the Settled Lands -- Hearthstone Circles, hidden groves, campfire gathering places, and sites where the forest seems to hold its breath. The boundary between forest and clearing is a ring of ancient trees whose roots form a natural amphitheater.

The clearing is inscribed within a larger rectangular assemblage. Outside the clearing radius, the ground is dark grass with dense tree placement (impassable). Inside, the ground transitions to bright grass with optional light-grass patches. A configurable ring of resonance stones can be placed within the clearing for Hearthstone Circle locations.

## Layers

### ground
Computed per-tile based on distance from center:
- **dist <= radius**: `terrain:ground.grass` (bright clearing floor)
- **dist > radius**: `terrain:ground.dark-grass` (forest floor)

In the gap region (the cleared area), tiles are walkable. The dense forest ring (radius to radius+2) serves as a visual transition zone with dark grass and sparse trees.

## Collision
- **Inside clearing (dist <= radius)**: 0 (passable)
- **Transition ring (radius < dist <= radius+2)**: 0 (passable, sparse trees)
- **Dense forest (dist > radius+2)**: 1 (impassable tree wall)

## Visuals
Trees arranged in a ring around the clearing perimeter:
- 12 trees at 30-degree intervals around the clearing at `radius + 2` distance
- Mix of `tree.emerald-5`, `tree.emerald-3`, `tree.emerald-4`, `tree.dark-1`
- Optional center object (campfire visual, pedestal, ancient stump)

## Objects
- **Resonance stones**: positioned in a smaller circle at `radius * 0.6`, each a trigger with `eventType: action`, `fragments`, and description
- **Chest**: positioned near the clearing edge at `(cx + radius * 0.7, cy)`
- **Center trigger**: optional event at the clearing's heart

## Anchors
- **north**: (center_x, 0) -- path connection from north
- **south**: (center_x, height-1) -- path connection from south
- **east**: (width-1, center_y) -- path connection from east
- **west**: (0, center_y) -- path connection from west

## Notes

- In Ambergrove (Act 1, Scene 6), the Ancient Grove clearing is a 14-tile-diameter clearing with resonance stones and a central pedestal.
- Forest clearings also appear in Heartfield as the Hearthstone Circles where memory fragments are gathered.
- The tree ring uses emerald trees for Everwick/Heartfield clearings and dark trees for Ambergrove's deeper groves.
- The existing TypeScript factory in `gen/assemblage/assemblages/terrain/forest-clearing.ts` computes the circular shape algorithmically.
