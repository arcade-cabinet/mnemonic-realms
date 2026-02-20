---
id: bridge
size: [8, 4]
palette: village-premium
parameterized: true
params:
  span: 4-12
  width: 3-5
  direction: [east-west, north-south]
  deckTerrain: terrain:ground.stone | terrain:road.brick
  keystoneStone: { id, fragments, description } | null
  guard: { name, sprite, dialogue } | null
---
# Bridge

A stone or wooden bridge spanning a river, gorge, or canal. Bridges are critical infrastructure in the Settled Lands -- they connect divided neighborhoods, carry trade across waterways, and serve as natural choke-points for story events and NPC encounters.

The bridge deck is walkable down the center with impassable railings on the long edges. The deck terrain defaults to `terrain:ground.stone` (dressed stone slabs) but can be set to `terrain:road.brick` for more formal crossings.

## Layers

### road
The entire bridge footprint is filled with the deck terrain. The road layer renders above the water layer, creating the visual of a bridge surface over the river below.

For an east-west bridge (span=8, width=4):

| | | | | | | | |
|---|---|---|---|---|---|---|---|
| stone | stone | stone | stone | stone | stone | stone | stone |
| stone | stone | stone | stone | stone | stone | stone | stone |
| stone | stone | stone | stone | stone | stone | stone | stone |
| stone | stone | stone | stone | stone | stone | stone | stone |

Where `stone` = `terrain:ground.stone` or the configured deck terrain.

## Collision
For an east-west bridge:
- Row 0 (north railing): all 1
- Rows 1 to height-2 (walkable deck): all 0
- Row height-1 (south railing): all 1

For a north-south bridge:
- Column 0 (west railing): all 1
- Columns 1 to width-2 (walkable deck): all 0
- Column width-1 (east railing): all 1

## Visuals
- Optional bridge visual object from `Atlas_Buildings_Bridges` (ornamental arch, stone parapets)
- Optional lamppost props (`prop.lamppost-1`) at bridge entry points

## Objects
- **Keystone resonance stone**: trigger at the bridge midpoint, properties: `eventType: action`, `fragments`, `description`
- **Guard NPC**: positioned at one end of the bridge, blocking passage until a quest condition is met

## Anchors
For east-west:
- **west**: (0, center_y) -- connects to west-bank road
- **east**: (span-1, center_y) -- connects to east-bank road

For north-south:
- **north**: (center_x, 0) -- connects to north-bank road
- **south**: (center_x, height-1) -- connects to south-bank road

## Notes

- In Millbrook (Act 1, Scene 7), the Brightwater Bridge is a 6-wide stone bridge with RS-MB-01 embedded in its keystone and an NPC guard who delivers exposition about the bridge's age.
- The reference Village Bridge TMX (60x36 tiles) is the canonical example: it shows a large stone bridge with auto-tiled road deck over a river of deep/shallow water tiles.
- Bridge assemblages overlay river assemblages. Place the bridge so its deck aligns with the river's `bridgeGap` parameter.
- The existing TypeScript factory in `gen/assemblage/assemblages/buildings/bridge.ts` implements the railing collision pattern.
